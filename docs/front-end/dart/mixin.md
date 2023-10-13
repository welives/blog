> 通过混入的方式，可以给一个类增加额外的属性或方法

- `mixin`中不能有构造函数
- 在最新的`Dart`版本中，普通类不能作为`mixin`了，取而代之的是`mixin`和`class`这两个关键字可以同时使用
- `mixin`和`class`同时使用时，不能使用`on`关键字进行限定
- 若某个`mixin`使用了`on`关键字进行限定，在使用该`mixin`时，也必须要引入它依赖的`mixin`
- 当多个`mixin`中有同名变量或函数时，以最后一个`mixin`为准
- 当`mixin`中的变量没有被初始化时，需要添加`late`关键字，表示该变量稍后再进行初始化

```dart
abstract class Person {
  String name;
  Person(this.name);

  void hello();
}

mixin Mobile {
  int number = 123;
  void call() {
    print('Mobile is calling');
  }
}

mixin class Android {
  Android();
  void playStore() {
    print('Google Play Store');
  }

  void call() {
    print('Android is calling');
  }
}

mixin Apple on Mobile {
  void appleStore() {
    print('Apple Store');
  }

  @override
  void call() {
    print('Apple calling number $number');
  }
}

class Teacher extends Person with Mobile, Android, Apple {
  Teacher(super.name);

  @override
  void hello() {
    print('hello $name, Number is $number');
  }
}

var p = Teacher('煎蛋');
p.hello(); // hello 煎蛋, Number is 123
p.call(); // Apple calling number 123
p.playStore(); // Google Play Store
p.appleStore(); // Apple Store
print(p.number); // 123
```
