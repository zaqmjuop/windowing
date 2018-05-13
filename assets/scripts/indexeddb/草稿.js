
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

class Store {
  constructor(storeName) {
    if (!indexedDB) throw new Error('您的浏览器不支持indexedDB');
    this.name = this.name || storeName;
    this.databaseName = 'demo';
    return this;
  }

  openDB(version) {
    const openVersion = (version && Number.isSafeInteger(version) && (version > this.version))
      ? version : this.version;

    if (this.database) {
      this.database.close();
    }

    const promise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.databaseName, openVersion);
      request.onsuccess = () => {
        this.database = request.result;
        this.version = request.result.version;
        resolve(request.result);
      };
      request.onerror = (event) => { reject(event.target.error); };
      request.onupgradeneeded = (event) => {
        console.log('openDB onupgradeneeded');
        const db = event.target.result;
        const tx = event.target.transaction;
        const store = (tx && tx.objectStoreNames.contains(this.name))
          ? tx.objectStore(this.name)
          : db.createObjectStore(this.name, { keyPath: 'id', autoIncrement: true });
        this.database = db;

        if (!store.indexNames.contains('id')) {
          store.createIndex('id', 'id', { unique: true });
        }
      };
    });
    return promise;
  }
  isReady() {
    return (this.database && (this.database instanceof IDBDatabase));
  }
  ready() {
    const promise = this.openDB().then((database) => {
      this.database = database;
      return this;
    });
    return promise;
  }

  add(item, primaryKey) {
    // demo.add({ attr1: `demo${Date.now()}`, attr2: Date.now() }, 1)
    if (!this.database) throw new Error('数据库尚未准备好');
    const store = this.database.transaction(this.name, 'readwrite').objectStore(this.name);
    const promise = new Promise((resolve, reject) => {
      const request = store.add(item, primaryKey);
      request.onsuccess = () => { resolve(request.result); };
      request.onerror = (event) => { reject(event.target.error); };
    });
    return promise;
  }

  put(item, primaryKey) {
    // demo.put({ attr1: `demo${Date.now()}`, attr2: Date.now() }, 1)
    if (!this.database) throw new Error('数据库尚未准备好');
    const store = this.database.transaction(this.name, 'readwrite').objectStore(this.name);
    const promise = new Promise((resolve, reject) => {
      const request = store.put(item, primaryKey);
      request.onsuccess = () => { resolve(request.result); };
      request.onerror = (event) => { reject(event.target.error); };
    });
    return promise;
  }

  get(primaryKey) {
    // demo.put(1)
    if (!this.database) throw new Error('数据库尚未准备好');
    const store = this.database.transaction(this.name, 'readwrite').objectStore(this.name);
    const promise = new Promise((resolve, reject) => {
      const request = store.get(primaryKey);
      request.onsuccess = () => { resolve(request.result); };
      request.onerror = (event) => { reject(event.target.error); };
    });
    return promise;
  }

  delete(primaryKey) {
    // demo.delete(1)
    if (!this.database) throw new Error('数据库尚未准备好');
    const store = this.database.transaction(this.name, 'readwrite').objectStore(this.name);
    const promise = new Promise((resolve, reject) => {
      const request = store.delete(primaryKey);
      request.onsuccess = () => { resolve(request.result); };
      request.onerror = (event) => { reject(event.target.error); };
    });
    return promise;
  }

  deleteColumn(column) {
    // demo.deleteColumn('userName')
    if (!column || (typeof column !== 'string')) throw new TypeError('缺少列名或列名不是string类型');

    if (this.database) {
      this.database.close();
    }
    const openVersion = this.version + 1;
    const promise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.databaseName, openVersion);
      request.onsuccess = () => {
        this.database = request.result;
        this.version = request.result.version;
        resolve(request.result);
      };
      request.onerror = (event) => {
        this.database = request.result;
        this.version = request.result.version;
        this.database.close();
        reject(event.target.error);
      };
      request.onupgradeneeded = (event) => {
        console.log('openDB onupgradeneeded');
        const db = event.target.result;
        if (!db) throw new Error('数据库不存在 无法执行');
        const tx = event.target.transaction;
        if (!tx) throw new Error('事物不存在 无法执行');
        const store = (tx && tx.objectStoreNames.contains(this.name))
          ? tx.objectStore(this.name)
          : db.createObjectStore(this.name, { keyPath: 'id', autoIncrement: true });
        if (!store.indexNames.contains('id')) {
          store.createIndex('id', 'id', { unique: true });
        }

        if (store.indexNames.contains(column)) {
          store.deleteIndex(column);
        }
        this.database = db;
      };
    });
    return promise;
  }

  deleteColumns(columns) {
    // demo.deleteColumns(['userName', 'userAge'])
    if (!columns || !(columns instanceof Array)) throw new TypeError('列名组应该是一个数组');
    columns.forEach((column) => {
      if (!column || (typeof column !== 'string')) throw new TypeError('缺少列名或列名不是string类型');
    });

    if (this.database) {
      this.database.close();
    }
    const openVersion = this.version + 1;
    const promise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.databaseName, openVersion);
      request.onsuccess = () => {
        this.database = request.result;
        this.version = request.result.version;
        resolve(request.result);
      };
      request.onerror = (event) => {
        this.database = request.result;
        this.version = request.result.version;
        this.database.close();
        reject(event.target.error);
      };
      request.onupgradeneeded = (event) => {
        console.log('openDB onupgradeneeded');
        const db = event.target.result;
        if (!db) throw new Error('数据库不存在 无法执行');
        const tx = event.target.transaction;
        if (!tx) throw new Error('事物不存在 无法执行');
        const store = (tx && tx.objectStoreNames.contains(this.name))
          ? tx.objectStore(this.name)
          : db.createObjectStore(this.name, { keyPath: 'id', autoIncrement: true });
        if (!store.indexNames.contains('id')) {
          store.createIndex('id', 'id', { unique: true });
        }

        columns.forEach((column) => {
          if (store.indexNames.contains(column)) {
            store.deleteIndex(column);
          }
        });

        this.database = db;
      };
    });
    return promise;
  }

  addColumn(column, option) {
    // demo.addColumn('userAge')
    // demo.addColumn('userName', { unique: true })
    if (!column || (typeof column !== 'string')) throw new TypeError('缺少列名或列名不是string类型');
    if (option && (typeof option !== 'object')) throw new TypeError('选项参数格式错误');
    const columnOption = {};
    columnOption.unique = (option && option.unique);

    if (this.database) {
      this.database.close();
    }
    const openVersion = this.version + 1;
    const promise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.databaseName, openVersion);
      request.onsuccess = () => {
        this.database = request.result;
        this.version = request.result.version;
        resolve(request.result);
      };
      request.onerror = (event) => { reject(event.target.error); };
      request.onupgradeneeded = (event) => {
        console.log('openDB onupgradeneeded');
        const db = event.target.result;
        const tx = event.target.transaction;
        const store = (tx && tx.objectStoreNames.contains(this.name))
          ? tx.objectStore(this.name)
          : db.createObjectStore(this.name, { keyPath: 'id', autoIncrement: true });
        if (!store.indexNames.contains('id')) {
          store.createIndex('id', 'id', { unique: true });
        }
        if (!store.indexNames.contains(column)) {
          store.createIndex(column, column, { unique: columnOption.unique });
        }
        this.database = db;
      };
    });
    return promise;
  }

  addColumns(columns) {
    // demo.addColumns(['userName'])
    // demo.addColumns([{ name: 'userAge', unique: false }])
    // demo.addColumns(['userName', { name: 'userAge', unique: false }])
    if (!columns || !(columns instanceof Array)) throw new TypeError('列名组应该是一个数组');
    columns.forEach((column) => {
      const columnType = typeof column;
      if (!column) throw new TypeError('列名参数错误');
      if ((columnType !== 'string') && (columnType !== 'object')) throw new TypeError('列名组应该是一个数组');
    });

    if (this.database) {
      this.database.close();
    }
    const openVersion = this.version + 1;
    const promise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.databaseName, openVersion);
      request.onsuccess = () => {
        this.database = request.result;
        this.version = request.result.version;
        resolve(request.result);
      };
      request.onerror = (event) => {
        this.database = request.result;
        this.version = request.result.version;
        this.database.close();
        reject(event.target.error);
      };
      request.onupgradeneeded = (event) => {
        console.log('openDB onupgradeneeded');
        const db = event.target.result;
        if (!db) throw new Error('数据库不存在 无法执行');
        const tx = event.target.transaction;
        if (!tx) throw new Error('事物不存在 无法执行');
        const store = (tx && tx.objectStoreNames.contains(this.name))
          ? tx.objectStore(this.name)
          : db.createObjectStore(this.name, { keyPath: 'id', autoIncrement: true });
        if (!store.indexNames.contains('id')) {
          store.createIndex('id', 'id', { unique: true });
        }

        columns.forEach((column) => {
          //  ['userName', { name: 'userAge', unique: false }]
          const newColumn = {};
          if (typeof column === 'string') {
            newColumn.name = column;
          } else if (typeof column === 'object') {
            newColumn.name = column.name;
            newColumn.unique = !!column.unique;
          }
          if (newColumn.name && !store.indexNames.contains(newColumn.name)) {
            store.createIndex(newColumn.name, newColumn.name, { unique: newColumn.unique });
          }
        });

        this.database = db;
      };
    });
    return promise;
  }

  iterate(callback) {
    if (!callback || (typeof callback !== 'function')) throw new TypeError('回调函数不对');
    if (!this.database) throw new Error('数据库尚未准备好');
    const store = this.database.transaction(this.name, 'readwrite').objectStore(this.name);
    const promise = new Promise((resolve, reject) => {
      const request = store.openCursor();
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          // console.log(res);
          const res = callback(cursor.value, cursor.key, cursor.primaryKey);
          cursor.continue();
          if (res) {
            resolve(res);
          }
        } else {
          resolve(null);
        }
      };
      request.onerror = (event) => { reject(event.target.error); };
    });
    return promise;
  }

  openCursor() {
    const range = IDBKeyRange.bound(10, 20);
    if (!this.database) throw new Error('数据库尚未准备好');
    const store = this.database.transaction(this.name, 'readwrite').objectStore(this.name);
    const promise = new Promise((resolve, reject) => {
      const request = store.openCursor(range);
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          console.log(cursor);
          const res = cursor;
          cursor.continue();
          if (res) {
            resolve(res);
          }
        } else {
          resolve(null);
        }
      };
      request.onerror = (event) => { reject(event.target.error); };
    });
    return promise;
  }

  setItem(item) {
    // item 只能是 {} 类型，例如 setItem({ name: 'xiaoming', age: 10 })
    // item.id 只能是正整数, 如果没有item.id那么分配自增id如果有id那么插入
    // 返回值是promise
    // resolve() 输出保存后的item.id
    if (!item || (typeof item !== 'object')) throw new TypeError('参数只能是一个对象');
    if ((item.id !== undefined) && !Number.isSafeInteger(item.id)) throw new TypeError('参数的id属性只能为整数');
    if (!this.database) throw new Error('数据库尚未准备好');
    const store = this.database.transaction(this.name, 'readwrite').objectStore(this.name);
    const promise = new Promise((resolve, reject) => {
      const request = store.put(item);
      request.onsuccess = () => { resolve(request.result); };
      request.onerror = (event) => { reject(event.target.error); };
    });
    return promise;
  }

  getItem(id) {
    // 参数id是目标数据的id属性值，类型为int， 例如 getItem(1)
    // 返回值是promise
    // resolve() 输出该条查询结果
    if (!id || !Number.isSafeInteger(id)) throw new TypeError('缺少查询目标的id属性值或类型不是数字');
    if (!this.database) throw new Error('数据库尚未准备好');
    const store = this.database.transaction(this.name, 'readwrite').objectStore(this.name);
    const promise = new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => { resolve(request.result); };
      request.onerror = (event) => { reject(event.target.error); };
    });
    return promise;
  }

  findItem(queryObject) {
    // 参数id是目标数据的id属性值，类型为int
    // 返回值是promise
    // resolve() 输出该条查询结果
    if (!queryObject) throw new TypeError('参数不能为空');
    if (typeof queryObject !== 'object') throw new TypeError('参数只能是对象类型');
    if (!this.database) throw new Error('数据库尚未准备好');
    const store = this.database.transaction(this.name, 'readwrite').objectStore(this.name);
    const promise = new Promise((resolve, reject) => {
      console.log('queryObject', queryObject, Object.keys(queryObject));
      const index = store.index('name');
      const request = index.get('xiaoming');
      request.onsuccess = () => { resolve(request); };
      request.onerror = (event) => { reject(event.target.error); };
    });
    return promise;
  }

  findItems(queryObject) {
    if (!queryObject) throw new TypeError('参数不能为空');
    if (typeof queryObject !== 'object') throw new TypeError('参数只能是对象类型');
    if (!this.database) throw new Error('数据库尚未准备好');
    const store = this.database.transaction(this.name, 'readwrite').objectStore(this.name);
    const index = store.index('name');
    const range = IDBKeyRange.only('xiaoming');
    const promise = new Promise((resolve, reject) => {
      const request = index.openCursor(range);
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          console.log(cursor);
          const res = cursor;
          cursor.continue();
          if (res) {
            resolve(res);
          }
        } else {
          resolve(null);
        }
      };
      request.onerror = (event) => { reject(event.target.error); };
    });
    return promise;
  }
  getAll() {
    if (!this.database) throw new Error('数据库尚未准备好');
    const store = this.database.transaction(this.name, 'readwrite').objectStore(this.name);
    const promise = new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => { resolve(request.result); };
      request.onerror = (event) => { reject(event.target.error); };
    });
    return promise;
  }
  where(queryObject) {
    if (!queryObject) throw new TypeError('参数不能为空');
    if (typeof queryObject !== 'object') throw new TypeError('参数只能是对象类型');
    if (!this.database) throw new Error('数据库尚未准备好');
    const store = this.database.transaction(this.name, 'readwrite').objectStore(this.name);
    const index = store.index('name');
    const range = IDBKeyRange.only('xiaoming1');
    const promise = new Promise((resolve, reject) => {
      const request = index.getAll(range);
      request.onsuccess = () => { resolve(request.result); };
      request.onerror = (event) => { reject(event.target.error); };
    });
    return promise;
  }
  find(query) {
    let ary = [];
    if (Number.isSafeInteger(query)) {
      ary = [query];
    } else if (query instanceof Array) {
      query.forEach((value) => {
        if (!Number.isSafeInteger(value)) throw new TypeError('id的类型应该是整数');
      });
      ary = query.sort();
    }
    const range = IDBKeyRange.bound(ary[0], ary[ary.length - 1]);

    if (!this.database) throw new Error('数据库尚未准备好');
    const store = this.database.transaction(this.name, 'readwrite').objectStore(this.name);
    const promise = new Promise((resolve, reject) => {
      const request = store.getAll(range);
      request.onsuccess = () => { resolve(request.result); };
      request.onerror = (event) => { reject(event.target.error); };
    });
    return promise.then((set) => {
      const result = [];
      set.forEach((item) => {
        if (ary.includes(item.id)) {
          result.push(item);
        }
      });
      return result;
    });
  }

  findBy(queryObject) {
    if (!queryObject) throw new TypeError('参数不能为空');
    if (typeof queryObject !== 'object') throw new TypeError('参数只能是对象类型');
    if (!this.database) throw new Error('数据库尚未准备好');
    const store = this.database.transaction(this.name, 'readwrite').objectStore(this.name);
    const keys = Object.keys(queryObject);
    const index = store.index(keys[0]);
    const range = IDBKeyRange.only(queryObject[keys[0]]);
    const promise = new Promise((resolve, reject) => {
      const request = index.getAll(range);
      request.onsuccess = () => { resolve(request.result); };
      request.onerror = (event) => { reject(event.target.error); };
    });
    return promise.then((set) => {
      const result = [];
      set.forEach((item) => {
        let isEqual = true;
        keys.forEach((key) => {
          if (item[key] !== queryObject[key]) isEqual = false;
        });
        if (isEqual) {
          result.push(item);
        }
      });
      return result;
    });
  }
}

$(document).ready(() => {
  const demo = new Store('Users');
  window.store = Store;
  window.demo = demo;
  const item = { name: `demo${Date.now()}`, age: Date.now() };
  demo.ready()
    .then((res) => {
      console.log('0', res);
      return demo.addColumn('name');
    })
    .then((res) => {
      console.log('1', res);
      return demo.add(item);
    })
    .then((res) => {
      console.log('2', res);
      return demo.get(res);
    })
    .then((res) => {
      console.log('3', res);
      const newItem = { id: res.id, name: `new_demo${Date.now()}`, age: Date.now() };
      return demo.put(newItem);
    })
    .then((res) => {
      console.log('4', res);
      return demo.get(res);
    })
    .then((res) => {
      console.log('5', res);
      return demo.deleteColumn('asd');
    })
    .then((res) => {
      console.log('6', res);
      return demo.deleteColumns(['asd', 'userAge']);
    })
    .then((res) => {
      console.log('7', res);
      return demo.addColumns(['userName', { name: 'userAge', unique: false }]);
    })
    .then((res) => {
      console.log('8', res);
      return demo.openCursor();
    })
    .then((res) => {
      console.log('9', res);
      return demo.iterate((value, key, primaryKey) => {
        // console.log('iterate', value, key, primaryKey);
        return primaryKey < 1;
      });
    })
    .then((res) => {
      const newItem = {
        name: 'xiaoming1', age: 110, tall: 200, created: Date.now(), id: -2,
      };
      console.log('10', res);
      return demo.setItem(newItem);
    })
    .then((res) => {
      console.log('11', res);
      return demo.getItem(1);
    })
    .then((res) => {
      const query = { name: 'xiaoming' };
      console.log('12', res);
      return demo.findItems(query);
    })
    .then((res) => {
      console.log('13', res);
      return demo.getAll();
    })
    .then((res) => {
      const query = { name: 'xiaoming1' };
      console.log('14', res);
      return demo.where(query);
    })
    .then((res) => {
      console.log('15', res);
      return demo.find([4, 6]);
    })
    .then((res) => {
      console.log('16', res);
      return demo.findBy({ name: 'xiaoming1', age: 110 });
    })
    .then((res) => {
      console.log('17', res);
    });
});
// todo
// demo.find({age: 2, name: 'xiaoming'})
// demo.clear() clear store
// conf tableName databaseName
// api 使用唯一标识为id 若参数无id则id自增
// demo.set({id: 2, name: 'xiaoming', age: 11})
