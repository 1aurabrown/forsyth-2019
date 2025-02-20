console.log('homepage logo loaded')
if (!customElements.get('homepage-logo')) {
  class HomepageLogo extends HTMLElement {

  	static classes = {
		  globalLogoVisible: 'homepage-visible',
		  homepageLogoHidden: 'hidden',
		  homepageLogoAnimated: 'animated'
		}

		static selectors = {
		  globalLogo: '.logo',
		};

    connectedCallback() {
	    this.globalLogo = document.querySelector(HomepageLogo.selectors.globalLogo);
	    this.throttledScroll = _.throttle(this.onScroll.bind(this), 50);
	    this.onScroll();
	    window.addEventListener('scroll', this.throttledScroll);
	    window.addEventListener('resize', this.throttledScroll);
		}

		onScroll() {
			let classes = HomepageLogo.classes;
	    let scrollOffset = document.scrollingElement.scrollTop;
	    let trigger = this.offsetTop + this.getBoundingClientRect().height

	    if (( scrollOffset >  trigger) && !this.globalLogo.classList.contains(classes.globalLogoVisible)) {    // Large logo is off-screen

	      this.globalLogo.classList.add(classes.globalLogoVisible)
	      this.classList.remove(classes.homepageLogoAnimated)
	      this.classList.add(classes.homepageLogoHidden);

	    } else if (( scrollOffset <=  trigger) && this.globalLogo.classList.contains(classes.globalLogoVisible)) {  // Large logo is on-screen

	      $(this.globalLogo).one('transitionend', function() {
	        this.classList.add(classes.homepageLogoAnimated)
	        _.delay(function() {
	          this.classList.remove(classes.homepageLogoHidden);
	        }.bind(this), 100)
	      }.bind(this))
	      this.globalLogo.classList.remove(classes.globalLogoVisible)

	    }
	  }

		disconnectedCallback() {
	    $(this.globalLogo).off('transitionend')
	    window.removeEventListener('scroll', this.throttledScroll)
	    window.removeEventListener('resize', this.throttledScroll)
		}



	}
  customElements.define('homepage-logo', HomepageLogo);
}


