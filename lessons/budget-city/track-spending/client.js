export const clientScript = `
(function () {
  var STORAGE_KEY = "mp_interactive_lesson_track_spending";
  var DONE_KEY = "mp_lesson_done_lesson-track-spending";

  var CARDS = [
    { id: "candy", emoji: "🍭", name: "买糖果", en: "Bought Candy", cat: "spent", coins: 3, reasons: ["用星星币付了钱", "一下买了三根"] },
    { id: "bag", emoji: "🎒", name: "背旧书包", en: "Old Backpack", cat: "free", coins: 0, reasons: ["家里本来就有", "一枚都没花"] },
    { id: "claw", emoji: "🎮", name: "抓娃娃机", en: "Claw Machine", cat: "spent", coins: 2, reasons: ["投币才能玩", "花掉了两枚"] },
    { id: "book", emoji: "📖", name: "图书馆借书", en: "Library Book", cat: "free", coins: 0, reasons: ["借的不用买", "一枚都没花"] },
    { id: "soda", emoji: "🥤", name: "买汽水", en: "Bought Soda", cat: "spent", coins: 3, reasons: ["贩卖机要付钱", "买了两瓶"] },
    { id: "water", emoji: "🚰", name: "喝家里的水", en: "Water at Home", cat: "free", coins: 0, reasons: ["家里的水免费", "一枚都没花"] },
  ];

  var state = {
    phase: "intro",
    index: 0,
    placement: null,
    correct: false,
    reasonIdx: null,
    score: 0,
    spentPile: [],
    freePile: [],
    spentCoins: 0,
  };

  if (window.localStorage.getItem(DONE_KEY) === "1") {
    state.phase = "done";
    state.score = CARDS.length;
    state.spentCoins = CARDS.reduce(function (sum, c) { return sum + c.coins; }, 0);
  }

  var stageEl = document.getElementById("il-stage");

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
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

  function start() {
    state = { phase: "play", index: 0, placement: null, correct: false, reasonIdx: null, score: 0, spentPile: [], freePile: [], spentCoins: 0 };
    render();
  }

  function cur() {
    return CARDS[state.index];
  }

  function place(basket) {
    if (state.placement) return;
    var card = cur();
    var correct = card.cat === basket;
    state.placement = basket;
    state.correct = correct;
    if (correct) state.score += 1;
    if (card.cat === "spent") {
      state.spentPile.push(card.emoji);
      state.spentCoins += card.coins;
    } else {
      state.freePile.push(card.emoji);
    }
    render();
  }

  function pickReason(i) {
    if (state.reasonIdx === null) {
      state.reasonIdx = i;
      render();
    }
  }

  function next() {
    if (state.index >= CARDS.length - 1) {
      markLessonComplete();
      state.phase = "done";
    } else {
      state.index += 1;
      state.placement = null;
      state.correct = false;
      state.reasonIdx = null;
    }
    render();
  }

  function catLabel(c) {
    return c === "spent" ? "花掉了" : "没花钱";
  }

  function renderIntro() {
    var html = '<div class="wd-card">' +
      '<p class="wd-intro-text">米米周一有 <b style="color:#ffc94d;">10</b> 枚星星币，周五只剩 <b style="color:#ff9d6b;">2</b> 枚了！帮她把这一周做过的事分进两个篮子，找出星星币到底去了哪里。</p>' +
      '<p class="wd-intro-text">看一看每一张卡片，想一想米米这件事有没有花掉星星币。放进对的篮子，再说说你的理由。全部放好，就能算出星星币去了哪里！</p>' +
      '<div class="wd-cat-grid">' +
      '<div class="wd-cat-chip wd-cat-chip-spent"><div class="wd-cat-chip-icon">💸</div><div class="wd-cat-chip-title" style="color:#ff9d6b;">花掉了 Spent</div><div class="wd-cat-chip-sub" style="color:#c7a892;">用星星币付了钱</div></div>' +
      '<div class="wd-cat-chip wd-cat-chip-free"><div class="wd-cat-chip-icon">🆓</div><div class="wd-cat-chip-title" style="color:#4fd6ab;">没花钱 Free</div><div class="wd-cat-chip-sub" style="color:#8dc4b3;">一枚星星币都没用</div></div>' +
      "</div>" +
      '<div class="wd-start-row"><button type="button" class="wd-start-btn" id="wd-start">开始游戏 Start →</button><span class="wd-total-note">共 ' + CARDS.length + " 张卡片</span></div>" +
      "</div>";
    stageEl.innerHTML = html;
    document.getElementById("wd-start").addEventListener("click", start);
  }

  function renderPlay() {
    var total = CARDS.length;
    var card = cur();
    var placed = !!state.placement;
    var progressPct = Math.round((state.index / total) * 100);

    var html = '<div class="wd-progress-row">' +
      '<div class="wd-progress-track"><div class="wd-progress-fill" style="width:' + progressPct + '%;"></div></div>' +
      '<span class="wd-progress-label">第 ' + (state.index + 1) + " / " + total + ' 张</span>' +
      '<span class="wd-score-chip">⭐ ' + state.score + "</span>" +
      "</div>";

    html += '<div class="wd-panel">';
    if (!placed) {
      html += '<div class="wd-panel-inner">' +
        '<div class="wd-card-emoji">' + card.emoji + "</div>" +
        '<div class="wd-card-name">' + card.name + "</div>" +
        '<div class="wd-card-en">' + card.en + "</div>" +
        '<div class="wd-card-hint">这件事花掉星星币了吗？点下面的篮子 👇</div>' +
        "</div>";
    } else {
      var desc = state.correct
        ? card.emoji + " " + card.name + "是「" + catLabel(card.cat) + "」的事" + (card.coins ? "，花掉了 " + card.coins + " 枚星星币。" : "，一枚星星币都没用。")
        : card.emoji + " " + card.name + "其实是「" + catLabel(card.cat) + "」哦" + (card.coins ? "，花了 " + card.coins + " 枚，已帮你放进对的篮子。" : "，没花钱，已帮你放进对的篮子。");
      html += '<div class="wd-panel-inner">' +
        '<div class="wd-feedback-emoji">' + (state.correct ? "🎉" : "💡") + "</div>" +
        '<div class="wd-feedback-title" style="color:' + (state.correct ? "#4fd6ab" : "#ffc94d") + ';">' + (state.correct ? "放对啦！" : "一起想一想～") + "</div>" +
        '<div class="wd-feedback-desc">' + desc + "</div>" +
        '<div class="wd-reason-label">说说你的理由 · 选一个 💬</div>' +
        '<div class="wd-reason-row">';
      card.reasons.forEach(function (text, i) {
        var chosen = state.reasonIdx === i;
        var dim = state.reasonIdx !== null && !chosen;
        var cls = "wd-reason-btn" + (chosen ? " is-chosen" : dim ? " is-dim" : "");
        html += '<button type="button" class="' + cls + '" data-reason="' + i + '">' + text + "</button>";
      });
      html += "</div>";
      var isLast = state.index >= total - 1;
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
      document.getElementById("wd-next").addEventListener("click", next);
    }
  }

  function renderDone() {
    var total = CARDS.length;
    var doneTitle = state.score === total ? "全部破案，太棒了！🌟" : state.score >= total / 2 ? "侦探做得好！" : "再查一遍会更准！";

    var html = '<div class="wd-card" style="text-align:center;">' +
      '<div class="wd-done-emoji">🕵️</div>' +
      '<div class="wd-done-title">' + doneTitle + "</div>" +
      '<div class="wd-done-score">你答对了 <b style="color:#7fb0ff;">' + state.score + "</b> / " + total + " 张卡片</div>" +
      '<div class="wd-done-note">🔦 破案啦！这一周米米一共花掉了 <b style="color:#ff9d6b;font-size:22px;">' + state.spentCoins + "</b> 枚星星币。<br>原来没有小偷——<b>写下来，钱就藏不住了！</b></div>" +
      '<div class="wd-done-badge-row">' +
      '<div class="wd-done-badge-icon">🏅</div>' +
      '<div style="text-align:left;"><div class="wd-done-badge-name">记录侦探徽章</div><div class="wd-done-badge-unlocked">徽章已解锁 Badge unlocked ✓</div></div>' +
      "</div>" +
      '<div class="wd-done-actions">' +
      '<button type="button" class="wd-start-btn" id="wd-replay">再玩一次 ↺</button>' +
      '<a class="wd-done-ghost" href="/explore/budget-city?level=explorer">回到城市 →</a>' +
      "</div></div>";
    stageEl.innerHTML = html;
    document.getElementById("wd-replay").addEventListener("click", start);
  }

  function render() {
    if (state.phase === "intro") renderIntro();
    else if (state.phase === "play") renderPlay();
    else renderDone();
  }

  render();
})();
`;
