import React from 'react'
import {compose} from 'recompose'
import addDays from 'date-fns/fp/addDays'
import format from 'date-fns/fp/formatWithOptions'

import controller from '../controller'

class Nav extends React.Component {
  _next = () => {
    switch (this.props.type) {
      case 'monthly':
        return this.props.nextMonth()
      case 'weekly':
        return this.props.nextWeek()
      case 'daily':
        return this.props.nextDay()
    }
  }
  _prev = () => {
    switch (this.props.type) {
      case 'monthly':
        return this.props.prevMonth()
      case 'weekly':
        return this.props.prevWeek()
      case 'daily':
        return this.props.prevDay()
    }
  }
  _today = () => this.props.gotoToday()

  render() {
    const props = {
      type: this.props.type,
      next: this._next,
      prev: this._prev,
      today: this._today,
      currentDate: this.props.dateLabel(this.props.dateFormat),
    }
    return this.props.children(props)
  }
}

const Navigation = props => {
  const p = {
    monthly: ['gotoToday', 'nextMonth', 'prevMonth', 'dateLabel'],
    weekly: ['gotoToday', 'nextWeek', 'prevWeek', 'dateLabel'],
    daily: ['gotoToday', 'nextDay', 'prevDay', 'dateLabel'],
  }
  const enhance = controller(p[props.type])
  const N = enhance(Nav)
  return <N {...props} />
}

const enhance = controller(['type'])
export default enhance(Navigation)
