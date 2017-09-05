import {asHours} from 'pomeranian-durations'
import setHours from 'date-fns/fp/setHours'
import getHours from 'date-fns/fp/getHours'
import getMinutes from 'date-fns/fp/getMinutes'
import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping'
import isWithinInterval from 'date-fns/fp/isWithinInterval'
import isSameDay from 'date-fns/fp/isSameDay'
import isAfter from 'date-fns/fp/isAfter'
import isBefore from 'date-fns/fp/isBefore'
import endOfWeek from 'date-fns/fp/endOfWeek'
import startOfDay from 'date-fns/fp/startOfDay'
import endOfDay from 'date-fns/fp/endOfDay'
import addDays from 'date-fns/fp/addDays'
import isValid from 'date-fns/isValid'

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

export function placeEvents(events, root, rowHeight, startHour, endHour) {
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
      const sh = asHours(startHour)
      const eh = asHours(endHour)
      return collidingGroup.map((event, idx) => {
        const {start, end} = event
        const s = isBefore(setHours(sh, start), start)
          ? 0
          : (getHours(start) - sh) * 60 + getMinutes(start)
        const e = isAfter(setHours(eh, end), end)
          ? (eh - sh) * 60
          : (getHours(end) - sh) * 60 + getMinutes(end)

        return {
          event,
          style: {
            position: 'absolute',
            top: rowHeight * (s / 60),
            left: root.width / nbEvents * idx - (idx !== 0 ? root.width / 10 : 0),
            width: root.width / nbEvents + (nbEvents > 1 ? root.width / 10 : 0),
            height: rowHeight * ((e - s) / 60),
          },
        }
      })
    })
    return flatten(groupEvents).map(e => ({
      key: e.event.id,
      ...e,
    }))
  }
  return events.map(e => ({
    key: e.id,
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

const checkBound = (day, int) => event =>
  (isWithinInterval(int, event.start) && isSameDay(event.end, day)) ||
  (isWithinInterval(int, event.end) && isSameDay(event.start, day))
const checkIn = int => event =>
  areIntervalsOverlapping(event, int) && !isSameDay(event.start, event.end)

export function getTodayEvents(startHour, endHour, day, data) {
  const check = checkBound(day, {
    start: setHours(asHours(startHour), day),
    end: setHours(asHours(endHour), day),
  })
  return data.filter(e => !e.allDay || typeof e.allDay !== 'boolean').filter(check)
}
export function getWeekEvents(startingDay, showWeekend, startWeek, data) {
  const int = {
    start: startWeek,
    end: showWeekend ? endOfWeek(startWeek, {startOfDay: startingDay}) : addDays(4, startWeek),
  }
  return [
    ...data.filter(e => e.allDay && isWithinInterval(int, e.allDay)),
    ...data.filter(e => e.allDay && typeof e.allDay === 'boolean').filter(checkIn(int)),
  ]
}

export function getDayEvents(day, data) {
  const int = {
    start: startOfDay(day),
    end: endOfDay(day),
  }
  return [
    ...data.filter(e => e.allDay && isWithinInterval(int, e.allDay)),
    ...data.filter(e => e.allDay && typeof e.allDay === 'boolean').filter(checkIn(int)),
  ]
}
