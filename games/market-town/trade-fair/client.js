export const clientScript = `
(function () {
  var STORAGE_BADGE = "mp_badge_trade_fair";

  var ROUNDS = [
    { npc: "🧒", offer: "我用我的贴纸，换你的糖果，好不好？",
      theirs: { emoji: "✨", name: "贴纸", en: "Sticker", val: 1 },
      yours: { emoji: "🍬", name: "糖果", en: "Candy", val: 1 },
      correct: "accept",
      fb: {
        accept: "两样东西差不多值钱，大家都开心 —— 这是公平的交换！",
        adjust: "其实已经很公平啦，不用再要更多，大方接受就好。",
        decline: "这是个公平的交换，拒绝有点可惜哦。",
      },
      react: { accept: "太好了，成交！谢谢你~", adjust: "咦？我觉得已经很公平了呀…", decline: "啊？好吧，那算了…" } },
    { npc: "🧑", offer: "用我这支铅笔，换你的漫画书吧！",
      theirs: { emoji: "✏️", name: "铅笔", en: "Pencil", val: 1 },
      yours: { emoji: "📗", name: "漫画书", en: "Comic Book", val: 3 },
      correct: "adjust",
      fb: {
        adjust: "你的漫画书更值钱。友好地说“要再加一点才公平吧”，大方表达自己的想法，很棒！",
        accept: "漫画书比铅笔值钱不少，这样你会吃亏 —— 可以先商量商量。",
        decline: "不一定要拒绝，提议一个更公平的交换会更好哦。",
      },
      react: { adjust: "说得对！那我再加一支笔和一块橡皮，这样公平吧？", accept: "嘿嘿，谢啦！（其实我赚到了…）", decline: "好吧，那不换了…" } },
    { npc: "🧓", offer: "我用我的玩具车，换你这颗小弹珠！",
      theirs: { emoji: "🚗", name: "玩具车", en: "Toy Car", val: 3 },
      yours: { emoji: "🔵", name: "弹珠", en: "Marble", val: 1 },
      correct: "adjust",
      fb: {
        adjust: "玩具车比弹珠值钱多啦！提醒对方“这样你会吃亏哦” —— 不占别人便宜，懂得尊重对方，真棒！",
        accept: "你占了大便宜，可是这对朋友不公平哦。真正的高手会提醒对方。",
        decline: "拒绝也行，不过友好地告诉对方“这样不太公平”会更好。",
      },
      react: { adjust: "哎呀，谢谢你提醒我！你真是个诚实的好朋友。", accept: "太好了，成交！（咦，我好像亏了…）", decline: "哦…好吧。" } },
    { npc: "🧒", offer: "你的水彩笔换给我好不好？我用两块橡皮跟你换！",
      theirs: { emoji: "🧽", name: "两块橡皮", en: "2 Erasers", val: 2 },
      yours: { emoji: "🖌️", name: "水彩笔", en: "Paint Brush", val: 2, need: "这是你明天上美术课要用的" },
      correct: "decline",
      fb: {
        decline: "就算价值差不多，这是你明天上课要用的东西。礼貌地说“我需要它，这次不换了”，拒绝也没关系！",
        accept: "价钱是挺公平，但这是你明天要用的 —— 想清楚自己真正的需要更重要。",
        adjust: "这不是价钱的问题，而是你真的需要它。可以礼貌地说明并拒绝。",
      },
      react: { decline: "原来你明天要用呀，那当然不能换，我理解！", accept: "耶，谢谢！（可是你明天用什么呢？）", adjust: "加多少都不行呀，你明天要用的…" } },
    { npc: "🧑‍🦰", offer: "我的果汁，换你的饼干，怎么样？",
      theirs: { emoji: "🧃", name: "果汁", en: "Juice", val: 2 },
      yours: { emoji: "🍪", name: "饼干", en: "Cookie", val: 2 },
      correct: "accept",
      fb: {
        accept: "果汁和饼干价值差不多，又都是你俩喜欢的 —— 公平又开心，成交！",
        adjust: "已经很公平啦，不用多要，爽快接受就好。",
        decline: "这是个不错的公平交换，拒绝有点可惜哦。",
      },
      react: { accept: "耶，一起分享零食最开心啦！", adjust: "都一样值钱呀，还要加吗？", decline: "哦…那我自己喝好了。" } },
    { npc: "👧", offer: "你的小狗玩偶，换我这块巧克力好吗？",
      theirs: { emoji: "🍫", name: "巧克力", en: "Chocolate", val: 1 },
      yours: { emoji: "🧸", name: "小狗玩偶", en: "Puppy Plush", val: 3, need: "这是奶奶送你的，你特别喜欢" },
      correct: "decline",
      fb: {
        decline: "这是奶奶送的、你最喜欢的玩偶，对你有特别的意义。礼貌地说“它对我很重要，不能换”，很棒！",
        accept: "巧克力吃完就没了，而这个玩偶是奶奶送的宝贝 —— 想清楚什么对你最珍贵。",
        adjust: "这不是价钱的问题 —— 有些东西再多也不换，礼貌拒绝就好。",
      },
      react: { decline: "原来是奶奶送的呀，那要好好留着，我懂！", accept: "真的给我啦？（你不会舍不得吗…）", adjust: "加东西也不行吗？好吧，我明白了。" } },
  ];

  var OPTS = [
    { key: "accept", emoji: "🤝", label: "接受交换", en: "Accept the trade" },
    { key: "adjust", emoji: "💬", label: "友好商量一下", en: "Suggest a fair swap" },
    { key: "decline", emoji: "🙅", label: "礼貌拒绝", en: "Politely decline" },
  ];

  var STAMP = {
    accept: { text: "成交 ✓", color: "#8fe0a8" },
    adjust: { text: "友好商量 🤝", color: "#ffd873" },
    decline: { text: "礼貌婉拒 🙂", color: "#ff9e8a" },
  };

  var state = {
    phase: "intro",
    index: 0,
    picked: null,
    correct: false,
    stars: 0,
    streak: 0,
  };

  var stageEl = document.getElementById("tf-stage");

  function cur() {
    return ROUNDS[state.index];
  }

  function start() {
    state = { phase: "play", index: 0, picked: null, correct: false, stars: 0, streak: 0 };
    render();
  }

  function pick(key) {
    if (state.picked) return;
    var r = cur();
    var ok = key === r.correct;
    state.picked = key;
    state.correct = ok;
    if (ok) {
      state.stars += 1;
      state.streak += 1;
    } else {
      state.streak = 0;
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
      state.picked = null;
      state.correct = false;
    }
    render();
  }

  function confettiHtml() {
    var colors = ["#ffd873", "#f2971d", "#ffc94a", "#8fe0a8", "#ffffff"];
    var out = "";
    for (var i = 0; i < 18; i++) {
      var color = colors[i % colors.length];
      var left = Math.min(97, Math.max(1, Math.round((i / 18) * 100 + (Math.random() * 6 - 3))));
      var dur = (0.9 + Math.random() * 0.8).toFixed(2);
      var delay = (Math.random() * 0.25).toFixed(2);
      var size = 7 + Math.round(Math.random() * 5);
      out +=
        '<span class="tf-confetti-piece" style="left:' + left + "%; width:" + size + "px; height:" + size + "px; background:" + color +
        "; animation-duration:" + dur + "s; animation-delay:" + delay + 's;"></span>';
    }
    return out;
  }

  function renderIntro() {
    var html =
      '<div class="tf-intro-card">' +
      '<p class="tf-intro-text">市集里，小伙伴想和你<b class="tf-hl-gold">交换东西</b>。看看两样东西的 <b class="tf-hl-gold">⭐ 价值</b> 是不是差不多，再决定怎么回答 —— 对方会当场给你回应哦！<b class="tf-hl-green">公平</b>就接受、<b class="tf-hl-gold">不公平</b>就友好商量、<b class="tf-hl-coral">自己需要</b>就礼貌拒绝。</p>' +
      '<div class="tf-info-row">' +
      '<div class="tf-info-chip tf-info-accept"><div class="tf-info-icon">🤝</div><div class="tf-info-title">接受</div><div class="tf-info-sub">公平就大方交换</div></div>' +
      '<div class="tf-info-chip tf-info-adjust"><div class="tf-info-icon">💬</div><div class="tf-info-title">商量</div><div class="tf-info-sub">不公平就说出来</div></div>' +
      '<div class="tf-info-chip tf-info-decline"><div class="tf-info-icon">🙅</div><div class="tf-info-title">拒绝</div><div class="tf-info-sub">需要的礼貌说不</div></div>' +
      "</div>" +
      '<div class="tf-start-row"><button type="button" class="tf-start-btn" id="tf-start">逛逛市集 Start →</button><span class="tf-total-note">共 ' +
      ROUNDS.length +
      " 次交换</span></div>" +
      "</div>";
    stageEl.innerHTML = html;
    document.getElementById("tf-start").addEventListener("click", start);
  }

  function renderPlay() {
    var total = ROUNDS.length;
    var r = cur();
    var progressPct = Math.round((state.index / total) * 100);

    var html =
      '<div class="tf-progress-row">' +
      '<div class="tf-progress-track"><div class="tf-progress-fill" style="width:' + progressPct + '%;"></div></div>' +
      '<span class="tf-progress-label">第 ' + (state.index + 1) + " / " + total + ' 次</span>' +
      '<span class="tf-score-chip">⭐ ' + state.stars + "</span>" +
      "</div>";

    html +=
      '<div class="tf-offer">' +
      '<div class="tf-npc-emoji">' + r.npc + "</div>" +
      '<div class="tf-npc-bubble">' + r.offer + "</div>" +
      "</div>";

    html += '<div class="tf-body">';

    var diff = r.yours.val - r.theirs.val;
    var verdictText, verdictClass;
    if (diff === 0) {
      verdictText = "⚖️ 两样价值差不多，很公平";
      verdictClass = "tf-verdict-fair";
    } else if (diff > 0) {
      verdictText = "你的更值钱 —— 对你不太公平";
      verdictClass = "tf-verdict-warn";
    } else {
      verdictText = "同伴的更值钱 —— 对他不太公平";
      verdictClass = "tf-verdict-warn";
    }

    html +=
      '<div class="tf-trade-row">' +
      '<div class="tf-item-card">' +
      '<div class="tf-item-label">同伴给你 THEIR</div>' +
      '<div class="tf-item-box">' + r.theirs.emoji + "</div>" +
      '<div class="tf-item-name">' + r.theirs.name + "</div>" +
      '<div class="tf-item-en">' + r.theirs.en + "</div>" +
      '<div class="tf-item-stars">' + "⭐".repeat(r.theirs.val) + "</div>" +
      "</div>" +
      '<div class="tf-trade-arrow">⇄</div>' +
      '<div class="tf-item-card tf-item-card-yours">' +
      '<div class="tf-item-label tf-item-label-yours">你的 YOURS</div>' +
      '<div class="tf-item-box">' + r.yours.emoji + "</div>" +
      '<div class="tf-item-name">' + r.yours.name + "</div>" +
      '<div class="tf-item-en">' + r.yours.en + "</div>" +
      '<div class="tf-item-stars">' + "⭐".repeat(r.yours.val) + "</div>" +
      "</div>" +
      "</div>";

    html += '<div class="tf-verdict ' + verdictClass + '">' + verdictText + "</div>";
    if (r.yours.need) {
      html += '<div class="tf-need-warning">⚠️ ' + r.yours.need + "</div>";
    }

    html += '<div class="tf-options">';
    OPTS.forEach(function (o) {
      var chosen = state.picked === o.key;
      var isBest = o.key === r.correct;
      var cls = "tf-option";
      if (state.picked) {
        if (isBest) cls += " is-correct";
        else if (chosen) cls += " is-wrong";
        else cls += " is-dim";
      }
      html +=
        '<button type="button" class="' + cls + '" data-opt="' + o.key + '"' + (state.picked ? " disabled" : "") + ">" +
        '<span class="tf-option-emoji">' + o.emoji + "</span>" +
        '<span class="tf-option-text"><span class="tf-option-label">' + o.label + '</span><span class="tf-option-en">' + o.en + "</span></span>" +
        "</button>";
    });
    html += "</div>";

    if (state.picked) {
      var stamp = STAMP[state.picked];
      html += '<div class="tf-feedback">';
      if (state.correct) {
        html += '<div class="tf-confetti">' + confettiHtml() + "</div>";
      }
      html +=
        '<div class="tf-stamp" style="border-color:' + stamp.color + "; color:" + stamp.color + ';">' + stamp.text + "</div>";
      html +=
        '<div class="tf-reaction-row">' +
        '<span class="tf-reaction-emoji">' + r.npc + "</span>" +
        '<span class="tf-reaction-bubble">' + (r.react[state.picked] || "") + "</span>" +
        "</div>";
      html += '<div class="tf-result-desc">' + (r.fb[state.picked] || "") + "</div>";
      if (state.correct && state.streak >= 2) {
        html += '<div class="tf-streak-chip">🔥 连对 ' + state.streak + " 次！</div>";
      }
      if (!state.correct) {
        var bestLabel = (OPTS.filter(function (o) { return o.key === r.correct; })[0] || {}).label;
        html += '<div class="tf-best-hint">💡 更好的做法：' + bestLabel + "</div>";
      }
      var isLast = state.index >= total - 1;
      html += '<button type="button" class="tf-cta-btn" id="tf-next">' + (isLast ? "看市集总结 →" : "下一次交换 →") + "</button>";
      html += "</div>";
    }

    html += "</div>";
    stageEl.innerHTML = html;

    if (!state.picked) {
      var optBtns = stageEl.querySelectorAll("[data-opt]");
      for (var i = 0; i < optBtns.length; i++) {
        optBtns[i].addEventListener("click", function (event) {
          pick(event.currentTarget.getAttribute("data-opt"));
        });
      }
    } else {
      document.getElementById("tf-next").addEventListener("click", next);
    }
  }

  function renderDone() {
    var total = ROUNDS.length;
    var hearts = "💛".repeat(state.stars) + "🤍".repeat(Math.max(0, total - state.stars));
    var doneTitle =
      state.stars === total ? "公平交换小高手！🌟" : state.stars >= total / 2 ? "做得很好！" : "再练一练会更棒！";

    var html =
      '<div class="tf-done-card">' +
      '<div class="tf-confetti tf-confetti-done">' + confettiHtml() + "</div>" +
      '<div class="tf-done-badge-orb">🤝</div>' +
      '<div class="tf-done-title">' + doneTitle + "</div>" +
      '<div class="tf-done-score">你做出了 <b class="tf-hl-gold">' + state.stars + "</b> / " + total + " 次聪明又友好的决定</div>" +
      '<div class="tf-done-hearts">' + hearts + "</div>" +
      '<div class="tf-done-hearts-label">友谊值 Friendship</div>' +
      '<div class="tf-done-badge-row">' +
      '<div class="tf-done-badge-icon">🏅</div>' +
      '<div><div class="tf-done-badge-name">公平交换小达人徽章</div><div class="tf-done-badge-unlocked">徽章已解锁 Badge unlocked ✓</div></div>' +
      "</div>" +
      '<div class="tf-done-actions">' +
      '<button type="button" class="tf-start-btn" id="tf-replay">再逛一次 ↺</button>' +
      '<a class="tf-ghost-link" href="/explore/market-town?level=beginner">回到小镇 →</a>' +
      "</div></div>";
    stageEl.innerHTML = html;
    document.getElementById("tf-replay").addEventListener("click", start);
  }

  function render() {
    if (state.phase === "intro") renderIntro();
    else if (state.phase === "play") renderPlay();
    else renderDone();
  }

  render();
})();
`;
