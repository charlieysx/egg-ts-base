import { Context } from 'egg';
import { SignOptions, Secret } from 'jsonwebtoken';

const moment = require('moment');
const uuid = require('uuid');
const jsonwebtoken = require('jsonwebtoken');
// const jwt = jsonwebtoken.sign({
//     userInfo: {
//         nickname: '24好玩😛😊(长名字带表情)',
//         headimgurl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/4zTibuXA2XkLNxlHHmS8acnVQ2BN1Ja0jZ18CtxvSybm0qI4b23KFeLK3xNvvJ0HibTAJHKHNOe1kJnRfibvJAeMw/132',
//         openid: 'oIzS4wTYsIol3XVcKrN_x06--KAQ',
//         wxappid: 'wxec2b6c9e4bc47af8'
//     },
//     entrance: '24haowan'
// }, 'kp134bu5ole', { expiresIn: '999d' });
// console.log(jwt);

/**
 * 扩展context
 */
export default {
    today() {
        return moment().format('YYYY-MM-DD');
    },
    now() {
        return moment().unix();
    },
    formatTime(time: any = new Date(), format: string = 'YYYY-MM-DD HH:mm:ss') {
        return moment(time).format(format);
    },
    uuid() {
        return uuid();
    },
    jwtSign(payload: string | Buffer | object, secretOrPrivateKey: Secret = '', options: SignOptions) {
        return jsonwebtoken.sign(payload, secretOrPrivateKey, options);
    },
    jwtVerify(token: string, secretOrPrivateKey: Secret = '', error: any) {
        try {
            return jsonwebtoken.verify(token, secretOrPrivateKey);
        } catch (err) {
            throw error;
        }
    }
};
