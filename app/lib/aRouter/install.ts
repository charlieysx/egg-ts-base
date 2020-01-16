/**
 * 封装路由中间件装饰器注入，支持class和methods
 */
export default (target: any, value: any, des: PropertyDescriptor & ThisType<any> | undefined, fn: Function) => {
    // 没有value，说明是作用于class
    if (value === undefined) {
        const middlewares = target.prototype._middlewares;
        if (!middlewares) {
            target.prototype._middlewares = { all: [ fn ] };
        } else {
            target.prototype._middlewares.all.push(fn);
        }
    } else {
        const source = target.constructor.prototype;
        if (!source._middlewares) {
            source._middlewares = { all: [] };
        }
        const middlewares = source._middlewares;
        if (middlewares[value]) {
            middlewares[value].push(fn);
        } else {
            middlewares[value] = [ fn ];
        }
    }
};
