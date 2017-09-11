import React from 'react'
import {compose} from 'recompose'
import addDays from 'date-fns/fp/addDays'
import format from 'date-fns/fp/formatWithOptions'

import controller from '../controller'
import {range} from '../utils'

class N extends React.Component {
  render() {
    const {
      rowHeight,
      dateFormat,
      locale,
      showWeekend,
      startWeek,
      children,
      renderChild,
      ...props
    } = this.props
    const days = showWeekend ? range(7) : range(5)
    const formattedDays = days.map((d, idx) =>
      compose(format({locale}, dateFormat), addDays(d))(startWeek)
    )
    if (typeof children !== 'undefined' && typeof children === 'function') {
      return children({weeks: formattedDays})
    }
    if (typeof renderChild !== 'undefined') {
      return (
        <div {...props}>
          {formattedDays.map((h, idx) => renderChild({children: h, idx, key: `day_label_${idx}`}))}
        </div>
      )
    }
    return (
      <div {...props}>
        {formattedDays.map((h, idx) => (
          <div key={`day_label_${idx}`} style={{height: rowHeight}}>
            {h}
          </div>
        ))}
      </div>
    )
  }
}

const enhance = controller(['locale', 'dateFormat', 'showWeekend', 'rowHeight', 'startWeek'])
export default enhance(N)
