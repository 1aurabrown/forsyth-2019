import {register} from '@shopify/theme-sections';
import initProductMasonry from '../components/product-masonry';

const selectors = {
  masonry: '.product-masonry',
};

register('john-ohara', {
  onLoad() {
    this.masonries = []
    this.container.querySelectorAll(selectors.masonry).forEach((el) => {
      this.masonries.push(initProductMasonry(el))
    })
  },

  onUnload() {
    this.masonries.forEach(function(msnry) {
      msnry.destroy()
    })
  }
});
