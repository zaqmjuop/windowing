import Store from './indexeddb/store';

const visiteds = new Store('Visiteds');

visiteds.saveVisited = (url) => {
  if (!url || (typeof url !== 'string')) return false;
  const log = { date: new Date(), url };
  return visiteds.set(log);
};
visiteds.init = () => {
  if (visiteds.init === 1) return false;
  const init = visiteds.ready()
    .then(() => visiteds.addColumns(['date', { index: 'url', unique: true }]))
    .then(() => { visiteds.init = 1; });
  return init;
};
visiteds.init();

export default visiteds;
