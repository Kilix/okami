import {checkBound} from '../checkBound'

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
