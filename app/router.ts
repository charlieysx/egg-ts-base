import { Application } from 'egg';
import { ARouter } from './lib/aRouter';

export default (app: Application) => {
    // 自动注入路由
    ARouter(app);
};
