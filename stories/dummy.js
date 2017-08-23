import React from 'react'
import glamorous from 'glamorous'

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
  <glamorous.Div
    flex={1}
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    height={30}
    padding={5}>
    {label}
  </glamorous.Div>

export const HourLabel = ({label, ...props}) =>
  <glamorous.Div
    flex={1}
    display="flex"
    justifyContent="center"
    alignItems="center"
    width={70}
    height={20}
    padding={5}
    backgroundColor={props.idx % 2 ? '#FFF' : '#EAEAEA'}>
    {label}
  </glamorous.Div>
