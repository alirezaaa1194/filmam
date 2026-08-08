const fs = require('fs')
const path = require('path')

const root = 'C:/Users/ALIREZA/Desktop/filmam/apps/admin'
const en = JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/locales/en.json'), 'utf8').replace(/^\uFEFF/, ''))

const dirs = ['seasons', 'episodes', 'sections', 'comments', 'contacts']
const keys = new Set()
const re = /\bt\(['"]([^'"]+)['"]\)/g

function walk(p) {
  for (const f of fs.readdirSync(p)) {
    const fp = path.join(p, f)
    if (fs.statSync(fp).isDirectory()) walk(fp)
    else if (f.endsWith('.ts') || f.endsWith('.tsx')) {
      const s = fs.readFileSync(fp, 'utf8')
      let m
      while ((m = re.exec(s))) keys.add(m[1])
    }
  }
}
for (const d of dirs) walk(path.join(root, 'src/filmam', d))

function resolve(k) {
  let o = en
  for (const p of k.split('.')) {
    if (o === undefined || o[p] === undefined) return false
    o = o[p]
  }
  return true
}

const missing = [...keys].filter((k) => !resolve(k))
console.log('total keys used:', keys.size)
console.log('missing:', missing.length ? missing.join(', ') : 'NONE')
