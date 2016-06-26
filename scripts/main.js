import BackgroundGenerator from './module-bg';
import { hue } from './module-effects';

console.info('%c ;) Hi there! ', 'background: #333; color: #DCCD69');

// device-api------------------------------------------------------------------

// mouse trap
// http://codepen.io/ikeagold/pen/ZGGbyp

// deviceorientation
// if (window.DeviceOrientationEvent) {
//   // deviceorientation
//   // window.addEventListener('deviceorientation', (event) => {
//   // Get the left-to-right tilt (in degrees).
//   // const tiltLR = event.gamma;
//   // Get the front-to-back tilt (in degrees).
//   // let titleFB = event.beta;
//   // Get the direction of the device (in degrees).
//   // let direction = event.alpha;
//   // });
// }

// mouse
// if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|
// Opera Mini/i.test(navigator.userAgent))) {
//   // const checkCursor = () => {
//   //   console.log("Cursor at: " + cursorX + ", " + cursorY);
//   // };
//   // let cursorX;
//   // let cursorY;
//   // document.onmousemove = (event) => {
//   //   cursorX = event.pageX;
//   //   cursorY = event.pageY;
//   // };
//   // setInterval(checkCursor, 200);
// }

// devicelight
const elDevicelight = document.querySelector('.devicelight');
window.addEventListener('devicelight', (event) => {
  const icon = event.value < 50 ? '🌚' : '🌞';
  elDevicelight.textContent(icon);
});

// battery
if (navigator.getBattery) {
  const elBattery = document.querySelector('.battery');
  navigator.getBattery().then((result) => {
    const levelChange = () => {
      elBattery.textContent = `🔋 ${parseInt(result.level * 100, 10)}%`;
    };
    result.onlevelchange = levelChange;
    levelChange();
  });
}

// use-modules-----------------------------------------------------------------

const bgg = new BackgroundGenerator();
bgg.init();

// enable tips
const elNb = document.querySelector('.notice-bg');
const elNc = document.querySelector('.notice-colors');
elNb.style.display = 'block';
elNc.style.display = 'block';

// clicks----------------------------------------------------------------------

document.querySelector('body').addEventListener('click', () => {
  bgg.setBg();
}, false);

document.querySelector('.screen').addEventListener('click', (event) => {
  // hue(selector, deg, random = false)
  hue('.background', 0, true);
  event.stopPropagation();
}, false);

// offline-support-------------------------------------------------------------

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./../sw.js').then((registration) => {
    let isUpdate = false;
    if (registration.active) {
      isUpdate = true;
    }
    registration.onupdatefound = (event) => {
      console.log('New site update avaliable ;)');
      // not `=>` because it doesn't create scope
      registration.installing.onstatechange = function(event) {
        if (this.state === 'installed') {
          console.log('serviceWorker installed!');
          if (isUpdate) {
            console.log('serviceWorker was updated, please restart tab');
          } else {
            console.log('App ready for offline use.');
          }
        } else {
          console.log('Site new serviceWorker state: ', this.state);
        }
      };
    };
  }, (err) => {
    console.log('serviceWorker', err);
  });
}

// google-analytics------------------------------------------------------------

(function(i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  i[r] = i[r] || function() {
    (i[r].q = i[r].q || []).push(arguments);
  }, i[r].l = 1 * new Date();
  a = s.createElement(o),
    m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

window.ga('create', 'UA-36592065-4', 'auto');
window.ga('send', 'pageview');
