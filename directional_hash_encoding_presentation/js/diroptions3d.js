/* diroptions3d.js — "can't we just hash-grid the directions?" slide.
 * ONE shared direction d drives both panels:
 *  Left : flat 2D grid on (θ, φ) with the encoded point + fading trail —
 *         drag in the square, or watch it race near the poles while you
 *         drag d on the right.
 *  Right: the 3D hash-grid view — normalized directions live in [0,1]³, the
 *         unit sphere touches the grid bounds exactly. Cells touched by the
 *         shell are highlighted, everything else dimmed; the current cell +
 *         its 8 off-sphere corners track d. Orbitable; drag the orange dot.
 */
(() => {
  const COL = {
    bad: '#ff5c77', grid: 0x4a5468, shell: 0x9aa3b2,
    cur: 0xff9d4d, sphere: 0x6a7484,
  };
  const N = 8;                       // grid resolution (coarse = readable)
  let d = norm([0.55, 0.35, 0.75]);  // shared direction
  let flat = null;                   // 2D canvas state
  let mini = null;                   // three.js state
  let trail = [];
  let active = false, raf = null;

  function norm(v) { const l = Math.hypot(v[0], v[1], v[2]); return [v[0]/l, v[1]/l, v[2]/l]; }
  function thetaPhi(v) {
    return [Math.acos(Math.max(-1, Math.min(1, v[2]))), Math.atan2(v[1], v[0])];
  }
  function fromThetaPhi(th, ph) {
    return [Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th)];
  }
  const TRAIL_MS = 1500;               // trail fades out when d stops moving
  function pushTrail() {
    const [th, ph] = thetaPhi(d);
    trail.push([th, ph, performance.now()]);
    if (trail.length > 40) trail.shift();
  }

  /* ---------- left: flat (θ, φ) panel ---------- */
  function flatDraw() {
    if (!flat) return;
    const { ctx, canvas } = flat;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const padL = 104, padB = 56, padT = 16, padR = 16;
    const gw = W - padL - padR, gh = H - padT - padB;
    // pole rows tinted: cells there map to almost no solid angle
    ctx.fillStyle = 'rgba(255,92,119,0.16)';
    ctx.fillRect(padL, padT, gw, gh / 8);
    ctx.fillRect(padL, padT + gh * 7 / 8, gw, gh / 8);
    // grid 16 × 8
    ctx.strokeStyle = 'rgba(255,92,119,0.75)'; ctx.lineWidth = 2;
    for (let i = 0; i <= 16; i++) {
      const x = padL + (i / 16) * gw;
      ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, padT + gh); ctx.stroke();
    }
    for (let j = 0; j <= 8; j++) {
      const y = padT + (j / 8) * gh;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + gw, y); ctx.stroke();
    }
    // axes labels
    ctx.fillStyle = '#9aa3b2'; ctx.font = '46px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('φ', padL + gw / 2, H - 8);
    ctx.save(); ctx.translate(40, padT + gh / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText('θ', 0, 0); ctx.restore();
    ctx.font = '38px sans-serif';
    ctx.fillText('pole', padL - 52, padT + gh / 16 + 8);
    ctx.fillText('pole', padL - 52, padT + gh * 15 / 16 + 8);
    ctx.textAlign = 'left';
    // trail (fades with age, disappears once d stops moving) + marker
    const toXY = (th, ph) => [padL + ((ph + Math.PI) / (2 * Math.PI)) * gw, padT + (th / Math.PI) * gh];
    const now = performance.now();
    trail = trail.filter((t) => now - t[2] < TRAIL_MS);
    for (const [th, ph, t0] of trail) {
      const [x, y] = toXY(th, ph);
      ctx.fillStyle = `rgba(255,157,77,${0.55 * (1 - (now - t0) / TRAIL_MS)})`;
      ctx.beginPath(); ctx.arc(x, y, 7, 0, 7); ctx.fill();
    }
    const [th, ph] = thetaPhi(d);
    const [mx, my] = toXY(th, ph);
    ctx.fillStyle = '#ff9d4d';
    ctx.beginPath(); ctx.arc(mx, my, 13, 0, 7); ctx.fill();
    ctx.strokeStyle = '#e8eaf0'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(mx, my, 13, 0, 7); ctx.stroke();
  }
  function flatBind() {
    const c = flat.canvas;
    let drag = false;
    const set = (e) => {
      const r = c.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * c.width;
      const py = ((e.clientY - r.top) / r.height) * c.height;
      const padL = 104, padB = 56, padT = 16, padR = 16;
      const gw = c.width - padL - padR, gh = c.height - padT - padB;
      const ph = Math.max(-Math.PI, Math.min(Math.PI, ((px - padL) / gw) * 2 * Math.PI - Math.PI));
      const th = Math.max(0.02, Math.min(Math.PI - 0.02, ((py - padT) / gh) * Math.PI));
      d = fromThetaPhi(th, ph);
      pushTrail();
      syncAll();
    };
    c.addEventListener('pointerdown', (e) => { drag = true; c.setPointerCapture(e.pointerId); set(e); });
    c.addEventListener('pointermove', (e) => { if (drag) set(e); });
    c.addEventListener('pointerup', () => { drag = false; });
  }

  /* ---------- right: 3D grid + shell ---------- */
  function boxTouchesShell(i, j, k) {
    // cell [i,j,k]/N … does it intersect the sphere surface (c=0.5, r=0.5)?
    const lo = [i / N, j / N, k / N], hi = [(i + 1) / N, (j + 1) / N, (k + 1) / N];
    let dmin = 0, dmax = 0;
    for (let a = 0; a < 3; a++) {
      const c = 0.5;
      const lo2 = (lo[a] - c) * (lo[a] - c), hi2 = (hi[a] - c) * (hi[a] - c);
      dmax += Math.max(lo2, hi2);
      if (lo[a] > c) dmin += lo2;
      else if (hi[a] < c) dmin += hi2;
    }
    const r2 = 0.25;
    return dmin <= r2 && dmax >= r2;
  }
  function cellEdges(i, j, k, s) {
    const p = (a, b, c) => [(i + a) * s, (j + b) * s, (k + c) * s];
    const e = [];
    const P = [p(0,0,0), p(1,0,0), p(1,1,0), p(0,1,0), p(0,0,1), p(1,0,1), p(1,1,1), p(0,1,1)];
    const idx = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
    for (const [a, b] of idx) e.push(P[a], P[b]);
    return e;
  }
  function buildMini() {
    const container = document.getElementById('diropt-cart');
    if (!container || container.dataset.inited) return null;
    container.dataset.inited = '1';
    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 50);
    camera.up.set(0, 0, 1);
    camera.position.set(1.75, -1.3, 1.3);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio / (Reveal.getScale() || 1), 2.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.08;
    controls.enablePan = false; controls.enableZoom = false;
    controls.target.set(0.5, 0.5, 0.5);

    // dim background grid
    const gpos = [];
    for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
      const a = i / N, b = j / N;
      gpos.push(a, b, 0, a, b, 1,  a, 0, b, a, 1, b,  0, a, b, 1, a, b);
    }
    const gg = new THREE.BufferGeometry();
    gg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(gpos), 3));
    scene.add(new THREE.LineSegments(gg, new THREE.LineBasicMaterial({
      color: COL.grid, transparent: true, opacity: 0.22,
    })));
    // shell cells highlighted
    const spos = [];
    let shellCount = 0;
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) for (let k = 0; k < N; k++) {
      if (!boxTouchesShell(i, j, k)) continue;
      shellCount++;
      for (const p of cellEdges(i, j, k, 1 / N)) spos.push(...p);
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(spos), 3));
    scene.add(new THREE.LineSegments(sg, new THREE.LineBasicMaterial({
      color: COL.shell, transparent: true, opacity: 0.5,
    })));
    const cnt = document.getElementById('diropt-count');
    if (cnt) cnt.textContent = `${shellCount} of ${N * N * N} cells, ${Math.round(100 * shellCount / (N * N * N))}%`;
    // the sphere itself: |d| = 1 mapped to [0,1]³ → touches the bounds
    // OPAQUE inner sphere — hides far-side cells so the shell reads clean
    const shellMesh = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5, 48, 32),
      new THREE.MeshBasicMaterial({ color: 0x222a36 }),
    );
    shellMesh.position.set(0.5, 0.5, 0.5);
    scene.add(shellMesh);
    const shellWire = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.5005, 24, 16),
      new THREE.MeshBasicMaterial({ color: COL.sphere, wireframe: true, transparent: true, opacity: 0.18 }),
    );
    shellWire.position.set(0.5, 0.5, 0.5);
    shellWire.rotation.x = Math.PI / 2;   // poles along ±z, matching θ = acos(d·z)
    scene.add(shellWire);
    // current direction: dot + its cell + corner dots (off the sphere!)
    const marker = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.032, 14, 14),
      new THREE.MeshBasicMaterial({ color: COL.cur }),
    );
    scene.add(marker);
    const cellGroup = new THREE.Group();
    scene.add(cellGroup);

    // drag the marker on the sphere (capture-phase, like the other widgets)
    const ray = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let dragging = false;
    const toMouse = (e) => {
      const r = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };
    container.addEventListener('pointerdown', (e) => {
      toMouse(e);
      ray.setFromCamera(mouse, camera);
      const mpos = new THREE.Vector3(0.5 + d[0] / 2, 0.5 + d[1] / 2, 0.5 + d[2] / 2);
      if (ray.ray.distanceToPoint(mpos) < 0.09) { dragging = true; e.stopPropagation(); }
    }, true);
    window.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      toMouse(e);
      ray.setFromCamera(mouse, camera);
      const sph = new THREE.Sphere(new THREE.Vector3(0.5, 0.5, 0.5), 0.5);
      const hit = new THREE.Vector3();
      if (ray.ray.intersectSphere(sph, hit)) {
        d = norm([hit.x - 0.5, hit.y - 0.5, hit.z - 0.5]);
        pushTrail();
        syncAll();
      }
    });
    window.addEventListener('pointerup', () => { dragging = false; });

    return { scene, camera, renderer, controls, marker, cellGroup };
  }
  function miniSync() {
    if (!mini) return;
    const p = [0.5 + d[0] / 2, 0.5 + d[1] / 2, 0.5 + d[2] / 2];
    mini.marker.position.set(...p);
    while (mini.cellGroup.children.length) mini.cellGroup.remove(mini.cellGroup.children[0]);
    const f = p.map((v) => Math.min(N - 1, Math.floor(v * N)));
    const s = 1 / N;
    const box = new THREE.Box3(
      new THREE.Vector3(f[0] * s, f[1] * s, f[2] * s),
      new THREE.Vector3((f[0] + 1) * s, (f[1] + 1) * s, (f[2] + 1) * s),
    );
    mini.cellGroup.add(new THREE.Box3Helper(box, COL.cur));
    for (let dx = 0; dx <= 1; dx++) for (let dy = 0; dy <= 1; dy++) for (let dz = 0; dz <= 1; dz++) {
      const cd = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.013, 10, 10),
        new THREE.MeshBasicMaterial({ color: COL.cur }),
      );
      cd.position.set((f[0] + dx) * s, (f[1] + dy) * s, (f[2] + dz) * s);
      mini.cellGroup.add(cd);
    }
  }

  function syncAll() { flatDraw(); miniSync(); if (ctrl) ctrl.sync(); }

  /* ---------- the shared direction control (small sphere + arrow) ---------- */
  let ctrl = null;
  function buildCtrl() {
    const container = document.getElementById('diropt-ctrl');
    if (!container || container.dataset.inited) return null;
    container.dataset.inited = '1';
    const scene = new THREE.Scene();
    scene.background = null;
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    camera.up.set(0, 0, 1);
    // far enough back that the arrow tip (1.35 + cone) never clips the canvas
    camera.position.set(0.8, -4.3, 1.5);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio / (Reveal.getScale() || 1), 2.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.08;
    controls.enablePan = false; controls.enableZoom = false;
    const wire = new THREE.Mesh(
      new THREE.SphereBufferGeometry(1, 24, 16),
      new THREE.MeshBasicMaterial({ color: 0x9aa3b2, wireframe: true, transparent: true, opacity: 0.3 }),
    );
    wire.rotation.x = Math.PI / 2;        // poles along ±z, same as the 3D panel
    scene.add(wire);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff9d4d });
    const lineG = new THREE.BufferGeometry();
    lineG.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    const shaft = new THREE.Line(lineG, new THREE.LineBasicMaterial({ color: 0xff9d4d }));
    const cone = new THREE.Mesh(new THREE.ConeBufferGeometry(0.09, 0.26, 14), mat);
    const dot = new THREE.Mesh(new THREE.SphereBufferGeometry(0.06, 14, 14), mat);
    scene.add(shaft, cone, dot);
    const sync = () => {
      shaft.geometry.attributes.position.array.set([0, 0, 0, d[0] * 1.35, d[1] * 1.35, d[2] * 1.35]);
      shaft.geometry.attributes.position.needsUpdate = true;
      cone.position.set(d[0] * 1.35, d[1] * 1.35, d[2] * 1.35);
      cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...d));
      dot.position.set(...d);
    };
    sync();
    // drag the tip → shared d
    const ray = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let dragging = false;
    const toMouse = (e) => {
      const r = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    };
    container.addEventListener('pointerdown', (e) => {
      toMouse(e);
      ray.setFromCamera(mouse, camera);
      const tip = new THREE.Vector3(d[0] * 1.35, d[1] * 1.35, d[2] * 1.35);
      if (ray.ray.distanceToPoint(tip) < 0.3 || ray.ray.distanceToPoint(new THREE.Vector3(...d)) < 0.25) {
        dragging = true; e.stopPropagation();
      }
    }, true);
    window.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      toMouse(e);
      ray.setFromCamera(mouse, camera);
      const sph = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 1);
      const hit = new THREE.Vector3();
      if (ray.ray.intersectSphere(sph, hit)) {
        d = norm([hit.x, hit.y, hit.z]);
        pushTrail();
        syncAll();
      }
    });
    window.addEventListener('pointerup', () => { dragging = false; });
    return { scene, camera, renderer, controls, sync };
  }

  /* orbiting one sphere orbits the other identically (shared view angles) */
  let syncingCam = false;
  function copyAngles(from, to) {
    const sa = new THREE.Spherical().setFromVector3(
      from.camera.position.clone().sub(from.controls.target));
    const sb = new THREE.Spherical().setFromVector3(
      to.camera.position.clone().sub(to.controls.target));
    sb.theta = sa.theta; sb.phi = sa.phi;
    to.camera.position.copy(to.controls.target)
      .add(new THREE.Vector3().setFromSpherical(sb));
    to.camera.lookAt(to.controls.target);
  }
  function linkCameras() {
    if (!mini || !ctrl || linkCameras.done) return;
    linkCameras.done = true;
    const link = (a, b) => a.controls.addEventListener('change', () => {
      if (syncingCam) return;
      syncingCam = true; copyAngles(a, b); syncingCam = false;
    });
    link(mini, ctrl); link(ctrl, mini);
    copyAngles(mini, ctrl);               // start aligned
  }

  function init() {
    const c = document.getElementById('diropt-thetaphi');
    if (c && !c.dataset.inited) {
      c.dataset.inited = '1';
      c.width = c.clientWidth * 2; c.height = c.clientHeight * 2;
      flat = { canvas: c, ctx: c.getContext('2d') };
      flatBind();
    }
    if (!mini) mini = buildMini();
    if (!ctrl) ctrl = buildCtrl();
    linkCameras();
    pushTrail();
    syncAll();
  }

  function loop() {
    if (!active) return;
    raf = requestAnimationFrame(loop);
    if (trail.length) flatDraw();        // keep fading the trail while idle
    if (mini) { mini.controls.update(); mini.renderer.render(mini.scene, mini.camera); }
    if (ctrl) { ctrl.controls.update(); ctrl.renderer.render(ctrl.scene, ctrl.camera); }
  }

  window.DeckWidgets = window.DeckWidgets || [];
  window.DeckWidgets.push({
    slide: 'direction-failures',
    init,
    activate() { active = true; loop(); },
    deactivate() { active = false; if (raf) cancelAnimationFrame(raf); },
  });
})();
