import React from 'react'
import PropTypes from 'prop-types'
import {storiesOf} from '@storybook/react'
import glamorous from 'glamorous'

import addDays from 'date-fns/fp/addDays'
import addHours from 'date-fns/fp/addHours'
import differenceInHours from 'date-fns/fp/differenceInHours'
import startOfHour from 'date-fns/startOfHour'

import Calendar, {WeeklyCalendar} from '../src/'

import {Container, HourLabel, CalendarContainer, Cell, DayLabel} from './dummy'

const data = [
  {
    start: startOfHour(addDays(1, new Date())),
    end: startOfHour(addHours(2, addDays(1, new Date()))),
    title: 'CM JS',
    email: 'email@gmail.com',
    accepted: true,
  },
  {
    start: startOfHour(addDays(1, new Date())),
    end: startOfHour(addHours(2, addDays(1, new Date()))),
    title: 'CM Feel Good',
    email: 'email@gmail.com',
    accepted: true,
  },
  {
    start: startOfHour(addHours(1, addDays(1, new Date()))),
    end: startOfHour(addHours(2, addDays(1, new Date()))),
    title: 'CM Java',
    email: 'email@gmail.com',
    accepted: true,
  },
  {
    start: startOfHour(addHours(1, addDays(1, new Date()))),
    end: '*',
    title: 'Bid',
    email: 'email@gmail.com',
    accepted: true,
  },
  {
    start: startOfHour(addDays(10, new Date())),
    end: startOfHour(addHours(1, addDays(10, new Date()))),
    title: 'Gouter',
    email: 'email@gmail.com',
    accepted: false,
  },
  {
    start: startOfHour(addHours(2, new Date())),
    end: '*',
    title: 'formation JS',
    email: 'email@gmail.com',
    accepted: null,
  },
]

const Event = glamorous.div(
  {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 99,
    padding: 5,
    margin: '0 2px',
    color: '#FFF',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    backgroundColor: '#F23543',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  ({data}) => {
    const delta = differenceInHours(data.start, data.end)
    return {
      height: delta > 1 ? 30 * delta - 10 : 20,
    }
  }
)

const NoEvent = props =>
  <glamorous.Div
    flex={1}
    alignSelf="stretch"
    textAlign="center"
    lineHeight="30px">
    -
  </glamorous.Div>

storiesOf('Sync', module).add('Basic', () =>
  <Calendar data={data} startingDay="monday" dateFormat="ddd DD">
    <WeeklyCalendar
      startHour="PT6H"
      endHour="PT22H"
      HourLabel={HourLabel}
      Cell={Cell}
      Event={Event}
      NoEvent={NoEvent}>
      {({calendar, hours, nextWeek, prevWeek, gotoToday}) =>
        <glamorous.Div display="flex" flexDirection="column">
          <glamorous.Div>
            <button onClick={gotoToday}>Return to today</button>
            <button onClick={prevWeek}>Prev week</button>
            <button onClick={nextWeek}>Next week</button>
          </glamorous.Div>
          <Container>
            <glamorous.Div paddingTop={40}>
              {hours}
            </glamorous.Div>
            <CalendarContainer>
              {calendar.map((day, idx) => {
                return (
                  <glamorous.Div
                    key={`day_${idx}`}
                    width={`${100 / calendar.length}%`}>
                    <DayLabel label={day.label} />
                    {day.hours}
                  </glamorous.Div>
                )
              })}
            </CalendarContainer>
          </Container>
        </glamorous.Div>}
    </WeeklyCalendar>
  </Calendar>
)
