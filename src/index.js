import defer from './defer/index.js'

/**
 * @param {string} input
 * @param {acorn.Options} options
 * @returns {acorn.Program}
 */
export function parse(input, options = { ecmaVersion: 'latest' }) {
  return defer.parse(input, options)
}

export * from './defer/index.js'
export * from './mut/index.js'

// Default export for module-style import
export default {
  parse,
}
