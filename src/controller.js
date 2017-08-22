import PropTypes from 'prop-types'
import { compose, getContext } from 'recompose'

const defaultContext = [
  'workHours',
  'AMPM',
  'startingDay',
  'data',
  'dateFormat',
]
export default (p = defaultContext) => {
  const pp = p.reduce((acc, val) => ({ ...acc, [val]: PropTypes.any }), {})
  return compose(getContext(pp))
}
