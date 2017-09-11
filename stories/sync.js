import React from 'react'
import {storiesOf} from '@storybook/react'
import frLocale from 'date-fns/locale/fr'
import parse from 'date-fns/parse'
import isSameDay from 'date-fns/isSameDay'
import {Div} from 'glamorous'

import Calendar from '../src/'
import DailyCalendar from '../src/components/daily'

import Weekly from './components/weekly'
import Daily from './components/daily'
import Monthly from './components/monthly'
import MonthlySync from './components/syncMonth'
import DailySync from './components/syncDaily'
import NoRef from './components/noRef'

import data from './data'
import data2 from './data2'
import datagoogle from './googledata'

const css = document.createElement('style')
css.innerHTML = `
* { box-sizing: border-box; }
`
document.body.appendChild(css)

storiesOf('Sync', module)
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
  .add('Weekly', () => (
    <Calendar
      data={datagoogle.filter(e => e.status !== 'cancelled').map(e => ({
        ...e,
        ...(e.start.dateTime && {
          start: parse(e.start.dateTime, 'YYYY-MM-DDTHH:mm:ss', new Date()),
          end: parse(e.end.dateTime, 'YYYY-MM-DDTHH:mm:ss', new Date()),
          allDay: !isSameDay(e.start.dateTime, e.end.dateTime),
        }),
        ...(e.start.date && {
          allDay: parse(e.start.date, 'YYYY-MM-DD', new Date()),
        }),
        title: e.summary,
      }))}
      startingDay="monday"
      dateFormat="ddd DD/MM"
      hourFormat="HH"
      locale={frLocale}
    >
      <Weekly />
    </Calendar>
  ))
  .add('Monthly', () => (
    <Calendar
      data={data2}
      startingDay="monday"
      dateFormat="dddd"
      hourFormat="HH"
      locale={frLocale}
      rowHeight={30}
    >
      <Monthly />
    </Calendar>
  ))
  .add('Multiple Sync', () => {
    class Sync extends React.Component {
      state = {s: new Date()}
      _setDate = date => this.setState(() => ({s: date}))
      render() {
        return (
          <Calendar
            data={data2}
            startingDay="monday"
            dateFormat="DD"
            hourFormat="HH"
            locale={frLocale}
          >
            <Div display="flex" alignItems="stretch">
              <MonthlySync style={{flex: 2}} onClick={this._setDate} />
              <DailySync start={this.state.s} style={{flex: 1}} />
            </Div>
          </Calendar>
        )
      }
    }
    return <Sync />
  })
  .add('No Column prop', () => (
    <Calendar
      data={data}
      startingDay="monday"
      dateFormat="ddd DD/MM"
      hourFormat="HH"
      startHour="PT3H"
      endHour="PT22H"
      locale={frLocale}
    >
      <NoRef />
    </Calendar>
  ))
