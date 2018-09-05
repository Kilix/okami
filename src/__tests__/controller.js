import React from 'react'
import Enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import controller from '../controller'

Enzyme.configure({adapter: new Adapter()})

Enzyme.configure({adapter: new Adapter()})

describe('controller', () => {
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
    startWeek: Date.now(),
    currentDay: Date.now(),
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
})
