import isWithinInterval from 'date-fns/fp/isWithinInterval'
import isSameDay from 'date-fns/fp/isSameDay'

// The interval is time based so we also pass the day
export const checkBounds = (day, int) => event =>
  (isWithinInterval(int, event.start) && isSameDay(event.end, day)) ||
  (isWithinInterval(int, event.end) && isSameDay(event.start, day))
