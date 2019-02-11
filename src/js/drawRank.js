/* global d3:true */
import journalize from 'journalize';
import apOrdinal from './ap-ordinal';


export default function (data, metric) {
  let thisMode = metric; // defining whether we're looking at traditional or advanced metrics
  let playerRanks = []; // empty array to hold our players

  // mapping arrays for each player to our playerRanks array
  playerRanks = data.players.map((player) => {
    const playerArray = [
      player.player,
      player.total_stand_zscore,
      player.total_adv_zscore,
      player.team,
      player.player_games,
    ];
    return playerArray;
  });

  // sorting our players by their traditional score, since that's the metric we default to
  playerRanks.sort((a, b) => {
    const valueA = a[1];
    const valueB = b[1];

    if (valueA < valueB) { return 1; } else if (valueA > valueB) { return -1; } return 0;
  });

  // getting the element where our chart will live
  const rankElem = document.getElementById('player__ranks');

  // setting variables for it's height and width
  const svgWidth = rankElem.clientWidth;
  const svgHeight = 35;

  // defining a variable for our dot radius
  const dotRadius = 8;

  // settting our x scale and range. We don't need a y scale for this chart since
  // all players live on the same plane
  const x = d3.scaleLinear()
    .range([dotRadius, svgWidth - (dotRadius * 2)]);


  let minMax = [];
  // defining our domain based on the metric supplied. Technically, we don't need
  // this check, but since we often switch our default view in testing, it's nice
  // to have the chart draw dynamically to the metric supplied
  if (metric === 'traditional') {
    x.domain(d3.extent(playerRanks, d => d[1]));
    minMax = d3.extent(playerRanks, d => d[1]);
  } else if (metric === 'advanced') {
    x.domain(d3.extent(playerRanks, d => d[2]));
    minMax = d3.extent(playerRanks, d => d[2]);
  }

  // our xAxis
  const xAxis = d3.axisBottom(x)
    .ticks(3)
    .tickSizeOuter(0)
    .tickValues([minMax[0], 0, minMax[1]]);

  // creating our svg element
  const svg = d3.select('#player__ranks .chart__container').append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);

  // creating the line that the dots live on
  // svg.append('line')
  //   .attr('x1', dotRadius)
  //   .attr('x2', svgWidth - (dotRadius * 2))
  //   .attr('y1', dotRadius + 2)
  //   .attr('y2', dotRadius + 2)
  //   .attr('stroke', 'rgb(215,215,215)')
  //   .attr('stroke-width', 1);

  // creating our tooltip element
  const tooltip = d3.select('#player__ranks .chart__container').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  // creating our tooltip element
  const tipMouseover = function (d) {
    // setting the content of the tooltip dependent on the player circle interacted
    // with and the metric selected, then displaying that tooltip
    let html = `<h6>${d[0]}</h6><p>${d[3]}</p><p><strong>Games: </strong>${d[4]}`;
    if (thisMode === 'traditional') {
      html += `<p><strong> <span class="advanced">Score: </strong>${d[1].toFixed(2)}</p>`;
    } else if (thisMode === 'advanced') {
      html += `<p><strong> <span class="advanced">Score: </strong>${d[2].toFixed(2)}</p>`;
    }
    tooltip.html(html)
      .transition()
        .duration(200)
        .style('opacity', 1);

    // getting the left and top position of the circle interacted with so we can
    // place our tooltip correctly
    const leftPos = this.getBoundingClientRect().x;
    const topPos = this.getBoundingClientRect().y;

    // setting the left position dependent on how close the circle is to the edge of the
    // screen. if the leftPos plus the width of the tooltip (200) is greater than
    // 90% of the window's width, we place the tooltip to the left of the circle
    tooltip.style('left', (d) => {
      if (leftPos + 200 > (window.innerWidth * 0.9)) {
        return `${leftPos - (200 - (dotRadius * 2))}px`;
      } return `${leftPos}px`;
    })
    .style('top', `${topPos + (dotRadius * 2) + 5}px`);
  };

  // function to hide the tooltip on mouseout
  const tipMouseout = (d) => {
    tooltip.transition()
      .duration(300)
      .style('opacity', 0);
  };

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${(dotRadius) + 2})`)
    .call(xAxis)
    .selectAll('.x text')
    .attr('dy', 15);

  svg.append('line')
    .attr('class', 'zeroLine')
    .attr('x1', x(0))
    .attr('x2', x(0))
    .attr('y1', 2)
    .attr('y2', (dotRadius * 2) + 2);

  // drawing our circles
  const ranks = svg.selectAll('.rank-circle')
    .data(playerRanks)
    .enter()
    .append('circle')
    .attr('class', 'rank-circle roty-2019')
    .classed('roty-luka', d => d[0] === 'Luka Doncic')
    .attr('r', dotRadius)
    .attr('cx', (d) => {
      if (metric === 'traditional') {
        return x(d[1]);
      } return x(d[2]);
    })
    .attr('cy', dotRadius + 2)
    .style('opacity', 0.75)
    .on('mouseover', tipMouseover)
    .on('mouseout', tipMouseout);
  // ----------------------------------------
  // HELPER FUNCTIONS
  // ----------------------------------------

  // animates the circles when the metric switcher is triggered using the data
  // already attached to the circles
  function animateData() {
    // reset the domain of the chart based on the metric selected
    if (thisMode === 'traditional') {
      x.domain(d3.extent(playerRanks, d => d[1]));
      minMax = d3.extent(playerRanks, d => d[1]);
    } else if (thisMode === 'advanced') {
      x.domain(d3.extent(playerRanks, d => d[2]));
      minMax = d3.extent(playerRanks, d => d[2]);
    }


    // animate the circles based on metric
    svg.selectAll('.rank-circle')
      .data(playerRanks)
      .transition()
      .duration(1000)
      .attr('cx', (d) => {
        if (thisMode === 'traditional') {
          return x(d[1]);
        } return x(d[2]);
      });

    xAxis.tickValues([minMax[0], 0, minMax[1]]);

    svg.select('.x')
      .transition()
      .duration(1000)
      .call(xAxis);
      // .selectAll('text')
      //   .attr('dy', 30);

    setTimeout(() => {
      svg.selectAll('.x text')
        .attr('dy', 15);
    }, 1);

    svg.select('.zeroLine')
      .transition()
      .duration(1000)
      .attr('x1', x(0))
      .attr('x2', x(0))
      .attr('y1', 2)
      .attr('y2', (dotRadius * 2) + 2);
  }

  // function to sort our player list based on metric. This used to figure out
  // our target player's rank in a given metric score
  function sortPlayers(dataToSort, i) {
    dataToSort.sort((a, b) => {
      const valueA = a[i];
      const valueB = b[i];

      if (valueA < valueB) { return 1; } else if (valueA > valueB) { return -1; } return 0;
    });

    return dataToSort;
  }

  // finds the player we're looking for and creates an object to use to update
  // the smart text in the chatter
  function findPlayer(players, name) {
    // clone the players array. We clone it because we don't want to update the order
    // of our original data, as that will jack up where players fall when animated
    let sortableData = players.slice(0);

    // sort based on thisMode
    if (thisMode === 'traditional') {
      sortableData = sortPlayers(sortableData, 1);
    } else {
      sortableData = sortPlayers(sortableData, 2);
    }

    // find the player and his index
    const targetPlayer = sortableData.find(player => player[0] === name);
    const targetIndex = sortableData.findIndex(player => player[0] === name);

    // create a player object we'll use to update the smart text
    const playerObj = {
      name: targetPlayer[0],
      tradScore: targetPlayer[1],
      advScore: targetPlayer[2],
      rank: targetIndex,
    };

    return playerObj;
  }

  // updates the chatter text when a metric mode is changed
  function updateChatter() {
    // find our player
    const ourPlayer = findPlayer(playerRanks, 'Luka Doncic');

    // update the score in the chatter text based on metric/mode
    d3.select('#rank__total-score').text(() => {
      if (thisMode === 'traditional') {
        return ourPlayer.tradScore.toFixed(2);
      } return ourPlayer.advScore.toFixed(2);
    });

    // update the rank in the chatter text
    d3.select('#rank__rank').text(apOrdinal(journalize.ordinal(ourPlayer.rank + 1)));
  }

  // runs our original chatter update when the chart is frst drawn
  updateChatter();

  // listens for when the metric flipper is interacted with
  d3.selectAll('.metric__flipper button').on('click', function () {
    d3.select(this).classed('flipper__traditional', !d3.select(this).classed('flipper__traditional'));
    d3.select(this).classed('flipper__advanced', !d3.select(this).classed('flipper__advanced'));
    // sets a new mode based on which metric button was pushed
    thisMode = d3.select(this).attr('class').split('__')[1];
    // animates the data and updates the chatter
    animateData();
    updateChatter();
  });
}
