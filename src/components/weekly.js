import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'

import {asHours} from 'pomeranian-durations'

import startOfWeek from 'date-fns/fp/startOfWeekWithOptions'
import startOfDay from 'date-fns/fp/startOfDay'
import subWeeks from 'date-fns/fp/subWeeks'
import addWeeks from 'date-fns/fp/addWeeks'
import addDays from 'date-fns/fp/addDays'
import addHours from 'date-fns/fp/addHours'
import addMinutes from 'date-fns/fp/addMinutes'
import format from 'date-fns/fp/format'
import isSameHour from 'date-fns/fp/isSameHour'
import isSameDay from 'date-fns/fp/isSameDay'
import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping'
import isWithinInterval from 'date-fns/isWithinInterval'
import max from 'date-fns/max'
import min from 'date-fns/min'

import controller from '../controller'

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
  _getTodaysEvent = day =>
    this.props.data.filter(e => isSameDay(day, e.start)).map(e => {
      if (e.end !== '*') return e
      return {
        ...e,
        start: addHours(asHours(this.props.startHour), startOfDay(e.start)),
        end: addHours(asHours(this.props.endHour), startOfDay(e.start)),
      }
    })
  _computeHours = (hours, day) => {
    return hours.map((h, hidx) => {
      const {Cell, Event, NoEvent} = this.props
      const hour = addHours(h, day)
      const todayEvents = this._getTodaysEvent(day)
      const events = todayEvents
        .filter(e =>
          todayEvents.reduce(
            (res, ee) => res && areIntervalsOverlapping(e, ee),
            true
          )
        )
        .reduce((acc, e, idx, arr) => {
          const start = min(arr.map(ev => ev.start))
          const end = max(arr.map(ev => ev.end))
          if (isWithinInterval(addMinutes(1, hour), {start, end})) {
            if (isSameHour(hour, e.start)) {
              return [...acc, {...e, render: true}]
            }
            return [...acc, {...e, render: false}]
          }
          return acc
        }, [])

      return (
        <Cell key={`hour_${hidx}`} idx={hidx}>
          {events.length > 0
            ? events.map((event, idx) =>
                <Event key={event.title} event={event} render={event.render} />
              )
            : NoEvent ? <NoEvent /> : null}
        </Cell>
      )
    })
  }
  render() {
    const {
      startHour,
      endHour,
      dateFormat,
      hourFormat,
      showWeekends,
      HourLabel,
      DayLabel,
      children,
    } = this.props
    const {startWeek} = this.state

    const weeks = showWeekends ? range(7) : range(5)
    const hours = range(asHours(startHour), asHours(endHour))
    const endWeek = compose(addWeeks(1), startOfDay)(startWeek)
    const props = {
      nextWeek: this._nextWeek,
      prevWeek: this._prevWeek,
      gotoToday: this._gotoToday,
      start: startWeek,
      end: endWeek,
      days:
        DayLabel &&
        weeks.map((d, idx) =>
          <DayLabel
            key={`day_label_${idx}`}
            idx={idx}
            label={compose(format(dateFormat), addDays(d))(startWeek)}
          />
        ),
      hours:
        HourLabel &&
        hours.map((h, idx) =>
          <HourLabel
            key={`hour_label_${idx}`}
            idx={idx}
            label={compose(format(hourFormat), addHours(h))(startWeek)}
          />
        ),
      calendar: weeks.reduce((c, w) => {
        const day = addDays(w, startWeek)
        return [
          ...c,
          {
            day,
            label: format(dateFormat, day),
            hours: this._computeHours(hours, day),
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
  showWeekends: true,
  start: new Date(),
}

WeeklyCalendar.PropTypes = {
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  showWeekends: PropTypes.bool,
  start: PropTypes.instanceOf(Date),
  data: PropTypes.object.isRequired,
  HourLabel: PropTypes.node,
  DayLabel: PropTypes.node,
  Cell: PropTypes.node,
  Event: PropTypes.node,
  NoEvent: PropTypes.node,
}

const enhance = controller(['data', 'startingDay', 'dateFormat', 'hourFormat'])
export default enhance(WeeklyCalendar)
