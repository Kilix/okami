import React from 'react'
import PropTypes from 'prop-types'
import {storiesOf} from '@storybook/react'
import glamorous, {Div} from 'glamorous'
import format from 'date-fns/fp/format'
import getMinutes from 'date-fns/fp/getMinutes'
import isBefore from 'date-fns/fp/isBefore'
import frLocale from 'date-fns/locale/fr'

import Calendar, {WeeklyCalendar, DailyCalendar, MonthlyCalendar} from '../src/'

import data from './data'
import {
  Container,
  HourLabel,
  CalendarContainer,
  Cell,
  DayLabel,
  Event,
  NoEvent,
  DateDisplayer,
} from './dummy'

const MonthCell = glamorous.div({
  backgroundColor: '#FAFAFA',
  padding: 8,
  boxSizing: 'border-box',
  border: '1px solid #FFF',
  height: 150,
})
const MonthEvent = ({event}) =>
  <Div color={event.color ? event.color : '#232323'}>
    {event.end !== '*' && format('HH[h]', event.start)} {event.title}
  </Div>

storiesOf('Sync', module)
  .add('Weekly', () =>
    <Calendar
      data={data}
      startingDay="monday"
      dateFormat="ddd DD/MM"
      hourFormat="ha"
      locale={frLocale}>
      <WeeklyCalendar startHour="PT6H" endHour="PT22H">
        {({
          calendar,
          hours,
          rowHeight,
          nextWeek,
          prevWeek,
          gotoToday,
          dateLabel,
          hourLabels,
          columnProps,
        }) =>
          <Div display="flex" flexDirection="column">
            <Div display="flex">
              <button onClick={gotoToday}>Today</button>
              <button onClick={prevWeek}>Prev week</button>
              <button onClick={nextWeek}>Next week</button>
              <DateDisplayer label={dateLabel} />
            </Div>
            <Container>
              <Div paddingTop={rowHeight * 2}>
                {hourLabels.map(({rowHeight, idx, label}) =>
                  <HourLabel
                    key={`hour_label_${idx}`}
                    idx={idx}
                    children={label}
                    style={{height: rowHeight}}
                  />
                )}
              </Div>
              <CalendarContainer>
                {calendar.map((day, idx) =>
                  <Div
                    key={`day_${idx}`}
                    width={`${100 / calendar.length}%`}
                    position="relative">
                    <DayLabel
                      style={{height: rowHeight}}
                      children={day.label}
                    />
                    <Div style={{position: 'relative', height: rowHeight}}>
                      {day.events.fullDay.map(({style, ...props}) =>
                        <Event
                          {...props}
                          style={{...style, height: rowHeight}}
                        />
                      )}
                    </Div>
                    <Div {...columnProps}>
                      {hours.map((h, idx) =>
                        <Cell
                          key={idx}
                          idx={idx}
                          style={{height: rowHeight}}
                          children="-"
                        />
                      )}
                      {day.events.events.map(props => <Event {...props} />)}
                    </Div>
                  </Div>
                )}
              </CalendarContainer>
            </Container>
          </Div>}
      </WeeklyCalendar>
    </Calendar>
  )
  .add('Daily', () =>
    <Calendar
      data={data}
      startingDay="monday"
      dateFormat="ddd DD/MM"
      hourFormat="ha"
      locale={frLocale}>
      <DailyCalendar startHour="PT6H" endHour="PT22H">
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
        }) =>
          <Div display="flex" flexDirection="column">
            <Div display="flex">
              <button onClick={gotoToday}>Today</button>
              <button onClick={prevDay}>Prev day</button>
              <button onClick={nextDay}>Next day</button>
              <DateDisplayer label={dateLabel} />
            </Div>
            <Container>
              <Div paddingTop={rowHeight}>
                {hourLabels.map(({label, rowHeight, idx}) =>
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
                  <DayLabel
                    children={calendar.label}
                    style={{height: rowHeight}}
                  />
                  <Div {...columnProps}>
                    {hours.map((h, idx) =>
                      <Cell
                        key={idx}
                        idx={idx}
                        style={{height: rowHeight}}
                        children="-"
                      />
                    )}
                    {calendar.events.map(props => <Event {...props} />)}
                  </Div>
                </Div>
              </CalendarContainer>
            </Container>
          </Div>}
      </DailyCalendar>
    </Calendar>
  )
  .add('Monthly', () =>
    <Calendar
      data={data}
      startingDay="monday"
      dateFormat="DD"
      hourFormat="ha"
      locale={frLocale}>
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
          <Div display="flex" flexDirection="column">
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
                {dayLabels.map(({label, rowHeight, idx, key}) =>
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
                        <MonthCell
                          key={`cell_${idx}`}
                          style={{
                            opacity: isBefore(start, day.date) ? 0.5 : 1,
                          }}>
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
    </Calendar>
  )
