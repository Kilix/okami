import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'

import {asHours} from 'pomeranian-durations'

import startOfWeek from 'date-fns/fp/startOfWeekWithOptions'
import getHours from 'date-fns/fp/getHours'
import getMonth from 'date-fns/fp/getMonth'
import startOfDay from 'date-fns/fp/startOfDay'
import subWeeks from 'date-fns/fp/subWeeks'
import addWeeks from 'date-fns/fp/addWeeks'
import addDays from 'date-fns/fp/addDays'
import addHours from 'date-fns/fp/addHours'
import format from 'date-fns/fp/formatWithOptions'
import isSameHour from 'date-fns/fp/isSameHour'
import isSameDay from 'date-fns/fp/isSameDay'
import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping'

import differenceInHours from 'date-fns/fp/differenceInHours'
import isAfter from 'date-fns/fp/isAfter'
import isBefore from 'date-fns/fp/isBefore'

import controller from '../controller'
import {debounce, range} from '../utils'

class WeeklyCalendar extends React.Component {
  componentWillMount() {
    const {start, startingDay} = this.props
    this.setState(() => ({
      startWeek: startOfWeek({weekStartsOn: startingDay}, start),
    }))
  }
  resize = debounce(() => this.forceUpdate(), 300, true)
  componentDidMount() {
    window.addEventListener('resize', this.resize)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }
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
  _getTodaysEvent = day => {
    const base = this.props.data.filter(e => isSameDay(day, e.start))
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
  _computeEvents = (hours, day) => {
    if (!this.column) return {events: [], fullDay: []}
    const {rowHeight, startHour} = this.props
    const wrapper = this.column.getBoundingClientRect()
    const {fullDay, events: todayEvents} = this._getTodaysEvent(day)

    const fullDayEvents = fullDay.map((e, idx) => {
      const ratio = 100 / fullDay.length
      return {
        key: e.title,
        event: e,
        style: {
          position: 'absolute',
          top: 0,
          left: `${idx * ratio}%`,
          width: `${ratio}%`,
          height: `${rowHeight * differenceInHours(e.start, e.end)}px`,
        },
      }
    })
    const computings = (acc, e, idx, arr) => {
      console.log('compute')
      const overlap =
        acc.filter(
          x =>
            (isSameHour(x.event.start, e.start) ||
              isSameHour(x.event.end, e.end)) &&
            areIntervalsOverlapping(x.event, e)
        ).length + 1
      const ratio = wrapper.width / overlap
      const newAcc = acc.map(x => ({
        ...x,
        style: {
          ...x.style,
          width: x.style.width - wrapper.width / 10,
        },
      }))
      const style = {
        position: 'absolute',
        top: rowHeight * (getHours(e.start) - asHours(startHour)),
        left: (overlap - 1) * ratio,
        width: ratio,
        height: rowHeight * differenceInHours(e.start, e.end),
      }
      const el = {
        key: e.title,
        event: e,
        style,
      }
      return [...newAcc, el]
    }

    let events = todayEvents
    events.sort((a, b) => (isAfter(a.start, b.start) ? -1 : 1))
    events = events.reduce(computings, [])

    return {fullDay: fullDayEvents, events}
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
      showWeekend,
      rowHeight,
      children,
    } = this.props
    const {startWeek} = this.state
    const weeks = showWeekend ? range(7) : range(5)
    const hours = range(asHours(startHour), asHours(endHour))
    const endWeek = compose(addWeeks(1), startOfDay)(startWeek)
    const props = {
      rowHeight,
      end: endWeek,
      start: startWeek,
      hours,
      nextWeek: this._nextWeek,
      prevWeek: this._prevWeek,
      gotoToday: this._gotoToday,
      dateLabel: this._dateLabel(startWeek, endWeek),
      dayLabels: weeks.map((d, idx) => ({
        label: compose(
          format({locale: this.props.locale}, dateFormat),
          addDays(d)
        )(startWeek),
        idx,
        rowHeight,
      })),
      hourLabels: hours.map((h, idx) => ({
        label: compose(
          format({locale: this.props.locale}, hourFormat),
          addHours(h)
        )(startWeek),
        idx,
        rowHeight,
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
      calendar: weeks.reduce((days, w) => {
        const day = addDays(w, startWeek)
        return [
          ...days,
          {
            date: day,
            label: format({locale: this.props.locale}, dateFormat, day),
            events: this._computeEvents(hours, day),
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
}

WeeklyCalendar.PropTypes = {
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  showWeekend: PropTypes.bool,
  rowHeight: PropTypes.number,
  start: PropTypes.instanceOf(Date),
  locale: PropTypes.object,
  data: PropTypes.object.isRequired,
}

const enhance = controller([
  'data',
  'locale',
  'startingDay',
  'dateFormat',
  'hourFormat',
])
export default enhance(WeeklyCalendar)
