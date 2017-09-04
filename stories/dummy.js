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
    alignItems: 'center',
  },
  props => ({
    backgroundColor: props.idx % 2 ? '#EAEAEA' : '#FFF',
  })
)

export const DayLabel = glamorous.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})

export const HourLabel = glamorous.div(
  {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
  },
  props => ({
    backgroundColor: props.idx % 2 ? '#EAEAEA' : '#FFF',
  })
)
const EventDiv = glamorous.div(
  {
    zIndex: 9,
    position: 'relative',
    display: 'flex',
    flexDirecton: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    fontSize: 14,
    color: '#FFF',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    cursor: 'pointer',
    padding: '0 5px',
    border: '1px solid #FFF',
    boxSizing: 'border-box',
  },
  ({event}) => ({
    backgroundColor: event.color ? event.color : '#232323',
  })
)
export const Event = ({event, style}) => (
  <EventDiv style={style} event={event} title={event.title}>
    {event.title}
  </EventDiv>
)

export const NoEvent = props => (
  <Div flex={1} alignSelf="stretch" textAlign="center" lineHeight="30px">
    -
  </Div>
)

export const DateDisplayer = glamorous.div({
  fontSize: 14,
  paddingLeft: 15,
})

export const NowLine = glamorous.div({
  zIndex: 99,
  position: 'absolute',
  backgroundColor: '#12FE23',
  height: 2,
})
