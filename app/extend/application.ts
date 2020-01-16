import { Context, Singleton, Application } from 'egg';
import { Redis } from 'ioredis';

/**
 * 扩展application
 */
export default {
    get testRedis(this: Application) {
        return (this.redis as Singleton<Redis>).get('test');
    },
    get test2Redis(this: Application) {
        return (this.redis as Singleton<Redis>).get('test2');
    }
};
