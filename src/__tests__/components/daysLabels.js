import React from 'react'
import {mount} from 'enzyme'
import toJson from 'enzyme-to-json'
import frLocale from 'date-fns/locale/fr'
import mockdate from 'mockdate'

import DaysLabels from '../../components/daysLabels'

describe('DaysLabels', () => {
  beforeEach(() => {
    mockdate.set('3/3/2017', 0)
  })
  afterEach(() => {
    mockdate.reset()
  })

  const ctx = {
    locale: frLocale,
    dateFormat: 'DD',
    showWeekend: true,
    rowHeight: 30,
    startWeek: new Date(2017, 9, 10, 0, 0, 0, 0),
  }
  test('render', () => {
    const tree = mount(<DaysLabels />, {context: ctx})
    expect(tree.html()).toMatchSnapshot()
  })
  test('render Child', () => {
    const tree = mount(<DaysLabels renderChild={({idx, ...props}) => <span {...props} />} />, {
      context: ctx,
    })
    expect(tree.html()).toMatchSnapshot()
  })
  test('function as a Child', () => {
    const tree = mount(
      <DaysLabels>
        {({weeks}) => <div>{weeks.map((w, idx) => <span key={idx}>{w}</span>)}</div>}
      </DaysLabels>,
      {context: ctx}
    )
    expect(tree.html()).toMatchSnapshot()
  })
  test('render with no weekend', () => {
    const tree = mount(<DaysLabels />, {context: {...ctx, showWeekend: false}})
    expect(tree.html()).toMatchSnapshot()
  })
})
