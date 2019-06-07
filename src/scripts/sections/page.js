import {register} from '@shopify/theme-sections';
import $ from 'jquery';
import _ from 'lodash';
import removeEmptyChildrenRecursively from '../components/remove-empty-children-recursively'


const selectors = {
  images: 'img',
  content: '.text-page__text',
  imagesContainer: '.text-page__images'
};

const classes = {
  image: 'text-page__images__image'
}

register('page-section', {
  onLoad() {
    const $content = $(selectors.content, this.container);
    const $images = $(selectors.images, $content);
    const $imagesContainer = $(selectors.imagesContainer, this.container);

    if ($images.length > 0) {
      $images.each(function() {
        var $originalParent = $(this).parent();
        $imagesContainer.append($(this));
        $(this).wrap(`<div class="${classes.image}"/>`)
        if($.trim($originalParent.text()) === "") {
          $originalParent.remove();
        }
      })
    } else {
      $imagesContainer.remove()
    }
  },
});
