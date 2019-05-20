import {register} from '@shopify/theme-sections';
import Flickity from 'flickity-imagesloaded';
import $ from 'jquery';

const classes = {
  imagesContainer: 'images'
}
const selectors = {
  feedContainer: '#insta-feed',
  image: '#insta-feed a',
  imageInner: '.instafeed-container',
  heading: '#insta-feed h2',
  imagesContainer: '.' + classes.imagesContainer
};

register('instagram-feed', {
  onLoad() {
    console.log('load')

    if ("MutationObserver" in window) {
      this.observe()
    } else {
      this.poll()
    }

  },

  poll() {
    if (this.isReady()) {
      this.setup()
    } else {
      setTimeout(this.poll.bind(this), 100);
    }
  },

  observe() {
    const observer = new MutationObserver(_.debounce(this.checkMutation.bind(this), 200));
    observer.observe(this.container, { childList: true, subtree: true });
  },

  checkMutation(mutationsList, observer) {
    console.log('mutated')
    for(var mutation of mutationsList) {
      if (mutation.type == 'childList') {
        if (this.isReady()) {
          this.setup();
          observer.disconnect();
        }
        break;
      }
    }
  },

  isReady() {
    return (this.images = this.container.querySelectorAll(selectors.image)).length > 0
  },

  setup() {
    this.wrapImages();
    this.createFlickity();
  },

  wrapImages() {
    $(this.images).wrapAll(`<div class="${classes.imagesContainer}"></div>`);
  },

  createFlickity() {
    this.flickity = new Flickity( container.querySelector(selectors.imagesContainer), {
      // options
      cellAlign: 'center',
      wrapAround: true,
      imagesLoaded: true,
      arrowShape: {
        x0: 20,
        x1: 70, y1: 50,
        x2: 70, y2: 40,
        x3: 30
      }
    });
  },

  onUnload() {

  }
});
