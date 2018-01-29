import React from 'react'
import Enzyme, {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-15'
import toJson from 'enzyme-to-json'

import Navigation from '../../components/navigation'

Enzyme.configure({adapter: new Adapter()})

describe('Navigation', () => {
  const dailyCtx = {
    type: 'daily',
    gotoToday: jest.fn(),
    nextDay: jest.fn(),
    prevDay: jest.fn(),
    toggleWeekend: jest.fn(),
    dateLabel: jest.fn(),
  }
  const weeklyCtx = {
    type: 'weekly',
    gotoToday: jest.fn(),
    nextWeek: jest.fn(),
    prevWeek: jest.fn(),
    toggleWeekend: jest.fn(),
    dateLabel: jest.fn(),
  }
  const monthlyCtx = {
    type: 'monthly',
    gotoToday: jest.fn(),
    nextMonth: jest.fn(),
    prevMonth: jest.fn(),
    toggleWeekend: jest.fn(),
    dateLabel: jest.fn(),
  }
  test('daily', () => {
    const tree = mount(<Navigation>{() => <div />}</Navigation>, {context: dailyCtx})
    expect(toJson(tree)).toMatchSnapshot()
  })
  test('weekly', () => {
    const tree = mount(<Navigation>{() => <div />}</Navigation>, {context: weeklyCtx})
    expect(toJson(tree)).toMatchSnapshot()
  })
  test('monthly', () => {
    const tree = mount(<Navigation>{() => <div />}</Navigation>, {context: monthlyCtx})
    expect(toJson(tree)).toMatchSnapshot()
  })

  test('should pass next day', () => {
    const tree = mount(<Navigation>{({next}) => <span onClick={next} />}</Navigation>, {
      context: dailyCtx,
    })
    tree.find('span').simulate('click')
    expect(dailyCtx.nextDay.mock.calls.length).toBe(1)
  })

  test('should pass prev day', () => {
    const tree = mount(<Navigation>{({prev}) => <span onClick={prev} />}</Navigation>, {
      context: dailyCtx,
    })
    tree.find('span').simulate('click')
    expect(dailyCtx.prevDay.mock.calls.length).toBe(1)
  })

  test('should pass next week', () => {
    const tree = mount(<Navigation>{({next}) => <span onClick={next} />}</Navigation>, {
      context: weeklyCtx,
    })
    tree.find('span').simulate('click')
    expect(weeklyCtx.nextWeek.mock.calls.length).toBe(1)
  })

  test('should pass prev week', () => {
    const tree = mount(<Navigation>{({prev}) => <span onClick={prev} />}</Navigation>, {
      context: weeklyCtx,
    })
    tree.find('span').simulate('click')
    expect(weeklyCtx.prevWeek.mock.calls.length).toBe(1)
  })

  test('should pass next month', () => {
    const tree = mount(<Navigation>{({next}) => <span onClick={next} />}</Navigation>, {
      context: monthlyCtx,
    })
    tree.find('span').simulate('click')
    expect(monthlyCtx.nextMonth.mock.calls.length).toBe(1)
  })

  test('should pass prev month', () => {
    const tree = mount(<Navigation>{({prev}) => <span onClick={prev} />}</Navigation>, {
      context: monthlyCtx,
    })
    tree.find('span').simulate('click')
    expect(monthlyCtx.prevMonth.mock.calls.length).toBe(1)
  })

  test('should go to today', () => {
    const tree = mount(<Navigation>{({today}) => <span onClick={today} />}</Navigation>, {
      context: dailyCtx,
    })
    tree.find('span').simulate('click')
    expect(dailyCtx.gotoToday.mock.calls.length).toBe(1)
  })
})
