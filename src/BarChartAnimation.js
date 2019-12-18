import React from "react";
import { schemeTableau10 } from "d3-scale-chromatic";
import { scaleLinear, scaleBand, scaleOrdinal } from "@vx/scale";
import SpringBarGroup from "./SpringBarGroup";

const buildFindData = data => {
  const dataByDateAndName = new Map();
  data.forEach(dataPoint => {
    const { date, name } = dataPoint;
    if (!dataByDateAndName.get(date)) {
      dataByDateAndName.set(date, { [name]: dataPoint });
    } else {
      const nextGroup = {
        ...dataByDateAndName.get(date),
        [name]: dataPoint
      };
      dataByDateAndName.set(date, nextGroup);
    }
  });
  const finder = ({ date, name }) => {
    try {
      return dataByDateAndName.get(date)[name];
    } catch (e) {
      return null; 
    }
  };
  return finder;
}

const makeKeyFrames = (data, numOfSlice) => {
  const findData = buildFindData(data);
  const nameSet = new Set(data.map(({ name }) => name));
  const nameList = [...nameSet];
  const dateSet = new Set(data.map(({ date }) => date));
  const dateList = [...dateSet];

  const frames = dateList.sort((a, b) => a - b > 0).map(date => ({
    date,
    data: nameList.map(name => {
      const dataPoint = findData({ date , name});
      return {
        ...dataPoint,
        value: dataPoint ? dataPoint.value : 0,
      };
    })
  }));
  const keyframes = frames
    .reduce((result, frame, idx) => {
      const prev = frame;
      const next = idx !== frames.length - 1 ? frames[idx + 1] : null;
      if (!next) {
        result.push({ ...frame, date: new Date(frame.date) });
      } else {
        const prevTimestamp = new Date(prev.date).getTime();
        const nextTimestamp = new Date(next.date).getTime();
        const diff = nextTimestamp - prevTimestamp;
        for (let i = 0; i < numOfSlice; i++) {
          const sliceDate = new Date(prevTimestamp + diff * i / numOfSlice);
          const sliceData = frame.data.map(({ name, value, ...others }) => {
            const prevValue = value;
            const nextDataPoint = findData({ date: next.date, name });
            const nextValue = nextDataPoint ? nextDataPoint.value : 0;
            const sliceValue =
              prevValue + (nextValue - prevValue) * i / numOfSlice;
            return {
              name,
              value: sliceValue,
              ...others
            };
          });
          result.push({
            date: sliceDate,
            data: sliceData
          });
        }
      }
      return result;
    }, [])
    .map(({ date, data }) => {
      return {
        date,
        data: data.sort((a, b) => b.value - a.value > 0)
      };
    });

  return [keyframes, nameList];
};

function BarChartAnimation({
  data,
  numOfBars,
  numOfSlice,
  duration,
  width,
  height,
  padding
}) {
  const [keyframes, nameList] = React.useMemo(
    () => makeKeyFrames(data, numOfSlice), 
    [data, numOfSlice]
  );
  const [frameIdx, setFrameIdx] = React.useState(0);
  const frame = keyframes[frameIdx];
  React.useEffect(() => {
    const isLastFrame = frameIdx === keyframes.length - 1;
    if (!isLastFrame) {
      setTimeout(() => {
        setFrameIdx(frameIdx + 1);
      }, duration);
    }
  });
  const { data: frameData } = frame;
  const values = frameData.map(({ value }) => value);
  const xScale = scaleLinear({
    domain: [0, Math.max(...values)],
    range: [padding.left, width]
  });
  const yScale = React.useMemo(
    () =>
      scaleBand({
        domain: Array(numOfBars)
          .fill(0)
          .map((_, idx) => idx),
        range: [0, height]
      }),
    [numOfBars, height]
  );
  const colorScale = React.useMemo(
    () =>
      scaleOrdinal(schemeTableau10)
        .domain(nameList)
        .range(schemeTableau10),
    [nameList]
  );
  return (
    <svg width={width} height={height}>
      <SpringBarGroup
        frameData={frameData.slice(0, numOfBars)}
        xScale={xScale}
        yScale={yScale}
        colorScale={colorScale}
      />
      <line
        x1={padding.left}
        y1={0}
        x2={padding.left}
        y2={height}
        stroke="black"
      />
    </svg>
  );
}

BarChartAnimation.defaultProps = {
  width: 600,
  height: 450,
  padding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 100
  },
}

export default BarChartAnimation;
