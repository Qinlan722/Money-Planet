export const clientScript = `
(function () {
  var STORAGE_KEY = "mp_interactive_lesson_ads_can_talk";
  var DONE_KEY = "mp_lesson_done_lesson-market-signs";

  var GAME_CARDS = [
    { id: "best", emoji: "🥤", name: "\\u201c全世界最好喝的汽水！\\u201d", cat: "attention" },
    { id: "size", emoji: "📦", name: "\\u201c这盒装有 20 片饼干。\\u201d", cat: "fact" },
    { id: "friends", emoji: "👟", name: "\\u201c同学都在穿这双鞋！\\u201d", cat: "attention" },
    { id: "price", emoji: "🏷️", name: "\\u201c这支笔售价 5 元。\\u201d", cat: "fact" },
  ];

  var EXPLORE_CARDS = [
    { key: "color", emoji: "🎨", label: "颜色", border: "#ffb884", title: "套路一：鲜艳的颜色", text: "广告常用鲜艳、明亮的颜色抓住你的眼睛，让你多看一眼。" },
    { key: "sound", emoji: "🎵", label: "声音", border: "#9fc6ff", title: "套路二：好听的音乐", text: "朗朗上口的广告歌会一直在你脑海里回响，让你记住它。" },
    { key: "words", emoji: "💬", label: "词语", border: "#b7a8f0", title: "套路三：夸张的词语", text: "\\u201c最棒\\u201d\\u201c限时\\u201d\\u201c大家都爱\\u201d这类词语会让东西听起来特别诱人。" },
  ];

  var STORY_OUTCOMES = {
    pause: { good: true, emoji: "🛑", title: "先停一下，想一想！",
      lines: ["✨ 米米学会了先观察，再决定——这就是聪明的消费者。", "🔍 现在跟着一起认识广告的套路吧！"] },
    believe: { good: false, emoji: "😳", title: "完全相信招牌……",
      lines: ["🌑 招牌说的话不一定都是事实，可能只是想吸引你。", "😊 试试：先停一下再决定。"] },
    ignore: { good: false, emoji: "🙈", title: "完全不理会……",
      lines: ["🌑 有些广告信息其实值得了解，一味忽略也不好。", "😊 试试：先观察，再判断。"] },
  };

  var RL_ANSWERS = {
    writedown: ["📝", "太棒了！先写下优点和顾虑，再决定要不要买。"],
    ask: ["🙋", "很好！先问问大人或朋友的看法，能帮你更冷静地判断。"],
    wait: ["⏳", "不错！等一等，心动的感觉常常会变淡，那时更容易理智判断。"],
  };

  var MISSION_OPTIONS = [
    ["🖊️", "先写优点清单"],
    ["🎨", "先画草图"],
    ["👀", "先看看别的广告"],
    ["🤔", "还没想好"],
  ];

  var QUIZ = [
    { q: "广告的目的是什么？", a: 1, opts: [["📏", "只说事实"], ["🎯", "吸引你购买"], ["📚", "教你知识"]] },
    { q: "看到\\u201c大家都在买\\u201d时可以问什么？", a: 2, opts: [["🙋", "我也要买"], ["🙅", "别人买就是对的"], ["🤔", "我真的需要吗？"]] },
    { q: "广告一定是坏的吗？", a: 0, opts: [["🙂", "不一定，先观察再决定"], ["😠", "一定是坏的"], ["😴", "和我没关系"]] },
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
      '<div><div class="il-card-title">市场小镇的招牌</div><div class="il-card-sub">Story · 帮米米想一想</div></div>' +
      "</div>";

    html += '<p class="il-copy">招牌上写着：\\u201c今天最棒！大家都喜欢！\\u201d米米学会先停一下，问问自己：<b style="color:#d9611c;">它在告诉我事实，还是在吸引我？</b> 你觉得米米该怎么办？</p>';

    if (!state.storyChoice) {
      html += '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn il-border-peach" data-choice="pause"><span class="il-choice-emoji">🛑</span><span class="il-choice-label">先停一下想一想</span></button>' +
        '<button type="button" class="il-choice-btn il-border-blue" data-choice="believe"><span class="il-choice-emoji">😳</span><span class="il-choice-label">完全相信招牌</span></button>' +
        '<button type="button" class="il-choice-btn il-border-budget-purple" data-choice="ignore"><span class="il-choice-emoji">🙈</span><span class="il-choice-label">完全不理会</span></button>' +
        "</div>";
    } else {
      var oc = STORY_OUTCOMES[state.storyChoice];
      html += '<div class="il-outcome"><div class="il-outcome-emoji">' + oc.emoji + '</div><div class="il-outcome-title" style="color:#d9611c;">' + oc.title + "</div></div>" +
        '<div class="il-outcome-lines">' +
        oc.lines.map(function (text) {
          return '<div class="il-outcome-line il-line-' + (oc.good ? "good-market" : "bad-market") + '">' + text + "</div>";
        }).join("") +
        "</div>" +
        '<div class="il-tip il-tip-market">💡 广告会用颜色、声音和词语吸引我们。聪明的消费者会先观察，再决定。</div>' +
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

  // ---------- Stage 2: Explore (广告的三个套路) ----------
  function openExplore(key) {
    state.exploreOpen = key;
    state.exploreSeen[key] = true;
    renderExplore();
  }

  function renderExplore() {
    var seenCount = Object.keys(state.exploreSeen).length;
    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-market">🔍 广告的三个套路</div><div class="il-sub">点开每张卡片，学会认出吸引你的方法</div></div>';
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

  // ---------- Stage 3: Game (广告侦探 —— 事实 or 吸引) ----------
  function cur() {
    return GAME_CARDS[state.gameIndex];
  }

  function catLabel(c) {
    return c === "fact" ? "事实" : "吸引";
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

    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-market">🕵️ 广告侦探</div><div class="il-sub">这句广告词在说事实，还是在吸引你？</div></div>';

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
        '<div class="wd-card-hint">点下面选一个 👇</div>' +
        "</div>";
    } else {
      var desc = state.gameCorrect
        ? card.emoji + " 这句是「" + catLabel(card.cat) + "」型的广告词。"
        : card.emoji + " 这句其实是「" + catLabel(card.cat) + "」型，已帮你放进对的篮子。";
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
      '<button type="button" class="wd-basket wd-basket-free' + (placed ? " is-placed" : "") + '" id="wd-place-fact"' + (placed ? " disabled" : "") + ">" +
      '<div class="wd-basket-head"><span class="wd-basket-icon">📏</span><span class="wd-basket-title" style="color:#4fd6ab;">事实 <span class="wd-basket-title-sub" style="color:#8dc4b3;">Fact</span></span></div>' +
      "</button>" +
      '<button type="button" class="wd-basket wd-basket-spent' + (placed ? " is-placed" : "") + '" id="wd-place-attention"' + (placed ? " disabled" : "") + ">" +
      '<div class="wd-basket-head"><span class="wd-basket-icon">✨</span><span class="wd-basket-title" style="color:#ff9d6b;">吸引 <span class="wd-basket-title-sub" style="color:#c7a892;">Attention</span></span></div>' +
      "</button>" +
      "</div>";

    stageEl.innerHTML = html;

    if (!placed) {
      document.getElementById("wd-place-fact").addEventListener("click", function () { place("fact"); });
      document.getElementById("wd-place-attention").addEventListener("click", function () { place("attention"); });
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
        '<div class="il-rl-question">\\u201c限时\\u201d\\u201c超酷\\u201d\\u201c同学都在用\\u201d——<br>这些词会让你心动吗？</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-rl-btn il-rl-yes" data-rl="go">会有点心动 😳</button>' +
        '<button type="button" class="il-rl-btn il-rl-no-market" data-rl="go">我会先想想 🧠</button>' +
        "</div></div>";
    } else if (state.rlStep === 1) {
      html += '<div class="il-rl-center"><div class="il-rl-emoji">🛍️</div>' +
        '<div class="il-rl-question">下次看到心动的广告，<br>你会先做什么？</div>' +
        '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn" data-rl-answer="writedown"><span class="il-choice-emoji">📝</span><span class="il-choice-label">写下优点顾虑</span></button>' +
        '<button type="button" class="il-choice-btn" data-rl-answer="ask"><span class="il-choice-emoji">🙋</span><span class="il-choice-label">问问大人朋友</span></button>' +
        '<button type="button" class="il-choice-btn" data-rl-answer="wait"><span class="il-choice-emoji">⏳</span><span class="il-choice-label">先等一等</span></button>' +
        "</div></div>";
    } else {
      var a = RL_ANSWERS[state.rlAnswer];
      html += '<div class="il-rl-center"><div class="il-rl-emoji">' + a[0] + "</div>" +
        '<div class="il-rl-answer">' + a[1] + "</div>" +
        '<div class="il-rl-note">没有标准答案——广告不一定是坏的，学会问\\u201c我真的需要吗\\u201d就是聪明的消费者。</div>' +
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
    html += '<div class="il-mission-box il-mission-box-market"><div class="il-mission-row"><span class="il-mission-emoji">🖍️</span>' +
      '<div class="il-mission-text">设计一张<b style="color:#d9611c;">诚实广告</b>：介绍一样物品的优点，也写一个需要注意的地方。</div></div>' +
      '<div class="il-mission-sub">你打算怎么开始？</div>';

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
      html += '<div class="il-quiz-complete il-quiz-complete-market"><div class="il-badge-orb il-badge-orb-market">📢</div>' +
        '<div class="il-badge-title" style="color:#fff2e6;">广告观察员徽章 GET！</div>' +
        '<div class="il-badge-score" style="color:#ffe0c4;">答对 ' + state.quizScore + ' / ' + QUIZ.length + ' 题 · 全部完成 🎉</div>' +
        '<div class="il-badge-note" style="color:#ffd3b0;">今天你学会了：广告会用颜色、声音和词语吸引我们；聪明的消费者会先观察，再决定。</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost" id="il-restart-all">🔁 从头再玩一次</button>' +
        (state.nextTeaser
          ? ""
          : '<button type="button" class="il-btn-gold" id="il-reveal-next">下一关 →</button>') +
        "</div>" +
        (state.nextTeaser
          ? '<div class="il-next-teaser"><a href="/lesson/lesson-bargaining?level=explorer" style="color:#ffe9a8;">🤝 下一关：讨价还价的学问 The Art of Bargaining →</a></div>'
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
