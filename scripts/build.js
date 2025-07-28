#!/usr/bin/env node

import { build } from 'esbuild'
import { promises as fs } from 'fs'
import path from 'path'

// Recursively find all .js files in src directory
async function findJSFiles(dir, files = []) {
  const items = await fs.readdir(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stats = await fs.stat(fullPath)

    if (stats.isDirectory()) {
      await findJSFiles(fullPath, files)
    } else if (
      item.endsWith('.js') &&
      !item.includes('.test.') &&
      !item.includes('.spec.')
    ) {
      files.push(fullPath)
    }
  }

  return files
}

async function getEntryPoints() {
  const srcFiles = await findJSFiles('src')
  // Add root index.js
  srcFiles.push('index.js')
  return srcFiles
}

async function buildESM() {
  console.log('Building ESM...')
  const srcFiles = await getEntryPoints()
  console.log('Entry points:', srcFiles)

  await build({
    entryPoints: srcFiles,
    outdir: 'dist/esm',
    format: 'esm',
    platform: 'node',
    target: 'node16',
    sourcemap: true,
    bundle: false,
    preserveSymlinks: false,
    keepNames: true,
  })
}

async function buildCJS() {
  console.log('Building CommonJS...')
  const srcFiles = await getEntryPoints()

  await build({
    entryPoints: srcFiles,
    outdir: 'dist/cjs',
    format: 'cjs',
    platform: 'node',
    target: 'node16',
    sourcemap: true,
    bundle: false,
    preserveSymlinks: false,
    keepNames: true,
  })
}

async function createPackageJson() {
  console.log('Creating package.json files...')

  // Create package.json for ESM
  const esmDir = 'dist/esm'
  await fs.mkdir(esmDir, { recursive: true })
  await fs.writeFile(
    path.join(esmDir, 'package.json'),
    JSON.stringify({ type: 'module' }, null, 2)
  )

  // Create package.json for CJS
  const cjsDir = 'dist/cjs'
  await fs.mkdir(cjsDir, { recursive: true })
  await fs.writeFile(
    path.join(cjsDir, 'package.json'),
    JSON.stringify({ type: 'commonjs' }, null, 2)
  )
}

async function main() {
  try {
    await Promise.all([buildESM(), buildCJS(), createPackageJson()])
    console.log('✅ Build completed successfully!')
  } catch (error) {
    console.error('❌ Build failed:', error)
    process.exit(1)
  }
}

main()
