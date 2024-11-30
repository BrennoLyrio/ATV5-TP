import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Cliente } from './cliente';

@Table({
    tableName: 'telefones',
    timestamps: false,
})

export class Telefone extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    ddd!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    numero!: string;

    @ForeignKey(() => Cliente)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    clienteId!: number;

    @BelongsTo(() => Cliente)
    cliente!: Cliente;
}