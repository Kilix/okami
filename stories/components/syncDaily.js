import React from 'react'
import {Div} from 'glamorous'

import DailyCalendar from '../../src/components/daily'
import HoursLabels from '../../src/components/hoursLabels'

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
    {({calendar, dayEvents, hours, rowHeight, dateLabel, getColumnProps, showNowProps}) => (
      <Div display="flex" flexDirection="column" {...{className, style}}>
        <Container>
          <Div paddingTop={rowHeight * dayEvents.length}>
            <HoursLabels
              renderChild={props => <HourLabel style={{height: rowHeight}} {...props} />}
            />
          </Div>
          <CalendarContainer style={{flexDirection: 'column'}}>
            <Div>{dayEvents.map(props => <Event {...props} />)}</Div>
            <Div display="flex">
              <Div width="100%" position="relative">
                <Div {...getColumnProps({refKey: 'innerRef'})}>
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
