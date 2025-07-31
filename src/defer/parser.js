import * as acorn from 'acorn'
import * as recast from 'recast'
import { builders as b } from 'ast-types'
import { getClosestPath, error } from '../libs/utils.js'
import { buildDefersPushStatement, buildTryFinallyWrapper } from './builders.js'

/**
 * @param {typeof acorn.Parser} BaseParser
 */
const DeferParser = acorn.Parser.extend((BaseParser) => {
  return class extends BaseParser {
    parseStatement(context, topLevel, exports) {
      const isDefer = this.isContextual('defer')
      if (isDefer) {
        this.next()
        const stmt = this.parseStatement()

        let body
        if (stmt.type == 'BlockStatement') {
          body = stmt
        } else if (stmt.type == 'ExpressionStatement') {
          body = this.startNode()
          body.body = [stmt]
          this.finishNode(body, 'BlockStatement')
        } else {
          // TODO: better use this.raise
          this.unexpected()
        }

        // TODO: save position (currently node.location is `null`)
        const node = this.startNode()
        node.label = b.identifier('defer')
        node.body = body
        this.finishNode(node, 'LabeledStatement')

        return node
      }

      return super.parseStatement(context, topLevel, exports)
    }
  }
})

/**
 * @param {acorn.Program} ast
 * @returns {acorn.Program}
 */
const deferVisitor = (ast) => {
  const suffix = Math.random().toString(36).slice(2)
  const hasDefers = (body) => {
    let found = false

    recast.visit(body, {
      visitLabeledStatement(path) {
        const node = path.node
        if (
          node.label.name === 'defer' &&
          node.body.type === 'BlockStatement'
        ) {
          found = true
          return false
        }
        this.traverse(path)
      },

      // Don't traverse into nested functions
      visitFunctionDeclaration() {
        return false
      },
      visitFunctionExpression() {
        return false
      },
      visitArrowFunctionExpression() {
        return false
      },
    })

    return found
  }

  return recast.visit(ast, {
    // overridden methods
    visitLabeledStatement(path) {
      const node = path.node
      if (node.label.name == 'defer' && node.body.type == 'BlockStatement') {
        const parentPath = getClosestPath(path, [
          'FunctionDeclaration',
          'FunctionExpression',
          'ArrowFunctionExpression',
        ])

        if (!parentPath) {
          error('defer statements are not allowed at top-level', node)
        }

        path.replace(buildDefersPushStatement(node.body, suffix))
      }
      return this.traverse(path)
    },
    visitFunctionDeclaration(path) {
      this.visitFunction(path)
    },
    visitFunctionExpression(path) {
      this.visitFunction(path)
    },
    visitArrowFunctionExpression(path) {
      this.visitFunction(path)
    },

    // custom methods
    visitFunction(path) {
      const node = path.node
      const bodyHasDefers = hasDefers(node.body)

      if (bodyHasDefers) {
        node.body = buildTryFinallyWrapper(node.body.body, suffix)
      }

      return this.traverse(path)
    },
  })
}

/**
 * @param {string} input
 * @param {acorn.Options} options
 * @returns {acorn.Program}
 */
export const parse = (input, options = { ecmaVersion: 'latest' }) => {
  return deferVisitor(DeferParser.parse(input, options))
}
