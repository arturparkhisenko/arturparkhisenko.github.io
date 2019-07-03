{
  console.info('%c ;) Hi!', 'background: #333; color: #DCCD69');

  const elBody = document.querySelector('body');

  // async-css-----------------------------

  const cb = () => {
    const h = document.getElementsByTagName('head')[0];
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = '../styles/main.min.css';
    h.parentNode.insertBefore(l, h);
  };

  const raf =
    requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  if (raf !== undefined) {
    raf(cb);
  } else {
    window.addEventListener('load', cb);
  }

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

  const initBg = () => {
    window.addEventListener('online', setBg);
    // window.addEventListener('offline', setBg);
    setBg();
  };

  const setBg = () => {
    console.info('setBg');

    if (navigator.onLine === false) {
      console.warn("Sorry, you're offline");
      return;
    }

    const newCw = cw + Math.round(Math.random() * 10);
    const newCh = ch + Math.round(Math.random() * 10);
    const elPreScreen = document.querySelector('.screen');
    const elPre = document.querySelector('.background');

    if (elPre !== null) {
      elPre.style.opacity = '1';
    }

    elBgImg = document.createElement('img');
    elBgImg.classList.add('background');
    elBgImg.setAttribute('alt', 'background');
    elBgImg.addEventListener(
      'load',
      () => {
        document.body.insertBefore(elBgImg, elPre || elPreScreen);
        if (elPre !== null) {
          elPre.style.opacity = '0';
          setTimeout(() => {
            elPre.remove();
          }, 400);
        }
      },
      false
    );
    elBgImg.src = `https://source.unsplash.com/${newCw}x${newCh}`;
  };

  // init bg ------------------------------

  addEventListenerOnce(elBody, 'mouseover', () => {
    console.log('Background is loading by mouseover');
    initBg();
  });

  addEventListenerOnce(elBody, 'touchstart', () => {
    console.log('Background is loading by touchstart');
    initBg();
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
        registration.onupdatefound = eventUpdate => {
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
      })
      .catch(err => {
        console.error(err);
      });
  } else {
    console.log('serviceWorker is not supported');
  }
}
