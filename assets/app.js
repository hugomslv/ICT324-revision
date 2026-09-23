/* ICT-324 : comportement du site (fonctionne en file://, sans réseau) */
(function () {
  "use strict"
  var root = document.body.getAttribute("data-root") || ""
  var store = {
    get: function (k) { try { return localStorage.getItem(k) } catch (e) { return null } },
    set: function (k, v) { try { localStorage.setItem(k, v) } catch (e) { /* privé */ } },
  }

  /* ---------------- thème */
  var themeBtn = document.getElementById("theme-toggle")
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var cur = document.documentElement.dataset.theme
    var dark = cur ? cur === "dark" : matchMedia("(prefers-color-scheme: dark)").matches
    var next = dark ? "light" : "dark"
    document.documentElement.dataset.theme = next
    store.set("theme", next)
  })

  /* ---------------- menu mobile : fermer au clic sur un lien */
  document.querySelectorAll(".sidebar a").forEach(function (a) {
    a.addEventListener("click", function () { document.body.classList.remove("nav-open") })
  })
  var act = document.querySelector(".nav-link.active")
  if (act) act.scrollIntoView({ block: "center" })

  /* ---------------- bouton copier */
  function copyText(text, btn) {
    function ok() { btn.textContent = "Copié ✓"; btn.classList.add("done"); setTimeout(function () { btn.textContent = "Copier"; btn.classList.remove("done") }, 1400) }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(ok, fallback)
    } else fallback()
    function fallback() {
      var ta = document.createElement("textarea")
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0"
      document.body.appendChild(ta); ta.select()
      try { document.execCommand("copy"); ok() } catch (e) { btn.textContent = "Ctrl+C" }
      document.body.removeChild(ta)
    }
  }
  document.querySelectorAll(".code").forEach(function (box) {
    var btn = document.createElement("button")
    btn.className = "copy-btn"; btn.type = "button"; btn.textContent = "Copier"
    btn.addEventListener("click", function () {
      var code = box.querySelector("code").innerText
      // enlève le "$ " des lignes de commande
      if (/lang-(bash|sh|shell|console)/.test(box.querySelector("code").className)) {
        code = code.split("\n").map(function (l) { return l.replace(/^\$ /, "") }).join("\n")
      }
      copyText(code, btn)
    })
    box.appendChild(btn)
  })

  /* ---------------- checklists persistantes */
  var page = location.pathname.split("/").slice(-2).join("/")
  var boxes = document.querySelectorAll("li.task-list-item input[type=checkbox], .doc li > input[type=checkbox]")
  function updateProgress() {
    var bar = document.querySelector(".progress > span")
    var label = document.getElementById("progress-label")
    if (!bar || !boxes.length) return
    var n = 0
    boxes.forEach(function (b) { if (b.checked) n++ })
    bar.style.width = (100 * n / boxes.length) + "%"
    if (label) label.textContent = n + " / " + boxes.length
  }
  boxes.forEach(function (b, i) {
    var li = b.closest("li")
    if (li) li.classList.add("task-list-item")
    b.disabled = false
    var key = "chk:" + page + ":" + i
    if (store.get(key) === "1") { b.checked = true; if (li) li.classList.add("checked") }
    b.addEventListener("change", function () {
      store.set(key, b.checked ? "1" : "0")
      if (li) li.classList.toggle("checked", b.checked)
      updateProgress()
    })
  })
  updateProgress()
  var reset = document.getElementById("reset-checks")
  if (reset) reset.addEventListener("click", function () {
    boxes.forEach(function (b, i) {
      b.checked = false; store.set("chk:" + page + ":" + i, "0")
      var li = b.closest("li"); if (li) li.classList.remove("checked")
    })
    updateProgress()
  })

  /* ---------------- table des matières : section courante */
  var tocLinks = document.querySelectorAll(".toc a")
  if (tocLinks.length && "IntersectionObserver" in window) {
    var map = {}
    tocLinks.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a })
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove("current") })
          var a = map[en.target.id]; if (a) a.classList.add("current")
        }
      })
    }, { rootMargin: "-70px 0px -70% 0px" })
    document.querySelectorAll(".doc h2[id], .doc h3[id]").forEach(function (h) { obs.observe(h) })
  }

  /* ---------------- filtre des règles ESLint */
  var rf = document.getElementById("rule-filter")
  var rt = document.getElementById("rule-type")
  function filterRules() {
    var q = (rf.value || "").toLowerCase().trim()
    var t = rt ? rt.value : ""
    document.querySelectorAll("#rules-table tbody tr").forEach(function (tr) {
      var ok = (!q || tr.textContent.toLowerCase().indexOf(q) !== -1) && (!t || tr.getAttribute("data-type") === t)
      tr.style.display = ok ? "" : "none"
    })
  }
  if (rf) { rf.addEventListener("input", filterRules); if (rt) rt.addEventListener("change", filterRules) }

  /* ---------------- compte à rebours examen */
  var cd = document.getElementById("countdown")
  if (cd) {
    var exam = new Date(2026, 8, 24, 8, 0, 0)
    var d = Math.ceil((exam - new Date()) / 86400000)
    cd.textContent = d > 1 ? "dans " + d + " jours" : d === 1 ? "demain" : d === 0 ? "aujourd'hui" : "passé"
  }

  /* ---------------- recherche */
  var modal = document.getElementById("search-modal")
  var input = document.getElementById("search-input")
  var results = document.getElementById("search-results")
  var loaded = false, sel = 0, current = []

  function norm(s) { return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "") }
  function escH(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c] }) }

  function load(cb) {
    if (loaded) return cb()
    var s = document.createElement("script")
    s.src = root + "assets/search-index.js"
    s.onload = function () {
      loaded = true
      window.SEARCH_INDEX.forEach(function (d) {
        d._t = norm(d.t); d._x = norm(d.x); d._h = d.h.map(function (h) { return norm(h[1]) })
      })
      cb()
    }
    s.onerror = function () { results.innerHTML = "<p>Index de recherche introuvable.</p>" }
    document.head.appendChild(s)
  }
  function open() {
    modal.hidden = false; input.focus(); input.select()
    load(function () { if (input.value) run() })
  }
  function close() { modal.hidden = true }
  var sb = document.getElementById("search-open")
  if (sb) sb.addEventListener("click", open)
  modal.addEventListener("click", function (e) { if (e.target === modal) close() })
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); open() }
    else if (e.key === "/" && modal.hidden && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); open() }
    else if (e.key === "Escape" && !modal.hidden) close()
  })
  var SEC = { perso: "Mes pages", eslint: "ESLint", vitest: "Vitest", vite: "Vite", jsdoc: "JSDoc" }

  function run() {
    var q = norm(input.value).trim()
    if (q.length < 2) { results.innerHTML = "<p class=\"muted\">Tape au moins 2 caractères.</p>"; return }
    var terms = q.split(/\s+/).filter(Boolean)
    var on = {}
    document.querySelectorAll(".search-filters input").forEach(function (c) { on[c.getAttribute("data-f")] = c.checked })
    var scored = []
    window.SEARCH_INDEX.forEach(function (d) {
      if (!on[d.s]) return
      var score = 0, head = null
      for (var i = 0; i < terms.length; i++) {
        var t = terms[i], s = 0
        if (d._t === t) s += 120
        else if (d._t.indexOf(t) === 0) s += 60
        else if (d._t.indexOf(t) !== -1) s += 35
        for (var j = 0; j < d._h.length; j++) {
          if (d._h[j].indexOf(t) !== -1) { s += 14; if (!head) head = d.h[j]; break }
        }
        var c = 0, p = d._x.indexOf(t)
        while (p !== -1 && c < 12) { c++; p = d._x.indexOf(t, p + t.length) }
        s += Math.min(c, 12) * 1.5
        if (!s) return
        score += s
      }
      if (d.s === "perso") score *= 1.6
      scored.push({ d: d, score: score, head: head })
    })
    scored.sort(function (a, b) { return b.score - a.score })
    current = scored.slice(0, 40)
    sel = 0
    if (!current.length) { results.innerHTML = "<p>Aucun résultat. Essaie en anglais pour les docs officielles (ex : <em>semicolon</em>, <em>mock</em>, <em>base</em>).</p>"; return }
    results.innerHTML = current.map(function (r, i) {
      var d = r.d
      var p = d._x.indexOf(terms[0]), snip = ""
      if (p !== -1) snip = d.x.slice(Math.max(0, p - 60), p + 140)
      else snip = d.x.slice(0, 160)
      var hl = escH(snip)
      terms.forEach(function (t) {
        if (t.length < 2) return
        try { hl = hl.replace(new RegExp("(" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi"), "<mark>$1</mark>") } catch (e) { /* */ }
      })
      var url = root + d.u + (r.head ? "#" + r.head[0] : "")
      return "<a class=\"sr" + (i === 0 ? " sel" : "") + "\" href=\"" + url + "\"><div class=\"sr-title\">" + escH(d.t) + "<span class=\"badge\">" + SEC[d.s] + "</span></div>" +
        (r.head ? "<div class=\"sr-heads\">§ " + escH(r.head[1]) + "</div>" : "") +
        "<div class=\"sr-snip\">…" + hl + "…</div></a>"
    }).join("")
  }
  var timer
  input.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(function () { load(run) }, 90) })
  document.querySelectorAll(".search-filters input").forEach(function (c) { c.addEventListener("change", function () { load(run) }) })
  input.addEventListener("keydown", function (e) {
    var items = results.querySelectorAll(".sr")
    if (!items.length) return
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      items[sel].classList.remove("sel")
      sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length
      items[sel].classList.add("sel"); items[sel].scrollIntoView({ block: "nearest" })
    } else if (e.key === "Enter") { e.preventDefault(); location.href = items[sel].href; close() }
  })
})()
