import { useEffect, useMemo, useRef, useState, MouseEvent } from "react";
import * as d3 from "d3";
import cn from "classnames";

import "./Bubbles.scss";

const MARGIN = { top: 50, right: 40, bottom: 120, left: 100 };
const MARGINCENTERED = { top: 40, right: 40, bottom: 120, left: 60 };

type Bubbles = {
  width: number;
  height: number;
  data: number[];
};

export const Bubbles = ({ width, height, data }: Bubbles) => {
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const [isPlot, setIsPlot] = useState(false);

  const getColor = (weightCrop: number): string => {
    let rgb: number[] | string[] = [63, 226, 109];

    const eps = 150 - weightCrop;

    rgb = rgb.map((c) => c + eps).map((rc) => rc.toString(16));

    const resultColor = `#${rgb.join("")}`;

    return resultColor;
  };

  const dataCount: { [key: number]: number } = {};
  data.forEach((d) => {
    if (!(d in dataCount)) {
      dataCount[d] = 0;
    }
    dataCount[d] += 1;
  });

  const xScaleOnGarden = useMemo(() => {
    const [min, max] = d3.extent(data.map((d, i) => i)) as [number, number];
    return d3.scaleLinear().domain([min, max]).range([0, boundsWidth]);
  }, [data, width]);

  const yScaleOnGarden = useMemo(() => {
    const [min, max] = d3.extent(data.map((d) => d)) as [number, number];
    return d3.scaleLinear().domain([min, max]).range([boundsHeight, 0]);
  }, [data, height]);

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

    if (isPlot) {
      const xAxisGenerator = d3.axisBottom(xScale);
      svgElement
        .append("g")
        .attr("transform", "translate(0," + (boundsHeight + 20) + ")")
        .attr("class", "xAxis")
        .call(xAxisGenerator);
      svgElement
        .append("text")
        .attr("font-size", 12)
        .attr("text-anchor", "end")
        .attr("x", boundsWidth)
        .attr("y", boundsHeight + 60)
        .attr("class", "xAxis-text")
        .text("Распределение по урожайности");

      const yAxisGenerator = d3.axisLeft(yScale);
      svgElement
        .append("g")
        .attr("transform", "translate(" + -20 + ",0)")
        .attr("class", "yAxis")
        .call(yAxisGenerator);
      svgElement
        .append("text")
        .attr("font-size", 12)
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -60)
        .attr("class", "yAxis-text")
        .text("Количество яблонь")
        .attr("transform", "rotate(-90)");
    } else {
      const xAxisGenerator = d3.axisBottom(xScaleOnGarden);
      svgElement
        .append("g")
        .attr("transform", "translate(0," + (boundsHeight + 20) + ")")
        .attr("class", "xAxis")
        .call(xAxisGenerator);
      svgElement
        .append("text")
        .attr("font-size", 12)
        .attr("text-anchor", "end")
        .attr("x", boundsWidth)
        .attr("y", boundsHeight + 60)
        .text("*садовника не перфекциониста");

      const yAxisGenerator = d3.axisLeft(yScaleOnGarden);
      svgElement
        .append("g")
        .attr("transform", "translate(" + -20 + ",0)")
        .attr("class", "yAxis")
        .call(yAxisGenerator);
      svgElement
        .append("text")
        .attr("font-size", 12)
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -60)
        .attr("transform", "rotate(-90)");
    }
  }, [
    xScale,
    yScale,
    xScaleOnGarden,
    yScaleOnGarden,
    boundsHeight,
    boundsWidth,
    isPlot,
  ]);

  useEffect(() => {
    d3.select(".Bubbles")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  }, []);

  const allShapes = data.map((d, i) => {
    return (
      <circle
        key={i}
        r={10}
        cx={xScaleOnGarden(i)}
        cy={yScaleOnGarden(d)}
        opacity={1}
        stroke={getColor(d)}
        fill={getColor(d)}
        fillOpacity={0.5}
        strokeWidth={1}
        onMouseOver={function (event) {
          d3.select(".tooltip").transition().duration(200).style("opacity", 1);
          d3.select(".tooltip")
            .html(`${d} кг`)
            .style("left", `${event.clientX - 35}px`)
            .style("top", `${event.clientY - 40}px`)
            .style("z-index", "100");
        }}
        onMouseOut={function () {
          d3.select(".tooltip")
            .transition()
            .duration(400)
            .style("opacity", 0)
            .style("z-index", "-1");
        }}
      />
    );
  });

  function handleFirstPage(e: MouseEvent) {
    e.preventDefault();

    d3.selectAll("circle")
      .classed("isPlot", false)
      .data(data)
      .join("circle")
      .transition()
      .duration(500)
      .attr("cy", function (d, i) {
        return yScaleOnGarden(d);
      })
      .attr("cx", function (d, i) {
        return xScaleOnGarden(i);
      });
    setIsPlot(false);
  }

  function handleSecondPage(e: MouseEvent) {
    e.preventDefault();

    d3.selectAll("circle")
      .classed("isPlot", true)
      .data(data)
      .join("circle")
      .transition()
      .duration(500)
      .attr("cx", function (d) {
        return xScale(d);
      })
      .attr("cy", function (d) {
        return yScale(dataCount[d]);
      });

    setIsPlot(true);
  }

  return (
    <div className={cn("Bubbles", { _isPlot: isPlot })}>
      <div className="Bubbles-title">
        <div className="Bubbles-title-first">Сад с яблонями*</div>
        <div className="Bubbles-title-second">
          График нормального распределения
        </div>
      </div>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${
            isPlot
              ? [MARGIN.left, MARGIN.top].join(",")
              : [MARGINCENTERED.left, MARGINCENTERED.top].join(",")
          })`}
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
      <div className="Bubbles-button">
        <button
          onClick={(e) => handleFirstPage(e)}
          disabled={!isPlot}
          className="Bubbles-button-first_page"
        >
          {"<"}
        </button>
        <button
          onClick={(e) => handleSecondPage(e)}
          disabled={isPlot}
          className="Bubbles-button-second_page"
        >
          {">"}
        </button>
      </div>
    </div>
  );
};
