import {getTodayEvents} from '../getTodayEvents'

describe('getTodayEvents', () => {
  test('return one event', () => {
    const startHour = 'PT06H'
    const endHour = 'PT23H'
    const day = new Date(2017, 9, 15, 0, 0, 0)
    const data = [
      {start: new Date(2017, 9, 15, 11, 23, 0), end: new Date(2017, 9, 15, 12, 23, 0)},
      {start: new Date(2017, 9, 16, 11, 23, 0), end: new Date(2017, 9, 6, 12, 23, 0)},
    ]

    const expected = [
      {start: new Date(2017, 9, 15, 11, 23, 0), end: new Date(2017, 9, 15, 12, 23, 0)},
    ]
    expect(getTodayEvents(startHour, endHour, day, data)).toEqual(expected)
  })
  test('return no event', () => {
    const startHour = 'PT06H'
    const endHour = 'PT23H'
    const day = new Date(2017, 9, 14, 0, 0, 0)
    const data = [
      {start: new Date(2017, 9, 15, 11, 23, 0), end: new Date(2017, 9, 15, 12, 23, 0)},
      {start: new Date(2017, 9, 16, 11, 23, 0), end: new Date(2017, 9, 6, 12, 23, 0)},
    ]

    const expected = []
    expect(getTodayEvents(startHour, endHour, day, data)).toEqual(expected)
  })
})
