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
    const {dateFormat, hourFormat, locale, data, startHour, endHour} = this.props
    return {
      startingDay,
      dateFormat,
      hourFormat,
      locale,
      data,
      startHour,
      endHour,
    }
  }

  render() {
    const {children} = this.props
    return children
  }
}

CalendarSync.defaultProps = {
  startHour: 'PT0H',
  endHour: 'PT24H',
  dateFormat: 'DD/MM/YYYY',
  hourFormat: 'HH:mm',
  startingDay: 'sunday',
  locale: enLocale,
  data: [],
}

CalendarSync.childContextTypes = {
  startingDay: PropTypes.number,
  dateFormat: PropTypes.string,
  hourFormat: PropTypes.string,
  locale: PropTypes.object,
  data: PropTypes.array,
  startHour: PropTypes.string,
  endHour: PropTypes.string,
}

export default CalendarSync
