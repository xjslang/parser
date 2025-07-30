#!/usr/bin/env node

import { readFileSync, readdirSync, writeFileSync, unlinkSync } from 'fs'
import { join, basename, dirname } from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import recast from 'recast'
import { parse as parseDefer } from '../src/defer/index.js'
import { parse as parseMut } from '../src/mut/index.js'

// Get the directory path of this file
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const FIXTURES_DIR = join(__dirname, '../test', 'fixtures')

/**
 * Execute code and capture console output
 * @param {string} code - Code to execute
 * @returns {string[]} Array of output lines
 */
function executeCode(code) {
  const tempFile = join(process.cwd(), `temp-test-${Date.now()}.js`)

  try {
    writeFileSync(tempFile, code)
    const output = execSync(`node ${tempFile}`, { encoding: 'utf8' })
    return output
      .trim()
      .split('\n')
      .filter((line) => line.length > 0)
  } catch (error) {
    throw new Error(`Execution failed: ${error.message}`)
  } finally {
    try {
      unlinkSync(tempFile)
    } catch {
      // Ignore cleanup errors
    }
  }
}

/**
 * Get appropriate parser based on filename
 * @param {string} filename - Test file name
 * @returns {Function} Parser function
 */
function getParser(filename) {
  if (filename.includes('defer')) {
    return parseDefer
  } else if (filename.includes('mut')) {
    return parseMut
  } else {
    // Default to defer parser for now
    return parseDefer
  }
}

/**
 * Run all tests in fixtures directory
 */
function runTests() {
  const files = readdirSync(FIXTURES_DIR)
  const testFiles = files.filter((file) => file.endsWith('.xjs'))

  let passed = 0
  let total = 0

  console.log('🚀 Running XJS behavior tests...\n')

  for (const testFile of testFiles) {
    const testName = basename(testFile, '.xjs')
    const xjsPath = join(FIXTURES_DIR, testFile)
    const outPath = join(FIXTURES_DIR, `${testName}.out`)

    total++

    try {
      // Read input and expected output
      const inputCode = readFileSync(xjsPath, 'utf8')
      const expectedOutput = readFileSync(outPath, 'utf8')
        .trim()
        .split('\n')
        .filter((line) => line.length > 0)

      // Parse and generate code
      const parser = getParser(testName)
      const ast = parser(inputCode)
      const result = recast.print(ast)

      if (process.argv.includes('--verbose')) {
        console.log(`🔍 Processing ${testName}`)
        console.log(`Generated code:\n${result.code}`)
        console.log('='.repeat(50))
      }

      // Execute and capture output
      const actualOutput = executeCode(result.code) // Compare results
      const success =
        JSON.stringify(actualOutput) === JSON.stringify(expectedOutput)

      if (success) {
        console.log(`✅ ${testName}`)
        passed++
      } else {
        console.log(`❌ ${testName}`)
        console.log(`   Expected: ${JSON.stringify(expectedOutput)}`)
        console.log(`   Actual:   ${JSON.stringify(actualOutput)}`)
        if (process.argv.includes('--verbose')) {
          console.log(`   Generated code:\n${result.code}`)
        }
      }
    } catch (error) {
      console.log(`💥 ${testName} - ERROR: ${error.message}`)

      // Show generated code for execution errors to help debugging
      try {
        const parser = getParser(testName)
        const inputCode = readFileSync(xjsPath, 'utf8')
        const ast = parser(inputCode)
        const result = recast.print(ast)
        console.log(`   Generated code:\n${result.code}`)
      } catch {
        // Ignore parsing errors when trying to show generated code
      }
    }
  }

  console.log(`\n📊 Results: ${passed}/${total} tests passed`)

  if (passed === total) {
    console.log('🎉 All tests passed!')
    process.exit(0)
  } else {
    console.log('❌ Some tests failed')
    process.exit(1)
  }
}

runTests()
