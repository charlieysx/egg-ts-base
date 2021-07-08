import { Controller } from 'egg';

/**
 * 封装base控制器
 * 提供一些公共的方法
 */
export default class BaseController extends Controller {
    /**
     * 这是在自动创建路由时用到的。
     */
    static aRouterGetName() {
        return this.name;
    }

    /**
     * 返回成功
     * @param data 返回的数据
     * @param customBody 是否是自定义返回格式（默认否，true的话，不会封装payload，直接返回data）
     */
    protected returnSuccess(data: any, customBody: boolean = false) {
        if (customBody) {
            this.ctx.customBody = true;
        }
        if (data === null || data === undefined) {
            data = {};
        }
        this.ctx.body = data;
    }

    protected genExcelRows(header: Record<string, string>, dataList: any[]) {
        let result = '';
        dataList.forEach((data: any) => {
            const keys = Object.getOwnPropertyNames(header);
            keys.forEach(key => {
                let cellContent = data[key] || '';
                if (data[key] === 0) {
                    cellContent = 0;
                }
                if (typeof cellContent === 'string') {
                    cellContent = cellContent.replace(/,/g, '，');
                }
                // 加上\t可以防止数据被显示为科学计数法
                if (header[key]) result += `"${cellContent}\t",`;
            });
            result += '\n';
        });
        return result;
    }

    protected returnExcel(header: Record<string, string>, list: any[], name: string) {
        const content = this.genExcelRows(header, [ header, ...list ]);
        this.ctx.state.filename = `${encodeURIComponent(name)}`;
        this.ctx.state.extension = 'csv';
        // 这样做可以防止中文乱码
        const msExcelBuffer = Buffer.concat([
            Buffer.from('\xEF\xBB\xBF', 'binary'), // BOM+utf8， 是office支持的格式
            Buffer.from(content)
        ]);
        this.ctx.set('Content-disposition', `attachment; filename=${this.ctx.state.filename}.csv`);
        this.ctx.set('content-type', `${this.ctx.state.filename}.csv; charset=utf-8`);
        console.log('msExcelBuffer.toString("utf8")');
        this.returnSuccess(msExcelBuffer.toString('utf8'), true);
    }
}
