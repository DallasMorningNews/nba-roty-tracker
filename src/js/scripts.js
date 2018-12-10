/* global d3:true */

import $ from 'jquery';
import Handlebars from 'handlebars';

import './furniture';

import drawChart from './drawChart';
import drawHistorical from './drawHistorical';
import drawRank from './drawRank';

$(document).ready(() => {
  // the location of our player data that's parsed from our python script
  const DATALOCATION = 'https://interactives.dallasnews.com/data-store/2018/nba-roty.json';

  const MODE = 'advanced';
  // handlebars sourcing and templating
  const playerModSource = document.getElementById('player-mod').innerHTML;
  const playerModTemplate = Handlebars.compile(playerModSource);

  Handlebars.registerHelper('imageName', player =>
    player.toLowerCase()
    .replace(/\s/g, '')
    .replace('.', ''));

  Handlebars.registerHelper('roundScore', score => score.toFixed(2));


  // ***************************************************************************
  // FORMATTING THE DATA
  // taking our raw data file and mapping it into a format that will be easier
  // to do our d3 drawing with
  // ***************************************************************************

  function formatData(data) {
    if (MODE === 'traditional') {
      data.players.sort((a, b) => b.total_stand_zscore - a.total_stand_zscore);
    } else {
      data.players.sort((a, b) => b.total_adv_zscore - a.total_adv_zscore);
    }

    const formattedData = []; // placeholder for our formatted data
    data.metrics.forEach((metric) => {
      // for each metric in our data, create an object with the metric value and
      // arrays of player name and value pairs

      // our placeholder object
      const metricObject = {
        metric,
        values: undefined,
      };
      // mapping the player name/value pairs to an array
      const mappedMetric = data.players.map((player) => {
        const playerArray = [player.player, player.zscores[metric]];
        return playerArray;
      });
      // pushing that array to our values key in our metricObject
      metricObject.values = mappedMetric;
      // pushing that object to our formattedData array
      formattedData.push(metricObject);
    });
    console.log(data, formattedData);

    const playerModsContainer = document.getElementById('player__mods');

    // let lukaTop5 = false;

    for (let i = 0; i < 8; i += 1) {
      const playerMod = playerModTemplate(data.players[i]);
      playerModsContainer.innerHTML += playerMod;
      drawChart(data, formattedData, data.players[i].player, MODE);
      // if (data.players[i].player.player === 'Luka Doncic') {
      //   lukaTop5 = true;
      // }
    }

    // if (lukaTop5 === false) {
    //   const luka = data.players.find((player) => {
    //     if (player.player === 'Luka Doncic') {
    //       return player;
    //     }
    //   });
    //   console.log(luka);
    //   const lukaMod = playerModTemplate(luka);
    //   playerModsContainer.innerHTML += lukaMod;
    //   drawChart(data, formattedData, 'Luka Doncic');
    //   playerModsContainer.classList.add('six-grid');
    // }

    // drawChart(data, formattedData);

    drawRank(data, MODE);

    if (MODE === 'traditional') {
      $('.traditional').removeClass('no-show');
      $('.advanced').addClass('no-show');
    } else {
      $('.traditional').addClass('no-show');
      $('.advanced').removeClass('no-show');
    }

    drawHistorical(data);
  }

  // ***************************************************************************
  // GRETTING THE DATA
  // ***************************************************************************

  const xhr = new XMLHttpRequest();
  xhr.open('GET', DATALOCATION);
  xhr.onload = () => {
    if (xhr.status === 200) {
      formatData(JSON.parse(xhr.responseText));
    } else {
      console.log('problem loading data');
    }
  };
  xhr.send();
});
