import React from 'react'
import {compose} from 'recompose'
import addDays from 'date-fns/fp/addDays'
import format from 'date-fns/fp/formatWithOptions'

import controller from '../controller'

class HoursLabels extends React.Component {
  render() {
    const {
      rowHeight,
      dateFormat,
      locale,
      start,
      weeks,
      children,
      renderChild,
      ...props
    } = this.props

    const formattedDays = weeks.map((d, idx) =>
      compose(format({locale}, dateFormat), addDays(d))(start)
    )
    if (typeof children !== 'undefined' && typeof children === 'function') {
      return children({weeks: formattedDays})
    }
    if (typeof renderChild !== 'undefined') {
      return (
        <div {...props}>
          {formattedDays.map((h, idx) => renderChild({children: h, idx, key: `hour_label_${idx}`}))}
        </div>
      )
    }
    return (
      <div {...props}>
        {formattedDays.map((h, idx) => (
          <div key={`hour_label_${idx}`} style={{height: rowHeight}}>
            {h}
          </div>
        ))}
      </div>
    )
  }
}

const enhance = controller(['locale', 'dateFormat'])
export default enhance(HoursLabels)
