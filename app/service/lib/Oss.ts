require('module-alias/register');
import BaseService from '@base/baseService';
import { Context } from 'egg';
import * as oss from 'ali-oss';
import OSS = require('ali-oss');
import * as fs from 'fs';

export default class OssService extends BaseService {
    private store: OSS | null = null;

    constructor(ctx: Context) {
        super(ctx);
        this.store = new oss({
            accessKeyId: this.app.config.oss.accessKeyId,
            accessKeySecret: this.app.config.oss.accessKeySecret,
            bucket: this.app.config.oss.bucket,
            region: this.app.config.oss.region
        });
    }

    /**
     * 上传文件
     */
    async uploadFile(file: any, name: string = '') {
        const localFile = file.filepath;
        const originalname = name || 'file/' + `${Math.random() * 1000000000}`.split('.')[0] + `_${file.filename}`;
        const link = await this.ossUpload(originalname, localFile);
        return link;
    }

    /**
     * 上传指定路径的文件
     */
    public async ossUpload(name: string, filePath: string) {
        if (!this.store) {
            return;
        }
        await this.store.put(name, filePath);
        fs.unlinkSync(filePath);
        return 'http://oss.codebear.cn/' + name;
    }

    /**
     * 上传buffer流的文件
     */
    async uploadFromBuffer(dataBuffer: Buffer, name: string = '') {
        const random = `${Math.random() * 1000}`.split('.')[0];
        name = name || `file_${this.ctx.helper.now()}_${random}`;
        const dir = './cacheFile';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        const path = `${dir}/${name}`;
        fs.writeFileSync(path, dataBuffer);
        return await this.ossUpload(name, path);
    }
}
