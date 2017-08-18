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

  example data:

```javascript

const data = [
  { date: '22/02/2017-11:00ZGMT+001', duration: '02:00:00' , title: 'CM JS' },
  { date: '22/02/2017-11:30ZGMT+001', duration: '00:30:00', title: 'Gouter' },
  { date: '22/02/2017-11:30ZGMT+001', duration: 'all', title: 'formation JS' },
]

// transform to

const data = {
  2017: {
    02: {
      22: {
        11: {
          all: [ { title: 'formation JS' } ]
          00: [ { title: 'CM JS', duration: '02:00:00' } ],
          30: [ { title: 'Gouter', duration: '00:30:00' } ]
        }
      }
    }
  }
}

```