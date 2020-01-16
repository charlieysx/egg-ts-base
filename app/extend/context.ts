import error from '../util/error';
import redisKey from '../util/redisKey';
import { Context } from 'egg';
import monk from 'monk';
import sessionKey from '../util/sessionKey';

/**
 * 扩展context
 */
export default {
    /**
     * 将error挂载到ctx上，
     * 就可以直接使用ctx.customError.xxx.xxx
     */
    get customError() {
        return error;
    },
    get redisKey() {
        return redisKey;
    },
    get sessionKey() {
        return sessionKey;
    },
    async monk(this: Context, fn: Function) {
        const database = (this.app.config.monk && this.app.config.monk.database) || '';
        const db = monk(database);
        await fn(db);
        db.close();
    },
    log(this: Context, msg: any, ...args: any[]) {
        console.log(msg, ...args);
    },
    logI(this: Context, msg: any, ...args: any[]) {
        this.logger.info(msg, ...args);
        console.info(msg, ...args);
    },
    logW(this: Context, msg: any, ...args: any[]) {
        this.logger.warn(msg, ...args);
        console.warn(msg, ...args);
    },
    logE(this: Context, msg: any, ...args: any[]) {
        this.logger.error(msg, ...args);
        console.error(msg, ...args);
    }
};
