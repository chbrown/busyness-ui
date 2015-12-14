import React from 'react';
import ReactDOM from 'react-dom';

import './site.less';
import allLocationTimesData from './data/times.json';

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
const nowHours = now.getHours();

class Day extends React.Component {
  render() {

    return (
      <div className="day">
        <div className="name">{this.props.name}</div>
        <div className="columns bars">
          {this.props.heights.map((height, i) => (
            <div key={i} className={`column bar ${(nowHours == i) ? 'now' : ''}`} style={{height: `${height || 0}px`}} title={height}></div>
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
    name: React.PropTypes.string.isRequired,
    heights: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
  }
}

class Location extends React.Component {
  render() {
    return (
      <div className="location">
        <div className="name">{this.props.q}</div>
        <div className="days">
          {this.props.times.map((heights, i) => <Day key={i} name={dayNames[i]} heights={heights} /> )}
        </div>
      </div>
    );
  }
  static propTypes = {
    q: React.PropTypes.string.isRequired,
    times: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.number)).isRequired,
  }
}

class App extends React.Component {
  render() {
    let locationTimesData = allLocationTimesData;//.slice(0, 24);
    return (
      <main>
        <header style={{margin: '0 10px'}}>
          <h3>Showing {locationTimesData.length}/{allLocationTimesData.length} locations</h3>
        </header>
        {locationTimesData.map((locationTimes, i) => <Location key={i} {...locationTimes} /> )}
      </main>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
