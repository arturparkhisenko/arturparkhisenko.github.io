import BackgroundGenerator from './module-bg';
import {hue} from './module-effects';

console.info('%c ;) Hi there! ', 'background: #333; color: #DCCD69');

// async-css-------------------------------------------------------------------

const cb = () => {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = '../styles/main.min.css';
  const h = document.getElementsByTagName('head')[0];
  h.parentNode.insertBefore(l, h);
};
const raf = requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
if (raf) {
  raf(cb);
} else {
  window.addEventListener('load', cb);
}

// use-modules-----------------------------------------------------------------

const bgg = new BackgroundGenerator();
bgg.init();

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
  navigator.serviceWorker.register('./../sw.js', {
    scope: './'
  }).then((registration) => {
    let isUpdate = false;
    if (registration.active) {
      isUpdate = true;
    }
    registration.onupdatefound = (eventUpdate) => {
      console.log('New site update avaliable ;)');
      // not `=>` because it doesn't create scope
      registration.installing.onstatechange = function(eventStateChange) {
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
      // if (navigator.serviceWorker.controller) {
      //   var installingWorker = registration.installing;
      //   installingWorker.onstatechange = function() {
      //     switch (installingWorker.state) {
      //       case 'installed':
      //         break;
      //       case 'redundant':
      //         throw new Error('The installing ' +
      //           'service worker became redundant.');
      //       default:
      //         // Ignore
      //     }
      //   };
      // }
    };
  }, (err) => {
    console.log('serviceWorker', err);
  });
} else {
  console.log('service worker is not supported');
}
