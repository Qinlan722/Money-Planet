// Hand-authored flat-vector SVG art for the Treasure Coin Hunt game.
// Everything is generated as inline SVG (no binary asset files / static hosting needed)
// and loaded into Phaser as data URIs, matching Money Planet's brand palette.

export function svgUri(svg) {
  // btoa is a standard Web API available in both Node and Workers-style runtimes,
  // unlike Node's Buffer which may not exist in the deploy target's runtime.
  return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
}

function dinoLegs(state) {
  if (state === "jump") {
    return `
      <line x1="66" y1="78" x2="56" y2="94" stroke="#4fc79e" stroke-width="15" stroke-linecap="round"/>
      <line x1="78" y1="78" x2="86" y2="90" stroke="#4fc79e" stroke-width="15" stroke-linecap="round"/>
      <ellipse cx="55" cy="96" rx="10" ry="6" fill="#3aa886"/>
      <ellipse cx="87" cy="92" rx="10" ry="6" fill="#3aa886"/>
    `;
  }
  if (state === "b") {
    return `
      <line x1="62" y1="80" x2="44" y2="102" stroke="#4fc79e" stroke-width="15" stroke-linecap="round"/>
      <line x1="80" y1="80" x2="94" y2="94" stroke="#4fc79e" stroke-width="15" stroke-linecap="round"/>
      <ellipse cx="42" cy="104" rx="11" ry="6" fill="#3aa886"/>
      <ellipse cx="96" cy="96" rx="11" ry="6" fill="#3aa886"/>
    `;
  }
  return `
    <line x1="62" y1="80" x2="82" y2="99" stroke="#4fc79e" stroke-width="15" stroke-linecap="round"/>
    <line x1="80" y1="80" x2="60" y2="97" stroke="#4fc79e" stroke-width="15" stroke-linecap="round"/>
    <ellipse cx="84" cy="101" rx="11" ry="6" fill="#3aa886"/>
    <ellipse cx="58" cy="99" rx="11" ry="6" fill="#3aa886"/>
  `;
}

export function dinoSvg(state) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 116" width="140" height="116">
    <polygon points="12,72 36,58 36,88" fill="#4fc79e"/>
    ${dinoLegs(state)}
    <ellipse cx="70" cy="60" rx="38" ry="28" fill="#75dfbd" stroke="#4fc79e" stroke-width="3"/>
    <ellipse cx="72" cy="74" rx="25" ry="13" fill="#fff8ea"/>
    <polygon points="48,32 55,20 62,32" fill="#ff8a70" stroke="#e0654a" stroke-width="1.5"/>
    <polygon points="63,30 70,17 77,30" fill="#ff8a70" stroke="#e0654a" stroke-width="1.5"/>
    <polygon points="78,32 85,20 92,32" fill="#ff8a70" stroke="#e0654a" stroke-width="1.5"/>
    <ellipse cx="90" cy="67" rx="8" ry="5" fill="#ff8a70"/>
    <circle cx="106" cy="42" r="22" fill="#75dfbd" stroke="#4fc79e" stroke-width="3"/>
    <ellipse cx="121" cy="49" rx="13" ry="9" fill="#75dfbd" stroke="#4fc79e" stroke-width="2.5"/>
    <circle cx="114" cy="35" r="6.5" fill="#ffffff" stroke="#24313b" stroke-width="1.5"/>
    <circle cx="116" cy="35" r="3.2" fill="#24313b"/>
    <circle cx="125" cy="45" r="1.8" fill="#3aa886"/>
    <path d="M112 52c4 3 10 3 14 0" stroke="#24313b" stroke-width="2" stroke-linecap="round" fill="none"/>
  </svg>`;
}

export function coinSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 68" width="68" height="68">
    <circle cx="34" cy="34" r="30" fill="#ffd868" stroke="#e8a93c" stroke-width="4"/>
    <circle cx="34" cy="34" r="21" fill="none" stroke="#fff3cf" stroke-width="3"/>
    <path d="M34 20v28M25 27h18M25 33h18" stroke="#b5791f" stroke-width="4" stroke-linecap="round"/>
  </svg>`;
}

export function billSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 52" width="80" height="52">
    <rect x="2" y="2" width="76" height="48" rx="8" fill="#8fe6c4" stroke="#4fc79e" stroke-width="3"/>
    <rect x="10" y="10" width="60" height="32" rx="5" fill="#fff8ea"/>
    <circle cx="26" cy="26" r="10" fill="#ffd868" stroke="#e8a93c" stroke-width="2"/>
    <path d="M46 18h20M46 26h20M46 34h14" stroke="#75dfbd" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
}

export function cardSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 52" width="80" height="52">
    <rect x="2" y="2" width="76" height="48" rx="9" fill="#72c8f4" stroke="#237aa3" stroke-width="3"/>
    <rect x="2" y="14" width="76" height="9" fill="#1c5c7c"/>
    <rect x="10" y="32" width="16" height="12" rx="3" fill="#ffd868" stroke="#e8a93c" stroke-width="1.5"/>
    <rect x="34" y="35" width="34" height="5" rx="2.5" fill="#eaf8ff"/>
  </svg>`;
}

export function chocoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 56" width="64" height="56">
    <rect x="3" y="3" width="58" height="50" rx="7" fill="#8a5a34" stroke="#6b4020" stroke-width="3"/>
    <path d="M32 3v50M3 28h58" stroke="#6b4020" stroke-width="3"/>
    <rect x="8" y="8" width="20" height="16" rx="2" fill="#9c6b42"/>
    <rect x="36" y="8" width="20" height="16" rx="2" fill="#9c6b42"/>
    <rect x="8" y="32" width="20" height="16" rx="2" fill="#9c6b42"/>
    <rect x="36" y="32" width="20" height="16" rx="2" fill="#9c6b42"/>
  </svg>`;
}

export function toySvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 68" width="68" height="68">
    <circle cx="18" cy="16" r="10" fill="#ff8a70" stroke="#e0654a" stroke-width="2.5"/>
    <circle cx="50" cy="16" r="10" fill="#ff8a70" stroke="#e0654a" stroke-width="2.5"/>
    <circle cx="34" cy="38" r="26" fill="#ffab93" stroke="#e0654a" stroke-width="3"/>
    <circle cx="25" cy="34" r="4" fill="#5c2c1c"/>
    <circle cx="43" cy="34" r="4" fill="#5c2c1c"/>
    <ellipse cx="34" cy="45" rx="7" ry="5" fill="#5c2c1c"/>
    <path d="M26 50c4 3 12 3 16 0" stroke="#5c2c1c" stroke-width="2" stroke-linecap="round" fill="none"/>
  </svg>`;
}

export function candySvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 80" width="56" height="80">
    <line x1="28" y1="40" x2="28" y2="76" stroke="#fff8ea" stroke-width="6" stroke-linecap="round"/>
    <circle cx="28" cy="24" r="22" fill="#ffd868" stroke="#e8a93c" stroke-width="3"/>
    <path d="M28 4a20 20 0 0 1 20 20a20 20 0 0 1-20 20" fill="none" stroke="#ff8a70" stroke-width="4"/>
    <path d="M12 12a16 16 0 0 1 16-8" fill="none" stroke="#ff8a70" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
}

export function yoyoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" width="60" height="60">
    <circle cx="30" cy="18" r="16" fill="#72c8f4" stroke="#237aa3" stroke-width="3"/>
    <circle cx="30" cy="42" r="16" fill="#75dfbd" stroke="#4fc79e" stroke-width="3"/>
    <circle cx="30" cy="30" r="6" fill="#ffd868" stroke="#e8a93c" stroke-width="2"/>
  </svg>`;
}

export function roadblockSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 108" width="60" height="108">
    <rect x="10" y="40" width="10" height="68" rx="3" fill="#c98a5a"/>
    <rect x="40" y="40" width="10" height="68" rx="3" fill="#c98a5a"/>
    <rect x="4" y="18" width="52" height="26" rx="6" fill="#ff8a70" stroke="#e0654a" stroke-width="3"/>
    <path d="M10 20l10 22M24 20l10 22M38 20l10 22" stroke="#fff8ea" stroke-width="6"/>
  </svg>`;
}

export function diamondSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 68" width="68" height="68">
    <polygon points="34,4 58,26 46,62 22,62 10,26" fill="#a7e8ff" stroke="#3fa9d6" stroke-width="3"/>
    <polygon points="34,4 58,26 34,34" fill="#d6f6ff"/>
    <polygon points="34,4 10,26 34,34" fill="#8fdcff"/>
    <polygon points="10,26 34,34 22,62" fill="#6bc9f0"/>
    <polygon points="58,26 34,34 46,62" fill="#9be3ff"/>
  </svg>`;
}

export function sparkleSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="#fff8ea"/>
  </svg>`;
}

export function cloudSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 100" width="180" height="100">
    <ellipse cx="70" cy="60" rx="50" ry="30" fill="#ffffff" opacity="0.85"/>
    <ellipse cx="115" cy="50" rx="38" ry="26" fill="#ffffff" opacity="0.85"/>
    <ellipse cx="40" cy="52" rx="32" ry="22" fill="#ffffff" opacity="0.85"/>
  </svg>`;
}

export function hillSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 280" width="520" height="280">
    <ellipse cx="140" cy="280" rx="180" ry="120" fill="#a5ecd4"/>
    <ellipse cx="400" cy="280" rx="220" ry="140" fill="#8fe6c4"/>
  </svg>`;
}

export function flagSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120" width="80" height="120">
    <rect x="8" y="4" width="6" height="112" rx="3" fill="#e0654a"/>
    <path d="M14 8h50l-14 16 14 16H14z" fill="#fff8ea" stroke="#ff8a70" stroke-width="3"/>
    <g fill="#24313b" opacity="0.85">
      <rect x="18" y="12" width="8" height="8"/>
      <rect x="34" y="12" width="8" height="8"/>
      <rect x="50" y="12" width="8" height="8"/>
      <rect x="26" y="20" width="8" height="8"/>
      <rect x="42" y="20" width="8" height="8"/>
      <rect x="18" y="28" width="8" height="8"/>
      <rect x="34" y="28" width="8" height="8"/>
      <rect x="50" y="28" width="8" height="8"/>
    </g>
  </svg>`;
}
