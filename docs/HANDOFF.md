# Base World — handoff for local dev

Paused while moving from cloud to local dev. Work is about 60% done; nothing is playable in the browser yet because the route, HUD and in-world actors haven't been written.

## Get it locally

```bash
git clone https://github.com/Sergey1997/base-world.git && cd base-world
git checkout cursor/base-world-3d-2256   # until the PR is merged into main
corepack enable && pnpm install
pnpm dev        # http://localhost:3000
pnpm typecheck  # passes
```

- This repo is standalone and contains only the game. It was first started in `Sergey1997/byka` on branch `cursor/base-world-3d-2256`; that copy is now superseded by this one.
- The game should live at `/`: replace the placeholder in `app/page.tsx` with the client wrapper.
- New deps: `three@0.186`, `@react-three/fiber@9`, `drei@10`, `@react-three/rapier@2.2` (uses rapier 0.19, so ray hits have `timeOfImpact`, not `toi`), `@react-three/postprocessing@3`, `postprocessing`, `zustand@5`, `@types/three`.
- The project uses Next 16. Per `AGENTS.md`, read `node_modules/next/dist/docs/` before writing route code. `ssr: false` dynamic imports only work inside a Client Component.

## What exists (`components/world/`)

| File | Contents |
|---|---|
| `config.ts` | Everything is data: `palette`, `SPAWN`, the `districts[]` list (with an optional `look` so a district renders through the generic component), roads derived from the districts, `npcs[]`, `stations[]` (with `PanelId`), `orbs`, `RACE` rings and time limit, `jumpPads`. |
| `chain.ts` | The `ChainAdapter` interface plus `mockChain` (quote, swap, addLiquidity, vote, launchAgent, launchToken, swapWithHook, supply, borrow, repay, flashLoan). Tokens: ETH, SKY, VIRT, CASH. Also `hooks` and `fmt`. Swap this out for a wagmi/viem adapter later. |
| `quests.ts` | 10 quests: gm (orbs), speed (150 km/h), summit, race, aero, agents, bank (BANKO), lend (Morpho-like), hooks (Uniswap-like), flash (Aave-like), and the auto finale `based`. Also `matches()` (action prefix `x:`), and `levelFor` and `xpForLevel`. |
| `agents.ts` | Canned persona replies for the Virtua agents, `parseBankerIntent` (buy/swap/launch/portfolio), and `personas`. |
| `store.ts` | The zustand + persist store (`base-world-save`): quest engine (`emit`, `accept`, unlock, complete, rewards, level-up toasts), wallet, LP, veSKY, the vault and `healthFactor`, race (`passRing`, `failRace`), the protocol actions, BANKO chat (`bankerTurn`), and `waypoint()`. `live` is a mutable per-frame object (pos, speed, heading, camYaw, boosting, dashCharge) for the HUD. Also `uiLocked`. |
| `input.ts` | Keyboard sets (`keys`, `pressed`, `consume`). E interacts or closes, J/Tab opens the quest log, Esc closes. Keys are ignored while typing in an input. |
| `player.tsx` | Dynamic rapier capsule. Walk 13 m/s, Shift boost 36, Q dash 88 (1.1 s cooldown), double jump, jump pads, momentum in the air, respawn on falling. Camera control, drag/wheel orbit, arrow keys, auto-follow, and FOV/distance that stretch with speed run in `useFrame` at priority 0.5 (physics is at 0, the composer at 1). Also the stylized avatar, the hoverboard and the additive speed trail. |
| `environment.tsx` | Gradient sky shader with sun glow and stars, a sun that follows the player and casts shadows, fog, the ground with colliders and walls, the drei `Grid`, glowing roads, an instanced city with a world-space lit-window shader (`windowMaterial`) plus colliders, trees, mountains, clouds, and sparkles. `isFree()` keeps scenery out of districts and off roads. |
| `districts.tsx` | Hand-built Plaza (beacon ring), Summit plateau and beam, Aeroport as the flagship hub (runway lights, terminal, epoch board, tower, hangars, parked and flying planes, pool and vote props, race signage), and Virtua (neon towers, torus knot, launchpad beam). Generic `ProtocolDistrict` with vault, pylon and dome motifs for Vault Quarter (Morpho-like), Banker's Terminal (Bankr-like), Hook Bazaar (Uniswap-like) and Ghost Bank (Aave-like). Also `Sign` (Billboard text using `/world/Unbounded.ttf`) and `FONT`. |
| `public/world/Unbounded.ttf` | A copy of the repo's OFL font, so troika text doesn't fetch from a CDN. |

## Remaining work (in order)

1. **`actors.tsx`**
   - NPC meshes: humans are capsules with a head; agents are floating icosahedron robots. Each gets a drei `Html` nameplate and a "!" marker when it has an available quest, or a diamond when it's the target of the tracked objective.
   - Station kiosks with prompts.
   - Orbs: visible only while quest `gm` is active, picked up within 2.2 m, each one calls `emit({type:"collect", id:"orb-i"})`.
   - Race rings: shown when quest `race` is active or done. Highlight `race.next` and call `passRing(i)` within ring radius + 0.5. In `useFrame`, call `failRace` once elapsed time exceeds `RACE.limit`.
   - Jump pad visuals.
   - Launched agents orbiting the launchpad.
   - Waypoint beam plus an `Html` distance label driven by `waypoint(state, live.pos)`.
   - An `Interactions` system in `useFrame`: nearest NPC or station within 5 m calls `setNearby`; the district check calls `setDistrict` (respecting `minY` for the summit).
2. **`game.tsx`**
   - `<Canvas shadows dpr={[1, 1.75]} camera={{ fov: 60, near: 0.1, far: 2000 }}>` containing `<Suspense>` and `<Physics gravity={[0, -30, 0]}>`, with `Environment`, `Districts`, `Actors` and `Player` inside.
   - `EffectComposer` (multisampling 4) with Bloom (mipmapBlur, luminanceThreshold about 1) and Vignette, then ToneMapping (ACES) last. The scene renders into a HalfFloat target without tone mapping, so the ToneMapping effect is required.
   - Keep the composer always mounted, because the priority-0.5 `useFrame` turns off R3F's auto-render.
   - Call `useKeyboard()` here.
3. **`hud.tsx` + `panels.tsx` + `world.module.css`**
   - Intro screen (title, controls, Play calls `start()`).
   - Level badge and XP bar, wallet, a north-up 2D-canvas minimap centred on the player (radius about 220 m, districts, roads, givers, waypoint), the tracked-quest panel, speedometer in km/h with the dash charge, the "[E] …" prompt, the race timer, toasts, and the quest log (track and reset).
   - NPC dialog: offer, accept, or hint. Agent NPCs get a chat UI with suggested prompts; BANKO uses `bankerPrompts`.
   - Panels: swap / pool / vote (Aeroport tabs), launch (name + persona, costs 100 VIRT), lend (supply / borrow / repay with a health-factor bar), hooks (choose a hook and swap), flash (a 3-step route clicked inside an 8 s "block" timer, then `flashLoan(route)`).
   - Make the root a fixed full-screen layer (`position: fixed; inset: 0`).
4. **`client.tsx`** (`"use client"`, `dynamic(() => import("./game"), { ssr: false })`), rendered from **`app/page.tsx`**.
5. Run `pnpm dev` and play through. Check the jump pad reaching the summit (launch velocity [0, 32, -17]), the race being doable at 26 s, and BANKO commands.
6. Run `pnpm build` and `pnpm typecheck`, then fix any issues.
7. Record a short demo video plus 2–3 screenshots.
8. Update the README with the controls and features.

## Design notes

- Characters and names are fictional and don't resemble real people: Jess (Builder-in-Chief), Captain Bryan, Aero Al, Vee, BANKO, Curator Mira, Hana Hooks, Gus the Ghost.
- Districts are inspired by real protocols but use no real logos or tokens (SKY, VIRT and CASH are mock tokens). Ranking source: a research note, "Top Base Projects" (Oct 9, 2026, DefiLlama/CoinGecko). Aerodrome is #1 and the flagship hub; Morpho is #2 and becomes Vault Quarter.
- To add a protocol district: add one `districts` entry with a `look`, plus its NPC and station in `config.ts`, a quest in `quests.ts`, and, if it needs one, a panel and store action routed through `ChainAdapter`.
- Possible next districts from the ranking: Veranta (perps arena), Clanker (mint workshop), Zora (gallery), and Robinhood chain as a later theme.
