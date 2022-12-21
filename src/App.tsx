import "./App.scss";

import { generateData } from "./data/generateData";
import CircleSVG from "./components/CircleSVG/CircleSVG";
import { data } from "./data/data";
import { BubblePlot } from "./components/AxisBottom/BubblePlot";
import * as d3 from "d3";
import { useEffect } from "react";

function chunkData(data: number[]) {
  let dc = 0;
  let dcList: number[] = [];
  let result: number[][] = [];

  data.forEach((d) => {
    if (dc < 36) {
      dcList.push(d);
      dc += 1;
    } else {
      result.push(dcList);
      dc = 0;
      dcList = [];
    }
  });

  return result;
}

function App() {
  const filteredData:number[] = data.map((n) => Math.floor(n));

  function triggerTransitionDelay() {
    d3.selectAll("circle")
      .transition()
      .duration(2000)
      .attr("cy", 300)
      .delay(function (i: any) {
        return i * 10;
      });
  }

  return (
    <div className="Apple-tree">
      <div className="Apple-tree-garden">
        <BubblePlot data={filteredData} width={764} height={573} />
        <div id="dataviz_delay"></div>
      </div>
      <div className="Apple-tree-navigation"></div>
    </div>
  );
}

export default App;
