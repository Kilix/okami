import {asHours} from 'pomeranian-durations'
import getMinutes from 'date-fns/fp/getMinutes'
import getHours from 'date-fns/fp/getHours'
import isBefore from 'date-fns/fp/isBefore'
import setHours from 'date-fns/fp/setHours'
import isAfter from 'date-fns/fp/isAfter'

import {around} from './around'

// Gives the absolute positioning of the events
// TODO render part of the event included in the day
export function placeEvents(renderableIndexes, nodes, events, rowHeight, startHour, endHour, day) {
  const sh = asHours(startHour)
  const eh = asHours(endHour)
  return renderableIndexes.map(i => {
    const {start, end} = events[i]
    const {level, depth, children} = nodes[i]
    const ratio = 100 / depth
    const hoursToMinutes = entry => around((getHours(entry) - sh) * 60) + getMinutes(entry)
    const boundedStart = isBefore(setHours(sh, start), start) ? 0 : hoursToMinutes(start)
    const boundedEnd = isAfter(setHours(eh, end), end)
      ? around((eh - sh) * 60)
      : hoursToMinutes(end)

    return {
      key: i,
      event: events[i],
      style: {
        position: 'absolute',
        top: rowHeight * around(boundedStart / 60),
        left: `${level * ratio}%`,
        width: children.length === 0 ? `${100 - level * ratio}%` : `${ratio + 0.7 * ratio}%`,
        height: rowHeight * around((boundedEnd - boundedStart) / 60),
      },
    }
  })
}
