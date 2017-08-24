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
import format from 'date-fns/fp/format'
import isSameHour from 'date-fns/fp/isSameHour'
import isSameDay from 'date-fns/fp/isSameDay'
import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping'

import differenceInHours from 'date-fns/fp/differenceInHours'
import isAfter from 'date-fns/fp/isAfter'

import controller from '../controller'

function debounce(func, wait, immediate) {
  var timeout
  return function() {
    var context = this,
      args = arguments
    var later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

const range = function(start, stop, step) {
  if (stop == null) {
    stop = start || 0
    start = 0
  }
  step = step || 1

  var length = Math.max(Math.ceil((stop - start) / step), 0)
  var range = Array(length)

  for (var idx = 0; idx < length; idx++, start += step) {
    range[idx] = start
  }
  return range
}

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
    if (!this.column) return null
    const {Event, rowHeight, startHour} = this.props
    const wrapper = this.column.getBoundingClientRect()
    const {fullDay, events: todayEvents} = this._getTodaysEvent(day)

    const fullDayEvents = () =>
      fullDay.map((e, idx) => {
        const ratio = 100 / fullDay.length
        return (
          <Event
            key={e.title}
            event={e}
            style={{
              position: 'absolute',
              top: 0,
              left: `${idx * ratio}%`,
              width: `${ratio}%`,
              height: `${rowHeight * differenceInHours(e.start, e.end)}px`,
            }}
          />
        )
      })
    let events = todayEvents
    events.sort((a, b) => (isAfter(a.start, b.start) ? -1 : 1))
    events = events.reduce((acc, e, idx, arr) => {
      const overlap =
        acc.filter(
          x =>
            (isSameHour(x.start, e.start) || isSameHour(x.end, e.end)) &&
            areIntervalsOverlapping(x, e)
        ).length + 1
      const ratio = wrapper.width / overlap
      const el = {
        ...e,
        style: {
          position: 'absolute',
          top: `${rowHeight * (getHours(e.start) - asHours(startHour))}px`,
          left: `${(overlap - 1) * ratio}px`,
          width: `${ratio}px`,
          height: `${rowHeight * differenceInHours(e.start, e.end)}px`,
        },
      }
      return [...acc, el]
    }, [])

    return [
      fullDayEvents(),
      events.map(e => <Event key={e.title} event={e} style={e.style} />),
    ]
  }
  _dateLabel = (start, end) => {
    const s =
      getMonth(start) === getMonth(end)
        ? format('DD', start)
        : format('DD MMM', start)
    const e = format('DD MMM YYYY', end)
    return `${s} - ${e}`
  }
  render() {
    const {
      startHour,
      endHour,
      dateFormat,
      hourFormat,
      showWeekends,
      rowHeight,
      Column,
      children,
    } = this.props
    const {startWeek} = this.state

    const weeks = showWeekends ? range(7) : range(5)
    const hours = range(asHours(startHour), asHours(endHour))
    const endWeek = compose(addWeeks(1), startOfDay)(startWeek)
    const props = {
      rowHeight,
      end: endWeek,
      start: startWeek,
      nextWeek: this._nextWeek,
      prevWeek: this._prevWeek,
      gotoToday: this._gotoToday,
      getDateLabel: El => <El label={this._dateLabel(startWeek, endWeek)} />,
      getDayLabels: El =>
        weeks.map((d, idx) =>
          <El
            style={{height: rowHeight}}
            key={`label_day_${idx}`}
            label={compose(format(dateFormat), addDays(d))(startWeek)}
            idx={idx}
          />
        ),
      getHourLabels: El =>
        hours.map((h, idx) =>
          <El
            style={{height: rowHeight}}
            key={`label_hour_${idx}`}
            label={compose(format(hourFormat), addHours(h))(startWeek)}
            idx={idx}
          />
        ),
      calendar: weeks.reduce((c, w) => {
        const day = addDays(w, startWeek)
        return [
          ...c,
          {
            day,
            label: format(dateFormat, day),
            getColumn: () =>
              <Column
                style={{position: 'relative', height: rowHeight * hours.length}}
                innerRef={r => (this.column = r)}>
                {this._computeEvents(hours, day)}
              </Column>,
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
  showWeekends: true,
  start: new Date(),
}

WeeklyCalendar.PropTypes = {
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  showWeekends: PropTypes.bool,
  rowHeight: PropTypes.number,
  start: PropTypes.instanceOf(Date),
  data: PropTypes.object.isRequired,
  Column: PropTypes.node,
  Event: PropTypes.node,
  NoEvent: PropTypes.node,
}

const enhance = controller(['data', 'startingDay', 'dateFormat', 'hourFormat'])
export default enhance(WeeklyCalendar)
