import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'

import {asHours} from 'pomeranian-durations'

import setHours from 'date-fns/fp/setHours'
import startOfDay from 'date-fns/fp/startOfDay'
import subDays from 'date-fns/fp/subDays'
import addDays from 'date-fns/fp/addDays'
import addHours from 'date-fns/fp/addHours'
import format from 'date-fns/fp/formatWithOptions'
import isSameDay from 'date-fns/fp/isSameDay'
import isAfter from 'date-fns/fp/isAfter'
import getDay from 'date-fns/getDay'
import differenceInHours from 'date-fns/differenceInHours'

import controller from '../controller'
import {
  debounce,
  range,
  placeEvents,
  computeNow,
  getTodayEvents,
  getDayEvents,
  checkBound,
} from '../utils'

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
    const {startHour, endHour} = this.props
    return {
      type: 'daily',
      startHour,
      endHour,
      nextDay: this._nextDay,
      prevDay: this._prevDay,
      gotoToday: this._gotoToday,
      dateLabel: this._dateLabel,
      currentDay: this.state.currentDay,
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
  resize = debounce(() => this.forceUpdate(), 100, false)

  _computeEvents = day => {
    const {startHour, endHour, events, nodes, rowHeight} = this.props
    const ee = events.reduce(
      (acc, e, i) =>
        checkBound(day, {
          start: setHours(asHours(startHour), day),
          end: setHours(asHours(endHour), day),
        })(e)
          ? [...acc, i]
          : acc,
      []
    )
    if (this.column) {
      const wrapper = this.column.getBoundingClientRect()
      return placeEvents(ee, nodes, events, wrapper, rowHeight, startHour, endHour)
    } else {
      return ee.map(e => ({key: e, event: events[e]}))
    }
  }
  _simpleCompute = () => {
    const {startHour, endHour, events, matrix, rowHeight} = this.props
    const {currentDay} = this.state
    const d = getDay(currentDay)
    const o = matrix[d] * rowHeight
    let ee = getTodayEvents(startHour, endHour, currentDay, events)
    ee = ee.sort((a, b) => {
      const anbDays = a.end ? Math.floor(differenceInHours(a.end, a.start) / 24) + 1 : 1
      const bnbDays = b.end ? Math.floor(differenceInHours(b.end, b.start) / 24) + 1 : 1
      if (anbDays > bnbDays) return -1
      else if (anbDays < bnbDays) return 1
      else return 0
    })

    return ee.map(e => {
      return {
        key: e.id,
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
    const {fevents, rowHeight} = this.props
    const {currentDay} = this.state
    this.setState(() => ({
      dayEvents: getDayEvents(currentDay, fevents).map(e => {
        return {
          key: e.id,
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
      dateLabel: this._dateLabel,
      getColumnProps: ({refKey = 'ref'}) => ({
        [refKey]: r => {
          if (typeof this.column === 'undefined') {
            this.column = r
            this.forceUpdate()
          }
        },
      }),
      dayEvents,
      calendar: {
        label: format({locale: this.props.locale}, dateFormat, currentDay),
        events: type !== 'monthly' ? this._computeEvents(currentDay) : this._simpleCompute(),
      },
      showNowProps,
    }
    return children(props)
  }
}
DailyCalendar.childContextTypes = {
  type: PropTypes.string,
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  nextDay: PropTypes.func,
  prevDay: PropTypes.func,
  gotoToday: PropTypes.func,
  dateLabel: PropTypes.func,
  currentDay: PropTypes.instanceOf(Date),
}

DailyCalendar.defaultProps = {
  startHour: 'PT0H',
  endHour: 'PT24H',
  rowHeight: 30,
  start: new Date(),
  showNow: false,
  matrix: [0, 0, 0, 0, 0, 0, 0],
  offset: 0,
  type: 'daily',
}

DailyCalendar.PropTypes = {
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  rowHeight: PropTypes.number,
  start: PropTypes.instanceOf(Date),
  events: PropTypes.array.isRequired,
  fevents: PropTypes.array.isRequired,
  nodes: PropTypes.object.isRequired,
  locale: PropTypes.object,
  showNow: PropTypes.bool,
}

const enhance = controller([
  'events',
  'fevents',
  'nodes',
  'locale',
  'dateFormat',
  'hourFormat',
  'matrix',
  'type',
  'startHour',
  'endHour',
  'rowHeight',
])
export default enhance(DailyCalendar)
