import { clientScript } from "./client.js";

const PHASER_CDN_SRC = "https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js";

export function renderTreasureHuntBody(game, planet) {
  return `
    <section class="page-section compact-page game-page">
      <a class="back-link" href="/explore?level=beginner#${planet.id}">← 返回${planet.zh} Back to ${planet.name}</a>
      <div class="game-hero ${planet.color}">
        <p>${planet.zh} · ${planet.name}</p>
        <h1>${game.titleZh}</h1>
        <p class="english-note">${game.titleEn}</p>
        <p class="game-instructions">${game.instructions}</p>
      </div>

      <div class="tch-root" id="tch-root" data-game="${game.id}">
        <div class="tch-hud" id="tch-hud">
          <span>金币 Coins: <strong id="tch-coins">0</strong></span>
          <span>进度 Progress: <strong id="tch-progress">0%</strong></span>
        </div>

        <div class="tch-stage-wrap" id="tch-stage-wrap">
          <div class="tch-phaser-root" id="tch-phaser-root"></div>
          <div class="tch-toast" id="tch-toast"></div>
        </div>

        <div class="tch-controls" id="tch-controls">
          <button type="button" class="tch-btn" id="tch-left" aria-label="向左移动 Move left">◀</button>
          <button type="button" class="tch-btn tch-btn-jump" id="tch-jump" aria-label="跳跃 Jump">⬆</button>
          <button type="button" class="tch-btn" id="tch-right" aria-label="向右移动 Move right">▶</button>
        </div>
        <p class="tch-hint" id="tch-hint">用键盘←→移动，空格键或↑跳跃（也可以点上面的按钮）。捡起金币、纸币和银行卡；巧克力、糖果和玩具会扣分，跳起来就能躲开！坑洞🕳️和路障🚧也要跳过去。天上的高分金币💎要跳得准才拿得到！</p>

        <div class="tch-panel" id="tch-shop" hidden>
          <h2>到站啦！硬币岛小商店 Coin Shop</h2>
          <p>你一共收集了 <strong id="tch-shop-coins">0</strong> 枚金币。想买点什么，还是留着以后用？</p>
          <div class="tch-shop-items" id="tch-shop-items"></div>
          <p class="tch-wallet">剩余金币 Remaining: <strong id="tch-wallet">0</strong></p>
          <div class="hero-actions center-actions">
            <button type="button" class="button primary" id="tch-finish">完成 Finish</button>
          </div>
        </div>

        <div class="tch-panel" id="tch-result" hidden>
          <h2 id="tch-result-title"></h2>
          <p id="tch-result-text"></p>
          <div class="hero-actions center-actions">
            <button type="button" class="button primary" id="tch-retry">再试一次 Try Again</button>
            <a class="button secondary" href="/explore?level=beginner#${planet.id}">返回${planet.zh} Back to Planet</a>
          </div>
        </div>
      </div>
    </section>
    <script src="${PHASER_CDN_SRC}"></script>
    <script>${clientScript}</script>
  `;
}
