# Money Planet Project Rules

## Project Identity

- Product name: Money Planet 财商星球.
- Tagline: Learn Money. Play Smart. Build the Future.
- Chinese tagline: 学会选择，玩懂财商，创造未来。
- Audience: children and families learning financial literacy through play.
- Positioning: an educational platform, not a bank, securities firm, fintech app, or investment advisory site.
- Competitive angle: most financial-literacy products are course → video → quiz. Money Planet's differentiator is that gameplay is the core learning loop, not an add-on: Story → Game → Lesson → Practice → Community, and each planet has its own distinct game genre (not six reskins of the same quiz).

## Phase 2 Pivot (2026-07-06) — supersedes the original MVP restriction below

The original MVP scope line ("static public website, no login/database/account features") is retired. The product now requires a persistent accounts/progress layer to support per-planet games, an Avatar growth system, a Planet Passport, Family Missions, and an eventual multiplayer "Money Planet Adventure" finale. This is a deliberate, confirmed scope increase — not an oversight.

Still out of scope regardless of phase: real payments, checkout, trading, portfolios, or any actual financial transaction. Accounts here mean "remember a child's game progress," not a financial account.

Open decisions still needed before backend work starts (confirm with the user, do not assume):
- Hosting/backend platform — current hosting type is "OpenAI Sites Worker" (`dist/.openai/hosting.json`, entrypoint `server/index.js`); it is not confirmed whether this hosting type exposes any storage/database binding, so a platform migration (e.g. to a host with a real database) may be required.
- Auth model for a children's product — likely a parent-managed profile/family code rather than child self-signup, given privacy considerations for data about children.
- Whether progress needs to sync across devices at launch, or whether a device-local store is an acceptable first step toward the full account system.

## Game System (Phase 2 design reference)

Each planet ships its own game genre — do not build six variations of the same quiz mechanic. Candidate games per planet (pick and refine, not all need to ship at once):

1. **Coin Island 硬币岛** — money is, income, spending, change, money isn't unlimited.
   - Treasure Coin Hunt: platformer-style coin collecting; overspending before the finish line fails the run, saving some earns a "Smart Saver" badge.
   - Cashier Challenge: supermarket checkout simulation focused on the *feeling* of money out / change back, not a math drill.
   - Money Match: drag-and-drop matching income / spending / saving icons to labels.
2. **Choice Forest 选择森林** — opportunity cost, decision-making under constraints.
   - Adventure Path: pick one of two forks (e.g. ice cream vs. movie); an NPC explicitly states what you gave up.
   - Backpack Challenge: pack a 5-slot backpack before an unknown weather event tests your choices.
   - Needs vs. Wants: Fruit-Ninja-style swipe sorting with increasing speed.
3. **Budget City 预算城市** — budgeting, delayed gratification, emergency funds.
   - Pocket Money: 100 yuan must last 7 days of real expenses; overspending early causes visible consequences later.
   - Dream Goal: save toward a 300-yuan bike over time, choosing between save / spend / high-risk invest / borrow each day.
   - Monthly Planner: drag budget into categories (food/fun/saving/gift/education), then a random event (e.g. broken computer) rewards players who kept an emergency fund.
4. **Market Town 市场小镇** — supply, demand, price reasoning.
   - Lemonade Stand: classic weather-driven demand simulation.
   - Market Race: prices drift over time (bananas up, apples down); decide when to buy/sell.
   - Price Detective: guess *why* a price changed (weather, transport, holiday demand, supply drop) — a reasoning game, not a quiz.
5. **Business Bay 创业海湾** — entrepreneurship basics.
   - Mini Shop: set your own prices for a stationery shop and feel customers react ("too expensive!") — price elasticity, experienced not lectured.
   - Cookie Factory: buy ingredients, produce, sell — cost / revenue / profit made concrete.
   - Hire Team: hiring increases output but adds wage cost — first exposure to labor cost trade-offs.
6. **Future Galaxy 未来星系** — investing basics. No candlestick charts, ever.
   - Time Machine: compare "saved in a bank, +interest after 5 years" vs. "kept at home, unchanged" — makes interest tangible.
   - Inflation Monster: a cute monster nibbles purchasing power each year (a burger that cost 10 now costs 12) — makes inflation visible and non-scary.
   - Future Builder: pick a future goal (car / education / house / travel) and get a suggested savings starting point.

Cross-cutting systems (span all planets):

- **Avatar** — a customizable little astronaut; coins/stars earned from lessons and games buy cosmetic gear (suits, ships, pets). Cosmetic only, not pay-to-win, nothing here should look like a real financial product.
- **Planet Passport** — a stamp/badge per completed planet; all six stamps unlock the finale.
- **Family Missions** — small real-world prompts done with a parent (e.g. "plan this week's grocery budget together," "track a week of allowance," "interview a parent about a spending choice") — this is the mechanism that pulls parents into the product, not just kids.

**Hidden finale — Money Planet Adventure**: after collecting all six Planet Passport stamps, unlocks a bigger multiplayer economic sandbox (jobs, entrepreneurship, investing, taxes, housing, stocks, government, trade, economic crises) where lessons from all six planets get used together. Note: as of 2026-07-06 no multiplayer/economic-sandbox code exists anywhere in this codebase — this is new work, not a repackaging of something already built.

## Required Site Structure

Build and preserve these core sections:

- Home 首页
- Explore 星球探索
- Games 游戏中心
- Library 资料库
- Challenges 实践任务
- Community 加入我们
- About 关于我们

The homepage must include:

- Welcome to Money Planet
- A planet map visual
- Start Exploring button
- Join the Planet Builders button

## Course Planet Structure

Represent the learning journey as course planets:

1. Coin Island 硬币岛
2. Choice Forest 选择森林
3. Budget City 预算城市
4. Market Town 市场小镇
5. Business Bay 创业海湾
6. Future Galaxy 未来星系

Include the sample lesson:

- Want or Need? 想要还是需要？

Also include these product areas:

- Game Station 游戏空间
- Resource Library 财商资料库
- Money Missions 财商任务
- Join the Planet Builders 社区页面
- About page with future roadmap

## Visual Style

- Overall feeling: cute but not childish, bright, clean, exploratory, trustworthy, and optimistic.
- Use a colorful education palette:
  - Sky blue
  - Mint green
  - Warm yellow
  - Coral orange
  - Cream white
- Prefer soft geometric planet shapes, orbit paths, stickers, badges, maps, modules, and playful illustrations.
- Keep UI polished and readable for parents while still inviting for children.
- Use generous spacing, clear hierarchy, rounded but not overly childish components, and accessible contrast.
- The first viewport should clearly signal the Money Planet brand and the planet exploration concept.

## Avoid

- Do not make the site look like a financial institution, bank, brokerage, crypto exchange, wealth manager, or securities platform.
- Do not use a dark blue and gold finance palette as the dominant style.
- Do not include investing advice, stock picking, trading language, asset management claims, interest-rate products, loans, credit cards, or financial performance promises.
- Do not build real payment, checkout, subscription, trading, or portfolio features at any phase — game currency (stars/coins) is play money for progress tracking, never a real financial instrument.
- Do not build a child-facing login/signup flow — any account model must be parent-managed (e.g. a family code or parent-created profile), given children's-data privacy considerations.
- Do not create a generic landing page that hides the actual experience behind marketing copy.
- Do not use dense corporate finance imagery such as charts, suits, skyscrapers, vaults, gold bars, or trading screens as the primary visual language.
- Do not overclaim educational outcomes. Keep copy warm, practical, and age-appropriate.

## Implementation Rules

- Prefer a Sites/static-site implementation if a Sites skill is available in the environment.
- If no Sites skill is available, use Vite + React + TypeScript.
- Build an MVP that runs locally and passes production build.
- Keep the implementation simple, maintainable, and static-first.
- Use real pages or page sections for the required navigation items.
- Make the site responsive for desktop and mobile.
- Use semantic HTML where practical.
- Keep copy bilingual where it helps navigation and product clarity.
- Do not add dependencies unless they clearly improve the MVP.

## Expected Commands

For a Vite + React + TypeScript implementation, use:

```bash
pnpm install
pnpm dev
pnpm build
```

If npm is available instead of pnpm, equivalent commands are acceptable:

```bash
npm install
npm run dev
npm run build
```

The final delivery must include:

- What files were created or changed.
- The exact build command used.
- Whether the build passed.
- The local preview URL.

## Development Workflow

Before implementing major changes:

1. Check the current directory and existing files.
2. Read and follow this `AGENTS.md`.
3. Choose the simplest suitable implementation path.
4. Create or update project files.
5. Run the production build.
6. Fix all build errors.
7. Start local preview.
8. Summarize changes and run instructions.
