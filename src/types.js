// @flow
export type Event = {
  id: string | number,
  start: string | Date | number,
  end: string | Date | number,
  allDay: boolean,
}

export type Node = {
  children: $ReadOnlyArray<number>,
  depth: number,
  level: number,
  // When the node follows a normal "stair" like positioning, it's 'normal'. 'equal' correspond
  // to events that have the same date, they each then need to take the same width
  type: 'normal' | 'equal',
}
export type Nodes = {[id: number]: Node}
