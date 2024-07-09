function removeEmptyChildrenRecursively($el) {
  if ($el.children().length) {
    $el.children().each(function(i, child) {
      removeEmptyChildrenRecursively($(child));
    }.bind(this));
  }
  if($.trim($el.text()) === "") {
    $el.remove();
  }
}



// Apply a specific class to the html element for browser support of cookies.
if (cookiesEnabled()) {
  document.documentElement.className = document.documentElement.className.replace(
    'supports-no-cookies',
    'supports-cookies',
  );
}



setTimeout(function() {
  console.log(`
=====================================================================

                    Theme designed & coded by

        █   ▄▀▀▄ █  █ █▀▀▄ ▄▀▀▄   █▀▀▄ █▀▀▄ ▄▀▀▄ █   █ █▀▀▄
        █   █▄▄█ █  █ █▄▄▀ █▄▄█   █▀▀▄ █▄▄▀ █  █ █ ▄ █ █  █
        █▄▄ █  █ ▀▄▄▀ █  █ █  █   █▄▄▀ █ ▀▄ ▀▄▄▀ ▀▄▀▄▀ █  █

                        www.laurabrown.studio

=====================================================================
`);
}, 1000)