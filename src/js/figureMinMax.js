/* global d3:true */

export default function (data, key) {
  // get the min and max of our dataset
  const trueMinMax = d3.extent(data, d => d[key]);

  const value1 = trueMinMax[0] * -1;
  const value2 = trueMinMax[1];
  let outsideValue = 0;

  if (value1 >= value2) {
    outsideValue = Math.ceil(value1);
  } else {
    outsideValue = Math.ceil(value2);
  }

  return [outsideValue * -1, outsideValue];
}
