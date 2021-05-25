"use strict";

window.requestAnimFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 16.666);
  };
}();

document.addEventListener('DOMContentLoaded', function () {
  //courser
  var courser = document.querySelector('#courser');
  var courserChild = courser && courser.querySelector('.courser');

  if (courser && courserChild) {
    var positionForCourse = function positionForCourse(event) {
      var x = event.pageX - courserChild.clientWidth / 2;
      var y = event.pageY - courserChild.clientHeight / 2;
      return {
        x: x,
        y: y
      };
    };

    var loop = function loop(position) {
      requestAnimFrame(function () {
        courserChild.style.transform = 'translate(' + position.x + 'px,' + position.y + 'px)';
      });
    };

    document.documentElement.addEventListener('mouseover', function () {
      requestAnimFrame(function () {
        courser.classList.add('visible');
      });
    });
    document.documentElement.addEventListener('mousemove', function (e) {
      var eventData = e;
      loop(positionForCourse(e));
    });
    document.documentElement.addEventListener('mouseout', function () {
      requestAnimFrame(function () {
        courser.classList.remove('visible');
      });
    });
  }
});