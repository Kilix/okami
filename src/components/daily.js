import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'

import {asHours} from 'pomeranian-durations'

import startOfDay from 'date-fns/fp/startOfDay'
import subDays from 'date-fns/fp/subDays'
import addDays from 'date-fns/fp/addDays'
import addHours from 'date-fns/fp/addHours'
import format from 'date-fns/fp/formatWithOptions'
import isSameDay from 'date-fns/fp/isSameDay'
import isWithinInterval from 'date-fns/fp/isWithinInterval'
import isAfter from 'date-fns/fp/isAfter'

import controller from '../controller'
import {debounce, range, placeEvents, computeNow} from '../utils'

class DailyCalendar extends React.Component {
  componentWillMount() {
    const {start} = this.props
    this.setState(() => ({currentDay: startOfDay(start)}))
  }
  resize = debounce(() => this.forceUpdate(), 300, true)
  componentDidMount() {
    window.addEventListener('resize', this.resize)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }
  _nextDay = () =>
    this.setState(old => ({currentDay: addDays(1, old.currentDay)}))
  _prevDay = () =>
    this.setState(old => ({currentDay: subDays(1, old.currentDay)}))
  _gotoToday = () => this.setState(() => ({currentDay: startOfDay(new Date())}))

  _getTodaysEvent = day => {
    const base = this.props.data.filter(
      e =>
        isSameDay(day, e.start) &&
        isWithinInterval(
          {
            start: addHours(asHours(this.props.startHour), startOfDay(e.start)),
            end: addHours(asHours(this.props.endHour), startOfDay(e.start)),
          },
          e.start
        )
    )
    const fullDay = base.filter(e => e.end === '*').map(e => ({
      ...e,
      start: addHours(asHours(this.props.startHour), startOfDay(e.start)),
      end: addHours(asHours(this.props.endHour), startOfDay(e.start)),
    }))
    const events = base.filter(e => e.end !== '*')
    return {
      fullDay,
      events,
    }
  }
  _computeEvents = day => {
    if (!this.column) return {events: [], fullDay: []}
    const {startHour, rowHeight} = this.props
    const wrapper = this.column.getBoundingClientRect()
    const {fullDay, events: todayEvents} = this._getTodaysEvent(day)

    const fullDayEvents = fullDay.map((e, idx) => ({
      key: e.title,
      event: e,
    }))

    let events = todayEvents
    events.sort((a, b) => (isAfter(a.start, b.start) ? -1 : 1))
    events = placeEvents(events, wrapper, rowHeight, startHour)

    return {fullDay: fullDayEvents, events}
  }
  _computeNow = () => {
    if (!this.column) return {display: 'none'}
    const {startHour, endHour} = this.props
    const wrapper = this.column.getBoundingClientRect()
    return computeNow(wrapper, startHour, endHour)
  }
  _dateLabel = start =>
    format({locale: this.props.locale}, 'DD MMM YYYY', start)
  render() {
    const {
      startHour,
      endHour,
      dateFormat,
      hourFormat,
      rowHeight,
      children,
      showNow,
    } = this.props
    const {currentDay} = this.state
    const hours = range(asHours(startHour), asHours(endHour))
    const props = {
      rowHeight,
      start: currentDay,
      hours,
      nextDay: this._nextDay,
      prevDay: this._prevDay,
      gotoToday: this._gotoToday,
      dateLabel: this._dateLabel(currentDay),
      dayLabels: {
        label: format({locale: this.props.locale}, dateFormat, currentDay),
      },
      hourLabels: hours.map((h, idx) => ({
        label: compose(
          format({locale: this.props.locale}, hourFormat),
          addHours(h)
        )(currentDay),
        idx,
      })),
      columnProps: {
        style: {position: 'relative', height: rowHeight * hours.length},
        innerRef: r => {
          if (typeof this.column === 'undefined') {
            this.column = r
            this.forceUpdate()
          }
        },
      },
      ...(showNow && {
        showNowProps: {
          style: this._computeNow(),
          title: format({locale: this.props.locale}, 'hh:mm', new Date()),
        },
      }),
      calendar: {
        date: currentDay,
        label: format({locale: this.props.locale}, dateFormat, currentDay),
        events: this._computeEvents(currentDay),
      },
    }
    return children(props)
  }
}

DailyCalendar.defaultProps = {
  startHour: 'PT0H',
  endHour: 'PT24H',
  rowHeight: 30,
  start: new Date(),
  showNow: false,
}

DailyCalendar.PropTypes = {
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  rowHeight: PropTypes.number,
  start: PropTypes.instanceOf(Date),
  data: PropTypes.object.isRequired,
  locale: PropTypes.object,
  showNow: PropTypes.bool,
}

const enhance = controller(['data', 'locale', 'dateFormat', 'hourFormat'])
export default enhance(DailyCalendar)
