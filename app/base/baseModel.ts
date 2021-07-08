import { Model, Table, Column, AutoIncrement } from 'sequelize-typescript';

/**
 * 封装base控制器
 * 提供一些公共的方法
 */
export default class BaseModel<T = any, D = any> extends Model<T, D> {
    @AutoIncrement
    @Column({
        primaryKey: true
    })
    id: number;

    @Column
    createAt: string;

    @Column
    updateAt: string;
    
    public copyData(): {[key: string]: any} & D {
        return this.toJSON() as {[key: string]: any} & D;
    }
}
