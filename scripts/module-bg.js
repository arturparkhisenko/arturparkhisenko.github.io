export default class BackgroundGenerator {

  constructor() {
    this.cw = window.innerWidth || document.documentElement.clientWidth ||
      document.body.clientWidth || screen.width;
    this.ch = window.innerHeight || document.documentElement.clientHeight ||
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
    window.addEventListener('offline', this.setBg);
    this.setBg();
  }

  installBg() {
    const newCw = this.cw + Math.round(Math.random());
    const newCh = this.ch + Math.round(Math.random());

    const elPre = document.querySelector('.background');
    if (elPre) {
      elPre.style.opacity = '1';
    }
    const elPreScreen = document.querySelector('.screen');

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
      this.installBg();
    } else {
      console.warn('Sorry, cant set new and beautiful background, because you\'re offline');
    }
  }

}