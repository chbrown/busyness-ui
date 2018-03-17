import * as React from 'react'
import * as PropTypes from 'prop-types'

import Day, {getDateIndices} from './Day'
import Location from './Location'
import Slider from './Slider'

export interface AppProps {
  locations: any[]
  // days: number[][]
  now: Date
}
export interface AppState {
  excludeClosed: boolean
  minimumScore: number
}
class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)
    const excludeClosed = localStorage.excludeClosed === 'true'
    const minimumScore = parseInt(localStorage.minimumScore || '0', 10)
    this.state = {excludeClosed, minimumScore}
  }
  onExcludeClosedChange(ev) {
    const excludeClosed = ev.target.checked
    localStorage.excludeClosed = excludeClosed
    this.setState({excludeClosed})
  }
  onMinimumScoreChange(ev) {
    const minimumScore = parseFloat(ev.target.value)
    localStorage.minimumScore = minimumScore
    this.setState({minimumScore})
  }
  render() {
    const {locations, now} = this.props
    const {excludeClosed, minimumScore} = this.state
    // calculate which locations to show
    const {day: nowDayIndex, hour: nowHourIndex} = getDateIndices(now)
    const extendedLocations = locations.map(location => {
      // null is not greater than 0, so this works
      const open = location.days[nowDayIndex][nowHourIndex] > 0
      const visible = (!excludeClosed || open) && (location.score >= minimumScore)
      return {...location, visible}
    })
    return (
      <main>
        <header>
          <h3>Showing {extendedLocations.filter(location => location.visible).length}/{extendedLocations.length} locations</h3>
          <div className="controls">
            <div>
              <label>
                <input type="checkbox" checked={excludeClosed} onChange={this.onExcludeClosedChange.bind(this)} />
                <b>Exclude Closed</b>
              </label>
              <div><small>(locations with no clientele right now)</small></div>
            </div>
            <div>
              <label>
                <b>Minimum Score: <output>{minimumScore}</output></b>
                <Slider value={minimumScore} step={5} onChange={this.onMinimumScoreChange.bind(this)} />
              </label>
            </div>
          </div>
        </header>
        {extendedLocations.map(({name, days, visible}) =>
          <div key={name} className={visible ? '' : 'hidden'}>
            <Location name={name} days={days} now={now} />
          </div>,
        )}
      </main>
    )
  }
  static propTypes = {
    locations: PropTypes.array.isRequired,
    now: PropTypes.object.isRequired,
  }
}

export default App
