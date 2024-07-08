import Listeners from './listeners';
import $ from 'jquery';

const selectors = {
  form: 'form',
  email: '#mce-EMAIL',
  originalSubmit: '#mc-embedded-subscribe',
  arrowSubmit: '.newsletter__button',
  success: '.newsletter__feedback__success',
  error: '.newsletter__feedback__error',
  data: '[data-newsletter-json]'
};

export default function Newsletter(element, options = {}) {
  this.element = element;

  this.form = this.element.querySelector(selectors.form);
  var originalSubmit = this.element.querySelector(selectors.originalSubmit);
  this.arrowSubmit = this.element.querySelector(selectors.arrowSubmit);
  this.sectionSettings = JSON.parse(this.element.querySelector(selectors.data).innerHTML)

  if (originalSubmit.parentNode) {
    originalSubmit.parentNode.appendChild(this.arrowSubmit)
    originalSubmit.remove();
    this.arrowSubmit.classList.remove('hide');
  }

  this.email = this.element.querySelector(selectors.email);
  this.email.placeholder = this.sectionSettings.placeholder
  this.success = this.element.querySelector(selectors.success);
  this.error = this.element.querySelector(selectors.error);
  this._setupListeners(options);
}

/**
 * Cleans up all event handlers that were assigned when the Product Form was constructed.
 * Useful for use when a section needs to be reloaded in the theme editor.
 */
Newsletter.prototype.destroy = function() {
  this._listeners.removeAll();
};


// Private Methods
// -----------------------------------------------------------------------------

Newsletter.prototype._setupListeners = function(options) {
  this._listeners = new Listeners();
  this._listeners.add(
    this.form,
    'submit',
    this._onSubmit.bind(this, options)
  );

  this._listeners.add(
    this.email,
    'input',
    this._resetFeedback.bind(this)
  );
}

Newsletter.prototype._disable = function() {
  this.email.setAttribute("disabled", "disabled");
  this.arrowSubmit.setAttribute("disabled", "disabled");
}

Newsletter.prototype._enable = function() {
  this.email.removeAttribute("disabled");
  this.arrowSubmit.removeAttribute("disabled");
}

Newsletter.prototype._onError = function(options = {}, text = "An error has occured. Please try again.") {
  this.error.innerHTML = text;
  this.error.classList.remove('hide');
  if (options.error) {
    options.error();
  }
}

Newsletter.prototype._onSuccess = function(options = {}) {
  this.success.innerHTML = this.sectionSettings.success;
  this.success.classList.remove('hide');
  if (options.success) {
    options.success();
  }
}

Newsletter.prototype._onSubmit = function(options = {}, event) {
  event.preventDefault();
  this._resetFeedback();
  if (!this.email.checkValidity()) {
    this._onError(this.options, 'Please enter a valid email address.')
    return;
  }

  var data = $(this.form).serialize();
  this._disable()
  return $.ajax({
    type: "GET",
    url: this.form.getAttribute("action").replace('/post', '/post-json'),
    data: data,
    cache: false,
    dataType: "jsonp",
    jsonp: "c",
    contentType: "application/json; charset=utf-8",
    error: function(error) {
      this._enable();
      this._onError(options)
    }.bind(this),
    success: function(data) {
      this._enable();
      if (data.result == 'error') {
        this._onError(options, data.msg);
      } else {
        this._onSuccess(options);
      }
    }.bind(this)
  });
};

Newsletter.prototype._resetFeedback = function() {
  this.success.classList.add('hide')
  this.success.innerHTML = '';
  this.error.classList.add('hide')
  this.error.innerHTML = '';
};
