import {around} from '../around'

test('around', () => {
  expect(around(4.3)).toBe(4.5)
  expect(around(4.334)).toBe(4.5)
  expect(around(5.78)).toBe(6)
})
