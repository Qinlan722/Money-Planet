export const clientScript = `
(function () {
  var STORAGE_KEY = "mp_interactive_lesson_fair_trade";
  var DONE_KEY = "mp_lesson_done_lesson-fair-trade";

  var TRADES = [
    { giveEmoji: "🏷️", giveLabel: "1 张贴纸", getEmoji: "🏷️", getLabel: "1 张贴纸", fair: true,
      why: "数量一样、用途相近，两人都愿意 —— 公平！" },
    { giveEmoji: "🏷️", giveLabel: "1 张贴纸", getEmoji: "🖍️", getLabel: "一整盒彩笔", fair: false,
      why: "彩笔更常用、数量也更多，同学会吃亏 —— 不太公平。" },
    { giveEmoji: "🧽", giveLabel: "3 块橡皮", getEmoji: "📏", getLabel: "1 把尺子", fair: true,
      why: "数量多换用途大，两人都同意 —— 公平！" },
    { giveEmoji: "🍪", giveLabel: "吃过一半的饼干", getEmoji: "✏️", getLabel: "1 支新铅笔", fair: false,
      why: "吃过一半的饼干几乎没用了，别人会吃亏 —— 不太公平。" },
    { giveEmoji: "🍬", giveLabel: "1 颗糖", getEmoji: "🧸", getLabel: "同学最爱、不想换的玩具", fair: false,
      why: "对方根本不愿意，不能强迫 —— 不公平。" },
  ];

  var QUIZ = [
    { q: "如果只有一方开心，这算公平交换吗？", a: 1, opts: [["🙂", "算"], ["🤝", "不算"], ["🤷", "看心情"]] },
    { q: "交换前，最应该问清楚什么？", a: 1, opts: [["👀", "只问我喜不喜欢"], ["🤝", "双方是否都愿意"], ["🎨", "东西什么颜色"]] },
    { q: "为什么有些东西不适合交换？", a: 0, opts: [["💎", "有些很珍贵 · 别人更需要"], ["🌈", "因为颜色"], ["🔁", "所有东西都能换"]] },
  ];

  var OUTCOMES = {
    fair: {
      emoji: "🤝", title: "看用途 · 看数量 · 两人都同意！", good: true,
      lines: ["✨ 这就是公平交换 —— 想清楚再换，两个人都开心。", "🖍️ 彩笔更常用，可以多加一点东西，让两边差不多。"],
    },
    me: {
      emoji: "😋", title: "只看“我喜欢”……", good: false,
      lines: ["🌑 只顾自己喜欢，容易让同学吃亏。", "😊 试试：也想想对方，两人都愿意才算公平。"],
    },
    force: {
      emoji: "😤", title: "硬要别人换……", good: false,
      lines: ["🌑 强迫别人，一点都不公平，还会伤感情。", "😊 试试：好好商量，对方同意才可以换。"],
    },
  };

  var CARD_DEFS = [
    { key: "use", emoji: "🛠️", en: "How useful?", zh: "用途", border: "#ffcf8a" },
    { key: "amount", emoji: "⚖️", en: "How much?", zh: "数量", border: "#ffb08a" },
    { key: "agree", emoji: "🤝", en: "Both agree?", zh: "同意", border: "#f0c46a" },
  ];

  var RL_ANSWERS = {
    no: ["🙅", "很好！你不想换，就可以礼貌地拒绝 —— 这完全没问题。"],
    fairer: ["⚖️", "太棒了！一起商量出两人都满意的换法，就是公平高手。"],
    givein: ["😔", "如果不想换，其实可以说“不”。下次记得：愿不愿意由你决定。"],
  };

  var MISSION_OPTIONS = [
    ["🤝", "两人都同意才交换"],
    ["⚖️", "先想想用途和数量"],
    ["💎", "珍贵的东西不换"],
    ["✍️", "我自己想的一条"],
  ];

  var state = {
    stage: 0, maxStage: 0,
    choice: null,
    exploreOpen: null, exploreSeen: {},
    tradeIndex: 0, stamps: 0, revealWhy: false, gameMsg: null, gameFinished: false,
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
    var stageNames = [["📖", "故事"], ["🔭", "探索"], ["⚖️", "游戏"], ["🌍", "生活"], ["🚀", "任务"], ["❓", "测验"]];
    stepsEl.innerHTML = stageNames.map(function (pair, i) {
      var icon = pair[0];
      var label = pair[1];
      var active = state.stage === i;
      var reachable = i <= state.maxStage;
      var cls = "il-step" + (active ? " is-active" : reachable ? " is-reachable" : " is-locked");
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

  var LELE_BUST =
    '<div style="position:absolute;bottom:0;left:3px;width:60px;height:40px;border-radius:24px 24px 0 0;background:#3aa0a0;"></div>' +
    '<div style="position:absolute;bottom:30px;left:15px;width:36px;height:34px;border-radius:50%;background:#ffd9b3;"></div>' +
    '<div style="position:absolute;bottom:52px;left:13px;width:40px;height:20px;border-radius:20px 20px 6px 6px;background:#6b4a2e;"></div>' +
    '<div style="position:absolute;bottom:44px;left:23px;width:4px;height:5px;border-radius:50%;background:#33224d;"></div>' +
    '<div style="position:absolute;bottom:44px;left:39px;width:4px;height:5px;border-radius:50%;background:#33224d;"></div>' +
    '<div style="position:absolute;bottom:39px;left:20px;width:6px;height:4px;border-radius:50%;background:#ff9eb0;opacity:.7;"></div>' +
    '<div style="position:absolute;bottom:39px;left:40px;width:6px;height:4px;border-radius:50%;background:#ff9eb0;opacity:.7;"></div>';

  var CLASSMATE_BUST =
    '<div style="position:absolute;bottom:0;right:3px;width:60px;height:40px;border-radius:24px 24px 0 0;background:#8a63f0;"></div>' +
    '<div style="position:absolute;bottom:30px;right:15px;width:36px;height:34px;border-radius:50%;background:#ffe0c4;"></div>' +
    '<div style="position:absolute;bottom:54px;right:13px;width:40px;height:18px;border-radius:18px 18px 8px 8px;background:#d98a2e;"></div>' +
    '<div style="position:absolute;bottom:44px;right:39px;width:4px;height:5px;border-radius:50%;background:#33224d;"></div>' +
    '<div style="position:absolute;bottom:44px;right:23px;width:4px;height:5px;border-radius:50%;background:#33224d;"></div>' +
    '<div style="position:absolute;bottom:39px;right:20px;width:6px;height:4px;border-radius:50%;background:#ff9eb0;opacity:.7;"></div>' +
    '<div style="position:absolute;bottom:39px;right:40px;width:6px;height:4px;border-radius:50%;background:#ff9eb0;opacity:.7;"></div>';

  // ---------- Stage 1: Story ----------
  function renderStallScene() {
    return (
      '<div class="il-stall-scene">' +
      '<div class="il-stall-awning"></div>' +
      '<div class="il-stall-pennant"></div>' +
      '<div class="il-stall-sign">交换小站</div>' +
      '<div class="il-stall-counter"></div>' +
      '<div class="il-stall-counter-top"></div>' +
      '<div style="position:absolute;left:40px;bottom:60px;width:66px;height:78px;">' + LELE_BUST + "</div>" +
      '<div style="position:absolute;right:40px;bottom:60px;width:66px;height:78px;">' + CLASSMATE_BUST + "</div>" +
      '<div style="position:absolute;left:118px;bottom:8px;font-size:30px;">🏷️</div>' +
      '<div style="position:absolute;right:118px;bottom:8px;font-size:30px;">🖍️</div>' +
      '<div style="position:absolute;left:50%;bottom:14px;transform:translateX(-50%);font-size:28px;color:#ffe9a8;animation:swap-arrow-il 1.6s ease-in-out infinite;">⇄</div>' +
      '<div style="position:absolute;left:50%;bottom:74px;transform:translateX(-50%);font-size:26px;animation:wobble-il 2.5s ease-in-out infinite;">❓</div>' +
      "</div>"
    );
  }

  function renderStory() {
    var html = '<div class="il-card"><div class="il-card-head">' +
      '<span class="il-avatar">🧒</span>' +
      '<div><div class="il-card-title">乐乐想换一支彩笔</div><div class="il-card-sub">Story · 帮乐乐想一想</div></div>' +
      '<span class="il-money-pill">🔁 交换</span>' +
      "</div>";

    html += renderStallScene();

    if (!state.choice) {
      html += '<p class="il-copy">乐乐想用<b>一张贴纸</b>换同学的<b>彩笔</b>，可是彩笔更常用。<b>怎样交换才算公平呢？你来帮乐乐选！</b></p>' +
        '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn il-border-teal" data-choice="fair"><span class="il-choice-emoji">🤝</span><span class="il-choice-label" style="color:#0d6b54;">想想用途和数量，<br>两人都同意才换</span></button>' +
        '<button type="button" class="il-choice-btn il-border-coral" data-choice="me"><span class="il-choice-emoji">😋</span><span class="il-choice-label" style="color:#a14a1c;">只要我喜欢<br>就换</span></button>' +
        '<button type="button" class="il-choice-btn il-border-red" data-choice="force"><span class="il-choice-emoji">😤</span><span class="il-choice-label" style="color:#b23a3a;">硬要同学<br>跟我换</span></button>' +
        "</div>";
    } else {
      var oc = OUTCOMES[state.choice];
      html += '<div class="il-outcome"><div class="il-outcome-emoji">' + oc.emoji + '</div><div class="il-outcome-title">' + oc.title + "</div></div>" +
        '<div class="il-outcome-lines">' +
        oc.lines.map(function (text) {
          return '<div class="il-outcome-line ' + (oc.good ? "il-line-good" : "il-line-bad") + '">' + text + "</div>";
        }).join("") +
        "</div>" +
        '<div class="il-tip">💡 公平交换 = 看用途、看数量，还要双方都愿意。</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost" id="il-reset-choice">↩️ 再选一次</button>' +
        (oc.good ? '<button type="button" class="il-btn-primary" id="il-to-explore">继续 →</button>' : "") +
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
    use: { emoji: "🛠️", title: "用途 · 有多有用？", text: "彩笔天天要用，一张贴纸用一次就没了。<b>越常用、越有用的东西，价值越高。</b>" },
    amount: { emoji: "⚖️", title: "数量 · 两边差不多吗？", text: "一张贴纸换一整盒彩笔，两边差太多。<b>数量太不一样，就不太公平。</b>" },
    agree: { emoji: "🤝", title: "同意 · 两人都愿意吗？", text: "就算东西差不多，也要问对方愿不愿意。<b>不能强迫别人 —— 双方都同意才公平。</b>" },
  };

  function renderExplore() {
    var seenCount = Object.keys(state.exploreSeen).length;
    var html = '<div class="il-explore-head"><div class="il-h2">🔭 公平交换的三把尺子</div><div class="il-sub">点开每张卡片看看</div></div>';
    html += '<div class="il-explore-grid">';
    CARD_DEFS.forEach(function (c) {
      var open = state.exploreOpen === c.key;
      var seen = !!state.exploreSeen[c.key];
      html += '<button type="button" class="il-explore-card' + (open ? " is-open" : "") + '" data-open="' + c.key + '" style="border-color:' + c.border + "; box-shadow:0 " + (open ? "2px" : "6px") + "px 0 " + c.border + ';">' +
        '<span class="il-explore-emoji">' + c.emoji + "</span>" +
        '<span class="il-explore-zh-bold">' + c.zh + "</span>" +
        '<span class="il-explore-en-faded">' + c.en + "</span>" +
        '<span class="il-explore-check">' + (seen ? "✅ 看过了" : "👆 点我") + "</span>" +
        "</button>";
    });
    html += "</div>";

    if (state.exploreOpen) {
      var info = REVEAL_INFO[state.exploreOpen];
      html += '<div class="il-card il-reveal"><div style="font-size:46px;">' + info.emoji + "</div>" +
        '<div class="il-outcome-title" style="margin:6px 0;">' + info.title + "</div>" +
        '<div class="il-reveal-text">' + info.text + "</div></div>";
    }

    if (seenCount >= 3) {
      html += '<div class="il-actions il-center"><button type="button" class="il-btn-primary" id="il-to-game">开始游戏 →</button></div>';
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

  // ---------- Stage 3: Game (Fair or Not) ----------
  function judge(isFair) {
    if (state.gameFinished || state.revealWhy) return;
    var t = TRADES[state.tradeIndex];
    if (isFair === t.fair) {
      state.revealWhy = true;
      state.stamps += 1;
      state.gameMsg = null;
      renderGame();
    } else {
      state.gameMsg = { kind: "no", text: "🤔 再想想：用途、数量，双方都愿意吗？" };
      renderGame();
      window.setTimeout(function () {
        if (state.gameMsg && state.gameMsg.kind === "no") {
          state.gameMsg = null;
          renderGame();
        }
      }, 1500);
    }
  }

  function nextTrade() {
    var next = state.tradeIndex + 1;
    if (next >= TRADES.length) {
      state.gameFinished = true;
      state.revealWhy = false;
    } else {
      state.tradeIndex = next;
      state.revealWhy = false;
      state.gameMsg = null;
    }
    renderGame();
  }

  function renderGame() {
    var html = '<div class="il-explore-head"><div class="il-h2">⚖️ 公平审核员</div><div class="il-sub">看看每笔交换 —— 公平就盖章通过，不公平就拦下来！</div></div>';
    html += '<div class="il-trade-panel">';

    html += '<div class="il-stamp-row">' +
      TRADES.map(function (_, i) {
        var doneReal = i < state.stamps;
        return '<div class="il-stamp-cell' + (doneReal ? " is-done" : "") + '">' + (doneReal ? "✔" : i + 1) + "</div>";
      }).join("") +
      "</div>";

    if (!state.gameFinished) {
      var t = TRADES[Math.min(state.tradeIndex, TRADES.length - 1)];
      html += '<div class="il-game-target-text" style="color:#ffe9c4;">第 ' + (state.tradeIndex + 1) + " / " + TRADES.length + " 笔 —— 这样换，公平吗？</div>";

      html += '<div class="il-trade-card">' +
        '<div class="il-trade-side il-trade-give"><div class="il-trade-label">🧒 乐乐给出</div><div class="il-trade-emoji">' + t.giveEmoji + '</div><div class="il-trade-item-label">' + t.giveLabel + "</div></div>" +
        '<div class="il-trade-arrow">⇄</div>' +
        '<div class="il-trade-side il-trade-get"><div class="il-trade-label">🧑 同学给出</div><div class="il-trade-emoji">' + t.getEmoji + '</div><div class="il-trade-item-label">' + t.getLabel + "</div></div>" +
        "</div>";

      if (!state.revealWhy) {
        if (state.gameMsg) {
          html += '<div class="il-game-msg il-msg-over">' + state.gameMsg.text + "</div>";
        }
        html += '<div class="il-judge-grid">' +
          '<button type="button" class="il-judge-btn il-judge-fair" id="il-judge-fair">✅ 公平，通过</button>' +
          '<button type="button" class="il-judge-btn il-judge-unfair" id="il-judge-unfair">❌ 不太公平</button>' +
          "</div>";
      } else {
        html += '<div class="il-mission-done">' +
          '<div style="font-size:30px;margin-bottom:4px;">' + (t.fair ? "✅" : "❌") + "</div>" +
          '<div style="font-size:16px;font-weight:700;line-height:1.7;">' + t.why + "</div></div>" +
          '<div class="il-actions il-center"><button type="button" class="il-btn-primary" id="il-next-trade">' + (state.tradeIndex + 1 >= TRADES.length ? "完成审核 →" : "下一笔 →") + "</button></div>";
      }
    } else {
      html += '<div class="il-rl-center">' +
        '<div class="il-done-emoji">🎉</div>' +
        '<div class="il-done-title">Fair trader!</div>' +
        '<div class="il-done-sub">You checked every trade!</div>' +
        '<div class="il-done-score">五笔交换全部审核完毕，乐乐学会了怎样换才公平！</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost" id="il-restart-game">🔁 再玩一次</button>' +
        '<button type="button" class="il-btn-primary" id="il-to-reallife">继续 →</button>' +
        "</div></div>";
    }
    html += "</div>";
    stageEl.innerHTML = html;

    if (!state.gameFinished) {
      var fairBtn = document.getElementById("il-judge-fair");
      if (fairBtn) fairBtn.addEventListener("click", function () { judge(true); });
      var unfairBtn = document.getElementById("il-judge-unfair");
      if (unfairBtn) unfairBtn.addEventListener("click", function () { judge(false); });
      var nextBtn = document.getElementById("il-next-trade");
      if (nextBtn) nextBtn.addEventListener("click", nextTrade);
    } else {
      document.getElementById("il-restart-game").addEventListener("click", function () {
        state.tradeIndex = 0;
        state.stamps = 0;
        state.revealWhy = false;
        state.gameMsg = null;
        state.gameFinished = false;
        renderGame();
      });
      document.getElementById("il-to-reallife").addEventListener("click", function () { goStage(3); });
    }
  }

  // ---------- Stage 4: Real Life ----------
  function renderRealLife() {
    var html = '<div class="il-explore-head"><div class="il-h2">🌍 现实连接</div><div class="il-sub">不是考试，而是生活</div></div>';
    html += '<div class="il-card">';

    if (state.rlStep === 0) {
      html += '<div class="il-rl-center"><div class="il-rl-emoji">🎒</div>' +
        '<div class="il-rl-question">你在学校，<br>和同学换过文具或玩具吗？</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-rl-btn il-rl-yes" data-rl="go">换过！🔁</button>' +
        '<button type="button" class="il-rl-btn il-rl-no" data-rl="go">还没换过</button>' +
        "</div></div>";
    } else if (state.rlStep === 1) {
      html += '<div class="il-rl-center"><div class="il-rl-emoji">😟</div>' +
        '<div class="il-rl-question">同学想拿一块糖，<br>换你很喜欢、还在用的水彩笔。<br>你会怎么做？</div>' +
        '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn il-border-teal" data-rl-answer="no"><span class="il-choice-emoji">🙅</span><span class="il-choice-label" style="color:#0d6b54;">礼貌地说<br>"这次不换"</span></button>' +
        '<button type="button" class="il-choice-btn il-border-yellow" data-rl-answer="fairer"><span class="il-choice-emoji">⚖️</span><span class="il-choice-label" style="color:#a35c00;">商量一个<br>更公平的换法</span></button>' +
        '<button type="button" class="il-choice-btn il-border-coral" data-rl-answer="givein"><span class="il-choice-emoji">😔</span><span class="il-choice-label" style="color:#a14a1c;">不想换，<br>但还是换了</span></button>' +
        "</div></div>";
    } else {
      var a = RL_ANSWERS[state.rlAnswer];
      html += '<div class="il-rl-center"><div class="il-rl-emoji">' + a[0] + "</div>" +
        '<div class="il-rl-answer">' + a[1] + "</div>" +
        '<div class="il-rl-note">公平交换里，"愿不愿意"永远由你自己决定。</div>' +
        '<button type="button" class="il-btn-primary" id="il-to-mission">继续 →</button>' +
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
    var html = '<div class="il-explore-head"><div class="il-h2">🚀 财商任务</div><div class="il-sub">这个任务要离开电脑才能完成哦</div></div>';
    html += '<div class="il-mission-box"><div class="il-mission-row"><span class="il-mission-emoji">📝</span>' +
      '<div class="il-mission-text">写一条属于你的<br><span class="il-mission-quote">"公平交换小规则"</span><br>贴在你的学习桌旁。完成后，点你写的那一条：</div></div>';

    if (!state.missionSubmitted) {
      html += '<div class="il-mission-grid">' +
        MISSION_OPTIONS.map(function (opt, i) {
          return '<button type="button" class="il-mission-option" data-mission="' + i + '">' +
            '<span class="il-mission-option-emoji">' + opt[0] + '</span><span class="il-mission-option-label">' + opt[1] + "</span></button>";
        }).join("") +
        "</div>";
    } else {
      html += '<div class="il-mission-done">✅ 我的公平交换小规则：' + state.missionText + "</div>" +
        '<div class="il-rl-center">' +
        '<div class="il-mission-complete">Mission 完成！🎖️</div>' +
        '<button type="button" class="il-btn-primary" id="il-to-quiz">最后一关 →</button>' +
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
    var html = '<div class="il-explore-head"><div class="il-h2">❓ 小测验</div><div class="il-sub">' +
      (state.quizFinished ? "全部完成！" : "第 " + (state.quizIndex + 1) + " / " + QUIZ.length + " 题 · 点图片作答") + "</div></div>";

    if (!state.quizFinished) {
      var q = QUIZ[Math.min(state.quizIndex, QUIZ.length - 1)];
      html += '<div class="il-card"><div class="il-quiz-q">' + q.q + '</div><div class="il-quiz-grid">' +
        q.opts.map(function (opt, i) {
          return '<button type="button" class="il-quiz-option' + (state.quizFeedback === "wrong" ? " il-shake" : "") + '" data-pick="' + i + '">' +
            '<span class="il-quiz-emoji">' + opt[0] + '</span><span class="il-quiz-label">' + opt[1] + "</span></button>";
        }).join("") +
        "</div>";
      if (state.quizFeedback) {
        html += '<div class="il-quiz-feedback ' + (state.quizFeedback === "correct" ? "is-correct" : "is-wrong") + '">' +
          (state.quizFeedback === "correct" ? "🎉 Correct！答对啦！" : "🤔 再想想～") + "</div>";
      }
      html += "</div>";
    } else {
      html += '<div class="il-quiz-complete il-quiz-complete-trade"><div class="il-badge-orb">🤝</div>' +
        '<div class="il-badge-title" style="color:#fff3cf;">公平交换徽章 GET！</div>' +
        '<div class="il-badge-score" style="color:#ffe9c4;">答对 ' + state.quizScore + ' / ' + QUIZ.length + ' 题 · 第 5 关完成 🎉</div>' +
        '<div class="il-badge-note" style="color:#ffdca0;">今天你学会了：公平交换要看用途、看数量，还要双方都愿意。</div>' +
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
      tradeIndex: 0, stamps: 0, revealWhy: false, gameMsg: null, gameFinished: false,
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
