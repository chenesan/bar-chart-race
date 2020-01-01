import React from "react";
import RacingBarChart from "./RacingBarChart";
import useKeyframes from "./useKeyframes";

const dataUrl = "/data/category-brands.csv";
const numOfBars = 12;
const numOfSlice = 10;
const chartWidth = 1200;
const chartHeight = 600;
const chartMargin = {
  top: 50,
  right: 10,
  bottom: 30,
  left: 10,
};

function App() {
  const keyframes = useKeyframes(dataUrl, numOfSlice);
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
          margin={chartMargin}
        />
      )}
      <p>
        <a target="_blank" rel="noopener noreferrer" href="https://icons-for-free.com/bar+chart+black+background+chart+data+diagram+graph+icon-1320086870829698051/">Favicon</a> by Alla Afanasenko <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer"> CC BY </a>
      </p>
    </div>
  );
}

export default App;
