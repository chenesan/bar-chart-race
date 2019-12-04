import React from 'react';
import { browserUsage } from '@vx/mock-data';
import { Bar } from '@vx/shape';
import { scaleLinear, scaleBand } from '@vx/scale';

const data = browserUsage[0];
const keys = [
  'Google Chrome',
  'Internet Explorer',
  'Firefox',
  'Safari',
  'Microsoft Edge',
  'Opera',
  'Mozilla',
  'Other/Unknown',
]
const numbers = keys.map(key => Number(data[key]));

const width = 600;
const height = 900;

const xScale = scaleLinear({
  domain: [0, Math.max(...numbers)],
  range: [0, width],
})
const yScale = scaleBand({
  domain: keys,
  range: [0, height],
});

function App() {
  return (
    <div>
      <svg width={width} height={height}>
        {numbers.map(
          (value, idx) => {
            const name = keys[idx];
            const barX = 0;
            const barY = yScale(name);
            const barWidth = xScale(value);
            const barHeight = yScale.bandwidth(); 
            return <Bar
              key={name}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill={'blue'}
            />
          }
        )}
      </svg>
    </div>
  );
}

export default App;
