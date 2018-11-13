/* global d3:true */

export default function(data, metric) {
  console.log(data);

  let playerRanks = [];
  playerRanks = data.players.map((player) => {
    const playerArray = [player.player, metric === 'advanced' ? player.total_adv_zscore : player.total_stand_zscore, player.team, player.player_games];
    return playerArray;
  });

  playerRanks.sort((a, b) => {
    const valueA = a[1];
    const valueB = b[1];

    if (valueA < valueB) { return 1; } else if (valueA > valueB) { return -1; } return 0;
  });


  const rankElem = document.getElementById('player__ranks');
  const svgWidth = rankElem.clientWidth;
  const svgHeight = 60;

  const dotRadius = 8;
  const imageSize = 50;

  const x = d3.scaleLinear()
    .range([((imageSize / 2)), svgWidth - imageSize])
    .domain(d3.extent(playerRanks, d => d[1]));

  console.log(svgHeight, svgWidth);

  const svg = d3.select('#player__ranks .chart__container').append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  svg.append('line')
    .attr('x1', 25)
    .attr('x2', svgWidth - 50)
    .attr('y1', dotRadius + 2)
    .attr('y2', dotRadius + 2)
    .attr('stroke', 'rgb(215,215,215)')
    .attr('stroke-width', 1);

  const tooltip = d3.select('#player__ranks .chart__container').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  const tipMouseover = function (d) {
    const html = `<h6>${d[0]}</h6><p>${d[2]}</p><p><strong>Games: </strong>${d[3]} <p><strong> Aggregate z-score: </strong>${d[1].toFixed(2)}</p>`;
    tooltip.html(html)
      .transition()
        .duration(200)
        .style('opacity', 0.9);

    const leftPos = this.getBoundingClientRect().x;
    const topPos = this.getBoundingClientRect().y;
    console.log(leftPos, topPos);

    tooltip.style('left', function (d) {
      if (leftPos + 200 > (window.innerWidth * 0.9)) {
        return `${leftPos - (200 - (dotRadius * 2))}px`;
      } return `${leftPos}px`;
    })
    .style('top', `${topPos + (dotRadius * 2) + 5}px`);
    // .style('left', function(d) {
    //   if (this.getBoundingClientRect().x + 200 > (window.innerWidth * 0.9)) {
    //     return `${this.getBoundingClinetRect().x - 250}px`;
    //   } return `${this.getBoundingClientRect().x}px`;
    // })
  };

  const tipMouseout = function (d) {
    tooltip.transition()
      .duration(300)
      .style('opacity', 0);
  };

  const ranks = svg.selectAll('.rank-circle')
    .data(playerRanks)
    .enter()
    .append('circle')
    .attr('class', 'rank-circle')
    .attr('r', dotRadius)
    .attr('cx', (d) => {
      return x(d[1]);
    })
    .attr('cy', dotRadius + 2)
    .attr('stroke', (d) => {
      if (d[0] === name) {
        return '#329ce8';
      } return 'rgb(175,175,175)';
    })
    .attr('stroke-width', 1)
    .style('fill', (d) => {
      if (d[0] === 'Luka Doncic') {
        return '#329ce8';
      } return 'rgb(215,215,215)';
    })
    .style('opacity', (d) => {
      if (d[0] === 'Luka Doncic') {
        return 1;
      } return 0.5;
    })
    .on('mouseover', tipMouseover)
    .on('mouseout', tipMouseout);

  d3.selectAll('.rank-circle').filter(function (d) {
    if (d !== undefined && d[0] === 'Luka Doncic') {
      d3.select(this).moveToFront();
    } return null;
  });
}
