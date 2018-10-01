export default function (originalData, formattedData) {
  console.log(originalData, formattedData);
  const svgWidth = document.getElementsByClassName('z-score')[0].offsetWidth;
  const svgHeight = document.getElementsByClassName('z-score')[0].offsetHeight;

  const x = d3.scaleLinear()
    .range([0, svgWidth]);

  originalData.metrics.forEach((metric) => {
    const swarms = d3.selectAll(`.z-score-${metric}`)
      .append('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
        .append('line')
          .attr('class', 'z-spine')
          .attr('x1', 0)
          .attr('y1', svgHeight / 2)
          .attr('x2', svgWidth)
          .attr('y2', svgHeight / 2);
  });

  formattedData.forEach((datum) => {
    console.log(datum);
    x.domain(d3.extent(datum.values, function (d) { return d[1]; }));
    console.log(x.domain);
    const dots = d3.selectAll(`.z-score-${datum.metric}`).select('svg')
      .selectAll('.dot')
        .data(datum.values)
        .enter()
          .append('circle')
          .attr('class', 'dot')
          .attr('r', 2)
          .attr('cx', (d) => {
            console.log(d);
            return x(d[1]);
          })
          .attr('cy', svgHeight / 2)
          .style('fill', ('red'));
  });
}
