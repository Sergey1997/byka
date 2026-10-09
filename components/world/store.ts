import { Vector3 } from "three";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { agentReply, parseBankerIntent, personas } from "./agents";
import { fmt, LIQUIDATION_LTV, mockChain, type Token, tokens, type TxReceipt } from "./chain";
import { type DistrictId, districtById, npcs, orbs, type PanelId, RACE, SPAWN, stations, type Vec3 } from "./config";
import { levelFor, matches, type QuestEvent, questById, quests } from "./quests";

/** Per-frame values written by the scene and read by the HUD without re-rendering. */
export const live = {
  pos: new Vector3(...SPAWN),
  speed: 0,
  heading: 0,
  camYaw: 0,
  boosting: false,
  dashCharge: 1,
};

export const chain = mockChain;

type QuestStatus = "locked" | "available" | "active" | "done";
interface QuestState {
  status: QuestStatus;
  progress: Record<string, string[]>;
}

export interface Toast {
  id: number;
  title: string;
  body?: string;
  tone: "quest" | "reward" | "info" | "level" | "fail";
}

export interface LaunchedAgent {
  name: string;
  ticker: string;
  persona: string;
  color: string;
}

export interface ChatMessage {
  from: "me" | "agent";
  text: string;
}

interface Persisted {
  xp: number;
  wallet: Record<Token, number>;
  lp: number;
  veSky: number;
  votes: Record<string, number>;
  quests: Record<string, QuestState>;
  tracked: string | null;
  badges: string[];
  agents: LaunchedAgent[];
  deployed: { name: string; ticker: string }[];
  vault: { collateral: number; debt: number };
  txs: TxReceipt[];
  bestRace: number | null;
}

interface GameState extends Persisted {
  started: boolean;
  nearby: string | null;
  dialog: string | null;
  panel: PanelId | null;
  logOpen: boolean;
  district: DistrictId | null;
  toasts: Toast[];
  race: { running: boolean; next: number; start: number };
  pending: boolean;
  chats: Record<string, ChatMessage[]>;

  start(): void;
  emit(e: QuestEvent): void;
  accept(id: string): void;
  track(id: string): void;
  toast(t: Omit<Toast, "id">): void;
  dismiss(id: number): void;
  interact(): void;
  close(): void;
  toggleLog(): void;
  setNearby(id: string | null): void;
  setDistrict(id: DistrictId | null): void;
  passRing(index: number): void;
  failRace(reason: string): void;
  swap(from: Token, to: Token, amount: number): Promise<void>;
  addLiquidity(eth: number): Promise<void>;
  vote(gauge: string, amount: number): Promise<void>;
  launchAgent(name: string, persona: string): Promise<void>;
  hookSwap(hook: string, from: Token, to: Token, amount: number): Promise<void>;
  supply(eth: number): Promise<void>;
  borrow(cash: number): Promise<void>;
  repay(cash: number): Promise<void>;
  flashLoan(route: string[]): Promise<void>;
  chat(agentId: string, text: string): void;
  reset(): void;
}

export const LAUNCH_COST = 100;

function initialQuests(): Record<string, QuestState> {
  return Object.fromEntries(
    quests.map((q) => [q.id, { status: q.requires.length ? "locked" : "available", progress: {} } as QuestState]),
  );
}

const initial: Persisted = {
  xp: 0,
  wallet: { ETH: 0.5, SKY: 0, VIRT: 0, CASH: 0 },
  lp: 0,
  veSky: 0,
  votes: {},
  quests: initialQuests(),
  tracked: null,
  badges: [],
  agents: [],
  deployed: [],
  vault: { collateral: 0, debt: 0 },
  txs: [],
  bestRace: null,
};

export const VAULT_NAME = "Curated ETH Vault";

export function healthFactor(v: { collateral: number; debt: number }, extraDebt = 0) {
  const debt = v.debt + extraDebt;
  return debt <= 0 ? Infinity : (v.collateral * tokens.ETH.usd * LIQUIDATION_LTV) / debt;
}

let toastId = 0;

export const useGame = create<GameState>()(
  persist(
    (set, get) => {
      const award = (xp: number, tokens: Partial<Record<Token, number>> = {}) => {
        const before = levelFor(get().xp).level;
        const wallet = { ...get().wallet };
        for (const [k, v] of Object.entries(tokens)) wallet[k as Token] += v ?? 0;
        set({ xp: get().xp + xp, wallet });
        const after = levelFor(get().xp).level;
        if (after > before) get().toast({ tone: "level", title: `Level ${after}`, body: "You're getting more based by the minute." });
      };

      const unlock = () => {
        const qs = { ...get().quests };
        for (const q of quests) {
          if (qs[q.id].status !== "locked" || !q.requires.every((r) => qs[r].status === "done")) continue;
          qs[q.id] = { ...qs[q.id], status: q.auto ? "active" : "available" };
          const giver = npcs.find((n) => n.id === q.giver)?.name;
          get().toast(
            q.auto
              ? { tone: "quest", title: `New quest: ${q.title}`, body: q.summary }
              : { tone: "info", title: `${giver} has a quest`, body: q.title },
          );
          if (q.auto && !get().tracked) set({ tracked: q.id });
        }
        set({ quests: qs });
      };

      const complete = (id: string) => {
        const q = questById[id];
        set({ quests: { ...get().quests, [id]: { ...get().quests[id], status: "done" } } });
        get().toast({ tone: "reward", title: `Quest complete: ${q.title}`, body: rewardText(q.reward) });
        award(q.reward.xp, q.reward.tokens);
        if (q.reward.badge) set({ badges: [...get().badges, q.reward.badge] });
        if (get().tracked === id) {
          const next = quests.find((x) => get().quests[x.id].status === "active");
          set({ tracked: next?.id ?? null });
        }
        unlock();
      };

      const transact = async <T extends TxReceipt>(send: () => Promise<T>, title: string) => {
        set({ pending: true });
        const r = await send();
        set({ pending: false, txs: [r, ...get().txs].slice(0, 20) });
        get().toast({ tone: "info", title, body: r.summary });
        return r;
      };

      const bankerTurn = async (text: string): Promise<string> => {
        const intent = parseBankerIntent(text);
        const { wallet } = get();
        if (intent.kind === "portfolio") {
          get().emit({ type: "action", action: "chat-portfolio" });
          const usd = (Object.keys(wallet) as Token[]).reduce((sum, k) => sum + wallet[k] * tokens[k].usd, 0);
          const deployed = get().deployed.map((d) => `$${d.ticker}`).join(", ");
          return `You hold ${fmt(wallet.ETH)} ETH, ${fmt(wallet.SKY)} SKY and ${fmt(wallet.VIRT)} VIRT — about $${fmt(usd)}.${get().lp ? ` Plus ${fmt(get().lp)} LP.` : ""}${deployed ? ` Tokens you deployed: ${deployed}.` : ""}`;
        }
        if (intent.kind === "launch") {
          if (get().pending) return "One sec, still settling your last transaction.";
          set({ pending: true });
          const r = await chain.launchToken(intent.name);
          set({ pending: false, deployed: [...get().deployed, { name: intent.name, ticker: r.ticker }], txs: [r, ...get().txs].slice(0, 20) });
          get().toast({ tone: "reward", title: `$${r.ticker} deployed`, body: "Fair launch, simulated liquidity, zero gas." });
          get().emit({ type: "action", action: "chat-launch" });
          return `Done! $${r.ticker} is live with ${fmt(r.supply)} supply and you hold the creator allocation. tx ${short(r.hash)}`;
        }
        if (intent.kind === "swap") {
          if (intent.from === intent.to) return "That's the same token twice — I'll call that a very efficient no-op.";
          const amountIn = intent.exactOut
            ? (intent.amount * tokens[intent.to].usd) / tokens[intent.from].usd / 0.997
            : intent.amount;
          if (!(amountIn > 0)) return "I need an amount bigger than zero for that.";
          if (amountIn > wallet[intent.from])
            return `Not enough ${intent.from}: that needs ${fmt(amountIn)} and you have ${fmt(wallet[intent.from])}. Try a smaller size?`;
          const before = get().txs[0];
          await get().swap(intent.from, intent.to, amountIn);
          const tx = get().txs[0];
          if (tx === before) return "Couldn't route that one — try again in a moment.";
          get().emit({ type: "action", action: "chat-trade" });
          return `Filled. ${tx.summary}. tx ${short(tx.hash)}`;
        }
        return "I can buy, swap, launch tokens and check your portfolio. Try: \"buy 0.05 ETH of SKY\" or \"launch a token called BASED\".";
      };

      return {
        ...initial,
        started: false,
        nearby: null,
        dialog: null,
        panel: null,
        logOpen: false,
        district: null,
        toasts: [],
        race: { running: false, next: 0, start: 0 },
        pending: false,
        chats: {},

        start: () => set({ started: true }),

        emit: (e) => {
          for (const q of quests) {
            const qs = get().quests[q.id];
            if (qs.status !== "active") continue;
            let changed = false;
            const progress = { ...qs.progress };
            for (const o of q.objectives) {
              const key = matches(o, e);
              const got = progress[o.id] ?? [];
              if (!key || got.includes(key) || got.length >= (o.count ?? 1)) continue;
              progress[o.id] = [...got, key];
              changed = true;
            }
            if (!changed) continue;
            set({ quests: { ...get().quests, [q.id]: { ...qs, progress } } });
            if (q.objectives.every((o) => (progress[o.id]?.length ?? 0) >= (o.count ?? 1))) complete(q.id);
          }
        },

        accept: (id) => {
          const q = questById[id];
          set({ quests: { ...get().quests, [id]: { ...get().quests[id], status: "active" } }, tracked: id });
          get().toast({ tone: "quest", title: `Quest accepted: ${q.title}`, body: q.summary });
          if (q.grant) {
            award(0, q.grant);
            get().toast({ tone: "reward", title: "Airdrop received", body: rewardText({ xp: 0, tokens: q.grant }) });
          }
          if (id === "summit" && get().district === "summit") get().emit({ type: "reach", zone: "summit" });
        },

        track: (id) => set({ tracked: id }),

        toast: (t) => {
          const id = ++toastId;
          set({ toasts: [...get().toasts.slice(-3), { ...t, id }] });
          setTimeout(() => get().dismiss(id), 4800);
        },
        dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),

        interact: () => {
          const id = get().nearby;
          if (!id || get().dialog || get().panel) return;
          const station = stations.find((s) => s.id === id);
          if (station) return set({ panel: station.panel });
          const npc = npcs.find((n) => n.id === id);
          if (!npc) return;
          set({ dialog: id });
          get().emit({ type: "talk", npc: id, tags: npc.tags });
        },
        close: () => set({ dialog: null, panel: null, logOpen: false }),
        toggleLog: () => set({ logOpen: !get().logOpen, dialog: null, panel: null }),
        setNearby: (id) => get().nearby !== id && set({ nearby: id }),
        setDistrict: (id) => {
          if (get().district === id) return;
          set({ district: id });
          if (id) {
            get().toast({ tone: "info", title: `Entering ${districtName(id)}` });
            get().emit({ type: "reach", zone: id });
          }
        },

        passRing: (index) => {
          const { race, quests: qs } = get();
          if (qs.race.status === "locked" || qs.race.status === "available" || index !== race.next) return;
          const now = performance.now();
          if (index === 0) {
            set({ race: { running: true, next: 1, start: now } });
            return get().toast({ tone: "info", title: "GO!", body: `${RACE.rings.length} rings · ${RACE.limit}s` });
          }
          if (index < RACE.rings.length - 1) return set({ race: { ...race, next: index + 1 } });
          const time = (now - race.start) / 1000;
          set({ race: { running: false, next: 0, start: 0 } });
          if (time > RACE.limit) return get().failRace(`${time.toFixed(2)}s — limit is ${RACE.limit}s`);
          const best = get().bestRace;
          set({ bestRace: best === null ? time : Math.min(best, time) });
          get().toast({ tone: "reward", title: `Course cleared: ${time.toFixed(2)}s`, body: best !== null && time < best ? "New personal best!" : undefined });
          get().emit({ type: "race" });
        },
        failRace: (reason) => {
          set({ race: { running: false, next: 0, start: 0 } });
          get().toast({ tone: "fail", title: "Too slow!", body: `${reason}. Fly back through ring 1 to retry.` });
        },

        swap: async (from, to, amount) => {
          if (get().pending || amount <= 0 || amount > get().wallet[from]) return;
          set({ pending: true });
          const r = await chain.swap(from, to, amount);
          const wallet = { ...get().wallet, [from]: get().wallet[from] - amount };
          wallet[to] += r.amountOut;
          set({ wallet, pending: false, txs: [r, ...get().txs].slice(0, 20) });
          get().toast({ tone: "info", title: "Swap confirmed", body: r.summary });
          get().emit({ type: "action", action: "swap" });
        },
        addLiquidity: async (eth) => {
          const { wallet, pending } = get();
          const sky = chain.quote("ETH", "SKY", eth).amountOut / 0.997;
          if (pending || eth <= 0 || eth > wallet.ETH || sky > wallet.SKY) return;
          set({ pending: true });
          const r = await chain.addLiquidity(eth, sky);
          set({
            wallet: { ...get().wallet, ETH: get().wallet.ETH - eth, SKY: get().wallet.SKY - sky },
            lp: get().lp + r.lp,
            pending: false,
            txs: [r, ...get().txs].slice(0, 20),
          });
          get().toast({ tone: "info", title: "Liquidity added", body: r.summary });
          get().emit({ type: "action", action: "liquidity" });
        },
        vote: async (gauge, amount) => {
          if (get().pending || amount <= 0 || amount > get().wallet.SKY) return;
          set({ pending: true });
          const r = await chain.vote(gauge, amount);
          set({
            wallet: { ...get().wallet, SKY: get().wallet.SKY - amount },
            veSky: get().veSky + amount,
            votes: { ...get().votes, [gauge]: (get().votes[gauge] ?? 0) + amount },
            pending: false,
            txs: [r, ...get().txs].slice(0, 20),
          });
          get().toast({ tone: "info", title: "Vote cast", body: r.summary });
          get().emit({ type: "action", action: "vote" });
        },
        launchAgent: async (name, persona) => {
          if (get().pending || get().wallet.VIRT < LAUNCH_COST || !name.trim()) return;
          set({ pending: true });
          const r = await chain.launchAgent(name.trim(), persona);
          const color = personas.find((p) => p.id === persona)?.color ?? "#ffffff";
          set({
            wallet: { ...get().wallet, VIRT: get().wallet.VIRT - LAUNCH_COST },
            agents: [...get().agents, { name: name.trim(), ticker: r.ticker, persona, color }],
            pending: false,
            txs: [r, ...get().txs].slice(0, 20),
          });
          get().toast({ tone: "reward", title: `${name.trim()} is alive!`, body: `$${r.ticker} is live on the launchpad.` });
          award(60);
          get().emit({ type: "action", action: "launch" });
        },

        hookSwap: async (hook, from, to, amount) => {
          if (get().pending || amount <= 0 || amount > get().wallet[from] || from === to) return;
          const r = await transact(() => chain.swapWithHook(hook, from, to, amount), "Hooked swap filled");
          const wallet = { ...get().wallet, [from]: get().wallet[from] - amount };
          wallet[to] += r.amountOut;
          if (hook === "rebate") wallet.SKY += (amount * tokens[from].usd * 0.0015) / 2 / tokens.SKY.usd;
          set({ wallet });
          get().emit({ type: "action", action: `hook:${hook}` });
        },
        supply: async (eth) => {
          if (get().pending || eth <= 0 || eth > get().wallet.ETH) return;
          await transact(() => chain.supply(VAULT_NAME, eth), "Supplied to vault");
          set({ wallet: { ...get().wallet, ETH: get().wallet.ETH - eth }, vault: { ...get().vault, collateral: get().vault.collateral + eth } });
          get().emit({ type: "action", action: "supply" });
        },
        borrow: async (cash) => {
          if (get().pending || cash <= 0 || healthFactor(get().vault, cash) < 1.05) return;
          await transact(() => chain.borrow(VAULT_NAME, cash), "Loan opened");
          set({ wallet: { ...get().wallet, CASH: get().wallet.CASH + cash }, vault: { ...get().vault, debt: get().vault.debt + cash } });
          get().emit({ type: "action", action: "borrow" });
        },
        repay: async (cash) => {
          const amount = Math.min(cash, get().vault.debt, get().wallet.CASH);
          if (get().pending || amount <= 0) return;
          await transact(() => chain.repay(VAULT_NAME, amount), "Loan repaid");
          set({ wallet: { ...get().wallet, CASH: get().wallet.CASH - amount }, vault: { ...get().vault, debt: get().vault.debt - amount } });
          get().emit({ type: "action", action: "repay" });
        },
        flashLoan: async (route) => {
          if (get().pending) return;
          const r = await transact(() => chain.flashLoan(1000, route), "Flash loan settled");
          set({ wallet: { ...get().wallet, ETH: get().wallet.ETH + r.profit } });
          get().emit({ type: "action", action: "flash" });
        },

        chat: (agentId, text) => {
          const npc = npcs.find((n) => n.id === agentId);
          const push = (m: ChatMessage) => set({ chats: { ...get().chats, [agentId]: [...(get().chats[agentId] ?? []), m] } });
          push({ from: "me", text });
          if (npc?.persona === "banker") return void bankerTurn(text).then((reply) => push({ from: "agent", text: reply }));
          setTimeout(() => push({ from: "agent", text: agentReply(npc?.persona ?? "concierge", text) }), 550);
        },

        reset: () => {
          set({ ...initial, quests: initialQuests(), chats: {}, race: { running: false, next: 0, start: 0 }, logOpen: false });
          live.pos.set(...SPAWN);
        },
      };
    },
    {
      name: "base-world-save",
      version: 1,
      partialize: (s): Persisted => ({
        xp: s.xp,
        wallet: s.wallet,
        lp: s.lp,
        veSky: s.veSky,
        votes: s.votes,
        quests: s.quests,
        tracked: s.tracked,
        badges: s.badges,
        agents: s.agents,
        deployed: s.deployed,
        vault: s.vault,
        txs: s.txs,
        bestRace: s.bestRace,
      }),
    },
  ),
);

export const uiLocked = (s: GameState) => !s.started || !!s.dialog || !!s.panel || s.logOpen;

export function districtName(id: DistrictId) {
  return districtById[id]?.name ?? id;
}

const short = (hash: string) => `${hash.slice(0, 6)}…${hash.slice(-4)}`;

export function rewardText(r: { xp: number; tokens?: Partial<Record<Token, number>> }) {
  const parts = r.xp ? [`+${r.xp} XP`] : [];
  for (const [k, v] of Object.entries(r.tokens ?? {})) parts.push(`+${v} ${k}`);
  return parts.join(" · ");
}

/** Where the player should head next: tracked objective, else the closest quest giver with something to offer. */
export function waypoint(s: GameState, from: Vector3): { pos: Vec3; label: string } | null {
  const q = s.tracked ? questById[s.tracked] : null;
  if (q && s.quests[q.id].status === "active") {
    const o = q.objectives.find((x) => (s.quests[q.id].progress[x.id]?.length ?? 0) < (x.count ?? 1));
    if (o?.at === "orbs") {
      const got = s.quests[q.id].progress[o.id] ?? [];
      const left = orbs.map((p, i) => ({ p, id: `orb-${i}` })).filter((x) => !got.includes(x.id));
      left.sort((a, b) => dist2(a.p, from) - dist2(b.p, from));
      if (left[0]) return { pos: left[0].p, label: "Base orb" };
    } else if (o?.at === "race") {
      return { pos: RACE.rings[s.race.next], label: `Ring ${s.race.next + 1}` };
    } else if (o?.at) {
      return { pos: o.at, label: o.label };
    }
  }
  const givers = quests
    .filter((x) => s.quests[x.id].status === "available")
    .map((x) => npcs.find((n) => n.id === x.giver)!)
    .sort((a, b) => dist2(a.position, from) - dist2(b.position, from));
  return givers[0] ? { pos: givers[0].position, label: givers[0].name } : null;
}

function dist2(p: Vec3, v: Vector3) {
  return (p[0] - v.x) ** 2 + (p[2] - v.z) ** 2;
}
