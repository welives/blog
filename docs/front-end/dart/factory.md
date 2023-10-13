## 调用子类

```dart
abstract class Mobile {
  void call();
  factory Mobile(String type) {
    switch (type) {
      case 'android':
        return Android();
      case 'ios':
        return Ios();
      default:
        throw 'The $type is not matched';
    }
  }
}

class Android implements Mobile {
  @override
  void call() {
    print('Android Calling...');
  }
}

class Ios implements Mobile {
  @override
  void call() {
    print('Ios Calling...');
  }
}

var android = Mobile('android');
var ios = Mobile('ios');
android.call(); // Android Calling...
ios.call(); // Ios Calling...
```

## 单例模式

```dart
class Mobile {
  static final Mobile _instance = Mobile._internal();
  Mobile._internal(); // 这个其实就是命名构造函数
  factory Mobile() => _instance;
  void call() {
    print('calling...');
  }
}

var p1 = Mobile();
var p2 = Mobile();
print(identical(p1, p2)); // true,两个实例指向同一内存地址
Mobile().call();
```

## 减少重复实例对象

```dart
class Mobile {
  int _number;
  Mobile(this._number);
  factory Mobile.fromJson(Map<String, dynamic> json) =>
      Mobile(json['number'] as int);

  // static fromJson(Map<String, dynamic> json) => Mobile(json['number'] as int);

  void call() {
    print('calling $_number ...');
  }
}

var p1 = Mobile.fromJson({'number': 110});
p1.call();
```

> 如果不使用工厂函数，就要用类的静态方法，这样就会有多余的实例对象
