# egg-ts接口开发脚手架

## 功能
1. 支持自动配置路由（根据目录路径以及装饰器注入）
2. 一键生成路由和service文件
3. 支持多数据库model配置（自动生成x.d.ts文件）
4. 支持多redis配置
5. 支持路径别名，拒绝长长的`../../../`引入


## 本地开发

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

## 发布

```bash
$ npm run ci
$ npm start
```

## 使用说明
- 使用`npm run new`命令可以创建路由和service文件
- 使用`npm run ets`命令可以自动生成x.d.ts文件
- 数据库model支持配置多个，在config/config.[env].ts文件里面配，
  同时为了ts识别，需要配置下x.d.ts文件，这里如果新增一个model目录，就在tshelper.js里面，新增一个对应的映射关系
  ```
  watchDirs: {
      model: {
          directory: 'app/model',
          modelMap: {
              test: 'testModel', // key为目录名，value为前面config里设置的对应的delegate
              test2: 'test2Model'
          },
          generator: selfGenerator
      }
  }
  ```
- 使用`npm run ci`命令可以构建生成环境代码，会在每个ts同级目录下生成js文件，egg运行时会优先加载js文件
- 使用`npm run clean`命令可以清除前面生成的js文件
