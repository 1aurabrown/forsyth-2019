import Listeners from '../components/listeners';
import Breakpoints from 'breakpoints-js';
import StickySidebar from 'sticky-sidebar';
import SearchForm from '../components/search-form';
import {register} from '@shopify/theme-sections';
import $ from 'jquery';
import animateCSS from '../components/animation';

const selectors = {
  sidebar: '.sidebar',
  searchForm: '.search-form',
  mobileMenuButton: '.header__mobile-menu-toggle',
  closeSidebar: '.sidebar__close',
  back: '.sidebar__back',
  titles: '.sidebar__nav-outer__item__title',
  activeTopMenuItem: '.has-active-child',
  innerMenu: '.sidebar__nav-inner',
  outerMenu: '.sidebar__nav-outer',
  top: '.sidebar__scroll__top',
  slideArea: '.sidebar__slide-area'
};

register('navigation', {
  onLoad() {
    this.namespace = '.navigation';
    var $container = $(this.container);
    this.$slideArea = $(selectors.slideArea, this.$container)
    this.$sidebar = $(selectors.sidebar, $container);

    this.$innerMenus = $(selectors.innerMenu, this.$slideArea);
    this.$activeInnerMenu = $(selectors.activeTopMenuItem, this.$slideArea).find(selectors.innerMenu)
    this.$titles = $(selectors.titles, this.$slideArea);
    this.$back = $(selectors.back, this.$container);

    this.searchFormElement = this.container.querySelector(selectors.searchForm);
    this.searchForm = new SearchForm(this.searchFormElement, { activeClass: "expanded" });

    Breakpoints({mobile: {min: 0, max: 767 }, tablet: {min: 768, max: 991 }, desktop: {min: 992, max: Infinity } });
    $container.on('click' + this.namespace, selectors.mobileMenuButton, this.showSidebar.bind(this) );
    $container.on('click' + this.namespace, selectors.closeSidebar, this.hideSidebar.bind(this) );
    $container.on('click' + this.namespace, selectors.back, this.hideExpandedMenu.bind(this) );
    $container.on('click' + this.namespace, selectors.titles, this.menuTitleClicked.bind(this))

    Breakpoints.on('desktop', 'enter', this.enterDesktop.bind(this))
    Breakpoints.on('mobile tablet', 'enter', this.exitDesktop.bind(this))
  },

  enterDesktop() {
    console.log('enter desktop')
    this.createStickySidebar();
    this.initDesktopNestedMenus();
  },

  exitDesktop () {
    this.destroyStickySidebar();
    this.hideSidebar();
    this.hideExpandedMenu();
  },

  initDesktopNestedMenus() {
    this.hideExpandedMenu();
    this.$activeInnerMenu.show();
    this.unsetSidebarTopHeight()
  },

  menuTitleClicked(e) {
    var $innerMenu = $(e.target).next(selectors.innerMenu);
    if (!$innerMenu.length > 0) return
    if ($innerMenu.is(':visible')) {
      this.hideMenu($innerMenu);
    } else {
      this.expandMenu($innerMenu)
    }
  },

  hideExpandedMenu(animated = false) {
    this.hideMenu(this.$innerMenus, animated)
  },

  hideMenu($el, animated) {
    var show = function() {
      this.$slideArea.removeClass('expanded')
      $el.hide();
      this.$titles.show();
      this.setSidebarTopHeight()
    }.bind(this)
    if (Breakpoints.is('desktop')) {
      $el.slideUp();
    } else {
      this.$back.removeClass('visible');
      if(animated) {
        animateCSS($el, 'fadeOut', function() {
          show()
          animateCSS(this.$titles, 'fadeIn')
        }.bind(this))
      } else {
        show()
      }
    }
  },

  expandMenu($el) {
    console.log('expand')
    if (Breakpoints.is('desktop')) {
      this.$innerMenus.not($el).slideUp();
      $el.slideDown();
    } else {
      animateCSS(this.$titles, 'fadeOut', function() {
        console.log($el, this.$titles[0])
        this.$slideArea.addClass('expanded')
        this.$titles.hide();
        animateCSS($el, 'fadeIn')
        $el.show();
        this.setSidebarTopHeight()
        this.$back.addClass('visible');
      }.bind(this))
    }
  },

  unsetSidebarTopHeight() {
    $(selectors.top, this.$container).css('min-height', 'initial')
  },

  setSidebarTopHeight() {
    if (Breakpoints.is('desktop')) return;
    var height = this.$slideArea.outerHeight()
    $(selectors.top, this.$container).css('min-height', height + 'px')
  },

  createStickySidebar() {
    this.stickySidebar = new StickySidebar(this.$sidebar[0], {
      containerSelector: '#container',
      innerWrapperSelector: '.sidebar__inner'
    });
  },

  destroyStickySidebar() {
    if (this.stickySidebar) {
      console.log('destroy sidebar')
      this.stickySidebar.destroy();
    }
  },

  showSidebar() {
    this.hideExpandedMenu();
    this.$sidebar.addClass('visible');
  },

  hideSidebar() {
    this.$sidebar.removeClass('visible');
  },

  onUnload() {
    this.stickySidebar.destroy();
    delete this.stickySidebar;
    this.searchForm.destroy();
    this._listeners.removeAll();
  }
});
