import {
  svgUri,
  dinoSvg,
  coinSvg,
  billSvg,
  cardSvg,
  chocoSvg,
  toySvg,
  candySvg,
  yoyoSvg,
  roadblockSvg,
  diamondSvg,
  sparkleSvg,
  cloudSvg,
  hillSvg,
  flagSvg,
} from "./assets.js";

const TEXTURES = {
  dinoRunA: { uri: svgUri(dinoSvg("a")), w: 84, h: 70 },
  dinoRunB: { uri: svgUri(dinoSvg("b")), w: 84, h: 70 },
  dinoJump: { uri: svgUri(dinoSvg("jump")), w: 84, h: 70 },
  coin: { uri: svgUri(coinSvg()), w: 34, h: 34 },
  bill: { uri: svgUri(billSvg()), w: 42, h: 27 },
  card: { uri: svgUri(cardSvg()), w: 42, h: 27 },
  choco: { uri: svgUri(chocoSvg()), w: 40, h: 35 },
  toy: { uri: svgUri(toySvg()), w: 40, h: 40 },
  candy: { uri: svgUri(candySvg()), w: 30, h: 43 },
  yoyo: { uri: svgUri(yoyoSvg()), w: 32, h: 32 },
  roadblock: { uri: svgUri(roadblockSvg()), w: 32, h: 58 },
  diamond: { uri: svgUri(diamondSvg()), w: 36, h: 36 },
  sparkle: { uri: svgUri(sparkleSvg()), w: 14, h: 14 },
  cloud: { uri: svgUri(cloudSvg()), w: 120, h: 67 },
  hill: { uri: svgUri(hillSvg()), w: 420, h: 226 },
  flag: { uri: svgUri(flagSvg()), w: 46, h: 69 },
};

const ITEM_TYPES = {
  coin: { texture: "coin", isMoney: true, value: 1 },
  bill: { texture: "bill", isMoney: true, value: 5 },
  card: { texture: "card", isMoney: true, value: 10 },
  choco: { texture: "choco", isMoney: false, penalty: 2, missText: "这不是钱哦，是巧克力！-2 金币 That's chocolate!" },
  toy: { texture: "toy", isMoney: false, penalty: 2, missText: "这不是钱哦，是玩具！-2 金币 That's a toy!" },
  candy: { texture: "candy", isMoney: false, penalty: 2, missText: "这不是钱哦，是糖果！-2 金币 That's candy!" },
  yoyo: { texture: "yoyo", isMoney: false, penalty: 2, missText: "这不是钱哦，是溜溜球！-2 金币 That's a yo-yo!" },
};

const ITEM_PATTERN = [
  "coin", "coin", "choco", "bill", "coin", "toy", "coin", "card",
  "candy", "coin", "bill", "coin", "choco", "card", "coin", "toy",
  "bill", "coin", "candy", "coin",
];

const ITEMS = ITEM_PATTERN.map((type, index) => ({ x: 220 + index * 95, ...ITEM_TYPES[type] }));

const OBSTACLES = [
  { type: "pit", x: 552 },
  { type: "block", x: 932 },
  { type: "pit", x: 1312 },
  { type: "block", x: 1692 },
];

const BONUS_COINS = [
  { x: 932, value: 15 },
  { x: 1787, value: 15 },
];

const SHOP_ITEMS = [
  { icon: "🧁", labelZh: "纸杯蛋糕", labelEn: "Cupcake", price: 5 },
  { icon: "📘", labelZh: "故事书", labelEn: "Storybook", price: 8 },
  { icon: "🪁", labelZh: "风筝", labelEn: "Kite", price: 10 },
  { icon: "🚗", labelZh: "玩具车", labelEn: "Toy Car", price: 15 },
  { icon: "🎨", labelZh: "画画套装", labelEn: "Paint Set", price: 20 },
];

export const clientScript = `
(function () {
  var TEXTURES = ${JSON.stringify(TEXTURES)};
  var ITEMS = ${JSON.stringify(ITEMS)};
  var OBSTACLES = ${JSON.stringify(OBSTACLES)};
  var BONUS_COINS = ${JSON.stringify(BONUS_COINS)};
  var SHOP_ITEMS = ${JSON.stringify(SHOP_ITEMS)};

  var WORLD_WIDTH = 2300;
  var FINISH_X = 2180;
  var VIEW_W = 800;
  var VIEW_H = 300;
  var GROUND_Y = 226;
  var SPEED = 230;
  var JUMP_VELOCITY = -660;
  var GRAVITY_Y = 1650;
  var PIT_HALF_WIDTH = 45;
  var STORAGE_BADGE = "mp_badge_treasure_hunt";

  var hudEl = document.getElementById("tch-hud");
  var stageWrapEl = document.getElementById("tch-stage-wrap");
  var controlsEl = document.getElementById("tch-controls");
  var hintEl = document.getElementById("tch-hint");
  var coinsEl = document.getElementById("tch-coins");
  var progressEl = document.getElementById("tch-progress");
  var toastEl = document.getElementById("tch-toast");
  var toastTimer = null;

  var shopPanel = document.getElementById("tch-shop");
  var shopCoinsEl = document.getElementById("tch-shop-coins");
  var shopItemsEl = document.getElementById("tch-shop-items");
  var walletEl = document.getElementById("tch-wallet");
  var finishBtn = document.getElementById("tch-finish");

  var resultPanel = document.getElementById("tch-result");
  var resultTitleEl = document.getElementById("tch-result-title");
  var resultTextEl = document.getElementById("tch-result-text");
  var retryBtn = document.getElementById("tch-retry");

  var leftBtn = document.getElementById("tch-left");
  var rightBtn = document.getElementById("tch-right");
  var jumpBtn = document.getElementById("tch-jump");

  var keys = { left: false, right: false };
  var coins = 0;
  var wallet = 0;
  var game = null;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function showToast(message, variant) {
    toastEl.textContent = message;
    toastEl.classList.remove("tch-toast-show", "tch-toast-good");
    void toastEl.offsetWidth;
    if (variant === "good") toastEl.classList.add("tch-toast-good");
    toastEl.classList.add("tch-toast-show");
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove("tch-toast-show");
    }, 1100);
  }

  function bumpCoins() {
    coinsEl.textContent = String(coins);
    coinsEl.classList.remove("tch-bump");
    void coinsEl.offsetWidth;
    coinsEl.classList.add("tch-bump");
  }

  function renderShopItems() {
    shopItemsEl.innerHTML = "";
    SHOP_ITEMS.forEach(function (shopItem, index) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tch-shop-item";
      btn.innerHTML =
        '<span class="tch-shop-icon">' + shopItem.icon + "</span>" +
        "<strong>" + shopItem.labelZh + "</strong>" +
        "<small>" + shopItem.labelEn + "</small>" +
        '<span class="tch-shop-price">' + shopItem.price + " 金币</span>" +
        '<span class="tch-shop-count" data-role="count"></span>';
      btn.dataset.index = String(index);
      btn.dataset.count = "0";
      btn.addEventListener("click", function () {
        if (wallet < shopItem.price) return;
        wallet -= shopItem.price;
        btn.dataset.count = String(Number(btn.dataset.count) + 1);
        updateShopButtons();
      });
      shopItemsEl.appendChild(btn);
    });
    updateShopButtons();
  }

  function updateShopButtons() {
    walletEl.textContent = String(wallet);
    var buttons = shopItemsEl.querySelectorAll(".tch-shop-item");
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      var index = Number(btn.dataset.index);
      var price = SHOP_ITEMS[index].price;
      var count = Number(btn.dataset.count);
      var countEl = btn.querySelector('[data-role="count"]');
      countEl.textContent = count > 0 ? "已买 x" + count : "";
      btn.disabled = wallet < price;
    }
  }

  function finishShopping() {
    shopPanel.hidden = true;
    if (wallet <= 0) {
      resultTitleEl.textContent = "任务失败 Mission Failed";
      resultTextEl.textContent = "金币全部花光啦！下次试着留一点点金币吧，再试一次。";
    } else {
      resultTitleEl.textContent = "存钱小达人 Smart Saver";
      resultTextEl.textContent = "你存下了 " + wallet + " 枚金币，获得「存钱小达人」徽章！";
      window.localStorage.setItem(STORAGE_BADGE, "1");
    }
    resultPanel.hidden = false;
  }

  function finishRun() {
    wallet = coins;
    stageWrapEl.hidden = true;
    hudEl.hidden = true;
    controlsEl.hidden = true;
    hintEl.hidden = true;
    shopCoinsEl.textContent = String(coins);
    renderShopItems();
    shopPanel.hidden = false;
  }

  function bindHold(el, onFlag) {
    var setTrue = function (event) {
      event.preventDefault();
      onFlag(true);
    };
    var setFalse = function () {
      onFlag(false);
    };
    el.addEventListener("mousedown", setTrue);
    el.addEventListener("touchstart", setTrue, { passive: false });
    el.addEventListener("mouseup", setFalse);
    el.addEventListener("mouseleave", setFalse);
    el.addEventListener("touchend", setFalse);
    el.addEventListener("touchcancel", setFalse);
  }
  bindHold(leftBtn, function (value) { keys.left = value; });
  bindHold(rightBtn, function (value) { keys.right = value; });

  function preload() {
    var self = this;
    Object.keys(TEXTURES).forEach(function (key) {
      var t = TEXTURES[key];
      self.load.svg(key, t.uri, { width: t.w, height: t.h });
    });
  }

  function buildGround(scene) {
    var pitRanges = OBSTACLES.filter(function (o) { return o.type === "pit"; })
      .map(function (o) { return [o.x - PIT_HALF_WIDTH, o.x + PIT_HALF_WIDTH]; })
      .sort(function (a, b) { return a[0] - b[0]; });

    var segments = [];
    var cursor = 0;
    pitRanges.forEach(function (range) {
      segments.push([cursor, range[0]]);
      cursor = range[1];
    });
    segments.push([cursor, WORLD_WIDTH]);

    var groundGroup = scene.physics.add.staticGroup();
    var graphics = scene.add.graphics();
    segments.forEach(function (seg) {
      var width = seg[1] - seg[0];
      if (width <= 0) return;
      graphics.fillStyle(0xffd873, 1);
      graphics.fillRect(seg[0], GROUND_Y, width, 6);
      graphics.fillStyle(0x241a4e, 1);
      graphics.fillRect(seg[0], GROUND_Y + 6, width, VIEW_H - GROUND_Y - 6);

      var rect = scene.add.rectangle(seg[0] + width / 2, GROUND_Y + 35, width, 70, 0x000000, 0);
      scene.physics.add.existing(rect, true);
      groundGroup.add(rect);
    });
    return groundGroup;
  }

  function buildBackground(scene) {
    var sky = scene.add.graphics().setScrollFactor(0.02);
    sky.fillGradientStyle(0x12143a, 0x12143a, 0x2a2f6e, 0x2a2f6e, 1);
    sky.fillRect(-200, 0, WORLD_WIDTH + 400, VIEW_H);
    for (var h = 0; h < WORLD_WIDTH; h += 380) {
      scene.add.image(h + 190, GROUND_Y + 40, "hill").setScrollFactor(0.35).setDepth(-2).setTint(0x4a4a8a).setAlpha(0.6);
    }
    for (var c = 0; c < WORLD_WIDTH; c += 260) {
      scene.add.image(c + 100, 60 + ((c / 260) % 3) * 30, "cloud").setScrollFactor(0.15).setDepth(-3).setTint(0xd9d6f0).setAlpha(0.45);
    }
  }

  function spawnMoneyItem(scene, groups, item) {
    var y = GROUND_Y - 18;
    var sprite = scene.add.image(item.x, y, item.texture);
    scene.tweens.add({ targets: sprite, y: y - 6, duration: 900, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    var zone = scene.add.zone(item.x, GROUND_Y - 70, 30, 150);
    scene.physics.add.existing(zone, true);
    zone.setData("kind", "money");
    zone.setData("item", item);
    zone.setData("sprite", sprite);
    groups.money.add(zone);
  }

  function spawnHazardItem(scene, groups, item) {
    var y = GROUND_Y - 20;
    var sprite = scene.add.image(item.x, y, item.texture);
    var zone = scene.add.zone(item.x, GROUND_Y - 18, 30, 40);
    scene.physics.add.existing(zone, true);
    zone.setData("kind", "hazard");
    zone.setData("item", item);
    zone.setData("sprite", sprite);
    groups.hazard.add(zone);
  }

  function spawnBonusCoin(scene, groups, coin) {
    var y = GROUND_Y - 95;
    var sprite = scene.add.image(coin.x, y, "diamond");
    scene.tweens.add({ targets: sprite, angle: { from: -8, to: 8 }, duration: 700, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    var zone = scene.add.zone(coin.x, y, 34, 60);
    scene.physics.add.existing(zone, true);
    zone.setData("kind", "bonus");
    zone.setData("item", coin);
    zone.setData("sprite", sprite);
    groups.bonus.add(zone);
  }

  function spawnRoadblocks(scene) {
    var group = scene.physics.add.staticGroup();
    OBSTACLES.filter(function (o) { return o.type === "block"; }).forEach(function (o) {
      var sprite = group.create(o.x, GROUND_Y - 29, "roadblock");
      sprite.refreshBody();
    });
    return group;
  }

  function floatingText(scene, x, y, text, color) {
    var label = scene.add.text(x, y, text, {
      fontFamily: "Arial, sans-serif",
      fontSize: "20px",
      fontStyle: "900",
      color: color,
    }).setOrigin(0.5);
    scene.tweens.add({
      targets: label,
      y: y - 40,
      alpha: 0,
      duration: 700,
      ease: "Cubic.easeOut",
      onComplete: function () { label.destroy(); },
    });
  }

  function startGame() {
    coins = 0;
    wallet = 0;
    keys.left = false;
    keys.right = false;
    coinsEl.textContent = "0";
    progressEl.textContent = "0%";
    resultPanel.hidden = true;
    shopPanel.hidden = true;
    stageWrapEl.hidden = false;
    hudEl.hidden = false;
    controlsEl.hidden = false;
    hintEl.hidden = false;

    if (game) {
      game.destroy(true);
      game = null;
    }

    var player;
    var groundGroup;
    var roadblockGroup;
    var groups = { money: null, hazard: null, bonus: null };
    var runFrame = 0;
    var runTimerMs = 0;
    var invulnerableUntil = 0;
    var finished = false;
    var jumpQueued = false;

    function requestJump() {
      jumpQueued = true;
    }

    function create() {
      var scene = this;
      scene.physics.world.setBounds(0, 0, WORLD_WIDTH, VIEW_H);
      scene.cameras.main.setBounds(0, 0, WORLD_WIDTH, VIEW_H);

      buildBackground(scene);
      groundGroup = buildGround(scene);
      roadblockGroup = spawnRoadblocks(scene);

      groups.money = scene.add.group();
      groups.hazard = scene.add.group();
      groups.bonus = scene.add.group();
      ITEMS.forEach(function (item) {
        if (item.isMoney) spawnMoneyItem(scene, groups, item);
        else spawnHazardItem(scene, groups, item);
      });
      BONUS_COINS.forEach(function (coin) { spawnBonusCoin(scene, groups, coin); });

      scene.add.image(FINISH_X, GROUND_Y - 34, "flag");

      player = scene.physics.add.sprite(60, GROUND_Y - 40, "dinoRunA");
      player.setCollideWorldBounds(true);
      player.body.setGravityY(GRAVITY_Y);
      player.body.setSize(60, 56).setOffset(12, 12);

      scene.physics.add.collider(player, groundGroup);
      scene.physics.add.collider(player, roadblockGroup, function () {
        if (scene.time.now < invulnerableUntil) return;
        invulnerableUntil = scene.time.now + 700;
        player.x = clamp(player.x - 60, 30, WORLD_WIDTH - 30);
        player.setVelocityX(0);
        showToast("撞到路障啦，退后一点！Bumped a roadblock!");
      });

      scene.physics.add.overlap(player, groups.money, function (p, zone) {
        if (zone.getData("done")) return;
        zone.setData("done", true);
        var item = zone.getData("item");
        var sprite = zone.getData("sprite");
        coins += item.value;
        bumpCoins();
        floatingText(scene, zone.x, zone.y - 40, "+" + item.value, "#237aa3");
        sprite.destroy();
        zone.destroy();
      });

      scene.physics.add.overlap(player, groups.hazard, function (p, zone) {
        if (zone.getData("done")) return;
        zone.setData("done", true);
        var item = zone.getData("item");
        var sprite = zone.getData("sprite");
        coins = Math.max(0, coins - item.penalty);
        bumpCoins();
        showToast(item.missText);
        floatingText(scene, zone.x, zone.y - 30, "-" + item.penalty, "#e0654a");
        sprite.destroy();
        zone.destroy();
      });

      scene.physics.add.overlap(player, groups.bonus, function (p, zone) {
        if (zone.getData("done")) return;
        zone.setData("done", true);
        var coin = zone.getData("item");
        var sprite = zone.getData("sprite");
        coins += coin.value;
        bumpCoins();
        showToast("完美一跳！+" + coin.value + " 金币 Perfect jump!", "good");
        var emitter = scene.add.particles(zone.x, zone.y, "sparkle", {
          speed: { min: 60, max: 140 },
          lifespan: 420,
          scale: { start: 1, end: 0 },
          quantity: 10,
          emitting: false,
        });
        emitter.explode(10);
        sprite.destroy();
        zone.destroy();
      });

      scene.cameras.main.startFollow(player, true, 0.12, 0);

      scene.input.keyboard.on("keydown-LEFT", function () { keys.left = true; });
      scene.input.keyboard.on("keyup-LEFT", function () { keys.left = false; });
      scene.input.keyboard.on("keydown-RIGHT", function () { keys.right = true; });
      scene.input.keyboard.on("keyup-RIGHT", function () { keys.right = false; });
      scene.input.keyboard.on("keydown-SPACE", requestJump);
      scene.input.keyboard.on("keydown-UP", requestJump);

      var jumpHandler = function (event) {
        event.preventDefault();
        requestJump();
      };
      jumpBtn.addEventListener("mousedown", jumpHandler);
      jumpBtn.addEventListener("touchstart", jumpHandler, { passive: false });
      scene.events.once("shutdown", function () {
        jumpBtn.removeEventListener("mousedown", jumpHandler);
        jumpBtn.removeEventListener("touchstart", jumpHandler);
      });
    }

    function update(time, delta) {
      if (finished) return;
      var onGround = player.body.blocked.down || player.body.touching.down;
      var moving = false;

      if (keys.left) {
        player.setVelocityX(-SPEED);
        player.setFlipX(true);
        moving = true;
      } else if (keys.right) {
        player.setVelocityX(SPEED);
        player.setFlipX(false);
        moving = true;
      } else {
        player.setVelocityX(0);
      }

      if (jumpQueued) {
        jumpQueued = false;
        if (onGround) player.setVelocityY(JUMP_VELOCITY);
      }

      if (!onGround) {
        player.setTexture("dinoJump");
      } else if (moving) {
        runTimerMs += delta;
        if (runTimerMs > 140) {
          runTimerMs = 0;
          runFrame = runFrame === 0 ? 1 : 0;
        }
        player.setTexture(runFrame === 0 ? "dinoRunA" : "dinoRunB");
      } else {
        player.setTexture("dinoRunA");
      }

      if (player.y > VIEW_H + 40 && this.time.now >= invulnerableUntil) {
        invulnerableUntil = this.time.now + 700;
        player.x = clamp(player.x - 70, 30, WORLD_WIDTH - 30);
        player.y = GROUND_Y - 60;
        player.setVelocity(0, 0);
        showToast("掉进坑里啦，退后一点！Fell into a pit!");
      }

      var progress = clamp(Math.round((player.x / FINISH_X) * 100), 0, 100);
      progressEl.textContent = progress + "%";

      if (!finished && player.x >= FINISH_X) {
        finished = true;
        finishRun();
      }
    }

    var config = {
      type: Phaser.AUTO,
      parent: "tch-phaser-root",
      width: VIEW_W,
      height: VIEW_H,
      transparent: true,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: "arcade",
        arcade: { gravity: { y: 0 }, debug: false },
      },
      scene: { preload: preload, create: create, update: update },
    };
    game = new Phaser.Game(config);
  }

  finishBtn.addEventListener("click", finishShopping);
  retryBtn.addEventListener("click", startGame);

  startGame();
})();
`;
