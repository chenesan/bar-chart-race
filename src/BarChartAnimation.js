import React from 'react';
import { schemeTableau10 } from 'd3-scale-chromatic';
import { scaleLinear, scaleBand, scaleOrdinal } from '@vx/scale';
import SpringBarGroup from './SpringBarGroup';

const width = 600;
const height = 450;

const padding = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 100,
};

const makeKeyFrames = (data) => {
  const dataByDateAndName = new Map(); 
  const dates = [];
  const nameMap = {};
  data.forEach(dataPoint => {
    const { date, name, category } = dataPoint;
    if (!dataByDateAndName.get(date)) {
      dataByDateAndName.set(date, { [name]: dataPoint });
      dates.push(date);
    } else {
      const nextGroup = {
        ...dataByDateAndName.get(date),
        [name]: dataPoint
      };
      dataByDateAndName.set(date, nextGroup);
    }
    if (!nameMap[name]) {
      nameMap[name] = { category };
    }
  });
  const nameList = Object.keys(nameMap);
  const frames = dates
    .sort((a, b) => a - b > 0)
    .map(date => ({
      date,
      data: nameList.map(name => {
        const { category } = nameMap[name];
        
        const dataPoint = dataByDateAndName.get(date)[name];
        return {
          name,
          category,
          value: dataPoint ? dataPoint.value : 0
        }
      })
    })
  );
  const result = frames.reduce((keyframes, frame, idx) => {
    const prev = frame;
    const next = idx !== frames.length - 1 ? frames[idx + 1] : null;
    if (!next) {
      keyframes.push({...frame, date: new Date(frame.date)});
    } else {
      const numOfSlice = 10;
      const prevTimestamp = new Date(prev.date).getTime();
      const nextTimestamp = new Date(next.date).getTime();
      const diff = nextTimestamp - prevTimestamp;
      for (let i = 0; i < numOfSlice; i++) {
        const sliceDate = new Date(prevTimestamp + diff * i / numOfSlice);
        const sliceData = frame.data.map(({ name, value, ...others }) => {
          const prevValue = value;
          const nextDataPoint = dataByDateAndName.get(next.date)[name];
          const nextValue = nextDataPoint ? nextDataPoint.value : 0;
          const sliceValue = prevValue + (nextValue - prevValue) * i / numOfSlice;
          return {
            name,
            value: sliceValue,
            ...others,
          }
        });
        keyframes.push({
          date: sliceDate,
          data: sliceData,
        })
      }
    }
    return keyframes;
  }, []).map(({ date, data }) => {
    return {
      date,
      data: data.sort((a,b) => b.value - a.value > 0)
        .map((dataPoint, idx) => ({ ...dataPoint, rank: idx > 11 ? 12 : idx + 1}))
    }
  });

  return [result, nameList];
}

const yScale = scaleBand({
  domain: Array(12).fill(0).map((_, idx) => idx),
  range: [0, height],
});

function BarChartAnimation(props) {
  const { data } = props;
  const [keyframes, nameList] = React.useMemo(() => makeKeyFrames(data), [data]);
  const [frameIdx, setFrameIdx] = React.useState(0);
  const frame = keyframes[frameIdx];
  const isEnd = !frame;
  React.useEffect(
    () => {
      if (frame && frameIdx !== keyframes.length - 1) {
        setTimeout(
          () => {
            if (!isEnd) {
              setFrameIdx(frameIdx + 1);
            }
          },
          250
        )
      }
    }
  );
  const colorScale = React.useMemo(
    () => scaleOrdinal(schemeTableau10).domain(nameList).range(schemeTableau10),
    [nameList]
  );
  if (!frame) {
    return false;
  }
  const { data: frameData } = frame;
  const values = frameData.map(({ value }) => value);
  const xScale = scaleLinear({
    domain: [0, Math.max(...values)],
    range: [0, width - padding.left],
  })
  return (
    <div>
      <svg width={width} height={height}>
        <SpringBarGroup
          frameData={frameData}
          xScale={xScale}
          yScale={yScale}
          colorScale={colorScale}
          padding={padding}
        />
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

export default BarChartAnimation;
