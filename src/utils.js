import {asHours} from 'pomeranian-durations'
import startOfWeek from 'date-fns/fp/startOfWeekWithOptions'
import getHours from 'date-fns/fp/getHours'
import getMonth from 'date-fns/fp/getMonth'
import startOfDay from 'date-fns/fp/startOfDay'
import endOfDay from 'date-fns/fp/endOfDay'
import subWeeks from 'date-fns/fp/subWeeks'
import addWeeks from 'date-fns/fp/addWeeks'
import addDays from 'date-fns/fp/addDays'
import addHours from 'date-fns/fp/addHours'
import format from 'date-fns/fp/formatWithOptions'
import isSameHour from 'date-fns/fp/isSameHour'
import isSameDay from 'date-fns/fp/isSameDay'
import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping'
import isWithinInterval from 'date-fns/fp/isWithinInterval'

import differenceInHours from 'date-fns/fp/differenceInHours'
import isAfter from 'date-fns/fp/isAfter'
import isBefore from 'date-fns/fp/isBefore'

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
