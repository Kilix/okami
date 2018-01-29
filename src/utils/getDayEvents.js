import isWithinInterval from 'date-fns/fp/isWithinInterval'
import startOfDay from 'date-fns/fp/startOfDay'
import endOfDay from 'date-fns/fp/endOfDay'

import {checkIn} from './checkIn'

export function getDayEvents(day, data) {
  const int = {
    start: startOfDay(day),
    end: endOfDay(day),
  }
  return [
    ...data.filter(e => typeof e.allDay !== 'boolean' && isWithinInterval(int, e.allDay)),
    ...data.filter(e => typeof e.allDay === 'boolean' && checkIn(int)(e)),
  ]
}
