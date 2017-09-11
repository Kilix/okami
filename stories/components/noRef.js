import React from 'react'
import {Div} from 'glamorous'

import DailyCalendar from '../../src/components/daily'
import Navigation from '../../src/components/navigation'
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
    {({calendar, dayEvents, hours, rowHeight, showNowProps}) => (
      <Div display="flex" flexDirection="column" {...{className, style}}>
        <Div display="flex">
          <Navigation dateFormat="ddd DD MMMM">
            {({next, prev, today, currentDate}) => (
              <Div display="flex">
                <button onClick={today}>Today</button>
                <button onClick={prev}>Prev day</button>
                <button onClick={next}>Next day</button>
                <DateDisplayer children={currentDate} />
              </Div>
            )}
          </Navigation>
        </Div>
        <Container>
          <CalendarContainer style={{flexDirection: 'column'}}>
            {dayEvents.map(props => <Event {...props} />)}
            {calendar.events.map(props => <Event {...props} />)}
          </CalendarContainer>
        </Container>
      </Div>
    )}
  </DailyCalendar>
)
