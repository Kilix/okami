import startOfWeek from 'date-fns/startOfWeek'

import {
  flatten,
  range,
  around,
  debounce,
  checkBound,
  checkIn,
  getTodayEvents,
  getWeekEvents,
  getDayEvents,
  computeNow,
  placeEvents,
  constructTree,
  parseData,
} from '../utils.js'

describe('utils', () => {
  const RealDate = Date

  function mockDate(isoDate) {
    global.Date = class extends RealDate {
      constructor() {
        super()
        return new RealDate(isoDate)
      }
    }
  }
  afterEach(() => {
    global.Date = RealDate
  })

  test('flatten', () => {
    const start = [1, [2, 3], [4]]
    const exptected = [1, 2, 3, 4]
    expect(flatten(start)).toEqual(exptected)
  })

  describe('range', () => {
    test('simple', () => {
      const exptected = [0, 1, 2, 3]
      expect(range(4)).toEqual(exptected)
    })
    test('complex', () => {
      const exptected = [1, 2, 3, 4]
      expect(range(1, 5)).toEqual(exptected)
    })
    test('with step', () => {
      const exptected = [2, 4, 6, 8]
      expect(range(2, 9, 2)).toEqual(exptected)
    })
  })

  test('around', () => {
    expect(around(4.3)).toBe(4.5)
    expect(around(4.334)).toBe(4.5)
    expect(around(5.78)).toBe(6)
  })

  test('debounce', done => {
    const fn = jest.fn()
    const res = debounce(fn, 200, false)
    res()
    res()
    setTimeout(() => {
      expect(fn.mock.calls.length).toBe(1)
      done()
    }, 1000)
  })

  describe('checkBound', () => {
    const day = new Date(2017, 9, 13, 0, 0, 0)
    const int = {start: new Date(2017, 9, 12, 12, 0, 0), end: new Date(2017, 9, 14, 22, 0, 0)}
    test('should be true', () => {
      const d = {start: new Date(2017, 9, 13, 11, 23, 0), end: new Date(2017, 9, 13, 12, 23, 0)}
      expect(checkBound(day, int)(d)).toEqual(true)
    })
    test('should be false', () => {
      const d = {start: new Date(2017, 9, 15, 11, 23, 0), end: new Date(2017, 9, 16, 12, 23, 0)}
      expect(checkBound(day, int)(d)).toEqual(false)
    })
    test('should be false too ', () => {
      const d = {start: new Date(2017, 9, 14, 23, 23, 0), end: new Date(2017, 9, 15, 12, 23, 0)}
      expect(checkBound(day, int)(d)).toEqual(false)
    })
  })

  describe('checkIn', () => {
    const int = {start: new Date(2017, 9, 12, 12, 0, 0), end: new Date(2017, 9, 14, 22, 0, 0)}
    test('should be true', () => {
      const d = {start: new Date(2017, 9, 13, 11, 23, 0), end: new Date(2017, 9, 14, 12, 23, 0)}
      expect(checkIn(int)(d)).toEqual(true)
    })
    test('should be false', () => {
      const d = {start: new Date(2017, 9, 13, 11, 23, 0), end: new Date(2017, 9, 13, 12, 23, 0)}
      expect(checkIn(int)(d)).toEqual(false)
    })
    test('should be false', () => {
      const d = {start: new Date(2017, 9, 15, 11, 23, 0), end: new Date(2017, 9, 16, 12, 23, 0)}
      expect(checkIn(int)(d)).toEqual(false)
    })
    test('should be false too ', () => {
      const d = {start: new Date(2017, 9, 14, 23, 23, 0), end: new Date(2017, 9, 15, 12, 23, 0)}
      expect(checkIn(int)(d)).toEqual(false)
    })
  })

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

  test('computeNow', () => {
    const now = new Date(2017, 9, 9, 12, 23, 0, 0)
    const wrapper = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: 100,
      height: 100,
    }
    const res = computeNow(wrapper, 'PT06H', 'PT22H', now)
    const expected = {
      position: 'absolute',
      left: 0,
      top: 40,
      width: '100%',
    }
    expect(res).toEqual(expected)
  })

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

  test('constructTree', () => {
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
    const nodes = {
      0: {level: 0, children: [1, 2, 3], depth: 3},
      1: {level: 1, children: [], depth: 3},
      2: {level: 1, children: [3], depth: 3},
      3: {level: 2, children: [], depth: 3},
      4: {level: 0, children: [5, 6], depth: 2},
      5: {level: 1, children: [], depth: 2},
      6: {level: 1, children: [], depth: 2},
    }
    expect(constructTree(events)).toEqual(nodes)
  })

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
})
