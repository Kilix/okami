import {checkPartialBounds} from '../checkPartialBounds'

describe('checkPartialBounds', () => {
  const int = {start: new Date(2017, 9, 12, 12, 0, 0), end: new Date(2017, 9, 14, 22, 0, 0)}
  test('should accept an event inside the interval', () => {
    const event = {start: new Date(2017, 9, 13, 11, 23, 0), end: new Date(2017, 9, 13, 12, 23, 0)}
    expect(checkPartialBounds(int)(event)).toEqual(true)
  })
  test('should accept an event partially inside the interval', () => {
    const event = {start: new Date(2017, 9, 11, 0, 0, 0), end: new Date(2017, 9, 13, 12, 23, 0)}
    expect(checkPartialBounds(int)(event)).toEqual(true)
  })
  test('should refuse an event which does not intersect the interval', () => {
    const event = {start: new Date(2017, 9, 10, 0, 0, 0), end: new Date(2017, 9, 12, 11, 0, 0)}
    expect(checkPartialBounds(int)(event)).toEqual(false)
  })
})
