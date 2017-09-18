import React from 'react'
import {mount} from 'enzyme'
import toJson from 'enzyme-to-json'
import frLocale from 'date-fns/locale/fr'
import format from 'date-fns/format'
import lolex from 'lolex'

import DailyCalendar from '../../components/daily'

describe('DailyCalendar', () => {
  beforeEach(() => {
    lolex.createClock(new Date(2017, 9, 9))
  })
  const events = [
    {
      allDay: false,
      start: new Date(2017, 9, 7, 3, 0, 0),
      end: new Date(2017, 9, 7, 14, 0, 0),
    },
    {
      allDay: false,
      start: new Date(2017, 9, 7, 5, 0, 0),
      end: new Date(2017, 9, 7, 7, 0, 0),
    },
    {
      allDay: false,
      start: new Date(2017, 9, 7, 12, 30, 0),
      end: new Date(2017, 9, 7, 13, 30, 0),
    },
    {
      allDay: false,
      start: new Date(2017, 9, 7, 13, 0, 0),
      end: new Date(2017, 9, 7, 14, 30, 0),
    },
    {
      allDay: false,
      start: new Date(2017, 9, 7, 16, 30, 0),
      end: new Date(2017, 9, 7, 18, 0, 0),
    },
    {
      allDay: false,
      start: new Date(2017, 9, 7, 17, 0, 0),
      end: new Date(2017, 9, 7, 18, 30, 0),
    },
    {
      allDay: false,
      start: new Date(2017, 9, 7, 17, 0, 0),
      end: new Date(2017, 9, 7, 17, 30, 0),
    },
  ]
  const fevents = [
    {
      allDay: true,
      start: new Date(2017, 9, 7, 17, 0, 0),
      end: new Date(2017, 9, 8, 17, 30, 0),
    },
  ]
  const nodes = {
    0: {level: 0, children: [1, 2, 3], depth: 3},
    1: {level: 1, children: [], depth: 3},
    2: {level: 1, children: [3], depth: 3},
    3: {level: 2, children: [], depth: 3},
    4: {level: 0, children: [5, 6], depth: 2},
    5: {level: 1, children: [], depth: 2},
    6: {level: 1, children: [], depth: 2},
  }

  const ctx = {
    events,
    fevents,
    nodes,
    locale: frLocale,
    dateFormat: 'DD',
    hourFormat: 'HH',
    matrix: [],
    type: 'daily',
    endHour: 'PT22H',
    startHour: 'PT06H',
    rowHeight: 30,
  }
  test('render', () => {
    const tree = mount(
      <DailyCalendar start={new Date(2017, 9, 9, 0, 0, 0, 0)}>
        {({getColumnProps}) => <div {...getColumnProps()} />}
      </DailyCalendar>,
      {
        context: ctx,
      }
    )
    expect(toJson(tree)).toMatchSnapshot()
  })
  test('next Day', () => {
    const tree = mount(
      <DailyCalendar start={new Date(2017, 9, 9)}>
        {({nextDay, dateLabel}) => <span onClick={nextDay}>{dateLabel('DD')}</span>}
      </DailyCalendar>,
      {
        context: ctx,
      }
    )
    expect(tree.find('span').html()).toBe('<span>09</span>')
    tree.find('span').simulate('click')
    expect(tree.find('span').html()).toBe('<span>10</span>')
  })
  test('prev Day', () => {
    const tree = mount(
      <DailyCalendar start={new Date(2017, 9, 9)}>
        {({prevDay, dateLabel}) => <span onClick={prevDay}>{dateLabel('DD')}</span>}
      </DailyCalendar>,
      {
        context: ctx,
      }
    )
    expect(tree.find('span').html()).toBe('<span>09</span>')
    tree.find('span').simulate('click')
    expect(tree.find('span').html()).toBe('<span>08</span>')
  })
  test('gotoToday Day', () => {
    const tree = mount(
      <DailyCalendar start={new Date(2017, 9, 9)}>
        {({gotoToday, prevDay, dateLabel}) => (
          <div>
            <button onClick={gotoToday}>Hlo</button>
            <span onClick={prevDay}>{dateLabel('DD')}</span>
          </div>
        )}
      </DailyCalendar>,
      {
        context: ctx,
      }
    )
    expect(tree.find('span').html()).toBe('<span>09</span>')
    tree.find('span').simulate('click')
    expect(tree.find('span').html()).toBe('<span>08</span>')
    tree.find('button').simulate('click')
    expect(tree.find('span').html()).toBe(`<span>18</span>`)
  })
})
