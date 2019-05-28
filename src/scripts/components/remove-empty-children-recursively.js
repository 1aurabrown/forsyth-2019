export default function removeEmptyChildrenRecursively($el) {
  if ($el.children().length) {
    $el.children().each(function(i, child) {
      removeEmptyChildrenRecursively($(child));
    }.bind(this));
  }
  if($.trim($el.text()) === "") {
    $el.remove();
  }
}