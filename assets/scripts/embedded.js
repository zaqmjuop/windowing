
import initEmbeddedBody from './embeddedBody';


const bindEmbeddeds = () => {
  const embeddeds = $('.embedded-control');
  if (!embeddeds) return false;
  $(embeddeds).each((index, embedded) => {
    $(embedded).attr('id', `embedded-${index}`);
    initEmbeddedBody(embedded);
  });
  return embeddeds;
};

export default bindEmbeddeds;
