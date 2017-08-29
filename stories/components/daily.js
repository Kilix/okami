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
} from '../dummy'

export default ({className, style, ...props}) =>
  <DailyCalendar startHour="PT6H" endHour="PT22H" showNow {...props}>
    {({
      calendar,
      hours,
      rowHeight,
      nextDay,
      prevDay,
      gotoToday,
      dateLabel,
      hourLabels,
      columnProps,
      showNowProps,
    }) =>
      <Div display="flex" flexDirection="column" {...{className, style}}>
        <Div display="flex">
          <button onClick={gotoToday}>Today</button>
          <button onClick={prevDay}>Prev day</button>
          <button onClick={nextDay}>Next day</button>
          <DateDisplayer children={dateLabel} />
        </Div>
        <Container>
          <Div paddingTop={rowHeight * 2}>
            {hourLabels.map(({label, idx}) =>
              <HourLabel
                key={`hour_label_${idx}`}
                idx={idx}
                children={label}
                style={{height: rowHeight}}
              />
            )}
          </Div>
          <CalendarContainer>
            <Div width="100%" position="relative">
              <DayLabel children={calendar.label} style={{height: rowHeight}} />
              <Div style={{display: 'flex', height: rowHeight}} />
              <Div {...columnProps}>
                {hours.map((h, idx) =>
                  <Cell
                    key={idx}
                    idx={idx}
                    style={{height: rowHeight}}
                    children="-"
                  />
                )}
                {showNowProps
                  ? <Div
                      title={showNowProps.title}
                      style={{
                        zIndex: 99,
                        position: 'absolute',
                        backgroundColor: '#12FE23',
                        height: 2,
                        ...showNowProps.style,
                      }}
                    />
                  : null}
                {calendar.events.map(props => <Event {...props} />)}
              </Div>
            </Div>
          </CalendarContainer>
        </Container>
      </Div>}
  </DailyCalendar>
