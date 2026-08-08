const fs = require('fs')
const path = require('path')

const root = 'C:/Users/ALIREZA/Desktop/filmam/apps/admin'
const en = JSON.parse(fs.readFileSync(path.join(root, 'src/i18n/locales/en.json'), 'utf8').replace(/^\uFEFF/, ''))

const files = [
  'src/utilities/components/appSidebar/appSidebar.data.ts',
  'src/routes/_authenticated/seasons/index.tsx',
  'src/routes/_authenticated/episodes/index.tsx',
  'src/routes/_authenticated/sections/index.tsx',
  'src/routes/_authenticated/comments/index.tsx',
  'src/routes/_authenticated/contacts/index.tsx',
]

const keys = new Set()
const re = /\bt\(['"]([^'"]+)['"]\)/g
for (const f of files) {
  const s = fs.readFileSync(path.join(root, f), 'utf8')
  let m
  while ((m = re.exec(s))) keys.add(m[1])
}

function resolve(k) {
  let o = en
  for (const p of k.split('.')) {
    if (o === undefined || o[p] === undefined) return false
    o = o[p]
  }
  return true
}

const missing = [...keys].filter((k) => !resolve(k))
console.log('keys used:', keys.size)
console.log('missing:', missing.length ? missing.join(', ') : 'NONE')
