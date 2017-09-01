import React from 'react'
import PropTypes from 'prop-types'
import {compose, getContext} from 'recompose'

const defaultContext = ['workHours', 'locale', 'startingDay', 'data', 'dateFormat', 'hourFormat']
export default (p = defaultContext) => {
  const pp = p.reduce((acc, val) => ({...acc, [val]: PropTypes.any}), {})
  return BaseComponent =>
    class BD extends React.Component {
      static contextTypes = {
        workHours: PropTypes.object,
        startingDay: PropTypes.number,
        dateFormat: PropTypes.string,
        hourFormat: PropTypes.string,
        locale: PropTypes.object,
        data: PropTypes.array,
      }
      render() {
        const ppa = Object.keys(this.context)
          .filter(k => p.indexOf(k) !== -1)
          .reduce((a, k) => ({...a, [k]: this.context[k]}), {})
        return <BaseComponent {...ppa} {...this.props} />
      }
    }
}
