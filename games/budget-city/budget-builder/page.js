import { clientScript } from "./client.js";

const FONT_LINK =
  '<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />';

export function renderBudgetBuilderBody(game, planet) {
  return `
    ${FONT_LINK}
    <section class="page-section compact-page game-page">
      <a class="back-link" href="/explore/${planet.id}?level=beginner">← 返回${planet.zh} Back to ${planet.name}</a>
      <div class="game-hero ${planet.color}">
        <p>${planet.zh} · ${planet.name}</p>
        <h1>${game.titleZh}</h1>
        <p class="english-note">${game.titleEn}</p>
        <p class="game-instructions">${game.instructions}</p>
      </div>

      <div class="bb-root" id="bb-root" data-game="${game.id}">
        <div class="bb-stage" id="bb-stage"></div>
      </div>
    </section>
    <script>${clientScript}</script>
  `;
}
