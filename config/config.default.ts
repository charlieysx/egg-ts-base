import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import { Options } from 'sequelize/types/lib/sequelize';
import { EggRedisOptions, ClusterOptions } from 'egg-redis';
import { Secret } from 'jsonwebtoken';
import { Op } from 'sequelize';
const path = require('path');

export type DefaultConfig = PowerPartial<EggAppConfig & BizConfig>;

export type sequelizeOptions = Options & {delegate: string, baseDir: string};

export interface BizConfig {
    sequelize: {
        datasources: sequelizeOptions[];
    } | Options;
    redis: EggRedisOptions;
    logrotator: any;
    jwtSecret: Secret;
    monk: {
        database: string | string[];
    };
    oss: {
        accessKeyId: string,
        accessKeySecret: string,
        bucket: string,
        region: string
    };
}

export function getSqlConfig(options: sequelizeOptions | Options) {
    const baseConfig = {
        dialect: 'mysql',
        host: process.env.MYSQL_HOST || '127.0.0.1',
        username: process.env.MYSQL_USERNAME || 'root',
        password: process.env.MYSQL_PASSWORD || 'root',
        port: 3306,
        timezone: '+08:00',
        define: {
            // 注意需要加上这个， egg-sequelize只是简单的使用Object.assign对配置和默认配置做了merge, 如果不加这个 update_at会被转变成 updateAt故报错
            underscored: true,
            // 禁止修改表名，默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数
            // 但是为了安全着想，复数的转换可能会发生变化，所以禁止该行为
            freezeTableName: true
        },
        dialectOptions: new Object({
            charset: 'utf8mb4',
            dateStrings: true,
            typeCast(field: any, next: any) {
                if (field.type === 'DATETIME') {
                    return field.string();
                }
                return next();
            }
        }),
        pool: {
            max: 320,
            min: 0,
            acquire: 1000 * 1000,
        },
        operatorsAliases: {
            $eq: Op.eq,
            $ne: Op.ne,
            $gte: Op.gte,
            $gt: Op.gt,
            $lte: Op.lte,
            $lt: Op.lt,
            $not: Op.not,
            $in: Op.in,
            $notIn: Op.notIn,
            $is: Op.is,
            $like: Op.like,
            $notLike: Op.notLike,
            $iLike: Op.iLike,
            $notILike: Op.notILike,
            $regexp: Op.regexp,
            $notRegexp: Op.notRegexp,
            $iRegexp: Op.iRegexp,
            $notIRegexp: Op.notIRegexp,
            $between: Op.between,
            $notBetween: Op.notBetween,
            $overlap: Op.overlap,
            $contains: Op.contains,
            $contained: Op.contained,
            $adjacent: Op.adjacent,
            $strictLeft: Op.strictLeft,
            $strictRight: Op.strictRight,
            $noExtendRight: Op.noExtendRight,
            $noExtendLeft: Op.noExtendLeft,
            $and: Op.and,
            $or: Op.or,
            $any: Op.any,
            $all: Op.all,
            $values: Op.values,
            $col: Op.col
        }
    };
    return Object.assign(baseConfig, options);
}

export function getRedisConfig(options: ClusterOptions) {
    const baseConfig = {
        port: 6379,
        host: process.env.REDIS_HOST || '127.0.0.1',
        password: process.env.REDIS_PASSWORD || '',
        db: 13
    };
    return Object.assign(baseConfig, options);
}

export default (appInfo: EggAppInfo) => {
    const config: DefaultConfig = {};

    config.security = {
        csrf: {
            enable: false
        }
    };

    // 覆盖框架，插件的配置
    config.keys = appInfo.name + '_egg_ts_base_api';

    // 统一使用中间件处理返回值以及异常错误包装
    config.middleware = [
        'response'
    ];

    // 按小时切割日志信息
    config.logrotator = {
        filesRotateByHour: [
            path.join(appInfo.root, 'logs', appInfo.name, `${appInfo.name}-web.log`),
            path.join(appInfo.root, 'logs', appInfo.name, 'common-error.log'),
        ]
    };
    
    config.multipart = {
        mode: 'file',
        fileExtensions: [ '', 'txt' ]
    };

    config.cors = {
        origin: '*',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
    };

    return {
        ...config
    };
};
