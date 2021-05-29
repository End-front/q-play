"use strict";

window.checkBrowser = {};
window.checkBrowser.supportsTouch = !!('ontouchstart' in window || navigator.maxTouchPoints);
window.checkBrowser.isIE = !!(window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1);

if (window.checkBrowser.supportsTouch) {
  document.documentElement.classList.add('touch-browser');
} else {
  document.documentElement.classList.add('courser-browser');
}

if (window.checkBrowser.isIE) {
  document.documentElement.classList.add('ie-11');
}