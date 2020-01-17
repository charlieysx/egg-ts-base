# egg-ts接口开发脚手架

## 介绍
[egg+typescript搭建后端项目](http://codebear.cn/article?id=4wtB6uVZm6l2pVJbasAKRW)

## 功能
- 支持自动配置路由（根据目录路径以及装饰器注入）
- 一键生成路由和service文件
- 支持多数据库model配置（自动生成x.d.ts文件）
- 支持多redis配置
- 支持路径别名，拒绝长长的`../../../`引入


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

## 路由生成规则

### 写法
以前的写法
```
创建controller文件
创建xx方法
...
router.get('/test', xxx, controller.xx.xx)
...
```

现在的写法

只需要一句ARouter(app);配合装饰器即可自动生成路由。
```
// router.ts文件：
export default (app: Application) => {
    // 自动注入路由
    ARouter(app);
};
// app/controller路径下创建文件or目录：
controller
    |
    example
    |   |
    |   index.ts
    |   |   |
    |   |   @GET('/test')
    |   |   test()      // 生成路由 '/example/test'
    |   |
    |   test.tx
    |       |
    |       @GET('/test')
    |       test()      // 生成路由 '/example/test/test'
    |       |
    |       @GET('/test2/:id')
    |       |
    |       test2()     // 生成路由 '/example/test/test2/:id'
    |
    index.ts
        |
        @GET('/index')
        test()      // 生成路由 '/index'

``` 

### 支持的装饰器
@GET、@POST、@PUT、@DEL、@PATCH、@ALL

脚手架额外提供常用装饰器
```
Query             用于过滤get参数
Params            用于过滤post参数
Path              用于过滤路径里的参数
File              用于过滤文件
Headers           用于过滤headers
-----------------
以下是配合上面的装饰器使用，设置参数规则
-----------------
NotNull           
Int
Float
Time
Arr
Bool
ObjContain
ArrContain
Min
Max
Allow
String
```
使用方法(具体可参考app/controller/example目录下的文件)
```
@GET('/test')
@authUser() // 权限验证
@Query({
    a: [NotNull, Int]
    b: [Int.Default(1)]
})
public async test() {
    const {
        service: { test },
        filterQuery: { a, b }
    } = this.ctx;
    this.returnSuccess(await test.test.showData());
}

@POST('/testPost')
@Query({
    ga: [ NotNull ] // query中的ga不能为空
})
@Params({
    pa: [ Int, Min(0), Max(5) ], // params中的pa必须为整型且最小0最大5
    time: [ Time('YYYY-MM-DD') ], // 日期格式化
    arr: [ Arr ], // arr必须为数组
    arrContain: [ ArrContain({ // arrContain必须为数组，且数组中的每一项都必须包含a、b
        a: [ Int.Default(3) ], // a为整型，如果不是，会设置默认值3
        b: [ Float ]
    }) ],
    arrContain2: [ ArrContain([ Int ]) ],
    obj: [ ObjContain({ // obj中必须包含a、b
        a: [ Int.Default(3) ],
        b: [ Float ]
    }) ],
    allow: [ Allow([ 1, 2 ]) ], // allow只允许传1或2
    allowDefault: [ Allow([ 1, 2 ]).Default(1) ] // allowDefault只允许传1或2，传其他值会自动设置为1
})
public async testPost() {
    const {
        filterQuery: { ga },
        filterParams: {
            pa,
            time,
            arr,
            arrContain,
            arrContain2,
            obj,
            allow,
            allowDefault
        }
    } = this.ctx;
    // this.ctx.request.body 可以取出原始的post值
    this.returnSuccess({
        ga,
        pa,
        time,
        arr,
        arrContain,
        arrContain2,
        obj,
        allow,
        allowDefault
    });
}
```