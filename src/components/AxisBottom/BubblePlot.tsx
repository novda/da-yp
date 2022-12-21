import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";

const MARGIN = { top: 30, right: 30, bottom: 120, left: 120 };

type BubblePlotProps = {
  width: number;
  height: number;
  data: number[];
};

export const BubblePlot = ({ width, height, data }: BubblePlotProps) => {
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const dataCount: { [key: number]: number } = {};
  data.forEach((d) => {
    if (!(d in dataCount)) {
      dataCount[d] = 0;
    }
    dataCount[d] += 1;
  });

  const xScale = useMemo(() => {
    const [min, max] = d3.extent(data.map((d) => d)) as [number, number];
    return d3.scaleLinear().domain([min, max]).range([0, boundsWidth]).nice();
  }, [data, width]);

  const yScale = useMemo(() => {
    const [min, max] = d3.extent(
      Object.values(dataCount).map((d) => Number(d))
    ) as [number, number];
    return d3.scaleLinear().domain([min, max]).range([boundsHeight, 0]).nice();
  }, [data, height]);

  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();

    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", "translate(0," + (boundsHeight + 20) + ")")
      .call(xAxisGenerator);

    svgElement
      .append("text")
      .attr("font-size", 12)
      .attr("text-anchor", "end")
      .attr("x", boundsWidth)
      .attr("y", boundsHeight + 60)
      .text("Распределение по урожайности");

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement
      .append("g")
      .attr("transform", "translate(" + -20 + ",0)")
      .call(yAxisGenerator);
    svgElement
      .append("text")
      .attr("font-size", 12)
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", -60)
      .text("Количество яблонь")
      .attr("transform", "rotate(-90)");
  }, [xScale, boundsHeight, boundsWidth]);

  // Build the shapes
  const allShapes = data
    .sort((a, b) => a - b)
    .map((d, i) => {
      return (
        <circle
          key={i}
          r={10}
          cx={xScale(d)}
          cy={yScale(dataCount[d])}
          opacity={1}
          stroke={"#57EC81"}
          fill={"#57EC81"}
          fillOpacity={0.4}
          strokeWidth={1}
        />
      );
    });

  return (
    <div>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {allShapes}
        </g>
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        />
      </svg>
    </div>
  );
};
