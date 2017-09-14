import React from 'react'
import {shallow} from 'enzyme'

import controller from '../controller'
const createDate = (y, m, d, h = 0, mm = 0, s = 0) => new Date(Date.UTC(y, m, d, h, mm, s))

const defaultContext = {
  locale: {},
  startingDay: 0,
  events: [],
  fevents: [],
  nodes: {},
  dateFormat: '',
  hourFormat: '',
  startHour: '',
  endHour: '',
  type: '',
  rowHeight: 0,
  gotoToday: jest.fn(),
  nextMonth: jest.fn(),
  prevMonth: jest.fn(),
  nextWeek: jest.fn(),
  prevWeek: jest.fn(),
  nextDay: jest.fn(),
  prevDay: jest.fn(),
  dateLabel: jest.fn(),
  startWeek: createDate(),
  currentDay: createDate(),
  showWeekend: true,
  toggleWeekend: jest.fn(),
  offset: 0,
  matrix: [],
}

test('should return all context', () => {
  const enhance = controller()
  const Test = props => <div {...props} />
  const STest = enhance(Test)
  const tree = shallow(<STest />, {context: defaultContext})
  expect(tree.props()).toEqual(defaultContext)
})

test('should pass only selected props', () => {
  const enhance = controller(['events', 'type'])
  const Test = props => <div {...props} />
  const STest = enhance(Test)
  const tree = shallow(<STest />, {context: defaultContext})
  expect(tree.props()).toEqual({type: '', events: []})
})

test('should pass only selected props and override', () => {
  const enhance = controller(['events', 'type'])
  const Test = props => <div {...props} />
  const STest = enhance(Test)
  const tree = shallow(<STest type="month" />, {context: defaultContext})
  expect(tree.props()).toEqual({type: 'month', events: []})
})
