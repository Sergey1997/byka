import type { Token } from "./chain";
import type { DistrictId, Vec3 } from "./config";
import { jumpPads, npcs, stations } from "./config";

export type QuestEvent =
  | { type: "talk"; npc: string; tags?: string[] }
  | { type: "reach"; zone: DistrictId }
  | { type: "collect"; id: string }
  | { type: "action"; action: string }
  | { type: "race" };

export type Waypoint = Vec3 | "orbs" | "race";

export interface Objective {
  id: string;
  label: string;
  event: QuestEvent["type"];
  match?: string;
  count?: number;
  at?: Waypoint;
}

export interface QuestDef {
  id: string;
  title: string;
  kind: "Collect" | "Explore" | "Time Trial" | "Protocol" | "Social" | "Stunt";
  giver: string;
  summary: string;
  offer: string;
  hint: string;
  done: string;
  requires: string[];
  auto?: boolean;
  grant?: Partial<Record<Token, number>>;
  objectives: Objective[];
  reward: { xp: number; tokens?: Partial<Record<Token, number>>; badge?: string };
}

const at = (id: string): Vec3 => {
  const n = npcs.find((x) => x.id === id) ?? stations.find((x) => x.id === id);
  if (!n) throw new Error(`Unknown waypoint ${id}`);
  return n.position;
};

export const quests: QuestDef[] = [
  {
    id: "gm",
    title: "gm, Builder",
    kind: "Collect",
    giver: "jess",
    summary: "Collect the six Base orbs scattered around the plaza.",
    offer: "gm, new builder! This plaza runs on tiny sparks of energy we call Base orbs. Six of them drifted off overnight. Mind gathering them up? Hold Shift to boost — you'll be fast.",
    hint: "The orbs glow blue. One floats a little higher than the rest, so jump with Space.",
    done: "Look at that, the beacon is humming again. You're a natural. Here's some ETH for the road.",
    requires: [],
    objectives: [{ id: "orbs", label: "Collect Base orbs", event: "collect", match: "orb", count: 6, at: "orbs" }],
    reward: { xp: 150, tokens: { ETH: 0.25 } },
  },
  {
    id: "speed",
    title: "Speed of Base",
    kind: "Stunt",
    giver: "jess",
    summary: "Break 150 km/h. Boost with Shift, then dash with Q.",
    offer: "Here's a secret: boosting is fast, but dashing while boosting is faster. Hit 150 km/h and I'll be impressed.",
    hint: "Hold Shift to boost, then tap Q to dash forward.",
    done: "Blink and you'd miss it. Fast blocks, fast builders.",
    requires: ["gm"],
    objectives: [{ id: "mach", label: "Reach 150 km/h", event: "action", match: "mach" }],
    reward: { xp: 120 },
  },
  {
    id: "summit",
    title: "Meet the Captain",
    kind: "Explore",
    giver: "jess",
    summary: "Ride the jump pad up to the Summit Beacon and find Captain Bryan.",
    offer: "Captain Bryan watches over the city from the Summit Beacon, due north. The road takes you there — the jump pad at the end takes you up. He's got bigger plans for you.",
    hint: "Follow the north road. Step onto the glowing jump pad to reach the summit.",
    done: "Bryan's expecting you.",
    requires: ["gm"],
    objectives: [
      { id: "reach", label: "Reach the Summit Beacon", event: "reach", match: "summit", at: jumpPads[0].position },
      { id: "talk", label: "Talk to Captain Bryan", event: "talk", match: "bryan", at: at("bryan") },
    ],
    reward: { xp: 200 },
  },
  {
    id: "race",
    title: "Runway Rush",
    kind: "Time Trial",
    giver: "bryan",
    summary: "Fly through all 8 Aeroport rings in under 26 seconds.",
    offer: "The Aeroport runway has a ring course nobody's cleared this week. Eight rings, twenty-six seconds. Boost, dash, jump — whatever it takes.",
    hint: "The first ring starts the clock. Chain boost and dash, and jump for the high rings.",
    done: "Under the limit! The tower will be talking about that one for a while.",
    requires: ["summit"],
    objectives: [{ id: "run", label: "Finish the ring course in time", event: "race", at: "race" }],
    reward: { xp: 300, tokens: { VIRT: 150 } },
  },
  {
    id: "aero",
    title: "Clear for Takeoff",
    kind: "Protocol",
    giver: "al",
    summary: "Swap, provide liquidity and vote at the Aeroport.",
    offer: "Welcome to the Aeroport! Our engines run on liquidity. Swap some ETH for SKY at the terminal, drop a pair into the pool, then lock what's left and vote for a gauge. That's the flywheel.",
    hint: "Swap Terminal → Liquidity Pool → Gauge Voting Booth. They're all on the apron.",
    done: "Flywheel spinning! Emissions flow where the votes go — and you just steered them.",
    requires: ["summit"],
    objectives: [
      { id: "swap", label: "Swap ETH for SKY", event: "action", match: "swap", at: at("station-swap") },
      { id: "pool", label: "Add ETH/SKY liquidity", event: "action", match: "liquidity", at: at("station-pool") },
      { id: "vote", label: "Lock & vote for a gauge", event: "action", match: "vote", at: at("station-vote") },
    ],
    reward: { xp: 350, tokens: { SKY: 500 } },
  },
  {
    id: "agents",
    title: "Agents Awaken",
    kind: "Social",
    giver: "vee",
    summary: "Chat with two AI agents, then launch one of your own.",
    offer: "Virtua is where agents are born. Chat with a couple of the locals to see what they're like, then head to the launchpad and bring your own agent to life. Here's some VIRT to cover the launch.",
    hint: "Agents float around the district. The launchpad is the big glowing ring.",
    done: "Your agent's already making friends. Welcome to Virtua.",
    requires: ["summit"],
    grant: { VIRT: 200 },
    objectives: [
      { id: "chat", label: "Chat with AI agents", event: "talk", match: "agent", count: 2, at: at("agent-nova") },
      { id: "launch", label: "Launch your own agent", event: "action", match: "launch", at: at("station-launch") },
    ],
    reward: { xp: 350 },
  },
  {
    id: "bank",
    title: "Just Ask BANKO",
    kind: "Protocol",
    giver: "banko",
    summary: "Trade, check your bags and launch a token — all by chatting with BANKO.",
    offer: "Wallets with buttons are so last cycle. Just tell me what you want. Buy something, peek at your portfolio, then launch a token of your own. I'll handle the rest.",
    hint: "Talk to BANKO and type commands like \"buy 0.05 ETH of SKY\", \"portfolio\" or \"launch a token called BASED\".",
    done: "See? Your wallet just became a conversation. Keep the change.",
    requires: ["gm"],
    objectives: [
      { id: "trade", label: "Buy or swap by chat", event: "action", match: "chat-trade", at: at("banko") },
      { id: "bags", label: "Ask for your portfolio", event: "action", match: "chat-portfolio", at: at("banko") },
      { id: "launch", label: "Launch a token by chat", event: "action", match: "chat-launch", at: at("banko") },
    ],
    reward: { xp: 300, tokens: { ETH: 0.1 } },
  },
  {
    id: "lend",
    title: "Curate Your Yield",
    kind: "Protocol",
    giver: "mira",
    summary: "Supply ETH to a curated vault, borrow CASH against it, then repay.",
    offer: "The Vault Quarter holds more value than the rest of the city combined. Supply some ETH to my vault, borrow a little CASH against it, then pay it back. Keep your health factor above 1 — the liquidation sirens are loud.",
    hint: "Use the Curated Vault terminal: Supply → Borrow → Repay.",
    done: "Textbook. Collateral safe, debt cleared, yield accruing. You'd make a fine curator.",
    requires: ["gm"],
    objectives: [
      { id: "supply", label: "Supply ETH to the vault", event: "action", match: "supply", at: at("station-lend") },
      { id: "borrow", label: "Borrow CASH", event: "action", match: "borrow", at: at("station-lend") },
      { id: "repay", label: "Repay your loan", event: "action", match: "repay", at: at("station-lend") },
    ],
    reward: { xp: 350, tokens: { CASH: 250 } },
  },
  {
    id: "hooks",
    title: "Hooked",
    kind: "Protocol",
    giver: "hana",
    summary: "Swap through two different hooks at the Hook Bazaar.",
    offer: "Plain swaps are fine. Swaps with hooks are better. Try two different stalls — a dynamic fee, a limit order, a rebate, whatever catches your eye.",
    hint: "Open the Hook Stall and swap with two different hooks.",
    done: "Now you know: a hook can turn a swap into almost anything.",
    requires: ["gm"],
    objectives: [{ id: "two", label: "Swap with different hooks", event: "action", match: "hook", count: 2, at: at("station-hooks") }],
    reward: { xp: 250, tokens: { SKY: 300 } },
  },
  {
    id: "flash",
    title: "The One-Block Heist",
    kind: "Time Trial",
    giver: "gus",
    summary: "Borrow 1,000 ETH, run the arbitrage route and repay — all inside one block.",
    offer: "Here's the trick: borrow a thousand ETH, swap it round the route, and pay it back before the block closes. Miss the window and the whole thing never happened. Fancy it?",
    hint: "At the Flash Loan Counter, hit the route steps in order before the timer runs out.",
    done: "Borrowed, used, returned — and a little extra for you. Nobody saw a thing. Boo.",
    requires: ["gm"],
    objectives: [{ id: "heist", label: "Complete a flash loan", event: "action", match: "flash", at: at("station-flash") }],
    reward: { xp: 300, tokens: { ETH: 0.05 } },
  },
  {
    id: "based",
    title: "Stay Based",
    kind: "Explore",
    giver: "jess",
    summary: "Return to Jess at Base Plaza.",
    offer: "",
    hint: "Jess is waiting at the plaza beacon.",
    done: "Summit, Aeroport, Vault Quarter, Virtua, the Banker's Terminal — you've seen what this world can do. You're officially a Based Builder. Now go build something.",
    requires: ["race", "aero", "lend", "agents", "bank"],
    auto: true,
    objectives: [{ id: "talk", label: "Talk to Jess", event: "talk", match: "jess", at: at("jess") }],
    reward: { xp: 500, tokens: { ETH: 0.5 }, badge: "Based Builder" },
  },
];

export const questById = Object.fromEntries(quests.map((q) => [q.id, q])) as Record<string, QuestDef>;

export function matches(o: Objective, e: QuestEvent): string | null {
  if (o.event !== e.type) return null;
  switch (e.type) {
    case "talk":
      return o.match === e.npc || (o.match && e.tags?.includes(o.match)) ? e.npc : null;
    case "reach":
      return o.match === e.zone ? e.zone : null;
    case "collect":
      return o.match && e.id.startsWith(o.match) ? e.id : null;
    case "action":
      return o.match === e.action || e.action.startsWith(`${o.match}:`) ? e.action : null;
    case "race":
      return "win";
  }
}

export const xpForLevel = (level: number) => 125 * level * (level + 1);

export function levelFor(xp: number) {
  let level = 1;
  while (xp >= xpForLevel(level)) level++;
  const floor = level === 1 ? 0 : xpForLevel(level - 1);
  return { level, progress: (xp - floor) / (xpForLevel(level) - floor), next: xpForLevel(level) };
}
