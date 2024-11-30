import { Request, Response } from 'express';
import { Servico } from '../models/servico';

// Criar um Serviço
export const createServico = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nome, valor, descricao } = req.body;

    // Validação básica para o valor
    const valorNormalizado = typeof valor === 'string'
      ? parseFloat(valor.replace(',', '.'))
      : valor;

    if (!valorNormalizado || valorNormalizado <= 0) {
      res.status(400).json({ error: 'O valor deve ser um número maior que zero.' });
      return;
    }

    // Criação do serviço
    const servico = await Servico.create({
      nome,
      valor: valorNormalizado,
      descricao,
    });

    res.status(201).json(servico);
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    res.status(500).json({ error: 'Erro ao criar serviço.' });
  }
};

// Buscar todos os Serviços
export const getServicos = async (req: Request, res: Response): Promise<void> => {
  try {
    const servicos = await Servico.findAll();

    // Formatar o valor como moeda brasileira
    const servicosFormatados = servicos.map((servico) => ({
      id: servico.id,
      nome: servico.nome,
      valor: servico.valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      descricao: servico.descricao,
    }));

    res.status(200).json(servicosFormatados);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    res.status(500).json({ error: 'Erro ao buscar serviços.' });
  }
};

// Atualizar um Serviço
export const updateServico = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nome, valor, descricao } = req.body;

    const servico = await Servico.findByPk(id);
    if (!servico) {
      res.status(404).json({ error: 'Serviço não encontrado.' });
      return;
    }

    // Atualiza os campos fornecidos
    if (nome) servico.nome = nome;
    if (valor) {
      const valorNormalizado = typeof valor === 'string'
        ? parseFloat(valor.replace(',', '.'))
        : valor;

      if (!valorNormalizado || valorNormalizado <= 0) {
        res.status(400).json({ error: 'O valor deve ser um número maior que zero.' });
        return;
      }

      servico.valor = valorNormalizado;
    }
    if (descricao) servico.descricao = descricao;

    await servico.save();

    res.status(200).json(servico);
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    res.status(500).json({ error: 'Erro ao atualizar serviço.' });
  }
};

// Deletar um Serviço
export const deleteServico = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const servico = await Servico.findByPk(id);
    if (!servico) {
      res.status(404).json({ error: 'Serviço não encontrado.' });
      return;
    }

    await servico.destroy();

    res.status(200).json({ message: 'Serviço deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar serviço:', error);
    res.status(500).json({ error: 'Erro ao deletar serviço.' });
  }
};
