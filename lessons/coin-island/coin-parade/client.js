export const clientScript = `
(function () {
  var STORAGE_KEY = "mp_interactive_lesson_coin_count";
  var DONE_KEY = "mp_lesson_done_lesson-coin-count";
  var TARGETS = [4, 6, 8, 7, 10];

  var QUIZ = [
    { q: "两枚 1 元硬币和一枚 5 元硬币，哪个更多？", a: 1, opts: [["🪙🪙", "两枚 1 元"], ["🪙", "一枚 5 元"], ["🤝", "一样多"]] },
    { q: "先做什么，数钱更清楚？", a: 1, opts: [["🎲", "随便数"], ["🗂️", "先分类"], ["🙈", "闭上眼睛数"]] },
    { q: "橡皮 5 元，哪种付法刚刚好？", a: 1, opts: [["🪙🪙", "2 + 2"], ["🪙🪙🪙", "2 + 2 + 1"], ["🪙🪙🪙", "1 + 1 + 1"]] },
    { q: "哪个组合是 10 元？", a: 2, opts: [["🪙🪙", "5 + 2"], ["🪙🪙🪙", "2 + 2 + 2"], ["🪙🪙", "5 + 5"]] },
    { q: "想知道东西多少钱，看哪里？", a: 0, opts: [["🏷️", "价格标签"], ["🌳", "树上"], ["🛏️", "床底下"]] },
  ];

  var STORY_OUTCOMES = {
    sort: {
      emoji: "🗂️", title: "按数字分类排！", coins: "🪙🪙 ｜ 🪙🪙 ｜ 🪙🪙", good: true,
      lines: ["✨ 桥灯一盏一盏亮起来了！", "🧮 1 元一队、2 元一队、5 元一队，一眼就数清楚"],
    },
    size: {
      emoji: "📏", title: "按大小排好了！", coins: "🪙 🪙 🪙 ⬆️", good: true,
      lines: ["✨ 桥灯也亮了！排整齐就好数", "💡 大小和数字一起看，数得更快"],
    },
    mess: {
      emoji: "🌪️", title: "堆成了一座小山……", coins: "🪙🪙🪙💥", good: false,
      lines: ["🌑 桥灯没有亮……", "😵 混在一起，数着数着就乱了 —— 再选一次试试？"],
    },
  };

  var EXPLORE_CARDS = [
    { key: "values", emoji: "🪙", en: "Coins have different values.", zh: "每枚硬币代表的数不一样", border: "#ffd766" },
    { key: "sort", emoji: "🗂️", en: "Sort first, then add.", zh: "先分类，再相加", border: "#6ee0c8" },
    { key: "combine", emoji: "🧩", en: "One price, many ways.", zh: "同一个价格有很多组合", border: "#b79aff" },
  ];

  var RL_ANSWERS = {
    pay5: ["💵", "对！一张 5 元刚刚好。"],
    combo: ["🪙", "对！2 + 2 + 1 也是 5 元 —— 你已经会组合硬币啦！"],
    ask: ["🙋", "也可以！下次试着自己算一算，你一定行。"],
  };

  var MISSION_OPTIONS = [
    ["🍬", "5 元以内"],
    ["📚", "5 到 20 元"],
    ["🧸", "20 元以上"],
    ["🔍", "还没去看"],
  ];

  var state = {
    stage: 0, maxStage: 0,
    choice: null,
    exploreOpen: null, exploreSeen: {},
    lampIndex: 0, total: 0, coins: [], gameMsg: null, gameFinished: false,
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
    var stageNames = [["📖", "故事"], ["🔭", "探索"], ["🎮", "游戏"], ["🌍", "生活"], ["🚀", "任务"], ["❓", "测验"]];
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

  // ---------- Bridge diorama (shared by the story intro and the game stage) ----------
  function bezierPoint(t) {
    var x0 = 58, y0 = 166, cx = 200, cy = 44, x1 = 342, y1 = 166;
    var x = Math.pow(1 - t, 2) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
    var y = Math.pow(1 - t, 2) * y0 + 2 * (1 - t) * t * cy + t * t * y1;
    var dx = 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx);
    var dy = 2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy);
    var len = Math.hypot(dx, dy) || 1;
    return { x: x, y: y, nx: -dy / len, ny: dx / len };
  }

  var BRIDGE_RIBS = (function () {
    var ribs = [];
    for (var i = 0; i < 20; i++) {
      var t = 0.07 + i * (0.86 / 19);
      var p = bezierPoint(t);
      var half = 7.5;
      ribs.push({
        x1: (p.x + p.nx * half).toFixed(1), y1: (p.y + p.ny * half).toFixed(1),
        x2: (p.x - p.nx * half).toFixed(1), y2: (p.y - p.ny * half).toFixed(1),
      });
    }
    return ribs;
  })();

  var STAR_TS = [0.2, 0.36, 0.5, 0.64, 0.8];

  var MIMI_HTML =
    '<div class="il-mimi">' +
    '<div style="position:absolute;top:14px;left:-4px;width:16px;height:20px;border-radius:50%;background:#5b3a86;transform:rotate(-25deg);"></div>' +
    '<div style="position:absolute;top:14px;right:-4px;width:16px;height:20px;border-radius:50%;background:#5b3a86;transform:rotate(25deg);"></div>' +
    '<div style="position:absolute;top:6px;left:9px;width:40px;height:34px;border-radius:50% 50% 45% 45%;background:#6a44b8;"></div>' +
    '<div style="position:absolute;top:14px;left:13px;width:32px;height:30px;border-radius:50%;background:#ffd9b3;"></div>' +
    '<div style="position:absolute;top:10px;left:13px;width:32px;height:14px;border-radius:50% 50% 0 0;background:#6a44b8;"></div>' +
    '<div style="position:absolute;top:27px;left:21px;width:4px;height:5px;border-radius:50%;background:#33224d;"></div>' +
    '<div style="position:absolute;top:27px;left:33px;width:4px;height:5px;border-radius:50%;background:#33224d;"></div>' +
    '<div style="position:absolute;top:32px;left:16px;width:6px;height:4px;border-radius:50%;background:#ff9eb0;opacity:.7;"></div>' +
    '<div style="position:absolute;top:32px;left:37px;width:6px;height:4px;border-radius:50%;background:#ff9eb0;opacity:.7;"></div>' +
    '<div style="position:absolute;top:44px;left:9px;width:40px;height:34px;background:#ff8fb0;clip-path:polygon(30% 0,70% 0,100% 100%,0 100%);border-radius:4px 4px 10px 10px;"></div>' +
    '<div style="position:absolute;top:44px;left:21px;width:16px;height:8px;background:#fff3f7;border-radius:0 0 8px 8px;"></div>' +
    '<div style="position:absolute;top:48px;left:1px;width:9px;height:22px;border-radius:5px;background:#ffd9b3;transform:rotate(12deg);"></div>' +
    '<div style="position:absolute;top:48px;right:1px;width:9px;height:22px;border-radius:5px;background:#ffd9b3;transform:rotate(-12deg);"></div>' +
    '<div style="position:absolute;top:76px;left:16px;width:9px;height:16px;border-radius:4px;background:#ffd9b3;"></div>' +
    '<div style="position:absolute;top:76px;left:32px;width:9px;height:16px;border-radius:4px;background:#ffd9b3;"></div>' +
    '<div style="position:absolute;top:88px;left:14px;width:13px;height:7px;border-radius:6px;background:#4a2e6b;"></div>' +
    '<div style="position:absolute;top:88px;left:30px;width:13px;height:7px;border-radius:6px;background:#4a2e6b;"></div>' +
    "</div>";

  function renderBridgeRibsSvg() {
    return BRIDGE_RIBS.map(function (rb) {
      return '<line x1="' + rb.x1 + '" y1="' + rb.y1 + '" x2="' + rb.x2 + '" y2="' + rb.y2 + '" stroke="#fff3df" stroke-width="3" stroke-linecap="round" opacity="0.85"/>';
    }).join("");
  }

  function renderLamps(lampIndex, gameFinished) {
    return TARGETS.map(function (t, i) {
      var lit = i < lampIndex;
      var current = i === lampIndex && !gameFinished;
      var headBg = lit ? "radial-gradient(circle, #fff3c4, #ffd766 70%)" : "#4a4468";
      var headBorder = lit ? "2px solid #fff3cf" : "2px solid #6a638f";
      var headShadow = lit ? "0 0 16px 5px rgba(255,215,102,.65)" : "none";
      var scale = current ? "scale(1.15)" : "none";
      var dotBg = lit ? "#fff" : "#7a7398";
      return (
        '<div style="display:flex;flex-direction:column;align-items:center;">' +
        '<div style="width:20px;height:24px;border-radius:6px 6px 11px 11px;background:' + headBg + ";border:" + headBorder + ";box-shadow:" + headShadow + ';display:flex;align-items:center;justify-content:center;transform:' + scale + ';transition:all .3s;">' +
        '<div style="width:7px;height:7px;border-radius:50%;background:' + dotBg + ';"></div>' +
        "</div>" +
        '<div style="width:5px;height:30px;background:linear-gradient(180deg,#a97638,#5c3a12);border-radius:2px;"></div>' +
        '<div style="width:16px;height:5px;background:#4a2e0e;border-radius:3px;margin-top:-1px;"></div>' +
        "</div>"
      );
    }).join("");
  }

  function renderStars(lampIndex) {
    return STAR_TS.map(function (t, i) {
      var p = bezierPoint(t);
      var left = (p.x / 400 * 100).toFixed(2);
      var top = ((p.y - 20) / 200 * 100).toFixed(2);
      var lit = i < lampIndex;
      return (
        '<div style="position:absolute;left:' + left + "%;top:" + top + '%;width:26px;height:26px;border-radius:50%;transform:translate(-50%,-50%);' +
        "background:radial-gradient(circle at 35% 30%, #ffe08a, #f5a623 75%);border:2px solid #fff3cf;display:flex;align-items:center;justify-content:center;" +
        'font-size:13px;color:#8a5400;font-weight:800;opacity:' + (lit ? 1 : 0) + ";" + (lit ? "animation:pop-in .5s ease;" : "") + '">★</div>'
      );
    }).join("");
  }

  function renderBridgeScene(lampIndex, gameFinished, heightPx) {
    return (
      '<div class="il-bridge-scene" style="height:' + heightPx + 'px;">' +
      '<div class="il-bridge-water"></div>' +
      '<div class="il-bridge-bank-near"></div>' +
      '<div class="il-bridge-bank-far"></div>' +
      '<svg viewBox="0 0 400 200" style="position:absolute;inset:0;width:100%;height:100%;">' +
      '<path d="M58,166 Q200,44 342,166" stroke="#f0813f" stroke-width="17" fill="none" stroke-linecap="round"/>' +
      '<path d="M58,166 Q200,44 342,166" stroke="#ffe2c4" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.55" transform="translate(0,-5)"/>' +
      renderBridgeRibsSvg() +
      "</svg>" +
      renderStars(lampIndex) +
      '<div style="position:absolute;right:14px;bottom:22px;display:flex;align-items:flex-end;gap:12px;">' + renderLamps(lampIndex, gameFinished) + "</div>" +
      MIMI_HTML +
      "</div>"
    );
  }

  // ---------- Stage 1: Story ----------
  function renderStory() {
    var html = '<div class="il-card"><div class="il-card-head">' +
      '<span class="il-avatar">👧</span>' +
      '<div><div class="il-card-title">米米和会排队的硬币</div><div class="il-card-sub">Story · 点一点，帮硬币排队</div></div>' +
      '<span class="il-money-pill">🌉 桥灯</span>' +
      "</div>";

    html += renderBridgeScene(0, false, 200);

    if (!state.choice) {
      html += '<p class="il-copy">硬币岛的桥，要用<b>排好队的星星币</b>才能点亮。米米面前有一大堆硬币…… <b>该怎么排？你来帮她选！</b></p>' +
        '<div class="il-coin-pile">' +
        '<span class="il-pile-coin" style="width:34px;height:34px;font-size:11px;color:#7a5200;transform:rotate(-10deg);background:radial-gradient(circle at 35% 30%,#ffe9b0,#d9a53e 75%);border-color:#f3d787;">5毛</span>' +
        '<span class="il-pile-coin" style="width:44px;height:44px;font-size:13px;color:#4a5570;transform:rotate(6deg);background:radial-gradient(circle at 35% 30%,#eef1f8,#a9b2c8 75%);border-color:#d8dee9;">1元</span>' +
        '<span class="il-pile-coin" style="width:34px;height:34px;font-size:11px;color:#7a5200;transform:rotate(14deg);background:radial-gradient(circle at 35% 30%,#ffe9b0,#d9a53e 75%);border-color:#f3d787;">5毛</span>' +
        '<span class="il-pile-coin" style="width:50px;height:50px;font-size:14px;color:#6b4a00;transform:rotate(-6deg);background:radial-gradient(circle at 35% 30%,#ffe08a,#f0a93a 75%);border-color:#ffe9b8;">2元</span>' +
        '<span class="il-pile-coin" style="width:44px;height:44px;font-size:13px;color:#4a5570;transform:rotate(-14deg);background:radial-gradient(circle at 35% 30%,#eef1f8,#a9b2c8 75%);border-color:#d8dee9;">1元</span>' +
        '<span class="il-pile-coin" style="width:58px;height:58px;font-size:16px;color:#6b4a00;transform:rotate(4deg);background:radial-gradient(circle at 35% 30%,#ffdf7e,#e89b18 75%);border-color:#ffe9b8;border-width:3px;">5元</span>' +
        "</div>" +
        '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn il-border-teal" data-choice="sort"><span class="il-choice-emoji">🗂️</span><span class="il-choice-label" style="color:#0d6b54;">按数字分类排</span></button>' +
        '<button type="button" class="il-choice-btn il-border-blue" data-choice="size"><span class="il-choice-emoji">📏</span><span class="il-choice-label" style="color:#1c5aa1;">按大小排</span></button>' +
        '<button type="button" class="il-choice-btn il-border-coral" data-choice="mess"><span class="il-choice-emoji">🌪️</span><span class="il-choice-label" style="color:#a14a1c;">随便堆一堆</span></button>' +
        "</div>";
    } else {
      var oc = STORY_OUTCOMES[state.choice];
      html += '<div class="il-outcome"><div class="il-outcome-emoji">' + oc.emoji + '</div><div class="il-outcome-title">' + oc.title + '</div>' +
        '<div class="il-outcome-coins">' + oc.coins + "</div></div>" +
        '<div class="il-outcome-lines">' +
        oc.lines.map(function (text) {
          return '<div class="il-outcome-line il-line-' + (oc.good ? "good" : "bad") + '">' + text + "</div>";
        }).join("") +
        "</div>" +
        '<div class="il-tip">💡 先分类，再相加，数钱会更清楚。</div>' +
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

  function renderExplore() {
    var seenCount = Object.keys(state.exploreSeen).length;
    var html = '<div class="il-explore-head"><div class="il-h2">🔭 今天我们发现了什么？</div><div class="il-sub">点开每张卡片看看</div></div>';
    html += '<div class="il-explore-grid">';
    EXPLORE_CARDS.forEach(function (c) {
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

    if (state.exploreOpen === "values") {
      html += '<div class="il-card il-reveal"><div class="il-values-row">' +
        '<div><div style="font-size:34px;">🪙</div><div class="il-values-label">1 元</div></div>' +
        '<div><div style="font-size:44px;">🪙</div><div class="il-values-label">2 元</div></div>' +
        '<div><div style="font-size:56px;">🪙</div><div class="il-values-label">5 元</div></div>' +
        '</div><div class="il-reveal-text">硬币不是只看几枚，每枚代表的数不一样。</div></div>';
    } else if (state.exploreOpen === "sort") {
      html += '<div class="il-card il-reveal"><div class="il-reveal-row">' +
        '<span class="il-reveal-text-inline" style="font-size:30px;">🪙🪙🪙🪙🪙</span><span class="il-reveal-arrow">→</span>' +
        '<span class="il-reveal-text-inline" style="font-size:30px;">🪙🪙 ｜ 🪙🪙🪙</span>' +
        '</div><div class="il-reveal-text">先分类，再相加，一下就数清楚了。</div></div>';
    } else if (state.exploreOpen === "combine") {
      html += '<div class="il-card il-reveal"><div class="il-limited-value">5 元</div>' +
        '<div class="il-combine-lines">' +
        '<span>= 5</span><span>= 2 + 2 + 1</span><span>= 1 + 1 + 1 + 1 + 1</span>' +
        '</div><div class="il-reveal-text">同一个价格，可以有很多种组合。</div></div>';
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

  // ---------- Stage 3: Game (Bridge Lights) ----------
  function addCoin(v) {
    if (state.gameFinished) return;
    var total = state.total + v;
    var target = TARGETS[state.lampIndex];
    var coins = state.coins.concat([v]);
    if (total === target) {
      var nextIndex = state.lampIndex + 1;
      if (nextIndex >= TARGETS.length) {
        state.total = 0;
        state.coins = [];
        state.lampIndex = nextIndex;
        state.gameFinished = true;
        state.gameMsg = null;
        renderGame();
      } else {
        state.total = 0;
        state.coins = [];
        state.lampIndex = nextIndex;
        state.gameMsg = { kind: "ok", text: "✨ 亮了！刚刚好！" };
        renderGame();
        window.setTimeout(function () {
          if (state.gameMsg && state.gameMsg.kind === "ok") {
            state.gameMsg = null;
            renderGame();
          }
        }, 1200);
      }
    } else if (total > target) {
      state.total = 0;
      state.coins = [];
      state.gameMsg = { kind: "over", text: "💥 超过啦！硬币都退回来了，再试一次～" };
      renderGame();
      window.setTimeout(function () {
        if (state.gameMsg && state.gameMsg.kind === "over") {
          state.gameMsg = null;
          renderGame();
        }
      }, 1500);
    } else {
      state.total = total;
      state.coins = coins;
      renderGame();
    }
  }

  function renderGame() {
    var html = '<div class="il-explore-head"><div class="il-h2">🌉 点亮桥灯</div><div class="il-sub">用硬币凑出每盏灯需要的钱 —— 刚刚好，桥上就会出现一枚星星币！</div></div>';
    html += '<div class="il-bridge-panel">';
    html += renderBridgeScene(state.lampIndex, state.gameFinished, 210);

    if (!state.gameFinished) {
      var target = TARGETS[Math.min(state.lampIndex, TARGETS.length - 1)];
      var coinEmoji = { 1: "🪙", 2: "🪙", 5: "🪙" };
      var coinsRow = state.coins.length
        ? state.coins.map(function (v) { return coinEmoji[v] + v; }).join(" + ")
        : "（点下面的硬币投进去）";
      html += '<div class="il-game-target-text">' +
        '<div style="font-size:18px;font-weight:700;color:#e8e3ff;">这盏灯需要 <span class="il-target-num">' + target + '</span> 元</div>' +
        '<div style="font-size:15px;color:#b9b3ea;margin-top:4px;">已投入：<span class="il-total-num">' + state.total + '</span> 元</div>' +
        '<div style="min-height:40px;font-size:26px;letter-spacing:4px;margin-top:6px;">' + coinsRow + '</div>';
      if (state.gameMsg) {
        html += '<div class="il-game-msg il-msg-' + state.gameMsg.kind + '">' + state.gameMsg.text + "</div>";
      }
      html += "</div>";
      html += '<div class="il-coin-grid">' +
        '<button type="button" class="il-coin-btn" data-coin="1"><span class="il-coin-icon" style="width:38px;height:38px;background:radial-gradient(circle at 35% 30%,#eef1f8,#a9b2c8 75%);border:2px solid #d8dee9;color:#4a5570;font-size:13px;">1元</span><span class="il-coin-label">1 元</span></button>' +
        '<button type="button" class="il-coin-btn" data-coin="2"><span class="il-coin-icon" style="width:46px;height:46px;background:radial-gradient(circle at 35% 30%,#ffe08a,#f0a93a 75%);border:2px solid #ffe9b8;color:#6b4a00;font-size:14px;">2元</span><span class="il-coin-label">2 元</span></button>' +
        '<button type="button" class="il-coin-btn" data-coin="5"><span class="il-coin-icon" style="width:56px;height:56px;background:radial-gradient(circle at 35% 30%,#ffdf7e,#e89b18 75%);border:3px solid #ffe9b8;color:#6b4a00;font-size:16px;">5元</span><span class="il-coin-label">5 元</span></button>' +
        "</div>" +
        '<div class="il-actions il-center"><button type="button" class="il-clear-btn" id="il-clear-coins">🧹 倒出来重投</button></div>';
    } else {
      html += '<div class="il-rl-center">' +
        '<div class="il-done-emoji">🎉</div>' +
        '<div class="il-done-title">Great!</div>' +
        '<div class="il-done-sub">Coins can line up!</div>' +
        '<div class="il-done-score">五盏桥灯全部点亮，米米可以过桥啦！</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost" id="il-restart-game">🔁 再玩一次</button>' +
        '<button type="button" class="il-btn-primary" id="il-to-reallife">继续 →</button>' +
        "</div></div>";
    }
    html += "</div>";
    stageEl.innerHTML = html;

    if (!state.gameFinished) {
      var coinBtns = stageEl.querySelectorAll("[data-coin]");
      for (var i = 0; i < coinBtns.length; i++) {
        coinBtns[i].addEventListener("click", function (event) {
          addCoin(Number(event.currentTarget.getAttribute("data-coin")));
        });
      }
      document.getElementById("il-clear-coins").addEventListener("click", function () {
        state.total = 0;
        state.coins = [];
        state.gameMsg = null;
        renderGame();
      });
    } else {
      document.getElementById("il-restart-game").addEventListener("click", function () {
        state.lampIndex = 0;
        state.total = 0;
        state.coins = [];
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
      html += '<div class="il-rl-center"><div class="il-rl-emoji">🧴</div>' +
        '<div class="il-rl-question">买东西的时候，<br>你注意过价格标签吗？</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-rl-btn il-rl-yes" data-rl="go">看过！👀</button>' +
        '<button type="button" class="il-rl-btn il-rl-no" data-rl="go">还没注意过</button>' +
        "</div></div>";
    } else if (state.rlStep === 1) {
      html += '<div class="il-rl-center"><div class="il-rl-emoji">🧽</div>' +
        '<div class="il-rl-question">橡皮 5 元，你会怎么付？</div>' +
        '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn il-border-yellow" data-rl-answer="pay5"><span class="il-choice-emoji">💵</span><span class="il-choice-label" style="color:#6b4a00;">一张 5 元</span></button>' +
        '<button type="button" class="il-choice-btn il-border-teal" data-rl-answer="combo"><span class="il-choice-emoji">🪙🪙🪙</span><span class="il-choice-label" style="color:#0d6b54;">2 + 2 + 1</span></button>' +
        '<button type="button" class="il-choice-btn il-border-blue2" data-rl-answer="ask"><span class="il-choice-emoji">🙋</span><span class="il-choice-label" style="color:#5a44c9;">请大人帮我付</span></button>' +
        "</div></div>";
    } else {
      var a = RL_ANSWERS[state.rlAnswer];
      html += '<div class="il-rl-center"><div class="il-rl-emoji">' + a[0] + "</div>" +
        '<div class="il-rl-answer">' + a[1] + "</div>" +
        '<div class="il-rl-note">这不是考试，付钱的方法可以有很多种。</div>' +
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
    html += '<div class="il-mission-box"><div class="il-mission-row"><span class="il-mission-emoji">🏷️</span>' +
      '<div class="il-mission-text">今天去找一找，记下你看到的<br><span class="il-mission-quote">三种价格（做成你的"硬币排队表"）</span><br>回来以后，点一个答案：最贵的那个是多少？</div></div>';

    if (!state.missionSubmitted) {
      html += '<div class="il-mission-grid">' +
        MISSION_OPTIONS.map(function (opt, i) {
          return '<button type="button" class="il-mission-option" data-mission="' + i + '">' +
            '<span class="il-mission-option-emoji">' + opt[0] + '</span><span class="il-mission-option-label">' + opt[1] + "</span></button>";
        }).join("") +
        "</div>";
    } else {
      html += '<div class="il-mission-done">✅ 我看到最贵的价格：' + state.missionText + "</div>" +
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
      html += '<div class="il-quiz-complete"><div class="il-badge-orb">🎖️</div>' +
        '<div class="il-badge-title">硬币队长徽章 GET！</div>' +
        '<div class="il-badge-score">答对 ' + state.quizScore + ' / 5 题 · 第 2 关完成 🎉</div>' +
        '<div class="il-badge-note">今天你学会了：每枚硬币代表的数不一样、先分类再相加、同一个价格有很多组合。</div>' +
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
    state = {
      stage: 0, maxStage: 5, choice: null, exploreOpen: null, exploreSeen: {},
      lampIndex: 0, total: 0, coins: [], gameMsg: null, gameFinished: false,
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
