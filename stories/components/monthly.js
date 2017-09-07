import React from 'react'
import glamorous, {Div} from 'glamorous'
import getMonth from 'date-fns/getMonth'

import MonthlyCalendar from '../../src/components/monthly'
import WeeklyCalendar from '../../src/components/weekly'
import DailyCalendar from '../../src/components/daily'
import Navigation from '../../src/components/navigation'
import {DayLabel, DateDisplayer, Event, MEvent} from '../dummy'

const MonthCell = glamorous.div(
  {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#FFF',
    boxShadow: 'inset 0 0 0 1px #EDEDED',
  },
  props => ({height: props.h})
)

export default ({className, style, ...props}) => (
  <MonthlyCalendar {...props}>
    {({calendar, start: currentMonth, rowHeight, DaysLabels, dateLabel}) => (
      <Div display="flex" flexDirection="column" {...{className, style}}>
        <Navigation dateFormat="MMMM">
          {({next, prev, today, currentDate}) => (
            <Div display="flex">
              <button onClick={today}>Today</button>
              <button onClick={prev}>Prev month</button>
              <button onClick={next}>Next month</button>
              <DateDisplayer children={currentDate} />
            </Div>
          )}
        </Navigation>
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
              <WeeklyCalendar key={`weekly_${idx}`} start={startWeek}>
                {({calendar: weekly, weekEvents, getContainerProps}) => (
                  <Div position="relative" width="100%">
                    <Div
                      {...getContainerProps({
                        style: {marginTop: rowHeight},
                      })}
                    >
                      {weekEvents.map(props => <Event {...props} />)}
                    </Div>
                    <Div display="flex">
                      {weekly.map(({day}, idx) => (
                        <DailyCalendar key={`daily_cal_${idx}`} start={day} dateFormat="DD">
                          {({calendar: daily, start: currentDay, dateLabel}) => (
                            <MonthCell h={250}>
                              <Div
                                position="absolute"
                                top={4}
                                left={4}
                                opacity={getMonth(currentMonth) === getMonth(currentDay) ? 1 : 0.3}
                              >
                                {dateLabel}
                              </Div>
                              <Div paddingTop={rowHeight} height="100%">
                                {/*daily.events.map((props, idx) => <MEvent {...props} />)*/}
                              </Div>
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
