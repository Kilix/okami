import React from 'react'
import Enzyme, {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import toJson from 'enzyme-to-json'
import frLocale from 'date-fns/locale/fr'

import HoursLabels from '../../components/hoursLabels'

Enzyme.configure({adapter: new Adapter()})

describe('HoursLabels', () => {
  describe('daily', () => {
    const ctx = {
      type: 'daily',
      locale: frLocale,
      hourFormat: 'HH',
      showWeekend: true,
      rowHeight: 30,
      endHour: 'PT22H',
      startHour: 'PT06H',
      currentDay: new Date(2017, 9, 10, 0, 0, 0, 0),
    }
    test('render', () => {
      const tree = mount(<HoursLabels />, {context: ctx})
      expect(toJson(tree)).toMatchSnapshot()
    })
    test('render Child', () => {
      const tree = mount(<HoursLabels renderChild={({idx, ...props}) => <span {...props} />} />, {
        context: ctx,
      })
      expect(toJson(tree)).toMatchSnapshot()
    })
    test('function as a Child', () => {
      const tree = mount(
        <HoursLabels>
          {({hours}) => <div>{hours.map((w, idx) => <span key={idx}>{w}</span>)}</div>}
        </HoursLabels>,
        {context: ctx}
      )
      expect(toJson(tree)).toMatchSnapshot()
    })
    test('render with no weekend', () => {
      const tree = mount(<HoursLabels />, {context: {...ctx, showWeekend: false}})
      expect(toJson(tree)).toMatchSnapshot()
    })
  })
  describe('weekly', () => {
    const ctx = {
      type: 'weekly',
      locale: frLocale,
      hourFormat: 'HH',
      showWeekend: true,
      rowHeight: 30,
      endHour: 'PT22H',
      startHour: 'PT06H',
      startWeek: new Date(2017, 9, 10, 0, 0, 0, 0),
      offset: 1,
    }
    test('render', () => {
      const tree = mount(<HoursLabels />, {context: ctx})
      expect(toJson(tree)).toMatchSnapshot()
    })
    test('render with style', () => {
      const tree = mount(<HoursLabels style={{color: 'orange'}} />, {context: ctx})
      expect(toJson(tree)).toMatchSnapshot()
    })
    test('render Child', () => {
      const tree = mount(<HoursLabels renderChild={({idx, ...props}) => <span {...props} />} />, {
        context: ctx,
      })
      expect(toJson(tree)).toMatchSnapshot()
    })
    test('function as a Child', () => {
      const tree = mount(
        <HoursLabels>
          {({hours}) => <div>{hours.map((w, idx) => <span key={idx}>{w}</span>)}</div>}
        </HoursLabels>,
        {context: ctx}
      )
      expect(toJson(tree)).toMatchSnapshot()
    })
    test('render with no weekend', () => {
      const tree = mount(<HoursLabels />, {context: {...ctx, showWeekend: false}})
      expect(toJson(tree)).toMatchSnapshot()
    })
  })
})
