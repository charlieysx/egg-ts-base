require('module-alias/register');
import BaseService from '@base/baseService';

export default class testService extends BaseService {
    async showData() {
        const {
            model: {
                testModel,
                test2Model,
            },
            app: {
                testRedis,
                test2Redis
            }
        } = this.ctx;
        const set1 = await testRedis.set('test', 1);
        const set2 = await test2Redis.set('test', 2);
        const [[ userTest ]] = await testModel.query('select * from `user`');
        const admin = await test2Model.Admin.findByPk(1);
        const userTest2 = await test2Model.User.findByPk(1);
        return { set1, set2, userTest, admin, userTest2 };
    }
}
