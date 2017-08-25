import React, {Component} from 'react'
import PropTypes from 'prop-types'
import enLocale from 'date-fns/locale/en-US'

import {days} from './utils'

class CalendarSync extends Component {
  constructor(props) {
    const {startingDay} = props
    super(props)
    this.state = {startingDay: days[startingDay]}
  }

  getChildContext() {
    const {startingDay} = this.state
    const {workHours, dateFormat, hourFormat, locale, data} = this.props
    return {
      workHours,
      startingDay,
      dateFormat,
      hourFormat,
      locale,
      data,
    }
  }

  render() {
    const {children} = this.props
    return children
  }
}

CalendarSync.defaultProps = {
  workHours: {start: 'PT6H', end: 'PT22H'},
  dateFormat: 'DD/MM/YYYY',
  hourFormat: 'HH:mm',
  startingDay: 'sunday',
  locale: enLocale,
  data: [],
}

CalendarSync.childContextTypes = {
  workHours: PropTypes.object,
  startingDay: PropTypes.number,
  dateFormat: PropTypes.string,
  hourFormat: PropTypes.string,
  locale: PropTypes.object,
  data: PropTypes.array,
}

export default CalendarSync
