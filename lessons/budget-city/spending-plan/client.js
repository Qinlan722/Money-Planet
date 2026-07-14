export const clientScript = `
(function () {
  var STORAGE_KEY = "mp_interactive_lesson_spending_plan";
  var DONE_KEY = "mp_lesson_done_lesson-spending-plan";
  var TOTAL = 12;
  var FARE_MIN = 4;

  var QUIZ = [
    { q: "为什么重要的事情要先安排？", a: 0, opts: [["🛡️", "先保证一定做得到"], ["🌈", "因为更好看"], ["🎲", "没有原因"]] },
    { q: "计划做好后，还能调整吗？", a: 0, opts: [["🔧", "能，随时可以改"], ["🔒", "不能，定了就不改"], ["🙈", "改了会坏掉"]] },
    { q: "如果钱不够，可以怎么改？", a: 0, opts: [["✂️", "减掉不重要的小奖励"], ["😱", "只能放弃全部"], ["💳", "多花一点没关系"]] },
  ];

  var OUTCOMES = {
    priority: { emoji: "🚌", title: "先安排重要的！", good: true,
      lines: ["✨ 这就是做计划 —— 先给一定要做的留够，再决定开心的小奖励。", "🎁 交通、点心排好后，剩下的星星币就能安心买纪念品啦。"] },
    fun: { emoji: "🎁", title: "先买了纪念品……", good: false,
      lines: ["🌑 钱一下花在奖励上，可能连回家的车费都不够了。", "😊 试试先安排重要的交通，再留奖励。"] },
    equal: { emoji: "🟰", title: "三样平均分……", good: false,
      lines: ["🌑 平均分看着公平，可重要的交通不一定够用。", "😊 计划要看轻重：先重要的，再小奖励。"] },
  };

  var CARD_DEFS = [
    { key: "order", emoji: "🔢", en: "Important first.", zh: "先重要后奖励", border: "#8fc0ff" },
    { key: "adjust", emoji: "🔧", en: "Plans can change.", zh: "计划可以改", border: "#ffc14d" },
    { key: "review", emoji: "🔎", en: "Look back after.", zh: "事后回看", border: "#b7a8f0" },
  ];

  var REVEAL_INFO = {
    order: { emoji: "1️⃣ 🚌　2️⃣ 🍡　3️⃣ 🎁", title: "先重要，后奖励", color: "#2a5fb0", text: "计划帮我们排出<b>先后顺序</b>。先安排一定要做的，再把开心的小奖励放后面。" },
    adjust: { emoji: "🔧", title: "计划可以改", color: "#d9611c", text: "计划不是铁的。如果<b>钱不够</b>，就减掉不重要的、或缩小小奖励 —— 随时可以调整。" },
    review: { emoji: "🔎", title: "事后回看", color: "#6a44c9", text: "做完以后回头看看：<b>哪里做得好？哪里下次改进？</b>这样下一个计划会更棒。" },
  };

  var CAT_DEFS = [
    { key: "fare", emoji: "🚌", name: "交通", tag: "重要 · 先留够", fill: "#5f9dff", ring: "#9fc6ff", important: true },
    { key: "snack", emoji: "🍡", name: "点心", tag: "", fill: "#58c98a", ring: "#9be8ac", important: false },
    { key: "gift", emoji: "🎁", name: "小纪念品", tag: "开心奖励", fill: "#e87fb8", ring: "#f4a8d2", important: false },
  ];

  var RL_ANSWERS = {
    fare: ["🚌", "太棒了！先留车费和午餐，剩下的再买喜欢的 —— 这就是会做计划。"],
    toy: ["🧸", "先买纪念品很开心，但可能午餐就不够了。下次先安排重要的？"],
    wait2: ["🤷", "不计划，到现场容易手忙脚乱、钱不够。花一分钟排排顺序会更安心。"],
  };

  var MISSION_OPTIONS = [
    ["🌟", "全都按计划完成了"],
    ["👍", "大部分做到了"],
    ["🔧", "中途调整了一下"],
    ["📝", "下次要改进"],
  ];

  var state = {
    stage: 0, maxStage: 0,
    choice: null,
    exploreOpen: null, exploreSeen: {},
    cats: { fare: 0, snack: 0, gift: 0 },
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
    var stageNames = [["📖", "故事"], ["🔭", "探索"], ["🎪", "游戏"], ["🌍", "生活"], ["🚀", "任务"], ["❓", "测验"]];
    stepsEl.innerHTML = stageNames.map(function (pair, i) {
      var icon = pair[0];
      var label = pair[1];
      var active = state.stage === i;
      var reachable = i <= state.maxStage;
      var cls = "il-step il-step-budget" + (active ? " is-active" : reachable ? " is-reachable" : " is-locked");
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
      '<div class="il-city-scene">' +
      '<div style="position:absolute;top:8px;left:0;right:0;display:flex;justify-content:space-around;font-size:14px;opacity:.85;">' +
      '<span>🔺</span><span>🔻</span><span>🔺</span><span>🔻</span><span>🔺</span><span>🔻</span><span>🔺</span>' +
      "</div>" +
      '<div style="position:absolute;bottom:44px;left:0;right:0;display:flex;justify-content:center;align-items:flex-end;gap:18px;">' +
      '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="font-size:30px;">🚌</div><div style="width:44px;height:12px;background:#f6b27a;border-radius:3px;"></div><div style="font-size:11px;font-weight:700;color:#cfe1ff;">交通</div></div>' +
      '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="font-size:30px;">🍡</div><div style="width:44px;height:12px;background:#9be8ac;border-radius:3px;"></div><div style="font-size:11px;font-weight:700;color:#cfe1ff;">点心</div></div>' +
      '<div style="display:flex;flex-direction:column;align-items:center;gap:4px;"><div style="font-size:30px;">🎁</div><div style="width:44px;height:12px;background:#f4a8d2;border-radius:3px;"></div><div style="font-size:11px;font-weight:700;color:#cfe1ff;">纪念品</div></div>' +
      "</div>" +
      '<div class="il-city-ground"></div>' +
      '<div style="position:absolute;left:20px;bottom:44px;width:58px;height:92px;animation:bounce-soft-il 3.5s ease-in-out infinite;">' +
      MIMI_INNER +
      "</div>" +
      '<div style="position:absolute;left:16px;top:26px;background:#fff;color:#2a5fb0;font-size:13px;font-weight:700;padding:8px 12px;border-radius:14px 14px 14px 2px;max-width:150px;box-shadow:0 3px 0 rgba(0,0,0,.15);">我有 12 个星星币⭐…先安排什么？</div>' +
      "</div>"
    );
  }

  function renderStory() {
    var html = '<div class="il-card"><div class="il-card-head">' +
      '<span class="il-avatar">👧</span>' +
      '<div><div class="il-card-title">米米要去周末市集</div><div class="il-card-sub">Story · 帮米米想一想</div></div>' +
      '<span class="il-money-pill">🎪 市集</span>' +
      "</div>";

    html += renderMarketScene();

    if (!state.choice) {
      html += '<p class="il-copy">周末市集来啦！米米只有 <b style="color:#2a5fb0;">12 个星星币</b>，要安排好<b>交通</b>、<b>点心</b>和一个<b>小纪念品</b>。她该先安排什么？<b>你来帮她选！</b></p>' +
        '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn il-border-budget-blue" data-choice="priority"><span class="il-choice-emoji">🚌</span><span class="il-choice-label" style="color:#1c5aa1;">先安排重要的<br>（交通），<br>再留小奖励</span></button>' +
        '<button type="button" class="il-choice-btn il-border-coral" data-choice="fun"><span class="il-choice-emoji">🎁</span><span class="il-choice-label" style="color:#a14a1c;">先买最想要的<br>纪念品，<br>剩下再说</span></button>' +
        '<button type="button" class="il-choice-btn il-border-budget-purple" data-choice="equal"><span class="il-choice-emoji">🟰</span><span class="il-choice-label" style="color:#6a44c9;">三样平均分，<br>不管重不重要</span></button>' +
        "</div>";
    } else {
      var oc = OUTCOMES[state.choice];
      html += '<div class="il-outcome"><div class="il-outcome-emoji">' + oc.emoji + '</div><div class="il-outcome-title" style="color:#2a5fb0;">' + oc.title + "</div></div>" +
        '<div class="il-outcome-lines">' +
        oc.lines.map(function (text) {
          return '<div class="il-outcome-line il-line-' + (oc.good ? "good-budget" : "bad-budget") + '">' + text + "</div>";
        }).join("") +
        "</div>" +
        '<div class="il-tip il-tip-budget">💡 计划就是排先后：先安排重要的，再决定开心的小奖励。</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost il-btn-ghost-budget" id="il-reset-choice">↩️ 再选一次</button>' +
        (oc.good ? '<button type="button" class="il-btn-primary il-btn-primary-budget" id="il-to-explore">继续 →</button>' : "") +
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
    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-budget">🔭 做计划的三个本领</div><div class="il-sub">点开每张卡片看看</div></div>';
    html += '<div class="il-explore-grid">';
    CARD_DEFS.forEach(function (c) {
      var open = state.exploreOpen === c.key;
      var seen = !!state.exploreSeen[c.key];
      html += '<button type="button" class="il-explore-card il-explore-card-budget' + (open ? " is-open" : "") + '" data-open="' + c.key + '" style="border-color:' + c.border + "; box-shadow:0 " + (open ? "2px" : "6px") + "px 0 " + c.border + ';">' +
        '<span class="il-explore-emoji">' + c.emoji + "</span>" +
        '<span class="il-explore-zh-bold">' + c.zh + "</span>" +
        '<span class="il-explore-en-faded">' + c.en + "</span>" +
        '<span class="il-explore-check">' + (seen ? "✅ 看过了" : "👆 点我") + "</span>" +
        "</button>";
    });
    html += "</div>";

    if (state.exploreOpen) {
      var info = REVEAL_INFO[state.exploreOpen];
      html += '<div class="il-card il-reveal il-reveal-budget"><div style="font-size:' + (state.exploreOpen === "order" ? "34px" : "46px") + ';">' + info.emoji + "</div>" +
        '<div class="il-outcome-title" style="color:' + info.color + ';margin:6px 0;">' + info.title + "</div>" +
        '<div class="il-reveal-text">' + info.text + "</div></div>";
    }

    if (seenCount >= 3) {
      html += '<div class="il-actions il-center"><button type="button" class="il-btn-primary il-btn-primary-budget" id="il-to-game">开始游戏 →</button></div>';
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

  // ---------- Stage 3: Game (Plan the Market Day) ----------
  function catsSum() {
    var c = state.cats;
    return c.fare + c.snack + c.gift;
  }

  function addCat(key) {
    if (catsSum() >= TOTAL) return;
    state.cats[key] += 1;
    renderGame();
  }

  function removeCat(key) {
    if (state.cats[key] <= 0) return;
    state.cats[key] -= 1;
    renderGame();
  }

  function renderGame() {
    var placed = catsSum();
    var remaining = TOTAL - placed;
    var fareOk = state.cats.fare >= FARE_MIN;
    var allUsed = remaining === 0;
    var eachHasSome = state.cats.fare > 0 && state.cats.snack > 0 && state.cats.gift > 0;
    var gameDone = allUsed && fareOk && eachHasSome;
    var msg = "", msgKind = "";
    if (gameDone) {
      msg = "🎉 好计划！交通留够了，点心和奖励也安排好啦～";
      msgKind = "ok";
    } else if (allUsed && !fareOk) {
      msg = "🚌 先给交通留够（至少 " + FARE_MIN + " 个），不然去不了市集哦。";
      msgKind = "no";
    } else if (allUsed && !eachHasSome) {
      msg = "🤔 有一样还是空的 —— 三样都安排一点，计划才完整。";
      msgKind = "no";
    }

    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-budget">🎪 排好市集计划</div><div class="il-sub">把 12 个星星币安排好 —— 先给重要的交通留够，再分点心和小奖励！</div></div>';
    html += '<div class="il-jar-panel">';
    html += '<div class="il-bank-row"><div class="il-bank-label">还没安排的星星币</div>' +
      '<div class="il-bank-coins">' + (remaining > 0 ? "⭐".repeat(remaining) : "（都安排好了）") + "</div>" +
      '<div class="il-bank-remaining">剩 <strong>' + remaining + "</strong> / " + TOTAL + "</div></div>";

    html += '<div style="display:flex;flex-direction:column;gap:12px;">';
    CAT_DEFS.forEach(function (d) {
      var count = state.cats[d.key];
      var fillPct = Math.min(100, (count / TOTAL) * 100 * 1.5);
      var addDisabled = remaining <= 0;
      html += '<div class="il-cat-row">' +
        '<div class="il-cat-emoji">' + d.emoji + "</div>" +
        '<div class="il-cat-body">' +
        '<div class="il-cat-name-row"><span class="il-cat-name">' + d.name + "</span>" +
        (d.tag
          ? '<span class="il-cat-tag" style="background:' + (d.important ? "rgba(255,215,102,.25)" : "rgba(255,255,255,.12)") + ";color:" + (d.important ? "#ffd766" : "#cfe1ff") + ";border:1px solid " + (d.important ? "#ffd766" : "rgba(255,255,255,.3)") + ';">' + d.tag + "</span>"
          : "") +
        "</div>" +
        '<div class="il-cat-track"><div class="il-cat-fill" style="width:' + fillPct + "%;background:" + d.fill + ';"></div></div>' +
        "</div>" +
        '<div class="il-cat-controls">' +
        '<button type="button" class="il-cat-btn" data-remove="' + d.key + '">−</button>' +
        '<div class="il-cat-count">' + count + "</div>" +
        '<button type="button" class="il-cat-btn" data-add="' + d.key + '" style="background:' + (addDisabled ? "rgba(255,255,255,.12)" : d.fill) + ";border-color:" + d.ring + ";opacity:" + (addDisabled ? "0.4" : "1") + ';">+</button>' +
        "</div></div>";
    });
    html += "</div>";

    if (msg) {
      html += '<div class="il-game-msg ' + (msgKind === "ok" ? "il-msg-ok-budget" : "il-msg-no-budget") + '">' + msg + "</div>";
    }

    html += '<div class="il-actions"><button type="button" class="il-clear-btn" id="il-reset-cats">🧹 重新安排</button>' +
      (gameDone ? '<button type="button" class="il-btn-primary il-btn-primary-budget" id="il-to-reallife">继续 →</button>' : "") +
      "</div>";
    html += "</div>";
    stageEl.innerHTML = html;

    var removeBtns = stageEl.querySelectorAll("[data-remove]");
    for (var i = 0; i < removeBtns.length; i++) {
      removeBtns[i].addEventListener("click", function (event) {
        removeCat(event.currentTarget.getAttribute("data-remove"));
      });
    }
    var addBtns = stageEl.querySelectorAll("[data-add]");
    for (var j = 0; j < addBtns.length; j++) {
      addBtns[j].addEventListener("click", function (event) {
        addCat(event.currentTarget.getAttribute("data-add"));
      });
    }
    document.getElementById("il-reset-cats").addEventListener("click", function () {
      state.cats = { fare: 0, snack: 0, gift: 0 };
      renderGame();
    });
    var toReal = document.getElementById("il-to-reallife");
    if (toReal) toReal.addEventListener("click", function () { goStage(3); });
  }

  // ---------- Stage 4: Real Life ----------
  function renderRealLife() {
    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-budget">🌍 现实连接</div><div class="il-sub">不是考试，而是生活</div></div>';
    html += '<div class="il-card">';

    if (state.rlStep === 0) {
      html += '<div class="il-rl-center"><div class="il-rl-emoji">🚌</div>' +
        '<div class="il-rl-question">要去春游啦！<br>你会提前计划花钱，还是到了现场再说？</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-rl-btn il-rl-yes" data-rl="go">会提前计划！📝</button>' +
        '<button type="button" class="il-rl-btn il-rl-no-budget" data-rl="go">常常临时决定</button>' +
        "</div></div>";
    } else if (state.rlStep === 1) {
      html += '<div class="il-rl-center"><div class="il-rl-emoji">🎒</div>' +
        '<div class="il-rl-question">春游前你有 20 元，<br>你会先安排哪一样？</div>' +
        '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn il-border-budget-blue" data-rl-answer="fare"><span class="il-choice-emoji">🚌</span><span class="il-choice-label" style="color:#1c5aa1;">先留车费<br>和午餐</span></button>' +
        '<button type="button" class="il-choice-btn il-border-coral" data-rl-answer="toy"><span class="il-choice-emoji">🧸</span><span class="il-choice-label" style="color:#a14a1c;">先买<br>纪念品</span></button>' +
        '<button type="button" class="il-choice-btn il-border-budget-purple" data-rl-answer="wait2"><span class="il-choice-emoji">🤷</span><span class="il-choice-label" style="color:#6a44c9;">不计划，<br>现场再说</span></button>' +
        "</div></div>";
    } else {
      var a = RL_ANSWERS[state.rlAnswer];
      html += '<div class="il-rl-center"><div class="il-rl-emoji">' + a[0] + "</div>" +
        '<div class="il-rl-answer">' + a[1] + "</div>" +
        '<div class="il-rl-note">没有标准答案 —— 提前排好先后顺序，就是在做计划。</div>' +
        '<button type="button" class="il-btn-primary il-btn-primary-budget" id="il-to-mission">继续 →</button>' +
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
    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-budget">🚀 财商任务</div><div class="il-sub">这个任务要离开电脑才能完成哦</div></div>';
    html += '<div class="il-mission-box il-mission-box-budget"><div class="il-mission-row"><span class="il-mission-emoji">🗓️</span>' +
      '<div class="il-mission-text">完成一张<br><span class="il-mission-quote il-mission-quote-budget">"一周小计划"</span><br>到周末回头看看，哪些地方做得好。完成后，点一个答案：</div></div>' +
      '<div class="il-mission-sub">这一周回看，你的计划完成得怎么样？</div>';

    if (!state.missionSubmitted) {
      html += '<div class="il-mission-grid il-mission-grid-budget">' +
        MISSION_OPTIONS.map(function (opt, i) {
          return '<button type="button" class="il-mission-option il-mission-option-budget" data-mission="' + i + '">' +
            '<span class="il-mission-option-emoji">' + opt[0] + '</span><span class="il-mission-option-label">' + opt[1] + "</span></button>";
        }).join("") +
        "</div>";
    } else {
      html += '<div class="il-mission-done il-mission-done-budget">✅ 这周的计划回看：' + state.missionText + "</div>" +
        '<div class="il-rl-center">' +
        '<div class="il-mission-complete" style="color:#2a5fb0;">Mission 完成！🎖️</div>' +
        '<button type="button" class="il-btn-primary il-btn-primary-budget" id="il-to-quiz">最后一关 →</button>' +
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
    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-budget">❓ 小测验</div><div class="il-sub">' +
      (state.quizFinished ? "全部完成！" : "第 " + (state.quizIndex + 1) + " / " + QUIZ.length + " 题 · 点图片作答") + "</div></div>";

    if (!state.quizFinished) {
      var q = QUIZ[Math.min(state.quizIndex, QUIZ.length - 1)];
      html += '<div class="il-card"><div class="il-quiz-q">' + q.q + '</div><div class="il-quiz-grid">' +
        q.opts.map(function (opt, i) {
          return '<button type="button" class="il-quiz-option il-quiz-option-budget' + (state.quizFeedback === "wrong" ? " il-shake" : "") + '" data-pick="' + i + '">' +
            '<span class="il-quiz-emoji">' + opt[0] + '</span><span class="il-quiz-label">' + opt[1] + "</span></button>";
        }).join("") +
        "</div>";
      if (state.quizFeedback) {
        html += '<div class="il-quiz-feedback ' + (state.quizFeedback === "correct" ? "is-correct" : "is-wrong") + '">' +
          (state.quizFeedback === "correct" ? "🎉 Correct！答对啦！" : "🤔 再想想～") + "</div>";
      }
      html += "</div>";
    } else {
      html += '<div class="il-quiz-complete il-quiz-complete-budget"><div class="il-badge-orb il-badge-orb-budget">🗓️</div>' +
        '<div class="il-badge-title" style="color:#eaf2ff;">小小计划师徽章 GET！</div>' +
        '<div class="il-badge-score" style="color:#d3e2ff;">答对 ' + state.quizScore + ' / ' + QUIZ.length + ' 题 · 第 8 关完成 🎉</div>' +
        '<div class="il-badge-note" style="color:#bcd0f0;">今天你学会了：先安排重要的、计划可以随时调整、事后回看会做得更好。</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost" id="il-restart-all">🔁 从头再玩一次</button>' +
        (state.nextTeaser
          ? ""
          : '<button type="button" class="il-btn-gold" id="il-reveal-next">下一关 →</button>') +
        "</div>" +
        (state.nextTeaser
          ? '<div class="il-next-teaser">🎯 下一关即将开放，敬请期待！</div>'
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
      cats: { fare: 0, snack: 0, gift: 0 },
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
