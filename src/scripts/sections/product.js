/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
 * @namespace product
 */

import {getUrlWithVariant, ProductForm} from '@shopify/theme-product-form';
import {formatMoney} from '@shopify/theme-currency';
import {register} from '@shopify/theme-sections';
import {forceFocus} from '@shopify/theme-a11y';
import Breakpoints from 'breakpoints-js';
import $ from 'jquery';
import TabbedSections from '../components/tabbed-sections';
import _ from 'lodash';
import StickySidebar from '../components/sticky-sidebar';
import MobileWaypoints from '../components/product-mobile-waypoints';
import formatSections from '../components/format-sections';

const classes = {
  hide: 'hide',
  sectionHeading: 'product__text__description__headings__heading',
  sectionText: 'product__text__description__texts__text',
};

const keyboardKeys = {
  ENTER: 13,
};

const selectors = {
  submitButton: '[data-submit-button]',
  submitButtonText: '[data-submit-button-text]',
  comparePrice: '[data-compare-price]',
  comparePriceText: '[data-compare-text]',
  priceWrapper: '[data-price-wrapper]',
  productForm: '[data-product-form]',
  productPrice: '[data-product-price]',
  rightColumn: '.product__text',
  rightColumnInner: '.product__text__inner',
  description: '.product__text__description',
  originalDescription: '.product__text__description__original',
  headingsBar: '[js-headings]',
  headingsBarContainer: '[js-headings-container]',
  sectionHeading: '.' + classes.sectionHeading,
  sectionText: '.' + classes.sectionText,
  textsContainer: '.product__text__description__texts',
  content: '.product__content',
  bottomMobileSticky: '[data-bottom-sticky]',
  bottomMobileStickyContainer: '[data-bottom-sticky-container]',
  imagesContainer: '[data-images-container]'
};

register('product', {
  async onLoad() {
    const productFormElement = document.querySelector(selectors.productForm);
    this.product = await this.getProductJson(
      productFormElement.dataset.productHandle
    );
    this.productForm = new ProductForm(productFormElement, this.product, {
      onOptionChange: this.onFormOptionChange.bind(this),
    });


    this.rightColumn = this.container.querySelector(selectors.rightColumn);
    this.container.addEventListener('click', this.onThumbnailClick);
    this.container.addEventListener('keyup', this.onThumbnailKeyup);

    formatSections(this.container, selectors, classes);

    this.mobileWaypoints = new MobileWaypoints(this.container, selectors);
    this.tabbedSections = new TabbedSections(
      this.container.querySelector(selectors.description), {
        headings: selectors.sectionHeading,
        contents: selectors.sectionText,
        contentsContainer: selectors.textsContainer,
        resizeCallback: this.updateDesktopSticky.bind(this),
        selectCallback: this.mobileScrollToTextTop.bind(this)
      }
    )

    Breakpoints({mobile: {min: 0, max: 767 }, tablet: {min: 768, max: 991 }, desktop: {min: 992, max: Infinity } });
    Breakpoints.on('desktop tablet', 'enter', this.exitMobile.bind(this))
    Breakpoints.on('mobile', 'enter', this.enterMobile.bind(this))
  },

  onUnload() {
    this.productForm.destroy();
    this.removeEventListener('click', this.onThumbnailClick);
    this.removeEventListener('keyup', this.onThumbnailKeyup);
  },

  // Helpers for formatting description text



  // Mobile section tab selection callback

  mobileScrollToTextTop() {
    if(Breakpoints.is('mobile')) {
      $(document.scrollingElement).animate({ scrollTop: $(selectors.headingsBarContainer, this.container).offset().top + 1 }, 500)
    }
  },

  // Methods relating to right-hand sticky text area on tablet & desktop

  createDesktopSticky () {
    window.productSticky = this.desktopSticky = new StickySidebar(this.rightColumn, {
      containerSelector: selectors.container,
      innerWrapperSelector: selectors.rightColumnInner,
      bottomSpacing: 10,
      topSpacing: function() {
        return $(this.rightColumn).offset().top
      }.bind(this)
    });
  },

  updateDesktopSticky() {
    console.log('update product sticky')
    if (Breakpoints.is('mobile')) return;
    setTimeout(function() {
      if (this.desktopSticky) {
        this.desktopSticky.forceUpdate();
      }
    }.bind(this), 5);
  },

  destroySticky() {
    if (this.desktopSticky) {
      this.desktopSticky.destroy();
      delete this.desktopSticky;
    }
  },

  // Breakpoint set-up and tear-down

  exitMobile() {
    this.createDesktopSticky();
    this.updateDesktopSticky();
    this.mobileWaypoints.teardown();
  },

  enterMobile () {
    this.destroySticky();
    this.mobileWaypoints.setup();
  },

  // Slate boilerplate methods

  getProductJson(handle) {
    return fetch(`/products/${handle}.js`).then((response) => {
      return response.json();
    });
  },

  onFormOptionChange(event) {
    const variant = event.dataset.variant;

    this.renderImages(variant);
    this.renderPrice(variant);
    this.renderComparePrice(variant);
    this.renderSubmitButton(variant);

    this.updateBrowserHistory(variant);
  },

  renderSubmitButton(variant) {
    const submitButton = this.container.querySelector(selectors.submitButton);
    const submitButtonText = this.container.querySelector(
      selectors.submitButtonText,
    );

    if (!variant) {
      submitButton.disabled = true;
      submitButtonText.innerText = theme.strings.unavailable;
    } else if (variant.available) {
      submitButton.disabled = false;
      submitButtonText.innerText = theme.strings.addToCart;
    } else {
      submitButton.disabled = true;
      submitButtonText.innerText = theme.strings.soldOut;
    }
  },

  renderPrice(variant) {
    const priceElement = this.container.querySelector(selectors.productPrice);
    const priceWrapperElement = this.container.querySelector(
      selectors.priceWrapper,
    );

    priceWrapperElement.classList.toggle(classes.hide, !variant);

    if (variant) {
      priceElement.innerText = formatMoney(variant.price, theme.moneyFormat);
    }
  },

  renderComparePrice(variant) {
    if (!variant) {
      return;
    }

    const comparePriceElement = this.container.querySelector(
      selectors.comparePrice,
    );
    const compareTextElement = this.container.querySelector(
      selectors.comparePriceText,
    );

    if (!comparePriceElement || !compareTextElement) {
      return;
    }

    if (variant.compare_at_price > variant.price) {
      comparePriceElement.innerText = formatMoney(
        variant.compare_at_price,
        theme.moneyFormat,
      );
      compareTextElement.classList.remove(classes.hide);
      comparePriceElement.classList.remove(classes.hide);
    } else {
      comparePriceElement.innerText = '';
      compareTextElement.classList.add(classes.hide);
      comparePriceElement.classList.add(classes.hide);
    }
  },

  updateBrowserHistory(variant) {
    const enableHistoryState = this.productForm.element.dataset
      .enableHistoryState;

    if (!variant || enableHistoryState !== 'true') {
      return;
    }

    const url = getUrlWithVariant(window.location.href, variant.id);
    window.history.replaceState({path: url}, '', url);
  },
});
