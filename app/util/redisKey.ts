function compose(...key: Array<string | number>) {
    return [ 'eggbase', ...key ].join(':');
}

/**
 * wx相关
 */
compose.wx = function (...key: Array<string | number>) {
    return this('wx', ...key);
};

export default {
    injectEntrance: (entrance: string) => compose('entrance', entrance), // 配置入口
    wx: {
        accessToken: (appid: string) => compose.wx('accessToken', appid), // 缓存微信accessToken,
        ticketKey: (appid: string) => compose.wx('ticketKey', appid),
        refreshUserToken: (appid: string, openId: string) => compose.wx('refreshUserToken', appid, openId), // 用于刷新用户accessToken
        userToken: (appid: string, openId: string) => compose.wx('userToken', appid, openId), // 用于获取用户信息的accessToken
    }
};
