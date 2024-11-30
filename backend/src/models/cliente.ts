import { Table, Column, Model, DataType, HasMany, BelongsTo, ForeignKey, AllowNull, HasOne } from 'sequelize-typescript';
import { Pet } from './pet'
import { Telefone } from './telefone';
import { Consumo } from './consumo';
import { CPF } from './cpf';
import { RG } from './rg';

@Table({
    tableName: 'clientes',
    timestamps: false,
})

export class Cliente extends Model {
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
        allowNull: true,
    })
    nomeSocial!: string

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW,
    })
    dataCadastro!: Date;

    @HasOne(() => CPF, { foreignKey: 'clienteId' })
    cpf!: CPF;

    @HasMany(() => Pet, { foreignKey: 'clienteId' })
    pets!: Pet[];

    @HasMany(() => Telefone, { foreignKey: 'clienteId' })
    telefones!: Telefone[];

    @HasMany(() => Consumo, { foreignKey: 'clienteId' })
    consumos!: Consumo[];

    @HasMany(() => RG, { foreignKey: 'clienteId' })
    rgs!: RG[];

}

