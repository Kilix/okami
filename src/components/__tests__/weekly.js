import React from 'react'
import {mount} from 'enzyme'
import toJson from 'enzyme-to-json'
import frLocale from 'date-fns/locale/fr'
import format from 'date-fns/format'

import DailyCalendar from '../../components/daily'
import WeeklyCalendar from '../../components/weekly'

describe('WeeklyCalendar', () => {
  const events = [
    {
      id: 1,
      allDay: false,
      start: new Date(2017, 9, 7, 3, 0, 0),
      end: new Date(2017, 9, 7, 14, 0, 0),
    },
    {
      id: 2,
      allDay: false,
      start: new Date(2017, 9, 7, 5, 0, 0),
      end: new Date(2017, 9, 7, 7, 0, 0),
    },
    {
      id: 3,
      allDay: false,
      start: new Date(2017, 9, 7, 12, 30, 0),
      end: new Date(2017, 9, 7, 13, 30, 0),
    },
    {
      id: 4,
      allDay: false,
      start: new Date(2017, 9, 7, 13, 0, 0),
      end: new Date(2017, 9, 7, 14, 30, 0),
    },
    {
      id: 5,
      allDay: false,
      start: new Date(2017, 9, 7, 16, 30, 0),
      end: new Date(2017, 9, 7, 18, 0, 0),
    },
    {
      id: 6,
      allDay: false,
      start: new Date(2017, 9, 7, 17, 0, 0),
      end: new Date(2017, 9, 7, 18, 30, 0),
    },
    {
      id: 7,
      allDay: false,
      start: new Date(2017, 9, 7, 17, 0, 0),
      end: new Date(2017, 9, 7, 17, 30, 0),
    },
  ]
  const fevents = [
    {
      id: 0,
      allDay: true,
      start: new Date(2017, 9, 7, 17, 0, 0),
      end: new Date(2017, 9, 12, 17, 30, 0),
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
    matrix: [],
    locale: frLocale,
    startingDay: 1,
    dateFormat: 'DD',
    hourFormat: 'HH',
    type: 'weekly',
    endHour: 'PT22H',
    startHour: 'PT06H',
    rowHeight: 30,
    showWeekend: true,
    toggleWeekend: jest.fn(),
  }
  test('render', () => {
    const tree = mount(
      <WeeklyCalendar start={new Date(2017, 9, 10, 17, 0, 0)}>
        {({calendar: weekly, weekEvents, getContainerProps, dateLabel}) => (
          <div>
            <span>{dateLabel()}</span>
            <div {...getContainerProps()}>
              {weekEvents.map(({event, ...props}, idx) => <span {...props} />)}
            </div>
            {weekly.map((day, idx) => (
              <DailyCalendar key={`daily_cal_${idx}`} start={day} dateFormat="DD">
                {() => <div />}
              </DailyCalendar>
            ))}
          </div>
        )}
      </WeeklyCalendar>,
      {
        context: ctx,
      }
    )
    expect(toJson(tree)).toMatchSnapshot()
  })
  test('next Week', () => {
    const tree = mount(
      <WeeklyCalendar start={new Date(2017, 9, 9)}>
        {({nextWeek, dateLabel}) => <span onClick={nextWeek}>{dateLabel('WW')}</span>}
      </WeeklyCalendar>,
      {
        context: ctx,
      }
    )
    expect(tree.find('span').html()).toBe('<span>41</span>')
    tree.find('span').simulate('click')
    expect(tree.find('span').html()).toBe('<span>42</span>')
  })
  test('prev Week', () => {
    const tree = mount(
      <WeeklyCalendar start={new Date(2017, 9, 9)}>
        {({prevWeek, dateLabel}) => <span onClick={prevWeek}>{dateLabel('WW')}</span>}
      </WeeklyCalendar>,
      {
        context: ctx,
      }
    )
    expect(tree.find('span').html()).toBe('<span>41</span>')
    tree.find('span').simulate('click')
    expect(tree.find('span').html()).toBe('<span>40</span>')
  })
  test('gotoToday Week', () => {
    const tree = mount(
      <WeeklyCalendar start={new Date(2017, 9, 9)}>
        {({gotoToday, prevWeek, dateLabel}) => (
          <div>
            <button onClick={gotoToday}>Hlo</button>
            <span onClick={prevWeek}>{dateLabel('WW')}</span>
          </div>
        )}
      </WeeklyCalendar>,
      {
        context: ctx,
      }
    )
    expect(tree.find('span').html()).toBe('<span>41</span>')
    tree.find('span').simulate('click')
    expect(tree.find('span').html()).toBe('<span>40</span>')
    tree.find('button').simulate('click')
    expect(tree.find('span').html()).toBe(`<span>${format(new Date(), 'WW')}</span>`)
  })
})
