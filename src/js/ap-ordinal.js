export default function (ordinalIn) {
  let ordinalOut;

  switch (ordinalIn) {
    case '1st':
      ordinalOut = 'first';
      break;
    case '2nd':
      ordinalOut = 'second';
      break;
    case '3rd':
      ordinalOut = 'third';
      break;
    case '4th':
      ordinalOut = 'fourth';
      break;
    case '5th':
      ordinalOut = 'fifth';
      break;
    case '6th':
      ordinalOut = 'sixth';
      break;
    case '7th':
      ordinalOut = 'seventh';
      break;
    case '8th':
      ordinalOut = 'eigth';
      break;
    case '9th':
      ordinalOut = 'ninth';
      break;
    default:
      ordinalOut = ordinalIn;
  }
  return ordinalOut;
}
