import React from 'react'
import {Div} from 'glamorous'

import WeeklyCalendar from '../../src/components/weekly'
import DailyCalendar from '../../src/components/daily'
import Navigation from '../../src/components/navigation'
import DaysLabels from '../../src/components/daysLabels'
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
  <WeeklyCalendar startHour="PT3H" endHour="PT22H" {...props}>
    {({calendar, weekEvents, rowHeight, toggleWeekend, dateLabel, getContainerProps}) => (
      <Div display="flex" flexDirection="column" {...{className, style}}>
        <Navigation>
          {({next, prev, today, currentDate}) => (
            <Div display="flex">
              <button onClick={today}>Today</button>
              <button onClick={prev}>Prev week</button>
              <button onClick={next}>Next week</button>
              <button onClick={() => toggleWeekend()}>Toggle weekends</button>
              <DateDisplayer children={currentDate} />
            </Div>
          )}
        </Navigation>
        <Container>
          <HoursLabels
            renderChild={props => <HourLabel style={{height: rowHeight}} {...props} />}
          />
          <CalendarContainer style={{flexDirection: 'column'}}>
            <DaysLabels
              style={{display: 'flex'}}
              renderChild={props => <DayLabel style={{height: rowHeight}} {...props} />}
            />
            <Div {...getContainerProps({refKey: 'innerRef'})}>
              {weekEvents.map(props => <Event {...props} />)}
            </Div>
            <Div display="flex">
              {calendar.map((day, idx) => (
                <DailyCalendar key={`daily_cal_${idx}`} showNow start={day}>
                  {({calendar, hours, getColumnProps, showNowProps}) => (
                    <Div display="flex" flex={1}>
                      <Div width="100%" position="relative">
                        <Div {...getColumnProps({refKey: 'innerRef'})} width="100%">
                          {hours.map((h, idx) => (
                            <Cell key={idx} idx={idx} style={{height: rowHeight}} />
                          ))}
                          <NowLine {...showNowProps} />
                          {calendar.events.map(props => <Event {...props} />)}
                        </Div>
                      </Div>
                    </Div>
                  )}
                </DailyCalendar>
              ))}
            </Div>
          </CalendarContainer>
        </Container>
      </Div>
    )}
  </WeeklyCalendar>
)
