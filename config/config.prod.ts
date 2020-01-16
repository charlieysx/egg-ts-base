import { DefaultConfig, getSqlConfig, getRedisConfig } from './config.default';

export default () => {
    const config: DefaultConfig = {};

    config.jwtSecret = '654321';
    config.oss = {
        accessKeyId: process.env.OSS_ID,
        accessKeySecret: process.env.OSS_SECRET,
        bucket: process.env.OSS_BUCKET,
        region: process.env.OSS_REGION
    };
    
    config.sequelize = {
        datasources: [
            getSqlConfig({
                delegate: 'model.testModel',
                baseDir: 'model/test',
                database: 'egg_test'
            }),
            getSqlConfig({
                delegate: 'model.test2Model',
                baseDir: 'model/test2',
                database: 'egg_test2'
            })
        ]
    };
    
    config.redis = {
        clients: {
            test: getRedisConfig({ db: 13 }),
            test2: getRedisConfig({ db: 14 })
        }
    };

    config.logger = {
        dir: './logs',
        level: 'INFO'
    };
    return config;
};
