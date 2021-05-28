"use strict";

window.requestAnimFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 16.666);
  };
}();

var slideForm = document.querySelectorAll('.slides-form');

if (slideForm) {
  var _loop = function _loop(index) {
    var form = slideForm[index];
    var formInner = form.querySelector('.slides-form__inner');
    var formOuter = form.querySelector('.slides-form__outer');
    var slides = form.querySelectorAll('.slides-form__slide');
    var buttonsPrev = form.querySelectorAll('.slides-form__prev');
    var buttonsNext = form.querySelectorAll('.slides-form__next');
    var proggressBar = form.querySelectorAll('.slides-form__proggress');

    if (formInner && formOuter && slides && buttonsPrev && buttonsNext && proggressBar) {
      var formSlideObject = form.slidesForm = {
        formInner: formInner,
        formOuter: formOuter,
        slides: slides,
        buttonsPrev: buttonsPrev,
        buttonsNext: buttonsNext,
        proggressBar: proggressBar,
        activeSlide: false
      };

      formSlideObject.toggleActiveSlide = function (index) {
        if (typeof index != 'number') index = 0;
        formSlideObject.slides[index].classList.add('active');
        if (formSlideObject.activeSlide) formSlideObject.activeSlide.classList.remove('active');
        formSlideObject.activeSlide = formSlideObject.slides[index];
        formSlideObject.autoHeight();
      };

      formSlideObject.setWidthSlides = function (items) {
        if (!items) items = 1;

        for (var _index = 0; _index < formSlideObject.slides.length; _index++) {
          var slide = formSlideObject.slides[_index];
          slide.style.width = formSlideObject.formInner.clientWidth / items + 'px';
        }
      };

      formSlideObject.setProgress = function () {
        var curentLength = slides.length;
        var notProggressSlide = formSlideObject.formInner.querySelectorAll('.slides-form__slide--not-progress');
        if (notProggressSlide) curentLength -= notProggressSlide.length;

        for (var _index2 = 0; _index2 < proggressBar.length; _index2++) {
          var element = proggressBar[_index2];
          var parent = element.closest('.slides-form__slide');
          var bar = element.querySelector('.slides-form__proggress__bar');
          var text = element.querySelector('.slide-form__proggress__text');

          if (!text) {
            text = document.createElement('div');
            text.classList.add('slide-form__proggress__text');
            element.appendChild(text);
          }

          text.innerText = _index2 + 1 + ' из ' + curentLength;

          if (bar) {
            bar.style.width = 100 / curentLength + '%';
            bar.style.transform = 'translate(' + 100 * _index2 + '%, 0)';
          }
        }
      };

      formSlideObject.autoHeight = function () {
        if (!formSlideObject.activeSlide) formSlideObject.toggleActiveSlide();
        console.log(formSlideObject.activeSlide.offsetHeight);
        formSlideObject.formOuter.style.height = formSlideObject.activeSlide.offsetHeight + 'px';
      };

      formSlideObject.translateForm = function (index) {
        if (typeof index != 'number' || index < 0) return;
        formSlideObject.formOuter.style.transform = 'translate(' + -1 * formSlideObject.formInner.clientWidth * index + 'px, 0px)';
        formSlideObject.toggleActiveSlide(index);
        smoothScrollToCoords(document.documentElement, {
          listenChange: false,
          duration: 400
        });
      };

      formSlideObject.initSlides = function (items) {
        if (!items) items = 1;
        formSlideObject.toggleActiveSlide();

        for (var _index3 = 0; _index3 < formSlideObject.slides.length; _index3++) {
          var slide = formSlideObject.slides[_index3];
          slide.setAttribute('data-index', _index3);
          slide.style.width = formSlideObject.formInner.clientWidth / items + 'px';
        }

        window.addEventListener('resize', function () {
          formSlideObject.setWidthSlides();
          formSlideObject.autoHeight();
        });
        formSlideObject.setProgress();
      };

      formSlideObject.initForm = function () {
        formSlideObject.initSlides();

        var _loop2 = function _loop2(_index4) {
          var element = formSlideObject.buttonsPrev[_index4];
          element.addEventListener('click', function (e) {
            e.preventDefault();
            var parent = element.closest('.slides-form__slide');
            formSlideObject.translateForm(Number(parent.getAttribute('data-index')) - 1);
          });
        };

        for (var _index4 = 0; _index4 < formSlideObject.buttonsPrev.length; _index4++) {
          _loop2(_index4);
        }

        var _loop3 = function _loop3(_index5) {
          var element = formSlideObject.buttonsNext[_index5];
          element.addEventListener('click', function (e) {
            e.preventDefault();
            var parent = element.closest('.slides-form__slide');
            formSlideObject.translateForm(Number(parent.getAttribute('data-index')) + 1);
          });
        };

        for (var _index5 = 0; _index5 < formSlideObject.buttonsNext.length; _index5++) {
          _loop3(_index5);
        }
      };

      formSlideObject.initForm();
      document.addEventListener('DOMContentLoaded', function () {
        formSlideObject.initForm();
        form.classList.add('loaded');
      });
      window.addEventListener('load', function () {
        formSlideObject.initForm();
      });
    }
  };

  for (var index = 0; index < slideForm.length; index++) {
    _loop(index);
  }
}