import {placeEvents} from '../placeEvents'

describe('placeEvents', () => {
  describe('Style computing', () => {
    const startHour = 'PT06H'
    const endHour = 'PT22H'
    const ee = [0, 1, 2]
    const day = new Date(2017, 9, 6, 3, 0, 0)
    const nodes = [
      {type: 'normal', level: 0, children: [], depth: 1},
      {type: 'normal', level: 0, children: [2], depth: 2},
      {type: 'normal', level: 1, children: [], depth: 2},
    ]
    const eventStart = 12
    const eventEnd = 17
    const rowHeight = 30
    // The events and nodes do not correspond (i.e. okami will never generate these nodes for these
    // events), but dor the purpose of this test, it does not matter
    const events = [
      {
        allDay: false,
        start: new Date(2017, 9, 6, eventStart, 0, 0),
        end: new Date(2017, 9, 6, eventEnd, 0, 0),
      },
      {
        allDay: false,
        start: new Date(2017, 9, 6, eventStart, 0, 0),
        end: new Date(2017, 9, 6, eventEnd, 0, 0),
      },
      {
        allDay: false,
        start: new Date(2017, 9, 6, eventStart, 0, 0),
        end: new Date(2017, 9, 6, eventEnd, 0, 0),
      },
    ]
    const computedEvents = placeEvents(ee, nodes, events, rowHeight, startHour, endHour, day)
    describe('vertical position', () => {
      const {style} = computedEvents[0]
      test('top', () => {
        expect(style.top).toBe((eventStart - 6) * rowHeight)
      })
      test('height', () => {
        expect(style.height).toBe((eventEnd - eventStart) * rowHeight)
      })
    })
    describe('horizontal position', () => {
      describe('event without children', () => {
        const {style} = computedEvents[0]
        test('left', () => {
          // It's level is 0, so it's on the left side
          expect(style.left).toBe('0%')
        })
        test('width', () => {
          // no children, so 100% width
          expect(style.width).toBe('100%')
        })
      })
      describe('event with children', () => {
        const {style} = computedEvents[1]
        test('left', () => {
          // It's level is 0, so it's on the left side
          expect(style.left).toBe('0%')
        })
        test('width', () => {
          // one children, so 50% width
          expect(style.width).toBe('85%')
        })
      })
      describe('child event', () => {
        const {style} = computedEvents[2]
        test('left', () => {
          // It's level is 1, it floats on its parent
          expect(style.left).toBe('50%')
        })
        test('width', () => {
          // it's a child, so it is smaller than the parten
          expect(style.width).toBe('50%')
        })
      })
    })
  })

  describe('Same event', () => {
    const startHour = 'PT06H'
    const endHour = 'PT22H'
    const ee = [0, 1, 2]
    const day = new Date(2017, 9, 6, 3, 0, 0)
    const nodes = [
      {type: 'equal', level: 0, children: [1], depth: 3},
      {type: 'equal', level: 1, children: [2], depth: 3},
      {type: 'equal', level: 2, children: [], depth: 3},
    ]
    const eventStart = 12
    const eventEnd = 17
    const rowHeight = 30
    // The events and nodes do not correspond (i.e. okami will never generate these nodes for these
    // events), but dor the purpose of this test, it does not matter
    const events = [
      {
        allDay: false,
        start: new Date(2017, 9, 6, eventStart, 0, 0),
        end: new Date(2017, 9, 6, eventEnd, 0, 0),
      },
      {
        allDay: false,
        start: new Date(2017, 9, 6, eventStart, 0, 0),
        end: new Date(2017, 9, 6, eventEnd, 0, 0),
      },
      {
        allDay: false,
        start: new Date(2017, 9, 6, eventStart, 0, 0),
        end: new Date(2017, 9, 6, eventEnd, 0, 0),
      },
    ]
    const computedEvents = placeEvents(ee, nodes, events, rowHeight, startHour, endHour, day)
    test('first event', () => {
      const {left, width} = computedEvents[0].style
      expect(left).toBe('0%')
      expect(width.startsWith('33.33')).toBe(true)
    })
    test('second event', () => {
      const {left, width} = computedEvents[1].style
      expect(left.startsWith('33.33')).toBe(true)
      expect(width.startsWith('33.33')).toBe(true)
    })
    test('third event', () => {
      const {left, width} = computedEvents[2].style
      expect(left.startsWith('66.66')).toBe(true)
      expect(width.startsWith('33.33')).toBe(true)
    })
  })

  describe('Events spanning multiple days', () => {
    const startHour = 'PT06H'
    const endHour = 'PT22H'
    const ee = [0]
    const startDay = new Date(2017, 9, 6, 3, 0, 0)
    const middleDay = new Date(2017, 9, 7, 3, 0, 0)
    const endDay = new Date(2017, 9, 8, 3, 0, 0)
    const nodes = [{type: 'normal', level: 0, children: [], depth: 1}]
    const events = [
      {
        allDay: false,
        start: new Date(2017, 9, 6, 15, 0, 0),
        end: new Date(2017, 9, 8, 14, 0, 0),
      },
    ]
    it('Place event when only its start is in the day', () => {
      const startDayEvents = placeEvents(ee, nodes, events, 30, startHour, endHour, startDay)
      expect(startDayEvents[0].style).toEqual(
        expect.objectContaining({
          top: (15 - 6) * 30, // the event is at 15:00, the day starts at 6:00, the rowHeight is 30
          height: (22 - 15) * 30,
        })
      )
    })
    it('Place event when only its end is in the day', () => {
      const startDayEvents = placeEvents(ee, nodes, events, 30, startHour, endHour, endDay)
      expect(startDayEvents[0].style).toEqual(
        expect.objectContaining({
          top: 0,
          height: (14 - 6) * 30, // end of day is 6:00, event ends at 14:00
        })
      )
    })
    it('Place event when it starts before and ends after the current day ', () => {
      const startDayEvents = placeEvents(ee, nodes, events, 30, startHour, endHour, middleDay)
      expect(startDayEvents[0].style).toEqual(
        expect.objectContaining({
          top: 0,
          height: (22 - 6) * 30, // end of day is 6:00, event ends at 14:00
        })
      )
    })
  })

  test('Full test', () => {
    const startHour = 'PT06H'
    const endHour = 'PT23H'
    const ee = [0, 2]
    const day = new Date(2017, 9, 7, 3, 0, 0)
    const nodes = [
      {type: 'normal', level: 0, children: [1], depth: 2},
      {type: 'normal', level: 1, children: [], depth: 2},
      {type: 'normal', level: 0, children: [3, 4], depth: 2},
      {type: 'normal', level: 1, children: [], depth: 2},
      {type: 'normal', level: 1, children: [], depth: 2},
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
    const res = placeEvents(ee, nodes, events, 30, startHour, endHour, day)
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
})
