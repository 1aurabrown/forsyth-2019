import _ from 'lodash';
import Listeners from './listeners';
export default function MobileWaypoints(container, selectors, breakpoints) {
  this.bottom = container.querySelector(selectors.bottomMobileSticky)
  this.bottomContainer = container.querySelector(selectors.bottomMobileStickyContainer)
  this.headingsBarContainer = container.querySelector(selectors.headingsBarContainer)
  this.headingsBar = container.querySelector(selectors.headingsBar)
  this.description = container.querySelector(selectors.description)
  this.images = container.querySelector(selectors.imagesContainer)

  this.previousScroll = 0
  this._listeners = new Listeners();
  this.update = _.throttle(this._update.bind(this), 50);
}

MobileWaypoints.prototype.removeListeners = function() {
  this._listeners.removeAll();
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
