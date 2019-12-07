import React from 'react';
import { browserUsage } from '@vx/mock-data';
import { Bar } from '@vx/shape';
import { scaleLinear, scaleBand } from '@vx/scale';
import { AxisLeft } from "@vx/axis";
import { Text } from "@vx/text";

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
const height = 450;

const padding = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 100,
};

const xScale = scaleLinear({
  domain: [0, Math.max(...numbers)],
  range: [0, width - padding.left],
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
            const barX = padding.left;
            const barY = yScale(name);
            const barWidth = xScale(value);
            const barHeight = yScale.bandwidth(); 
            return <>
              <Bar
                key={name}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill="rgba(23, 233, 217, .5)"
              />
              <Text x={barX + 10} y={barY + barHeight / 2}>{`${name} ${value}%`}</Text>
            </>
          }
        )}
        <line
          x1={padding.left}
          y1={0}
          x2={padding.left}
          y2={height}
          stroke="black"
        />
      </svg>
    </div>
  );
}

export default App;
