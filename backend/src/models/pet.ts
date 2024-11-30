import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Cliente } from './cliente';

@Table({
  tableName: 'pets',
  timestamps: false,
})
export class Pet extends Model {
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
  nome!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  tipo!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  raca!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  genero!: string;

  @ForeignKey(() => Cliente)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  clienteId!: number;

  @BelongsTo(() => Cliente)
  cliente!: Cliente;
}
