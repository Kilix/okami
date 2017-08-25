import React from 'react'
import PropTypes from 'prop-types'
import {storiesOf} from '@storybook/react'
import glamorous, {Div} from 'glamorous'
import format from 'date-fns/format'
import isBefore from 'date-fns/fp/isBefore'

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
  flex: '1 1 14%',
  backgroundColor: '#FAFAFA',
  minHeight: 150,
  maxWidth: '14%',
  padding: 8,
  boxSizing: 'border-box',
  border: '1px solid #FFF',
})
const MonthEvent = ({event}) =>
  <Div color={event.color ? event.color : '#232323'}>
    {event.title}
  </Div>

storiesOf('Sync', module)
  .add('Weekly', () =>
    <Calendar
      data={data}
      startingDay="monday"
      dateFormat="ddd DD/MM"
      hourFormat="ha">
      <WeeklyCalendar
        startHour="PT6H"
        endHour="PT22H"
        Column={Div}
        Cell={Cell}
        Event={Event}>
        {({
          calendar,
          rowHeight,
          nextWeek,
          prevWeek,
          gotoToday,
          getDateLabel,
          getHourLabels,
        }) =>
          <Div display="flex" flexDirection="column">
            <Div display="flex">
              <button onClick={gotoToday}>Today</button>
              <button onClick={prevWeek}>Prev week</button>
              <button onClick={nextWeek}>Next week</button>
              {getDateLabel(DateDisplayer)}
            </Div>
            <Container>
              <Div paddingTop={rowHeight}>
                {getHourLabels(HourLabel)}
              </Div>
              <CalendarContainer>
                {calendar.map((day, idx) =>
                  <Div
                    key={`day_${idx}`}
                    width={`${100 / calendar.length}%`}
                    position="relative">
                    <DayLabel style={{height: rowHeight}} label={day.label} />
                    {day.getColumn()}
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
      hourFormat="ha">
      <DailyCalendar
        startHour="PT6H"
        endHour="PT22H"
        Column={Div}
        Cell={Cell}
        Event={Event}>
        {({
          calendar,
          rowHeight,
          nextDay,
          prevDay,
          gotoToday,
          getDateLabel,
          getHourLabels,
        }) =>
          <Div display="flex" flexDirection="column">
            <Div display="flex">
              <button onClick={gotoToday}>Today</button>
              <button onClick={prevDay}>Prev day</button>
              <button onClick={nextDay}>Next day</button>
              {getDateLabel(DateDisplayer)}
            </Div>
            <Container>
              <Div paddingTop={rowHeight}>
                {getHourLabels(HourLabel)}
              </Div>
              <CalendarContainer>
                <Div width="100%" position="relative">
                  <DayLabel
                    style={{height: rowHeight}}
                    label={calendar.label}
                  />
                  {calendar.getColumn()}
                </Div>
              </CalendarContainer>
            </Container>
          </Div>}
      </DailyCalendar>
    </Calendar>
  )
  .add('Monthly', () =>
    <Calendar data={data} startingDay="monday" dateFormat="DD" hourFormat="ha">
      <MonthlyCalendar Event={MonthEvent}>
        {({
          calendar,
          start,
          rowHeight,
          nextMonth,
          prevMonth,
          gotoToday,
          getDayLabels,
          getDateLabel,
        }) =>
          <Div display="flex" flexDirection="column">
            <Div display="flex">
              <button onClick={gotoToday}>Today</button>
              <button onClick={prevMonth}>Prev month</button>
              <button onClick={nextMonth}>Next month</button>
              {getDateLabel(DateDisplayer)}
            </Div>
            <Div
              justifyContent="flex-start"
              width="100%"
              flexDirection="column"
              alignItems="flex-start">
              <Div display="flex" width="100%">
                {getDayLabels(DayLabel)}
              </Div>
              <Div display="flex" flexWrap="wrap">
                {calendar.map((day, idx) =>
                  <MonthCell>
                    <Div
                      fontSize={13}
                      color={isBefore(start, day.date) ? '#A7A7A7' : '#232323'}
                      padding={2}>
                      {day.label}
                    </Div>
                    {day.getEvents()}
                  </MonthCell>
                )}
              </Div>
            </Div>
          </Div>}
      </MonthlyCalendar>
    </Calendar>
  )
