export const clientScript = `
(function () {
  var STORAGE_KEY = "mp_interactive_lesson_wants_needs";
  var DONE_KEY = "mp_lesson_done_lesson-wants-needs";

  var ITEMS = [
    { emoji: "💧", zh: "一杯水", cat: "need" },
    { emoji: "🍬", zh: "一颗糖果", cat: "want" },
    { emoji: "💊", zh: "生病吃的药", cat: "need" },
    { emoji: "🎮", zh: "游戏贴纸", cat: "want" },
    { emoji: "🎒", zh: "上学书包", cat: "need" },
    { emoji: "🍦", zh: "冰淇淋", cat: "want" },
    { emoji: "🥦", zh: "晚饭蔬菜", cat: "need" },
    { emoji: "🎈", zh: "彩色气球", cat: "want" },
  ];

  var QUIZ = [
    { q: "水和玩具车，哪个更像“需要”？", a: 0, opts: [["💧", "水"], ["🚗", "玩具车"], ["🤷", "都不是"]] },
    { q: "“想要”的东西一定不能买吗？", a: 1, opts: [["🚫", "一定不能买"], ["⏳", "可以排队等等再买"], ["💸", "立刻全部买下"]] },
    { q: "为什么要先分清需要和想要？", a: 0, opts: [["🧠", "钱花得更聪明"], ["🎨", "更好看"], ["🙈", "没有原因"]] },
  ];

  var STORY_OUTCOMES = {
    ask: {
      emoji: "🤔", title: "问“没有它行不行？”", good: true,
      lines: ["✨ 这就是分辨需要和想要最好的办法！", "🟢 不能没有 → 需要路　🟠 有更好、没有也行 → 想要路"],
    },
    price: {
      emoji: "💰", title: "只看价钱……", good: false,
      lines: ["🌑 贵不等于需要 —— 一颗贵糖果还是想要。", "😊 换个问法试试：没有它行不行？"],
    },
    whim: {
      emoji: "✨", title: "只看好不好玩……", good: false,
      lines: ["🌑 好玩的东西，大多是想要。", "😊 先问：没有它行不行？再决定走哪条路。"],
    },
  };

  var EXPLORE_CARDS = [
    { key: "need", emoji: "💧", en: "Needs keep us going.", zh: "需要 = 离不开的", border: "#6ee0c8" },
    { key: "want", emoji: "🎈", en: "Wants can wait.", zh: "想要 = 可以等一等", border: "#ffc14d" },
    { key: "change", emoji: "🌦️", en: "It can change.", zh: "答案会改变", border: "#b79aff" },
  ];

  var RL_ANSWERS = {
    need: ["🟢", "如果真的需要它，那当然可以。不过贴纸多半是“想要”哦～"],
    wait: ["⏳", "太棒了！先等一等，是最聪明的选择 —— 你已经会“排队”啦。"],
    want: ["🛍️", "全都买当然开心，但钱会很快用完。下次试着只选最喜欢的一版？"],
  };

  var MISSION_OPTIONS = [
    ["0️⃣", "0 样，都是需要"],
    ["1️⃣", "1 样"],
    ["2️⃣", "2 样"],
    ["3️⃣", "3 样以上"],
  ];

  var FIREFLY_POS = [
    { l: "16%", t: "30%" }, { l: "30%", t: "58%" }, { l: "44%", t: "26%" }, { l: "56%", t: "60%" },
    { l: "68%", t: "32%" }, { l: "80%", t: "56%" }, { l: "24%", t: "78%" }, { l: "72%", t: "78%" },
  ];

  var state = {
    stage: 0, maxStage: 0,
    choice: null,
    exploreOpen: null, exploreSeen: {},
    itemIndex: 0, needList: [], wantList: [], gameMsg: null, gameFinished: false,
    rlStep: 0, rlAnswer: null,
    missionText: "", missionSubmitted: false,
    quizIndex: 0, quizScore: 0, quizFeedback: null, quizFinished: false,
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
    var stageNames = [["📖", "故事"], ["🔭", "探索"], ["🌲", "游戏"], ["🌍", "生活"], ["🚀", "任务"], ["❓", "测验"]];
    stepsEl.innerHTML = stageNames.map(function (pair, i) {
      var icon = pair[0];
      var label = pair[1];
      var active = state.stage === i;
      var reachable = i <= state.maxStage;
      var cls = "il-step il-step-forest" + (active ? " is-active" : reachable ? " is-reachable" : " is-locked");
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

  var MIMI_INNER =
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
    '<div style="position:absolute;top:88px;left:30px;width:13px;height:7px;border-radius:6px;background:#4a2e6b;"></div>';

  // ---------- Stage 1: Story ----------
  function renderForkScene() {
    return (
      '<div class="il-fork-scene">' +
      '<div style="position:absolute;top:6px;left:10px;font-size:40px;opacity:.8;">🌲</div>' +
      '<div style="position:absolute;top:2px;left:44%;font-size:52px;opacity:.85;">🌳</div>' +
      '<div style="position:absolute;top:8px;right:12px;font-size:42px;opacity:.8;">🌲</div>' +
      '<svg viewBox="0 0 400 210" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%;">' +
      '<polygon points="203,120 185,128 44,52 54,42" fill="#2fa864" opacity="0.9"/>' +
      '<polygon points="199,120 186,126 50,50 56,44" fill="#bff3d0" opacity="0.5"/>' +
      '<polygon points="197,120 215,128 356,52 346,42" fill="#e6963a" opacity="0.9"/>' +
      '<polygon points="201,120 214,126 350,50 344,44" fill="#ffe0b0" opacity="0.5"/>' +
      '<polygon points="150,210 250,210 214,122 186,122" fill="#c9a86a"/>' +
      '<polygon points="150,210 250,210 214,122 186,122" fill="none" stroke="#e6cf9a" stroke-width="2" opacity="0.55"/>' +
      "</svg>" +
      '<div style="position:absolute;top:52px;left:14px;background:#2fa864;color:#073d1f;font-family:\\'ZCOOL KuaiLe\\', sans-serif;font-size:15px;padding:5px 11px;border-radius:8px;border:2px solid #bff3d0;box-shadow:0 4px 0 rgba(0,0,0,.25);">需要路 ↖</div>' +
      '<div style="position:absolute;top:52px;right:14px;background:#f5a623;color:#5c3a00;font-family:\\'ZCOOL KuaiLe\\', sans-serif;font-size:15px;padding:5px 11px;border-radius:8px;border:2px solid #ffe9b8;box-shadow:0 4px 0 rgba(0,0,0,.25);">↗ 想要路</div>' +
      '<div style="position:absolute;left:50%;bottom:8px;width:58px;height:92px;transform:translateX(-50%);animation:bounce-soft-il 3.5s ease-in-out infinite;">' +
      MIMI_INNER +
      "</div>" +
      '<div style="position:absolute;bottom:96px;left:50%;transform:translateX(-50%);font-size:28px;animation:wobble-il 2.5s ease-in-out infinite;">❓</div>' +
      "</div>"
    );
  }

  function renderStory() {
    var html = '<div class="il-card"><div class="il-card-head">' +
      '<span class="il-avatar">👧</span>' +
      '<div><div class="il-card-title">米米走进选择森林</div><div class="il-card-sub">Story · 帮米米想一想</div></div>' +
      '<span class="il-money-pill">🌲 岔路</span>' +
      "</div>";

    html += renderForkScene();

    if (!state.choice) {
      html += '<p class="il-copy">选择森林里有两条路：<b style="color:#1c7a3e;">需要路</b>和<b style="color:#c07800;">想要路</b>。米米捡到一样样东西，要送它们走对的路。<b>可她该用什么办法来分呢？你来帮她选！</b></p>' +
        '<div class="il-decor-row">💧🍬☂️🎮💊</div>' +
        '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn il-border-teal" data-choice="ask"><span class="il-choice-emoji">🤔</span><span class="il-choice-label" style="color:#0d6b54;">先问：<br>"没有它行不行？"</span></button>' +
        '<button type="button" class="il-choice-btn il-border-blue" data-choice="price"><span class="il-choice-emoji">💰</span><span class="il-choice-label" style="color:#1c5aa1;">看哪个<br>更贵</span></button>' +
        '<button type="button" class="il-choice-btn il-border-coral" data-choice="whim"><span class="il-choice-emoji">✨</span><span class="il-choice-label" style="color:#a14a1c;">看哪个<br>更好玩</span></button>' +
        "</div>";
    } else {
      var oc = STORY_OUTCOMES[state.choice];
      html += '<div class="il-outcome"><div class="il-outcome-emoji">' + oc.emoji + '</div><div class="il-outcome-title" style="color:#1c7a3e;">' + oc.title + "</div></div>" +
        '<div class="il-outcome-lines">' +
        oc.lines.map(function (text) {
          return '<div class="il-outcome-line il-line-' + (oc.good ? "good-forest" : "bad-forest") + '">' + text + "</div>";
        }).join("") +
        "</div>" +
        '<div class="il-tip il-tip-forest">💡 需要 = 离不开的；想要 = 让我开心、但可以等一等。</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost il-btn-ghost-forest" id="il-reset-choice">↩️ 再选一次</button>' +
        (oc.good ? '<button type="button" class="il-btn-primary il-btn-primary-forest" id="il-to-explore">继续 →</button>' : "") +
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
    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-forest">🔭 今天我们发现了什么？</div><div class="il-sub">点开每张卡片看看</div></div>';
    html += '<div class="il-explore-grid">';
    EXPLORE_CARDS.forEach(function (c) {
      var open = state.exploreOpen === c.key;
      var seen = !!state.exploreSeen[c.key];
      html += '<button type="button" class="il-explore-card il-explore-card-forest' + (open ? " is-open" : "") + '" data-open="' + c.key + '" style="border-color:' + c.border + "; box-shadow:0 " + (open ? "2px" : "6px") + "px 0 " + c.border + ';">' +
        '<span class="il-explore-emoji">' + c.emoji + "</span>" +
        '<span class="il-explore-zh-bold">' + c.zh + "</span>" +
        '<span class="il-explore-en-faded">' + c.en + "</span>" +
        '<span class="il-explore-check">' + (seen ? "✅ 看过了" : "👆 点我") + "</span>" +
        "</button>";
    });
    html += "</div>";

    if (state.exploreOpen === "need") {
      html += '<div class="il-card il-reveal il-reveal-forest"><div class="il-reveal-row">' +
        '<span class="il-reveal-emoji">💧</span><span class="il-reveal-emoji">🥦</span><span class="il-reveal-emoji">💊</span><span class="il-reveal-emoji">🎒</span>' +
        '</div><div class="il-reveal-text">需要，是生活、健康、学习离不开的东西。没有它会不方便，甚至不舒服。</div></div>';
    } else if (state.exploreOpen === "want") {
      html += '<div class="il-card il-reveal il-reveal-forest"><div class="il-reveal-row">' +
        '<span class="il-reveal-emoji">🍬</span><span class="il-reveal-emoji">🎮</span><span class="il-reveal-emoji">🎈</span><span class="il-reveal-emoji">🍦</span>' +
        '</div><div class="il-reveal-text">想要，会让我们开心。它不是坏事 —— 只是可以<b style="color:#c07800;">排队等一等</b>，先照顾好需要。</div></div>';
    } else if (state.exploreOpen === "change") {
      html += '<div class="il-card il-reveal il-reveal-forest">' +
        '<div class="il-reveal-row"><span class="il-reveal-text-inline" style="font-size:34px;">🌧️ ☂️</span><span class="il-reveal-arrow-forest">→ 需要</span></div>' +
        '<div class="il-reveal-row" style="margin-top:10px;"><span class="il-reveal-text-inline" style="font-size:34px;">☀️ ☂️</span><span class="il-reveal-arrow-forest il-arrow-want">→ 想要</span></div>' +
        '<div class="il-reveal-text">同一样东西，不同时间答案也会变。下雨天的雨伞是需要，晴天可能只是想要。</div></div>';
    }

    if (seenCount >= 3) {
      html += '<div class="il-actions il-center"><button type="button" class="il-btn-primary il-btn-primary-forest" id="il-to-game">开始游戏 →</button></div>';
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

  // ---------- Stage 3: Game (Forest Fork Sort) ----------
  function place(cat) {
    if (state.gameFinished) return;
    var item = ITEMS[state.itemIndex];
    if (cat === item.cat) {
      if (cat === "need") state.needList = state.needList.concat([item.emoji]);
      else state.wantList = state.wantList.concat([item.emoji]);
      var next = state.itemIndex + 1;
      var okMsg = cat === "need"
        ? { kind: "ok", text: "✅ 对！离不开它 —— 走需要路。" }
        : { kind: "ok", text: "✅ 对！很开心，但可以等 —— 走想要路。" };
      if (next >= ITEMS.length) {
        state.itemIndex = next;
        state.gameFinished = true;
        state.gameMsg = null;
        renderGame();
      } else {
        state.itemIndex = next;
        state.gameMsg = okMsg;
        renderGame();
        window.setTimeout(function () {
          if (state.gameMsg && state.gameMsg.kind === "ok") {
            state.gameMsg = null;
            renderGame();
          }
        }, 1200);
      }
    } else {
      state.gameMsg = { kind: "no", text: "🤔 再想想：没有它行不行？" };
      renderGame();
      window.setTimeout(function () {
        if (state.gameMsg && state.gameMsg.kind === "no") {
          state.gameMsg = null;
          renderGame();
        }
      }, 1400);
    }
  }

  function renderFireflies() {
    var litTotal = state.needList.length + state.wantList.length;
    return FIREFLY_POS.map(function (p, i) {
      var lit = i < litTotal;
      var style = "position:absolute;left:" + p.l + ";top:" + p.t + ";font-size:16px;color:" + (lit ? "#fff3a8" : "#3a6b48") + ";" +
        (lit ? "text-shadow:0 0 12px 4px rgba(255,240,140,.9),0 0 6px #ffe066;filter:drop-shadow(0 0 8px #ffe066);" : "") +
        "opacity:" + (lit ? 1 : 0.5) + ";" +
        (lit ? "animation:firefly-il " + (2 + (i % 3) * 0.4) + "s ease-in-out infinite;" : "");
      return '<div style="' + style + '">✦</div>';
    }).join("");
  }

  function renderGame() {
    var litTotal = state.needList.length + state.wantList.length;
    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-forest">🌲 森林分路口</div><div class="il-sub">每样东西送去对的路 —— 送对了，森林里就亮起一只萤火虫！</div></div>';
    html += '<div class="il-forest-panel">';
    html += '<div class="il-firefly-scene">' +
      '<div style="position:absolute;top:8px;left:12px;font-size:34px;opacity:.8;">🌲</div>' +
      '<div style="position:absolute;top:4px;left:40%;font-size:44px;opacity:.85;">🌳</div>' +
      '<div style="position:absolute;top:10px;right:14px;font-size:34px;opacity:.8;">🌲</div>' +
      renderFireflies() +
      '<div class="il-firefly-count">已点亮 ' + litTotal + ' / ' + ITEMS.length + ' 只萤火虫</div>' +
      "</div>";

    if (!state.gameFinished) {
      var cur = ITEMS[Math.min(state.itemIndex, ITEMS.length - 1)];
      html += '<div class="il-shelf-grid">' +
        '<div class="il-shelf il-shelf-need"><div class="il-shelf-title">🟢 需要路</div><div class="il-shelf-row">' + (state.needList.join(" ") || "…") + "</div></div>" +
        '<div class="il-shelf il-shelf-want"><div class="il-shelf-title">🟠 想要路</div><div class="il-shelf-row">' + (state.wantList.join(" ") || "…") + "</div></div>" +
        "</div>";
      html += '<div class="il-current-item">' +
        '<div class="il-current-caption">第 ' + (state.itemIndex + 1) + ' / ' + ITEMS.length + ' 样 —— 米米捡到了：</div>' +
        '<div class="il-current-emoji">' + cur.emoji + "</div>" +
        '<div class="il-current-zh">' + cur.zh + "</div>";
      if (state.gameMsg) {
        html += '<div class="il-game-msg ' + (state.gameMsg.kind === "ok" ? "il-msg-ok-forest" : "il-msg-no-forest") + '">' + state.gameMsg.text + "</div>";
      }
      html += "</div>";
      html += '<div class="il-path-grid">' +
        '<button type="button" class="il-path-btn il-path-need" data-cat="need"><span class="il-path-emoji">🟢</span><span class="il-path-label">需要路</span><span class="il-path-en">Need</span></button>' +
        '<button type="button" class="il-path-btn il-path-want" data-cat="want"><span class="il-path-emoji">🟠</span><span class="il-path-label">想要路</span><span class="il-path-en">Want</span></button>' +
        "</div>";
    } else {
      html += '<div class="il-rl-center">' +
        '<div class="il-done-emoji">🎉</div>' +
        '<div class="il-done-title" style="color:#bff3d0;">Great sorting!</div>' +
        '<div class="il-done-sub">Need or want — you got it!</div>' +
        '<div class="il-done-score" style="color:#d7f0d0;">整片森林都亮起来了，米米每样东西都走对了路！</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost" id="il-restart-game">🔁 再玩一次</button>' +
        '<button type="button" class="il-btn-primary il-btn-primary-forest" id="il-to-reallife">继续 →</button>' +
        "</div></div>";
    }
    html += "</div>";
    stageEl.innerHTML = html;

    if (!state.gameFinished) {
      var pathBtns = stageEl.querySelectorAll("[data-cat]");
      for (var i = 0; i < pathBtns.length; i++) {
        pathBtns[i].addEventListener("click", function (event) {
          place(event.currentTarget.getAttribute("data-cat"));
        });
      }
    } else {
      document.getElementById("il-restart-game").addEventListener("click", function () {
        state.itemIndex = 0;
        state.needList = [];
        state.wantList = [];
        state.gameMsg = null;
        state.gameFinished = false;
        renderGame();
      });
      document.getElementById("il-to-reallife").addEventListener("click", function () { goStage(3); });
    }
  }

  // ---------- Stage 4: Real Life ----------
  function renderRealLife() {
    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-forest">🌍 现实连接</div><div class="il-sub">不是考试，而是生活</div></div>';
    html += '<div class="il-card">';

    if (state.rlStep === 0) {
      html += '<div class="il-rl-center"><div class="il-rl-emoji">🛒</div>' +
        '<div class="il-rl-question">逛超市时，你有没有<br>突然很想买不在计划里的东西？</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-rl-btn il-rl-yes" data-rl="go">有过！🙋</button>' +
        '<button type="button" class="il-rl-btn il-rl-no-forest" data-rl="go">好像没有</button>' +
        "</div></div>";
    } else if (state.rlStep === 1) {
      html += '<div class="il-rl-center"><div class="il-rl-emoji">🌟</div>' +
        '<div class="il-rl-question">你已经有一大盒贴纸了，<br>又看到一版新贴纸。它是……</div>' +
        '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn il-border-teal" data-rl-answer="need"><span class="il-choice-emoji">🟢</span><span class="il-choice-label" style="color:#0d6b54;">需要，<br>马上买</span></button>' +
        '<button type="button" class="il-choice-btn il-border-yellow" data-rl-answer="wait"><span class="il-choice-emoji">⏳</span><span class="il-choice-label" style="color:#a35c00;">想要，<br>可以等一等</span></button>' +
        '<button type="button" class="il-choice-btn il-border-coral" data-rl-answer="want"><span class="il-choice-emoji">🛍️</span><span class="il-choice-label" style="color:#a14a1c;">想要，<br>全都要</span></button>' +
        "</div></div>";
    } else {
      var a = RL_ANSWERS[state.rlAnswer];
      html += '<div class="il-rl-center"><div class="il-rl-emoji">' + a[0] + "</div>" +
        '<div class="il-rl-answer">' + a[1] + "</div>" +
        '<div class="il-rl-note">没有标准答案 —— 想清楚"需不需要"就已经很棒了。</div>' +
        '<button type="button" class="il-btn-primary il-btn-primary-forest" id="il-to-mission">继续 →</button>' +
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
    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-forest">🚀 财商任务</div><div class="il-sub">这个任务要离开电脑才能完成哦</div></div>';
    html += '<div class="il-mission-box il-mission-box-forest"><div class="il-mission-row"><span class="il-mission-emoji">⏱️</span>' +
      '<div class="il-mission-text">和家人一起完成一次<br><span class="il-mission-quote il-mission-quote-forest">"需要 / 想要"三分钟分类挑战</span><br>把身边的东西快速分成两队。完成后，点一个答案：</div></div>' +
      '<div class="il-mission-sub">这次挑战里，你决定"排队等一等"的想要有几样？</div>';

    if (!state.missionSubmitted) {
      html += '<div class="il-mission-grid il-mission-grid-forest">' +
        MISSION_OPTIONS.map(function (opt, i) {
          return '<button type="button" class="il-mission-option il-mission-option-forest" data-mission="' + i + '">' +
            '<span class="il-mission-option-emoji">' + opt[0] + '</span><span class="il-mission-option-label">' + opt[1] + "</span></button>";
        }).join("") +
        "</div>";
    } else {
      html += '<div class="il-mission-done il-mission-done-forest">✅ 我决定先等一等的想要：' + state.missionText + "</div>" +
        '<div class="il-rl-center">' +
        '<div class="il-mission-complete" style="color:#1c7a3e;">Mission 完成！🎖️</div>' +
        '<button type="button" class="il-btn-primary il-btn-primary-forest" id="il-to-quiz">最后一关 →</button>' +
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
    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-forest">❓ 小测验</div><div class="il-sub">' +
      (state.quizFinished ? "全部完成！" : "第 " + (state.quizIndex + 1) + " / " + QUIZ.length + " 题 · 点图片作答") + "</div></div>";

    if (!state.quizFinished) {
      var q = QUIZ[Math.min(state.quizIndex, QUIZ.length - 1)];
      html += '<div class="il-card"><div class="il-quiz-q">' + q.q + '</div><div class="il-quiz-grid">' +
        q.opts.map(function (opt, i) {
          return '<button type="button" class="il-quiz-option il-quiz-option-forest' + (state.quizFeedback === "wrong" ? " il-shake" : "") + '" data-pick="' + i + '">' +
            '<span class="il-quiz-emoji">' + opt[0] + '</span><span class="il-quiz-label">' + opt[1] + "</span></button>";
        }).join("") +
        "</div>";
      if (state.quizFeedback) {
        html += '<div class="il-quiz-feedback ' + (state.quizFeedback === "correct" ? "is-correct" : "is-wrong") + '">' +
          (state.quizFeedback === "correct" ? "🎉 Correct！答对啦！" : "🤔 再想想～") + "</div>";
      }
      html += "</div>";
    } else {
      html += '<div class="il-quiz-complete il-quiz-complete-forest"><div class="il-badge-orb il-badge-orb-forest">🧭</div>' +
        '<div class="il-badge-title" style="color:#eafff0;">选择森林向导徽章 GET！</div>' +
        '<div class="il-badge-score" style="color:#d7f0d0;">答对 ' + state.quizScore + ' / ' + QUIZ.length + ' 题 · 第 3 关完成 🎉</div>' +
        '<div class="il-badge-note" style="color:#c3e6cf;">今天你学会了：需要是离不开的、想要可以排队等待、答案会随时间改变。</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost" id="il-restart-all">🔁 从头再玩一次</button>' +
        '<div class="il-next-teaser">🏙️ 下一关：预算城 Budget City · 即将开放，敬请期待！</div>' +
        "</div></div>";
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
    }
  }

  function restartAll() {
    state = {
      stage: 0, maxStage: 5, choice: null, exploreOpen: null, exploreSeen: {},
      itemIndex: 0, needList: [], wantList: [], gameMsg: null, gameFinished: false,
      rlStep: 0, rlAnswer: null, missionText: "", missionSubmitted: false,
      quizIndex: 0, quizScore: 0, quizFeedback: null, quizFinished: false,
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
