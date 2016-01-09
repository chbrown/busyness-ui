import React from 'react';
import ReactDOM from 'react-dom';

import './site.less';
import allLocations from './data/times.json';

const verticalScale = 0.7;
// 75 is the largest bar size in my dataset
const barHeight = (78 * verticalScale) | 0;

// const dayNames = ['M', 'Tu', 'W', 'Th', 'F', 'Sat', 'Sun'];
const dayNames = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];
const hourNames = [
  '12a', '', '', '', '', '',
  '6a', '', '', '', '', '',
  '12p', '', '', '', '', '',
  '6p', '', '', '', '', '',
  '12a!', '', '', '', '', '',
];

const now = new Date();
// Date#getDay() ranges from 0 (=> Sunday) to 6 (=> Saturday)
// which we need to map like so:
// 0 1 2 3 4 5 6
// ↓ ↓ ↓ ↓ ↓ ↓ ↓
// 6 0 1 2 3 4 5
// so that 0 => Monday, and 6 => Saturday
const nowDayIndex = (now.getDay() + 6) % 7;
// Date#getHours() ranges from 0 to 23
const nowHourIndex = now.getHours();

class Day extends React.Component {
  render() {
    return (
      <div className={`day ${(nowDayIndex == this.props.index) ? 'now' : ''}`}>
        <div className="name">{dayNames[this.props.index]}</div>
        <div className="columns bars" style={{minHeight: `${barHeight}px`}}>
          {this.props.heights.map((height, i) => (
            <div key={i} title={height}
              className={`column bar ${(nowHourIndex == i) ? 'now' : ''}`}
              style={{height: `${(height || 0) * verticalScale | 0}px`}} />
          ))}
        </div>
        <div className="columns labels">
          {this.props.heights.map((height, i) => (
            <div key={i} className="column label">{hourNames[i]}</div>
          ))}
        </div>
      </div>
    );
  }
  static propTypes = {
    index: React.PropTypes.number.isRequired,
    heights: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
  }
}

class Location extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (this.props.name != nextProps.name) || (this.props.days != nextProps.days);
  }
  render() {
    return (
      <div className="location">
        <div className="name">{this.props.name}</div>
        <div className="days">
          {this.props.days.map((heights, i) =>
            <Day key={i} index={i} heights={heights} />
          )}
        </div>
      </div>
    );
  }
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    days: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.number)).isRequired,
  }
}

function range(min, max, step, epsilon = 1e-9) {
  var xs = [];
  for (var x = min; x < (max - epsilon); x += step) {
    xs.push(x);
  }
  return xs;
}
const Slider = ({value, min = 0, max = 100, step = 1, onChange}) => {
  const ticks = range(min, max + step, step);
  return (
    <div>
      <input type="range" list="ticks" value={value} onChange={onChange} min={min} max={max} step={step} />
      <datalist id="ticks">
        {ticks.map(tick => <option key={tick}>{tick.toFixed(1)}</option>)}
      </datalist>
    </div>
  );
};
Slider.propTypes = {
  value: React.PropTypes.number.isRequired,
  min: React.PropTypes.number.isRequired,
  max: React.PropTypes.number.isRequired,
  step: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func,
};

class App extends React.Component {
  constructor() {
    super();
    let excludeClosed = localStorage.excludeClosed === 'true';
    let minimumScore = parseInt(localStorage.minimumScore || '0', 10);
    this.state = {excludeClosed, minimumScore};
  }
  onExcludeClosedChange(ev) {
    let excludeClosed = ev.target.checked;
    localStorage.excludeClosed = excludeClosed;
    this.setState({excludeClosed});
  }
  onMinimumScoreChange(ev) {
    let minimumScore = parseFloat(ev.target.value);
    localStorage.minimumScore = minimumScore;
    this.setState({minimumScore});
  }
  render() {
    let locations = allLocations.filter(location => {
      // null is not greater than 0, so this works
      let open = location.days[nowDayIndex][nowHourIndex] > 0;
      return (!this.state.excludeClosed || open) && (location.score >= this.state.minimumScore);
    });
    return (
      <main>
        <header>
          <h3>Showing {locations.length}/{allLocations.length} locations</h3>
          <div className="controls">
            <div>
              <label>
                <input type="checkbox" checked={this.state.excludeClosed}
                  onChange={this.onExcludeClosedChange.bind(this)} />
                <b>Exclude Closed</b>
              </label>
              <div><small>(locations with no clientele right now)</small></div>
            </div>
            <div>
              <label>
                <b>Minimum Score: <output>{this.state.minimumScore}</output></b>
                <Slider value={this.state.minimumScore} step={5} onChange={this.onMinimumScoreChange.bind(this)} />
              </label>
            </div>
          </div>
        </header>
        {locations.map(({name, days}) => <Location key={name} name={name} days={days} /> )}
      </main>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
