import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Cliente } from './cliente';
import { Produto } from './produto';
import { Servico } from './servico';

@Table({
  tableName: 'consumos',
  timestamps: true,
})
export class Consumo extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @ForeignKey(() => Cliente)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  clienteId!: number;

  @ForeignKey(() => Produto)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  produtoId?: number;

  @ForeignKey(() => Servico)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  servicoId?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantidade!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  data!: Date;

  @BelongsTo(() => Produto)
  produto?: Produto;

  @BelongsTo(() => Servico)
  servico?: Servico;

  @BelongsTo(() => Cliente)
  cliente!: Cliente;
}
