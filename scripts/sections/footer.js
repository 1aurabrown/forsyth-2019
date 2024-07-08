import Newsletter from '../components/newsletter';
import {register} from '@shopify/theme-sections';

const selectors = {
  newsletter: '.newsletter',
};

register('footer', {
  onLoad() {
    var newsletter = this.container.querySelector(selectors.newsletter);
    this.newsletter = new Newsletter(this.container.querySelector(selectors.newsletter));
  },

  onUnload() {
    this.newsletter.destroy();
  }
});
