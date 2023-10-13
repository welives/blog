> `key` `value`形式的集合，也叫`键值对`

## 松散结构

```dart
var a = Map();
a['name'] = '煎蛋';
a['age'] = 18;
a[0] = 'test';
a[0] = 'hello';
print(a); // {name: 煎蛋, age: 18, 0: hello}
```

> key 相同时，后面声明的覆盖前面的数据

## 强类型，通过泛型约束`key`和`value`

```dart
var a = Map<int, String>();
a[0] = 'java';
a[1] = 'python';
print(a); // {0: java, 1: python}
```

## 常用方法

```dart
var a = Map();
var b = {2: 'dart', 3: 'php'};
a.addAll({0: 'java', 1: 'python'}); // 新增
a.addEntries(b.entries); // 添加另一个map集合
print(a);

b.clear(); // 清空数据
print(b); // {}

a.remove(0); // 根据键名删除数据
a.removeWhere((key, value) => value == 'python'); // 按条件删除数据

a.update(2, (value) => 'javascript'); // 根据键名更新数据
a.updateAll((key, value) => value.toUpperCase()); // 批量更新
```
