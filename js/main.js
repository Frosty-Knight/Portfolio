/* =========================================================
   Portfolio behavior. You normally never need to edit this.
   To add content, edit the HTML: every picture / video / clip
   is a  <div class="media" data-src="assets/...">  slot.
   ========================================================= */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var ROOT = document.body.getAttribute("data-root") || ""; // "" on the home page, "../" on project pages

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="M21 16l-5-5-8 9"/></svg>';

  /* ---------- media slots ---------- */
  function isVideo(src) { return /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(src); }
  function ytId(src) {
    var m = src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
    return m ? m[1] : null;
  }
  function placeholder(el, note) {
    var label = el.getAttribute("data-label") || "Add media here";
    var path = el.getAttribute("data-src");
    var hint = note || (path ? "Add your file at:" : "Set data-src to your file, e.g.");
    el.classList.add("is-ph");
    el.removeAttribute("data-zoom");
    var ph = document.createElement("div");
    ph.className = "ph";
    ph.innerHTML = ICON + "<strong></strong><span></span><code></code>";
    ph.querySelector("strong").textContent = label;
    ph.querySelector("span").textContent = hint;
    ph.querySelector("code").textContent = path || el.getAttribute("data-example") || "assets/img/your-file.jpg";
    el.appendChild(ph);
  }
  function caption(el) {
    var c = el.getAttribute("data-caption");
    if (c) { var f = document.createElement("figcaption"); f.textContent = c; el.appendChild(f); }
  }
  function buildMedia(el) {
    var src = el.getAttribute("data-src");
    var ratio = el.getAttribute("data-ratio");
    if (ratio) el.style.setProperty("--ratio", ratio.replace(":", " / "));
    if (!src) { placeholder(el); return; }
    var full = src.indexOf("http") === 0 ? src : ROOT + src;
    var id = ytId(src);
    if (id) {
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?rel=0";
      f.loading = "lazy"; f.allowFullscreen = true; f.title = el.getAttribute("data-label") || "Video";
      f.setAttribute("allow", "accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen");
      el.appendChild(f); caption(el); return;
    }
    if (isVideo(src)) {
      var v = document.createElement("video");
      v.src = full; v.preload = "metadata"; v.playsInline = true; el.classList.add("has-video");
      if (el.getAttribute("data-poster")) v.poster = ROOT + el.getAttribute("data-poster");
      if (el.hasAttribute("data-autoplay")) { v.muted = true; v.loop = true; v.autoplay = true; }
      else { v.controls = true; }
      v.addEventListener("error", function () { v.remove(); placeholder(el); });
      el.appendChild(v); caption(el); return;
    }
    var img = new Image();
    img.alt = el.getAttribute("data-alt") || el.getAttribute("data-caption") || el.getAttribute("data-label") || "";
    img.loading = el.hasAttribute("data-eager") ? "eager" : "lazy";
    img.decoding = "async";
    img.addEventListener("error", function () { img.remove(); placeholder(el); var t = el.closest(".tile"); if (t) t.classList.add("is-ph"); });
    img.addEventListener("load", function () { if (el.hasAttribute("data-lightbox")) { el.setAttribute("data-zoom", ""); el.tabIndex = 0; el.setAttribute("role", "button"); el.setAttribute("aria-label", "Enlarge image: " + (img.alt || "")); } });
    img.src = full;
    el.appendChild(img); caption(el);
  }
  $$(".media").forEach(buildMedia);

  /* hover-to-play preview on cards (optional: data-hover-src="assets/video/clip.mp4") */
  $$(".card .media[data-hover-src]").forEach(function (m) {
    var card = m.closest(".card"), vid = null, failed = false;
    function start() {
      if (failed || reduce) return;
      if (!vid) {
        vid = document.createElement("video");
        vid.src = ROOT + m.getAttribute("data-hover-src");
        vid.muted = true; vid.loop = true; vid.playsInline = true;
        vid.style.opacity = 0; vid.style.transition = "opacity .3s";
        vid.addEventListener("error", function () { failed = true; vid.remove(); vid = null; });
        vid.addEventListener("playing", function () { vid.style.opacity = 1; });
        m.appendChild(vid);
      }
      var p = vid.play(); if (p && p.catch) p.catch(function () {});
    }
    function stop() { if (vid) { vid.pause(); vid.style.opacity = 0; } }
    card.addEventListener("pointerenter", start); card.addEventListener("pointerleave", stop);
    card.addEventListener("focusin", start); card.addEventListener("focusout", stop);
  });

  /* ---------- nav ---------- */
  var nav = $(".nav");
  function onScroll() { if (nav) nav.classList.toggle("scrolled", window.scrollY > 24); }
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  var mb = $(".menu-btn"), pills = $(".pills");
  if (mb && pills) {
    mb.addEventListener("click", function () { var o = pills.classList.toggle("open"); mb.setAttribute("aria-expanded", o); });
    $$("a", pills).forEach(function (a) { a.addEventListener("click", function () { pills.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); }); });
  }
  // highlight the pill for the section you are looking at (home page only)
  var secLinks = $$(".pills a[data-section]");
  if (secLinks.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (e.isIntersecting) {
          secLinks.forEach(function (a) { a.classList.toggle("active", a.getAttribute("data-section") === e.target.id); });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    secLinks.forEach(function (a) { var s = document.getElementById(a.getAttribute("data-section")); if (s) io.observe(s); });
  }

  /* ---------- reveal on scroll ---------- */
  var rev = $$(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var ro = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); } });
    }, { threshold: 0.12 });
    rev.forEach(function (r) { ro.observe(r); });
  } else { rev.forEach(function (r) { r.classList.add("in"); }); }

  /* ---------- hero: drifting light motes + mouse parallax ---------- */
  var cv = $("#motes");
  if (cv && !reduce) {
    var ctx = cv.getContext("2d"), W, H, dots = [], N = 46;
    var resize = function () { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    for (var i = 0; i < N; i++) dots.push({ x: Math.random(), y: Math.random(), r: 1 + Math.random() * 2.4, s: .02 + Math.random() * .05, a: Math.random() * 6.28, c: Math.random() > .6 ? "255,159,28" : "236,220,176" });
    (function tick() {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(function (d) {
        d.a += .004; d.y -= d.s / 60; d.x += Math.sin(d.a) * .0004;
        if (d.y < -.02) { d.y = 1.02; d.x = Math.random(); }
        ctx.beginPath(); ctx.fillStyle = "rgba(" + d.c + "," + (.25 + .35 * Math.abs(Math.sin(d.a * 1.7))) + ")";
        ctx.arc(d.x * W, d.y * H, d.r, 0, 6.283); ctx.fill();
      });
      requestAnimationFrame(tick);
    })();
  }

  /* ---------- gallery filter ---------- */
  var chips = $$(".chip[data-filter]"), tiles = $$(".gallery .tile");
  chips.forEach(function (c) {
    c.addEventListener("click", function () {
      var f = c.getAttribute("data-filter");
      chips.forEach(function (o) { o.setAttribute("aria-pressed", o === c ? "true" : "false"); });
      tiles.forEach(function (t) { t.hidden = !(f === "all" || t.getAttribute("data-cat").split(" ").indexOf(f) > -1); });
    });
  });

  /* ---------- lightbox ---------- */
  var dlg = $("#lb");
  var group = [], idx = 0;
  function show(i) {
    idx = (i + group.length) % group.length;
    var m = group[idx], stage = $(".lb-stage", dlg), cap = $(".lb-cap", dlg);
    stage.innerHTML = "";
    var src = ROOT + (m.getAttribute("data-full") || m.getAttribute("data-src"));
    if (isVideo(src)) { var v = document.createElement("video"); v.src = src; v.controls = true; v.autoplay = true; stage.appendChild(v); }
    else { var im = new Image(); im.src = src; im.alt = m.getAttribute("data-caption") || ""; stage.appendChild(im); }
    cap.textContent = m.getAttribute("data-caption") || m.getAttribute("data-label") || "";
    var multi = group.length > 1;
    $(".prev", dlg).style.display = multi ? "" : "none"; $(".next-b", dlg).style.display = multi ? "" : "none";
  }
  function open(m) {
    var scope = m.closest("[data-lbgroup]") || document;
    group = $$(".media[data-zoom]", scope).filter(function (x) { return !x.closest("[hidden]"); });
    if (!group.length) group = [m];
    var i = group.indexOf(m); show(i < 0 ? 0 : i);
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  }
  if (dlg) {
    document.addEventListener("click", function (e) {
      var m = e.target.closest(".media[data-zoom]");
      if (m) { e.preventDefault(); open(m); }
    });
    document.addEventListener("keydown", function (e) {
      var m = e.target.closest && e.target.closest(".media[data-zoom]");
      if (m && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(m); }
    });
    $(".x", dlg).addEventListener("click", function () { dlg.close(); });
    $(".prev", dlg).addEventListener("click", function () { show(idx - 1); });
    $(".next-b", dlg).addEventListener("click", function () { show(idx + 1); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg || e.target.classList.contains("lb-inner") || e.target.classList.contains("lb-stage")) dlg.close(); });
    dlg.addEventListener("close", function () { $(".lb-stage", dlg).innerHTML = ""; });
    document.addEventListener("keydown", function (e) {
      if (!dlg.open) return;
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---------- project tabs (linkable: page.html#environment) ---------- */
  var tablist = $('[role="tablist"]');
  if (tablist) {
    var tabs = $$('[role="tab"]', tablist);
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute("aria-controls")); });
    var select = function (name, push) {
      var k = tabs.findIndex(function (t) { return t.id === "tab-" + name; });
      if (k < 0) k = 0;
      tabs.forEach(function (t, j) { t.setAttribute("aria-selected", j === k); t.tabIndex = j === k ? 0 : -1; panels[j].hidden = j !== k; });
      if (push) history.replaceState(null, "", "#" + tabs[k].id.replace("tab-", ""));
    };
    tabs.forEach(function (t, k) {
      t.addEventListener("click", function () {
        select(t.id.replace("tab-", ""), true);
        var bar = $(".tabbar"); if (bar && window.scrollY > bar.offsetTop) window.scrollTo({ top: bar.offsetTop - 60, behavior: reduce ? "auto" : "smooth" });
      });
      t.addEventListener("keydown", function (e) {
        var n = e.key === "ArrowRight" ? k + 1 : e.key === "ArrowLeft" ? k - 1 : null;
        if (n === null) return; n = (n + tabs.length) % tabs.length; tabs[n].focus(); tabs[n].click();
      });
    });
    select((location.hash || "#" + tabs[0].id.replace("tab-", "")).slice(1), false);
    window.addEventListener("hashchange", function () { select(location.hash.slice(1), false); });
  }

  /* ---------- design-doc buttons: grey out if the PDF isn't uploaded yet ---------- */
  if (location.protocol.indexOf("http") === 0) {
    $$("a[data-doc]").forEach(function (a) {
      fetch(a.href, { method: "HEAD" }).then(function (r) { if (!r.ok) a.classList.add("disabled"); }).catch(function () { a.classList.add("disabled"); });
    });
  }

  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
})();
