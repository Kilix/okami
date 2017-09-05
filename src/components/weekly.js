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
import differenceInDays from 'date-fns/differenceInDays'
import isWithinInterval from 'date-fns/isWithinInterval'

import controller from '../controller'
import HoursLabels from './hoursLabels'
import DaysLabels from './daysLabels'
import {debounce, range, getWeekEvents} from '../utils'

class WeeklyCalendar extends React.Component {
  state = {
    startWeek: undefined,
    showWeekend: true,
    weekEvents: {events: [], counters: [0, 0, 0, 0, 0, 0, 0], max: 0},
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
    const {weekEvents} = this.state
    return {
      offset: weekEvents.counters,
      type: this.props.type ? this.props.type : 'weekly',
      startHour: this.props.startHour,
      endHour: this.props.endHour,
      startingDay: this.props.startingDay,
      rowHeight: this.props.rowHeight,
      nextWeek: this._nextWeek,
      prevWeek: this._prevWeek,
      gotoToday: this._gotoToday,
      dateLabel: this._dateLabel,
    }
  }
  resize = debounce(() => this.forceUpdate(), 300, true)
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
    if (this.containerProps) {
      const wrapper = this.containerProps.getBoundingClientRect()
      const {data, rowHeight, startingDay} = this.props
      const {startWeek, showWeekend} = this.state
      const endWeek = showWeekend
        ? endOfWeek(startWeek, {weekStartsOn: startingDay})
        : addDays(4, startWeek)
      let events = getWeekEvents(startingDay, showWeekend, startWeek, data)
      events = events.sort((a, b) => {
        const anbDays = a.end ? differenceInDays(a.end, a.start) + 1 : 1
        const bnbDays = b.end ? differenceInDays(b.end, b.start) + 1 : 1
        if (anbDays > bnbDays) return -1
        else if (anbDays < bnbDays) return 1
        else return 0
      })
      const counters = [0, 0, 0, 0, 0, 0, 0]
      const weekEvents = events.map(e => {
        const s = typeof e.allDay === 'boolean' ? e.start : e.allDay
        const ss = isBefore(startWeek, s) ? startWeek : s
        const end = isAfter(endWeek, e.end) ? endWeek : e.end
        const nbDays = e.end ? differenceInDays(end, ss) + 1 : 1
        const diffDay = differenceInDays(ss, startWeek)
        const w = wrapper.width / (showWeekend ? 7 : 5)
        const t = counters[getDay(ss)] * rowHeight

        for (let i = 0; i < nbDays; i++) {
          const q = getDay(ss) + i > 6 ? 0 : getDay(ss) + i
          counters[q] = counters[q] + 1
        }
        return {
          key: e.title,
          event: e,
          style: {
            position: 'absolute',
            top: t,
            left: diffDay * w,
            width: !e.allDay ? w : nbDays * w,
            height: rowHeight,
          },
        }
      })
      this.setState(() => ({
        weekEvents: {
          events: weekEvents,
          counters,
          max: counters.reduce((a, b) => (a < b ? b : a), 0),
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
    const {startHour, endHour, rowHeight, children} = this.props
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
      DaysLabels: props => (
        <DaysLabels rowHeight={rowHeight} weeks={weeks} start={startWeek} {...props} />
      ),
      HoursLabels: props => (
        <HoursLabels rowHeight={rowHeight} hours={hours} start={startWeek} {...props} />
      ),
      getContainerProps: ({style = {}} = {}) => ({
        style: {position: 'relative', height: rowHeight * weekEvents.max, ...style},
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
        return [...days, {day, offset: weekEvents.counters[c]}]
      }, []),
    }

    return children(props)
  }
}

WeeklyCalendar.childContextTypes = {
  offset: PropTypes.array,
  type: PropTypes.string,
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  startingDay: PropTypes.number,
  rowHeight: PropTypes.number,
  nextWeek: PropTypes.func,
  prevWeek: PropTypes.func,
  gotoToday: PropTypes.func,
  dateLabel: PropTypes.func,
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
