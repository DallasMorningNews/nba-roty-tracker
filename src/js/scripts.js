import $ from 'jquery';

import './furniture';

$(document).ready(() => {
  console.log('Custom scripting goes here');


  const testData = [
    { player: 'Ben Simmons', winshare: 9.2 },
    { player: 'Jasyon Taturm', winshare: 7.1 },
    { player: 'Josh Hart', winshare: 3.4 },
    { player: 'Lauri Markkanen', winshare: 3.3 },
    { player: 'Tyler Cavanaugh', winshare: 1.2 },
    { player: 'Justin Jackson', winshare: 1.0 },
    { player: 'Jamil Wilson', winshare: 0.5 },
    { player: 'Jalen Jones', winshare: 0.1 },
    { player: 'Josh Jackson', winshare: -0.7 },
    { player: 'Dennis Smith', winshare: -0.7 },
  ];


  function getStandardDeviation(data, key) {
    let x = 0;
    let y = 0;
    let l = data.length;
    data.forEach((obj) => {
      x += obj[key];
      y += obj[key] ** 2;
    });

    const standardDeviation = Math.sqrt((y - ((x ** 2) / l)) / (l - 1));
    console.log(standardDeviation);
    return standardDeviation;
  }

  function getMean(data, key) {
    let x = 0;
    data.forEach(obj => x += obj[key]);
    const mean = x / data.length;
    console.log(mean);
    return mean;
  }

  function getZScore(data, scoreKey, target, targetKey) {
    const targetObj = data.filter(obj => obj[targetKey] === target)[0];
    console.log(targetObj);
    const targetScore = targetObj[scoreKey];
    console.log(targetScore);
    const standardDeviation = getStandardDeviation(data, scoreKey);
    const mean = getMean(data, scoreKey);

    const zScore = (targetScore - mean) / standardDeviation;
    console.log(zScore);
    return zScore;
  }

  getZScore(testData, 'winshare', 'Ben Simmons', 'player');
});
