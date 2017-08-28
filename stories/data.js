import addDays from 'date-fns/fp/addDays'
import subDays from 'date-fns/fp/subDays'
import addHours from 'date-fns/fp/addHours'
import subHours from 'date-fns/fp/subHours'
import startOfHour from 'date-fns/startOfHour'

export default [
  {
    start: startOfHour(addDays(1, new Date())),
    end: startOfHour(addHours(2, addDays(1, new Date()))),
    title: 'CM JS',
    email: 'email@gmail.com',
    accepted: true,
    color: '#AFED23',
  },
  {
    start: startOfHour(addDays(1, new Date())),
    end: startOfHour(addHours(2, addDays(1, new Date()))),
    title: 'CM Feel Good',
    email: 'email@gmail.com',
    accepted: true,
    color: '#AFED23',
  },
  {
    start: startOfHour(addHours(1, addDays(1, new Date()))),
    end: startOfHour(addHours(2, addDays(1, new Date()))),
    title: 'CM Java',
    email: 'email@gmail.com',
    accepted: true,
    color: '#AFED23',
  },
  {
    start: startOfHour(subHours(1, addDays(1, new Date()))),
    end: startOfHour(addHours(4, addDays(1, new Date()))),
    title: 'Test',
    email: 'email@gmail.com',
    accepted: true,
  },
  {
    start: startOfHour(subHours(4, addDays(1, new Date()))),
    end: startOfHour(subHours(2, addDays(1, new Date()))),
    title: 'Test 2',
    email: 'email@gmail.com',
    accepted: true,
  },
  {
    start: startOfHour(addHours(4, addDays(1, new Date()))),
    end: startOfHour(addHours(7, addDays(1, new Date()))),
    title: 'Test 3',
    email: 'email@gmail.com',
    accepted: true,
  },
  {
    start: startOfHour(addHours(5, addDays(1, new Date()))),
    end: startOfHour(addHours(8, addDays(1, new Date()))),
    title: 'Test 4',
    email: 'email@gmail.com',
    accepted: true,
  },
  {
    start: startOfHour(addHours(1, addDays(1, new Date()))),
    end: '*',
    title: 'Bid',
    email: 'email@gmail.com',
    accepted: true,
  },
  {
    start: startOfHour(addDays(10, new Date())),
    end: startOfHour(addHours(1, addDays(10, new Date()))),
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
