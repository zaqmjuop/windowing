'use strict';

import isUri from 'is-url';

const getMouseButton = (event) => {
  if (!event || (event instanceof MouseEvent)) return false;
  const isIE = (navigator.appName === 'Microsoft Internet Explorer');
  let button = 'right';
  switch (event.button) {
    case 0:
      button = 'left';
      break;
    case 1:
      button = (isIE) ? 'left' : 'middle';
      break;
    case 4:
      button = 'middle';
      break;
    default:
      button = 'right';
      break;
  }
  return button;
};

const isAliveElement = element => (element && element.nodeType === 1 && $(element).parent('html'));

const isEnterKey = event => (event.keyCode === 13);

const resetIframeHeight = () => {
  $('iframe').each((index, element) => {
    if (!element) { return; }
    let height = $(element).attr('height') || '';
    const perHeight = height.match(/\d+%$/);
    if (!perHeight) { return; }
    const per = parseInt(perHeight, 10);
    height = $(element).parent().height() * (per / 100);
    $(element).css('height', `${height}px`);
  });
};

const initIframe = (iframe) => {
  if (!iframe) return false;
  const parent = $(iframe).parent()[0];
  $(parent).children().each((index, element) => {
    if (element.tagName !== 'IFRAME') {
      parent.removeChild(element);
    }
  });
  $(iframe).removeClass('hide');
  resetIframeHeight();
  return iframe;
};

const newPage = (option) => {
  const loadingIcon = $('<i>').addClass('fa fa-spinner fa-pulse loading fa-2x');
  const loading = $('<div>').addClass('absolute-center').append(loadingIcon); // 加载图标

  const page = $('<iframe>')
    .attr('src', (option.url || ''))
    .attr('width', '100%')
    .attr('height', '100%')
    .addClass('page')
    .addClass('hide');
  $(page).on('load', () => {
    initIframe(page);
  });
  const holder = $('<div>').addClass('iframe-holder');

  holder.append(loading).append(page);

  return holder;
};

const formatURL = (val) => {
  if ((!val) || (typeof val !== 'string')) return false;
  const hasPrefix = val.match(/^http[s]?:[/]{2}/);
  if (!hasPrefix) {
    return `http://${val}`;
  }
  return val;
};

const validateURL = (val) => {
  if (!isUri) throw new Error('isUri 未能成功加载');
  return (isUri(val) ? val : undefined);
};

const entranceSumit = (entrance) => {
  if (!entrance) return false;
  if (!$(entrance).hasClass('entrance')) return false;
  const input = $(entrance).find('input[type=text]')[0];
  if ((!input) || (!input.value)) return false;
  const val = $(input).val();
  const url = validateURL(formatURL(val)) || `https://www.baidu.com/s?ie=UTF-8&wd=${val}`;
  const page = newPage({ url });
  $(entrance).html('').css({ padding: '0px' }).append(page);
  return entrance;
};

const bindEntranceInput = (entrance) => {
  if (!(entrance && $(entrance).hasClass('entrance'))) return false;
  const input = $(entrance).find('input[type=text]')[0];
  if (!input) return false;
  $(input).on('keypress', (event) => {
    if (isEnterKey(event)) {
      const submit = $(entrance).find('button[name=submit]');
      if (!submit) return;
      submit.click();
    }
  });
  return entrance;
};

const bindEntranceSubmit = (entrance) => {
  if (!(entrance && $(entrance).hasClass('entrance'))) return false;
  const submit = $(entrance).find('button[name=submit]')[0];
  if (!submit) return false; // 提交按钮
  $(submit).on('click', () => { entranceSumit(entrance); });
  return entrance;
};

const bindEntrance = () => {
  let i = 0;
  $('.entrance').each((index, entrance) => {
    if (!entrance) return;
    i += 1;
    $(entrance).attr('id', `entrance-${i}`);
    bindEntranceSubmit(entrance);
    bindEntranceInput(entrance);
  });
};

const supportIframeHeight = () => {
  resetIframeHeight();
  window.onresize = () => {
    resetIframeHeight();
  };
};

const dragCardHeader = (card) => {
  if (!card) return false;
  const cardHeaderDrager = $(card).find('.header-drager')[0];
  const cardHeader = $(card).find('.card-header')[0];
  const cardBody = $(card).find('.card-body')[0];
  if (!cardHeaderDrager || !cardHeader || !cardBody) return false;
  const top = cardHeader.offsetTop;
  return (event) => {
    let height = event.clientY - top;
    if (height < 50) {
      height = 0;
      $(cardHeader).css({ display: 'none' });
    } else {
      $(cardHeader).css({ display: '' });
    }
    $('body').css({ cursor: 'n-resize' });
    $(cardHeader).css({ height: `${height}px` });
    return card;
  };
};

const bindCardHeaderDrager = () => {
  const cards = $('.card');
  const curtain = $('<div>').addClass('curtain');
  if (!cards) return false;
  $(cards).each((index, card) => {
    const cardHeaderDrager = $(card).find('.header-drager')[0];
    if (!cardHeaderDrager) return;
    const dragHandler = dragCardHeader(card);
    $(cardHeaderDrager).on('mousedown', (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (getMouseButton(event) === 'left') {
        $(document).on('mousemove', dragHandler);
      }
      $(curtain).insertBefore('#app');
    });
    $(document).on('mouseup', () => {
      $('.curtain').remove();
      $('body').css({ cursor: 'default' });
      $(document).off('mousemove', dragHandler);
    });
  });
  return cards;
};

const bindDrager = () => {
  bindCardHeaderDrager();
};

$(document).ready(() => {
  if (!document.querySelector) return false;
  supportIframeHeight();
  bindEntrance();
  bindDrager();
  return true;
});


// todo
// 左右视窗比率调整
// 移动端改为上下分屏
// 输入框快捷方式
// 前进后退 历史记录
// 提供一个输入框随时修改网址
// 加载iframe
// 先放一个加载中icon√。 body添加一个iframe display=none onload='show' settimeout每秒检查一次状态 超过10秒不行就提示失败
// 因为同源问题 不能删除iframe内的a标签的target
// 解决方法
// 或者是server render
// 或者是jq ajax jsonp get (选择)
//
// 模块化 三段式
//
//
//
