/* global d3:true */


import pastWinners from '../data/past-winners.json';

export default function () {
  const ROTY = [
    'Derrick Rose',
    'Tyreke Evans',
    'Blake Griffin',
    'Kyrie Irving',
    'Damian Lillard',
    'Michael Carter-Williams',
    'Andrew Wiggins',
    'Karl-Anthony Towns',
    'Malcolm Brogdon',
    'Ben Simmons',
    'Luka Doncic',
  ];

  const years = ['2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019'];

  const bars = pastWinners.map(function (mark, i) {
    if (i % 2 === 0) {
      const bar = {
        year: mark.year,
        stat: mark.stat,
        start: mark.playerscore,
        end: pastWinners[i + 1].playerscore,
      };
      return bar;
    } return { year: null };
  });

  const barData = bars.filter(bar => bar.year !== null);

  // setting our graphics margin
  const margin = { top: 5, right: 10, bottom: 5, left: 10 };

  // getting the dimensions of chart. we want a square, so we set height to the width
  const chartWidth = $('#past-roty__graphic').width();
  const chartHeight = 960;

  const xScale = d3.scaleLinear()
    .range([50, chartWidth - margin.left - margin.right])
    .domain([0, d3.max(pastWinners.map(player => player.playerscore))]);

  const yScale0 = d3.scaleBand()
    .range([0, chartHeight - margin.top - margin.bottom])
    .domain(years)
    .padding(.1);

  const yScale1 = d3.scaleBand()
  .range([0, 50])
  .domain(['traditional', 'advanced']);

  const svg = d3.select('#past-roty__graphic').append('svg')
    .attr('width', chartWidth)
    .attr('height', chartHeight)
    .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const tooltip = d3.select('#past-roty__graphic').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  const tipMouseover = function (d) {
    const html = `<p><strong>${d.playername}</strong>: ${d.playerscore}</p>`;
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

  for (let i = 0; i < years.length; i += 1) {
    svg.append('line')
      .attr('x1', 50)
      .attr('x2', chartWidth - margin.left - margin.right)
      .attr('y1', yScale0(years[i]) + ((yScale0.bandwidth() / 2) + 10))
      .attr('y2', yScale0(years[i]) + ((yScale0.bandwidth() / 2) + 10))
      .style('stroke-dasharray', ('3, 3'))
      .attr('stroke-width', 1)
      .attr('stroke', 'rgb(215,215,215)');

    svg.append('line')
      .attr('x1', 50)
      .attr('x2', chartWidth - margin.left - margin.right)
      .attr('y1', yScale0(years[i]) + ((yScale0.bandwidth() / 2) - 10))
      .attr('y2', yScale0(years[i]) + ((yScale0.bandwidth() / 2) - 10))
      .style('stroke-dasharray', ('3, 3'))
      .attr('stroke-width', 1)
      .attr('stroke', 'rgb(215,215,215)');

    svg.append('text')
      .attr('x', 50)
      .attr('class', 'chart-label')
      .attr('y', yScale0(years[i]) + ((yScale0.bandwidth() / 2) + 8))
      .text('Adv.');

    svg.append('text')
      .attr('x', 50)
      .attr('class', 'chart-label')
      .attr('y', yScale0(years[i]) + ((yScale0.bandwidth() / 2) + 20))
      .text('0');

    svg.append('text')
      .attr('x', chartWidth - margin.left - margin.right)
      .attr('class', 'chart-label')
      .attr('y', yScale0(years[i]) + ((yScale0.bandwidth() / 2) + 20))
      .attr('text-anchor', 'end')
      .text(d3.max(pastWinners.map(player => player.playerscore)));

    svg.append('text')
      .attr('x', 50)
      .attr('class', 'chart-label')
      .attr('y', yScale0(years[i]) + ((yScale0.bandwidth() / 2) - 13))
      .text('Trad.');

    svg.append('text')
      .attr('x', 0)
      .attr('class', 'past__player-name')
      .attr('y', yScale0(years[i]) + 5)
      .text(`${ROTY[i]}, ${years[i]}`);

    svg.append('image')
      .attr('xlink:href', `images/_${ROTY[i].replace(/-|\s/g, '').toLowerCase()}.png`)
      .attr('x', 0)
      .attr('y', yScale0(years[i]) + ((yScale0.bandwidth() / 2) - 25))
      .attr('width', '40px')
      .attr('height', '40px')
      .attr('class', 'past-mug');
  }

  svg.selectAll('.barbell__trad')
    .data(barData.filter(bar => bar.stat === 'traditional'))
    .enter()
    .append('line')
    .classed('barbell__trad', true)
    .attr('stroke', 'rgb(215, 215, 215)')
    .attr('stroke-width', 3)
    .attr('x1', d => xScale(d.start))
    .attr('x2', d => xScale(d.end))
    .attr('y1', d => yScale0(d.year) + ((yScale0.bandwidth() / 2) - 10))
    .attr('y2', d => yScale0(d.year) + ((yScale0.bandwidth() / 2) - 10));

  svg.selectAll('.barbell__adv')
    .data(barData.filter(bar => bar.stat === 'advanced'))
    .enter()
    .append('line')
    .classed('barbell__adv', true)
    .attr('stroke', 'rgb(215, 215, 215)')
    .attr('stroke-width', 3)
    .attr('x1', d => xScale(d.start))
    .attr('x2', d => xScale(d.end))
    .attr('y1', d => yScale0(d.year) + ((yScale0.bandwidth() / 2) + 10))
    .attr('y2', d => yScale0(d.year) + ((yScale0.bandwidth() / 2) + 10));

  svg.selectAll('.past__trad')
    .data(pastWinners.filter(player => player.stat === 'traditional'))
    .enter()
    .append('circle')
      .classed('past__trad', true)
      .classed('rookie-dot', true)
      .classed('roty-dot', d => ROTY.includes(d.playername))
      .classed('roty-luka', d => d.playername === 'Luka Doncic')
      .attr('cy', function(d) {
        return yScale0(d.year) + ((yScale0.bandwidth() / 2) - 10);
      })
      .attr('cx', d => xScale(d.playerscore))
      .attr('r', 5)
      .attr('fill-opacity', 1)
      .on('mouseover', tipMouseover)
      .on('mouseout', tipMouseout);

  svg.selectAll('.past__adv')
    .data(pastWinners.filter(player => player.stat === 'advanced'))
    .enter()
    .append('circle')
    .classed('past__adv', true)
    .classed('rookie-dot', true)
    .classed('roty-dot', d => ROTY.includes(d.playername))
    .classed('roty-luka', d => d.playername === 'Luka Doncic')
      .attr('cy', function(d) {
        return yScale0(d.year) + ((yScale0.bandwidth() / 2) + 10);
      })
      .attr('cx', d => xScale(d.playerscore))
      .attr('r', 5)
      .attr('fill-opacity', 1)
      .on('mouseover', tipMouseover)
      .on('mouseout', tipMouseout);
}
