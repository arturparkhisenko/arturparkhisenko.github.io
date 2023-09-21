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
