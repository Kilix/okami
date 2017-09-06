# Okami

### IN ACTIVE DEVELOPMENT (not ready for production), documentation soon

Allow to create a calendar without forcing a ui to you. Handle the logic so you can focus on UI/UX. Similar to [downshift](https://github.com/paypal/downshift)

## Install

```yarn add okami```
```npm install --save okami```

## Basic Usage

For a complete example, look the storybook :)

```javascript

<Calendar
  data={data}
  startingDay="monday"
  dateFormat="ddd DD/MM"
  hourFormat="HH"
  startHour="PT3H"
  endHour="PT22H"
  locale={frLocale}
>
  <Daily />
</Calendar>

```


## Data structure

Data is an array of objects, the object requires a few properties :
- id : ID
- title : string
- allDay : boolean | Date
- start : Date
- end : Date

#### How does it works ?

if `allDay`is a boolean, you need to provide a `start` and `end` properties, if you want to create an event for the all day, you just put the date in `allDay`.

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