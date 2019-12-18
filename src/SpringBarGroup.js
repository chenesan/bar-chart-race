import React from 'react';
import { useTransition, animated } from 'react-spring';
import TheBar from './TheBar';

const AnimatedBar = animated(TheBar);

const SpringBars = ({
  frameData,
  xScale,
  yScale,
  colorScale,
  padding,
}) => {
  const transitions = useTransition(
    frameData.map(
      ({ name, value }, idx) => ({
        barY: yScale(idx),
        barWidth: xScale(value),
        value,
        name,
      })
    ),
    d => d.name,
    {
      initial: d => d,
      from: { barY: 470, barWidth: 0, value: 0 },
      leave: { barY: 470, barWidth: 0, value: 0 },
      enter: d => d,
      update: d => d,
    }
  );
  return transitions.map(
    ({ item, props }, idx) => {
      const { barY, value, barWidth } = props;
      const { name } = item;
      return <AnimatedBar
        barX={padding.left}
        barY={barY}
        barWidth={barWidth}
        barHeight={yScale.bandwidth()}
        color={colorScale(name)}
        value={value.interpolate(v => v.toFixed())}
        name={name}
        key={name}
      />
    }
  )
};

export default SpringBars