import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'

import {asHours} from 'pomeranian-durations'

import startOfMonth from 'date-fns/fp/startOfMonthWithOptions'
import startOfWeek from 'date-fns/fp/startOfWeekWithOptions'
import differenceInCalendarDays from 'date-fns/fp/differenceInCalendarDays'
import getDaysInMonth from 'date-fns/getDaysInMonth'
import startOfDay from 'date-fns/fp/startOfDay'
import subMonths from 'date-fns/fp/subMonths'
import addMonths from 'date-fns/fp/addMonths'
import addDays from 'date-fns/fp/addDays'
import addHours from 'date-fns/fp/addHours'
import format from 'date-fns/fp/formatWithOptions'
import isSameDay from 'date-fns/fp/isSameDay'
import isAfter from 'date-fns/fp/isAfter'
import getDay from 'date-fns/getDay'

import controller from '../controller'
import {debounce, range, shiftLeft} from '../utils'

class MonthlyCalendar extends React.Component {
  componentWillMount() {
    const {start, startingDay} = this.props
    this.setState(() => ({
      startMonth: startOfMonth({weekStartsOn: startingDay}, start),
    }))
  }
  resize = debounce(() => this.forceUpdate(), 300, true)
  componentDidMount() {
    window.addEventListener('resize', this.resize)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }
  _nextMonth = () =>
    this.setState(old => ({
      startMonth: addMonths(1, old.startMonth),
    }))
  _prevMonth = () =>
    this.setState(old => ({
      startMonth: subMonths(1, old.startMonth),
    }))
  _gotoToday = () =>
    this.setState(() => ({
      startMonth: startOfMonth(
        {weekStartsOn: this.props.startingDay},
        new Date()
      ),
    }))
  _getTodaysEvent = day =>
    this.props.data.filter(e => isSameDay(day, e.start)).map(
      e =>
        e.end === '*'
          ? {
              ...e,
              start: addHours(
                asHours(this.props.startHour),
                startOfDay(e.start)
              ),
              end: addHours(asHours(this.props.endHour), startOfDay(e.start)),
            }
          : e
    )
  _computeEvents = day => {
    const {Event} = this.props
    const events = this._getTodaysEvent(day)
    events.sort((a, b) => (isAfter(a.start, b.start) ? -1 : 1))

    return events.map(e => <Event key={e.title} event={e} style={e.style} />)
  }
  _dateLabel = startMonth =>
    format({locale: this.props.locale}, 'MMMM', startMonth)
  render() {
    const {dateFormat, rowHeight, startingDay, children} = this.props
    const {startMonth} = this.state
    const weeks = range(7)
    const endMonth = compose(addMonths(1), startOfDay)(startMonth)
    const numberOfDaysBeforeMonth = differenceInCalendarDays(
      startOfWeek({weekStartsOn: startingDay}, startMonth),
      startMonth
    )
    const month = range(-numberOfDaysBeforeMonth, getDaysInMonth(startMonth))
    const props = {
      rowHeight,
      end: endMonth,
      start: startMonth,
      weeks,
      nextMonth: this._nextMonth,
      prevMonth: this._prevMonth,
      gotoToday: this._gotoToday,
      dateLabel: this._dateLabel(startMonth),
      dayLabels: weeks.map((d, idx) => ({
        key: `label_day_${idx}`,
        label: compose(
          format({locale: this.props.locale}, 'dddd'),
          addDays(d),
          startOfWeek({weekStartsOn: startingDay})
        )(new Date()),
        idx,
        rowHeight,
      })),
      columnProps: {
        innerRef: r => {
          if (typeof this.column === 'undefined') {
            this.column = r
            this.forceUpdate()
          }
        },
      },
      calendar: shiftLeft(startingDay, weeks).reduce((days, w) => {
        return [
          ...days,
          month.filter(m => getDay(addDays(m, startMonth)) === w).map(m => {
            const day = addDays(m, startMonth)
            return {
              date: day,
              label: format({locale: this.props.locale}, dateFormat, day),
              events: this._computeEvents(day),
            }
          }),
        ]
      }, []),
    }

    return children(props)
  }
}

MonthlyCalendar.defaultProps = {
  rowHeight: 30,
  start: new Date(),
}

MonthlyCalendar.PropTypes = {
  rowHeight: PropTypes.number,
  start: PropTypes.instanceOf(Date),
  data: PropTypes.object.isRequired,
  locale: PropTypes.object,
  Event: PropTypes.node,
}

const enhance = controller([
  'data',
  'locale',
  'startingDay',
  'dateFormat',
  'hourFormat',
])
export default enhance(MonthlyCalendar)
