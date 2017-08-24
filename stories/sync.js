import React from 'react'
import PropTypes from 'prop-types'
import {storiesOf} from '@storybook/react'
import glamorous, {Div} from 'glamorous'

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
} from './dummy'

storiesOf('Sync', module).add('Basic', () =>
  <Calendar data={data} startingDay="monday" dateFormat="ddd DD/MM">
    <WeeklyCalendar
      startHour="PT6H"
      endHour="PT22H"
      HourLabel={HourLabel}
      Cell={Cell}
      Event={Event}
      NoEvent={NoEvent}>
      {({calendar, hours, nextWeek, prevWeek, gotoToday}) =>
        <Div display="flex" flexDirection="column">
          <div>
            <button onClick={gotoToday}>Return to today</button>
            <button onClick={prevWeek}>Prev week</button>
            <button onClick={nextWeek}>Next week</button>
          </div>
          <Container>
            <Div paddingTop={40}>
              {hours}
            </Div>
            <CalendarContainer>
              {calendar.map((day, idx) =>
                <Div key={`day_${idx}`} width={`${100 / calendar.length}%`}>
                  <DayLabel label={day.label} />
                  {day.hours}
                </Div>
              )}
            </CalendarContainer>
          </Container>
        </Div>}
    </WeeklyCalendar>
  </Calendar>
)
