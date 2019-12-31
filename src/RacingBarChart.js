import React from "react";
import { schemeTableau10 } from "d3-scale-chromatic";
import { scaleLinear, scaleBand, scaleOrdinal } from "@vx/scale";
import { Group } from "@vx/group";
import RacingAxisTop from "./RacingAxisTop";
import RacingBarGroup from "./RacingBarGroup";

function RacingBarChart({
  numOfBars,
  width,
  height,
  margin,
  keyframes,
}) {
  const [frameIdx, setFrameIdx] = React.useState(0);
  const frame = keyframes[frameIdx];
  React.useEffect(() => {
    const isLastFrame = frameIdx === keyframes.length - 1;
    if (!isLastFrame) {
      setTimeout(() => {
        setFrameIdx(frameIdx + 1);
      }, 250);
    }
  });
  const { date: currentDate, data: frameData } = frame;
  const values = frameData.map(({ value }) => value);
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const domainMax = Math.max(...values);
  const xScale = scaleLinear({
    domain: [0, domainMax],
    range: [0, xMax]
  });
  const yScale = React.useMemo(
    () =>
      scaleBand({
        domain: Array(numOfBars)
          .fill(0)
          .map((_, idx) => idx),
        range: [0, yMax]
      }),
    [numOfBars, yMax]
  );
  const nameList = React.useMemo(
    () => {
      if (keyframes.length === 0) {
        return []
      }
      return keyframes[0].data.map(d => d.name);
    },
    [keyframes]
  );
  const colorScale = React.useMemo(
    () =>
      scaleOrdinal(schemeTableau10)
        .domain(nameList)
        .range(schemeTableau10),
    [nameList]
  );
  const dateInYear = currentDate.getFullYear();
  return (
    <svg width={width} height={height}>
      <Group top={margin.top} left={margin.left}>
        <RacingBarGroup
          frameData={frameData.slice(0, numOfBars)}
          xScale={xScale}
          yScale={yScale}
          colorScale={colorScale}
        />
        <text style={{ fontSize: 20 }} x={xMax} y={yMax}>{dateInYear}</text>
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={yMax}
          stroke="black"
        />
        <RacingAxisTop
          domainMax={domainMax}
          xMax={xMax}
        />
      </Group>
    </svg>
  );
}

RacingBarChart.defaultProps = {
  width: 600,
  height: 450,
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 100
  },
}

export default RacingBarChart;
