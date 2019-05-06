export default function animateCSS($el, animationName, callback) {
  $el.addClass('animated')
  $el.addClass(animationName)
      console.log('animation begin')

  function handleAnimationEnd() {
      console.log('animation end')
      $el.removeClass('animated')
      $el.removeClass(animationName)
      $el.off('animationend', handleAnimationEnd)

      if (typeof callback === 'function') callback()
  }

  $el.on('animationend', handleAnimationEnd)
}