import React from 'react'
import {storiesOf} from '@storybook/react'
import frLocale from 'date-fns/locale/fr'
import {Div} from 'glamorous'

import Calendar from '../src/'

import Weekly from './components/weekly'
import Daily from './components/daily'
import Monthly from './components/monthly'

import data from './data'
import data2 from './data2'

const css = document.createElement('style')
css.innerHTML = `
* { box-sizing: border-box; }
`
document.body.appendChild(css)

storiesOf('Sync', module)
  .add('Weekly', () => (
    <Calendar
      data={data}
      startingDay="monday"
      dateFormat="ddd DD/MM"
      hourFormat="HH"
      locale={frLocale}
    >
      <Weekly />
    </Calendar>
  ))
  .add('Daily', () => (
    <Calendar
      data={data}
      startingDay="monday"
      dateFormat="ddd DD/MM"
      hourFormat="HH"
      startHour="PT3H"
      endHour="PT22H"
      locale={frLocale}
    >
      <Daily />
    </Calendar>
  ))
  .add('Monthly', () => (
    <Calendar
      data={data2}
      startingDay="monday"
      dateFormat="dddd"
      hourFormat="HH"
      locale={frLocale}
      rowHeight={20}
    >
      <Monthly />
    </Calendar>
  ))
  .add('Multiple', () => (
    <Calendar data={data} startingDay="monday" dateFormat="DD" hourFormat="HH" locale={frLocale}>
      <Div display="flex" alignItems="stretch">
        <Monthly style={{flex: 2}} />
        <Daily style={{flex: 1}} />
      </Div>
    </Calendar>
  ))
