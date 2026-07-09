export const clientScript = `
(function () {
  var STORAGE_KEY = "mp_interactive_lesson_money_is";
  var DONE_KEY = "mp_lesson_done_lesson-money-is";

  var QUIZ = [
    { q: "下面哪个属于 Saving（储蓄）？", a: 0, opts: [["🏦", "存进银行"], ["🍭", "买糖果"], ["🎮", "买游戏"]] },
    { q: "下面哪个是 Need（需要）？", a: 1, opts: [["🧸", "玩具"], ["💧", "喝水"], ["🍬", "糖果"]] },
    { q: "哪个可以用来交换东西？", a: 2, opts: [["🍂", "树叶"], ["🪨", "石头"], ["💵", "钱"]] },
    { q: "钱花掉以后会怎样？", a: 0, opts: [["📉", "变少"], ["📈", "变多"], ["♾️", "不变"]] },
    { q: "存钱可以放在哪里？", a: 1, opts: [["🗑️", "垃圾桶"], ["🐷", "存钱罐"], ["❄️", "冰箱"]] },
  ];

  var STAGE_NAMES = [
    ["📖", "故事"], ["🔭", "探索"], ["🎮", "游戏"], ["🌍", "生活"], ["🚀", "任务"], ["❓", "测验"],
  ];

  var OUTCOMES = {
    ice: {
      emoji: "🍦", title: "Leo 买了冰淇淋！",
      lines: [
        { text: "🍦 冰淇淋到手，真好吃！", tone: "good" },
        { text: "📖 漫画……没买到", tone: "bad" },
        { text: "🐷 存钱失败，钱包空空", tone: "bad" },
      ],
    },
    comic: {
      emoji: "📖", title: "Leo 买了漫画！",
      lines: [
        { text: "📖 漫画到手，看得停不下来！", tone: "good" },
        { text: "🍦 冰淇淋……没吃到", tone: "bad" },
        { text: "🐷 存钱失败，钱包空空", tone: "bad" },
      ],
    },
    save: {
      emoji: "🐷", title: "Leo 把钱存起来了！",
      lines: [
        { text: "🐷 20 元安全存进小猪罐！", tone: "good" },
        { text: "🍦 冰淇淋忍住了", tone: "neutral" },
        { text: "📖 漫画下次再买 —— 存下的钱还在变多哦", tone: "neutral" },
      ],
    },
  };

  var EXPLORE_CARDS = [
    { key: "buy", emoji: "💰", en: "Money helps us buy things.", zh: "钱帮我们买到东西", border: "#ffd766" },
    { key: "limited", emoji: "📉", en: "Money is limited.", zh: "钱是有限的", border: "#6ee0c8" },
    { key: "consequence", emoji: "🤔", en: "Every choice has a consequence.", zh: "每个选择都有结果", border: "#b79aff" },
  ];

  var RL_ANSWERS = {
    spent: ["🛍️", "花掉也没关系！下次可以想一想：这是我需要的，还是我想要的？"],
    saved: ["🐷", "太棒了！存起来的钱，会帮你完成更大的愿望。"],
    unknown: ["🔍", "没关系！从今天开始，试着记住你的钱去了哪里。"],
  };

  var MISSION_OPTIONS = [
    ["🪙", "1 元以内"],
    ["💵", "1 到 10 元"],
    ["💰", "10 元以上"],
    ["🤷", "爸妈也不记得了"],
  ];

  var state = {
    stage: 0, maxStage: 0,
    choice: null,
    exploreOpen: null, exploreSeen: {},
    limitedValue: 20,
    gamePhase: "ready", gameScore: 0, gameTime: 30,
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

  var rafId = null;
  var gameItems = [];
  var pigX = 0.5;
  var lastT = 0;
  var spawnAcc = 0;
  var gameEndAt = 0;
  var limitedTimer = null;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

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
    window.cancelAnimationFrame(rafId);
    state.stage = n;
    state.maxStage = Math.max(state.maxStage, n);
    if (n === 2) state.gamePhase = "ready";
    saveProgress();
    render();
  }

  function renderSteps() {
    stepsEl.innerHTML = STAGE_NAMES.map(function (pair, i) {
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

  // ---------- Stage 1: Story ----------
  function renderStory() {
    var html = '<div class="il-card"><div class="il-card-head">' +
      '<span class="il-avatar">👦</span>' +
      '<div><div class="il-card-title">Leo 的 20 元</div><div class="il-card-sub">Story · 点一点，做选择</div></div>' +
      '<span class="il-money-pill">💰 20 元</span>' +
      "</div>";

    if (!state.choice) {
      html += '<p class="il-copy">Leo 今天拿到了 <b>20 元</b>零花钱。可是 20 元不够全部买…… <b>Leo 该怎么办？你来帮他选！</b></p>' +
        '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn il-border-coral" data-choice="ice"><span class="il-choice-emoji">🍦</span><span class="il-choice-label" style="color:#a14a1c;">买冰淇淋</span></button>' +
        '<button type="button" class="il-choice-btn il-border-blue" data-choice="comic"><span class="il-choice-emoji">📖</span><span class="il-choice-label" style="color:#1c5aa1;">买一本漫画</span></button>' +
        '<button type="button" class="il-choice-btn il-border-pink" data-choice="save"><span class="il-choice-emoji">🐷</span><span class="il-choice-label" style="color:#a11c5c;">存起来</span></button>' +
        "</div>";
    } else {
      var oc = OUTCOMES[state.choice];
      html += '<div class="il-outcome"><div class="il-outcome-emoji">' + oc.emoji + '</div><div class="il-outcome-title">' + oc.title + "</div></div>" +
        '<div class="il-outcome-lines">' +
        oc.lines.map(function (line) {
          return '<div class="il-outcome-line il-line-' + line.tone + '">' + line.text + "</div>";
        }).join("") +
        "</div>" +
        '<div class="il-tip">💡 原来：每一次选择，都会放弃别的东西。</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost" id="il-reset-choice">↩️ 再选一次</button>' +
        '<button type="button" class="il-btn-primary" id="il-to-explore">继续 →</button>' +
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
      document.getElementById("il-to-explore").addEventListener("click", function () {
        goStage(1);
      });
    }
  }

  // ---------- Stage 2: Explore ----------
  function openExplore(key) {
    if (limitedTimer) window.clearInterval(limitedTimer);
    state.exploreOpen = key;
    state.exploreSeen[key] = true;
    state.limitedValue = 20;
    renderExplore();
    if (key === "limited") {
      var seq = [20, 15, 10, 5, 0];
      var i = 0;
      limitedTimer = window.setInterval(function () {
        i += 1;
        if (i >= seq.length) {
          window.clearInterval(limitedTimer);
          return;
        }
        state.limitedValue = seq[i];
        renderExplore();
      }, 700);
    }
  }

  function renderExplore() {
    var seenCount = Object.keys(state.exploreSeen).length;
    var html = '<div class="il-explore-head"><div class="il-h2">🔭 今天我们发现了什么？</div><div class="il-sub">点开每张卡片看看</div></div>';
    html += '<div class="il-explore-grid">';
    EXPLORE_CARDS.forEach(function (c) {
      var open = state.exploreOpen === c.key;
      var seen = !!state.exploreSeen[c.key];
      html += '<button type="button" class="il-explore-card' + (open ? " is-open" : "") + '" data-open="' + c.key + '" style="border-color:' + c.border + "; box-shadow:0 " + (open ? "2px" : "6px") + "px 0 " + c.border + ';">' +
        '<span class="il-explore-emoji">' + c.emoji + "</span>" +
        '<span class="il-explore-en">' + c.en + "</span>" +
        '<span class="il-explore-zh">' + c.zh + "</span>" +
        '<span class="il-explore-check">' + (seen ? "✅ 看过了" : "👆 点我") + "</span>" +
        "</button>";
    });
    html += "</div>";

    if (state.exploreOpen === "buy") {
      html += '<div class="il-card il-reveal"><div class="il-reveal-row">' +
        '<span class="il-reveal-emoji">💵</span><span class="il-reveal-arrow">→</span>' +
        '<span class="il-reveal-emoji">🍞</span><span class="il-reveal-emoji">🥛</span><span class="il-reveal-emoji">✏️</span>' +
        '</div><div class="il-reveal-text">钱可以换来我们需要的东西。</div></div>';
    } else if (state.exploreOpen === "limited") {
      var coinsHtml = [0, 1, 2, 3].map(function (i) {
        var lit = state.limitedValue > i * 5;
        return '<span class="il-limited-coin" style="opacity:' + (lit ? 1 : 0.15) + "; filter:" + (lit ? "none" : "grayscale(1)") + ';">🪙</span>';
      }).join("");
      html += '<div class="il-card il-reveal"><div class="il-limited-value">' + state.limitedValue + ' 元</div>' +
        '<div class="il-limited-coins">' + coinsHtml + '</div>' +
        '<div class="il-reveal-text">钱花一点，就少一点 —— 它是有限的。</div></div>';
    } else if (state.exploreOpen === "consequence") {
      html += '<div class="il-card il-reveal"><div class="il-reveal-row">' +
        '<span class="il-reveal-text-inline">选 🍦</span><span class="il-reveal-arrow">→</span>' +
        '<span class="il-reveal-text-inline il-faded">失去 📖</span>' +
        '</div><div class="il-reveal-text">每个选择，都有一个结果。</div></div>';
    }

    if (seenCount >= 3) {
      html += '<div class="il-actions il-center"><button type="button" class="il-btn-primary" id="il-to-game">继续 →</button></div>';
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

  // ---------- Stage 3: Game (Coin Catch) ----------
  function renderGame() {
    var html = '<div class="il-explore-head"><div class="il-h2">🎮 Coin Catch 接金币</div><div class="il-sub">左右拖动小猪存钱罐，接住 🪙，躲开 🪨 和 🗑️</div></div>';
    html += '<div class="il-game-box" id="il-game-box">' +
      '<div class="il-game-hud il-hud-left" id="il-game-score">🪙 0</div>' +
      '<div class="il-game-hud il-hud-right" id="il-game-time">⏱ 30s</div>' +
      '<div class="il-game-items" id="il-game-items"></div>' +
      '<div class="il-game-pig" id="il-game-pig" style="display:none;">🐷</div>';

    if (state.gamePhase === "ready") {
      html += '<div class="il-game-overlay">' +
        '<div class="il-game-pig-big">🐷</div>' +
        '<button type="button" class="il-start-btn" id="il-start-game">开始游戏 ▶</button>' +
        "</div>";
    } else if (state.gamePhase === "done") {
      html += '<div class="il-game-overlay il-game-done">' +
        '<div class="il-done-emoji">🎉</div>' +
        '<div class="il-done-title">Great!</div>' +
        '<div class="il-done-sub">Coins can be saved.</div>' +
        '<div class="il-done-score">你帮小猪存到了 <b>' + state.gameScore + '</b> 枚金币！</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost" id="il-replay-game">🔁 再玩一次</button>' +
        '<button type="button" class="il-btn-primary" id="il-to-reallife">继续 →</button>' +
        "</div></div>";
    }
    html += "</div>";
    stageEl.innerHTML = html;

    var box = document.getElementById("il-game-box");
    box.addEventListener("pointermove", onGameMove);
    box.addEventListener("pointerdown", onGameMove);

    var startBtn = document.getElementById("il-start-game");
    if (startBtn) startBtn.addEventListener("click", startGame);
    var replayBtn = document.getElementById("il-replay-game");
    if (replayBtn) replayBtn.addEventListener("click", startGame);
    var toRL = document.getElementById("il-to-reallife");
    if (toRL) toRL.addEventListener("click", function () { goStage(3); });
  }

  function onGameMove(event) {
    if (state.gamePhase !== "playing") return;
    var rect = event.currentTarget.getBoundingClientRect();
    pigX = Math.min(0.96, Math.max(0.04, (event.clientX - rect.left) / rect.width));
  }

  function startGame() {
    gameItems = [];
    pigX = 0.5;
    spawnAcc = 0;
    lastT = performance.now();
    gameEndAt = lastT + 30000;
    state.gamePhase = "playing";
    state.gameScore = 0;
    state.gameTime = 30;
    renderGame();

    var pigEl = document.getElementById("il-game-pig");
    var itemsEl = document.getElementById("il-game-items");
    var scoreEl = document.getElementById("il-game-score");
    var timeEl = document.getElementById("il-game-time");
    pigEl.style.display = "block";

    var emojiFor = { coin: "🪙", rock: "🪨", trash: "🗑️" };

    function loop(t) {
      var dt = Math.min(0.05, (t - lastT) / 1000);
      lastT = t;
      var H = 420;
      spawnAcc += dt;
      if (spawnAcc > 0.65) {
        spawnAcc = 0;
        var r = Math.random();
        var type = r < 0.55 ? "coin" : r < 0.8 ? "rock" : "trash";
        gameItems.push({ id: Math.random(), type: type, x: 0.06 + Math.random() * 0.88, y: -40, v: 150 + Math.random() * 110, el: null });
      }

      var score = state.gameScore;
      var keep = [];
      for (var i = 0; i < gameItems.length; i++) {
        var it = gameItems[i];
        it.y += it.v * dt;
        var caught = it.y > H - 105 && it.y < H - 30 && Math.abs(it.x - pigX) < 0.085;
        if (caught) {
          if (it.type === "coin") score += 1;
          else score = Math.max(0, score - 1);
          if (it.el) it.el.remove();
          continue;
        }
        if (it.y < H + 40) {
          keep.push(it);
        } else if (it.el) {
          it.el.remove();
        }
      }
      gameItems = keep;

      for (var j = 0; j < gameItems.length; j++) {
        var g = gameItems[j];
        if (!g.el) {
          g.el = document.createElement("div");
          g.el.className = "il-game-item";
          g.el.textContent = emojiFor[g.type];
          itemsEl.appendChild(g.el);
        }
        g.el.style.left = "calc(" + (g.x * 100).toFixed(2) + "% - 18px)";
        g.el.style.top = g.y.toFixed(1) + "px";
      }

      pigEl.style.left = "calc(" + (pigX * 100).toFixed(2) + "% - 34px)";

      var remain = Math.max(0, Math.ceil((gameEndAt - t) / 1000));
      scoreEl.textContent = "🪙 " + score;
      timeEl.textContent = "⏱ " + remain + "s";
      state.gameScore = score;
      state.gameTime = remain;

      if (t >= gameEndAt) {
        itemsEl.innerHTML = "";
        gameItems = [];
        state.gamePhase = "done";
        renderGame();
        return;
      }
      rafId = window.requestAnimationFrame(loop);
    }
    window.cancelAnimationFrame(rafId);
    rafId = window.requestAnimationFrame(loop);
  }

  // ---------- Stage 4: Real Life ----------
  function renderRealLife() {
    var html = '<div class="il-explore-head"><div class="il-h2">🌍 In Real Life 现实连接</div><div class="il-sub">不是考试，而是生活</div></div>';
    html += '<div class="il-card">';

    if (state.rlStep === 0) {
      html += '<div class="il-rl-center"><div class="il-rl-emoji">🧧</div>' +
        '<div class="il-rl-question">你有没有收到过<br>压岁钱、零花钱或红包？</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-rl-btn il-rl-yes" data-rl="go">有！✋</button>' +
        '<button type="button" class="il-rl-btn il-rl-no" data-rl="go">还没有</button>' +
        "</div></div>";
    } else if (state.rlStep === 1) {
      html += '<div class="il-rl-center"><div class="il-rl-emoji">🤔</div>' +
        '<div class="il-rl-question">这些钱后来去哪了？</div>' +
        '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn il-border-coral" data-rl-answer="spent"><span class="il-choice-emoji">🛍️</span><span class="il-choice-label" style="color:#a14a1c;">花掉了</span></button>' +
        '<button type="button" class="il-choice-btn il-border-teal" data-rl-answer="saved"><span class="il-choice-emoji">🐷</span><span class="il-choice-label" style="color:#0d6b54;">存起来了</span></button>' +
        '<button type="button" class="il-choice-btn il-border-blue2" data-rl-answer="unknown"><span class="il-choice-emoji">🤷</span><span class="il-choice-label" style="color:#5a44c9;">不知道</span></button>' +
        "</div></div>";
    } else {
      var a = RL_ANSWERS[state.rlAnswer];
      html += '<div class="il-rl-center"><div class="il-rl-emoji">' + a[0] + "</div>" +
        '<div class="il-rl-answer">' + a[1] + "</div>" +
        '<div class="il-rl-note">这不是考试，只是想一想自己的钱去了哪里。</div>' +
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
    var html = '<div class="il-explore-head"><div class="il-h2">🚀 Money Mission 财商任务</div><div class="il-sub">这个任务要离开电脑才能完成哦</div></div>';
    html += '<div class="il-mission-box"><div class="il-mission-row"><span class="il-mission-emoji">🏠</span>' +
      '<div class="il-mission-text">今天回家，问爸爸妈妈：<br><span class="il-mission-quote">「你小时候的第一笔零花钱是多少？」</span><br>回来以后，点一个答案。</div></div>';

    if (!state.missionSubmitted) {
      html += '<div class="il-mission-grid">' +
        MISSION_OPTIONS.map(function (opt, i) {
          return '<button type="button" class="il-mission-option" data-mission="' + i + '">' +
            '<span class="il-mission-option-emoji">' + opt[0] + '</span><span class="il-mission-option-label">' + opt[1] + "</span></button>";
        }).join("") +
        "</div>";
    } else {
      html += '<div class="il-mission-done">✅ 爸爸妈妈的第一笔零花钱：' + escapeHtml(state.missionText) + "</div>" +
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
    var html = '<div class="il-explore-head"><div class="il-h2">❓ Mini Quiz 小测验</div><div class="il-sub">' +
      (state.quizFinished ? "全部完成！" : "第 " + (state.quizIndex + 1) + " / 5 题 · 点图片作答") + "</div></div>";

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
      html += '<div class="il-quiz-complete"><div class="il-badge-orb">🪙</div>' +
        '<div class="il-badge-title">硬币观察员徽章 GET！</div>' +
        '<div class="il-badge-score">答对 ' + state.quizScore + ' / 5 题 · 全部课程完成 🎉</div>' +
        '<div class="il-badge-note">今天你学会了：钱能交换、钱是有限的、每个选择都有结果。</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost" id="il-restart-all">🔁 从头再玩一次</button>' +
        '<button type="button" class="il-btn-gold" id="il-next-level">下一关 →</button>' +
        "</div>";
      if (state.nextTeaser) {
        html += '<div class="il-next-teaser">🏙️ 下一关：预算城 Budget City · 即将开放，敬请期待！</div>';
      }
      html += "</div>";
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
      var nextBtn = document.getElementById("il-next-level");
      if (nextBtn) {
        nextBtn.addEventListener("click", function () {
          state.nextTeaser = true;
          renderQuiz();
        });
      }
    }
  }

  function restartAll() {
    gameItems = [];
    state = {
      stage: 0, maxStage: 5, choice: null, exploreOpen: null, exploreSeen: {},
      gamePhase: "ready", gameScore: 0, gameTime: 30, rlStep: 0, rlAnswer: null,
      missionText: "", missionSubmitted: false, quizIndex: 0, quizScore: 0,
      quizFeedback: null, quizFinished: false, nextTeaser: false,
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
