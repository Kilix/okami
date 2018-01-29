import {asHours} from 'pomeranian-durations'
import getMinutes from 'date-fns/fp/getMinutes'
import getHours from 'date-fns/fp/getHours'

import {around} from './around'

export function computeNow(wrapper, startHour, endHour, now) {
  const diffDayMin = around((asHours(endHour) - asHours(startHour)) * 60)
  const diffMin = around((getHours(now) - asHours(startHour)) * 60) + getMinutes(now)
  const top = around(diffMin * wrapper.height / diffDayMin)
  return {
    position: 'absolute',
    top,
    left: 0,
    width: '100%',
  }
}
