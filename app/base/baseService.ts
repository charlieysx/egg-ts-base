import { Service, Context } from 'egg';

/**
 * 封装base控制器
 * 提供一些公共的方法
 */
export default class BaseService extends Service {
    constructor(ctx: Context) {
        super(ctx);
    }
}
