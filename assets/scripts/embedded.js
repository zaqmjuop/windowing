
import initEmbeddedBody from './embeddedBody';
import initEmbeddedHeader from './embeddedHeader';

const isEmbedded = (embedded) => {
  if (!embedded) throw new ReferenceError(`参数不能为 ${embedded}`);
  if (embedded.nodeType !== 1 || embedded.tagName !== 'DIV') throw new ReferenceError(`${embedded} 不是一个<div>元素`);
  if (!$(embedded).hasClass('embedded-control')) throw new ReferenceError(`${embedded} 缺少class="embedded-control"标记`);
  return true;
};

const hasEmbeddedHeader = (embedded) => {
  isEmbedded(embedded);
  const embeddedHeader = $(embedded).find('card-header');
  if (!embeddedHeader) throw new Error(`${embedded} 不包含<div class="card-header">`);
  return true;
};

const hasEmbeddedBody = (embedded) => {
  isEmbedded(embedded);
  const embeddedBody = $(embedded).find('card-body');
  if (!embeddedBody) throw new Error(`${embedded} 不包含<div class="card-body">`);
  return true;
};

const bindEmbeddeds = () => {
  const embeddeds = $('.embedded-control');
  if (!embeddeds) return false;
  $(embeddeds).each((index, embedded) => {
    $(embedded).attr('id', `embedded-${index}`);
    initEmbeddedBody(embedded);
    initEmbeddedHeader(embedded);
  });
  return embeddeds;
};

export default bindEmbeddeds;
export { isEmbedded, hasEmbeddedHeader, hasEmbeddedBody };

