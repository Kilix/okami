import {asHours} from 'pomeranian-durations'
import getHours from 'date-fns/fp/getHours'
import getMinutes from 'date-fns/fp/getMinutes'
import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping'
import differenceInHours from 'date-fns/fp/differenceInHours'

export const days = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}
export function shiftLeft(n, arr) {
  return arr.slice(n, arr.length).concat(arr.slice(0, n))
}

export function flatten(list) {
  var value, jlen, j
  var result = []
  var idx = 0
  var ilen = list.length

  while (idx < ilen) {
    if (Array.isArray(list[idx])) {
      value = list[idx]
      j = 0
      jlen = value.length
      while (j < jlen) {
        result[result.length] = value[j]
        j += 1
      }
    } else {
      result[result.length] = list[idx]
    }
    idx += 1
  }
  return result
}

export function debounce(func, wait, immediate) {
  var timeout
  return function() {
    var context = this,
      args = arguments
    var later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

export function range(start, stop, step) {
  if (stop == null) {
    stop = start || 0
    start = 0
  }
  step = step || 1

  var length = Math.max(Math.ceil((stop - start) / step), 0)
  var range = Array(length)

  for (var idx = 0; idx < length; idx++, start += step) {
    range[idx] = start
  }
  return range
}

export function placeEvents(events, root, rowHeight, startHour) {
  if (events.length > 0) {
    var groupEvents = []
    for (let i = 0; i < events.length; i++) {
      const event = events[i]
      let added = false
      for (let j = 0; j < groupEvents.length; j++) {
        const collidingGroup = groupEvents[j]
        const isColliding = collidingGroup.reduce(
          (a, ee) => a || areIntervalsOverlapping(event, ee),
          false
        )
        if (isColliding) {
          groupEvents[j] = [...collidingGroup, event]
          added = true
          break
        }
      }
      if (!added) groupEvents.push([event])
    }
    groupEvents = groupEvents.map(collidingGroup => {
      const nbEvents = collidingGroup.length
      return collidingGroup.map((event, idx) => {
        return {
          event,
          style: {
            position: 'absolute',
            top: rowHeight * (getHours(event.start) - asHours(startHour)),
            left:
              root.width / nbEvents * idx - (idx !== 0 ? root.width / 10 : 0),
            width: root.width / nbEvents + (nbEvents > 1 ? root.width / 10 : 0),
            height: rowHeight * differenceInHours(event.start, event.end),
          },
        }
      })
    })
    return flatten(groupEvents).map(e => ({
      key: e.event.title,
      ...e,
    }))
  }
  return events.map(e => ({
    key: e.title,
    event: e,
  }))
}

export function computeNow(wrapper, startHour, endHour) {
  const now = new Date()
  const diffDayMin = (asHours(endHour) - asHours(startHour)) * 60
  const diffMin = (getHours(now) - asHours(startHour)) * 60 + getMinutes(now)
  const top = diffMin * wrapper.height / diffDayMin
  return {
    position: 'absolute',
    top,
    left: 0,
    width: wrapper.width,
  }
}
