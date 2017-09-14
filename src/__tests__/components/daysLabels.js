import React from 'react'
import {mount} from 'enzyme'
import toJson from 'enzyme-to-json'
import frLocale from 'date-fns/locale/fr'

import DaysLabels from '../../components/daysLabels'

const createDate = (y, m, d, h = 0, mm = 0, s = 0) => new Date(Date.UTC(y, m, d, h, mm, s))

describe('DaysLabels', () => {
  const ctx = {
    locale: frLocale,
    dateFormat: 'DD',
    showWeekend: true,
    rowHeight: 30,
    startWeek: createDate(2017, 9, 10, 0, 0, 0, 0),
  }
  test('render', () => {
    const tree = mount(<DaysLabels />, {context: ctx})
    expect(toJson(tree)).toMatchSnapshot()
  })
  test('render Child', () => {
    const tree = mount(<DaysLabels renderChild={({idx, ...props}) => <span {...props} />} />, {
      context: ctx,
    })
    expect(toJson(tree)).toMatchSnapshot()
  })
  test('function as a Child', () => {
    const tree = mount(
      <DaysLabels>
        {({weeks}) => <div>{weeks.map((w, idx) => <span key={idx}>{w}</span>)}</div>}
      </DaysLabels>,
      {context: ctx}
    )
    expect(toJson(tree)).toMatchSnapshot()
  })
  test('render with no weekend', () => {
    const tree = mount(<DaysLabels />, {context: {...ctx, showWeekend: false}})
    expect(toJson(tree)).toMatchSnapshot()
  })
})
