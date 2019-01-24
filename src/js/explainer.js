import $ from 'jquery';

export default function (el) {
  $('.explainer').removeClass('explainer--click-displayed');
  // get the explainer element that's paired with the highlight clicked
  const targetTerm = el.attr('data-term');
  const targetExplainer = $(`.explainer[data-term='${targetTerm}']`);

  let targetYPos = 0;
  const elYPos = el[0].getBoundingClientRect().top;
  const windowHt = $(window).height();

  if (elYPos < (windowHt / 2)) {
    targetYPos = elYPos + el.height() + 10;
  } else {
    targetYPos = elYPos - targetExplainer.outerHeight() - 10;
  }

  targetExplainer.css('top', `${targetYPos}px`)
    .addClass('explainer--click-displayed');
}
