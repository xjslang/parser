/**
 * Local test script to verify the package structure works
 * Run with: node test-local.js
 */

// Test main entry point
const mainParser = require('./dist/index');
console.log('Main parser exports:', Object.keys(mainParser));

// Test defer subpath
const deferParser = require('./dist/defer');
console.log('Defer parser exports:', Object.keys(deferParser));

// Test mut subpath
const mutParser = require('./dist/mut');
console.log('Mut parser exports:', Object.keys(mutParser));

// Test that functions exist (they will throw but that's expected)
console.log('\nTesting function availability:');
console.log('parse function exists:', typeof mainParser.parse === 'function');
console.log('parseDefer function exists:', typeof deferParser.parseDefer === 'function');
console.log('parseMut function exists:', typeof mutParser.parseMut === 'function');
