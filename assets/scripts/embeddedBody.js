
import { validateURL, formatURL } from './tool';
import { newPage } from './embedded';
import { visiteds } from './store';

const embeddedSubmit = (submit) => {
  // if (!submit || ($(submit).attr('name') !== 'submit')) return false;
  // const embedded = $(submit).parents('.embedded-control')[0];
  // if (!embedded) return false;
  // const entrance = $(embedded).find('.entrance')[0];
  // if (!entrance) return false;
  // const inputGroup = $(submit).parents('.input-group')[0];
  // if (!inputGroup) return false;
  // const input = $(inputGroup).find('input[type=text]')[0];
  // if (!input) return false;
  console.log(11)

  // const val = $(input).val();
  // const url = validateURL(formatURL(val)) || `https://www.baidu.com/s?ie=UTF-8&wd=${val}`;
  // const page = newPage({ url });
  // visiteds.saveVisited(url);
  // $(entrance).html('').css({ padding: '0px' }).append(page);
  return submit;
};

const defaultHomepage = () => {
  const homepage = $('<div>').addClass('homepage');
  const inputGroup = $('<div>').addClass('input-group');
  const input = $('<input>')
    .attr('list', 'urls')
    .attr('type', 'text')
    .attr('placeholder', '输入网址或百度搜索关键词')
    .addClass('form-control')
    .val('');
  const inputGroupAppend = $('<div>').addClass('input-group-append');
  const submit = $('<button>')
    .attr('name', 'submit')
    .text('Biu')
    .addClass('btn btn-outline-secondary');
  $(submit).on('click', () => {
    embeddedSubmit(submit);
  });
  inputGroupAppend.append(submit);
  inputGroup.append(input).append(inputGroupAppend);
  homepage.append(inputGroup);
  return homepage[0];
};

// const bindEmbeddedBody = (embedded) => {
//   if (!embedded || !$(embedded).hasClass('embedded-control')) return false;
//   const entrance = $(embedded).find('.entrance');
//   if (!entrance) throw new Error('embedded-control 没有 entrance');

//   console.log(embedded)
//   return true;
// };



const initEmbeddedBody = (embedded) => {
  if (!embedded || !$(embedded).hasClass('embedded-control')) throw new ReferenceError('initEmbeddedBody的参数应该是一个包含class="embedded-control"的<div>元素');
  const entrance = $(embedded).find('.entrance')[0];
  try {
    if (!entrance) throw new ReferenceError('embedded-control 没有 entrance');
  } catch (error) {
    if (error instanceof ReferenceError) {
      const defaltEmbeddedBody = $('<div>').addClass('card-body entrance');
      $(embedded).append(defaltEmbeddedBody);
    }
  }


  console.log('initEmbeddedBody');
  return true;
};

export { defaultHomepage, embeddedSubmit, initEmbeddedBody };
