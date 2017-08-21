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

```javascript

// Example of use i'd like to have :

const Planning = () => <Planning showRefused={false} />
const Daily = () => <DailyCalendar showEvent={true} showRefused={false} />
const Weekly = () =>
  <WeeklyCalendar
    showEvent={true}
    showWeekend={false}
    showRefused={false}
  />
const Monthly = () =>
  <MonthlyCalendar
    showEvent={true}
    showWeekend={true}
    showRefused={false}
  />

() => (
  <Calendar
    data={sourceData}
    format='24'
    workHours={['06:00', '22:00']}
    startingDay='monday'
  >
    <MonthlyCalendar
      startingDay='monday'
      showWeekend={true}
      showEvent={false}
    />
    <MultiView
      options={['week', 'month', 'day', 'planning']}
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