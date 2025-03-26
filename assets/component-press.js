if (!customElements.get('press-item')) {
  class PressItem extends HTMLElement {
    connectedCallback() {
    	console.log('press item')
    	this.isOpen = false;
    	this.thumb = this.querySelector('.press__grid__item__image')
			this.zoom = this.querySelector('.press__zoom',);
			this.inner = this.querySelector('.press__zoom__inner',);
    	this.closeButton = this.querySelector('[data-press-zoom-close]');
    	this.closeButton.addEventListener('click', ()=>this.close())
    	this.inner.addEventListener('click', (e)=> e.stopPropagation())
    	this.zoom.addEventListener('click', ()=>this.close())
    	this.thumb.addEventListener('click', ()=>this.open())
	  }

	  close() {
	  	if (!this.isOpen) return;
	  	this.zoom.classList.remove('visible')
	  	setTimeout(() => {
	  		this.zoom.classList.add('hide')
	  		this.zoom.classList.remove('flex')
	  		this.isOpen = false
	  	}, 250)
	  }

	  open() {
	  	if (this.isOpen) return;
	  	this.isOpen = true
  		this.zoom.classList.remove('hide')
			this.zoom.classList.add('flex')
			setTimeout(() => this.zoom.classList.add('visible'), 1);
	  }
		disconnectedCallback() {
			this.closeButton.removeEventListener('click')
    	this.thumb.removeEventListener('click')

		}
	}
  customElements.define('press-item', PressItem);
};
