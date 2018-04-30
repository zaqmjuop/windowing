const indexedDB = window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB;
const IDBTransaction = window.IDBTransaction ||
  window.webkitIDBTransaction ||
  window.msIDBTransaction;
const IDBKeyRange = window.IDBKeyRange ||
  window.webkitIDBKeyRange ||
  window.msIDBKeyRange;
const dbname = 'mydb';
class Store {
  constructor(keyPath) { // {name: true, age: false, pathName: isUnique} 或 'name'
    let keyHash = keyPath;
    if (typeof keyPath === 'string') {
      keyHash = { keyPath: false };
    }
    if (!(keyHash instanceof Object)) return false;
    this.DBOpenRequest = Store.openDB(dbname, 2);
    this.DBOpenRequest.onerror = () => {
      console.log('你禁用了indexedDB!');
    };
    this.DBOpenRequest.onupgradeneeded = (event) => {
      console.log('正在更新数据库...');
      this.db = event.target.result;
      const objectStore = this.db.createObjectStore(dbname, { keyPath: 'id', autoIncrement: true });
      keyHash = Object.assign(keyHash, { date: false, id: true });
      const keys = Object.keys(keyHash);
      console.log(keys);
      keys.forEach((key) => {
        objectStore.createIndex(key, key, { unique: keyHash[key] });
      });
      this.db.onerror = () => {
        console.log('数据库加载失败');
      };
    };
    this.DBOpenRequest.onsuccess = () => {
      this.db = this.DBOpenRequest.result;
      this.add = (option) => {
        if (typeof option !== 'object') return false;
        const value = { date: new Date() };
        Object.assign(value, option);
        const objectStore = this.db.transaction(dbname, 'readwrite').objectStore(dbname);
        const request = objectStore.add(value);
        request.onsuccess = () => {
          console.log('保存一条记录');
          console.log(request.result);
        };
        request.onerror = (event) => {
          console.error(event.target.error);
        };
        return objectStore;
      };
      this.put = (option) => {
        if (typeof option !== 'object') return false;
        const value = { date: new Date() };
        Object.assign(value, option);
        const objectStore = this.db.transaction(dbname, 'readwrite').objectStore(dbname);
        const request = objectStore.put(value);
        request.onsuccess = () => {
          console.log('更新一条记录');
          console.log(request.result);
        };
        request.onerror = (event) => {
          console.error(event.target.error);
        };
        return objectStore;
      };
      this.get = (key) => {
        const objectStore = this.db.transaction(dbname, 'readwrite').objectStore(dbname);
        const request = objectStore.get(key);
        request.onsuccess = () => {
          console.log('取出一条记录');
          console.log(request.result);
        };
        request.onerror = (event) => {
          console.error(event.target.error);
        };
        return objectStore;
      };
      this.delete = (key) => {
        const objectStore = this.db.transaction(dbname, 'readwrite').objectStore(dbname);
        const request = objectStore.delete(key);
        request.onsuccess = () => {
          console.log('删除一条记录');
          console.log(request.result);
        };
        request.onerror = (event) => {
          console.error(event.target.error);
        };
        return objectStore;
      };
      this.getAll = () => {
        const objectStore = this.db.transaction(dbname, 'readwrite').objectStore(dbname);
        const request = objectStore.getAll();
        request.onsuccess = () => {
          console.log(request.result);
        };
        request.onerror = (event) => {
          console.error(event.target.error);
        };
        return request;
      };
      this.upperBound = (max) => {
        if (!max) return false;
        const range = IDBKeyRange.upperBound(max);
        const index = this.db.transaction(dbname).objectStore(dbname).index('id').openCursor(range);
        index.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            console.log(cursor.value);
            cursor.continue();
          }
        };
        index.onerror = (event) => { console.log(event.target.result); };
        return range;
      };
    };
  }
  static openDB(name, version) {
    if ((typeof name !== 'string') || (typeof version !== 'number')) return false;
    if (!indexedDB) return false;
    const DBOpenRequest = indexedDB.open(name, parseInt(version, 10));
    return DBOpenRequest;
  }
}

const visiteds = new Store({ url: true });
visiteds.saveVisited = (url) => {
  if (!url || (typeof url !== 'string')) return false;
  return visiteds.add({ url });
};

export { visiteds };
