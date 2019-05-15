import $ from 'jquery';
import _ from 'lodash';

/**
 * Constructor class that creates a new instance of a product form controller.
 *
 * @param {Element} element - DOM element which is equal to the <form> node wrapping product form inputs
 * @param {Object} options - Optional options object
 * @param {Function} options.onLabelClick
 * @param {Function} options.onInputBlur
 */

export default function TabbedSections(element, options = {}) {
  this.$el = $(element);
  this.namespace = '.tabbed-section'
  this.$headings = $(options.headings, this.element);
  this.$contents = $(options.contents, this.element);
  this.$contentsContainer = $(options.contentsContainer, this.element)
  this.resizeCallback = options.resizeCallback;
  this.selectCallback = options.selectCallback;
  this.$contentsContainer.css('position', 'relative')
  this.$contents.css({ 'position': 'absolute', 'top': 0, 'left': 0, 'width': '100%'})
  this.$el.on('click' + this.namespace, options.headings, this._onHeadingClick.bind(this));
  this.onWindowResize = _.debounce(this._onWindowResize.bind(this), 100);
  $(window).on('resize' + this.namespace, this.onWindowResize.bind(this));

  this.selectTab(0, false)
}
TabbedSections.prototype.destroy = function() {
  this.$el.off('click' + this.namespace);
  $(window).off('resize' + this.namespace);
};


TabbedSections.prototype.selectTab = function(index, animated = true) {
  if (index == this.selectedIndex) return;

  var $selectedHeading = $(this.$headings[index])
  var $selectedContent = $(this.$contents[index])

  this.$headings.removeClass('active');
  $selectedHeading.addClass('active')

  if(animated) {
    this.$contents.filter(':visible').fadeOut(250, function() {
      $selectedContent.fadeIn(250);
    })
  } else {
    this.$contents.filter(':visible').hide();
    $selectedContent.show();
  }

  this._setHeight($(this.$contents[index]))

  this.selectedIndex = index;
};


// Private Methods
// -----------------------------------------------------------------------------

TabbedSections.prototype._onHeadingClick = function(e) {
  let index = this.$headings.index(e.currentTarget)
  this.selectTab(this.$headings.index(e.currentTarget))
  if (this.selectCallback && _.isFunction(this.selectCallback)) {
    this.selectCallback(e.currentTarget, index);
  }
};
TabbedSections.prototype._setHeight = function($content) {
  var contentHeight = $content.outerHeight(true)
  this.$contentsContainer.css('min-height', contentHeight + 'px')
  if (this.resizeCallback && _.isFunction(this.resizeCallback)) {
    this.resizeCallback();
  }
};
TabbedSections.prototype._onWindowResize = function($content) {
  this._setHeight($(this.$contents[this.selectedIndex]))
};
