# 版本

| 工具       | 版本     |
| ---------- | -------- |
| node       | ^18.19.3 |
| vue        | ^3.2.45  |
| vite       | ^4.1.4   |
| typescript | ^4.9.4   |

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
| src/main.ts      | 资源入口文件         |
| src/pages.ts     | 页面配置文件         |
| src/env.d.ts     | 环境变量类型声明文件 |
| .env.development | 开发环境变量         |
| .env.productino  | 生产环境变量         |
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
