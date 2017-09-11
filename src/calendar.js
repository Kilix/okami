import React, {Component} from 'react'
import PropTypes from 'prop-types'
import enLocale from 'date-fns/locale/en-US'

const days = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

class Calendar extends Component {
  constructor(props) {
    const {startingDay} = props
    super(props)
    this.state = {startingDay: days[startingDay], showWeekend: props.showWeekend}
  }

  _toggleWeekend = (force = null) => {
    this.setState(old => ({showWeekend: force !== null ? force : !old.showWeekend}))
  }

  getChildContext() {
    const {startingDay, showWeekend} = this.state
    const {dateFormat, hourFormat, locale, data, startHour, endHour, rowHeight} = this.props
    return {
      startingDay,
      dateFormat,
      hourFormat,
      locale,
      data,
      startHour,
      rowHeight,
      endHour,
      showWeekend,
      toggleWeekend: this._toggleWeekend,
    }
  }

  render() {
    const {children} = this.props
    return children
  }
}

Calendar.PropTypes = {
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  dateFormat: PropTypes.string,
  hourFormat: PropTypes.string,
  startingDay: PropTypes.string,
  locale: PropTypes.object,
  rowHeight: PropTypes.number,
  showWeekend: PropTypes.bool,
  data: PropTypes.array.isRequired,
}

Calendar.defaultProps = {
  startHour: 'PT0H',
  endHour: 'PT24H',
  dateFormat: 'DD/MM/YYYY',
  hourFormat: 'HH:mm',
  startingDay: 'sunday',
  locale: enLocale,
  rowHeight: 30,
  showWeekend: true,
  data: [],
}

Calendar.childContextTypes = {
  startingDay: PropTypes.number,
  dateFormat: PropTypes.string,
  hourFormat: PropTypes.string,
  locale: PropTypes.object,
  data: PropTypes.array,
  startHour: PropTypes.string,
  rowHeight: PropTypes.number,
  endHour: PropTypes.string,
  showWeekend: PropTypes.bool,
  toggleWeekend: PropTypes.func,
}

export default Calendar
