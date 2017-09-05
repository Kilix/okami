import React from 'react'
import {storiesOf} from '@storybook/react'
import frLocale from 'date-fns/locale/fr'
import {Div} from 'glamorous'
import 'isomorphic-fetch'

import Calendar from '../src/'

import Weekly from './components/weekly'
import Daily from './components/daily'

const css = document.createElement('style')
css.innerHTML = `
* { box-sizing: border-box; }
`
document.body.appendChild(css)
const a = async function() {
  const res = await fetch('http://localhost:3000/events')
  const json = await res.json()
  return json.map(e => ({
    ...e,
    start: e.start.dateTime,
    end: e.end.dateTime,
    title: e.summary,
  }))
}

class App extends React.Component {
  state = {
    events: [],
  }
  componentWillMount() {
    a().then(events => this.setState(() => ({events})))
  }
  render() {
    const Comp = this.props.c
    return (
      <Calendar
        data={this.state.events}
        startingDay="monday"
        dateFormat="ddd DD/MM"
        hourFormat="HH"
        startHour="PT3H"
        endHour="PT22H"
        locale={frLocale}
      >
        <Comp />
      </Calendar>
    )
  }
}

storiesOf('Google', module)
  .add('Daily', () => <App c={Daily} />)
  .add('Weekly', () => <App c={Weekly} />)
