export type Token = "ETH" | "SKY" | "VIRT" | "CASH";

export const tokens: Record<Token, { label: string; usd: number; color: string }> = {
  ETH: { label: "Ether", usd: 3200, color: "#9fb8ff" },
  SKY: { label: "Sky (Aeroport)", usd: 0.8, color: "#ff7a45" },
  VIRT: { label: "Virt (Virtua)", usd: 1.6, color: "#b65cff" },
  CASH: { label: "Cash (stable)", usd: 1, color: "#3dffb0" },
};

export const hooks = [
  { id: "dynamic", label: "Dynamic Fee", blurb: "Fee drops to 0.05% when the market is calm.", fee: 0.0005 },
  { id: "limit", label: "Limit Order", blurb: "Waits for a 0.5% better price, then fills.", fee: -0.005 },
  { id: "rebate", label: "LP Rebate", blurb: "Half the fee is rebated to you as SKY.", fee: 0.0015 },
] as const;

export const LIQUIDATION_LTV = 0.86;

export interface TxReceipt {
  hash: string;
  summary: string;
  at: number;
}

export interface SwapQuote {
  amountOut: number;
  priceImpact: number;
}

/**
 * Everything the game asks of "the chain". The mock below settles instantly-ish
 * against local state; a real adapter (wagmi/viem on Base) can implement the
 * same surface and the rest of the game will not notice.
 */
export interface ChainAdapter {
  readonly network: string;
  quote(from: Token, to: Token, amountIn: number): SwapQuote;
  swap(from: Token, to: Token, amountIn: number): Promise<TxReceipt & { amountOut: number }>;
  addLiquidity(eth: number, sky: number): Promise<TxReceipt & { lp: number }>;
  vote(gauge: string, veAmount: number): Promise<TxReceipt>;
  launchAgent(name: string, persona: string): Promise<TxReceipt & { ticker: string }>;
  launchToken(name: string): Promise<TxReceipt & { ticker: string; supply: number }>;
  swapWithHook(hook: string, from: Token, to: Token, amountIn: number): Promise<TxReceipt & { amountOut: number }>;
  supply(vault: string, eth: number): Promise<TxReceipt>;
  borrow(vault: string, cash: number): Promise<TxReceipt>;
  repay(vault: string, cash: number): Promise<TxReceipt>;
  flashLoan(amountEth: number, route: string[]): Promise<TxReceipt & { profit: number }>;
}

const FEE = 0.003;

function fakeHash() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return "0x" + Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function settle<T>(value: T, ms = 650): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const mockChain: ChainAdapter = {
  network: "Base World Simnet",
  quote(from, to, amountIn) {
    const amountOut = (amountIn * tokens[from].usd * (1 - FEE)) / tokens[to].usd;
    return { amountOut, priceImpact: Math.min(0.05, (amountIn * tokens[from].usd) / 2_000_000) };
  },
  swap(from, to, amountIn) {
    const { amountOut } = this.quote(from, to, amountIn);
    return settle({ hash: fakeHash(), at: Date.now(), amountOut, summary: `Swapped ${fmt(amountIn)} ${from} → ${fmt(amountOut)} ${to}` });
  },
  addLiquidity(eth, sky) {
    const lp = Math.sqrt(eth * sky);
    return settle({ hash: fakeHash(), at: Date.now(), lp, summary: `Added ${fmt(eth)} ETH + ${fmt(sky)} SKY → ${fmt(lp)} LP` });
  },
  vote(gauge, veAmount) {
    return settle({ hash: fakeHash(), at: Date.now(), summary: `Voted ${fmt(veAmount)} veSKY for ${gauge}` });
  },
  launchAgent(name, persona) {
    const ticker = name.replace(/[^a-z]/gi, "").slice(0, 5).toUpperCase() || "AGENT";
    return settle({ hash: fakeHash(), at: Date.now(), ticker, summary: `Launched agent ${name} ($${ticker}, ${persona})` }, 900);
  },
  launchToken(name) {
    const ticker = name.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase() || "TOKEN";
    const supply = 1_000_000_000;
    return settle({ hash: fakeHash(), at: Date.now(), ticker, supply, summary: `Deployed $${ticker} (${fmt(supply)} supply)` }, 900);
  },
  swapWithHook(hook, from, to, amountIn) {
    const fee = hooks.find((h) => h.id === hook)?.fee ?? FEE;
    const amountOut = (amountIn * tokens[from].usd * (1 - fee)) / tokens[to].usd;
    return settle({ hash: fakeHash(), at: Date.now(), amountOut, summary: `${hook} hook: ${fmt(amountIn)} ${from} → ${fmt(amountOut)} ${to}` });
  },
  supply(vault, eth) {
    return settle({ hash: fakeHash(), at: Date.now(), summary: `Supplied ${fmt(eth)} ETH to ${vault}` });
  },
  borrow(vault, cash) {
    return settle({ hash: fakeHash(), at: Date.now(), summary: `Borrowed ${fmt(cash)} CASH from ${vault}` });
  },
  repay(vault, cash) {
    return settle({ hash: fakeHash(), at: Date.now(), summary: `Repaid ${fmt(cash)} CASH to ${vault}` });
  },
  flashLoan(amountEth, route) {
    const profit = amountEth * 0.0009;
    return settle({ hash: fakeHash(), at: Date.now(), profit, summary: `Flash loan ${fmt(amountEth)} ETH via ${route.join(" → ")} · profit ${fmt(profit)} ETH` }, 300);
  },
};

export function fmt(n: number) {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (Math.abs(n) >= 1) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return n.toLocaleString("en-US", { maximumSignificantDigits: 3 });
}
