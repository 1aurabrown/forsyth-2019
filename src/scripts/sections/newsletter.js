import {register} from '@shopify/theme-sections';
import Newsletter from '../components/newsletter';

const selectors = {
  newsletter: '.newsletter',
};

register('newsletter', {
  onLoad() {
    var newsletter = this.container.querySelector(selectors.newsletter);
    this.newsletter = new Newsletter(this.container.querySelector(selectors.newsletter));
  },

  onUnload() {
    this.newsletter.destroy();
  }
});
