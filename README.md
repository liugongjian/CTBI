# front-common-framework

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Run your unit tests

```
yarn test:unit
```

### Lints and fixes files

```
yarn lint
```

# 目录结构

├── mock # 项目 mock 模拟数据
├── public # 静态资源
│ │── favicon.ico # favicon 图标
│ └── index.html # html 模板
├── src # 源代码
│ ├── api # 所有请求
│ ├── assets # 主题 字体等静态资源
│ ├── components # 全局公用组件
│ ├── config # 全局公用配置
│ ├── dialogs # 弹窗组件
│ ├── filters # 全局 filter
│ ├── icons # 项目所有 svg icons
│ ├── layout # 全局 layout
│ ├── router # 路由
│ ├── store # 全局 store 管理
│ ├── styles # 全局样式
│ ├── utils # 全局公用方法
│ ├── views # views 所有页面
│ ├── App.vue # 入口页面
│ └── main.js # 入口文件 加载组件 初始化等
├── tests # 测试
├── .env.xxx # 环境变量配置
├── .eslintrc.js # eslint 配置项
├── .babelrc # babel-loader 配置
├── .travis.yml # 自动化 CI 配置
├── vue.config.js # vue-cli 配置
├── postcss.config.js # postcss 配置
└── package.json # package.json

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
