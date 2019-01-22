/* global d3:true */

export default function (originalData, formattedData, name, metricFormat) {
  const playerElem = d3.select('.player').node();
  const svgWidth = playerElem.getBoundingClientRect().width;
  const svgHeight = 50;
  const dotRadius = 4;

  d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
      this.parentNode.appendChild(this);
    });
  };

  const x = d3.scaleLinear()
    .range([(dotRadius + 1), svgWidth - (dotRadius + 1)]);

  const targetPlayer = d3.selectAll('.player')
    .datum(function () {
      return this.dataset;
    })
    .filter((d) => {
      if (d.playername === name) {
        return d;
      } return null;
    });

  originalData.metrics.forEach((metric) => {
    const targetMetric = targetPlayer.select(`.z-score-${metric}`)
      .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    targetMetric.append('text')
      .attr('y', 10)
      .attr('class', 'line-label')
      .text(metric);

    targetMetric.append('line')
        .attr('class', 'z-spine')
        .attr('x1', dotRadius)
        .attr('y1', svgHeight / 2)
        .attr('x2', svgWidth - dotRadius)
        .attr('y2', svgHeight / 2);
  });

  formattedData.forEach((datum) => {
    x.domain(d3.extent(datum.values, d => d[1]));

    const zeroLine = targetPlayer.select(`.z-score-${datum.metric}`).select('svg')
      .append('line')
      .attr('x1', x(0))
      .attr('x2', x(0))
      .attr('y1', svgHeight / 4)
      .attr('y2', svgHeight - (svgHeight / 4))
      .attr('class', 'zeroLine');

    const dots = targetPlayer.select(`.z-score-${datum.metric}`).select('svg')
      .selectAll('.dot')
        .data(datum.values)
        .enter()
          .append('circle')
          .attr('class', 'dot')
          .attr('r', dotRadius)
          .attr('cx', (d) => {
            return x(d[1]);
          })
          .attr('cy', svgHeight / 2)
          .attr('stroke', (d) => {
            if (d[0] === name && d[0] === 'Luka Doncic') {
              return '#0165a0';
            } else if (d[0] === name) {
              return '#feb31c';
            } return 'rgb(175,175,175)';
          })
          .attr('stroke-width', 1)
          .style('fill', (d) => {
            if (d[0] === name && d[0] === 'Luka Doncic') {
              return '#329ce8';
            } else if (d[0] === name) {
              return '#fec44f';
            } return 'rgb(215,215,215)';
          })
          .style('opacity', (d) => {
            if (d[0] === name) {
              return 0.85;
            } return 0.5;
          });
  });

  d3.selectAll('.dot').filter(function (d) {
    if (d !== undefined && d[0] === name) {
      d3.select(this).moveToFront();
    } return null;
  });
}
