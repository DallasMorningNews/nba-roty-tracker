/* global d3:true */

import $ from 'jquery';
import './furniture';

import drawChart from './drawChart';

$(document).ready(() => {
  // the location of our player data that's parsed from our python script
  const DATALOCATION = '../data/roty-metrics.json';

  // ***************************************************************************
  // FORMATTING THE DATA
  // taking our raw data file and mapping it into a format that will be easier
  // to do our d3 drawing with
  // ***************************************************************************

  function formatData(data) {
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

    console.log(formattedData);
    drawChart(data, formattedData);
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

  // console.log('Custom scripting goes here');
  //
  //
  // const testData = {
  //   metrics: ['winshare', 'per'],
  //   stats: [],
  //   players: [
  //     {
  //       player: 'Ben Simmons',
  //       metrics: {
  //         winshare: 9.2,
  //         per: 20,
  //       },
  //     },
  //     { player: 'Jasyon Taturm', metrics: { winshare: 7.1, per: 15.3 } },
  //     { player: 'Josh Hart', metrics: { winshare: 3.4, per: 12.2 } },
  //     { player: 'Lauri Markkanen', metrics: { winshare: 3.3, per: 15.6 } },
  //     { player: 'Tyler Cavanaugh', metrics: { winshare: 1.2, per: 13.0 } },
  //     { player: 'Justin Jackson', metrics: { winshare: 1.0, per: 9.2 } },
  //     { player: 'Jamil Wilson', metrics: { winshare: 0.5, per: 11.4 } },
  //     { player: 'Jalen Jones', metrics: { winshare: 0.1, per: 10.3 } },
  //     { player: 'Josh Jackson', metrics: { winshare: -0.7, per: 11.8 } },
  //     { player: 'Dennis Smith', metrics: { winshare: -0.7, per: 12.8 } },
  //   ],
  // };
  //
  // function getStandardDeviation(data, key) {
  //   let x = 0;
  //   let y = 0;
  //   let l = data.length;
  //   data.forEach((obj) => {
  //     x += obj[key];
  //     y += obj[key] ** 2;
  //   });
  //
  //   const standardDeviation = Math.sqrt((y - ((x ** 2) / l)) / (l - 1));
  //   return standardDeviation;
  // }
  //
  // function getMean(data, key) {
  //   let x = 0;
  //   data.forEach(obj => x += obj[key]);
  //   const mean = x / data.length;
  //   return mean;
  // }
  //
  // function setZScores(data) {
  //   // get the keys that we need to calculate stats for
  //   const metrics = data.metrics;
  //
  //
  //   metrics.forEach((metric) => {
  //     const stat = {metric, value}
  //   });
  //
  //   testData.standardDeviations.push(sdObj);
  //   testData.means.push(meanObj);
  // }
  //
  // setZScores(testData);
  // console.log(testData);
  //
  // function getZScore(data, scoreKey, target, targetKey) {
  //   const targetObj = data.filter(obj => obj[targetKey] === target)[0];
  //   const targetScore = targetObj[scoreKey];
  //   const standardDeviation = getStandardDeviation(data, scoreKey);
  //   const mean = getMean(data, scoreKey);
  //
  //   const zScore = (targetScore - mean) / standardDeviation;
  //   return zScore;
  // }
  //
  // // getZScore(testData, 'winshare', 'Ben Simmons', 'player');
});
