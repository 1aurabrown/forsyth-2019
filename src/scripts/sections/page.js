import {register} from '@shopify/theme-sections';
import $ from 'jquery';
import _ from 'lodash';
import removeEmptyChildrenRecursively from '../components/remove-empty-children-recursively'


const selectors = {
  images: 'img',
  content: '.page__text',
  imagesContainer: '.page__images'
};

const classes = {
  image: 'page__images__image'
}

register('page', {
  onLoad() {
    this.$content = $(selectors.content, this.container);
    this.$images = $(selectors.images, this.$content);
    this.$imagesContainer = $(selectors.imagesContainer, this.container);

    this.$imagesContainer.append(this.$images);
    this.$images.each(function() {
      $(this).wrap(`<div class="${classes.image}"/>`)
    })
    removeEmptyChildrenRecursively(this.$content);
  },
});
