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
    {({calendar, dayEvents, hours, rowHeight, getColumnProps, showNowProps}) => (
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
          <Div paddingTop={rowHeight * (dayEvents.length + 1)}>
            <HoursLabels
              renderChild={props => <HourLabel style={{height: rowHeight}} {...props} />}
            />
          </Div>
          <CalendarContainer style={{flexDirection: 'column'}}>
            <Div display="flex">
              <DayLabel children={calendar.label} style={{height: rowHeight}} />
            </Div>
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
