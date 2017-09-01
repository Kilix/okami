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
  <DailyCalendar startHour="PT6H" endHour="PT22H" showNow {...props}>
    {({
      calendar,
      dayEvents,
      hours,
      rowHeight,
      nextDay,
      prevDay,
      gotoToday,
      dateLabel,
      hourLabels,
      columnProps,
      showNowProps,
      dayEventsContainerProps,
    }) => (
      <Div display="flex" flexDirection="column" {...{className, style}}>
        <Div display="flex">
          <button onClick={gotoToday}>Today</button>
          <button onClick={prevDay}>Prev day</button>
          <button onClick={nextDay}>Next day</button>
          <DateDisplayer children={dateLabel} />
        </Div>
        <Container>
          <Div paddingTop={rowHeight * (dayEvents.length + 1)}>
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
            <Div display="flex">
              <DayLabel children={calendar.label} style={{height: rowHeight}} />
            </Div>
            <Div {...dayEventsContainerProps}>{dayEvents.map(props => <Event {...props} />)}</Div>
            <Div display="flex">
              <Div width="100%" position="relative">
                <Div {...columnProps}>
                  {hours.map((h, idx) => <Cell key={idx} idx={idx} style={{height: rowHeight}} />)}
                  {showNowProps ? (
                    <NowLine title={showNowProps.title} style={showNowProps.style} />
                  ) : null}
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
