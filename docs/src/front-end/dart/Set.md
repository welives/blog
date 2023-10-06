> `Set`是一个元素唯一的有序队列

## 松散结构

```dart
var a = Set();
a
  ..add('java')
  ..add('php')
  ..add('python')
  ..add('java')
  ..add('sql')
  ..add('dart')
  ..add('c++');
print(a); // {java, php, python, sql, dart, c++}
```

## 强类型，通过泛型约束

```dart
var a = Set<String>();
a
  ..add('java')
  ..add('php')
  ..add(123); // 报错
```

## 去重和转列表

```dart
List<String> list = ['dart', 'java', 'c#', 'j#', 'e#', 'java'];
var unique = Set();
unique.addAll(list);
print(unique); // {dart, java, c#, j#, e#}
print(list.toSet()); // {dart, java, c#, j#, e#}

print(unique.toList()); // [dart, java, c#, j#, e#]
```

## 交集和联合

```dart
var a = <String>{
  "js",
  "node",
  "dart",
  "css",
  "html",
  "macos",
  "docker",
  "git"
};
var b = <String>{
  "linux",
  "docker",
  "git",
  "go",
  "python",
  "sql",
  "node",
  "js",
  "aws"
};

print(a.intersection(b)); // {js, node, docker, git}

print(a.union(b)); // {js, node, dart, css, html, macos, docker, git, linux, go, python, sql, aws}
```
