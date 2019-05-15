import $ from 'jquery'
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

export default function formatSections(container, selectors, classes) {
  var $originalDescription = $(selectors.originalDescription, $(container))
  var $headingsBar = $(selectors.headingsBar, $(container))
  var $textsContainer = $(selectors.textsContainer, $(container))
  $('h1, h2, h3', $originalDescription).replaceWith(function() {
    return `<h3 class="${classes.sectionHeading}"><span>` + this.innerHTML + '</span></h3>';
  });
  var $headings = $(selectors.sectionHeading, $(container))
  var $sectionTexts = $($headings.map(function(i) {
    var $contents;
    if (i < $headings.length - 1 ) {
      $contents = $(this).nextUntil($headings)
    } else {
      $contents = $(this).nextUntil()
    }
    return $contents.wrapAll(`<div class="${ classes.sectionText }" />`).parent().get();
  })).hide();
  $headingsBar.append($headings);
  $textsContainer.append($sectionTexts);
  $originalDescription.remove();

  removeEmptyChildrenRecursively($(selectors.description, container));
}