/**
 * randomIntFromInterval
 * @param  {number} min
 * @param  {number} max
 * @return {number}
 */
const randomIntFromInterval = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

/**
 * hue
 * @param  {string} selector
 * @param  {number} deg
 * @param  {boolean} random = false
 * @return {undefined}
 */
export function hue(selector, deg, random = false) {
  console.info('hue');
  const element = document.querySelector(selector);
  const degrees = random ? randomIntFromInterval(0, 180) : deg;
  if (element) {
    element.style.webkitFilter = `hue-rotate(${degrees}deg)`;
    element.style.filter = `hue-rotate(${degrees}deg)`;
  }
}

/**
 * effects
 * @return {object} new with method hue
 */
export default function effects() {
  return Object.assign(Object.create(null), hue);
}
