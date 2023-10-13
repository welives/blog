::: tip
在`Dart`中虽然保留了`interface`关键字，但它并不是用来定义接口的，而通过**普通类或抽象类**来作为接口被实现

根据规范，接口用途的抽象类请用字母`I`开头，例如`IPerson`
:::

一个类可以实现多个接口

## 抽象类

```dart
abstract class IPerson {
  String name;
  int age;
  IPerson(this.name, this.age);

  String hello();
}

abstract class ISchool {
  int grade;
  ISchool(this.grade);

  String info();
}

class Teacher implements IPerson {
  @override
  String name;
  @override
  int age;

  Teacher(this.name, this.age);

  @override
  String hello() {
    return 'Teacher => Name: $name, Age: $age';
  }
}

class Student implements IPerson, ISchool {
  @override
  String name;
  @override
  int age;
  @override
  int grade;

  Student(this.name, this.age, this.grade);

  @override
  String hello() {
    return 'Student => Name: $name, Age: $age';
  }

  @override
  String info() {
    return 'School => Name: $name, Age: $age, Grade: $grade';
  }
}

void sayHello(IPerson user) => print(user.hello());

void showInfo(ISchool user) => print(user.info());

var t = Teacher('煎蛋', 18);
sayHello(t);
var s = Student('tom', 3, 1);
sayHello(s);
showInfo(s);
```

## 普通类

```dart
class Phone {
  void powerOn() {}

  void shutDown() {}
}

class Android implements Phone {
  @override
  void powerOn() {
    print('安卓开机');
  }

  @override
  void shutDown() {
    print('安卓关机');
  }
}

var p = Android();
p.powerOn();
p.shutDown();
```
