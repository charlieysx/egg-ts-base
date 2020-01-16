import { Application, Context, Router } from 'egg';
import install from './install';
import error from '../../util/error';
import { EggFile } from 'egg-multipart';
const moment = require('moment');

/**
 * 路由注入
 */
class ARouterHelper {
    /**
     * 临时存放controller以及路由
     */
    controllers: {
        [key: string]: {
        prefix?: string, // 前缀
        target?: any, // 对应的class
        routers: Array<{ // controller下的路由
            handler: string, // 方法名
            path: string, // 路由路径
            method: RequestMethods // 请求方法
        }>
    }} = {};

    /**
     * 注入路由
     * @param router egg的路由
     */
    public injectRouter(router: Router) {
        const keys = Object.keys(this.controllers);
        keys.forEach(key => {
            const controller = this.controllers[key];
            controller.routers.forEach(r => {
                // 以前的写法是router.get('/xxx', xxx, controller.xxx.xxx);
                // 这里直接批量注入，controller.prefix + r.path拼接公共前缀于路由路径
                router[r.method](controller.prefix + r.path, async (ctx: Context) => {
                    // 得到class实例
                    const instance = new controller.target(ctx);
                    // 获取class中使用的装饰器中间件
                    const middlewares = controller.target.prototype._middlewares;
                    if (middlewares) {
                        // all是绑定在class上的，也就是下面所有的方法都需先经过all中间件
                        const all = middlewares.all;
                        for (let i = 0; i < all.length; ++i) {
                            const func = all[i];
                            await func(ctx);
                        }
                        // 这是方法自带的中间件
                        const self = middlewares[r.handler] || [];
                        for (let i = 0; i < self.length; ++i) {
                            const func = self[i];
                            await func(ctx);
                        }
                    }
                    // 经过了所有中间件，最后才真正执行调用的方法
                    await instance[r.handler]();
                });
            });
        });
    }
}

const aRouterHelper = new ARouterHelper();

enum RequestMethods {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
    ALL = 'all',
    PATCH = 'patch'
}

/**
 * controller装饰器
 * @param prefix 前缀
 */
function AController (prefix: string) {
    prefix = prefix ? prefix.replace(/\/+$/g, '') : '/';
    if (prefix === '/') {
        prefix = '';
    }
    return (target: any) => {
        // 获取class名
        const key = target.aRouterGetName();
        if (!aRouterHelper.controllers[key]) {
            aRouterHelper.controllers[key] = {
                target,
                prefix,
                routers: []
            };
        } else {
            aRouterHelper.controllers[key].target = target;
            aRouterHelper.controllers[key].prefix = prefix;
        }
    };
}

/**
 * 路由装饰器
 * @param path 路径
 * @param method 请求方法（get，post等）
 */
function request(path: string, method: RequestMethods) {
    return function (target: any, value: any, des: PropertyDescriptor & ThisType<any>) {
        const key = target.constructor.toString().split(' ')[1];
        if (!aRouterHelper.controllers[key]) {
            aRouterHelper.controllers[key] = {
                routers: []
            };
        }
        aRouterHelper.controllers[key].routers.push({
            handler: value,
            path,
            method
        });
    };
}

function POST (path: string) {
    return request(path, RequestMethods.POST);
}

function GET (path: string) {
    return request(path, RequestMethods.GET);
}

function PUT (path: string) {
    return request(path, RequestMethods.PUT);
}

function DEL (path: string) {
    return request(path, RequestMethods.DELETE);
}

function ALL (path: string) {
    return request(path, RequestMethods.ALL);
}

function PATCH (path: string) {
    return request(path, RequestMethods.PATCH);
}

/**
 * 处理并获取对象中的值
 * @param source 原对象
 * @param opt 配置，{a: [func1, func2], ...}这样的数据，最后结果是source[a]=func2(func1(source[a]))，funcx中可以直接抛错误。
 */
function getValue (source: any, opt: {[key: string]: Function[]}) {
    const keys = Object.keys(opt);
    const result = {};
    for (let i = 0; i < keys.length; ++i) {
        const funcList = opt[keys[i]] || [];
        let dealResult = source[keys[i]];
        [ (value: any, key: string) => value, ...funcList ].forEach(func => (dealResult = func(dealResult, keys[i])));
        result[keys[i]] = dealResult;
    }
    return result;
}

/**
 * 过滤get参数
 * @param opt 配置
 */
function Query (opt: {[key: string]: Function[]}) {
    return (target: any, value?: any, des?: PropertyDescriptor & ThisType<any> | undefined) => {
        return install(target, value, des, async (ctx: Context) => {
            ctx.filterQuery = getValue(ctx.query, opt);
        });
    };
}

/**
 * 过滤post参数
 * @param opt 配置
 */
function Params (opt: {[key: string]: Function[]}) {
    return (target: any, value?: any, des?: PropertyDescriptor & ThisType<any> | undefined) => {
        return install(target, value, des, async (ctx: Context) => {
            ctx.filterParams = getValue(ctx.request.body, opt);
        });
    };
}

/**
 * 过滤路径上的参数
 * @param opt 配置
 */
function Path (opt: {[key: string]: Function[]}) {
    return (target: any, value?: any, des?: PropertyDescriptor & ThisType<any> | undefined) => {
        return install(target, value, des, async (ctx: Context) => {
            ctx.filterPath = getValue(ctx.params, opt);
        });
    };
}

function NotNull (value: any, key: string) {
    if (value === '' || value === undefined || value === null) {
        throw error.GENERAL.PARAM_ERROR(`${key} 不能为空`);
    }
    return value;
}

function Int (value: any, key: string) {
    const regPos = /^-?[0-9]\d*$/;
    if (regPos.test(value)) {
        return +value;
    }
    throw error.GENERAL.PARAM_ERROR(`${key} 必须为整型`);
}

Int.Default = function (defaultValue: number) {
    return (value: any, key: string) => {
        try {
            return this(value, key);
        } catch (e) {
            return defaultValue;
        }
    };
};

function String (value: any, key: string) {
    if (typeof value === 'string') {
        return value;
    }
    throw error.GENERAL.PARAM_ERROR(`${key} 必须为字符串`);
}

String.Default = function (defaultValue: number) {
    return (value: any, key: string) => {
        try {
            return this(value, key);
        } catch (e) {
            return defaultValue;
        }
    };
};

function Float (value: any, key: string) {
    const regPos = /^\d+(\.\d+)?$/; // 非负浮点数
    const regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; // 负浮点数
    if (regPos.test(value) || regNeg.test(value)) {
        return +value;
    }
    throw error.GENERAL.PARAM_ERROR(`${key} 必须为浮点数`);
}

Float.Default = function (defaultValue: number) {
    return (value: any, key: string) => {
        try {
            return this(value, key);
        } catch (e) {
            return defaultValue;
        }
    };
};

function Time (format: string = '') {
    return (value: any, key: string) => {
        try {
            if (!moment(value).isValid()) {
                throw error.GENERAL.PARAM_ERROR(`${key} 必须为有效日期`);
            }
        } catch (e) {
            throw error.GENERAL.PARAM_ERROR(`${key} 必须为有效日期`);
        }
        if (!format) {
            return moment(value).utcOffset(480);
        }
        return moment(value).utcOffset(480).format(format);
    };
}

function isArray(value: any) {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(value);
    }
    return Object.prototype.toString.call(value) === '[object Array]';
}

function Arr (value: any, key: string) {
    if (!isArray(value)) {
        throw error.GENERAL.PARAM_ERROR(`${key} 必须为数组`);
    }
    return value;
}

function Bool (value: any) {
    return Boolean(value) && !(/^(false)$/i).test(value);
}

function ObjContain (opt: {[key: string]: Function[]}) {
    return (value: any, key: string) => {
        if (typeof value !== 'object' || value === null) {
            throw error.GENERAL.PARAM_ERROR(`${key} 必须为对象`);
        }
        const keys = Object.keys(opt);
        const result = {};
        for (let i = 0; i < keys.length; ++i) {
            const funcList = opt[keys[i]] || [];
            let dealResult = value[keys[i]];
            [ (val: any) => val, ...funcList ].forEach(func => (dealResult = func(dealResult, `${key}的${keys[i]}`)));
            result[keys[i]] = dealResult;
        }
        return result;
    };
}

function ArrContain (opt: {[key: string]: Function[]} | Function[]) {
    return (value: any, key: string) => {
        value = Arr(value, key);
        const result: any[] = [];
        if (Array.isArray(opt)) {
            for (let i = 0; i < value.length; ++i) {
                let item = value[i];
                [ (val: any) => val, ...opt ].forEach(func => (item = func(item, `${key}数组每项`)));
                result.push(item);
            }
        } else {
            const keys = Object.keys(opt);
            for (let i = 0; i < value.length; ++i) {
                const obj = {};
                const item = value[i];
                for (let j = 0; j < keys.length; ++j) {
                    const funcList = opt[keys[j]] || [];
                    let dealResult = item[keys[j]];
                    [ (val: any) => val, ...funcList ].forEach(func => (dealResult = func(dealResult, `${key}数组每项的${keys[j]}`)));
                    obj[keys[j]] = dealResult;
                }
                result.push(obj);
            }
        }
        return result;
    };
}

function Allow (arr: any[]) {
    arr = Arr(arr, 'allow');
    const fn = function (value: any, key: string) {
        let result = false;
        for (let i = 0; i < arr.length; ++i) {
            const val = arr[i];
            if (typeof val === 'function') {
                result = val(value);
            } else {
                result = (val === value);
            }
            if (result) {
                break;
            }
        }
        if (!result) {
            throw error.GENERAL.PARAM_ERROR(`${key} 只能取${JSON.stringify(arr)}中的值`);
        }
        return value;
    };
    fn.Default = function (defaultValue: any) {
        return (value: any, key: string) => {
            try {
                return fn(value, key);
            } catch (e) {
                return defaultValue;
            }
        };
    };
    return fn;
}

function Min (min: number) {
    const fn = function (value: any, key: string) {
        if (value < min) {
            throw error.GENERAL.PARAM_ERROR(`${key} 最小为${min}`);
        }
        return value;
    };
    fn.Default = function(defaultValue: number) {
        return (value: any, key: string) => {
            try {
                return fn(value, key);
            } catch (e) {
                return defaultValue;
            }
        };
    };
    return fn;
}

function Max (max: number) {
    const fn = function (value: any, key: string) {
        if (value > max) {
            throw error.GENERAL.PARAM_ERROR(`${key} 最大为${max}`);
        }
        return value;
    };
    fn.Default = function(defaultValue: number) {
        return (value: any, key: string) => {
            try {
                return fn(value, key);
            } catch (e) {
                return defaultValue;
            }
        };
    };
    return fn;
}

function Headers (opt: {[key: string]: Function[]}) {
    return (target: any, value?: any, des?: PropertyDescriptor & ThisType<any> | undefined) => {
        return install(target, value, des, async (ctx: Context) => {
            ctx.filterHeaders = getValue(ctx.headers, opt);
        });
    };
}

function File (name: string, funcList: Function[] = []) {
    return (target: any, value?: any, des?: PropertyDescriptor & ThisType<any> | undefined) => {
        return install(target, value, des, async (ctx: Context) => {
            let dealResult: any = null;
            if (ctx.request.files) {
                const file = ctx.request.files.find((item: EggFile) => item.field === name);
                dealResult = file;
                [ (val: any) => val, ...funcList ].forEach(func => (dealResult = func(dealResult, `${name}文件`)));
            }
            ctx.filterFile = { file: dealResult };
        });
    };
}

/**
 * 抛出hwrouter，在router.ts中直接使用ARouter(app);即可完成自动注入路由
 * @param app application
 * @param options 参数，目前只有prefix，就是所有路由的前缀
 */
export function ARouter(app: Application, options?: {prefix?: string}) {
    const { router } = app;
    if (options && options.prefix) {
        router.prefix(options.prefix);
    }
    aRouterHelper.injectRouter(router);
}

export {
    AController,
    POST,
    GET,
    PUT,
    DEL,
    PATCH,
    ALL,
    Query,
    Params,
    NotNull,
    Int,
    Float,
    Time,
    Arr,
    Bool,
    ObjContain,
    ArrContain,
    Min,
    Max,
    Allow,
    String,
    Path,
    File,
    Headers
};
