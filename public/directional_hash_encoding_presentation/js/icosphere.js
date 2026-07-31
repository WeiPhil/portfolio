/* icosphere.js — geodesic grid math shared by both widgets.
 * Faithful port of base/hashsphere_util.py (z-aligned icosahedron,
 * 4-way subdivision with sphere reprojection, containment traversal,
 * barycentric weights via Möller–Trumbore) and the paper's hash functions.
 */
(() => {
  const H = 1 / Math.sqrt(5), R = 2 / Math.sqrt(5);

  function baseIcosahedron() {
    const V = [[0, 0, 1]];
    for (let i = 0; i < 5; i++) {
      const a = i * 2 * Math.PI / 5;
      V.push([R * Math.cos(a), R * Math.sin(a), H]);
    }
    for (let i = 0; i < 5; i++) {
      const a = i * 2 * Math.PI / 5 + Math.PI / 5;
      V.push([R * Math.cos(a), R * Math.sin(a), -H]);
    }
    V.push([0, 0, -1]);
    const F = [
      [0,2,1],[0,3,2],[0,4,3],[0,5,4],[0,1,5],
      [1,2,6],[2,7,6],[2,3,7],[3,8,7],[3,4,8],
      [4,9,8],[4,5,9],[5,10,9],[5,1,10],[1,6,10],
      [11,6,7],[11,7,8],[11,8,9],[11,9,10],[11,10,6],
    ];
    return { vertices: V, faces: F };
  }

  const norm = (v) => {
    const l = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / l, v[1] / l, v[2] / l];
  };
  const mid = (a, b) => norm([(a[0]+b[0])/2, (a[1]+b[1])/2, (a[2]+b[2])/2]);
  const midChord = (a, b) => [(a[0]+b[0])/2, (a[1]+b[1])/2, (a[2]+b[2])/2];
  const dot = (a, b) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
  const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  const sub = (a, b) => [a[0]-b[0], a[1]-b[1], a[2]-b[2]];

  /* Barycentric coords of direction d in spherical triangle (v0,v1,v2)
     — ray_triangle_intersection_fast port (clamped). */
  function bary(d, v0, v1, v2) {
    const e1 = sub(v1, v0), e2 = sub(v2, v0);
    const h = cross(d, e2);
    const a = dot(e1, h);
    const f = 1 / a;
    const s = [-v0[0], -v0[1], -v0[2]];
    let u = f * dot(s, h);
    u = Math.min(1, Math.max(0, u));
    const q = cross(s, e1);
    let v = f * dot(d, q);
    v = Math.min(1 - u, Math.max(0, v));
    return [1 - u - v, u, v];
  }

  /* Find enclosing base face for d (icosahedron_intersection port). */
  function baseFace(d, ico) {
    let best = -1, bestDot = -Infinity;
    for (let i = 0; i < 20; i++) {
      const [a, b, c] = ico.faces[i];
      const n = norm([
        ico.vertices[a][0] + ico.vertices[b][0] + ico.vertices[c][0],
        ico.vertices[a][1] + ico.vertices[b][1] + ico.vertices[c][1],
        ico.vertices[a][2] + ico.vertices[b][2] + ico.vertices[c][2],
      ]);
      const t = dot(d, n);
      if (t > bestDot) { bestDot = t; best = i; }
    }
    return best;
  }

  /* buildLevels records edge maps (needed by traverse).
     NOTE: `vertices` is a single shared, growing array (like the Python
     implementation); per-level logical size is in `.count`. */
  function buildLevelsWithMaps(levels) {
    const out = [];
    let { vertices, faces } = baseIcosahedron();
    out.push({ vertices, faces, _edgeMap: new Map(), count: 12 });
    for (let l = 1; l <= levels; l++) {
      const edgeMap = new Map();
      const V = vertices;
      const midIdx = (i, j) => {
        const k = i < j ? `${i}_${j}` : `${j}_${i}`;
        if (edgeMap.has(k)) return edgeMap.get(k);
        V.push(mid(V[i], V[j]));
        edgeMap.set(k, V.length - 1);
        return V.length - 1;
      };
      const nf = [];
      for (const [i0, i1, i2] of faces) {
        const a = midIdx(i0, i1), b = midIdx(i1, i2), c = midIdx(i2, i0);
        nf.push([i0, a, c], [i1, b, a], [i2, c, b], [a, b, c]);
      }
      faces = nf;
      out.push({ vertices: V, faces, _edgeMap: edgeMap, count: 10 * Math.pow(4, l) + 2 });
    }
    return out;
  }

  /* Traverse hierarchy: per-level {tri, beta}. refine_triangle port:
     pick among the 4 children whose centroid is closest to d. */
  function traverse(d, levelsData, L) {
    const res = [];
    const ico = levelsData[0];
    let fi = baseFace(d, ico);
    let tri = ico.faces[fi].slice();
    for (let l = 0; l < L; l++) {
      const V = levelsData[Math.min(l, levelsData.length - 1)].vertices;
      const [i0, i1, i2] = tri;
      const b = bary(d, V[i0], V[i1], V[i2]);
      res.push({ tri: tri.slice(), beta: b });
      if (l < L - 1) {
        const Vn = levelsData[l + 1].vertices;
        const em = levelsData[l + 1]._edgeMap;
        const key = (i, j) => (i < j ? `${i}_${j}` : `${j}_${i}`);
        const a = em.get(key(i0, i1)), bb = em.get(key(i1, i2)), c = em.get(key(i2, i0));
        const cand = [[i0, a, c], [i1, bb, a], [i2, c, bb], [a, bb, c]];
        let best = 0, bd = -Infinity;
        for (let k = 0; k < 4; k++) {
          const [x, y, z] = cand[k];
          const n = norm([
            Vn[x][0] + Vn[y][0] + Vn[z][0],
            Vn[x][1] + Vn[y][1] + Vn[z][1],
            Vn[x][2] + Vn[y][2] + Vn[z][2],
          ]);
          const t = dot(d, n);
          if (t > bd) { bd = t; best = k; }
        }
        tri = cand[best];
      }
    }
    return res;
  }

  /* Paper hash functions (eq. 3 / eq. 5) — 32-bit uint arithmetic. */
  const PI_D = [2654435761, 805459861, 3674653429];   // directional primes
  const PI_X = [1, 2654435761, 805459861];             // spatial primes (Instant-NGP)
  const GAMMA = 1 << 19;
  function hashSphere(v, T) {
    let h = 0;
    for (let j = 0; j < 3; j++) {
      const q = Math.floor((1 + v[j]) * GAMMA);
      h = (h ^ Math.imul(q, PI_D[j])) >>> 0;
    }
    return h % T;
  }
  function hashJoint(c, v, T) {
    let hx = 0, hd = 0;
    for (let i = 0; i < 3; i++) hx = (hx ^ Math.imul(c[i], PI_X[i])) >>> 0;
    for (let j = 0; j < 3; j++) {
      const q = Math.floor((1 + v[j]) * GAMMA);
      hd = (hd ^ Math.imul(q, PI_D[j])) >>> 0;
    }
    return ((hx ^ hd) >>> 0) % T;
  }

  window.Icosphere = {
    baseIcosahedron, buildLevelsWithMaps, traverse, bary,
    baseFace, norm, mid, midChord, hashSphere, hashJoint,
    vertexCount: (l) => 10 * Math.pow(4, l) + 2,
    faceCount: (l) => 20 * Math.pow(4, l),
  };
})();
