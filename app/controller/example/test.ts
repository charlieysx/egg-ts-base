require('module-alias/register');
import BaseController from '@base/baseController';
import { AController, GET } from '@lib/aRouter';
import authUser from '@lib/auth/authUser';
const __CURCONTROLLER = __filename.substr(__filename.indexOf('/app/controller')).replace('/app/controller', '').split('.')[0].split('/').filter(item => item !== 'index').join('/').toLowerCase();

@AController(__CURCONTROLLER)
export default class testController extends BaseController {

    @GET('/show')
    public async loadAdmin() {
        const { service: { test } } = this.ctx;
        this.returnSuccess(await test.test.showData());
    }

    @GET('/auth')
    @authUser() // 验证权限，失败直接抛错误
    public async auth() {
        const {
            service: { test },
            jwtInfo: { userInfo } // 权限验证成功，这里就有用户信息
        } = this.ctx;
        this.returnSuccess(await test.test.showData());
    }

    @GET('/auth2')
    @authUser(true) // 验证权限，失败可跳过
    public async auth2() {
        const {
            service: { test },
            jwtInfo: { userInfo }  // 验证成功有信息，否则为null
        } = this.ctx;
        this.returnSuccess(await test.test.showData());
    }
}
