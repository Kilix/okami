# Okami


## Project status
We've come a long way, but this project is still in Alpha, lots of development is happening, API might change, beware of the Dragons 🐉.

## Introduction
It's a set of Primitives React Components to build a Calendar. Handle the logic so you can focus on UI/UX. Similar to [downshift](https://github.com/paypal/downshift) or [selectless](https://github.com/Kilix/selectless).

We use composition to construct the calendar, which simply means:

- A monthly calendar is composed of weekly calendar.
- A weekly calendar is composed of daily calendar.

This allow to have a lot fo flexibility without repeating the logic and avoid complexity.

We strongly recommend to use `okami` with [date-fns](https://date-fns.org/).

## Install

```yarn add okami```
```npm install --save okami```

## Basic Usage

For more examples, look at the storybook :)

```jsx

import React from 'react'
import frLocale from 'date-fns/locale/fr'
import { Calendar, DailyCalendar } from 'okami'

import data from './stories/data'

const Container = props =>
  <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center'}} {...props} />

const CalendarContainer = props =>
  <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'flex-start', width: '100%' }} {...props} />

export default props => (
  <Calendar
    data={data}
    startingDay="monday"
    dateFormat="ddd DD/MM"
    hourFormat="HH"
    startHour="PT3H"
    endHour="PT22H"
    locale={frLocale}
  >
    <DailyCalendar showNow {...props}>
      {({calendar, dayEvents}) => (
        <div style={{display: 'flex', flexDirection:'column'}}>
          <div style={{display:'flex'}}>
            <Navigation dateFormat="ddd DD MMMM">
              {({next, prev, today, currentDate}) => (
                <div style={{display:'flex'}}>
                  <button onClick={today}>Today</button>
                  <button onClick={prev}>Prev day</button>
                  <button onClick={next}>Next day</button>
                  <span>{currentDate}</span>
                </div>
              )}
            </Navigation>
          </div>
          <Container>
            <CalendarContainer style={{flexDirection: 'column'}}>
              {dayEvents.map(props => <Event {...props} />)}
              {calendar.events.map(props => <Event {...props} />)}
            </CalendarContainer>
          </Container>
        </div>
      )}
    </DailyCalendar>
  </Calendar>
)

```

## Documentation

### Props Calendar

| property      | type      | required | default    | description                  |
|---------------|-----------|----------|------------|------------------------------|
| `data`        | `array`   | yes      | -          | List of events               |
| `startHour`   | `string`  | no       | PT0H       | Hour to start the calendar   |
| `endHour`     | `string`  | no       | PT24H      | Hour to end the calendar     |
| `dateFormat`  | `string`  | no       | MM/DD/YYYY | Format of the date string    |
| `hourFormat`  | `string`  | no       | HH:mm      | Format of the hour string    |
| `startingDay` | `string`  | no       | sunday     | Starting day of the week     |
| `locale`      | `object`  | no       | en         | Local from `date-fns`        |
| `rowHeight`   | `number`  | no       | 30         | Height of a row              |

To define property that will be use as duration like `startHours` or `endHour`.
We use [ISO-8601](https://fr.wikipedia.org/wiki/ISO_8601) format for durations.

Every prop passed to Calendat can be overwritten as the sub component level.

```jsx
  <Calendar
    data={data}
    startingDay="monday"
    dateFormat="ddd DD/MM"
    hourFormat="HH"
    startHour="PT3H"
    endHour="PT22H"
  >
    <MonthlyCalendar>{...}</MonthlyCalendar>
    <DailyCalendar dateFormat="DD-MM-YYYY">{...}</DailyCalendar>
  </Calendar>
```
This will use the `dateFormat` from `<Calendar>` in `<MonthlyCalendar>` but `<DailyCalendar>` will use his custom `dateFormat` when it renders.

---

### Daily Calendar

#### Props

| property      | type      | default      | description                        |
|---------------|-----------|--------------|------------------------------------|
| `start`       | `Date`    | `new Date()` | Day to show                        |
| `showNow`     | `boolean` | `false`      | Send props to show the time of day |

#### Child Callback Function

| property         | type       | description                                                    |
|------------------|------------|----------------------------------------------------------------|
| `calendar`       | `Object`   | events, label and date of the day                              |
| `start`          | `Date`     | date of the day                                                |
| `showNowProps`   | `Object`   | if `showNow` is true, props to the showNow container (postion) |
| `hours`          | `Array`    | Array of formatted string for hours labels                     |
| `rowHeight`      | `Number`   | Height of the row                                              |
| `dayEvents`      | `Array`    | Array of the events that last more than a day of the all day   |

**calendar**

| property | type     |
|----------|----------|
| `date`   | `Date`   |
| `events` | `Array`  |


**dayEvents**

| property | type       |
|----------|------------|
| `key`    | `event.id` |
| `event`  | `Object`   |
| `style`  | `Object`   |

The style object is passed only if the `getColumnProp` is called and we have a ref available.

| methods          | description                                   |
|------------------|-----------------------------------------------|
| `nextDay`        | Go to next day                                |
| `prevDay`        | Go to previous day                            |
| `gotoToday`      | Go to today                                   |
| `dateLabel`      | get the date formatted                        |
| `getColumnProps` | get the props for the container of the events |

**dateLabel**

Allow you to render the current day with a special format.

- dateFormat: use the convention from `date-fns` [format](https://date-fns.org/v1.28.5/docs/format)

**getColumnProps**

Allow to get the ref to your column element for calculation of the events position.

- refKey: if you're rendering a composite component, that component will need to accept a prop which it forwards to the root DOM element. Commonly, folks call this innerRef. So you'd call: getRootProps({refKey: 'innerRef'}) and your composite component would forward like: <div ref={props.innerRef} />.
By default, it will use the react default ref key

---

### Weekly Calendar

#### Props

| property      | type      | default      | description                        |
|---------------|-----------|--------------|------------------------------------|
| `start`       | `Date`    | `new Date()` | Day of the week to show            |
| `showNow`     | `boolean` | `false`      | Send props to show the time of day |

#### Child Callback Function

| property         | type       | description                                                    |
|------------------|------------|----------------------------------------------------------------|
| `calendar`       | `Array`    | list of day for the week                                       |
| `end`            | `Date`     | end of the week                                                |
| `start`          | `Date`     | start of the week                                              |
| `showNowProps`   | `Object`   | if `showNow` is true, props to the showNow container (postion) |
| `hours`          | `Array`    | Array of formatted string for hours labels                     |
| `rowHeight`      | `Number`   | Height of the row                                              |
| `weekEvents`     | `Array`    | Array of the events that last more than a day of the all week  |

**weekEvents**

| property | type       |
|----------|------------|
| `key`    | `event.id` |
| `event`  | `Object`   |
| `style`  | `Object`   |

The style object is passed only if the `getContainerProps` is called and we have a ref available.

| methods             | description                                   |
|---------------------|-----------------------------------------------|
| `nextWeek`          | Go to next week                               |
| `prevWeek`          | Go to previous week                           |
| `gotoToday`         | Go to today                                   |
| `toggleWeekend`     | show/hide weekend                             |
| `dateLabel`         | get the date formatted                        |
| `getContainerProps` | get the props for the container of the events |

**toggleWeekend**

Let you toggle the weekend in the calendar.
If you don't pass a pamarater, it will toggle the prop. If you pass a boolean, it will force the value.

```javascript

const showWeekend = true

toggleWeekend() // showWeekend = false
toggleWeekend(true) // showWeekend = true
toggleWeekend(true) // showWeekend = true
toggleWeekend(false) // showWeekend = false
[...]

```

**dateLabel**

Allow you to render the current week with a special format.

- dateFormat: use the convention from `date-fns` [format](https://date-fns.org/v1.28.5/docs/format)

**getContainerProps**

Allow to get the ref to your column element for calculation of the events position.

- refKey: if you're rendering a composite component, that component will need to accept a prop which it forwards to the root DOM element. Commonly, folks call this innerRef. So you'd call: getRootProps({refKey: 'innerRef'}) and your composite component would forward like: <div ref={props.innerRef} />.
By default, it will use the react default ref key.

---

### Monthly Calendar

#### Props

| property      | type      | default      | description                        |
|---------------|-----------|--------------|------------------------------------|
| `start`       | `Date`    | `new Date()` | Date of the curent month           |

#### Child Callback Function

| property         | type       | description                                                    |
|------------------|------------|----------------------------------------------------------------|
| `calendar`       | `Array`    | List of first day of the week for the month                    |
| `end`            | `Date`     | end of the month                                               |
| `start`          | `Date`     | start of the month                                             |
| `weeks`          | `Array`    | List of the first day of week for the month                    |
| `rowHeight`      | `Number`   | Height of the row                                              |

| methods             | description                                   |
|---------------------|-----------------------------------------------|
| `nextMonth`          | Go to next month                             |
| `prevMonth`          | Go to previous month                         |
| `gotoToday`         | Go to today                                   |
| `dateLabel`         | get the date formatted                        |

**dateLabel**

Allow you to render the current month with a special format.

- dateFormat: use the convention from `date-fns` [format](https://date-fns.org/v1.28.5/docs/format)

---

### Data structure

`data` is an array of objects, the object requires a few properties :

| property | type              | description                  |
|----------|-------------------|------------------------------|
| `id`     | `ID`              | Identifier of the event      |
| `title`  | `string`          | Title of the event           |
| `allDay` | `boolean | Date`  | Determine the type of event  |
| `start`  | `Date`            | Beggining of the event       |
| `end`    | `Date`            | End of the event             |

`allDay` has 3 states :
 - `true`, the event is on multiple days
 - `false`, the event is no longer than a day
 - `Date`, the event last all day

if `allDay` is a boolean, you need to provide a `start` and `end` properties.
If you want to create an event for the all day, you just put the date in `allDay`.

```javascript

// Event of 2 hours:
{
  id: 0,
  title: 'Diner',
  allDay: false,
  start : 'Wed Sep 06 2017 12:07:52 GMT+0200 (CEST)',
  end: 'Wed Sep 06 2017 14:07:52 GMT+0200 (CEST)'
}

// Event of all day:
{
  id: 0,
  title: 'Diner',
  allDay: 'Wed Sep 06 2017 12:07:52 GMT+0200 (CEST)'
}

// Event of 2 days:
{
  id: 0,
  title: 'Diner',
  allDay: true,
  start : 'Wed Sep 06 2017 12:07:52 GMT+0200 (CEST)',
  end: 'Wed Sep 08 2017 14:07:52 GMT+0200 (CEST)'
}

```


# LICENSE

 MIT