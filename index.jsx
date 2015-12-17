import React from 'react';
import ReactDOM from 'react-dom';

import './site.less';
import allLocations from './data/times.json';

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
        <div className="columns bars">
          {this.props.heights.map((height, i) => (
            <div key={i} title={height}
              className={`column bar ${(nowHourIndex == i) ? 'now' : ''}`}
              style={{height: `${height || 0}px`}} />
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

class App extends React.Component {
  constructor() {
    super();
    let excludeClosed = localStorage.excludeClosed === 'true';
    this.state = {excludeClosed};
  }
  onExcludeClosedChange(ev) {
    let excludeClosed = ev.target.checked;
    localStorage.excludeClosed = excludeClosed;
    this.setState({excludeClosed});
  }
  render() {
    let locations = allLocations;
    if (this.state.excludeClosed) {
      locations = locations.filter(location => {
        // null is not greater than 0, so this works
        return location.days[nowDayIndex][nowHourIndex] > 0;
      });
    }
    return (
      <main>
        <header>
          <h3>Showing {locations.length}/{allLocations.length} locations</h3>
          <div>
            <label>
              <input type="checkbox" checked={this.state.excludeClosed}
                onChange={this.onExcludeClosedChange.bind(this)} />
              <b>Exclude Closed</b> (locations with no clientele right now)
            </label>
          </div>
        </header>
        {locations.map(({name, days}) => <Location key={name} name={name} days={days} /> )}
      </main>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
