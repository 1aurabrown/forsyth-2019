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

const imageSize = '800x';
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

  thumbClicked(e) {
    var index = parseInt(e.currentTarget.getAttribute('data-press-thumb'));
    var clipping = _.find(this.clippings, function(clipping) {
      return clipping.index == index
    })
    if (this.$zoomContainer.is(':visible')) {
      this.$zoomContainer.removeClass('visible')
    }
    this.$zoomContainer.removeClass('images-loaded');

    this.$zoomInner.html(this.zoomTemplate(clipping))
    imagesLoaded( this.$zoomInner, function() {
      console.log('images loaded')
      setTimeout(function() {
        this.$zoomContainer.addClass('images-loaded');
      }.bind(this), 0);
    }.bind(this))


    this.$zoomContainer.removeClass('hide');
    console.log('unhidden')
    this.$zoomContainer.addClass('visible');
    console.log('visible')
  },

  zoomClicked(e) {
    console.log(e.target)
    if (e.target == this.$zoomContainer[0] || e.target == this.$close[0]) {
      $(this.container).one('transitionend' + namespace, this.$zoomContainer, function() {
        if (this.$zoomContainer.is(':visible')) {
          this.$zoomContainer.addClass('hide')
        }
      }.bind(this))
      this.$zoomContainer.removeClass('visible')
      this.$zoomContainer.removeClass('images-loaded');
    }
  },
  zoomTemplate(clipping) {
    const imageUrl = images.getSizedImageUrl(clipping.image, imageSize)

    const caption = $(clipping.caption).html()
    if (caption && caption.length > 0) {
      var figureClass = 'has-caption'
      var figCaption = `<figcaption class='caption serif-body-m'>${caption}</figcaption>`
    }

    return `
      <figure class='${figureClass || ''}'>
        <img src='${imageUrl}' alt='${clipping.alt}'/>
        ${figCaption || ''}
      </figure>
    `
  },

  onUnload() {
    this.newsletter.destroy();
  }
});
