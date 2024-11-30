import { Request, Response } from 'express';
import { Consumo } from '../models/consumo';
import { Cliente } from '../models/cliente';
import { Produto } from '../models/produto';
import { Servico } from '../models/servico';

// Criar Consumo
export const createConsumo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { clienteId, produtoId, servicoId, quantidade } = req.body;
  
      // Validação básica
      if (!clienteId || (!produtoId && !servicoId) || !quantidade) {
        res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
        return;
      }
  
      if (quantidade <= 0) {
        res.status(400).json({ error: 'A quantidade deve ser maior que zero.' });
        return;
      }
  
      // Verifica se o cliente existe
      const clienteExiste = await Cliente.findByPk(clienteId);
      if (!clienteExiste) {
        res.status(400).json({ error: 'Cliente não encontrado.' });
        return;
      }
  
      // Verifica se o produto ou serviço existe
      if (produtoId) {
        const produtoExiste = await Produto.findByPk(produtoId);
        if (!produtoExiste) {
          res.status(400).json({ error: 'Produto não encontrado.' });
          return;
        }
      }
  
      if (servicoId) {
        const servicoExiste = await Servico.findByPk(servicoId);
        if (!servicoExiste) {
          res.status(400).json({ error: 'Serviço não encontrado.' });
          return;
        }
      }
  
      // Criar o consumo
      const consumo = await Consumo.create({
        clienteId,
        produtoId: produtoId || null,
        servicoId: servicoId || null,
        quantidade,
      });
  
      res.status(201).json(consumo);
    } catch (error) {
      console.error('Erro ao criar consumo:', error);
      res.status(500).json({ error: 'Erro ao criar consumo.' });
    }
  };

// Buscar todos os consumos
export const getConsumos = async (req: Request, res: Response): Promise<void> => {
  try {
    const consumos = await Consumo.findAll({
      include: [
        {
          model: Cliente,
          attributes: ['nome'],
        },
        {
          model: Produto,
          attributes: ['nome', 'preco'],
        },
        {
          model: Servico,
          attributes: ['nome', 'valor'],
        },
      ],
    });

    res.status(200).json(consumos);
  } catch (error) {
    console.error('Erro ao buscar consumos:', error);
    res.status(500).json({ error: 'Erro ao buscar consumos.' });
  }
};

// Atualizar Consumo
export const updateConsumo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { clienteId, produtoId, servicoId, quantidade } = req.body;

    const consumo = await Consumo.findByPk(id);
    if (!consumo) {
      res.status(404).json({ error: 'Consumo não encontrado.' });
      return;
    }

    if (clienteId) consumo.clienteId = clienteId;
    if (produtoId || servicoId) {
      consumo.produtoId = produtoId || null;
      consumo.servicoId = servicoId || null;
    }
    if (quantidade) consumo.quantidade = quantidade;

    await consumo.save();

    res.status(200).json(consumo);
  } catch (error) {
    console.error('Erro ao atualizar consumo:', error);
    res.status(500).json({ error: 'Erro ao atualizar consumo.' });
  }
};

// Deletar Consumo
export const deleteConsumo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const consumo = await Consumo.findByPk(id);
    if (!consumo) {
      res.status(404).json({ error: 'Consumo não encontrado.' });
      return;
    }

    await consumo.destroy();

    res.status(200).json({ message: 'Consumo deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar consumo:', error);
    res.status(500).json({ error: 'Erro ao deletar consumo.' });
  }
};
