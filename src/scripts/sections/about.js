import {register} from '@shopify/theme-sections';
import $ from 'jquery';
import _ from 'lodash';
import removeEmptyChildrenRecursively from '../components/remove-empty-children-recursively'


const selectors = {
  images: 'img',
  content: '.about__text',
  imagesContainer: '.about__images'
};

register('about', {
  onLoad() {
    this.$content = $(selectors.content, this.container);
    this.$images = $(selectors.images, this.$content);
    this.$imagesContainer = $(selectors.imagesContainer, this.container);

    this.$imagesContainer.append(this.$images);
    this.$images.each(function() {
      $(this).wrap(`<div class="about__images__image"/>`)
    })
    removeEmptyChildrenRecursively(this.$content);
  },
});
