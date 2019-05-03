import StickySidebar from 'sticky-sidebar';
import {register} from '@shopify/theme-sections';

const classes = {

};

const selectors = {

};

register('sidebar', {
  onLoad() {
    console.log('load')
    new StickySidebar(this.container, {
      containerSelector: '#container',
      innerWrapperSelector: '.sidebar__inner'
    });
  },

  onThumbnailClick(event) {

  },

  onThumbnailKeyup(event) {

  }
});
