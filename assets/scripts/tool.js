import isUri from 'is-url';

const isAliveElement = element => (element && element.nodeType === 1 && $(element).parent('html'));

const isEnterKey = event => (event.keyCode === 13);

const validateURL = (url) => {
  if (!isUri) throw new Error('isUri 未能成功加载');
  return (isUri(url) ? url : undefined);
};//

const formatURL = (url) => {
  if ((!url) || (typeof url !== 'string')) return false;
  const hasPrefix = url.match(/^http[s]?:[/]{2}/);
  const format = (hasPrefix) ? url : (`https://${url}`);
  return format;
};

export { isAliveElement, isEnterKey, validateURL, formatURL };
