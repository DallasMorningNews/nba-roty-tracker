/* global d3:true */

import $ from 'jquery';
import Handlebars from 'handlebars';

import './furniture';

import drawChart from './drawChart';
import drawHistorical from './drawHistorical';
import drawRank from './drawRank';
import smartText from './smart-text';
import drawWinners from './drawWinners';
import displayExplainer from './explainer';

$(document).ready(() => {

  $('.highlight').click(function () {
    displayExplainer($(this));
  });

  $('.explainer__close').click(() => $('.explainer--click-displayed').removeClass('explainer--click-displayed'));


  // the location of our player data that's parsed from our python script
  const DATALOCATION = 'https://interactives.dallasnews.com/data-store/2018/nba-roty.json';
  let mode = 'traditional';

  const FORMATTED_DATA = []; // placeholder for our formatted data
  // handlebars sourcing and templating
  const playerModSource = document.getElementById('player-mod').innerHTML;
  const playerModTemplate = Handlebars.compile(playerModSource);

  // ***************************************************************************
  // HANDLEBARS HELPER FUNCTIONS
  // ***************************************************************************

  // removes spaces and special characters from player names, then lowercases it to use
  // as the image name
  Handlebars.registerHelper('imageName', player =>
    player.toLowerCase()
    .replace(/\s/g, '')
    .replace('.', '')
    .replace('\'', ''));

  // adds a br tag into player names when the window is wider than 1000. This is
  // so the display of player names are consistent regardless of length in the top five graphic
  Handlebars.registerHelper('breakName', (player) => {
    if ($(window).width() >= 1000) {
      const playerNames = player.split(' ');
      return new Handlebars.SafeString(`${playerNames[0]} <br /> ${playerNames[1]}`);
    } return player;
  });

  // rounds scores to two decimal places
  Handlebars.registerHelper('roundScore', score => score.toFixed(2));

  // toggles the visibility of various elements with the traditional or advanced
  // class depending on which mode is chosen
  function metricDisplay() {
    if (mode === 'traditional') {
      $('.traditional').removeClass('no-show');
      $('.advanced').addClass('no-show');
    } else {
      $('.traditional').addClass('no-show');
      $('.advanced').removeClass('no-show');
    }
  }

  // sorts players based on mode
  function sortPlayers(data) {
    if (mode === 'traditional') {
      data.players.sort((a, b) => b.total_stand_zscore - a.total_stand_zscore);
    } else {
      data.players.sort((a, b) => b.total_adv_zscore - a.total_adv_zscore);
    }
  }

  // function that draws the top five charts
  function drawTopSix(data, formattedData) {
    sortPlayers(data); // sort the players
    const playerModsContainer = document.getElementById('player__mods');
    playerModsContainer.innerHTML = ''; // clear the element that holds the charts

    for (let i = 0; i < 6; i += 1) {
      // create the html using handlebars template, add that html to the chart container,
      // then draw the chart
      const playerMod = playerModTemplate(data.players[i]);
      playerModsContainer.innerHTML += playerMod;
      drawChart(data, formattedData, data.players[i].player, mode);
    }
  }

  // adding controls to toggle the metric chosen
  function metricSwitcher(data) {
    $('.metric__flipper button').on('click', function () {
      // $('.metric__flipper button').toggleClass('flipper__traditional flipper__advanced');
      mode = $(this).attr('class').split('__')[1]; // update the mode
      drawTopSix(data, FORMATTED_DATA); // redraw the top five
      metricDisplay(mode); // show/hide appropriate elements
    });
  }

  // ***************************************************************************
  // FORMATTING THE DATA
  // taking our raw data file and mapping it into a format that will be easier
  // to do our d3 drawing with
  // ***************************************************************************

  function formatData(data) {
    sortPlayers(data);

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
      FORMATTED_DATA.push(metricObject);
    });

    smartText.updateSmartText(data, 'Luka Doncic');
    smartText.updateSmartText(data, 'Deandre Ayton');
    smartText.updateSmartText(data, 'Trae Young');
    smartText.updateDifferences(data, 'total_stand_zscore', 'Luka Doncic', 'Deandre Ayton');
    drawRank(data, mode); // draws the ranking chart
    drawTopSix(data, FORMATTED_DATA); // draws the top five chart
    drawHistorical(); // draws the historical chart
    metricDisplay();
    metricSwitcher(data); // sets up interactions with the metric switcher
    drawWinners();

    // ***************************************************************************
    // REDRAWING CHARTS ON WINDOW RESIZE
    // ***************************************************************************

    let windowWidth = $(window).width();

    $(window).resize(() => {
      setTimeout(() => {
        const newWidth = $(window).width();

        if (newWidth !== windowWidth) {
          $('.chart__container').html('');
          drawRank(data, mode);
          drawHistorical();
          drawWinners();
          drawTopSix(data, FORMATTED_DATA);
          metricDisplay();
          $('.metric__flipper button').off('click');
          metricSwitcher(data);
          windowWidth = newWidth;
        }
      }, 250);
    });
  }

  $(window).scroll(() => {
    // when the window scrolls, hide any explainers that are showing
    $('.explainer--click-displayed').removeClass('explainer--click-displayed');
  });


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
