if (!customElements.get('instagram-feed')) {
  class InstagramFeed extends HTMLElement {
    static classes = {
      imagesContainer: 'images'
    }
    static selectors = {
      feedContainer: '#insta-feed',
      image: '#insta-feed a',
      imageInner: '.instafeed-container',
      heading: '#insta-feed h2',
      imagesContainer: '.' + InstagramFeed.classes.imagesContainer
    };
    connectedCallback() {
      if ("MutationObserver" in window) {
        this.observe()
      } else {
        this.shouldPoll = true;
        this.poll()
      }

    }

    poll() {
      if (this.isReady()) {
        this.setup()
      } else {
        if (this.shouldPoll) {
          setTimeout(this.poll.bind(this), 100);
        }
      }
    }

    observe() {
      this.observer = new MutationObserver(_.debounce(this.checkMutation.bind(this), 200));
      this.observer.observe(this, { childList: true, subtree: true });
    }

    checkMutation(mutationsList, observer) {
      for(var mutation of mutationsList) {
        if (mutation.type == 'childList') {
          if (this.isReady()) {
            this.setup();
            this.observer.disconnect();
          }
          break;
        }
      }
    }

    isReady() {
      return (this.images = this.querySelectorAll(InstagramFeed.selectors.image)).length > 0
    }

    setup() {
      this.wrapImages();
      this.createFlickity();
    }

    wrapImages() {
      let feedContainer = this.querySelector(InstagramFeed.selectors.feedContainer)
      let newContainer = document.createElement("div");
      newContainer.classList.add(InstagramFeed.classes.imagesContainer);
      this.images.forEach(img => {
        newContainer.appendChild(img)
      })
      feedContainer.appendChild(newContainer);
    }

    createFlickity() {
      this.flickity = new Flickity(this.querySelector(InstagramFeed.selectors.imagesContainer), {
        // options
        cellAlign: 'center',
        wrapAround: true,
        imagesLoaded: true,
        arrowShape: {
          x0: 20,
          x1: 70, y1: 50,
          x2: 72, y2: 48,
          x3: 24
        }
      });
    }

    disconnectedCallback() {
      this.shouldPoll = false; // In case polling is still happening
      if (this.observer) { this.observer.disconnect(); }
      if (this.flickity) { this.flickity.destroy(); }
    }

  }

  customElements.define('instagram-feed', InstagramFeed);
}

