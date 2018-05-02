const bindRefreshButton = (embedded) => {
  if (!embedded || !$(embedded).hasClass('embedded-control')) throw new Error('参数元素应该是有标记class="embedded-control"');
  const embeddedBody = $(embedded).find('.card-body')[0];
  if (!embeddedBody) throw new Error('缺少card-body');
  const iframeHolder = $(embeddedBody).find('.iframe-holder')[0];
  if (!iframeHolder) throw new Error('缺少iframe-holder');
  const iframe = $(iframeHolder).find('iframe')[0];
  if (!iframe) throw new Error('缺少iframe');
  const buttons = $(embedded).find('button[name=refresh]');
  if (!buttons) return false;
  buttons.each((index, button) => {
    const icon = $(button).find('i')[0];
    if (!icon || !$(icon).hasClass('fa-refresh')) throw new Error('没有refresh图标');
    $(button).on('click', () => {
      const src = $(iframe).attr('src');
      if (src) {
        if (!$(icon).hasClass('fa-pulse')) {
          $(icon).addClass('fa-pulse');
        }
        $(iframe).on('load', () => {
          $(icon).removeClass('fa-pulse');
        });
        $(iframe).attr('src', src);
      }
    });
  });
  return embedded;
};

const bindHomePageButton = (embedded) => {
  if (!embedded || !$(embedded).hasClass('embedded-control')) throw new Error('bindHomePageButton的参数元素应该是有标记class="embedded-control"');
  const embeddedBody = $(embedded).find('.card-body')[0];
  if (!embeddedBody) throw new Error('缺少card-body');
  const homepage = $(embeddedBody).find('.homepage')[0];
  if (!homepage) throw new Error('缺少homepage');
  const iframeHolder = $(embeddedBody).find('.iframe-holder')[0];
  if (!iframeHolder) throw new Error('缺少iframe-holder');
  const buttons = $(embedded).find('button[name=homepage]');
  if (!buttons) return false;
  buttons.each((index, button) => {
    $(button).on('click', () => {
      if (!$(iframeHolder).hasClass('hide')) { $(iframeHolder).addClass('hide'); }
      $(homepage).removeClass('hide');
    });
  });
  return embedded;
};

const initEmbeddedHeader = (embedded) => {
  if (!embedded || !$(embedded).hasClass('embedded-control')) throw new Error('initEmbeddedHeader的参数元素应该是有标记class="embedded-control"');
  const embeddedHeader = $(embedded).find('card-header');
  if (!embeddedHeader) throw new Error('<div class="embedded-control">需要一个存在子元素<div class="card-header">');
  bindHomePageButton(embedded);
  bindRefreshButton(embedded);
  return true;
};

export default initEmbeddedHeader;
