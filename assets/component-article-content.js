if (!customElements.get('article-content')) {
  class ArticleContent extends HTMLElement {

  	static classes = {
		}

		static selectors = {
			slideshows: '.image-container--many-images'
		};

    connectedCallback() {
    	this.formatParagraphs()
		}

		formatParagraphs() {
	    const paragraphs = this.querySelectorAll('p');

	    paragraphs.forEach((paragraph) => {
	      const images = paragraph.querySelectorAll('img')

	      images.forEach((image) => {
	        const originalParent = image.parentNode;
	        paragraph.appendChild(image);
	        if (originalParent.childNodes.length < 1) {
	          originalParent.parentNode.removeChild(originalParent)
	        }
	      })

	      if (images.length == 0) {
	        paragraph.classList.add('text-container')
	      }
	      else if (images.length == 1) {
	        paragraph.classList.add('image-container')
	        paragraph.classList.add('image-container--one-image')
	      } else if (images.length == 2) {
	        paragraph.classList.add('image-container')
	        paragraph.classList.add('image-container--two-images')

	      } else if (images.length >=3 ) {
	        paragraph.classList.add('image-container')
	        paragraph.classList.add('image-container--many-images')
	        setTimeout(() => {
	          this.createSlideshow(paragraph)
	        }, 200)
	      }
	    })
	  }

	  createSlideshow(el) {
	    if (!this.slideshows) {
	      this.slideshows = []
	    }
	    const flkty = new Flickity( el, {
	      wrapAround: true,
	      pageDots: false,
	      setGalleryHeight: false,
	      fade: true,
	      arrowShape: {
	        x0: 20,
	        x1: 70, y1: 50,
	        x2: 72, y2: 48,
	        x3: 24
	      }
	    })
	    this.slideshows.push(flkty)
	  }

		disconnectedCallback() {
	    this.slideshows.forEach(() => {
	      this.destroy()
	    })
		}



	}
  customElements.define('article-content', ArticleContent);
}


