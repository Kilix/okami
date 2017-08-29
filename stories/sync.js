import React from 'react'
import {storiesOf} from '@storybook/react'
import frLocale from 'date-fns/locale/fr'
import {Div} from 'glamorous'

import Calendar from '../src/'

import Weekly from './components/weekly'
import Daily from './components/daily'
import Monthly from './components/monthly'

import data from './data'

storiesOf('Sync', module)
  .add('Weekly', () =>
    <Calendar
      data={data}
      startingDay="monday"
      dateFormat="ddd DD/MM"
      hourFormat="HH"
      locale={frLocale}>
      <Weekly />
    </Calendar>
  )
  .add('Daily', () =>
    <Calendar
      data={data}
      startingDay="monday"
      dateFormat="ddd DD/MM"
      hourFormat="HH"
      locale={frLocale}>
      <Daily />
    </Calendar>
  )
  .add('Monthly', () =>
    <Calendar
      data={data}
      startingDay="monday"
      dateFormat="DD"
      hourFormat="HH"
      locale={frLocale}>
      <Monthly />
    </Calendar>
  )
  .add('Multiple', () =>
    <Calendar
      data={data}
      startingDay="monday"
      dateFormat="DD"
      hourFormat="HH"
      locale={frLocale}>
      <Div display="flex" alignItems="stretch">
        <Monthly style={{flex: 2}} />
        <Daily style={{flex: 1}} />
      </Div>
    </Calendar>
  )
