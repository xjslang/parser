/**
 * @param {recast.NodePath} path
 * @param {string | string[]} nodeTypes
 * @returns {recast.NodePath}
 */
export const getClosestPath = (path, nodeTypes) => {
  nodeTypes = [...nodeTypes]
  let currentPath = path
  do {
    if (nodeTypes.includes(currentPath.value.type)) {
      return currentPath
    }
    currentPath = currentPath.parent
  } while (currentPath)
  return null
}

/**
 * @param {string} message
 * @param {acorn.Node} [node]
 */
export const error = (message, node) => {
  const line = node?.loc?.start?.line
  const col = node?.loc?.start?.column
  let loc = ''
  if (line !== undefined) {
    loc = `line: ${line}`
  }
  if (col !== undefined) {
    loc += `, col: ${col}`
  }

  throw new Error(loc ? `[${loc}]: ${message}` : message)
}
