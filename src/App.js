import React from "react";
import axios from "axios";
import csvParse from "csv-parse/lib/sync";
import RacingBarChart from "./RacingBarChart";

const dataUrl = "/data/category-brands.csv";
const numOfBars = 12;
const numOfSlice = 10;
const chartWidth = 1200;
const chartHeight = 600;
const chartPadding = {
  top: 50,
  right: 50,
  bottom: 0,
  left: 50
};

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

const makeKeyframes = (data, numOfSlice) => {
  const findData = buildFindData(data);
  const nameSet = new Set(data.map(({ name }) => name));
  const nameList = [...nameSet];
  const dateSet = new Set(data.map(({ date }) => date));
  const dateList = [...dateSet];

  const frames = dateList.sort().map(date => ({
    date,
    data: nameList.map(name => {
      const dataPoint = findData({ date, name });
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
        data: data.sort((a, b) => b.value - a.value)
      };
    });

  return keyframes;
};

function App() {
  const [keyframes, setKeyframes] = React.useState([]);
  React.useEffect(() => {
    axios.get(dataUrl).then(resp => {
      const { data: csvString } = resp;
      const nextData = csvParse(csvString)
        .slice(1)
        .map(([date, name, category, value]) => ({
          date,
          name,
          category,
          value: Number(value)
        }));
      const keyframes = makeKeyframes(nextData, numOfSlice);
      setKeyframes(keyframes);
    });
  }, []);
  return (
    <div style={{ marginLeft: "2em" }}>
      <h1>Bar Chart Race Demo</h1>
      <section>
        This is a bar chart race of the value (in million dollars) of top global brands, during 2000 ~ 2019.
        <br/>
        It's inspired by <a target="_blank" rel="noopener noreferrer" href="https://observablehq.com/@d3/bar-chart-race">the work of Mike Bostock</a>, which is based on pure d3.
        I tried to make a similar one, but using React, <a target="_blank" rel="noopener noreferrer" href="https://www.react-spring.io/">react-spring</a> and <a href="https://vx-demo.now.sh/" rel="noopener noreferrer" target="_blank">vx</a>.
        <br/>
        source: <a rel="noopener noreferrer" href="https://github.com/chenesan/bar-chart-race" target="_blank">https://github.com/chenesan/bar-chart-race</a>
        <br/>
      </section>
      {keyframes.length > 0 && (
        <RacingBarChart
          keyframes={keyframes}
          numOfBars={numOfBars}
          width={chartWidth}
          height={chartHeight}
          padding={chartPadding}
        />
      )}
      <p>
        <a target="_blank" rel="noopener noreferrer" href="https://icons-for-free.com/bar+chart+black+background+chart+data+diagram+graph+icon-1320086870829698051/">Favicon</a> by Alla Afanasenko <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer"> CC BY </a>
      </p>
      
    </div>
  )
  
}

export default App;
