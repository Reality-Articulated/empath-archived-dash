import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

function RadarChart(props) {
  const chartRef = useRef(null);

  useEffect(() => {
    // clear the svg
    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3.select(chartRef.current);

    const gradient = svg
      .append("defs")
      .append("radialGradient")
      .attr("id", "radial-gradient");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#1f2122")
      .attr("stop-opacity", 0);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#0081f8")
      .attr("stop-opacity", 0.4);

    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${250}, ${250})`);

    const data = props.data;
    const categories = data.map((d) => d.category);

    const color = d3
      .scaleOrdinal()
      .domain(categories)
      .range(["#0081f8", "#0571d5", "#0571d5"]);

    const sizeScale = d3.scaleLinear().domain([0, 1]).range([0, 200]);

    const radiusScale = d3.scaleLinear().domain([0, 1]).range([0, 200]);

    chartGroup
      .selectAll(".radarLines")
      .data(categories)
      .enter()
      .append("line")
      .attr("class", "radarLines")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr(
        "x2",
        (d, i) =>
          radiusScale(1.05) *
          Math.cos((i * (Math.PI * 2)) / categories.length - Math.PI / 2)
      )
      .attr(
        "y2",
        (d, i) =>
          radiusScale(1.05) *
          Math.sin((i * (Math.PI * 2)) / categories.length - Math.PI / 2)
      )
      .style("stroke", "#aaaaaa")
      .style("stroke-width", 1);

    const blobWrapper = chartGroup
      .selectAll(".radarWrapper")
      .data([data])
      .enter()
      .append("g")
      .attr("class", "radarWrapper");

    // Append the backgrounds
    blobWrapper
      .append("path")
      .attr("class", "radarArea")
      .attr(
        "d",
        d3
          .radialArea()
          .angle((d, i) => (i * (Math.PI * 2)) / categories.length)
          .innerRadius(0)
          .outerRadius((d) => sizeScale(d.value))
          .curve(d3.curveLinearClosed)
      )
      .style("fill", (d, i) => color(i))
      .style("fill", "url(#radial-gradient)")
      .datum([...data, data[0]]);

    // Append the lines
    blobWrapper
      .append("path")
      .attr("class", "radarStroke")
      .attr(
        "d",
        d3
          .radialLine()

          .angle((d, i) => (i * (Math.PI * 2)) / categories.length)
          .radius((d) => sizeScale(d.value))
          .curve(d3.curveLinearClosed)
      )
      .style("stroke-width", 3)
      .style("stroke", (d, i) => color(i))
      .style("fill", "none")
      .style("filter", "url(#glow)")
      .datum([...data, data[0]]);

    // Draw a circle in the center
    chartGroup
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 8)
      .style("fill", "#aaaaaa")
      .style("stroke", "#1f2020")
      .style("stroke-width", 2);

    // Modify the radar area to wrap properly
    const radarAreaGenerator = d3
      .radialArea()
      .angle((d, i) => (i * (Math.PI * 2)) / categories.length)
      .innerRadius(0)
      .outerRadius((d) => sizeScale(d.value))
      .curve(d3.curveCardinalClosed);

    // Append the circles
    blobWrapper
      .selectAll(".radarCircle")
      .data((d) => d)
      .enter()
      .append("circle")
      .attr("class", "radarCircle")
      .attr("r", 5)
      .attr(
        "cx",
        (d, i) =>
          radiusScale(d.value) *
          Math.cos((i * (Math.PI * 2)) / categories.length - Math.PI / 2)
      )
      .attr(
        "cy",
        (d, i) =>
          radiusScale(d.value) *
          Math.sin((i * (Math.PI * 2)) / categories.length - Math.PI / 2)
      )
      .style("fill", (d, i, j) => color(j))
      .style("fill-opacity", 1.0);

    // Append the labels at each axis
    const label = chartGroup
      .selectAll(".label")
      .data(categories)
      .enter()
      .append("g")
      .attr("class", "label");

    label
      .append("circle")
      .attr("cx", (d, i) => {
        const factor = 0.95;
        return (
          radiusScale(1.1) *
          factor *
          Math.cos((i * (Math.PI * 2)) / categories.length - Math.PI / 2)
        );
      })
      .attr("cy", (d, i) => {
        const factor = 0.95;
        return (
          radiusScale(1.1) *
          factor *
          Math.sin((i * (Math.PI * 2)) / categories.length - Math.PI / 2)
        );
      })
      .attr("r", 5)
      .style("fill", "#aaaaaa");

    label
      .append("text")
      .attr("class", "labelText")
      .attr(
        "x",
        (d, i) =>
          radiusScale(1.1) *
          Math.cos((i * (Math.PI * 2)) / categories.length - Math.PI / 2)
      )
      .attr("y", (d, i) => {
        const angle = (i * (Math.PI * 2)) / categories.length;
        const basicY = radiusScale(1.1) * Math.sin(angle - Math.PI / 2);
        let yOffset = 0; // this will be the offset we add/subtract to the y value

        if (
          Math.abs(angle - Math.PI / 2) < 0.01 ||
          Math.abs(angle - (3 * Math.PI) / 2) < 0.01
        ) {
          yOffset = 20; // for top and bottom
        } else if (angle > Math.PI / 2 && angle < (3 * Math.PI) / 2) {
          // max shift when angle is π/2 (top) or 3π/2 (bottom) and minimal shift at π (left)
          yOffset = 15; // '+' because we want to shift downwards
        } else if (angle < Math.PI / 2 || angle > (3 * Math.PI) / 2) {
          // max shift when angle is π/2 (top) or 3π/2 (bottom) and minimal shift at 0 (right)
          yOffset = -8; // '-' because we want to shift upwards
        }
        return basicY + yOffset;
      })
      .text((d) => d)
      .style("text-anchor", "middle")
      .style("font-size", 14)
      .style("fill", "#aaaaaa")
      .style("font-weight", "bold");
  }, [props.data]);

  return <svg ref={chartRef} width="500" height="500"></svg>;
}

export default RadarChart;
