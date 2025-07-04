// TO DO: update the following to be custom html elements;
import MobileWaypoints from './product-mobile-waypoints.js';


if (!customElements.get('product-layout')) {
  customElements.define(
    'product-layout',
    class ProductLayout extends HTMLElement {

    	static classes = {
			  hide: 'hide',
			  sectionHeading: 'tabbed-sections__heading',
			  sectionText: 'tabbed-sections__text',
			};

			static selectors = {
			  tabbedSections: 'tabbed-sections',
			  sectionHeading: '.' + ProductLayout.classes.sectionHeading,
			  sectionText: '.' + ProductLayout.classes.sectionText,
			  textsContainer: '.tabbed-sections__texts',
			};

      constructor() {
        super();
        this.rightColumnInner = this.querySelector('.product__text__inner')
		    this.rightColumn = this.querySelector('.product__text');
		    this.tabbedSections = this.querySelector('tabbed-sections')
      }


      connectedCallback() {
		    this.mobileWaypoints = new MobileWaypoints(this, ProductLayout.selectors);
		    this.tabbedSections.addEventListener('update', this.mobileScrollToTextTop.bind(this))
		    this.tabbedSections.addEventListener('resize', this.updateDesktopSticky.bind(this))

		    Breakpoints({mobile: {min: 0, max: 767 }, tablet: {min: 768, max: 991 }, desktop: {min: 992, max: Infinity } });
		    Breakpoints.on('desktop tablet', 'enter', this.exitMobile.bind(this))
		    Breakpoints.on('mobile', 'enter', this.enterMobile.bind(this))
		  }

		  // Mobile section tab selection callback
		  mobileScrollToTextTop() {
		    if(Breakpoints.is('mobile')) {
		      $(document.scrollingElement).animate({ scrollTop: this.tabbedSections.offsetTop + 1 }, 500)
		    }
		  }

		  // Methods relating to right-hand sticky text area on tablet & desktop
		  createDesktopSticky () {
		    window.productSticky = this.desktopSticky = new StickySidebar(this.rightColumn, {
		      containerSelector: ProductLayout.selectors.container,
		      innerWrapperSelector: ProductLayout.selectors.rightColumnInner,
		      bottomSpacing: 10,
		      topSpacing: function() {
		        return $(this.rightColumn).offset().top
		      }.bind(this)
		    });
		  }

		  updateDesktopSticky() {
		    if (Breakpoints.is('mobile')) return;
		    setTimeout(function() {
		      if (this.desktopSticky) {
		        this.desktopSticky.forceUpdate();
		      }
		    }.bind(this), 5);
		  }

		  destroySticky() {
		    if (this.desktopSticky) {
		      this.desktopSticky.destroy();
		      delete this.desktopSticky;
		    }
		  }

		  // Breakpoint set-up and tear-down

		  exitMobile() {
		    this.createDesktopSticky();
		    this.updateDesktopSticky();
		    // this.mobileWaypoints.teardown();
		  }

		  enterMobile () {
		    this.destroySticky();
		    this.mobileWaypoints.setup();
		  }

		  disconnectedCallback() {
	      Breakpoints.off('desktop')
	      Breakpoints.off('mobile tablet')
	      this.destroySticky();
	      this.tabbedSections.removeEventListener('resize')
	      this.tabbedSections.removeEventListener('update')
	    }
		}
	)
}
