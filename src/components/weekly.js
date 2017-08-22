import React from 'react'
import {compose} from 'recompose'
import controller from '../controller'
import startOfWeek from 'date-fns/fp/startOfWeekWithOptions'
import addDays from 'date-fns/fp/addDays'
import addHours from 'date-fns/fp/addHours'
import format from 'date-fns/fp/format'
import isSameHour from 'date-fns/fp/isSameHour'
import differenceInHours from 'date-fns/fp/differenceInHours'

const weeks = [0, 1, 2, 3, 4, 5, 6]
const hours = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
]

class WeeklyCalendar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startWeek: startOfWeek({weekStartsOn: props.startingDay}, new Date()),
    }
  }
  render() {
    const {data, dateFormat, startingDay, Cell, ...props} = this.props
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'center',
        }}>
        <div style={{paddingTop: 40}}>
          {hours.map((h, idx) =>
            <div
              key={idx}
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 70,
                height: 20,
                padding: 5,
                backgroundColor: idx % 2 ? '#FFF' : '#EAEAEA',
              }}>
              {compose(format('HH:mm'), addHours(h))(this.state.startWeek)}
            </div>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            width: '100%',
          }}>
          {weeks.map((n, widx) =>
            <div key={widx} style={{width: `${100 / weeks.length}%`}}>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 30,
                  padding: 5,
                }}>
                {compose(format(dateFormat), addDays(n))(this.state.startWeek)}
              </div>
              {hours.map((h, idx) =>
                <div
                  key={idx}
                  style={{
                    flex: 1,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    height: 30,
                    padding: '0 5px',
                    backgroundColor: idx % 2 ? '#FFF' : '#EAEAEA',
                  }}>
                  {data.map(
                    (d, didx) =>
                      isSameHour(
                        compose(addDays(n), addHours(h))(this.state.startWeek),
                        d.startDate
                      )
                        ? <Cell key={didx} data={d}>
                            {d.title}
                          </Cell>
                        : null
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}
const enhance = controller(['data', 'startingDay', 'dateFormat'])
export default enhance(WeeklyCalendar)
