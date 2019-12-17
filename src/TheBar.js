import React from "react";
import { Bar } from '@vx/shape';
import { Text } from "@vx/text";

const TheBar = ({
  color,
  barX,
  barY,
  barWidth,
  barHeight,
  name,
  value,
}) => {
  const text = `${name} ${value}`;
  return <React.Fragment>
    <Bar
      x={barX}
      y={barY}
      width={barWidth}
      height={barHeight}
      fill={color}
    />
    <Text x={barX + 10} y={barY + barHeight / 2}>{text}</Text>
  </React.Fragment>
}

export default TheBar;