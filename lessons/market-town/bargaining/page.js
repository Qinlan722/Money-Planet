import { clientScript } from "./client.js";

const FONT_LINK =
  '<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=ZCOOL+KuaiLe&display=swap" rel="stylesheet" />';

export function renderBargainingBody(lesson, planet) {
  return `
    ${FONT_LINK}
    <section class="page-section lesson-page">
      <a class="back-link" href="/explore/${planet.id}?level=explorer">← 返回闯关地图 Back to Level Map</a>
      <div class="il-hero-banner il-hero-banner-market">
        <div class="il-hero-eyebrow">${planet.zh} · ${planet.name}</div>
        <h1 class="il-hero-title">${lesson.titleZh}</h1>
        <div class="il-hero-en">${lesson.titleEn}</div>
        <div class="il-hero-tags">
          <span>${lesson.ageLevel}</span>
          ${lesson.keyConcepts.map((tag) => `<span>${tag}</span>`).join("")}
        </div>
      </div>

      <div class="il-root" id="il-root">
        <div class="il-steps" id="il-steps"></div>
        <div class="il-stage" id="il-stage"></div>
      </div>
    </section>
    <script>${clientScript}</script>
  `;
}
