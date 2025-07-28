import { builders as b } from 'ast-types'

// defers.push(() => [body])
export function buildDefersPushStatement(body) {
  return b.expressionStatement(
    b.callExpression(
      b.memberExpression(b.identifier('defers'), b.identifier('push'), false),
      [b.arrowFunctionExpression([], body, false)]
    )
  )
}

// try {
//     const defers = [];
//     [body]
// } finally {
//     for (let i = defers.length - 1; i >= 0; i --) {
//         try {
//             defers[i]();
//         } catch(err) {
//             console.log(err);
//         }
//     }
// }
export function buildTryFinallyWrapper(body) {
  return b.tryStatement(
    b.blockStatement([
      // const defers = [];
      b.variableDeclaration('const', [
        b.variableDeclarator(b.identifier('defers'), b.arrayExpression([])),
      ]),
      ...body.body,
    ]),
    null,
    b.blockStatement([
      // for (let i = defers.length - 1; i >= 0; i --) {
      b.forStatement(
        b.variableDeclaration('let', [
          b.variableDeclarator(
            b.identifier('i'),
            b.binaryExpression(
              '-',
              b.memberExpression(
                b.identifier('defers'),
                b.identifier('length'),
                false
              ),
              b.literal(1)
            )
          ),
        ]),
        b.binaryExpression('>=', b.identifier('i'), b.literal(0)),
        b.updateExpression('--', b.identifier('i'), false),
        b.blockStatement([
          b.tryStatement(
            // try { defers[i](); }
            b.blockStatement([
              b.expressionStatement(
                b.callExpression(
                  b.memberExpression(
                    b.identifier('defers'),
                    b.identifier('i'),
                    true
                  ),
                  []
                )
              ),
            ]),
            // catch(err) { console.error(err); }
            b.catchClause(
              b.identifier('err'),
              null,
              b.blockStatement([
                b.expressionStatement(
                  b.callExpression(
                    b.memberExpression(
                      b.identifier('console'),
                      b.identifier('error'),
                      false
                    ),
                    [b.identifier('err')]
                  )
                ),
              ])
            )
          ),
        ])
      ),
    ])
  )
}
