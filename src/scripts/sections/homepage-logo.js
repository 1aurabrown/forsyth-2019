import {register} from '@shopify/theme-sections';
import $ from 'jquery';
import _ from 'lodash';
const classes = {
  globalLogoVisible: 'homepage-visible',
  homepageLogoHidden: 'hidden',
  homepageLogoAnimated: 'animated'
}

const selectors = {
  globalLogo: '.logo',
};

register('homepage-logo', {
  onLoad() {
    this.namespace = '.homepage-logo';
    this.throttledScroll = _.throttle(this._onScroll.bind(this), 50);
    this._onScroll();
    window.addEventListener('scroll', this.throttledScroll);
    window.addEventListener('resize', this.throttledScroll);
  },

  _onScroll() {
    let scrollOffset = document.scrollingElement.scrollTop;
    let trigger = $(this.container).offset().top + $(this.container).outerHeight(true)
    let logo = document.querySelector(selectors.globalLogo);

    if (( scrollOffset >  trigger) && !logo.classList.contains(classes.globalLogoVisible)) {    // Large logo is off-screen

      logo.classList.add(classes.globalLogoVisible)
      this.container.classList.remove(classes.homepageLogoAnimated)
      this.container.classList.add(classes.homepageLogoHidden);

    } else if (( scrollOffset <=  trigger) && logo.classList.contains(classes.globalLogoVisible)) {  // Large logo is on-screen

      $(logo).one('transitionend', function() {
        this.container.classList.add(classes.homepageLogoAnimated)
        _.delay(function() {
          this.container.classList.remove(classes.homepageLogoHidden);
        }.bind(this), 100)
      }.bind(this))
      logo.classList.remove(classes.globalLogoVisible)

    }
  },

  onUnload() {
    $(logo).off('transitionend')
    window.removeEventListener('scroll', this.throttledScroll)
    window.removeEventListener('resize', this.throttledScroll)
  }
});
