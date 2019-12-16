import React from 'react';
import { Bar } from '@vx/shape';
import { scaleLinear, scaleBand } from '@vx/scale';
import { Text } from "@vx/text";

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
    }
  });

  return result;
}

function BarChartAnimation(props) {
  const { data } = props;
  const keyframes = React.useMemo(() => makeKeyFrames(data), [data]);
  const [frameIdx, setFrameIdx] = React.useState(0);
  const frame = keyframes[frameIdx];
  if (!frame) {
    return false;
  }
  const { date, data: frameData } = frame;
  const values = frameData.map(({ value }) => value);
  const names = frameData.map(({ name }) => name);
  const xScale = scaleLinear({
    domain: [0, Math.max(...values)],
    range: [0, width - padding.left],
  })
  const yScale = scaleBand({
    domain: names.slice(0, 12),
    range: [0, height],
  });
  return (
    <div>
      <svg width={width} height={height}>
        {values.map(
          (value, idx) => {
            const name = names[idx];
            const barX = padding.left;
            const barY = yScale(name);
            if (typeof barY !== 'number') {
              return false;
            }
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
              <Text x={barX + 10} y={barY + barHeight / 2}>{`${name} ${value}`}</Text>
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

export default BarChartAnimation;