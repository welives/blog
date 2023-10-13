## `static`和`getter`的区别

`getter`本质上是在运行时调用的方法，因此每次调用它时都会创建一个新的内存地址

而一个类只会在内存中存储一次，所以每次访问`static`时都是访问同一个内存地址中的类

> 类的静态成员可以不用实例化就直接访问

```dart
class People {
  static String name = '煎蛋';
  static void show() {
    print('the name is $name');
  }
}

print(People.name);
People.show();
```

> 在类的方法内部也可以访问静态成员

```dart
class People {
  static String name = '煎蛋';
  static void show() {
    print('the name is $name');
  }

  void printName() {
    print(name);
  }
}

People().printName();
```
