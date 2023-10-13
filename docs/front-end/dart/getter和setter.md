> 在`Dart`中是没有像其他强类型语言的`private`、`protected`、`public`这些类的访问修饰符的。
>
> 若要创建私有成员，可以使用`_`开头的属性名或方法名进行约束，并且该类还必须作为一个独立文件，以`库`的形式导出

```dart
// people.dart
library people;

class People {
  String? _name;
  int age = 18;
  People();

  // 定义 Setter
  set name(String value) => _name = value;
  // 定义Getter
  String get name => 'the name is $_name';

  info() {
    print('the $_name is $age years old');
  }
}

// main.dart
void main(List<String> args) {
  var p = People();
  p.name = '煎蛋'; // 通过setter修改私有属性
  print(p.age);
  print(p.name); // 通过getter访问私有属性
  print(p._name); // IDE报错,类的实例不能直接访问私有属性,因为该类目前是以库的形式导出
  p.info();
}
```

> 在同一文件中定义类的私有成员并直接访问时，私有的限制会失效

```dart
class People {
  String? _name;
  int age = 18;
  People();

  set name(String value) => _name = value;
  String get name => 'the name is $_name';

  info() {
    print('the $_name is $age years old');
  }
}

void main(List<String> args) {
  var p = People();
  p.name = '煎蛋';
  print(p.age);
  print(p.name);
  print(p._name); // IDE不报错,可以正常访问
  p.info();
}
```
