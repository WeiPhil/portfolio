/* sketches.js — canvas animations for the narrative slides.
 *  - motivation (slide 2): reflected-radiance lobe, SH-fit overlay, draggable x
 *  - hash-grid recap (slide 3): grid levels + interpolation, draggable x, MLP glyph
 *  - path guiding (slide 10): learned incident radiance N(x,d), draggable x
 *  - NIRC sketch (slide 12b-i): path termination into the cache
 *  - limitation bars (slide 13)
 * All canvases render at 2× for sharpness; fonts sized in device px.
 * NO autonomous animation: everything is driven by fragments + mouse.
 */
(() => {
  const C = {
    text: '#e8eaf0', muted: '#9aa3b2', line: '#3a4356',
    ours: '#4db8ff', baseline: '#ff9d4d', bad: '#ff5c77',
    spatial: '#45d6c0', directional: '#c792ea', warm: '#ffd166',
  };

  /* ---------- shared helpers ---------- */
  function setupCanvas(id, obj) {
    const c = document.getElementById(id);
    if (!c) return false;
    c.width = c.clientWidth * 2; c.height = c.clientHeight * 2;
    obj.canvas = c; obj.ctx = c.getContext('2d');
    return true;
  }
  // pointer position in device-pixel canvas coords
  function canvasPos(e, canvas) {
    const r = canvas.getBoundingClientRect();
    return [
      ((e.clientX - r.left) / r.width) * canvas.width,
      ((e.clientY - r.top) / r.height) * canvas.height,
    ];
  }
  function drawArrow(ctx, x0, y0, x1, y1, color, width) {
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    const a = Math.atan2(y1 - y0, x1 - x0), ah = 5 + width * 1.8;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - ah * Math.cos(a - 0.42), y1 - ah * Math.sin(a - 0.42));
    ctx.lineTo(x1 - ah * Math.cos(a + 0.42), y1 - ah * Math.sin(a + 0.42));
    ctx.closePath(); ctx.fill();
  }
  /* ================================================================
     Slide 2 — MOTIVATION
     stage 0 : glossy surface, lights, x, reflected-radiance lobe L(x,·)
     stage 1 : low-order SH fit overlay (dashed) — blurs the lobes
     stage 2 : x sweeps along the surface automatically (drag to take over,
               sweep resumes from where you leave it)
     stage 3 : frozen x1/x2, same d, different L
     ================================================================ */
  const MV = {
    canvas: null, ctx: null, stage: 0, raf: null, active: false,
    u: 0.40, trail: [], frozen: null, dirty: true,
    dragging: false, phase: 0, lastGhost: 0,
  };

  function mvGroundY(px, W, H) { return H * 0.70 + 0.09 * H * Math.sin((px / W) * 4.4 - 0.9); }
  function mvNormal(px, W, H) {
    const d = 0.09 * H * Math.cos((px / W) * 4.4 - 0.9) * (4.4 / W);
    const l = Math.hypot(d, 1);
    return [d / l, -1 / l];
  }
  function mirror(s, n) {
    const dot = s[0] * n[0] + s[1] * n[1];
    return [2 * dot * n[0] - s[0], 2 * dot * n[1] - s[1]];
  }
  function mvLights(W, H) {
    return [
      { x: W * 0.20, y: H * 0.12, I: 1.05, k: 26, r: 44, col: C.warm },
      { x: W * 0.55, y: H * 0.08, I: 0.7, k: 60, r: 30, col: C.warm },
      { x: W * 0.87, y: H * 0.11, I: 0.9, k: 42, r: 36, col: C.warm },
    ];
  }
  function mvRadiance(dir, x, y, n, lights) {
    let r = 0.28;
    for (const L of lights) {
      const s = [L.x - x, L.y - y];
      const sl = Math.hypot(s[0], s[1]);
      const sn = [s[0] / sl, s[1] / sl];
      if (sn[0] * n[0] + sn[1] * n[1] <= 0) continue;
      const m = mirror(sn, n);
      const cos = Math.max(-1, Math.min(1, dir[0] * m[0] + dir[1] * m[1]));
      const dth = Math.acos(cos);
      r += L.I * Math.exp(-dth * dth * L.k);
    }
    return Math.min(1.35, r);
  }
  // truncated Fourier series of r(θ) over the hemisphere — the 2D analog of
  // a low-order SH expansion
  function mvShFit(x, y, n, lights, K) {
    const NS = 128, a0 = Math.atan2(n[1], n[0]);
    const samples = [];
    for (let i = 0; i < NS; i++) {
      const th = -Math.PI + (i / NS) * 2 * Math.PI; // full circle rel. normal
      const a = a0 + th;
      const dir = [Math.cos(a), Math.sin(a)];
      samples.push(Math.abs(th) <= Math.PI / 2 ? mvRadiance(dir, x, y, n, lights) : 0);
    }
    // project onto cos/sin up to order K, reconstruct
    const co = [0], si = [0];
    let mean = 0;
    for (const s of samples) mean += s / NS;
    for (let k = 1; k <= K; k++) {
      let ck = 0, sk = 0;
      for (let i = 0; i < NS; i++) {
        const th = -Math.PI + (i / NS) * 2 * Math.PI;
        ck += samples[i] * Math.cos(k * th) * (2 / NS);
        sk += samples[i] * Math.sin(k * th) * (2 / NS);
      }
      co.push(ck); si.push(sk);
    }
    return (th) => {
      let v = mean;
      for (let k = 1; k <= K; k++) v += co[k] * Math.cos(k * th) + si[k] * Math.sin(k * th);
      return Math.max(0, v);
    };
  }
  function mvLobePath(ctx, x, y, n, R, fn) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    const a0 = Math.atan2(n[1], n[0]);
    for (let i = 0; i <= 72; i++) {
      const th = -Math.PI / 2 + (i / 72) * Math.PI;
      const a = a0 + th;
      const r = R * fn(th, [Math.cos(a), Math.sin(a)]);
      ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
    ctx.closePath();
  }
  function mvDrawPoint(ctx, u, W, H, lights, opts) {
    const x = u * W, y = mvGroundY(x, W, H);
    const n = mvNormal(x, W, H);
    const R = 0.30 * H;
    const rad = (th, dir) => mvRadiance(dir, x, y, n, lights);
    // incident rays from the lights (what the lobe reflects)
    if (opts.incident) {
      for (const L of lights) {
        ctx.strokeStyle = L.col; ctx.globalAlpha = 0.4; ctx.lineWidth = 3;
        ctx.setLineDash([12, 12]);
        ctx.beginPath(); ctx.moveTo(L.x, L.y); ctx.lineTo(x, y); ctx.stroke();
        ctx.setLineDash([]); ctx.globalAlpha = 1;
      }
    }
    // reflected-radiance lobe
    mvLobePath(ctx, x, y, n, R, rad);
    ctx.fillStyle = `rgba(199,146,234,${opts.fill})`;
    ctx.fill();
    mvLobePath(ctx, x, y, n, R, rad);
    ctx.strokeStyle = `rgba(199,146,234,${opts.stroke})`;
    ctx.lineWidth = 5;
    ctx.stroke();
    // low-order SH fit
    if (opts.sh) {
      const fit = mvShFit(x, y, n, lights, 4);
      mvLobePath(ctx, x, y, n, R, (th) => fit(th));
      ctx.strokeStyle = C.baseline; ctx.lineWidth = 4.5;
      ctx.setLineDash([16, 12]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.fillStyle = C.spatial;
    ctx.beginPath(); ctx.arc(x, y, 14, 0, 7); ctx.fill();
    if (opts.xLabel) {
      ctx.fillStyle = C.spatial; ctx.font = 'italic 600 50px "STIX Two Math", Georgia, serif';
      ctx.fillText(opts.xLabel, x - 16, y + 62);
    }
    return { x, y, n };
  }
  function mvDraw(t) {
    const { ctx, canvas } = MV;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const lights = mvLights(W, H);
    for (const L of lights) {
      const g = ctx.createRadialGradient(L.x, L.y, 0, L.x, L.y, L.r * 3.2);
      g.addColorStop(0, L.col); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(L.x, L.y, L.r * 3.2, 0, 7); ctx.fill();
      ctx.fillStyle = L.col;
      ctx.beginPath(); ctx.arc(L.x, L.y, L.r, 0, 7); ctx.fill();
    }
    // glossy ground
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let px = 0; px <= W; px += 8) ctx.lineTo(px, mvGroundY(px, W, H));
    ctx.lineTo(W, H); ctx.closePath();
    const gg = ctx.createLinearGradient(0, H * 0.55, 0, H);
    gg.addColorStop(0, '#232a37'); gg.addColorStop(1, '#151a22');
    ctx.fillStyle = gg; ctx.fill();
    ctx.beginPath();
    for (let px = 0; px <= W; px += 8) {
      const y = mvGroundY(px, W, H);
      px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
    }
    ctx.strokeStyle = '#55617a'; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = C.muted; ctx.font = 'italic 38px sans-serif';
    ctx.fillText('glossy surface', W * 0.015, mvGroundY(W * 0.015, W, H) + 52);

    // stage 2: automatic sweep along the surface (unless the user grabbed x)
    if (MV.stage === 2 && !MV.dragging) {
      MV.u = 0.5 + 0.21 * Math.sin(t * 0.00055 + MV.phase);
    }
    const p = mvDrawPoint(ctx, MV.u, W, H, lights, {
      fill: 0.20, stroke: 0.95, xLabel: 'x',
      incident: true, sh: MV.stage >= 1,
    });
    // the camera and its primary ray to x
    scDrawCamera(ctx, W * 0.055, H * 0.30, 0.5);
    ctx.strokeStyle = '#b8bfcc'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(W * 0.055 + 66, H * 0.30 + 40); ctx.lineTo(p.x, p.y); ctx.stroke();
    // labels kept clear of the lobe (radius ≈ 0.3H·1.35 around x)
    ctx.fillStyle = C.directional; ctx.font = 'italic 46px "STIX Two Math", Georgia, serif';
    ctx.fillText('reflected radiance L(x, ·)', Math.max(30, p.x - 1150), p.y - 0.30 * H);
    if (MV.stage >= 1) {
      ctx.fillStyle = C.baseline; ctx.font = '44px sans-serif';
      ctx.fillText('low-order SH — the lobes blur away',
        Math.min(W - 800, p.x + 0.32 * H), p.y - 0.44 * H);
    }
    MV.dirty = false;
  }
  function mvLoop(t) {
    if (!MV.active) return;
    MV.raf = requestAnimationFrame(mvLoop);
    if (MV.stage === 2 && !MV.dragging) MV.dirty = true; // sweeping
    if (MV.dirty) mvDraw(t || performance.now());
  }
  function mvBindPointer() {
    const c = MV.canvas;
    c.addEventListener('pointerdown', (e) => { MV.dragging = true; c.setPointerCapture(e.pointerId); });
    c.addEventListener('pointermove', (e) => {
      if (!MV.dragging) return;
      const [px] = canvasPos(e, c);
      MV.u = Math.min(0.88, Math.max(0.12, px / c.width));
      MV.dirty = true;
    });
    c.addEventListener('pointerup', () => {
      MV.dragging = false;
      // resume the sweep smoothly from the released position
      const s = Math.max(-1, Math.min(1, (MV.u - 0.5) / 0.21));
      MV.phase = Math.asin(s) - performance.now() * 0.00055;
    });
  }

  /* ================================================================
     Slide 2 — MOTIVATION: how do we encode a direction?
     stage 0 : just d on the sphere
     stage 1 : spherical harmonics (polar plots of the first bands)
     stage 2 : one-blob kernels + Fourier features
     stage 3 : the gap — high-frequency, efficient, compact? little attention
     stage 4 : meanwhile, positions: Instant NGP multiresolution hash-grid
     ================================================================ */
  const DE = { canvas: null, ctx: null, stage: 0, raf: null, active: false, dirty: true };

  function legendreP(l, x) {
    if (l === 0) return 1;
    if (l === 1) return x;
    let p0 = 1, p1 = x;
    for (let k = 2; k <= l; k++) {
      const p2 = ((2 * k - 1) * x * p1 - (k - 1) * p0) / k;
      p0 = p1; p1 = p2;
    }
    return p1;
  }
  function deDraw() {
    const { ctx, canvas } = DE;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const MF = '"STIX Two Math", "Cambria Math", Georgia, serif';
    // the input: a direction on the sphere
    const cx0 = 400, cy0 = 620, R0 = 190;
    ctx.strokeStyle = C.muted; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(cx0, cy0, R0, 0, 7); ctx.stroke();
    ctx.setLineDash([10, 10]); ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.ellipse(cx0, cy0, R0, R0 * 0.32, 0, 0, 7); ctx.stroke();
    ctx.setLineDash([]); ctx.globalAlpha = 1;
    const da = -Math.PI / 3.2;
    drawArrow(ctx, cx0, cy0, cx0 + Math.cos(da) * R0 * 1.25, cy0 + Math.sin(da) * R0 * 1.25, C.baseline, 7);
    ctx.fillStyle = C.baseline; ctx.font = 'italic 600 52px ' + MF;
    ctx.fillText('d', cx0 + Math.cos(da) * R0 * 1.25 + 30, cy0 + Math.sin(da) * R0 * 1.25 + 6);
    ctx.fillStyle = C.text; ctx.font = '52px ' + MF;
    ctx.fillText('d ∈ 𝕊²', cx0 - 70, cy0 + R0 + 90);

    ctx.textAlign = 'center';
    if (DE.stage >= 1) {
      // spherical harmonics: polar plots of |P_l(cos θ)| for l = 0..4
      const rowC = 1650;
      ctx.fillStyle = C.directional; ctx.font = '600 52px sans-serif';
      ctx.fillText('spherical harmonics', rowC, 120);
      for (let l = 0; l <= 4; l++) {
        const cx = 1000 + l * 330, cy = 360, R = 130;
        ctx.beginPath();
        for (let i = 0; i <= 128; i++) {
          const th = (i / 128) * 2 * Math.PI;
          const r = R * Math.abs(legendreP(l, Math.cos(th)));
          const px = cx + Math.sin(th) * r, py = cy - Math.cos(th) * r;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(199,146,234,0.16)'; ctx.fill();
        ctx.strokeStyle = C.directional; ctx.lineWidth = 4; ctx.stroke();
        ctx.fillStyle = C.muted; ctx.font = 'italic 40px ' + MF;
        ctx.fillText('ℓ=' + l, cx, cy + R + 54);
      }
    }
    if (DE.stage >= 2) {
      // one-blob kernels on the parameter axis
      const ax = 1000, aw = 1300, ay = 880;
      ctx.fillStyle = C.spatial; ctx.font = '600 52px sans-serif';
      ctx.fillText('one-blob', ax + aw / 2, 700);
      ctx.strokeStyle = C.muted; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + aw, ay); ctx.stroke();
      for (let k = 0; k < 8; k++) {
        const mu = ax + ((k + 0.5) / 8) * aw;
        ctx.beginPath();
        for (let i = 0; i <= 48; i++) {
          const px = mu - 140 + (i / 48) * 280;
          const py = ay - 115 * Math.exp(-Math.pow((px - mu) / 56, 2));
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.strokeStyle = C.spatial; ctx.lineWidth = 3.5; ctx.stroke();
      }
    }
    if (DE.stage >= 3) {
      // Fourier features
      const ax = 1000, aw = 1300, fy = 1180;
      ctx.fillStyle = C.ours; ctx.font = '600 52px sans-serif';
      ctx.fillText('Fourier features', ax + aw / 2, 1035);
      for (const [fi, freq] of [[0, 1], [1, 2], [2, 4]].values()) {
        ctx.beginPath();
        for (let i = 0; i <= 160; i++) {
          const px = ax + (i / 160) * aw;
          const py = fy + fi * 88 - 32 * Math.sin((i / 160) * Math.PI * 2 * freq);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.strokeStyle = 'rgba(77,184,255,0.85)'; ctx.lineWidth = 3.5; ctx.stroke();
      }
    }
    if (DE.stage >= 4) {
      ctx.fillStyle = C.bad; ctx.font = '600 56px sans-serif';
      ctx.fillText('What about high-frequency directional signals, efficiently & compactly?', 1700, 1560);
    }
    if (DE.stage >= 5) {
      // meanwhile, positions: NGP grid + triplane + octree + ⋯
      const cxr = 3020;
      ctx.fillStyle = C.text; ctx.font = '600 48px sans-serif';
      ctx.fillText('meanwhile, for positions:', cxr, 150);
      const gx = cxr - 160, gy = 210, gs = 320;
      const levels = [
        { n: 4, col: C.spatial, o: 1 }, { n: 8, col: C.ours, o: 0.75 }, { n: 16, col: C.directional, o: 0.5 },
      ];
      for (const L of levels) {
        ctx.strokeStyle = L.col; ctx.globalAlpha = L.o; ctx.lineWidth = 2.5;
        for (let i = 0; i <= L.n; i++) {
          const p = (i / L.n) * gs;
          ctx.beginPath(); ctx.moveTo(gx + p, gy); ctx.lineTo(gx + p, gy + gs); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(gx, gy + p); ctx.lineTo(gx + gs, gy + p); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = C.ours; ctx.font = '600 48px sans-serif';
      ctx.fillText('Instant NGP HashGrid', cxr, gy + gs + 70);
      // triplane: three axis-aligned planes in a small axonometric projection
      const tx0 = cxr - 250, ty0 = 780, ts = 78;
      const tproj = (x, y, z) => [tx0 + x + 0.55 * y, ty0 - 0.4 * y - z];
      const tquad = (corners, col) => {
        ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 3;
        ctx.beginPath();
        corners.forEach((c, i) => {
          const [px, py] = tproj(c[0], c[1], c[2]);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        });
        ctx.closePath();
        ctx.globalAlpha = 0.12; ctx.fill();
        ctx.globalAlpha = 1; ctx.stroke();
      };
      tquad([[0, -ts, -ts], [0, ts, -ts], [0, ts, ts], [0, -ts, ts]], C.directional); // YZ
      tquad([[-ts, -ts, 0], [ts, -ts, 0], [ts, ts, 0], [-ts, ts, 0]], C.spatial);     // XY
      tquad([[-ts, 0, -ts], [ts, 0, -ts], [ts, 0, ts], [-ts, 0, ts]], C.ours);        // XZ
      ctx.fillStyle = C.muted; ctx.font = '44px sans-serif';
      ctx.fillText('triplane', tx0 + 20, ty0 + 165);
      // octree: adaptively subdivided square
      const ox0 = cxr + 130, oy0 = 700, os = 160;
      ctx.strokeStyle = C.muted; ctx.lineWidth = 3;
      ctx.strokeRect(ox0, oy0, os, os);
      ctx.strokeRect(ox0, oy0, os / 2, os / 2);
      ctx.strokeRect(ox0 + os / 2, oy0, os / 2, os / 2);
      ctx.strokeRect(ox0, oy0 + os / 2, os / 2, os / 2);
      ctx.strokeRect(ox0 + os / 2, oy0 + os / 2, os / 2, os / 2);
      ctx.strokeRect(ox0 + os / 2, oy0, os / 4, os / 4);
      ctx.strokeRect(ox0 + 3 * os / 4, oy0, os / 4, os / 4);
      ctx.strokeRect(ox0 + os / 2, oy0 + os / 4, os / 4, os / 4);
      ctx.strokeRect(ox0 + 3 * os / 4, oy0 + os / 4, os / 4, os / 4);
      ctx.fillStyle = C.muted; ctx.font = '44px sans-serif';
      ctx.fillText('octree', ox0 + os / 2, oy0 + os + 85);
      ctx.fillStyle = C.muted; ctx.font = '600 64px sans-serif';
      ctx.fillText('⋯', cxr, 1080);
    }
    ctx.textAlign = 'left';
    DE.dirty = false;
  }
  function deLoop() {
    if (!DE.active) return;
    DE.raf = requestAnimationFrame(deLoop);
    if (DE.dirty) deDraw();
  }

  /* ================================================================
     Slide 3 — 2D hash-grid recap (draggable x, MLP glyph)
     ================================================================ */
  const HG = { canvas: null, ctx: null, stage: 0, raf: null, active: false, q: [0.58, 0.47], dirty: true, geo: null };

  function hgDraw() {
    const { ctx, canvas } = HG;
    const W = canvas.width, Hh = canvas.height;
    ctx.clearRect(0, 0, W, Hh);
    const pad = 40, S = Hh - 2 * pad;
    const ox = (W - S) / 2 - 260, oy = pad;
    HG.geo = { ox, oy, S };
    const q = [ox + HG.q[0] * S, oy + (1 - HG.q[1]) * S];
    const levels = [
      { n: 4, color: C.spatial, label: 'L0 · 4×4', show: HG.stage >= 0 },
      { n: 8, color: C.ours, label: 'L1 · 8×8', show: HG.stage >= 4 },
      { n: 16, color: C.directional, label: 'L2 · 16×16', show: HG.stage >= 5 },
    ];
    for (const [li, L] of levels.entries()) {
      if (!L.show) continue;
      ctx.strokeStyle = L.color + (li === 0 ? 'aa' : '77');
      ctx.lineWidth = li === 0 ? 2.5 : 1.6;
      for (let i = 0; i <= L.n; i++) {
        const p = (i / L.n) * S;
        ctx.beginPath(); ctx.moveTo(ox + p, oy); ctx.lineTo(ox + p, oy + S); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox, oy + p); ctx.lineTo(ox + S, oy + p); ctx.stroke();
      }
    }
    const feats = [];
    for (const L of levels) {
      if (!L.show || HG.stage < 1) continue;
      const n = L.n;
      const fx = Math.min(n - 1, Math.floor(HG.q[0] * n)), fy = Math.min(n - 1, Math.floor(HG.q[1] * n));
      const wx = HG.q[0] * n - fx, wy = HG.q[1] * n - fy;
      for (let dx = 0; dx <= 1; dx++) for (let dy = 0; dy <= 1; dy++) {
        const w = (dx ? wx : 1 - wx) * (dy ? wy : 1 - wy);
        const cx = ox + ((fx + dx) / n) * S, cy = oy + (1 - (fy + dy) / n) * S;
        ctx.strokeStyle = L.color + '99'; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(q[0], q[1]); ctx.stroke();
        ctx.fillStyle = L.color;
        ctx.beginPath(); ctx.arc(cx, cy, 6 + 24 * w, 0, 7); ctx.fill();
      }
      ctx.strokeStyle = L.color; ctx.lineWidth = 5;
      ctx.strokeRect(ox + (fx / n) * S, oy + (1 - (fy + 1) / n) * S, S / n, S / n);
      feats.push(L);
    }
    // query point + drag hint
    ctx.fillStyle = C.baseline;
    ctx.beginPath(); ctx.arc(q[0], q[1], 15, 0, 7); ctx.fill();
    ctx.fillStyle = C.text; ctx.font = 'italic 600 52px sans-serif';
    ctx.fillText('x', q[0] + 26, q[1] - 18);

    // left legend
    ctx.font = '600 44px sans-serif';
    levels.forEach((L, i) => {
      if (!L.show) return;
      const ly = oy + 30 + i * 78;
      ctx.fillStyle = L.color;
      ctx.fillRect(60, ly - 30, 42, 42);
      ctx.fillStyle = C.text;
      ctx.fillText(L.label, 124, ly + 4);
    });

    // right: hash table → query-features bar → MLP → output
    if (HG.stage >= 1 && feats.length) {
      const cxm = ox + S + 560;             // diagram center-x (clear of the grid)
      let ty = oy + 120;
      ctx.textAlign = 'center';
      const rows = 12, rw = 100, rh = 38, tgap = 40;
      if (HG.stage >= 3) {
      // the compact hash table: corners index into T entries via h(c) —
      // revealed AFTER the dense-grid story
      ctx.fillStyle = C.text; ctx.font = '600 54px sans-serif';
      ctx.fillText('hash table with T entries per level', cxm, ty - 34);
      const tablesW = feats.length * rw + (feats.length - 1) * tgap;
      let txx = cxm - tablesW / 2;
      feats.forEach((L) => {
        const n = L.n;
        const fx = Math.min(n - 1, Math.floor(HG.q[0] * n));
        const fy = Math.min(n - 1, Math.floor(HG.q[1] * n));
        const wx = HG.q[0] * n - fx, wy = HG.q[1] * n - fy;
        for (let dx = 0; dx <= 1; dx++) for (let dy = 0; dy <= 1; dy++) {
          const h = (Math.imul(fx + dx, 2654435761) ^ Math.imul(fy + dy, 805459861)) >>> 0;
          const r = h % rows;
          const w = (dx ? wx : 1 - wx) * (dy ? wy : 1 - wy);
          ctx.globalAlpha = 0.3 + 0.7 * w;
          ctx.fillStyle = L.color;
          ctx.fillRect(txx + 2, ty + r * rh + 2, rw - 4, rh - 4);
        }
        ctx.globalAlpha = 1;
        for (let r = 0; r < rows; r++) {
          ctx.strokeStyle = C.muted; ctx.lineWidth = 2;
          ctx.strokeRect(txx, ty + r * rh, rw, rh);
        }
        txx += rw + tgap;
      });
      ctx.fillStyle = C.muted; ctx.font = 'italic 50px ' + '"STIX Two Math", Georgia, serif';
      ctx.fillText('h(corner) mod T', cxm, ty + rows * rh + 58);
      }
      ctx.font = '46px sans-serif'; ctx.fillStyle = C.muted;
      ctx.fillText('interpolate the 4 corner entries', cxm, ty + rows * rh + 122);
      drawArrow(ctx, cxm, ty + rows * rh + 146, cxm, ty + rows * rh + 200, C.muted, 4);
      ty = ty + rows * rh + 272;            // features bar block starts here
      {
      ctx.fillStyle = C.text; ctx.font = '600 54px sans-serif';
      ctx.fillText('query features', cxm, ty - 34);
      // feature bar: 2 cells per level
      const cell = 86, bw = feats.length * 2 * cell;
      let bx = cxm - bw / 2;
      ctx.strokeStyle = C.text; ctx.lineWidth = 3;
      feats.forEach((L) => {
        for (let k = 0; k < 2; k++) {
          ctx.fillStyle = L.color;
          ctx.fillRect(bx, ty, cell, cell);
          ctx.strokeRect(bx, ty, cell, cell);
          bx += cell;
        }
      });
      }
      if (HG.stage >= 2) {
      const cell = 86;
      drawArrow(ctx, cxm, ty + cell + 14, cxm, ty + cell + 96, C.muted, 4);
      // MLP box with nodes
      const mw = 380, mh = 320, mx = cxm - mw / 2, my = ty + cell + 112;
      ctx.strokeStyle = C.text; ctx.lineWidth = 4;
      ctx.strokeRect(mx, my, mw, mh);
      ctx.fillStyle = C.muted; ctx.font = '600 52px sans-serif';
      ctx.fillText('MLP', cxm, my + mh + 56);
      const colsX = [mx + 76, mx + 190, mx + 304];
      const rowsY = [
        [my + 82, my + 160, my + 238],
        [my + 62, my + 130, my + 196, my + 262],
        [my + 82, my + 160, my + 238],
      ];
      // edges
      ctx.strokeStyle = C.muted; ctx.lineWidth = 2; ctx.globalAlpha = 0.6;
      for (let ci = 0; ci < 2; ci++) {
        for (const y1 of rowsY[ci]) for (const y2 of rowsY[ci + 1]) {
          ctx.beginPath(); ctx.moveTo(colsX[ci], y1); ctx.lineTo(colsX[ci + 1], y2); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      // nodes
      for (let ci = 0; ci < 3; ci++) {
        for (const yy of rowsY[ci]) {
          ctx.fillStyle = '#171c24';
          ctx.beginPath(); ctx.arc(colsX[ci], yy, 26, 0, 7); ctx.fill();
          ctx.strokeStyle = C.text; ctx.lineWidth = 3.5;
          ctx.beginPath(); ctx.arc(colsX[ci], yy, 26, 0, 7); ctx.stroke();
        }
      }
      drawArrow(ctx, cxm, my + mh + 72, cxm, my + mh + 140, C.muted, 4);
      ctx.strokeStyle = '#7b52ab'; ctx.lineWidth = 6;
      ctx.strokeRect(cxm - 115, my + mh + 154, 230, 110);
      ctx.fillStyle = C.text; ctx.font = '600 50px sans-serif';
      ctx.fillText('output', cxm, my + mh + 228);
      }
      ctx.textAlign = 'left';
    }
    HG.dirty = false;
  }
  function hgLoop() {
    if (!HG.active) return;
    HG.raf = requestAnimationFrame(hgLoop);
    if (HG.dirty) hgDraw();
  }
  function hgBindPointer() {
    const c = HG.canvas;
    let drag = false;
    c.addEventListener('pointerdown', (e) => {
      const [px, py] = canvasPos(e, c);
      const g = HG.geo;
      if (!g) return;
      if (px > g.ox - 60 && px < g.ox + g.S + 60 && py > g.oy - 60 && py < g.oy + g.S + 60) {
        drag = true; c.setPointerCapture(e.pointerId);
      }
    });
    c.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const [px, py] = canvasPos(e, c);
      const g = HG.geo;
      HG.q[0] = Math.min(0.97, Math.max(0.03, (px - g.ox) / g.S));
      HG.q[1] = Math.min(0.97, Math.max(0.03, 1 - (py - g.oy) / g.S));
      HG.dirty = true;
    });
    c.addEventListener('pointerup', () => { drag = false; });
  }

  /* ================================================================
     Slides 10 & 12b-i — a shared flatland scene:
     ceiling with an AREA light, floor, an occluder standing on the
     floor, and a proper camera glyph. All rays traced consistently.
     ================================================================ */
  function scScene(W, H) {
    return {
      floorY: H * 0.80,                                      // captions live below
      ceilY: H * 0.09,
      x0: W * 0.03, x1: W * 0.97,
      light: { a: W * 0.64, b: W * 0.78, y: H * 0.09 },      // area light segment
      occ: { x: W * 0.485, w: W * 0.05, top: H * 0.40 },     // stands on the floor
      cam: { x: W * 0.115, y: H * 0.33 },
    };
  }
  function scDrawCamera(ctx, x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = '#2a3140'; ctx.strokeStyle = '#b8bfcc'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.roundRect(-52, -32, 96, 64, 10); ctx.fill(); ctx.stroke();
    // lens barrel opening toward +x
    ctx.beginPath();
    ctx.moveTo(44, -14); ctx.lineTo(80, -26); ctx.lineTo(80, 26); ctx.lineTo(44, 14);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // viewfinder bump
    ctx.beginPath(); ctx.roundRect(-34, -46, 34, 16, 5); ctx.fill(); ctx.stroke();
    // shutter button
    ctx.fillStyle = '#b8bfcc';
    ctx.beginPath(); ctx.arc(20, -38, 6, 0, 7); ctx.fill();
    ctx.restore();
  }
  function scDrawBase(ctx, W, H, S) {
    // floor + ceiling
    ctx.strokeStyle = '#4a5468'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(S.x0, S.floorY); ctx.lineTo(S.x1, S.floorY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(S.x0, S.ceilY); ctx.lineTo(S.x1, S.ceilY); ctx.stroke();
    // area light: warm bar set into the ceiling + soft downward glow
    const lc = (S.light.a + S.light.b) / 2;
    const lg = ctx.createRadialGradient(lc, S.light.y, 0, lc, S.light.y, (S.light.b - S.light.a) * 1.6);
    lg.addColorStop(0, 'rgba(255,209,102,0.35)'); lg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = lg;
    ctx.beginPath(); ctx.arc(lc, S.light.y, (S.light.b - S.light.a) * 1.6, 0, 7); ctx.fill();
    ctx.fillStyle = C.warm;
    ctx.beginPath(); ctx.roundRect(S.light.a, S.light.y - 6, S.light.b - S.light.a, 20, 8); ctx.fill();
    ctx.fillStyle = C.muted; ctx.font = '42px sans-serif';
    ctx.fillText('area light', lc - 60, S.light.y + 54);
    // occluder standing on the floor
    ctx.fillStyle = '#333c4e';
    ctx.fillRect(S.occ.x, S.occ.top, S.occ.w, S.floorY - S.occ.top);
    ctx.strokeStyle = '#5a6478'; ctx.lineWidth = 3;
    ctx.strokeRect(S.occ.x, S.occ.top, S.occ.w, S.floorY - S.occ.top);
    ctx.fillStyle = C.muted;
    ctx.fillText('occluder', S.occ.x - 20, S.occ.top - 16);
    // camera, aimed at the floor mid-right
    scDrawCamera(ctx, S.cam.x, S.cam.y, 0.42);
    ctx.fillStyle = C.muted;
    ctx.fillText('camera', S.cam.x - 44, S.cam.y - 62);
  }
  // does segment (x0,y0)-(x1,y1) pass through the occluder?
  function scOccluded(x0, y0, x1, y1, S) {
    const B = { x: S.occ.x, y: S.occ.top, w: S.occ.w, h: S.floorY - S.occ.top };
    const steps = 64;
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t;
      if (x >= B.x && x <= B.x + B.w && y >= B.y && y <= B.y + B.h) return true;
    }
    return false;
  }
  // learned incident radiance N(x, ·) at a floor point: the area light is
  // sampled — soft shadows and penumbras emerge from visibility
  function scIncident(dirA, x, y, S) {
    let v = 0.07;                                            // sky / ambient
    const NS = 7;
    for (let i = 0; i < NS; i++) {
      const lx = S.light.a + ((i + 0.5) / NS) * (S.light.b - S.light.a);
      const ly = S.light.y + 10;
      const ang = Math.atan2(ly - y, lx - x);
      const dth = Math.abs(((dirA - ang + Math.PI * 3) % (2 * Math.PI)) - Math.PI);
      if (!scOccluded(x, y, lx, ly, S)) v += (1.25 / NS) * Math.exp(-dth * dth * 260);
    }
    // faint bounce off the occluder's lit side
    const occAng = Math.atan2(S.occ.top - y, S.occ.x + S.occ.w / 2 - x);
    const dth2 = Math.abs(((dirA - occAng + Math.PI * 3) % (2 * Math.PI)) - Math.PI);
    v += 0.14 * Math.exp(-dth2 * dth2 * 6);
    return Math.min(1.3, v);
  }
  function scLobe(ctx, x, y, S, R, fillCol, strokeCol) {
    ctx.beginPath(); ctx.moveTo(x, y);
    for (let i = 0; i <= 96; i++) {
      const a = -Math.PI + (i / 96) * Math.PI;      // upper hemisphere
      const r = R * scIncident(a, x, y, S);
      ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fillStyle = fillCol; ctx.fill();
    ctx.strokeStyle = strokeCol; ctx.lineWidth = 5; ctx.stroke();
  }

  /* ---------- slide 10: path guiding ---------- */
  const PG = { canvas: null, ctx: null, stage: 0, raf: null, active: false, u: 0.72, dirty: true };
  const MATH_FONT = '"STIX Two Math", "Cambria Math", Georgia, serif';

  // M candidate directions from BSDF sampling (diffuse floor → cosine-spread
  // fan, deterministic so the picture is stable while dragging)
  function pgCandidates(x, y, S) {
    const M = 14, out = [];
    for (let i = 0; i < M; i++) {
      const t = (i + 0.5) / M;                     // stratified
      const ang = -Math.PI + (Math.PI * (1 - Math.cos(Math.PI * t))) / 2; // cosine-spread
      out.push({ a: ang, w: scIncident(ang, x, y, S) });
    }
    return out;
  }
  function pgDraw() {
    const { ctx, canvas } = PG;
    const W = canvas.width, H = canvas.height;
    const S = scScene(W, H);
    ctx.clearRect(0, 0, W, H);
    scDrawBase(ctx, W, H, S);
    const x = PG.u * W, y = S.floorY;
    // the path bounces a couple of times before reaching x (never touching
    // the occluder): camera → floor (left) → ceiling (above the occluder) → x
    const A = [W * 0.28, S.floorY];
    const B = [W * 0.55, S.ceilY];
    ctx.strokeStyle = '#b8bfcc';
    drawArrow(ctx, S.cam.x + 70, S.cam.y + 40, A[0], A[1], '#b8bfcc', 4);
    drawArrow(ctx, A[0], A[1], B[0], B[1], '#b8bfcc', 4);
    drawArrow(ctx, B[0], B[1], x, y, '#b8bfcc', 4);
    ctx.fillStyle = '#b8bfcc';
    ctx.beginPath(); ctx.arc(A[0], A[1], 9, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.arc(B[0], B[1], 9, 0, 7); ctx.fill();
    ctx.fillStyle = C.spatial;
    ctx.beginPath(); ctx.arc(x, y, 15, 0, 7); ctx.fill();
    ctx.fillStyle = C.text; ctx.font = 'italic 600 52px ' + MATH_FONT;
    ctx.fillText('x', x - 58, y - 26);

    const tx = W * 0.045;                      // caption block, BELOW the figure
    const ty = H * 0.835;
    if (PG.stage >= 1) {
      const R = 0.62 * H;
      scLobe(ctx, x, y, S, R, 'rgba(77,184,255,0.18)', 'rgba(77,184,255,0.9)');
      ctx.fillStyle = C.ours; ctx.font = '600 56px ' + MATH_FONT;
      ctx.fillText('Li(x, d)', tx, ty);
      ctx.font = '56px sans-serif';
      ctx.fillText('  — learned incident radiance', tx + 190, ty);
    }
    if (PG.stage === 2) {
      // the PROBLEM beat: we'd like to sample d \u221d L\u1d62 \u2014 but a network can
      // only be evaluated. Dashed "wish" arrow with a question mark.
      const qa = -Math.PI * 0.42;
      const qL = 0.34 * H;
      ctx.strokeStyle = 'rgba(255,209,102,0.75)'; ctx.lineWidth = 5;
      ctx.setLineDash([18, 14]);
      ctx.beginPath(); ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(qa) * qL, y + Math.sin(qa) * qL); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = C.warm; ctx.font = '600 72px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('?', x + Math.cos(qa) * (qL + 60), y + Math.sin(qa) * (qL + 60));
      ctx.textAlign = 'left';
    }
    if (PG.stage >= 3) {
      const cands = pgCandidates(x, y, S);
      let best = 0;
      cands.forEach((c, i) => { if (c.w > cands[best].w) best = i; });
      const L0 = 0.22 * H;
      cands.forEach((c, i) => {
        const picked = PG.stage >= 4 && i === best;
        const ex = x + Math.cos(c.a) * L0, ey = y + Math.sin(c.a) * L0;
        if (picked) {
          drawArrow(ctx, x, y, x + Math.cos(c.a) * L0 * 1.55, y + Math.sin(c.a) * L0 * 1.55, C.warm, 8);
          ctx.fillStyle = C.warm; ctx.font = 'italic 600 50px ' + MATH_FONT;
          ctx.fillText('d', x + Math.cos(c.a) * (L0 * 1.55 + 48), y + Math.sin(c.a) * (L0 * 1.55 + 48));
        } else {
          ctx.strokeStyle = 'rgba(184,191,204,0.6)'; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey); ctx.stroke();
          ctx.fillStyle = C.ours;
          // stage 3: candidates are just SAMPLED (uniform dots);
          // stage 4: each has been EVALUATED \u2014 dot size \u221d L\u1d62
          const r = PG.stage >= 4 ? 4 + 14 * Math.min(1, c.w) : 7;
          ctx.beginPath(); ctx.arc(ex, ey, r, 0, 7); ctx.fill();
        }
      });
      ctx.fillStyle = 'rgba(184,191,204,0.9)'; ctx.font = '46px sans-serif';
      // bottom-right of the fan, clear of rays, lobe and occluder
      ctx.fillText('M candidates', Math.min(W - 330, x + L0 + 60), y - 110);
    }
    // caption block \u2014 one line per beat, stacked
    ctx.font = '56px sans-serif';
    if (PG.stage >= 2) {
      ctx.fillStyle = C.text;
      ctx.fillText('a neural network can only be evaluated \u2014 it cannot be sampled directly', tx, ty + 70);
    }
    if (PG.stage >= 3) {
      ctx.fillStyle = C.text;
      ctx.fillText('Rath et al. 2025 \u2014 resampled importance sampling (RIS): draw M candidate directions from the BSDF\u2026', tx, ty + 140);
    }
    if (PG.stage >= 4) {
      ctx.fillStyle = C.warm; ctx.font = '600 56px sans-serif';
      ctx.fillText('\u2026evaluate Li at each candidate, keep one proportionally to its value', tx, ty + 210);
    }
    PG.dirty = false;
  }
  function pgLoop() {
    if (!PG.active) return;
    PG.raf = requestAnimationFrame(pgLoop);
    if (PG.dirty) pgDraw();
  }
  function pgBindPointer() {
    const c = PG.canvas;
    let drag = false;
    c.addEventListener('pointerdown', (e) => { drag = true; c.setPointerCapture(e.pointerId); });
    c.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const [px] = canvasPos(e, c);
      // x lives on the light's side of the occluder — the last path segment
      // (ceiling → x) always clears the occluder there
      PG.u = Math.min(0.92, Math.max(0.585, px / c.width));
      PG.dirty = true;
    });
    c.addEventListener('pointerup', () => { drag = false; });
  }

  /* ---------- slide 12b-i: NIRC sketch ---------- */
  const NC = { canvas: null, ctx: null, stage: 0, raf: null, active: false, dirty: true };

  function ncDraw() {
    const { ctx, canvas } = NC;
    const W = canvas.width, H = canvas.height;
    const S = scScene(W, H);
    ctx.clearRect(0, 0, W, H);
    scDrawBase(ctx, W, H, S);
    // natural path, never touching the occluder:
    // camera → floor → ceiling → floor → light
    const x1 = [W * 0.30, S.floorY];
    const tail = [
      x1,
      [W * 0.42, S.ceilY],
      [W * 0.80, S.floorY],   // clears the occluder's top corner by a wide margin
      [(S.light.a + S.light.b) / 2, S.light.y + 14],
    ];
    ctx.strokeStyle = '#b8bfcc'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(S.cam.x + 70, S.cam.y + 40); ctx.lineTo(...x1); ctx.stroke();
    // tail beyond the first vertex: full at stage 0, faded once cached
    ctx.globalAlpha = NC.stage >= 1 ? 0.18 : 1;
    for (let i = 1; i < tail.length - 1; i++) {
      drawArrow(ctx, tail[i][0], tail[i][1], tail[i + 1][0], tail[i + 1][1], '#b8bfcc', 4);
      ctx.fillStyle = '#b8bfcc';
      ctx.beginPath(); ctx.arc(tail[i][0], tail[i][1], 9, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // the first outgoing segment is the query direction d
    drawArrow(ctx, x1[0], x1[1], tail[1][0], tail[1][1], NC.stage >= 1 ? '#ff9d4d' : '#b8bfcc', 5);
    ctx.fillStyle = NC.stage >= 1 ? C.baseline : C.muted;
    ctx.font = 'italic 600 50px ' + MATH_FONT;
    ctx.fillText('d', (x1[0] + tail[1][0]) / 2 - 56, (x1[1] + tail[1][1]) / 2 + 10);
    ctx.fillStyle = C.spatial;
    ctx.beginPath(); ctx.arc(x1[0], x1[1], 15, 0, 7); ctx.fill();
    ctx.fillStyle = C.text; ctx.font = 'italic 600 52px ' + MATH_FONT;
    ctx.fillText('x', x1[0] - 58, x1[1] - 26);

    const tx = W * 0.045, ty = H * 0.865;      // caption block, BELOW the figure
    if (NC.stage === 0) {
      ctx.fillStyle = C.muted; ctx.font = '50px sans-serif';
      ctx.fillText('path tracing: keep bouncing until the light — long paths, per pixel, per sample', tx, ty);
    }
    if (NC.stage >= 1) {
      scLobe(ctx, x1[0], x1[1], S, 0.85 * H, 'rgba(199,146,234,0.18)', 'rgba(199,146,234,0.9)');
      // multiple BSDF samples, each just READS the cache — no rays traced
      const K = 6;
      for (let i = 0; i < K; i++) {
        const t = (i + 0.5) / K;
        const a = -Math.PI + (Math.PI * (1 - Math.cos(Math.PI * t))) / 2;
        const r = (0.12 + 0.22 * scIncident(a, x1[0], x1[1], S)) * H;
        ctx.strokeStyle = 'rgba(199,146,234,0.8)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(...x1);
        ctx.lineTo(x1[0] + Math.cos(a) * r, x1[1] + Math.sin(a) * r); ctx.stroke();
        ctx.fillStyle = C.directional;
        ctx.beginPath(); ctx.arc(x1[0] + Math.cos(a) * r, x1[1] + Math.sin(a) * r, 8, 0, 7); ctx.fill();
      }
      // scissors on the faded tail
      ctx.fillStyle = C.bad; ctx.font = '600 54px sans-serif';
      ctx.fillText('✂', (tail[1][0] + tail[2][0]) / 2 - 20, (tail[1][1] + tail[2][1]) / 2 + 10);
      ctx.fillStyle = C.directional; ctx.font = '600 50px ' + MATH_FONT;
      ctx.fillText('N(x, ωᵢ)', tx, ty);
      ctx.font = '50px sans-serif';
      ctx.fillText('  — stop at the first vertex: ω₁…ω_K ~ BSDF, each is ONE cache lookup, no tracing', tx + 190, ty);
    }
    if (NC.stage >= 2) {
      // extra pixels only on the camera's side — their primary rays must
      // not cross the occluder
      for (const u of [0.16, 0.44]) {
        const px = u * W, py = S.floorY;
        ctx.strokeStyle = 'rgba(184,191,204,0.55)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(S.cam.x + 70, S.cam.y + 40); ctx.lineTo(px, py); ctx.stroke();
        scLobe(ctx, px, py, S, 0.26 * H, 'rgba(199,146,234,0.15)', 'rgba(199,146,234,0.6)');
        ctx.fillStyle = C.spatial;
        ctx.beginPath(); ctx.arc(px, py, 9, 0, 7); ctx.fill();
      }
      ctx.fillStyle = C.muted; ctx.font = '50px sans-serif';
      ctx.fillText('every pixel terminates into the same learned 5D field — the whole tail becomes lookups', tx, ty + 62);
    }
    NC.dirty = false;
  }
  function ncLoop() {
    if (!NC.active) return;
    NC.raf = requestAnimationFrame(ncLoop);
    if (NC.dirty) ncDraw();
  }

  /* ============ wiring ============ */

  /* ================================================================
     Slide 1b — WHAT IS A NEURAL ENCODING?
     stage 0 : signal curve + x fed straight into an MLP
     stage 1 : a 1D feature grid appears; x picks up its 2 corner features
     stage 2 : a second point x' in the SAME cell shares those features
     ================================================================ */
  const EN = { canvas: null, ctx: null, stage: 0, raf: null, active: false, t: 0,
               prevStage: 0, stage2At: 0, xu: 0.48, xv: 0.31, drag: false };

  function enDraw() {
    const { ctx, canvas } = EN;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const bez = (p0, p1, p2, t) => (1 - t) * (1 - t) * p0 + 2 * t * (1 - t) * p1 + t * t * p2;
    const T = EN.t;
    if (EN.stage >= 2 && EN.prevStage < 2) EN.stage2At = T;   // features fade-in start
    EN.prevStage = EN.stage;

    // ---- the input domain: an abstract blob ----
    const cx = 0.27 * W, cy = 0.44 * H, R = 0.15 * W;
    const blob = new Path2D();
    for (let i = 0; i <= 140; i++) {
      const th = (i / 140) * Math.PI * 2;
      const r = R * (1 + 0.16 * Math.sin(3 * th + 1) + 0.09 * Math.sin(5 * th + 2.3));
      const px = cx + r * Math.cos(th) * 1.25, py = cy + r * Math.sin(th) * 0.82;
      i === 0 ? blob.moveTo(px, py) : blob.lineTo(px, py);
    }
    blob.closePath();
    ctx.save();
    ctx.clip(blob);
    const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.6);
    bg.addColorStop(0, '#222a3a'); bg.addColorStop(1, '#161c28');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
    ctx.strokeStyle = '#55617a'; ctx.lineWidth = 4;
    ctx.stroke(blob);
    ctx.textAlign = 'center';
    ctx.fillStyle = C.muted; ctx.font = '600 64px sans-serif';
    ctx.fillText('input domain', cx, 0.095 * H);
    ctx.textAlign = 'left';

    // ---- MLP (right) ----
    const mw = 340, mh = 300, mx = 0.775 * W, my = cy - mh / 2;
    ctx.strokeStyle = C.text; ctx.lineWidth = 4;
    ctx.strokeRect(mx, my, mw, mh);
    const colsX = [mx + 68, mx + 170, mx + 272];
    const rowsY = [
      [my + 72, my + 150, my + 228],
      [my + 56, my + 122, my + 184, my + 248],
      [my + 72, my + 150, my + 228],
    ];
    ctx.strokeStyle = C.muted; ctx.lineWidth = 2; ctx.globalAlpha = 0.55;
    for (let ci = 0; ci < 2; ci++) {
      for (const y1 of rowsY[ci]) for (const y2 of rowsY[ci + 1]) {
        ctx.beginPath(); ctx.moveTo(colsX[ci], y1); ctx.lineTo(colsX[ci + 1], y2); ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
    for (let ci = 0; ci < 3; ci++) {
      for (const yy of rowsY[ci]) {
        ctx.fillStyle = '#171c24';
        ctx.beginPath(); ctx.arc(colsX[ci], yy, 21, 0, 7); ctx.fill();
        ctx.strokeStyle = C.text; ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.arc(colsX[ci], yy, 21, 0, 7); ctx.stroke();
      }
    }
    ctx.textAlign = 'center';
    ctx.fillStyle = C.muted; ctx.font = '600 44px sans-serif';
    ctx.fillText('neural network', mx + mw / 2, my + mh + 56);
    drawArrow(ctx, mx + mw, cy, mx + mw + 80, cy, C.muted, 4);
    ctx.textAlign = 'left';
    ctx.fillStyle = C.text; ctx.font = 'italic 46px ' + MATH_FONT;
    ctx.fillText('signal(x)', mx + mw + 100, cy + 14);

    // ---- inputs & learnable features ----
    const P = (u, v) => [cx + u * R, cy + v * R];
    const feats = [P(-0.76, -0.35), P(-0.17, -0.56), P(0.46, -0.42), P(-0.88, 0.18),
                   P(-0.34, 0.09), P(0.32, 0.2), P(0.64, 0.42), P(-0.45, 0.55), P(0.08, 0.62)];
    const x1p = P(EN.xu, EN.xv);
    // the ACTIVE features are simply the nearest ones — drag x to change them
    const shared = feats
      .map((f, i) => [(f[0] - x1p[0]) ** 2 + (f[1] - x1p[1]) ** 2, i])
      .sort((q, r) => q[0] - r[0]).slice(0, 2).map((q) => q[1]);
    const bx = 0.55 * W, bw2 = 300, bh2 = 250, by = cy - bh2 / 2;   // encoding box

    if (EN.stage === 0) {
      // raw coordinate: a SINGLE value travels straight into the network
      const a0 = [x1p[0] + 14, x1p[1] - 20], a1 = [(x1p[0] + mx) / 2, cy - 0.24 * H], a2 = [mx - 70, cy - 40];
      ctx.strokeStyle = C.baseline; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(...a0);
      ctx.quadraticCurveTo(a1[0], a1[1], a2[0], a2[1]); ctx.stroke();
      drawArrow(ctx, a2[0], a2[1], mx - 22, cy - 18, C.baseline, 4);
      const tt = (T % 1800) / 1800;
      const al = Math.min(1, tt * 6, (1 - tt) * 6);
      const px = bez(a0[0], a1[0], a2[0], tt), py = bez(a0[1], a1[1], a2[1], tt);
      ctx.globalAlpha = al;
      ctx.fillStyle = C.baseline;
      ctx.fillRect(px - 17, py - 17, 34, 34);
      ctx.strokeStyle = C.text; ctx.lineWidth = 2;
      ctx.strokeRect(px - 17, py - 17, 34, 34);
      ctx.globalAlpha = 1;
    }

    if (EN.stage >= 2) {
      // learnable features pop in one after another
      feats.forEach((f, i) => {
        const a = Math.max(0, Math.min(1, (T - EN.stage2At) / 200));
        if (a <= 0) return;
        const isShared = shared.includes(i);
        ctx.globalAlpha = a;
        ctx.fillStyle = C.spatial;
        ctx.beginPath(); ctx.arc(f[0], f[1], (isShared ? 19 : 13) * (0.5 + 0.5 * a), 0, 7); ctx.fill();
        if (EN.stage >= 3 && isShared) {
          ctx.strokeStyle = C.warm; ctx.lineWidth = 5;
          ctx.beginPath(); ctx.arc(f[0], f[1], 30, 0, 7); ctx.stroke();
        }
        ctx.globalAlpha = 1;
      });
      const doneIn = T - EN.stage2At > 200;
      if (doneIn) {
        for (const i of shared) {
          ctx.strokeStyle = 'rgba(255,157,77,0.8)'; ctx.lineWidth = 3.5;
          ctx.beginPath(); ctx.moveTo(...x1p); ctx.lineTo(...feats[i]); ctx.stroke();
        }
        for (const i of shared) {
          ctx.strokeStyle = 'rgba(69,214,192,0.85)'; ctx.lineWidth = 3.5;
          ctx.beginPath(); ctx.moveTo(...feats[i]);
          ctx.quadraticCurveTo(feats[i][0] + 180, cy + 50, bx - 12, cy + 24);
          ctx.stroke();
        }
      }
      // legend: what the teal dots are — below the domain
      const lx = cx - 175, ly = cy + R * 0.92;
      ctx.fillStyle = C.spatial;
      ctx.beginPath(); ctx.arc(lx, ly - 14, 13, 0, 7); ctx.fill();
      ctx.fillStyle = C.muted; ctx.font = '42px sans-serif';
      ctx.fillText('learnable features', lx + 32, ly);
    }

    if (EN.stage >= 1) {
      // ---- the ENCODING box, always on the pipeline; its inside changes ----
      ctx.strokeStyle = C.ours; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.roundRect(bx, by, bw2, bh2, 16); ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillStyle = C.ours; ctx.font = '600 44px sans-serif';
      ctx.fillText('encoding', bx + bw2 / 2, by + bh2 + 56);
      ctx.textAlign = 'left';
      if (EN.stage === 1) {
        // view 1: fixed basis functions (continuous)
        const gx0 = bx + 26, gx1 = bx + bw2 - 26;
        const gcols = [C.ours, C.directional, '#9aa3b2'];
        for (let k = 0; k < 3; k++) {
          const gy = by + 52 + k * 74, freq = 2 * Math.pow(2, k);
          ctx.strokeStyle = gcols[k]; ctx.lineWidth = 3.5; ctx.globalAlpha = 0.85;
          ctx.beginPath();
          for (let i = 0; i <= 60; i++) {
            const u = i / 60;
            const px = gx0 + u * (gx1 - gx0), py = gy + 24 * Math.sin(freq * Math.PI * u);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      } else {
        // view 2: mirrors the domain — x interpolated between its 2 features
        const fA = [bx + 70, by + 105], fB = [bx + 230, by + 145];
        const ctr = [bx + 150, by + 125];
        ctx.strokeStyle = 'rgba(255,157,77,0.8)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(...fA); ctx.lineTo(...fB); ctx.stroke();
        for (const p of [fA, fB]) {
          ctx.fillStyle = C.spatial;
          ctx.beginPath(); ctx.arc(p[0], p[1], 16, 0, 7); ctx.fill();
        }
        ctx.fillStyle = C.baseline;
        ctx.beginPath(); ctx.arc(ctr[0], ctr[1], 12, 0, 7); ctx.fill();
      }
      // x rides into the encoding only in the basis view — in the learnable
      // view the features themselves carry the information in
      if (EN.stage === 1) {
        ctx.strokeStyle = 'rgba(255,157,77,0.7)'; ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(x1p[0] + 14, x1p[1] - 16);
        ctx.quadraticCurveTo((x1p[0] + bx) / 2, cy - 0.17 * H, bx - 14, cy - 12);
        ctx.stroke();
      }
      drawArrow(ctx, bx + bw2 + 12, cy, mx - 20, cy, C.spatial, 4);
      const t1 = (T % 2400) / 2400;
      if (t1 < 0.36) {
        const tt = t1 / 0.36;
        const al = Math.min(1, tt * 6, (1 - tt) * 6);
        if (EN.stage === 1) {
          const px = bez(x1p[0] + 14, (x1p[0] + bx) / 2, bx - 14, tt);
          const py = bez(x1p[1] - 16, cy - 0.17 * H, cy - 12, tt);
          ctx.globalAlpha = al;
          ctx.fillStyle = C.baseline;
          ctx.fillRect(px - 15, py - 15, 30, 30);
          ctx.strokeStyle = C.text; ctx.lineWidth = 2;
          ctx.strokeRect(px - 15, py - 15, 30, 30);
          ctx.globalAlpha = 1;
        }
        if (EN.stage >= 2 && T - EN.stage2At > 200) {
          ctx.globalAlpha = al; ctx.fillStyle = C.spatial;
          for (const i of shared) {
            ctx.beginPath();
            ctx.arc(bez(feats[i][0], feats[i][0] + 180, bx - 12, tt),
                    bez(feats[i][1], cy + 50, cy + 24, tt), 11, 0, 7);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }
      } else if (t1 > 0.44 && t1 < 0.98) {
        const tt = (t1 - 0.44) / 0.54;
        const al = Math.min(1, tt * 6, (1 - tt) * 6);
        const sx = bx + bw2 + 26 + (mx - 140 - bx - bw2 - 26) * tt;
        for (let k = 0; k < 4; k++) {
          ctx.globalAlpha = al * (0.9 - 0.17 * k);
          ctx.fillStyle = C.spatial;
          ctx.fillRect(sx + k * 26, cy - 13, 26, 26);
          ctx.globalAlpha = al;
          ctx.strokeStyle = C.text; ctx.lineWidth = 2;
          ctx.strokeRect(sx + k * 26, cy - 13, 26, 26);
        }
        ctx.globalAlpha = 1;
      }
    }

    // x itself
    ctx.fillStyle = C.baseline;
    ctx.beginPath(); ctx.arc(x1p[0], x1p[1], 16, 0, 7); ctx.fill();
    ctx.font = 'italic 600 52px ' + MATH_FONT;
    ctx.textAlign = 'center';
    ctx.fillText('x', x1p[0] - 6, x1p[1] - 40);
    ctx.textAlign = 'left';

    // captions, one per beat
    const tx = 0.045 * W, ty = 0.84 * H;
    ctx.font = '56px sans-serif';
    ctx.fillStyle = C.text;
    ctx.fillText('a network alone must learn the signal point by point', tx, ty);
    if (EN.stage >= 1) {
      ctx.fillText('an encoding embeds the input into basis functions\u2026', tx, ty + 70);
    }
    if (EN.stage >= 2) {
      ctx.fillText('\u2026or into nearby learnable features', tx, ty + 140);
    }
    if (EN.stage >= 3) {
      ctx.fillStyle = C.warm; ctx.font = '600 56px sans-serif';
      ctx.fillText('an encoding gives a sense of neighborhood to the network', tx, ty + 210);
    }
  }
  function enLoop() {
    if (!EN.active) return;
    EN.raf = requestAnimationFrame(enLoop);
    EN.t = performance.now();
    enDraw();
  }
  function enBindPointer() {
    const c = EN.canvas;
    const toUV = (e) => {
      const [px, py] = canvasPos(e, c);
      const W = c.width, H = c.height;
      const cx = 0.27 * W, cy = 0.44 * H, R = 0.15 * W;
      let u = (px - cx) / R, v = (py - cy) / R;
      // clamp inside the wobbly blob boundary
      const eu = u / 1.25, ev = v / 0.82;
      const rho = Math.hypot(eu, ev);
      const th = Math.atan2(ev, eu);
      const rmax = 0.88 * (1 + 0.16 * Math.sin(3 * th + 1) + 0.09 * Math.sin(5 * th + 2.3));
      if (rho > rmax) { u *= rmax / rho; v *= rmax / rho; }
      return [u, v];
    };
    c.addEventListener('pointerdown', (e) => {
      const [px, py] = canvasPos(e, c);
      const W = c.width, H = c.height;
      const cx = 0.27 * W, cy = 0.44 * H, R = 0.15 * W;
      const xp = [cx + EN.xu * R, cy + EN.xv * R];
      if (Math.hypot(px - xp[0], py - xp[1]) < 70) {
        EN.drag = true; c.setPointerCapture(e.pointerId);
      }
    });
    c.addEventListener('pointermove', (e) => {
      if (!EN.drag) return;
      [EN.xu, EN.xv] = toUV(e);
    });
    c.addEventListener('pointerup', () => { EN.drag = false; });
  }

  function toggle(obj, on, loopFn) {
    if (on) { obj.active = true; obj.dirty = true; loopFn(); }
    else { obj.active = false; if (obj.raf) cancelAnimationFrame(obj.raf); }
  }
  function syncSlide(slide) {
    const name = slide && slide.dataset.slide;
    if (name === 'what-encoding' && !EN.canvas && setupCanvas('enc-canvas', EN)) enBindPointer();
    toggle(EN, name === 'what-encoding', enLoop);
    if (name === 'dir-motivation' && !DE.canvas) setupCanvas('dirmot-canvas', DE);
    toggle(DE, name === 'dir-motivation', deLoop);
    if (name === 'motivation' && !MV.canvas && setupCanvas('motiv-canvas', MV)) mvBindPointer();
    toggle(MV, name === 'motivation', mvLoop);
    if (name === 'hashgrid-recap' && !HG.canvas && setupCanvas('hashgrid-canvas', HG)) hgBindPointer();
    toggle(HG, name === 'hashgrid-recap', hgLoop);
    if (name === 'path-guiding' && !PG.canvas && setupCanvas('pathguide-canvas', PG)) pgBindPointer();
    toggle(PG, name === 'path-guiding', pgLoop);
    if (name === 'nirc-sketch' && !NC.canvas) setupCanvas('nirc-canvas', NC);
    toggle(NC, name === 'nirc-sketch', ncLoop);
    if (name === 'limitations' && slide) {
      slide.querySelectorAll('.bar-fill').forEach((b) => { b.style.width = b.dataset.w; });
    }
  }
  function initAll() {
    Reveal.on('slidechanged', (e) => syncSlide(e.currentSlide));
    const each = (e) => (e.fragments && e.fragments.length ? e.fragments : [e.fragment]);
    Reveal.on('fragmentshown', (e) => {
      for (const f of each(e)) {
        if (f.dataset.enStage) { EN.stage = +f.dataset.enStage; EN.dirty = true; }
        if (f.dataset.deStage) { DE.stage = +f.dataset.deStage; DE.dirty = true; }
        if (f.dataset.mvStage) { MV.stage = +f.dataset.mvStage; MV.frozen = null; MV.dirty = true; }
        if (f.dataset.hg2Stage) { HG.stage = +f.dataset.hg2Stage; HG.dirty = true; }
        if (f.dataset.pgStage) { PG.stage = +f.dataset.pgStage; PG.dirty = true; }
        if (f.dataset.ncStage) { NC.stage = +f.dataset.ncStage; NC.dirty = true; }
      }
    });
    Reveal.on('fragmenthidden', (e) => {
      for (const f of each(e)) {
        if (f.dataset.enStage) { EN.stage = +f.dataset.enStage - 1; EN.dirty = true; }
        if (f.dataset.deStage) { DE.stage = +f.dataset.deStage - 1; DE.dirty = true; }
        if (f.dataset.mvStage) { MV.stage = +f.dataset.mvStage - 1; MV.frozen = null; MV.dirty = true; }
        if (f.dataset.hg2Stage) { HG.stage = +f.dataset.hg2Stage - 1; HG.dirty = true; }
        if (f.dataset.pgStage) { PG.stage = +f.dataset.pgStage - 1; PG.dirty = true; }
        if (f.dataset.ncStage) { NC.stage = +f.dataset.ncStage - 1; NC.dirty = true; }
      }
    });
    // restore stages when loading directly onto a slide with visible fragments
    const restore = () => {
      document.querySelectorAll('.fragment.visible').forEach((f) => {
        if (f.dataset.enStage) EN.stage = Math.max(EN.stage, +f.dataset.enStage);
        if (f.dataset.deStage) DE.stage = Math.max(DE.stage, +f.dataset.deStage);
        if (f.dataset.mvStage) MV.stage = Math.max(MV.stage, +f.dataset.mvStage);
        if (f.dataset.hg2Stage) HG.stage = Math.max(HG.stage, +f.dataset.hg2Stage);
        if (f.dataset.pgStage) PG.stage = Math.max(PG.stage, +f.dataset.pgStage);
        if (f.dataset.ncStage) NC.stage = Math.max(NC.stage, +f.dataset.ncStage);
      });
      syncSlide(Reveal.getCurrentSlide());
    };
    setTimeout(restore, 80);
  }

  if (window.Reveal && Reveal.isReady && Reveal.isReady()) initAll();
  else if (window.Reveal) Reveal.on('ready', initAll);
})();
