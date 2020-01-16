function errorBody(statusCode: number, code: number, msg: any) {
    return {
        statusCode,
        data: {
            code,
            msg
        }
    };
}

export default {
    GENERAL: {
        SERVER_ERROR: errorBody(500, 500, '服务器错误'),
        NOT_FOUND: (msg: string) => errorBody(404, 404, msg || 'NOT_FOUND'),
        PARAM_ERROR: (msg: string) => errorBody(400, 400, msg || '参数错误')
    },
    USER: {
        UNAUTHORIZED: errorBody(401, 100001, '未登录')
    },
};
