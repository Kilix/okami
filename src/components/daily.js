import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'

import {asHours} from 'pomeranian-durations'

import startOfDay from 'date-fns/fp/startOfDay'
import getHours from 'date-fns/fp/getHours'
import subDays from 'date-fns/fp/subDays'
import addDays from 'date-fns/fp/addDays'
import addHours from 'date-fns/fp/addHours'
import format from 'date-fns/fp/format'
import isSameHour from 'date-fns/fp/isSameHour'
import isSameDay from 'date-fns/fp/isSameDay'
import areIntervalsOverlapping from 'date-fns/areIntervalsOverlapping'

import differenceInHours from 'date-fns/fp/differenceInHours'
import isAfter from 'date-fns/fp/isAfter'

import controller from '../controller'
import {debounce, range} from '../utils'

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
  _dateLabel = start => format('DD MMM YYYY', start)
  render() {
    const {
      startHour,
      endHour,
      dateFormat,
      hourFormat,
      rowHeight,
      Column,
      Cell,
      children,
    } = this.props
    const {currentDay} = this.state
    const hours = range(asHours(startHour), asHours(endHour))
    const props = {
      rowHeight,
      start: currentDay,
      nextDay: this._nextDay,
      prevDay: this._prevDay,
      gotoToday: this._gotoToday,
      getDateLabel: El => <El label={this._dateLabel(currentDay)} />,
      getDayLabels: El =>
        <El
          style={{height: rowHeight}}
          label={format(dateFormat, currentDay)}
        />,
      getHourLabels: El =>
        hours.map((h, idx) =>
          <El
            style={{height: rowHeight}}
            key={`label_hour_${idx}`}
            label={compose(format(hourFormat), addHours(h))(currentDay)}
            idx={idx}
          />
        ),
      calendar: {
        date: currentDay,
        label: format(dateFormat, currentDay),
        getColumn: () =>
          <Column
            style={{position: 'relative', height: rowHeight * hours.length}}
            innerRef={r => (this.column = r)}>
            {hours.map((h, idx) =>
              <Cell
                key={`$cell_${idx}`}
                idx={idx}
                style={{height: rowHeight}}
              />
            )}
            {this._computeEvents(hours, currentDay)}
          </Column>,
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
}

DailyCalendar.PropTypes = {
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  rowHeight: PropTypes.number,
  start: PropTypes.instanceOf(Date),
  data: PropTypes.object.isRequired,
  Column: PropTypes.node,
  Cell: PropTypes.node,
  Event: PropTypes.node,
}

const enhance = controller(['data', 'dateFormat', 'hourFormat'])
export default enhance(DailyCalendar)
