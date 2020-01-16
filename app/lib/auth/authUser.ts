import install from '../aRouter/install';
import { Context } from 'egg';

const auth = async (ctx: Context) => {
    const authorizeHeader = ctx.get('Authorization');
    if (!authorizeHeader) {
        throw ctx.customError.USER.UNAUTHORIZED;
    }
    const token = authorizeHeader.split(' ').pop();
    if (!token) {
        throw ctx.customError.USER.UNAUTHORIZED;
    }
    ctx.jwtInfo = ctx.helper.jwtVerify(token, ctx.app.config.jwtSecret, ctx.customError.USER.UNAUTHORIZED);
    if (!ctx.jwtInfo || !ctx.jwtInfo.userInfo) {
        throw ctx.customError.USER.UNAUTHORIZED;
    }
};

export default function (allowNull: boolean = false) {
    return (target: any, value?: any, des?: PropertyDescriptor & ThisType<any> | undefined) => {
        return install(target, value, des, async (ctx: Context) => {
            try {
                await auth(ctx);
            } catch (e) {
                if (allowNull) {
                    ctx.jwtInfo = {
                        userInfo: null
                    };
                } else {
                    throw e;
                }
            }
        });
    };
}
