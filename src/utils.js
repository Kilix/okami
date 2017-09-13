import {asHours} from 'pomeranian-durations'
import setHours from 'date-fns/fp/setHours'
import getDate from 'date-fns/fp/getDate'
import getMonth from 'date-fns/fp/getMonth'
import getYear from 'date-fns/fp/getYear'
import getHours from 'date-fns/fp/getHours'
import getMinutes from 'date-fns/fp/getMinutes'
import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping'
import isWithinInterval from 'date-fns/fp/isWithinInterval'
import isSameDay from 'date-fns/fp/isSameDay'
import isEqual from 'date-fns/fp/isEqual'
import isAfter from 'date-fns/fp/isAfter'
import isBefore from 'date-fns/fp/isBefore'
import endOfWeek from 'date-fns/fp/endOfWeek'
import startOfDay from 'date-fns/fp/startOfDay'
import endOfDay from 'date-fns/fp/endOfDay'
import addDays from 'date-fns/fp/addDays'
import getDayOfYear from 'date-fns/getDayOfYear'

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

export function around(number) {
  var value = (number * 2).toFixed() / 2
  return value
}

export function placeEvents(ee, nodes, events, root, rowHeight, startHour, endHour) {
  const sh = asHours(startHour)
  const eh = asHours(endHour)
  return ee.map(i => {
    const {start, end} = events[i]
    const {level, depth, children} = nodes[i]
    const ratio = 100 / depth
    const hoursToMinutes = entry => around((getHours(entry) - sh) * 60) + getMinutes(entry)
    const boundedStart = isBefore(setHours(sh, start), start) ? 0 : hoursToMinutes(start)
    const boundedEnd = isAfter(setHours(eh, end), end)
      ? around((eh - sh) / 60)
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

export function computeNow(wrapper, startHour, endHour) {
  const now = new Date()
  const diffDayMin = around((asHours(endHour) - asHours(startHour)) * 60)
  const diffMin = around((getHours(now) - asHours(startHour)) * 60) + getMinutes(now)
  const top = around(diffMin * wrapper.height / diffDayMin)
  return {
    position: 'absolute',
    top,
    left: 0,
    width: wrapper.width,
  }
}

export const checkBound = (day, int) => event =>
  (isWithinInterval(int, event.start) && isSameDay(event.end, day)) ||
  (isWithinInterval(int, event.end) && isSameDay(event.start, day))
export const checkIn = int => event =>
  areIntervalsOverlapping(event, int) && !isSameDay(event.start, event.end)

export function getTodayEvents(startHour, endHour, day, data) {
  const check = checkBound(day, {
    start: setHours(asHours(startHour), day),
    end: setHours(asHours(endHour), day),
  })
  return data.filter(check)
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
    ...data.filter(e => typeof e.allDay !== 'boolean').filter(isWithinInterval(int)),
    ...data.filter(e => typeof e.allDay === 'boolean').filter(checkIn(int)),
  ]
}

export function constructTree(data) {
  let nodes = {}
  const findChildren = id => {
    const child = []
    for (let i = 0; i < data.length; i++) {
      const c = data[id]
      const d = data[i]
      const cl = getHours(c.end) - getHours(c.start)
      const dl = getHours(d.end) - getHours(d.start)

      if (
        areIntervalsOverlapping(c, d) &&
        (isAfter(c.start, d.start) || (isEqual(c.start, d.start) && c.id !== d.id && cl - dl > 0))
      ) {
        child.push(i)
      }
    }
    return child
  }
  const makeNode = (level, id) => {
    const cc = findChildren(id)
    cc.map(n => {
      if (typeof nodes[n] === 'undefined') {
        nodes[n] = makeNode(level + 1, n)
      } else {
        if (nodes[n].level < level + 1) nodes[n].level = level + 1
      }
    })
    return {
      children: cc,
      level,
      depth: 1,
    }
  }
  const max = TNodes =>
    TNodes.reduce((acc, n) => {
      const {level} = nodes[n]
      const c = max(nodes[n].children)
      const p = level < c ? c : level
      return acc < p ? p : acc
    }, 0)

  const tNodes = []
  for (let i = 0; i < data.length; i++) {
    let isOverlapping = false
    for (let j = 0; j < tNodes.length; j++) {
      isOverlapping = isOverlapping || areIntervalsOverlapping(data[i], data[tNodes[j]])
    }
    if (isOverlapping === false) {
      tNodes.push(i)
    }
  }
  const assign = (max, TNodes) =>
    TNodes.map(n => {
      nodes[n].depth = nodes[n].depth < max ? max : nodes[n].depth
      assign(max, nodes[n].children)
    })
  tNodes.map(n => {
    if (typeof nodes[n] === 'undefined') nodes[n] = makeNode(0, n)
    const m = max(nodes[n].children) + 1
    nodes[n].depth = m
    assign(m, nodes[n].children)
  })
  return nodes
}
