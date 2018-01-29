import isWithinInterval from 'date-fns/fp/isWithinInterval'
import endOfWeek from 'date-fns/fp/endOfWeek'
import addDays from 'date-fns/fp/addDays'

import {checkIn} from './checkIn'

export function getWeekEvents(startingDay, showWeekend, startWeek, data) {
  const int = {
    start: startWeek,
    end: showWeekend ? endOfWeek(startWeek, {weekStartsOn: startingDay}) : addDays(4, startWeek),
  }
  return [
    ...data.filter(e => typeof e.allDay !== 'boolean' && isWithinInterval(int, e.allDay)),
    ...data.filter(e => typeof e.allDay === 'boolean' && checkIn(int)(e)),
  ]
}
