import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasOne } from 'sequelize-typescript';
import { Cliente } from './cliente';

@Table({
  tableName: 'cpfs',
  timestamps: false,
})
export class CPF extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  valor!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dataEmissao!: Date;

  @ForeignKey(() => Cliente)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  clienteId!: number;

  @BelongsTo(() => Cliente)
  cliente!: Cliente;
}
