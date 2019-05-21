import {register} from '@shopify/theme-sections';
import $ from 'jquery';
import _ from 'lodash';
import * as images from '@shopify/theme-images';

const selectors = {
  json: '[data-press-json]',
  zoom: '[data-press-zoom]',
  thumbs: '[data-press-thumb]',
  close: '[data-press-close]',
};

const imageSize = '1024x';
const namespace = '.press';

register('press', {
  onLoad() {
    this.$thumbs = $(selectors.thumbs, this.container);
    this.$zoom = $(selectors.zoom, this.container);
    this.clippings = JSON.parse($(selectors.json, this.container).html()).blocks
    const clippingImages = _.map(this.clippings, 'image');
    images.preload(clippingImages, imageSize)
    $(this.container).on('click' + namespace, selectors.thumbs, this.thumbClicked.bind(this))
    $(this.container).on('click' + namespace, selectors.zoom, this.zoomClicked.bind(this))
  },

  thumbClicked(e) {
    var index = parseInt(e.currentTarget.getAttribute('data-press-thumb'));
    var clipping = _.find(this.clippings, function(clipping) {
      return clipping.index == index
    })
    if (this.$zoom.is(':visible')) {
      this.$zoom.removeClass('visible')
    }
    this.$zoom.html(this.zoomTemplate(clipping))
    this.$zoom.addClass('visible');
  },

  zoomClicked(e) {
    if (e.target == this.$zoom[0] || e.target == $(this.close)[0]) {
      this.$zoom.removeClass('visible')
    }
  },

  zoomTemplate(clipping) {
    return `
      <figure>
        <img src='${images.getSizedImageUrl(clipping.image, imageSize)}'' alt='${clipping.alt}/>
        <figcaption class='caption'>${clipping.caption}</figcaption>
      </figure>
    `
  },

  onUnload() {
    this.newsletter.destroy();
  }
});
