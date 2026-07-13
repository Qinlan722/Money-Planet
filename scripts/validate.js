import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const hosting = JSON.parse(await readFile("dist/.openai/hosting.json", "utf8"));
const workerModule = await import(pathToFileURL("dist/server/index.js").href);

async function fetchHtml(pathname) {
  const response = await workerModule.default?.fetch?.(
    new Request(`https://money-planet.local${pathname}`),
  );
  return {
    response,
    html: response ? await response.text() : "",
  };
}

const home = await fetchHtml("/");
const age = await fetchHtml("/age");
const explore = await fetchHtml("/explore?level=explorer");
const exploreBeginner = await fetchHtml("/explore?level=beginner");
const exploreBuilder = await fetchHtml("/explore?level=builder");
const planetMap = await fetchHtml("/explore/coin-island?level=beginner");
const lesson = await fetchHtml("/lesson/lesson-fair-trade?level=explorer");
const games = await fetchHtml("/games");
const library = await fetchHtml("/library");
const missions = await fetchHtml("/missions");
const community = await fetchHtml("/community");
const about = await fetchHtml("/about");

const planetIds = [
  "coin-island",
  "choice-forest",
  "budget-city",
  "market-town",
  "business-bay",
  "future-galaxy",
];

const lessonIds = [
  "lesson-money-is",
  "lesson-coin-count",
  "lesson-fair-trade",
  "lesson-wants-needs",
  "lesson-choice-cost",
  "lesson-kind-no",
  "lesson-budget-jars",
  "lesson-spending-plan",
  "lesson-track-spending",
  "lesson-price-compare",
  "lesson-market-signs",
  "lesson-good-deal",
  "lesson-helpful-idea",
  "lesson-tiny-shop",
  "lesson-team-roles",
  "lesson-future-goal",
  "lesson-saving-star",
  "lesson-habit-garden",
];

const lessonModules = [
  "故事导入",
  "核心概念",
  "试一试",
  "生活例子",
  "小测验",
  "财商任务",
  "完成徽章",
];

const missing = [];

function requireSnippet(html, snippet, scope) {
  if (!html.includes(snippet)) missing.push(`${scope}: ${snippet}`);
}

function forbidSnippet(html, snippet, scope) {
  if (html.includes(snippet)) missing.push(`${scope} should not include: ${snippet}`);
}

if (hosting.entrypoint !== "server/index.js") {
  missing.push('hosting.json entrypoint must be "server/index.js"');
}

if (hosting.server !== "server/index.js") {
  missing.push('hosting.json server must be "server/index.js"');
}

if (hosting.type !== "worker") {
  missing.push('hosting.json type must be "worker"');
}

if (typeof workerModule.default?.fetch !== "function") {
  missing.push("dist/server/index.js must export default.fetch");
}

for (const [scope, page] of Object.entries({
  home,
  age,
  explore,
  exploreBeginner,
  exploreBuilder,
  planetMap,
  lesson,
  games,
  library,
  missions,
  community,
  about,
})) {
  if (!page.response || !page.response.headers.get("content-type")?.includes("text/html")) {
    missing.push(`${scope}: worker fetch must return an HTML response`);
  }
  requireSnippet(page.html, '<html lang="zh-CN">', scope);
}

requireSnippet(home.html, "欢迎来到 Money Planet 财商星球", "home");
requireSnippet(home.html, "学会选择，玩懂财商，创造未来。", "home");
requireSnippet(home.html, "Learn Money. Play Smart. Build the Future.", "home");
requireSnippet(home.html, 'href="/age"', "home");
forbidSnippet(home.html, "进入 18 个星球任务课", "home");
forbidSnippet(home.html, "故事导入", "home");

requireSnippet(age.html, "先选择你的星球身份", "age");
requireSnippet(age.html, "Beginner 入门星探", "age");
requireSnippet(age.html, "Explorer 探索队员", "age");
requireSnippet(age.html, "Builder 星球建设者", "age");
requireSnippet(age.html, "/explore?level=beginner", "age");
requireSnippet(age.html, "/explore?level=explorer", "age");
requireSnippet(age.html, "/explore?level=builder", "age");

requireSnippet(explore.html, "探索财商星球", "explore");
requireSnippet(explore.html, "Explore Money Planets", "explore");
// Explorer level has lessons on every planet, so all 6 should appear as entry links.
for (const id of planetIds) {
  requireSnippet(explore.html, `href="/explore/${id}?level=explorer"`, "explore");
}

// Age-based filtering: only planets with matching-level lessons should be offered.
requireSnippet(exploreBeginner.html, `href="/explore/coin-island?level=beginner"`, "exploreBeginner");
forbidSnippet(exploreBeginner.html, `href="/explore/market-town?level=beginner"`, "exploreBeginner");
requireSnippet(exploreBuilder.html, `href="/explore/business-bay?level=builder"`, "exploreBuilder");
forbidSnippet(exploreBuilder.html, `href="/explore/coin-island?level=builder"`, "exploreBuilder");

requireSnippet(planetMap.html, "硬币岛", "planetMap");
requireSnippet(planetMap.html, "level-node", "planetMap");
requireSnippet(planetMap.html, "planet-progress-fill", "planetMap");
requireSnippet(planetMap.html, "米米说", "planetMap");
requireSnippet(planetMap.html, "已获星星", "planetMap");
requireSnippet(planetMap.html, "连续学习", "planetMap");
requireSnippet(planetMap.html, "获得徽章", "planetMap");
for (const id of lessonIds.filter((lessonId) => lessonId.startsWith("lesson-money-is") || lessonId.startsWith("lesson-coin-count"))) {
  requireSnippet(planetMap.html, `/lesson/${id}`, "planetMap");
}

requireSnippet(lesson.html, "公平交换小站", "lesson");
requireSnippet(lesson.html, "Fair Trade Stop", "lesson");
requireSnippet(lesson.html, "返回闯关地图", "lesson");
requireSnippet(lesson.html, "lesson-complete-btn", "lesson");
for (const moduleTitle of lessonModules) {
  requireSnippet(lesson.html, moduleTitle, "lesson");
}

requireSnippet(games.html, "边玩边学财商", "games");
requireSnippet(games.html, "Play Games, Learn Money", "games");
requireSnippet(library.html, "财商资料库", "library");
requireSnippet(library.html, "Resource Library", "library");
requireSnippet(missions.html, "把财商带进生活", "missions");
requireSnippet(missions.html, "Money Missions in Real Life", "missions");
requireSnippet(community.html, "加入星球建设者", "community");
requireSnippet(community.html, "Join the Planet Builders", "community");
requireSnippet(about.html, "我们的故事与计划", "about");
requireSnippet(about.html, "Our Story and Roadmap", "about");

if (/Welcome to Money Planet/.test(home.html + age.html + explore.html + lesson.html)) {
  missing.push("old English-first hero title removed");
}

if (/overflow:\s*hidden;[\s\S]{0,120}\.planet-card/.test(explore.html)) {
  missing.push("planet-card must not rely on overflow hidden");
}

if (missing.length > 0) {
  console.error("Validation failed:");
  for (const item of missing) console.error(`- ${item}`);
  process.exit(1);
}

console.log("Validation passed");
