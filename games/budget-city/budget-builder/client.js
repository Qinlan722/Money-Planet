export const clientScript = `
(function () {
  var STORAGE_BADGE = "mp_badge_budget_builder";

  var CATS = [
    { key: "eat", emoji: "🍎", name: "吃", en: "Food", color: "#ff9e8a" },
    { key: "play", emoji: "🎮", name: "玩", en: "Play", color: "#8fc3f5" },
    { key: "save", emoji: "🐷", name: "存", en: "Save", color: "#8fe0a8" },
    { key: "give", emoji: "🎁", name: "送", en: "Give", color: "#ffd873" },
  ];

  var ROUNDS = [
    { title: "平常的一周", en: "An Ordinary Week", budget: 8, npc: "🧑‍🏫",
      line: "先做个简单的计划：每样都留一点，把星星币都投完！",
      rules: [{ k: "each1", label: "每样至少 1 颗" }],
      good: "棒！四座小屋都照顾到了，这就是平衡的好计划。" },
    { title: "想买大玩具", en: "Saving for a Big Toy", budget: 10, npc: "🧒",
      line: "我想攒钱买个大玩具！这周让存钱屋放得最多吧。",
      rules: [{ k: "saveMost", label: "存钱屋放得最多" }, { k: "each1", label: "每样至少 1 颗" }],
      good: "太好了！存得最多，离大玩具越来越近啦。" },
    { title: "好朋友的生日", en: "A Friend's Birthday", budget: 10, npc: "🎈",
      line: "这周好朋友过生日，记得给送礼屋多留一些哦～",
      rules: [{ k: "giveGte3", label: "送礼屋 ≥ 3 颗" }, { k: "each1", label: "每样至少 1 颗" }],
      good: "朋友一定很开心！懂得为别人留出预算，真贴心。" },
    { title: "聪明规划师", en: "Smart Planner", budget: 12, npc: "🦉",
      line: "高手挑战：存的要比玩的多，而且每样都要有！",
      rules: [{ k: "saveGtePlay", label: "存 ≥ 玩" }, { k: "each1", label: "每样至少 1 颗" }],
      good: "厉害！先存后玩，你已经是聪明规划师了。" },
  ];

  var state = {
    phase: "intro",
    index: 0,
    alloc: { eat: 0, play: 0, save: 0, give: 0 },
    submitted: false,
    correct: false,
    stars: 0,
    streak: 0,
    history: [],
  };

  var stageEl = document.getElementById("bb-stage");

  function cur() {
    return ROUNDS[state.index];
  }

  function sum(a) {
    return a.eat + a.play + a.save + a.give;
  }

  function test(k, a) {
    if (k === "each1") return a.eat >= 1 && a.play >= 1 && a.save >= 1 && a.give >= 1;
    if (k === "saveMost") return a.save > a.eat && a.save > a.play && a.save > a.give;
    if (k === "giveGte3") return a.give >= 3;
    if (k === "saveGtePlay") return a.save >= a.play;
    return true;
  }

  function start() {
    state = { phase: "play", index: 0, alloc: { eat: 0, play: 0, save: 0, give: 0 }, submitted: false, correct: false, stars: 0, streak: 0, history: [] };
    render();
  }

  function inc(key) {
    if (state.submitted) return;
    var r = cur();
    if (sum(state.alloc) >= r.budget) return;
    state.alloc[key] += 1;
    render();
  }

  function dec(key) {
    if (state.submitted) return;
    state.alloc[key] = Math.max(0, state.alloc[key] - 1);
    render();
  }

  function confirm() {
    if (state.submitted) return;
    var r = cur();
    if (sum(state.alloc) !== r.budget) return;
    var ok = r.rules.every(function (rl) { return test(rl.k, state.alloc); });
    state.submitted = true;
    state.correct = ok;
    if (ok) {
      state.stars += 1;
      state.streak += 1;
    } else {
      state.streak = 0;
    }
    render();
  }

  function retry() {
    state.submitted = false;
    state.correct = false;
    render();
  }

  function next() {
    state.history.push(Object.assign({}, state.alloc));
    if (state.index >= ROUNDS.length - 1) {
      state.phase = "done";
      try {
        window.localStorage.setItem(STORAGE_BADGE, "1");
      } catch (e) {}
    } else {
      state.index += 1;
      state.alloc = { eat: 0, play: 0, save: 0, give: 0 };
      state.submitted = false;
      state.correct = false;
    }
    render();
  }

  function confettiHtml() {
    var colors = ["#5ca9f2", "#8fc3f5", "#ffd873", "#8fe0a8", "#ffffff"];
    var out = "";
    for (var i = 0; i < 18; i++) {
      var color = colors[i % colors.length];
      var left = Math.min(97, Math.max(1, Math.round((i / 18) * 100 + (Math.random() * 6 - 3))));
      var dur = (0.9 + Math.random() * 0.8).toFixed(2);
      var delay = (Math.random() * 0.25).toFixed(2);
      var size = 7 + Math.round(Math.random() * 5);
      out +=
        '<span class="bb-confetti-piece" style="left:' + left + "%; width:" + size + "px; height:" + size + "px; background:" + color +
        "; animation-duration:" + dur + "s; animation-delay:" + delay + 's;"></span>';
    }
    return out;
  }

  function renderIntro() {
    var html =
      '<div class="bb-intro-card">' +
      '<div class="bb-intro-text">每个星期你都有一些<b class="bb-hl-gold">星星币</b>。<b class="bb-hl-blue">点一下小罐子</b>就能往里投币，分给 <b class="bb-hl-coral">吃</b>、<b class="bb-hl-blue">玩</b>、<b style="color:#8fe0a8;">存</b>、<b class="bb-hl-gold">送</b>。先看看这周的小目标，把币全部投完再确认！</div>' +
      '<div class="bb-cat-grid">';
    CATS.forEach(function (c) {
      html +=
        '<div class="bb-cat-chip" style="background:' + c.color + '1f; border:1px solid ' + c.color + '59;">' +
        '<div class="bb-cat-chip-icon">' + c.emoji + "</div>" +
        '<div class="bb-cat-chip-label" style="color:' + c.color + ';">' + c.name + "</div>" +
        "</div>";
    });
    html += "</div>";
    html +=
      '<div class="bb-start-row"><button type="button" class="bb-start-btn" id="bb-start">开始规划 Start →</button><span class="bb-total-note">共 ' +
      ROUNDS.length + " 个星期</span></div></div>";
    stageEl.innerHTML = html;
    document.getElementById("bb-start").addEventListener("click", start);
  }

  function renderPlay() {
    var total = ROUNDS.length;
    var r = cur();
    var used = sum(state.alloc);
    var remaining = r.budget - used;
    var progressPct = Math.round((state.index / total) * 100);

    var html =
      '<div class="bb-progress-row">' +
      '<div class="bb-progress-track"><div class="bb-progress-fill" style="width:' + progressPct + '%;"></div></div>' +
      '<span class="bb-progress-label">第 ' + (state.index + 1) + " / " + total + ' 周</span>' +
      '<span class="bb-score-chip">⭐ ' + state.stars + "</span>" +
      "</div>";

    html +=
      '<div class="bb-scenario">' +
      '<div class="bb-scenario-emoji">' + r.npc + "</div>" +
      '<div><span class="bb-scenario-title">' + r.title + '</span><span class="bb-scenario-en">' + r.en + "</span>" +
      '<div class="bb-scenario-line">' + r.line + "</div></div>" +
      "</div>";

    html += '<div class="bb-body">';

    html += '<div class="bb-pool-row"><span class="bb-pool-label">待投的星星币</span>';
    for (var i = 0; i < remaining; i++) html += '<span class="bb-pool-star">⭐</span>';
    if (remaining === 0) html += '<span class="bb-pool-empty">全部投完啦！</span>';
    html += "</div>";
    html += '<div class="bb-budget-note">本周共 ⭐ ' + r.budget + " · 还剩 " + remaining + "</div>";

    html += '<div class="bb-jar-grid">';
    CATS.forEach(function (c) {
      var count = state.alloc[c.key];
      var addDisabled = state.submitted || remaining <= 0;
      var removeDisabled = state.submitted || count <= 0;
      html += '<div class="bb-jar-wrap">' +
        '<button type="button" class="bb-jar-btn" data-add="' + c.key + '"' + (addDisabled ? " disabled" : "") + '>' +
        '<div class="bb-jar-emoji">' + c.emoji + "</div>" +
        '<div class="bb-jar-name">' + c.name + "</div>" +
        '<div class="bb-jar-pips">';
      for (var p = 0; p < count; p++) {
        html += '<span class="bb-jar-pip" style="background:' + c.color + ';"></span>';
      }
      html += "</div>" +
        '<div class="bb-jar-count" style="color:' + c.color + ';">' + count + "</div>" +
        '<div class="bb-jar-hint">点一下加币</div>' +
        "</button>" +
        '<button type="button" class="bb-jar-minus" data-remove="' + c.key + '"' + (removeDisabled ? " disabled" : "") + ">−</button>" +
        "</div>";
    });
    html += "</div>";

    html += '<div class="bb-checklist"><div class="bb-checklist-title">🎯 这周的小目标</div><div class="bb-checklist-rows">';
    r.rules.forEach(function (rl) {
      var ok = test(rl.k, state.alloc);
      var mark, color;
      if (state.submitted) {
        mark = ok ? "✓" : "✗";
        color = ok ? "#8fe0a8" : "#ff9e8a";
      } else {
        mark = ok ? "✓" : "○";
        color = ok ? "#8fe0a8" : "#7c7aa6";
      }
      html += '<div class="bb-checklist-row"><span class="bb-checklist-mark" style="color:' + color + ';">' + mark + "</span><span>" + rl.label + "</span></div>";
    });
    html += "</div></div>";

    html += '<div class="bb-confirm-row"><button type="button" class="bb-confirm-btn" id="bb-confirm"' +
      (state.submitted || remaining !== 0 ? " disabled" : "") + ">确认计划 Confirm</button></div>";

    if (state.submitted) {
      html += '<div class="bb-feedback">';
      if (state.correct) {
        html += '<div class="bb-confetti">' + confettiHtml() + "</div>";
      }
      html += '<div class="bb-feedback-emoji">' + (state.correct ? "🎉" : "💡") + "</div>";
      html += '<div class="bb-feedback-title" style="color:' + (state.correct ? "#8fe0a8" : "#ffd873") + ';">' + (state.correct ? "好计划！" : "再想一想～") + "</div>";
      if (state.correct && state.streak >= 2) {
        html += '<div class="bb-streak-chip">🔥 连对 ' + state.streak + " 周！</div>";
      }
      var desc = state.correct ? r.good : "星星币投完啦，但还没达成上面的目标。看看没打勾（✗）的那一条，调一调再试试！";
      html += '<div class="bb-feedback-reaction"><span class="bb-feedback-reaction-emoji">' + r.npc + '</span><span class="bb-feedback-reaction-text">' + desc + "</span></div>";
      var isLast = state.index >= total - 1;
      var nextLabel = isLast ? "看规划总结 →" : "下一周 →";
      html += '<div class="bb-feedback-actions">';
      if (state.correct) {
        html += '<button type="button" class="bb-next-btn" id="bb-next">' + nextLabel + "</button>";
      } else {
        html += '<button type="button" class="bb-retry-btn" id="bb-retry">再调整一下 ↺</button>' +
          '<button type="button" class="bb-skip-btn" id="bb-next">先这样，' + nextLabel + "</button>";
      }
      html += "</div></div>";
    }

    html += "</div>";
    stageEl.innerHTML = html;

    var addBtns = stageEl.querySelectorAll("[data-add]");
    for (var a = 0; a < addBtns.length; a++) {
      addBtns[a].addEventListener("click", function (event) {
        inc(event.currentTarget.getAttribute("data-add"));
      });
    }
    var removeBtns = stageEl.querySelectorAll("[data-remove]");
    for (var d = 0; d < removeBtns.length; d++) {
      removeBtns[d].addEventListener("click", function (event) {
        dec(event.currentTarget.getAttribute("data-remove"));
      });
    }
    var confirmBtn = document.getElementById("bb-confirm");
    if (confirmBtn) confirmBtn.addEventListener("click", confirm);
    var retryBtn = document.getElementById("bb-retry");
    if (retryBtn) retryBtn.addEventListener("click", retry);
    var nextBtn = document.getElementById("bb-next");
    if (nextBtn) nextBtn.addEventListener("click", next);
  }

  function renderDone() {
    var total = ROUNDS.length;
    var totals = state.history.reduce(function (acc, a) {
      return { eat: acc.eat + a.eat, play: acc.play + a.play, save: acc.save + a.save, give: acc.give + a.give };
    }, { eat: 0, play: 0, save: 0, give: 0 });
    var maxT = Math.max(1, totals.eat, totals.play, totals.save, totals.give);
    var doneTitle = state.stars === total ? "超级规划师！🌟" : state.stars >= total / 2 ? "规划得不错！" : "多练几次会更棒！";

    var html =
      '<div class="bb-done-card">' +
      '<div class="bb-confetti bb-confetti-done">' + confettiHtml() + "</div>" +
      '<div class="bb-done-badge-orb">🧩</div>' +
      '<div class="bb-done-title">' + doneTitle + "</div>" +
      '<div class="bb-done-score">你完成了 <b>' + state.stars + "</b> / " + total + " 周的好计划</div>";

    html += '<div class="bb-bars"><div class="bb-bars-title">这几周你一共这样分配 ⭐</div>';
    CATS.forEach(function (c) {
      var val = totals[c.key];
      var pct = Math.round((val / maxT) * 100);
      html += '<div class="bb-bar-row">' +
        '<span class="bb-bar-emoji">' + c.emoji + "</span>" +
        '<span class="bb-bar-name">' + c.name + "</span>" +
        '<div class="bb-bar-track"><div class="bb-bar-fill" style="width:' + pct + "%; background:" + c.color + ';"></div></div>' +
        '<span class="bb-bar-val">' + val + "</span>" +
        "</div>";
    });
    html += "</div>";

    html += '<div class="bb-done-badge-row">' +
      '<div class="bb-done-badge-icon">🏅</div>' +
      '<div><div class="bb-done-badge-name">预算规划师徽章</div><div class="bb-done-badge-unlocked">徽章已解锁 Badge unlocked ✓</div></div>' +
      "</div>";

    html += '<div class="bb-done-actions">' +
      '<button type="button" class="bb-start-btn" id="bb-replay">再规划一次 ↺</button>' +
      '<a class="bb-ghost-link" href="/explore/budget-city?level=beginner">回到城市 →</a>' +
      "</div></div>";

    stageEl.innerHTML = html;
    document.getElementById("bb-replay").addEventListener("click", start);
  }

  function render() {
    if (state.phase === "intro") renderIntro();
    else if (state.phase === "play") renderPlay();
    else renderDone();
  }

  render();
})();
`;
