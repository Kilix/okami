export function range(start, stop, step) {
  if (stop == null) {
    stop = start || 0
    start = 0
  }
  step = step || 1

  const length = Math.max(Math.ceil((stop - start) / step), 0)
  const range = Array(length)

  for (let idx = 0; idx < length; idx++, start += step) {
    range[idx] = start
  }
  return range
}
