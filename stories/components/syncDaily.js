import React from 'react'
import {Div} from 'glamorous'

import DailyCalendar from '../../src/components/daily'

import {
  Container,
  HourLabel,
  CalendarContainer,
  Cell,
  DayLabel,
  Event,
  DateDisplayer,
  NowLine,
} from '../dummy'

export default ({className, style, ...props}) => (
  <DailyCalendar showNow {...props}>
    {({
      calendar,
      dayEvents,
      hours,
      rowHeight,
      dateLabel,
      hourLabels,
      columnProps,
      showNowProps,
    }) => (
      <Div display="flex" flexDirection="column" {...{className, style}}>
        <Container>
          <Div>
            <HourLabel
              idx={0}
              children="all day"
              style={{height: rowHeight * dayEvents.length, backgroundColor: '#DADADA'}}
            />
            {hourLabels.map(({label, idx}) => (
              <HourLabel
                key={`hour_label_${idx}`}
                idx={idx}
                children={label}
                style={{height: rowHeight}}
              />
            ))}
          </Div>
          <CalendarContainer style={{flexDirection: 'column'}}>
            <Div>{dayEvents.map(props => <Event {...props} />)}</Div>
            <Div display="flex">
              <Div width="100%" position="relative">
                <Div {...columnProps}>
                  {hours.map((h, idx) => <Cell key={idx} idx={idx} style={{height: rowHeight}} />)}
                  <NowLine {...showNowProps} />
                  {calendar.events.map(props => <Event {...props} />)}
                </Div>
              </Div>
            </Div>
          </CalendarContainer>
        </Container>
      </Div>
    )}
  </DailyCalendar>
)
