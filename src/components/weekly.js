import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'

import {asHours} from 'pomeranian-durations'

import startOfWeek from 'date-fns/fp/startOfWeekWithOptions'
import getMonth from 'date-fns/fp/getMonth'
import startOfDay from 'date-fns/fp/startOfDay'
import subWeeks from 'date-fns/fp/subWeeks'
import addWeeks from 'date-fns/fp/addWeeks'
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
  getWeekEvents,
} from '../utils'

class WeeklyCalendar extends React.Component {
  componentWillMount() {
    const {start, startingDay} = this.props
    this.setState(() => ({
      startWeek: startOfWeek({weekStartsOn: startingDay}, start),
      showWeekend: this.props.showWeekend,
    }))
  }
  resize = debounce(() => this.forceUpdate(), 300, true)
  componentDidMount() {
    window.addEventListener('resize', this.resize)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }
  _toggleWeekend = (force = null) =>
    this.setState(
      old => ({
        showWeekend: force === null ? !old.showWeekend : force,
      }),
      () => this.forceUpdate()
    )
  _nextWeek = () =>
    this.setState(old => ({
      startWeek: addWeeks(1, old.startWeek),
    }))
  _prevWeek = () =>
    this.setState(old => ({
      startWeek: subWeeks(1, old.startWeek),
    }))
  _gotoToday = () =>
    this.setState(() => ({
      startWeek: startOfWeek(
        {weekStartsOn: this.props.startingDay},
        new Date()
      ),
    }))
  _computeEvents = day => {
    if (!this.column) return []
    const {startHour, endHour, data, rowHeight} = this.props
    const wrapper = this.column.getBoundingClientRect()
    let events = getTodayEvents(startHour, endHour, day, data)

    events.sort((a, b) => (isAfter(a.start, b.start) ? -1 : 1))
    events = placeEvents(events, wrapper, rowHeight, startHour, endHour)

    return events
  }
  _computeWeekEvents = () => {
    if (!this.weekEventsContainer) return []
    const wrapper = this.weekEventsContainer.getBoundingClientRect()
    const {data, rowHeight} = this.props
    const {startWeek, showWeekend} = this.state
    return getWeekEvents(startWeek, data).map(e => {
      const nbDays = getDay(e.end) - getDay(e.start)
      const diffDay = getDay(e.start) - getDay(startWeek)
      const w = wrapper.width / (showWeekend ? 7 : 5)
      return {
        key: e.title,
        event: e,
        style: {
          left: diffDay * w,
          width: e.allDay ? w : nbDays * w,
          height: rowHeight,
        },
      }
    })
  }
  _computeNow = () => {
    if (!this.column) return {display: 'none'}
    const {startHour, endHour} = this.props
    const wrapper = this.column.getBoundingClientRect()
    return computeNow(wrapper, startHour, endHour)
  }

  _dateLabel = (start, end) => {
    const s =
      getMonth(start) === getMonth(end)
        ? format({locale: this.props.locale}, 'DD', start)
        : format({locale: this.props.locale}, 'DD MMM', start)
    const e = format({locale: this.props.locale}, 'DD MMM YYYY', end)
    return `${s} - ${e}`
  }
  render() {
    const {
      startHour,
      endHour,
      dateFormat,
      hourFormat,
      rowHeight,
      showNow,
      children,
    } = this.props
    const {startWeek, showWeekend} = this.state
    const weeks = showWeekend ? range(7) : range(5)
    const hours = range(asHours(startHour), asHours(endHour))
    const endWeek = compose(addWeeks(1), startOfDay)(startWeek)
    const weekEvents = this._computeWeekEvents()
    console.log(weekEvents)
    const props = {
      hours,
      rowHeight,
      end: endWeek,
      start: startWeek,
      nextWeek: this._nextWeek,
      prevWeek: this._prevWeek,
      gotoToday: this._gotoToday,
      toggleWeekend: this._toggleWeekend,
      dateLabel: this._dateLabel(startWeek, endWeek),
      dayLabels: weeks.map((d, idx) => ({
        label: compose(
          format({locale: this.props.locale}, dateFormat),
          addDays(d)
        )(startWeek),
        idx,
      })),
      hourLabels: hours.map((h, idx) => ({
        label: compose(
          format({locale: this.props.locale}, hourFormat),
          addHours(h)
        )(startWeek),
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
      weekEventsContainerProps: {
        innerRef: r => {
          if (typeof this.weekEventsContainer === 'undefined') {
            this.weekEventsContainer = r
            this.forceUpdate()
          }
        },
      },
      weekEvents,
      calendar: weeks.reduce((days, w) => {
        const day = addDays(w, startWeek)
        return [
          ...days,
          {
            date: day,
            label: format({locale: this.props.locale}, dateFormat, day),
            // fullDay: this._computeFullDayEvents(day),
            events: this._computeEvents(day),
            ...(showNow &&
            isSameDay(day, new Date()) && {
              showNowProps: {
                style: this._computeNow(),
                title: format({locale: this.props.locale}, 'hh:mm', new Date()),
              },
            }),
          },
        ]
      }, []),
    }

    return children(props)
  }
}

WeeklyCalendar.defaultProps = {
  startHour: 'PT0H',
  endHour: 'PT24H',
  rowHeight: 30,
  showWeekend: true,
  start: new Date(),
  showNow: false,
}

WeeklyCalendar.PropTypes = {
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  showWeekend: PropTypes.bool,
  rowHeight: PropTypes.number,
  start: PropTypes.instanceOf(Date),
  locale: PropTypes.object,
  data: PropTypes.object.isRequired,
  showNow: PropTypes.bool,
}

const enhance = controller([
  'data',
  'locale',
  'startingDay',
  'dateFormat',
  'hourFormat',
])
export default enhance(WeeklyCalendar)
