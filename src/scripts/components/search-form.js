import Listeners from './listeners';

const selectors = {
  label: 'label',
  input: '[name^="q"]',
};

/**
 * Constructor class that creates a new instance of a product form controller.
 *
 * @param {Element} element - DOM element which is equal to the <form> node wrapping product form inputs
 * @param {Object} options - Optional options object
 * @param {Function} options.onLabelClick
 * @param {Function} options.onInputBlur
 */

export default function SearchForm(element, options = {}) {
  this.element = element;

  this.input = this.element.querySelector(selectors.input);
  this.label = this.element.querySelector(selectors.label);

  this._listeners = new Listeners();


  this._listeners.add(
    this.label,
    'click',
    this._onLabelClick.bind(this, options)
  );

  this._listeners.add(
    this.input,
    'blur',
    this._onInputBlur.bind(this, options)
  );

}

/**
 * Cleans up all event handlers that were assigned when the Product Form was constructed.
 * Useful for use when a section needs to be reloaded in the theme editor.
 */
SearchForm.prototype.destroy = function() {
  this._listeners.removeAll();
};


// Private Methods
// -----------------------------------------------------------------------------

SearchForm.prototype._onLabelClick = function(options, event) {
  console.log('label click')
  this.element.classList.toggle(options.activeClass);
  if (this.element.classList.contains(options.activeClass)) {
    this.input.focus();
  }
  if (options.onSearchClick) {
    options.onSearchClick(event);
  }
};

SearchForm.prototype._onInputBlur = function(options, event) {
  console.log('input blur')
  setTimeout(function() {
    this.element.classList.remove(options.activeClass);
    if (options.onInputBlur) {
      options.onInputBlur(event);
    }
  }.bind(this), 20)
};
