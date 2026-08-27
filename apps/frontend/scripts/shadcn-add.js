#!/usr/bin/env node

/**
 * shadcn-add wrapper script
 *
 * After running `shadcn add <component>`, this script reorganizes the generated
 * flat file (e.g. src/utilities/components/ui/button.tsx) into the project
 * folder pattern (src/utilities/components/ui/button/button.index.tsx).
 *
 * Usage:
 *   pnpm shadcn:add <component>
 *
 * It is a drop-in replacement for `shadcn add` and keeps the folder pattern
 * the rest of the codebase relies on.
 */

const { execSync } = require('node:child_process')
const { existsSync, mkdirSync, renameSync, readdirSync, unlinkSync, rmSync } = require('node:fs')
const { join, resolve } = require('node:path')

const projectRoot = resolve(__dirname, '..')
const uiDir = join(projectRoot, 'src', 'utilities', 'components', 'ui')

const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Usage: node scripts/shadcn-add.js <component> [...components]')
  process.exit(1)
}

function run(cmd) {
  execSync(cmd, { stdio: 'inherit', cwd: projectRoot })
}

function moveToFolder(component) {
  const flatPath = join(uiDir, `${component}.tsx`)
  const targetDir = join(uiDir, component)
  const targetFile = join(targetDir, `${component}.index.tsx`)

  if (!existsSync(flatPath)) {
    console.warn(`[shadcn-add] Expected file not found: ${flatPath}`)
    return
  }

  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true })
  }

  renameSync(flatPath, targetFile)
  console.log(`[shadcn-add] Moved ${component}.tsx -> ${component}/${component}.index.tsx`)

  const indexFile = join(uiDir, 'index.ts')
  if (existsSync(indexFile)) {
    const current = require('node:fs').readFileSync(indexFile, 'utf8')
    const exportLine = `export * from './${component}/${component}.index'\n`
    if (!current.includes(exportLine)) {
      require('node:fs').appendFileSync(indexFile, exportLine)
      console.log(`[shadcn-add] Updated index.ts with ${component} export`)
    }
  }
}

try {
  run(`npx shadcn@latest add ${args.map((a) => `"${a}"`).join(' ')} --yes`)
  for (const component of args) {
    moveToFolder(component)
  }
} catch (err) {
  console.error('[shadcn-add] Failed:', err.message)
  process.exit(1)
}
