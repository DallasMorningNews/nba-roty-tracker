import $ from 'jquery'

// determines what should be supplied for the headline question
function sortPlayers(data, metric) {
  let sortedData;
  if (metric === 'traditional') {
    sortedData = data.players.sort((a, b) => b.total_stand_zscore - a.total_stand_zscore);
  } else if (metric === 'advanced') {
    sortedData = data.players.sort((a, b) => b.total_adv_zscore - a.total_adv_zscore);
  }
  return sortedData;
}

function headline(data) {
  // counts to indicate if Luka finishes in top five or first in traditional and advanced metric
  let topCount = 0;
  let topFiveCount = 0;

  // sort players by their traditional cumulitive z score
  data.players.sort((a, b) => b.total_stand_zscore - a.total_stand_zscore);
  // find luka's position in that list
  const tradIndex = data.players.findIndex(player => player.player === 'Luka Doncic');
  // update our counts based on his position
  if (tradIndex === 0) {
    topCount += 1;
    topFiveCount += 1;
  } else if (tradIndex > 0 && tradIndex <= 4) {
    topFiveCount += 1;
  }

  // sort players by advanced cumulitive z score
  data.players.sort((a, b) => b.total_adv_zscore - a.total_adv_zscore);
  // find luka's position within that list
  const advIndex = data.players.findIndex(player => player.player === 'Luka Doncic');
  // update our counts based on his position
  if (advIndex === 0) {
    topCount += 1;
    topFiveCount += 1;
  } else if (advIndex > 0 && advIndex <= 4) {
    topFiveCount += 1;
  }

  // supply an answer to the question of will luka win rookie of the year based
  // on his position within the two lists
  if (topCount === 2) {
    return 'Definitely';
  } else if (topCount === 1 && topFiveCount === 2) {
    return 'Very likely';
  } else if (topCount === 0 && topFiveCount === 2) {
    return 'He’s got a chance';
  } else if (topCount === 1 && topFiveCount === 1) {
    return 'Maybe';
  } return 'Unlikely';
}

function updateSmartText(data, playerName) {
  const thisPlayer = data.players.find(player => player.player === playerName);
  console.log(thisPlayer);

  $(`.smart-text__ppg[data-player='${playerName}']`).text(thisPlayer.metrics.ppg);
  $(`.smart-text__rbg[data-player='${playerName}']`).text(thisPlayer.metrics.rpg);
  $(`.smart-text__apg[data-player='${playerName}']`).text(thisPlayer.metrics.apg);
  $(`.smart-text__spg[data-player='${playerName}']`).text(thisPlayer.metrics.spg);
}

export default { headline, updateSmartText };
