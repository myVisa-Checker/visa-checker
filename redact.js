/* Masquage local d'une image avant envoi à Joury ou Aicha.
   Tout se passe dans le navigateur : rien n'est envoyé tant que la personne n'a pas validé,
   et l'image enregistrée est « aplatie » (les zones noires remplacent les pixels, pas de calque ni de métadonnées). */
(function () {
  "use strict";
  var T = {
    fr: { btn: "Masquer des zones", title: "Masquer les données inutiles",
      help: "Glissez le doigt (ou la souris) sur l'image pour cacher le numéro de passeport et les lignes de chiffres en bas de la page. Gardez le nom et les dates visibles.",
      undo: "Annuler le dernier", apply: "Valider", cancel: "Fermer", done: "zone(s) masquée(s)",
      pdf: "PDF : masquez le numéro avant de l'importer, ou envoyez plutôt une photo.", err: "Image illisible. Choisissez un autre fichier.", none: "Dessinez au moins une zone, ou fermez." },
    en: { btn: "Hide areas", title: "Hide unneeded data",
      help: "Drag your finger (or mouse) over the image to cover the passport number and the lines of digits at the bottom of the page. Keep the name and dates visible.",
      undo: "Undo last", apply: "Apply", cancel: "Close", done: "area(s) hidden",
      pdf: "PDF: hide the number before importing it, or send a photo instead.", err: "Unreadable image. Choose another file.", none: "Draw at least one area, or close." },
    ar: { btn: "إخفاء مناطق", title: "إخفاء البيانات غير اللازمة",
      help: "مرّر إصبعك (أو الفأرة) على الصورة لتغطية رقم جواز السفر وسطور الأرقام في أسفل الصفحة. أبقِ الاسم والتواريخ ظاهرة.",
      undo: "تراجع عن الأخير", apply: "تأكيد", cancel: "إغلاق", done: "مناطق مخفية",
      pdf: "PDF: أخفِ الرقم قبل استيراده، أو أرسل صورة بدلاً منه.", err: "الصورة غير مقروءة. اختر ملفاً آخر.", none: "ارسم منطقة واحدة على الأقل، أو أغلق." }
  };
  function t(lang, k) { return (T[lang] || T.fr)[k] || T.fr[k] || ""; }
  var MAX = 2000;

  function open(file, lang) {
    return new Promise(function (resolve) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () { build(img); };
      img.onerror = function () { URL.revokeObjectURL(url); window.alert(t(lang, "err")); resolve(null); };
      img.src = url;

      function build(im) {
        var k = Math.min(1, MAX / Math.max(im.naturalWidth, im.naturalHeight)),
            w = Math.max(1, Math.round(im.naturalWidth * k)), h = Math.max(1, Math.round(im.naturalHeight * k));
        var dlg = document.createElement("dialog");
        dlg.className = "rd";
        dlg.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
        dlg.setAttribute("aria-labelledby", "rd-t");
        dlg.innerHTML = '<div class="rd-in"><h2 id="rd-t"></h2><p class="rd-help"></p><canvas class="rd-cv"></canvas><p class="rd-msg" role="status" aria-live="polite"></p>' +
          '<div class="rd-bar"><button type="button" class="rd-b" data-a="undo"></button><button type="button" class="rd-b" data-a="cancel"></button><button type="button" class="rd-b rd-go" data-a="apply"></button></div></div>';
        dlg.querySelector("#rd-t").textContent = t(lang, "title");
        dlg.querySelector(".rd-help").textContent = t(lang, "help");
        dlg.querySelector('[data-a="undo"]').textContent = t(lang, "undo");
        dlg.querySelector('[data-a="cancel"]').textContent = t(lang, "cancel");
        dlg.querySelector('[data-a="apply"]').textContent = t(lang, "apply");
        var cv = dlg.querySelector(".rd-cv"), msg = dlg.querySelector(".rd-msg"), ctx = cv.getContext("2d");
        cv.width = w; cv.height = h;
        var rects = [], cur = null, finished = false;

        function draw() {
          ctx.drawImage(im, 0, 0, w, h);
          ctx.fillStyle = "#000";
          rects.concat(cur ? [cur] : []).forEach(function (r) { ctx.fillRect(r.x, r.y, r.w, r.h); });
        }
        function pt(e) {
          var b = cv.getBoundingClientRect();
          return { x: Math.min(w, Math.max(0, (e.clientX - b.left) * w / b.width)), y: Math.min(h, Math.max(0, (e.clientY - b.top) * h / b.height)) };
        }
        function norm(a, b) { return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y) }; }
        var start = null;
        cv.addEventListener("pointerdown", function (e) { e.preventDefault(); start = pt(e); try { cv.setPointerCapture(e.pointerId); } catch (x) {} });
        cv.addEventListener("pointermove", function (e) { if (!start) return; cur = norm(start, pt(e)); draw(); });
        function end(e) {
          if (!start) return;
          var r = norm(start, pt(e)); start = null; cur = null;
          if (r.w > 6 && r.h > 6) rects.push(r);
          draw(); msg.textContent = rects.length ? rects.length + " " + t(lang, "done") : "";
        }
        cv.addEventListener("pointerup", end);
        cv.addEventListener("pointercancel", function () { start = null; cur = null; draw(); });

        function finish(result) {
          if (finished) return; finished = true;
          URL.revokeObjectURL(url);
          try { dlg.close(); } catch (x) {}
          if (dlg.parentNode) dlg.parentNode.removeChild(dlg);
          resolve(result);
        }
        dlg.addEventListener("cancel", function (e) { e.preventDefault(); finish(null); });
        dlg.addEventListener("click", function (e) {
          var a = e.target && e.target.getAttribute && e.target.getAttribute("data-a");
          if (a === "undo") { rects.pop(); draw(); msg.textContent = rects.length ? rects.length + " " + t(lang, "done") : ""; }
          else if (a === "cancel") finish(null);
          else if (a === "apply") {
            if (!rects.length) { msg.textContent = t(lang, "none"); return; }
            draw();
            cv.toBlob(function (blob) {
              if (!blob) { msg.textContent = t(lang, "err"); return; }
              var base = (file.name || "document").replace(/\.[^.]+$/, "");
              finish(new File([blob], base + "-masque.jpg", { type: "image/jpeg" }));
            }, "image/jpeg", 0.9);
          }
        });
        document.body.appendChild(dlg);
        draw();
        if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
      }
    });
  }

  window.vcRedact = { open: open, t: t };
})();
