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
