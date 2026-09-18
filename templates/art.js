'use strict';

const ICONS = {
  drill: 'M4 44h20l6-6h10l6 6h6M20 44V24h8v20M28 24l16-10',
  wrench: 'M14 40 34 20a8 8 0 1 0-6-6L8 34a4 4 0 0 0 6 6Z',
  pipe: 'M6 20h36M6 20a6 6 0 1 1 0 12M42 20a6 6 0 1 0 0 12M6 32h36',
  bolt: 'M24 6 8 26h10l-4 16 20-22H24Z',
  helmet: 'M6 34a18 18 0 0 1 36 0v4H6v-4Z M4 38h40',
  switch: 'M12 8h24v32H12ZM24 14v10',
  tape: 'M24 8a16 16 0 1 0 .1 0ZM24 18v6l6 4',
  hinge: 'M8 8h10v32H8ZM30 8h10v32H30ZM18 14h12M18 34h12',
  glue: 'M18 6h12v10l4 4v22H14V20l4-4Z',
  box: 'M6 16 24 8l18 8-18 8Zm0 0v22l18 8V24Zm36 0v22l-18 8',
};

function renderArt({ color, icon, label, radius = '12px' }) {
  const path = ICONS[icon] || ICONS.box;
  const safeLabel = String(label || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return [
    `<svg viewBox="0 0 48 48" role="img" aria-label="${safeLabel}" preserveAspectRatio="xMidYMid slice"`,
    ` style="width:100%;height:100%;display:block;border-radius:${radius};background:${color}">`,
    `<path d="${path}" fill="none" stroke="#141212" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/>`,
    `</svg>`,
  ].join('');
}

module.exports = { renderArt, ICONS };
