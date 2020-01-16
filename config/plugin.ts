import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
    sequelize: {
        enable: true,
        package: 'egg-sequelize-ts'
    },
    redis : {
        enable: true,
        package: 'egg-redis',
    },
    cors: {
        enable: true,
        package: 'egg-cors'
    }
};

export default plugin;
