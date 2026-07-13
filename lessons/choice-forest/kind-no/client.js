export const clientScript = `
(function () {
  var STORAGE_KEY = "mp_interactive_lesson_kind_no";
  var DONE_KEY = "mp_lesson_done_lesson-kind-no";

  var SCENES = [
    { text: "🃏 朋友邀请你一起买闪光卡，可你在为一本书存钱。",
      open: ["谢谢你邀请我！", "谢谢你想到我～"],
      reason: ["我今天想把星星币留给我的计划。", "我正在为一本书存钱呢。"],
      close: ["下次有机会一起呀！", "祝你买到喜欢的～"] },
    { text: "🍿 同学买零食，喊你也来一份，可你不太想买。",
      open: ["谢谢你叫我！", "你真好，谢谢～"],
      reason: ["我今天不太想买零食。", "我想把钱留着做别的。"],
      close: ["你们吃得开心哦！", "改天我请你！"] },
  ];

  var QUIZ = [
    { q: "拒绝别人，一定很没礼貌吗？", a: 1, opts: [["😰", "是的，很没礼貌"], ["🌸", "不是，可以很礼貌"], ["🚫", "不能拒绝"]] },
    { q: "怎样说“不”会更温柔？", a: 0, opts: [["💛", "先谢谢，再说理由"], ["😠", "大声说不要"], ["🙈", "不理对方"]] },
    { q: "为什么计划能帮我们拒绝冲动？", a: 0, opts: [["🧭", "知道自己现在要做什么"], ["💤", "让人想睡觉"], ["🎲", "没有关系"]] },
  ];

  var OUTCOMES = {
    kind: { emoji: "🌸", title: "温柔地说“不”", good: true,
      lines: ["✨ 太棒了！先谢谢、再说理由 —— 朋友不会难过，你也守住了计划。", "💛 这就是温柔的拒绝：既照顾别人，也照顾自己。"] },
    rude: { emoji: "😠", title: "凶巴巴地拒绝……", good: false,
      lines: ["🌑 拒绝没有错，但语气太冲，朋友会难过。", "😊 试试先说“谢谢你”，再温柔说明理由。"] },
    cave: { emoji: "😞", title: "勉强答应了……", good: false,
      lines: ["🌑 放弃了自己的计划，心里其实有点委屈。", "😊 记住：你可以礼貌地说“不”，保护自己的计划。"] },
  };

  var CARD_DEFS = [
    { key: "ok", emoji: "🙂", en: "Saying no is ok.", zh: "拒绝也能有礼貌", border: "#8fdcc8" },
    { key: "recipe", emoji: "🌸", en: "Thanks + reason + next.", zh: "温柔拒绝配方", border: "#ffc14d" },
    { key: "plan", emoji: "🛡️", en: "Your plan is a shield.", zh: "计划是小盾牌", border: "#9fc6ff" },
  ];

  var RL_ANSWERS = {
    kind: ["🌸", "太棒了！谢谢 + 理由，朋友能理解，你也守住了自己的想法。"],
    rude: ["😠", "拒绝没错，但语气太冲会让人难过。加一句“谢谢”就好多了。"],
    cave: ["😶", "不好意思跟着买，钱就悄悄溜走了。练一句温柔的“不”，下次用得上！"],
  };

  var MISSION_OPTIONS = [
    ["🌸", "谢谢 + 理由 + 下次，全都用上"],
    ["💛", "谢谢 + 理由"],
    ["🧭", "只说了理由"],
    ["🤔", "还在想怎么说"],
  ];

  var state = {
    stage: 0, maxStage: 0,
    choice: null,
    exploreOpen: null, exploreSeen: {},
    sceneIndex: 0, sel: { open: null, reason: null, close: null }, gameFinished: false,
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
    var stageNames = [["📖", "故事"], ["🔭", "探索"], ["🌸", "游戏"], ["🌍", "生活"], ["🚀", "任务"], ["❓", "测验"]];
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
  function renderParkScene() {
    return (
      '<div class="il-fork-scene">' +
      '<div style="position:absolute;top:6px;left:12px;font-size:38px;opacity:.8;">🌲</div>' +
      '<div style="position:absolute;top:4px;right:14px;font-size:38px;opacity:.8;">🌲</div>' +
      '<div style="position:absolute;right:26px;bottom:14px;font-size:56px;">🧒</div>' +
      '<div style="position:absolute;right:70px;top:30px;background:#fff;color:#23402c;font-size:13px;font-weight:700;padding:8px 12px;border-radius:14px 14px 2px 14px;max-width:150px;box-shadow:0 3px 0 rgba(0,0,0,.15);">一起买闪光卡吧！✨</div>' +
      '<div style="position:absolute;left:22px;bottom:14px;width:58px;height:92px;animation:bounce-soft-il 3.5s ease-in-out infinite;">' +
      MIMI_INNER +
      "</div>" +
      '<div style="position:absolute;left:80px;bottom:14px;font-size:28px;">🐷</div>' +
      '<div style="position:absolute;left:18px;top:20px;background:#fff;color:#1c7a3e;font-size:13px;font-weight:700;padding:8px 12px;border-radius:14px 14px 14px 2px;max-width:150px;box-shadow:0 3px 0 rgba(0,0,0,.15);">我在存钱买书📖…怎么说呢？</div>' +
      "</div>"
    );
  }

  function renderStory() {
    var html = '<div class="il-card"><div class="il-card-head">' +
      '<span class="il-avatar">👧</span>' +
      '<div><div class="il-card-title">朋友邀请米米一起买</div><div class="il-card-sub">Story · 帮米米想一想</div></div>' +
      '<span class="il-money-pill">💬 邀请</span>' +
      "</div>";

    html += renderParkScene();

    if (!state.choice) {
      html += '<p class="il-copy">米米正在<b style="color:#1c7a3e;">为一本书存星星币</b>，可朋友邀请她一起买闪光卡。她想拒绝，又不想让朋友难过。<b>她该怎么回答？你来帮她选！</b></p>' +
        '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn il-border-teal" data-choice="kind"><span class="il-choice-emoji">🌸</span><span class="il-choice-label" style="color:#0d6b54;">“谢谢你！<br>我今天想留给我的计划～”</span></button>' +
        '<button type="button" class="il-choice-btn il-border-coral" data-choice="rude"><span class="il-choice-emoji">😠</span><span class="il-choice-label" style="color:#a14a1c;">“不要，<br>别烦我！”</span></button>' +
        '<button type="button" class="il-choice-btn il-border-blue" data-choice="cave"><span class="il-choice-emoji">😞</span><span class="il-choice-label" style="color:#1c5aa1;">勉强答应，<br>放弃自己的计划</span></button>' +
        "</div>";
    } else {
      var oc = OUTCOMES[state.choice];
      html += '<div class="il-outcome"><div class="il-outcome-emoji">' + oc.emoji + '</div><div class="il-outcome-title" style="color:#1c7a3e;">' + oc.title + "</div></div>" +
        '<div class="il-outcome-lines">' +
        oc.lines.map(function (text) {
          return '<div class="il-outcome-line il-line-' + (oc.good ? "good-forest" : "bad-forest") + '">' + text + "</div>";
        }).join("") +
        "</div>" +
        '<div class="il-tip il-tip-forest">💡 说“不”不代表不友好 —— 而是知道自己现在要做什么。</div>' +
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
    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-forest">🔭 温柔说“不”的三个秘密</div><div class="il-sub">点开每张卡片看看</div></div>';
    html += '<div class="il-explore-grid">';
    CARD_DEFS.forEach(function (c) {
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

    if (state.exploreOpen === "ok") {
      html += '<div class="il-card il-reveal il-reveal-forest"><div style="font-size:46px;">🙂</div>' +
        '<div class="il-outcome-title" style="margin:6px 0;color:#1c7a3e;">拒绝也能有礼貌</div>' +
        '<div class="il-reveal-text">拒绝别人，不代表没礼貌。<b>怎么说</b>比<b>说不说</b>更重要 —— 温柔一点，大家都舒服。</div></div>';
    } else if (state.exploreOpen === "recipe") {
      html += '<div class="il-card il-reveal il-reveal-forest">' +
        '<div class="il-outcome-title" style="margin-bottom:12px;color:#c07800;">温柔拒绝配方</div>' +
        '<div style="display:flex;flex-direction:column;gap:8px;max-width:420px;margin:0 auto;text-align:left;">' +
        '<div style="background:#e8f8ee;border-radius:12px;padding:10px 14px;font-size:15px;font-weight:700;">1️⃣ 先谢谢 —— “谢谢你邀请我！”</div>' +
        '<div style="background:#fff7e4;border-radius:12px;padding:10px 14px;font-size:15px;font-weight:700;">2️⃣ 说理由 —— “我今天想留给我的计划。”</div>' +
        '<div style="background:#e4eeff;border-radius:12px;padding:10px 14px;font-size:15px;font-weight:700;">3️⃣ 留温暖 —— “下次一起呀！”</div>' +
        "</div></div>";
    } else if (state.exploreOpen === "plan") {
      html += '<div class="il-card il-reveal il-reveal-forest"><div style="font-size:46px;">🛡️</div>' +
        '<div class="il-outcome-title" style="margin:6px 0;color:#1c5aa1;">计划是你的小盾牌</div>' +
        '<div class="il-reveal-text">当你心里有<b>计划</b>，就知道自己现在要做什么，一时冲动也拦不住你。</div></div>';
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

  // ---------- Stage 3: Game (Build a Kind No) ----------
  function pickChip(group, i) {
    state.sel = Object.assign({}, state.sel);
    state.sel[group] = i;
    renderGame();
  }

  function resetScene() {
    state.sel = { open: null, reason: null, close: null };
    renderGame();
  }

  function nextScene() {
    var isLast = state.sceneIndex >= SCENES.length - 1;
    if (isLast) {
      state.gameFinished = true;
    } else {
      state.sceneIndex += 1;
      state.sel = { open: null, reason: null, close: null };
    }
    renderGame();
  }

  function renderGame() {
    var html = '<div class="il-explore-head"><div class="il-h2 il-h2-forest">🌸 组装温柔回答</div><div class="il-sub">按 谢谢 → 理由 → 下次 的顺序，各选一句，拼出一句温柔的“不”</div></div>';
    html += '<div class="il-forest-panel">';

    if (!state.gameFinished) {
      var scene = SCENES[Math.min(state.sceneIndex, SCENES.length - 1)];
      html += '<div class="il-game-target-text" style="color:#d7f0d0;">第 ' + (state.sceneIndex + 1) + " / " + SCENES.length + " 个情境</div>";
      html += '<div style="background:rgba(0,0,0,.2);border-radius:14px;padding:12px 16px;text-align:center;font-size:15px;font-weight:700;color:#fff;margin-bottom:16px;">' + scene.text + "</div>";

      var sel = state.sel;
      var parts = [];
      if (sel.open !== null) parts.push(scene.open[sel.open]);
      if (sel.reason !== null) parts.push(scene.reason[sel.reason]);
      if (sel.close !== null) parts.push(scene.close[sel.close]);
      var bubbleText = parts.length ? parts.join(" ") : "点下面的句子，拼出你的回答…";

      html += '<div style="position:relative;background:#fff;color:#23402c;border-radius:18px;padding:18px 20px;min-height:58px;font-size:16px;line-height:1.7;font-weight:700;margin-bottom:6px;box-shadow:0 4px 0 rgba(0,0,0,.2);">' +
        '<span style="font-size:22px;margin-right:6px;">🗨️</span>' + bubbleText + "</div>";

      var groupDefs = [
        { key: "open", title: "1️⃣ 先谢谢" },
        { key: "reason", title: "2️⃣ 说理由" },
        { key: "close", title: "3️⃣ 留温暖" },
      ];
      html += '<div style="display:flex;flex-direction:column;gap:12px;margin-top:14px;">';
      groupDefs.forEach(function (g) {
        html += '<div><div style="font-family:\\'ZCOOL KuaiLe\\', sans-serif;font-size:14px;color:#bff3d0;margin-bottom:6px;">' + g.title + "</div>";
        html += '<div style="display:flex;flex-wrap:wrap;gap:8px;">';
        scene[g.key].forEach(function (text, i) {
          var on = sel[g.key] === i;
          var style = "font-family:'Noto Sans SC', sans-serif;font-size:13px;font-weight:700;padding:9px 14px;border-radius:999px;cursor:pointer;line-height:1.4;" +
            (on
              ? "background:#2fa864;color:#fff;border:2px solid #fff;box-shadow:0 2px 0 rgba(0,0,0,.25);transform:translateY(1px);"
              : "background:rgba(255,255,255,.92);color:#23402c;border:2px solid #2fa864;box-shadow:0 3px 0 #2fa864;");
          html += '<button type="button" data-group="' + g.key + '" data-idx="' + i + '" style="' + style + '">' + text + "</button>";
        });
        html += "</div></div>";
      });
      html += "</div>";

      var complete = sel.open !== null && sel.reason !== null && sel.close !== null;
      if (complete) {
        var isLast = state.sceneIndex >= SCENES.length - 1;
        html += '<div style="text-align:center;margin-top:18px;">' +
          '<div style="font-family:\\'ZCOOL KuaiLe\\', sans-serif;font-size:19px;color:#ffd766;letter-spacing:1px;">🌸 好温柔！朋友一定不会难过～</div>' +
          '<div class="il-actions">' +
          '<button type="button" class="il-btn-ghost" id="il-reset-scene">↩️ 重拼</button>' +
          '<button type="button" class="il-btn-primary il-btn-primary-forest" id="il-next-scene">' + (isLast ? "完成 ✓" : "下一个 →") + "</button>" +
          "</div></div>";
      }
    } else {
      html += '<div class="il-rl-center">' +
        '<div class="il-done-emoji">🌸</div>' +
        '<div class="il-done-title" style="color:#bff3d0;">Kind and clear!</div>' +
        '<div class="il-done-sub">你拼出了 ' + SCENES.length + ' 句温柔的“不”</div>' +
        '<div class="il-done-score" style="color:#d7f0d0;">既保护了计划，也照顾了朋友。</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost" id="il-restart-game">🔁 再玩一次</button>' +
        '<button type="button" class="il-btn-primary il-btn-primary-forest" id="il-to-reallife">继续 →</button>' +
        "</div></div>";
    }
    html += "</div>";
    stageEl.innerHTML = html;

    if (!state.gameFinished) {
      var chipBtns = stageEl.querySelectorAll("[data-group]");
      for (var i = 0; i < chipBtns.length; i++) {
        chipBtns[i].addEventListener("click", function (event) {
          pickChip(event.currentTarget.getAttribute("data-group"), Number(event.currentTarget.getAttribute("data-idx")));
        });
      }
      var resetBtn = document.getElementById("il-reset-scene");
      if (resetBtn) resetBtn.addEventListener("click", resetScene);
      var nextBtn = document.getElementById("il-next-scene");
      if (nextBtn) nextBtn.addEventListener("click", nextScene);
    } else {
      document.getElementById("il-restart-game").addEventListener("click", function () {
        state.sceneIndex = 0;
        state.sel = { open: null, reason: null, close: null };
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
      html += '<div class="il-rl-center"><div class="il-rl-emoji">🍿</div>' +
        '<div class="il-rl-question">同学买零食时邀你一起买，<br>你有过“不太想买、又不好意思拒绝”吗？</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-rl-btn il-rl-yes" data-rl="go">有过！🙋</button>' +
        '<button type="button" class="il-rl-btn il-rl-no-forest" data-rl="go">好像没有</button>' +
        "</div></div>";
    } else if (state.rlStep === 1) {
      html += '<div class="il-rl-center"><div class="il-rl-emoji">💬</div>' +
        '<div class="il-rl-question">这时候，你会怎么回应？</div>' +
        '<div class="il-choice-grid">' +
        '<button type="button" class="il-choice-btn il-border-teal" data-rl-answer="kind"><span class="il-choice-emoji">🌸</span><span class="il-choice-label" style="color:#0d6b54;">礼貌说明：<br>“谢谢，我今天不买啦～”</span></button>' +
        '<button type="button" class="il-choice-btn il-border-coral" data-rl-answer="rude"><span class="il-choice-emoji">😠</span><span class="il-choice-label" style="color:#a14a1c;">没好气地<br>说“不买！”</span></button>' +
        '<button type="button" class="il-choice-btn il-border-blue" data-rl-answer="cave"><span class="il-choice-emoji">😶</span><span class="il-choice-label" style="color:#1c5aa1;">不好意思，<br>只好跟着买</span></button>' +
        "</div></div>";
    } else {
      var a = RL_ANSWERS[state.rlAnswer];
      html += '<div class="il-rl-center"><div class="il-rl-emoji">' + a[0] + "</div>" +
        '<div class="il-rl-answer">' + a[1] + "</div>" +
        '<div class="il-rl-note">没有标准答案 —— 能温柔地说明理由，就已经很棒了。</div>' +
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
    html += '<div class="il-mission-box il-mission-box-forest"><div class="il-mission-row"><span class="il-mission-emoji">📝</span>' +
      '<div class="il-mission-text">写下一个你<br><span class="il-mission-quote il-mission-quote-forest">想保护的小计划</span><br>再准备一句温柔拒绝的话。完成后，点一个答案：</div></div>' +
      '<div style="font-size:15px;font-weight:700;margin-bottom:12px;">你准备好的那句温柔拒绝，用上了配方里的哪几步？</div>';

    if (!state.missionSubmitted) {
      html += '<div class="il-mission-grid il-mission-grid-forest">' +
        MISSION_OPTIONS.map(function (opt, i) {
          return '<button type="button" class="il-mission-option il-mission-option-forest" data-mission="' + i + '">' +
            '<span class="il-mission-option-emoji">' + opt[0] + '</span><span class="il-mission-option-label">' + opt[1] + "</span></button>";
        }).join("") +
        "</div>";
    } else {
      html += '<div class="il-mission-done il-mission-done-forest">✅ 我的温柔拒绝用上了：' + state.missionText + "</div>" +
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
      html += '<div class="il-quiz-complete il-quiz-complete-forest"><div class="il-badge-orb il-badge-orb-forest">🌸</div>' +
        '<div class="il-badge-title" style="color:#eafff0;">温柔选择徽章 GET！</div>' +
        '<div class="il-badge-score" style="color:#d7f0d0;">答对 ' + state.quizScore + ' / ' + QUIZ.length + ' 题 · 第 7 关完成 🎉</div>' +
        '<div class="il-badge-note" style="color:#c3e6cf;">今天你学会了：拒绝也能有礼貌、用“谢谢+理由+下次”温柔说不、计划帮你挡住冲动。</div>' +
        '<div class="il-actions">' +
        '<button type="button" class="il-btn-ghost" id="il-restart-all">🔁 从头再玩一次</button>' +
        (state.nextTeaser
          ? ""
          : '<button type="button" class="il-btn-gold" id="il-reveal-next">下一关 →</button>') +
        "</div>" +
        (state.nextTeaser
          ? '<div class="il-next-teaser"><a href="/lesson/lesson-budget-jars?level=beginner" style="color:#ffe9a8;">🏙️ 下一关：三只预算罐 Budget City →</a></div>'
          : "") +
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
      stage: 0, maxStage: 5, choice: null, exploreOpen: null, exploreSeen: {},
      sceneIndex: 0, sel: { open: null, reason: null, close: null }, gameFinished: false,
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
