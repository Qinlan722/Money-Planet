export const clientScript = `
(function () {
  var STORAGE_KEY = "mp_interactive_lesson_bargaining";
  var DONE_KEY = "mp_lesson_done_lesson-bargaining";

  var GAME_CARDS = [
    { id: "ask", emoji: "🙏", name: "\\u201c老板，这个可以便宜一点吗？谢谢！\\u201d", cat: "polite" },
    { id: "demand", emoji: "😠", name: "\\u201c便宜点！不然我不买了！\\u201d", cat: "impolite" },
    { id: "reason", emoji: "🙂", name: "\\u201c如果我买两个，可以优惠一点吗？\\u201d", cat: "polite" },
    { id: "accuse", emoji: "😤", name: "\\u201c你这个东西太贵了，骗人的吧！\\u201d", cat: "impolite" },
  ];

  var EXPLORE_CARDS = [
    { key: "polite", emoji: "🙏", label: "礼貌", border: "#ffb884", title: "诀窍一：微笑和礼貌用语", text: "用\\u201c请\\u201d\\u201c谢谢\\u201d这样的话，摊主更愿意给你更好的价格。" },
    { key: "reason", emoji: "💬", label: "理由", border: "#9fc6ff", title: "诀窍二：说明合理的理由", text: "比如\\u201c我多买一点\\u201d或\\u201c我是老顾客\\u201d，让还价听起来更合理。" },
    { key: "limit", emoji: "⚖️", label: "底线", border: "#b7a8f0", title: "诀窍三：尊重双方的底线", text: "摊主也要赚钱生活，一味压价可能不公平，找到双方都满意的价格才是好交易。" },
  ];

  var STORY_OUTCOMES = {
    polite: { good: true, emoji: "🙏", title: "礼貌地问一问！",
      lines: ["✨ 米米微笑着问摊主能不能便宜点，摊主也乐意商量。", "🔍 现在跟着一起认识还价的诀窍吧！"] },
    walk: { good: false, emoji: "🙅", title: "什么都不说，转身走开……",
      lines: ["🌑 不开口就永远不知道有没有商量的余地。", "😊 试试：礼貌地问一问吧。"] },
    demand: { good: false, emoji: "😠", title: "大声地要求便宜……",
      lines: ["🌑 强硬的态度可能让摊主不愿意商量，还伤了和气。", "😊 试试：微笑着礼貌沟通。"] },
  };

  var RL_ANSWERS = {
    accept: ["🙏", "很好！尊重摊主的话，也是一种礼貌，交易也能愉快结束。"],
    lower: ["💬", "不错！可以再礼貌地问一次，说明理由，摊主可能会考虑。"],
    leave: ["🚶", "也可以！如果实在谈不拢，礼貌地道谢离开也没关系。"],
  };

  var MISSION_OPTIONS = [
    ["🙏", "先说\\u201c可以便宜点吗\\u201d"],
    ["💬", "先说明我的理由"],
    ["👀", "先听听摊主怎么说"],
    ["🤔", "还没想好"],
  ];

  var QUIZ = [
    { q: "还价时应该怎么开口？", a: 0, opts: [["🙏", "礼貌地问一问"], ["😠", "大声地要求"], ["🙅", "不说话直接拿走"]] },
    { q: "摊主说\\u201c这已经是最低价\\u201d，你该怎么办？", a: 2, opts: [["😤", "继续大声争吵"], ["🙄", "生气地走开"], ["🙂", "尊重并考虑接受"]] },
    { q: "好的还价结果应该是？", a: 1, opts: [["😈", "只有自己占便宜"], ["🤝", "双方都觉得公平"], ["😴", "和摊主没关系"]] },
  ];

  var state = {
    stage: 0, maxStage: 0,
    storyChoice: null,
    exploreOpen: null, exploreSeen: {},
    gameIndex: 0, gamePlacement: null, gameCorrect: false, gameScore: 0,
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
    var stageNames = [["📖", "故事"], ["🔍", "概念"], ["🕵️", "试一试"], ["🌍", "生活"], ["🚀", "任务"], ["❓", "测验"]];
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

  // ---------- Stage 1: Story ----------
  function renderStory() {
    var html = '<div class="il-card"><div class="il-card-head">' +
      '<span class="il-avatar">🐱</span>' +
      '<div><div class="il-card-title">市场里的风筝摊</div><div class="il-card-sub">Story · 帮米米想一想</div></div>' +
      "</div>";

    html += '<p class="il-copy">米米看中一个手工风筝，摊主开价 <b style="color:#d9611c;">30 元</b>。米米只带了 <b style="color:#d9611c;">20 元</b>，她该怎么办？</p>';

    if (!state.storyChoice) {
      html += '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn il-border-peach" data-choice="polite"><span class="il-choice-emoji">🙏</span><span class="il-choice-label">礼貌地问一问</span></button>' +
        '<button type="button" class="il-choice-btn il-border-blue" data-choice="walk"><span class="il-choice-emoji">🙅</span><span class="il-choice-label">什么都不说走开</span></button>' +
        '<button type="button" class="il-choice-btn il-border-budget-purple" data-choice="demand"><span class="il-choice-emoji">😠</span><span class="il-choice-label">大声要求便宜</span></button>' +
        "</div>";
    } else {
      var oc = STORY_OUTCOMES[state.storyChoice];
      html += '<div class="il-outcome"><div class="il-outcome-emoji">' + oc.emoji + '</div><div class="il-outcome-title" style="color:#d9611c;">' + oc.title + "</div></div>" +
        '<div class="il-outcome-lines">' +
        oc.lines.map(function (text) {
          return '<div class="il-outcome-line il-line-' + (oc.good ? "good-market" : "bad-market") + '">' + text + "</div>";
        }).join("") +
        "</div>" +
        '<div class="il-tip il-tip-market">💡 讨价还价不是吵架，而是礼貌地寻找双方都满意的价格。</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost il-btn-ghost-market" id="il-reset-choice">↩️ 再选一次</button>' +
        (oc.good ? '<button type="button" class="il-btn-primary il-btn-primary-market" id="il-to-explore">继续 →</button>' : "") +
        "</div>";
    }
    html += "</div>";
    stageEl.innerHTML = html;

    if (!state.storyChoice) {
      var btns = stageEl.querySelectorAll("[data-choice]");
      for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function (event) {
          state.storyChoice = event.currentTarget.getAttribute("data-choice");
          renderStory();
        });
      }
    } else {
      document.getElementById("il-reset-choice").addEventListener("click", function () {
        state.storyChoice = null;
        renderStory();
      });
      var toExplore = document.getElementById("il-to-explore");
      if (toExplore) toExplore.addEventListener("click", function () { goStage(1); });
    }
  }

  // ---------- Stage 2: Explore (讨价还价的三个诀窍) ----------
  function openExplore(key) {
    state.exploreOpen = key;
    state.exploreSeen[key] = true;
    renderExplore();
  }

  function renderExplore() {
    var seenCount = Object.keys(state.exploreSeen).length;
    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-market">🔍 讨价还价的三个诀窍</div><div class="il-sub">点开每张卡片，学会好好还价的方法</div></div>';
    html += '<div class="il-explore-grid">';
    EXPLORE_CARDS.forEach(function (c) {
      var open = state.exploreOpen === c.key;
      var seen = !!state.exploreSeen[c.key];
      html += '<button type="button" class="il-explore-card il-explore-card-market' + (open ? " is-open" : "") + '" data-open="' + c.key + '" style="border-color:' + c.border + "; box-shadow:0 " + (open ? "2px" : "6px") + "px 0 " + c.border + ';">' +
        '<span class="il-explore-emoji">' + c.emoji + "</span>" +
        '<span class="il-explore-zh-bold">' + c.label + "</span>" +
        '<span class="il-explore-check">' + (seen ? "✅ 看过了" : "👆 点我") + "</span>" +
        "</button>";
    });
    html += "</div>";

    if (state.exploreOpen) {
      var info = EXPLORE_CARDS.filter(function (c) { return c.key === state.exploreOpen; })[0];
      html += '<div class="il-card il-reveal il-reveal-market"><div style="font-size:38px;">' + info.emoji + "</div>" +
        '<div class="il-outcome-title" style="color:#d9611c;margin:6px 0;">' + info.title + "</div>" +
        '<div class="il-reveal-text">' + info.text + "</div></div>";
    }

    if (seenCount >= 3) {
      html += '<div class="il-actions il-center"><button type="button" class="il-btn-primary il-btn-primary-market" id="il-to-game">试一试 →</button></div>';
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

  // ---------- Stage 3: Game (礼貌 vs 不礼貌) ----------
  function cur() {
    return GAME_CARDS[state.gameIndex];
  }

  function catLabel(c) {
    return c === "polite" ? "礼貌" : "不礼貌";
  }

  function place(basket) {
    if (state.gamePlacement) return;
    var card = cur();
    var correct = card.cat === basket;
    state.gamePlacement = basket;
    state.gameCorrect = correct;
    if (correct) state.gameScore += 1;
    renderGame();
  }

  function nextCard() {
    if (state.gameIndex >= GAME_CARDS.length - 1) {
      goStage(3);
    } else {
      state.gameIndex += 1;
      state.gamePlacement = null;
      state.gameCorrect = false;
      renderGame();
    }
  }

  function renderGame() {
    var total = GAME_CARDS.length;
    var card = cur();
    var placed = !!state.gamePlacement;
    var progressPct = Math.round((state.gameIndex / total) * 100);

    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-market">🕵️ 还价小侦探</div><div class="il-sub">这句话是礼貌还价，还是不礼貌？</div></div>';

    html += '<div class="wd-progress-row">' +
      '<div class="wd-progress-track"><div class="wd-progress-fill" style="width:' + progressPct + '%;"></div></div>' +
      '<span class="wd-progress-label">第 ' + (state.gameIndex + 1) + " / " + total + ' 句</span>' +
      '<span class="wd-score-chip">⭐ ' + state.gameScore + "</span>" +
      "</div>";

    html += '<div class="wd-panel">';
    if (!placed) {
      html += '<div class="wd-panel-inner">' +
        '<div class="wd-card-emoji">' + card.emoji + "</div>" +
        '<div class="wd-card-name">' + card.name + "</div>" +
        '<div class="wd-card-hint">点下面选一个 👇</div>' +
        "</div>";
    } else {
      var desc = state.gameCorrect
        ? card.emoji + " 这句是「" + catLabel(card.cat) + "」的说法。"
        : card.emoji + " 这句其实是「" + catLabel(card.cat) + "」的说法，已帮你放进对的篮子。";
      html += '<div class="wd-panel-inner">' +
        '<div class="wd-feedback-emoji">' + (state.gameCorrect ? "🎉" : "💡") + "</div>" +
        '<div class="wd-feedback-title" style="color:' + (state.gameCorrect ? "#4fd6ab" : "#ffc94d") + ';">' + (state.gameCorrect ? "答对啦！" : "一起想一想～") + "</div>" +
        '<div class="wd-feedback-desc">' + desc + "</div>";
      var isLast = state.gameIndex >= total - 1;
      html += '<button type="button" class="wd-next-btn" id="wd-next">' + (isLast ? "看结果 →" : "下一句 →") + "</button>";
      html += "</div>";
    }
    html += "</div>";

    html += '<div class="wd-basket-grid">' +
      '<button type="button" class="wd-basket wd-basket-free' + (placed ? " is-placed" : "") + '" id="wd-place-polite"' + (placed ? " disabled" : "") + ">" +
      '<div class="wd-basket-head"><span class="wd-basket-icon">🙏</span><span class="wd-basket-title" style="color:#4fd6ab;">礼貌 <span class="wd-basket-title-sub" style="color:#8dc4b3;">Polite</span></span></div>' +
      "</button>" +
      '<button type="button" class="wd-basket wd-basket-spent' + (placed ? " is-placed" : "") + '" id="wd-place-impolite"' + (placed ? " disabled" : "") + ">" +
      '<div class="wd-basket-head"><span class="wd-basket-icon">😠</span><span class="wd-basket-title" style="color:#ff9d6b;">不礼貌 <span class="wd-basket-title-sub" style="color:#c7a892;">Impolite</span></span></div>' +
      "</button>" +
      "</div>";

    stageEl.innerHTML = html;

    if (!placed) {
      document.getElementById("wd-place-polite").addEventListener("click", function () { place("polite"); });
      document.getElementById("wd-place-impolite").addEventListener("click", function () { place("impolite"); });
    } else {
      document.getElementById("wd-next").addEventListener("click", nextCard);
    }
  }

  // ---------- Stage 4: Real Life ----------
  function renderRealLife() {
    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-market">🌍 现实连接</div><div class="il-sub">不是考试，而是生活</div></div>';
    html += '<div class="il-card">';

    if (state.rlStep === 0) {
      html += '<div class="il-rl-center"><div class="il-rl-emoji">💭</div>' +
        '<div class="il-rl-question">摊主说\\u201c这已经是最低价了\\u201d，<br>你还会继续还价吗？</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-rl-btn il-rl-yes" data-rl="go">会尊重摊主的话 🙏</button>' +
        '<button type="button" class="il-rl-btn il-rl-no-market" data-rl="go">会再试着还价 🤔</button>' +
        "</div></div>";
    } else if (state.rlStep === 1) {
      html += '<div class="il-rl-center"><div class="il-rl-emoji">🛍️</div>' +
        '<div class="il-rl-question">如果摊主不肯再便宜，<br>你会怎么做？</div>' +
        '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn" data-rl-answer="accept"><span class="il-choice-emoji">🙏</span><span class="il-choice-label">接受这个价格</span></button>' +
        '<button type="button" class="il-choice-btn" data-rl-answer="lower"><span class="il-choice-emoji">💬</span><span class="il-choice-label">再礼貌问一次</span></button>' +
        '<button type="button" class="il-choice-btn" data-rl-answer="leave"><span class="il-choice-emoji">🚶</span><span class="il-choice-label">道谢后离开</span></button>' +
        "</div></div>";
    } else {
      var a = RL_ANSWERS[state.rlAnswer];
      html += '<div class="il-rl-center"><div class="il-rl-emoji">' + a[0] + "</div>" +
        '<div class="il-rl-answer">' + a[1] + "</div>" +
        '<div class="il-rl-note">没有标准答案——好的还价，是让双方都觉得公平。</div>' +
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
    html += '<div class="il-mission-box il-mission-box-market"><div class="il-mission-row"><span class="il-mission-emoji">🗣️</span>' +
      '<div class="il-mission-text">和家人一起去买东西时，<b style="color:#d9611c;">礼貌地试着还一次价</b>，记下摊主的反应。</div></div>' +
      '<div class="il-mission-sub">你打算怎么开口？</div>';

    if (!state.missionSubmitted) {
      html += '<div class="il-mission-grid il-mission-grid-market">' +
        MISSION_OPTIONS.map(function (opt, i) {
          return '<button type="button" class="il-mission-option il-mission-option-market" data-mission="' + i + '">' +
            '<span class="il-mission-option-emoji">' + opt[0] + '</span><span class="il-mission-option-label">' + opt[1] + "</span></button>";
        }).join("") +
        "</div>";
    } else {
      html += '<div class="il-mission-done il-mission-done-market">✅ 我的计划：' + state.missionText + "</div>" +
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
      html += '<div class="il-quiz-complete il-quiz-complete-market"><div class="il-badge-orb il-badge-orb-market">🤝</div>' +
        '<div class="il-badge-title" style="color:#fff2e6;">议价小达人徽章 GET！</div>' +
        '<div class="il-badge-score" style="color:#ffe0c4;">答对 ' + state.quizScore + ' / ' + QUIZ.length + ' 题 · 全部完成 🎉</div>' +
        '<div class="il-badge-note" style="color:#ffd3b0;">今天你学会了：礼貌地说明理由、留有余地，才能找到双方都满意的价格。</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost" id="il-restart-all">🔁 从头再玩一次</button>' +
        (state.nextTeaser
          ? ""
          : '<button type="button" class="il-btn-gold" id="il-reveal-next">下一关 →</button>') +
        "</div>" +
        (state.nextTeaser
          ? '<div class="il-next-teaser">🚀 下一关：创业海湾 Business Bay · 即将开放，敬请期待！</div>'
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
      stage: 0, maxStage: 5, storyChoice: null, exploreOpen: null, exploreSeen: {},
      gameIndex: 0, gamePlacement: null, gameCorrect: false, gameScore: 0,
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
