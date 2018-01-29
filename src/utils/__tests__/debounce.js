import {debounce} from '../debounce'

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
