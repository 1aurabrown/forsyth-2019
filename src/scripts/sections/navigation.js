import {register} from '@shopify/theme-sections';
import Breakpoints from 'breakpoints-js';
import StickySidebar from '../components/sticky-sidebar';
import SearchForm from '../components/search-form';
import $ from 'jquery';
import animateCSS from '../components/animation';
import _ from 'lodash';

const selectors = {
  sidebar: '.sidebar',
  blogSidebar: '.sidebar--blog',
  headerSearchForm: '.header .search-form',
  sidebarSearchForm: '.sidebar .search-form',
  mobileMenuButton: '.header__mobile-menu-toggle',
  closeSidebar: '.sidebar__close',
  back: '.sidebar__back',
  titles: '.sidebar__nav-outer__item__title',
  activeTopMenuItem: '.has-active-child',
  innerMenu: '.sidebar__nav-inner',
  outerMenu: '.sidebar__nav-outer',
  top: '.sidebar__scroll__top',
  slideArea: '.sidebar__slide-area',
  inner: '.sidebar__inner',
  blogSidebarToggles: '.header__nav__item[data-blog-menu-toggle]'
};

register('navigation', {
  onLoad() {
    this.namespace = '.navigation';
    this.updateSticky = _.debounce(this._updateSticky, 50).bind(this)
    var $container = $(this.container);
    this.$slideArea = $(selectors.slideArea, $container)
    this.$sidebar = $(selectors.sidebar, $container);
    this.$blogSidebar = $(selectors.blogSidebar, $container);
    this.$inner = $(selectors.inner, $container);

    this.$innerMenus = $(selectors.innerMenu, this.$slideArea);
    this.$activeInnerMenu = $(selectors.activeTopMenuItem, this.$slideArea).find(selectors.innerMenu)
    this.$titles = $(selectors.titles, this.$slideArea);
    this.$back = $(selectors.back, $container);

    this.headerSearchFormElement = this.container.querySelector(selectors.headerSearchForm);
    this.headerSearchForm = new SearchForm(this.headerSearchFormElement, { activeClass: "expanded" });
    this.sidebarSearchFormElement = this.container.querySelector(selectors.sidebarSearchForm);
    this.sidebarSearchForm = new SearchForm(this.sidebarSearchFormElement, { activeClass: "expanded" });

    Breakpoints({mobile: {min: 0, max: 767 }, tablet: {min: 768, max: 991 }, desktop: {min: 992, max: Infinity } });
    $container.on('click' + this.namespace, selectors.mobileMenuButton, this.showSidebar.bind(this) );
    $container.on('click' + this.namespace, selectors.closeSidebar, this.hideSidebar.bind(this) );
    $container.on('click' + this.namespace, selectors.back, this.hideExpandedMenu.bind(this) );
    $container.on('click' + this.namespace, selectors.titles, this.menuTitleClicked.bind(this))

    $(window).on('resize', this.updateSticky)

    Breakpoints.on('desktop', 'enter', this.enterDesktop.bind(this))
    Breakpoints.on('mobile tablet', 'enter', this.exitDesktop.bind(this))
  },

  enterDesktop() {
    if (this.$blogSidebar.length > 0) {
      this.$blogSidebar.hide()
      this.$blogSidebar.find('[data-blog-menu]').hide()
      $(container).on('click' + this.namespace, selectors.blogSidebarToggles, this.toggleBlogSidebar.bind(this))
    }
    this.createStickySidebar();
    this.unsetSidebarTopHeight()
    this.hideExpandedMenu();
    this.$titles.show();
    this.expandMenu(this.$activeInnerMenu)
    this.updateSticky();

  },

  exitDesktop () {
    if (this.$blogSidebar.length > 0) {
      this.$blogSidebar.show()
      this.$blogSidebar.find('[data-blog-menu]').show()
      $(container).off('click' + this.namespace, selectors.blogSidebarToggles)
    }
    this.destroyStickySidebar();
    this.hideSidebar();
    this.hideExpandedMenu();
  },

  menuTitleClicked(e) {
    var $innerMenu = $(e.target).next(selectors.innerMenu);
    if (!$innerMenu.length > 0) return
    if ($innerMenu.is(':visible')) {
      this.hideMenu($innerMenu, true);
    } else {
      this.expandMenu($innerMenu)
    }
  },

  hideExpandedMenu(animated = false) {
    this.hideMenu(this.$innerMenus, animated)
  },

  hideMenu($el, animated = false) {
    if (Breakpoints.is('desktop')) {
      if (animated) {
        $el.slideUp(250, function() {
          this.updateSticky()
        }.bind(this))
      } else {
        $el.hide();
        this.updateSticky();
      }
    } else {
      var hide = function() {
        this.$slideArea.removeClass('expanded')
        $el.hide();
        this.$titles.show();
        this.setSidebarTopHeight()
      }.bind(this)
      this.$back.removeClass('visible');
      if(animated) {
        animateCSS($el, 'fadeOut', function() {
          hide()
          animateCSS(this.$titles, 'fadeIn')
        }.bind(this))
      } else {
        hide()
      }
    }
  },

  toggleBlogSidebar({ currentTarget }) {
    const menu = currentTarget.getAttribute('data-blog-menu-toggle')
    const $el = this.$blogSidebar.find(`[data-blog-menu=${ menu }]`)
    if (Breakpoints.is('desktop')) {
      if ($el.is(':visible')) {
        this.hideBlogSidebar($el)
      } else {
        this.showBlogSidebar($el)
      }
    }
  },

  showBlogSidebar($el) {
    function show() {
      this.hideExpandedMenu();
      $el.show();
      animateCSS($el, 'fadeIn')
      this.updateSticky()
    }
    const $visible = this.$blogSidebar.find('[data-blog-menu]:visible')
    if ($visible.length > 0) {
      animateCSS($visible, 'fadeOut', function() {
        $visible.hide()
        show.bind(this)()
      }.bind(this))
    } else {
      this.$blogSidebar.show()
      show.bind(this)()
    }
  },


  hideBlogSidebar($el) {
    animateCSS($el, 'fadeOut', function() {
      $el.hide();
      this.$blogSidebar.hide()
      this.updateSticky()
    }.bind(this))
  },

  _updateSticky() {
    setTimeout(function(){
      if (!this.stickySidebar) return;
      if (!Breakpoints.is('desktop')) return;
      this.stickySidebar.forceUpdate();
    }.bind(this), 0)
  },

  expandMenu($el) {
    if (Breakpoints.is('desktop')) {
      $el.slideDown(250, function() {
        this.updateSticky()
      }.bind(this))
      this.hideMenu(this.$innerMenus.not($el), true)
    } else {
      animateCSS(this.$titles, 'fadeOut', function() {
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
    window.navSidebar = this.stickySidebar = new StickySidebar(this.$sidebar[0], {
      containerSelector: '#container',
      innerWrapperSelector: selectors.inner,
      bottomSpacing: 30
    });
  },

  destroyStickySidebar() {
    if (this.stickySidebar) {
      this.stickySidebar.destroy();
      delete this.stickySidebar;

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
    this.headerSearchForm.destroy();
    this.sidebarSearchForm.destroy();
    this.container.off(this.namespace)
    Breakpoints.off('desktop')
    Breakpoints.off('mobile tablet')
    $(window).off('resize', this.updateSticky)
  }
});
