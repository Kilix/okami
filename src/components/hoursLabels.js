import React from 'react'
import {compose} from 'recompose'
import addHours from 'date-fns/fp/addHours'
import format from 'date-fns/fp/formatWithOptions'

import controller from '../controller'

class Labels extends React.Component {
  render() {
    const {
      rowHeight,
      hourFormat,
      startWeek,
      currentDay,
      hours,
      children,
      renderChild,
      locale,
      offset,
      type,
      style,
      ...props
    } = this.props
    const start = type === 'weekly' ? startWeek : currentDay
    const ss = style ? {...style, paddingTop: offset * rowHeight} : {paddingTop: offset * rowHeight}

    const formattedHours = hours.map((h, idx) =>
      compose(format({locale}, hourFormat), addHours(h))(start)
    )
    if (typeof children !== 'undefined' && typeof children === 'function') {
      return children({hours: formattedHours})
    }
    if (typeof renderChild !== 'undefined') {
      return (
        <div {...props} style={ss}>
          {formattedHours.map((h, idx) =>
            renderChild({children: h, idx, key: `hour_label_${idx}`})
          )}
        </div>
      )
    }
    return (
      <div {...props} style={ss}>
        {formattedHours.map((h, idx) => (
          <div key={`hour_label_${idx}`} style={{height: rowHeight}}>
            {h}
          </div>
        ))}
      </div>
    )
  }
}

Labels.defaultProps = {
  offset: 0,
}

const HoursLabels = props => {
  const p = {
    weekly: ['locale', 'hourFormat', 'rowHeight', 'hours', 'startWeek', 'offset'],
    daily: ['locale', 'hourFormat', 'rowHeight', 'hours', 'currentDay'],
  }
  const enhance = controller(p[props.type])
  const N = enhance(Labels)
  return <N {...props} />
}

const enhance = controller(['type'])
export default enhance(HoursLabels)
