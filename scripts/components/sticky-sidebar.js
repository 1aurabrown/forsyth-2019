import StickySidebar from 'sticky-sidebar';

StickySidebar.prototype.forceUpdate = function() {
  this._reStyle = true;
  this.direction = 'down';
  this.updateSticky()
}

StickySidebar.prototype.isSidebarFitsViewport = function() {
  var topSpacing = this.options.topSpacing;
  var bottomSpacing = this.options.bottomSpacing;
  if( 'function' === typeof topSpacing )
      topSpacing = parseInt(topSpacing(this.sidebar)) || 0;

  if( 'function' === typeof bottomSpacing )
      bottomSpacing = parseInt(bottomSpacing(this.sidebar)) || 0;

  return this.dimensions.sidebarHeight + topSpacing + bottomSpacing < this.dimensions.viewportHeight;
}

export default StickySidebar;