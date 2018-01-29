import isWithinInterval from 'date-fns/fp/isWithinInterval'

// The interval is time based so we also pass the day
export const checkPartialBounds = int => event =>
  isWithinInterval(int, event.start) || isWithinInterval(int, event.end)
