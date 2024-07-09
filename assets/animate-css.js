const animateCSS = function ($el, animationName, callback) {
  $el.addClass('animated')
  $el.addClass(animationName)

  function handleAnimationEnd() {
      $el.removeClass('animated')
      $el.removeClass(animationName)
      $el.off('animationend', handleAnimationEnd)

      if (typeof callback === 'function') callback()
  }

  $el.on('animationend', handleAnimationEnd)
}