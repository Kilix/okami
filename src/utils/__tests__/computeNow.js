import {computeNow} from '../computeNow'

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
