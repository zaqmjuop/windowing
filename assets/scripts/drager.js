import { resetIframeHeight } from './supportIframeHeight';

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
  if (!cards) return false;
  const curtain = $('<div>').addClass('curtain');
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
      $('body').css({ cursor: 'default' });
      $(document).off('mousemove', dragHandler);
      resetIframeHeight();
      $('.curtain').remove();
    });
  });
  return cards;
};


const bindDrager = () => {
  bindCardHeaderDrager();
};

export default bindDrager;
