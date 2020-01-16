import { Model, Table, Column, AutoIncrement } from 'sequelize-typescript';

@Table({
    modelName: 'user'
})
class User extends Model<User> {
    @AutoIncrement
    @Column({
        primaryKey: true
    })
    id: number;

    @Column
    name: number;
}

export default () => User;
