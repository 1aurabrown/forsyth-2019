if (!customElements.get('search-form')) {
  class SearchForm extends HTMLElement {

  	static classes = {
			active: "expanded",
		}
		static selectors = {
		  summary: 'summary',
		  button: 'button',
		  input: '[name^="q"]',
		}
    connectedCallback() {
    	this.details = this.querySelector('details')
		  this.input = this.querySelector('[name^="q"]');
		  this.summary = this.querySelector('summary');
		  this.button = this.querySelector('button');

		  this.toggleEvent = this.details.addEventListener('click', this.onToggle.bind(this) );
		  this.inputEvent = this.input.addEventListener('blur', this.onInputBlur.bind(this) );
		}

		disconnectedCallback() {
		  this.details.removeEventListener(this.toggleEvent)
		  this.input.removeEventListener(this.inputEvent)
		}

		onToggle(event) {
		  setTimeout(() => {
		  	if (this.details.hasAttribute("open")) {
		    	this.input.focus()
		   	}
	  	}, 1);
		}

		onInputBlur(event) {
			if (event.relatedTarget == this.summary) return;
		  setTimeout(() => { this.details.removeAttribute("open") }, 20)
		}

	}
  customElements.define('search-form', SearchForm);
}