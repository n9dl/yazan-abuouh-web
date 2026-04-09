/* ══════════════════════════════════════
   XARZ STUDIO — app.js
══════════════════════════════════════ */

/* ══════ AUTH GUARD ══════ */
if (sessionStorage.getItem('xarz_access') !== 'granted') {
  window.location.replace('login.html');
}

function logout() {
  sessionStorage.removeItem('xarz_access');
  window.location.replace('login.html');
}

/* ══════ STATE ══════ */
const S = {
  bgC: '#f5c842', bgPat: 'none', fcPat: 'none',
  wmPos: 'br', dir: 'rtl', theme: 'dark',
  layers: [], actLay: null, hlWords: [],
  cardW: 1080, cardH: 1080,
};

/* ══════ SAVE / LOAD (localStorage) ══════ */
const INPUTS = [
  'qTxt','qFont','qSz','qW','qAlign','qLH','qCol','qW2','qX','qY',
  'hlCol','hlOp','hlR','hlPX','hlPY',
  'auY','auX','auGap','showDiv','divLen','divW','divCol','auTxt','auSz','auCol',
  'useGrad','bgC1','bgC2','gDir','patOp',
  'fcOn','fcBg','fcOp','fcR','fcMX','fcMY','fcOX','fcOY','fcPatOp',
  'shBl','shSp','shX','shY','shCol','shAl',
  'wmOn','wmTxt','wmSz','wmOp','wmCol',
  'exSc','exFmt','cW','cH',
];

function saveState() {
  const data = {};
  INPUTS.forEach(id => {
    const el = g(id); if (!el) return;
    data[id] = el.type === 'checkbox' ? el.checked : el.value;
  });
  data._S = {
    bgC: S.bgC, bgPat: S.bgPat, fcPat: S.fcPat,
    wmPos: S.wmPos, dir: S.dir, theme: S.theme,
    hlWords: [...S.hlWords], cardW: S.cardW, cardH: S.cardH,
  };
  try { localStorage.setItem('xarz_state', JSON.stringify(data)); } catch (e) {}
}

function loadState() {
  try {
    const raw = localStorage.getItem('xarz_state');
    if (!raw) return false;
    const data = JSON.parse(raw);
    INPUTS.forEach(id => {
      const el = g(id); if (!el || data[id] == null) return;
      if (el.type === 'checkbox') el.checked = data[id];
      else el.value = data[id];
    });
    if (data._S) {
      const ds = data._S;
      S.bgC    = ds.bgC    || S.bgC;
      S.bgPat  = ds.bgPat  || 'none';
      S.fcPat  = ds.fcPat  || 'none';
      S.wmPos  = ds.wmPos  || 'br';
      S.dir    = ds.dir    || 'rtl';
      S.theme  = ds.theme  || 'dark';
      S.hlWords = ds.hlWords || [];
      S.cardW  = ds.cardW  || 1080;
      S.cardH  = ds.cardH  || 1080;

      if (S.theme === 'light') applyThemeVars('light');

      // Restore UI state
      document.querySelectorAll('#bgPal .sw').forEach(sw =>
        sw.classList.toggle('on', sw.getAttribute('onclick')?.includes(S.bgC)));
      document.querySelectorAll('#bgPatG .pb').forEach(b =>
        b.classList.toggle('on', b.getAttribute('onclick')?.includes(`'${S.bgPat}'`)));
      document.querySelectorAll('#fcPatG .pb').forEach(b =>
        b.classList.toggle('on', b.getAttribute('onclick')?.includes(`'${S.fcPat}'`)));
      document.querySelectorAll('.wb').forEach(b =>
        b.classList.toggle('on', b.getAttribute('onclick')?.includes(`'${S.wmPos}'`)));
      g('dR').classList.toggle('ac', S.dir === 'rtl');
      g('dL').classList.toggle('ac', S.dir === 'ltr');
      g('cW').value = S.cardW;
      g('cH').value = S.cardH;
    }
    return true;
  } catch (e) { return false; }
}

let saveTimer = null;
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveState, 800);
}

/* ══════ UTILS ══════ */
const g   = id => document.getElementById(id);
const gv  = id => g(id)?.value ?? '';
const sv  = (id, v) => { const e = g(id); if (e) e.textContent = v; };
const h2r = (hex, a) => {
  const r  = parseInt(hex.slice(1, 3), 16);
  const gg = parseInt(hex.slice(3, 5), 16);
  const b  = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${gg},${b},${a})`;
};
const escH  = t => t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>');
const escRx = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* ══════ INIT ══════ */
window.addEventListener('DOMContentLoaded', () => {
  // Login Enter key
  ['li-email', 'li-pass'].forEach(id =>
    g(id)?.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); }));

  loadState();
  R();
  applySize();
  renderHLTags();

  // Auto-capture text selection from quote element
  g('quote-el').addEventListener('mouseup', () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const txt = sel.toString().trim();
    if (!txt || !g('quote-el').contains(sel.anchorNode)) return;
    setTimeout(() => {
      if (!S.hlWords.includes(txt)) { S.hlWords.push(txt); renderHLTags(); }
      R();
      sel.removeAllRanges();
    }, 80);
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.activeElement === g('hlIn')) addHL();
  });

  checkMob();
  window.addEventListener('resize', () => { applySize(); checkMob(); });
});

function checkMob() {
  const mob = window.innerWidth <= 820;
  g('mbtn').style.display = mob ? 'flex' : 'none';
  const fab = g('fab');
  if (fab) fab.style.display = mob ? 'flex' : 'none';
}

/* ══════ MASTER RENDER ══════ */
function R() {
  rBg(); rQuote(); rAuthor(); rCard(); rWm();
  scheduleSave();
}

/* ── Background ── */
function rBg() {
  const c1 = S.bgC, useG = g('useGrad')?.checked;
  let bg = c1;
  if (useG) {
    const c2 = gv('bgC2'), d = gv('gDir');
    bg = d === 'radial'
      ? `radial-gradient(circle at center,${c1},${c2})`
      : `linear-gradient(${d},${c1},${c2})`;
  }
  g('bg-grad').style.background = bg;
  const op = +gv('patOp') / 100;
  g('bg-pat').style.opacity = op;
  g('bg-pat').style.background = patCSS(S.bgPat);
}

/* ── Quote + Highlights ── */
function rQuote() {
  const el = g('quote-el');
  const font = gv('qFont') || 'Cairo';
  el.style.fontFamily  = `'${font}',sans-serif`;
  el.style.fontSize    = gv('qSz') + 'px';
  el.style.fontWeight  = gv('qW');
  el.style.textAlign   = gv('qAlign');
  el.style.lineHeight  = gv('qLH');
  el.style.color       = gv('qCol');
  el.style.direction   = S.dir;

  const w = +gv('qW2');
  const margin = (100 - w) / 2;
  el.style.left  = margin + '%';
  el.style.right = margin + '%';
  el.style.width = 'auto';

  const qx = +gv('qX'), qy = +gv('qY');
  el.style.top       = '50%';
  el.style.transform = `translateY(calc(-50% + ${qy}px)) translateX(${qx}px)`;

  // Highlights
  const hlC  = gv('hlCol'), hlO = +gv('hlOp') / 100;
  const hlR  = gv('hlR'), px = gv('hlPX'), py = gv('hlPY');
  const hlBg = h2r(hlC, hlO);
  const st   = `display:inline;background:${hlBg};border-radius:${hlR}px;padding:${py}px ${px}px;-webkit-box-decoration-break:clone;box-decoration-break:clone`;

  let html = escH(gv('qTxt'));
  if (S.hlWords.length > 0) {
    const sorted = [...S.hlWords].sort((a, b) => b.length - a.length);
    const rx = new RegExp(`(${sorted.map(escRx).join('|')})`, 'gi');
    html = html.replace(rx, m => `<span class="HL" style="${st}">${m}</span>`);
  }
  el.innerHTML = html;
}

/* ── Author & Divider ── */
function rAuthor() {
  const ag   = g('author-grp');
  const font = gv('qFont') || 'Cairo';
  const yPct = +gv('auY');
  const xPx  = +gv('auX');
  const gap  = gv('auGap') || '8';

  ag.style.top       = yPct + '%';
  ag.style.left      = '0';
  ag.style.right     = '0';
  ag.style.padding   = '0 10%';
  ag.style.transform = `translateY(-50%) translateX(${xPx}px)`;
  ag.style.alignItems = 'flex-end';
  ag.style.gap       = gap + 'px';

  const dl   = g('div-line');
  const show = g('showDiv')?.checked;
  dl.style.display        = show ? 'block' : 'none';
  dl.style.width          = gv('divLen') + '%';
  dl.style.borderTopWidth = gv('divW') + 'px';
  dl.style.borderTopColor = gv('divCol');
  dl.style.borderTopStyle = 'solid';
  dl.style.alignSelf      = 'flex-end';

  const an = g('author-name');
  an.textContent   = gv('auTxt');
  an.style.fontSize   = gv('auSz') + 'px';
  an.style.color      = gv('auCol');
  an.style.fontFamily = `'${font}',sans-serif`;
  an.style.direction  = S.dir;
}

/* ── Floating Card ── */
function rCard() {
  const fc = g('float-card');
  const on = g('fcOn')?.checked;
  if (!on) { fc.style.display = 'none'; return; }
  fc.style.display = 'block';

  const bg = gv('fcBg'), op = +gv('fcOp') / 100, r = +gv('fcR');
  const mx = +gv('fcMX') || 60, my = +gv('fcMY') || 60;
  const ox = +gv('fcOX') || 0,  oy = +gv('fcOY') || 0;
  const bl = gv('shBl'), sp = gv('shSp'), sx = gv('shX'), sy = gv('shY');
  const sc = gv('shCol'), sa = +gv('shAl') / 100;

  const [cr,  cg2, cb]  = [parseInt(bg.slice(1,3),16), parseInt(bg.slice(3,5),16), parseInt(bg.slice(5,7),16)];
  const [sr, sg2, sb2] = [parseInt(sc.slice(1,3),16), parseInt(sc.slice(3,5),16), parseInt(sc.slice(5,7),16)];

  fc.style.cssText = `
    display:block;position:absolute;
    top:${my+oy}px;bottom:${my-oy}px;
    left:${mx+ox}px;right:${mx-ox}px;
    background:rgba(${cr},${cg2},${cb},${op});
    border-radius:${r}px;
    box-shadow:${sx}px ${sy}px ${bl}px ${sp}px rgba(${sr},${sg2},${sb2},${sa});
    z-index:2;pointer-events:none;overflow:hidden;
  `;

  let pl = fc.querySelector('.fcp');
  if (!pl) {
    pl = document.createElement('div');
    pl.className = 'fcp';
    pl.style.cssText = 'position:absolute;inset:0;pointer-events:none;border-radius:inherit';
    fc.appendChild(pl);
  }
  const patOp = +gv('fcPatOp') / 100 || 0.2;
  pl.style.background = S.fcPat === 'none' ? 'none' : fcPatCSS(S.fcPat, patOp);
}

/* ── Watermark ── */
function rWm() {
  const wm = g('wm');
  const on = g('wmOn')?.checked;
  wm.style.display    = on ? 'block' : 'none';
  wm.textContent      = gv('wmTxt');
  wm.style.fontSize   = gv('wmSz') + 'px';
  wm.style.opacity    = +gv('wmOp') / 100;
  wm.style.color      = gv('wmCol');
  wm.style.fontFamily = `'${gv('qFont') || 'Cairo'}',sans-serif`;
  posWm(S.wmPos);
}

function posWm(p) {
  const wm = g('wm');
  const m  = '20px';
  wm.style.top = wm.style.bottom = wm.style.left = wm.style.right = 'auto';
  wm.style.transform = 'none';
  const map = {
    tl:{top:m,right:m},    tc:{top:m,left:'50%',transform:'translateX(-50%)'},    tr:{top:m,left:m},
    ml:{top:'50%',right:m,transform:'translateY(-50%)'},  mc:{top:'50%',left:'50%',transform:'translate(-50%,-50%)'},  mr:{top:'50%',left:m,transform:'translateY(-50%)'},
    bl:{bottom:m,right:m}, bc:{bottom:m,left:'50%',transform:'translateX(-50%)'}, br:{bottom:m,left:m},
  };
  const s = map[p] || map.br;
  Object.entries(s).forEach(([k, v]) => (wm.style[k] = v));
}

/* ══════ PATTERN CSS ══════ */
function patCSS(p) {
  if (p === 'none')  return 'none';
  if (p === 'dots')  return 'radial-gradient(circle,rgba(0,0,0,.45) 1.5px,transparent 1.5px) 0 0/28px 28px';
  if (p === 'grid')  return 'linear-gradient(rgba(0,0,0,.2) 1px,transparent 1px) 0 0/30px 30px,linear-gradient(90deg,rgba(0,0,0,.2) 1px,transparent 1px) 0 0/30px 30px';
  if (p === 'grain') return `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E") repeat`;
  if (p === 'diag')  return 'repeating-linear-gradient(45deg,rgba(0,0,0,.08) 0,rgba(0,0,0,.08) 1px,transparent 1px,transparent 20px)';
  if (p === 'cross') return 'linear-gradient(rgba(0,0,0,.18) 1px,transparent 1px) 0 0/40px 40px,linear-gradient(90deg,rgba(0,0,0,.18) 1px,transparent 1px) 0 0/40px 40px';
  if (p === 'hex')   return 'radial-gradient(ellipse at 50% 0%,rgba(0,0,0,.15) 0%,transparent 60%) 0 0/60px 40px,radial-gradient(ellipse at 50% 100%,rgba(0,0,0,.15) 0%,transparent 60%) 0 20px/60px 40px';
  if (p === 'tri')   return 'linear-gradient(60deg,rgba(0,0,0,.1) 25%,transparent 25%) 0 0/30px 52px,linear-gradient(-60deg,rgba(0,0,0,.1) 25%,transparent 25%) 0 0/30px 52px';
  return 'none';
}

function fcPatCSS(p, a) {
  if (p === 'none')    return 'none';
  if (p === 'dots')    return `radial-gradient(circle,rgba(0,0,0,${a*3}) 1.5px,transparent 1.5px) 0 0/22px 22px`;
  if (p === 'grid')    return `linear-gradient(rgba(0,0,0,${a*2}) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,rgba(0,0,0,${a*2}) 1px,transparent 1px) 0 0/24px 24px`;
  if (p === 'grain')   return `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='${Math.min(a*4,1)}'/%3E%3C/svg%3E") repeat`;
  if (p === 'diag')    return `repeating-linear-gradient(45deg,rgba(0,0,0,${a*2}) 0,rgba(0,0,0,${a*2}) 1px,transparent 1px,transparent 16px)`;
  if (p === 'cross')   return `linear-gradient(rgba(0,0,0,${a*2}) 1px,transparent 1px) 0 0/32px 32px,linear-gradient(90deg,rgba(0,0,0,${a*2}) 1px,transparent 1px) 0 0/32px 32px`;
  if (p === 'circles') return `radial-gradient(circle,transparent 30%,rgba(0,0,0,${a*2}) 31%,rgba(0,0,0,${a*2}) 33%,transparent 34%) 0 0/40px 40px`;
  if (p === 'waves')   return `repeating-linear-gradient(0deg,transparent,transparent 10px,rgba(0,0,0,${a*1.5}) 10px,rgba(0,0,0,${a*1.5}) 11px)`;
  return 'none';
}

/* ══════ HIGHLIGHTS ══════ */
function addHL() {
  const i = g('hlIn'), w = i.value.trim();
  if (!w || S.hlWords.includes(w)) return;
  S.hlWords.push(w); i.value = ''; renderHLTags(); R();
}
function removeHL(i) { S.hlWords.splice(i, 1); renderHLTags(); R(); }
function clearHL()   { S.hlWords = []; renderHLTags(); R(); }
function renderHLTags() {
  const c = g('hlTags');
  if (!S.hlWords.length) {
    c.innerHTML = '<span style="font-size:10px;color:var(--t3);font-style:italic">لا يوجد تمييز…</span>';
    return;
  }
  c.innerHTML = S.hlWords.map((w, i) =>
    `<span class="hlt">${w}<button onclick="removeHL(${i})">×</button></span>`).join('');
}

/* ══════ BG / PATTERNS ══════ */
function pickBg(c, el) { S.bgC = c; g('bgC1').value = c; g('bgHx').textContent = c; deswc(); el?.classList.add('on'); R(); }
function deswc() { document.querySelectorAll('#bgPal .sw').forEach(s => s.classList.remove('on')); }
function setBgPat(p, btn) { S.bgPat = p; document.querySelectorAll('#bgPatG .pb').forEach(b => b.classList.remove('on')); btn.classList.add('on'); R(); }
function setFcPat(p, btn) { S.fcPat = p; document.querySelectorAll('#fcPatG .pb').forEach(b => b.classList.remove('on')); btn.classList.add('on'); R(); }

/* ══════ SIZE ══════ */
function setSz(w, h, btn) {
  g('cW').value = w; g('cH').value = h;
  document.querySelectorAll('#szG .pb').forEach(b => b.classList.remove('on'));
  btn?.classList.add('on');
  applySize();
}
function applySize() {
  const w = parseInt(gv('cW')) || 1080, h = parseInt(gv('cH')) || 1080;
  S.cardW = w; S.cardH = h;
  g('card').style.width  = w + 'px';
  g('card').style.height = h + 'px';
  g('szBadge').textContent = `${w} × ${h}`;
  fitCard();
}
function fitCard() {
  const mob = window.innerWidth <= 820;
  const cw  = g('cw');
  if (mob) {
    // On mobile CSS handles sizing via vmin — just reset any desktop transform
    cw.style.transform       = 'none';
    cw.style.transformOrigin = 'center center';
    cw.style.width           = '';
    cw.style.height          = '';
    return;
  }
  const area = g('ca');
  const mw   = area.clientWidth  - 64;
  const mh   = area.clientHeight - 64;
  const sc   = Math.min(1, mw / S.cardW, mh / S.cardH);
  cw.style.transform       = `scale(${sc})`;
  cw.style.transformOrigin = 'center center';
  cw.style.width           = S.cardW + 'px';
  cw.style.height          = S.cardH + 'px';
}

/* ══════ IMAGES / LAYERS ══════ */
function handleImgs(e) {
  Array.from(e.target.files).forEach(f => {
    const r = new FileReader();
    r.onload = ev => addLay(ev.target.result, f.name);
    r.readAsDataURL(f);
  });
  e.target.value = '';
}
function addLay(src, name) {
  const id = 'L' + Date.now();
  const el = document.createElement('img');
  el.src = src; el.className = 'card-img';
  el.style.cssText = 'position:absolute;top:50%;left:50%;width:200px;height:auto;z-index:3;pointer-events:none;transform-origin:center center;transform:translate(-50%,-50%)';
  g('card').appendChild(el);
  const lay = { id, src, el, name: name.split('.')[0].slice(0, 12), x:0, y:0, sc:50, rot:0, op:100, z:3 };
  S.layers.push(lay); renderLays(); selLay(id);
}
function renderLays() {
  g('layList').innerHTML = S.layers.map(l =>
    `<div class="li${S.actLay===l.id?' on':''}" onclick="selLay('${l.id}')"><img class="lth" src="${l.src}"><span class="ln">${l.name}</span></div>`
  ).join('');
}
function selLay(id) {
  S.actLay = id; renderLays();
  const l = S.layers.find(x => x.id === id);
  const c = g('layCtrls');
  if (!l) { c.style.display = 'none'; return; }
  c.style.display = 'block';
  g('iSc').value = l.sc;  sv('iScV', l.sc  + '%');
  g('iRo').value = l.rot; sv('iRoV', l.rot + '°');
  g('iOp').value = l.op;  sv('iOpV', l.op  + '%');
  g('iX').value  = l.x;   sv('iXV',  l.x   + 'px');
  g('iY').value  = l.y;   sv('iYV',  l.y   + 'px');
}
function upLay() {
  const l = S.layers.find(x => x.id === S.actLay); if (!l) return;
  l.sc = +gv('iSc'); l.rot = +gv('iRo'); l.op = +gv('iOp'); l.x = +gv('iX'); l.y = +gv('iY');
  l.el.style.transform = `translate(calc(-50% + ${l.x}px),calc(-50% + ${l.y}px)) rotate(${l.rot}deg) scale(${l.sc/100})`;
  l.el.style.opacity   = l.op / 100;
  l.el.style.zIndex    = l.z;
}
function lzI(d) {
  const l = S.layers.find(x => x.id === S.actLay); if (!l) return;
  l.z = d === 'up' ? Math.min(4, l.z + 1) : Math.max(1, l.z - 1);
  l.el.style.zIndex = l.z;
}
function rmLay() {
  const l = S.layers.find(x => x.id === S.actLay); if (!l) return;
  l.el.remove();
  S.layers = S.layers.filter(x => x.id !== S.actLay);
  S.actLay = S.layers.length ? S.layers[S.layers.length - 1].id : null;
  renderLays();
  if (S.actLay) selLay(S.actLay); else g('layCtrls').style.display = 'none';
}

/* ══════ WATERMARK ══════ */
function setWm(p, btn) {
  S.wmPos = p;
  document.querySelectorAll('.wb').forEach(b => b.classList.remove('on'));
  btn.classList.add('on'); R();
}

/* ══════ TEXT DIR ══════ */
function setDir(d, btn) {
  S.dir = d;
  [g('dR'), g('dL')].forEach(b => b.classList.remove('ac'));
  btn.classList.add('ac'); R();
}

/* ══════ TABS ══════ */
function switchTab(name, btn) {
  document.querySelectorAll('.tab-b').forEach(b => b.classList.remove('on'));
  document.querySelectorAll('.tp').forEach(p => p.classList.remove('on'));
  btn.classList.add('on');
  g('tp-' + name).classList.add('on');
}

/* ══════ SECTIONS ══════ */
function tgl(id) { g(id).classList.toggle('cl'); }

/* ══════ THEME ══════ */
function applyThemeVars(t) {
  const v = t === 'light'
    ? { '--bg':'#f0f0f8','--panel':'#fff','--panel2':'#f5f5fc','--b':'rgba(0,0,0,.08)','--b2':'rgba(0,0,0,.14)','--t':'#111','--t2':'#555','--t3':'#888' }
    : { '--bg':'#111117','--panel':'#18181f','--panel2':'#1f1f28','--b':'rgba(255,255,255,.07)','--b2':'rgba(255,255,255,.13)','--t':'#f0f0f8','--t2':'#9090b0','--t3':'#55556a' };
  Object.entries(v).forEach(([k, val]) => document.documentElement.style.setProperty(k, val));
}
function toggleTheme() {
  S.theme = S.theme === 'dark' ? 'light' : 'dark';
  applyThemeVars(S.theme);
  scheduleSave();
}

/* ══════ MOBILE ══════ */
function toggleSB() {
  const open = g('sb').classList.toggle('op');
  g('sbov').classList.toggle('on', open);
  // Update FAB icon
  const fab = g('fab');
  if (fab) fab.textContent = open ? '✕ إغلاق' : '⚙️ الإعدادات';
}
function closeSB() {
  g('sb').classList.remove('op');
  g('sbov').classList.remove('on');
  const fab = g('fab');
  if (fab) fab.textContent = '⚙️ الإعدادات';
}

// Swipe down to close sidebar on mobile
(function(){
  let startY = 0, startX = 0;
  document.addEventListener('touchstart', e => {
    startY = e.touches[0].clientY;
    startX = e.touches[0].clientX;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    const dy = e.changedTouches[0].clientY - startY;
    const dx = Math.abs(e.changedTouches[0].clientX - startX);
    // Swipe down > 60px and mostly vertical → close sidebar
    if (dy > 60 && dx < 50 && g('sb').classList.contains('op')) {
      closeSB();
    }
  }, { passive: true });
})();

/* ══════ EXPORT ══════ */
async function doExport() {
  g('eov').classList.add('on');
  await new Promise(r => setTimeout(r, 150));
  try {
    const cw    = g('cw');
    const prev  = cw.style.transform;
    const scale = parseInt(gv('exSc')) || 2;
    const fmt   = gv('exFmt') || 'png';

    cw.style.transform       = 'none';
    cw.style.transformOrigin = 'top left';
    await new Promise(r => requestAnimationFrame(r));
    await new Promise(r => requestAnimationFrame(r));

    const canvas = await html2canvas(g('card'), {
      scale, useCORS: true, allowTaint: true,
      backgroundColor: null, logging: false,
      width: S.cardW, height: S.cardH, x: 0, y: 0,
    });

    cw.style.transform = prev;

    const a = document.createElement('a');
    a.download = `xarz-studio.${fmt}`;
    a.href     = canvas.toDataURL(fmt === 'jpeg' ? 'image/jpeg' : 'image/png', 0.95);
    a.click();
  } catch (e) {
    alert('خطأ في التصدير: ' + e.message);
  }
  g('eov').classList.remove('on');
}

async function doCopy() {
  g('eov').classList.add('on');
  await new Promise(r => setTimeout(r, 150));
  try {
    const cw   = g('cw');
    const prev = cw.style.transform;
    cw.style.transform = 'none';
    await new Promise(r => requestAnimationFrame(r));
    await new Promise(r => requestAnimationFrame(r));
    const canvas = await html2canvas(g('card'), { scale:2, useCORS:true, allowTaint:true, backgroundColor:null, width:S.cardW, height:S.cardH });
    cw.style.transform = prev;
    canvas.toBlob(async b => {
      try { await navigator.clipboard.write([new ClipboardItem({ 'image/png': b })]); }
      catch { alert('فشل النسخ — استخدم التصدير.'); }
      g('eov').classList.remove('on');
    });
  } catch { g('eov').classList.remove('on'); }
}

window.addEventListener('load', () => setTimeout(() => { applySize(); fitCard(); }, 100));
window.addEventListener('resize', fitCard);
