export const clientScript = `
(function () {
  var STORAGE_BADGE = "mp_badge_want_need_sort";

  var CARDS = [
    { id: "breakfast", emoji: "🥪", name: "早餐", en: "Breakfast", cat: "need", reasons: ["不吃会饿肚子", "每天都要吃"] },
    { id: "bus", emoji: "🚌", name: "校车", en: "School Bus", cat: "need", reasons: ["要准时到学校", "路上更安全"] },
    { id: "bag", emoji: "🎒", name: "书包", en: "Backpack", cat: "need", reasons: ["上学要装课本", "每天都要用"] },
    { id: "teddy", emoji: "🧸", name: "玩具熊", en: "Teddy Bear", cat: "want", reasons: ["抱着很开心", "但没有也可以"] },
    { id: "sticker", emoji: "✨", name: "贴纸", en: "Stickers", cat: "want", reasons: ["好看又好玩", "可有可无"] },
    { id: "candy", emoji: "🍭", name: "糖果", en: "Candy", cat: "want", reasons: ["甜甜的很开心", "吃多对牙齿不好"] },
  ];

  var state = {
    phase: "intro",
    order: [0, 1, 2, 3, 4, 5],
    index: 0,
    placement: null,
    correct: false,
    reasonIdx: null,
    score: 0,
    needPile: [],
    wantPile: [],
  };

  var stageEl = document.getElementById("wn-stage");

  function catLabel(cat) {
    return cat === "need" ? "需要" : "想要";
  }

  function start() {
    state = {
      phase: "play",
      order: [0, 1, 2, 3, 4, 5],
      index: 0,
      placement: null,
      correct: false,
      reasonIdx: null,
      score: 0,
      needPile: [],
      wantPile: [],
    };
    render();
  }

  function place(basket) {
    if (state.placement) return;
    var card = CARDS[state.order[state.index]];
    var correct = card.cat === basket;
    state.placement = basket;
    state.correct = correct;
    if (correct) state.score += 1;
    if (card.cat === "need") state.needPile.push(card.emoji);
    else state.wantPile.push(card.emoji);
    render();
  }

  function pickReason(i) {
    if (state.reasonIdx !== null) return;
    state.reasonIdx = i;
    render();
  }

  function next() {
    if (state.index >= CARDS.length - 1) {
      state.phase = "done";
      try {
        window.localStorage.setItem(STORAGE_BADGE, "1");
      } catch (e) {}
    } else {
      state.index += 1;
      state.placement = null;
      state.correct = false;
      state.reasonIdx = null;
    }
    render();
  }

  function renderIntro() {
    var html = '<div class="wn-intro-card">' +
      '<p class="wn-intro-text">看一看每一张卡片，把它放进对的篮子：<b class="wn-hl-need">需要</b> 是我们必须要有的东西，<b class="wn-hl-want">想要</b> 是有了会更开心、但没有也可以的东西。放好后，说一说你的理由！</p>' +
      '<div class="wn-info-row">' +
      '<div class="wn-info-chip wn-info-need"><div class="wn-info-icon">🧺</div><div class="wn-info-title">需要 Need</div><div class="wn-info-sub">必须要有，少了会有麻烦</div></div>' +
      '<div class="wn-info-chip wn-info-want"><div class="wn-info-icon">🧺</div><div class="wn-info-title">想要 Want</div><div class="wn-info-sub">有了更开心，没有也可以</div></div>' +
      "</div>" +
      '<div class="wn-start-row"><button type="button" class="wn-start-btn" id="wn-start">开始游戏 Start →</button><span class="wn-total-note">共 ' + CARDS.length + ' 张卡片</span></div>' +
      "</div>";
    stageEl.innerHTML = html;
    document.getElementById("wn-start").addEventListener("click", start);
  }

  function renderPlay() {
    var total = CARDS.length;
    var card = CARDS[state.order[state.index]];
    var placed = !!state.placement;
    var progressPct = Math.round((state.index / total) * 100);

    var html = '<div class="wn-progress-row">' +
      '<div class="wn-progress-track"><div class="wn-progress-fill" style="width:' + progressPct + '%;"></div></div>' +
      '<span class="wn-progress-label">第 ' + (state.index + 1) + " / " + total + ' 张</span>' +
      '<span class="wn-score-chip">⭐ ' + state.score + "</span>" +
      "</div>";

    html += '<div class="wn-card-box">';
    if (!placed) {
      html += '<div class="wn-card">' +
        '<div class="wn-card-face"><div class="wn-card-emoji">' + card.emoji + "</div></div>" +
        '<div class="wn-card-name">' + card.name + "</div>" +
        '<div class="wn-card-en">' + card.en + "</div>" +
        '<div class="wn-card-hint">它是「需要」还是「想要」？点下面的篮子 👇</div>' +
        "</div>";
    } else {
      var resultEmoji = state.correct ? "🎉" : "💡";
      var titleCls = state.correct ? "wn-feedback-title-good" : "wn-feedback-title-hint";
      var title = state.correct ? "放对啦！" : "一起想一想~";
      var desc = state.correct
        ? card.emoji + " " + card.name + "是我们的「" + catLabel(card.cat) + "」— 放进对的篮子了！"
        : card.emoji + " " + card.name + "其实是「" + catLabel(card.cat) + "」哦，已经帮你放进对的篮子啦。";
      var isLast = state.index >= total - 1;

      html += '<div class="wn-feedback">' +
        '<div class="wn-feedback-emoji">' + resultEmoji + "</div>" +
        '<div class="wn-feedback-title ' + titleCls + '">' + title + "</div>" +
        '<div class="wn-feedback-desc">' + desc + "</div>" +
        '<div class="wn-reasons"><div class="wn-reasons-label">说说你的理由 · 选一个 💬</div><div class="wn-reasons-row">' +
        card.reasons.map(function (text, i) {
          var chosen = state.reasonIdx === i;
          var dim = state.reasonIdx !== null && !chosen;
          var cls = "wn-reason-btn" + (chosen ? " is-chosen" : "") + (dim ? " is-dim" : "");
          return '<button type="button" class="' + cls + '" data-reason="' + i + '"' + (state.reasonIdx !== null ? " disabled" : "") + ">" + text + "</button>";
        }).join("") +
        "</div></div>" +
        '<button type="button" class="wn-next-btn" id="wn-next">' + (isLast ? "看结果 →" : "下一张 →") + "</button>" +
        "</div>";
    }
    html += "</div>";

    html += '<div class="wn-baskets">' +
      '<button type="button" class="wn-basket wn-basket-need" id="wn-basket-need"' + (placed ? " disabled" : "") + ">" +
      '<div class="wn-basket-head"><span class="wn-basket-icon">🧺</span><span class="wn-basket-title">需要 <span class="wn-basket-en">Need</span></span></div>' +
      '<div class="wn-basket-pile">' +
      state.needPile.map(function (e) { return '<span class="wn-chip">' + e + "</span>"; }).join("") +
      (state.needPile.length === 0 ? '<span class="wn-basket-empty">必须要有的东西</span>' : "") +
      "</div></button>" +
      '<button type="button" class="wn-basket wn-basket-want" id="wn-basket-want"' + (placed ? " disabled" : "") + ">" +
      '<div class="wn-basket-head"><span class="wn-basket-icon">🧺</span><span class="wn-basket-title">想要 <span class="wn-basket-en">Want</span></span></div>' +
      '<div class="wn-basket-pile">' +
      state.wantPile.map(function (e) { return '<span class="wn-chip">' + e + "</span>"; }).join("") +
      (state.wantPile.length === 0 ? '<span class="wn-basket-empty">有了更开心的东西</span>' : "") +
      "</div></button>" +
      "</div>";

    stageEl.innerHTML = html;

    if (!placed) {
      document.getElementById("wn-basket-need").addEventListener("click", function () { place("need"); });
      document.getElementById("wn-basket-want").addEventListener("click", function () { place("want"); });
    } else {
      var reasonBtns = stageEl.querySelectorAll("[data-reason]");
      for (var i = 0; i < reasonBtns.length; i++) {
        reasonBtns[i].addEventListener("click", function (event) {
          pickReason(Number(event.currentTarget.getAttribute("data-reason")));
        });
      }
      document.getElementById("wn-next").addEventListener("click", next);
    }
  }

  function renderDone() {
    var total = CARDS.length;
    var doneTitle =
      state.score === total ? "太棒了，全部答对！🌟" : state.score >= total / 2 ? "做得好！" : "再练一练会更棒！";

    var html = '<div class="wn-done-card">' +
      '<div class="wn-done-badge-orb">🌳</div>' +
      '<div class="wn-done-title">' + doneTitle + "</div>" +
      '<div class="wn-done-score">你答对了 <b class="wn-hl-need">' + state.score + "</b> / " + total + " 张卡片</div>" +
      '<div class="wn-done-badge-row">' +
      '<div class="wn-done-badge-icon">🏅</div>' +
      '<div><div class="wn-done-badge-name">选择森林小达人</div><div class="wn-done-badge-unlocked">徽章已解锁 Badge unlocked ✓</div></div>' +
      "</div>" +
      '<div class="wn-done-actions">' +
      '<button type="button" class="wn-start-btn" id="wn-replay">再玩一次 ↺</button>' +
      '<a class="wn-ghost-btn" href="/explore/choice-forest?level=beginner">回到森林 →</a>' +
      "</div></div>";
    stageEl.innerHTML = html;
    document.getElementById("wn-replay").addEventListener("click", start);
  }

  function render() {
    if (state.phase === "intro") renderIntro();
    else if (state.phase === "play") renderPlay();
    else renderDone();
  }

  render();
})();
`;
