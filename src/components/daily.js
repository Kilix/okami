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
import isAfter from 'date-fns/fp/isAfter'
import getDay from 'date-fns/getDay'

import controller from '../controller'
import {debounce, range, placeEvents, computeNow, getTodayEvents, getDayEvents} from '../utils'

class DailyCalendar extends React.Component {
  state = {
    currentDay: undefined,
    dayEvents: [],
  }
  componentWillMount = () => this.setState(() => ({currentDay: startOfDay(this.props.start)}))
  componentWillReceiveProps(props) {
    this.setState(() => ({currentDay: startOfDay(props.start)}), () => this._computeDayEvents())
  }
  componentDidMount() {
    this._computeDayEvents()
    window.addEventListener('resize', this.resize)
  }
  componentWillUnmount = () => window.removeEventListener('resize', this.resize)
  getChildContext() {
    return {
      type: 'daily',
      nextDay: this._nextDay,
      prevDay: this._prevDay,
      gotoToday: this._gotoToday,
      dateLabel: this._dateLabel,
    }
  }
  _nextDay = () => {
    this.setState(old => ({currentDay: addDays(1, old.currentDay)}), () => this._computeDayEvents())
  }
  _prevDay = () => {
    this.setState(old => ({currentDay: subDays(1, old.currentDay)}), () => this._computeDayEvents())
  }
  _gotoToday = () => {
    this.setState(() => ({currentDay: startOfDay(new Date())}), () => this._computeDayEvents())
  }
  resize = debounce(() => this.forceUpdate(), 300, true)

  _computeEvents = day => {
    if (!this.column) return []
    const {startHour, endHour, data, rowHeight} = this.props
    const wrapper = this.column.getBoundingClientRect()

    let events = getTodayEvents(startHour, endHour, day, data)
    events.sort((a, b) => (isAfter(a.start, b.start) ? -1 : 1))
    events = placeEvents(events, wrapper, rowHeight, startHour, endHour)
    return events
  }
  _simpleCompute = day => {
    const {startHour, endHour, data, offset, rowHeight} = this.props
    const d = getDay(this.state.currentDay)
    const o = offset[d] * rowHeight

    let events = getTodayEvents(startHour, endHour, day, data)
    events.sort((a, b) => (isAfter(a.start, b.start) ? -1 : 1))
    return events.map(e => {
      return {
        key: e.title,
        style: {
          position: 'relative',
          top: o,
          height: rowHeight,
        },
        event: e,
      }
    })
  }
  _computeNow = () => {
    if (!this.column) return {display: 'none'}
    const {startHour, endHour, rowHeight} = this.props
    const wrapper = this.column.getBoundingClientRect()
    return computeNow(wrapper, startHour, endHour)
  }
  _computeDayEvents = () => {
    const {data, rowHeight} = this.props
    const {currentDay} = this.state
    this.setState(() => ({
      dayEvents: getDayEvents(currentDay, data).map(e => {
        return {
          key: e.title,
          event: e,
          style: {height: rowHeight},
        }
      }),
    }))
  }
  _dateLabel = dateFormat =>
    format(
      {locale: this.props.locale},
      dateFormat ? dateFormat : this.props.dateFormat,
      this.state.currentDay
    )
  render() {
    const {
      startHour,
      endHour,
      dateFormat,
      hourFormat,
      rowHeight,
      children,
      showNow,
      type,
    } = this.props
    const {currentDay, dayEvents} = this.state
    const hours = range(asHours(startHour), asHours(endHour))
    const showNowProps =
      showNow && isSameDay(new Date(), currentDay)
        ? {
            style: this._computeNow(),
            title: format({locale: this.props.locale}, 'hh:mm', new Date()),
          }
        : {style: {display: 'none'}}
    const props = {
      hours,
      rowHeight,
      start: currentDay,
      nextDay: this._nextDay,
      prevDay: this._prevDay,
      gotoToday: this._gotoToday,
      dateLabel: this._dateLabel(),
      hourLabels: hours.map((h, idx) => ({
        label: compose(format({locale: this.props.locale}, hourFormat), addHours(h))(currentDay),
        idx,
      })),
      columnProps: {
        innerRef: r => {
          if (typeof this.column === 'undefined') {
            this.column = r
            this.forceUpdate()
          }
        },
      },
      dayEvents,
      calendar: {
        date: currentDay,
        label: format({locale: this.props.locale}, dateFormat, currentDay),
        events:
          type !== 'monthly' ? this._computeEvents(currentDay) : this._simpleCompute(currentDay),
      },
      showNowProps,
    }
    return children(props)
  }
}
DailyCalendar.childContextTypes = {
  type: PropTypes.string,
  nextDay: PropTypes.func,
  prevDay: PropTypes.func,
  gotoToday: PropTypes.func,
  dateLabel: PropTypes.func,
}

DailyCalendar.defaultProps = {
  startHour: 'PT0H',
  endHour: 'PT24H',
  rowHeight: 30,
  start: new Date(),
  showNow: false,
  offset: [0, 0, 0, 0, 0, 0, 0],
  type: 'daily',
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

const enhance = controller([
  'data',
  'locale',
  'dateFormat',
  'hourFormat',
  'offset',
  'type',
  'startHour',
  'endHour',
  'rowHeight',
])
export default enhance(DailyCalendar)
