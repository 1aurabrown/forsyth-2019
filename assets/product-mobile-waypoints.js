import Listeners from './listeners.js';

const selectors = {
  bottomMobileSticky: '[data-bottom-sticky]',
  bottomMobileStickyContainer: '[data-bottom-sticky-container]',
  imagesContainer: '[data-images-container]',
  headingsBar: '[js-headings]',
  headingsBarContainer: '[js-headings-container]',

};

export default function MobileWaypoints(container, breakpoints) {
  if (!container) { console.warn('MobileWaypoints was not passed a container'); return; }
  this.bottom = container.querySelector(selectors.bottomMobileSticky)
  this.bottomContainer = container.querySelector(selectors.bottomMobileStickyContainer)
  this.headingsBarContainer = container.querySelector(selectors.headingsBarContainer)
  this.headingsBar = container.querySelector(selectors.headingsBar)
  this.images = container.querySelector(selectors.imagesContainer)

  this.previousScroll = -1;
  this._listeners = new Listeners();
  this.update = _.throttle(this._update.bind(this), 50);
  this.update();
}

MobileWaypoints.prototype.teardown = function() {
  this._listeners.removeAll();
  this.bottom.classList.remove('hidden')
  this.bottom.classList.remove('viewport-bottom')
  if (this.headingsBar) { this.headingsBar.classList.remove('viewport-top'); }
  if (this.headingsBarContainer) { this.headingsBarContainer.style.height = ''; }
}

MobileWaypoints.prototype.setup = function() {
  this.addListeners();
  this.update();
}

MobileWaypoints.prototype.addListeners = function() {
  this._listeners.add(
    window,
    'scroll',
    this.update.bind(this)
  );

  this._listeners.add(
    window,
    'resize',
    this.update.bind(this)
  );
  return this;
}

MobileWaypoints.prototype._update = function() {
  let newScroll = document.scrollingElement.scrollTop;
  let direction = newScroll > this.previousScroll ? 'down' : 'up';
  this._updateBottom(direction);
  this._updateHeaders(direction);
  this.previousScroll = newScroll

}

MobileWaypoints.prototype._updateBottom = function(direction) {
  var bottomContainerRect = this.bottomContainer.getBoundingClientRect();
  var spaceBelowBottomContainer = window.innerHeight - bottomContainerRect.bottom;

  var imagesRect = this.images.getBoundingClientRect();
  var spaceBelowImages = window.innerHeight - imagesRect.bottom;


  if (direction == 'down') { // scrolling down
    if(spaceBelowBottomContainer > 0) { // flow CTA has scrolled fully into view
      this.bottom.classList.add('viewport-bottom')
    }
  } else { // scrolling up
    if(spaceBelowBottomContainer + bottomContainerRect.height <= this.bottom.offsetHeight) { // flow CTA container is aligned with fixed CTA
      this.bottom.classList.remove('hidden')
      this.bottom.classList.remove('viewport-bottom')
    }
  }

  if(spaceBelowImages > 0) { // bottom of image container has reached top of CTA
    this.bottom.classList.add('hidden')
  } else {
    this.bottom.classList.remove('hidden') // bottom of image container has not yet reached top of CTA
  }

}

MobileWaypoints.prototype._updateHeaders= function(direction) {
  if (!this.headingsBarContainer) { return; }
  var headingsBarContainerRect = this.headingsBarContainer.getBoundingClientRect();
  var spaceAboveHeadingsBarContainer = headingsBarContainerRect.top;

  if(spaceAboveHeadingsBarContainer < 0) { // Headings bar has hit top of viewport
    this.headingsBarContainer.style.height = this.headingsBar.offsetHeight + 'px';
    this.headingsBar.classList.add('viewport-top')
  } else {
    this.headingsBar.classList.remove('viewport-top')
    this.headingsBarContainer.style.height = '';
  }
}
