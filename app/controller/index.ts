require('module-alias/register');
import BaseController from '@base/baseController';
import { AController, GET } from '@lib/aRouter';
import authUser from '@lib/auth/authUser';
const __CURCONTROLLER = __filename.substr(__filename.indexOf('/app/controller')).replace('/app/controller', '').split('.')[0].split('/').filter(item => item !== 'index').join('/').toLowerCase();

@AController(__CURCONTROLLER)
export default class indexController extends BaseController {

    @GET('/show')
    public async loadAdmin() {
        const { service: { test } } = this.ctx;
        this.returnSuccess(await test.test.showData());
    }

    @GET('/auth')
    @authUser()
    public async auth() {
        const { service: { test } } = this.ctx;
        this.returnSuccess(await test.test.showData());
    }

    @GET('/auth2')
    @authUser(true)
    public async auth2() {
        const { service: { test } } = this.ctx;
        this.returnSuccess(await test.test.showData());
    }
}
