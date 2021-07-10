console.info('%c Hi! ;)', 'background: #333; color: #DCCD69');

const elBody = document.querySelector('body');

/**
 * addEventListenerOnce
 * @param {object} target
 * @param {string} type
 * @param {function} listener
 */
const addEventListenerOnce = (target, type, listener) => {
  target.addEventListener(
    type,
    function fn(event) {
      target.removeEventListener(type, fn);
      listener(event);
    },
    { once: true }
  );
};

// background ---------------------------

const removeBg = () => {
  document.body.classList.remove('background');
  document.body.style.backgroundImage = '';
  console.info('[Background] removed');
};

const setBg = () => {
  if (navigator.onLine === false) {
    console.warn("[Background] cannot load the background, you're offline");
    return;
  }

  console.info('[Background] loading...');
  document.body.classList.add('background');
  // @see https://source.unsplash.com/
  document.body.style.backgroundImage = `url('https://source.unsplash.com/weekly/?aesthetic')`;
};

const initBg = eventName => {
  console.log(`Background update listener init by ${eventName} event`);

  window.addEventListener('online', setBg);
  window.addEventListener('offline', removeBg);
  setBg();
};

// init bg ------------------------------

addEventListenerOnce(elBody, 'mouseover', () => {
  initBg('mouseover');
});

addEventListenerOnce(elBody, 'touchstart', () => {
  initBg('touchstart');
});

// offline-support-----------------------

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./../sw.js', { scope: '/' })
    .then(registration => {
      let isUpdate = false;
      if (registration.active) {
        isUpdate = true;
      }
      registration.onupdatefound = () => {
        console.log('[serviceWorker] New site update available ;)');
        // not `=>` because it doesn't create scope
        registration.installing.onstatechange = function () {
          if (this.state === 'installed') {
            console.log('[serviceWorker] did install!');
            if (isUpdate) {
              console.log('[serviceWorker] did update, please reload tab.');
            } else {
              console.log('[serviceWorker] site is ready for offline use.');
            }
          } else {
            console.log('[serviceWorker] state did change to: ', this.state);
          }
        };
      };
    })
    .catch(err => {
      console.error('[serviceWorker] error', err);
    });
} else {
  console.log('[serviceWorker] is not supported :/');
}
