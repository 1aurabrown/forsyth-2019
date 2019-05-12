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
  console.log(this.$contentsContainer)
  this.$contentsContainer.css('position', 'relative')
  this.$contents.css({ 'position': 'absolute', 'top': 0, 'left': 0, 'width': '100%'})
  this.$el.on('click' + this.namespace, options.headings, this._onHeadingClick.bind(this));
  $(window).on('resize' + this.namespace, this._onWindowResize.bind(this));

  this.selectTab(0, false)
}

/**
 * Cleans up all event handlers that were assigned when the Product Form was constructed.
 * Useful for use when a section needs to be reloaded in the theme editor.
 */
TabbedSections.prototype.destroy = function() {

};


TabbedSections.prototype.selectTab = function(index, animated = true) {
  if (index == this.selectedIndex) return;

  var $selectedHeading = $(this.$headings[index])
  var $selectedContent = $(this.$contents[index])

  this.$headings.removeClass('active');
  $selectedHeading.addClass('active')

  if(animated) {
    this.$contents.filter(':visible').fadeOut(500, function() {
      $selectedContent.fadeIn(500);
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
  this.selectTab(this.$headings.index(e.currentTarget))
};
TabbedSections.prototype._setHeight = function($content) {
  var contentHeight = $content.outerHeight(true)
  this.$contentsContainer.css('min-height', contentHeight + 'px')
  this.resizeCallback();
};
TabbedSections.prototype._onWindowResize = function($content) {
  this._setHeight($(this.$contents[this.selectedIndex]))
};
