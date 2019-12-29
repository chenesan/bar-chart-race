import React from "react";
import { Bar as VxBar } from "@vx/shape";
import { Text as VxText } from "@vx/text";

const Bar = ({ color, x, y, width, height, name, value }) => {
  const text = `${name} ${value}`;
  return (
    <React.Fragment>
      <VxBar
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        style={{ opacity: 0.8 }}
      />
      <VxText x={x + 10} y={y + height / 2}>
        {text}
      </VxText>
    </React.Fragment>
  );
};

export default Bar;
