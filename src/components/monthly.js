import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'

import startOfMonth from 'date-fns/fp/startOfMonthWithOptions'
import startOfWeek from 'date-fns/fp/startOfWeekWithOptions'
import startOfDay from 'date-fns/fp/startOfDay'
import subMonths from 'date-fns/fp/subMonths'
import addMonths from 'date-fns/fp/addMonths'
import addDays from 'date-fns/fp/addDays'
import addWeeks from 'date-fns/fp/addWeeks'
import format from 'date-fns/fp/formatWithOptions'
import getMonth from 'date-fns/getMonth'

import controller from '../controller'
import DaysLabels from './daysLabels'
import {debounce, range} from '../utils'

class MonthlyCalendar extends React.Component {
  componentWillMount() {
    const {start, startingDay} = this.props
    this.setState(() => ({startMonth: startOfMonth({weekStartsOn: startingDay}, start)}))
  }
  componentDidMount = () => window.addEventListener('resize', this.resize)
  componentWillUnmount = () => window.removeEventListener('resize', this.resize)
  getChildContext() {
    return {
      type: 'monthly',
      startingDay: this.props.startingDay,
      dateFormat: this.props.dateFormat,
      hourFormat: this.props.hourFormat,
    }
  }
  _nextMonth = () => this.setState(old => ({startMonth: addMonths(1, old.startMonth)}))
  _prevMonth = () => this.setState(old => ({startMonth: subMonths(1, old.startMonth)}))
  _gotoToday = () =>
    this.setState(() => ({
      startMonth: startOfMonth({weekStartsOn: this.props.startingDay}, new Date()),
    }))
  _dateLabel = startMonth => format({locale: this.props.locale}, 'MMMM', startMonth)
  resize = debounce(() => this.forceUpdate(), 300, true)

  render() {
    const {rowHeight, startingDay, children} = this.props
    const {startMonth} = this.state
    const weeks = range(7)
    const endMonth = compose(addMonths(1), startOfDay)(startMonth)
    const startWeek = startOfWeek({weekStartsOn: startingDay}, startMonth)
    let s = startWeek
    let month = [s]
    const monthNb = getMonth(startMonth)
    while (true) {
      s = addWeeks(1, s)
      if (getMonth(s) !== monthNb) break
      month.push(s)
    }
    const props = {
      weeks,
      rowHeight,
      end: endMonth,
      start: startMonth,
      nextMonth: this._nextMonth,
      prevMonth: this._prevMonth,
      gotoToday: this._gotoToday,
      dateLabel: this._dateLabel(startMonth),
      DaysLabels: props => (
        <DaysLabels rowHeight={rowHeight} weeks={weeks} start={startWeek} {...props} />
      ),
      calendar: month,
    }

    return children(props)
  }
}

MonthlyCalendar.childContextTypes = {
  type: PropTypes.string,
  dateFormat: PropTypes.string,
  hourFormat: PropTypes.string,
  startingDay: PropTypes.string,
}
MonthlyCalendar.defaultProps = {
  rowHeight: 30,
  start: new Date(),
  type: 'monthly',
}

MonthlyCalendar.PropTypes = {
  rowHeight: PropTypes.number,
  start: PropTypes.instanceOf(Date),
  data: PropTypes.object.isRequired,
  locale: PropTypes.object,
  type: PropTypes.string,
}

const enhance = controller(['data', 'locale', 'startingDay', 'dateFormat', 'hourFormat', 'type'])
export default enhance(MonthlyCalendar)
