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
    const productFormElements = document.querySelectorAll(selectors.productForm);
    this.product = await this.getProductJson(
      productFormElements[0].dataset.productHandle
    );
    this.productForms = [];
    Array.prototype.forEach.call(productFormElements, function(element) {
      this.productForms.push(
        new ProductForm(
          element,
          this.product,
          { onOptionChange: this.onFormOptionChange.bind(this) }
        )
      )
    }.bind(this))


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
    this.productForms.slice.call('destroy');
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

    // this.renderImages(variant);
    this.renderPrice(variant);
    this.renderComparePrice(variant);
    this.renderSubmitButton(variant);

    this.updateBrowserHistory(variant);
  },

  renderSubmitButton(variant) {
    const $submitButtons = $(selectors.submitButton, this.container);
    const $submitButtonTexts = $(selectors.submitButtonText, this.container);

    if (!variant) {
      $submitButtons.attr('disabled', true);
      $submitButtonTexts.text(theme.strings.unavailable)
    } else if (variant.available) {
      $submitButtons.attr('disabled', false);
      $submitButtonTexts.text(theme.strings.addToCart);
    } else {
      $submitButtons.attr('disabled', true);
      $submitButtonTexts.text(theme.strings.soldOut);
    }
  },

  renderPrice(variant) {
    const $priceElements =$(selectors.productPrice, this.container);
    const $priceWrapperElements = $(selectors.priceWrapper, this.container);

    $priceWrapperElements.toggleClass(classes.hide, !variant);

    if (variant) {
      $priceElements.text(formatMoney(variant.price, theme.moneyFormat))
    }
  },

  renderComparePrice(variant) {
    if (!variant) {
      return;
    }

    const $comparePriceElements = $(selectors.comparePrice, this.container);
    const $compareTextElements = $(selectors.comparePriceText, this.container);

    if (!$comparePriceElements.length > 0 || !$compareTextElements.length > 0) {
      return;
    }
    if (variant.compare_at_price > variant.price) {
      $comparePriceElements.text(
        formatMoney(
          variant.compare_at_price,
          theme.moneyFormat,
        )).removeClass(classes.hide)
      $compareTextElements.removeClass(classes.hide)
    } else {
      $comparePriceElements.text('').addClass(classes.hide)
      $compareTextElements.addClass(classes.hide)
    }
  },

  updateBrowserHistory(variant) {
    const enableHistoryState = this.productForms[0].element.dataset
      .enableHistoryState;
    console.log(enableHistoryState)
    if (!variant || enableHistoryState !== 'true') {
      return;
    }

    const url = getUrlWithVariant(window.location.href, variant.id);
    window.history.replaceState({path: url}, '', url);
  },
});
