## 抽象类不能被实例化

```dart
abstract class Person {
  String name;
  Person(this.name);

  void hello();
}

var p = Person(); // IDE报错
```

## 抽象类的使用方式

- `extends`继承

```dart
abstract class Person {
  String name;
  Person(this.name);

  void hello();
}

class Teacher extends Person {
  Teacher(super.name);

  @override
  void hello() {
    print('hello $name');
  }
}

var p = Teacher('jandan');
p.hello();
```

- `implements`实现

```dart
abstract class Person {
  String name;
  Person(this.name);

  void hello();
}

class Teacher implements Person {
  @override
  String name;
  Teacher(this.name);

  @override
  void hello() {
    print('hello $name');
  }
}

var p = Teacher('jandan');
p.hello();
```

> 对比可以发现，`implements`必须把抽象父类中的所有抽象成员全部重写，而`extends`可以只重写抽象方法，抽象属性可以在子类构造函数中通过`super`调用抽象父类而省去重写
