export const clientScript = `
(function () {
  var STORAGE_KEY = "mp_interactive_lesson_budget_jars";
  var DONE_KEY = "mp_lesson_done_lesson-budget-jars";
  var TOTAL = 10;

  var QUIZ = [
    { q: "预算是在花钱前做，还是花钱后做？", a: 0, opts: [["🕐", "花钱前"], ["🕕", "花钱后"], ["🤷", "不用做"]] },
    { q: "为什么要留一点钱给以后？", a: 0, opts: [["🎯", "以后买更想要的"], ["🙈", "没有用"], ["🔥", "马上花更爽"]] },
    { q: "分享罐可以用来做什么？", a: 0, opts: [["💝", "帮助别人 · 送礼物"], ["🍭", "只买糖果"], ["🚫", "什么都不能做"]] },
  ];

  var OUTCOMES = {
    three: {
      emoji: "⚖️", title: "三只罐子都分一点！", good: true,
      lines: ["✨ 这就是做预算 —— 提前给钱安排好工作。", "🛒 现在用一点 · 🏦 存一点 · 💝 分享一点，钱变得更有用。"],
    },
    spend: {
      emoji: "🛒", title: "全放进花罐……", good: false,
      lines: ["🌑 马上花光，以后想买大东西就没钱了。", "😊 试试：留一点给存罐和分享罐。"],
    },
    save: {
      emoji: "🏦", title: "全藏进存罐……", good: false,
      lines: ["🌑 一分都不用，也不太好玩，还忘了分享。", "😊 试试：三只罐子都照顾到一点。"],
    },
  };

  var CARD_DEFS = [
    { key: "spend", emoji: "🛒", en: "Spend now.", zh: "花罐 · 现在用", border: "#ffb08a" },
    { key: "save", emoji: "🏦", en: "Save for later.", zh: "存罐 · 以后用", border: "#8fc0ff" },
    { key: "share", emoji: "💝", en: "Share warmth.", zh: "分享罐 · 送温暖", border: "#f4a8d2" },
  ];

  var JAR_DEFS = [
    { key: "spend", emoji: "🛒", name: "花罐", en: "Spend", fill: "#ff8b5e", ring: "#ffb08a" },
    { key: "save", emoji: "🏦", name: "存罐", en: "Save", fill: "#4f9df0", ring: "#9fc6ff" },
    { key: "share", emoji: "💝", name: "分享罐", en: "Share", fill: "#e87fb8", ring: "#f4a8d2" },
  ];

  var RL_ANSWERS = {
    spend: ["🛒", "全花光很开心，但以后就没有了。下次留一点给存罐试试？"],
    split: ["⚖️", "太棒了！花 · 存 · 分享都安排一点 —— 这就是聪明的预算。"],
    save: ["🏦", "很会存钱！偶尔也可以花一点、分享一点，让钱更有用。"],
  };

  var MISSION_OPTIONS = [
    ["🔟", "1 成 · 一点点"],
    ["📊", "2-3 成"],
    ["🏦", "一半"],
    ["🤔", "还没想好"],
  ];

  var state = {
    stage: 0, maxStage: 0,
    choice: null,
    exploreOpen: null, exploreSeen: {},
    jars: { spend: 0, save: 0, share: 0 },
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
    var stageNames = [["📖", "故事"], ["🔭", "探索"], ["🏺", "游戏"], ["🌍", "生活"], ["🚀", "任务"], ["❓", "测验"]];
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
    '<div style="position:absolute;top:88px;left:30px;width:13px;height:7px;border-radius:6px;background:#4a2e6b;"></div>' +
    '<div style="position:absolute;top:58px;left:44px;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle at 35% 30%, #ffe08a, #f5a623 75%);border:2px solid #fff3cf;display:flex;align-items:center;justify-content:center;font-size:11px;color:#8a5400;">★</div>';

  // ---------- Stage 1: Story ----------
  function renderCityScene() {
    return (
      '<div class="il-city-scene">' +
      '<div class="il-city-skyline">' +
      '<div style="width:26px;height:40px;background:#6a8fd0;border-radius:3px 3px 0 0;"></div>' +
      '<div style="width:22px;height:56px;background:#5c82c8;border-radius:3px 3px 0 0;"></div>' +
      '<div style="width:30px;height:34px;background:#6a8fd0;border-radius:3px 3px 0 0;"></div>' +
      '<div style="margin-left:auto;width:24px;height:50px;background:#5c82c8;border-radius:3px 3px 0 0;"></div>' +
      '<div style="width:28px;height:38px;background:#6a8fd0;border-radius:3px 3px 0 0;"></div>' +
      "</div>" +
      '<div class="il-city-ground"></div>' +
      '<div class="il-city-jars-row">' +
      '<div class="il-city-jar"><div class="il-city-jar-icon" style="background:linear-gradient(180deg, rgba(255,139,94,.35), rgba(255,139,94,.7));border:3px solid #ffb08a;"></div><div class="il-city-jar-label" style="color:#ffd0b8;">🛒 花</div></div>' +
      '<div class="il-city-jar"><div class="il-city-jar-icon" style="background:linear-gradient(180deg, rgba(79,157,240,.35), rgba(79,157,240,.7));border:3px solid #9fc6ff;"></div><div class="il-city-jar-label" style="color:#cfe1ff;">🏦 存</div></div>' +
      '<div class="il-city-jar"><div class="il-city-jar-icon" style="background:linear-gradient(180deg, rgba(232,127,184,.35), rgba(232,127,184,.7));border:3px solid #f4a8d2;"></div><div class="il-city-jar-label" style="color:#ffd0ec;">💝 分享</div></div>' +
      "</div>" +
      '<div style="position:absolute;left:18px;bottom:30px;width:58px;height:92px;animation:bounce-soft-il 3.5s ease-in-out infinite;">' +
      MIMI_INNER +
      "</div>" +
      "</div>"
    );
  }

  function renderStory() {
    var html = '<div class="il-card"><div class="il-card-head">' +
      '<span class="il-avatar">👧</span>' +
      '<div><div class="il-card-title">米米来到预算城市</div><div class="il-card-sub">Story · 帮米米想一想</div></div>' +
      '<span class="il-money-pill">🏙️ 城门</span>' +
      "</div>";

    html += renderCityScene();

    if (!state.choice) {
      html += '<p class="il-copy">预算城市的入口有<b>三只罐子</b>：<b style="color:#d9611c;">现在用（花）</b>、<b style="color:#2a5fb0;">以后用（存）</b>、<b style="color:#c2469a;">送温暖（分享）</b>。米米手里有一把星星币，<b>该怎么分呢？你来帮她选！</b></p>' +
        '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn il-border-budget-blue" data-choice="three"><span class="il-choice-emoji">⚖️</span><span class="il-choice-label" style="color:#1c5aa1;">三只罐子<br>都分一点</span></button>' +
        '<button type="button" class="il-choice-btn il-border-coral" data-choice="spend"><span class="il-choice-emoji">🛒</span><span class="il-choice-label" style="color:#a14a1c;">全放"花"罐<br>马上花光</span></button>' +
        '<button type="button" class="il-choice-btn il-border-budget-purple" data-choice="save"><span class="il-choice-emoji">🏦</span><span class="il-choice-label" style="color:#6a44c9;">全藏"存"罐<br>一分不花</span></button>' +
        "</div>";
    } else {
      var oc = OUTCOMES[state.choice];
      html += '<div class="il-outcome"><div class="il-outcome-emoji">' + oc.emoji + '</div><div class="il-outcome-title" style="color:#2a5fb0;">' + oc.title + "</div></div>" +
        '<div class="il-outcome-lines">' +
        oc.lines.map(function (text) {
          return '<div class="il-outcome-line il-line-' + (oc.good ? "good-budget" : "bad-budget") + '">' + text + "</div>";
        }).join("") +
        "</div>" +
        '<div class="il-tip il-tip-budget">💡 预算 = 提前给钱安排工作：一部分花、一部分存、一部分分享。</div>' +
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

  var REVEAL_INFO = {
    spend: { emoji: "🛒", title: "花罐 · 现在用", color: "#d9611c", text: '这只罐子的钱，是用来<b>现在</b>买东西的 —— 需要的、或想好了的想要。' },
    save: { emoji: "🏦", title: "存罐 · 以后用", color: "#2a5fb0", text: '攒起来慢慢变多，<b>以后</b>可以买更大的目标。存钱不是失去，是等待更棒的东西。' },
    share: { emoji: "💝", title: "分享罐 · 送温暖", color: "#c2469a", text: '用一点钱<b>帮助别人</b>：送礼物、捐给公益盒。分享一点点，快乐会变大。' },
  };

  function renderExplore() {
    var seenCount = Object.keys(state.exploreSeen).length;
    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-budget">🔭 三只罐子各有任务</div><div class="il-sub">点开每只罐子看看</div></div>';
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
      html += '<div class="il-card il-reveal il-reveal-budget"><div style="font-size:46px;">' + info.emoji + "</div>" +
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

  // ---------- Stage 3: Game (Fill the Three Jars) ----------
  function jarsSum() {
    return state.jars.spend + state.jars.save + state.jars.share;
  }

  function addJar(key) {
    if (jarsSum() >= TOTAL) return;
    state.jars[key] += 1;
    renderGame();
  }

  function removeJar(key) {
    if (state.jars[key] <= 0) return;
    state.jars[key] -= 1;
    renderGame();
  }

  function renderGame() {
    var placed = jarsSum();
    var remaining = TOTAL - placed;
    var allFilled = state.jars.spend > 0 && state.jars.save > 0 && state.jars.share > 0;
    var gameDone = remaining === 0 && allFilled;
    var msg = "";
    var msgKind = "";
    if (gameDone) {
      msg = "🎉 好预算！三只罐子都分到了 —— 你会做预算啦！";
      msgKind = "ok";
    } else if (remaining === 0 && !allFilled) {
      msg = "🤔 有罐子还是空的 —— 花、存、分享，三只都要照顾到哦。";
      msgKind = "no";
    }

    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-budget">🏺 分星星币</div><div class="il-sub">把 10 枚星星币分进三只罐子 —— 三只都要分到，才算好预算！</div></div>';
    html += '<div class="il-jar-panel">';
    html += '<div class="il-bank-row"><div class="il-bank-label">星星币银行</div>' +
      '<div class="il-bank-coins">' + (remaining > 0 ? "★".repeat(remaining) : "（空了）") + "</div>" +
      '<div class="il-bank-remaining">还剩 <strong>' + remaining + "</strong> 枚</div></div>";

    html += '<div class="il-jar-grid">';
    JAR_DEFS.forEach(function (d) {
      var count = state.jars[d.key];
      var fillPct = Math.min(100, (count / TOTAL) * 100 * 2);
      var addDisabled = remaining <= 0;
      html += '<div class="il-jar-card">' +
        '<div class="il-jar-emoji">' + d.emoji + "</div>" +
        '<div class="il-jar-name">' + d.name + "</div>" +
        '<div class="il-jar-en">' + d.en + "</div>" +
        '<div class="il-jar-glass" style="border:2px solid ' + d.ring + ';">' +
        '<div class="il-jar-fill" style="height:' + fillPct + "%;background:" + d.fill + ';"></div>' +
        '<div class="il-jar-coins">' + (count > 0 ? "★".repeat(count) : "") + "</div>" +
        "</div>" +
        '<div class="il-jar-count">' + count + " 枚</div>" +
        '<div class="il-jar-controls">' +
        '<button type="button" class="il-jar-btn il-jar-btn-remove" data-remove="' + d.key + '">−</button>' +
        '<button type="button" class="il-jar-btn il-jar-btn-add" data-add="' + d.key + '" style="background:' + (addDisabled ? "rgba(255,255,255,.12)" : d.fill) + ";border:2px solid " + d.ring + ";opacity:" + (addDisabled ? "0.4" : "1") + ';">+</button>' +
        "</div></div>";
    });
    html += "</div>";

    if (msg) {
      html += '<div class="il-game-msg ' + (msgKind === "ok" ? "il-msg-ok-budget" : "il-msg-no-budget") + '">' + msg + "</div>";
    }

    html += '<div class="il-actions"><button type="button" class="il-clear-btn" id="il-reset-jars">🧹 全部倒出重分</button>' +
      (gameDone ? '<button type="button" class="il-btn-primary il-btn-primary-budget" id="il-to-reallife">继续 →</button>' : "") +
      "</div>";
    html += "</div>";
    stageEl.innerHTML = html;

    var removeBtns = stageEl.querySelectorAll("[data-remove]");
    for (var i = 0; i < removeBtns.length; i++) {
      removeBtns[i].addEventListener("click", function (event) {
        removeJar(event.currentTarget.getAttribute("data-remove"));
      });
    }
    var addBtns = stageEl.querySelectorAll("[data-add]");
    for (var j = 0; j < addBtns.length; j++) {
      addBtns[j].addEventListener("click", function (event) {
        addJar(event.currentTarget.getAttribute("data-add"));
      });
    }
    document.getElementById("il-reset-jars").addEventListener("click", function () {
      state.jars = { spend: 0, save: 0, share: 0 };
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
      html += '<div class="il-rl-center"><div class="il-rl-emoji">💰</div>' +
        '<div class="il-rl-question">拿到零花钱的时候，<br>你会先想好怎么用吗？</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-rl-btn il-rl-yes" data-rl="go">会想一想！🤔</button>' +
        '<button type="button" class="il-rl-btn il-rl-no-budget" data-rl="go">常常直接花</button>' +
        "</div></div>";
    } else if (state.rlStep === 1) {
      html += '<div class="il-rl-center"><div class="il-rl-emoji">🧧</div>' +
        '<div class="il-rl-question">这周你有 9 元零花钱，<br>你会怎么安排？</div>' +
        '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn il-border-coral" data-rl-answer="spend"><span class="il-choice-emoji">🛒</span><span class="il-choice-label" style="color:#a14a1c;">全部<br>花光</span></button>' +
        '<button type="button" class="il-choice-btn il-border-budget-blue" data-rl-answer="split"><span class="il-choice-emoji">⚖️</span><span class="il-choice-label" style="color:#1c5aa1;">花一点·<br>存一点·分一点</span></button>' +
        '<button type="button" class="il-choice-btn il-border-budget-purple" data-rl-answer="save"><span class="il-choice-emoji">🏦</span><span class="il-choice-label" style="color:#6a44c9;">全部<br>存起来</span></button>' +
        "</div></div>";
    } else {
      var a = RL_ANSWERS[state.rlAnswer];
      html += '<div class="il-rl-center"><div class="il-rl-emoji">' + a[0] + "</div>" +
        '<div class="il-rl-answer">' + a[1] + "</div>" +
        '<div class="il-rl-note">没有标准答案 —— 提前给钱安排工作，就是在做预算。</div>' +
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
    html += '<div class="il-mission-box il-mission-box-budget"><div class="il-mission-row"><span class="il-mission-emoji">🗂️</span>' +
      '<div class="il-mission-text">做一张你的<br><span class="il-mission-quote il-mission-quote-budget">三罐预算图（花 · 存 · 分享）</span><br>把它贴进这一周的计划里。完成后，点一个答案：</div></div>' +
      '<div class="il-mission-sub">你的"存罐"打算放进几成的零花钱？</div>';

    if (!state.missionSubmitted) {
      html += '<div class="il-mission-grid il-mission-grid-budget">' +
        MISSION_OPTIONS.map(function (opt, i) {
          return '<button type="button" class="il-mission-option il-mission-option-budget" data-mission="' + i + '">' +
            '<span class="il-mission-option-emoji">' + opt[0] + '</span><span class="il-mission-option-label">' + opt[1] + "</span></button>";
        }).join("") +
        "</div>";
    } else {
      html += '<div class="il-mission-done il-mission-done-budget">✅ 我的存罐计划：' + state.missionText + "</div>" +
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
      html += '<div class="il-quiz-complete il-quiz-complete-budget"><div class="il-badge-orb il-badge-orb-budget">🏙️</div>' +
        '<div class="il-badge-title" style="color:#eaf2ff;">预算城市居民徽章 GET！</div>' +
        '<div class="il-badge-score" style="color:#d3e2ff;">答对 ' + state.quizScore + ' / ' + QUIZ.length + ' 题 · 第 4 关完成 🎉</div>' +
        '<div class="il-badge-note" style="color:#bcd0f0;">今天你学会了：预算要在花钱前做、留一点给以后、分享罐能帮助别人。</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost" id="il-restart-all">🔁 从头再玩一次</button>' +
        (state.nextTeaser
          ? ""
          : '<button type="button" class="il-btn-gold" id="il-reveal-next">下一关 →</button>') +
        "</div>" +
        (state.nextTeaser
          ? '<div class="il-next-teaser">🎯 下一关：目标山 Goal Mountain · 即将开放，敬请期待！</div>'
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
      jars: { spend: 0, save: 0, share: 0 },
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
