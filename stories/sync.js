import React from 'react'
import PropTypes from 'prop-types'
import {storiesOf} from '@storybook/react'
import css from 'glamorous'

import addDays from 'date-fns/fp/addDays'
import addHours from 'date-fns/fp/addHours'
import differenceInHours from 'date-fns/fp/differenceInHours'

import Calendar, {WeeklyCalendar} from '../src/'

const data = [
  {
    startDate: addDays(1, new Date()),
    endDate: addHours(2, addDays(1, new Date())),
    title: 'CM JS',
    email: 'email@gmail.com',
    accepted: true,
  },
  {
    startDate: addDays(1, new Date()),
    endDate: addHours(2, addDays(1, new Date())),
    title: 'CM Feel Good',
    email: 'email@gmail.com',
    accepted: true,
  },
  {
    startDate: addDays(10, new Date()),
    endDate: addHours(1, addDays(1, new Date())),
    title: 'Gouter',
    email: 'email@gmail.com',
    accepted: false,
  },
  {
    startDate: addHours(2, new Date()),
    endDate: '*',
    title: 'formation JS',
    email: 'email@gmail.com',
    accepted: null,
  },
]
const Container = props =>
  <div
    {...props}
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    }}
  />

const Cell = css.div(
  {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 99,
    padding: 5,
    margin: '0 5px',
    borderRadius: 2,
    color: '#FFF',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    backgroundColor: '#F23543',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  ({data}) => ({
    height:
      data.endDate !== '*'
        ? 20 * (differenceInHours(data.startDate, data.endDate) + 1) - 10
        : 20,
  })
)

storiesOf('Sync', module).add('Basic', () =>
  <Container>
    <Calendar data={data} startingDay="monday" dateFormat="ddd DD">
      <WeeklyCalendar Cell={Cell} />
    </Calendar>
  </Container>
)
