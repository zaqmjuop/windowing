import { defaultHomepage } from './embeddedBody';
import { embeddedSubmit } from './embeddedBody';


// const embedded = $('.embedded-control')[0];
// const embeddedHeader = $(embedded).find('.card-header')[0];
// const embeddedBody = $(embedded).find('.card-body')[0];
// const entrance = $(embedded).find('.entrance')[0];


const bindHomePageButtons = (embedded) => {
  if (!embedded || !$(embedded).hasClass('embedded-control')) return false;
  const entrance = $(embedded).find('.entrance')[0];
  if (!entrance) return false;
  const homePageButtons = $(embedded).find('button[name=homepage]');
  if (!homePageButtons) return false;
  const homepage = $(entrance).find('div[name=homepage]')[0] || defaultHomepage();
  homePageButtons.each((index, item) => {
    $(item).on('click', () => {
      $(entrance).html(homepage);
    });
  });
  return embedded;
};

const bindEmbeddedHeader = (embedded) => {
  if (!embedded || !$(embedded).hasClass('embedded-control')) return false;
  bindHomePageButtons(embedded);
  return true;
};

export { bindEmbeddedHeader };
