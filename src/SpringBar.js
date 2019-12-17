import React from "react";
import { useSpring, animated } from 'react-spring';
import TheBar from "./TheBar";

const AnimatedBar = animated(TheBar);

const SpringBar = ({
  color,
  barX,
  barY,
  barWidth,
  barHeight,
  name,
  value,
}) => {
  const [springProps, set] = useSpring(() => ({ barY, barWidth, value }));
  React.useEffect(
    () => {
      set({ barY, barWidth, value })
    },
    [barY, barWidth, value, set],
  );
  return <AnimatedBar
    barX={barX}
    barHeight={barHeight}
    color={color}
    name={name}
    {...springProps}
    value={springProps.value.interpolate(v => v.toFixed())}
  />
}

export default SpringBar;