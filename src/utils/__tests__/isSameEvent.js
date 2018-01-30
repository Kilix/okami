import {isSameEvent} from '../isSameEvent'

describe('isSameEvent', () => {
  const event = {
    start: new Date(2017, 9, 7, 17, 0, 0),
    end: new Date(2017, 9, 7, 17, 30, 0),
  }
  const sameEvent = {
    start: new Date(2017, 9, 7, 17, 0, 0),
    end: new Date(2017, 9, 7, 17, 30, 0),
  }
  const otherEvent = {
    start: new Date(2017, 9, 7, 17, 0, 0),
    end: new Date(2017, 9, 7, 18, 0, 0),
  }
  test('requires same start and same end', () => {
    expect(isSameEvent(event, sameEvent)).toBe(true)
  })
  test('Does not allow a different end', () => {
    expect(isSameEvent(event, otherEvent)).toBe(false)
  })
})
