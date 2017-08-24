import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'

import {asHours} from 'pomeranian-durations'

import startOfWeek from 'date-fns/fp/startOfWeekWithOptions'
import startOfDay from 'date-fns/fp/startOfDay'
import endOfDay from 'date-fns/fp/endOfDay'
import subDays from 'date-fns/fp/subDays'
import addDays from 'date-fns/fp/addDays'
import addHours from 'date-fns/fp/addHours'
import addMinutes from 'date-fns/fp/addMinutes'
import format from 'date-fns/fp/format'
import isSameHour from 'date-fns/fp/isSameHour'
import isSameDay from 'date-fns/fp/isSameDay'
import differenceInHours from 'date-fns/fp/differenceInHours'
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
    const {start, startingDay, numberOfDays} = this.props

    const startWeek =
      numberOfDays === 7
        ? startOfWeek({weekStartsOn: startingDay}, start)
        : startOfDay(start)
    this.setState(() => ({startWeek}))
  }
  _nextWeek = () =>
    this.setState(old => ({
      startWeek: addDays(this.props.numberOfDays, old.startWeek),
    }))
  _prevWeek = () =>
    this.setState(old => ({
      startWeek: subDays(this.props.numberOfDays, old.startWeek),
    }))
  _gotoToday = () =>
    this.setState(() => ({
      startWeek: startOfWeek(
        {weekStartsOn: this.props.startingDay},
        new Date()
      ),
    }))
  render() {
    const {
      data,
      numberOfDays,
      startHour,
      endHour,
      dateFormat,
      hourFormat,
      HourLabel,
      DayLabel,
      Cell,
      Event,
      NoEvent,
      children,
    } = this.props
    const {startWeek} = this.state

    const weeks = range(numberOfDays)
    const hours = range(asHours(startHour), asHours(endHour))
    const props = {
      nextWeek: this._nextWeek,
      prevWeek: this._prevWeek,
      gotoToday: this._gotoToday,
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
            hours: hours.map((h, hidx) => {
              const hour = addHours(h, day)
              const label = format(hourFormat, hour)
              const todayEvents = data
                .filter(e => isSameDay(day, e.start))
                .map(e => {
                  if (e.end !== '*') return e
                  return {
                    ...e,
                    start: addHours(asHours(startHour), startOfDay(e.start)),
                    end: addHours(asHours(endHour), startOfDay(e.start)),
                  }
                })
              const events = todayEvents
                .filter(e => {
                  const dd = todayEvents.reduce(
                    (res, ee) => res && areIntervalsOverlapping(e, ee),
                    true
                  )
                  return dd
                })
                .reduce((acc, e, idx, arr) => {
                  const m = max(arr.map(ev => ev.end))
                  const mm = min(arr.map(ev => ev.start))
                  if (
                    isWithinInterval(addMinutes(1, hour), {start: mm, end: m})
                  ) {
                    if (isSameHour(hour, e.start))
                      return [...acc, {...e, render: true}]
                    return [...acc, {...e, render: false}]
                  }
                  return acc
                }, [])

              return (
                <Cell key={`hour_${hidx}`} idx={hidx}>
                  {events.length > 0
                    ? events.map((event, idx) =>
                        <Event key={event.title} event={event} />
                      )
                    : NoEvent ? <NoEvent /> : null}
                </Cell>
              )
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
  numberOfDays: 7,
  start: new Date(),
}

const enhance = controller(['data', 'startingDay', 'dateFormat', 'hourFormat'])
export default enhance(WeeklyCalendar)
