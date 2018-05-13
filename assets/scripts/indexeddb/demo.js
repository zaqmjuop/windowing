import Store from './store';

$(document).ready(() => {
  const demo = new Store('PokemonTrainers');
  const xiaozhi = {
    id: 1, name: 'Ash', age: 10, sex: 'male', goal: 'PokemonMaster',
  };
  const xiaoxia = {
    id: 2, name: 'Misty', age: 10, sex: 'female', goal: 'Watertype PokemonMaster',
  };
  const xiaogang = {
    id: 3, name: 'Brock', age: 15, sex: 'male', goal: 'Pokemon Doctor',
  };
  const xiaomao = {
    id: 4, name: 'Gary', age: 10, sex: 'male', goal: 'PokemonMaster',
  };
  demo.ready()
    .then((res) => {
      console.log('0', res);
      return demo.addColumns([{ index: 'name', unique: true }, 'age', 'sex']);
    })
    .then((res) => {
      console.log('1', '增加索引', res);
      const trainers = [xiaozhi, xiaoxia, xiaogang, xiaomao];
      return demo.set(trainers);
    })
    .then((res) => {
      console.log('2', '添加数据', res);
      return demo.get(1);
    })
    .then((res) => {
      console.log('3', '通过id查找', res);
      const newItem = Object.assign({ prototype: 'Tajiri' }, res);
      return demo.setItem(newItem);
    })
    .then((res) => {
      console.log('4', '修改id为1的条目数据', res);
      return demo.findItems({ name: xiaozhi.name });
    })
    .then((res) => {
      console.log('5', '通过属性查找数据', res);
      return demo.delete(4).then(() => demo.get(4));
    })
    .then((res) => {
      console.log('6', '删除id为4的数据', res);
    });
});
