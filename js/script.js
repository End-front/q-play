"use strict";

window.requestAnimFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 16.666);
  };
}();

ibg();

function ibg() {
  var ibg = document.querySelectorAll(".ibg");

  for (var i = 0; i < ibg.length; i++) {
    if (ibg[i].querySelector('.ibg__img, img')) {
      ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('.ibg__img, img').getAttribute('src') + ')';
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // menu
  var header = document.querySelector('.header');
  var headerMenu = header && header.querySelector('.header__menu');
  var headerMenuOuter = header && header.querySelector('.header__menu__outer');
  var headerMenuMainList = headerMenu && headerMenu.querySelector('.header__menu__list');
  var headerMenuSubList = headerMenu && headerMenu.querySelectorAll('.header__menu__sublist');
  var headerButton = header && header.querySelector('.header__button');

  if (headerButton && headerMenu) {
    (function () {
      headerButton.addEventListener('click', function () {
        header.classList.toggle('active-menu');
        headerButton.classList.toggle('active');
        document.documentElement.classList.toggle('scroll-hidden');

        if (headerMenuOuter) {
          setTimeout(function () {
            headerMenuOuter.classList.remove('header__menu__outer--lid');
          }, 300);
        }
      });

      var setMaxWidthSubMenu = function setMaxWidthSubMenu() {
        var width = headerMenu.offsetWidth / 2 - headerMenuMainList.offsetWidth / 2 - 15;

        for (var index = 0; index < headerMenuSubList.length; index++) {
          var element = headerMenuSubList[index];
          var parent = element.closest('li');

          if (window.checkBrowser.supportsTouch) {
            width += headerMenuMainList.offsetWidth;
          } else {
            width += headerMenuMainList.offsetWidth - parent.offsetWidth;
          }

          element.style.maxWidth = width + 'px';
        }
      };

      var setAutoHeight = function setAutoHeight(item, reverse) {
        var submenu = item.querySelector('.header__menu__sublist');
        var prevHeight = item.children[0].offsetHeight;
        var newHeight = submenu && submenu.offsetHeight;
        var differenceHeight = newHeight - prevHeight;
        if (differenceHeight == 0) return item.style.height = prevHeight + 'px';

        if (reverse) {
          prevHeight = item.offsetHeight;
          newHeight = item.children[0].offsetHeight;
          differenceHeight = newHeight - prevHeight;
        }

        var start = null;
        requestAnimFrame(function height(time) {
          if (start === null) start = time;
          var timeFraction = (time - start) / 350;

          if (timeFraction > 1) {
            timeFraction = 1;
          }

          var progress = Math.sin(timeFraction * Math.PI / 2); // let progress = timeFraction;

          item.style.height = prevHeight + differenceHeight * progress + 'px';

          if (timeFraction < 1) {
            requestAnimFrame(height);
          }
        });
      };

      var setAutoHeightClick = function setAutoHeightClick(item, reverse) {
        var submenu = item.querySelector('.header__menu__sublist');
        var prevHeight = item.offsetHeight;
        var newHeight;

        if (!reverse) {
          newHeight = item.children[0].offsetHeight + submenu.offsetHeight;
        } else {
          newHeight = item.children[0].offsetHeight;
        }

        var differenceHeight = newHeight - prevHeight;
        if (differenceHeight == 0) return item.style.height = prevHeight + 'px';
        var start = null;
        requestAnimFrame(function height(time) {
          if (start === null) start = time;
          var timeFraction = (time - start) / 350;

          if (timeFraction > 1) {
            timeFraction = 1;
          }

          var progress = Math.sin(timeFraction * Math.PI / 2); // let progress = timeFraction;

          item.style.height = prevHeight + differenceHeight * progress + 'px';

          if (timeFraction < 1) {
            requestAnimFrame(height);
          }
        });
      };

      setMaxWidthSubMenu();
      window.addEventListener('resize', function () {
        setMaxWidthSubMenu();
      });

      var _loop = function _loop(index) {
        var subList = headerMenuSubList[index];
        var parent = subList.closest('li');

        if (!window.checkBrowser.supportsTouch) {
          var mouseOut = function mouseOut(e) {
            setAutoHeight(parent, true);
          };

          var mouseIn = function mouseIn(e) {
            setAutoHeight(parent);
          };

          parent.addEventListener('mouseover', mouseIn, {
            once: true
          });
          parent.addEventListener('mouseout', function (e) {
            var eventItem = e.relatedTarget.closest('.header__menu__list-item');

            if (eventItem && eventItem == parent) {
              return;
            }

            mouseOut();
            parent.addEventListener('mouseover', mouseIn, {
              once: true
            });
          });
        } else {
          var clickIn = function clickIn(e) {
            setAutoHeightClick(parent);
            parent.removeEventListener('click', clickIn);
            parent.querySelector('span').addEventListener('click', clickOut);
            parent.classList.add('active');
          };

          var clickOut = function clickOut(e) {
            setAutoHeightClick(parent, true);
            parent.querySelector('span').removeEventListener('click', clickOut);
            setTimeout(function () {
              parent.addEventListener('click', clickIn);
            }, 0);
            parent.classList.remove('active');
          };

          parent.addEventListener('click', clickIn);
        }
      };

      for (var index = 0; index < headerMenuSubList.length; index++) {
        _loop(index);
      }
    })();
  }

  var btnCall = document.querySelectorAll('.btn-icon--phone');

  if (btnCall && headerMenuOuter) {
    for (var index = 0; index < btnCall.length; index++) {
      var element = btnCall[index];
      element.addEventListener('click', function () {
        headerMenuOuter.classList.add('header__menu__outer--lid');
        header.classList.add('active-menu');
        headerButton.classList.add('active');
        document.documentElement.classList.add('scroll-hidden');
      });
    }
  } //courser


  var courser = document.querySelector('#courser');
  var courserChild = courser && courser.querySelector('.courser');

  if (courser && courserChild && !window.checkBrowser.supportsTouch && !window.checkBrowser.isIE) {
    var positionForCourse = function positionForCourse(event) {
      if (!event) return {
        x: 0,
        y: 0
      };
      var x = event.clientX - courserChild.clientWidth / 2;
      var y = event.clientY - courserChild.clientHeight / 2;
      return {
        x: x,
        y: y
      };
    };

    var courserSet = function courserSet(position) {
      requestAnimFrame(function () {
        courserChild.style.transform = 'translate(' + position.x + 'px,' + position.y + 'px)';
        courserSet(positionForCourse(window.dataForCourser));
      });
    };

    courserSet(positionForCourse(window.dataForCourser));
    document.documentElement.addEventListener('mouseover', function () {
      courser.classList.add('visible');
    });
    window.addEventListener('mousemove', function (e) {
      window.dataForCourser = e;
    });
    document.documentElement.addEventListener('mouseout', function () {
      courser.classList.remove('visible');
    });
  } //works


  var works = document.querySelectorAll('.grid-works');

  if (works) {
    var _loop2 = function _loop2(_index) {
      var gridWork = works[_index];
      var gridWorkWrapper = gridWork.querySelector('.grid-works__wrapper');
      var gridWorkSlides = gridWorkWrapper && gridWorkWrapper.querySelectorAll('.grid-works__slide');
      var gridWorkItem = gridWorkWrapper && gridWorkWrapper.querySelectorAll('.grid-works__item');
      var gridWorkNav = gridWork.querySelector('.grid-works__nav');
      var gridWorkNavWrapper = gridWorkNav && gridWorkNav.querySelector('.grid-works__nav__wrapper');
      var gridWorkNavItem = gridWorkNav && gridWorkNav.querySelectorAll('.grid-works__nav__item');
      var isotopeGridWorkWrapper = void 0;

      if (gridWorkItem && !gridWorkSlides) {
        var lagreDesc = function lagreDesc() {
          var maxItem = Math.floor(gridWorkWrapper.clientWidth / 400);
          var maxWidth;

          if (window.innerWidth >= 1920) {
            maxWidth = gridWorkWrapper.clientWidth / maxItem + 'px';
          } else {
            maxWidth = 'none';
          }

          for (var _index2 = 0; _index2 < gridWorkItem.length; _index2++) {
            var _element = gridWorkItem[_index2];
            _element.style.maxWidth = maxWidth;
          }
        };

        lagreDesc();
        window.addEventListener('resize', lagreDesc);
      }

      if (gridWorkSlides) {
        var _loop3 = function _loop3(_index3) {
          var slide = gridWorkSlides[_index3];
          var isBig = slide.classList.contains('grid-works__slide--big');
          var items = slide.querySelectorAll('.grid-works__item');

          var lagreDesc = function lagreDesc() {
            if (!items) return;
            var maxItem = Math.floor(gridWorkWrapper.clientWidth / 400);

            if (isBig) {
              maxItem = Math.floor(gridWorkWrapper.clientWidth / 585);
              console.log(maxItem);
            }

            var maxWidth;

            if (window.innerWidth >= 1920) {
              maxWidth = gridWorkWrapper.clientWidth / maxItem + 'px';
            } else {
              maxWidth = 'none';
            }

            for (var _index4 = 0; _index4 < items.length; _index4++) {
              var _element2 = items[_index4];
              _element2.style.maxWidth = maxWidth;
            }
          };

          lagreDesc();
          window.addEventListener('resize', lagreDesc);
        };

        for (var _index3 = 0; _index3 < gridWorkSlides.length; _index3++) {
          _loop3(_index3);
        }
      }

      if (gridWorkSlides && gridWorkNavItem) {
        (function () {
          var allSlideItem = 0;
          var mainAllSlide;
          var activeSlide;

          var autoheight = function autoheight(slide) {
            gridWorkWrapper.style.height = slide.offsetHeight + "px";
          };

          var _loop4 = function _loop4(_index5) {
            var button = gridWorkNavItem[_index5 - allSlideItem];
            var slide = gridWorkSlides[_index5];

            if (slide && button) {
              if (slide.getAttribute('data-slide') == 'all') {
                allSlideItem++;
                mainAllSlide = slide;
                autoheight(mainAllSlide);
                mainAllSlide.classList.add('active');
                return "continue";
              }

              button.addEventListener('click', function () {
                for (var _index6 = 0; _index6 < gridWorkNavItem.length; _index6++) {
                  if (gridWorkNavItem[_index6] != this) {
                    gridWorkNavItem[_index6].classList.remove('active');
                  }
                }

                for (var _index7 = 0; _index7 < gridWorkSlides.length; _index7++) {
                  if (gridWorkSlides[_index7] != slide) {
                    gridWorkSlides[_index7].classList.remove('active');
                  }
                }

                if (slide.classList.contains('active')) {
                  slide.classList.remove('active');
                  mainAllSlide && mainAllSlide.classList.add('active');
                  activeSlide = mainAllSlide;
                  autoheight(mainAllSlide);
                } else {
                  slide.classList.add('active');
                  activeSlide = slide;
                  autoheight(slide);
                }

                this.classList.toggle('active');
              });
            }
          };

          for (var _index5 = 0; _index5 <= gridWorkNavItem.length; _index5++) {
            var _ret = _loop4(_index5);

            if (_ret === "continue") continue;
          }

          if (activeSlide || mainAllSlide) {
            window.addEventListener('resize', function () {
              autoheight(activeSlide || mainAllSlide);
            });
            window.addEventListener('load', function () {
              autoheight(activeSlide || mainAllSlide);
            });
          }

          gridWork.classList.add('loaded-slider');
        })();
      }

      if (gridWorkNavWrapper && gridWorkNavItem) {
        var widthNavWrapper = function widthNavWrapper() {
          var widthNav = gridWorkNav.clientWidth - 30;
          var widthContent = -30;
          var maxItemIn = 0;

          for (var _index8 = 0; _index8 < gridWorkNavItem.length; _index8++) {
            var button = gridWorkNavItem[_index8];
            widthContent += button.clientWidth + 110;
          }

          if (widthNav > widthContent) {
            gridWorkNavWrapper.style.width = widthContent + 'px';
          } else {
            gridWorkNavWrapper.style.width = 'auto';
          }
        }; // widthNavWrapper();
        // window.addEventListener('resize', widthNavWrapper);

      }

      if (gridWork.classList.contains('grid-works--not-link-item') && gridWorkItem) {
        for (var _index9 = 0; _index9 < gridWorkItem.length; _index9++) {
          var item = gridWorkItem[_index9];
          item.addEventListener('click', function (e) {
            e.preventDefault();
          });
        }
      }
    };

    for (var _index = 0; _index < works.length; _index++) {
      _loop2(_index);
    }
  } // checkbox and radio


  var checkAndRadioInput = document.querySelectorAll('.checkbox-input, .radio-input');

  if (checkAndRadioInput) {
    for (var _index10 = 0; _index10 < checkAndRadioInput.length; _index10++) {
      var _element3 = checkAndRadioInput[_index10];

      var child = _element3.parentElement.querySelector('.checkbox-input__check, .radio-input__check');

      if (!child) {
        child = document.createElement('div');
        child.classList.add(_element3.getAttribute('type') + "-input__check");

        _element3.parentElement.appendChild(child);
      }
    }
  } // autoheight Textarea


  var textareaAuto = document.querySelectorAll('.textarea--auto-height');

  if (textareaAuto) {
    for (var _index11 = 0; _index11 < textareaAuto.length; _index11++) {
      var _element4 = textareaAuto[_index11];

      var textarea = _element4.querySelector('textarea');

      if (textarea) {
        (function () {
          var placeholder = textarea.getAttribute('placeholder') || '';
          var backgroundText = document.createElement('div');
          backgroundText.classList.add('textarea--auto-height__text');
          backgroundText.innerText = placeholder;

          _element4.appendChild(backgroundText);

          textarea.addEventListener('input', function () {
            var value = this.value;

            if (value[value.length - 1] == '\n') {
              value = value + '1';
            }

            if (value.length == 0) {
              value = placeholder;
            }

            backgroundText.innerText = value;
          });
        })();
      }
    }
  } // info-company 


  var timeStartWorkMSK = 9;
  var timeEndWorkMSK = 17;
  var dateUser = new Date();
  var offsetTimeUser = dateUser.getTimezoneOffset() * -1 - 180;
  var offsetHourseUser = Math.floor(offsetTimeUser / 60);
  var offsetMinutesUser = Math.floor((offsetTimeUser - offsetHourseUser * 60) / 5);
  var workHourseStart = timeStartWorkMSK + offsetHourseUser;
  if (workHourseStart > 24) workHourseStart -= 24;
  if (workHourseStart < 0) workHourseStart = 24 + workHourseStart;
  var workHourseEnd = timeEndWorkMSK + offsetHourseUser;
  if (workHourseEnd > 24) workHourseEnd -= 24;
  if (workHourseEnd < 0) workHourseEnd = 24 + workHourseEnd;
  var workMinutes = offsetMinutesUser.toString();

  if (workMinutes.length == 1) {
    workMinutes = '0' + workMinutes;
  } //TODO: Возможность минуты ставить


  workMinutes = '00';
  var infoCompanyTime = document.querySelectorAll('.info-company__time__not-work');
  var isNotWork = false;

  if (dateUser.getHours() >= workHourseEnd || dateUser.getHours() < workHourseStart) {
    isNotWork = true; //TODO: Доделать с минутами
  }

  if (infoCompanyTime) {
    for (var _index12 = 0; _index12 < infoCompanyTime.length; _index12++) {
      var _element5 = infoCompanyTime[_index12];
      _element5.innerText = 'с ' + workHourseStart + ':' + workMinutes + '-' + workHourseEnd + ":" + workMinutes;

      if (isNotWork) {
        var parent = _element5.closest('.info-company__time');

        parent && parent.classList.add('info-company__time--not-work');
      }
    }
  } // section


  var sectionBackgroundGradient = document.querySelectorAll('.section--back-gradient');

  var _loop5 = function _loop5(_index13) {
    var section = sectionBackgroundGradient[_index13];
    canvas = document.createElement('canvas');
    canvas.width = '2';
    canvas.height = '2';
    section.appendChild(canvas);
    ctx = canvas.getContext('2d');

    var Pixel = function Pixel(x, y) {
      this.x = x;
      this.y = y;
      this.hue = Math.floor(Math.random() * 360);
      var direction = Math.random() > 0.5 ? -1 : 1;
      this.velocity = (Math.random() * 30 + 20) * 0.01 * direction;
    };

    Pixel.prototype.update = function () {
      this.hue += this.velocity;
    };

    Pixel.prototype.render = function (ctx) {
      var hue = Math.round(this.hue);
      ctx.fillStyle = 'hsl(' + hue + ', 100%, 50% )';
      ctx.fillRect(this.x, this.y, 1, 1);
    };

    pixels = [new Pixel(0, 0), new Pixel(1, 0), new Pixel(0, 1), new Pixel(1, 1)];

    var animate = function animate() {
      pixels.forEach(function (pixel) {
        pixel.update();
        pixel.render(ctx);
      });
      requestAnimationFrame(animate);
    };

    animate();
    section.classList.add('loaded');
  };

  for (var _index13 = 0; _index13 < sectionBackgroundGradient.length; _index13++) {
    var canvas;
    var ctx;
    var pixels;

    _loop5(_index13);
  }
});