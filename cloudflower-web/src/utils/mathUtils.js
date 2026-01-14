export function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max + 1 - min))
}

export function randomBool() {
  return Math.random() >= 0.5;
}
