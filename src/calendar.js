import React, {Component} from 'react'
import PropTypes from 'prop-types'
import enLocale from 'date-fns/locale/en-US'

import getHours from 'date-fns/fp/getHours'
import isAfter from 'date-fns/fp/isAfter'

import {constructTree} from './utils'

const days = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

function parseData(data) {
  let events = data.filter(e => typeof e.allDay === 'boolean' && e.allDay === false)
  events.sort((a, b) => {
    if (getHours(a.start) === getHours(b.start)) {
      return getHours(b.end) - getHours(b.start) - (getHours(a.end) - getHours(a.start))
    }
    return isAfter(a.start, b.start) ? -1 : 1
  })

  const fevents = data.filter(e => e.allDay)
  return {
    events,
    fevents,
    nodes: constructTree(events),
  }
}

class Calendar extends Component {
  constructor(props) {
    const {startingDay, data} = props
    super(props)
    const e = parseData(data)

    this.state = {
      startingDay: days[startingDay],
      showWeekend: props.showWeekend,
      ...e,
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      this.setState(() => parseData(nextProps.data))
    }
  }

  _toggleWeekend = (force = null) => {
    this.setState(old => ({showWeekend: force !== null ? force : !old.showWeekend}))
  }

  getChildContext() {
    const {startingDay, showWeekend, events, fevents, nodes} = this.state
    const {dateFormat, hourFormat, locale, startHour, endHour, rowHeight} = this.props
    return {
      startingDay,
      dateFormat,
      hourFormat,
      events,
      fevents,
      nodes,
      locale,
      startHour,
      rowHeight,
      endHour,
      showWeekend,
      toggleWeekend: this._toggleWeekend,
    }
  }

  render() {
    const {children} = this.props
    return children
  }
}

Calendar.PropTypes = {
  startHour: PropTypes.string,
  endHour: PropTypes.string,
  dateFormat: PropTypes.string,
  hourFormat: PropTypes.string,
  startingDay: PropTypes.string,
  locale: PropTypes.object,
  rowHeight: PropTypes.number,
  showWeekend: PropTypes.bool,
  data: PropTypes.array.isRequired,
}

Calendar.defaultProps = {
  startHour: 'PT0H',
  endHour: 'PT24H',
  dateFormat: 'DD/MM/YYYY',
  hourFormat: 'HH:mm',
  startingDay: 'sunday',
  locale: enLocale,
  rowHeight: 30,
  showWeekend: true,
  data: [],
}

Calendar.childContextTypes = {
  startingDay: PropTypes.number,
  dateFormat: PropTypes.string,
  hourFormat: PropTypes.string,
  locale: PropTypes.object,
  events: PropTypes.array,
  fevents: PropTypes.array,
  nodes: PropTypes.object,
  startHour: PropTypes.string,
  rowHeight: PropTypes.number,
  endHour: PropTypes.string,
  showWeekend: PropTypes.bool,
  toggleWeekend: PropTypes.func,
}

export default Calendar
