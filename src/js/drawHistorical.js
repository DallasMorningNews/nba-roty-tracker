/* global d3:true */


import $ from 'jquery';
import allPastRookies from '../data/all_past_rookies.json';

import figureMinMax from './figureMinMax';

export default function () {
  const ROTY = [
    'Ben Simmons',
    'Malcolm Brogdon',
    'Karl-Anthony Towns',
    'Andrew Wiggins',
    'Michael Carter-Williams',
    'Damian Lillard',
    'Kyrie Irving',
    'Blake Griffin',
    'Tyreke Evans',
    'Derrick Rose',
  ];

  // setting our graphics margin
  const margin = { top: 5, right: 10, bottom: 5, left: 10 };

  // getting the dimensions of chart. we want a square, so we set height to the width
  const chartWidth = $('#all-roty__graphic').width();
  const chartHeight = chartWidth;

  const tradMinMax = figureMinMax(allPastRookies, 'traditional');
  const advMinMax = figureMinMax(allPastRookies, 'advanced');

  console.log(tradMinMax, advMinMax);

  const xScale = d3.scaleLinear()
    .domain(tradMinMax)
    .range([margin.left, chartWidth - margin.right - margin.left]);

  const yScale = d3.scaleLinear()
    .domain(advMinMax)
    .range([chartHeight - margin.bottom - margin.top, margin.top]);

  const xAxis = d3.axisBottom(xScale)
    .ticks(2)
    .tickValues([tradMinMax[0], tradMinMax[1]]);
  const yAxis = d3.axisLeft(yScale)
    .ticks(2)
    .tickValues([advMinMax[0], advMinMax[1]]);

  const svg = d3.select('#all-roty__graphic')
    .append('svg')
    .attr('width', chartWidth)
    .attr('height', chartHeight)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const tooltip = d3.select('#all-roty__graphic').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  const tipMouseover = function (d) {
    const html = `<h6>${d.name} <br />(${d.year})</h6><p><strong>Traditional: </strong>${d.traditional.toFixed(2)} <p><strong> Advanced: </strong>${d.advanced.toFixed(2)}</p>`;
    tooltip.html(html)
      .transition()
        .duration(200)
        .style('opacity', 0.9);

    const leftPos = this.getBoundingClientRect().x;
    const topPos = this.getBoundingClientRect().y;

    tooltip.style('left', function (d) {
      if (leftPos + 200 > (window.innerWidth * 0.9)) {
        return `${leftPos - (200 - (5 * 2))}px`;
      } return `${leftPos}px`;
    })
    .style('top', `${topPos + (5 * 2) + 5}px`);
  };

  const tipMouseout = function (d) {
    tooltip.transition()
      .duration(300)
      .style('opacity', 0);
  };

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${(chartHeight - margin.top) / 2})`)
    .call(xAxis)
    .append('text')
      .attr('class', 'chart-label')
      .attr('x', margin.left)
      .attr('y', -6)
      .style('text-anchor', 'start')
      .text('Traditional z-score');

  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${(chartWidth - margin.left) / 2}, 0)`)
    .call(yAxis)
    .append('text')
      .attr('class', 'chart-label')
      .attr('transform', 'rotate(90)')
      .attr('x', margin.top)
      .attr('y', -6)
      .style('text-anchor', 'start')
      .text('Advanced z-score');

  svg.selectAll('.rookie-dot')
    .data(allPastRookies)
    .enter()
    .append('circle')
    .classed('rookie-dot', true)
    .classed('roty-dot', d => ROTY.includes(d.name))
    .classed('roty-luka', d => d.name === 'Luka Doncic')
    .classed('roty-2019', d => d.year === '2018-19')
    .attr('r', 5)
    .attr('cx', d => xScale(d.traditional))
    .attr('cy', d => yScale(d.advanced))
    .on('mouseover', tipMouseover)
    .on('mouseout', tipMouseout);

  d3.selectAll('.rookie-dot').filter(function (d) {
    if (d !== undefined && ROTY.includes(d.name)) {
      d3.select(this).moveToFront();
    } return null;
  });
}
