import * as React from 'react'
import * as ReactDOM from 'react-dom'

import App from './components/App'

const allLocations = require('./data/times.json')
require('./site.less')

function max(a, b) { // a: number, b: number
  return Math.max(a, b)
}

// 75 is the largest bar size in my dataset, but find the maximum dynamically
const maxHeight = allLocations.map(({days}) => {
  return days.map(heights => heights.map(height => height || 0).reduce(max)).reduce(max)
}).reduce(max)

/**
Scale the day heights by the global maximum, so that they fall within the range [0, 1.0]

This also converts all null heights to 0.
*/
const locations = allLocations.map(location => {
  const days = location.days.map(heights => heights.map(height => (height || 0) / maxHeight))
  return {...location, days}
})

const now = new Date()

ReactDOM.render(<App locations={locations} now={now} />, document.getElementById('app'))
