import Calendar from '../'
import * as Okami from '../'

test('right imports', () => {
  const keys = [
    'Calendar',
    'WeeklyCalendar',
    'DailyCalendar',
    'MonthlyCalendar',
    'Navigation',
    'DaysLabels',
    'HoursLabels',
    'default',
  ]
  expect(typeof Calendar).toBe('function')
  expect(Object.keys(Okami)).toEqual(keys)
})
