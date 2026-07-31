/* summary_minis.js — two small live 3D icons on the summary slide.
 * Left: HashSphere looping the subdivision process (level 0 → 3, repeat),
 *       highlighted triangle + β-scaled feature dots + arrow d.
 * Right: HashGridSphere slowly auto-rotating — voxel, corner spheres,
 *        blue query point x at the voxel center carrying the direction arrow.
 * Drag to orbit either one.
 */
(() => {
  const COL = {
    bg: 0x0e1116, sphereWire: 0xc792ea, tri: 0xc792ea,
    grid: 0x45d6c0, dir: 0xff9d4d, x: 0x45d6c0,
  };
  const MAXL = 3;                 // subdivision loop: levels 0..MAXL
  const LOOP_MS = 1400;           // per-level dwell in the subdivision loop
  let minis = [], active = false, raf = null, levels = null;
  let m1 = null, m1Level = -1;    // left mini: rebuilt whenever the level flips
  const D = [0.55, 0.35, 0.75].map((v, _, a) => v / Math.hypot(...a));

  function sphereWire(level) {
    const L = levels[level];
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

  function geoSphere(level, d, withArrow, opacity) {
    const grp = new THREE.Group();
    grp.add(new THREE.LineSegments(sphereWire(level), new THREE.LineBasicMaterial({
      color: COL.sphereWire, transparent: true, opacity: opacity || 0.85,
    })));
    const path = Icosphere.traverse(d, levels, level + 1);
    const { tri, beta } = path[level];
    const V = levels[level].vertices;
    const tp = new Float32Array(9);
    tp.set(V[tri[0]], 0); tp.set(V[tri[1]], 3); tp.set(V[tri[2]], 6);
    const tg = new THREE.BufferGeometry();
    tg.setAttribute('position', new THREE.BufferAttribute(tp, 3));
    const tm = new THREE.Mesh(tg, new THREE.MeshBasicMaterial({
      color: COL.tri, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false,
    }));
    tm.scale.setScalar(1.01);
    grp.add(tm);
    // feature dots at the triangle vertices, sized by barycentric weight
    tri.forEach((vi, j) => {
      const dot = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.035 + 0.075 * beta[j], 10, 10),
        new THREE.MeshBasicMaterial({ color: COL.tri }),
      );
      dot.position.set(...V[vi]);
      grp.add(dot);
    });
    if (withArrow) {
      const mat = new THREE.MeshBasicMaterial({ color: COL.dir });
      const lineG = new THREE.BufferGeometry();
      lineG.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        0, 0, 0, d[0] * 1.45, d[1] * 1.45, d[2] * 1.45,
      ]), 3));
      grp.add(new THREE.Line(lineG, new THREE.LineBasicMaterial({ color: COL.dir })));
      const cone = new THREE.Mesh(new THREE.ConeBufferGeometry(0.06, 0.18, 12), mat);
      cone.position.set(d[0] * 1.45, d[1] * 1.45, d[2] * 1.45);
      cone.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0), new THREE.Vector3(d[0], d[1], d[2]),
      );
      grp.add(cone);
    }
    return grp;
  }

  function makeMini(containerId, build) {
    const container = document.getElementById(containerId);
    if (!container || container.dataset.inited) return null;
    container.dataset.inited = '1';
    const scene = new THREE.Scene();
    scene.background = null; // transparent over the slide background
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    camera.up.set(0, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio / (Reveal.getScale() || 1), 2.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.08;
    controls.enablePan = false; controls.enableZoom = false;
    build(scene, camera, controls);
    return { scene, camera, renderer, controls };
  }

  // left mini: swap in the sphere for the current loop level
  function m1SetLevel(l) {
    if (!m1 || l === m1Level) return;
    m1Level = l;
    if (m1.holder.children.length) m1.holder.remove(m1.holder.children[0]);
    m1.holder.add(geoSphere(l, D, true));
  }

  function init() {
    levels = Icosphere.buildLevelsWithMaps(MAXL);
    m1 = makeMini('mini-hashsphere', (scene, camera, controls) => {
      camera.position.set(0.5, -3.4, 1.2);
      controls.target.set(0, 0, 0);
    });
    if (m1) {
      m1.holder = new THREE.Group();
      m1.scene.add(m1.holder);
      m1SetLevel(0);
    }
    const m2 = makeMini('mini-hashgridsphere', (scene, camera, controls) => {
      // one voxel with a small geodesic sphere at each corner; the query
      // point x sits at the voxel center and carries the direction arrow
      const box = new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1));
      scene.add(new THREE.Box3Helper(box, COL.grid));
      for (let dz = 0; dz <= 1; dz++) for (let dy = 0; dy <= 1; dy++) for (let dx = 0; dx <= 1; dx++) {
        const s = geoSphere(1, D, false, 0.7);
        s.scale.setScalar(0.22);
        s.position.set(dx, dy, dz);
        scene.add(s);
      }
      const xDot = new THREE.Mesh(
        new THREE.SphereBufferGeometry(0.05, 14, 14),
        new THREE.MeshBasicMaterial({ color: COL.x }),
      );
      xDot.position.set(0.5, 0.5, 0.5);
      scene.add(xDot);
      // the direction arrow, anchored on x
      const AL = 0.55;
      const mat = new THREE.MeshBasicMaterial({ color: COL.dir });
      const lineG = new THREE.BufferGeometry();
      lineG.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        0.5, 0.5, 0.5, 0.5 + D[0] * AL, 0.5 + D[1] * AL, 0.5 + D[2] * AL,
      ]), 3));
      scene.add(new THREE.Line(lineG, new THREE.LineBasicMaterial({ color: COL.dir })));
      const cone = new THREE.Mesh(new THREE.ConeBufferGeometry(0.035, 0.11, 12), mat);
      cone.position.set(0.5 + D[0] * AL, 0.5 + D[1] * AL, 0.5 + D[2] * AL);
      cone.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0), new THREE.Vector3(...D),
      );
      scene.add(cone);
      camera.position.set(2.6, -1.9, 1.9);
      controls.target.set(0.5, 0.5, 0.5);
      controls.autoRotate = true;             // gentle turntable
      controls.autoRotateSpeed = 1.4;
    });
    minis = [m1, m2].filter(Boolean);
  }

  function loop() {
    if (!active) return;
    raf = requestAnimationFrame(loop);
    // subdivision loop on the left mini (wall-clock, robust to rAF throttling)
    m1SetLevel(Math.floor(performance.now() / LOOP_MS) % (MAXL + 1));
    for (const m of minis) { m.controls.update(); m.renderer.render(m.scene, m.camera); }
  }

  window.DeckWidgets = window.DeckWidgets || [];
  window.DeckWidgets.push({
    slide: 'summary',
    init,
    activate() { active = true; loop(); },
    deactivate() { active = false; if (raf) cancelAnimationFrame(raf); },
  });
})();
