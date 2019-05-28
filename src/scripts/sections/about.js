import {register} from '@shopify/theme-sections';
import $ from 'jquery';
import _ from 'lodash';
import * as images from '@shopify/theme-images';
import imagesLoaded from 'imagesloaded';

const selectors = {
  json: '[data-press-json]',
  zoomContainer: '[data-press-zoom]',
  zoomInner: '[data-press-zoom-content]',
  thumbs: '[data-press-thumb]',
  close: '[data-press-zoom-close]',
};

const imageSize = '1024x';
const namespace = '.press';

register('press', {
  onLoad() {
    this.$thumbs = $(selectors.thumbs, this.container);
    this.$close = $(selectors.close, this.container);
    this.$zoomContainer = $(selectors.zoomContainer, this.container);
    this.$zoomInner = $(selectors.zoomInner, this.container);
    this.clippings = JSON.parse($(selectors.json, this.container).html()).blocks
    const clippingImages = _.map(this.clippings, 'image');
    images.preload(clippingImages, imageSize)
    $(this.container).on('click' + namespace, selectors.thumbs, this.thumbClicked.bind(this))
    $(this.container).on('click' + namespace, selectors.zoom, this.zoomClicked.bind(this))
  },

  onUnload() {
    this.newsletter.destroy();
  }
});
