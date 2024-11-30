import { Request, Response } from 'express';
import { Pet } from '../models/pet';
import { Cliente } from '../models/cliente';
import { CPF } from '../models/cpf';
import sequelize from '../config/connection';

// Criar um Pet
export const createPet = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  try {
    const { nome, tipo, raca, genero, cpf } = req.body;

    // Verifica se todos os campos foram preenchidos
    if (!nome || !tipo || !raca || !cpf) {
      res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
      return;
    }

    // Verifica se o CPF existe
    const cliente = await Cliente.findOne({
      where: {},
      include: {
        model: CPF,
        where: { valor: cpf },
      },
    });

    if (!cliente) {
      res.status(404).json({ error: 'Cliente não encontrado com o CPF informado.' });
      return;
    }

    // Criação do Pet
    const pet = await Pet.create(
      { nome, tipo, raca, genero, clienteId: cliente.id },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json(pet);
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao criar pet:', error);
    res.status(500).json({ error: 'Erro ao criar pet.' });
  }
};

// Buscar todos os Pets
export const getPets = async (req: Request, res: Response): Promise<void> => {
  try {
    const pets = await Pet.findAll({
      include: [
        {
          model: Cliente,
          attributes: ['nome'], // Exibe o nome do cliente ao qual o pet pertence
        },
      ],
    });

    res.status(200).json(pets);
  } catch (error) {
    console.error('Erro ao buscar pets:', error);
    res.status(500).json({ error: 'Erro ao buscar pets.' });
  }
};

// Atualizar Pet
export const updatePet = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params; // ID do pet a ser atualizado
    const { nome, tipo, raca, genero, cpf } = req.body;

    // Verifica se o pet existe
    const pet = await Pet.findByPk(id);
    if (!pet) {
      res.status(404).json({ error: 'Pet não encontrado.' });
      return;
    }

    // Atualizar para outro cliente (CPF)
    if (cpf) {
      const cliente = await Cliente.findOne({
        where: {},
        include: {
          model: CPF,
          where: { valor: cpf },
        },
      });

      if (!cliente) {
        res.status(404).json({ error: 'Cliente não encontrado com o CPF informado.' });
        return;
      }

      pet.clienteId = cliente.id;
    }

    // Atualiza os outros campos
    if (nome) pet.nome = nome;
    if (tipo) pet.tipo = tipo;
    if (raca) pet.raca = raca;
    if (genero) pet.genero = genero;

    await pet.save({ transaction });
    await transaction.commit();

    res.status(200).json(pet);
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao atualizar pet:', error);
    res.status(500).json({ error: 'Erro ao atualizar pet.' });
  }
};

// Deletar Pet
export const deletePet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Verifica se o pet existe
    const pet = await Pet.findByPk(id);
    if (!pet) {
      res.status(404).json({ error: 'Pet não encontrado.' });
      return;
    }

    await pet.destroy();
    res.status(200).json({ message: 'Pet deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar pet:', error);
    res.status(500).json({ error: 'Erro ao deletar pet.' });
  }
};
