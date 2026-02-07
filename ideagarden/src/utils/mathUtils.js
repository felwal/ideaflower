export function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max + 1 - min))
}

export function randomFloatRounded() {
  return parseFloat(Math.random().toFixed(2));
}
