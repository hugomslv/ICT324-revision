// Vérifie le dossier dist/ AVANT l'envoi FTP (sans réseau, sans serveur).
// Usage : node scripts/check-dist.js   (lit "base" dans vite.config.js)
//         node scripts/check-dist.js /mon_dossier/
// Signale : chemins absolus sans le "base", fichiers introuvables,
// différences de majuscules/minuscules (le serveur Linux y est sensible).
import fs from "node:fs"
import path from "node:path"

const dist = path.resolve("dist")
if (!fs.existsSync(dist)) {
  console.error("❌ dist/ introuvable : lance d'abord  npm run build")
  process.exit(1)
}

let base = process.argv[2]
if (!base) {
  const conf = [ "vite.config.js", "vite.config.mjs" ]
    .find((f) => fs.existsSync(f))
  const txt = conf ? fs.readFileSync(conf, "utf8") : ""
  const m = txt.match(/^\s*base\s*:\s*["'`]([^"'`]*)["'`]/m)
  base = m ? m[1] : "/"
}
console.log(`base = "${base}"`)

const problems = []
const warnings = []
const files = []
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else files.push(p)
  }
}
walk(dist)

// existe avec la casse EXACTE (macOS/Windows ne font pas la différence)
const existsExact = (abs) => {
  const rel = path.relative(dist, abs)
  if (rel.startsWith("..")) return false
  let cur = dist
  for (const part of rel.split(path.sep)) {
    if (!fs.existsSync(cur) || !fs.statSync(cur).isDirectory()) return false
    if (!fs.readdirSync(cur).includes(part)) return false
    cur = path.join(cur, part)
  }
  return true
}

const EXTERNAL = /^(https?:|data:|mailto:|tel:|javascript:|#|\/\/|blob:)/i
const skip = (u) => EXTERNAL.test(u) || u === "" || u.includes("${")

function check(url, from, kind) {
  if (skip(url)) return
  const clean = decodeURI(url.split(/[?#]/)[0])
  if (!clean) return
  const where = `${path.relative(dist, from)} (${kind})`
  let target
  if (clean.startsWith("/")) {
    if (base.startsWith("/") && base !== "/" && !clean.startsWith(base)) {
      problems.push(`${where} : "${url}" est absolu mais ne commence pas par`
        + ` "${base}" → 404 sur le serveur`)
      return
    }
    const cut = base.startsWith("/") ? base.length : 1
    target = path.join(dist, clean.slice(cut))
  } else {
    // relatif : au fichier pour HTML/CSS, à la page (racine) pour le JS
    const dir = kind === "js" ? dist : path.dirname(from)
    target = path.resolve(dir, clean)
  }
  if (clean.endsWith("/")) target = path.join(target, "index.html")
  if (!existsExact(target)) {
    const loose = fs.existsSync(target)
    problems.push(`${where} : "${url}" → ${loose
      ? "MAJUSCULES/minuscules différentes (OK en local, 404 sur Linux)"
      : "fichier introuvable dans dist/"}`)
  }
}

for (const f of files) {
  const ext = path.extname(f).toLowerCase()
  const name = path.basename(f)
  if (/[A-Z\s]|[^\x20-\x7e]/.test(path.relative(dist, f))
    && !/-[A-Za-z0-9_-]{8}\.\w+$/.test(name)) {
    warnings.push("nom de fichier risqué (majuscule, espace ou accent) :"
      + ` ${path.relative(dist, f)}`)
  }
  if (![ ".html", ".css", ".js" ].includes(ext)) continue
  const txt = fs.readFileSync(f, "utf8")
  if (ext === ".html") {
    for (const m of txt.matchAll(/\s(?:src|href)=["']([^"']+)["']/g)) {
      check(m[1], f, "html")
    }
  } else if (ext === ".css") {
    for (const m of txt.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
      check(m[1], f, "css")
    }
  } else {
    // chaînes du JS qui ressemblent à un fichier : "/img/a.png", `./x.svg`
    const exts = "png|jpe?g|gif|svg|webp|ico|css|js|json|html|woff2?|ttf|pdf"
    const q = "[\"'`]"
    const re = new RegExp(
      `${q}((?:\\.{0,2}\\/)[\\w./@-]+\\.(?:${exts}))${q}`, "g")
    for (const m of txt.matchAll(re)) check(m[1], f, "js")
  }
}

if (!files.some((f) => /favicon/i.test(path.basename(f)))) {
  warnings.push("aucun favicon dans dist/ (mets-le dans public/)")
}

console.log(`${files.length} fichiers analysés dans dist/`)
for (const w of warnings) console.log("⚠️ ", w)
for (const p of problems) console.log("❌", p)
if (problems.length) {
  console.log(`\n${problems.length} problème(s) : à corriger avant le FTP.`)
  process.exit(1)
}
console.log("✅ Aucun lien cassé détecté : dist/ est prêt pour le FTP.")
