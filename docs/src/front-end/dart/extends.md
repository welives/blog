## 普通类的继承

```dart
class Phone {
  int number;
  Phone(this.number);
  void powerOn() {}

  void shutDown() {
    print('test');
  }

  void showNumber() {
    print('the number is $number');
  }
}

class Android extends Phone {
  Android(super.number);

  @override
  void powerOn() {
    super.powerOn();
    print('安卓开机');
  }

  @override
  void shutDown() {
    super.shutDown();
    print('安卓关机');
  }

  @override
  void noSuchMethod(Invocation invocation) {
    print('noSuchMethod 被重写');
  }
}

dynamic p = Android(123);
p.powerOn();
p.showNumber();
p.haha();
p.shutDown();
```

## 抽象类的继承

> 虽然抽象类中的方法可以写具体的逻辑，并且在子类继承时通过`super`调用抽象父类的具体实现方法，也可以通过子类的实例调用抽象父类的具体实现方法。
>
> 但根据其他开发语言形成的通用规范，抽象类中成员必须都是抽象的，抽象方法的具体逻辑交给子类继承或接口实现后进行重写

```dart
abstract class Phone {
  int number;
  Phone(this.number);
  void powerOn();

  void shutDown() {
    print('test');
  }

  void showNumber() {
    print('the number is $number');
  }
}

class Android extends Phone {
  Android(super.number);

  @override
  void powerOn() {
    super.powerOn(); // IDE报错,抽象方法不能被调用
    print('安卓开机');
  }

  @override
  void shutDown() {
    super.shutDown(); // 子类中通过super调用抽象父类中已具体实现的方法
    print('安卓关机');
  }

  @override
  void noSuchMethod(Invocation invocation) {
    print('noSuchMethod 被重写');
  }
}

var p = Android(123);
p.powerOn();
p.showNumber(); // 子类实例调用抽象父类中已具体实现的方法
p.haha();
p.shutDown();
```
