import getHours from 'date-fns/fp/getHours'
import isAfter from 'date-fns/fp/isAfter'
import compareDesc from 'date-fns/fp/compareDesc'
import isSameDay from 'date-fns/fp/isSameDay'
import isSameHour from 'date-fns/fp/isSameHour'

import {constructTree} from './constructTree'

/**
 * Split the items between allDay one and not, and construct the tree of nodes for the daily "stairs" layout
 *  algorithm
 * @param {Array<Events>} data The array of events passed by the user
 */
export function parseData(data) {
  let events = data.filter(e => typeof e.allDay === 'boolean' && e.allDay === false)
  events.sort((a, b) => {
    if (isSameDay(a.start, b.start) && isSameHour(a.start, b.start))
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
