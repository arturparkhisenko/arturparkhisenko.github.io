console.info('%c ;) Hi!', 'background: #333; color: #DCCD69');

const elBody = document.querySelector('body');

// async-css-----------------------------

const cb = () => {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = '../styles/main.min.css';
  const h = document.getElementsByTagName('head')[0];
  h.parentNode.insertBefore(l, h);
};
const raf = requestAnimationFrame || window.mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
if (raf) {
  raf(cb);
} else {
  window.addEventListener('load', cb);
}

// background ---------------------------

/**
 * BackgroundGenerator
 * @type {class}
 */
class BackgroundGenerator {
  constructor() {
    this.cw = window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth || screen.width;
    this.ch = window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight || screen.height;
    this.elBgImg = null;

    // remove polyfill mdn
    if (!('remove' in Element.prototype)) {
      Element.prototype.remove = function remove() {
        if (this.parentNode) {
          this.parentNode.removeChild(this);
        }
      };
    }
  }

  init() {
    window.addEventListener('online', this.setBg);
    // window.addEventListener('offline', this.setBg);
    this.setBg();
  }

  installBg() {
    const newCw = this.cw + Math.round(Math.random() * 10);
    const newCh = this.ch + Math.round(Math.random() * 10);
    const elPreScreen = document.querySelector('.screen');
    const elPre = document.querySelector('.background');

    if (elPre) {
      elPre.style.opacity = '1';
    }

    this.elBgImg = document.createElement('img');
    this.elBgImg.classList.add('background');
    this.elBgImg.setAttribute('alt', 'background');
    this.elBgImg.addEventListener('load', () => {
      document.body.insertBefore(this.elBgImg, elPre || elPreScreen);
      if (elPre) {
        elPre.style.opacity = '0';
        setTimeout(() => {
          elPre.remove();
        }, 400);
      }
    }, false);
    this.elBgImg.src = `https://source.unsplash.com/${newCw}x${newCh}`;
  }

  setBg() {
    if (navigator.onLine) {
      console.info('setBg');
      this.installBg();
    } else {
      console.warn('Sorry, you\'re offline');
    }
  }
}

const bgg = new BackgroundGenerator();

// bg init ------------------------------
/**
 * addEventListenerOnce
 * @param {object} target
 * @param {string} type
 * @param {function} listener
 */
function addEventListenerOnce(target, type, listener) {
  target.addEventListener(type, function fn(event) {
    target.removeEventListener(type, fn);
    listener(event);
  }, {once: true});
}

addEventListenerOnce(elBody, 'mouseover', function(event) {
  console.log('Background is loading by mouseover');
  bgg.init(); // load background only on mouse move
});

addEventListenerOnce(elBody, 'touchstart', function(event) {
  console.log('Background is loading by touchstart');
  bgg.init(); // load background only on touch
});

// clicks--------------------------------

elBody.addEventListener('click', () => {
  bgg.setBg();
}, false);

// offline-support-----------------------

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    './../sw.js', {scope: '/'}).then((registration) => {
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
    };
  }).catch((err) => {
    console.error(err);
  });
} else {
  console.log('service workers is not supported');
}
