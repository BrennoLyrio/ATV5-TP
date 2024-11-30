import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Consumo } from './consumo';

@Table({
  tableName: 'servicos',
  timestamps: false,
})
export class Servico extends Model {
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
    type: DataType.FLOAT,
    allowNull: false,
  })
  valor!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  descricao!: string;

  @HasMany(() => Consumo, { foreignKey: 'servicoId' })
  consumos!: Consumo[];
}
