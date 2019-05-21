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
    if ("MutationObserver" in window) {
      this.observe()
    } else {
      this.shouldPoll = true;
      this.poll()
    }

  },

  poll() {
    if (this.isReady()) {
      this.setup()
    } else {
      if (this.shouldPoll) {
        setTimeout(this.poll.bind(this), 100);
      }
    }
  },

  observe() {
    this.observer = new MutationObserver(_.debounce(this.checkMutation.bind(this), 200));
    this.observer.observe(this.container, { childList: true, subtree: true });
  },

  checkMutation(mutationsList, observer) {
    console.log('mutated')
    for(var mutation of mutationsList) {
      if (mutation.type == 'childList') {
        if (this.isReady()) {
          this.setup();
          this.observer.disconnect();
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
        x0: 0,
        x1: 50, y1: 50,
        x2: 52, y2: 48,
        x3: 4
      }
    });
  },

  onUnload() {
    this.shouldPoll = false; // In case polling is still happening
    if (this.observer) { this.observer.disconnect(); }
    if (this.flickity) { this.flickity.destroy(); }
  }
});
