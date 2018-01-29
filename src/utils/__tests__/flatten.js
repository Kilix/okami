import {flatten} from '../flatten'

test('flatten', () => {
  const start = [1, [2, 3], [4]]
  const exptected = [1, 2, 3, 4]
  expect(flatten(start)).toEqual(exptected)
})
