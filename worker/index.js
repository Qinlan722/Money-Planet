import { treasureCoinHuntMeta } from "../games/coin-island/treasure-coin-hunt/meta.js";
import { renderTreasureHuntBody } from "../games/coin-island/treasure-coin-hunt/page.js";

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
        <a class="orbit-planet node-${index + 1} ${planet.color}" href="/explore?level=beginner#${planet.id}" aria-label="进入 ${planet.zh} ${planet.name}：${planet.theme}">
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
        <a class="route-chip" href="/explore?level=beginner#${planet.id}">
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
    <style>${siteStyles()}</style>
  </head>
  <body>
    <main>
      ${siteNav(active)}
      ${body}
    </main>
  </body>
</html>`;
}

function siteNav(active) {
  const links = [
    ["home", "/", "首页 Home"],
    ["explore", "/age", "探索 Explore"],
    ["lessons", "/explore", "课程 Lessons"],
    ["games", "/games", "游戏 Games"],
    ["library", "/library", "资料 Library"],
    ["missions", "/missions", "任务 Missions"],
    ["community", "/community", "加入 Community"],
    ["about", "/about", "关于 About"],
  ];

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
        ${links
          .map(([key, href, label]) => `<a class="${active === key ? "active" : ""}" href="${href}">${label}</a>`)
          .join("")}
      </div>
    </nav>`;
}

function renderHomePage() {
  return pageShell({
    title: "首页",
    active: "home",
    body: `
      <section class="home-page">
        <div class="home-copy">
          <div class="mascot">
            <span class="mascot-avatar" role="img" aria-label="星球向导米米">${mascotSvg()}</span>
            <p class="mascot-bubble">你好，我是<strong>米米</strong>，欢迎来到财商星球！跟我一站一站探索吧。</p>
          </div>
          <p class="pill">儿童财商探索站</p>
          <h1>欢迎来到 Money Planet 财商星球</h1>
          <p class="hero-text">
            这里不是银行，也不是投资网站。这里是一张给中文小学生和家庭使用的财商探索地图：
            孩子会一步一步选择年龄、进入星球、打开任务课，把“钱”学成会观察、会讨论、会实践的生活能力。
          </p>
          <p class="tagline">学会选择，玩懂财商，创造未来。</p>
          <p class="subtitle-en">Learn Money. Play Smart. Build the Future.</p>
          <div class="hero-actions">
            <a class="button primary" href="/age">开始探索 Start Exploring</a>
            <a class="button secondary" href="/community">加入星球建设者 Join Builders</a>
          </div>
          <div class="route-strip">${routeStrip()}</div>
        </div>
        ${planetOrbitMap()}
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

function lessonCardsForExplore(planetId, selectedLevel) {
  return lessons
    .filter((lesson) => lesson.planetId === planetId)
    .map((lesson) => {
      const isRecommended = lesson.ageLevel.toLowerCase().includes(selectedLevel);
      return `
        <article class="lesson-card ${isRecommended ? "recommended" : ""}">
          <div>
            <span class="age-pill">${lesson.ageLevel}${isRecommended ? " · 推荐" : ""}</span>
            <h5>${lesson.titleZh}</h5>
            <p class="english-note">${lesson.titleEn}</p>
          </div>
          <div class="tag-row compact">
            ${lesson.keyConcepts.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
          <a class="button lesson-button" href="/lesson/${lesson.id}?level=${selectedLevel}">开始学习 / Start Lesson</a>
        </article>
      `;
    })
    .join("");
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

function renderExplorePage(url) {
  const selectedLevel = normalizeLevel(url.searchParams.get("level"));
  const level = levelOptions.find((item) => item.id === selectedLevel);

  return pageShell({
    title: "星球探索",
    active: "lessons",
    body: `
      <section class="page-section">
        <div class="section-header">
          <p>Step 2 星球探索</p>
          <h1>探索六个财商星球</h1>
          <p class="english-note">Explore Six Money Planets</p>
          <span>当前身份：${level.zh}。你可以从任意星球开始，也可以先选择带“推荐”的课程。</span>
        </div>
        <div class="planet-grid">
          ${planets
            .map(
              (planet, index) => `
                <article class="planet-card ${planet.color}" id="${planet.id}">
                  <div class="planet-card-head">
                    <span class="planet-icon-badge">${planetIconSvg(planet.icon)}</span>
                    <div class="card-number">${index + 1}</div>
                  </div>
                  <p class="english-label">${planet.name}</p>
                  <h2>${planet.zh}</h2>
                  <p class="theme-badge">${planet.theme}</p>
                  <p class="child-text">${planet.childText}</p>
                  <p class="english-note">${planet.englishText}</p>
                  <div class="tag-row">
                    ${planet.tags.map((tag) => `<span>${tag}</span>`).join("")}
                  </div>
                  ${planetGamesForExplore(planet.id)}
                  <div class="planet-lessons">
                    <h3>选择一节任务课 <small>Pick a Lesson</small></h3>
                    ${lessonCardsForExplore(planet.id, selectedLevel)}
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
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

  return pageShell({
    title: lesson.titleZh,
    active: "lessons",
    body: `
      <section class="page-section lesson-page">
        <a class="back-link" href="/explore?level=${selectedLevel}">← 返回星球探索 Back to Explore</a>
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

  return renderMoneyMatchGame(game, planet);
}

function renderMoneyMatchGame(game, planet) {
  return pageShell({
    title: game.titleZh,
    active: "games",
    body: `
      <section class="page-section compact-page game-page">
        <a class="back-link" href="/explore?level=beginner#${planet.id}">← 返回${planet.zh} Back to ${planet.name}</a>
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
              <a class="button secondary" href="/explore?level=beginner#${planet.id}">返回${planet.zh} Back to Planet</a>
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
        color: #24313b;
        background: #fff8ea;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
        font-synthesis: none;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        --cream: #fff8ea;
        --paper: #fffdf5;
        --sky: #72c8f4;
        --sky-dark: #237aa3;
        --mint: #75dfbd;
        --leaf: #97db7a;
        --yellow: #ffd868;
        --coral: #ff8a70;
        --violet: #b9a7ff;
        --ink: #24313b;
        --soft: #61707e;
        --line: rgba(36, 49, 59, 0.12);
        --shadow: 0 22px 60px rgba(65, 91, 113, 0.16);
      }

      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-width: 320px;
        background:
          radial-gradient(circle at 16% 12%, rgba(117, 223, 189, 0.35), transparent 28%),
          radial-gradient(circle at 84% 5%, rgba(255, 216, 104, 0.42), transparent 24%),
          linear-gradient(180deg, #eaf8ff 0%, var(--cream) 42%, #fffdf5 100%);
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
        border: 1px solid rgba(255, 255, 255, 0.78);
        border-radius: 24px;
        background: rgba(255, 253, 245, 0.92);
        box-shadow: 0 10px 28px rgba(60, 103, 128, 0.12);
        backdrop-filter: blur(16px);
      }
      .brand { display: inline-flex; align-items: center; gap: 10px; flex: 0 0 auto; }
      .brand-mark {
        display: grid;
        width: 44px;
        height: 44px;
        place-items: center;
        border-radius: 50%;
        background: linear-gradient(145deg, var(--yellow), var(--coral));
        color: #60390d;
        font-weight: 900;
      }
      .brand strong, .brand small { display: block; line-height: 1.08; }
      .brand small { color: var(--sky-dark); font-weight: 800; }
      .nav-links { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 6px; }
      .nav-links a {
        border-radius: 999px;
        padding: 9px 12px;
        color: #40515d;
        font-size: 0.92rem;
        font-weight: 800;
      }
      .nav-links a:hover, .nav-links a.active { background: rgba(114, 200, 244, 0.18); color: #155f83; }

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
      h1, h2, h3, h4, h5, p { margin-top: 0; }
      h1 {
        max-width: 820px;
        margin-bottom: 20px;
        color: #263743;
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
        border: 1px solid rgba(35, 122, 163, 0.16);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.78);
        color: var(--sky-dark);
        font-weight: 900;
      }
      .hero-text, .section-header span, .planet-card p, .lesson-card p, .lesson-detail p, .lesson-detail li, .feature-card p, .resource-card p, .mission-card p, .community-panel p, .roadmap p {
        color: var(--soft);
        line-height: 1.72;
      }
      .hero-text { max-width: 690px; font-size: 1.16rem; }
      .tagline { margin-bottom: 8px; color: #be5a40; font-size: 1.24rem; font-weight: 1000; }
      .subtitle-en, .english-note { color: #547386; font-weight: 800; }
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
      .button.primary { background: #24313b; color: white; box-shadow: 0 14px 30px rgba(36, 49, 59, 0.22); }
      .button.secondary { border: 2px solid rgba(255, 138, 112, 0.5); background: rgba(255, 255, 255, 0.74); color: #9f4f39; }

      .mascot { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
      .mascot-avatar {
        flex: 0 0 auto;
        width: 60px;
        height: 60px;
        animation: mascot-float 3.6s ease-in-out infinite;
        filter: drop-shadow(0 10px 18px rgba(65, 91, 113, 0.2));
      }
      .mascot-bubble {
        position: relative;
        margin: 0;
        padding: 10px 16px;
        border: 1px solid rgba(35, 122, 163, 0.16);
        border-radius: 18px;
        background: #fff;
        box-shadow: 0 10px 24px rgba(74, 111, 131, 0.12);
        color: #31434f;
        font-size: 0.94rem;
        font-weight: 800;
        line-height: 1.5;
      }
      .mascot-bubble strong { color: #237aa3; }
      .mascot-bubble::before {
        content: "";
        position: absolute;
        top: 50%;
        left: -8px;
        transform: translateY(-50%);
        border: 8px solid transparent;
        border-right-color: #fff;
      }
      .route-strip { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 26px; }
      .route-chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 13px;
        border: 1px solid rgba(35, 122, 163, 0.14);
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.72);
        color: #344c5a;
        font-size: 0.82rem;
        font-weight: 800;
        transition: transform 160ms ease, background 160ms ease;
      }
      .route-chip:hover { transform: translateY(-2px); background: rgba(255, 255, 255, 0.95); }
      .route-chip .dot { width: 10px; height: 10px; border-radius: 50%; }

      .planet-map {
        position: relative;
        width: min(100%, 540px);
        aspect-ratio: 1;
        margin: 0 auto;
      }
      .orbit-ring { position: absolute; border: 2px dashed rgba(35, 122, 163, 0.2); border-radius: 50%; }
      .ring-a { inset: 6%; }
      .ring-b { inset: 20%; transform: rotate(18deg); border-color: rgba(255, 138, 112, 0.22); }
      .map-star {
        position: absolute;
        width: 14px;
        height: 14px;
        transform: rotate(45deg);
        border-radius: 4px;
        background: #ffd868;
        opacity: 0.9;
      }
      .star-1 { top: 9%; right: 23%; }
      .star-2 { bottom: 9%; left: 24%; background: #ff8a70; }
      .star-3 { top: 46%; left: -1%; background: #75dfbd; }
      .map-core {
        position: absolute;
        top: 50%;
        left: 50%;
        display: grid;
        width: 190px;
        height: 190px;
        place-items: center;
        transform: translate(-50%, -50%);
        border: 6px solid rgba(255, 255, 255, 0.82);
        border-radius: 50%;
        background: linear-gradient(145deg, var(--mint), var(--sky));
        color: #174c5f;
        text-align: center;
        box-shadow: var(--shadow);
      }
      .map-core span, .map-core strong { display: block; }
      .map-core span { align-self: end; font-weight: 900; }
      .map-core strong { align-self: start; font-size: 1.7rem; }
      .map-mascot {
        position: absolute;
        top: -2%;
        right: 8%;
        width: 54px;
        height: 54px;
        animation: mascot-float 3.6s ease-in-out infinite;
        filter: drop-shadow(0 10px 18px rgba(65, 91, 113, 0.2));
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
        border: 5px solid rgba(255, 255, 255, 0.86);
        border-radius: 50%;
        box-shadow: 0 16px 34px rgba(65, 91, 113, 0.18);
        color: #20323d;
        text-align: center;
        transition: transform 220ms ease, box-shadow 220ms ease;
      }
      .orbit-planet:hover, .orbit-planet:focus-visible {
        transform: translateY(-8px) scale(1.08);
        outline: none;
        z-index: 5;
      }
      .orbit-planet.mint:hover, .orbit-planet.mint:focus-visible { box-shadow: 0 20px 40px rgba(117, 223, 189, 0.5); }
      .orbit-planet.green:hover, .orbit-planet.green:focus-visible { box-shadow: 0 20px 40px rgba(151, 219, 122, 0.5); }
      .orbit-planet.yellow:hover, .orbit-planet.yellow:focus-visible { box-shadow: 0 20px 40px rgba(255, 216, 104, 0.55); }
      .orbit-planet.coral:hover, .orbit-planet.coral:focus-visible { box-shadow: 0 20px 40px rgba(255, 138, 112, 0.5); }
      .orbit-planet.blue:hover, .orbit-planet.blue:focus-visible { box-shadow: 0 20px 40px rgba(114, 200, 244, 0.5); }
      .orbit-planet.purple:hover, .orbit-planet.purple:focus-visible { box-shadow: 0 20px 40px rgba(185, 167, 255, 0.5); }
      .orbit-planet-icon { display: block; width: 40px; height: 40px; animation: node-float 4.6s ease-in-out infinite; }
      .orbit-planet strong { font-size: 0.92rem; font-weight: 1000; }
      .orbit-planet .planet-tip {
        position: absolute;
        bottom: calc(100% + 10px);
        left: 50%;
        z-index: 6;
        width: 176px;
        padding: 10px 12px;
        transform: translate(-50%, 4px);
        border-radius: 14px;
        background: #fff;
        box-shadow: 0 14px 30px rgba(65, 91, 113, 0.24);
        color: #31434f;
        font-size: 0.8rem;
        font-weight: 700;
        line-height: 1.5;
        opacity: 0;
        pointer-events: none;
        transition: opacity 160ms ease, transform 160ms ease;
      }
      .orbit-planet .planet-tip b { display: block; margin-bottom: 2px; color: #237aa3; font-size: 0.82rem; }
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
      .section-header p { margin-bottom: 10px; color: var(--sky-dark); font-weight: 1000; }
      .level-grid, .planet-grid, .feature-list, .resource-shelf, .mission-board, .roadmap { display: grid; gap: 18px; }
      .level-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .planet-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .feature-list, .resource-shelf { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .mission-board { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .roadmap { grid-template-columns: repeat(3, minmax(0, 1fr)); }

      .level-card, .planet-card, .feature-card, .resource-card, .mission-card, .roadmap article, .lesson-detail, .community-panel {
        border: 1px solid rgba(255, 255, 255, 0.72);
        border-radius: 28px;
        background: rgba(255, 253, 245, 0.84);
        box-shadow: 0 14px 36px rgba(74, 111, 131, 0.1);
      }
      .level-card { display: grid; gap: 12px; min-height: 260px; padding: 28px; }
      .level-card strong { align-self: end; color: #be5a40; }
      .level-badge, .age-pill {
        display: inline-flex;
        width: fit-content;
        margin-bottom: 10px;
        border-radius: 999px;
        padding: 6px 10px;
        background: rgba(36, 49, 59, 0.08);
        color: #344c5a;
        font-size: 0.82rem;
        font-weight: 1000;
      }
      .planet-card { position: relative; min-height: 300px; padding: 24px; isolation: isolate; }
      .planet-card::after {
        content: "";
        position: absolute;
        right: -34px;
        bottom: -42px;
        z-index: -1;
        width: 132px;
        height: 132px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.28);
      }
      .mint { background: var(--mint); }
      .green { background: var(--leaf); }
      .yellow { background: var(--yellow); }
      .coral { background: var(--coral); }
      .blue { background: var(--sky); }
      .purple { background: var(--violet); }
      .planet-card-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
      .planet-icon-badge {
        display: grid;
        width: 56px;
        height: 56px;
        place-items: center;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.7);
        box-shadow: 0 8px 18px rgba(65, 91, 113, 0.14);
      }
      .planet-icon-badge svg { width: 36px; height: 36px; }
      .card-number {
        display: grid;
        width: 30px;
        height: 30px;
        place-items: center;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.68);
        font-size: 0.94rem;
        font-weight: 1000;
      }
      .english-label { margin-bottom: 4px; color: #3c6277; font-size: 0.96rem; font-weight: 900; }
      .theme-badge {
        display: inline-flex;
        width: fit-content;
        margin-bottom: 12px;
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(36, 49, 59, 0.08);
        color: #344c5a;
        font-size: 0.82rem;
        font-weight: 1000;
      }
      .child-text { color: #31434f; font-size: 1.04rem; font-weight: 800; }
      .tag-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
      .tag-row span {
        border-radius: 999px;
        padding: 7px 10px;
        background: rgba(255, 255, 255, 0.7);
        color: #344c5a;
        font-size: 0.86rem;
        font-weight: 900;
      }
      .tag-row.compact { margin-top: 0; }
      .tag-row.compact span { padding: 6px 9px; font-size: 0.78rem; }
      .planet-lessons, .planet-games { margin-top: 22px; padding-top: 18px; border-top: 1px dashed rgba(36, 49, 59, 0.18); }
      .planet-lessons h3, .planet-games h3 { font-size: 1.05rem; }
      .planet-lessons h3 small, .planet-games h3 small, .mission-block h4 small { color: #547386; font-weight: 800; }
      .planet-games .lesson-button { display: inline-flex; }
      .lesson-card {
        display: grid;
        gap: 12px;
        margin-top: 12px;
        padding: 16px;
        border: 1px solid rgba(255, 255, 255, 0.8);
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.72);
        box-shadow: 0 10px 24px rgba(74, 111, 131, 0.08);
      }
      .lesson-card.recommended { outline: 3px solid rgba(255, 255, 255, 0.58); }
      .lesson-button { min-height: 40px; border: 2px solid rgba(35, 122, 163, 0.18); background: rgba(255, 255, 255, 0.86); color: #155f83; font-size: 0.9rem; }

      .back-link { display: inline-flex; margin-bottom: 18px; color: #237aa3; font-weight: 1000; }
      .lesson-hero, .game-hero {
        margin-bottom: 20px;
        padding: 34px;
        border: 5px solid rgba(255, 255, 255, 0.76);
        border-radius: 32px;
        box-shadow: var(--shadow);
      }
      .game-instructions { max-width: 640px; font-weight: 800; color: #31434f; }
      .money-match {
        max-width: 640px;
        margin: 0 auto;
        padding: 28px;
        border: 1px solid rgba(255, 255, 255, 0.72);
        border-radius: 28px;
        background: rgba(255, 253, 245, 0.86);
        box-shadow: 0 14px 36px rgba(74, 111, 131, 0.1);
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
        color: #41515e;
      }
      .mm-scoreboard strong { color: #237aa3; }
      .mm-badge-pill {
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(255, 216, 104, 0.4);
        font-weight: 900;
        color: #7d4d0e;
      }
      .mm-stage { display: grid; justify-items: center; gap: 10px; margin-bottom: 26px; }
      .mm-stage[hidden], .mm-bins[hidden], .mm-result[hidden] { display: none; }
      .mm-mascot { width: 56px; height: 56px; animation: mascot-float 3.6s ease-in-out infinite; }
      .mm-item-card {
        display: grid;
        gap: 10px;
        width: min(100%, 320px);
        padding: 28px 20px;
        border: 4px solid rgba(255, 255, 255, 0.85);
        border-radius: 26px;
        background: linear-gradient(145deg, rgba(114, 200, 244, 0.16), rgba(255, 255, 255, 0.9));
        box-shadow: 0 14px 30px rgba(65, 91, 113, 0.16);
        transition: box-shadow 200ms ease;
      }
      .mm-item-icon { font-size: 2.6rem; line-height: 1; }
      .mm-item-label { font-size: 1.08rem; font-weight: 900; color: #263743; }
      .mm-item-card.mm-correct { animation: mm-pop 400ms ease; box-shadow: 0 0 0 5px rgba(117, 223, 189, 0.6); }
      .mm-item-card.mm-wrong { animation: mm-shake 400ms ease; box-shadow: 0 0 0 5px rgba(255, 138, 112, 0.6); }
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
        color: #20323d;
        font-family: inherit;
        cursor: pointer;
        transition: transform 160ms ease, box-shadow 160ms ease;
        box-shadow: 0 10px 22px rgba(65, 91, 113, 0.16);
      }
      .mm-bin:hover, .mm-bin:focus-visible { transform: translateY(-4px); outline: none; }
      .mm-bin-icon { font-size: 1.6rem; }
      .mm-bin strong { font-size: 0.98rem; }
      .mm-bin small { font-weight: 800; opacity: 0.75; }
      .mm-result h2 { font-size: 1.6rem; }
      .mm-badge-earned { margin-top: 6px; color: #be5a40; font-weight: 900; }
      .tch-root {
        max-width: 680px;
        margin: 0 auto;
        padding: 28px;
        border: 1px solid rgba(255, 255, 255, 0.72);
        border-radius: 28px;
        background: rgba(255, 253, 245, 0.86);
        box-shadow: 0 14px 36px rgba(74, 111, 131, 0.1);
        text-align: center;
      }
      .tch-hud {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 18px;
        margin-bottom: 16px;
        font-weight: 800;
        color: #41515e;
      }
      .tch-hud strong { color: #237aa3; }
      .tch-hud strong.tch-bump { animation: mm-pop 350ms ease; }
      .tch-hud[hidden] { display: none; }
      .tch-stage-wrap {
        position: relative;
        max-width: 800px;
        margin: 0 auto;
        border-radius: 24px;
        overflow: hidden;
        border: 4px solid rgba(255, 255, 255, 0.85);
        box-shadow: 0 14px 30px rgba(65, 91, 113, 0.16);
      }
      .tch-stage-wrap[hidden] { display: none; }
      .tch-phaser-root { width: 100%; aspect-ratio: 800 / 300; background: #eaf8ff; touch-action: none; line-height: 0; }
      .tch-toast {
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%) translateY(-6px);
        opacity: 0;
        padding: 8px 16px;
        border-radius: 999px;
        background: var(--coral);
        color: #fff6f0;
        font-weight: 900;
        font-size: 0.92rem;
        box-shadow: 0 10px 22px rgba(255, 138, 112, 0.4);
        pointer-events: none;
        transition: opacity 200ms ease, transform 200ms ease;
      }
      .tch-toast-show { opacity: 1; transform: translateX(-50%) translateY(0); }
      .tch-toast-good { background: var(--mint); box-shadow: 0 10px 22px rgba(117, 223, 189, 0.5); }
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
        background: linear-gradient(145deg, var(--mint), var(--sky));
        color: white;
        font-size: 1.4rem;
        cursor: pointer;
        box-shadow: 0 10px 22px rgba(65, 91, 113, 0.2);
        transition: transform 160ms ease;
      }
      .tch-btn:hover, .tch-btn:focus-visible { transform: translateY(-3px); outline: none; }
      .tch-btn:active { transform: translateY(1px); }
      .tch-btn-jump { background: linear-gradient(145deg, var(--yellow), var(--coral)); }
      .tch-hint { margin-top: 14px; font-weight: 700; color: #41515e; }
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
        border: none;
        border-radius: 20px;
        background: white;
        color: #20323d;
        font-family: inherit;
        cursor: pointer;
        box-shadow: 0 10px 22px rgba(65, 91, 113, 0.14);
        transition: transform 160ms ease, opacity 160ms ease;
      }
      .tch-shop-item:hover:not(:disabled) { transform: translateY(-4px); }
      .tch-shop-item:disabled { opacity: 0.45; cursor: not-allowed; }
      .tch-shop-icon { font-size: 1.6rem; }
      .tch-shop-price { font-size: 0.82rem; font-weight: 800; color: #237aa3; }
      .tch-shop-count { font-size: 0.78rem; font-weight: 800; color: #be5a40; min-height: 1em; }
      .tch-wallet { font-weight: 800; color: #41515e; }
      .tch-wallet strong { color: #237aa3; }
      .lesson-detail {
        display: grid;
        gap: 14px;
        max-width: 920px;
        padding: 24px;
        background: rgba(255, 253, 245, 0.92);
      }
      .mission-block {
        padding: 14px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.68);
      }
      .mission-block.highlight { background: rgba(255, 216, 104, 0.26); }
      .mission-block h4 { margin-bottom: 8px; color: #283a45; }
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
        background: linear-gradient(135deg, rgba(117, 223, 189, 0.32), rgba(114, 200, 244, 0.24));
      }
      .badge-line span { color: #3c6277; font-weight: 900; }
      .badge-line strong { color: #be5a40; }

      .feature-card, .resource-card, .mission-card, .roadmap article { padding: 24px; }
      .mini-icon {
        display: grid;
        width: 42px;
        height: 42px;
        place-items: center;
        margin-bottom: 20px;
        border-radius: 16px;
        background: var(--yellow);
        color: #7d4d0e;
      }
      .mini-icon svg { width: 26px; height: 26px; }
      .feature-card.playable .mini-icon { background: rgba(255, 255, 255, 0.72); }
      .feature-card .button { margin-top: 16px; }
      .coming-soon {
        display: inline-flex;
        width: fit-content;
        margin-top: 16px;
        padding: 6px 12px;
        border-radius: 999px;
        background: rgba(36, 49, 59, 0.08);
        color: #61707e;
        font-size: 0.82rem;
        font-weight: 900;
      }
      .mission-card { min-height: 150px; background: linear-gradient(145deg, rgba(114, 200, 244, 0.18), rgba(255, 255, 255, 0.82)); }
      .mission-card span, .roadmap span { display: inline-flex; margin-bottom: 14px; color: #be5a40; font-weight: 1000; }
      .community-panel { max-width: 930px; padding: 44px; }
      .builder-roles { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
      .builder-roles span { border-radius: 999px; padding: 10px 14px; background: white; color: var(--sky-dark); font-weight: 900; }

      @media (max-width: 920px) {
        .top-nav { align-items: flex-start; flex-direction: column; }
        .nav-links { justify-content: flex-start; }
        .home-page { grid-template-columns: 1fr; min-height: auto; padding-top: 52px; }
        .planet-map { max-width: 440px; }
        .level-grid, .planet-grid, .feature-list, .resource-shelf, .mission-board, .roadmap { grid-template-columns: repeat(2, minmax(0, 1fr)); }
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
      }
  `;
}

export { renderPage };

export default {
  async fetch(request) {
    return htmlResponse(renderPage(request));
  },
};
