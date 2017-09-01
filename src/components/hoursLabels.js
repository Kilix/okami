import React from 'react'
import {compose} from 'recompose'
import addHours from 'date-fns/fp/addHours'
import format from 'date-fns/fp/formatWithOptions'

import controller from '../controller'

class HoursLabels extends React.Component {
  render() {
    const {
      rowHeight,
      hourFormat,
      start,
      hours,
      children,
      renderChild,
      locale,
      ...props
    } = this.props

    const formattedHours = hours.map((h, idx) =>
      compose(format({locale}, hourFormat), addHours(h))(start)
    )
    if (typeof children !== 'undefined' && typeof children === 'function') {
      return children({hours: formattedHours})
    }
    if (typeof renderChild !== 'undefined') {
      return (
        <div {...props}>
          {formattedHours.map((h, idx) =>
            renderChild({children: h, idx, key: `hour_label_${idx}`})
          )}
        </div>
      )
    }
    return (
      <div {...props}>
        {formattedHours.map((h, idx) => (
          <div key={`hour_label_${idx}`} style={{height: rowHeight}}>
            {h}
          </div>
        ))}
      </div>
    )
  }
}

const enhance = controller(['locale', 'hourFormat'])
export default enhance(HoursLabels)
