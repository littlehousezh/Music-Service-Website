/**
 * 
 * @param {Element} element element
 * @param {} to 
 * @param {Number} duration duration
 */
export function scrollTo(element, to, duration) {
  // Current playing time
  if (duration <= 0) return;
  // Target - current distance of the curl top
  var difference = to - element.scrollTop;
  var perTick = difference / duration * 10;

  setTimeout(function() {
      element.scrollTop = element.scrollTop + perTick;
      if (element.scrollTop === to) return;
      scrollTo(element, to, duration - 10);
  }, 10);
}