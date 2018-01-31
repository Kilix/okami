// @flow
import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping'
import isAfter from 'date-fns/fp/isAfter'
import isEqual from 'date-fns/fp/isEqual'

import {isSameEvent} from './isSameEvent'
import type {Event, Nodes, Node} from '../types'

// Creates the tree used for the daily "stairs" layout algorithm, i.e. specify which nodes are child
// of which node
// It also assigns for each node it's level (position on each branch) and depth (length of the
// branch)

// Invariant: the data is always sorted first by start, then by duration
export function constructTree(data: $ReadOnlyArray<Event>): Nodes {
  // Tag nodes picked in the tree so that they are only used once
  const pickedNodes = {}
  let nodes = {}

  // Finds a node direct children. If more than one event is identical to the node, picks only the
  // first one (if a == b == c, it'll be c child of b, and b child of a)
  const findChildren = id => {
    const children = []
    const currentNode = data[id]
    let alreadySameEvent = false
    for (let i = 0; i < data.length; i++) {
      const targetNode = data[i]
      if (
        !alreadySameEvent &&
        areIntervalsOverlapping(currentNode, targetNode) && // no intersection, no children
        (isAfter(currentNode.start)(targetNode.start) ||
          (isEqual(currentNode.start)(targetNode.start) &&
            currentNode.id !== targetNode.id &&
            pickedNodes[i] !== true))
      ) {
        if (isSameEvent(currentNode, targetNode)) alreadySameEvent = true

        pickedNodes[i] = true
        children.push(i)
      }
    }
    return children
  }
  const makeNode = (level, id): Node => {
    const children = findChildren(id)
    children.map(n => {
      if (typeof nodes[n] === 'undefined') {
        nodes[n] = makeNode(level + 1, n)
      } else {
        if (nodes[n].level < level + 1) nodes[n].level = level + 1
      }
    })
    const currentNode = data[id]
    // Since the events are sorted (and children too) we can only check the next event
    const nextNode = children.length > 0 ? data[children[0]] : null
    let type = 'normal'
    if (nextNode && isSameEvent(currentNode, nextNode)) {
      type = 'equal'
      nodes[children[0]].type = 'equal'
    }
    return {
      children,
      level,
      depth: 1,
      type,
    }
  }
  // This get the highest level of an array of nodes (and subsequent children)
  const getMaxDepth = TNodes =>
    TNodes.reduce((maxDepth, nodeIndex) => {
      const {level} = nodes[nodeIndex]
      const nodeChildrenMaxDepth = getMaxDepth(nodes[nodeIndex].children)
      const p = level < nodeChildrenMaxDepth ? nodeChildrenMaxDepth : level
      return maxDepth < p ? p : maxDepth
    }, 0)

  // Recursively set the children's depth
  const setChildrenDepth = (max, TNodes) =>
    TNodes.map(n => {
      // TODO there used to be this ternary, doesn't seem useful
      // nodes[n].depth = nodes[n].depth < max ? max : nodes[n].depth
      nodes[n].depth = max
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
