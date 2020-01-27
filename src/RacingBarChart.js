import React, { useEffect, useImperativeHandle, useMemo, useRef, useState, useLayoutEffect } from "react";
import { schemeTableau10 } from "d3-scale-chromatic";
import { scaleLinear, scaleBand, scaleOrdinal } from "@vx/scale";
import { Group } from "@vx/group";
import RacingAxisTop from "./RacingAxisTop";
import RacingBarGroup from "./RacingBarGroup";

const RacingBarChart = React.forwardRef(({
  numOfBars,
  width,
  height,
  margin,
  keyframes,
  onStart,
  onStop,
}, ref) => {
  const [{ frameIdx, animationKey, playing }, setAnimation] = useState({
    frameIdx: 0,
    animationKey: 0,
    playing: false,
  });
  const updateFrameRef = useRef();
  // when replay, increment the key to rerender the chart.
  useEffect(() => {
    if (!updateFrameRef.current) {
      updateFrameRef.current = setTimeout(() => {
        setAnimation(({ frameIdx: prevFrameIdx, playing, ...others }) => {
          const isLastFrame = prevFrameIdx === keyframes.length - 1;
          const nextFrameIdx = isLastFrame ? prevFrameIdx : prevFrameIdx + 1;
          return {
            ...others,
            frameIdx: playing ? nextFrameIdx : prevFrameIdx,
            playing: !!(playing && !isLastFrame),
          }
        });
        updateFrameRef.current = null;
      }, 250);
    }
  });
  const barGroupRef = useRef();
  const axisRef = useRef();
  useImperativeHandle(ref, () => ({
    replay: () => {
      clearTimeout(updateFrameRef.current);
      updateFrameRef.current = null;
      setAnimation(({ animationKey, ...others }) => ({
        ...others,
        frameIdx: 0,
        animationKey: animationKey + 1,
        playing: true,
      }));
    },
    start: () => {
      setAnimation(animation => ({
        ...animation,
        playing: true,
      }));
    },
    stop: () => {
      setAnimation(animation => ({
        ...animation,
        playing: false,
      }));
      barGroupRef.current.stop();
      axisRef.current.stop();
    },
    playing,
  }));
  const prevPlayingRef = useRef(playing);
  useEffect(() => {
    if (prevPlayingRef.current !== playing) {
      if (playing) {
        onStart();
      } else {
        onStop();
      }
    }
    prevPlayingRef.current = playing;
  }, [playing]);
  useLayoutEffect(() => {
    if (barGroupRef.current) {
      if (playing) {
        barGroupRef.current.start();
        axisRef.current.start();
      }
    }
  });
  const frame = keyframes[frameIdx];
  const { date: currentDate, data: frameData } = frame;
  const values = frameData.map(({ value }) => value);
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;
  const domainMax = Math.max(...values);
  const xScale = scaleLinear({
    domain: [0, domainMax],
    range: [0, xMax]
  });
  const yScale = useMemo(
    () =>
      scaleBand({
        domain: Array(numOfBars)
          .fill(0)
          .map((_, idx) => idx),
        range: [0, yMax]
      }),
    [numOfBars, yMax]
  );
  const nameList = useMemo(
    () => {
      if (keyframes.length === 0) {
        return []
      }
      return keyframes[0].data.map(d => d.name);
    },
    [keyframes]
  );
  const colorScale = useMemo(
    () =>
      scaleOrdinal(schemeTableau10)
        .domain(nameList)
        .range(schemeTableau10),
    [nameList]
  );
  const dateInYear = currentDate.getFullYear();
  return (
    <svg width={width} height={height}>
      <Group top={margin.top} left={margin.left} key={animationKey}>
        <RacingBarGroup
          frameData={frameData.slice(0, numOfBars)}
          xScale={xScale}
          yScale={yScale}
          colorScale={colorScale}
          ref={barGroupRef}
        />
        <text
          textAnchor="end"
          style={{ fontSize: "1.25em" }}
          x={xMax}
          y={yMax}
        >
          {dateInYear}
        </text>
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
          ref={axisRef}
        />
      </Group>
    </svg>
  );
});

RacingBarChart.defaultProps = {
  width: 600,
  height: 450,
  margin: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 100
  },
};

export default RacingBarChart;
