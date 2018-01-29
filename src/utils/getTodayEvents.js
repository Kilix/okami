import {asHours} from 'pomeranian-durations'
import setHours from 'date-fns/fp/setHours'

import {checkBounds} from './checkBounds'

export function getTodayEvents(startHour, endHour, day, data) {
  const check = checkBounds(day, {
    start: setHours(asHours(startHour), day),
    end: setHours(asHours(endHour), day),
  })
  return data.filter(check)
}
