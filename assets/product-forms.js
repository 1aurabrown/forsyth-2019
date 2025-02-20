import {getUrlWithVariant, ProductForm} from './theme-product-form.js';
import {formatMoney} from './theme-currency.js';
// import formatSections from '../components/format-sections';

if (!customElements.get('product-info')) {
  customElements.define(
    'product-info',
    class ProductInfo extends HTMLElement {


      static classes = {
        hide: 'hide',
      }

      static selectors = {
        submitButton: '[data-submit-button]',
        submitButtonText: '[data-submit-button-text]',
        comparePrice: '[data-compare-price]',
        comparePriceText: '[data-compare-text]',
        priceWrapper: '[data-price-wrapper]',
        productForm: '[data-product-form]',
        productPrice: '[data-product-price]',
      };

      constructor() {
        super();
      }


      async connectedCallback() {
        const selectors = ProductInfo.selectors;

        this.productFormElements = document.querySelectorAll(selectors.productForm);
        this.product = await this.getProductJson(
          this.productFormElements[0].dataset.productHandle
        );
        this.productForms = [];
        Array.prototype.forEach.call(this.productFormElements, function(element) {
          this.productForms.push(
            new ProductForm(
              element,
              this.product,
              { onOptionChange: this.onFormOptionChange.bind(this) }
            )
          )
        }.bind(this))

        this.addEventListener('click', this.onThumbnailClick);
        this.addEventListener('keyup', this.onThumbnailKeyup);

        // formatSections(this, selectors, classes);


      }

      getProductJson(handle) {
        return fetch(`/products/${handle}.js`).then((response) => {
          return response.json();
        });
      }

      onFormOptionChange(event) {
        const variant = event.dataset.variant;

        // this.renderImages(variant);
        this.renderPrice(variant);
        this.renderComparePrice(variant);
        this.renderSubmitButton(variant);

        this.updateBrowserHistory(variant);
      }

      renderSubmitButton(variant) {
        const selectors = ProductInfo.selectors;
        const $submitButtons = $(selectors.submitButton, this);
        const $submitButtonTexts = $(selectors.submitButtonText, this);

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
      }

      renderPrice(variant) {
        const selectors = ProductInfo.selectors;
        const $priceElements =$(selectors.productPrice, this);
        const $priceWrapperElements = $(selectors.priceWrapper, this);

        $priceWrapperElements.toggleClass(ProductInfo.classes.hide, !variant);

        if (variant) {
          $priceElements.text(formatMoney(variant.price, theme.moneyFormat))
        }
      }

      renderComparePrice(variant) {
        if (!variant) {
          return;
        }

        const selectors = ProductInfo.selectors;
        const classes = ProductInfo.classes;
        const $comparePriceElements = $(selectors.comparePrice, this);
        const $compareTextElements = $(selectors.comparePriceText, this);

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
      }

      updateBrowserHistory(variant) {
        const enableHistoryState = this.productForms[0].element.dataset
          .enableHistoryState;
        if (!variant || enableHistoryState !== 'true') {
          return;
        }

        const url = getUrlWithVariant(window.location.href, variant.id);
        window.history.replaceState({path: url}, '', url);
      }

      disconnectedCallback() {
        this.productForms.slice.call('destroy');
        this.removeEventListener('click', this.onThumbnailClick);
        this.removeEventListener('keyup', this.onThumbnailKeyup);
      }

    }

  )
}
