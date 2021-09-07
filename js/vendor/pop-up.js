'use strict';

// modern Chrome requires { passive: false } when adding event
var keys = {37: 1, 38: 1, 39: 1, 40: 1};
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; } 
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';


function initPopUp() {
  const popUpElement = document.querySelector('.pop-ups');
  const popUpContainer = popUpElement && popUpElement.querySelector('.pop-ups__container');
  const popUpExit = popUpElement && popUpElement.querySelector('.pop-ups__exit');
  const popUpItems = popUpContainer && popUpContainer.querySelectorAll('.pop-ups__item');
  if (!(popUpContainer && popUpExit)) return;

  let clickOnBack = function(e) {
    if(e.target == popUpElement) {
      closePopUp();
    }
  }

  window.optionsPopUp = {};
  window.optionsPopUp.elemenst = {
    parent: popUpElement,
    container: popUpContainer,
    exit: popUpExit,
  }
  window.optionsPopUp.callback = {
    clickOnBack, 
  };
  window.optionsPopUp.data = {
    scrollOffset: window.innerWidth - document.documentElement.clientWidth,
  };
  window.optionsPopUp.elemenst.items = {};
  if (popUpItems) {
    for (let index = 0; index < popUpItems.length; index++) {
      const item = popUpItems[index];
      let id = item.getAttribute('data-id-pop-up');
      if (id !== undefined) {
        window.optionsPopUp.elemenst.items[id] = item;
      } 
    }
  }

  // openPopUp();
  popUpExit.addEventListener('click', closePopUp);
  popUpElement.addEventListener('click', clickOnBack);
}
initPopUp();

function openPopUp(popUpOrId) {
  let elementPopUp;
  if (typeof popUpOrId == 'string' || typeof popUpOrId == 'number') {
    elementPopUp = window.optionsPopUp.elemenst.items[popUpOrId];
    // console.log(popUpOrId);
  } else {
    elementPopUp = popUpOrId;
  }
  if(!elementPopUp) return;

  elementPopUp.classList.add('pop-ups--open');
  window.optionsPopUp.elemenst.parent.classList.add('pop-ups--open');
  hiddenScroll();
}

function closePopUp() {
  let item = window.optionsPopUp.elemenst.container.querySelector('.pop-ups--open');
  if (item) item.classList.remove('pop-ups--open');
  window.optionsPopUp.elemenst.parent.classList.remove('pop-ups--open');
  visibleScroll();
}

function togglePopUp(popUp) {
  
}


// openPopUp();


function hiddenScroll() {
  document.documentElement.style.overflowY="hidden";
  document.documentElement.classList.add('scroll-hidden');
  if (window.optionsPopUp.data.scrollOffset > 0) {
    let allSections = document.querySelectorAll('body > *');
    for (let index = 0; index < allSections.length; index++) {
      const section = allSections[index];
      if (section == window.optionsPopUp.elemenst.parent) continue;

      let prevPaddingRight = getComputedStyle(section, null).getPropertyValue('padding-right');
      let matchPR = prevPaddingRight.match(/\d+/); 
      if (matchPR) prevPaddingRight =  Number(matchPR[0]); 

      // section.style.paddingRight = (window.optionsPopUp.data.scrollOffset + prevPaddingRight) + 'px';
      section.style.marginRight = window.optionsPopUp.data.scrollOffset + 'px';
      section.setAttribute('data-pop-up-pr', prevPaddingRight);
    }
  }
}

function visibleScroll() {
  document.documentElement.style.overflowY="auto";
  document.documentElement.classList.remove('scroll-hidden');
  if (window.optionsPopUp.data.scrollOffset > 0) {
    let allSections = document.querySelectorAll('body > *');
    for (let index = 0; index < allSections.length; index++) {
      const section = allSections[index];
      if (section == window.optionsPopUp.elemenst.parent) continue;

      // section.style.paddingRight = '';
      section.style.marginRight = '';
    }
  }
}

function toggleScroll() {
  if (document.documentElement.classList.contains('scroll-hidden')) {
    visibleScroll()
  } else {
    hiddenScroll();
  }
}