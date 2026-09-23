// Générateur du site de révision ICT-324 (100 % hors-ligne, fonctionne en file://)
import fs from "node:fs"
import path from "node:path"
import { Marked } from "marked"
import matter from "gray-matter"
import hljs from "highlight.js"

const SCRATCH = path.resolve(import.meta.dirname, "..")
const CONTENT = path.join(SCRATCH, "content")
const REPOS = path.join(SCRATCH, "repos")
const OUT = process.env.OUT || path.join(SCRATCH, "site")

// ---------------------------------------------------------------- helpers
const esc = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
const write = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, data)
}
const slugify = (s) => s.toLowerCase()
  .normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/<[^>]+>/g, "").replace(/&[a-z]+;/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section"
const stripTags = (h) => h.replace(/<script[\s\S]*?<\/script>/g, " ")
  .replace(/<style[\s\S]*?<\/style>/g, " ")
  .replace(/<[^>]+>/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&amp;/g, "&")
  .replace(/\s+/g, " ").trim()

const LANG_ALIAS = {
  js: "javascript", mjs: "javascript", cjs: "javascript", jsx: "javascript",
  ts: "typescript", tsx: "typescript", mts: "typescript",
  sh: "bash", shell: "bash", zsh: "bash", console: "bash", shellscript: "bash",
  jsonc: "json", json5: "json", html: "xml", vue: "xml", svg: "xml",
  md: "markdown", yml: "yaml", txt: "plaintext", text: "plaintext",
  ps1: "powershell", powershell: "powershell", cmd: "dos", bat: "dos",
  ini: "ini", env: "ini", diff: "diff", css: "css", scss: "scss",
}
function highlight(code, lang) {
  let l = (lang || "").toLowerCase()
  l = LANG_ALIAS[l] || l
  if (l && hljs.getLanguage(l)) {
    try { return hljs.highlight(code, { language: l }).value } catch { /* */ }
  }
  return esc(code)
}

// --------------------------------------------------- markdown -> html
// Blocs ":::" (vitepress / eslint / jsdoc) transformés avant marked
const CONTAINER_LABELS = {
  tip: "💡 Astuce", info: "ℹ️ Info", warning: "⚠️ Attention",
  danger: "🛑 Danger", important: "❗ Important", note: "📝 Note",
  correct: "✅ Correct (OK)", incorrect: "❌ Incorrect (KO)",
  ok: "✅ OK", ko: "❌ KO", example: "🧪 Exemple", exam: "🎯 Examen",
  "code-group": "", details: "",
}
function preprocess(md, { onInclude } = {}) {
  // retirer les balises nunjucks / vue non pertinentes
  md = md.replace(/\{%-?\s*(raw|endraw)\s*-?%\}/g, "")
  md = md.replace(/^\s*\{%-?[\s\S]*?-?%\}\s*$/gm, "")
  md = md.replace(/<script setup[\s\S]*?<\/script>/g, "")
  md = md.replace(/^\[\[toc\]\]\s*$/gm, "")
  md = md.replace(/^<<<\s+.*$/gm, "> *(extrait de code externe non inclus)*")
  // macros npm_tabs / npx_tabs d'ESLint -> bloc bash
  md = md.replace(/\{\{\s*(npm|npx)_tabs\s*\((\{[\s\S]*?\})\)\s*\}\}/g,
    (all, kind, obj) => {
      try {
        const o = new Function(`return (${obj})`)()
        const pk = (o.packages || []).join(" ")
        const args = (o.args || []).join(" ")
        let cmd
        if (kind === "npx") cmd = `npx ${o.package || pk} ${args}`
        else if (o.command === "install") cmd = `npm install ${args} ${pk}`
        else if (o.command === "init-create") cmd = `npm init ${pk} ${args}`
        else cmd = `npm ${o.command || ""} ${pk} ${args}`
        return "```bash\n" + cmd.replace(/\s+/g, " ").trim() + "\n```"
      } catch { return "" }
    })
  // include de fichiers (pages perso) : @@include chemin [lang] [titre]@@
  if (onInclude) md = md.replace(/^@@include\s+(\S+)(?:\s+(\S+))?@@$/gm,
    (a, p, lang) => onInclude(p, lang))
  // containers :::
  const lines = md.split("\n")
  const out = []
  const stack = []
  let fence = null
  for (const line of lines) {
    const f = line.match(/^\s*(`{3,}|~{3,})/)
    if (f) {
      if (!fence) fence = f[1]
      else if (line.trim().startsWith(fence) &&
        line.trim().replace(/[`~]/g, "") === "") fence = null
      out.push(line); continue
    }
    if (fence) { out.push(line); continue }
    const open = line.match(/^\s*:::+\s*([a-z-]+)\s*(.*)$/i)
    if (open && CONTAINER_LABELS[open[1].toLowerCase()] !== undefined) {
      const kind = open[1].toLowerCase()
      let title = open[2].trim()
      if (title.startsWith("{")) title = "" // options eslint
      title = title.replace(/^["']|["']$/g, "")
      const fmt = (t) => esc(t).replace(/`([^`]+)`/g, "<code>$1</code>")
      stack.push(kind)
      if (kind === "details") {
        out.push(`\n<details class="box"><summary>${fmt(title || "Détails")}</summary>\n`)
      } else if (kind === "code-group") {
        out.push("\n<div class=\"code-group\">\n")
      } else {
        const label = title ? `${CONTAINER_LABELS[kind]} : ${fmt(title)}`
          : CONTAINER_LABELS[kind]
        out.push(`\n<div class="box box-${kind}"><div class="box-title">${label}</div>\n`)
      }
      continue
    }
    if (/^\s*:::+\s*$/.test(line) && stack.length) {
      const kind = stack.pop()
      out.push(kind === "details" ? "\n</details>\n" : "\n</div>\n")
      continue
    }
    out.push(line)
  }
  while (stack.length) out.push(stack.pop() === "details" ? "</details>" : "</div>")
  return out.join("\n")
}

const ghSlug = (s) => stripTags(s).toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^\w\s-]/g, "").trim().replace(/\s/g, "-") || "section"
function makeMarked(slugMode) {
  const headings = []
  const m = new Marked({ gfm: true })
  const used = new Set()
  m.use({
    renderer: {
      code({ text, lang }) {
        const info = (lang || "").trim()
        const title = (info.match(/\[([^\]]+)\]/) || [])[1]
        const l = info.split(/[\s{[]/)[0]
        // nettoyer les annotations vitepress / twoslash
        const clean = text
          .split("\n")
          .filter((ln) => !/^\s*\/\/\s*(\^\?|@noErrors|@errors|@filename|---cut)/.test(ln))
          .map((ln) => ln.replace(/\s*\/\/\s*\[!code[^\]]*\]/g, ""))
          .join("\n")
        const cap = title ? `<div class="code-title">${esc(title)}</div>` : ""
        return `<div class="code">${cap}<pre><code class="hljs lang-${esc(l || "txt")}">${highlight(clean, l)}</code></pre></div>\n`
      },
      heading({ tokens, depth, text }) {
        let inner = this.parser.parseInline(tokens)
        let id
        const custom = inner.match(/\s*\{#([\w-]+)\}\s*$/)
        if (custom) { id = custom[1]; inner = inner.replace(custom[0], "") }
        const named = inner.match(/<a name="([^"]*)"><\/a>/)
        if (named && !id) id = named[1]
        inner = inner.replace(/<a name="[^"]*"><\/a>\s*/g, "")
        if (!id) id = slugMode === "gh" ? ghSlug(inner) : slugify(stripTags(inner) || text)
        let base = id, i = 2
        while (used.has(id)) id = `${base}-${i++}`
        used.add(id)
        if (depth === 2 || depth === 3) headings.push({ depth, id, text: stripTags(inner) })
        return `<h${depth} id="${id}"><a class="anchor" href="#${id}">#</a>${inner}</h${depth}>\n`
      },
    },
  })
  return { marked: m, headings }
}
// tableaux : on les enveloppe pour le scroll horizontal
const wrapTables = (h) => h.replace(/<table>/g, "<div class=\"table-wrap\"><table>")
  .replace(/<\/table>/g, "</table></div>")

function renderMarkdown(md, opts = {}) {
  const { marked, headings } = makeMarked(opts.slug)
  const html = wrapTables(marked.parse(preprocess(md, opts)))
  return { html, headings }
}

const RECO = new Set("constructor-super for-direction getter-return no-async-promise-executor no-case-declarations no-class-assign no-compare-neg-zero no-cond-assign no-const-assign no-constant-binary-expression no-constant-condition no-control-regex no-debugger no-delete-var no-dupe-args no-dupe-class-members no-dupe-else-if no-dupe-keys no-duplicate-case no-empty no-empty-character-class no-empty-pattern no-empty-static-block no-ex-assign no-extra-boolean-cast no-fallthrough no-func-assign no-global-assign no-import-assign no-invalid-regexp no-irregular-whitespace no-loss-of-precision no-misleading-character-class no-new-native-nonconstructor no-nonoctal-decimal-escape no-obj-calls no-octal no-prototype-builtins no-redeclare no-regex-spaces no-self-assign no-setter-return no-shadow-restricted-names no-sparse-arrays no-this-before-super no-unassigned-vars no-undef no-unexpected-multiline no-unreachable no-unsafe-finally no-unsafe-negation no-unsafe-optional-chaining no-unused-labels no-unused-private-class-members no-unused-vars no-useless-assignment no-useless-backreference no-useless-catch no-useless-escape no-with preserve-caught-error require-yield use-isnan valid-typeof".split(" "))

// --------------------------------------------------------------- layout
const NAV = [
  { group: "Démarrer", items: [
    [ "index", "Accueil" ],
    [ "pages/examen", "Jour J : déroulé de l'examen" ],
    [ "pages/antiseche", "Antisèche des commandes" ],
  ] },
  { group: "Tutos pas à pas", items: [
    [ "pages/tutos", "Départ : le projet Vite" ],
    [ "pages/tuto-1-linter", "Tuto 1 : le linter" ],
    [ "pages/tuto-2-tests", "Tuto 2 : les tests" ],
    [ "pages/tuto-3-doc", "Tuto 3 : la documentation" ],
    [ "pages/tuto-4-ftp", "Tuto 4 : la config FTP" ],
  ] },
  { group: "Cours", items: [
    [ "pages/vite", "1. Vite" ],
    [ "pages/eslint", "2. ESLint (config)" ],
    [ "pages/eslint-regles", "2b. ESLint : les règles" ],
    [ "pages/vitest", "3. Vitest (tests)" ],
    [ "pages/jsdoc", "4. JSDoc" ],
    [ "pages/readme", "5. README & Markdown" ],
    [ "pages/build-ftp", "6. Build & publication FTP" ],
  ] },
  { group: "Pratique", items: [
    [ "pages/projets", "Projets du cours" ],
    [ "pages/modele", "Projet modèle complet" ],
    [ "pages/exercices", "Exercices corrigés" ],
    [ "pages/pieges", "Erreurs & pièges" ],
    [ "pages/docs-hors-ligne", "Préparer les docs hors-ligne" ],
  ] },
  { group: "Docs officielles", items: [
    [ "docs/index", "Index des docs" ],
    [ "docs/eslint/rules/index", "ESLint : toutes les règles" ],
    [ "docs/vitest/index", "Vitest" ],
    [ "docs/vite/index", "Vite" ],
    [ "docs/jsdoc/index", "JSDoc" ],
  ] },
]

function layout({ title, body, headings = [], relRoot, current, extraClass = "", meta = "" }) {
  const r = relRoot // "", "../", "../../" ...
  const nav = NAV.map((g) => `<div class="nav-group"><div class="nav-title">${g.group}</div>` +
    g.items.map(([ href, label ]) => {
      const pre = href.replace(/index$/, "")
      const active = current === href || (href.endsWith("/index") &&
        href !== "docs/index" && current.startsWith(pre)) ? " active" : ""
      return `<a class="nav-link${active}" href="${r}${href}.html">${label}</a>`
    }).join("") + "</div>").join("")
  const toc = headings.length > 2 ? `<aside class="toc"><div class="toc-title">Sur cette page</div>` +
    headings.map((h) => `<a class="toc-${h.depth}" href="#${h.id}">${esc(h.text)}</a>`).join("") +
    "</aside>" : ""
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · ICT-324 Révision</title>
<link rel="icon" href="${r}assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${r}assets/hljs.css">
<link rel="stylesheet" href="${r}assets/style.css">
<script>try{var t=localStorage.getItem("theme");if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
</head>
<body class="${extraClass}" data-root="${r}">
<header class="topbar">
  <button class="menu-btn" aria-label="Menu" onclick="document.body.classList.toggle('nav-open')">☰</button>
  <a class="brand" href="${r}index.html"><span class="logo">324</span> ICT-324 <span class="brand-sub">Révision hors-ligne</span></a>
  <button class="search-btn" id="search-open">🔍 Rechercher <kbd>Ctrl</kbd><kbd>K</kbd></button>
  <button class="theme-btn" id="theme-toggle" title="Thème clair / sombre">◐</button>
</header>
<nav class="sidebar">${nav}</nav>
<main class="content">
<article class="doc">
${meta}
${body}
</article>
${toc}
</main>
<div class="search-modal" id="search-modal" hidden>
  <div class="search-box">
    <input id="search-input" type="search" placeholder="Rechercher partout (règle, commande, tag JSDoc, erreur…)" autocomplete="off">
    <div class="search-filters">
      <label><input type="checkbox" data-f="perso" checked> Mes pages</label>
      <label><input type="checkbox" data-f="eslint" checked> ESLint</label>
      <label><input type="checkbox" data-f="vitest" checked> Vitest</label>
      <label><input type="checkbox" data-f="vite" checked> Vite</label>
      <label><input type="checkbox" data-f="jsdoc" checked> JSDoc</label>
    </div>
    <div id="search-results" class="search-results"><p class="muted">Tape au moins 2 caractères. Entrée = ouvrir le 1er résultat, Échap = fermer.</p></div>
  </div>
</div>
<script src="${r}assets/app.js"></script>
</body>
</html>
`
}

// ---------------------------------------------------------- index search
const SEARCH = []
function addSearch({ url, title, section, headings, html, limit = 6000 }) {
  const text = stripTags(html)
  SEARCH.push({
    u: url, t: title, s: section,
    h: headings.map((h) => [ h.id, h.text ]),
    x: text.slice(0, limit),
  })
}

// ---------------------------------------------------------- pages perso
function buildPersonal() {
  const files = fs.readdirSync(CONTENT).filter((f) => f.endsWith(".md"))
  for (const f of files) {
    const src = fs.readFileSync(path.join(CONTENT, f), "utf8")
    const { data, content } = matter(src)
    const name = f.replace(/\.md$/, "")
    const key = name === "index" ? "index" : `pages/${name}`
    const relRoot = name === "index" ? "" : "../"
    const onInclude = (p, lang) => {
      const abs = path.join(OUT, p)
      if (!fs.existsSync(abs)) {
        console.warn("include manquant:", p)
        return `> fichier introuvable : ${p}`
      }
      const code = fs.readFileSync(abs, "utf8").replace(/\r\n/g, "\n").replace(/\n$/, "")
      const l = lang || path.extname(p).slice(1) || "txt"
      const tick = code.includes("```") ? "````" : "```"
      return `${tick}${l} [${p.replace(/^projets\//, "")}]\n${code}\n${tick}\n` +
        `<p class="file-link"><a href="${relRoot}${p}">📄 ouvrir le fichier ${esc(path.basename(p))}</a></p>`
    }
    const { html, headings } = renderMarkdown(content, { onInclude })
    const title = data.title || name
    const body = (name === "index" ? "" : `<h1>${esc(title)}</h1>`) +
      (data.lead ? `<p class="lead">${data.lead}</p>` : "") + html
    write(path.join(OUT, `${key}.html`), layout({
      title, body, headings, relRoot, current: key,
      extraClass: name === "index" ? "home" : "",
    }))
    addSearch({ url: `${key}.html`, title, section: "perso", headings, html, limit: 40000 })
  }
}

// ---------------------------------------------------- docs officielles
const DOCSETS = [
  { id: "eslint", name: "ESLint", dirs: [
    [ path.join(REPOS, "eslint/docs/src/rules"), "rules" ],
    [ path.join(REPOS, "eslint/docs/src/use"), "use" ],
  ], site: "https://eslint.org/docs/latest/" },
  { id: "vitest", name: "Vitest", dirs: [ [ path.join(REPOS, "vitest/docs"), "" ] ],
    skip: /^(blog|team|todo|AGENTS|releases|public|\.vitepress)|\/snippets\//, site: "https://vitest.dev/" },
  { id: "vite", name: "Vite", dirs: [ [ path.join(REPOS, "vite/docs"), "" ] ],
    skip: /^(blog|team|acknowledgements|releases|live|public|_data|images|changes|\.vitepress)/, site: "https://vite.dev/" },
  { id: "jsdoc", name: "JSDoc", dirs: [ [ path.join(REPOS, "jsdoc/content"), "" ] ],
    skip: /^(data|includes)/, site: "https://jsdoc.app/" },
]

function walk(dir, base = dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, base, acc)
    else if (e.name.endsWith(".md")) acc.push(path.relative(base, p))
  }
  return acc
}

function buildDocs() {
  const all = {}
  for (const set of DOCSETS) {
    const pages = []
    for (const [ dir, prefix ] of set.dirs) {
      for (const rel of walk(dir)) {
        const relOut = path.join(prefix, rel).replace(/\\/g, "/")
        if (set.skip && set.skip.test(relOut)) continue
        pages.push({ abs: path.join(dir, rel), rel: relOut })
      }
    }
    const known = new Set(pages.map((p) => p.rel.replace(/\.md$/, "")))
    if (set.id === "eslint") known.add("rules/index")
    all[set.id] = { set, pages, known }
  }

  for (const { set, pages, known } of Object.values(all)) {
    const list = []
    for (const pg of pages) {
      const src = fs.readFileSync(pg.abs, "utf8")
      const { data, content } = matter(src)
      let { html, headings } = renderMarkdown(content, { slug: [ "vite", "vitest" ].includes(set.id) ? "vp" : "gh" })
      const relNoExt = pg.rel.replace(/\.md$/, "")
      const dirOfPage = path.posix.dirname(relNoExt)
      // réécriture des liens internes
      html = html.replace(/(href)="([^"]*)"/g, (a, attr, href) => {
        if (/^(https?:|mailto:|#|javascript:)/.test(href) || href === "") return a
        let [ p, hash ] = href.split("#")
        let target
        if (p.startsWith("/")) {
          p = p.replace(/^\/docs\/(latest|head|next)\//, "/").replace(/^\/docs\//, "/")
          target = p.slice(1)
        } else target = path.posix.join(dirOfPage, p)
        target = target.replace(/\.(md|html)$/, "").replace(/\/$/, "/index")
        if (target === "" || target === ".") target = "index"
        if (!known.has(target) && known.has(target + "/index")) target += "/index"
        if (!known.has(target)) {
          const ext = set.site + target.replace(/(^|\/)index$/, "$1")
          return `${attr}="${ext}${hash ? "#" + hash : ""}" class="ext" title="lien en ligne (non disponible hors-ligne)"`
        }
        let rel = path.posix.relative(dirOfPage, target) + ".html"
        return `${attr}="${rel}${hash ? "#" + hash : ""}"`
      })
      // images non embarquées : on garde seulement le texte alternatif
      html = html.replace(/<img [^>]*src="(?!data:)[^"]*"[^>]*alt="([^"]*)"[^>]*>/g,
        (a, alt) => `<span class="img-missing">[image : ${esc(alt || "")}]</span>`)
      html = html.replace(/<img [^>]*src="(?!data:|http)[^"]*"[^>]*>/g, "<span class=\"img-missing\">[image]</span>")

      const h1 = content.match(/^#\s+(.+)$/m)
      let title = data.title || (h1 && stripTags(h1[1]).replace(/\{#.*\}/, "").trim()) ||
        path.basename(relNoExt)
      if (set.id === "jsdoc" && data.tag) title = `@${data.tag}`
      if (typeof title !== "string") title = String(title)
      let meta = ""
      const badges = []
      if (data.rule_type) badges.push(`<span class="badge badge-${data.rule_type}">${{ layout: "mise en forme (layout)", suggestion: "suggestion", problem: "problème" }[data.rule_type] || data.rule_type}</span>`)
      if (data.deprecated) badges.push("<span class=\"badge badge-dep\">dépréciée</span>")
      if (set.id === "eslint" && RECO.has(title)) badges.push("<span class=\"badge badge-reco\">✅ dans js/recommended</span>")
      if (data.synonyms) badges.push(`<span class="badge">synonymes : ${data.synonyms.map((s) => "@" + s).join(", ")}</span>`)
      if (data.description && set.id === "jsdoc") badges.push(`<span class="badge">${esc(data.description)}</span>`)
      const online = set.site + (set.id === "jsdoc" ? relNoExt.replace(/^index$/, "") + (relNoExt === "index" ? "" : ".html") : relNoExt.replace(/(^|\/)index$/, "$1"))
      const depth = relNoExt.split("/").length - 1
      const relRoot = "../".repeat(depth + 2)
      meta = `<div class="doc-meta"><a href="${"../".repeat(depth)}index.html">${set.name}</a> › ${esc(relNoExt)} ${badges.join(" ")} <a class="ext small" href="${online}">version en ligne</a></div>`
      let extra = ""
      const rel = (a) => (a || []).map((x) => `<code>${esc(x)}</code>`).join(", ")
      if (data.related_rules) extra += `<div class="box box-info"><div class="box-title">Règles liées</div><p>${data.related_rules.map((x) => `<a href="${path.posix.relative(dirOfPage, "rules/" + x)}.html"><code>${esc(x)}</code></a>`).join(", ")}</p></div>`
      if (data.further_reading) extra += `<h2 id="further-reading">Further Reading</h2><ul>${data.further_reading.map((u) => `<li><a class="ext" href="${esc(u)}">${esc(u)}</a></li>`).join("")}</ul>`
      const body = (h1 && set.id !== "eslint" ? "" : `<h1>${esc(title)}</h1>`) + html + extra
      write(path.join(OUT, "docs", set.id, relNoExt + ".html"), layout({
        title: `${title} (${set.name})`, body, headings, relRoot,
        current: `docs/${set.id}/${relNoExt}`, meta,
      }))
      const first = stripTags(html).slice(0, 220)
      list.push({ rel: relNoExt, title, first, type: data.rule_type, dep: data.deprecated })
      addSearch({ url: `docs/${set.id}/${relNoExt}.html`, title, section: set.id, headings, html, limit: 12000 })
    }
    all[set.id].list = list
  }
  return all
}

function buildDocIndexes(all) {
  // index ESLint des règles
  const e = all.eslint
  const rules = e.list.filter((p) => p.rel.startsWith("rules/") && p.rel !== "rules/index")
    .sort((a, b) => a.title.localeCompare(b.title))
  const rows = rules.map((r) => `<tr data-type="${r.type || ""}"><td><a href="${r.rel.replace("rules/", "")}.html"><code>${esc(r.title)}</code></a>${r.dep ? " <span class=\"badge badge-dep\">dépréciée</span>" : ""}${RECO.has(r.title) ? " <span class=\"badge badge-reco\">✅ recommended</span>" : ""}</td><td><span class="badge badge-${r.type}">${r.type || ""}</span></td><td>${esc(r.first.replace(/^.*?Rule Details\s*/, "").slice(0, 170))}…</td></tr>`).join("\n")
  const rulesBody = `<h1>ESLint : les ${rules.length} règles</h1>
<p class="lead">Toutes les règles de la documentation officielle, consultables hors-ligne. Filtre ci-dessous par nom ou par mot-clé (en anglais : <em>space</em>, <em>quote</em>, <em>semicolon</em>, <em>indent</em>, <em>camel</em>, <em>brace</em>, <em>length</em>…).</p>
<p><input id="rule-filter" class="filter-input" type="search" placeholder="Filtrer les règles… (ex : bracket, quote, var, case)">
<select id="rule-type" class="filter-input small"><option value="">tous types</option><option value="problem">problem</option><option value="suggestion">suggestion</option><option value="layout">layout (mise en forme)</option></select></p>
<div class="table-wrap"><table class="rules-table" id="rules-table"><thead><tr><th>Règle</th><th>Type</th><th>Début de la doc</th></tr></thead><tbody>${rows}</tbody></table></div>`
  write(path.join(OUT, "docs/eslint/rules/index.html"), layout({
    title: "Règles ESLint", body: rulesBody, relRoot: "../../../", current: "docs/eslint/rules/index",
  }))

  for (const id of [ "eslint", "vitest", "vite", "jsdoc" ]) {
    const { set, list } = all[id]
    const groups = {}
    for (const p of list) {
      if (id === "eslint" && p.rel.startsWith("rules/")) continue
      const g = p.rel.includes("/") ? p.rel.split("/").slice(0, -1).join("/") : "(racine)"
      ;(groups[g] ||= []).push(p)
    }
    if (id === "jsdoc") {
      groups["Tags (@...)"] = list.filter((p) => p.rel.startsWith("tags-"))
      groups["Guides (about / howto / plugins)"] = list.filter((p) => !p.rel.startsWith("tags-"))
      delete groups["(racine)"]
    }
    let body = `<h1>Documentation ${set.name} (hors-ligne)</h1>
<p class="lead">Copie de la documentation officielle (${list.length} pages) convertie pour être lue sans internet. Source : <a class="ext" href="${set.site}">${set.site}</a></p>`
    if (id === "eslint") body += `<p><a class="btn" href="rules/index.html">➡️ Toutes les règles (${list.filter((p) => p.rel.startsWith("rules/")).length})</a> <a class="btn" href="use/configure/configuration-files.html">Fichier de config</a> <a class="btn" href="use/command-line-interface.html">Ligne de commande</a> <a class="btn" href="use/configure/rules.html">Configurer les règles</a> <a class="btn" href="use/configure/ignore.html">Ignorer des fichiers</a></p>`
    if (id === "vitest") body += `<p><a class="btn" href="api/expect.html">expect (matchers)</a> <a class="btn" href="api/test.html">test / it</a> <a class="btn" href="api/describe.html">describe</a> <a class="btn" href="api/vi.html">vi (mocks)</a> <a class="btn" href="api/hooks.html">hooks</a> <a class="btn" href="guide/coverage.html">coverage</a> <a class="btn" href="config/coverage.html">config coverage</a> <a class="btn" href="guide/cli.html">CLI</a> <a class="btn" href="guide/reporters.html">reporters</a></p>`
    if (id === "vite") body += `<p><a class="btn" href="guide/build.html">Build & base</a> <a class="btn" href="guide/assets.html">Assets & public/</a> <a class="btn" href="config/shared-options.html">Options partagées (base…)</a> <a class="btn" href="config/build-options.html">Options build</a> <a class="btn" href="guide/static-deploy.html">Déploiement statique</a> <a class="btn" href="guide/env-and-mode.html">Variables d'env</a> <a class="btn" href="guide/cli.html">CLI</a></p>`
    if (id === "jsdoc") body += `<p><a class="btn" href="about-getting-started.html">Démarrer</a> <a class="btn" href="about-configuring-jsdoc.html">Config jsdoc.json</a> <a class="btn" href="about-commandline.html">Ligne de commande</a> <a class="btn" href="about-including-readme.html">Inclure le README</a> <a class="btn" href="tags-param.html">@param</a> <a class="btn" href="tags-returns.html">@returns</a> <a class="btn" href="tags-type.html">types</a> <a class="btn" href="howto-es2015-modules.html">Modules ES</a></p>`
    for (const [ g, items ] of Object.entries(groups).sort()) {
      if (!items.length) continue
      body += `<h2 id="${slugify(g)}">${esc(g)}</h2><ul class="doc-list">` +
        items.sort((a, b) => a.rel.localeCompare(b.rel)).map((p) => `<li><a href="${p.rel}.html">${esc(p.title)}</a> <span class="muted small">${esc(p.rel)}</span></li>`).join("") + "</ul>"
    }
    // l'index vitest / vite existe déjà en tant que page d'accueil de la doc : on le renomme
    const target = path.join(OUT, "docs", id, "index.html")
    if (fs.existsSync(target) && id !== "eslint") fs.renameSync(target, path.join(OUT, "docs", id, "accueil.html"))
    write(target, layout({ title: `Docs ${set.name}`, body, relRoot: "../../", current: `docs/${id}/index` }))
  }

  const body = `<h1>Documentations officielles hors-ligne</h1>
<p class="lead">Les 4 documentations dont tu as besoin, copiées depuis les dépôts officiels et consultables sans internet. Utilise la <strong>recherche (Ctrl+K)</strong> : elle cherche aussi dans le texte de ces docs.</p>
<div class="cards">
<a class="card" href="eslint/rules/index.html"><div class="card-icon">📏</div><h3>ESLint : règles</h3><p>Les ${all.eslint.list.filter((p) => p.rel.startsWith("rules/")).length} règles avec exemples ✅ correct / ❌ incorrect et toutes leurs options.</p></a>
<a class="card" href="eslint/index.html"><div class="card-icon">⚙️</div><h3>ESLint : utilisation</h3><p>Config (flat config), CLI, ignorer, plugins, migration v9 / v10.</p></a>
<a class="card" href="vitest/index.html"><div class="card-icon">🧪</div><h3>Vitest</h3><p>API (expect, vi, describe, hooks), config, coverage, CLI, mocks.</p></a>
<a class="card" href="vite/index.html"><div class="card-icon">⚡</div><h3>Vite</h3><p>Guide, config, build, <code>base</code>, dossier <code>public/</code>, déploiement.</p></a>
<a class="card" href="jsdoc/index.html"><div class="card-icon">📚</div><h3>JSDoc</h3><p>Tous les tags, configuration, ligne de commande, README.</p></a>
</div>
<div class="box box-tip"><div class="box-title">💡 Astuce</div><p>Chaque page a un lien <em>« version en ligne ↗ »</em> pour retrouver la même page sur le site officiel (utile le jour J si tu as les docs officielles installées sur le poste de l'école).</p></div>`
  write(path.join(OUT, "docs/index.html"), layout({ title: "Docs officielles", body, relRoot: "../", current: "docs/index" }))
}

// --------------------------------------------------------------- main
const onlyPersonal = process.argv.includes("--perso")
if (!onlyPersonal) {
  const all = buildDocs()
  buildDocIndexes(all)
  fs.writeFileSync(path.join(SCRATCH, "docs-search.json"), JSON.stringify(SEARCH))
} else if (fs.existsSync(path.join(SCRATCH, "docs-search.json"))) {
  SEARCH.push(...JSON.parse(fs.readFileSync(path.join(SCRATCH, "docs-search.json"), "utf8")))
}
buildPersonal()
write(path.join(OUT, "assets/search-index.js"), "window.SEARCH_INDEX=" + JSON.stringify(SEARCH) + ";")
console.log("pages indexées :", SEARCH.length, "→", OUT)
