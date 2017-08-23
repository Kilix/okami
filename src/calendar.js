import React, {Component} from 'react'
import PropTypes from 'prop-types'

const days = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}
class CalendarSync extends Component {
  constructor(props) {
    const {workHours, AMPM, dateFormat, hourFormat, startingDay, data} = props
    super(props)
    this.state = {
      workHours,
      AMPM,
      dateFormat,
      hourFormat,
      startingDay: days[startingDay],
      data,
    }
  }

  getChildContext() {
    const {
      workHours,
      AMPM,
      dateFormat,
      hourFormat,
      startingDay,
      data,
    } = this.state
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
    const {className, style, children} = this.props
    return children
  }
}

CalendarSync.defaultProps = {
  workHours: {start: '06:00', end: '22:00'},
  AMPM: false,
  dateFormat: 'DD/MM/YYYY',
  hourFormat: 'HH:mm',
  startingDay: 'sunday',
  data: [],
}

CalendarSync.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
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
