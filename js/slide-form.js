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
    var inputsForm = form.querySelectorAll('input, textarea');

    if (inputsForm) {
      var _loop2 = function _loop2(_index) {
        var element = inputsForm[_index];
        element.addEventListener('input', function () {
          if (this.classList.contains('invalid-input')) {
            this.classList.remove('invalid-input');
            UnmarkInvalidGrougInput(this.getAttribute('name'));
            var parent = element.closest('.input');
            parent && parent.classList.remove('invalid-input');
          }
        });
      };

      for (var _index = 0; _index < inputsForm.length; _index++) {
        _loop2(_index);
      }
    }

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

      formSlideObject.toggleActiveSlide = function (index, opt) {
        if (!opt) opt = {};
        if (typeof index != 'number') index = 0;
        if (formSlideObject.activeSlide) formSlideObject.activeSlide.classList.remove('active');
        formSlideObject.slides[index].classList.add('active');
        formSlideObject.activeSlide = formSlideObject.slides[index];
        formSlideObject.autoHeight(opt.duration !== undefined ? opt.duration : 600);
      };

      formSlideObject.setWidthSlides = function (items) {
        if (!items) items = 1;

        for (var _index2 = 0; _index2 < formSlideObject.slides.length; _index2++) {
          var slide = formSlideObject.slides[_index2];
          slide.style.width = formSlideObject.formInner.clientWidth / items + 'px';
        }
      };

      formSlideObject.setProgress = function () {
        var curentLength = slides.length;
        var notProggressSlide = formSlideObject.formInner.querySelectorAll('.slides-form__slide--not-progress');
        if (notProggressSlide) curentLength -= notProggressSlide.length;

        for (var _index3 = 0; _index3 < proggressBar.length; _index3++) {
          var element = proggressBar[_index3];
          var parent = element.closest('.slides-form__slide');
          var bar = element.querySelector('.slides-form__proggress__bar');
          var text = element.querySelector('.slide-form__proggress__text');

          if (!text) {
            text = document.createElement('div');
            text.classList.add('slide-form__proggress__text');
            element.appendChild(text);
          }

          text.innerText = _index3 + 1 + ' из ' + curentLength;

          if (bar) {
            bar.style.width = 100 / curentLength + '%';
            bar.style.transform = 'translate(' + 100 * _index3 + '%, 0)';
          }
        }
      };

      formSlideObject.isValideSlide = function (index) {
        var slide;

        if (typeof index != 'number') {
          if (formSlideObject.activeSlide) {
            slide = formSlideObject.activeSlide;
          } else {
            slide = formSlideObject.slides[0];
          }
        } else {
          slide = formSlideObject.slides[index];
        }

        var inputs = slide.querySelectorAll('input');
        var textareas = slide.querySelectorAll('textarea');
        var isValid = true;

        if (inputs) {
          for (var _index4 = 0; _index4 < inputs.length; _index4++) {
            if (!isValid) break;
            var element = inputs[_index4];
            if (element.getAttribute('type') == 'hidden' || element.getAttribute('disabled') !== null) continue;

            if (element.getAttribute('type') == 'radio' || element.getAttribute('type') == 'checkbox') {
              if (!notEmptyCheckBoxOrRadio(element.getAttribute('name'))) {
                isValid = false;
                markInvalidGrougInput(element.getAttribute('name'));
              }
            } else {
              if (element.value == '') {
                isValid = false;
                element.classList.add('invalid-input');
                var parent = element.closest('.input');
                parent && parent.classList.add('invalid-input');
              }
            }
          }
        }

        if (textareas) {
          for (var _index5 = 0; _index5 < textareas.length; _index5++) {
            if (!isValid) break;
            var _element = textareas[_index5];

            if (_element.value == '') {
              isValid = false;

              _element.classList.add('invalid-input');

              var _parent = _element.closest('.input');

              _parent && _parent.classList.add('invalid-input');
            }
          }
        }

        return isValid;
      };

      formSlideObject.autoHeight = function (duration) {
        if (typeof duration != 'number') duration = 600;
        if (!formSlideObject.activeSlide) formSlideObject.toggleActiveSlide();
        var prevHeight = formSlideObject.formOuter.clientHeight;
        var newHeight = formSlideObject.activeSlide.clientHeight;
        var differenceHeight = newHeight - prevHeight; // formSlideObject.formOuter.style.height =  height + 'px';

        var start = null;

        if (duration == 0) {
          formSlideObject.formOuter.style.height = prevHeight + differenceHeight + 'px';
          return;
        }

        requestAnimFrame(function scroll(time) {
          if (start === null) start = time;
          var timeFraction = (time - start) / duration;

          if (timeFraction > 1) {
            timeFraction = 1;
          }

          var progress = Math.sin(timeFraction * Math.PI / 2);
          formSlideObject.formOuter.style.height = prevHeight + differenceHeight * progress + 'px';

          if (timeFraction < 1) {
            requestAnimFrame(scroll);
          }
        });
      };

      formSlideObject.translateForm = function (index) {
        if (typeof index != 'number' || index < 0) return;
        formSlideObject.formOuter.style.transform = 'translate(' + -1 * formSlideObject.formInner.clientWidth * index + 'px, 0px)';
        formSlideObject.toggleActiveSlide(index);
        smoothScrollToCoords(document.documentElement, {
          listenChange: false,
          duration: 600
        });
      };

      formSlideObject.initSlides = function (items) {
        if (!items) items = 1;
        formSlideObject.toggleActiveSlide(0, {
          duration: 0
        });

        for (var _index6 = 0; _index6 < formSlideObject.slides.length; _index6++) {
          var slide = formSlideObject.slides[_index6];
          slide.setAttribute('data-index', _index6);
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

        var _loop3 = function _loop3(_index7) {
          var element = formSlideObject.buttonsPrev[_index7];
          element.addEventListener('click', function (e) {
            e.preventDefault();
            var parent = element.closest('.slides-form__slide');
            formSlideObject.translateForm(Number(parent.getAttribute('data-index')) - 1);
          });
        };

        for (var _index7 = 0; _index7 < formSlideObject.buttonsPrev.length; _index7++) {
          _loop3(_index7);
        }

        var _loop4 = function _loop4(_index8) {
          var element = formSlideObject.buttonsNext[_index8];
          element.addEventListener('click', function (e) {
            e.preventDefault();

            if (formSlideObject.isValideSlide()) {
              var parent = element.closest('.slides-form__slide');
              formSlideObject.translateForm(Number(parent.getAttribute('data-index')) + 1);
            }
          });
        };

        for (var _index8 = 0; _index8 < formSlideObject.buttonsNext.length; _index8++) {
          _loop4(_index8);
        }
      };

      formSlideObject.initForm();
      document.addEventListener('DOMContentLoaded', function () {
        formSlideObject.autoHeight();
        form.classList.add('loaded');
      });
      window.addEventListener('load', function () {
        formSlideObject.autoHeight();
      });
    }
  };

  for (var index = 0; index < slideForm.length; index++) {
    _loop(index);
  }
}

function notEmptyCheckBoxOrRadio(nameGroup) {
  return document.querySelectorAll('input[name=' + nameGroup + ']:checked').length > 0;
}

function markInvalidGrougInput(nameGroup) {
  var inputs = document.querySelectorAll('input[name=' + nameGroup + ']');

  if (inputs) {
    for (var _index9 = 0; _index9 < inputs.length; _index9++) {
      var element = inputs[_index9];
      element.classList.add('invalid-input');
      var parent = element.closest('.radio-input__label, .checkbox-input__label');

      if (parent) {
        parent.classList.add('invalid-input');
      }
    }
  }
}

function UnmarkInvalidGrougInput(nameGroup) {
  var inputs = document.querySelectorAll('input[name=' + nameGroup + ']');

  if (inputs) {
    for (var _index10 = 0; _index10 < inputs.length; _index10++) {
      var element = inputs[_index10];
      element.classList.remove('invalid-input');
      var parent = element.closest('.radio-input__label, .checkbox-input__label');

      if (parent) {
        parent.classList.remove('invalid-input');
      }
    }
  }
}