import { treasureCoinHuntMeta } from "../games/coin-island/treasure-coin-hunt/meta.js";
import { renderTreasureHuntBody } from "../games/coin-island/treasure-coin-hunt/page.js";
import { wantOrNeedSortMeta } from "../games/choice-forest/want-or-need-sort/meta.js";
import { renderWantOrNeedSortBody } from "../games/choice-forest/want-or-need-sort/page.js";
import { tinyShopkeeperMeta } from "../games/market-town/tiny-shopkeeper/meta.js";
import { renderTinyShopkeeperBody } from "../games/market-town/tiny-shopkeeper/page.js";
import { renderInteractiveLessonBody } from "../lessons/coin-island/leo-and-20-yuan/page.js";
import { renderCoinParadeBody } from "../lessons/coin-island/coin-parade/page.js";
import { renderWantOrNeedBody } from "../lessons/choice-forest/want-or-need/page.js";
import { renderThreeBudgetJarsBody } from "../lessons/budget-city/three-budget-jars/page.js";

const INTERACTIVE_LESSON_RENDERERS = {
  "lesson-money-is": renderInteractiveLessonBody,
  "lesson-coin-count": renderCoinParadeBody,
  "lesson-wants-needs": renderWantOrNeedBody,
  "lesson-budget-jars": renderThreeBudgetJarsBody,
};

const planets = [
  {
    id: "coin-island",
    name: "Coin Island",
    zh: "硬币岛",
    color: "mint",
    icon: "coin",
    theme: "认识货币与交换",
    childText: "认识硬币和价格，知道一枚小硬币也有自己的用处。",
    englishText: "Meet coins, prices, and everyday exchange.",
    tags: ["硬币 Coin", "价值 Value", "交换 Exchange"],
  },
  {
    id: "choice-forest",
    name: "Choice Forest",
    zh: "选择森林",
    color: "green",
    icon: "fork",
    theme: "想要 vs 需要",
    childText: "练习分清“我想要”和“我需要”，做选择时更有主意。",
    englishText: "Sort wants, needs, and maybe-later choices.",
    tags: ["想要 Want", "需要 Need", "取舍 Choice"],
  },
  {
    id: "budget-city",
    name: "Budget City",
    zh: "预算城市",
    color: "yellow",
    icon: "jars",
    theme: "预算与储蓄",
    childText: "把零花钱分成小计划，学会先想一想再花。",
    englishText: "Make a tiny plan before spending.",
    tags: ["预算 Budget", "计划 Plan", "记录 Track"],
  },
  {
    id: "market-town",
    name: "Market Town",
    zh: "市场小镇",
    color: "coral",
    icon: "tag",
    theme: "比较与公平交易",
    childText: "像逛小集市一样比较选择，理解公平交换和价格。",
    englishText: "Compare choices and trade fairly.",
    tags: ["价格 Price", "比较 Compare", "公平 Fair"],
  },
  {
    id: "business-bay",
    name: "Business Bay",
    zh: "创业海湾",
    color: "blue",
    icon: "shop",
    theme: "创业与服务他人",
    childText: "从一个小点子开始，想想可以怎样帮助别人。",
    englishText: "Turn a helpful idea into a simple project.",
    tags: ["点子 Idea", "服务 Service", "创造 Create"],
  },
  {
    id: "future-galaxy",
    name: "Future Galaxy",
    zh: "未来星系",
    color: "purple",
    icon: "rocket",
    theme: "目标与好习惯",
    childText: "把今天的小习惯连到未来的目标，慢慢建立责任感。",
    englishText: "Connect small habits with future goals.",
    tags: ["目标 Goal", "习惯 Habit", "未来 Future"],
  },
];

function planetIconSvg(key) {
  const glyphs = {
    coin: `<path d="M20 10.4l2.3 5.7 6.3.5-4.8 4 1.5 6.1L20 23.4l-5.3 3.3 1.5-6.1-4.8-4 6.3-.5z" fill="#fff"/>`,
    fork: `<path d="M20 29V20M20 20l-6.6-7.5M20 20l6.6-7.5" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="13.4" cy="11.2" r="2.8" fill="#fff"/><circle cx="26.6" cy="11.2" r="2.8" fill="#fff"/>`,
    jars: `<rect x="11" y="18" width="4.4" height="9" rx="1.2" fill="#fff"/><rect x="17.8" y="13" width="4.4" height="14" rx="1.2" fill="#fff"/><rect x="24.6" y="16.5" width="4.4" height="10.5" rx="1.2" fill="#fff"/>`,
    tag: `<path d="M14 13h7l6 6-8.5 8.5-6-6z" fill="#fff"/><circle cx="16.3" cy="15.3" r="1.3" fill="currentColor"/>`,
    shop: `<path d="M12 17.5l2.3-5.2h11.4l2.3 5.2" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><rect x="12.6" y="17.5" width="14.8" height="9.2" rx="1.2" fill="#fff"/><path d="M16.6 26v-4.6h2.6V26M20.8 26v-6h2.6v6" stroke="currentColor" stroke-width="1.3"/>`,
    rocket: `<path d="M20 10.5c3.2 2.7 4.1 6.8 4.1 10.2 0 1.8-.8 3.4-1.7 4.4l-2.4 2.4-2.4-2.4c-.9-1-1.7-2.6-1.7-4.4 0-3.4.9-7.5 4.1-10.2z" fill="#fff"/><circle cx="20" cy="17.4" r="1.8" fill="currentColor"/><path d="M15.9 23.7l-2.3 4M24.1 23.7l2.3 4" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>`,
  };

  const glyph = glyphs[key];
  if (!glyph) return "";

  return `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pg-${key}" cx="33%" cy="26%" r="78%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.68"/>
          <stop offset="55%" stop-color="currentColor" stop-opacity="1"/>
          <stop offset="100%" stop-color="#00131a" stop-opacity="0.32"/>
        </radialGradient>
      </defs>
      <ellipse cx="20" cy="23.5" rx="17" ry="4" fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="1.6" transform="rotate(-9 20 23.5)"/>
      <circle cx="20" cy="19.5" r="14.5" fill="url(#pg-${key})"/>
      <circle cx="14" cy="13.5" r="2.1" fill="#ffffff" fill-opacity="0.32"/>
      <circle cx="25.5" cy="26" r="1.3" fill="#ffffff" fill-opacity="0.24"/>
      ${glyph}
    </svg>`;
}

function mascotSvg() {
  return `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="35" r="21" fill="#fff6df" stroke="#ffd868" stroke-width="3"/><path d="M18 17c4-6 24-6 28 0" stroke="#237aa3" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="32" cy="11.5" r="4" fill="#ff8a70"/><circle cx="24.5" cy="33" r="3" fill="#263743"/><circle cx="39.5" cy="33" r="3" fill="#263743"/><path d="M24 42c3.4 3 12.6 3 16 0" stroke="#263743" stroke-width="2.4" stroke-linecap="round" fill="none"/></svg>`;
}

const games = [
  {
    title: "想要还是需要？",
    en: "Want or Need?",
    text: "把早餐、玩具、校车、贴纸等卡片放进不同篮子，说出你的理由。",
  },
  {
    title: "小小店长",
    en: "Tiny Shopkeeper",
    text: "给文具和点心贴上价格，练习找零和公平交易。",
  },
  {
    title: "预算拼图",
    en: "Budget Builder",
    text: "把有限的星星币分给吃、玩、存、送，看看计划会怎样变化。",
  },
  {
    title: "交换市集",
    en: "Trade Fair",
    text: "和同伴讨论一次交换，学会表达需求和尊重对方。",
  },
];

const resources = [
  {
    title: "家庭对话卡",
    en: "Family Conversation Cards",
    text: "晚饭后抽一张卡，用轻松问题聊聊今天的一个选择。",
  },
  {
    title: "可打印任务单",
    en: "Printable Mission Sheets",
    text: "适合周末、课堂和亲子活动，不需要复杂材料。",
  },
  {
    title: "家长引导小贴士",
    en: "Parent Guide",
    text: "用鼓励式问题帮助孩子解释选择，而不是给标准答案。",
  },
  {
    title: "课堂迷你课",
    en: "Mini Lesson Pack",
    text: "围绕“想要还是需要？”组织 15 分钟小活动。",
  },
];

const missions = [
  "用 10 个星星币计划一次健康小点心，并留下 2 个备用。",
  "找出家里一个可以重复使用的东西，给它设计新用途。",
  "采访一位家人：小时候做过什么聪明的花钱选择？",
  "画一个小摊位，写下 3 件商品、价格和顾客会喜欢的原因。",
];

const roadmap = [
  {
    time: "现在 Now",
    title: "中文优先的 MVP 网站",
    text: "完成星球地图、课程卡片、游戏想法、资料库和生活任务。",
  },
  {
    time: "下一步 Next",
    title: "互动课程与下载材料",
    text: "把卡片分类、预算拼图和任务单做成可点击、可打印的体验。",
  },
  {
    time: "未来 Future",
    title: "星球建设者社区",
    text: "邀请孩子、家长和老师一起提出新任务，扩展更多学习星球。",
  },
];

const moneyMatchItems = [
  { icon: "💰", label: "妈妈给的零花钱", en: "Allowance from Mom", answer: "income" },
  { icon: "🧧", label: "生日收到的红包", en: "Birthday money", answer: "income" },
  { icon: "🌼", label: "帮邻居浇花赚的钱", en: "Earned watering a neighbor's plants", answer: "income" },
  { icon: "🧸", label: "卖旧玩具得到的钱", en: "Sold an old toy", answer: "income" },
  { icon: "🎁", label: "过年收到的压岁钱", en: "New Year's money", answer: "income" },
  { icon: "✏️", label: "买一支新铅笔", en: "Bought a new pencil", answer: "spending" },
  { icon: "🧃", label: "买了一杯果汁", en: "Bought juice", answer: "spending" },
  { icon: "🎀", label: "买贴纸送朋友", en: "Bought stickers for a friend", answer: "spending" },
  { icon: "📖", label: "买了一本故事书", en: "Bought a storybook", answer: "spending" },
  { icon: "🚌", label: "买公交票", en: "Bought a bus ticket", answer: "spending" },
  { icon: "🐷", label: "把硬币放进储蓄罐", en: "Coins into the piggy bank", answer: "saving" },
  { icon: "🚲", label: "存起来准备买自行车", en: "Saving up for a bike", answer: "saving" },
  { icon: "🏦", label: "把压岁钱存进银行", en: "New Year's money into the bank", answer: "saving" },
  { icon: "🗓️", label: "这周先不花，留到下周", en: "Skipped spending to save for later", answer: "saving" },
];

const playableGames = [
  {
    id: "money-match",
    planetId: "coin-island",
    kind: "match",
    titleZh: "认钱配对",
    titleEn: "Money Match",
    instructions: "看看这是什么？它是收入、消费，还是储蓄？点对篮子，帮米米把它分类吧！",
    badgeZh: "认识货币小达人徽章",
  },
  treasureCoinHuntMeta,
  wantOrNeedSortMeta,
  tinyShopkeeperMeta,
];

const lessons = [
  {
    id: "lesson-money-is",
    planetId: "coin-island",
    titleZh: "钱是什么？",
    titleEn: "What Is Money?",
    ageLevel: "7-9 岁 / Beginner",
    storyZh: "小星探米米在硬币岛捡到三枚星星币。她发现，大家愿意用星星币换面包、铅笔和贴纸，因为大家都相信它代表一种约定好的价值。",
    bigIdeaZh: "钱是一种大家一起认可的交换工具。它可以帮助我们比较物品，也提醒我们每次选择都要想一想。",
    tryItZh: "找三样家里的小物品，试着给它们排顺序：最需要、最常用、最想要。再说说为什么。",
    realWorldZh: "买早餐时，我们用钱换包子或牛奶。钱不是魔法，它只是帮助大家完成交换的小工具。",
    quizZh: ["钱可以帮助我们做什么？", "如果没有钱，人们还可以怎样交换东西？", "为什么大家要相信同一种钱？"],
    missionZh: "画一枚属于你的星星币，写上它可以提醒你的一个好选择。",
    badgeZh: "硬币观察员徽章",
    keyConcepts: ["钱 Money", "价值 Value", "交换 Exchange"],
  },
  {
    id: "lesson-coin-count",
    planetId: "coin-island",
    titleZh: "硬币会排队",
    titleEn: "Counting Coins",
    ageLevel: "7-9 岁 / Beginner",
    storyZh: "硬币岛的桥要用正确数量的星星币才能点亮。米米把硬币按大小、数字和数量排好，桥上的小灯一盏盏亮起来。",
    bigIdeaZh: "数钱不是只看硬币有几枚，还要看每枚代表多少。先分类，再相加，会更清楚。",
    tryItZh: "拿纸片做 1、2、5 三种星星币，组合出 6、8、10 三个数字。",
    realWorldZh: "买橡皮时，如果价格是 5 元，可以用一张 5 元，也可以用 2 元加 2 元加 1 元。",
    quizZh: ["两枚硬币一定比一枚硬币更大吗？", "为什么先分类会更好数？", "你能用几种方法组成 10？"],
    missionZh: "设计一个“硬币排队表”，记录今天你看到的三种价格。",
    badgeZh: "硬币队长徽章",
    keyConcepts: ["数数 Count", "组合 Combine", "价格 Price"],
  },
  {
    id: "lesson-fair-trade",
    planetId: "coin-island",
    titleZh: "公平交换小站",
    titleEn: "Fair Trade Stop",
    ageLevel: "8-10 岁 / Explorer",
    storyZh: "硬币岛开了交换小站。乐乐想用一张贴纸换同学的彩笔，可是彩笔更常用。大家一起讨论怎样交换才感觉公平。",
    bigIdeaZh: "公平交换不只是“我喜欢”，还要考虑物品用途、数量和双方是否都愿意。",
    tryItZh: "和家人各画三张物品卡，选两张试着交换，并说出交换理由。",
    realWorldZh: "同学之间换文具或玩具时，要尊重对方，不强迫，也不让别人吃亏。",
    quizZh: ["如果只有一方开心，这算公平交换吗？", "交换前应该问清楚什么？", "为什么有些东西不适合交换？"],
    missionZh: "写一条“公平交换小规则”，贴在你的学习桌旁。",
    badgeZh: "公平交换徽章",
    keyConcepts: ["公平 Fair", "同意 Agree", "用途 Use"],
  },
  {
    id: "lesson-wants-needs",
    planetId: "choice-forest",
    titleZh: "想要还是需要？",
    titleEn: "Want or Need?",
    ageLevel: "7-10 岁 / Beginner",
    storyZh: "选择森林里有两条路：需要路和想要路。米米看到水杯、糖果、雨伞和游戏贴纸，她要帮每样东西找到合适的路牌。",
    bigIdeaZh: "需要是生活、健康和学习离不开的东西；想要会让我们开心，但可以排队等待。",
    tryItZh: "把今天想买或想用的东西写成清单，给每一项标上“需要”“想要”或“以后再说”。",
    realWorldZh: "下雨天的雨伞可能是需要，新款贴纸可能是想要。不同时间，答案也可能改变。",
    quizZh: ["水和玩具车哪个更像需要？", "想要的东西一定不能买吗？", "为什么要先分清需要和想要？"],
    missionZh: "和家人一起完成一次“需要/想要”三分钟分类挑战。",
    badgeZh: "选择森林向导徽章",
    keyConcepts: ["需要 Need", "想要 Want", "等待 Wait"],
  },
  {
    id: "lesson-choice-cost",
    planetId: "choice-forest",
    titleZh: "选了 A，就暂时放下 B",
    titleEn: "Choosing Means Letting Go",
    ageLevel: "8-10 岁 / Explorer",
    storyZh: "森林小店只能带走一件礼物。米米在飞盘和故事书之间犹豫，她发现做选择时，也是在和另一个选择说“下次见”。",
    bigIdeaZh: "资源有限时，选择一个东西，常常意味着暂时放下另一个东西。知道这一点，会让决定更认真。",
    tryItZh: "想一个你最近做过的小选择，写下你选了什么、放下了什么、为什么。",
    realWorldZh: "如果周末时间只够参加一项活动，选画画就可能不能同时去踢球。",
    quizZh: ["为什么不能每次都全部选择？", "放下一个选择是不是失败？", "做选择前可以问自己什么？"],
    missionZh: "做一张“我的选择天平”，左边写好处，右边写要暂时放下的事。",
    badgeZh: "选择天平徽章",
    keyConcepts: ["选择 Choice", "取舍 Trade-off", "原因 Reason"],
  },
  {
    id: "lesson-kind-no",
    planetId: "choice-forest",
    titleZh: "温柔地说“不”",
    titleEn: "A Kind No",
    ageLevel: "8-11 岁 / Explorer",
    storyZh: "朋友邀请米米一起买闪光卡，可她正在为一本书存星星币。她想拒绝，又不想让朋友难过，于是练习温柔地说“不”。",
    bigIdeaZh: "保护自己的计划时，可以礼貌拒绝。说“不”不代表不友好，而是知道自己现在要做什么。",
    tryItZh: "练习一句话：谢谢你邀请我，不过我今天想把星星币留给我的计划。",
    realWorldZh: "同学买零食时邀请你一起买，如果你不想买，可以礼貌说明原因。",
    quizZh: ["拒绝别人一定很没礼貌吗？", "怎样说“不”会更温柔？", "为什么计划能帮助我们拒绝冲动？"],
    missionZh: "写下一个你想保护的小计划，并准备一句温柔拒绝的话。",
    badgeZh: "温柔选择徽章",
    keyConcepts: ["计划 Plan", "拒绝 No", "礼貌 Kindness"],
  },
  {
    id: "lesson-budget-jars",
    planetId: "budget-city",
    titleZh: "三只预算罐",
    titleEn: "Three Budget Jars",
    ageLevel: "7-10 岁 / Beginner",
    storyZh: "预算城市的入口有三只罐子：现在用、以后用、送温暖。米米把星星币分进去，发现每个罐子都有任务。",
    bigIdeaZh: "预算就是提前给钱安排工作。钱不只用来买东西，也可以存起来或帮助别人。",
    tryItZh: "画三只罐子：花、存、分享。把 10 个星星币分进去，说明你的分法。",
    realWorldZh: "零花钱可以一部分买文具，一部分存起来，一部分给公益盒或礼物计划。",
    quizZh: ["预算是在花钱前做，还是花钱后做？", "为什么要留一点给以后？", "分享罐可以做什么？"],
    missionZh: "做一张你的三罐预算图，放进一周计划里。",
    badgeZh: "预算城市居民徽章",
    keyConcepts: ["预算 Budget", "储蓄 Save", "分享 Share"],
  },
  {
    id: "lesson-spending-plan",
    planetId: "budget-city",
    titleZh: "我的一周小计划",
    titleEn: "My Weekly Money Plan",
    ageLevel: "8-11 岁 / Explorer",
    storyZh: "预算城市要举办周末市集。米米只有 12 个星星币，她要安排交通、点心和一个小纪念品。",
    bigIdeaZh: "计划能帮助我们看清先后顺序。先安排重要的，再决定开心的小奖励。",
    tryItZh: "假设你有 12 个星星币，列出本周最想完成的三件小事，并给每件事分配数量。",
    realWorldZh: "去春游前，可以先计划车费、午餐和小礼物，而不是到了现场才着急。",
    quizZh: ["为什么重要的事情要先安排？", "计划做好后还能调整吗？", "如果钱不够，可以怎么改？"],
    missionZh: "完成一张“一周小计划”，周末回看哪些地方做得好。",
    badgeZh: "小小计划师徽章",
    keyConcepts: ["优先 Priority", "计划 Plan", "调整 Adjust"],
  },
  {
    id: "lesson-track-spending",
    planetId: "budget-city",
    titleZh: "星星币去了哪里？",
    titleEn: "Where Did It Go?",
    ageLevel: "8-11 岁 / Explorer",
    storyZh: "米米发现星星币变少了，却想不起花在哪里。预算城市的记录本提醒她：写下来，答案就会出现。",
    bigIdeaZh: "记录不是为了责备自己，而是为了看见自己的习惯。看见以后，下一次就能做得更好。",
    tryItZh: "用三行记录今天的花费或使用：时间、事情、感受。",
    realWorldZh: "买了两次小零食后，如果写下来，就会发现原来零食花费比想象多。",
    quizZh: ["记录花费有什么用？", "忘记记录一次怎么办？", "记录里除了金额，还可以写什么？"],
    missionZh: "连续三天做“星星币去向记录”，最后圈出一个你发现的小习惯。",
    badgeZh: "记录侦探徽章",
    keyConcepts: ["记录 Track", "习惯 Habit", "回看 Review"],
  },
  {
    id: "lesson-price-compare",
    planetId: "market-town",
    titleZh: "价格小侦探",
    titleEn: "Price Detective",
    ageLevel: "8-10 岁 / Explorer",
    storyZh: "市场小镇有两家果汁摊。一个杯子大一点，一个送贴纸。米米要看清价格、数量和自己真正想要什么。",
    bigIdeaZh: "比较价格时，不只看数字，也要看数量、质量和自己是否真的需要。",
    tryItZh: "找两样相似物品，比较它们的价格、大小和用途，写下你会怎么选。",
    realWorldZh: "同样是铅笔，一盒 6 支和一盒 12 支不能只看总价，还要看每支大约多少钱。",
    quizZh: ["最便宜的一定最适合吗？", "比较时可以看哪三件事？", "为什么要想到自己是否需要？"],
    missionZh: "做一次家庭“价格小侦探”，比较两种水果或文具。",
    badgeZh: "价格侦探徽章",
    keyConcepts: ["价格 Price", "数量 Quantity", "比较 Compare"],
  },
  {
    id: "lesson-market-signs",
    planetId: "market-town",
    titleZh: "广告会说话",
    titleEn: "Ads Can Talk",
    ageLevel: "9-11 岁 / Explorer",
    storyZh: "市场小镇的招牌闪闪发光：今天最棒！大家都喜欢！米米学会先停一下，问问自己：它在告诉我事实，还是在吸引我？",
    bigIdeaZh: "广告会用颜色、声音和词语吸引我们。聪明的消费者会先观察，再决定。",
    tryItZh: "找一张包装或海报，圈出它用了哪些吸引你的方法。",
    realWorldZh: "“限时”“超酷”“同学都在用”会让人心动，但仍然要问：我真的需要吗？",
    quizZh: ["广告的目的是什么？", "看到“大家都买”时可以问什么？", "广告一定是坏的吗？"],
    missionZh: "设计一张诚实广告：介绍一样物品的优点，也写一个需要注意的地方。",
    badgeZh: "广告观察员徽章",
    keyConcepts: ["广告 Ads", "事实 Fact", "吸引 Attention"],
  },
  {
    id: "lesson-good-deal",
    planetId: "market-town",
    titleZh: "什么是好选择？",
    titleEn: "What Makes a Good Deal?",
    ageLevel: "9-11 岁 / Explorer",
    storyZh: "米米看到“买二送一”的彩笔很心动，可她家里还有很多彩笔。市场老师问她：便宜，还是适合，哪个更重要？",
    bigIdeaZh: "好选择不是只看便宜，而是看它是否适合现在的需要、计划和使用次数。",
    tryItZh: "选一样你想买的东西，写下“我会用几次”“它解决什么问题”“有没有替代办法”。",
    realWorldZh: "打折的东西如果买回家不用，就不一定是好选择。",
    quizZh: ["打折一定值得买吗？", "好选择要考虑哪些问题？", "替代办法是什么意思？"],
    missionZh: "做一张“好选择检查表”，下次购物前先看一遍。",
    badgeZh: "聪明买手徽章",
    keyConcepts: ["适合 Fit", "使用 Use", "替代 Substitute"],
  },
  {
    id: "lesson-helpful-idea",
    planetId: "business-bay",
    titleZh: "一个帮助别人的点子",
    titleEn: "A Helpful Idea",
    ageLevel: "8-11 岁 / Explorer",
    storyZh: "创业海湾的船只都从一个问题出发。米米发现同学总忘带橡皮，于是想做一个“备用文具盒”。",
    bigIdeaZh: "小项目可以从帮助别人开始。先看见一个真实问题，再想一个简单办法。",
    tryItZh: "观察家里或班级的一件小麻烦，写出一个可以帮忙的点子。",
    realWorldZh: "整理图书角、做借伞提醒牌、准备备用铅笔，都可以是小小项目。",
    quizZh: ["好点子一定要很大吗？", "为什么先观察问题？", "帮助别人和赚钱有什么不同？"],
    missionZh: "完成一张“我想帮助谁”点子卡，写下对象、问题和办法。",
    badgeZh: "点子船长徽章",
    keyConcepts: ["问题 Problem", "帮助 Help", "点子 Idea"],
  },
  {
    id: "lesson-tiny-shop",
    planetId: "business-bay",
    titleZh: "小小摊位设计师",
    titleEn: "Tiny Shop Designer",
    ageLevel: "9-11 岁 / Builder",
    storyZh: "创业海湾要开创意市集。米米的小摊位卖手绘书签，她要想名字、价格、材料和顾客为什么会喜欢。",
    bigIdeaZh: "一个小摊位需要清楚说明：我提供什么、给谁用、为什么有用、怎样公平定价。",
    tryItZh: "设计一个纸上小摊位：画商品、写价格、写一句介绍。",
    realWorldZh: "义卖、班级市集或家庭游戏都可以练习介绍商品和服务。",
    quizZh: ["摊位需要告诉顾客什么？", "价格可以随便写吗？", "为什么要想顾客是谁？"],
    missionZh: "画出你的 Money Planet 小摊位招牌和三件商品。",
    badgeZh: "小摊位设计师徽章",
    keyConcepts: ["顾客 Customer", "定价 Price", "介绍 Pitch"],
  },
  {
    id: "lesson-team-roles",
    planetId: "business-bay",
    titleZh: "团队里的小角色",
    titleEn: "Team Roles",
    ageLevel: "9-12 岁 / Builder",
    storyZh: "米米和朋友一起做市集摊位。有人画海报，有人整理材料，有人负责介绍。大家发现，分工清楚，合作更轻松。",
    bigIdeaZh: "团队项目需要分工、沟通和互相感谢。每个角色都能让项目更顺利。",
    tryItZh: "给一个三人小项目分角色：设计师、记录员、介绍员。说说每个人做什么。",
    realWorldZh: "班级活动、家庭整理和小组作业都需要角色分工。",
    quizZh: ["为什么团队要分工？", "如果两个人想做同一件事怎么办？", "完成后为什么要感谢队友？"],
    missionZh: "邀请两个人一起设计一个迷你任务，写下每个人的角色。",
    badgeZh: "团队协作徽章",
    keyConcepts: ["团队 Team", "分工 Roles", "沟通 Talk"],
  },
  {
    id: "lesson-future-goal",
    planetId: "future-galaxy",
    titleZh: "给未来写一张明信片",
    titleEn: "Postcard to the Future",
    ageLevel: "8-11 岁 / Explorer",
    storyZh: "未来星系有一座邮局，专门把今天的小目标寄给未来的自己。米米写下：我想学会照顾自己的选择。",
    bigIdeaZh: "目标可以很小，但要说得清楚。清楚的目标更容易变成每天的小行动。",
    tryItZh: "写一句未来明信片：三个月后的我，希望自己能做到什么？",
    realWorldZh: "想买一本书、学会游泳、整理书桌，都可以变成小目标。",
    quizZh: ["目标一定要很大吗？", "怎样让目标更清楚？", "为什么要写给未来的自己？"],
    missionZh: "写一张未来明信片，放进书包夹层，一周后再看。",
    badgeZh: "未来邮差徽章",
    keyConcepts: ["目标 Goal", "未来 Future", "行动 Action"],
  },
  {
    id: "lesson-saving-star",
    planetId: "future-galaxy",
    titleZh: "为一个愿望存星星",
    titleEn: "Save for a Wish",
    ageLevel: "8-11 岁 / Explorer",
    storyZh: "米米想买一本太空画册。她没有马上买，而是在未来星系点亮存星图，每存一点，就离愿望近一点。",
    bigIdeaZh: "储蓄是把现在的一点点留给未来的自己。等待会让愿望更有计划。",
    tryItZh: "画一条 5 格存星路，每完成一次小储蓄，就涂亮一格。",
    realWorldZh: "想买一个稍贵的东西，可以先定目标，再分几次慢慢存。",
    quizZh: ["储蓄是不是永远不花钱？", "为什么存星路要分成小格？", "等待时可以怎样鼓励自己？"],
    missionZh: "选择一个小愿望，设计一张 5 格存星进度图。",
    badgeZh: "存星小达人徽章",
    keyConcepts: ["储蓄 Save", "等待 Wait", "进度 Progress"],
  },
  {
    id: "lesson-habit-garden",
    planetId: "future-galaxy",
    titleZh: "习惯会长大",
    titleEn: "Habits Grow",
    ageLevel: "9-12 岁 / Builder",
    storyZh: "未来星系有一座习惯花园。每天记录一次、整理一次、思考一次，小种子就慢慢长成会发光的树。",
    bigIdeaZh: "未来不是突然出现的，它由今天的小习惯慢慢长出来。小习惯越清楚，越容易坚持。",
    tryItZh: "选一个 3 分钟小习惯，连续做三天：记录花费、整理书桌或准备明天用品。",
    realWorldZh: "每天睡前把书包整理好，第二天早上就更从容。",
    quizZh: ["习惯为什么要从小开始？", "三分钟习惯可以是什么？", "如果有一天忘了怎么办？"],
    missionZh: "种下一个“三天习惯种子”，完成后给自己画一片发光叶子。",
    badgeZh: "习惯园丁徽章",
    keyConcepts: ["习惯 Habit", "坚持 Keep Going", "成长 Grow"],
  },
];

function planetOrbitNodes() {
  return planets
    .map(
      (planet, index) => `
        <a class="orbit-planet node-${index + 1} ${planet.color}" href="/explore/${planet.id}?level=beginner" aria-label="进入 ${planet.zh} ${planet.name}：${planet.theme}">
          <span class="orbit-planet-icon">${planetIconSvg(planet.icon)}</span>
          <strong>${planet.zh}</strong>
          <span class="planet-tip">
            <b>${planet.name} · ${planet.theme}</b>
            ${planet.childText}
          </span>
        </a>
      `,
    )
    .join("");
}

function routeStrip() {
  return planets
    .map(
      (planet, index) => `
        <a class="route-chip" href="/explore/${planet.id}?level=beginner">
          <span class="dot ${planet.color}"></span>
          ${index + 1}. ${planet.zh} · ${planet.theme}
        </a>
      `,
    )
    .join("");
}

function planetOrbitMap() {
  return `
    <div class="planet-map" aria-label="Money Planet 六个财商星球探索地图">
      <div class="orbit-ring ring-a"></div>
      <div class="orbit-ring ring-b"></div>
      <div class="map-star star-1"></div>
      <div class="map-star star-2"></div>
      <div class="map-star star-3"></div>
      <div class="map-core">
        <span>财商星球</span>
        <strong>Money Planet</strong>
      </div>
      <span class="map-mascot" role="img" aria-label="星球向导米米">${mascotSvg()}</span>
      ${planetOrbitNodes()}
    </div>
  `;
}

function lessonDetails() {
  return planets
    .map((planet) => {
      const planetLessons = lessons.filter((lesson) => lesson.planetId === planet.id);
      return `
        <section class="lesson-planet-group" aria-labelledby="${planet.id}-lessons-title">
          <div class="lesson-group-heading ${planet.color}">
            <p>${planet.name}</p>
            <h3 id="${planet.id}-lessons-title">${planet.zh}课程任务页</h3>
          </div>
          <div class="lesson-detail-grid">
            ${planetLessons.map((lesson) => lessonDetailCard(lesson)).join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

function lessonDetailCard(lesson) {
  return `
    <article class="lesson-detail" id="${lesson.id}">
      <header>
        <span class="age-pill">${lesson.ageLevel}</span>
        <h3>${lesson.titleZh}</h3>
        <p class="english-note">${lesson.titleEn}</p>
        <div class="tag-row">
          ${lesson.keyConcepts.map((tag) => `<span>${tag}</span>`).join("")}
        </div>
      </header>
      <div class="mission-block">
        <h4>故事导入 <small>Story</small></h4>
        <p>${lesson.storyZh}</p>
      </div>
      <div class="mission-block">
        <h4>核心概念 <small>Big Idea</small></h4>
        <p>${lesson.bigIdeaZh}</p>
      </div>
      <div class="mission-block">
        <h4>试一试 <small>Try It</small></h4>
        <p>${lesson.tryItZh}</p>
      </div>
      <div class="mission-block">
        <h4>生活例子 <small>Real World</small></h4>
        <p>${lesson.realWorldZh}</p>
      </div>
      <div class="mission-block">
        <h4>小测验 <small>Mini Quiz</small></h4>
        <ol>
          ${lesson.quizZh.map((question) => `<li>${question}</li>`).join("")}
        </ol>
      </div>
      <div class="mission-block highlight">
        <h4>财商任务 <small>Money Mission</small></h4>
        <p>${lesson.missionZh}</p>
      </div>
      <footer class="badge-line">
        <span>完成徽章 / Badge</span>
        <strong>${lesson.badgeZh}</strong>
      </footer>
      <div class="lesson-complete-row">
        <button type="button" class="button primary" id="lesson-complete-btn">完成本节 ✓ Mark Complete</button>
      </div>
    </article>
  `;
}

function featureCards(items, className) {
  return items
    .map(
      (item) => `
        <article class="${className}">
          <span class="mini-icon">★</span>
          <h3>${item.title}</h3>
          <p class="english-note">${item.en}</p>
          <p>${item.text}</p>
        </article>
      `,
    )
    .join("");
}

const levelOptions = [
  {
    id: "beginner",
    zh: "Beginner 入门星探",
    age: "适合 7-9 岁",
    text: "从硬币、需要和简单计划开始，慢慢建立财商词汇。",
  },
  {
    id: "explorer",
    zh: "Explorer 探索队员",
    age: "适合 8-11 岁",
    text: "练习比较、取舍、记录和生活里的小决定。",
  },
  {
    id: "builder",
    zh: "Builder 星球建设者",
    age: "适合 9-12 岁",
    text: "开始做小项目、设计摊位、练习团队合作和未来目标。",
  },
];

function normalizeLevel(value) {
  return levelOptions.some((level) => level.id === value) ? value : "beginner";
}

function lessonMatchesLevel(lesson, level) {
  return lesson.ageLevel.toLowerCase().includes(level);
}

function htmlResponse(html, status = 200) {
  return new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
}

function pageShell({ title, active = "", body }) {
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Money Planet 财商星球是面向中文小学生和家庭的双语财商启蒙探索网站。" />
    <title>${title} · Money Planet 财商星球</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap"
      rel="stylesheet"
    />
    <style>${siteStyles()}</style>
  </head>
  <body>
    <main>
      ${siteNav(active)}
      ${body}
    </main>
    <script>
      (function () {
        var el = document.getElementById("nav-star-count");
        if (!el) return;
        var count = 0;
        for (var i = 0; i < window.localStorage.length; i++) {
          var key = window.localStorage.key(i);
          if (key && key.indexOf("mp_lesson_done_") === 0 && window.localStorage.getItem(key) === "1") count++;
        }
        el.textContent = String(count * 5);
      })();
    </script>
  </body>
</html>`;
}

function siteNav(active) {
  const coreLinks = [
    ["home", "/", "首页 Home"],
    ["explore", "/age", "探索 Explore"],
    ["games", "/games", "游戏 Games"],
  ];
  const moreLinks = [
    ["lessons", "/explore", "课程 Lessons"],
    ["library", "/library", "资料 Library"],
    ["missions", "/missions", "任务 Missions"],
    ["community", "/community", "加入 Community"],
    ["about", "/about", "关于 About"],
  ];
  const moreActive = moreLinks.some(([key]) => key === active);

  return `
    <nav class="top-nav" aria-label="主导航">
      <a class="brand" href="/" aria-label="回到 Money Planet 首页">
        <span class="brand-mark">MP</span>
        <span>
          <strong>Money Planet</strong>
          <small>财商星球</small>
        </span>
      </a>
      <div class="nav-links">
        ${coreLinks
          .map(([key, href, label]) => `<a class="${active === key ? "active" : ""}" href="${href}">${label}</a>`)
          .join("")}
        <details class="nav-more">
          <summary class="${moreActive ? "active" : ""}">更多 More</summary>
          <div class="nav-more-menu">
            ${moreLinks
              .map(([key, href, label]) => `<a class="${active === key ? "active" : ""}" href="${href}">${label}</a>`)
              .join("")}
          </div>
        </details>
        <span class="nav-star-badge" id="nav-star-badge" aria-label="已获星星">
          <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2 L14.7 9 L22 9.5 L16.3 14.2 L18.2 21.5 L12 17.3 L5.8 21.5 L7.7 14.2 L2 9.5 L9.3 9 Z" fill="#FFC94A"/></svg>
          <span id="nav-star-count">0</span>
        </span>
      </div>
    </nav>`;
}

function renderHomePage() {
  return pageShell({
    title: "首页",
    active: "home",
    body: `
      <section class="hero-section">
        <h1>欢迎来到 Money Planet 财商星球</h1>
        <p class="hero-subtitle">
          学会选择，玩懂财商，创造未来。
          <span class="english-note">Learn Money. Play Smart. Build the Future.</span>
        </p>
        <div class="hero-actions center-actions">
          <a class="button primary" href="/age">开始探索 Start Exploring</a>
        </div>
      </section>
      <section class="mascot-section">
        <div class="mascot">
          <span class="mascot-avatar" role="img" aria-label="星球向导米米">${mascotSvg()}</span>
          <p class="mascot-bubble">你好，我是<strong>米米</strong>，欢迎来到财商星球！跟我一站一站探索吧。</p>
        </div>
      </section>
      <section class="map-section">
        ${planetOrbitMap()}
        <div class="route-strip">${routeStrip()}</div>
      </section>
    `,
  });
}

function renderAgePage() {
  return pageShell({
    title: "选择年龄",
    active: "explore",
    body: `
      <section class="page-section compact-page">
        <div class="section-header center">
          <p>Step 1 选择探索等级</p>
          <h1>先选择你的星球身份</h1>
          <span>不用考试，也没有对错。只是帮你找到更适合今天开始的课程路线。</span>
        </div>
        <div class="level-grid">
          ${levelOptions
            .map(
              (level) => `
                <a class="level-card" href="/explore?level=${level.id}">
                  <span class="level-badge">${level.age}</span>
                  <h2>${level.zh}</h2>
                  <p>${level.text}</p>
                  <strong>进入星球探索 / Go Explore</strong>
                </a>
              `,
            )
            .join("")}
        </div>
      </section>
    `,
  });
}

function planetGamesForExplore(planetId) {
  const planetGames = playableGames.filter((game) => game.planetId === planetId);

  if (planetGames.length === 0) {
    return "";
  }

  return `
    <div class="planet-games">
      <h3>星球游戏 <small>Planet Game</small></h3>
      ${planetGames
        .map(
          (game) => `
            <a class="button lesson-button" href="/play/${game.id}">🎮 玩${game.titleZh} / Play ${game.titleEn}</a>
          `,
        )
        .join("")}
    </div>
  `;
}

function levelPathNodes(lessonsForLevel, selectedLevel) {
  const zigzagOffsets = [0, -64, 0, 64];
  return lessonsForLevel
    .map((lesson, index) => {
      const offset = zigzagOffsets[index % zigzagOffsets.length];
      return `
        <div class="level-node" id="level-node-${lesson.id}" style="transform: translateX(${offset}px);">
          <a class="level-node-circle" href="/lesson/${lesson.id}?level=${selectedLevel}">
            <span class="level-node-icon" data-role="icon">${index + 1}</span>
          </a>
          <div class="level-node-label">${lesson.titleZh}</div>
        </div>
      `;
    })
    .join("");
}

function renderExplorePage(url) {
  const selectedLevel = normalizeLevel(url.searchParams.get("level"));
  const level = levelOptions.find((item) => item.id === selectedLevel);
  const availablePlanets = planets.filter((planet) =>
    lessons.some((lesson) => lesson.planetId === planet.id && lessonMatchesLevel(lesson, selectedLevel)),
  );

  return pageShell({
    title: "星球探索",
    active: "lessons",
    body: `
      <section class="page-section">
        <div class="section-header">
          <p>Step 2 星球探索</p>
          <h1>探索财商星球</h1>
          <p class="english-note">Explore Money Planets</p>
          <span>当前身份：${level.zh}。下面是适合这个身份的星球，点进去开始闯关吧。</span>
        </div>
        <div class="planet-grid">
          ${availablePlanets
            .map((planet) => {
              const globalIndex = planets.findIndex((item) => item.id === planet.id);
              return `
                <a class="planet-card planet-card-link ${planet.color}" href="/explore/${planet.id}?level=${selectedLevel}">
                  <div class="planet-card-head">
                    <span class="planet-icon-badge">${planetIconSvg(planet.icon)}</span>
                    <div class="card-number">${globalIndex + 1}</div>
                  </div>
                  <h2>${planet.zh}</h2>
                  <p class="child-text">${planet.childText}</p>
                  <span class="planet-enter-cta">进入闯关地图 Enter Level Map →</span>
                </a>
              `;
            })
            .join("")}
        </div>
      </section>
    `,
  });
}

function renderPlanetMapPage(url, planetId) {
  const planet = planets.find((item) => item.id === planetId);

  if (!planet) {
    return renderNotFoundPage();
  }

  const selectedLevel = normalizeLevel(url.searchParams.get("level"));
  const globalIndex = planets.findIndex((item) => item.id === planetId);
  const lessonsForLevel = lessons.filter(
    (lesson) => lesson.planetId === planetId && lessonMatchesLevel(lesson, selectedLevel),
  );

  const defaultTip =
    lessonsForLevel.length > 0
      ? lessonsForLevel[0].bigIdeaZh
      : "这个难度暂时还没有关卡，去看看其他星球身份或星球吧！";

  const firstHref =
    lessonsForLevel.length > 0
      ? `/lesson/${lessonsForLevel[0].id}?level=${selectedLevel}`
      : `/explore?level=${selectedLevel}`;

  return pageShell({
    title: `${planet.zh} 闯关地图`,
    active: "lessons",
    body: `
      <section class="page-section planet-map-page">
        <a class="back-link" href="/explore?level=${selectedLevel}">← 返回星球探索 Back to Explore</a>

        <div class="planet-hero ${planet.color}">
          <div class="planet-hero-copy">
            <p class="pill">星球 0${globalIndex + 1} · ${planet.theme}</p>
            <h1>${planet.zh} <span class="planet-hero-en">${planet.name}</span></h1>
            <p class="planet-hero-intro">${planet.childText}</p>
            <div class="progress-row">
              <div class="progress-track"><div class="progress-fill" id="planet-progress-fill"></div></div>
              <span class="progress-label"><span id="planet-progress-count">0</span> / ${lessonsForLevel.length} 关卡</span>
            </div>
            <a class="button primary" id="planet-continue-btn" href="${firstHref}">${lessonsForLevel.length > 0 ? "开始冒险 →" : "返回星球探索"}</a>
          </div>
          <div class="planet-hero-orb">${planetIconSvg(planet.icon)}</div>
        </div>

        <div class="planet-map-grid">
          <div class="level-path" id="level-path">
            ${
              lessonsForLevel.length === 0
                ? `<p class="level-path-empty">这个难度暂时还没有关卡，试试其他星球身份吧！</p>`
                : levelPathNodes(lessonsForLevel, selectedLevel)
            }
          </div>
          <aside class="map-sidebar">
            <div class="tip-card">
              <span class="tip-avatar" role="img" aria-label="星球向导米米">${mascotSvg()}</span>
              <div>
                <h4>米米说</h4>
                <p id="planet-tip-text">${defaultTip}</p>
              </div>
            </div>
            <div class="stats-card">
              <div class="stats-row"><span>已获星星</span><strong id="stat-stars">0 ★</strong></div>
              <div class="stats-row"><span>连续学习</span><strong id="stat-streak">0 天</strong></div>
              <div class="stats-row"><span>获得徽章</span><strong id="stat-badges">0 枚</strong></div>
            </div>
            ${planetGamesForExplore(planet.id)}
          </aside>
        </div>
      </section>
      <script>
        (function () {
          var lessonIds = ${JSON.stringify(lessonsForLevel.map((l) => l.id))};
          var lessonTips = ${JSON.stringify(lessonsForLevel.map((l) => l.bigIdeaZh))};
          var selectedLevel = ${JSON.stringify(selectedLevel)};

          function isDone(id) { return window.localStorage.getItem("mp_lesson_done_" + id) === "1"; }

          var doneStates = lessonIds.map(isDone);
          var currentIndex = doneStates.indexOf(false);
          if (currentIndex === -1) currentIndex = lessonIds.length;

          lessonIds.forEach(function (id, i) {
            var node = document.getElementById("level-node-" + id);
            if (!node) return;
            var iconEl = node.querySelector('[data-role="icon"]');
            if (doneStates[i]) {
              node.classList.add("is-done");
              if (iconEl) iconEl.textContent = "✓";
            } else if (i === currentIndex) {
              node.classList.add("is-current");
              if (iconEl) iconEl.textContent = String(i + 1);
            } else {
              node.classList.add("is-locked");
              if (iconEl) iconEl.textContent = "🔒";
            }
          });

          var doneCount = doneStates.filter(function (d) { return d; }).length;
          var total = lessonIds.length;
          var fillEl = document.getElementById("planet-progress-fill");
          var countEl = document.getElementById("planet-progress-count");
          if (fillEl) fillEl.style.width = (total ? (doneCount / total * 100) : 0) + "%";
          if (countEl) countEl.textContent = String(doneCount);

          var continueBtn = document.getElementById("planet-continue-btn");
          if (continueBtn && total > 0) {
            if (currentIndex < lessonIds.length) {
              continueBtn.setAttribute("href", "/lesson/" + lessonIds[currentIndex] + "?level=" + selectedLevel);
              continueBtn.textContent = doneCount > 0 ? "继续冒险 →" : "开始冒险 →";
            } else {
              continueBtn.setAttribute("href", "/explore?level=" + selectedLevel);
              continueBtn.textContent = "全部完成！Well Done 🎉";
            }
          }

          var tipEl = document.getElementById("planet-tip-text");
          if (tipEl) {
            if (currentIndex < lessonTips.length) {
              tipEl.textContent = lessonTips[currentIndex];
            } else if (total > 0) {
              tipEl.textContent = "你已经完成这个星球在当前难度的所有关卡啦，真棒！";
            }
          }

          function countDoneLessons() {
            var count = 0;
            for (var i = 0; i < window.localStorage.length; i++) {
              var key = window.localStorage.key(i);
              if (key && key.indexOf("mp_lesson_done_") === 0 && window.localStorage.getItem(key) === "1") count++;
            }
            return count;
          }

          var starsEl = document.getElementById("stat-stars");
          var streakEl = document.getElementById("stat-streak");
          var badgesEl = document.getElementById("stat-badges");
          var totalDone = countDoneLessons();
          var badgeCount =
            totalDone +
            (window.localStorage.getItem("mp_badge_money_match") === "1" ? 1 : 0) +
            (window.localStorage.getItem("mp_badge_treasure_hunt") === "1" ? 1 : 0) +
            (window.localStorage.getItem("mp_badge_want_need_sort") === "1" ? 1 : 0) +
            (window.localStorage.getItem("mp_badge_tiny_shopkeeper") === "1" ? 1 : 0);
          if (starsEl) starsEl.textContent = String(totalDone * 5) + " ★";
          if (streakEl) streakEl.textContent = String(Number(window.localStorage.getItem("mp_streak_count") || "0")) + " 天";
          if (badgesEl) badgesEl.textContent = String(badgeCount) + " 枚";
        })();
      </script>
    `,
  });
}

function renderLessonPage(url, lessonId) {
  const selectedLevel = normalizeLevel(url.searchParams.get("level"));
  const lesson = lessons.find((item) => item.id === lessonId);

  if (!lesson) {
    return renderNotFoundPage();
  }

  const planet = planets.find((item) => item.id === lesson.planetId);

  const interactiveRenderer = INTERACTIVE_LESSON_RENDERERS[lesson.id];
  if (interactiveRenderer) {
    return pageShell({
      title: lesson.titleZh,
      active: "lessons",
      body: interactiveRenderer(lesson, planet),
    });
  }

  return pageShell({
    title: lesson.titleZh,
    active: "lessons",
    body: `
      <section class="page-section lesson-page">
        <a class="back-link" href="/explore/${planet.id}?level=${selectedLevel}">← 返回闯关地图 Back to Level Map</a>
        <div class="lesson-hero ${planet.color}">
          <p>${planet.zh} · ${planet.name}</p>
          <h1>${lesson.titleZh}</h1>
          <p class="english-note">${lesson.titleEn}</p>
          <div class="tag-row">
            <span>${lesson.ageLevel}</span>
            ${lesson.keyConcepts.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
        </div>
        ${lessonDetailCard(lesson)}
      </section>
      <script>
        (function () {
          var key = ${JSON.stringify(`mp_lesson_done_${lesson.id}`)};
          var btn = document.getElementById("lesson-complete-btn");
          if (!btn) return;

          function pad(n) { return n < 10 ? "0" + n : String(n); }

          function bumpStreak() {
            var today = new Date();
            var todayStr = today.getFullYear() + "-" + pad(today.getMonth() + 1) + "-" + pad(today.getDate());
            var lastStr = window.localStorage.getItem("mp_streak_last_date");
            var count = Number(window.localStorage.getItem("mp_streak_count") || "0");
            if (lastStr === todayStr) return;
            var isConsecutive = false;
            if (lastStr) {
              var diffDays = Math.round((new Date(todayStr) - new Date(lastStr)) / 86400000);
              isConsecutive = diffDays === 1;
            }
            count = isConsecutive ? count + 1 : 1;
            window.localStorage.setItem("mp_streak_count", String(count));
            window.localStorage.setItem("mp_streak_last_date", todayStr);
          }

          function refresh() {
            if (window.localStorage.getItem(key) === "1") {
              btn.textContent = "已完成 ✓ Completed";
              btn.disabled = true;
            } else {
              btn.textContent = "完成本节 ✓ Mark Complete";
              btn.disabled = false;
            }
          }

          btn.addEventListener("click", function () {
            window.localStorage.setItem(key, "1");
            bumpStreak();
            refresh();
          });

          refresh();
        })();
      </script>
    `,
  });
}

function moneyMatchDataJson() {
  return JSON.stringify(moneyMatchItems).replace(/</g, "\\u003c");
}

function renderGamePage(gameId) {
  const game = playableGames.find((item) => item.id === gameId);

  if (!game) {
    return renderNotFoundPage();
  }

  const planet = planets.find((item) => item.id === game.planetId);

  if (game.kind === "run") {
    return pageShell({ title: game.titleZh, active: "games", body: renderTreasureHuntBody(game, planet) });
  }

  if (game.kind === "sort") {
    return pageShell({ title: game.titleZh, active: "games", body: renderWantOrNeedSortBody(game, planet) });
  }

  if (game.kind === "shop") {
    return pageShell({ title: game.titleZh, active: "games", body: renderTinyShopkeeperBody(game, planet) });
  }

  return renderMoneyMatchGame(game, planet);
}

function renderMoneyMatchGame(game, planet) {
  return pageShell({
    title: game.titleZh,
    active: "games",
    body: `
      <section class="page-section compact-page game-page">
        <a class="back-link" href="/explore/${planet.id}?level=beginner">← 返回${planet.zh} Back to ${planet.name}</a>
        <div class="game-hero ${planet.color}">
          <p>${planet.zh} · ${planet.name}</p>
          <h1>${game.titleZh}</h1>
          <p class="english-note">${game.titleEn}</p>
          <p class="game-instructions">${game.instructions}</p>
        </div>

        <div class="money-match" id="mm-root" data-game="${game.id}">
          <div class="mm-scoreboard">
            <span>得分 Score: <strong id="mm-score">0</strong>/10</span>
            <span>最佳 Best: <strong id="mm-best">0</strong>/10</span>
            <span class="mm-badge-pill" id="mm-badge-pill" hidden>🏅 徽章已获得</span>
          </div>

          <div class="mm-stage" id="mm-stage">
            <span class="mm-mascot" role="img" aria-label="星球向导米米">${mascotSvg()}</span>
            <div class="mm-item-card" id="mm-item-card">
              <span class="mm-item-icon" id="mm-item-icon">💰</span>
              <p class="mm-item-label" id="mm-item-label">正在加载…</p>
            </div>
          </div>

          <div class="mm-bins" id="mm-bins">
            <button type="button" class="mm-bin mint" data-answer="income">
              <span class="mm-bin-icon">💰</span>
              <strong>收入</strong>
              <small>Income</small>
            </button>
            <button type="button" class="mm-bin coral" data-answer="spending">
              <span class="mm-bin-icon">🛍️</span>
              <strong>消费</strong>
              <small>Spending</small>
            </button>
            <button type="button" class="mm-bin blue" data-answer="saving">
              <span class="mm-bin-icon">🏦</span>
              <strong>储蓄</strong>
              <small>Saving</small>
            </button>
          </div>

          <div class="mm-result" id="mm-result" hidden>
            <h2>本轮完成！Round Complete</h2>
            <p id="mm-result-score">得分 Score: 0/10</p>
            <p class="mm-badge-earned" id="mm-result-badge" hidden>🏅 ${game.badgeZh}已解锁！</p>
            <div class="hero-actions center-actions">
              <button type="button" class="button primary" id="mm-replay">再玩一次 Play Again</button>
              <a class="button secondary" href="/explore/${planet.id}?level=beginner">返回${planet.zh} Back to Planet</a>
            </div>
          </div>
        </div>
      </section>
      <script>
        (function () {
          var items = ${moneyMatchDataJson()};
          var ROUND_LENGTH = 10;
          var STORAGE_BEST = "mp_money_match_best";
          var STORAGE_BADGE = "mp_badge_money_match";

          function shuffle(list) {
            var copy = list.slice();
            for (var i = copy.length - 1; i > 0; i--) {
              var j = Math.floor(Math.random() * (i + 1));
              var tmp = copy[i];
              copy[i] = copy[j];
              copy[j] = tmp;
            }
            return copy;
          }

          function bestScore() {
            return Number(window.localStorage.getItem(STORAGE_BEST) || "0");
          }

          var round = [];
          var index = 0;
          var score = 0;
          var locked = false;

          var scoreEl = document.getElementById("mm-score");
          var bestEl = document.getElementById("mm-best");
          var badgePill = document.getElementById("mm-badge-pill");
          var iconEl = document.getElementById("mm-item-icon");
          var labelEl = document.getElementById("mm-item-label");
          var cardEl = document.getElementById("mm-item-card");
          var stageEl = document.getElementById("mm-stage");
          var binsEl = document.getElementById("mm-bins");
          var resultEl = document.getElementById("mm-result");
          var resultScoreEl = document.getElementById("mm-result-score");
          var resultBadgeEl = document.getElementById("mm-result-badge");
          var replayBtn = document.getElementById("mm-replay");
          var bins = binsEl.querySelectorAll(".mm-bin");

          function updateBadgeUI() {
            var earned = window.localStorage.getItem(STORAGE_BADGE) === "1";
            badgePill.hidden = !earned;
          }

          function showItem() {
            var item = round[index];
            iconEl.textContent = item.icon;
            labelEl.textContent = item.label;
            cardEl.classList.remove("mm-correct", "mm-wrong");
          }

          function startRound() {
            round = shuffle(items).slice(0, ROUND_LENGTH);
            index = 0;
            score = 0;
            locked = false;
            resultEl.hidden = true;
            stageEl.hidden = false;
            binsEl.hidden = false;
            scoreEl.textContent = "0";
            bestEl.textContent = String(bestScore());
            showItem();
          }

          function finishRound() {
            stageEl.hidden = true;
            binsEl.hidden = true;
            resultEl.hidden = false;
            var best = Math.max(score, bestScore());
            window.localStorage.setItem(STORAGE_BEST, String(best));
            bestEl.textContent = String(best);
            resultScoreEl.textContent = "得分 Score: " + score + "/" + ROUND_LENGTH;
            if (score === ROUND_LENGTH) {
              window.localStorage.setItem(STORAGE_BADGE, "1");
              resultBadgeEl.hidden = false;
              updateBadgeUI();
            } else {
              resultBadgeEl.hidden = true;
            }
          }

          function handleAnswer(answer) {
            if (locked) return;
            locked = true;
            var item = round[index];
            var correct = answer === item.answer;
            if (correct) {
              score += 1;
              scoreEl.textContent = String(score);
              cardEl.classList.add("mm-correct");
            } else {
              cardEl.classList.add("mm-wrong");
            }
            window.setTimeout(function () {
              index += 1;
              if (index >= round.length) {
                finishRound();
              } else {
                showItem();
                locked = false;
              }
            }, 650);
          }

          for (var i = 0; i < bins.length; i++) {
            bins[i].addEventListener("click", function (event) {
              handleAnswer(event.currentTarget.getAttribute("data-answer"));
            });
          }
          replayBtn.addEventListener("click", startRound);

          updateBadgeUI();
          startRound();
        })();
      </script>
    `,
  });
}

function renderGamesPage() {
  return pageShell({
    title: "边玩边学财商",
    active: "games",
    body: `
      <section class="page-section compact-page">
        <div class="section-header">
          <p>Games 游戏中心</p>
          <h1>边玩边学财商</h1>
          <p class="english-note">Play Games, Learn Money</p>
          <span>每个星球都有自己的玩法。第一个可以玩的游戏已经上线，其余正在制作中。</span>
        </div>
        <div class="feature-list">
          ${playableGames
            .map((game) => {
              const planet = planets.find((item) => item.id === game.planetId);
              return `
                <article class="feature-card playable ${planet.color}">
                  <span class="mini-icon">${planetIconSvg(planet.icon)}</span>
                  <h3>${game.titleZh}</h3>
                  <p class="english-note">${game.titleEn}</p>
                  <p>${game.instructions}</p>
                  <a class="button primary" href="/play/${game.id}">开始游戏 Play Now</a>
                </article>
              `;
            })
            .join("")}
          ${games
            .map(
              (item) => `
                <article class="feature-card">
                  <span class="mini-icon">★</span>
                  <h3>${item.title}</h3>
                  <p class="english-note">${item.en}</p>
                  <p>${item.text}</p>
                  <span class="coming-soon">制作中 Coming Soon</span>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
    `,
  });
}

function renderListPage({ title, en, eyebrow, active, items }) {
  return pageShell({
    title,
    active,
    body: `
      <section class="page-section compact-page">
        <div class="section-header">
          <p>${eyebrow}</p>
          <h1>${title}</h1>
          <p class="english-note">${en}</p>
        </div>
        <div class="feature-list">
          ${featureCards(items, "feature-card")}
        </div>
      </section>
    `,
  });
}

function renderMissionsPage() {
  return pageShell({
    title: "把财商带进生活",
    active: "missions",
    body: `
      <section class="page-section compact-page">
        <div class="section-header">
          <p>Missions 实践任务</p>
          <h1>把财商带进生活</h1>
          <p class="english-note">Money Missions in Real Life</p>
          <span>每个任务都很小，但会让孩子把选择、计划、比较和创造带回真实生活。</span>
        </div>
        <div class="mission-board">
          ${missions
            .map(
              (mission, index) => `
                <article class="mission-card">
                  <span>任务 ${index + 1} / Mission ${index + 1}</span>
                  <p>${mission}</p>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
    `,
  });
}

function renderCommunityPage() {
  return pageShell({
    title: "加入星球建设者",
    active: "community",
    body: `
      <section class="page-section compact-page">
        <div class="community-panel">
          <p class="pill">Community 加入我们</p>
          <h1>加入星球建设者</h1>
          <p class="english-note">Join the Planet Builders</p>
          <p>
            财商星球希望和家长、老师、学生建设者一起成长。你可以提供孩子真实会遇到的选择场景，
            也可以一起设计卡片、任务和课堂活动，让网站更适合中文家庭使用。
          </p>
          <div class="builder-roles">
            <span>家长 Parents</span>
            <span>老师 Teachers</span>
            <span>学生建设者 Student Builders</span>
          </div>
        </div>
      </section>
    `,
  });
}

function renderAboutPage() {
  return pageShell({
    title: "我们的故事与计划",
    active: "about",
    body: `
      <section class="page-section compact-page">
        <div class="section-header">
          <p>About 关于我们</p>
          <h1>我们的故事与计划</h1>
          <p class="english-note">Our Story and Roadmap</p>
          <span>Money Planet 财商星球从“孩子能听懂、愿意玩、可以实践”的原则出发，逐步扩展课程和社区。</span>
        </div>
        <div class="roadmap">
          ${roadmap
            .map(
              (item) => `
                <article>
                  <span>${item.time}</span>
                  <h2>${item.title}</h2>
                  <p>${item.text}</p>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
    `,
  });
}

function renderNotFoundPage() {
  return pageShell({
    title: "没有找到页面",
    active: "",
    body: `
      <section class="page-section compact-page">
        <div class="section-header center">
          <p>404</p>
          <h1>这个星球还没开放</h1>
          <span>回到首页重新开始探索吧。</span>
          <div class="hero-actions center-actions">
            <a class="button primary" href="/">回到首页 Home</a>
          </div>
        </div>
      </section>
    `,
  });
}

function renderPage(request = new Request("https://money-planet.local/")) {
  const url = new URL(request.url);

  if (url.pathname === "/") return renderHomePage();
  if (url.pathname === "/age") return renderAgePage();
  if (url.pathname === "/explore") return renderExplorePage(url);
  if (url.pathname.startsWith("/explore/")) {
    return renderPlanetMapPage(url, url.pathname.split("/").filter(Boolean)[1]);
  }
  if (url.pathname.startsWith("/lesson/")) {
    return renderLessonPage(url, url.pathname.split("/").filter(Boolean)[1]);
  }
  if (url.pathname.startsWith("/play/")) {
    return renderGamePage(url.pathname.split("/").filter(Boolean)[1]);
  }
  if (url.pathname === "/games") {
    return renderGamesPage();
  }
  if (url.pathname === "/library") {
    return renderListPage({
      title: "财商资料库",
      en: "Resource Library",
      eyebrow: "Library 资料库",
      active: "library",
      items: resources,
    });
  }
  if (url.pathname === "/missions") return renderMissionsPage();
  if (url.pathname === "/community") return renderCommunityPage();
  if (url.pathname === "/about") return renderAboutPage();

  return renderNotFoundPage();
}

function siteStyles() {
  return `
      :root {
        color: #edebff;
        background: #12143a;
        font-family: 'Nunito', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
        font-synthesis: none;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        --font-display: 'Fredoka', 'Nunito', sans-serif;
        --bg-deep: #12143a;
        --bg-mid: #1a1e4e;
        --bg-edge: #241a4e;
        --cream: #fff9ec;
        --paper: rgba(255, 255, 255, 0.06);
        --ink: #edebff;
        --soft: #c6c3ec;
        --softer: #d9d6f0;
        --muted: #8f8cc0;
        --line: rgba(255, 255, 255, 0.1);
        --glass: rgba(255, 255, 255, 0.06);
        --glass-strong: rgba(255, 255, 255, 0.1);
        --sky: #4fcfc0;
        --sky-dark: #ffd873;
        --mint: #ffc94a;
        --leaf: #6fd08c;
        --yellow: #5ca9f2;
        --coral: #ff9466;
        --violet: #b98cf2;
        --gold: #ffd873;
        --gold-dark: #f2971d;
        --gold-ink: #3a2200;
        --gold-glow: rgba(242, 151, 29, 0.35);
        --shadow: 0 24px 60px rgba(4, 5, 20, 0.45);
      }

      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-width: 320px;
        background:
          radial-gradient(1.6px 1.6px at 40px 60px, rgba(255, 255, 255, 0.55), transparent),
          radial-gradient(1.2px 1.2px at 160px 120px, rgba(255, 255, 255, 0.4), transparent),
          radial-gradient(1.4px 1.4px at 280px 40px, rgba(255, 255, 255, 0.5), transparent),
          radial-gradient(1px 1px at 340px 180px, rgba(255, 255, 255, 0.35), transparent),
          radial-gradient(1.6px 1.6px at 90px 220px, rgba(255, 255, 255, 0.45), transparent),
          radial-gradient(1.2px 1.2px at 220px 260px, rgba(255, 255, 255, 0.4), transparent),
          linear-gradient(160deg, var(--bg-deep) 0%, var(--bg-mid) 45%, var(--bg-edge) 100%);
        background-size: 380px 380px, 380px 380px, 380px 380px, 380px 380px, 380px 380px, 380px 380px, 100% 100%;
      }
      a { color: inherit; text-decoration: none; }
      main { min-height: 100vh; overflow: hidden; }

      .top-nav {
        position: sticky;
        top: 0;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        width: min(1180px, calc(100% - 32px));
        margin: 16px auto 0;
        padding: 12px 14px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        background: rgba(18, 20, 58, 0.65);
        box-shadow: 0 10px 28px rgba(0, 0, 0, 0.32);
        backdrop-filter: blur(16px);
      }
      .brand { display: inline-flex; align-items: center; gap: 10px; flex: 0 0 auto; }
      .brand-mark {
        display: grid;
        width: 44px;
        height: 44px;
        place-items: center;
        border-radius: 50%;
        background: radial-gradient(circle at 32% 30%, #fff3d6, #ffc46b 55%, #f2971d 100%);
        box-shadow: 0 0 18px rgba(255, 196, 107, 0.55);
        color: var(--gold-ink);
        font-weight: 900;
      }
      .brand strong, .brand small { display: block; line-height: 1.08; }
      .brand strong { font-family: var(--font-display); color: var(--cream); }
      .brand small { color: var(--muted); font-weight: 800; }
      .nav-links { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 6px; }
      .nav-links a {
        border-radius: 999px;
        padding: 9px 12px;
        color: var(--soft);
        font-size: 0.92rem;
        font-weight: 800;
      }
      .nav-links a:hover, .nav-links a.active { background: rgba(255, 255, 255, 0.1); color: var(--cream); }
      .nav-more { position: relative; }
      .nav-more summary {
        display: inline-flex;
        list-style: none;
        cursor: pointer;
        border-radius: 999px;
        padding: 9px 12px;
        color: var(--soft);
        font-size: 0.92rem;
        font-weight: 800;
      }
      .nav-more summary::-webkit-details-marker { display: none; }
      .nav-more summary::marker { content: ""; }
      .nav-more summary::after { content: "▾"; margin-left: 4px; font-size: 0.78em; }
      .nav-more summary:hover, .nav-more summary.active, .nav-more[open] summary { background: rgba(255, 255, 255, 0.1); color: var(--cream); }
      .nav-more-menu {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        z-index: 20;
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 160px;
        padding: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        background: rgba(18, 20, 58, 0.97);
        box-shadow: 0 20px 44px rgba(0, 0, 0, 0.45);
      }
      .nav-more-menu a { border-radius: 10px; padding: 9px 12px; color: var(--soft); font-size: 0.92rem; font-weight: 800; }
      .nav-more-menu a:hover, .nav-more-menu a.active { background: rgba(255, 255, 255, 0.08); color: var(--cream); }
      .nav-star-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-left: 4px;
        padding: 8px 14px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        color: var(--gold);
        font-weight: 900;
        font-size: 0.92rem;
      }

      .home-page, .page-section {
        width: min(1180px, calc(100% - 32px));
        margin: 0 auto;
        padding: 70px 0 86px;
      }
      .home-page {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(340px, 520px);
        align-items: center;
        gap: 48px;
        min-height: calc(100vh - 88px);
      }
      .compact-page { max-width: 1060px; }
      .home-copy { max-width: 720px; }
      .hero-section {
        width: min(880px, calc(100% - 32px));
        margin: 0 auto;
        min-height: calc(100vh - 88px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 22px;
        text-align: center;
        padding: 70px 0;
      }
      .hero-section h1 { max-width: 760px; margin-bottom: 0; }
      .hero-subtitle { max-width: 620px; color: var(--soft); font-size: 1.24rem; font-weight: 800; line-height: 1.6; }
      .hero-subtitle .english-note { display: block; margin-top: 6px; font-size: 1rem; }
      .mascot-section {
        width: min(1180px, calc(100% - 32px));
        margin: 0 auto;
        padding: 30px 0;
        display: flex;
        justify-content: center;
      }
      .mascot-section .mascot { margin-bottom: 0; }
      .map-section {
        width: min(1180px, calc(100% - 32px));
        margin: 0 auto;
        padding: 10px 0 96px;
      }
      .map-section .route-strip { justify-content: center; margin-top: 52px; }
      h1, h2, h3, h4, h5, p { margin-top: 0; }
      h1, h2, h3, h4, h5 { font-family: var(--font-display); font-weight: 700; color: var(--cream); }
      h1 {
        max-width: 820px;
        margin-bottom: 20px;
        font-size: clamp(3rem, 7.5vw, 6.4rem);
        line-height: 0.98;
      }
      h2 { margin-bottom: 10px; font-size: clamp(1.9rem, 4vw, 3.5rem); line-height: 1.05; }
      h3 { margin-bottom: 8px; font-size: 1.45rem; }
      h5 { margin-bottom: 4px; font-size: 1.1rem; }
      .pill {
        display: inline-flex;
        align-items: center;
        width: fit-content;
        min-height: 36px;
        margin: 0 0 16px;
        padding: 8px 14px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        color: var(--soft);
        font-weight: 900;
        letter-spacing: 0.4px;
      }
      .hero-text, .section-header span, .planet-card p, .lesson-card p, .lesson-detail p, .lesson-detail li, .feature-card p, .resource-card p, .mission-card p, .community-panel p, .roadmap p {
        color: var(--soft);
        line-height: 1.72;
      }
      .hero-text { max-width: 690px; font-size: 1.16rem; }
      .tagline { margin-bottom: 8px; color: var(--gold); font-size: 1.24rem; font-weight: 1000; }
      .subtitle-en, .english-note { color: var(--muted); font-weight: 800; }
      .hero-actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 28px; }
      .center-actions { justify-content: center; }
      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 48px;
        border-radius: 999px;
        padding: 13px 20px;
        font-weight: 900;
        transition: transform 180ms ease, box-shadow 180ms ease;
      }
      .button:hover { transform: translateY(-2px); }
      .button.primary { background: linear-gradient(135deg, var(--gold), var(--gold-dark)); color: var(--gold-ink); box-shadow: 0 10px 24px var(--gold-glow); }
      .button.secondary { border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(255, 255, 255, 0.08); color: var(--cream); }

      .mascot { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
      .mascot-avatar {
        flex: 0 0 auto;
        width: 60px;
        height: 60px;
        animation: mascot-float 3.6s ease-in-out infinite;
        filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.3));
      }
      .mascot-bubble {
        position: relative;
        margin: 0;
        padding: 10px 16px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 18px;
        background: rgba(36, 40, 94, 0.92);
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3);
        color: var(--ink);
        font-size: 0.94rem;
        font-weight: 800;
        line-height: 1.5;
      }
      .mascot-bubble strong { color: var(--gold); }
      .mascot-bubble::before {
        content: "";
        position: absolute;
        top: 50%;
        left: -8px;
        transform: translateY(-50%);
        border: 8px solid transparent;
        border-right-color: rgba(36, 40, 94, 0.92);
      }
      .route-strip { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 26px; }
      .route-chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 13px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.06);
        color: var(--soft);
        font-size: 0.82rem;
        font-weight: 800;
        transition: transform 160ms ease, background 160ms ease;
      }
      .route-chip:hover { transform: translateY(-2px); background: rgba(255, 255, 255, 0.12); }
      .route-chip .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--p2, var(--gold)); }

      .planet-map {
        position: relative;
        width: min(100%, 540px);
        aspect-ratio: 1;
        margin: 0 auto;
      }
      .orbit-ring { position: absolute; border: 2px dashed rgba(255, 255, 255, 0.14); border-radius: 50%; }
      .ring-a { inset: 6%; }
      .ring-b { inset: 20%; transform: rotate(18deg); border-color: rgba(255, 216, 115, 0.18); }
      .map-star {
        position: absolute;
        width: 14px;
        height: 14px;
        transform: rotate(45deg);
        border-radius: 4px;
        background: var(--gold);
        opacity: 0.9;
      }
      .star-1 { top: 9%; right: 23%; }
      .star-2 { bottom: 9%; left: 24%; background: #ff9466; }
      .star-3 { top: 46%; left: -1%; background: #4fcfc0; }
      .map-core {
        position: absolute;
        top: 50%;
        left: 50%;
        display: grid;
        width: 190px;
        height: 190px;
        place-items: center;
        transform: translate(-50%, -50%);
        border: 6px solid rgba(255, 255, 255, 0.18);
        border-radius: 50%;
        background: radial-gradient(circle at 34% 28%, #fff6de, #ffd873 45%, #f2971d 100%);
        box-shadow: 0 0 60px rgba(255, 196, 107, 0.45), inset -14px -14px 30px rgba(140, 80, 0, 0.25);
        color: var(--gold-ink);
        text-align: center;
      }
      .map-core span, .map-core strong { display: block; }
      .map-core span { align-self: end; font-weight: 900; }
      .map-core strong { align-self: start; font-family: var(--font-display); font-size: 1.7rem; color: var(--gold-ink); }
      .map-mascot {
        position: absolute;
        top: -2%;
        right: 8%;
        width: 54px;
        height: 54px;
        animation: mascot-float 3.6s ease-in-out infinite;
        filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.3));
      }
      @keyframes mascot-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-7px); }
      }
      @keyframes node-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      .orbit-planet {
        position: absolute;
        display: grid;
        gap: 2px;
        width: 106px;
        height: 106px;
        place-items: center;
        border: 4px solid rgba(255, 255, 255, 0.16);
        border-radius: 50%;
        background: radial-gradient(circle at 32% 28%, var(--p1, #ffefb8), var(--p2, var(--gold)) 50%, var(--p3, var(--gold-dark)) 100%);
        box-shadow: 0 0 26px var(--glow, rgba(255, 216, 115, 0.5)), inset -8px -8px 18px rgba(0, 0, 0, 0.22), 0 16px 34px rgba(0, 0, 0, 0.35);
        color: #fff;
        text-align: center;
        transition: transform 220ms ease, box-shadow 220ms ease;
      }
      .orbit-planet:hover, .orbit-planet:focus-visible {
        transform: translateY(-8px) scale(1.08);
        outline: none;
        z-index: 5;
        box-shadow: 0 0 40px var(--glow, rgba(255, 216, 115, 0.6)), inset -8px -8px 18px rgba(0, 0, 0, 0.22), 0 20px 40px rgba(0, 0, 0, 0.4);
      }
      .orbit-planet-icon { display: block; width: 40px; height: 40px; animation: node-float 4.6s ease-in-out infinite; }
      .orbit-planet strong { font-size: 0.92rem; font-weight: 1000; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.35); }
      .orbit-planet .planet-tip {
        position: absolute;
        bottom: calc(100% + 10px);
        left: 50%;
        z-index: 6;
        width: 176px;
        padding: 10px 12px;
        transform: translate(-50%, 4px);
        border-radius: 14px;
        background: rgba(26, 30, 78, 0.96);
        border: 1px solid rgba(255, 255, 255, 0.14);
        box-shadow: 0 14px 30px rgba(0, 0, 0, 0.4);
        color: var(--ink);
        font-size: 0.8rem;
        font-weight: 700;
        line-height: 1.5;
        opacity: 0;
        pointer-events: none;
        transition: opacity 160ms ease, transform 160ms ease;
      }
      .orbit-planet .planet-tip b { display: block; margin-bottom: 2px; color: var(--gold); font-size: 0.82rem; }
      .orbit-planet:hover .planet-tip, .orbit-planet:focus-visible .planet-tip {
        transform: translate(-50%, 0);
        opacity: 1;
      }
      .node-1 { top: 0%; left: 38%; }
      .node-2 { top: 15%; right: 0%; }
      .node-3 { right: 2%; bottom: 16%; }
      .node-4 { bottom: -2%; left: 38%; }
      .node-5 { bottom: 16%; left: 0%; }
      .node-6 { top: 15%; left: 0%; }
      .node-2 .orbit-planet-icon { animation-delay: 0.3s; }
      .node-3 .orbit-planet-icon { animation-delay: 0.6s; }
      .node-4 .orbit-planet-icon { animation-delay: 0.9s; }
      .node-5 .orbit-planet-icon { animation-delay: 1.2s; }
      .node-6 .orbit-planet-icon { animation-delay: 1.5s; }

      .section-header { max-width: 820px; margin-bottom: 34px; }
      .section-header.center { margin-inline: auto; text-align: center; }
      .section-header p { margin-bottom: 10px; color: var(--gold); font-weight: 1000; }
      .level-grid, .planet-grid, .feature-list, .resource-shelf, .mission-board, .roadmap { display: grid; gap: 18px; }
      .level-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .planet-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .feature-list, .resource-shelf { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .mission-board { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .roadmap { grid-template-columns: repeat(3, minmax(0, 1fr)); }

      .level-card, .planet-card, .feature-card, .resource-card, .mission-card, .roadmap article, .lesson-detail, .community-panel {
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.06);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
      }
      .level-card { display: grid; gap: 12px; min-height: 260px; padding: 28px; }
      .level-card strong { align-self: end; color: var(--gold); }
      .level-badge, .age-pill {
        display: inline-flex;
        width: fit-content;
        margin-bottom: 10px;
        border-radius: 999px;
        padding: 6px 10px;
        background: rgba(255, 255, 255, 0.1);
        color: var(--soft);
        font-size: 0.82rem;
        font-weight: 1000;
      }
      .planet-card {
        position: relative;
        min-height: 300px;
        padding: 24px;
        isolation: isolate;
        border-top: 4px solid var(--p2, var(--gold));
        background: radial-gradient(140% 160% at 100% -10%, var(--glow, rgba(255, 216, 115, 0.16)), transparent 55%), rgba(255, 255, 255, 0.06);
      }
      .planet-card::after {
        content: "";
        position: absolute;
        right: -34px;
        bottom: -42px;
        z-index: -1;
        width: 132px;
        height: 132px;
        border-radius: 50%;
        background: radial-gradient(circle, var(--p2, var(--gold)), transparent 70%);
        opacity: 0.3;
      }
      .planet-card-link { display: block; transition: transform 200ms ease, box-shadow 200ms ease; }
      .planet-card-link:hover, .planet-card-link:focus-visible { transform: translateY(-6px); outline: none; box-shadow: 0 0 34px var(--glow, rgba(255, 216, 115, 0.35)); }
      .planet-enter-cta { display: inline-flex; margin-top: 16px; color: var(--gold); font-weight: 900; font-size: 0.92rem; }
      .mint   { --p1: #ffefb8; --p2: #ffc94a; --p3: #e8811a; --glow: rgba(255, 201, 74, 0.5); }
      .green  { --p1: #c9f2d6; --p2: #6fd08c; --p3: #2e8b57; --glow: rgba(111, 208, 140, 0.5); }
      .yellow { --p1: #cbe4fb; --p2: #5ca9f2; --p3: #2e6fd9; --glow: rgba(92, 169, 242, 0.5); }
      .coral  { --p1: #ffdcc9; --p2: #ff9466; --p3: #e8623a; --glow: rgba(255, 148, 102, 0.5); }
      .blue   { --p1: #cdf3ee; --p2: #4fcfc0; --p3: #279c92; --glow: rgba(79, 207, 192, 0.5); }
      .purple { --p1: #ebdcfb; --p2: #b98cf2; --p3: #7c4fd9; --glow: rgba(185, 140, 242, 0.5); }
      .planet-card-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
      .planet-icon-badge {
        display: grid;
        width: 56px;
        height: 56px;
        place-items: center;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25);
        color: var(--p2, var(--gold));
      }
      .planet-icon-badge svg { width: 36px; height: 36px; }
      .card-number {
        display: grid;
        width: 30px;
        height: 30px;
        place-items: center;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.12);
        color: var(--cream);
        font-size: 0.94rem;
        font-weight: 1000;
      }
      .english-label { margin-bottom: 4px; color: var(--muted); font-size: 0.96rem; font-weight: 900; }
      .theme-badge {
        display: inline-flex;
        width: fit-content;
        margin-bottom: 12px;
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.1);
        color: var(--soft);
        font-size: 0.82rem;
        font-weight: 1000;
      }
      .child-text { color: var(--ink); font-size: 1.04rem; font-weight: 800; }
      .tag-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
      .tag-row span {
        border-radius: 999px;
        padding: 7px 10px;
        background: rgba(255, 255, 255, 0.09);
        color: var(--soft);
        font-size: 0.86rem;
        font-weight: 900;
      }
      .tag-row.compact { margin-top: 0; }
      .tag-row.compact span { padding: 6px 9px; font-size: 0.78rem; }
      .planet-more { margin-top: 10px; }
      .planet-more summary {
        display: inline-flex;
        cursor: pointer;
        list-style: none;
        color: var(--soft);
        font-weight: 800;
        font-size: 0.86rem;
        text-decoration: underline;
        text-underline-offset: 3px;
      }
      .planet-more summary::-webkit-details-marker { display: none; }
      .planet-more summary::marker { content: ""; }
      .planet-more summary:hover { color: var(--gold); }
      .planet-more-body { display: grid; gap: 10px; margin-top: 12px; }
      .planet-more-body .english-label,
      .planet-more-body .theme-badge,
      .planet-more-body .english-note { margin-bottom: 0; }
      .planet-lessons, .planet-games { margin-top: 22px; padding-top: 18px; border-top: 1px dashed rgba(255, 255, 255, 0.15); }
      .planet-lessons h3, .planet-games h3 { font-size: 1.05rem; }
      .planet-lessons h3 small, .planet-games h3 small, .mission-block h4 small { color: var(--muted); font-weight: 800; }
      .planet-games .lesson-button { display: inline-flex; }
      .lesson-card {
        display: grid;
        gap: 12px;
        margin-top: 12px;
        padding: 16px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.05);
        box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
      }
      .lesson-card.recommended { outline: 2px solid var(--gold); }
      .lesson-button { min-height: 40px; border: 1px solid rgba(255, 255, 255, 0.18); background: rgba(255, 255, 255, 0.07); color: var(--gold); font-size: 0.9rem; }

      .back-link { display: inline-flex; margin-bottom: 18px; color: var(--gold); font-weight: 1000; }
      .lesson-hero, .game-hero {
        margin-bottom: 20px;
        padding: 34px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 32px;
        background: linear-gradient(135deg, var(--p3, var(--gold-dark)), var(--p2, var(--gold)));
        box-shadow: 0 20px 50px var(--glow, rgba(255, 216, 115, 0.3)), inset 0 -6px 0 rgba(0, 0, 0, 0.15);
        color: var(--gold-ink);
      }
      .lesson-hero h1, .lesson-hero p, .game-hero h1, .game-hero p { color: var(--gold-ink); }
      .lesson-hero .english-note, .game-hero .english-note { color: rgba(58, 34, 0, 0.72); }
      .lesson-hero .tag-row span, .game-hero .tag-row span { background: rgba(255, 255, 255, 0.55); color: var(--gold-ink); }
      .game-instructions { max-width: 640px; font-weight: 800; }

      .planet-hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 180px;
        align-items: center;
        gap: 32px;
        margin-bottom: 40px;
        padding: 34px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 32px;
        background: linear-gradient(135deg, var(--p3, var(--gold-dark)), var(--p2, var(--gold)));
        box-shadow: 0 20px 50px var(--glow, rgba(255, 216, 115, 0.3)), inset 0 -6px 0 rgba(0, 0, 0, 0.15);
        color: var(--gold-ink);
      }
      .planet-hero h1, .planet-hero p { color: var(--gold-ink); margin-bottom: 0; }
      .planet-hero .pill { background: rgba(255, 255, 255, 0.35); border-color: rgba(255, 255, 255, 0.5); color: var(--gold-ink); margin-bottom: 14px; }
      .planet-hero h1 { margin-bottom: 10px; font-size: clamp(1.9rem, 3.4vw, 2.8rem); }
      .planet-hero-en { font-size: 0.5em; font-weight: 700; opacity: 0.7; }
      .planet-hero-intro { margin-bottom: 22px; max-width: 520px; font-weight: 700; }
      .progress-row { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
      .progress-track { flex: 1; max-width: 280px; height: 10px; border-radius: 999px; background: rgba(0, 0, 0, 0.18); overflow: hidden; }
      .progress-fill { width: 0%; height: 100%; border-radius: 999px; background: var(--gold-ink); transition: width 400ms ease; }
      .progress-label { font-size: 0.88rem; font-weight: 900; white-space: nowrap; }
      .planet-hero-orb {
        display: grid;
        place-items: center;
        width: 160px;
        height: 160px;
        margin: 0 auto;
        border-radius: 50%;
        border: 3px dashed rgba(255, 255, 255, 0.4);
        background: radial-gradient(circle at 32% 28%, var(--p1, #ffefb8), var(--p2, var(--gold)) 55%, var(--p3, var(--gold-dark)) 100%);
        box-shadow: 0 0 40px rgba(0, 0, 0, 0.2), inset -10px -10px 20px rgba(0, 0, 0, 0.2);
      }
      .planet-hero-orb svg { width: 70px; height: 70px; }

      .planet-map-grid { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 48px; align-items: start; }
      .level-path { position: relative; padding: 20px 0 10px; }
      .level-path::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 0;
        border-left: 3px dashed rgba(255, 255, 255, 0.16);
        transform: translateX(-50%);
        z-index: 0;
      }
      .level-path-empty { color: var(--soft); font-weight: 700; }
      .level-node { position: relative; z-index: 1; display: grid; justify-items: center; gap: 8px; margin-bottom: 44px; }
      .level-node-circle {
        display: grid;
        place-items: center;
        width: 84px;
        height: 84px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.08);
        border: 2px solid rgba(255, 255, 255, 0.14);
        box-shadow: 0 10px 22px rgba(0, 0, 0, 0.3);
        color: var(--cream);
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 1.3rem;
        transition: transform 200ms ease;
      }
      .level-node-label { max-width: 130px; color: var(--soft); font-weight: 800; font-size: 0.86rem; text-align: center; }
      .level-node:hover .level-node-circle { transform: translateY(-4px); }
      .level-node.is-done .level-node-circle {
        background: linear-gradient(160deg, var(--gold), var(--gold-dark));
        border-color: rgba(255, 255, 255, 0.3);
        color: var(--gold-ink);
        box-shadow: 0 10px 22px var(--gold-glow), inset 0 -6px 0 rgba(0, 0, 0, 0.15);
      }
      .level-node.is-done .level-node-label { color: var(--cream); }
      .level-node.is-current .level-node-circle {
        width: 104px;
        height: 104px;
        background: radial-gradient(circle at 32% 28%, #ffefb8, var(--gold) 55%, var(--gold-dark) 100%);
        border-color: rgba(255, 255, 255, 0.4);
        color: var(--gold-ink);
        font-size: 1.6rem;
        box-shadow: 0 10px 26px var(--gold-glow), inset -8px -8px 16px rgba(0, 0, 0, 0.18);
        animation: pulse-glow 2.2s ease-in-out infinite;
      }
      .level-node.is-current .level-node-label { color: var(--cream); font-weight: 1000; }
      .level-node.is-locked .level-node-circle { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.1); color: var(--muted); box-shadow: none; }
      .level-node.is-locked .level-node-label { color: var(--muted); }
      .level-node.is-locked .level-node-circle { pointer-events: none; cursor: default; }
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 0 0 var(--gold-glow), inset -8px -8px 16px rgba(0, 0, 0, 0.18); }
        50% { box-shadow: 0 0 0 16px rgba(242, 151, 29, 0), inset -8px -8px 16px rgba(0, 0, 0, 0.18); }
      }

      .map-sidebar { position: sticky; top: 90px; display: flex; flex-direction: column; gap: 20px; }
      .tip-card, .stats-card {
        display: flex;
        gap: 14px;
        padding: 22px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 22px;
        background: rgba(255, 255, 255, 0.06);
      }
      .tip-avatar { flex: 0 0 auto; width: 46px; height: 46px; }
      .tip-card h4 { margin-bottom: 6px; font-size: 1rem; }
      .tip-card p { margin: 0; color: var(--soft); font-size: 0.9rem; font-weight: 700; line-height: 1.6; }
      .stats-card { flex-direction: column; gap: 14px; }
      .stats-row { display: flex; align-items: center; justify-content: space-between; font-size: 0.9rem; }
      .stats-row span { color: var(--soft); font-weight: 800; }
      .stats-row strong { color: var(--gold); font-family: var(--font-display); }
      .map-sidebar .planet-games { margin-top: 0; padding-top: 0; border-top: none; padding: 22px; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 22px; background: rgba(255, 255, 255, 0.06); }
      .money-match {
        max-width: 640px;
        margin: 0 auto;
        padding: 28px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 28px;
        background: rgba(255, 255, 255, 0.06);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        text-align: center;
      }
      .mm-scoreboard {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 14px;
        margin-bottom: 24px;
        font-weight: 800;
        color: var(--soft);
      }
      .mm-scoreboard strong { color: var(--gold); }
      .mm-badge-pill {
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(255, 216, 104, 0.16);
        font-weight: 900;
        color: var(--gold);
      }
      .mm-stage { display: grid; justify-items: center; gap: 10px; margin-bottom: 26px; }
      .mm-stage[hidden], .mm-bins[hidden], .mm-result[hidden] { display: none; }
      .mm-mascot { width: 56px; height: 56px; animation: mascot-float 3.6s ease-in-out infinite; }
      .mm-item-card {
        display: grid;
        gap: 10px;
        width: min(100%, 320px);
        padding: 28px 20px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 26px;
        background: linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.03));
        box-shadow: 0 14px 30px rgba(0, 0, 0, 0.28);
        transition: box-shadow 200ms ease;
      }
      .mm-item-icon { font-size: 2.6rem; line-height: 1; }
      .mm-item-label { font-size: 1.08rem; font-weight: 900; color: var(--cream); }
      .mm-item-card.mm-correct { animation: mm-pop 400ms ease; box-shadow: 0 0 0 5px rgba(111, 208, 140, 0.6); }
      .mm-item-card.mm-wrong { animation: mm-shake 400ms ease; box-shadow: 0 0 0 5px rgba(255, 148, 102, 0.6); }
      @keyframes mm-pop {
        0% { transform: scale(1); }
        45% { transform: scale(1.08); }
        100% { transform: scale(1); }
      }
      @keyframes mm-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-7px); }
        75% { transform: translateX(7px); }
      }
      .mm-bins { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; }
      .mm-bin {
        display: grid;
        gap: 4px;
        width: 118px;
        padding: 16px 10px;
        border: none;
        border-radius: 22px;
        background: radial-gradient(circle at 32% 28%, var(--p1, #ffefb8), var(--p2, var(--gold)) 55%, var(--p3, var(--gold-dark)) 100%);
        color: #20323d;
        font-family: inherit;
        cursor: pointer;
        transition: transform 160ms ease, box-shadow 160ms ease;
        box-shadow: 0 10px 22px var(--glow, rgba(255, 216, 115, 0.35)), inset -6px -6px 14px rgba(0, 0, 0, 0.18);
      }
      .mm-bin:hover, .mm-bin:focus-visible { transform: translateY(-4px); outline: none; }
      .mm-bin-icon { font-size: 1.6rem; }
      .mm-bin strong { font-size: 0.98rem; }
      .mm-bin small { font-weight: 800; opacity: 0.75; }
      .mm-result h2 { font-size: 1.6rem; }
      .mm-badge-earned { margin-top: 6px; color: var(--gold); font-weight: 900; }
      .tch-root {
        max-width: 680px;
        margin: 0 auto;
        padding: 28px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 28px;
        background: rgba(255, 255, 255, 0.06);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
        text-align: center;
      }
      .tch-hud {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 18px;
        margin-bottom: 16px;
        font-weight: 800;
        color: var(--soft);
      }
      .tch-hud strong { color: var(--gold); }
      .tch-hud strong.tch-bump { animation: mm-pop 350ms ease; }
      .tch-hud[hidden] { display: none; }
      .tch-stage-wrap {
        position: relative;
        max-width: 800px;
        margin: 0 auto;
        border-radius: 24px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.14);
        box-shadow: 0 14px 30px rgba(0, 0, 0, 0.35);
      }
      .tch-stage-wrap[hidden] { display: none; }
      .tch-phaser-root { width: 100%; aspect-ratio: 800 / 300; background: var(--bg-mid); touch-action: none; line-height: 0; }
      .tch-toast {
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%) translateY(-6px);
        opacity: 0;
        padding: 8px 16px;
        border-radius: 999px;
        background: linear-gradient(135deg, var(--gold-dark), #e8623a);
        color: #fff9ec;
        font-weight: 900;
        font-size: 0.92rem;
        box-shadow: 0 10px 22px rgba(232, 98, 58, 0.4);
        pointer-events: none;
        transition: opacity 200ms ease, transform 200ms ease;
      }
      .tch-toast-show { opacity: 1; transform: translateX(-50%) translateY(0); }
      .tch-toast-good { background: linear-gradient(135deg, #6fd08c, #2e8b57); box-shadow: 0 10px 22px rgba(111, 208, 140, 0.45); }
      .tch-controls {
        display: flex;
        justify-content: center;
        gap: 16px;
        margin-top: 16px;
      }
      .tch-controls[hidden] { display: none; }
      .tch-btn {
        width: 56px;
        height: 56px;
        border: none;
        border-radius: 50%;
        background: linear-gradient(145deg, #4fcfc0, #279c92);
        color: white;
        font-size: 1.4rem;
        cursor: pointer;
        box-shadow: 0 10px 22px rgba(0, 0, 0, 0.3);
        transition: transform 160ms ease;
      }
      .tch-btn:hover, .tch-btn:focus-visible { transform: translateY(-3px); outline: none; }
      .tch-btn:active { transform: translateY(1px); }
      .tch-btn-jump { background: linear-gradient(145deg, var(--gold), var(--gold-dark)); }
      .tch-hint { margin-top: 14px; font-weight: 700; color: var(--soft); }
      .tch-hint[hidden] { display: none; }
      .tch-panel { max-width: 560px; margin: 0 auto; }
      .tch-panel h2 { font-size: 1.5rem; }
      .tch-shop-items {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 12px;
        margin: 18px 0;
      }
      .tch-shop-item {
        display: grid;
        gap: 4px;
        justify-items: center;
        width: 108px;
        padding: 14px 8px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.07);
        color: var(--ink);
        font-family: inherit;
        cursor: pointer;
        box-shadow: 0 10px 22px rgba(0, 0, 0, 0.25);
        transition: transform 160ms ease, opacity 160ms ease;
      }
      .tch-shop-item:hover:not(:disabled) { transform: translateY(-4px); }
      .tch-shop-item:disabled { opacity: 0.4; cursor: not-allowed; }
      .tch-shop-icon { font-size: 1.6rem; }
      .tch-shop-price { font-size: 0.82rem; font-weight: 800; color: var(--gold); }
      .tch-shop-count { font-size: 0.78rem; font-weight: 800; color: #ff9466; min-height: 1em; }
      .tch-wallet { font-weight: 800; color: var(--soft); }
      .tch-wallet strong { color: var(--gold); }

      /* Want or Need sorting game (wn-*) */
      @keyframes wn-pop-in { 0% { opacity: 0; transform: translateY(14px) scale(0.94); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
      @keyframes wn-badge-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(143, 224, 168, 0.5); } 50% { box-shadow: 0 0 0 12px rgba(143, 224, 168, 0); } }
      .wn-root { max-width: 640px; margin: 0 auto; font-family: 'Nunito', sans-serif; }
      .wn-hl-need { color: #8fe0a8; }
      .wn-hl-want { color: #ffd873; }

      .wn-intro-card { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 22px; padding: 30px 28px; animation: wn-pop-in 0.34s ease; }
      .wn-intro-text { font-size: 15px; line-height: 1.9; color: #d9d6f0; margin: 0 0 20px; }
      .wn-info-row { display: flex; gap: 14px; margin-bottom: 24px; flex-wrap: wrap; }
      .wn-info-chip { flex: 1; min-width: 180px; border-radius: 16px; padding: 16px 18px; }
      .wn-info-chip.wn-info-need { background: rgba(111, 208, 140, 0.12); border: 1px solid rgba(143, 224, 168, 0.35); }
      .wn-info-chip.wn-info-want { background: rgba(255, 216, 115, 0.1); border: 1px solid rgba(255, 216, 115, 0.35); }
      .wn-info-icon { font-size: 24px; margin-bottom: 6px; }
      .wn-info-chip.wn-info-need .wn-info-title { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 16px; color: #8fe0a8; }
      .wn-info-chip.wn-info-want .wn-info-title { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 16px; color: #ffd873; }
      .wn-info-chip.wn-info-need .wn-info-sub { font-size: 13px; color: #b9d9c4; margin-top: 4px; }
      .wn-info-chip.wn-info-want .wn-info-sub { font-size: 13px; color: #e6d9ae; margin-top: 4px; }
      .wn-start-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
      .wn-start-btn {
        cursor: pointer; border: none; padding: 14px 34px; border-radius: 999px; font-family: 'Nunito', sans-serif;
        font-weight: 800; font-size: 16px; background: linear-gradient(135deg, #6fd08c, #2e8b57); color: #0e3a20;
      }
      .wn-start-btn:hover { filter: brightness(1.06); }
      .wn-total-note { font-size: 13px; color: #8f8cc0; }

      .wn-progress-row { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
      .wn-progress-track { flex: 1; height: 10px; border-radius: 999px; background: rgba(255, 255, 255, 0.1); overflow: hidden; }
      .wn-progress-fill { height: 100%; background: linear-gradient(90deg, #6fd08c, #2e8b57); border-radius: 999px; transition: width 0.4s ease; }
      .wn-progress-label { font-size: 13px; font-weight: 800; color: #c6c3ec; flex-shrink: 0; }
      .wn-score-chip { display: inline-flex; align-items: center; gap: 5px; background: rgba(255, 255, 255, 0.08); padding: 5px 12px; border-radius: 999px; flex-shrink: 0; font-weight: 800; font-size: 13px; color: #ffefc9; }

      .wn-card-box {
        background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 22px;
        padding: 26px 24px; margin-bottom: 18px; min-height: 236px; display: flex; flex-direction: column;
        align-items: center; justify-content: center;
      }
      .wn-card { display: flex; flex-direction: column; align-items: center; animation: wn-pop-in 0.34s cubic-bezier(.2, .9, .3, 1.2); }
      .wn-card-face {
        width: 150px; height: 170px; border-radius: 20px; background: linear-gradient(160deg, #ffffff, #edeafb);
        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35); display: flex; align-items: center; justify-content: center;
        border: 1px solid rgba(255, 255, 255, 0.6);
      }
      .wn-card-emoji { font-size: 64px; line-height: 1; }
      .wn-card-name { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 22px; color: #fff9ec; margin-top: 16px; }
      .wn-card-en { font-size: 14px; color: #9b98cc; font-weight: 700; }
      .wn-card-hint { font-size: 13px; color: #8fe0a8; font-weight: 800; margin-top: 12px; }

      .wn-feedback { display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%; animation: wn-pop-in 0.34s cubic-bezier(.2, .9, .3, 1.2); }
      .wn-feedback-emoji { font-size: 44px; line-height: 1; }
      .wn-feedback-title { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 20px; margin-top: 8px; }
      .wn-feedback-title-good { color: #8fe0a8; }
      .wn-feedback-title-hint { color: #ffd873; }
      .wn-feedback-desc { font-size: 14px; color: #d9d6f0; margin-top: 6px; max-width: 420px; line-height: 1.6; }
      .wn-reasons { margin-top: 18px; width: 100%; }
      .wn-reasons-label { font-size: 13px; font-weight: 800; color: #8f8cc0; margin-bottom: 10px; }
      .wn-reasons-row { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
      .wn-reason-btn {
        cursor: pointer; border: 1px solid rgba(255, 255, 255, 0.15); padding: 10px 18px; border-radius: 999px;
        font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 14px; background: rgba(255, 255, 255, 0.06);
        color: #e5e2fb; transition: all 0.18s ease;
      }
      .wn-reason-btn:hover:not(:disabled) { filter: brightness(1.08); }
      .wn-reason-btn.is-chosen { border-color: rgba(143, 224, 168, 0.6); background: rgba(111, 208, 140, 0.22); color: #bff0ce; }
      .wn-reason-btn.is-dim { color: #7c7aa6; cursor: default; }
      .wn-reason-btn:disabled { cursor: default; }
      .wn-next-btn {
        margin-top: 20px; cursor: pointer; border: none; padding: 12px 32px; border-radius: 999px;
        font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 15px;
        background: linear-gradient(135deg, #ffd873, #f2971d); color: #3a2200;
      }
      .wn-next-btn:hover { filter: brightness(1.06); }

      .wn-baskets { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .wn-basket {
        cursor: pointer; text-align: left; border-radius: 20px; padding: 18px 18px 14px;
        transition: transform 0.15s ease, filter 0.15s ease; font-family: inherit;
      }
      .wn-basket:hover:not(:disabled) { filter: brightness(1.06); transform: translateY(-3px); }
      .wn-basket:disabled { cursor: default; }
      .wn-basket-need { border: 1px solid rgba(143, 224, 168, 0.4); background: rgba(111, 208, 140, 0.12); }
      .wn-basket-want { border: 1px solid rgba(255, 216, 115, 0.4); background: rgba(255, 216, 115, 0.1); }
      .wn-basket-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
      .wn-basket-icon { font-size: 26px; }
      .wn-basket-need .wn-basket-title { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 18px; color: #8fe0a8; }
      .wn-basket-want .wn-basket-title { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 18px; color: #ffd873; }
      .wn-basket-en { font-size: 13px; }
      .wn-basket-need .wn-basket-en { color: #b9d9c4; }
      .wn-basket-want .wn-basket-en { color: #e6d9ae; }
      .wn-basket-pile { min-height: 34px; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
      .wn-chip { font-size: 22px; animation: wn-pop-in 0.3s ease; }
      .wn-basket-need .wn-basket-empty { font-size: 12px; color: #7f9c89; }
      .wn-basket-want .wn-basket-empty { font-size: 12px; color: #b0a374; }

      .wn-done-card { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 22px; padding: 34px 28px; text-align: center; animation: wn-pop-in 0.34s ease; }
      .wn-done-badge-orb {
        width: 88px; height: 88px; margin: 0 auto 16px; border-radius: 50%;
        background: radial-gradient(circle at 32% 28%, #c9f2d6, #6fd08c 55%, #2e8b57 100%);
        box-shadow: 0 6px 18px rgba(46, 139, 87, 0.4); display: flex; align-items: center; justify-content: center;
        font-size: 40px; animation: wn-badge-glow 2.2s ease-out infinite;
      }
      .wn-done-title { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 24px; color: #fff9ec; }
      .wn-done-score { font-size: 15px; color: #d9d6f0; margin-top: 8px; }
      .wn-done-badge-row {
        display: inline-flex; align-items: center; gap: 12px; background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(143, 224, 168, 0.3); border-radius: 16px; padding: 14px 20px; margin-top: 20px;
      }
      .wn-done-badge-icon { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #c9f2d6, #2e8b57); display: flex; align-items: center; justify-content: center; font-size: 22px; }
      .wn-done-badge-name { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 15px; color: #fff9ec; text-align: left; }
      .wn-done-badge-unlocked { font-size: 12px; color: #8fe0a8; font-weight: 700; text-align: left; }
      .wn-done-actions { display: flex; gap: 12px; justify-content: center; margin-top: 26px; flex-wrap: wrap; }
      .wn-ghost-btn {
        text-decoration: none; cursor: pointer; padding: 13px 30px; border-radius: 999px; font-weight: 800;
        font-size: 15px; background: rgba(255, 255, 255, 0.08); color: #efebff; font-family: 'Nunito', sans-serif;
        transition: background 0.15s ease; display: inline-flex; align-items: center; justify-content: center;
      }
      .wn-ghost-btn:hover { background: rgba(255, 255, 255, 0.16); }

      @media (max-width: 640px) {
        .wn-baskets { grid-template-columns: 1fr; }
      }

      /* Tiny Shopkeeper game (ts-*) */
      @keyframes ts-pop-in { 0% { opacity: 0; transform: translateY(14px) scale(0.94); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
      @keyframes ts-drop-in { 0% { opacity: 0; transform: scale(0.3) translateY(-10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
      @keyframes ts-badge-glow { 0%, 100% { box-shadow: 0 0 0 0 rgba(255, 148, 102, 0.5); } 50% { box-shadow: 0 0 0 12px rgba(255, 148, 102, 0); } }
      .ts-root { max-width: 640px; margin: 0 auto; font-family: 'Nunito', sans-serif; }
      .ts-hl-price { color: #ffb18f; }
      .ts-hl-change { color: #ffd873; }

      .ts-intro-card { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 22px; padding: 30px 28px; animation: ts-pop-in 0.32s ease; }
      .ts-intro-text { font-size: 15px; line-height: 1.9; color: #d9d6f0; margin: 0 0 22px; }
      .ts-info-row { display: flex; gap: 14px; margin-bottom: 24px; flex-wrap: wrap; }
      .ts-info-chip { flex: 1; min-width: 180px; border-radius: 16px; padding: 16px 18px; }
      .ts-info-chip.ts-info-price { background: rgba(255, 148, 102, 0.12); border: 1px solid rgba(255, 177, 143, 0.35); }
      .ts-info-chip.ts-info-change { background: rgba(255, 216, 115, 0.1); border: 1px solid rgba(255, 216, 115, 0.35); }
      .ts-info-icon { font-size: 24px; margin-bottom: 6px; }
      .ts-info-chip.ts-info-price .ts-info-title { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 16px; color: #ffb18f; }
      .ts-info-chip.ts-info-change .ts-info-title { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 16px; color: #ffd873; }
      .ts-info-chip.ts-info-price .ts-info-sub { font-size: 13px; color: #e6c3b4; margin-top: 4px; }
      .ts-info-chip.ts-info-change .ts-info-sub { font-size: 13px; color: #e6d9ae; margin-top: 4px; }
      .ts-start-row { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
      .ts-start-btn {
        cursor: pointer; border: none; padding: 14px 34px; border-radius: 999px; font-family: 'Nunito', sans-serif;
        font-weight: 800; font-size: 16px; background: linear-gradient(135deg, #ff9466, #e8623a); color: #5a1e0a;
      }
      .ts-start-btn:hover { filter: brightness(1.06); }
      .ts-total-note { font-size: 13px; color: #8f8cc0; }

      .ts-progress-row { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; }
      .ts-progress-track { flex: 1; height: 10px; border-radius: 999px; background: rgba(255, 255, 255, 0.1); overflow: hidden; }
      .ts-progress-fill { height: 100%; background: linear-gradient(90deg, #ff9466, #e8623a); border-radius: 999px; transition: width 0.4s ease; }
      .ts-progress-label { font-size: 13px; font-weight: 800; color: #c6c3ec; flex-shrink: 0; }
      .ts-score-chip { display: inline-flex; align-items: center; gap: 5px; background: rgba(255, 255, 255, 0.08); padding: 5px 12px; border-radius: 999px; flex-shrink: 0; font-weight: 800; font-size: 13px; color: #ffefc9; }

      .ts-counter {
        background: linear-gradient(180deg, rgba(255, 148, 102, 0.14), rgba(255, 148, 102, 0.05));
        border: 1px solid rgba(255, 177, 143, 0.28); border-radius: 22px 22px 0 0; padding: 20px 22px;
        display: flex; align-items: center; gap: 16px;
      }
      .ts-cust-emoji { font-size: 46px; line-height: 1; flex-shrink: 0; }
      .ts-cust-bubble { background: rgba(255, 255, 255, 0.96); color: #5a1e0a; font-size: 14px; font-weight: 700; padding: 11px 16px; border-radius: 14px 14px 14px 3px; box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2); line-height: 1.5; }
      .ts-counter-body { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-top: none; border-radius: 0 0 22px 22px; padding: 24px 22px; }
      .ts-item-row { display: flex; align-items: center; gap: 14px; justify-content: center; margin-bottom: 20px; }
      .ts-item-icon { width: 76px; height: 76px; border-radius: 18px; background: linear-gradient(160deg, #ffffff, #fdebe2); box-shadow: 0 8px 18px rgba(0, 0, 0, 0.28); display: flex; align-items: center; justify-content: center; font-size: 40px; }
      .ts-item-name { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 20px; color: #fff9ec; }
      .ts-item-en { font-size: 13px; color: #9b98cc; font-weight: 700; }

      .ts-step-label { text-align: center; font-size: 14px; font-weight: 800; margin-bottom: 14px; }
      .ts-price-row { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
      .ts-price-btn {
        min-width: 76px; cursor: pointer; border: 1.5px solid rgba(255, 255, 255, 0.14); padding: 14px 20px;
        border-radius: 16px; font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 19px;
        background: rgba(255, 255, 255, 0.08); color: #f1eefb; transition: all 0.18s ease;
      }
      .ts-price-btn:hover:not(:disabled) { filter: brightness(1.07); transform: translateY(-2px); }
      .ts-price-btn:disabled { cursor: default; }
      .ts-price-btn.is-fair { background: rgba(111, 208, 140, 0.24); color: #bff0ce; border-color: rgba(143, 224, 168, 0.55); }
      .ts-price-btn.is-wrong { background: rgba(224, 90, 90, 0.24); color: #ffd3d3; border-color: rgba(224, 120, 120, 0.5); }
      .ts-price-btn.is-dim { background: rgba(255, 255, 255, 0.04); color: #7c7aa6; }
      .ts-price-feedback { text-align: center; margin-top: 16px; animation: ts-pop-in 0.32s ease; }
      .ts-price-feedback-text { font-size: 14px; color: #d9d6f0; line-height: 1.6; max-width: 440px; margin: 0 auto; }

      .ts-cta-btn {
        margin-top: 16px; cursor: pointer; border: none; padding: 11px 28px; border-radius: 999px;
        font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 14px;
        background: linear-gradient(135deg, #ffd873, #f2971d); color: #3a2200; transition: filter 0.15s ease;
      }
      .ts-cta-btn:hover:not(:disabled) { filter: brightness(1.06); }
      .ts-cta-btn:disabled { opacity: 0.45; cursor: default; }
      .ts-give-btn { margin-top: 0; padding: 9px 24px; background: linear-gradient(135deg, #ff9466, #e8623a); color: #5a1e0a; }

      .ts-tx-summary { display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; background: rgba(0, 0, 0, 0.16); border-radius: 14px; padding: 12px 14px; margin-bottom: 6px; }
      .ts-tx-label { font-size: 13px; color: #c6c3ec; font-weight: 700; }
      .ts-tx-val { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 16px; color: #fff9ec; }
      .ts-tx-dot { color: #8f8cc0; }
      .ts-need-change { text-align: center; font-size: 15px; font-weight: 800; color: #ffd873; margin-bottom: 16px; }
      .ts-need-change-big { font-size: 20px; }

      .ts-tray { min-height: 56px; border: 1.5px dashed rgba(255, 255, 255, 0.22); border-radius: 14px; padding: 10px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; justify-content: center; margin-bottom: 6px; }
      .ts-tray-coin { display: inline-flex; align-items: center; justify-content: center; min-width: 40px; height: 40px; border-radius: 50%; font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 14px; color: #3a2200; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3); border: 1.5px solid rgba(255, 255, 255, 0.5); animation: ts-drop-in 0.28s ease; }
      .ts-tray-empty { font-size: 13px; color: #7c7aa6; }
      .ts-tray-total { text-align: center; font-size: 13px; font-weight: 800; margin-bottom: 16px; }
      .ts-tray-total.is-exact { color: #8fe0a8; }
      .ts-tray-total.is-over { color: #ff9e8a; }
      .ts-tray-total.is-under { color: #c6c3ec; }

      .ts-coin-row { display: flex; gap: 12px; justify-content: center; margin-bottom: 16px; }
      .ts-coin-btn {
        width: 60px; height: 60px; border-radius: 50%; cursor: pointer; border: 2px solid rgba(255, 255, 255, 0.55);
        font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 17px; color: #3a2200;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3); transition: transform 0.15s ease, filter 0.15s ease;
      }
      .ts-coin-btn:hover:not(:disabled) { transform: translateY(-3px); filter: brightness(1.06); }
      .ts-coin-btn:disabled { cursor: default; opacity: 0.55; }

      .ts-tray-actions { display: flex; gap: 10px; justify-content: center; }
      .ts-ghost-btn {
        cursor: pointer; border: none; padding: 9px 18px; border-radius: 999px; font-family: 'Nunito', sans-serif;
        font-weight: 700; font-size: 13px; background: rgba(255, 255, 255, 0.08); color: #e5e2fb; transition: background 0.15s ease;
      }
      .ts-ghost-btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.12); }
      .ts-ghost-btn:disabled { opacity: 0.4; cursor: default; }

      .ts-change-feedback { text-align: center; margin-top: 20px; animation: ts-pop-in 0.32s ease; }
      .ts-change-feedback-emoji { font-size: 40px; line-height: 1; }
      .ts-change-feedback-title { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 19px; margin-top: 6px; }
      .ts-change-title-good { color: #8fe0a8; }
      .ts-change-title-hint { color: #ffd873; }
      .ts-change-feedback-desc { font-size: 14px; color: #d9d6f0; margin-top: 6px; line-height: 1.6; max-width: 440px; margin-left: auto; margin-right: auto; }

      .ts-done-card { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 22px; padding: 34px 28px; text-align: center; animation: ts-pop-in 0.32s ease; }
      .ts-done-badge-orb {
        width: 88px; height: 88px; margin: 0 auto 16px; border-radius: 50%;
        background: radial-gradient(circle at 32% 28%, #ffdcc9, #ff9466 55%, #e8623a 100%);
        box-shadow: 0 6px 18px rgba(232, 98, 58, 0.4); display: flex; align-items: center; justify-content: center;
        font-size: 40px; animation: ts-badge-glow 2.2s ease-out infinite;
      }
      .ts-done-title { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 24px; color: #fff9ec; }
      .ts-done-score { font-size: 15px; color: #d9d6f0; margin-top: 8px; }
      .ts-done-sub { font-size: 13px; color: #9b98cc; margin-top: 4px; }
      .ts-done-badge-row {
        display: inline-flex; align-items: center; gap: 12px; background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 177, 143, 0.3); border-radius: 16px; padding: 14px 20px; margin-top: 20px;
      }
      .ts-done-badge-icon { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #ffdcc9, #e8623a); display: flex; align-items: center; justify-content: center; font-size: 22px; }
      .ts-done-badge-name { font-family: 'Fredoka', sans-serif; font-weight: 700; font-size: 15px; color: #fff9ec; text-align: left; }
      .ts-done-badge-unlocked { font-size: 12px; color: #ffb18f; font-weight: 700; text-align: left; }
      .ts-done-actions { display: flex; gap: 12px; justify-content: center; margin-top: 26px; flex-wrap: wrap; }
      .ts-ghost-link {
        text-decoration: none; cursor: pointer; padding: 13px 30px; border-radius: 999px; font-weight: 800;
        font-size: 15px; background: rgba(255, 255, 255, 0.08); color: #efebff; font-family: 'Nunito', sans-serif;
        transition: background 0.15s ease; display: inline-flex; align-items: center; justify-content: center;
      }
      .ts-ghost-link:hover { background: rgba(255, 255, 255, 0.16); }

      .lesson-detail {
        display: grid;
        gap: 14px;
        max-width: 920px;
        padding: 24px;
        background: rgba(255, 255, 255, 0.06);
      }
      .mission-block {
        padding: 14px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.05);
      }
      .mission-block.highlight { background: rgba(255, 216, 104, 0.14); }
      .mission-block h4 { margin-bottom: 8px; color: var(--cream); }
      .mission-block p, .mission-block ol { margin-bottom: 0; }
      .mission-block ol { padding-left: 20px; }
      .mission-block li + li { margin-top: 6px; }
      .badge-line {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-top: 4px;
        padding: 14px;
        border-radius: 18px;
        background: linear-gradient(135deg, rgba(111, 208, 140, 0.18), rgba(79, 207, 192, 0.14));
      }
      .badge-line span { color: var(--soft); font-weight: 900; }
      .badge-line strong { color: var(--gold); }
      .lesson-complete-row { display: flex; justify-content: center; margin-top: 20px; }
      .lesson-complete-row .button:disabled { opacity: 0.6; cursor: default; transform: none; }

      /* Interactive lesson (il-*) */
      .il-hero-banner {
        position: relative;
        margin-bottom: 26px;
        padding: 34px 40px 40px;
        border-radius: 40px;
        background: linear-gradient(135deg, #ffc14d 0%, #f7a92c 55%, #f39c12 100%);
        box-shadow: 0 14px 44px rgba(245, 166, 35, 0.35);
        color: #3a2404;
      }
      .il-hero-eyebrow { font-size: 18px; font-weight: 700; color: #5c3a00; margin-bottom: 8px; }
      .il-hero-title { font-family: 'ZCOOL KuaiLe', sans-serif; font-weight: 400; font-size: clamp(2.6rem, 7vw, 4.6rem); line-height: 1.1; color: #3a2404; margin: 0 0 4px; }
      .il-hero-en { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 20px; color: #6b4200; margin-bottom: 20px; }
      .il-hero-tags { display: flex; gap: 10px; flex-wrap: wrap; }
      .il-hero-tags span { background: rgba(255, 246, 224, 0.85); border-radius: 999px; padding: 9px 18px; font-size: 14px; font-weight: 700; color: #6b4200; }

      .il-root { max-width: 720px; margin: 0 auto; }
      .il-steps { display: flex; gap: 6px; justify-content: space-between; margin-bottom: 22px; }
      .il-step {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        padding: 10px 4px;
        border-radius: 16px;
        cursor: pointer;
        font-family: inherit;
        background: rgba(255, 255, 255, 0.05);
        color: var(--muted);
        border: 2px solid rgba(255, 255, 255, 0.1);
      }
      .il-step.is-reachable { background: rgba(255, 255, 255, 0.1); color: var(--ink); }
      .il-step.is-active { background: linear-gradient(180deg, #ffdf7e, #f5a623); color: #5c3a00; border-color: #fff3cf; box-shadow: 0 4px 0 rgba(0, 0, 0, 0.28); }
      .il-step:disabled { cursor: default; }
      .il-step-icon { font-size: 1.15rem; }
      .il-step-label { font-size: 0.68rem; font-weight: 800; }

      .il-stage { animation: slide-up-il 0.4s ease; }
      @keyframes slide-up-il { 0% { transform: translateY(24px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
      @keyframes pop-in-il { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
      @keyframes shake-il { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }

      .il-card {
        background: #f7f4ff;
        border-radius: 26px;
        padding: 30px;
        box-shadow: 0 8px 0 rgba(0, 0, 0, 0.3);
        border: 3px solid #ffffff;
        color: #443d6e;
      }
      .il-card-head { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
      .il-avatar { width: 60px; height: 60px; border-radius: 50%; background: #ffe4c9; display: flex; align-items: center; justify-content: center; font-size: 32px; flex: none; }
      .il-card-title { font-family: 'ZCOOL KuaiLe', sans-serif; font-size: 24px; color: #3b2f96; }
      .il-card-sub { font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 13px; color: #8a63f0; }
      .il-money-pill { margin-left: auto; flex: none; white-space: nowrap; background: #ffd766; border-radius: 999px; padding: 8px 16px; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 17px; color: #6b4a00; box-shadow: 0 3px 0 rgba(0, 0, 0, 0.15); }
      .il-copy { margin: 0 0 18px; font-size: 16px; line-height: 1.8; }

      .il-choice-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
      .il-choice-btn {
        min-height: 110px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: #fff;
        border-radius: 20px;
        cursor: pointer;
        font-family: inherit;
        transition: transform 150ms ease;
        border: 3px solid #cfc4ff;
        box-shadow: 0 6px 0 #cfc4ff;
      }
      .il-choice-btn:hover { transform: translateY(-3px); }
      .il-choice-btn:active { transform: translateY(3px); box-shadow: 0 2px 0 currentColor; }
      .il-border-coral { border-color: #ffb08a; box-shadow: 0 6px 0 #ffb08a; }
      .il-border-blue { border-color: #9fc6ff; box-shadow: 0 6px 0 #9fc6ff; }
      .il-border-pink { border-color: #ffb3d1; box-shadow: 0 6px 0 #ffb3d1; }
      .il-border-teal { border-color: #8fdcc8; box-shadow: 0 5px 0 #8fdcc8; }
      .il-border-blue2 { border-color: #cfc4ff; box-shadow: 0 5px 0 #cfc4ff; }
      .il-border-yellow { border-color: #ffd766; box-shadow: 0 5px 0 #d9b23e; }
      .il-choice-emoji { font-size: 38px; }
      .il-choice-label { font-size: 15px; font-weight: 700; }

      .il-coin-pile { display: flex; justify-content: center; align-items: flex-end; gap: 12px; margin-bottom: 18px; }
      .il-pile-coin { display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid; font-weight: 800; }

      .il-outcome { text-align: center; margin: 6px 0 16px; }
      .il-outcome-emoji { font-size: 58px; animation: pop-in-il 0.5s ease; }
      .il-outcome-title { font-family: 'ZCOOL KuaiLe', sans-serif; font-size: 22px; color: #3b2f96; margin-top: 6px; }
      .il-outcome-coins { font-size: 34px; letter-spacing: 4px; margin-top: 10px; animation: pop-in-il 0.5s ease 0.3s both; }
      .il-outcome-lines { display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px; }
      .il-outcome-line { border-radius: 14px; padding: 12px 16px; font-size: 15px; font-weight: 600; color: #443d6e; }
      .il-line-good { background: #e8f8ee; }
      .il-line-bad { background: #fdeeee; }
      .il-line-neutral { background: #fff6df; }
      .il-tip { background: #ede7ff; border-radius: 16px; padding: 14px 18px; text-align: center; font-size: 15px; font-weight: 700; color: #5a44c9; }
      .il-actions { display: flex; justify-content: center; gap: 12px; margin-top: 18px; flex-wrap: wrap; }
      .il-actions.il-center { margin-top: 4px; }
      .il-btn-ghost {
        font-family: 'ZCOOL KuaiLe', sans-serif; font-size: 16px; color: #6a5cd6; background: #fff;
        border: 3px solid #cfc4ff; border-radius: 999px; padding: 11px 22px; cursor: pointer; box-shadow: 0 4px 0 #cfc4ff;
      }
      .il-btn-primary {
        font-family: 'ZCOOL KuaiLe', sans-serif; font-size: 17px; letter-spacing: 1px; color: #fff;
        background: linear-gradient(180deg, #8a63f0, #6a44d8); border: 3px solid rgba(255, 255, 255, 0.5);
        border-radius: 999px; padding: 11px 30px; cursor: pointer; box-shadow: 0 5px 0 rgba(0, 0, 0, 0.3);
      }
      .il-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

      .il-explore-head { text-align: center; margin-bottom: 18px; }
      .il-h2 { font-family: 'ZCOOL KuaiLe', sans-serif; font-size: 28px; color: #ffe9a8; }
      .il-sub { font-size: 14px; color: var(--muted); margin-top: 4px; }
      .il-explore-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 16px; }
      .il-explore-card {
        min-height: 150px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 14px 10px;
        border-radius: 20px;
        cursor: pointer;
        text-align: center;
        font-family: inherit;
        background: #f7f4ff;
        color: #443d6e;
        border: 3px solid;
        transition: transform 150ms ease, box-shadow 150ms ease;
      }
      .il-explore-card.is-open { background: #fff; transform: translateY(4px); }
      .il-explore-emoji { font-size: 36px; }
      .il-explore-en { font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 14px; line-height: 1.4; }
      .il-explore-zh { font-size: 12px; opacity: 0.8; }
      .il-explore-zh-bold { font-size: 17px; font-weight: 900; line-height: 1.4; }
      .il-explore-en-faded { font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 12px; opacity: 0.7; }
      .il-explore-check { font-size: 12px; }
      .il-reveal { text-align: center; animation: pop-in-il 0.4s ease; }
      .il-reveal-row { display: flex; justify-content: center; align-items: center; gap: 16px; font-size: 40px; }
      .il-reveal-emoji { display: inline-block; }
      .il-reveal-arrow { font-size: 26px; color: #8a63f0; }
      .il-reveal-text { font-size: 16px; font-weight: 700; margin-top: 12px; }
      .il-reveal-text-inline { font-size: 32px; }
      .il-reveal-text-inline.il-faded { opacity: 0.45; filter: grayscale(1); }
      .il-limited-value { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 56px; color: #e8593d; }
      .il-limited-coins { display: flex; justify-content: center; gap: 8px; font-size: 30px; margin: 8px 0; }
      .il-limited-coin { transition: opacity 0.5s, filter 0.5s; }
      .il-values-row { display: flex; justify-content: center; align-items: flex-end; gap: 26px; }
      .il-values-label { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 20px; }
      .il-combine-lines { display: flex; flex-direction: column; gap: 6px; font-size: 22px; font-weight: 700; margin-top: 8px; }

      .il-game-box {
        position: relative;
        height: 420px;
        background: linear-gradient(180deg, #241a6e, #35297f 80%, #443a8f);
        border: 3px solid #6a5cd6;
        border-radius: 24px;
        overflow: hidden;
        touch-action: none;
        cursor: none;
        box-shadow: 0 8px 0 rgba(0, 0, 0, 0.3);
      }
      .il-game-hud {
        position: absolute; top: 12px; background: rgba(0, 0, 0, 0.3); border-radius: 999px; padding: 6px 16px;
        font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 15px; color: #ffd766; z-index: 2;
      }
      .il-hud-left { left: 16px; }
      .il-hud-right { right: 16px; color: #cfd6ff; }
      .il-game-items { position: absolute; inset: 0; }
      .il-game-item { position: absolute; font-size: 32px; pointer-events: none; }
      .il-game-pig { position: absolute; bottom: 14px; font-size: 54px; pointer-events: none; filter: drop-shadow(0 5px 0 rgba(0, 0, 0, 0.3)); }
      .il-game-overlay {
        position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: 14px; background: rgba(20, 14, 60, 0.6); text-align: center; padding: 0 24px;
      }
      .il-game-pig-big { font-size: 56px; }
      .il-start-btn {
        font-family: 'ZCOOL KuaiLe', sans-serif; font-size: 20px; letter-spacing: 2px; color: #5c3a00;
        background: linear-gradient(180deg, #ffdf7e, #f5a623); border: 3px solid #fff3cf; border-radius: 999px;
        padding: 13px 36px; cursor: pointer; box-shadow: 0 6px 0 rgba(0, 0, 0, 0.3);
      }
      .il-done-emoji { font-size: 50px; }
      .il-done-title { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 26px; color: #ffd766; }
      .il-done-sub { font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 17px; color: #fff; }
      .il-done-score { font-size: 15px; color: #cfc8f5; }

      .il-bridge-panel { background: linear-gradient(180deg, #241a6e, #35297f 80%, #443a8f); border: 3px solid #6a5cd6; border-radius: 24px; padding: 26px; box-shadow: 0 8px 0 rgba(0, 0, 0, 0.3); }
      .il-bridge-scene { position: relative; margin-bottom: 20px; border-radius: 18px; overflow: hidden; background: linear-gradient(180deg, #241a6e, #35297f 80%, #443a8f); border: 3px solid #6a5cd6; }
      .il-bridge-panel .il-bridge-scene { background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.14)); border: none; margin-bottom: 18px; }
      .il-bridge-water { position: absolute; left: 0; right: 0; bottom: 0; height: 26px; background: linear-gradient(180deg, #2a3f9f, #1d2c6e); }
      .il-bridge-bank-near { position: absolute; left: -14px; bottom: 20px; width: 90px; height: 40px; background: #3a2f6f; border-radius: 20px 30px 0 0; }
      .il-bridge-bank-far { position: absolute; right: -14px; bottom: 20px; width: 150px; height: 60px; background: #3a2f6f; border-radius: 30px 20px 0 0; }
      .il-mimi { position: absolute; left: 20px; bottom: 22px; width: 58px; height: 92px; animation: bounce-soft-il 3.5s ease-in-out infinite; }
      @keyframes bounce-soft-il { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      .il-game-target-text { text-align: center; margin-bottom: 16px; }
      .il-target-num { font-family: 'Baloo 2', sans-serif; font-size: 28px; color: #ffd766; }
      .il-total-num { font-family: 'Baloo 2', sans-serif; font-size: 22px; color: #6ee0c8; }
      .il-game-msg { margin-top: 8px; font-family: 'ZCOOL KuaiLe', sans-serif; font-size: 19px; letter-spacing: 1px; animation: pop-in-il 0.3s ease; }
      .il-msg-ok { color: #6ee0c8; }
      .il-msg-over { color: #ff9c8a; animation: shake-il 0.35s ease; }
      .il-coin-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; max-width: 440px; margin: 0 auto; }
      .il-coin-btn {
        min-height: 84px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
        background: #fff; border: 3px solid #ffd766; border-radius: 18px; cursor: pointer;
        font-family: 'Baloo 2', sans-serif; box-shadow: 0 6px 0 #c9a53e; transition: transform 120ms ease;
      }
      .il-coin-btn:active { transform: translateY(4px); box-shadow: 0 2px 0 #c9a53e; }
      .il-coin-icon { border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; }
      .il-coin-label { font-weight: 800; font-size: 15px; color: #6b4a00; }
      .il-clear-btn {
        font-family: 'Noto Sans SC', sans-serif; font-size: 14px; font-weight: 700; color: #cfc8f5;
        background: rgba(255, 255, 255, 0.1); border: 2px solid rgba(255, 255, 255, 0.25); border-radius: 999px;
        padding: 9px 20px; cursor: pointer;
      }

      .il-rl-center { text-align: center; }
      .il-rl-emoji { font-size: 44px; margin-bottom: 8px; }
      .il-rl-question { font-size: 18px; font-weight: 700; margin-bottom: 20px; line-height: 1.7; }
      .il-rl-btn { min-width: 120px; font-family: 'ZCOOL KuaiLe', sans-serif; font-size: 18px; border-radius: 999px; padding: 13px 24px; cursor: pointer; }
      .il-rl-yes { color: #fff; background: linear-gradient(180deg, #58c98a, #2fa864); border: 3px solid rgba(255, 255, 255, 0.6); box-shadow: 0 5px 0 rgba(0, 0, 0, 0.25); }
      .il-rl-no { color: #6a5cd6; background: #fff; border: 3px solid #cfc4ff; box-shadow: 0 5px 0 #cfc4ff; }
      .il-rl-answer { font-size: 17px; font-weight: 700; line-height: 1.8; margin-bottom: 6px; }
      .il-rl-note { font-size: 13px; color: #8a83b8; margin-bottom: 18px; }

      .il-mission-box { background: linear-gradient(160deg, #ffedc2 0%, #ffdf9a 100%); border-radius: 26px; padding: 28px; box-shadow: 0 8px 0 rgba(0, 0, 0, 0.3); border: 3px solid #ffe9b8; color: #6b4a12; }
      .il-mission-row { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px; }
      .il-mission-emoji { font-size: 36px; }
      .il-mission-text { font-size: 16px; font-weight: 700; line-height: 1.8; }
      .il-mission-quote { font-size: 19px; font-family: 'ZCOOL KuaiLe', sans-serif; color: #a35c00; }
      .il-mission-textarea {
        width: 100%; box-sizing: border-box; min-height: 84px; border: 3px solid #f0c46a; border-radius: 16px;
        padding: 14px 16px; font-family: inherit; font-size: 15px; color: #6b4a12; background: #fffaf0; resize: vertical; outline: none;
      }
      .il-mission-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
      .il-mission-option {
        min-height: 92px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
        background: #fffaf0; border: 3px solid #f0c46a; border-radius: 18px; cursor: pointer;
        font-family: inherit; font-size: 16px; font-weight: 700; color: #6b4a12;
        box-shadow: 0 5px 0 #f0c46a; transition: transform 150ms ease;
      }
      .il-mission-option:hover { transform: translateY(-2px); }
      .il-mission-option:active { transform: translateY(3px); box-shadow: 0 2px 0 #f0c46a; }
      .il-mission-option-emoji { font-size: 30px; }
      .il-mission-done { background: #fffaf0; border: 3px dashed #f0c46a; border-radius: 16px; padding: 14px 16px; font-size: 15px; line-height: 1.7; margin-bottom: 14px; animation: pop-in-il 0.4s ease; }
      .il-mission-complete { font-family: 'ZCOOL KuaiLe', sans-serif; font-size: 20px; color: #2fa864; margin-bottom: 12px; }

      .il-quiz-q { text-align: center; font-size: 18px; font-weight: 700; margin-bottom: 20px; }
      .il-quiz-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
      .il-quiz-option {
        min-height: 118px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
        background: #fff; border-radius: 20px; cursor: pointer; color: #443d6e; font-family: inherit;
        border: 3px solid #cfc4ff; box-shadow: 0 6px 0 #cfc4ff;
      }
      .il-quiz-option.il-shake { animation: shake-il 0.35s ease; }
      .il-quiz-emoji { font-size: 40px; }
      .il-quiz-label { font-size: 14px; font-weight: 700; }
      .il-quiz-feedback { margin-top: 16px; text-align: center; font-family: 'ZCOOL KuaiLe', sans-serif; font-size: 20px; letter-spacing: 1px; animation: pop-in-il 0.3s ease; }
      .il-quiz-feedback.is-correct { color: #2fa864; }
      .il-quiz-feedback.is-wrong { color: #e8593d; }
      .il-quiz-complete {
        background: linear-gradient(160deg, #4a3cae 0%, #3b2f96 100%); border: 3px solid #6a5cd6; border-radius: 26px;
        padding: 36px 28px; box-shadow: 0 10px 0 rgba(0, 0, 0, 0.28); text-align: center;
      }
      .il-badge-orb {
        width: 88px; height: 88px; margin: 0 auto 12px; border-radius: 50%;
        background: radial-gradient(circle at 35% 30%, #ffe08a, #f5a623 75%); border: 4px solid #fff3cf;
        box-shadow: 0 6px 0 rgba(0, 0, 0, 0.25); display: flex; align-items: center; justify-content: center;
        font-size: 42px; animation: pop-in-il 0.6s ease;
      }
      .il-badge-title { font-family: 'ZCOOL KuaiLe', sans-serif; font-size: 28px; color: #ffd766; letter-spacing: 2px; }
      .il-badge-score { font-size: 15px; color: #cfc8f5; margin: 10px 0 6px; }
      .il-badge-note { font-size: 14px; color: #b9b3ea; margin-bottom: 20px; }
      .il-btn-gold {
        display: inline-flex; align-items: center; justify-content: center;
        font-family: 'ZCOOL KuaiLe', sans-serif; font-size: 19px; letter-spacing: 1px; color: #5c3a00;
        background: linear-gradient(180deg, #ffdf7e, #f5a623); border: 3px solid #fff3cf; border-radius: 999px;
        padding: 12px 34px; cursor: pointer; box-shadow: 0 5px 0 rgba(0, 0, 0, 0.3);
      }
      .il-next-teaser {
        margin-top: 18px; background: rgba(255, 255, 255, 0.1); border: 2px dashed rgba(255, 215, 102, 0.6);
        border-radius: 18px; padding: 14px 20px; font-size: 15px; color: #ffe9a8; animation: pop-in-il 0.3s ease;
      }

      /* Choice Forest (lesson 3) green theme */
      .il-hero-banner-forest {
        background: linear-gradient(135deg, #6ee0a0 0%, #2fa864 55%, #1c7a3e 100%);
        box-shadow: 0 14px 44px rgba(47, 168, 100, 0.35);
        color: #073d1f;
      }
      .il-hero-banner-forest .il-hero-eyebrow,
      .il-hero-banner-forest .il-hero-title { color: #073d1f; }
      .il-hero-banner-forest .il-hero-en { color: #0d5c2c; }
      .il-hero-banner-forest .il-hero-tags span { background: rgba(234, 255, 240, 0.85); color: #0d5c2c; }

      .il-step-forest.is-active { background: linear-gradient(180deg, #7fe6a8, #2fa864); color: #073d1f; border-color: #bff3d0; box-shadow: 0 4px 0 rgba(0, 0, 0, 0.28); }

      .il-h2-forest { color: #bff3d0; }

      .il-btn-primary-forest {
        background: linear-gradient(180deg, #58c98a, #1c7a3e); border-color: rgba(255, 255, 255, 0.5);
      }
      .il-btn-ghost-forest { color: #1c7a3e; border-color: #bff3d0; box-shadow: 0 4px 0 #bff3d0; }

      .il-decor-row { text-align: center; font-size: 30px; letter-spacing: 10px; margin-bottom: 16px; opacity: 0.85; }

      .il-fork-scene {
        position: relative; height: 190px; margin-bottom: 18px; border-radius: 18px; overflow: hidden;
        background: linear-gradient(180deg, #cdeedd 0%, #a8dfc0 70%, #8fd1ac 100%); border: 3px solid #bff3d0;
      }

      .il-explore-card-forest { color: #0d5c2c; }
      .il-explore-card-forest.is-open { background: #f2fff6; }

      .il-reveal-forest { color: #0d5c2c; }
      .il-reveal-arrow-forest { font-size: 26px; color: #1c7a3e; font-weight: 800; }
      .il-reveal-arrow-forest.il-arrow-want { color: #c07800; }

      .il-line-good-forest { background: #e8f8ee; }
      .il-line-bad-forest { background: #fdeeee; }
      .il-tip-forest { background: #e8f8ee; color: #0d6b3e; }

      .il-forest-panel { background: linear-gradient(180deg, #123d24, #1c5c34 80%, #226b3c); border: 3px solid #2fa864; border-radius: 24px; padding: 26px; box-shadow: 0 8px 0 rgba(0, 0, 0, 0.3); }
      .il-firefly-scene {
        position: relative; height: 150px; margin-bottom: 18px; border-radius: 18px; overflow: hidden;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.14));
      }
      .il-firefly-count { position: absolute; left: 0; right: 0; bottom: 8px; text-align: center; font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 14px; color: #d7f0d0; }
      @keyframes firefly-il { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-6px) scale(1.2); } }

      .il-shelf-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px; }
      .il-shelf { background: rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 12px 14px; border: 2px solid rgba(255, 255, 255, 0.15); }
      .il-shelf-title { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 13px; color: #d7f0d0; margin-bottom: 6px; }
      .il-shelf-row { font-size: 22px; letter-spacing: 4px; min-height: 30px; }

      .il-current-item { text-align: center; margin-bottom: 16px; }
      .il-current-caption { font-size: 14px; color: #cfe8d8; margin-bottom: 6px; }
      .il-current-emoji { font-size: 54px; animation: pop-in-il 0.4s ease; }
      .il-current-zh { font-family: 'ZCOOL KuaiLe', sans-serif; font-size: 20px; color: #eafff0; margin-top: 4px; }

      .il-msg-ok-forest { color: #6ee0a0; }
      .il-msg-no-forest { color: #ff9c8a; animation: shake-il 0.35s ease; }

      .il-path-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; max-width: 420px; margin: 0 auto; }
      .il-path-btn {
        min-height: 96px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
        background: rgba(255, 255, 255, 0.08); border-radius: 18px; cursor: pointer; font-family: inherit;
        border: 3px solid rgba(255, 255, 255, 0.25); transition: transform 120ms ease;
      }
      .il-path-btn:active { transform: translateY(4px); }
      .il-path-need { border-color: #6ee0a0; box-shadow: 0 5px 0 #2fa864; }
      .il-path-want { border-color: #ffc14d; box-shadow: 0 5px 0 #d9922e; }
      .il-path-emoji { font-size: 28px; }
      .il-path-label { font-family: 'ZCOOL KuaiLe', sans-serif; font-size: 15px; color: #eafff0; }
      .il-path-en { font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 11px; color: #b9e6c8; }

      .il-rl-no-forest { color: #1c7a3e; background: #fff; border: 3px solid #bff3d0; box-shadow: 0 5px 0 #bff3d0; }

      .il-mission-box-forest { background: linear-gradient(160deg, #d7f0d0 0%, #bff3d0 100%); border-color: #9be3b6; color: #0d5c2c; }
      .il-mission-quote-forest { color: #0d6b3e; }
      .il-mission-grid-forest .il-mission-option-forest {
        background: #f2fff6; border-color: #9be3b6; color: #0d5c2c; box-shadow: 0 5px 0 #9be3b6;
      }
      .il-mission-done-forest { background: #f2fff6; border-color: #9be3b6; }

      .il-quiz-option-forest { border-color: #bff3d0; box-shadow: 0 6px 0 #bff3d0; color: #0d5c2c; }
      .il-quiz-complete-forest {
        background: linear-gradient(160deg, #1c5c34 0%, #123d24 100%); border-color: #2fa864;
      }
      .il-badge-orb-forest {
        background: radial-gradient(circle at 35% 30%, #a8f0c0, #2fa864 75%); border-color: #bff3d0;
      }

      @keyframes wobble-il { 0%, 100% { transform: translateX(0) rotate(0deg); } 50% { transform: translateX(4px) rotate(6deg); } }

      /* Budget City (lesson 4) blue theme */
      .il-hero-banner-budget {
        background: linear-gradient(135deg, #7fb8ff 0%, #4f8fee 55%, #3a7ce0 100%);
        box-shadow: 0 14px 44px rgba(61, 124, 224, 0.4);
        color: #0e2f57;
      }
      .il-hero-banner-budget .il-hero-eyebrow,
      .il-hero-banner-budget .il-hero-title { color: #123a6b; }
      .il-hero-banner-budget .il-hero-en { color: #123a6b; }
      .il-hero-banner-budget .il-hero-tags span { background: rgba(240, 246, 255, 0.92); color: #123a6b; }

      .il-step-budget.is-active { background: linear-gradient(180deg, #5f9dff, #3a7ce0); color: #0e2f57; border-color: #cfe1ff; box-shadow: 0 4px 0 rgba(0, 0, 0, 0.28); }

      .il-h2-budget { color: #bcd6ff; }

      .il-btn-primary-budget { background: linear-gradient(180deg, #5f9dff, #3a7ce0); border-color: rgba(255, 255, 255, 0.5); }
      .il-btn-ghost-budget { color: #3a7ce0; border-color: #bfd6ff; box-shadow: 0 4px 0 #bfd6ff; }

      .il-border-budget-blue { border-color: #8fc0ff; box-shadow: 0 6px 0 #8fc0ff; }
      .il-border-budget-purple { border-color: #b7a8f0; box-shadow: 0 6px 0 #b7a8f0; }

      .il-city-scene {
        position: relative; height: 210px; margin-bottom: 20px; border-radius: 18px; overflow: hidden;
        background: linear-gradient(180deg, #1e3466 0%, #274487 60%, #325aa8 100%); border: 3px solid #4f7fd6;
      }
      .il-city-skyline { position: absolute; bottom: 44px; left: 0; right: 0; height: 60px; display: flex; align-items: flex-end; gap: 6px; padding: 0 16px; opacity: 0.45; }
      .il-city-ground { position: absolute; left: 0; right: 0; bottom: 0; height: 44px; background: linear-gradient(180deg, #3f66b8, #2b478c); }
      .il-city-jars-row { position: absolute; bottom: 30px; left: 0; right: 0; display: flex; justify-content: center; align-items: flex-end; gap: 22px; }
      .il-city-jar { display: flex; flex-direction: column; align-items: center; gap: 4px; }
      .il-city-jar-icon { width: 52px; height: 60px; border-radius: 10px 10px 16px 16px; box-shadow: inset 0 6px 0 rgba(255, 255, 255, 0.25); }
      .il-city-jar-label { font-size: 12px; font-weight: 700; }

      .il-explore-card-budget { color: #24365c; }
      .il-explore-card-budget.is-open { background: #fff; }
      .il-reveal-budget { color: #24365c; }

      .il-line-good-budget { background: #dfeaff; }
      .il-line-bad-budget { background: #fdeee6; }
      .il-tip-budget { background: #dfeaff; color: #2a5fb0; }

      .il-jar-panel { background: linear-gradient(180deg, #1e3466, #274487 70%, #325aa8); border: 3px solid #4f7fd6; border-radius: 24px; padding: 24px; box-shadow: 0 8px 0 rgba(0, 0, 0, 0.3); }
      .il-bank-row { text-align: center; margin-bottom: 18px; }
      .il-bank-label { font-size: 15px; color: #cfe1ff; }
      .il-bank-coins { font-size: 26px; letter-spacing: 2px; min-height: 32px; margin-top: 4px; }
      .il-bank-remaining { font-size: 15px; color: #9fbdf0; margin-top: 2px; }
      .il-bank-remaining strong { font-family: 'Baloo 2', sans-serif; font-size: 20px; color: #ffd766; font-weight: 800; }

      .il-jar-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
      .il-jar-card { display: flex; flex-direction: column; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.06); border: 2px solid rgba(255, 255, 255, 0.14); border-radius: 18px; padding: 14px 8px; }
      .il-jar-emoji { font-size: 30px; }
      .il-jar-name { font-family: 'ZCOOL KuaiLe', sans-serif; font-size: 17px; color: #fff; }
      .il-jar-en { font-family: 'Baloo 2', sans-serif; font-weight: 700; font-size: 11px; color: #9fbdf0; }
      .il-jar-glass {
        position: relative; width: 100%; min-height: 56px; border-radius: 8px 8px 14px 14px; overflow: hidden;
        background: rgba(255, 255, 255, 0.08); display: flex; align-items: flex-end; justify-content: center; color: #fff3cf;
      }
      .il-jar-fill { position: absolute; left: 0; right: 0; bottom: 0; opacity: 0.55; transition: height 0.25s ease; }
      .il-jar-coins { position: relative; z-index: 1; font-size: 16px; line-height: 1.15; word-break: break-word; padding: 4px; }
      .il-jar-count { font-family: 'Baloo 2', sans-serif; font-weight: 800; font-size: 18px; color: #ffd766; }
      .il-jar-controls { display: flex; gap: 8px; }
      .il-jar-btn { width: 38px; height: 38px; border-radius: 50%; font-size: 22px; font-weight: 800; cursor: pointer; font-family: 'Baloo 2', sans-serif; }
      .il-jar-btn:active { transform: scale(0.9); }
      .il-jar-btn-remove { border: 2px solid rgba(255, 255, 255, 0.3); background: rgba(255, 255, 255, 0.12); color: #fff; }
      .il-jar-btn-add { color: #fff; }

      .il-msg-ok-budget { color: #bcd6ff; }
      .il-msg-no-budget { color: #ffc9a8; animation: shake-il 0.35s ease; }

      .il-rl-no-budget { color: #3a7ce0; background: #fff; border: 3px solid #bfd6ff; box-shadow: 0 5px 0 #bfd6ff; }

      .il-mission-box-budget { background: linear-gradient(160deg, #d6e6ff 0%, #bcd6ff 100%); border-color: #d9e7ff; color: #1c3a66; }
      .il-mission-quote-budget { color: #2a5fb0; }
      .il-mission-grid-budget .il-mission-option-budget {
        background: #f4f8ff; border-color: #8fc0ff; color: #1c3a66; box-shadow: 0 5px 0 #8fc0ff;
      }
      .il-mission-done-budget { background: #f4f8ff; border-color: #8fc0ff; }

      .il-quiz-option-budget { border-color: #bfd6ff; box-shadow: 0 6px 0 #bfd6ff; color: #24365c; }
      .il-quiz-complete-budget {
        background: linear-gradient(160deg, #3a6bc0 0%, #2a5fb0 100%); border-color: #6a95e0;
      }
      .il-badge-orb-budget {
        background: radial-gradient(circle at 35% 30%, #cfe1ff, #5f9dff 75%); border-color: #eaf2ff;
      }

      @media (max-width: 640px) {
        .il-choice-grid, .il-explore-grid, .il-quiz-grid, .il-shelf-grid, .il-jar-grid { grid-template-columns: 1fr; }
        .il-step-label { display: none; }
      }

      .feature-card, .resource-card, .mission-card, .roadmap article { padding: 24px; }
      .mini-icon {
        display: grid;
        width: 42px;
        height: 42px;
        place-items: center;
        margin-bottom: 20px;
        border-radius: 16px;
        background: linear-gradient(135deg, var(--p2, var(--gold)), var(--p3, var(--gold-dark)));
        color: #fff;
      }
      .mini-icon svg { width: 26px; height: 26px; }
      .feature-card.playable { border-top: 4px solid var(--p2, var(--gold)); }
      .feature-card.playable .mini-icon { background: rgba(255, 255, 255, 0.12); color: var(--p2, var(--gold)); }
      .feature-card .button { margin-top: 16px; }
      .coming-soon {
        display: inline-flex;
        width: fit-content;
        margin-top: 16px;
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
        color: var(--muted);
        font-size: 0.82rem;
        font-weight: 900;
      }
      .mission-card { min-height: 150px; background: linear-gradient(145deg, rgba(79, 207, 192, 0.12), rgba(255, 255, 255, 0.04)); }
      .mission-card span, .roadmap span { display: inline-flex; margin-bottom: 14px; color: var(--gold); font-weight: 1000; }
      .community-panel { max-width: 930px; padding: 44px; }
      .builder-roles { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
      .builder-roles span { border-radius: 999px; padding: 10px 14px; background: rgba(255, 255, 255, 0.08); color: var(--cream); font-weight: 900; }

      @media (max-width: 920px) {
        .top-nav { align-items: flex-start; flex-direction: column; }
        .nav-links { justify-content: flex-start; }
        .home-page { grid-template-columns: 1fr; min-height: auto; padding-top: 52px; }
        .planet-map { max-width: 440px; }
        .level-grid, .planet-grid, .feature-list, .resource-shelf, .mission-board, .roadmap { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .planet-hero { grid-template-columns: 1fr; text-align: center; }
        .planet-hero-copy { display: flex; flex-direction: column; align-items: center; }
        .progress-track { max-width: 100%; }
        .planet-map-grid { grid-template-columns: 1fr; }
        .map-sidebar { position: static; }
      }
      @media (max-width: 640px) {
        .top-nav, .home-page, .page-section { width: min(100% - 24px, 1180px); }
        .nav-links a { padding: 8px 9px; font-size: 0.84rem; }
        h1 { font-size: clamp(2.7rem, 13vw, 4rem); }
        .hero-text { font-size: 1rem; }
        .hero-actions { align-items: stretch; flex-direction: column; }
        .button { width: 100%; }
        .planet-map { width: min(100%, 340px); }
        .map-core { width: 140px; height: 140px; }
        .map-core strong { font-size: 1.3rem; }
        .map-mascot { width: 42px; height: 42px; }
        .orbit-planet { width: 78px; height: 78px; border-width: 3px; }
        .orbit-planet-icon { width: 28px; height: 28px; }
        .orbit-planet strong { font-size: 0.72rem; }
        .orbit-planet .planet-tip { display: none; }
        .level-grid, .planet-grid, .feature-list, .resource-shelf, .mission-board, .roadmap { grid-template-columns: 1fr; }
        .page-section, .home-page { padding: 54px 0 66px; }
        .level-node { transform: none !important; }
        .planet-hero-orb { width: 110px; height: 110px; }
        .planet-hero-orb svg { width: 50px; height: 50px; }
      }
  `;
}

export { renderPage };

export default {
  async fetch(request) {
    return htmlResponse(renderPage(request));
  },
};
