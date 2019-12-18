import React from 'react';
import SpringBar from './SpringBar';

const SpringBars = ({
  frameData,
  xScale,
  yScale,
  colorScale,
  padding,
}) => {
  return frameData.map(
    ({ name, value }, idx) => {
      const barY = yScale(idx);
      if (typeof barY !== 'number') {
        return false;
      }
      return <SpringBar
        barX={padding.left}
        barY={barY}
        barWidth={xScale(value)}
        barHeight={yScale.bandwidth()}
        color={colorScale(name)}
        value={value}
        name={name}
        key={name}
      />
    }
  )
};

export default SpringBars