import { visiteds } from './store';
import { isEnterKey, validateURL, formatURL } from './tool';
import { resetIframeHeight } from './supportIframeHeight';

const initIframe = (iframe) => {
  if (!iframe || (iframe.tagName !== 'IFRAME')) return false;
  const parent = $(iframe).parent()[0];
  if (!parent) return false;
  if ($(parent).attr('class').includes('iframe-holder')) {
    $(parent).html(iframe);
  }
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
  const holder = $('<div>').addClass('iframe-holder');

  holder.append(loading).append(page);
  $(page).on('load', () => { initIframe(page[0]); });

  return holder;
};

const embeddedSumit = (submit) => {
  if (!submit || ($(submit).attr('name') !== 'submit')) return false;
  const embedded = $(submit).parents('.embedded-control')[0];
  if (!embedded) return false;
  const entrance = $(embedded).find('.entrance')[0];
  if (!entrance) return false;
  const inputGroup = $(submit).parents('.input-group')[0];
  if (!inputGroup) return false;
  const input = $(inputGroup).find('input[type=text]')[0];
  if (!input) return false;
  const val = $(input).val();
  const url = validateURL(formatURL(val)) || `https://www.baidu.com/s?ie=UTF-8&wd=${val}`;
  const page = newPage({ url });
  visiteds.saveVisited(url);
  $(entrance).html('').css({ padding: '0px' }).append(page);
  return submit;
};

const bindEmbeddedSubmits = (embedded) => {
  if (!(embedded && $(embedded).hasClass('embedded-control'))) return false;
  const submits = $(embedded).find('button[name=submit]');
  if (!submits) return false; // 提交按钮
  submits.each((index, item) => {
    $(item).on('click', () => { embeddedSumit(item); });
  });
  return embedded;
};

const bindEmbeddedInput = (input) => {
  if (!input || ($(input).attr('type') !== 'text')) return false;
  const inputGroup = $(input).parent('.input-group')[0];
  if (!inputGroup) return false;
  const submit = $(inputGroup).find('button[name=submit]');
  if (!submit) return false;
  $(input).on('keypress', (event) => {
    if (isEnterKey(event)) { submit.click(); }
  });
  $(input).on('focus', () => {
    const request = visiteds.getAll();
    $(request).on('success', () => {
      const urls = request.result;
      if (!urls || !(urls instanceof Array)) return false;
      const datalist = $('#urls');
      datalist.html('');
      urls.forEach((item) => {
        const option = $('<option>').attr('value', item.url);
        datalist.append(option);
      });
      return urls;
    });
  });
  return input;
};

const bindEmbeddedInputs = (embedded) => {
  if (!(embedded && $(embedded).hasClass('embedded-control'))) return false;
  const inputs = $(embedded).find('input[type=text]');
  if (!inputs) return false;
  inputs.each((index, item) => {
    bindEmbeddedInput(item);
  });
  return embedded;
};

const bindEmbeddeds = () => {
  const embedded = $('.embedded-control');
  if (!embedded) return false;
  $(embedded).each((index, item) => {
    $(item).attr('id', `embedded-${index}`);
    bindEmbeddedSubmits(item);
    bindEmbeddedInputs(item);
  });
  return embedded;
};

export default bindEmbeddeds;
