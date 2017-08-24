import React from 'react'
import PropTypes from 'prop-types'
import {storiesOf} from '@storybook/react'
import glamorous, {Div} from 'glamorous'
import format from 'date-fns/format'

import Calendar, {WeeklyCalendar} from '../src/'

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

storiesOf('Sync', module).add('Weekly', () =>
  <Calendar data={data} startingDay="monday" dateFormat="ddd DD/MM">
    <WeeklyCalendar
      startHour="PT6H"
      endHour="PT22H"
      Column={Div}
      Cell={Cell}
      Event={Event}
      NoEvent={NoEvent}>
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
