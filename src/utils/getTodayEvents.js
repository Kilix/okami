import {asHours} from 'pomeranian-durations'
import setHours from 'date-fns/fp/setHours'

import {checkBound} from './checkBound'

export function getTodayEvents(startHour, endHour, day, data) {
  const check = checkBound(day, {
    start: setHours(asHours(startHour), day),
    end: setHours(asHours(endHour), day),
  })
  return data.filter(check)
}
