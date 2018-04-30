const resetIframeHeight = () => {
  const iframes = $('iframe');
  if (!iframes) return false;
  iframes.each((index, element) => {
    const height = $(element).attr('height') || '';
    const perHeight = height.match(/\d+%$/);
    if (!perHeight) { return; }
    const per = parseInt(perHeight, 10);
    const cssHeight = $(element).parent().height() * (per / 100);
    $(element).css('height', `${cssHeight}px`);
  });
  return iframes;
};

const supportIframeHeight = () => {
  resetIframeHeight();
  window.onresize = () => {
    resetIframeHeight();
  };
};

export { resetIframeHeight, supportIframeHeight };
