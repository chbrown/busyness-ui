import * as React from 'react'
import * as PropTypes from 'prop-types'

import Day from './Day'

export interface LocationProps {
  name: number
  days: number[][]
  now: Date
}
class Location extends React.Component<LocationProps> {
  shouldComponentUpdate(nextProps: Readonly<LocationProps>) {
    const {name, days} = this.props
    return (name != nextProps.name) || (days != nextProps.days)
  }
  render() {
    const {name, days, now} = this.props
    return (
      <div className="location">
        <div className="name">{name}</div>
        <div className="days">
          {days.map((heights, i) =>
            <Day key={i} index={i} heights={heights} now={now} />,
          )}
        </div>
      </div>
    )
  }
  static propTypes = {
    name: PropTypes.string.isRequired,
    days: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    now: PropTypes.object.isRequired,
  }
}

export default Location
