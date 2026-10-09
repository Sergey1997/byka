export type Vec3 = [number, number, number];

export const palette = {
  base: "#0052ff",
  baseBright: "#3d7bff",
  cyan: "#5ee7ff",
  ice: "#dce8ff",
  night: "#050b24",
  ground: "#0a1638",
  gold: "#ffd166",
  aero: "#ff7a45",
  virtua: "#b65cff",
};

export const SPAWN: Vec3 = [0, 2, 28];
export const WORLD_HALF = 420;

export type DistrictId = string;

/**
 * Districts are pure data. Hand-built scenes exist for the plaza, summit, Aeroport and Virtua;
 * any district with a `look` is rendered by the generic <ProtocolDistrict />, so a new protocol
 * zone is one entry here plus its NPCs/stations below and its quests in quests.ts.
 */
export interface DistrictDef {
  id: DistrictId;
  name: string;
  center: [number, number];
  radius: number;
  color: string;
  minY?: number;
  /** Road from the plaza edge to the district edge. */
  road?: [number, number, number, number];
  look?: { accent: string; sign: string; tagline: string; towers: number; motif: "vault" | "pylon" | "dome" };
}

export const districts: DistrictDef[] = [
  { id: "plaza", name: "Base Plaza", center: [0, 0], radius: 50, color: palette.baseBright },
  { id: "aeroport", name: "Aeroport · Flagship Hub", center: [235, -45], radius: 125, color: palette.aero, road: [40, 0, 150, 0] },
  { id: "virtua", name: "Virtua District", center: [-215, 140], radius: 80, color: palette.virtua, road: [-35, 25, -175, 115] },
  { id: "summit", name: "Summit Beacon", center: [0, -235], radius: 30, color: palette.cyan, minY: 10, road: [0, -45, 0, -200] },
  {
    id: "vaults",
    name: "Vault Quarter",
    center: [-200, -145],
    radius: 60,
    color: "#7aa2ff",
    road: [-35, -25, -158, -105],
    look: { accent: "#9fc0ff", sign: "VAULT QUARTER", tagline: "Curated lending vaults", towers: 7, motif: "vault" },
  },
  {
    id: "terminal",
    name: "Banker's Terminal",
    center: [150, 200],
    radius: 55,
    color: "#3dffb0",
    road: [30, 35, 115, 160],
    look: { accent: "#3dffb0", sign: "BANKER'S TERMINAL", tagline: "Trade by talking", towers: 5, motif: "pylon" },
  },
  {
    id: "bazaar",
    name: "Hook Bazaar",
    center: [-10, 235],
    radius: 50,
    color: "#ff5fc8",
    road: [0, 50, -6, 185],
    look: { accent: "#ff8ad8", sign: "HOOK BAZAAR", tagline: "Swaps with custom rules", towers: 6, motif: "dome" },
  },
  {
    id: "ghost",
    name: "Ghost Bank",
    center: [195, -275],
    radius: 50,
    color: "#a78bfa",
    road: [40, -60, 160, -238],
    look: { accent: "#c4b5fd", sign: "GHOST BANK", tagline: "Borrow it. Use it. Return it. One block.", towers: 4, motif: "vault" },
  },
];

export const districtById = Object.fromEntries(districts.map((d) => [d.id, d])) as Record<DistrictId, DistrictDef>;

export const SUMMIT = { center: [0, -235] as [number, number], radius: 30, height: 14 };

export const roads: [number, number, number, number][] = [
  ...districts.flatMap((d) => (d.road ? [d.road] : [])),
  [150, 0, 150, -30],
];

export type NpcKind = "human" | "agent";

export interface NpcDef {
  id: string;
  name: string;
  title: string;
  kind: NpcKind;
  position: Vec3;
  color: string;
  accent: string;
  tags?: string[];
  greeting: string[];
  persona?: string;
}

export const npcs: NpcDef[] = [
  {
    id: "jess",
    name: "Jess",
    title: "Builder-in-Chief",
    kind: "human",
    position: [0, 0, 14],
    color: "#2f6bff",
    accent: "#ffffff",
    greeting: [
      "gm! Every block here was shipped by someone who just kept building.",
      "Stay based, builder. The world gets brighter every time you ship.",
    ],
  },
  {
    id: "bryan",
    name: "Captain Bryan",
    title: "Keeper of the Summit",
    kind: "human",
    position: [0, SUMMIT.height, -240],
    color: "#13234f",
    accent: "#5ee7ff",
    greeting: [
      "From up here you can see the whole economy humming. Beautiful, isn't it?",
      "Speed is a feature. Never let anyone tell you otherwise.",
    ],
  },
  {
    id: "al",
    name: "Aero Al",
    title: "Flight Controller, Aeroport",
    kind: "human",
    position: [215, 0, 4],
    color: "#ff7a45",
    accent: "#fff2e0",
    greeting: [
      "Tower to builder: skies are clear and liquidity is deep.",
      "Swap, pool, vote. That's how this airport keeps its engines running.",
    ],
  },
  {
    id: "vee",
    name: "Vee",
    title: "Agent Curator, Virtua",
    kind: "human",
    position: [-195, 0, 118],
    color: "#b65cff",
    accent: "#5ee7ff",
    greeting: [
      "Every agent here was launched by someone with an idea and a little courage.",
      "Talk to them. They're surprisingly opinionated.",
    ],
  },
  {
    id: "agent-nova",
    name: "NOVA-7",
    title: "Market-making agent",
    kind: "agent",
    position: [-228, 2.2, 128],
    color: "#5ee7ff",
    accent: "#b65cff",
    tags: ["agent"],
    persona: "trader",
    greeting: ["Spreads are tight, vibes are tighter. Ask me anything about markets."],
  },
  {
    id: "agent-muse",
    name: "MUSE",
    title: "Generative artist agent",
    kind: "agent",
    position: [-206, 2.2, 162],
    color: "#ff6bd6",
    accent: "#5ee7ff",
    tags: ["agent"],
    persona: "artist",
    greeting: ["I paint with gradients and gas fees. What should I make for you?"],
  },
  {
    id: "agent-sage",
    name: "SAGE",
    title: "Research agent",
    kind: "agent",
    position: [-240, 2.2, 104],
    color: "#9dff8a",
    accent: "#3d7bff",
    tags: ["agent"],
    persona: "sage",
    greeting: ["I read every block so you don't have to. Curious about something?"],
  },
  {
    id: "banko",
    name: "BANKO",
    title: "Wallet & trading agent, Banker's Terminal",
    kind: "agent",
    position: [150, 2.4, 192],
    color: "#3dffb0",
    accent: "#0052ff",
    tags: ["banker"],
    persona: "banker",
    greeting: [
      "Hey! I'm BANKO, your wallet that talks back. Try: \"buy 0.05 ETH of SKY\", \"swap 100 SKY to VIRT\", \"launch a token called BASED\" or \"portfolio\".",
    ],
  },
  {
    id: "mira",
    name: "Curator Mira",
    title: "Vault Curator, Vault Quarter",
    kind: "human",
    position: [-188, 0, -128],
    color: "#7aa2ff",
    accent: "#ffffff",
    greeting: ["Every vault here has a curator watching the risk. Tonight, that's me.", "Keep your health factor above 1 and you'll sleep fine."],
  },
  {
    id: "hana",
    name: "Hana Hooks",
    title: "Hooksmith, Hook Bazaar",
    kind: "human",
    position: [4, 0, 218],
    color: "#ff5fc8",
    accent: "#ffe0f4",
    greeting: ["Every stall here bends the swap rules a little differently.", "A hook is just a promise: 'before and after you trade, I'll do this.'"],
  },
  {
    id: "gus",
    name: "Gus the Ghost",
    title: "Night Teller, Ghost Bank",
    kind: "human",
    position: [180, 0, -258],
    color: "#a78bfa",
    accent: "#ede9fe",
    greeting: ["Boo. Sorry — habit. Want to borrow a fortune for exactly one block?", "Flash loans are the only loans I trust: they always come back."],
  },
];

export type PanelId = "swap" | "pool" | "vote" | "launch" | "lend" | "hooks" | "flash";

export interface StationDef {
  id: string;
  label: string;
  panel: PanelId;
  position: Vec3;
  color: string;
}

export const stations: StationDef[] = [
  { id: "station-swap", label: "Swap Terminal", panel: "swap", position: [196, 0, 16], color: palette.aero },
  { id: "station-pool", label: "Liquidity Pool", panel: "pool", position: [234, 0, 22], color: palette.cyan },
  { id: "station-vote", label: "Gauge Voting Booth", panel: "vote", position: [272, 0, 16], color: palette.gold },
  { id: "station-launch", label: "Agent Launchpad", panel: "launch", position: [-242, 0, 150], color: palette.virtua },
  { id: "station-lend", label: "Curated Vault", panel: "lend", position: [-210, 0, -150], color: "#9fc0ff" },
  { id: "station-hooks", label: "Hook Stall", panel: "hooks", position: [-24, 0, 240], color: "#ff8ad8" },
  { id: "station-flash", label: "Flash Loan Counter", panel: "flash", position: [205, 0, -282], color: "#c4b5fd" },
];

export const orbs: Vec3[] = [
  [24, 1.6, 8],
  [-28, 1.6, -6],
  [10, 1.6, -34],
  [-14, 1.6, 40],
  [38, 4.5, -26],
  [-40, 1.6, 30],
];

export const RACE = {
  limit: 26,
  rings: [
    [150, 3, -30],
    [195, 3, -30],
    [240, 3, -30],
    [285, 6, -30],
    [330, 3, -50],
    [325, 3, -100],
    [270, 6, -112],
    [210, 3, -100],
  ] as Vec3[],
};

export const jumpPads: { position: Vec3; launch: Vec3 }[] = [
  { position: [0, 0, -193], launch: [0, 32, -17] },
  { position: [80, 0, -8], launch: [0, 20, 0] },
];
