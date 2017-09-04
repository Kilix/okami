import React from 'react'
import glamorous, {Div} from 'glamorous'
import getMonth from 'date-fns/getMonth'

import MonthlyCalendar from '../../src/components/monthly'
import WeeklyCalendar from '../../src/components/weekly'
import DailyCalendar from '../../src/components/daily'
import {DayLabel, DateDisplayer, Event} from '../dummy'

const MonthCell = glamorous.div(
  {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 8,
    boxSizing: 'border-box',
    border: '1px solid #FFF',
    overflow: 'hidden',
  },
  props => ({
    height: props.h,
    opacity: !props.currentMonth ? 0.5 : 1,
  })
)

export default ({className, style, ...props}) => (
  <MonthlyCalendar {...props}>
    {({
      calendar,
      start: currentMonth,
      rowHeight,
      nextMonth,
      prevMonth,
      gotoToday,
      DaysLabels,
      dateLabel,
    }) => (
      <Div display="flex" flexDirection="column" {...{className, style}}>
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
          alignItems="flex-start"
        >
          <DaysLabels
            style={{display: 'flex', width: '100%'}}
            renderChild={props => <DayLabel style={{height: rowHeight}} {...props} />}
          />
          <Div display="flex" flexDirection="column">
            {calendar.map((startWeek, idx) => (
              <WeeklyCalendar key={`weekly_${idx}`} start={startWeek} rowHeight={20}>
                {({calendar: weekly, weekEvents, getContainerProps}) => (
                  <Div position="relative" width="100%">
                    <Div
                      {...getContainerProps({style: {position: 'absolute', marginTop: rowHeight}})}
                      top={0}
                      left={0}
                      width="100%"
                      height="100%"
                    >
                      {weekEvents.map(props => <Event {...props} />)}
                    </Div>
                    <Div display="flex">
                      {weekly.map(({day, offset}, idx) => (
                        <DailyCalendar
                          key={`daily_cal_${idx}`}
                          start={day}
                          dateFormat="DD"
                          rowHeight={20}
                        >
                          {({calendar: daily, start: currentDay, dateLabel}) => (
                            <MonthCell
                              h={250}
                              currentMonth={getMonth(currentMonth) === getMonth(currentDay)}
                            >
                              <Div>{dateLabel}</Div>
                              {daily.events.map((props, idx) => <Event {...props} />)}
                            </MonthCell>
                          )}
                        </DailyCalendar>
                      ))}
                    </Div>
                  </Div>
                )}
              </WeeklyCalendar>
            ))}
          </Div>
        </Div>
      </Div>
    )}
  </MonthlyCalendar>
)
