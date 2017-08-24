import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {days} from './utils'

class CalendarSync extends Component {
  constructor(props) {
    const {startingDay} = props
    super(props)
    this.state = {startingDay: days[startingDay]}
  }

  getChildContext() {
    const {startingDay} = this.state
    const {workHours, AMPM, dateFormat, hourFormat, data} = this.props
    return {
      workHours,
      AMPM,
      startingDay,
      dateFormat,
      hourFormat,
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
  AMPM: false,
  dateFormat: 'DD/MM/YYYY',
  hourFormat: 'HH:mm',
  startingDay: 'sunday',
  data: [],
}

CalendarSync.childContextTypes = {
  workHours: PropTypes.object,
  AMPM: PropTypes.bool,
  startingDay: PropTypes.number,
  dateFormat: PropTypes.string,
  hourFormat: PropTypes.string,
  data: PropTypes.array,
}

export default CalendarSync
