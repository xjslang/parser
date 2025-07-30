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
        // TODO: save position (currently node.location is `null`)
        const node = this.startNode()
        node.label = b.identifier('defer')
        node.body = this.parseBlock()
        return this.finishNode(node, 'LabeledStatement')
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
      const stmts = node.body.body
      const hasDefers = stmts.some((stmt) => {
        return stmt.type == 'LabeledStatement' && stmt.label.name == 'defer'
      })

      if (hasDefers) {
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
