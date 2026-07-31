/* hashsphere3d.js — interactive HashSphere widget (slide 5).
 *
 * Fragment stages (invisible .fragment spans with data-hs-stage):
 *  slide shown : L0 icosahedron wireframe + direction arrow d (draggable tip)
 *  stage 1..4  : animated subdivision to level 1..4 (level + tri count top left)
 *  stage 5..9  : env-map toy — reconstruction using levels 0..(stage-5);
 *                per-level feature chips → MLP → output in the side panel.
 * No autonomous animation: orbit by dragging, d by dragging the orange tip.
 */
(() => {
  const MAXL = 7;      // finest reconstruction level (8 levels total)
  const MAXWIRE = 4;   // deepest level shown as wireframe / subdivided live
  const COL = {
    bg: 0x0e1116, wire: 0x9aa3b2, wireFine: 0x5d6675,
    dir: 0xff9d4d,
    tri: [0x4db8ff, 0x45d6c0, 0xc792ea, 0xffd166, 0xff5c77, 0x7ee08a, 0xff8ad1, 0x9dd6ff],
  };

  let scene, camera, renderer, controls, root;
  let levels, wires = [], morph = null;
  let curLevel = 0, stage = 0, d = norm3([0.55, 0.35, 0.75]);
  let dirGroup, triGroup, panel, levelTag, sliderBox, envData = null, solidGroup = null;
  let dragging = false, raf = null, active = false;
  let TCUR = Math.pow(2, 18);      // demo hash-table size (slider)
  let SUP = 1.0;                   // useful directional domain (cap fraction)
  const CAP_AXIS = norm3([0.55, 0.35, 0.75]); // support cap center
  const bucketCache = {};          // `${level}_${T}_${SUP}` → Float32Array colors

  function inSupport(v) {
    if (SUP >= 0.999) return true;
    // spherical cap covering a fraction SUP of the sphere's area
    return v[0]*CAP_AXIS[0] + v[1]*CAP_AXIS[1] + v[2]*CAP_AXIS[2] >= 1 - 2 * SUP;
  }

  function norm3(v) { const l = Math.hypot(v[0], v[1], v[2]); return [v[0]/l, v[1]/l, v[2]/l]; }
  const reconLevel = () => Math.min(MAXL, Math.max(0, stage - 5)); // env-toy level

  /* ---------- env map sampling ---------- */
  function loadEnv(cb) {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const g = c.getContext('2d');
      g.drawImage(img, 0, 0);
      envData = { data: g.getImageData(0, 0, c.width, c.height).data, w: c.width, h: c.height };
      cb && cb();
    };
    img.src = 'assets/env_studio.png';
  }
  function envSample(dir) {
    if (!envData) return [128, 128, 128];
    // env map "pasted onto the sphere from the OUTSIDE": moving right on the
    // visible surface moves right in the image — same chirality as the image
    const u = (Math.atan2(dir[1], dir[0]) + Math.PI) / (2 * Math.PI);
    const v = Math.acos(Math.max(-1, Math.min(1, dir[2]))) / Math.PI;
    const x = Math.min(envData.w - 1, (u * envData.w) | 0);
    const y = Math.min(envData.h - 1, (v * envData.h) | 0);
    const i = (y * envData.w + x) * 4;
    return [envData.data[i], envData.data[i+1], envData.data[i+2]];
  }

  /* ---------- hash-collision toy ----------
     When a level has more vertices than table entries, colliding vertices
     share ONE trained parameter. Training would settle on the compromise
     that minimizes the loss — for colors, the mean of the colliding
     vertices' targets. We precompute that mean per bucket. */
  function bucketColors(l) {
    const key = l + '_' + TCUR + '_' + SUP;
    if (bucketCache[key]) return bucketCache[key];
    const V = levels[l].vertices;
    const n = Icosphere.vertexCount(l);
    const acc = new Float32Array(TCUR * 3);
    const cnt = new Uint32Array(TCUR);
    const slotOf = new Int32Array(n);
    for (let i = 0; i < n; i++) {
      const s = Icosphere.hashSphere(V[i], TCUR);
      slotOf[i] = s;
      // gradients only flow from directions inside the useful domain —
      // out-of-support vertices never train their entry
      if (!inSupport(V[i])) continue;
      const c = envSample(V[i]);
      acc[s*3] += c[0]; acc[s*3+1] += c[1]; acc[s*3+2] += c[2];
      cnt[s]++;
    }
    const out = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const s = slotOf[i];
      if (cnt[s] === 0) { out[i*3] = 10; out[i*3+1] = 10; out[i*3+2] = 12; continue; }
      out[i*3] = acc[s*3] / cnt[s];
      out[i*3+1] = acc[s*3+1] / cnt[s];
      out[i*3+2] = acc[s*3+2] / cnt[s];
    }
    bucketCache[key] = out;
    return out;
  }
  // the color the (toy-)trained table reproduces for vertex i of level l
  function vertexColor(l, i) {
    if (!envData) return [128, 128, 128]; // don't cache before the env loads
    if (!inSupport(levels[l].vertices[i])) return [10, 10, 12];
    if (Icosphere.vertexCount(l) <= TCUR) return envSample(levels[l].vertices[i]);
    const b = bucketColors(l);
    return [b[i*3], b[i*3+1], b[i*3+2]];
  }

  /* ---------- geometry ---------- */
  function wireGeometry(levelData, positionsOverride) {
    const V = positionsOverride || levelData.vertices;
    const edges = new Set();
    for (const [a, b, c] of levelData.faces) {
      for (const [i, j] of [[a,b],[b,c],[c,a]]) edges.add(i < j ? i + '_' + j : j + '_' + i);
    }
    const pos = new Float32Array(edges.size * 6);
    let k = 0;
    for (const e of edges) {
      const [i, j] = e.split('_').map(Number);
      pos.set(V[i], k); pos.set(V[j], k + 3); k += 6;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }

  function buildWires() {
    wires = [];
    for (let l = 0; l <= MAXWIRE; l++) {
      const mat = new THREE.LineBasicMaterial({
        color: l === 0 ? COL.wire : COL.wireFine, transparent: true,
        opacity: l === 0 ? 1.0 : Math.max(0.45, 0.9 - 0.12 * l),
      });
      const mesh = new THREE.LineSegments(wireGeometry(levels[l]), mat);
      mesh.visible = l === 0;
      root.add(mesh);
      wires.push(mesh);
    }
  }

  function startMorph(l) {
    const Ln = levels[l];
    const nPrev = Icosphere.vertexCount(l - 1);
    const nCur = Icosphere.vertexCount(l);
    const from = [];
    for (let i = 0; i < nCur; i++) from.push(i < nPrev ? Ln.vertices[i] : null);
    for (const [key, idx] of Ln._edgeMap) {
      const [i, j] = key.split('_').map(Number);
      from[idx] = Icosphere.midChord(Ln.vertices[i], Ln.vertices[j]);
    }
    morph = { l, t0: performance.now(), from, to: Ln.vertices.slice(0, nCur) };
    wires[l].visible = true;
    wires[l - 1].visible = false;
  }

  function applyMorph() {
    if (!morph) return;
    const t = Math.min(1, (performance.now() - morph.t0) / 800);
    const e = 0.5 - 0.5 * Math.cos(Math.PI * t);
    const V = morph.from.map((f, i) => f === morph.to[i] ? morph.to[i] : [
      f[0] + (morph.to[i][0] - f[0]) * e,
      f[1] + (morph.to[i][1] - f[1]) * e,
      f[2] + (morph.to[i][2] - f[2]) * e,
    ]);
    wires[morph.l].geometry.dispose();
    wires[morph.l].geometry = wireGeometry(levels[morph.l], V);
    if (t >= 1) morph = null;
    updateTriangles();
  }

  /* ---------- query direction: arrow + small tip dot ---------- */
  function buildDir() {
    dirGroup = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({ color: COL.dir });
    // small marker where the arrow pierces the sphere
    const dot = new THREE.Mesh(new THREE.SphereBufferGeometry(0.028, 16, 16), mat);
    dot.name = 'ddot';
    // shaft from center out to 1.32
    const lineG = new THREE.BufferGeometry();
    lineG.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    const line = new THREE.Line(lineG, new THREE.LineBasicMaterial({ color: COL.dir }));
    line.name = 'dline';
    // arrowhead cone
    const cone = new THREE.Mesh(new THREE.ConeBufferGeometry(0.032, 0.1, 16), mat);
    cone.name = 'dcone';
    dirGroup.add(dot, line, cone);
    root.add(dirGroup);
    updateDir();
  }
  function updateDir() {
    const dot = dirGroup.getObjectByName('ddot');
    dot.position.set(d[0], d[1], d[2]);
    const p = dirGroup.getObjectByName('dline').geometry.attributes.position;
    p.array.set([0, 0, 0, d[0] * 1.32, d[1] * 1.32, d[2] * 1.32]);
    p.needsUpdate = true;
    const cone = dirGroup.getObjectByName('dcone');
    cone.position.set(d[0] * 1.32, d[1] * 1.32, d[2] * 1.32);
    cone.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0), new THREE.Vector3(d[0], d[1], d[2]),
    );
  }

  /* ---------- enclosing triangles ---------- */
  function buildTriGroup() { triGroup = new THREE.Group(); root.add(triGroup); }

  function updateTriangles() {
    while (triGroup.children.length) {
      const c = triGroup.children.pop();
      c.geometry.dispose(); c.material.dispose();
    }
    const path = Icosphere.traverse(d, levels, curLevel + 1);
    const recon = stage >= 5;
    const lo = recon ? curLevel : curLevel; // only current level's triangle
    for (let l = lo; l <= curLevel; l++) {
      const { tri } = path[l];
      const V = levels[l].vertices;
      const pos = new Float32Array(9);
      pos.set(V[tri[0]], 0); pos.set(V[tri[1]], 3); pos.set(V[tri[2]], 6);
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({
        color: COL.tri[l], transparent: true, opacity: recon ? 0.35 : 0.75,
        side: THREE.DoubleSide, depthWrite: false,
      }));
      m.scale.setScalar(1.004);
      triGroup.add(m);
      // feature dots at the triangle vertices, sized by barycentric weight —
      // the interpolation made visible
      const { beta } = path[l];
      // dot size follows the (shrinking) triangle: ∝ edge length per level,
      // clamped so fine-level dots stay visible but never blob together
      const edge = 1.05 / Math.pow(2, l);
      for (let j = 0; j < 3; j++) {
        const v = V[tri[j]];
        const r = Math.max(0.006,
          Math.min(0.02 + 0.055 * beta[j], edge * (0.08 + 0.2 * beta[j])));
        const dot = new THREE.Mesh(
          new THREE.SphereBufferGeometry(r, 12, 12),
          new THREE.MeshBasicMaterial({ color: COL.tri[l] }),
        );
        dot.position.set(v[0] * 1.01, v[1] * 1.01, v[2] * 1.01);
        triGroup.add(dot);
      }
    }
    updatePanel(path);
    updateLevelTag();
  }

  /* ---------- solid "learned" sphere — rendered as a CHROME BALL ----------
     Each surface point shows the learned field seen IN THE REFLECTION:
     reflect the camera ray at the vertex normal and evaluate the trained
     (level-k, collisions, support) field at that reflected direction.
     The point facing the camera therefore shows the env toward you —
     exactly like the reference light-probe balls in the paper figures. */
  function trainedColorsAt(l) {
    // per-unique-vertex trained values (env + collisions + support), cached
    const key = 'tc_' + l + '_' + TCUR + '_' + SUP;
    if (bucketCache[key]) return bucketCache[key];
    const n = Icosphere.vertexCount(l);
    const out = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const c = vertexColor(l, i);
      out[i*3] = c[0]; out[i*3+1] = c[1]; out[i*3+2] = c[2];
    }
    if (!envData) return out; // don't cache the pre-load gray
    bucketCache[key] = out;
    return out;
  }
  function buildSolid() {
    solidGroup = new THREE.Group();
    root.add(solidGroup);
    refreshSolid(reconLevel());
  }
  function refreshSolid(l) {
    while (solidGroup.children.length) {
      const c = solidGroup.children.pop();
      c.geometry.dispose(); c.material.dispose();
    }
    // painted globe: each vertex v carries its learned value ≈ env(v),
    // interpolated across the triangle — the reconstruction itself,
    // viewed from outside like a globe. View-independent.
    const L = levels[l];
    const tc = trainedColorsAt(l);
    // outside the "useful" cap the field is simply absent: drop those faces
    // (transparent hole) instead of painting them black
    const sup = L.vertices.map((v) => inSupport(v));
    const faces = L.faces.filter((f) => f.some((i) => sup[i]));
    const pos = new Float32Array(faces.length * 9);
    const col = new Float32Array(faces.length * 9);
    let k = 0;
    for (const f of faces) {
      for (const i of f) {
        pos.set(L.vertices[i], k);
        col[k] = tc[i*3] / 255; col[k+1] = tc[i*3+1] / 255; col[k+2] = tc[i*3+2] / 255;
        k += 3;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    // DoubleSide: the icosphere faces wind inward — with default FrontSide
    // culling you'd see the INSIDE of the far hemisphere (mirrored env,
    // markers floating in front of the wrong surface).
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide }));
    m.scale.setScalar(0.995);
    solidGroup.add(m);
  }

  /* ---------- HTML overlays ---------- */
  function buildOverlays(container) {
    panel = document.createElement('div');
    Object.assign(panel.style, {
      position: 'absolute', top: '0', right: '0', width: '620px', height: '100%',
      padding: '26px', boxSizing: 'border-box', fontSize: '27px', lineHeight: '1.5',
      color: 'var(--text)', background: 'linear-gradient(90deg, transparent, rgba(14,17,22,0.92) 18%)',
      display: 'none', overflow: 'hidden', pointerEvents: 'none', textAlign: 'left',
    });
    container.appendChild(panel);
    levelTag = document.createElement('div');
    Object.assign(levelTag.style, {
      position: 'absolute', top: '18px', left: '22px', pointerEvents: 'none',
      fontSize: '34px', fontWeight: '700', color: 'var(--text)', textAlign: 'left',
      lineHeight: '1.35',
    });
    container.appendChild(levelTag);
    // hash-table-size slider (recon stages only)
    sliderBox = document.createElement('div');
    Object.assign(sliderBox.style, {
      position: 'absolute', bottom: '20px', left: '22px', pointerEvents: 'auto',
      fontSize: '25px', color: 'var(--text)', textAlign: 'left', display: 'none',
      background: 'rgba(14,17,22,0.85)', padding: '12px 18px', borderRadius: '10px',
    });
    sliderBox.innerHTML = `
      <div style="margin-bottom:4px">hash table size&nbsp; T = 2<sup><span id="hs-texp">18</span></sup>
        <span id="hs-coll" style="color:var(--text-muted); font-size:22px"></span></div>
      <input id="hs-tslider" type="range" min="12" max="18" step="1" value="18" style="width:300px">
      <div style="margin:14px 0 4px">“useful” directional domain&nbsp; <span id="hs-supv">100</span>%</div>
      <input id="hs-sslider" type="range" min="2" max="100" step="2" value="100" style="width:300px">`;
    container.appendChild(sliderBox);
    const refreshToy = () => {
      if (stage >= 5) { refreshSolid(reconLevel()); updateTriangles(); }
      updateSlider();
    };
    sliderBox.querySelector('#hs-tslider').addEventListener('input', (e) => {
      TCUR = Math.pow(2, +e.target.value);
      sliderBox.querySelector('#hs-texp').textContent = e.target.value;
      refreshToy();
    });
    sliderBox.querySelector('#hs-sslider').addEventListener('input', (e) => {
      SUP = (+e.target.value) / 100;
      sliderBox.querySelector('#hs-supv').textContent = e.target.value;
      refreshToy();
    });
    // don't let the sliders drag orbit the sphere
    sliderBox.addEventListener('pointerdown', (e) => e.stopPropagation(), true);
  }

  function updateSlider() {
    if (!sliderBox) return;
    sliderBox.style.display = stage >= 5 ? 'block' : 'none';
    if (stage < 5) return;
    const k = reconLevel();
    const colliding = [];
    for (let l = 0; l <= k; l++) if (Icosphere.vertexCount(l) > TCUR) colliding.push('L' + l);
    sliderBox.querySelector('#hs-coll').textContent =
      colliding.length ? ` — collisions on ${colliding.join(', ')}` : ' — no collisions';
  }

  function updateLevelTag() {
    if (!levelTag) return;
    let html = `subdivision level ${curLevel}`;
    if (stage >= 5) {
      html = `reconstruction with levels 0 → ${reconLevel()}`;
    }
    levelTag.innerHTML = html;
  }

  function chipColor(path, l) {
    const { tri, beta } = path[l];
    const cs = tri.map((i) => vertexColor(l, i));
    return [0, 1, 2].map((ch) => (beta[0]*cs[0][ch] + beta[1]*cs[1][ch] + beta[2]*cs[2][ch]) | 0);
  }

  function updatePanel(path) {
    if (!panel) return;
    if (stage < 5) { panel.style.display = 'none'; return; }
    panel.style.display = 'block';
    const k = reconLevel();
    const hcol = (l) => '#' + COL.tri[l].toString(16).padStart(6, '0');
    // feature bar: one chip pair per level, colored by what that level sees at d
    let bar = '';
    for (let l = 0; l <= k; l++) {
      const mix = chipColor(path, Math.min(l, curLevel));
      const c = `rgb(${mix.join(',')})`;
      bar += `<span style="display:inline-block; margin-right:9px; text-align:center">
        <span style="display:inline-block;width:27px;height:35px;border-radius:5px 0 0 5px;background:${c};border:2px solid ${hcol(l)}"></span><span style="display:inline-block;width:27px;height:35px;border-radius:0 5px 5px 0;background:${c};border:2px solid ${hcol(l)};border-left:none"></span>
        <br><span style="font-size:23px;color:${hcol(l)}">f<sub>${l}</sub></span>
      </span>`;
    }
    // toy decode for the output swatch: mix ALL levels, finer levels carry
    // more detail, collided levels contribute less (the real MLP mixes all
    // level features nonlinearly — this is an honest linear stand-in)
    let wsum = 0;
    const out = [0, 0, 0];
    for (let l = 0; l <= k; l++) {
      const collFactor = Math.max(0, Icosphere.vertexCount(l) / TCUR - 1);
      const w = Math.pow(4, l) / (1 + 3 * collFactor);
      const c = chipColor(path, Math.min(l, curLevel));
      out[0] += w * c[0]; out[1] += w * c[1]; out[2] += w * c[2];
      wsum += w;
    }
    out.forEach((v, i) => { out[i] = (v / wsum) | 0; });
    // fixed layout: chips row up top, MLP box at a CONSTANT position below,
    // output swatch underneath the box
    const barW = (k + 1) * 67 - 9;
    const cx = 270; // MLP center — never moves
    panel.innerHTML = `
      <div class="math" style="font-weight:700; font-size:34px; margin:14px 0 14px">f(d) = [ f₀ ; … ; f<sub>${k}</sub> ]</div>
      <div style="white-space:nowrap">${bar}</div>
      <svg width="564" height="580" style="margin-top:6px">
        <line x1="${barW / 2}" y1="2" x2="${barW / 2}" y2="24" stroke="#9aa3b2" stroke-width="3"/>
        <line x1="${Math.min(barW / 2, cx)}" y1="24" x2="${Math.max(barW / 2, cx)}" y2="24" stroke="#9aa3b2" stroke-width="3"/>
        <line x1="${cx}" y1="24" x2="${cx}" y2="54" stroke="#9aa3b2" stroke-width="3"/>
        <polygon points="${cx - 10},52 ${cx + 10},52 ${cx},68" fill="#9aa3b2"/>
        <rect x="${cx - 160}" y="72" width="320" height="240" rx="12" fill="none" stroke="#e8eaf0" stroke-width="3"/>
        ${[0,1,2].map((c) => [0,1,2].map((r) => {
          const nx = cx - 98 + c * 98, ny = 122 + r * 70;
          return `<circle cx="${nx}" cy="${ny}" r="20" fill="#171c24" stroke="#e8eaf0" stroke-width="2.5"/>`;
        }).join('')).join('')}
        ${[0,1].map((c) => [0,1,2].map((r1) => [0,1,2].map((r2) =>
          `<line x1="${cx - 78 + c*98}" y1="${122 + r1*70}" x2="${cx - 20 + c*98}" y2="${122 + r2*70}" stroke="#9aa3b2" stroke-width="1.6" opacity="0.55"/>`,
        ).join('')).join('')).join('')}
        <text x="${cx}" y="346" fill="#9aa3b2" font-size="29" text-anchor="middle" font-weight="600">small MLP</text>
        <line x1="${cx}" y1="360" x2="${cx}" y2="392" stroke="#9aa3b2" stroke-width="3"/>
        <polygon points="${cx - 10},390 ${cx + 10},390 ${cx},406" fill="#9aa3b2"/>
        <rect x="${cx - 33}" y="414" width="66" height="62" rx="10" fill="rgb(${out.join(',')})" stroke="#e8eaf0" stroke-width="2.5"/>
        <text x="${cx}" y="514" fill="#9aa3b2" font-size="27" text-anchor="middle" class="math">L(d)</text>
      </svg>`;
  }

  /* ---------- stages ---------- */
  function setStage(s) {
    stage = s;
    if (s <= 4) {
      // subdivision phase (levels 0..MAXWIRE shown live)
      const target = Math.min(s, MAXWIRE);
      if (target > curLevel) { curLevel = target; startMorph(target); }
      else if (target < curLevel || curLevel > MAXWIRE) {
        curLevel = Math.max(0, target);
        morph = null;
        wires[curLevel].geometry.dispose();
        wires[curLevel].geometry = wireGeometry(levels[curLevel]);
      }
      if (solidGroup) solidGroup.visible = false;
      wires.forEach((w, i) => {
        w.visible = i === curLevel;
        w.material.opacity = i === 0 ? 1.0 : Math.max(0.45, 0.9 - 0.12 * i);
      });
    } else {
      // reconstruction phase: levels 0..k (k up to MAXL=7)
      const k = reconLevel();
      curLevel = k;
      morph = null;
      if (!solidGroup) buildSolid();
      refreshSolid(k);
      solidGroup.visible = true;
      wires.forEach((w, i) => {
        w.visible = i === k && k <= MAXWIRE;
        w.material.opacity = 0.22;
        if (w.visible) { w.geometry.dispose(); w.geometry = wireGeometry(levels[k]); }
      });
    }
    updateTriangles();
    updateSlider();
  }

  /* ---------- interaction ---------- */
  function bindPointer(container) {
    const ray = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 1);
    function toMouse(e) {
      const r = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    }
    // capture phase: when we grab the arrow, stop the event before
    // OrbitControls ever sees it — otherwise controls get stuck mid-gesture
    container.addEventListener('pointerdown', (e) => {
      toMouse(e);
      ray.setFromCamera(mouse, camera);
      // grab anywhere along the outer half of the arrow (surface dot → cone)
      const tip = new THREE.Vector3(d[0] * 1.32, d[1] * 1.32, d[2] * 1.32).applyMatrix4(root.matrixWorld);
      const dotPos = new THREE.Vector3(d[0], d[1], d[2]).applyMatrix4(root.matrixWorld);
      if (ray.ray.distanceToPoint(tip) < 0.16 || ray.ray.distanceToPoint(dotPos) < 0.1) {
        dragging = true;
        e.stopPropagation();
      }
    }, true);
    window.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      toMouse(e);
      ray.setFromCamera(mouse, camera);
      const hit = new THREE.Vector3();
      if (ray.ray.intersectSphere(sphere, hit)) {
        const local = root.worldToLocal(hit.clone()).normalize();
        d = norm3([local.x, local.y, local.z]);
        updateDir(); updateTriangles();
      }
    });
    window.addEventListener('pointerup', () => { dragging = false; });
  }

  /* ---------- lifecycle ---------- */
  function init() {
    const container = document.getElementById('hashsphere-widget');
    const ph = container.querySelector('.placeholder');
    if (ph) ph.remove();
    levels = Icosphere.buildLevelsWithMaps(MAXL);
    scene = new THREE.Scene();
    scene.background = new THREE.Color(COL.bg);
    camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 50);
    camera.position.set(0.4, -3.0, 1.1);
    camera.up.set(0, 0, 1);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio / (Reveal.getScale() || 1), 2.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.08;
    controls.enablePan = false; controls.autoRotate = false;
    root = new THREE.Group();
    scene.add(root);
    buildWires(); buildDir(); buildTriGroup(); buildOverlays(container);
    bindPointer(container);
    loadEnv(() => {
      updateTriangles();
      if (stage >= 5) refreshSolid(reconLevel());
    });
    updateTriangles();

    const each = (e) => (e.fragments && e.fragments.length ? e.fragments : [e.fragment]);
    Reveal.on('fragmentshown', (e) => {
      for (const f of each(e)) if (f.dataset.hsStage) setStage(+f.dataset.hsStage);
    });
    Reveal.on('fragmenthidden', (e) => {
      for (const f of each(e)) if (f.dataset.hsStage) setStage(+f.dataset.hsStage - 1);
    });
    // restore stage when the deck loads directly on this slide
    let s0 = 0;
    document.querySelectorAll('.fragment.visible[data-hs-stage]').forEach((f) => {
      s0 = Math.max(s0, +f.dataset.hsStage);
    });
    if (s0) setStage(s0);
  }

  function loop() {
    if (!active) return;
    raf = requestAnimationFrame(loop);
    controls.update();
    applyMorph();
    // once the ball is opaque (recon stages), the arrow behaves like a pole on
    // a globe: fully hidden when d points to the far hemisphere.
    // (unit sphere: surface point p is visible from camera c iff p·c > 1)
    if (dirGroup) {
      const c = camera.position;
      const facing = d[0] * c.x + d[1] * c.y + d[2] * c.z;
      dirGroup.visible = stage >= 5 ? facing > 1.0 : true;
      if (triGroup) triGroup.visible = dirGroup.visible;
    }
    renderer.render(scene, camera);
  }

  window.DeckWidgets = window.DeckWidgets || [];
  window.DeckWidgets.push({
    slide: 'hashsphere-widget',
    init,
    activate() { active = true; loop(); },
    deactivate() {
      active = false;
      if (raf) cancelAnimationFrame(raf);
    },
  });
})();
