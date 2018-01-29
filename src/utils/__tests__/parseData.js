import {parseData} from '../parseData'

test('parseData', () => {
  const events = [
    {
      allDay: false,
      start: new Date(2017, 9, 7, 3, 0, 0),
      end: new Date(2017, 9, 7, 14, 0, 0),
    },
    {
      allDay: false,
      start: new Date(2017, 9, 7, 5, 0, 0),
      end: new Date(2017, 9, 7, 7, 0, 0),
    },
    {
      allDay: false,
      start: new Date(2017, 9, 7, 12, 30, 0),
      end: new Date(2017, 9, 7, 13, 30, 0),
    },
    {
      allDay: false,
      start: new Date(2017, 9, 7, 13, 0, 0),
      end: new Date(2017, 9, 7, 14, 30, 0),
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
  const fevents = [
    {
      allDay: true,
      start: new Date(2017, 9, 7, 17, 0, 0),
      end: new Date(2017, 9, 8, 17, 30, 0),
    },
  ]
  const nodes = {
    0: {level: 0, children: [1, 2, 3], depth: 3},
    1: {level: 1, children: [], depth: 3},
    2: {level: 1, children: [3], depth: 3},
    3: {level: 2, children: [], depth: 3},
    4: {level: 0, children: [5, 6], depth: 2},
    5: {level: 1, children: [], depth: 2},
    6: {level: 1, children: [], depth: 2},
  }
  expect(parseData([...events, ...fevents])).toEqual({
    events,
    fevents,
    nodes,
  })
})
