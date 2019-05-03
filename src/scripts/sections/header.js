import SearchForm from '../components/search-form';
import {register} from '@shopify/theme-sections';

const keyboardKeys = {
  ENTER: 13,
};

const selectors = {
  searchForm: '.search-form',
};

register('header', {
  onLoad() {
    this.searchFormElement = this.container.querySelector(selectors.searchForm);
    this.searchForm = new SearchForm(this.searchFormElement, { activeClass: "expanded" });
  },

  onUnload() {
    this.searchForm.destroy();
  }
});
