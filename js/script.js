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
  var headerMenuMainList = headerMenu && headerMenu.querySelector('.header__menu__list');
  var headerMenuSubList = headerMenu && headerMenu.querySelectorAll('.header__menu__sublist');
  var headerButton = header && header.querySelector('.header__button');

  if (headerButton && headerMenu) {
    (function () {
      headerButton.addEventListener('click', function () {
        header.classList.toggle('active-menu');
        headerButton.classList.toggle('active');
        document.documentElement.classList.toggle('scroll-hidden');
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
            console.log(parent.classList);
          };

          var clickOut = function clickOut(e) {
            setAutoHeightClick(parent, true);
            parent.querySelector('span').removeEventListener('click', clickOut);
            setTimeout(function () {
              parent.addEventListener('click', clickIn);
            }, 0);
            parent.classList.remove('active');
            console.log(parent.classList);
          };

          parent.addEventListener('click', clickIn);
        }
      };

      for (var index = 0; index < headerMenuSubList.length; index++) {
        _loop(index);
      }
    })();
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
    var _loop2 = function _loop2(index) {
      var gridWork = works[index];
      var gridWorkWrapper = gridWork.querySelector('.grid-works__wrapper');
      var gridWorkItem = gridWorkWrapper && gridWorkWrapper.querySelectorAll('.grid-works__item');
      var gridWorkNav = gridWork.querySelector('.grid-works__nav');
      var gridWorkNavWrapper = gridWorkNav && gridWorkNav.querySelector('.grid-works__nav__wrapper');
      var gridWorkNavItem = gridWorkNav && gridWorkNav.querySelectorAll('.grid-works__nav__item');
      var isotopeGridWorkWrapper = void 0;

      if (gridWorkItem) {
        var lagreDesc = function lagreDesc() {
          var maxItem = Math.floor(gridWorkWrapper.clientWidth / 400);
          var maxWidth;

          if (window.innerWidth >= 1920) {
            maxWidth = gridWorkWrapper.clientWidth / maxItem + 'px';
          } else {
            maxWidth = 'none';
          }

          for (var _index = 0; _index < gridWorkItem.length; _index++) {
            var element = gridWorkItem[_index];
            element.style.maxWidth = maxWidth;
            element.style.width = maxWidth == 'none' ? '' : maxWidth;
          }
        };

        var maxWidthItem = function maxWidthItem(num, stringClass) {
          for (var _index2 = 0; _index2 < gridWorkItem.length; _index2++) {
            var element = gridWorkItem[_index2];

            if (!stringClass && _index2 >= num) {
              element.style.display = 'none';
            }
          }
        };

        maxWidthItem(8);
        lagreDesc();
        window.addEventListener('resize', lagreDesc);

        if (gridWorkNavItem) {
          var percentPosition = true;

          if (window.innerWidth >= 1920) {
            percentPosition = false;
          }

          isotopeGridWorkWrapper = new Isotope(gridWorkWrapper, {
            itemSelector: '.grid-works__item',
            percentPosition: percentPosition
          });

          for (var _index3 = 0; _index3 < gridWorkNavItem.length; _index3++) {
            var button = gridWorkNavItem[_index3];
            button.addEventListener('click', function () {
              var thisAttrFilter = this.getAttribute('data-filter');

              if (this.classList.contains('active')) {
                thisAttrFilter = '*';
              }

              for (var _index4 = 0; _index4 < gridWorkNavItem.length; _index4++) {
                if (gridWorkNavItem[_index4] != this) {
                  gridWorkNavItem[_index4].classList.remove('active');
                }
              }

              this.classList.toggle('active');

              if (thisAttrFilter) {
                isotopeGridWorkWrapper.arrange({
                  filter: thisAttrFilter
                });
              }
            });
          }

          isotopeGridWorkWrapper.layout();
          isotopeGridWorkWrapper.on('layoutComplete', lagreDesc);
        }
      }

      if (gridWorkNavWrapper && gridWorkNavItem) {
        var widthNavWrapper = function widthNavWrapper() {
          var widthNav = gridWorkNav.clientWidth - 30;
          var widthContent = -30;
          var maxItemIn = 0;

          for (var _index5 = 0; _index5 < gridWorkNavItem.length; _index5++) {
            var _button = gridWorkNavItem[_index5];
            widthContent += _button.clientWidth + 110;
          }

          if (widthNav > widthContent) {
            gridWorkNavWrapper.style.width = widthContent + 'px';
          } else {
            gridWorkNavWrapper.style.width = 'auto';
          }
        }; // widthNavWrapper();
        // window.addEventListener('resize', widthNavWrapper);

      }
    };

    for (var index = 0; index < works.length; index++) {
      _loop2(index);
    }
  } // checkbox and radio


  var checkAndRadioInput = document.querySelectorAll('.checkbox-input, .radio-input');

  if (checkAndRadioInput) {
    for (var _index6 = 0; _index6 < checkAndRadioInput.length; _index6++) {
      var element = checkAndRadioInput[_index6];
      var child = element.parentElement.querySelector('.checkbox-input__check, .radio-input__check');

      if (!child) {
        child = document.createElement('div');
        child.classList.add(element.getAttribute('type') + "-input__check");
        element.parentElement.appendChild(child);
      }
    }
  } // autoheight Textarea


  var textareaAuto = document.querySelectorAll('.textarea--auto-height');

  if (textareaAuto) {
    for (var _index7 = 0; _index7 < textareaAuto.length; _index7++) {
      var _element = textareaAuto[_index7];

      var textarea = _element.querySelector('textarea');

      if (textarea) {
        (function () {
          var placeholder = textarea.getAttribute('placeholder') || '';
          var backgroundText = document.createElement('div');
          backgroundText.classList.add('textarea--auto-height__text');
          backgroundText.innerText = placeholder;

          _element.appendChild(backgroundText);

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
    for (var _index8 = 0; _index8 < infoCompanyTime.length; _index8++) {
      var _element2 = infoCompanyTime[_index8];
      _element2.innerText = 'с ' + workHourseStart + ':' + workMinutes + '-' + workHourseEnd + ":" + workMinutes;

      if (isNotWork) {
        var parent = _element2.closest('.info-company__time');

        parent && parent.classList.add('info-company__time--not-work');
      }
    }
  }
});