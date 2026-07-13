export const clientScript = `
(function () {
  var STORAGE_BADGE = "mp_badge_tiny_shopkeeper";
  var DENOMS = [1, 2, 5];
  var COIN_COLOR = {
    1: "linear-gradient(135deg,#e9b77a,#c9873f)",
    2: "linear-gradient(135deg,#d8dce6,#9aa3b8)",
    5: "linear-gradient(135deg,#ffe49b,#f2ae3a)",
  };

  var ROUNDS = [
    { emoji: "🖊️", name: "钢笔", en: "Pen", fair: 5, pay: 10, cust: "🧑", line: "你好！我想买这支钢笔。",
      opts: [{ v: 1, k: "low" }, { v: 5, k: "fair" }, { v: 15, k: "high" }] },
    { emoji: "🍪", name: "饼干", en: "Cookies", fair: 3, pay: 5, cust: "👧", line: "这盒饼干看起来好好吃！",
      opts: [{ v: 3, k: "fair" }, { v: 9, k: "high" }, { v: 1, k: "low" }] },
    { emoji: "📓", name: "笔记本", en: "Notebook", fair: 8, pay: 10, cust: "🧓", line: "孩子上学要用，给我一本。",
      opts: [{ v: 18, k: "high" }, { v: 2, k: "low" }, { v: 8, k: "fair" }] },
    { emoji: "🍭", name: "棒棒糖", en: "Lollipop", fair: 4, pay: 5, cust: "👦", line: "我要一根草莓味的棒棒糖！",
      opts: [{ v: 4, k: "fair" }, { v: 1, k: "low" }, { v: 12, k: "high" }] },
  ];

  var MAX_STARS = ROUNDS.length * 2;

  var state = {
    phase: "intro",
    order: [0, 1, 2, 3],
    index: 0,
    step: "price",
    priceIdx: null,
    priceCorrect: false,
    tray: [],
    changeSubmitted: false,
    changeCorrect: false,
    stars: 0,
    fairCount: 0,
    changeCount: 0,
  };

  var stageEl = document.getElementById("ts-stage");

  function trayTotal() {
    return state.tray.reduce(function (a, b) { return a + b; }, 0);
  }

  function start() {
    state = {
      phase: "play",
      order: [0, 1, 2, 3],
      index: 0,
      step: "price",
      priceIdx: null,
      priceCorrect: false,
      tray: [],
      changeSubmitted: false,
      changeCorrect: false,
      stars: 0,
      fairCount: 0,
      changeCount: 0,
    };
    render();
  }

  function pickPrice(i) {
    if (state.priceIdx !== null) return;
    var r = ROUNDS[state.order[state.index]];
    var correct = r.opts[i].k === "fair";
    state.priceIdx = i;
    state.priceCorrect = correct;
    if (correct) {
      state.stars += 1;
      state.fairCount += 1;
    }
    render();
  }

  function goChange() {
    state.step = "change";
    render();
  }

  function addCoin(v) {
    if (state.changeSubmitted) return;
    state.tray.push(v);
    render();
  }

  function undoCoin() {
    if (state.changeSubmitted) return;
    state.tray.pop();
    render();
  }

  function clearTray() {
    if (state.changeSubmitted) return;
    state.tray = [];
    render();
  }

  function submitChange() {
    if (state.changeSubmitted || state.tray.length === 0) return;
    var r = ROUNDS[state.order[state.index]];
    var need = r.pay - r.fair;
    var correct = trayTotal() === need;
    state.changeSubmitted = true;
    state.changeCorrect = correct;
    if (correct) {
      state.stars += 1;
      state.changeCount += 1;
    }
    render();
  }

  function next() {
    if (state.index >= ROUNDS.length - 1) {
      state.phase = "done";
      try {
        window.localStorage.setItem(STORAGE_BADGE, "1");
      } catch (e) {}
    } else {
      state.index += 1;
      state.step = "price";
      state.priceIdx = null;
      state.priceCorrect = false;
      state.tray = [];
      state.changeSubmitted = false;
      state.changeCorrect = false;
    }
    render();
  }

  function renderIntro() {
    var html = '<div class="ts-intro-card">' +
      '<p class="ts-intro-text">欢迎来到你的小摊位！每来一位顾客，你要做两件事：先给商品<b class="ts-hl-price">贴一个公平的价格</b>，再<b class="ts-hl-change">数出正确的找零</b>。公平交易、算对零钱，就能赚到星星！</p>' +
      '<div class="ts-info-row">' +
      '<div class="ts-info-chip ts-info-price"><div class="ts-info-icon">🏷️</div><div class="ts-info-title">第一步 · 定价</div><div class="ts-info-sub">不太贵也不太便宜，才公平</div></div>' +
      '<div class="ts-info-chip ts-info-change"><div class="ts-info-icon">🪙</div><div class="ts-info-title">第二步 · 找零</div><div class="ts-info-sub">用硬币凑出该退的钱</div></div>' +
      "</div>" +
      '<div class="ts-start-row"><button type="button" class="ts-start-btn" id="ts-start">开门营业 Open Shop →</button><span class="ts-total-note">共 ' + ROUNDS.length + ' 位顾客</span></div>' +
      "</div>";
    stageEl.innerHTML = html;
    document.getElementById("ts-start").addEventListener("click", start);
  }

  function renderPlay() {
    var total = ROUNDS.length;
    var r = ROUNDS[state.order[state.index]];
    var need = r.pay - r.fair;
    var progressPct = Math.round((state.index / total) * 100);

    var html = '<div class="ts-progress-row">' +
      '<div class="ts-progress-track"><div class="ts-progress-fill" style="width:' + progressPct + '%;"></div></div>' +
      '<span class="ts-progress-label">顾客 ' + (state.index + 1) + " / " + total + '</span>' +
      '<span class="ts-score-chip">⭐ ' + state.stars + "</span>" +
      "</div>";

    html += '<div class="ts-counter">' +
      '<div class="ts-cust-emoji">' + r.cust + "</div>" +
      '<div class="ts-cust-bubble">' + r.line + "</div>" +
      "</div>";

    html += '<div class="ts-counter-body">';
    html += '<div class="ts-item-row">' +
      '<div class="ts-item-icon">' + r.emoji + "</div>" +
      '<div><div class="ts-item-name">' + r.name + "</div>" +
      '<div class="ts-item-en">' + r.en + "</div></div>" +
      "</div>";

    if (state.step === "price") {
      html += '<div class="ts-step-label ts-hl-price">🏷️ 给它贴个公平的价格</div>';
      html += '<div class="ts-price-row">' +
        r.opts.map(function (o, i) {
          var picked = state.priceIdx === i;
          var isFair = o.k === "fair";
          var cls = "ts-price-btn";
          if (state.priceIdx !== null) {
            if (isFair) cls += " is-fair";
            else if (picked) cls += " is-wrong";
            else cls += " is-dim";
          }
          return '<button type="button" class="' + cls + '" data-price="' + i + '"' + (state.priceIdx !== null ? " disabled" : "") + ">¥" + o.v + "</button>";
        }).join("") +
        "</div>";

      if (state.priceIdx !== null) {
        var picked = r.opts[state.priceIdx];
        var feedback;
        if (picked.k === "fair") feedback = "👍 公平价 ¥" + r.fair + "！不贵也不便宜，顾客很满意。";
        else if (picked.k === "high") feedback = "🤔 ¥" + picked.v + " 有点贵了，顾客会跑掉哦。公平价其实是 ¥" + r.fair + "，就按这个价卖吧。";
        else feedback = "🤔 ¥" + picked.v + " 太便宜，你会亏本呢。公平价其实是 ¥" + r.fair + "，就按这个价卖吧。";
        html += '<div class="ts-price-feedback"><div class="ts-price-feedback-text">' + feedback + "</div>" +
          '<button type="button" class="ts-cta-btn" id="ts-to-change">顾客付钱 →</button></div>';
      }
    } else {
      html += '<div class="ts-tx-summary">' +
        '<span class="ts-tx-label">售价</span><span class="ts-tx-val">¥' + r.fair + "</span>" +
        '<span class="ts-tx-dot">·</span>' +
        '<span class="ts-tx-label">顾客付</span><span class="ts-tx-val">¥' + r.pay + "</span>" +
        "</div>";
      html += '<div class="ts-need-change">🪙 需要找零 <span class="ts-need-change-big">¥' + need + "</span></div>";

      html += '<div class="ts-tray">' +
        state.tray.map(function (v) {
          return '<span class="ts-tray-coin" style="background:' + COIN_COLOR[v] + ';">¥' + v + "</span>";
        }).join("") +
        (state.tray.length === 0 ? '<span class="ts-tray-empty">点下面的硬币，放进找零盘</span>' : "") +
        "</div>";

      var total2 = trayTotal();
      var totalCls = total2 === need ? "is-exact" : total2 > need ? "is-over" : "is-under";
      html += '<div class="ts-tray-total ' + totalCls + '">已放 ¥' + total2 + "</div>";

      html += '<div class="ts-coin-row">' +
        DENOMS.map(function (v) {
          return '<button type="button" class="ts-coin-btn" data-coin="' + v + '" style="background:' + COIN_COLOR[v] + ';"' + (state.changeSubmitted ? " disabled" : "") + ">¥" + v + "</button>";
        }).join("") +
        "</div>";

      var editLocked = state.changeSubmitted || state.tray.length === 0;
      var giveDisabled = state.changeSubmitted || state.tray.length === 0;
      html += '<div class="ts-tray-actions">' +
        '<button type="button" class="ts-ghost-btn" id="ts-undo"' + (editLocked ? " disabled" : "") + ">↩ 撤销</button>" +
        '<button type="button" class="ts-ghost-btn" id="ts-clear"' + (editLocked ? " disabled" : "") + ">🗑 清空</button>" +
        '<button type="button" class="ts-cta-btn ts-give-btn" id="ts-give"' + (giveDisabled ? " disabled" : "") + ">找零 Give Change</button>" +
        "</div>";

      if (state.changeSubmitted) {
        var isLast = state.index >= total - 1;
        var emoji = state.changeCorrect ? "🎉" : "💡";
        var titleCls = state.changeCorrect ? "ts-change-title-good" : "ts-change-title-hint";
        var title = state.changeCorrect ? "找零正确！" : "差一点点~";
        var desc = state.changeCorrect
          ? "你退给顾客 ¥" + need + "，刚刚好！交易完成 ✓"
          : "应该找零 ¥" + need + "，你给了 ¥" + total2 + "。数一数硬币，下次会更准！";
        html += '<div class="ts-change-feedback">' +
          '<div class="ts-change-feedback-emoji">' + emoji + "</div>" +
          '<div class="ts-change-feedback-title ' + titleCls + '">' + title + "</div>" +
          '<div class="ts-change-feedback-desc">' + desc + "</div>" +
          '<button type="button" class="ts-cta-btn" id="ts-next">' + (isLast ? "看今日结算 →" : "下一位顾客 →") + "</button>" +
          "</div>";
      }
    }

    html += "</div>";
    stageEl.innerHTML = html;

    if (state.step === "price") {
      if (state.priceIdx === null) {
        var priceBtns = stageEl.querySelectorAll("[data-price]");
        for (var i = 0; i < priceBtns.length; i++) {
          priceBtns[i].addEventListener("click", function (event) {
            pickPrice(Number(event.currentTarget.getAttribute("data-price")));
          });
        }
      } else {
        document.getElementById("ts-to-change").addEventListener("click", goChange);
      }
    } else {
      var coinBtns = stageEl.querySelectorAll("[data-coin]");
      for (var j = 0; j < coinBtns.length; j++) {
        coinBtns[j].addEventListener("click", function (event) {
          addCoin(Number(event.currentTarget.getAttribute("data-coin")));
        });
      }
      var undoBtn = document.getElementById("ts-undo");
      if (undoBtn) undoBtn.addEventListener("click", undoCoin);
      var clearBtn = document.getElementById("ts-clear");
      if (clearBtn) clearBtn.addEventListener("click", clearTray);
      var giveBtn = document.getElementById("ts-give");
      if (giveBtn) giveBtn.addEventListener("click", submitChange);
      var nextBtn = document.getElementById("ts-next");
      if (nextBtn) nextBtn.addEventListener("click", next);
    }
  }

  function renderDone() {
    var total = ROUNDS.length;
    var doneTitle =
      state.stars === MAX_STARS ? "完美的一天！🌟" : state.stars >= total ? "生意不错！" : "再练一练会更棒！";

    var html = '<div class="ts-done-card">' +
      '<div class="ts-done-badge-orb">🏪</div>' +
      '<div class="ts-done-title">' + doneTitle + "</div>" +
      '<div class="ts-done-score">今天你赚到了 <b class="ts-hl-change">' + state.stars + "</b> / " + MAX_STARS + " 颗星星</div>" +
      '<div class="ts-done-sub">公平定价 ' + state.fairCount + " 次 · 找零正确 " + state.changeCount + " 次</div>" +
      '<div class="ts-done-badge-row">' +
      '<div class="ts-done-badge-icon">🏅</div>' +
      '<div><div class="ts-done-badge-name">市集小店长徽章</div><div class="ts-done-badge-unlocked">徽章已解锁 Badge unlocked ✓</div></div>' +
      "</div>" +
      '<div class="ts-done-actions">' +
      '<button type="button" class="ts-start-btn" id="ts-replay">再开一天 ↺</button>' +
      '<a class="ts-ghost-link" href="/explore/market-town?level=beginner">回到小镇 →</a>' +
      "</div></div>";
    stageEl.innerHTML = html;
    document.getElementById("ts-replay").addEventListener("click", start);
  }

  function render() {
    if (state.phase === "intro") renderIntro();
    else if (state.phase === "play") renderPlay();
    else renderDone();
  }

  render();
})();
`;
