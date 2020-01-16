// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';

import ExportTestUser from '../../../app/model/test/User'
import ExportTest2Admin from '../../../app/model/test2/Admin'
import ExportTest2User from '../../../app/model/test2/User'

interface Model {
    query(sql: string, options?: any): function;
}

declare module 'egg' {
    interface Context {
        model: {
            testModel: T_testModel & Model;
            test2Model: T_test2Model & Model;
        }
    }
    interface T_testModel {
        User: ReturnType<typeof ExportTestUser>;
    }
    interface T_test2Model {
        Admin: ReturnType<typeof ExportTest2Admin>;
        User: ReturnType<typeof ExportTest2User>;
    }
}
