export function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max + 1 - min))
}

export function randomFloatRounded() {
  return parseFloat(Math.random().toFixed(2));
}

export function roundFloat(val) {
  return parseFloat(val.toFixed(2));
}

export function elementByProgress(array, progress) {
  // use Math.min in case progress=1
  return array[Math.min(Math.floor(Math.max(progress, 0) * array.length), array.length - 1)];
}

export function expRipening(x, x1, y1, x2=null, y2=null) {
  // let y approach 1 as as x -> inf

  const y0 = x2 && y2
    ? 1 - Math.abs(y1 - 1) ** (x2 / (x2 - x1)) / Math.abs(y2 - 1) ** (x1 / (x2 - x1))
    : 0;
  const flatness = ((y1 - 1) / (y0 - 1)) ** (1 / x1);
  const y = Math.max(1 - (1 - y0) * flatness ** x, 0);

  return y;
}
