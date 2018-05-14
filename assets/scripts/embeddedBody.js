import visiteds from './indexeddb/visiteds';
import { isEnterKey, validateURL, formatURL } from './tool';
import { resetIframeHeight } from './supportIframeHeight';

const defaultLoading = () => {
  const holder = $('<div>').addClass('absolute-center').attr('name', 'loading')[0];
  const icon = $('<i>').addClass('fa fa-spinner fa-pulse loading fa-2x')[0];
  $(holder).append(icon);
  return holder;
};

const defaultIframeAction = (iframe) => {
  if (!iframe || (iframe.tagName !== 'IFRAME')) throw new Error('参数应该是<iframe>');
  const iframeHolder = $(iframe).parents('.iframe-holder')[0];
  if (!iframeHolder) throw new Error('<iframe>应该包含在<div class="iframe-holder">之内');
  const loading = $(iframeHolder).find('*[name=loading]')[0];
  if (loading && (!$(loading).hasClass('hide'))) {
    $(loading).addClass('hide');
  }
  $(iframe).removeClass('hide');
  resetIframeHeight();
};

const defaultIframe = () => {
  const iframe = $('<iframe>').attr('width', '100%').attr('height', '100%').addClass('page none')[0];
  $(iframe).on('load', () => {
    defaultIframeAction(iframe);
  });
  return iframe;
};

const bindEmbeddedBodyIframes = (embeddedBody) => {
  if (!embeddedBody || !$(embeddedBody).hasClass('card-body')) throw new ReferenceError('bindEmbeddedBodyIframes的参数应该是一个包含class="card-body"的<div>元素');
  const iframes = $(embeddedBody).find('iframe');
  if (!iframes) throw new Error('bindEmbeddedBodyIframes的参数元素不包含<iframe>');
  iframes.each((index, iframe) => {
    $(iframe).on('load', () => {
      defaultIframeAction(iframe);
    });
  });
  return embeddedBody;
};

const embeddedSubmit = (submit) => {
  if (!submit) throw new Error('embeddedSubmit的参数不能为空');
  // ↓计算url
  const inputGroup = $(submit).parents('.input-group')[0];
  if (!inputGroup) throw new Error('submit应该有父元素<div class="input-group">');
  const input = $(inputGroup).find('input[type=text]')[0];
  if (!input) throw new Error('submit应该有一个<input type=text>的相邻元素');
  const val = $(input).val();
  const url = validateURL(formatURL(val)) || `https://www.baidu.com/s?ie=UTF-8&wd=${val}`;
  visiteds.saveVisited(url);
  // ↓检查元素结构
  const embedded = $(submit).parents('.embedded-control')[0];
  if (!embedded) throw new TypeError('缺少带class="embedded-control"标记的父元素');
  const embeddedBody = $(embedded).find('.card-body')[0];
  if (!embeddedBody) throw new Error('submit应该有class="card-body"的父元素');
  const homepage = $(embeddedBody).find('div[name=homepage]')[0];
  if (!homepage) throw new Error('embedded 应该包含 <div name="homepage">的元素');
  const iframeHolder = $(embeddedBody).find('.iframe-holder')[0];
  if (!iframeHolder) throw new Error('embedded 应该包含 <div class="iframe-holder">的元素');
  // ↓iframe-holder 由<div name="loading"> 和 <iframe> 两个元素组成
  const loading = $(iframeHolder).find('*[name=loading]')[0];
  try {
    if (!loading) throw new Error('iframeHolder 应该包含 loading 加载图标');
  } catch (error) {
    $(iframeHolder).append(defaultLoading());
  }
  const iframe = $(iframeHolder).find('iframe')[0];
  try {
    if (!iframe) throw new Error('iframeHolder 应该包含 <iframe> 元素');
  } catch (error) {
    $(iframeHolder).append(defaultIframe());
  }
  // ↓隐藏homepage显示iframe-holder
  if (!$(homepage).hasClass('hide')) {
    $(homepage).addClass('hide');
  }
  $(iframeHolder).removeClass('hide');
  // ↓显示loading 隐藏未加载完成的iframe
  $(loading).removeClass('hide');
  if (!$(iframe).hasClass('hide')) {
    $(iframe).addClass('hide');
  }
  // ↓加载iframe
  $(iframe).attr('src', url);
  return submit;
};

const bindEmbeddedBodySubmits = (embeddedBody) => {
  if (!embeddedBody) throw new Error('bindEmbeddedSubmits的参数不能为空');
  if (!$(embeddedBody).hasClass('card-body')) throw new Error('bindEmbeddedSubmits的参数应有class="card-body"标记');
  const embedded = $(embeddedBody).parents('.embedded-control');
  if (!embedded) throw new Error('bindEmbeddedSubmits的参数应该有父元素带有标记class="embedded-control"');
  const submits = $(embeddedBody).find('button[name=submit]');
  if (!submits) return false;
  submits.each((index, submit) => {
    $(submit).on('click', () => {
      embeddedSubmit(submit);
    });
  });
  return embeddedBody;
};

const bindEmbeddedInput = (input) => {
  if (!input || (input.tagName !== 'INPUT')) throw new Error('参数不是一个<input>');
  const inputGroup = $(input).parent('.input-group')[0];
  if (!inputGroup) throw new Error('这个<input>应该有父元素<div class="input-group">');
  const submit = $(inputGroup).find('button[name=submit]');
  if (!submit) throw new Error('这个<input>应该有相邻元素<button name="submit">');
  $(input).on('keypress', (event) => {
    if (isEnterKey(event)) { submit.click(); }
  });
  $(input).on('focus', () => {
    const promise = visiteds.getAll()
      .then((items) => {
        const datalist = $('#urls');
        datalist.html('');
        items.forEach((item) => {
          const option = $('<option>').attr('value', item.url);
          datalist.append(option);
        });
        return items;
      });
    return promise;
  });
};

const bindEmbeddedBodyInputs = (embeddedBody) => {
  if (!embeddedBody || !$(embeddedBody).hasClass('card-body')) throw new ReferenceError('initEmbeddedBody的参数应该是一个包含class="card-body"的<div>元素');
  const inputs = $(embeddedBody).find('input[type=text]');
  if (!inputs) throw new Error('<div class="card-body"> 内没有<input>');
  inputs.each((index, input) => {
    bindEmbeddedInput(input);
  });
  return embeddedBody;
};

const initEmbeddedBody = (embedded) => {
  if (!embedded || !$(embedded).hasClass('embedded-control')) throw new ReferenceError('initEmbeddedBody的参数应该是一个包含class="embedded-control"的<div>元素');
  let embeddedBody = $(embedded).find('.card-body')[0];
  try {
    if (!embeddedBody) throw new ReferenceError('embedded-control 没有 card-body');
  } catch (error) {
    if (error instanceof ReferenceError) {
      embeddedBody = $('<div>').addClass('card-body entrance');
      $(embedded).append(embeddedBody);
    }
  }
  bindEmbeddedBodyIframes(embeddedBody);
  bindEmbeddedBodySubmits(embeddedBody);
  bindEmbeddedBodyInputs(embeddedBody);
  return true;
};

export default initEmbeddedBody;
export { embeddedSubmit, bindEmbeddedInput };
