import Masonry from 'masonry-layout'
import InfiniteScroll from 'infinite-scroll'
import imagesLoaded from 'imagesloaded';
import animations from './animate'

const classes = {
  container: 'product-masonry',
  loaded: 'product-masonry--loaded'
}

const selectors = {
  container: `.${classes.container}`,
  masonry: '.product-masonry__container',
  item: '.product-masonry__item',
  next: '.product-masonry__next',
  viewMore: '.product-masonry__view-more',
  status: '.product-masonry__status'
}

export default function initProductMasonries() {
  document.querySelectorAll(selectors.container).forEach((el) => {
    initProductMasonry(el)
  })
}

function initProductMasonry(container) {

  // attribute data-infinite-scroll is reserved and used by InfiniteScroll
  const infiniteScroll = container.hasAttribute('data-product-infinite-scroll')
  const masonryEl = container.querySelector(selectors.masonry)
  const viewMoreEl = container.querySelector(selectors.viewMore)
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
  if (infiniteScroll && container.querySelector(selectors.next)) {
    InfiniteScroll.imagesLoaded = imagesLoaded

    var infScroll = new InfiniteScroll( masonryEl, {
      path: selectors.next,
      append: selectors.item,
      checkLastPage: selectors.next,
      outlayer: msnry,
      status: selectors.status,
      button: selectors.viewMore,
      // load pages on button click
      scrollThreshold: false,
      loadOnScroll: false,
      debug: true
    });
    infScroll.on( 'last', ( response, path ) => {
      container.classList.add('last')
    });

    infScroll.on( 'request', ( response, path ) => {
      container.classList.add('loading')
    });

    infScroll.on( 'append', ( response, path, items ) => {
      container.classList.remove('loading')
      animations()
    })
  }

  return msnry;
}
