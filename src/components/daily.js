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
import {
  debounce,
  range,
  placeEvents,
  computeNow,
  getTodayEvents,
  getDayEvents,
} from '../utils'

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

  _computeEvents = day => {
    if (!this.column) return []
    const {startHour, endHour, data, rowHeight} = this.props
    const wrapper = this.column.getBoundingClientRect()

    let events = getTodayEvents(startHour, endHour, day, data)
    events.sort((a, b) => (isAfter(a.start, b.start) ? -1 : 1))
    events = placeEvents(events, wrapper, rowHeight, startHour, endHour)
    return events
  }
  _computeNow = () => {
    if (!this.column) return {display: 'none'}
    const {startHour, endHour} = this.props
    const wrapper = this.column.getBoundingClientRect()
    return computeNow(wrapper, startHour, endHour)
  }
  _computeDayEvents = () => {
    if (!this.dayEventsContainer) return []
    const wrapper = this.dayEventsContainer.getBoundingClientRect()
    const {data, rowHeight} = this.props
    const {currentDay} = this.state
    return getDayEvents(currentDay, data).map(e => {
      return {
        key: e.title,
        event: e,
        style: {
          left: 0,
          width: wrapper.width,
          height: rowHeight,
        },
      }
    })
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
    const dayEvents = this._computeDayEvents()

    const props = {
      hours,
      rowHeight,
      start: currentDay,
      nextDay: this._nextDay,
      prevDay: this._prevDay,
      gotoToday: this._gotoToday,
      dateLabel: this._dateLabel(currentDay),
      hourLabels: hours.map((h, idx) => ({
        label: compose(
          format({locale: this.props.locale}, hourFormat),
          addHours(h)
        )(currentDay),
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
      dayEventsContainerProps: {
        innerRef: r => {
          if (typeof this.dayEventsContainer === 'undefined') {
            this.dayEventsContainer = r
            this.forceUpdate()
          }
        },
      },
      dayEvents,
      calendar: {
        date: currentDay,
        label: format({locale: this.props.locale}, dateFormat, currentDay),
        events: this._computeEvents(currentDay),
      },
      ...(showNow &&
      isSameDay(new Date(), currentDay) && {
        showNowProps: {
          style: this._computeNow(),
          title: format({locale: this.props.locale}, 'hh:mm', new Date()),
        },
      }),
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
