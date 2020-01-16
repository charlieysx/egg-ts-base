import { Model, Table, Column, AutoIncrement } from 'sequelize-typescript';

@Table({
    modelName: 'admin'
})
class Admin extends Model<Admin> {
    @AutoIncrement
    @Column({
        primaryKey: true
    })
    id: number;

    @Column
    name: number;
}

export default () => Admin;
