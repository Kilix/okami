import Enzyme, {mount} from 'enzyme'
import React from 'react'
import Adapter from 'enzyme-adapter-react-16'

import Calendar from '../../calendar'
import Weekly from '../../components/weekly'
import Daily from '../../components/daily'

Enzyme.configure({adapter: new Adapter()})

describe('Event spanning on multiple days but not allDay', () => {
  const year = new Date().getFullYear()
  const month = new Date().getUTCMonth()
  const date = new Date().getUTCDate()
  const data = [
    {
      id: 1,
      start: new Date(year, month, date, 15).toISOString(),
      end: new Date(year, month, date + 1, 12).toISOString(),
      allDay: false,
    },
  ]

  class Event extends React.Component {
    render() {
      return null
    }
  }
  const wrapper = mount(
    <Calendar dateFormat="ddd DD/MM" hourFormat="HH" data={data} startHour="PT3H" endHour="PT22H">
      <Weekly>
        {({calendar}) => (
          <div>
            {calendar.map((day, index) => (
              <Daily key={index} start={day}>
                {({calendar}) => (
                  <div>{calendar.events.map(event => <Event key={event.id} {...event} />)}</div>
                )}
              </Daily>
            ))}
          </div>
        )}
      </Weekly>
    </Calendar>
  )

  const events = wrapper.find(Event)
  it('should render an <Event /> per day', () => {
    expect(events.length).toBe(2)
  })

  it('should pass the proper style to the events', () => {
    // see utils/placeEvents for more details
    expect(events.at(0).props().style).toEqual({
      position: 'absolute',
      left: '0%',
      width: '100%',
      top: (15 - 3) * 30,
      height: (22 - 15) * 30,
    })
    expect(events.at(1).props().style).toEqual({
      position: 'absolute',
      left: '0%',
      width: '100%',
      top: 0,
      height: (12 - 3) * 30,
    })
  })
})
