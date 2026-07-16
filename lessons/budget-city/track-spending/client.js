export const clientScript = `
(function () {
  var STORAGE_KEY = "mp_interactive_lesson_track_spending";
  var DONE_KEY = "mp_lesson_done_lesson-track-spending";

  var GAME_CARDS = [
    { id: "candy", emoji: "🍭", name: "买糖果", cat: "spent", coins: 3, reasons: ["用星星币付了钱", "一下买了三根"] },
    { id: "book", emoji: "📖", name: "图书馆借书", cat: "free", coins: 0, reasons: ["借的不用买", "一枚都没花"] },
    { id: "claw", emoji: "🎮", name: "抓娃娃机", cat: "spent", coins: 2, reasons: ["投币才能玩", "花掉了两枚"] },
    { id: "water", emoji: "🚰", name: "喝家里的水", cat: "free", coins: 0, reasons: ["家里的水免费", "一枚都没花"] },
  ];

  var EXPLORE_CARDS = [
    { key: "time", emoji: "🕐", label: "时间", title: "第一行：什么时候", text: "写下大概的时间，比如“放学后”“周末”——帮你想起当时的情况。" },
    { key: "thing", emoji: "🛒", label: "事情", title: "第二行：做了什么", text: "写下花了钱或没花钱做的事，越具体越好，比如“买了棒棒糖”。" },
    { key: "feel", emoji: "💭", label: "感受", title: "第三行：什么感受", text: "写下当时开心、后悔还是无聊——这是找到小习惯的关键线索！" },
  ];

  var STORY_OUTCOMES = {
    record: { good: true, emoji: "📓", title: "写下来查一查！",
      lines: ["✨ 记录本先生说得对——写下来，答案就会出现。", "🔍 现在跟着记录本先生学三行记录法吧！"] },
    guess: { good: false, emoji: "🤔", title: "凭记忆猜一猜……",
      lines: ["🌑 记忆常常会漏掉小事，猜的答案不一定对。", "😊 试试：写下来会更准。"] },
    ignore: { good: false, emoji: "🙈", title: "不管它，随它去……",
      lines: ["🌑 下星期星星币可能又不知去了哪里。", "😊 试试：写下来才能看见问题。"] },
  };

  var RL_ANSWERS = {
    memory: ["🧠", "凭记忆很容易漏掉——就像米米一样！试试写下来吧。"],
    write: ["✍️", "太棒了！写下来，星星币就无处可逃啦。"],
    ignore: ["🤷", "不记录的话，下次可能还是想不起钱去了哪里哦。"],
  };

  var MISSION_OPTIONS = [
    ["📆", "每天都记"],
    ["🔁", "先记两天"],
    ["🌱", "从明天开始"],
    ["🤔", "还没想好"],
  ];

  var QUIZ = [
    { q: "记录花费有什么用？", a: 0, opts: [["🔦", "像手电筒，照见习惯"], ["😠", "责备自己"], ["📢", "给别人检查"]] },
    { q: "忘记记录一次怎么办？", a: 1, opts: [["🙅", "干脆放弃"], ["✍️", "想起来就补上，继续记"], ["🙈", "假装没花过"]] },
    { q: "三行记录法要写什么？", a: 2, opts: [["🔢", "只写数字"], ["🏆", "别人花了多少"], ["🕐🛒💭", "时间、事情、感受"]] },
  ];

  var state = {
    stage: 0, maxStage: 0,
    storyChoice: null,
    exploreOpen: null, exploreSeen: {},
    gameIndex: 0, gamePlacement: null, gameCorrect: false, gameReasonIdx: null, gameScore: 0, spentPile: [], freePile: [], spentCoins: 0,
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
    var stageNames = [["📖", "故事"], ["🔍", "记录法"], ["🕵️", "游戏"], ["🌍", "生活"], ["🚀", "任务"], ["❓", "测验"]];
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

  // ---------- Stage 1: Story ----------
  function renderStory() {
    var html = '<div class="il-card"><div class="il-card-head">' +
      '<span class="il-avatar">👧</span>' +
      '<div><div class="il-card-title">米米的星星币不见了</div><div class="il-card-sub">Story · 帮米米想一想</div></div>' +
      "</div>";

    html += '<p class="il-copy">周一米米有 <b style="color:#2a5fb0;">10 枚</b>星星币，周五一摸口袋——只剩 <b style="color:#d9611c;">2 枚</b>了！“一定是有小偷！”米米慌张地喊。<b>你觉得米米该怎么办？</b></p>';

    if (!state.storyChoice) {
      html += '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn" data-choice="record"><span class="il-choice-emoji">📓</span><span class="il-choice-label">写下来查一查</span></button>' +
        '<button type="button" class="il-choice-btn" data-choice="guess"><span class="il-choice-emoji">🤔</span><span class="il-choice-label">凭记忆猜一猜</span></button>' +
        '<button type="button" class="il-choice-btn" data-choice="ignore"><span class="il-choice-emoji">🙈</span><span class="il-choice-label">不管它，随它去</span></button>' +
        "</div>";
    } else {
      var oc = STORY_OUTCOMES[state.storyChoice];
      html += '<div class="il-outcome"><div class="il-outcome-emoji">' + oc.emoji + '</div><div class="il-outcome-title" style="color:#2a5fb0;">' + oc.title + "</div></div>" +
        '<div class="il-outcome-lines">' +
        oc.lines.map(function (text) {
          return '<div class="il-outcome-line il-line-' + (oc.good ? "good-budget" : "bad-budget") + '">' + text + "</div>";
        }).join("") +
        "</div>" +
        '<div class="il-tip il-tip-budget">💡 记录不是为了责备自己，而是像手电筒一样，照见自己的习惯。</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost il-btn-ghost-budget" id="il-reset-choice">↩️ 再选一次</button>' +
        (oc.good ? '<button type="button" class="il-btn-primary il-btn-primary-budget" id="il-to-explore">继续 →</button>' : "") +
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

  // ---------- Stage 2: Explore (三行记录法) ----------
  function openExplore(key) {
    state.exploreOpen = key;
    state.exploreSeen[key] = true;
    renderExplore();
  }

  function renderExplore() {
    var seenCount = Object.keys(state.exploreSeen).length;
    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-budget">🔍 三行记录法</div><div class="il-sub">点开每张卡片，学会记录本先生的秘诀</div></div>';
    html += '<div class="il-explore-grid">';
    EXPLORE_CARDS.forEach(function (c) {
      var open = state.exploreOpen === c.key;
      var seen = !!state.exploreSeen[c.key];
      html += '<button type="button" class="il-explore-card il-explore-card-budget' + (open ? " is-open" : "") + '" data-open="' + c.key + '" style="border-color:#8fc0ff; box-shadow:0 ' + (open ? "2px" : "6px") + 'px 0 #8fc0ff;">' +
        '<span class="il-explore-emoji">' + c.emoji + "</span>" +
        '<span class="il-explore-zh-bold">' + c.label + "</span>" +
        '<span class="il-explore-check">' + (seen ? "✅ 看过了" : "👆 点我") + "</span>" +
        "</button>";
    });
    html += "</div>";

    if (state.exploreOpen) {
      var info = EXPLORE_CARDS.filter(function (c) { return c.key === state.exploreOpen; })[0];
      html += '<div class="il-card il-reveal il-reveal-budget"><div style="font-size:38px;">' + info.emoji + "</div>" +
        '<div class="il-outcome-title" style="color:#2a5fb0;margin:6px 0;">' + info.title + "</div>" +
        '<div class="il-reveal-text">' + info.text + "</div></div>";
    }

    if (seenCount >= 3) {
      html += '<div class="il-actions il-center"><button type="button" class="il-btn-primary il-btn-primary-budget" id="il-to-game">开始侦探游戏 →</button></div>';
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

  // ---------- Stage 3: Game (sorting cards) ----------
  function cur() {
    return GAME_CARDS[state.gameIndex];
  }

  function catLabel(c) {
    return c === "spent" ? "花掉了" : "没花钱";
  }

  function place(basket) {
    if (state.gamePlacement) return;
    var card = cur();
    var correct = card.cat === basket;
    state.gamePlacement = basket;
    state.gameCorrect = correct;
    if (correct) state.gameScore += 1;
    if (card.cat === "spent") {
      state.spentPile.push(card.emoji);
      state.spentCoins += card.coins;
    } else {
      state.freePile.push(card.emoji);
    }
    renderGame();
  }

  function pickReason(i) {
    if (state.gameReasonIdx === null) {
      state.gameReasonIdx = i;
      renderGame();
    }
  }

  function nextCard() {
    if (state.gameIndex >= GAME_CARDS.length - 1) {
      goStage(3);
    } else {
      state.gameIndex += 1;
      state.gamePlacement = null;
      state.gameCorrect = false;
      state.gameReasonIdx = null;
      renderGame();
    }
  }

  function renderGame() {
    var total = GAME_CARDS.length;
    var card = cur();
    var placed = !!state.gamePlacement;
    var progressPct = Math.round((state.gameIndex / total) * 100);

    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-budget">🕵️ 侦探游戏</div><div class="il-sub">当好记录侦探 —— 这件事花掉星星币了吗？</div></div>';

    html += '<div class="wd-progress-row">' +
      '<div class="wd-progress-track"><div class="wd-progress-fill" style="width:' + progressPct + '%;"></div></div>' +
      '<span class="wd-progress-label">第 ' + (state.gameIndex + 1) + " / " + total + ' 张</span>' +
      '<span class="wd-score-chip">⭐ ' + state.gameScore + "</span>" +
      "</div>";

    html += '<div class="wd-panel">';
    if (!placed) {
      html += '<div class="wd-panel-inner">' +
        '<div class="wd-card-emoji">' + card.emoji + "</div>" +
        '<div class="wd-card-name">' + card.name + "</div>" +
        '<div class="wd-card-hint">这件事花掉星星币了吗？点下面的篮子 👇</div>' +
        "</div>";
    } else {
      var desc = state.gameCorrect
        ? card.emoji + " " + card.name + "是「" + catLabel(card.cat) + "」的事" + (card.coins ? "，花掉了 " + card.coins + " 枚星星币。" : "，一枚星星币都没用。")
        : card.emoji + " " + card.name + "其实是「" + catLabel(card.cat) + "」哦" + (card.coins ? "，花了 " + card.coins + " 枚，已帮你放进对的篮子。" : "，没花钱，已帮你放进对的篮子。");
      html += '<div class="wd-panel-inner">' +
        '<div class="wd-feedback-emoji">' + (state.gameCorrect ? "🎉" : "💡") + "</div>" +
        '<div class="wd-feedback-title" style="color:' + (state.gameCorrect ? "#4fd6ab" : "#ffc94d") + ';">' + (state.gameCorrect ? "放对啦！" : "一起想一想～") + "</div>" +
        '<div class="wd-feedback-desc">' + desc + "</div>" +
        '<div class="wd-reason-label">说说你的理由 · 选一个 💬</div>' +
        '<div class="wd-reason-row">';
      card.reasons.forEach(function (text, i) {
        var chosen = state.gameReasonIdx === i;
        var dim = state.gameReasonIdx !== null && !chosen;
        var cls = "wd-reason-btn" + (chosen ? " is-chosen" : dim ? " is-dim" : "");
        html += '<button type="button" class="' + cls + '" data-reason="' + i + '">' + text + "</button>";
      });
      html += "</div>";
      var isLast = state.gameIndex >= total - 1;
      html += '<button type="button" class="wd-next-btn" id="wd-next">' + (isLast ? "看结果 →" : "下一张 →") + "</button>";
      html += "</div>";
    }
    html += "</div>";

    var spentPileHtml = state.spentPile.length
      ? state.spentPile.map(function (e) { return '<span class="wd-basket-pile-coin">' + e + "</span>"; }).join("")
      : '<span class="wd-basket-pile-empty">花钱的事</span>';
    var freePileHtml = state.freePile.length
      ? state.freePile.map(function (e) { return '<span class="wd-basket-pile-coin">' + e + "</span>"; }).join("")
      : '<span class="wd-basket-pile-empty">免费的事</span>';

    html += '<div class="wd-basket-grid">' +
      '<button type="button" class="wd-basket wd-basket-spent' + (placed ? " is-placed" : "") + '" id="wd-place-spent"' + (placed ? " disabled" : "") + ">" +
      '<div class="wd-basket-head"><span class="wd-basket-icon">💸</span><span class="wd-basket-title" style="color:#ff9d6b;">花掉了 <span class="wd-basket-title-sub" style="color:#c7a892;">Spent</span></span></div>' +
      '<div class="wd-basket-pile">' + spentPileHtml + "</div>" +
      "</button>" +
      '<button type="button" class="wd-basket wd-basket-free' + (placed ? " is-placed" : "") + '" id="wd-place-free"' + (placed ? " disabled" : "") + ">" +
      '<div class="wd-basket-head"><span class="wd-basket-icon">🆓</span><span class="wd-basket-title" style="color:#4fd6ab;">没花钱 <span class="wd-basket-title-sub" style="color:#8dc4b3;">Free</span></span></div>' +
      '<div class="wd-basket-pile">' + freePileHtml + "</div>" +
      "</button>" +
      "</div>";

    if (placed && state.gameIndex >= total - 1) {
      html += '<div style="text-align:center;margin-top:16px;">' +
        '<div style="font-size:15px;color:#8dc4b3;">🔦 这一周米米一共花掉了 <b style="color:#ff9d6b;font-size:18px;">' + state.spentCoins + "</b> 枚星星币！</div></div>";
    }

    stageEl.innerHTML = html;

    if (!placed) {
      document.getElementById("wd-place-spent").addEventListener("click", function () { place("spent"); });
      document.getElementById("wd-place-free").addEventListener("click", function () { place("free"); });
    } else {
      var reasonBtns = stageEl.querySelectorAll("[data-reason]");
      for (var i = 0; i < reasonBtns.length; i++) {
        reasonBtns[i].addEventListener("click", function (event) {
          pickReason(Number(event.currentTarget.getAttribute("data-reason")));
        });
      }
      document.getElementById("wd-next").addEventListener("click", nextCard);
    }
  }

  // ---------- Stage 4: Real Life ----------
  function renderRealLife() {
    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-budget">🌍 现实连接</div><div class="il-sub">不是考试，而是生活</div></div>';
    html += '<div class="il-card">';

    if (state.rlStep === 0) {
      html += '<div class="il-rl-center"><div class="il-rl-emoji">💭</div>' +
        '<div class="il-rl-question">你会不会常常忘记自己花了什么？</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-rl-btn il-rl-yes" data-rl="go">偶尔会忘 🙈</button>' +
        '<button type="button" class="il-rl-btn il-rl-no-budget" data-rl="go">记得很清楚 🧠</button>' +
        "</div></div>";
    } else if (state.rlStep === 1) {
      html += '<div class="il-rl-center"><div class="il-rl-emoji">🧧</div>' +
        '<div class="il-rl-question">这周你可能去糖果店、文具店或汽水机，<br>你会怎么记住花了多少？</div>' +
        '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn" data-rl-answer="memory"><span class="il-choice-emoji">🧠</span><span class="il-choice-label">凭记忆记</span></button>' +
        '<button type="button" class="il-choice-btn" data-rl-answer="write"><span class="il-choice-emoji">✍️</span><span class="il-choice-label">写下来记</span></button>' +
        '<button type="button" class="il-choice-btn" data-rl-answer="ignore"><span class="il-choice-emoji">🤷</span><span class="il-choice-label">不管它</span></button>' +
        "</div></div>";
    } else {
      var a = RL_ANSWERS[state.rlAnswer];
      html += '<div class="il-rl-center"><div class="il-rl-emoji">' + a[0] + "</div>" +
        '<div class="il-rl-answer">' + a[1] + "</div>" +
        '<div class="il-rl-note">没有标准答案 —— 发现自己容易忘记，就是学会记录的第一步。</div>' +
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
      '<div class="il-mission-text">连续<b style="color:#2a5fb0;">三天</b>做“星星币去向记录”：每天写三行——<b>时间、事情、感受</b>。最后圈出一个你发现的小习惯！</div></div>' +
      '<div class="il-mission-sub">你打算怎么开始？</div>';

    if (!state.missionSubmitted) {
      html += '<div class="il-mission-grid il-mission-grid-budget">' +
        MISSION_OPTIONS.map(function (opt, i) {
          return '<button type="button" class="il-mission-option il-mission-option-budget" data-mission="' + i + '">' +
            '<span class="il-mission-option-emoji">' + opt[0] + '</span><span class="il-mission-option-label">' + opt[1] + "</span></button>";
        }).join("") +
        "</div>";
    } else {
      html += '<div class="il-mission-done il-mission-done-budget">✅ 我的计划：' + state.missionText + "</div>" +
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
      html += '<div class="il-quiz-complete il-quiz-complete-budget"><div class="il-badge-orb il-badge-orb-budget">🔍</div>' +
        '<div class="il-badge-title" style="color:#eaf2ff;">记录侦探徽章 GET！</div>' +
        '<div class="il-badge-score" style="color:#d3e2ff;">答对 ' + state.quizScore + ' / ' + QUIZ.length + ' 题 · 完成 🎉</div>' +
        '<div class="il-badge-note" style="color:#bcd0f0;">今天你学会了：记录不是为了责备自己，而是像手电筒一样照见习惯；忘记一次没关系，继续记就好。</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost" id="il-restart-all">🔁 从头再玩一次</button>' +
        (state.nextTeaser
          ? ""
          : '<button type="button" class="il-btn-gold" id="il-reveal-next">下一关 →</button>') +
        "</div>" +
        (state.nextTeaser
          ? '<div class="il-next-teaser"><a href="/lesson/lesson-price-compare?level=explorer" style="color:#ffe9a8;">🕵️ 下一关：价格小侦探 Price Detective →</a></div>'
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
      gameIndex: 0, gamePlacement: null, gameCorrect: false, gameReasonIdx: null, gameScore: 0, spentPile: [], freePile: [], spentCoins: 0,
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
