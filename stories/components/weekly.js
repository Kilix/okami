import React from 'react'
import {Div} from 'glamorous'

import WeeklyCalendar from '../../src/components/weekly'

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

export default ({className, style, ...props}) =>
  <WeeklyCalendar startHour="PT3H" endHour="PT22H" showNow {...props}>
    {({
      calendar,
      weekEvents,
      hours,
      rowHeight,
      nextWeek,
      prevWeek,
      gotoToday,
      toggleWeekend,
      dateLabel,
      dayLabels,
      hourLabels,
      columnProps,
      weekEventsContainerProps,
    }) =>
      <Div display="flex" flexDirection="column" {...{className, style}}>
        <Div display="flex">
          <button onClick={gotoToday}>Today</button>
          <button onClick={prevWeek}>Prev week</button>
          <button onClick={nextWeek}>Next week</button>
          <button onClick={() => toggleWeekend()}>Toggle weekends</button>
          <DateDisplayer children={dateLabel} />
        </Div>
        <Container>
          <Div paddingTop={rowHeight * (weekEvents.length + 1)}>
            {hourLabels.map(({idx, label}) =>
              <HourLabel
                key={`hour_label_${idx}`}
                idx={idx}
                children={label}
                style={{height: rowHeight}}
              />
            )}
          </Div>
          <CalendarContainer style={{flexDirection: 'column'}}>
            <Div display="flex">
              {dayLabels.map(({idx, label}) =>
                <DayLabel style={{height: rowHeight}} children={label} />
              )}
            </Div>
            <Div {...weekEventsContainerProps}>
              {weekEvents.map(props => <Event {...props} />)}
            </Div>
            <Div display="flex">
              {calendar.map((day, idx) =>
                <Div
                  key={`day_${idx}`}
                  width={`${100 / calendar.length}%`}
                  position="relative">
                  <Div {...columnProps}>
                    {hours.map((h, idx) =>
                      <Cell key={idx} idx={idx} style={{height: rowHeight}} />
                    )}
                    {day.showNowProps
                      ? <NowLine
                          title={day.showNowProps.title}
                          style={day.showNowProps.style}
                        />
                      : null}
                    {day.events.map(props => <Event {...props} />)}
                  </Div>
                </Div>
              )}
            </Div>
          </CalendarContainer>
        </Container>
      </Div>}
  </WeeklyCalendar>
