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

register('page-section', {
  onLoad() {
    const $content = $(selectors.content, this.container);
    const $images = $(selectors.images, $content);
    const $imagesContainer = $(selectors.imagesContainer, this.container);

    if ($images.length > 0) {
      $imagesContainer.append($images);
      $images.each(function() {
        $(this).wrap(`<div class="${classes.image}"/>`)
      })
    } else {
      $imagesContainer.remove()
    }
    removeEmptyChildrenRecursively($content);
  },
});
