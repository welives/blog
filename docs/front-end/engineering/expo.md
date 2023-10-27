---
title: 使用Expo搭建工程
---

::: tip ✨
搭建一个 Expo + TailwindCSS + TypeScript + ESLint + Prettier 的工程

[本工程的Github地址](https://github.com/welives/expo-starter)
:::

相关文档

- [Expo](https://expo.dev/)
- [ReactNative](https://reactnative.cn/)
- [ReactNavigation](https://reactnavigation.org/)
- [TypeScript](https://www.tslang.cn/)
- [TailwindCSS](https://tailwind.nodejs.cn/)
- [ESLint](https://eslint.nodejs.cn/)
- [Prettier](https://prettier.nodejs.cn/)

## 事前准备

- Windows 或者 Linux
- VSCode：编辑器
- nodejs：项目运行所需要的基础环境
- git：代码版本控制
- AndroidStudio：Android 虚拟机调试 App

## 初始化项目

我初始化项目时用的 Expo SDK 版本是`49`

```sh
pnpm create expo-app -t expo-template-blank-typescript
```

由于使用`pnpm`创建的 Expo 项目缺少了`.npmrc`文件，我们需要在项目根目录手动创建它，填入如下内容

```ini
node-linker=hoisted
```

接着删除`node_modules`目录和`pnpm-lock.yaml`文件，然后重新执行一遍依赖的安装

```sh
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

最后执行`pnpm start`启动项目，不出意外的话就会唤起 Android 虚拟机打开 App 了

这样就创建好一个以 Expo 为脚手架的基础工程了，接下来我们对这个它做亿点点额外的配置

## 配置EditorConfig

新建`.editorconfig`，设置编辑器和 IDE 规范，内容根据自己的喜好或者团队规范

::: code-group

```sh
touch .editorconfig
```

```ini [.editorconfig]
# https://editorconfig.org
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
insert_final_newline = false
trim_trailing_whitespace = false
```

:::

## 初始化`ESLint`

```sh
npx eslint --init
```

选第二个

![](./assets/nuxt/eslint_setup_1.png)

选第一个

![](./assets/nuxt/eslint_setup_2.png)

选其他，因为等下会安装RN社区的整合插件

![](./assets/expo/eslint_setup_3.png)

选`TypeScript`，然后运行环境按`a`全选

![](./assets/nuxt/eslint_setup_4.png)

`ESLint`配置文件的的保存格式，选第一个

![](./assets/nuxt/eslint_setup_5.png)

是否立即安装所需的依赖，选 Yes

![](./assets/nuxt/eslint_setup_6.png)

这里根据项目构建所使用的包管理器进行选择，因为本项目使用`pnpm`，所以选第三个

![](./assets/nuxt/eslint_setup_7.png)

新建`.eslintignore`文件，填入自己喜欢的配置

::: code-group

```sh
touch .eslintignore
```

```ini [.eslintignore]
node_modules
android
ios
.expo
.expo-shared
.vscode
.idea
```

:::

### RN社区的ESLint插件

```sh
pnpm add -D @react-native-community/eslint-plugin @react-native-community/eslint-config
```

## 安装`Prettier`

```sh
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
```

新建`.prettierrc`和`.prettierignore`文件，填入自己喜欢的配置

::: code-group

```sh
touch .prettierrc
touch .prettierignore
```

```json [.prettierrc]
{
  "$schema": "https://json.schemastore.org/prettierrc",
  "semi": false,
  "tabWidth": 2,
  "printWidth": 120,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

```ini [.prettierignore]
node_modules
android
ios
.expo
.expo-shared
.vscode
.idea
```

:::

### 整合`ESLint`和`Prettier`

编辑`.eslintrc.js`

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    '@react-native-community',
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: ['@react-native-community', 'prettier'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  rules: {
    complexity: ['error', 10],
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
}
```

## 配置`tsconfig`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "~/*": ["src/*"]
    },
    "typeRoots": ["node_modules/@types", "src/@types"]
  },
  "include": ["src"],
  "exclude": [
    "node_modules",
    "android",
    "ios",
    "babel.config.js",
    "metro.config.js",
    ".eslintrc.js"
  ]
}
```

### 开启路径别名

编辑`app.json`，添加如下`experiments`配置项

```json
{
  "expo": {
    // ...
    "experiments": {
      "tsconfigPaths": true
    }
  }
}
```

## 调整目录结构

项目根目录新建`src`文件夹，把`App.tsx`移入其中，新建`index.ts`文件作为应用入口，并填入以下内容

::: code-group

```sh
mkdir src
mv App.tsx src/App.tsx
touch index.ts
```

```ts [index.ts]
import { registerRootComponent } from 'expo'
import App from './src/App'

registerRootComponent(App)
```

```json [package.json]
{
  // ...
  "main": "index.ts" // [!code ++]
}
```

:::

## 安全区适配和手势插件

```sh
pnpm add react-native-screens react-native-safe-area-context react-native-gesture-handler
```

修改入口文件`index.ts`和`src/App.tsx`

::: code-group

```ts [index.ts]
import 'react-native-gesture-handler' // [!code ++]
// ...
```

```tsx{10-17} [App.tsx]
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler' // [!code ++]
import { SafeAreaProvider } from 'react-native-safe-area-context' // [!code ++]
import { enableScreens } from 'react-native-screens' // [!code ++]

enableScreens() // [!code ++]
export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text>Open up App.tsx to start working on your app!</Text>
        </View>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}
// ...
```

:::

## 安装`TailwindCSS`

::: code-group

```sh
pnpm add -D tailwindcss
npx tailwindcss init
```

```js [tailwind.config.js]
const colors = require('tailwindcss/colors')
delete colors.lightBlue
delete colors.warmGray
delete colors.trueGray
delete colors.coolGray
delete colors.blueGray
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: { colors },
  },
  plugins: [],
}
```

:::

由于 App 端使用的尺寸单位是`dp`，不支持`TailwindCSS`的单位，需要安装一个插件来做转换处理

```sh
pnpm add twrnc
```

新建`src/core/utils/tailwind.ts`文件，修改`src/App.tsx`

::: code-group

```ts [tailwind.ts]
import { create } from 'twrnc'
export default create(require('../../../tailwind.config'))
```

```tsx [App.tsx]
// ...
import { useDeviceContext } from 'twrnc' // [!code ++]
import { tw } from './core/utils' // [!code ++]
export default function App() {
  useDeviceContext(tw) // [!code ++]
  // ...
}
```

:::

## 屏幕适配

新建`src/@types/global.d.ts`文件，用来声明全局变量、函数、接口和类型等

新建`src/core/utils/global.ts`，修改入口文件`index.ts`

::: code-group

```ts [global.d.ts]
type Prettify<T> = { [P in keyof T]: T[P] } & {}
type ScaleBased = 'w' | 'h'
/**
 * 获取设计稿中像素值的真实dp
 * @param uiSize 设计稿尺寸
 * @param based 基准比例方案,默认用宽度方案
 * @returns
 */
function dp(uiSize: number, based: ScaleBased = 'w'): number
```

```ts [global.ts]
import { Dimensions, PixelRatio } from 'react-native'

// UI设计稿尺寸,单位px
const designSize = Object.freeze({
  width: 375,
  height: 812,
})
// 获取设备屏幕尺寸,单位dp
const { width, height } = Dimensions.get('window')
// 设计稿缩放比
const designScale = Object.freeze({
  w: width / designSize.width,
  h: height / designSize.height,
})
const operation = Object.freeze({
  size: (uiSize: number, based: ScaleBased) => uiSize * designScale[based],
  px2dp: (px: number) => parseFloat(PixelRatio.roundToNearestPixel(px).toFixed(2)),
})

global.dp = function (uiSize: number, based: ScaleBased = 'w') {
  return uiSize > 1 ? operation.px2dp(operation.size(uiSize, based)) : uiSize
}
```

```ts [index.ts]
import './src/core/utils/global' // [!code ++]
// ...
```

:::

## 路由导航

```sh
pnpm add @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
```

新建`src/pages`目录，用来存放应用的所有页面，接着新建三个页面用来测试，参考如下

- `Onboarding`
  - `index.tsx`
- `Home`
  - `index.tsx`
- `Profile`
  - `index.tsx`

::: code-group

```tsx [Onboarding]
import { View, Button } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { tw } from '~/core/utils'
import { AppStackScreenProps, AppStacks } from '~/routes/types'

type Props = AppStackScreenProps<AppStacks>
export default ({ navigation }: Props) => {
  return (
    <SafeAreaView style={tw`flex-1 items-center justify-center`}>
      <View>
        <Button title="Go Home" onPress={() => navigation.navigate('BOTTOM_TABS')}></Button>
      </View>
    </SafeAreaView>
  )
}
```

```tsx [Home]
import { View, Button } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { tw } from '~/core/utils'
import { AppStackScreenProps, AppStacks } from '~/routes/types'

type Props = AppStackScreenProps<AppStacks>
export default ({ navigation }: Props) => {
  return (
    <SafeAreaView style={tw`flex-1 items-center justify-center`}>
      <View>
        <Button
          title="Go Profile"
          onPress={() => navigation.navigate('BOTTOM_TABS', { screen: 'PROFILE' })}
        ></Button>
      </View>
    </SafeAreaView>
  )
}
```

```tsx [Profile]
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { tw } from '~/core/utils'

export default () => {
  return (
    <SafeAreaView style={tw`flex-1 items-center justify-center`}>
      <View>
        <Text>Profile</Text>
      </View>
    </SafeAreaView>
  )
}
```

:::

新建`src/routes`目录，用来管理应用的路由。在`routes`目录下新建`AppNavigator.tsx`、`TabsNavigator.tsx`和`types.ts`

::: code-group

```ts [types.ts]
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

export enum AppStacks {
  ONBOARDING = 'ONBOARDING',
  BOTTOM_TABS = 'BOTTOM_TABS',
}

export enum TabsStacks {
  HOME = 'HOME',
  PROFILE = 'PROFILE',
}

export type AppStackParamList = {
  BOTTOM_TABS: NavigatorScreenParams<TabsStackParamList> | undefined
} & {
  [K in Exclude<keyof typeof AppStacks, 'BOTTOM_TABS'>]: undefined
}
export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

export type TabsStackParamList = {
  [K in keyof typeof TabsStacks]: undefined
}
export type TabsStackScreenProps<T extends keyof TabsStackParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabsStackParamList, T>,
  AppStackScreenProps<keyof typeof AppStacks>
>

export type RootStacks = AppStacks | TabsStacks
export type RootStackParamList = Prettify<AppStackParamList & TabsStackParamList>
export type RootStackScreenProps<T extends keyof RootStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, T>,
  BottomTabScreenProps<TabsStackParamList>
>
```

```tsx [AppNavigator.tsx]
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack'
import { AppStacks, AppStackParamList, AppStackScreenProps } from './types'
import { OnboardingScreen } from '../pages'
import TabsNavigator from './TabsNavigator'

interface AppScreenOptions {
  title: string
  component: React.FC<AppStackScreenProps<AppStacks>>
  options: NativeStackNavigationOptions
}

const AppScreens: Record<AppStacks, AppScreenOptions> = {
  [AppStacks.BOTTOM_TABS]: {
    title: 'BottomTabs',
    component: TabsNavigator,
    options: {
      headerShown: false, // 隐藏tabbar屏幕的导航栏
    },
  },
  [AppStacks.ONBOARDING]: {
    title: 'Onboarding',
    component: OnboardingScreen,
    options: { headerShown: false },
  },
}
const AppStack = createNativeStackNavigator<AppStackParamList>()
export default () => {
  return (
    <AppStack.Navigator
      initialRouteName={AppStacks.ONBOARDING}
      screenOptions={() => {
        return { gestureEnabled: false }
      }}
    >
      {Object.entries(AppScreens).map(([key, value]) => (
        <AppStack.Screen
          key={key}
          name={key as AppStacks}
          component={value.component}
          options={() => {
            return {
              title: value.title,
              headerTitleAlign: 'center',
              ...(value.options || {}),
            }
          }}
        />
      ))}
    </AppStack.Navigator>
  )
}
```

```tsx [TabsNavigator.tsx]
import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { TabsStacks, TabsStackParamList, TabsStackScreenProps } from './types'
import { HomeScreen, ProfileScreen } from '../pages'

interface TabScreenOptions {
  title: string
  component: React.FC<TabsStackScreenProps<TabsStacks>>
  options: BottomTabNavigationOptions
}

const TabScreens: Record<TabsStacks, TabScreenOptions> = {
  [TabsStacks.HOME]: {
    title: 'Home',
    component: HomeScreen,
    options: {},
  },
  [TabsStacks.PROFILE]: {
    title: 'Profile',
    component: ProfileScreen,
    options: {},
  },
}
const Tabs = createBottomTabNavigator<TabsStackParamList>()
export default () => {
  return (
    <Tabs.Navigator
      initialRouteName={TabsStacks.HOME}
      screenOptions={() => {
        return {
          headerShown: false,
        }
      }}
    >
      {Object.entries(TabScreens).map(([key, value]) => (
        <Tabs.Screen
          key={key}
          name={key as TabsStacks}
          component={value.component}
          options={() => {
            return {
              tabBarLabel: value.title,
              headerTitleAlign: 'center',
              ...(value.options || {}),
            }
          }}
        ></Tabs.Screen>
      ))}
    </Tabs.Navigator>
  )
}
```

:::
