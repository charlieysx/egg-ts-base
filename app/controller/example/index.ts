require('module-alias/register');
import BaseController from '@base/baseController';
import { AController, GET, POST, Query, NotNull, Params, Min, Max, Time, Int, Arr, ArrContain, Float, ObjContain, Path, Allow, File } from '@lib/aRouter';
import authUser from '@lib/auth/authUser';
const __CURCONTROLLER = __filename.substr(__filename.indexOf('/app/controller')).replace('/app/controller', '').split('.')[0].split('/').filter(item => item !== 'index').join('/').toLowerCase();

@AController(__CURCONTROLLER)
export default class exampleController extends BaseController {

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

    @GET('/testGet')
    @Query({
        a: [ NotNull ]
    })
    public async testGet() {
        const { filterQuery: { a } } = this.ctx;
        this.returnSuccess({
            a
        });
    }

    @POST('/testPost')
    @Query({
        ga: [ NotNull ]
    })
    @Params({
        pa: [ Int, Min(0), Max(5) ],
        time: [ Time('YYYY-MM-DD') ],
        arr: [ Arr ],
        arrContain: [ ArrContain({
            a: [ Int.Default(3) ],
            b: [ Float ]
        }) ],
        arrContain2: [ ArrContain([ Int ]) ],
        obj: [ ObjContain({
            a: [ Int.Default(3) ],
            b: [ Float ]
        }) ],
        allow: [ Allow([ 1, 2 ]) ],
        allowDefault: [ Allow([ 1, 2 ]).Default(1) ]
    })
    public async testPost() {
        const {
            filterQuery: { ga },
            filterParams: {
                pa,
                time,
                arr,
                arrContain,
                arrContain2,
                obj,
                allow,
                allowDefault
            }
        } = this.ctx;
        this.returnSuccess({
            ga,
            pa,
            time,
            arr,
            arrContain,
            arrContain2,
            obj,
            allow,
            allowDefault
        });
    }

    @GET('/testPath/:id')
    @Path({
        id: [ NotNull ]
    })
    public async testPath() {
        const { filterPath: { id } } = this.ctx;
        this.returnSuccess({
            id
        });
    }

    @POST('/testFile')
    @File('img') // 目前只支持单文件
    public async testFile() {
        const { filterFile: { file } } = this.ctx;
        this.returnSuccess({
            file
        });
    }
}
