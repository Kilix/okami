import {getDayEvents} from '../getDayEvents'

describe('getDayEvents', () => {
  test('return two events', () => {
    const day = new Date(2017, 9, 9, 0, 0, 0, 0)
    const data = [
      {
        allDay: true,
        start: new Date(2017, 9, 7, 11, 23, 0),
        end: new Date(2017, 9, 10, 12, 23, 0),
      },
      {allDay: new Date(2017, 9, 9, 5, 0, 0, 0)},
      {allDay: new Date(2017, 9, 13, 11, 23, 0)},
      {
        allDay: true,
        start: new Date(2017, 9, 10, 11, 23, 0),
        end: new Date(2017, 9, 17, 12, 23, 0),
      },
    ]
    const res = getDayEvents(day, data)
    const expected = [
      {allDay: new Date(2017, 9, 9, 5, 0, 0, 0)},
      {
        allDay: true,
        start: new Date(2017, 9, 7, 11, 23, 0),
        end: new Date(2017, 9, 10, 12, 23, 0),
      },
    ]
    expect(res).toEqual(expected)
  })
})
