import React from 'react'
import glamorous, {Div} from 'glamorous'
import differenceInHours from 'date-fns/fp/differenceInHours'

export const Container = glamorous.div({
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'center',
})

export const CalendarContainer = glamorous.div({
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'flex-start',
  width: '100%',
})

export const Cell = glamorous.div(
  {
    flex: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: 30,
    padding: '0 2px',
  },
  props => ({
    backgroundColor: props.idx % 2 ? '#FFF' : '#EAEAEA',
  })
)

export const DayLabel = ({label, ...props}) =>
  <Div
    flex={1}
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    height={30}
    padding={5}>
    {label}
  </Div>

export const HourLabel = ({label, ...props}) =>
  <Div
    flex={1}
    display="flex"
    justifyContent="center"
    alignItems="center"
    width={70}
    height={20}
    padding={5}
    backgroundColor={props.idx % 2 ? '#FFF' : '#EAEAEA'}>
    {label}
  </Div>

const EventDiv = glamorous.div(
  {
    flex: 1,
    zIndex: 99,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    fontSize: 14,
    padding: 5,
    color: '#FFF',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    cursor: 'pointer',
    border: '1px solid #FFF',
  },
  ({event, render}) => {
    const delta = differenceInHours(event.start, event.end)
    return {
      visibility: render ? 'visible' : 'hidden',
      backgroundColor: event.color ? event.color : '#232323',
      height: delta > 1 ? 30 * delta - 10 : 20,
    }
  }
)
export const Event = ({event, render}) =>
  <EventDiv event={event} title={event.title} render={render}>
    {event.title}
  </EventDiv>

export const NoEvent = props =>
  <Div flex={1} alignSelf="stretch" textAlign="center" lineHeight="30px">
    -
  </Div>
