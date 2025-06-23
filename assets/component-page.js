const selectors = {
  images: 'img',
  content: '.text-page__text',
  imagesContainer: '.text-page__images'
};

const classes = {
  image: 'text-page__images__image'
}


if (!customElements.get('page-section')) {
  class PageSection extends HTMLElement {
    connectedCallback() {
    	this.content = this.querySelector(selectors.content)
    	this.images = this.querySelectorAll(selectors.images)
	    this.imagesContainer = this.querySelector(selectors.imagesContainer);

	    if (this.images.length > 0) {
	      Array.from(this.images).forEach(image => {
	        var originalParent = image.parentElement
	        const newImageWrapper = document.createElement('div')
	        newImageWrapper.classList.add(classes.image)
	        newImageWrapper.appendChild(image)
	        this.imagesContainer.append(newImageWrapper)
	        
	        const isEmptyElement = !originalParent.innerHTML.replace(/\s/g, '').length
	        if (isEmptyElement) originalParent.parentElement.removeChild(originalParent)
	    	})
	    } else {
	      imagesContainer.parentElement.removeChild(imagesContainer)
	    }
  	}
  }
  customElements.define('page-section', PageSection);
};
