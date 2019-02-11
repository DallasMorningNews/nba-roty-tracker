import $ from 'jquery'

function updateSmartText(data, playerName) {
  const thisPlayer = data.players.find(player => player.player === playerName);

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

export default { updateSmartText, updateDifferences };
