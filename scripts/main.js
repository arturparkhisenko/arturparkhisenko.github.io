{
  console.info('%c ;) Hi!', 'background: #333; color: #DCCD69');

  const elBody = document.querySelector('body');
  const elScreen = document.querySelector('.screen');

  // remove polyfill mdn ------------------
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function remove() {
      if (this.parentNode !== undefined && this.parentNode !== null) {
        this.parentNode.removeChild(this);
      }
    };
  }

  /**
   * addEventListenerOnce
   * @param {object} target
   * @param {string} type
   * @param {function} listener
   */
  function addEventListenerOnce(target, type, listener) {
    target.addEventListener(
      type,
      function fn(event) {
        target.removeEventListener(type, fn);
        listener(event);
      },
      { once: true }
    );
  }

  // background ---------------------------

  const cw =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth ||
    screen.width;
  const ch =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight ||
    screen.height;
  let elBgImg = null;

  const initBg = eventName => {
    console.log(`Background update listener init by ${eventName} event`);

    window.addEventListener('online', setBg);
    // window.addEventListener('offline', setBg);
    setBg();
  };

  const setBg = () => {
    let elBackground = document.querySelector('.background');

    console.info('[Background] loading...');

    if (navigator.onLine === false) {
      console.warn("[Background] sorry, you're offline");
      return;
    }

    if (elBackground !== null) {
      elBackground.style.opacity = '1';
    }

    elBgImg = document.createElement('img');
    elBgImg.classList.add('background');
    elBgImg.setAttribute('alt', 'background');
    elBgImg.setAttribute('width', `${cw}px`);
    elBgImg.setAttribute('height', `${ch}px`);
    elBgImg.setAttribute('loading', 'lazy');
    elBgImg.addEventListener(
      'load',
      () => {
        console.info('[Background] did load');
        elBackground = document.querySelector('.background');
        document.body.insertBefore(elBgImg, elBackground || elScreen);
        console.info('[Background] did insert');
        if (elBackground !== null) {
          console.info('[Background] did replace');
          elBackground.style.opacity = '0';
          setTimeout(() => {
            elBackground.remove();
          }, 400);
        }
      },
      false
    );
    elBgImg.src = `https://source.unsplash.com/random/${cw}x${ch}?t=${Date.now()}`;
  };

  // init bg ------------------------------

  addEventListenerOnce(elBody, 'mouseover', () => {
    initBg('mouseover');
  });

  addEventListenerOnce(elBody, 'touchstart', () => {
    initBg('touchstart');
  });

  // clicks--------------------------------

  elBody.addEventListener(
    'click',
    () => {
      setBg();
    },
    false
  );

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
          console.log('[serviceWorker] New site update avaliable ;)');
          // not `=>` because it doesn't create scope
          registration.installing.onstatechange = function() {
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
        console.error(err);
      });
  } else {
    console.log('[serviceWorker] is not supported :/');
  }
}
