/* Avatar3D : petit moteur WebGL maison pour les portraits d'Aicha et de Joury (aucune bibliothèque).
   Principe : chaque <img data-a3d="aicha|joury"> est remplacé par un <canvas> identique en taille.
   - Relief : une carte de profondeur est calculée dans le navigateur à partir du portrait (netteté du sujet,
     silhouette tête/épaules, volume du visage). Le shader décale l'image selon cette profondeur (parallaxe)
     et calcule une lumière sur le relief (ombrage, reflet, liseré).
   - Animation : léger balancement, respiration, lumière qui voyage ; le regard suit le pointeur à proximité.
   Économie de ressources :
   - un seul contexte WebGL pour tous les avatars (le résultat est copié dans chaque canvas) ;
   - rien n'est chargé ni calculé tant qu'aucun avatar n'est visible ; pause hors écran et onglet masqué ;
   - 30 images/s maximum, résolution plafonnée à 2x, textures partagées entre les avatars identiques ;
   - repli sur l'image d'origine si WebGL est absent, lent (rendu logiciel), si l'économiseur de données est actif
     ou si le contexte est perdu ; « réduire les animations » => une seule image fixe avec relief. */
(function () {
  "use strict";
  if (window.Avatar3D) return;

  var SEL = "img[data-a3d]", TEX = 512, DN = 96, FPS = 30, MAXDPR = 2, ZOOM = 0.06, AMP = 0.032, RELIEF = 16;
  /* Géométrie du visage par assistante, en coordonnées image (0..1, origine en haut à gauche) :
     head = [centre x, centre y, rayon x, rayon y], torso = idem, nose = [x, y]. */
  var CFG = {
    aicha: { head: [0.50, 0.40, 0.21, 0.31], torso: [0.50, 1.00, 0.52, 0.36], nose: [0.525, 0.575], ph: 0.0 },
    joury: { head: [0.43, 0.38, 0.24, 0.33], torso: [0.52, 1.00, 0.52, 0.36], nose: [0.45, 0.54], ph: 2.1 }
  };
  var DEF = { head: [0.50, 0.40, 0.22, 0.31], torso: [0.50, 1.00, 0.52, 0.36], nose: [0.50, 0.56], ph: 1.0 };

  var mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var reduce = !!(mq && mq.matches);
  var conn = navigator.connection || {};
  var disabled = !!conn.saveData || typeof WeakSet !== "function";
  var items = [], seen = disabled ? null : new WeakSet(), bad = disabled ? null : new WeakSet();
  var G = null, T = {}, raf = 0, last = 0, io = null, mo = null, mouse = { x: 0, y: 0, t: -1e9 };

  /* ---------- WebGL ---------- */
  var VS = "attribute vec2 p;varying vec2 vUv;void main(){vUv=p*0.5+0.5;gl_Position=vec4(p,0.0,1.0);}";
  var FS = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n" +
    "varying vec2 vUv;uniform sampler2D uImg,uDep;uniform vec2 uCam,uLight;uniform float uAmp,uZoom,uRel,uPx;\n" +
    "void main(){\n" +
    " vec2 c=vec2(0.5,0.46);\n" +
    " vec2 p=(vUv-c)/(1.0+uZoom)+c;\n" +
    " vec2 q=p;\n" +
    " for(int i=0;i<3;i++){float d=texture2D(uDep,q).r;q=p+uCam*uAmp*(d-0.35);}\n" +
    " q=clamp(q,0.003,0.997);\n" +
    " vec3 col=texture2D(uImg,q).rgb;\n" +
    " float dx=texture2D(uDep,q+vec2(uPx,0.0)).r-texture2D(uDep,q-vec2(uPx,0.0)).r;\n" +
    " float dy=texture2D(uDep,q+vec2(0.0,uPx)).r-texture2D(uDep,q-vec2(0.0,uPx)).r;\n" +
    " vec3 n=normalize(vec3(-dx*uRel,-dy*uRel,1.0));\n" +
    " vec3 L=normalize(vec3(uLight,0.8));\n" +
    " float diff=dot(n,L)-L.z;\n" +
    " col*=1.0+0.15*diff+0.012;\n" +
    " float sp=pow(max(dot(reflect(-L,n),vec3(0.0,0.0,1.0)),0.0),30.0);\n" +
    " col+=vec3(1.0,0.97,0.92)*sp*0.07;\n" +
    " float g=length(vec2(dx,dy))*uRel;\n" +
    " col+=vec3(0.9,0.95,1.0)*smoothstep(0.3,0.9,g)*0.02;\n" +
    " gl_FragColor=vec4(clamp(col,0.0,1.0),1.0);\n" +
    "}";

  function init() {
    if (G) return G.ok;
    G = { ok: false };
    try {
      var c = document.createElement("canvas"), soft = false;
      c.width = c.height = 256;
      var o = { alpha: false, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false, powerPreference: "low-power", failIfMajorPerformanceCaveat: true };
      var gl = c.getContext("webgl", o);
      if (!gl) { o.failIfMajorPerformanceCaveat = false; gl = c.getContext("webgl", o) || c.getContext("experimental-webgl", o); soft = true; }
      if (!gl) return false;
      var sh = function (t, s) {
        var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o);
        if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o));
        return o;
      };
      var pr = gl.createProgram();
      gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
      gl.bindAttribLocation(pr, 0, "p"); gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error("link");
      gl.useProgram(pr);
      var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
      var u = {}; ["uImg", "uDep", "uCam", "uLight", "uAmp", "uZoom", "uRel", "uPx"].forEach(function (n) { u[n] = gl.getUniformLocation(pr, n); });
      gl.uniform1i(u.uImg, 0); gl.uniform1i(u.uDep, 1); gl.uniform1f(u.uPx, 1 / DN);
      c.addEventListener("webglcontextlost", function (e) { e.preventDefault(); G.ok = false; G.dead = true; items.forEach(function (it) { release(it, true); }); });
      G = { ok: true, c: c, gl: gl, u: u, soft: soft };
      return true;
    } catch (e) { G = { ok: false, dead: true }; return false; }
  }

  function tex2d(src, mips) {
    var gl = G.gl, t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    if (mips) { gl.generateMipmap(gl.TEXTURE_2D); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); }
    else gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    return t;
  }
  function texDepth(bytes) {
    var gl = G.gl, t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, DN, DN, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, bytes);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return t;
  }

  /* ---------- Carte de profondeur calculée depuis le portrait ---------- */
  function box(a, n, r) { /* flou moyenneur séparable, n passes, rayon r */
    var t = new Float32Array(a.length), i, x, y, k, s, c;
    for (var pass = 0; pass < n; pass++) {
      for (y = 0; y < DN; y++) for (x = 0; x < DN; x++) { s = 0; c = 0; for (k = -r; k <= r; k++) { i = x + k; if (i >= 0 && i < DN) { s += a[y * DN + i]; c++; } } t[y * DN + x] = s / c; }
      for (x = 0; x < DN; x++) for (y = 0; y < DN; y++) { s = 0; c = 0; for (k = -r; k <= r; k++) { i = y + k; if (i >= 0 && i < DN) { s += t[i * DN + x]; c++; } } a[y * DN + x] = s / c; }
    }
    return a;
  }
  function blob(x, y, b) { var dx = (x - b[0]) / b[2], dy = (y - b[1]) / b[3]; return Math.exp(-(dx * dx + dy * dy) * 0.9); }
  function depthMap(img, cfg) {
    var c = document.createElement("canvas"); c.width = c.height = DN;
    var x2 = c.getContext("2d"); x2.drawImage(img, 0, 0, DN, DN);
    var px = x2.getImageData(0, 0, DN, DN).data, N = DN * DN, lum = new Float32Array(N), g = new Float32Array(N), i, x, y;
    for (i = 0; i < N; i++) lum[i] = (px[i * 4] * 0.299 + px[i * 4 + 1] * 0.587 + px[i * 4 + 2] * 0.114) / 255;
    for (y = 1; y < DN - 1; y++) for (x = 1; x < DN - 1; x++) {
      i = y * DN + x;
      var sx = lum[i - DN + 1] + 2 * lum[i + 1] + lum[i + DN + 1] - lum[i - DN - 1] - 2 * lum[i - 1] - lum[i + DN - 1];
      var sy = lum[i + DN - 1] + 2 * lum[i + DN] + lum[i + DN + 1] - lum[i - DN - 1] - 2 * lum[i - DN] - lum[i - DN + 1];
      g[i] = Math.sqrt(sx * sx + sy * sy);
    }
    box(g, 2, 4);
    var mx = 1e-6; for (i = 0; i < N; i++) if (g[i] > mx) mx = g[i];
    var d = new Float32Array(N);
    for (y = 0; y < DN; y++) for (x = 0; x < DN; x++) {
      i = y * DN + x;
      var u = (x + 0.5) / DN, v = (y + 0.5) / DN, s = Math.min(1, g[i] / (mx * 0.7));
      var P = Math.max(blob(u, v, cfg.head), 0.8 * blob(u, v, cfg.torso));       /* silhouette : tête et épaules */
      var nz = blob(u, v, [cfg.nose[0], cfg.nose[1], 0.07, 0.08]);               /* nez */
      d[i] = P * (0.62 + 0.38 * s) + 0.14 * nz * P + 0.10 * (lum[i] - 0.5) * P;  /* le flou d'arrière-plan reste au fond */
    }
    box(d, 2, 2);                                                               /* volume d'ensemble, lissé */
    var fine = new Float32Array(lum), wide = new Float32Array(lum);
    box(fine, 1, 1); box(wide, 1, 6);
    for (y = 0; y < DN; y++) for (x = 0; x < DN; x++) {                         /* relief fin : zones claires = en avant, ombres = en creux */
      i = y * DN + x;
      d[i] += 0.28 * (fine[i] - wide[i]) * blob((x + 0.5) / DN, (y + 0.5) / DN, cfg.head);
    }
    var lo = 1e9, hi = -1e9; for (i = 0; i < N; i++) { if (d[i] < lo) lo = d[i]; if (d[i] > hi) hi = d[i]; }
    var out = new Uint8Array(N); for (i = 0; i < N; i++) out[i] = Math.round(255 * (d[i] - lo) / (hi - lo + 1e-6));
    return out;
  }

  function loadTex(it) {
    var key = it.key, t = T[key];
    if (t) return t;
    t = T[key] = { ready: false, fail: false };
    try {
      var c = document.createElement("canvas"); c.width = c.height = TEX;
      var x = c.getContext("2d"); x.imageSmoothingEnabled = true; if ("imageSmoothingQuality" in x) x.imageSmoothingQuality = "high";
      x.drawImage(it.img, 0, 0, TEX, TEX);
      t.img = tex2d(c, true);
      t.dep = texDepth(depthMap(it.img, it.cfg));
      t.ready = true;
    } catch (e) { t.fail = true; }
    return t;
  }

  /* ---------- Éléments ---------- */
  function release(it, perm) { /* retour à l'image d'origine ; perm : ne plus jamais réessayer pour cette image */
    it.dead = true;
    if (perm) bad.add(it.img); else seen["delete"](it.img);  /* canvas retiré par la page : l'image pourra être remontée */
    if (it.img) it.img.style.display = "";
    if (it.cv && it.cv.parentNode) it.cv.parentNode.removeChild(it.cv);
    if (io) { io.unobserve(it.img); io.unobserve(it.cv); }
  }
  function mount(img) {
    if (disabled || (G && G.dead) || !img.parentNode || bad.has(img)) return;
    if (seen.has(img)) return;
    seen.add(img);
    var cv = document.createElement("canvas");
    cv.className = (img.className ? img.className + " " : "") + "a3d";
    if (img.alt) { cv.setAttribute("role", "img"); cv.setAttribute("aria-label", img.alt); } else cv.setAttribute("aria-hidden", "true");
    cv.width = cv.height = 2; cv.style.display = "none";
    img.parentNode.insertBefore(cv, img.nextSibling);
    var cfg = CFG[img.getAttribute("data-a3d")] || DEF;
    var it = { img: img, cv: cv, ctx: cv.getContext("2d"), cfg: cfg, ph: cfg.ph, cam: [0, 0], amp: 1, hot: false, shown: false, visI: false, visC: false, dead: false, key: "" };
    var host = img.closest ? img.closest("a,button") : null;
    if (host) { host.addEventListener("mouseenter", function () { it.hot = true; }); host.addEventListener("mouseleave", function () { it.hot = false; }); }
    img.addEventListener("load", wake);
    items.push(it);
    if (io) { io.observe(img); io.observe(cv); } else { it.visI = true; wake(); }
  }
  function scan() { Array.prototype.forEach.call(document.querySelectorAll(SEL), mount); }

  function onVis(entries) {
    entries.forEach(function (e) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].img === e.target) items[i].visI = e.isIntersecting;
        else if (items[i].cv === e.target) items[i].visC = e.isIntersecting;
      }
    });
    wake();
  }
  function anyVisible() { for (var i = 0; i < items.length; i++) if (!items[i].dead && (items[i].visI || items[i].visC)) return true; return false; }

  /* ---------- Rendu ---------- */
  function drawItem(it, t, pose) {
    var el = it.shown ? it.cv : it.img;
    if (!el.clientWidth || !el.clientHeight) return;
    if (!it.img.complete || !it.img.naturalWidth) return;
    if (!it.key) it.key = it.img.currentSrc || it.img.src;
    if (!G || !G.ok) { if (!init()) { release(it, true); return; } }
    var tx = loadTex(it);
    if (tx.fail) { release(it, true); return; }
    var dpr = Math.min(window.devicePixelRatio || 1, MAXDPR), w = Math.max(2, Math.round(el.clientWidth * dpr)), h = Math.max(2, Math.round(el.clientHeight * dpr));
    var gl = G.gl, c = G.c;
    if (w > c.width || h > c.height) { c.width = Math.max(c.width, w); c.height = Math.max(c.height, h); }
    if (it.cv.width !== w || it.cv.height !== h) { it.cv.width = w; it.cv.height = h; }

    /* pose : caméra virtuelle (mouvement de tête) et lumière */
    var cx, cy, lx, ly, zoom = ZOOM;
    if (pose) { cx = pose[0]; cy = pose[1]; lx = pose[2]; ly = pose[3]; }
    else {
      var ph = it.ph, idx = Math.sin(t * 0.72 + ph) * 0.55, idy = Math.cos(t * 0.53 + ph * 1.7) * 0.30, px = 0, py = 0;
      if (t * 1000 - mouse.t < 4000) {
        var r = it.cv.getBoundingClientRect(), ddx = (mouse.x - (r.left + r.width / 2)), ddy = (mouse.y - (r.top + r.height / 2)), dist = Math.sqrt(ddx * ddx + ddy * ddy), k = Math.max(0, 1 - dist / 520);
        px = Math.max(-1, Math.min(1, ddx / 240)) * k; py = Math.max(-1, Math.min(1, ddy / 240)) * k;
      }
      it.amp += ((it.hot ? 1.45 : 1) - it.amp) * 0.1;
      it.cam[0] += (idx * 0.7 + px * 1.0 - it.cam[0]) * 0.1; it.cam[1] += (idy * 0.7 + py * 0.8 - it.cam[1]) * 0.1;
      cx = it.cam[0] * it.amp; cy = it.cam[1] * it.amp;
      lx = -0.45 + Math.cos(t * 0.42 + ph) * 0.35 + it.cam[0] * 0.25; ly = 0.55 + Math.sin(t * 0.37 + ph) * 0.2 - it.cam[1] * 0.2;
      zoom += Math.sin(t * 1.55 + ph) * 0.007;                                   /* respiration */
    }
    gl.viewport(0, 0, w, h);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tx.img);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, tx.dep);
    var u = G.u;
    gl.uniform2f(u.uCam, cx, cy); gl.uniform2f(u.uLight, lx, ly); gl.uniform1f(u.uAmp, AMP); gl.uniform1f(u.uZoom, zoom); gl.uniform1f(u.uRel, RELIEF);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    it.ctx.drawImage(c, 0, c.height - h, w, h, 0, 0, w, h);                  /* copie immédiate (le tampon n'est pas conservé) */
    if (!it.shown) { it.shown = true; it.cv.style.display = ""; it.img.style.display = "none"; }
  }
  var STILL = [0.28, 0.12, -0.45, 0.55];
  function tick(now) {
    raf = 0;
    if (document.hidden || reduce) return;
    prune();
    if (!anyVisible()) return;
    if (!(G && G.soft)) raf = requestAnimationFrame(tick);   /* pas de boucle en rendu logiciel : trop coûteux */
    if (now - last < 1000 / FPS - 3) return;
    last = now;
    for (var i = 0; i < items.length; i++) { var it = items[i]; if (!it.dead && (it.visI || it.visC)) drawItem(it, now / 1000, null); }
  }
  function prune() {
    for (var i = items.length - 1; i >= 0; i--) {
      var it = items[i];
      if (it.dead || !it.cv.isConnected) { if (!it.dead) release(it, false); items.splice(i, 1); }
    }
  }
  function stills() { prune(); items.forEach(function (it) { if (!it.dead && (it.visI || it.visC)) drawItem(it, 0, STILL); }); }
  var lt = 0, lp = 0;
  function liteMove() { /* rendu logiciel : le regard suit le pointeur, mais on ne redessine que sur mouvement, 8 fois/s au plus */
    if (!G || !G.soft || reduce || document.hidden || lp) return;
    var d = 125 - (performance.now() - lt);
    lp = setTimeout(function () {
      lp = 0; lt = performance.now();
      items.forEach(function (it) {
        if (it.dead || !(it.visI || it.visC)) return;
        var r = it.cv.getBoundingClientRect(), dx = mouse.x - (r.left + r.width / 2), dy = mouse.y - (r.top + r.height / 2), k = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 520);
        var px = Math.max(-1, Math.min(1, dx / 240)) * k, py = Math.max(-1, Math.min(1, dy / 240)) * k;
        drawItem(it, 0, [0.28 + px * 0.9, 0.12 + py * 0.7, STILL[2] + px * 0.25, STILL[3] - py * 0.2]);
      });
    }, Math.max(0, d));
  }
  function wake() {
    if (reduce) { setTimeout(stills, 0); return; }
    if (!raf && !document.hidden && anyVisible()) raf = requestAnimationFrame(tick);
  }

  /* ---------- Démarrage ---------- */
  function start() {
    if (disabled) return;
    if ("IntersectionObserver" in window) io = new IntersectionObserver(onVis, { rootMargin: "80px" });
    scan();
    if ("MutationObserver" in window) {
      var pend = false;
      mo = new MutationObserver(function () { if (pend) return; pend = true; (window.requestAnimationFrame || setTimeout)(function () { pend = false; scan(); }); });
      mo.observe(document.body, { childList: true, subtree: true });
    }
    document.addEventListener("visibilitychange", wake);
    window.addEventListener("resize", function () { if (reduce || (G && G.soft)) wake(); }, { passive: true });
    window.addEventListener("pointermove", function (e) { mouse.x = e.clientX; mouse.y = e.clientY; mouse.t = performance.now(); liteMove(); }, { passive: true });
    if (mq && mq.addEventListener) mq.addEventListener("change", function (e) { reduce = e.matches; wake(); });
  }
  window.Avatar3D = { version: 1, _items: items, _state: function () { return { soft: !!(G && G.soft), gl: !!(G && G.ok), dead: !!(G && G.dead), items: items.length, shown: items.filter(function (i) { return i.shown; }).length, running: !!raf }; } };
  function info() { /* ajouter ?a3d=info à l'adresse : affiche l'état du moteur (diagnostic) */
    var b = document.createElement("pre"); b.style.cssText = "position:fixed;left:8px;bottom:8px;z-index:99999;margin:0;padding:8px 10px;background:#0b1f4d;color:#fff;font:12px/1.4 monospace;border-radius:8px;max-width:92vw;white-space:pre-wrap";
    document.body.appendChild(b);
    function up() {
      var st = window.Avatar3D._state(), r = "?";
      try { var e = G && G.gl && G.gl.getExtension("WEBGL_debug_renderer_info"); if (e) r = G.gl.getParameter(e.UNMASKED_RENDERER_WEBGL); } catch (x) {}
      b.textContent = "Avatar3D v1 | webgl: " + (st.gl ? (st.soft ? "logiciel (mode léger)" : "matériel") : (st.dead ? "indisponible" : "pas encore")) + " | avatars: " + st.shown + "/" + st.items + " | économiseur de données: " + !!disabled + " | animations réduites: " + !!reduce + " | carte: " + r;
    }
    up(); setInterval(up, 1000);
  }
  if (/[?&]a3d=info\b/.test(location.search)) document.addEventListener("DOMContentLoaded", info);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
