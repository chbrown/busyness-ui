import * as React from 'react'
import * as PropTypes from 'prop-types'

function range(min, max, step, epsilon = 1e-9) {
  const xs = []
  for (let x = min; x < (max - epsilon); x += step) {
    xs.push(x)
  }
  return xs
}

export interface SliderProps {
  value: number
  min?: number
  max?: number
  step?: number
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}
const Slider: React.StatelessComponent<SliderProps> = (props: SliderProps) => {
  const {value, min = 0, max = 100, step = 1, onChange = () => undefined} = props
  const ticks = range(min, max + step, step)
  return (
    <div>
      <input type="range" list="ticks" value={value} onChange={onChange} min={min} max={max} step={step} />
      <datalist id="ticks">
        {ticks.map(tick => <option key={tick}>{tick.toFixed(1)}</option>)}
      </datalist>
    </div>
  )
}
Slider.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  onChange: PropTypes.func,
}

export default Slider
