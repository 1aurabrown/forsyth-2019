import {register} from '@shopify/theme-sections';
import initProductMasonry from '../components/product-masonry';

register('collection', {
  onLoad() {
    this.msnry = initProductMasonry( this.container )
  },

  onUnload() {
    this.msnry.destroy()
  }
});
