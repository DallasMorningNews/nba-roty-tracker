/* global d3:true */


import $ from 'jquery';
import allPastRookies from '../data/all_past_rookies.json';
import figureMinMax from './figureMinMax';

const lukaDoncic = allPastRookies.filter(rookie => rookie.name === 'Luka Doncic');
const blakeGriffin = allPastRookies.filter(rookie => rookie.name === 'Blake Griffin');
const benSimmons = allPastRookies.filter(rookie => rookie.name === 'Ben Simmons');

$('.rookie_count').text(allPastRookies.length - 1);

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

  const minMax = tradMinMax[1] >= advMinMax[1] ? tradMinMax : advMinMax;

  const xScale = d3.scaleLinear()
    .domain(minMax)
    .range([margin.left, chartWidth - margin.right - margin.left]);

  const yScale = d3.scaleLinear()
    .domain(minMax)
    .range([chartHeight - margin.bottom - margin.top, margin.top]);

  const xAxis = d3.axisBottom(xScale)
    .ticks(2)
    .tickValues([minMax[0], minMax[1]]);
  const yAxis = d3.axisLeft(yScale)
    .ticks(2)
    .tickValues([minMax[0], minMax[1]]);

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
        return `${leftPos - (100 - (5 * 2))}px`;
      } return `${leftPos}px`;
    })
    .style('top', `${topPos + (5 * 2) + 5}px`);
  };

  const tipMouseout = function (d) {
    tooltip.transition()
      .duration(300)
      .style('opacity', 0);
  };

  svg.append('text')
    .text('Luka Doncic')
    .attr('class', 'player-label')
    .attr('x', xScale(lukaDoncic[0].traditional) - 30)
    .attr('y', yScale(lukaDoncic[0].advanced) - 40)
    .attr('text-anchor', 'end');

  svg.append('line')
    .attr('class', 'player-label-rule')
    .attr('x1', xScale(lukaDoncic[0].traditional) - 28)
    .attr('x2', xScale(lukaDoncic[0].traditional))
    .attr('y1', yScale(lukaDoncic[0].advanced) - 38)
    .attr('y2', yScale(lukaDoncic[0].advanced))
    .attr('stroke-width', 1)
    .attr('stroke', 'rgb(215,215,215)');

  svg.append('text')
    .text('Blake Griffin')
    .attr('class', 'player-label')
    .attr('x', xScale(blakeGriffin[0].traditional) - 20)
    .attr('y', yScale(blakeGriffin[0].advanced) + 3)
    .attr('text-anchor', 'end');

  svg.append('line')
    .attr('class', 'player-label-rule')
    .attr('x1', xScale(blakeGriffin[0].traditional) - 15)
    .attr('x2', xScale(blakeGriffin[0].traditional))
    .attr('y1', yScale(blakeGriffin[0].advanced))
    .attr('y2', yScale(blakeGriffin[0].advanced))
    .attr('stroke-width', 1)
    .attr('stroke', 'rgb(215,215,215)');

  svg.append('text')
    .text('Ben Simmons')
    .attr('class', 'player-label')
    .attr('x', xScale(benSimmons[0].traditional))
    .attr('y', yScale(benSimmons[0].advanced) + 30)
    .attr('text-anchor', 'middle');

  svg.append('line')
    .attr('class', 'player-label-rule')
    .attr('x1', xScale(benSimmons[0].traditional))
    .attr('x2', xScale(benSimmons[0].traditional))
    .attr('y1', yScale(benSimmons[0].advanced))
    .attr('y2', yScale(benSimmons[0].advanced) + 20)
    .attr('stroke-width', 1)
    .attr('stroke', 'rgb(215,215,215)');

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${(chartHeight - margin.top) / 2})`)
    .call(xAxis)
    .append('text')
      .attr('class', 'chart-label')
      .attr('x', margin.left)
      .attr('y', -6)
      .style('text-anchor', 'start')
      .text('Traditional score');

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
      .text('Advanced score');

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
    if ((d !== undefined && ROTY.includes(d.name)) || (d !== undefined && d.year === '2018-19')) {
      d3.select(this).moveToFront();
    } return null;
  });

  window.addEventListener('scroll', tipMouseout);
}
