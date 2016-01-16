import React from 'react';

/**
Get the zero-based indices for a date.
*/
function getDateIndices(date: Date) {
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
  };
}

const dayNames = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];
const hourNames = [
  '12a', '', '', '', '', '',
  '6a', '', '', '', '', '',
  '12p', '', '', '', '', '',
  '6p', '', '', '', '', '',
  '12a!', '', '', '', '', '',
];

function range(min, max, step, epsilon = 1e-9) {
  var xs = [];
  for (var x = min; x < (max - epsilon); x += step) {
    xs.push(x);
  }
  return xs;
}
export const Slider = ({value, min = 0, max = 100, step = 1, onChange = () => undefined}) => {
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
  min: React.PropTypes.number,
  max: React.PropTypes.number,
  step: React.PropTypes.number,
  onChange: React.PropTypes.func,
};

export const Day = ({index, heights, now}) => {
  const {day: nowDayIndex, hour: nowHourIndex} = getDateIndices(now);
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
  );
};
Day.propTypes = {
  index: React.PropTypes.number.isRequired,
  heights: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
  now: React.PropTypes.object.isRequired,
};

export class Location extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (this.props.name != nextProps.name) || (this.props.days != nextProps.days);
  }
  render() {
    const {name, days, now} = this.props;
    return (
      <div className="location">
        <div className="name">{name}</div>
        <div className="days">
          {days.map((heights, i) =>
            <Day key={i} index={i} heights={heights} now={now} />
          )}
        </div>
      </div>
    );
  }
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    days: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.number)).isRequired,
    now: React.PropTypes.object.isRequired,
  };
}

export class App extends React.Component {
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
    const {locations, now} = this.props;
    const {excludeClosed, minimumScore} = this.state;
    // calculate which locations to show
    const {day: nowDayIndex, hour: nowHourIndex} = getDateIndices(now);
    const extendedLocations = locations.map(location => {
      // null is not greater than 0, so this works
      let open = location.days[nowDayIndex][nowHourIndex] > 0;
      let visible = (!excludeClosed || open) && (location.score >= minimumScore);
      return {...location, visible};
    });
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
          </div>
        )}
      </main>
    );
  }
  static propTypes = {
    locations: React.PropTypes.array.isRequired,
    now: React.PropTypes.object.isRequired,
  };
}
