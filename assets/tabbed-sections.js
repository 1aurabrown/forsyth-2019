
if (!customElements.get('tabbed-sections')) {
  customElements.define(
    'tabbed-sections',
    class TabbedSections extends HTMLElement {
    	constructor() {
    		super()
			  this.headings = Array.from(this.querySelectorAll('.tabbed-sections__heading'))
				if (!this.headings.length) return;
			  this.contents = Array.from(this.querySelectorAll('.tabbed-sections__text'))
			  this.textsContainer = this.querySelector('.tabbed-sections__texts')

			  this.textsContainer.classList.add('rel')
			  this.contents.forEach(c => c.classList.add('abs', 'top', 'left', 'x'))
			  this.boundWindowResize = this.onWindowResize.bind(this)
			  this.selectedIndex = null;
			}

			connectedCallback() {
				if (!this.headings.length) return;
			  // ensure all texts are direct children of texts container
			  this.contents.forEach(c => {
			  	this.textsContainer.appendChild(c);
			  })

				this.headings.forEach(heading => {
			  	heading.addEventListener('click', this.onHeadingClick.bind(this))
			  })

			  window.addEventListener('resize', this.boundWindowResize)
			  this.selectTab(0, false)

			}

			disconnectedCallback() {
				if (!this.headings.length) return;
				window.removeEventListener('resize', this.boundWindowResize)
			}

			selectTab(index = 0, animated) {
			  const event = new Event("update");
				this.dispatchEvent(event);

			  if (index == this.selectedIndex) return;

			  let selectedHeading = this.headings[index]
			  let selectedContent = this.contents[index]

			  this.headings.forEach(heading => heading.classList.remove('active'));
			  this.contents.forEach(heading => heading.classList.remove('active'));
			  selectedHeading.classList.add('active')
			  selectedContent.classList.add('active')

			  if(animated) {
			    $(this.contents).filter(':visible').fadeOut(250, () => {
			      $(selectedContent).fadeIn(250)
		      	this.updateHeight(selectedContent, animated)
			    })
			  } else {
			    this.contents.forEach(c => c.style.display = 'none');
			    selectedContent.style.display = 'block';
			    this.updateHeight(selectedContent, animated)
			  }

				this.selectedIndex = index;
			}

			onHeadingClick(e) {
			  let index = this.headings.indexOf(e.currentTarget)
			  this.selectTab(index, true)
			}

			updateHeight(el, animated = false) {
			  var contentHeight = el.getBoundingClientRect().height;
			  console.log(contentHeight)
			  $(this.textsContainer).animate({'min-height': contentHeight},
			    { duration: animated ? 500 : 0,
			    	complete: () => {
						  const event = new Event("resize");
							this.dispatchEvent(event);
			    	}
			    }
			  )
			}

			onWindowResize = function(e) {
  			this.updateHeight(this.contents[this.selectedIndex])
			}
		}
	)
}
