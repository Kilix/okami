import React from 'react'
import glamorous, {Div} from 'glamorous'
import format from 'date-fns/fp/format'
import isBefore from 'date-fns/fp/isBefore'

import MonthlyCalendar from '../../src/components/monthly'
import {DayLabel, DateDisplayer} from '../dummy'

const MonthCell = glamorous.div(
  {
    backgroundColor: '#FAFAFA',
    padding: 8,
    boxSizing: 'border-box',
    border: '1px solid #FFF',
    height: 150,
    overflow: 'hidden',
  },
  props => ({
    opacity: isBefore(props.start, props.day.date) ? 0.5 : 1,
  })
)
const MonthEvent = ({event}) =>
  <Div color={event.color ? event.color : '#232323'}>
    {event.end !== '*' && format('HH[h]', event.start)} {event.title}
  </Div>

export default ({className, style, ...props}) =>
  <MonthlyCalendar>
    {({
      calendar,
      start,
      rowHeight,
      nextMonth,
      prevMonth,
      gotoToday,
      dayLabels,
      dateLabel,
      columnProps,
    }) =>
      <Div display="flex" flexDirection="column" {...{className, style}}>
        <Div display="flex">
          <button onClick={gotoToday}>Today</button>
          <button onClick={prevMonth}>Prev month</button>
          <button onClick={nextMonth}>Next month</button>
          <DateDisplayer children={dateLabel} />
        </Div>
        <Div
          justifyContent="flex-start"
          width="100%"
          flexDirection="column"
          alignItems="flex-start">
          <Div display="flex" width="100%">
            {dayLabels.map(({label, idx, key}) =>
              <DayLabel
                key={key}
                idx={idx}
                children={label}
                style={{height: rowHeight}}
              />
            )}
          </Div>
          <Div display="flex">
            {calendar.map((column, idx) =>
              <Div
                key={`column_${idx}`}
                {...columnProps}
                style={{
                  width: `${100 / 7}%`,
                  position: 'relative',
                }}>
                <Div>
                  {column.map((day, idx) =>
                    <MonthCell key={`cell_${idx}`} start={start} day={day}>
                      <Div
                        fontSize={13}
                        color={
                          isBefore(start, day.date) ? '#A7A7A7' : '#232323'
                        }
                        padding={2}>
                        {day.label}
                      </Div>
                      {day.events.map(props => <MonthEvent {...props} />)}
                    </MonthCell>
                  )}
                </Div>
              </Div>
            )}
          </Div>
        </Div>
      </Div>}
  </MonthlyCalendar>
