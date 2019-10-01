import {register} from '@shopify/theme-sections';

register('article-content', {
  onLoad() {
    const paragraphs = this.container.querySelectorAll('p');
    paragraphs.forEach(function(paragraph) {
      const images = paragraph.querySelectorAll('img')
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
      }

      images.forEach(function(image) {
        const originalParent = image.parentNode;
        var imageWrapper = document.createElement("div");
        imageWrapper.classList.add('image-wrapper')
        paragraph.appendChild(imageWrapper);
        imageWrapper.appendChild(image)
        if (originalParent.childNodes.length < 1) {
          originalParent.parentNode.removeChild(originalParent)
        }
      })
    })
  },

  onUnload() {
    this.newsletter.destroy();
  }
});
