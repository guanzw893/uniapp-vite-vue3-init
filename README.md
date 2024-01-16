# 版本

| 工具                                               | 版本     |
| -------------------------------------------------- | -------- |
| [node](https://nodejs.org/)                        | ^18.19.3 |
| [vue](https://cn.vuejs.org/)                       | ^3.2.45  |
| [pinia](https://pinia.vuejs.org/)                  | ^2.0.33  |
| [vite](https://cn.vitejs.dev)                      | ^4.1.4   |
| [uv-ui](https://www.uvui.cn/components/intro.html) | ^1.1.18  |
| [typescript](https://www.typescriptlang.org/)      | ^4.9.4   |

# 安裝依賴包

```sh
npm install
```

## 目录结构

| 目录             | 详情                 |
| ---------------- | -------------------- |
| src              | 源文件夹             |
| src/pages        | 页面文件夹           |
| src/static       | 静态文件夹           |
| src/stores       | 状态管理仓库         |
| src/utils        | 工具文件夹           |
| src/main.ts      | 资源入口文件         |
| src/pages.json   | 页面配置文件         |
| src/env.d.ts     | 环境变量类型声明文件 |
| src/uni.scss     | 全局 scss 文件       |
| .env.development | 开发环境变量         |
| .env.productino  | 生产环境变量         |
| .eslintrc.js     | eslint 配置文件      |
| .prettierrc      | 格式化文件           |
| index.html       | 入口文件             |
| dist/dev         | 开发编译打包文件     |
| dist/build       | 生产编译打包文件     |

## 项目启动

```sh
# 启动微信小程序
npm run dev:mp-weixin
```

> 手动使用微信开发者工具导入`/dist/dev/mp-weixin`查看开发效果

## 打包

```sh
npm run build:mp-weixin
```

> 手动使用微信开发者工具导入`/dist/build/mp-weixin`查看打包效果

## 规范

### 组件创建

```
<file_dir>/<component-name>/index.vue
```

### 提交规范

| type     | subject                                   |
| -------- | ----------------------------------------- |
| feat     | 新功能 feature                            |
| fix      | 修复 bug                                  |
| docs     | 文档注释                                  |
| style    | 代码格式(不影响代码运行的变动)            |
| refactor | 重构、优化(既不增加新功能，也不是修复bug) |
| perf     | 性能优化                                  |
| test     | 增加测试                                  |
| chore    | 构建过程或辅助工具的变动                  |
| revert   | 回退                                      |
| build    | 打包                                      |

```sh
<type>(<scope>): <subject>
```
