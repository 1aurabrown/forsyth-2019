if (!customElements.get('newsletter-form')) {
  class NewsletterForm extends HTMLElement {
    connectedCallback() {

      const selectors = {
        form: 'form',
        email: '#mce-EMAIL',
        originalSubmit: '#mc-embedded-subscribe',
        arrowSubmit: '.newsletter__button',
        success: '.newsletter__feedback__success',
        error: '.newsletter__feedback__error',
        data: '[data-newsletter-json]'
      };

      this.form = this.querySelector(selectors.form);
      var originalSubmit = this.querySelector(selectors.originalSubmit);
      this.arrowSubmit = this.querySelector(selectors.arrowSubmit);
      this.sectionSettings = JSON.parse(this.querySelector(selectors.data).innerHTML)

      if (originalSubmit.parentNode) {
        originalSubmit.parentNode.appendChild(this.arrowSubmit)
        originalSubmit.remove();
        this.arrowSubmit.classList.remove('hide');
      }

      this.email = this.querySelector(selectors.email);
      this.email.placeholder = this.sectionSettings.placeholder
      this.success = this.querySelector(selectors.success);
      this.error = this.querySelector(selectors.error);
      this.setupListeners();
    }

    setupListeners() {
      this.form.addEventListener('submit', this.onSubmit.bind(this))
      this.email.addEventListener('input', this.resetFeedback.bind(this))
    }

    disable() {
      this.email.setAttribute("disabled", "disabled");
      this.arrowSubmit.setAttribute("disabled", "disabled");
    }

    enable() {
      this.email.removeAttribute("disabled");
      this.arrowSubmit.removeAttribute("disabled");
    }

    onError(text = "An error has occured. Please try again.") {
      this.error.innerHTML = text;
      this.error.classList.remove('hide');
    }

    onSuccess() {
      this.success.innerHTML = this.sectionSettings.success;
      this.success.classList.remove('hide');
    }

    onSubmit(event) {
      event.preventDefault();
      this.resetFeedback();
      if (!this.email.checkValidity()) {
        this.onError('Please enter a valid email address.')
        return;
      }

      var data = $(this.form).serialize();
      this.disable()
      return $.ajax({
        type: "GET",
        url: this.form.getAttribute("action").replace('/post', '/post-json'),
        data: data,
        cache: false,
        dataType: "jsonp",
        jsonp: "c",
        contentType: "application/json; charset=utf-8",
        error: function(error) {
          this.enable();
          this.onError()
        }.bind(this),
        success: function(data) {
          this.enable();
          if (data.result == 'error') {
            this.onError(data.msg);
          } else {
            this.onSuccess();
          }

        }.bind(this)
      });
    };
    resetFeedback() {
      console.log(this)
      this.success.classList.add('hide')
      this.success.innerHTML = '';
      this.error.classList.add('hide')
      this.error.innerHTML = '';
    };

    disconnectedCallback() {
    }

  }

  customElements.define('newsletter-form', NewsletterForm);
}


