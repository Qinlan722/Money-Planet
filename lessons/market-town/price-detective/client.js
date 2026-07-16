export const clientScript = `
(function () {
  var STORAGE_KEY = "mp_interactive_lesson_price_detective";
  var DONE_KEY = "mp_lesson_done_lesson-price-compare";

  var CASES = [
    {
      question: "🥤 同样的果汁，哪杯更划算？",
      a: { emoji: "🥤", name: "大杯", qty: "500 毫升", price: "6 币", unit: "每 100 毫升 ≈ 1.2 币" },
      b: { emoji: "🧃", name: "小杯", qty: "250 毫升", price: "4 币", unit: "每 100 毫升 ≈ 1.6 币" },
      better: "a",
      why: "大杯每 100 毫升更便宜 —— 量大反而更划算！",
    },
    {
      question: "✏️ 两盒铅笔，哪盒更划算？",
      a: { emoji: "✏️", name: "小盒", qty: "6 支", price: "6 币", unit: "每支 1 币" },
      b: { emoji: "✏️", name: "大盒", qty: "12 支", price: "10 币", unit: "每支 ≈ 0.8 币" },
      better: "b",
      why: "大盒每支不到 1 币 —— 总价贵，但每支更便宜！",
    },
    {
      question: "🍎 一样的苹果，哪堆更划算？",
      a: { emoji: "🍎", name: "3 个装", qty: "3 个", price: "9 币", unit: "每个 3 币" },
      b: { emoji: "🍎", name: "5 个装", qty: "5 个", price: "20 币", unit: "每个 4 币" },
      better: "a",
      why: "3 个装每个只要 3 币 —— 数量多不一定更划算，要算每个的价！",
    },
  ];

  var QUIZ = [
    { q: "最便宜的，一定最适合你吗？", a: 1, opts: [["✅", "是的，越便宜越好"], ["🤔", "不一定，还要看合不合适"], ["🚫", "永远不买便宜的"]] },
    { q: "比较价格时，可以看哪三件事？", a: 0, opts: [["🔍", "价格 · 数量 · 需不需要"], ["🌈", "颜色 · 包装 · 牌子"], ["🎲", "随便看看"]] },
    { q: "为什么买前要想想“我需要吗”？", a: 0, opts: [["🧭", "用不上再便宜也浪费"], ["💸", "为了多花钱"], ["🙈", "没有原因"]] },
  ];

  var OUTCOMES = {
    investigate: { emoji: "🔍", title: "当好价格小侦探！", good: true,
      lines: ["✨ 太棒了！价格、数量、还有“我要什么”，三样都看才够聪明。", "🥤 想喝多点选大杯，喜欢贴纸选送贴纸的 —— 看清楚再决定。"] },
    cheap: { emoji: "🏷️", title: "只看谁便宜……", good: false,
      lines: ["🌑 两家都是 6 币，光比价格分不出来呀。", "😊 再看看：谁的量多？我更想要哪个？"] },
    gift: { emoji: "🎁", title: "只看谁送东西……", good: false,
      lines: ["🌑 送贴纸很吸引人，但你其实是来买果汁的。", "😊 别被赠品带跑，先看果汁本身值不值。"] },
  };

  var CARD_DEFS = [
    { key: "qty", emoji: "🔢", en: "Price per one.", zh: "看每个多少钱", border: "#ffb884" },
    { key: "cheap", emoji: "🏷️", en: "Cheapest isn't best.", zh: "便宜≠适合", border: "#9fc6ff" },
    { key: "need", emoji: "🧭", en: "Do I need it?", zh: "再问我需要吗", border: "#b7a8f0" },
  ];

  var RL_ANSWERS = {
    unit: ["🔍", "太棒了！算每支多少钱，就能看出真正划算的那盒 —— 好侦探！"],
    total: ["🏷️", "只看总价，可能错过更划算的大盒。试着算算每支多少钱？"],
    needq: ["🧭", "很会想！先问用不用得完 —— 用不上，再便宜也是浪费。"],
  };

  var MISSION_OPTIONS = [
    ["🔢", "每一个更便宜"],
    ["📦", "数量更多更实用"],
    ["🧭", "更适合我们需要"],
    ["🏷️", "总价更省"],
  ];

  var state = {
    stage: 0, maxStage: 0,
    choice: null,
    exploreOpen: null, exploreSeen: {},
    caseIndex: 0, score: 0, casePicked: null, gameFinished: false,
    rlStep: 0, rlAnswer: null,
    missionText: "", missionSubmitted: false,
    quizIndex: 0, quizScore: 0, quizFeedback: null, quizFinished: false,
    nextTeaser: false,
  };

  try {
    var saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && typeof saved.stage === "number") {
      state.stage = saved.stage;
      state.maxStage = saved.maxStage || saved.stage;
    }
  } catch (e) {}

  if (window.localStorage.getItem(DONE_KEY) === "1") {
    state.stage = 5;
    state.maxStage = 5;
    state.quizFinished = true;
  }

  var stepsEl = document.getElementById("il-steps");
  var stageEl = document.getElementById("il-stage");

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function saveProgress() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ stage: state.stage, maxStage: state.maxStage }));
    } catch (e) {}
  }

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

  function markLessonComplete() {
    window.localStorage.setItem(DONE_KEY, "1");
    bumpStreak();
  }

  function goStage(n) {
    state.stage = n;
    state.maxStage = Math.max(state.maxStage, n);
    saveProgress();
    render();
  }

  function renderSteps() {
    var stageNames = [["📖", "故事"], ["🔭", "探索"], ["🕵️", "游戏"], ["🌍", "生活"], ["🚀", "任务"], ["❓", "测验"]];
    stepsEl.innerHTML = stageNames.map(function (pair, i) {
      var icon = pair[0];
      var label = pair[1];
      var active = state.stage === i;
      var reachable = i <= state.maxStage;
      var cls = "il-step il-step-market" + (active ? " is-active" : reachable ? " is-reachable" : " is-locked");
      return (
        '<button type="button" class="' + cls + '" data-goto="' + i + '"' + (reachable ? "" : " disabled") + ">" +
        '<span class="il-step-icon">' + icon + "</span>" +
        '<span class="il-step-label">' + label + "</span>" +
        "</button>"
      );
    }).join("");
    var buttons = stepsEl.querySelectorAll("[data-goto]");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function (event) {
        var n = Number(event.currentTarget.getAttribute("data-goto"));
        if (n <= state.maxStage) goStage(n);
      });
    }
  }

  var MIMI_INNER =
    '<div style="position:absolute;top:14px;left:-4px;width:16px;height:20px;border-radius:50%;background:#5b3a86;transform:rotate(-25deg);"></div>' +
    '<div style="position:absolute;top:14px;right:-4px;width:16px;height:20px;border-radius:50%;background:#5b3a86;transform:rotate(25deg);"></div>' +
    '<div style="position:absolute;top:6px;left:9px;width:40px;height:34px;border-radius:50% 50% 45% 45%;background:#6a44b8;"></div>' +
    '<div style="position:absolute;top:14px;left:13px;width:32px;height:30px;border-radius:50%;background:#ffd9b3;"></div>' +
    '<div style="position:absolute;top:10px;left:13px;width:32px;height:14px;border-radius:50% 50% 0 0;background:#6a44b8;"></div>' +
    '<div style="position:absolute;top:27px;left:21px;width:4px;height:5px;border-radius:50%;background:#33224d;"></div>' +
    '<div style="position:absolute;top:27px;left:33px;width:4px;height:5px;border-radius:50%;background:#33224d;"></div>' +
    '<div style="position:absolute;top:32px;left:16px;width:6px;height:4px;border-radius:50%;background:#ff9eb0;opacity:.7;"></div>' +
    '<div style="position:absolute;top:32px;left:37px;width:6px;height:4px;border-radius:50%;background:#ff9eb0;opacity:.7;"></div>' +
    '<div style="position:absolute;top:44px;left:9px;width:40px;height:34px;background:#ff8fb0;clip-path:polygon(30% 0,70% 0,100% 100%,0 100%);border-radius:4px 4px 10px 10px;"></div>' +
    '<div style="position:absolute;top:44px;left:21px;width:16px;height:8px;background:#fff3f7;border-radius:0 0 8px 8px;"></div>' +
    '<div style="position:absolute;top:48px;left:1px;width:9px;height:22px;border-radius:5px;background:#ffd9b3;transform:rotate(12deg);"></div>' +
    '<div style="position:absolute;top:48px;right:1px;width:9px;height:22px;border-radius:5px;background:#ffd9b3;transform:rotate(-12deg);"></div>' +
    '<div style="position:absolute;top:76px;left:16px;width:9px;height:16px;border-radius:4px;background:#ffd9b3;"></div>' +
    '<div style="position:absolute;top:76px;left:32px;width:9px;height:16px;border-radius:4px;background:#ffd9b3;"></div>' +
    '<div style="position:absolute;top:88px;left:14px;width:13px;height:7px;border-radius:6px;background:#4a2e6b;"></div>' +
    '<div style="position:absolute;top:88px;left:30px;width:13px;height:7px;border-radius:6px;background:#4a2e6b;"></div>';

  // ---------- Stage 1: Story ----------
  function renderMarketScene() {
    return (
      '<div class="il-market-scene">' +
      '<div style="position:absolute;top:0;left:0;right:0;height:60px;background:linear-gradient(180deg, rgba(255,220,160,.35), transparent);"></div>' +
      '<div style="position:absolute;bottom:40px;left:20%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:4px;">' +
      '<div style="width:70px;height:24px;background:#ff8a3c;border-radius:6px 6px 0 0;box-shadow:0 3px 0 rgba(0,0,0,.2);"></div>' +
      '<div style="font-size:52px;line-height:1;">🥤</div>' +
      '<div style="background:#fff;color:#d9611c;font-size:13px;font-weight:800;padding:3px 10px;border-radius:8px;">大杯 · 6币</div>' +
      "</div>" +
      '<div style="position:absolute;bottom:40px;right:20%;transform:translateX(50%);display:flex;flex-direction:column;align-items:center;gap:4px;">' +
      '<div style="width:70px;height:24px;background:#ffcf5e;border-radius:6px 6px 0 0;box-shadow:0 3px 0 rgba(0,0,0,.2);"></div>' +
      '<div style="font-size:42px;line-height:1;">🧃</div>' +
      '<div style="background:#fff;color:#c07800;font-size:13px;font-weight:800;padding:3px 10px;border-radius:8px;">送贴纸 · 6币</div>' +
      "</div>" +
      '<div style="position:absolute;left:0;right:0;bottom:0;height:40px;background:linear-gradient(180deg, #8a4a1c, #6b3612);"></div>' +
      '<div style="position:absolute;left:50%;bottom:40px;width:58px;height:92px;transform:translateX(-50%);animation:bounce-soft-il 3.5s ease-in-out infinite;">' +
      MIMI_INNER +
      '<div class="il-magnify" style="position:absolute;top:40px;right:-14px;width:26px;height:26px;border-radius:50%;border:4px solid #ffd766;background:rgba(255,255,255,.35);"></div>' +
      '<div style="position:absolute;top:62px;right:-20px;width:4px;height:16px;background:#ffd766;border-radius:3px;transform:rotate(-45deg);"></div>' +
      "</div>" +
      "</div>"
    );
  }

  function renderStory() {
    var html = '<div class="il-card"><div class="il-card-head">' +
      '<span class="il-avatar">👧</span>' +
      '<div><div class="il-card-title">米米在市场小镇买果汁</div><div class="il-card-sub">Story · 帮米米想一想</div></div>' +
      '<span class="il-money-pill">🕵️ 侦探</span>' +
      "</div>";

    html += renderMarketScene();

    if (!state.choice) {
      html += '<p class="il-copy">市场小镇有两家果汁摊，都卖 <b style="color:#d9611c;">6 个星星币</b>：一家<b>杯子大一点</b>，一家<b>送贴纸</b>。米米该怎么当好这个“价格小侦探”？<b>你来帮她选！</b></p>' +
        '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn il-border-peach" data-choice="investigate"><span class="il-choice-emoji">🔍</span><span class="il-choice-label" style="color:#a64d10;">比一比：价格、<br>数量、我要什么</span></button>' +
        '<button type="button" class="il-choice-btn il-border-blue" data-choice="cheap"><span class="il-choice-emoji">🏷️</span><span class="il-choice-label" style="color:#1c5aa1;">只看谁<br>更便宜</span></button>' +
        '<button type="button" class="il-choice-btn il-border-budget-purple" data-choice="gift"><span class="il-choice-emoji">🎁</span><span class="il-choice-label" style="color:#6a44c9;">只看谁<br>送东西</span></button>' +
        "</div>";
    } else {
      var oc = OUTCOMES[state.choice];
      html += '<div class="il-outcome"><div class="il-outcome-emoji">' + oc.emoji + '</div><div class="il-outcome-title" style="color:#d9611c;">' + oc.title + "</div></div>" +
        '<div class="il-outcome-lines">' +
        oc.lines.map(function (text) {
          return '<div class="il-outcome-line il-line-' + (oc.good ? "good-market" : "bad-market") + '">' + text + "</div>";
        }).join("") +
        "</div>" +
        '<div class="il-tip il-tip-market">💡 价格小侦探会看三件事：价格、数量（大小），还有“我真的需要吗”。</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost il-btn-ghost-market" id="il-reset-choice">↩️ 再选一次</button>' +
        (oc.good ? '<button type="button" class="il-btn-primary il-btn-primary-market" id="il-to-explore">继续 →</button>' : "") +
        "</div>";
    }
    html += "</div>";
    stageEl.innerHTML = html;

    if (!state.choice) {
      var btns = stageEl.querySelectorAll("[data-choice]");
      for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function (event) {
          state.choice = event.currentTarget.getAttribute("data-choice");
          renderStory();
        });
      }
    } else {
      document.getElementById("il-reset-choice").addEventListener("click", function () {
        state.choice = null;
        renderStory();
      });
      var toExplore = document.getElementById("il-to-explore");
      if (toExplore) toExplore.addEventListener("click", function () { goStage(1); });
    }
  }

  // ---------- Stage 2: Explore ----------
  function openExplore(key) {
    state.exploreOpen = key;
    state.exploreSeen[key] = true;
    renderExplore();
  }

  function renderExplore() {
    var seenCount = Object.keys(state.exploreSeen).length;
    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-market">🔭 侦探的三个放大镜</div><div class="il-sub">点开每张卡片看看</div></div>';
    html += '<div class="il-explore-grid">';
    CARD_DEFS.forEach(function (c) {
      var open = state.exploreOpen === c.key;
      var seen = !!state.exploreSeen[c.key];
      html += '<button type="button" class="il-explore-card il-explore-card-market' + (open ? " is-open" : "") + '" data-open="' + c.key + '" style="border-color:' + c.border + "; box-shadow:0 " + (open ? "2px" : "6px") + "px 0 " + c.border + ';">' +
        '<span class="il-explore-emoji">' + c.emoji + "</span>" +
        '<span class="il-explore-zh-bold">' + c.zh + "</span>" +
        '<span class="il-explore-en-faded">' + c.en + "</span>" +
        '<span class="il-explore-check">' + (seen ? "✅ 看过了" : "👆 点我") + "</span>" +
        "</button>";
    });
    html += "</div>";

    if (state.exploreOpen === "qty") {
      html += '<div class="il-card il-reveal il-reveal-market" style="text-align:center;">' +
        '<div style="font-size:22px;">✏️ 一盒6支 · 6币</div>' +
        '<div style="font-size:22px;margin-top:6px;">✏️✏️ 一盒12支 · 10币</div>' +
        '<div class="il-outcome-title" style="color:#d9611c;margin:10px 0 4px;">看“每一个”多少钱</div>' +
        '<div class="il-reveal-text">总价贵，不一定更贵。12 支 10 币，每支还不到 1 币，比 6 支划算！</div></div>';
    } else if (state.exploreOpen === "cheap") {
      html += '<div class="il-card il-reveal il-reveal-market"><div style="font-size:46px;">🏷️</div>' +
        '<div class="il-outcome-title" style="margin:6px 0;color:#c07800;">最便宜≠最适合</div>' +
        '<div class="il-reveal-text">便宜是好事，但如果买回来<b>用不上</b>，再便宜也是浪费。要选<b>适合自己</b>的。</div></div>';
    } else if (state.exploreOpen === "need") {
      html += '<div class="il-card il-reveal il-reveal-market"><div style="font-size:46px;">🧭</div>' +
        '<div class="il-outcome-title" style="margin:6px 0;color:#6a44c9;">再问：我需要吗</div>' +
        '<div class="il-reveal-text">比完价格和数量，最后别忘了问自己：<b>我真的需要这么多吗？</b>需要，才值得买。</div></div>';
    }

    if (seenCount >= 3) {
      html += '<div class="il-actions il-center"><button type="button" class="il-btn-primary il-btn-primary-market" id="il-to-game">开始游戏 →</button></div>';
    }

    stageEl.innerHTML = html;
    var cardBtns = stageEl.querySelectorAll("[data-open]");
    for (var i = 0; i < cardBtns.length; i++) {
      cardBtns[i].addEventListener("click", function (event) {
        openExplore(event.currentTarget.getAttribute("data-open"));
      });
    }
    var toGameBtn = document.getElementById("il-to-game");
    if (toGameBtn) toGameBtn.addEventListener("click", function () { goStage(2); });
  }

  // ---------- Stage 3: Game (Spot the Better Buy) ----------
  function chooseCase(side) {
    if (state.casePicked) return;
    var c = CASES[state.caseIndex];
    var correct = side === c.better;
    state.casePicked = side;
    if (correct) state.score += 1;
    renderGame();
  }

  function advanceCase() {
    var next = state.caseIndex + 1;
    if (next >= CASES.length) {
      state.gameFinished = true;
      state.casePicked = null;
    } else {
      state.caseIndex = next;
      state.casePicked = null;
    }
    renderGame();
  }

  function buyCardStyle(side, c) {
    var revealed = !!state.casePicked;
    var isBetter = c.better === side;
    var isPicked = state.casePicked === side;
    var border = "#ffd8bd", shadow = "0 6px 0 #ffd8bd", transform = "none", opacity = "1";
    if (revealed) {
      if (isBetter) { border = "#58c98a"; shadow = "0 6px 0 #58c98a"; transform = "translateY(-4px)"; }
      else if (isPicked) { border = "#f08a6a"; shadow = "0 6px 0 #f08a6a"; opacity = "0.7"; }
      else { border = "#e6d6c8"; shadow = "0 6px 0 #e6d6c8"; opacity = "0.7"; }
    }
    return "border:3px solid " + border + ";box-shadow:" + shadow + ";transform:" + transform + ";opacity:" + opacity + ";";
  }

  function buyUnitStyle(side, c) {
    var revealed = !!state.casePicked;
    var color = revealed ? (c.better === side ? "#1c7a3e" : "#a35c4a") : "transparent";
    return "color:" + color + ";";
  }

  function renderGame() {
    var total = CASES.length;
    var c = CASES[Math.min(state.caseIndex, total - 1)];
    var revealed = !!state.casePicked;

    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-market">🕵️ 找出更划算</div><div class="il-sub">当好价格小侦探 —— 看清价格和数量，选出更划算的那个！</div></div>';
    html += '<div class="il-market-panel">';

    if (!state.gameFinished) {
      html += '<div class="il-game-target-text" style="color:#ffe0c4;">第 ' + (state.caseIndex + 1) + " / " + total + " 案 · 答对 " + state.score + "</div>";
      html += '<div style="background:rgba(0,0,0,.2);border-radius:14px;padding:12px 16px;text-align:center;font-size:15px;font-weight:700;color:#fff;margin-bottom:16px;">' + c.question + "</div>";

      html += '<div class="il-buy-grid">';
      ["a", "b"].forEach(function (side) {
        var item = c[side];
        html += '<button type="button" class="il-buy-card" data-side="' + side + '" style="' + buyCardStyle(side, c) + '"' + (revealed ? " disabled" : "") + ">" +
          '<span class="il-buy-emoji">' + item.emoji + "</span>" +
          '<span class="il-buy-name">' + item.name + "</span>" +
          '<span class="il-buy-qty">' + item.qty + "</span>" +
          '<span class="il-buy-price">' + item.price + "</span>" +
          '<span class="il-buy-unit" style="' + buyUnitStyle(side, c) + '">' + item.unit + "</span>" +
          "</button>";
      });
      html += "</div>";

      if (revealed) {
        var correct = state.casePicked === c.better;
        var msg = (correct ? "🎉 破案！" : "🔍 再看看：") + c.why;
        html += '<div style="margin-top:16px;text-align:center;font-family:\\'ZCOOL KuaiLe\\', sans-serif;font-size:17px;letter-spacing:1px;line-height:1.5;color:#ffe0c4;">' + msg + "</div>";
        var isLast = state.caseIndex >= total - 1;
        html += '<div style="display:flex;justify-content:center;margin-top:12px;">' +
          '<button type="button" class="il-btn-primary il-btn-primary-market" id="il-next-case">' + (isLast ? "看结果 ✓" : "下一案 →") + "</button></div>";
      }
    } else {
      html += '<div class="il-rl-center">' +
        '<div class="il-done-emoji">🕵️</div>' +
        '<div class="il-done-title" style="color:#ffcfa8;">Case closed!</div>' +
        '<div class="il-done-sub">你破了 ' + total + " 个案子，答对 <b style=\\\"color:#ffd766;\\\">" + state.score + "</b> 个 —— 真是个厉害的价格小侦探！</div>" +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost" id="il-restart-game">🔁 再查一次</button>' +
        '<button type="button" class="il-btn-primary il-btn-primary-market" id="il-to-reallife">继续 →</button>' +
        "</div></div>";
    }
    html += "</div>";
    stageEl.innerHTML = html;

    if (!state.gameFinished) {
      var sideBtns = stageEl.querySelectorAll("[data-side]");
      for (var i = 0; i < sideBtns.length; i++) {
        sideBtns[i].addEventListener("click", function (event) {
          chooseCase(event.currentTarget.getAttribute("data-side"));
        });
      }
      var nextBtn = document.getElementById("il-next-case");
      if (nextBtn) nextBtn.addEventListener("click", advanceCase);
    } else {
      document.getElementById("il-restart-game").addEventListener("click", function () {
        state.caseIndex = 0;
        state.score = 0;
        state.casePicked = null;
        state.gameFinished = false;
        renderGame();
      });
      document.getElementById("il-to-reallife").addEventListener("click", function () { goStage(3); });
    }
  }

  // ---------- Stage 4: Real Life ----------
  function renderRealLife() {
    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-market">🌍 现实连接</div><div class="il-sub">不是考试，而是生活</div></div>';
    html += '<div class="il-card">';

    if (state.rlStep === 0) {
      html += '<div class="il-rl-center"><div class="il-rl-emoji">🛒</div>' +
        '<div class="il-rl-question">买东西时，你会不会看看<br>“哪个更划算”再决定？</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-rl-btn il-rl-yes" data-rl="go">会比一比！🔍</button>' +
        '<button type="button" class="il-rl-btn il-rl-no-market" data-rl="go">常常直接拿</button>' +
        "</div></div>";
    } else if (state.rlStep === 1) {
      html += '<div class="il-rl-center"><div class="il-rl-emoji">✏️</div>' +
        '<div class="il-rl-question">一盒 6 支铅笔 6 元，<br>一盒 12 支 10 元。你会先看什么？</div>' +
        '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn il-border-peach" data-rl-answer="unit"><span class="il-choice-emoji">🔍</span><span class="il-choice-label" style="color:#a64d10;">算算每支<br>多少钱</span></button>' +
        '<button type="button" class="il-choice-btn il-border-blue" data-rl-answer="total"><span class="il-choice-emoji">🏷️</span><span class="il-choice-label" style="color:#1c5aa1;">只看谁<br>总价便宜</span></button>' +
        '<button type="button" class="il-choice-btn il-border-budget-purple" data-rl-answer="needq"><span class="il-choice-emoji">🧭</span><span class="il-choice-label" style="color:#6a44c9;">想想我<br>用得完吗</span></button>' +
        "</div></div>";
    } else {
      var a = RL_ANSWERS[state.rlAnswer];
      html += '<div class="il-rl-center"><div class="il-rl-emoji">' + a[0] + "</div>" +
        '<div class="il-rl-answer">' + a[1] + "</div>" +
        '<div class="il-rl-note">没有标准答案 —— 会比价格、数量和需要，就是好侦探。</div>' +
        '<button type="button" class="il-btn-primary il-btn-primary-market" id="il-to-mission">继续 →</button>' +
        "</div>";
    }
    html += "</div>";
    stageEl.innerHTML = html;

    var rlBtns = stageEl.querySelectorAll("[data-rl]");
    for (var i = 0; i < rlBtns.length; i++) {
      rlBtns[i].addEventListener("click", function () {
        state.rlStep = 1;
        renderRealLife();
      });
    }
    var ansBtns = stageEl.querySelectorAll("[data-rl-answer]");
    for (var j = 0; j < ansBtns.length; j++) {
      ansBtns[j].addEventListener("click", function (event) {
        state.rlStep = 2;
        state.rlAnswer = event.currentTarget.getAttribute("data-rl-answer");
        renderRealLife();
      });
    }
    var toMission = document.getElementById("il-to-mission");
    if (toMission) toMission.addEventListener("click", function () { goStage(4); });
  }

  // ---------- Stage 5: Mission ----------
  function renderMission() {
    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-market">🚀 财商任务</div><div class="il-sub">这个任务要离开电脑才能完成哦</div></div>';
    html += '<div class="il-mission-box il-mission-box-market"><div class="il-mission-row"><span class="il-mission-emoji">🔎</span>' +
      '<div class="il-mission-text">和家人做一次<br><span class="il-mission-quote il-mission-quote-market">“价格小侦探”调查</span><br>比较两种水果或文具的价格和数量。完成后，点一个答案：</div></div>' +
      '<div class="il-mission-sub">调查后，你发现更划算的那个是靠什么赢的？</div>';

    if (!state.missionSubmitted) {
      html += '<div class="il-mission-grid il-mission-grid-market">' +
        MISSION_OPTIONS.map(function (opt, i) {
          return '<button type="button" class="il-mission-option il-mission-option-market" data-mission="' + i + '">' +
            '<span class="il-mission-option-emoji">' + opt[0] + '</span><span class="il-mission-option-label">' + opt[1] + "</span></button>";
        }).join("") +
        "</div>";
    } else {
      html += '<div class="il-mission-done il-mission-done-market">✅ 我的侦探发现：' + state.missionText + "</div>" +
        '<div class="il-rl-center">' +
        '<div class="il-mission-complete" style="color:#d9611c;">Mission 完成！🎖️</div>' +
        '<button type="button" class="il-btn-primary il-btn-primary-market" id="il-to-quiz">最后一关 →</button>' +
        "</div>";
    }
    html += "</div>";
    stageEl.innerHTML = html;

    if (!state.missionSubmitted) {
      var opts = stageEl.querySelectorAll("[data-mission]");
      for (var i = 0; i < opts.length; i++) {
        opts[i].addEventListener("click", function (event) {
          var idx = Number(event.currentTarget.getAttribute("data-mission"));
          state.missionText = MISSION_OPTIONS[idx][1];
          state.missionSubmitted = true;
          renderMission();
        });
      }
    } else {
      document.getElementById("il-to-quiz").addEventListener("click", function () { goStage(5); });
    }
  }

  // ---------- Stage 6: Quiz ----------
  function pickQuiz(i) {
    if (state.quizFeedback === "correct") return;
    var q = QUIZ[state.quizIndex];
    if (i === q.a) {
      state.quizScore += 1;
      state.quizFeedback = "correct";
      renderQuiz();
      window.setTimeout(function () {
        var next = state.quizIndex + 1;
        if (next >= QUIZ.length) {
          state.quizFinished = true;
          state.quizFeedback = null;
          markLessonComplete();
        } else {
          state.quizIndex = next;
          state.quizFeedback = null;
        }
        renderQuiz();
      }, 1100);
    } else {
      state.quizFeedback = "wrong";
      renderQuiz();
      window.setTimeout(function () {
        if (state.quizFeedback === "wrong") {
          state.quizFeedback = null;
          renderQuiz();
        }
      }, 1200);
    }
  }

  function renderQuiz() {
    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-market">❓ 小测验</div><div class="il-sub">' +
      (state.quizFinished ? "全部完成！" : "第 " + (state.quizIndex + 1) + " / " + QUIZ.length + " 题 · 点图片作答") + "</div></div>";

    if (!state.quizFinished) {
      var q = QUIZ[Math.min(state.quizIndex, QUIZ.length - 1)];
      html += '<div class="il-card"><div class="il-quiz-q">' + q.q + '</div><div class="il-quiz-grid">' +
        q.opts.map(function (opt, i) {
          return '<button type="button" class="il-quiz-option il-quiz-option-market' + (state.quizFeedback === "wrong" ? " il-shake" : "") + '" data-pick="' + i + '">' +
            '<span class="il-quiz-emoji">' + opt[0] + '</span><span class="il-quiz-label">' + opt[1] + "</span></button>";
        }).join("") +
        "</div>";
      if (state.quizFeedback) {
        html += '<div class="il-quiz-feedback ' + (state.quizFeedback === "correct" ? "is-correct" : "is-wrong") + '">' +
          (state.quizFeedback === "correct" ? "🎉 Correct！答对啦！" : "🤔 再想想～") + "</div>";
      }
      html += "</div>";
    } else {
      html += '<div class="il-quiz-complete il-quiz-complete-market"><div class="il-badge-orb il-badge-orb-market">🕵️</div>' +
        '<div class="il-badge-title" style="color:#fff2e6;">价格侦探徽章 GET！</div>' +
        '<div class="il-badge-score" style="color:#ffe0c4;">答对 ' + state.quizScore + ' / ' + QUIZ.length + ' 题 · 第 9 关完成 🎉</div>' +
        '<div class="il-badge-note" style="color:#ffd3b0;">今天你学会了：比价格要看每一个多少钱、最便宜不一定最适合、买之前想想需不需要。</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost" id="il-restart-all">🔁 从头再玩一次</button>' +
        (state.nextTeaser
          ? ""
          : '<button type="button" class="il-btn-gold" id="il-reveal-next">下一关 →</button>') +
        "</div>" +
        (state.nextTeaser
          ? '<div class="il-next-teaser"><a href="/lesson/lesson-market-signs?level=explorer" style="color:#ffe9a8;">📢 下一关：广告会说话 Ads Can Talk →</a></div>'
          : "") +
        "</div>";
    }
    stageEl.innerHTML = html;

    if (!state.quizFinished) {
      var opts = stageEl.querySelectorAll("[data-pick]");
      for (var i = 0; i < opts.length; i++) {
        opts[i].addEventListener("click", function (event) {
          pickQuiz(Number(event.currentTarget.getAttribute("data-pick")));
        });
      }
    } else {
      document.getElementById("il-restart-all").addEventListener("click", restartAll);
      var revealBtn = document.getElementById("il-reveal-next");
      if (revealBtn) {
        revealBtn.addEventListener("click", function () {
          state.nextTeaser = true;
          renderQuiz();
        });
      }
    }
  }

  function restartAll() {
    state = {
      stage: 0, maxStage: 5, choice: null, exploreOpen: null, exploreSeen: {},
      caseIndex: 0, score: 0, casePicked: null, gameFinished: false,
      rlStep: 0, rlAnswer: null, missionText: "", missionSubmitted: false,
      quizIndex: 0, quizScore: 0, quizFeedback: null, quizFinished: false, nextTeaser: false,
    };
    saveProgress();
    render();
  }

  function render() {
    renderSteps();
    if (state.stage === 0) renderStory();
    else if (state.stage === 1) renderExplore();
    else if (state.stage === 2) renderGame();
    else if (state.stage === 3) renderRealLife();
    else if (state.stage === 4) renderMission();
    else if (state.stage === 5) renderQuiz();
  }

  render();
})();
`;
