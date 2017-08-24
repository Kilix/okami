import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'

import {asHours} from 'pomeranian-durations'

import startOfMonth from 'date-fns/fp/startOfMonthWithOptions'
import startOfWeek from 'date-fns/fp/startOfWeekWithOptions'
import getDaysInMonth from 'date-fns/getDaysInMonth'
import startOfDay from 'date-fns/fp/startOfDay'
import subMonths from 'date-fns/fp/subMonths'
import addMonths from 'date-fns/fp/addMonths'
import addDays from 'date-fns/fp/addDays'
import addHours from 'date-fns/fp/addHours'
import format from 'date-fns/fp/format'
import isSameDay from 'date-fns/fp/isSameDay'

import isAfter from 'date-fns/fp/isAfter'

import controller from '../controller'
import {debounce, range, days} from '../utils'

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
  _dateLabel = startMonth => format('MMMM', startMonth)
  render() {
    const {dateFormat, rowHeight, Cell, startingDay, children} = this.props
    const {startMonth} = this.state
    const weeks = range(7)
    const endMonth = compose(addMonths(1), startOfDay)(startMonth)
    const month = range(getDaysInMonth(startMonth))
    const props = {
      rowHeight,
      end: endMonth,
      start: startMonth,
      nextMonth: this._nextMonth,
      prevMonth: this._prevMonth,
      gotoToday: this._gotoToday,
      getDateLabel: El => <El label={this._dateLabel(startMonth)} />,
      getDayLabels: El =>
        weeks.map((d, idx) =>
          <El
            style={{height: rowHeight}}
            key={`label_day_${idx}`}
            label={compose(
              format(dateFormat),
              addDays(d),
              startOfWeek({weekStartsOn: startingDay})
            )(new Date())}
            idx={idx}
          />
        ),
      calendar: month.reduce((c, d) => {
        const day = addDays(d, startMonth)
        return [
          ...c,
          {
            day,
            label: format(dateFormat, day),
            getEvents: () =>
              <Cell>
                {format(dateFormat, day)}
                {this._computeEvents(day)}
              </Cell>,
          },
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
  Cell: PropTypes.node,
  Event: PropTypes.node,
}

const enhance = controller(['data', 'startingDay', 'dateFormat', 'hourFormat'])
export default enhance(MonthlyCalendar)
