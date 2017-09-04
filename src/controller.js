import React from 'react'
import PropTypes from 'prop-types'
import {compose, getContext} from 'recompose'

const defaultContext = [
  'locale',
  'startingDay',
  'data',
  'dateFormat',
  'hourFormat',
  'startHour',
  'endHour',
  'offset',
  'type',
  'rowHeight',
]
export default (p = defaultContext) => {
  const pp = p.reduce((acc, val) => ({...acc, [val]: PropTypes.any}), {})
  return BaseComponent =>
    class BD extends React.Component {
      static contextTypes = {
        startingDay: PropTypes.number,
        dateFormat: PropTypes.string,
        hourFormat: PropTypes.string,
        startHour: PropTypes.string,
        endHour: PropTypes.string,
        locale: PropTypes.object,
        data: PropTypes.array,
        offset: PropTypes.array,
        type: PropTypes.string,
        rowHeight: PropTypes.number,
      }
      render() {
        const ppa = Object.keys(this.context)
          .filter(k => p.indexOf(k) !== -1)
          .reduce((a, k) => ({...a, [k]: this.context[k]}), {})
        return <BaseComponent {...ppa} {...this.props} />
      }
    }
}
