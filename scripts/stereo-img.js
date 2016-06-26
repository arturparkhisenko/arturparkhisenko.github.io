// inheritance

export default class StereoImg {

  constructor(options) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.origCanvas = document.createElement('canvas');
    this.origContext = this.origCanvas.getContext('2d');
    this.options = options;
  }

  process() {
    const imageData = this.origContext.getImageData(0, 0, this.width, this.height);
    const pixels = imageData.data;
    const length = pixels.length;
    const options = this.options;
    let brightness;
    let offset;
    let i;
    let x;
    let y;

    for (i = 0; i < length; i += 4) {
      if (options.color) {
        pixels[i] *= options.color.red;
        pixels[i + 1] *= options.color.green;
        pixels[i + 2] *= options.color.blue;
      }
      if (options.greyscale) {
        brightness = pixels[i] * options.greyscale.red +
          pixels[i + 1] * options.greyscale.green +
          pixels[i + 2] * options.greyscale.blue;
        pixels[i] = brightness;
        pixels[i + 1] = brightness;
        pixels[i + 2] = brightness;
      }
      if (options.stereoscopic) {
        offset = options.stereoscopic.red;
        pixels[i] = (pixels[i + 4 * offset] === undefined) ?
          0 : pixels[i + 4 * offset];
        offset = options.stereoscopic.green;
        pixels[i + 1] = (pixels[i + 1 + 4 * offset] === undefined) ?
          0 : pixels[i + 1 + 4 * offset];
        offset = options.stereoscopic.blue;
        pixels[i + 2] = (pixels[i + 2 + 4 * offset] === undefined) ?
          0 : pixels[i + 2 + 4 * offset];
      }
    }
    if (options.lineOffset) {
      i = 0;
      for (y = 0; y < this.height; y++) {
        offset = (y % options.lineOffset.lineHeight === 0) ?
          Math.round(Math.random() * options.lineOffset.value) : offset;
        for (x = 0; x < this.width; x++) {
          i += 4;
          pixels[i + 0] = (pixels[i + 4 * offset] === undefined) ?
            0 : pixels[i + 4 * offset];
          pixels[i + 1] = (pixels[i + 1 + 4 * offset] === undefined) ?
            0 : pixels[i + 1 + 4 * offset];
          pixels[i + 2] = (pixels[i + 2 + 4 * offset] === undefined) ?
            0 : pixels[i + 2 + 4 * offset];
        }
      }
    }
    // if (options.glitch) {}
    this.context.putImageData(imageData, 0, 0);
  }

  loadImage(url, callback) {
    const img = document.createElement('img');
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      callback(img);
    };
    img.src = url;
  }

  renderImage(img) {
    this.canvas.width = this.origCanvas.width = this.width = img.width;
    this.canvas.height = this.origCanvas.height = this.height = img.height;
    this.origContext.drawImage(img, 0, 0);
  }

  glitch(url, callback) {
    const self = this;
    this.loadImage(url, (img) => {
      self.renderImage(img);
      self.process();
      callback();
    });
  }

}
