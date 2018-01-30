import {parseData} from '../parseData'

describe('parseData', () => {
  test('Sorts the events by start, then by duration', () => {
    const events = [
      {
        id: 3,
        allDay: false,
        start: new Date(2017, 9, 7, 6, 0, 0),
        end: new Date(2017, 9, 7, 12, 0, 0),
      },
      {
        id: 2,
        allDay: false,
        start: new Date(2017, 9, 7, 6, 0, 0),
        end: new Date(2017, 9, 7, 14, 0, 0),
      },
      {
        id: 1,
        allDay: false,
        start: new Date(2017, 9, 7, 3, 0, 0),
        end: new Date(2017, 9, 7, 22, 0, 0),
      },
    ]
    const data = parseData(events)
    expect(data.events.map(event => event.id)).toEqual([1, 2, 3])
  })
  test('base case', () => {
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
      0: {type: 'normal', level: 0, children: [1, 2, 3], depth: 3},
      1: {type: 'normal', level: 1, children: [], depth: 3},
      2: {type: 'normal', level: 1, children: [3], depth: 3},
      3: {type: 'normal', level: 2, children: [], depth: 3},
      4: {type: 'normal', level: 0, children: [5, 6], depth: 2},
      5: {type: 'normal', level: 1, children: [], depth: 2},
      6: {type: 'normal', level: 1, children: [], depth: 2},
    }
    expect(parseData([...events, ...fevents])).toEqual({
      events,
      fevents,
      nodes,
    })
  })
})
