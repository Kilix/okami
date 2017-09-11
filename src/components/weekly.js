import React from 'react'
import PropTypes from 'prop-types'
import {compose} from 'recompose'

import {asHours} from 'pomeranian-durations'

import startOfWeek from 'date-fns/fp/startOfWeekWithOptions'
import getMonth from 'date-fns/fp/getMonth'
import getDay from 'date-fns/fp/getDay'
import startOfDay from 'date-fns/fp/startOfDay'
import subWeeks from 'date-fns/fp/subWeeks'
import addWeeks from 'date-fns/fp/addWeeks'
import addDays from 'date-fns/fp/addDays'
import format from 'date-fns/fp/formatWithOptions'
import endOfWeek from 'date-fns/endOfWeek'
import isAfter from 'date-fns/fp/isAfter'
import isBefore from 'date-fns/fp/isBefore'
import differenceInHours from 'date-fns/differenceInHours'
import getDayOfYear from 'date-fns/getDayOfYear'
import isSameDay from 'date-fns/isSameDay'

import controller from '../controller'
import HoursLabels from './hoursLabels'
import DaysLabels from './daysLabels'
import {debounce, range, getWeekEvents} from '../utils'

class WeeklyCalendar extends React.Component {
  state = {
    startWeek: undefined,
    showWeekend: true,
    weekEvents: {events: [], max: 0},
  }
  componentWillMount() {
    const {start, startingDay} = this.props
    this.setState(() => ({
      startWeek: startOfWeek({weekStartsOn: startingDay}, start),
      showWeekend: this.props.showWeekend,
    }))
  }
  componentWillReceiveProps(props) {
    this.setState(
      () => ({
        startWeek: startOfWeek({weekStartsOn: props.startingDay}, props.start),
      }),
      () => this._computeWeekEvents()
    )
  }
  componentDidMount() {
    this._computeWeekEvents()
    window.addEventListener('resize', this.resize)
  }
  componentWillUnmount = () => window.removeEventListener('resize', this.resize)
  getChildContext() {
    const {startWeek, showWeekend, weekEvents} = this.state
    const {startHour, endHour} = this.props
    const weeks = showWeekend ? range(7) : range(5)
    const hours = range(asHours(startHour), asHours(endHour))
    return {
      type: this.props.type ? this.props.type : 'weekly',
      startHour: this.props.startHour,
      endHour: this.props.endHour,
      startingDay: this.props.startingDay,
      rowHeight: this.props.rowHeight,
      nextWeek: this._nextWeek,
      prevWeek: this._prevWeek,
      gotoToday: this._gotoToday,
      dateLabel: this._dateLabel,
      offset: weekEvents.max + 1,
      matrix: weekEvents.matrix,
      startWeek,
      weeks,
      hours,
    }
  }
  resize = debounce(() => this.forceUpdate(), 100, false)
  _toggleWeekend = (force = null) =>
    this.setState(
      old => ({showWeekend: force === null ? !old.showWeekend : force}),
      () => {
        this._computeWeekEvents()
        this.forceUpdate()
      }
    )
  _nextWeek = () => {
    this.setState(old => ({startWeek: addWeeks(1, old.startWeek)}), () => this._computeWeekEvents())
  }
  _prevWeek = () => {
    this.setState(old => ({startWeek: subWeeks(1, old.startWeek)}), () => this._computeWeekEvents())
  }
  _gotoToday = () =>
    this.setState(
      () => ({
        startWeek: startOfWeek({weekStartsOn: this.props.startingDay}, new Date()),
      }),
      () => this._computeWeekEvents()
    )
  _computeWeekEvents = () => {
    const {data, rowHeight, startingDay} = this.props
    const {startWeek, showWeekend} = this.state
    const endWeek = showWeekend
      ? endOfWeek(startWeek, {weekStartsOn: startingDay})
      : addDays(4, startWeek)
    let events = getWeekEvents(startingDay, showWeekend, startWeek, data)
    const matrix = [[0, 0, 0, 0, 0, 0, 0]]
    events.sort((a, b) => {
      if (isSameDay(a.start, b.start)) {
        const AnbDays = a.end ? getDayOfYear(a.end) - getDayOfYear(a.start) + 1 : 1
        const BnbDays = b.end ? getDayOfYear(b.end) - getDayOfYear(b.start) + 1 : 1
        return AnbDays - BnbDays
      }
      return isAfter(a.start, b.start) ? -1 : 1
    })

    if (this.containerProps) {
      const wrapper = this.containerProps.getBoundingClientRect()
      const weekEvents = events.map(e => {
        const s = typeof e.allDay === 'boolean' ? e.start : e.allDay
        const ss = isBefore(startWeek, s) ? startWeek : s
        const end = e.end ? (isAfter(endWeek, e.end) ? endWeek : e.end) : null
        const nbDays = end ? getDayOfYear(end) - getDayOfYear(ss) + 1 : 1
        const diffDay = getDayOfYear(ss) - getDayOfYear(startWeek)
        const index = getDay(ss)
        const w = wrapper.width / (showWeekend ? 7 : 5)

        let y = 0
        let added = false
        for (let i = 0; i < matrix.length; i++) {
          if (matrix[i][index] === 0) {
            let free = true
            for (let j = index; j < nbDays - 1; j++) {
              if (matrix[i][j] === 1) free = false
            }
            if (free) {
              y = i
              added = true
              for (let j = index; j < index + nbDays; j++) {
                const k = j === 7 ? 0 : j
                matrix[i][k] = 1
              }
              break
            }
          }
        }
        if (!added) {
          const mm = [0, 0, 0, 0, 0, 0, 0]
          for (let j = index; j < index + nbDays; j++) {
            const k = j === 7 ? 0 : j
            mm[k] = 1
          }
          matrix.push(mm)
          y = matrix.length - 1
        }

        return {
          key: e.id,
          event: e,
          style: {
            position: 'absolute',
            top: rowHeight * y,
            left: diffDay * w,
            width: typeof e.allDay !== 'boolean' ? w : nbDays * w,
            height: rowHeight,
          },
        }
      })
      this.setState(() => ({
        weekEvents: {
          events: weekEvents,
          matrix: matrix.reduce((acc, v) => acc.map((a, idx) => a + v[idx]), [0, 0, 0, 0, 0, 0, 0]),
          max: matrix.length,
        },
      }))
    } else {
      this.setState(() => ({
        weekEvents: {
          events: events.map(e => ({
            key: e.id,
            event: e,
          })),
          matrix: [0, 0, 0, 0, 0, 0, 0],
          max: 1,
        },
      }))
    }
  }

  _dateLabel = dateFormat => {
    const {startWeek} = this.state
    const endWeek = compose(addWeeks(1), startOfDay)(startWeek)
    if (dateFormat) {
      return format({locale: this.props.locale}, dateFormat, startWeek)
    }
    const s =
      getMonth(startWeek) === getMonth(endWeek)
        ? format({locale: this.props.locale}, 'DD', startWeek)
        : format({locale: this.props.locale}, 'DD MMM', startWeek)
    const e = format({locale: this.props.locale}, 'DD MMM YYYY', endWeek)
    return `${s} - ${e}`
  }
  render() {
    const {startHour, endHour, rowHeight, children, type} = this.props
    const {startWeek, showWeekend, weekEvents} = this.state
    const weeks = showWeekend ? range(7) : range(5)
    const hours = range(asHours(startHour), asHours(endHour))
    const endWeek = compose(addWeeks(1), startOfDay)(startWeek)
    const props = {
      rowHeight,
      end: endWeek,
      start: startWeek,
      nextWeek: this._nextWeek,
      prevWeek: this._prevWeek,
      gotoToday: this._gotoToday,
      toggleWeekend: this._toggleWeekend,
      dateLabel: this._dateLabel(),
      getContainerProps: ({style = {}} = {}) => ({
        style: {
          position: type === 'monthly' ? 'absolute' : 'relative',
          height: rowHeight * weekEvents.max,
          width: '100%',
          ...style,
        },
        innerRef: r => {
          if (typeof this.containerProps === 'undefined') {
            this.containerProps = r
            this.forceUpdate()
          }
        },
      }),
      weekEvents: weekEvents.events,
      calendar: weeks.reduce((days, w) => {
        const day = addDays(w, startWeek)
        const c = getDay(day)
        return [...days, day]
      }, []),
    }

    return children(props)
  }
}

WeeklyCalendar.childContextTypes = {
  type: PropTypes.string,
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  startingDay: PropTypes.number,
  rowHeight: PropTypes.number,
  nextWeek: PropTypes.func,
  prevWeek: PropTypes.func,
  gotoToday: PropTypes.func,
  dateLabel: PropTypes.func,
  startWeek: PropTypes.instanceOf(Date),
  weeks: PropTypes.array,
  hours: PropTypes.array,
  offset: PropTypes.number,
  matrix: PropTypes.array,
}

WeeklyCalendar.defaultProps = {
  startHour: 'PT0H',
  endHour: 'PT24H',
  rowHeight: 30,
  showWeekend: true,
  start: new Date(),
  showNow: false,
  type: 'weekly',
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
  type: PropTypes.string,
}

const enhance = controller([
  'data',
  'locale',
  'startingDay',
  'type',
  'startHour',
  'endHour',
  'rowHeight',
])
export default enhance(WeeklyCalendar)
