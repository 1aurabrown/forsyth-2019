import _ from 'lodash';
import 'intersection-observer';

export default function ScrollIntersectionObserver (target, callbacks = {}, options = {}) {
  console.log(options)
  this.target = target;
  this.callbacks = callbacks;
  this.previousY = 0;
  this.previousRatio = 0;
  this.partiallyVisibleObserver = new IntersectionObserver(this.partiallyVisible.bind(this), _.merge({} , options, { threshold: 0.0 }))
  this.completelyVisibleObserver = new IntersectionObserver(this.completelyVisible.bind(this), _.merge({}, options, { threshold: 1.0 }))
};

ScrollIntersectionObserver.prototype.observe = function() {
  this.partiallyVisibleObserver.observe(this.target)
  this.completelyVisibleObserver.observe(this.target)
  return this;
};

ScrollIntersectionObserver.prototype.unobserve = function() {
  this.partiallyVisibleObserver.unobserve(this.target)
  this.completelyVisibleObserver.unobserve(this.target)
  return this;
}

ScrollIntersectionObserver.prototype.partiallyVisible = function(entries) {
  entries.forEach(entry => {
    const currentY = entry.boundingClientRect.y
    const currentRatio = entry.intersectionRatio
    const isIntersecting = entry.isIntersecting
    // Scrolling down/up
    if (currentY < this.previousY) {
      if (currentRatio > this.previousRatio && isIntersecting) {
        console.log(entry.target + " top entered viewport bottom")
        if (this.callbacks.topEnteredBottom && _.isFunction(this.callbacks.topEnteredBottom)) {
          this.callbacks.topEnteredBottom(entry)
        }
      } else {
        console.log(entry.target + " bottom exited viewport top \n")
        if (this.callbacks.bottomExitedTop && _.isFunction(this.callbacks.bottomExitedTop)) {
          this.callbacks.bottomExitedTop(entry)
        }
      }
    } else if (currentY > this.previousY) {
      if (currentRatio > this.previousRatio && isIntersecting) {
        console.log(entry.target + " bottom entered viewport top")
        if (this.callbacks.bottomEnteredTop && _.isFunction(this.callbacks.bottomEnteredTop)) {
          this.callbacks.bottomEnteredTop(entry)
        }
      } else {
        console.log(entry.target + " top exited viewport bottom \n")
        if (this.callbacks.topExitedBottom && _.isFunction(this.callbacks.topExitedBottom)) {
          this.callbacks.topExitedBottom(entry)
        }
      }
    }

    this.previousY = currentY
    this.previousRatio = currentRatio
  })
};

ScrollIntersectionObserver.prototype.completelyVisible = function(entries) {
  entries.forEach(entry => {
    const currentY = entry.boundingClientRect.y
    const currentRatio = entry.intersectionRatio
    const isIntersecting = entry.isIntersecting
    // Scrolling down/up
    if (currentY < this.previousY) {
      if (currentRatio > this.previousRatio && isIntersecting) {
        console.log(entry.target + " bottom entered viewport bottom")
        if (this.callbacks.bottomEnteredBottom && _.isFunction(this.callbacks.bottomEnteredBottom)) {
          this.callbacks.bottomEnteredBottom(entry)
        }
      } else {
        console.log(entry.target + " top exited viewport top")
        if (this.callbacks.topExitedTop && _.isFunction(this.callbacks.topExitedTop)) {
          this.callbacks.topExitedTop(entry)
        }
      }
    } else if (currentY > this.previousY) {
      if (currentRatio > this.previousRatio && isIntersecting) {
        console.log(entry.target + " top entered viewport top")
        if (this.callbacks.topEnteredTop && _.isFunction(this.callbacks.topEnteredTop)) {
          this.callbacks.topEnteredTop(entry)
        }
      } else {
        console.log(entry.target + " bottom exited viewport bottom")
        if (this.callbacks.bottomExitedBottom && _.isFunction(this.callbacks.bottomExitedBottom)) {
          this.callbacks.bottomExitedBottom(entry)
        }
      }
    }

    this.previousY = currentY
    this.previousRatio = currentRatio
  })
};
