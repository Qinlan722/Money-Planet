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
const lesson = await fetchHtml("/lesson/lesson-wants-needs?level=explorer");
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

requireSnippet(explore.html, "探索六个财商星球", "explore");
requireSnippet(explore.html, "Explore Six Money Planets", "explore");
for (const id of planetIds) {
  requireSnippet(explore.html, `id="${id}"`, "explore");
}
for (const id of lessonIds) {
  requireSnippet(explore.html, `/lesson/${id}`, "explore");
}

const startLessonCount = (explore.html.match(/开始学习 \/ Start Lesson/g) || []).length;
if (startLessonCount !== 18) {
  missing.push(`explore: expected 18 Start Lesson buttons, found ${startLessonCount}`);
}

requireSnippet(lesson.html, "想要还是需要？", "lesson");
requireSnippet(lesson.html, "Want or Need?", "lesson");
requireSnippet(lesson.html, "返回星球探索", "lesson");
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
