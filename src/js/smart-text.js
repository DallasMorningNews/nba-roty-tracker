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
    return 'Absolutely';
  } else if (topCount === 1 && topFiveCount === 2) {
    return 'Yes';
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
  $(`.smart-text__usg[data-player='${playerName}']`).text(thisPlayer.metrics.usg);
  $(`.smart-text__mpg[data-player='${playerName}']`).text(thisPlayer.metrics.mpg);
  $(`.smart-text__total_stand[data-player='${playerName}']`).text((thisPlayer.total_stand_zscore).toFixed(2));
  $(`.smart-text__z-ppg[data-player='${playerName}']`).text((thisPlayer.zscores.ppg).toFixed(3));
  $(`.smart-text__z-rpg[data-player='${playerName}']`).text((thisPlayer.zscores.rpg).toFixed(3));
  $(`.smart-text__z-apg[data-player='${playerName}']`).text((thisPlayer.zscores.apg).toFixed(3));
  $(`.smart-text__z-spg[data-player='${playerName}']`).text((thisPlayer.zscores.spg).toFixed(3));
  $(`.smart-text__z-bpg[data-player='${playerName}']`).text(`(${(thisPlayer.zscores.bpg).toFixed(3)})`);

}

function updateDifferences(data, score, player1, player2) {
  const thisPlayer1 = data.players.find(player => player.player === player1);
  const thisPlayer2 = data.players.find(player => player.player === player2);
  $(`.difference-text__total_stand_zscore[data-player1='${player1}']`).text(((thisPlayer1.total_stand_zscore.toFixed(2) - thisPlayer2.total_stand_zscore.toFixed(2)).toFixed(2)));
  $(`.difference-text__total_adv_zscore[data-player1='${player1}']`).text(((thisPlayer1.total_adv_zscore.toFixed(2) - thisPlayer2.total_adv_zscore.toFixed(2)).toFixed(2)));
  $(`.difference-text__ppg[data-player1='${player1}']`).text((thisPlayer1.metrics.ppg - thisPlayer2.metrics.ppg).toFixed(1));
}

export default { headline, updateSmartText, updateDifferences };
