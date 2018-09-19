import getHours from 'date-fns/fp/getHours'
import compareDesc from 'date-fns/fp/compareDesc'
import isEqual from 'date-fns/fp/isEqual'

import {constructTree} from './constructTree'

/**
 * Split the items between allDay one and not, and construct the tree of nodes for the daily "stairs" layout
 *  algorithm
 * @param {Array<Events>} data The array of events passed by the user
 */
export function parseData(data) {
  let events = data.filter(e => typeof e.allDay === 'boolean' && e.allDay === false)
  events.sort((a, b) => {
    if (isEqual(a.start, b.start))
      return getHours(b.end) - getHours(b.start) - (getHours(a.end) - getHours(a.start))

    return compareDesc(a.start, b.start)
  })

  const fevents = data.filter(e => e.allDay)
  return {
    events,
    fevents,
    nodes: constructTree(events),
  }
}
