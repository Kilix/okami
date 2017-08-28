import addDays from 'date-fns/fp/addDays'
import subDays from 'date-fns/fp/subDays'
import addHours from 'date-fns/fp/addHours'
import subHours from 'date-fns/fp/subHours'
import setHours from 'date-fns/fp/setHours'
import startOfHour from 'date-fns/startOfHour'

const today = new Date()
const tomorrow = addDays(1, today)

export default [
  {
    start: startOfHour(setHours(10, tomorrow)),
    end: startOfHour(setHours(13, tomorrow)),
    title: 'CM JS',
    email: 'email@gmail.com',
    accepted: true,
    color: '#AFED23',
  },
  {
    start: startOfHour(setHours(10, today)),
    end: startOfHour(setHours(13, today)),
    title: 'CM Feel Good',
    email: 'email@gmail.com',
    accepted: true,
    color: '#AFED23',
  },
  {
    start: startOfHour(setHours(9, today)),
    end: startOfHour(setHours(11, today)),
    title: 'CM Java',
    email: 'email@gmail.com',
    accepted: true,
    color: '#AFED23',
  },
  {
    start: startOfHour(setHours(14, tomorrow)),
    end: startOfHour(setHours(16, tomorrow)),
    title: 'Test',
    email: 'email@gmail.com',
    accepted: true,
  },
  {
    start: startOfHour(setHours(14, tomorrow)),
    end: startOfHour(setHours(15, tomorrow)),
    title: 'Test 2',
    email: 'email@gmail.com',
    accepted: true,
  },
  {
    start: startOfHour(setHours(17, tomorrow)),
    end: startOfHour(setHours(19, tomorrow)),
    title: 'Test 3',
    email: 'email@gmail.com',
    accepted: true,
  },
  {
    start: startOfHour(setHours(13, tomorrow)),
    end: startOfHour(setHours(20, tomorrow)),
    title: 'Test 4',
    email: 'email@gmail.com',
    accepted: true,
  },
  {
    start: startOfHour(setHours(9, tomorrow)),
    end: startOfHour(setHours(11, tomorrow)),
    title: 'Test 5',
    email: 'email@gmail.com',
    accepted: true,
  },
  {
    start: startOfHour(setHours(10, tomorrow)),
    end: '*',
    title: 'Bid',
    email: 'email@gmail.com',
    accepted: true,
  },
  {
    start: startOfHour(setHours(14, today)),
    end: startOfHour(setHours(20, today)),
    title: 'Gouter',
    email: 'email@gmail.com',
    accepted: false,
  },
  {
    start: startOfHour(addHours(2, new Date())),
    end: '*',
    title: 'formation JS',
    email: 'email@gmail.com',
    accepted: null,
  },
  {
    start: startOfHour(addHours(2, new Date())),
    end: '*',
    title: 'formation Java',
    email: 'email@gmail.com',
    accepted: null,
  },
]
