import { Controller } from 'egg';

/**
 * 封装base控制器
 * 提供一些公共的方法
 */
export default class BaseController extends Controller {
    /**
     * 这是在自动创建路由时用到的。
     */
    static aRouterGetName() {
        return this.name;
    }

    /**
     * 返回成功
     * @param data 返回的数据
     * @param customBody 是否是自定义返回格式（默认否，true的话，不会封装payload，直接返回data）
     */
    protected returnSuccess(data: any, customBody: boolean = false) {
        if (customBody) {
            this.ctx.customBody = true;
        }
        if (data === null || data === undefined) {
            data = {};
        }
        this.ctx.body = data;
    }
}
