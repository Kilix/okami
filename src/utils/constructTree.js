import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping'
import isAfter from 'date-fns/fp/isAfter'
import isEqual from 'date-fns/fp/isEqual'

// Creates the tree used for the daily "stairs" layout algorithm, i.e. specify which nodes are child
// of which node
// It also assigns for each node it's level (position on each branch) and depth (length of the
// branch)
export function constructTree(data) {
  // Tag nodes picked in the tree so that they are only used once
  const pickedNodes = {}
  let nodes = {}
  const findChildren = id => {
    const child = []
    const currentNode = data[id]
    for (let i = 0; i < data.length; i++) {
      const targetNode = data[i]
      if (
        areIntervalsOverlapping(currentNode, targetNode) &&
        (isAfter(currentNode.start, targetNode.start) ||
          (isEqual(currentNode.start, targetNode.start) &&
            currentNode.id !== targetNode.id &&
            pickedNodes[i] !== true))
      ) {
        pickedNodes[i] = true
        child.push(i)
      }
    }
    return child
  }
  const makeNode = (level, id) => {
    const children = findChildren(id)
    children.map(n => {
      if (typeof nodes[n] === 'undefined') {
        nodes[n] = makeNode(level + 1, n)
      } else {
        if (nodes[n].level < level + 1) nodes[n].level = level + 1
      }
    })
    return {
      children,
      level,
      depth: 1,
    }
  }
  const getMaxDepth = TNodes =>
    TNodes.reduce((acc, node) => {
      const {level} = nodes[node]
      const c = getMaxDepth(nodes[node].children)
      const p = level < c ? c : level
      return acc < p ? p : acc
    }, 0)

  // Recursively set the children's depth
  const setChildrenDepth = (max, TNodes) =>
    TNodes.map(n => {
      // TODO investigate the need of the ternary, setting depth to max seems correct
      nodes[n].depth = nodes[n].depth < max ? max : nodes[n].depth
      setChildrenDepth(max, nodes[n].children)
    })

  // We first pick the root nodes, i.e. the ones that will be of level 0, that are not children
  // of any other node, and immediately, its children (and children's children, so they are not
  // picked
  const rootNodes = []
  for (let i = 0; i < data.length; i++) {
    if (pickedNodes[i] === true) continue // bail out if the node has already been picked

    let isOverlapping = false
    for (let j = 0; j < rootNodes.length; j++) {
      isOverlapping = isOverlapping || areIntervalsOverlapping(data[i], data[rootNodes[j]])
    }
    if (isOverlapping === false) {
      pickedNodes[i] = true

      rootNodes.push(i)
      if (typeof nodes[i] === 'undefined') nodes[i] = makeNode(0, i)
      const maxDepth = getMaxDepth(nodes[i].children) + 1
      nodes[i].depth = maxDepth
      setChildrenDepth(maxDepth, nodes[i].children)
    }
  }
  return nodes
}
