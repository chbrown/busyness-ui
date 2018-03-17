import * as React from 'react'
import * as PropTypes from 'prop-types'

const dayNames = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']
const hourNames = [
  '12a', '', '', '', '', '',
  '6a', '', '', '', '', '',
  '12p', '', '', '', '', '',
  '6p', '', '', '', '', '',
  '12a!', '', '', '', '', '',
]

/**
Get the zero-based indices for a date.
*/
export function getDateIndices(date: Date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    // Date#getDay() ranges from 0 (=> Sunday) to 6 (=> Saturday)
    // which we need to map like so:
    // 0 1 2 3 4 5 6
    // ↓ ↓ ↓ ↓ ↓ ↓ ↓
    // 6 0 1 2 3 4 5
    // so that 0 => Monday, and 6 => Saturday
    day: (date.getDay() + 6) % 7,
    // Date#getHours() ranges from 0 to 23
    hour: date.getHours(),
    minute: date.getMinutes(),
  }
}

export interface DayProps {
  index: number
  heights: number[]
  now: Date
}
const Day: React.StatelessComponent<DayProps> = (props: DayProps) => {
  const {index, heights, now} = props
  const {day: nowDayIndex, hour: nowHourIndex} = getDateIndices(now)
  return (
    <div className={`day ${(nowDayIndex == index) ? 'now' : ''}`}>
      <div className="name">{dayNames[index]}</div>
      <div className="columns bars">
        {heights.map((height, i) => (
          <div key={i} title={`${(height * 100).toFixed(0)}%`}
            className={`column bar ${(nowHourIndex == i) ? 'now' : ''}`}
            style={{height: `${(height * 100).toFixed(2)}%`}} />
        ))}
      </div>
      <div className="columns labels">
        {heights.map((height, i) => (
          <div key={i} className="column label">{hourNames[i]}</div>
        ))}
      </div>
    </div>
  )
}
Day.propTypes = {
  index: PropTypes.number.isRequired,
  heights: PropTypes.arrayOf(PropTypes.number).isRequired,
  now: PropTypes.object.isRequired,
}

export default Day
