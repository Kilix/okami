import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping'
import isSameDay from 'date-fns/fp/isSameDay'

export const checkIn = int => event =>
  areIntervalsOverlapping(event, int) && !isSameDay(event.start, event.end)
