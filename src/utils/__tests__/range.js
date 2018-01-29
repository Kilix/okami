import {range} from '../index'

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
