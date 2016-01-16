import React from 'react';
import ReactDOM from 'react-dom';

import {App} from './components';
import allLocations from './data/times.json';
import './site.less';

const max = (a: number, b: number) => Math.max(a, b);

// 75 is the largest bar size in my dataset, but find the maximum dynamically
const maxHeight = allLocations.map(({days}) => {
  return days.map(heights => heights.map(height => height || 0).reduce(max)).reduce(max);
}).reduce(max);

/**
Scale the day heights by the global maximum, so that they fall within the range [0, 1.0]

This also converts all null heights to 0.
*/
const locations = allLocations.map(location => {
  const days = location.days.map(heights => heights.map(height => (height || 0) / maxHeight));
  return {...location, days};
});

const now = new Date();

ReactDOM.render(<App locations={locations} now={now} />, document.getElementById('app'));
