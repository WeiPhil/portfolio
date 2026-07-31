/* hashgridsphere3d.js — interactive HashGridSphere widget (slide 7).
 *
 * Fig-4 story (fragments with data-hg-stage), single level for simplicity:
 *  slide shown : the HashSphere alone (big geodesic sphere + arrow d)
 *  stage 1     : ANIMATED — the sphere shrinks onto one voxel corner, the
 *                arrow shrinks onto the query x (voxel center), and the other
 *                seven corner-spheres grow in. Sphere opacity ∝ trilinear
 *                weight of its corner; triangle-vertex dots ∝ barycentric β.
 *  stage 2..5  : gathering lines + bullets, one per click
 * Drag teal x on its plane (arrow follows), drag the orange tip to rotate d.
 */
(() => {
  const COL = {
    bg: 0x0e1116, grid: 0x4a5468, voxel: 0x45d6c0, sphereWire: 0x9a86c8,
    tri: 0xc792ea, x: 0x45d6c0, dir: 0xff9d4d, pair: 0xe8eaf0,
  };
  const LD = 1;              // directional level shown (80 tris)
  const R_BIG = 0.42;        // stage-0 sphere radius
  const R_SMALL = 0.12;      // corner-sphere radius
  const ALEN = 0.34;         // arrow length once anchored on x
  // ONE fixed voxel — the whole story happens inside it
  const VOX = { c0: [0.28, 0.28, 0.28], s: 0.44 };

  let scene, camera, renderer, controls, root;
  let levels;
  let voxelGroup, sphereProto = null, sphereGroup, dirGroup, panel, tag;
  // x starts EXACTLY at the voxel center: all 8 corner weights equal, so the
  // interpolation reveal comes as a surprise when the presenter first drags it
  let x = [0.5, 0.5, 0.5], d = norm3([0.6, 0.35, 0.7]);
  let stage = 0, anim = null;   // anim: {t0, dur} for the shrink transition
  let dragging = null, raf = null, active = false;

  function norm3(v) { const l = Math.hypot(v[0], v[1], v[2]); return [v[0]/l, v[1]/l, v[2]/l]; }
  function corners() {
    const { c0, s } = VOX;
    const out = [];
    for (let dz = 0; dz <= 1; dz++) for (let dy = 0; dy <= 1; dy++) for (let dx = 0; dx <= 1; dx++) {
      out.push([c0[0] + dx * s, c0[1] + dy * s, c0[2] + dz * s]);
    }
    return out;
  }
  // the "main" corner (the one the big sphere shrinks onto): (+1,+1,+1)
  function mainCornerIndex() { return 7; }
  // trilinear weight of corner i for the current x
  function cornerWeights() {
    const { c0, s } = VOX;
    const w = x.map((v, i) => (v - c0[i]) / s);
    return corners().map((_, i) => {
      const dx = i & 1, dy = (i >> 1) & 1, dz = (i >> 2) & 1;
      return (dx ? w[0] : 1 - w[0]) * (dy ? w[1] : 1 - w[1]) * (dz ? w[2] : 1 - w[2]);
    });
  }

  /* ---------- voxel + x marker (appear together at stage 1) ---------- */
  function buildVoxel() { voxelGroup = new THREE.Group(); root.add(voxelGroup); }
  function refreshVoxel() {
    while (voxelGroup.children.length) {
      const c = voxelGroup.children.pop();
      if (c.geometry) { c.geometry.dispose(); c.material.dispose(); }
    }
    if (stage < 1) return;
    const { c0, s } = VOX;
    // x marker — lives inside the single voxel
    const xDot = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.035, 16, 16),
      new THREE.MeshBasicMaterial({ color: COL.x }),
    );
    xDot.position.set(x[0], x[1], x[2]);
    voxelGroup.add(xDot);
    const box = new THREE.Box3(
      new THREE.Vector3(...c0),
      new THREE.Vector3(c0[0] + s, c0[1] + s, c0[2] + s),
    );
    voxelGroup.add(new THREE.Box3Helper(box, COL.voxel));
    // trilinear corner weights w_c(x) — dot size ∝ weight
    const w = x.map((v, i) => (v - c0[i]) / s);
    for (let dx = 0; dx <= 1; dx++) for (let dy = 0; dy <= 1; dy++) for (let dz = 0; dz <= 1; dz++) {
      const wt = (dx ? w[0] : 1 - w[0]) * (dy ? w[1] : 1 - w[1]) * (dz ? w[2] : 1 - w[2]);
      const dot = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.014 + 0.042 * wt, 12, 12),
        new THREE.MeshBasicMaterial({ color: COL.voxel }),
      );
      dot.position.set(c0[0] + dx * s, c0[1] + dy * s, c0[2] + dz * s);
      voxelGroup.add(dot);
    }
  }

  /* ---------- geodesic sphere prototype ---------- */
  function sphereWireGeometryAt(ld) {
    const L = levels[ld];
    const edges = new Set();
    for (const [a, b, c] of L.faces) {
      for (const [i, j] of [[a,b],[b,c],[c,a]]) edges.add(i < j ? i + '_' + j : j + '_' + i);
    }
    const pos = new Float32Array(edges.size * 6);
    let k = 0;
    for (const e of edges) {
      const [i, j] = e.split('_').map(Number);
      pos.set(L.vertices[i], k); pos.set(L.vertices[j], k + 3); k += 6;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }
  function makeSphere(opacity = 1, withArrow = false, ld = LD, tint = null) {
    const grp = new THREE.Group();
    // the icosahedron wireframe stays fully visible — only the highlighted
    // triangle (and its dots/arrow) fades with the trilinear weight
    grp.add(new THREE.LineSegments(ld === LD ? sphereProto : sphereWireGeometryAt(ld),
      new THREE.LineBasicMaterial({
        color: tint || COL.sphereWire, transparent: true, opacity: 0.85,
      })));
    // enclosing triangle of d + vertex dots sized by barycentric weight
    const path = Icosphere.traverse(d, levels, ld + 1);
    const { tri, beta } = path[ld];
    const V = levels[ld].vertices;
    const tp = new Float32Array(9);
    tp.set(V[tri[0]], 0); tp.set(V[tri[1]], 3); tp.set(V[tri[2]], 6);
    const tg = new THREE.BufferGeometry();
    tg.setAttribute('position', new THREE.BufferAttribute(tp, 3));
    const tm = new THREE.Mesh(tg, new THREE.MeshBasicMaterial({
      color: COL.tri, transparent: true, opacity: 0.75 * opacity,
      side: THREE.DoubleSide, depthWrite: false,
    }));
    tm.scale.setScalar(1.01);
    grp.add(tm);
    tri.forEach((vi, j) => {
      const dot = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.035 + 0.085 * beta[j], 10, 10),
        new THREE.MeshBasicMaterial({ color: COL.tri, transparent: true, opacity: opacity }),
      );
      dot.position.set(...V[vi]);
      dot.userData.triVertex = V[vi];
      grp.add(dot);
    });
    if (withArrow) {
      // small per-sphere arrow along d (local units — the group is scaled)
      const mat = new THREE.MeshBasicMaterial({ color: COL.dir });
      const lineG = new THREE.BufferGeometry();
      lineG.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        0, 0, 0, d[0] * 1.45, d[1] * 1.45, d[2] * 1.45,
      ]), 3));
      grp.add(new THREE.Line(lineG, new THREE.LineBasicMaterial({ color: COL.dir })));
      const cone = new THREE.Mesh(new THREE.ConeBufferGeometry(0.065, 0.19, 14), mat);
      cone.position.set(d[0] * 1.45, d[1] * 1.45, d[2] * 1.45);
      cone.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0), new THREE.Vector3(d[0], d[1], d[2]),
      );
      grp.add(cone);
      const dot = new THREE.Mesh(new THREE.SphereBufferGeometry(0.045, 14, 14), mat);
      dot.position.set(d[0], d[1], d[2]);
      grp.add(dot);
    }
    return grp;
  }

  /* ---------- the direction arrow — anchored on the 5D query point ---------- */
  function buildDir() {
    dirGroup = new THREE.Group();
    const lineG = new THREE.BufferGeometry();
    lineG.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    const line = new THREE.Line(lineG, new THREE.LineBasicMaterial({ color: COL.dir }));
    line.name = 'dline';
    const cone = new THREE.Mesh(
      new THREE.ConeBufferGeometry(0.018, 0.055, 14),
      new THREE.MeshBasicMaterial({ color: COL.dir }),
    );
    cone.name = 'dcone';
    dirGroup.add(line, cone);
    root.add(dirGroup);
  }
  // where the arrow starts and how long it is (tAnim: 0..1 during the shrink)
  function arrowPose(tAnim = null) {
    if (stage === 0) return { a: [0.5, 0.5, 0.5], len: R_BIG * 1.55 };
    const len = tAnim == null ? ALEN : R_BIG * 1.55 + (ALEN - R_BIG * 1.55) * tAnim;
    return { a: x, len };
  }
  function refreshDir(tAnim = null) {
    const { a, len } = arrowPose(tAnim);
    const tip = [a[0] + d[0] * len, a[1] + d[1] * len, a[2] + d[2] * len];
    const p = dirGroup.getObjectByName('dline').geometry.attributes.position;
    p.array.set([a[0], a[1], a[2], tip[0], tip[1], tip[2]]);
    p.needsUpdate = true;
    const cone = dirGroup.getObjectByName('dcone');
    // bigger head on the big sphere, shrinking smoothly during the transition
    const cs = stage === 0 ? 2.6 : (tAnim != null ? 2.6 + (1 - 2.6) * tAnim : 1);
    cone.scale.setScalar(cs);
    cone.position.set(...tip);
    cone.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0), new THREE.Vector3(d[0], d[1], d[2]),
    );
  }

  /* ---------- sphere layout per stage ---------- */
  function refreshSpheres() {
    while (sphereGroup.children.length) sphereGroup.remove(sphereGroup.children[0]);
    const cs = corners();
    if (stage === 0) {
      const s = makeSphere(1, false);
      s.scale.setScalar(R_BIG);
      s.position.set(0.5, 0.5, 0.5);
      sphereGroup.add(s);
    } else {
      // one HashSphere per corner, each with its own small arrow along d;
      // the triangle highlight fades with the trilinear weight of the corner
      // (relative to the largest weight — all equal ⇒ all fully visible)
      const w = cornerWeights();
      const wmax = Math.max(...w);
      cs.forEach((c, i) => {
        const s = makeSphere(0.22 + 0.78 * (w[i] / wmax), true);
        s.scale.setScalar(R_SMALL);
        s.position.set(...c);
        sphereGroup.add(s);
      });
    }
    refreshDir(anim ? 0 : null);
  }

  /* ---------- overlays ---------- */
  function buildOverlays(container) {
    panel = document.createElement('div');
    Object.assign(panel.style, {
      position: 'absolute', top: '265px', right: '0px', width: '1080px',
      padding: '26px 30px', boxSizing: 'border-box', fontSize: '34px', lineHeight: '1.55',
      color: 'var(--text)', display: 'none', pointerEvents: 'none',
      textAlign: 'left', overflow: 'hidden',
    });
    container.appendChild(panel);
    tag = document.createElement('div');
    Object.assign(tag.style, {
      position: 'absolute', top: '18px', left: '22px', pointerEvents: 'none',
      fontSize: '34px', fontWeight: '700', color: 'var(--text)', textAlign: 'left',
      lineHeight: '1.4',
    });
    container.appendChild(tag);
  }
  function updateOverlays() {
    // kicker completes itself once the voxel is revealed
    const kickerTo = document.getElementById('hg-kicker-to');
    if (kickerTo) {
      kickerTo.innerHTML = stage >= 1
        ? '<span class="spatial">HashGrid</span><span class="directional">Sphere</span>'
        : '..';
    }
    if (stage === 0) {
      tag.innerHTML = `<span style="color:var(--c-directional)">the HashSphere</span>`;
    } else {
      tag.innerHTML = `one <span style="color:var(--c-directional)">HashSphere</span> per <span style="color:var(--c-spatial)">voxel corner</span>`;
    }
    // slide the 3D scene left once the bullets start, freeing the right side
    if (renderer) {
      renderer.domElement.style.transition = 'transform 0.5s ease';
      renderer.domElement.style.transform = stage >= 2 ? 'translateX(-470px)' : 'none';
    }
    if (stage < 2) { panel.style.display = 'none'; return; }
    panel.style.display = 'block';
    // bullets appear one by one: stage 2 → 1 bullet, … stage 5 → all 4
    const bullets = [
      `— 8 corners × 3 vertices = <b>24 lookups</b> per level,<br>
        <span style="color:var(--text-muted); font-size:30px; white-space:nowrap"><b>5D-interpolated</b> (trilinear in <span style="color:var(--c-spatial)">x</span> × barycentric in <span style="color:var(--c-baseline)">d</span>)</span>`,
      `— <b>joint hash</b> encoding&nbsp;
        <span class="math" style="color:var(--text-muted)">h(<span style="color:var(--c-spatial)">corner</span>, <span style="color:var(--c-directional)">vertex</span>)</span>`,
      `— trivially <b>multi-resolution</b>`,
      `— control over <b>directional & positional frequency</b>`,
    ].slice(0, stage - 1);
    panel.innerHTML = `
      <ul style="list-style:none; margin:10px 0 0; padding:0; line-height:1.55">
        ${bullets.map((b) => `<li style="padding-left:36px; text-indent:-36px; margin-bottom:22px">${b}</li>`).join('')}
      </ul>`;
  }

  /* ---------- refresh ---------- */
  function refreshAll() {
    refreshVoxel(); refreshSpheres(); updateOverlays();
  }

  function setStage(s, skipAnim = false) {
    const prev = stage;
    stage = s;
    // the shrink-onto-the-corner transition: big sphere → main corner while
    // the arrow shortens onto x and the 7 other corner-spheres grow in
    anim = (!skipAnim && prev === 0 && s === 1)
      ? { t0: performance.now(), dur: 1200 } : null;
    refreshAll();
    if (anim) applyAnim(0);
  }

  function applyAnim(e) {
    const cs = corners();
    const main = mainCornerIndex();
    const c = cs[main];
    sphereGroup.children.forEach((s, i) => {
      if (i === main) {
        s.position.set(
          0.5 + (c[0] - 0.5) * e, 0.5 + (c[1] - 0.5) * e, 0.5 + (c[2] - 0.5) * e,
        );
        s.scale.setScalar(R_BIG + (R_SMALL - R_BIG) * e);
      } else {
        const g = Math.max(0, (e - 0.55) / 0.45);   // grow in during 2nd half
        s.visible = g > 0.02;
        s.scale.setScalar(Math.max(0.001, R_SMALL * g));
      }
    });
    refreshDir(e);
  }

  /* ---------- interaction ---------- */
  function bindPointer(container) {
    const ray = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    function toMouse(e) {
      const r = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    }
    // every arrow tip is grabbable: the central one on x AND the small one
    // on each corner sphere — all rotate the SAME shared d
    function dragAnchors() {
      if (stage === 0) return [{ a: [0.5, 0.5, 0.5], len: R_BIG * 1.55, grab: 0.09 }];
      const list = [{ a: x, len: ALEN, grab: 0.09 }];
      for (const c of corners()) list.push({ a: c, len: R_SMALL * 1.45, grab: 0.05 });
      return list;
    }
    // capture phase: stop grabbed events before OrbitControls sees them —
    // otherwise controls get stuck mid-gesture after releasing the drag
    container.addEventListener('pointerdown', (e) => {
      toMouse(e);
      ray.setFromCamera(mouse, camera);
      for (const anc of dragAnchors()) {
        const tip = new THREE.Vector3(
          anc.a[0] + d[0] * anc.len, anc.a[1] + d[1] * anc.len, anc.a[2] + d[2] * anc.len,
        ).applyMatrix4(root.matrixWorld);
        if (ray.ray.distanceToPoint(tip) < anc.grab) {
          dragging = anc; e.stopPropagation();
          return;
        }
      }
      const xPos = new THREE.Vector3(...x).applyMatrix4(root.matrixWorld);
      if (ray.ray.distanceToPoint(xPos) < 0.09) {
        dragging = 'x'; e.stopPropagation();
      }
    }, true);
    window.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      toMouse(e);
      ray.setFromCamera(mouse, camera);
      if (dragging === 'x') {
        // x stays INSIDE the single voxel
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -x[2]);
        const hit = new THREE.Vector3();
        if (ray.ray.intersectPlane(plane, hit)) {
          const lo = 0.02, hi = VOX.s - 0.02;
          x[0] = VOX.c0[0] + Math.min(hi, Math.max(lo, hit.x - VOX.c0[0]));
          x[1] = VOX.c0[1] + Math.min(hi, Math.max(lo, hit.y - VOX.c0[1]));
          refreshAll();
        }
      } else {
        // rotate the shared d around whichever arrow anchor was grabbed
        const { a, len } = dragging;
        const sph = new THREE.Sphere(new THREE.Vector3(...a), len);
        const hit = new THREE.Vector3();
        if (ray.ray.intersectSphere(sph, hit)) {
          d = norm3([hit.x - a[0], hit.y - a[1], hit.z - a[2]]);
          refreshAll();
        }
      }
    });
    window.addEventListener('pointerup', () => { dragging = null; });
  }

  /* ---------- lifecycle ---------- */
  function init() {
    const container = document.getElementById('hashgridsphere-widget');
    const ph = container.querySelector('.placeholder');
    if (ph) ph.remove();
    levels = Icosphere.buildLevelsWithMaps(LD);
    sphereProto = null;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(COL.bg);
    camera = new THREE.PerspectiveCamera(38, container.clientWidth / container.clientHeight, 0.1, 50);
    camera.position.set(1.55, -1.15, 1.1);
    camera.up.set(0, 0, 1);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio / (Reveal.getScale() || 1), 2.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;   // no residual motion after release
    controls.enablePan = false;
    controls.target.set(0.5, 0.5, 0.5);
    root = new THREE.Group();
    scene.add(root);
    sphereProto = sphereWireGeometryAt(LD);
    sphereGroup = new THREE.Group(); root.add(sphereGroup);
    buildVoxel(); buildDir(); buildOverlays(container);
    bindPointer(container);
    refreshAll();

    const each = (e) => (e.fragments && e.fragments.length ? e.fragments : [e.fragment]);
    Reveal.on('fragmentshown', (e) => {
      for (const f of each(e)) if (f.dataset.hgStage) setStage(+f.dataset.hgStage);
    });
    Reveal.on('fragmenthidden', (e) => {
      for (const f of each(e)) if (f.dataset.hgStage) setStage(+f.dataset.hgStage - 1);
    });
    let s0 = 0;
    document.querySelectorAll('.fragment.visible[data-hg-stage]').forEach((f) => {
      s0 = Math.max(s0, +f.dataset.hgStage);
    });
    if (s0) setStage(s0, true);   // direct load: no transition animation
  }

  function loop() {
    if (!active) return;
    raf = requestAnimationFrame(loop);
    if (anim) {
      const t = Math.min(1, (performance.now() - anim.t0) / anim.dur);
      const e = t * t * (3 - 2 * t);   // smoothstep
      applyAnim(e);
      if (t >= 1) { anim = null; refreshAll(); }
    }
    controls.update();
    renderer.render(scene, camera);
  }

  window.DeckWidgets = window.DeckWidgets || [];
  window.DeckWidgets.push({
    slide: 'hashgridsphere-widget',
    init,
    activate() { active = true; loop(); },
    deactivate() {
      active = false;
      if (raf) cancelAnimationFrame(raf);
    },
  });
})();
