import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv';
import { Cliente } from "../models/cliente";
import { Pet } from "../models/pet";
import { Produto } from "../models/produto";
import { Servico } from "../models/servico";
import { Telefone } from "../models/telefone";
import { CPF } from "../models/cpf";
import { Consumo } from "../models/consumo";
import { RG } from "../models/rg";

dotenv.config();

const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD, // mudar senha
    host: process.env.DB_HOST, // colocar domínio
    dialect: "mysql",
    models: [Cliente, Pet, Produto, Servico, Telefone, CPF, Consumo, RG],  // Adiciona os modelos aqui
  });

export default sequelize