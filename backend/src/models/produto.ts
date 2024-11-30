import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Consumo } from './consumo';

@Table({
  tableName: 'produtos',
  timestamps: true,
})
export class Produto extends Model {
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
  codigo!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  nome!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  preco!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  marca!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  categoria!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  tipoAnimal!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  pesoQuantidade!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  descricao!: string;

  @HasMany(() => Consumo, { foreignKey: 'produtoId' })
  consumos!: Consumo[];
}