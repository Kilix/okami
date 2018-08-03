// @flow
import PropTypes from 'prop-types'

export const datePropType = PropTypes.oneOfType([
  PropTypes.instanceOf(Date),
  PropTypes.number,
  PropTypes.string,
])
