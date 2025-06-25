import mela from './mela.js'

const classes = {
  loaded: 'product-masonry--loaded'
}

const selectors = {
  masonry: '.product-masonry__container',
  item: '.product-masonry__item',
  next: '.product-masonry__next',
  viewMore: '.product-masonry__view-more',
  status: '.product-masonry__status'
}

const animations = mela();
if (!customElements.get('product-masonry')) {
  class ProductMasonry extends HTMLElement {
    connectedCallback() {
		  animations();
			const infiniteScroll = this.hasAttribute('data-product-infinite-scroll')
		  const masonryEl = this.querySelector(selectors.masonry)
		  const viewMoreEl = this.querySelector(selectors.viewMore)

		  const msnry = new Masonry( masonryEl, {
		    itemSelector: selectors.item,
		    columnWidth: selectors.item,
		    percentPosition: true,
		    isInitLayout: false,
		    transitionDuration: 0,
		    hiddenStyle: {
		      opacity: 0
		    },
		    visibleStyle: {
		      opacity: 1
		    },
		    horizontalOrder: true
		  })

		  msnry.on( 'layoutComplete', function() {
		    masonryEl.classList.add('loaded') // hide container until layout is complete to avoid jumpiness
		  });

		  msnry.layout();
		  if (infiniteScroll && this.querySelector(selectors.next)) {
		    var infScroll = new InfiniteScroll( selectors.masonry, {
		      path: selectors.next,
		      append: selectors.item,
		      checkLastPage: selectors.next,
		      outlayer: msnry,
		      status: selectors.status,
		      button: selectors.viewMore,
		      // load pages on button click
		      scrollThreshold: false,
		      loadOnScroll: false,
		      debug: true,
		    });
		    infScroll.on( 'last', ( response, path ) => {
		      this.classList.add('last')
		    });

		    infScroll.on( 'request', ( response, path ) => {
	      	this.classList.add('loading')
		    });

		    infScroll.on( 'append', ( response, path, items ) => {
		      this.classList.remove('loading')
		      animations()
		    })
		  }
		}
	}
  customElements.define('product-masonry', ProductMasonry);
}