import React from 'react'
import PropTypes from 'prop-types'

const defaultContext = [
  'locale',
  'startingDay',
  'data',
  'dateFormat',
  'hourFormat',
  'startHour',
  'endHour',
  'type',
  'rowHeight',
  'gotoToday',
  'nextMonth',
  'prevMonth',
  'nextWeek',
  'prevWeek',
  'nextDay',
  'prevDay',
  'dateLabel',
  'startWeek',
  'currentDay',
  'showWeekend',
  'offset',
  'matrix',
]
export default (p = defaultContext) => {
  const pp = p.reduce((acc, val) => ({...acc, [val]: PropTypes.any}), {})
  return BaseComponent =>
    class BD extends React.Component {
      static contextTypes = {
        startingDay: PropTypes.number,
        dateFormat: PropTypes.string,
        hourFormat: PropTypes.string,
        startHour: PropTypes.string,
        endHour: PropTypes.string,
        locale: PropTypes.object,
        data: PropTypes.array,
        type: PropTypes.string,
        rowHeight: PropTypes.number,
        gotoToday: PropTypes.func,
        nextMonth: PropTypes.func,
        prevMonth: PropTypes.func,
        nextWeek: PropTypes.func,
        prevWeek: PropTypes.func,
        nextDay: PropTypes.func,
        prevDay: PropTypes.func,
        dateLabel: PropTypes.func,
        startWeek: PropTypes.instanceOf(Date),
        currentDay: PropTypes.instanceOf(Date),
        showWeekend: PropTypes.bool,
        offset: PropTypes.number,
        matrix: PropTypes.array,
      }
      render() {
        const ppa = Object.keys(this.context)
          .filter(k => p.indexOf(k) !== -1)
          .reduce((a, k) => ({...a, [k]: this.context[k]}), {})
        return <BaseComponent {...ppa} {...this.props} />
      }
    }
}
