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
    padding: '0 5px',
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
    margin: '0 2px',
    color: '#FFF',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    backgroundColor: '#F23543',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  ({event}) => {
    const delta = differenceInHours(event.start, event.end)
    return {
      visibility: event.title ? 'visible' : 'hidden',
      height: delta > 1 ? 30 * delta - 10 : 20,
    }
  }
)
export const Event = ({event}) =>
  event.render && event.end !== '*'
    ? <EventDiv event={event} title={event.title}>
        {event.title}
      </EventDiv>
    : <EventDiv event={{}} />

export const NoEvent = props =>
  <Div flex={1} alignSelf="stretch" textAlign="center" lineHeight="30px">
    -
  </Div>
