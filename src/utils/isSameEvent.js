// @flow
import isEqual from 'date-fns/fp/isEqual'

import type {Event} from '../types'

export const isSameEvent = (first: Event, second: Event): boolean =>
  isEqual(first.start)(second.start) && isEqual(first.end)(second.end)
