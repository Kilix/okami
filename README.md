# Calendoux

## Navigation
  - Next/Prev (net day, next week, ...)
  - RangeList (month, week, day, ...)
  - RangeItem
  - Return to today
## Display
  - Current range day
  - EmptyCell
  - HeaderCell
  - Cell (hours, day, month, ...)
  - EventCell
## Settings
  - Date format (DD/MM/YYYY)
  - hour format (HH:mm)
  - Start of the week (day)
  - Work hour (start - end)
  - Show weekends (bool)
  - defaultView (week, month, ...)

Example data:

```jsx

// Example of use i'd like to have :


const Header = () => (
  <div>
    <Today />
    <Navigation />
    <Infos />
    <SwitchView />
  </div>
)
const Planning = () => (
  <Planning
    cell={(date, events) => (
      <div>
        <span>{date}</span>
        <ul>
          {events.map(e => <li>{e.title}</li>)}
        </ul>
      </div>
    )}
  />
)
const Daily = () => (
  <DailyCalendar
    cell={(date, events) => (
      <div>
        <span>{date}</span>
        <ul>
          {events.map(e => <li>{e.title}</li>)}
        </ul>
      </div>
    )}
    headerColumn={(date) => <span>{date}</span>}
    headerRow={(hour) => <span>{hour}</span>}
  />
)

const Weekly = () => (
  <WeeklyCalendar
    showWeekend={false}
    cell={(date, events) => (
      <div>
        <span>{date}</span>
        <ul>
          {events.map(e => <li>{e.title}</li>)}
        </ul>
      </div>
    )}
    headerColumn={(date) => <span>{date}</span>}
    headerRow={(hour) => <span>{hour}</span>}
  />
)

const Monthly = () =>
  <MonthlyCalendar
    cell={(date, events) => (
      <div>
        <span>{date}</span>
        <ul>
          {events.map(e => <li>{e.title}</li>)}
        </ul>
      </div>
    )}
    headerColumn={(date) => <span>{date}</span>}
  />

() => (
  <Calendar
    data={sourceData}
    workHours={["06:00", "22:00"]}
    startingDay="monday"
    format="24"
  >
    <MonthlyCalendar showWeekend={true} showEvent={false} showRefused={false}>
      <Navigation />
      <InfoDisplayer />
    </MonthlyCalendar>
    <MultiView
      options={["week", "month", "day", "planning"]}
      defaultView="week"
      defaultProps={{ showEvent: true, showWeekend: true, showRefused: false }}
      header={Header}
      week={Weekly}
      month={Monthly}
      day={Daily}
      planning={Planning}
    />
  </Calendar>
)


// Example data :

const data = {
  '2017': {
    '02': {
      '22': {
        '11': {
          '*': [ { title: 'formation JS' } ],
          '00': [ { title: 'CM JS', duration: '02:00:00' } ],
          '30': [ { title: 'Gouter', duration: '00:30:00' } ]
        }
      }
    }
  }
}

// could be the source format that the developer send:

const data = [
  { date: '22/02/2017-11:00ZGMT+001', duration: '02:00:00' , title: 'CM JS', email: "email@gmail.com", accepted: true },
  { date: '22/02/2017-11:30ZGMT+001', duration: '00:30:00', title: 'Gouter', email: "email@gmail.com", accepted: false },
  { date: '22/02/2017-11:30ZGMT+001', duration: '*', title: 'formation JS', email: "email@gmail.com", accepted: null },
]

```