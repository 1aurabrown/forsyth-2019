import {register} from '@shopify/theme-sections';
import Flickity from 'flickity-imagesloaded';

const selectors = {
  slideshows: '.image-container--many-images'
}

register('article-content', {
  onLoad() {
    this.formatParagraphs()
  },

  formatParagraphs() {
    const paragraphs = this.container.querySelectorAll('p');

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
  },

  createSlideshow(el) {
    if (!this.slideshows) {
      this.slideshows = []
    }
    const flkty = new Flickity( el, {
      // options
      wrapAround: true,
      pageDots: false,
      prevNextButtons: false
    })
    this.slideshows.push(flkty)
  },

  onUnload() {
    this.newsletter.destroy();
    this.slideshows.forEach(() => {
      this.destroy()
    })
  }
});
