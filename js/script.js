"use strict";

window.requestAnimFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    window.setTimeout(callback, 16.666);
  };
}();

document.addEventListener('DOMContentLoaded', function () {
  // menu
  var header = document.querySelector('.header');
  var headerMenu = header && header.querySelector('.header__menu');
  var headerButton = header && header.querySelector('.header__button');

  if (headerButton && headerMenu) {
    headerButton.addEventListener('click', function () {
      header.classList.toggle('active-menu');
      headerButton.classList.toggle('active');
    });
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
  } // checkbox and radio


  var checkAndRadioInput = document.querySelectorAll('.checkbox-input, .radio-input');

  if (checkAndRadioInput) {
    for (var index = 0; index < checkAndRadioInput.length; index++) {
      var element = checkAndRadioInput[index];
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
    for (var _index = 0; _index < textareaAuto.length; _index++) {
      var _element = textareaAuto[_index];

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
    for (var _index2 = 0; _index2 < infoCompanyTime.length; _index2++) {
      var _element2 = infoCompanyTime[_index2];
      _element2.innerText = 'с ' + workHourseStart + ':' + workMinutes + '-' + workHourseEnd + ":" + workMinutes;

      if (isNotWork) {
        var parent = _element2.closest('.info-company__time');

        parent && parent.classList.add('info-company__time--not-work');
      }
    }
  }
});