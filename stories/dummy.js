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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: 30,
  },
  props => ({
    backgroundColor: props.idx % 2 ? '#EAEAEA' : '#FFF',
  })
)

export const DayLabel = ({label, style, className, ...props}) =>
  <Div
    flex={1}
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    {...{style, className}}>
    {label}
  </Div>

export const HourLabel = ({label, style, className, ...props}) =>
  <Div
    flex={1}
    display="flex"
    justifyContent="center"
    alignItems="center"
    width={70}
    backgroundColor={props.idx % 2 ? '#EAEAEA' : '#FFF'}
    {...{style, className}}>
    {label}
  </Div>

const EventDiv = glamorous.div(
  {
    zIndex: 9,
    position: 'relative',
    display: 'flex',
    flexDirecton: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    fontSize: 14,
    color: '#FFF',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    cursor: 'pointer',
    padding: 5,
    border: '1px solid #FFF',
    boxSizing: 'border-box',
  },
  ({event}) => ({
    backgroundColor: event.color ? event.color : '#232323',
  })
)
export const Event = ({event, style}) =>
  <EventDiv style={style} event={event} title={event.title}>
    {event.title}
  </EventDiv>

export const NoEvent = props =>
  <Div flex={1} alignSelf="stretch" textAlign="center" lineHeight="30px">
    -
  </Div>

export const DateDisplayer = ({label, ...props}) =>
  <Div fontSize={14} paddingLeft={15} {...props}>
    {label}
  </Div>
