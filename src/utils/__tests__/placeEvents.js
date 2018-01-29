import {placeEvents} from '../placeEvents'

test('placeEvents', () => {
  const startHour = 'PT06H'
  const endHour = 'PT23H'
  const ee = [0, 2]
  const nodes = [
    {level: 0, children: [1], depth: 2},
    {level: 1, children: [], depth: 2},
    {level: 0, children: [3, 4], depth: 2},
    {level: 1, children: [], depth: 2},
    {level: 1, children: [], depth: 2},
  ]
  const events = [
    {
      allDay: false,
      start: new Date(2017, 9, 7, 3, 0, 0),
      end: new Date(2017, 9, 7, 14, 0, 0),
    },
    {
      allDay: false,
      start: new Date(2017, 9, 7, 12, 30, 0),
      end: new Date(2017, 9, 7, 13, 30, 0),
    },
    {
      allDay: false,
      start: new Date(2017, 9, 7, 16, 30, 0),
      end: new Date(2017, 9, 7, 18, 0, 0),
    },
    {
      allDay: false,
      start: new Date(2017, 9, 7, 17, 0, 0),
      end: new Date(2017, 9, 7, 18, 30, 0),
    },
    {
      allDay: false,
      start: new Date(2017, 9, 7, 17, 0, 0),
      end: new Date(2017, 9, 7, 17, 30, 0),
    },
  ]
  const res = placeEvents(ee, nodes, events, 30, startHour, endHour)
  const expected = [
    {
      key: 0,
      event: {
        allDay: false,
        start: new Date(2017, 9, 7, 3, 0, 0),
        end: new Date(2017, 9, 7, 14, 0, 0),
      },
      style: {
        position: 'absolute',
        top: 0,
        left: '0%',
        width: '85%',
        height: 240,
      },
    },
    {
      key: 2,
      event: {
        allDay: false,
        start: new Date(2017, 9, 7, 16, 30, 0),
        end: new Date(2017, 9, 7, 18, 0, 0),
      },
      style: {
        position: 'absolute',
        top: 315,
        left: '0%',
        width: '85%',
        height: 45,
      },
    },
  ]
  expect(res).toEqual(expected)
})
