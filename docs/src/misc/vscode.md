# 我的 VSCode 常用插件

## Vue 插件

- [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur) 是一款为 Vue2 编写的语法高亮、自动完成、格式化、错误检查等功能的插件。注意，次此插件与 **Vue Language Features (Volar)** 存在冲突，不能同时启用，如果是 Vue2 项目时建议禁用 **Vue Language Features (Volar)**
- [Vue VSCode Snippets](https://marketplace.visualstudio.com/items?itemName=sdras.vue-vscode-snippets) 是一款快速生成 Vue 代码片段的插件，支持 Vue2 和 Vue3
- [Vue Language Features (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 是一款为 Vue3 编写的语法高亮、自动完成、格式化、错误检查等功能的插件。注意，次此插件与 **Vetur** 存在冲突，不能同时启用，如果是 Vue3 项目时建议禁用 **Vetur**
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) 是一款用于支持在 Typescript 中`import *.vue`文件的插件，此插件建议配合 **Vue Language Features (Volar)** 一起使用

## uni-app 插件

- [uni-create-view](https://marketplace.visualstudio.com/items?itemName=mrmaoddxxaa.create-uniapp-view) 此插件可以快捷创建 uni-app 页面并添加到 pages.json，也可以快速创建 uni-app 组件
- [uni-helper](https://marketplace.visualstudio.com/items?itemName=uni-helper.uni-helper-vscode) 是一款增强 uni-app 系列产品在 VSCode 内的开发体验的插件，此插件其实是以下五个插件的扩展包
  - [uni-app-schemas](https://marketplace.visualstudio.com/items?itemName=uni-helper.uni-app-schemas-vscode) 校验 uni-app 中的 androidPrivacy.json、pages.json 和 manifest.json 格式
  - [uni-app-snippets](https://marketplace.visualstudio.com/items?itemName=uni-helper.uni-app-snippets-vscode) 提供 uni-app 基本能力代码片段
  - [uni-cloud-snippets](https://marketplace.visualstudio.com/items?itemName=uni-helper.uni-cloud-snippets-vscode) 提供 uni-cloud 基本能力代码片段
  - [uni-ui-snippets](https://marketplace.visualstudio.com/items?itemName=uni-helper.uni-ui-snippets-vscode) 提供 uni-ui 基本能力代码片段
  - [uni-highlight](https://marketplace.visualstudio.com/items?itemName=uni-helper.uni-highlight-vscode) 在 VSCode 中对条件编译的代码注释部分提供了语法高亮

## React 插件

- [Simple React Snippets](https://marketplace.visualstudio.com/items?itemName=burkeholland.simple-react-snippets) 一款快速生成 React 代码片段的插件，不支持 Redux 和 RN
- [ES7+ React/Redux/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets) 也是一款快速生成 React 代码片段的插件，支持 Redux 和 RN，此插件相当于补足了 **Simple React Snippets** 的缺失部分
- [VSCode React Refactor](https://marketplace.visualstudio.com/items?itemName=planbcoding.vscode-react-refactor) 可以快速的对选择的代码段落进行提取重构
- [react-taro-snippets](https://marketplace.visualstudio.com/items?itemName=liulei.react-taro-snippets) 一款快速生成 Taro 页面代码片段的插件，支持 ts
- [Antd Rush](https://marketplace.visualstudio.com/items?itemName=fi3ework.vscode-antd-rush) 此插件可以为 Ant Design 组件及属性显示对应官方文档
- [vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=styled-components.vscode-styled-components) 在 React 开发生态中提供 CSS in JS 解决方案的`styled-components`的官方插件

## React Native 插件

- [React Native Tools](https://marketplace.visualstudio.com/items?itemName=msjsdiag.vscode-react-native) 微软官方专门为 RN 在 VSCode 在中进行调试而开发的插件
- [Expo Tools](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools) RN 的社区版脚手架`create-expo-app`在 VSCode 中的官方插件

## CSS 插件

- [Autoprefixer](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-autoprefixer) 为 CSS 代码快速生成浏览器厂商前缀
- [CSS Peek](https://marketplace.visualstudio.com/items?itemName=pranaygp.vscode-css-peek) 快速查看项目中的 CSS 类名定义
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) CSS 代码风格校验插件
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) TailwindCSS 的官方插件

## HTML 插件

- [Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag) 标签自动闭合
- [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag) 标签对自动改名
- [Highlight Matching Tag](https://marketplace.visualstudio.com/items?itemName=vincaslt.highlight-matching-tag) 标签对高亮显示
- [HTML CSS Support](https://marketplace.visualstudio.com/items?itemName=ecmel.vscode-html-css) HTML 标签的 id 和 class 属性增强提示插件
- [IntelliSense for CSS class names in HTML](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion) 智能感知项目中的 CSS 类名，并在 HTML 文件中进行提示
- [WXML - Language Service](https://marketplace.visualstudio.com/items?itemName=qiu8310.minapp-vscode) 微信原生小程序的 .wxml 文件代码高亮，标签、属性的智能补全

## JS/TS 插件

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) JS 代码风格校验插件
- [JavaScript Snippet Pack](https://marketplace.visualstudio.com/items?itemName=akamud.vscode-javascript-snippet-pack) 快速生成 JS 代码片段，不支持 ES6
- [JavaScript (ES6) code snippets](https://marketplace.visualstudio.com/items?itemName=xabikos.JavaScriptSnippets) 快速生成 JS 代码片段，支持 ES6
- [jQuery Code Snippets](https://marketplace.visualstudio.com/items?itemName=donjayamanne.jquerysnippets) 快速生成 jQuery 代码片段
- [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) NodeJS 社区中的下一代 ORM 框架 Prisma 的官方插件，提供语法高亮、自动完成、格式化、错误检查等功能
- [Paste JSON as Code](https://marketplace.visualstudio.com/items?itemName=quicktype.quicktype) 根据 json 数据快速生成对应的类型声明，除了 JS 以外还支持其他众多开发语言
- [Code Runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner) 快速运行代码片段在终端中查看输出结果，除了 JS 以外还支持其他众多开发语言
- [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens) 错误提示增强
- [Node.js Modules Intellisense](https://marketplace.visualstudio.com/items?itemName=leizongmin.node-module-intellisense) 智能感知 NodeJs 模块，并在 import 或 require 的时候进行提示
- [npm Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense) 智能感知`node_modules`文件夹中的模块，并在 import 或 require 的时候进行提示
- [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost) 显示所导入的 npm 模块的大小

## Flutter 插件

- [Dart](https://marketplace.visualstudio.com/items?itemName=Dart-Code.dart-code) Dart 官方插件，支持 Dart 编程语言，并提供用于有效编辑、重构、运行和重新加载 Flutter 移动应用程序的工具
- [Dart (Syntax Highlighting Only)](https://marketplace.visualstudio.com/items?itemName=oscarcs.dart-syntax-highlighting-only) Dart 代码语法高亮提示
- [Dart Data Class Generator](https://marketplace.visualstudio.com/items?itemName=hzgood.dart-data-class-generator) Dart 数据模型生成器
- [Flutter](https://marketplace.visualstudio.com/items?itemName=Dart-Code.flutter) 提供在 VSCode 中编写和调试 Flutter 的支持
- [Flutter Widget Snippets](https://marketplace.visualstudio.com/items?itemName=alexisvt.flutter-snippets) 快速生成 Flutter 代码片段
- [Pubspec Assist](https://marketplace.visualstudio.com/items?itemName=jeroen-meijer.pubspec-assist) Dart 和 Flutter 的依赖管理器

## PHP 插件

- [PHP Intelephense](https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client) PHP 代码智能提示
- [PHP Server](https://marketplace.visualstudio.com/items?itemName=brapifra.phpserver) 启动一个本地的 PHP 服务器
- [phpfmt - PHP formatter](https://marketplace.visualstudio.com/items?itemName=kokororin.vscode-phpfmt) PHP 代码格式化插件
- [PHP DocBlocker](https://marketplace.visualstudio.com/items?itemName=neilbrayfield.php-docblocker) 快速生成 PHP 代码注解
- [PHP Debug](https://marketplace.visualstudio.com/items?itemName=xdebug.php-debug) 提供在 VSCode 中调试 PHP 代码的支持

## Git 插件

- [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph) 主要是用来显示`git log`
- [GitLens — Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) 可以将各种常用的`git`命令通过 GUI 进行操作

## Markdown 插件

- [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)
- [Markdown Preview Enhanced](https://marketplace.visualstudio.com/items?itemName=shd101wyy.markdown-preview-enhanced) markdown 预览效果增强插件
- [markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) markdown 语法校验插件

## 前端开发通用插件

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) 代码格式化插件
- [any-rule](https://marketplace.visualstudio.com/items?itemName=russell.any-rule) 正则表达式大全
- [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments) 注释增强和美化插件
- [change-case](https://marketplace.visualstudio.com/items?itemName=wmaurer.change-case) 快速转换变量名的命名风格
- [Color Highlight](https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight) 颜色值高亮可视化插件
- [Color Picker](https://marketplace.visualstudio.com/items?itemName=anseki.vscode-color) 在色谱中快速选择颜色的插件
- [DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv) .env 环境变量配置文件的高亮显示
- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) 在不同编辑器和 IDE 中，对项目中的代码文件的编码格式进行统一
- [Image preview](https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-gutter-preview) 通过图片的引入路径显示预览缩略图
- [Image Sprites](https://marketplace.visualstudio.com/items?itemName=gurayyarar.imagesprites) 不需要找 UI 也能合成精灵图
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) 启动一个本地服务器
- [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense) 在项目中自动补全文件路径名的插件
- [Regex Previewer](https://marketplace.visualstudio.com/items?itemName=chrmarti.regex) 快速检验正在表达式
- [SVG](https://marketplace.visualstudio.com/items?itemName=jock.svg) 在 VSCode 中编辑 SVG 文件和各种增强功能
- [SVG Previewer](https://marketplace.visualstudio.com/items?itemName=vitaliymaz.vscode-svg-previewer) SVG 文件预览
- [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) 在 VSCode 中进行 API 接口调试
- [vscode-faker](https://marketplace.visualstudio.com/items?itemName=deerawan.vscode-faker) 快速生成用例数据

## 其他

- [Chinese (Simplified) (简体中文) Language Pack for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-zh-hans) VSCode 中文汉化包
- [CodeGeeX: AI Code AutoComplete, Chat, Auto Comment](https://marketplace.visualstudio.com/items?itemName=aminer.codegeex) 一款国产的 AI 语言模型
- [Dracula Official](https://marketplace.visualstudio.com/items?itemName=dracula-theme.theme-dracula) VSCode 主题插件
- [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme) 根据项目中的文件后缀名或文件夹名字自动显示图标
- [IntelliCode](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode) 微软官方的智能代码提示
- [Lorem ipsum](https://marketplace.visualstudio.com/items?itemName=Tyriar.lorem-ipsum) 快速生成假文，由于 VSCode 内置的假文功能只支持 HTML 文件，而此插件可以用于各种文件
- [Project Manager](https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager) 项目管理器
- [Partial Diff](https://marketplace.visualstudio.com/items?itemName=ryu1kn.partial-diff) 文本对比插件
- [SFTP](https://marketplace.visualstudio.com/items?itemName=Natizyskunk.sftp) 在 VSCode 中使用 SFTP 上传文件到服务器
- [Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree) TODO 高亮提示
- [YAML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) .yaml 文件代码高亮提示
- [Remote Repositories](https://marketplace.visualstudio.com/items?itemName=ms-vscode.remote-repositories) 此插件是配合`Azure Repos`和`GitHub Repositories`使用的
  - [Azure Repos](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azure-repos) 在 VSCode 中快速浏览和搜索任何远程 Azure 存储库
  - [GitHub Repositories](https://marketplace.visualstudio.com/items?itemName=GitHub.remotehub) 在 VSCode 中快速浏览、搜索、编辑和提交到任何远程 GitHub 存储库
- [Remote Explorer](https://marketplace.visualstudio.com/items?itemName=ms-vscode.remote-explorer) 远程资源管理器
  - [Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) 在 VSCode 中使用 SSH 连接服务器
  - [Remote - SSH: Editing Configuration Files](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh-edit) 在 VSCode 中通过 SSH 连接远端服务器作为开发环境
- [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) Docker 官方插件，提供在 VSCode 中管理镜像和容器的功能
- [WSL](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) VSCode 的微软官方 WSL 插件
- [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) 提供在 Docker 容器中进行开发的能力

## 我的 VSCode 用户配置

::: details 查看
<<< ./assets/vscode.settings.json
:::
