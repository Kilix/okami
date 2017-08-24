import React from 'react'
import PropTypes from 'prop-types'
import {storiesOf} from '@storybook/react'
import glamorous, {Div} from 'glamorous'
import differenceInHours from 'date-fns/fp/differenceInHours'

import Calendar, {WeeklyCalendar} from '../src/'

import {Container, HourLabel, CalendarContainer, Cell, DayLabel} from './dummy'
import data from './data'

const EventDiv = glamorous.div(
  {
    flex: 1,
    zIndex: 99,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    fontSize: 14,
    padding: 5,
    margin: '0 2px',
    color: '#FFF',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    backgroundColor: '#F23543',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  ({event}) => {
    const delta = differenceInHours(event.start, event.end)
    return {
      visibility: event.title ? 'visible' : 'hidden',
      height: delta > 1 ? 30 * delta - 10 : 20,
    }
  }
)
const Event = ({event}) =>
  event.render && event.end !== '*'
    ? <EventDiv event={event} title={event.title}>
        {event.title}
      </EventDiv>
    : <EventDiv event={{}} />

const NoEvent = props =>
  <Div flex={1} alignSelf="stretch" textAlign="center" lineHeight="30px">
    -
  </Div>

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
