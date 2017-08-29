import React from 'react'
import PropTypes from 'prop-types'
import {storiesOf} from '@storybook/react'
import glamorous, {Div} from 'glamorous'
import format from 'date-fns/fp/format'
import getMinutes from 'date-fns/fp/getMinutes'
import isBefore from 'date-fns/fp/isBefore'
import frLocale from 'date-fns/locale/fr'

import Calendar, {WeeklyCalendar, DailyCalendar, MonthlyCalendar} from '../src/'

import data from './data'
import {
  Container,
  HourLabel,
  CalendarContainer,
  Cell,
  DayLabel,
  Event,
  NoEvent,
  DateDisplayer,
} from './dummy'

const MonthCell = glamorous.div(
  {
    backgroundColor: '#FAFAFA',
    padding: 8,
    boxSizing: 'border-box',
    border: '1px solid #FFF',
    height: 150,
    overflow: 'hidden',
  },
  props => ({
    opacity: isBefore(props.start, props.day.date) ? 0.5 : 1,
  })
)
const MonthEvent = ({event}) =>
  <Div color={event.color ? event.color : '#232323'}>
    {event.end !== '*' && format('HH[h]', event.start)} {event.title}
  </Div>

storiesOf('Sync', module)
  .add('Weekly', () =>
    <Calendar
      data={data}
      startingDay="monday"
      dateFormat="ddd DD/MM"
      hourFormat="HH"
      locale={frLocale}>
      <WeeklyCalendar startHour="PT3H" endHour="PT22H" showNow>
        {({
          calendar,
          hours,
          rowHeight,
          nextWeek,
          prevWeek,
          gotoToday,
          toggleWeekend,
          dateLabel,
          hourLabels,
          columnProps,
        }) =>
          <Div display="flex" flexDirection="column">
            <Div display="flex">
              <button onClick={gotoToday}>Today</button>
              <button onClick={prevWeek}>Prev week</button>
              <button onClick={nextWeek}>Next week</button>
              <button onClick={() => toggleWeekend()}>Toggle weekends</button>
              <DateDisplayer children={dateLabel} />
            </Div>
            <Container>
              <Div paddingTop={rowHeight * 2}>
                {hourLabels.map(({idx, label}) =>
                  <HourLabel
                    key={`hour_label_${idx}`}
                    idx={idx}
                    children={label}
                    style={{height: rowHeight}}
                  />
                )}
              </Div>
              <CalendarContainer>
                {calendar.map((day, idx) =>
                  <Div
                    key={`day_${idx}`}
                    width={`${100 / calendar.length}%`}
                    position="relative">
                    <DayLabel
                      style={{height: rowHeight}}
                      children={day.label}
                    />
                    <Div style={{display: 'flex', height: rowHeight}}>
                      {day.fullDay.map(({style, ...props}, idx) =>
                        <Event
                          {...props}
                          style={{flex: 1, height: rowHeight}}
                        />
                      )}
                    </Div>
                    <Div {...columnProps}>
                      {hours.map((h, idx) =>
                        <Cell
                          key={idx}
                          idx={idx}
                          style={{height: rowHeight}}
                          children="-"
                        />
                      )}
                      {day.showNowProps
                        ? <Div
                            title={day.showNowProps.title}
                            style={{
                              zIndex: 99,
                              position: 'absolute',
                              backgroundColor: '#12FE23',
                              height: 2,
                              ...day.showNowProps.style,
                            }}
                          />
                        : null}
                      {day.events.map(props => <Event {...props} />)}
                    </Div>
                  </Div>
                )}
              </CalendarContainer>
            </Container>
          </Div>}
      </WeeklyCalendar>
    </Calendar>
  )
  .add('Daily', () =>
    <Calendar
      data={data}
      startingDay="monday"
      dateFormat="ddd DD/MM"
      hourFormat="HH"
      locale={frLocale}>
      <DailyCalendar startHour="PT6H" endHour="PT22H" showNow>
        {({
          calendar,
          hours,
          rowHeight,
          nextDay,
          prevDay,
          gotoToday,
          dateLabel,
          hourLabels,
          columnProps,
          showNowProps,
        }) =>
          <Div display="flex" flexDirection="column">
            <Div display="flex">
              <button onClick={gotoToday}>Today</button>
              <button onClick={prevDay}>Prev day</button>
              <button onClick={nextDay}>Next day</button>
              <DateDisplayer children={dateLabel} />
            </Div>
            <Container>
              <Div paddingTop={rowHeight * 2}>
                {hourLabels.map(({label, idx}) =>
                  <HourLabel
                    key={`hour_label_${idx}`}
                    idx={idx}
                    children={label}
                    style={{height: rowHeight}}
                  />
                )}
              </Div>
              <CalendarContainer>
                <Div width="100%" position="relative">
                  <DayLabel
                    children={calendar.label}
                    style={{height: rowHeight}}
                  />
                  <Div style={{display: 'flex', height: rowHeight}}>
                    {calendar.fullDay.map(({style, ...props}, idx) =>
                      <Event {...props} style={{flex: 1, height: rowHeight}} />
                    )}
                  </Div>
                  <Div {...columnProps}>
                    {hours.map((h, idx) =>
                      <Cell
                        key={idx}
                        idx={idx}
                        style={{height: rowHeight}}
                        children="-"
                      />
                    )}
                    {showNowProps
                      ? <Div
                          title={showNowProps.title}
                          style={{
                            zIndex: 99,
                            position: 'absolute',
                            backgroundColor: '#12FE23',
                            height: 2,
                            ...showNowProps.style,
                          }}
                        />
                      : null}
                    {calendar.events.map(props => <Event {...props} />)}
                  </Div>
                </Div>
              </CalendarContainer>
            </Container>
          </Div>}
      </DailyCalendar>
    </Calendar>
  )
  .add('Monthly', () =>
    <Calendar
      data={data}
      startingDay="monday"
      dateFormat="DD"
      hourFormat="HH"
      locale={frLocale}>
      <MonthlyCalendar>
        {({
          calendar,
          start,
          rowHeight,
          nextMonth,
          prevMonth,
          gotoToday,
          dayLabels,
          dateLabel,
          columnProps,
        }) =>
          <Div display="flex" flexDirection="column">
            <Div display="flex">
              <button onClick={gotoToday}>Today</button>
              <button onClick={prevMonth}>Prev month</button>
              <button onClick={nextMonth}>Next month</button>
              <DateDisplayer children={dateLabel} />
            </Div>
            <Div
              justifyContent="flex-start"
              width="100%"
              flexDirection="column"
              alignItems="flex-start">
              <Div display="flex" width="100%">
                {dayLabels.map(({label, idx, key}) =>
                  <DayLabel
                    key={key}
                    idx={idx}
                    children={label}
                    style={{height: rowHeight}}
                  />
                )}
              </Div>
              <Div display="flex">
                {calendar.map((column, idx) =>
                  <Div
                    key={`column_${idx}`}
                    {...columnProps}
                    style={{
                      width: `${100 / 7}%`,
                      position: 'relative',
                    }}>
                    <Div>
                      {column.map((day, idx) =>
                        <MonthCell key={`cell_${idx}`} start={start} day={day}>
                          <Div
                            fontSize={13}
                            color={
                              isBefore(start, day.date) ? '#A7A7A7' : '#232323'
                            }
                            padding={2}>
                            {day.label}
                          </Div>
                          {day.events.map(props => <MonthEvent {...props} />)}
                        </MonthCell>
                      )}
                    </Div>
                  </Div>
                )}
              </Div>
            </Div>
          </Div>}
      </MonthlyCalendar>
    </Calendar>
  )
