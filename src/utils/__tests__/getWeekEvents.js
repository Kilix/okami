import {getWeekEvents} from '../index'

describe('getWeekEvents', () => {
  test('return two events', () => {
    const startWeek = new Date(2017, 9, 9, 0, 0, 0, 0)
    const data = [
      {
        allDay: true,
        start: new Date(2017, 9, 7, 11, 23, 0),
        end: new Date(2017, 9, 8, 12, 23, 0),
      },
      {allDay: new Date(2017, 9, 13, 11, 23, 0)},
      {
        allDay: true,
        start: new Date(2017, 9, 10, 11, 23, 0),
        end: new Date(2017, 9, 17, 12, 23, 0),
      },
    ]
    const res = getWeekEvents(1, true, startWeek, data)
    const expected = [
      {allDay: new Date(2017, 9, 13, 11, 23, 0)},
      {
        allDay: true,
        start: new Date(2017, 9, 10, 11, 23, 0),
        end: new Date(2017, 9, 17, 12, 23, 0),
      },
    ]
    expect(res).toEqual(expected)
  })
})
