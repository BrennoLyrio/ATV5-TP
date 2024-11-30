import { Request, Response } from 'express';
import { Cliente } from '../models/cliente';
import { CPF } from '../models/cpf';
import { Telefone } from '../models/telefone';
import sequelize from '../config/connection'; // Para transações
import { RG } from '../models/rg';


function isValidDate(day: number, month: number, year: number): boolean {
  // Verifica se o mês está entre 1 e 12
  if (month < 1 || month > 12) {
    return false;
  }

  // Verifica se o dia está entre 1 e 31
  if (day < 1 || day > 31) {
    return false;
  }

  // Cria a data e valida
  const date = new Date(year, month - 1, day);
  return (
    !isNaN(date.getTime()) && // Verifica se a data é válida
    date.getDate() === day && // Verifica se o dia corresponde
    date.getMonth() + 1 === month && // Verifica se o mês corresponde
    date.getFullYear() === year && // Verifica se o ano corresponde
    year >= 2000 && year <= 2024 // Ano entre 2000 e 2024
  );
}


export const getClientes = async (req: Request, res: Response) => {
  try {
    // Busca todos os clientes e inclui apenas CPF e telefones
    const clientes = await Cliente.findAll({
      attributes: ['id', 'nome', 'nomeSocial', 'dataCadastro'], // Campos do Cliente
      include: [
        {
          model: CPF, // Inclui os dados do CPF
          attributes: ['valor', 'dataEmissao'], // Campos específicos do CPF
        },
        {
          model: Telefone, // Inclui os telefones
          attributes: ['ddd', 'numero'], // Campos específicos dos telefones
        },
        {
          model: RG,
          attributes: ['valor', 'dataEmissao'] //Campo dos RGs
        }
      ],
    });

    res.status(200).json(clientes);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({ error: 'Erro ao buscar clientes.' });
  }
};

export const createCliente = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  try {
    const { nome, nomeSocial, cpf, dataEmissao, telefones, rgs } = req.body;

    // Validação de entrada
    if (!nome || !cpf || !dataEmissao || !telefones || telefones.length === 0 || !rgs || rgs.length === 0) {
      res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos.' });
      return;
    }

    // Validação da data de emissão do CPF
    const partesDataCPF = dataEmissao.split('/');
    const [diaCPF, mesCPF, anoCPF] = partesDataCPF.map(Number);

    if (!isValidDate(diaCPF, mesCPF, anoCPF)) {
      res.status(400).json({
        error: 'A data de emissão do CPF é inválida. O ano deve ser entre 2000 e 2024.',
      });
      return;
    }

    const dataEmissaoDate = new Date(anoCPF, mesCPF - 1, diaCPF);

    // Verificação e criação dos telefones
    for (const { ddd, numero } of telefones) {
      // Verifica se o telefone já existe no banco de dados
      const telefoneExistente = await Telefone.findOne({ where: { ddd, numero } });
      if (telefoneExistente) {
        res.status(400).json({ error: `O telefone (${ddd}) ${numero} já está em uso por outro cliente.` });
        return;
      }
    }

    // Validação dos RGs (removido)
    for (const rg of rgs) {
      if (!rg.valor || !rg.dataEmissao) {
        res.status(400).json({ error: 'Cada RG deve ter um valor e uma data de emissão.' });
        return;
      }

      const partesDataRG = rg.dataEmissao.split('/');
      const [diaRG, mesRG, anoRG] = partesDataRG.map(Number);

      if (!isValidDate(diaRG, mesRG, anoRG)) {
        res.status(400).json({
          error: `A data de emissão do RG é inválida. O ano deve ser entre 2000 e 2024.`,
        });
        return;
      }
    }

    // Criar o cliente
    const cliente = await Cliente.create(
      { nome, nomeSocial, dataCadastro: new Date() },
      { transaction }
    );

    // Criar o CPF associado ao cliente
    await CPF.create(
      { valor: cpf, dataEmissao: dataEmissaoDate, clienteId: cliente.id },
      { transaction }
    );

    // Criar os telefones associados ao cliente
    await Promise.all(
      telefones.map(({ ddd, numero }: { ddd: string; numero: string }) =>
        Telefone.create({ ddd, numero, clienteId: cliente.id }, { transaction })
      )
    );

    // Criar os RGs associados ao cliente
    await Promise.all(
      rgs.map(({ valor, dataEmissao }: { valor: string; dataEmissao: string }) => {
        const partesData = dataEmissao.split('/');
        const [dia, mes, ano] = partesData.map(Number);
        const dataEmissaoRG = new Date(ano, mes - 1, dia);

        return RG.create(
          { valor, dataEmissao: dataEmissaoRG, clienteId: cliente.id },
          { transaction }
        );
      })
    );

    await transaction.commit();

    // Buscar cliente completo
    const clienteCompleto = await Cliente.findByPk(cliente.id, {
      attributes: ['id', 'nome', 'nomeSocial', 'dataCadastro'],
      include: [
        {
          model: CPF,
          attributes: ['valor', 'dataEmissao'],
        },
        {
          model: Telefone,
          attributes: ['ddd', 'numero'],
        },
        {
          model: RG,
          attributes: ['valor', 'dataEmissao'],
        },
      ],
    });

    res.status(201).json(clienteCompleto);
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao criar cliente:', error);

    res.status(500).json({ error: 'Erro ao criar cliente.' });
  }
};





export const updateCliente = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { nome, nomeSocial, cpf, dataEmissao, telefones, rgs } = req.body;

    // Busca o cliente junto com os relacionamentos
    const cliente = await Cliente.findByPk(id, {
      include: [CPF, Telefone, RG],
    });

    if (!cliente) {
      res.status(404).json({ error: 'Cliente não encontrado.' });
      return;
    }

    // Atualiza os campos básicos do cliente
    if (nome) cliente.nome = nome;
    if (nomeSocial) cliente.nomeSocial = nomeSocial;
    await cliente.save({ transaction });

    // Atualiza ou cria o CPF associado
    if (cpf && dataEmissao) {
      const partesData = dataEmissao.split('/');
      const [dia, mes, ano] = partesData.map(Number);

      if (!isValidDate(dia, mes, ano)) {
        res.status(400).json({ error: 'Data de emissão do CPF inválida.' });
        return;
      }

      const dataEmissaoDate = new Date(ano, mes - 1, dia);

      if (cliente.cpf) {
        cliente.cpf.valor = cpf;
        cliente.cpf.dataEmissao = dataEmissaoDate;
        await cliente.cpf.save({ transaction });
      } else {
        await CPF.create(
          { valor: cpf, dataEmissao: dataEmissaoDate, clienteId: cliente.id },
          { transaction }
        );
      }
    }

    // Atualiza os telefones associados
    if (telefones) {
      await Telefone.destroy({ where: { clienteId: cliente.id }, transaction });
      for (const { ddd, numero } of telefones) {
        await Telefone.create({ ddd, numero, clienteId: cliente.id }, { transaction });
      }
    }

    // Atualiza os RGs associados
    if (rgs) {
      await RG.destroy({ where: { clienteId: cliente.id }, transaction });
      for (const { valor, dataEmissao } of rgs) {
        const partesData = dataEmissao.split('/');
        const [dia, mes, ano] = partesData.map(Number);

        if (!isValidDate(dia, mes, ano)) {
          res.status(400).json({ error: 'Data de emissão do RG inválida.' });
          return;
        }

        const dataEmissaoDate = new Date(ano, mes - 1, dia);
        await RG.create({ valor, dataEmissao: dataEmissaoDate, clienteId: cliente.id }, { transaction });
      }
    }

    await transaction.commit();

    // Busca cliente atualizado
    const clienteAtualizado = await Cliente.findByPk(cliente.id, {
      attributes: ['id', 'nome', 'nomeSocial', 'dataCadastro'],
      include: [
        { model: CPF, attributes: ['valor', 'dataEmissao'] },
        { model: Telefone, attributes: ['ddd', 'numero'] },
        { model: RG, attributes: ['valor', 'dataEmissao'] },
      ],
    });

    res.status(200).json(clienteAtualizado);
  } catch (error) {
    await transaction.rollback();
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente.' });
  }
};





export const deleteCliente = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params; // ID do cliente a ser deletado

    // Verifica se o cliente existe
    const cliente = await Cliente.findByPk(id, {
      include: [Telefone, CPF, RG], // Inclui Telefones, CPF e RGs associados
    });

    if (!cliente) {
      res.status(404).json({ error: 'Cliente não encontrado.' });
      return;
    }

    // Deletar todos os telefones associados
    await Telefone.destroy({ where: { clienteId: cliente.id }, transaction });

    // Deletar todos os RGs associados
    await RG.destroy({ where: { clienteId: cliente.id }, transaction });

    // Deletar CPF associado
    if (cliente.cpf) {
      await cliente.cpf.destroy({ transaction });
    }

    // Deletar o cliente
    await cliente.destroy({ transaction });

    // Commit da transação
    await transaction.commit();

    res.status(200).json({ message: 'Cliente, CPF, Telefones e RGs deletados com sucesso.' });
  } catch (error) {
    // Rollback da transação em caso de erro
    await transaction.rollback();
    console.error('Erro ao deletar cliente:', error);
    res.status(500).json({ error: 'Erro ao deletar cliente.' });
  }
};

export const getClienteById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const cliente = await Cliente.findByPk(id, {
      attributes: ['id', 'nome', 'nomeSocial', 'dataCadastro'],
      include: [
        {
          model: CPF,
          attributes: ['valor', 'dataEmissao'],
        },
        {
          model: Telefone,
          attributes: ['ddd', 'numero'],
        },
        {
          model: RG,
          attributes: ['valor', 'dataEmissao'],
        },
      ],
    });

    if (!cliente) {
      res.status(404).json({ error: 'Cliente não encontrado.' });
      return;
    }

    res.status(200).json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente por ID:', error);
    res.status(500).json({ error: 'Erro ao buscar cliente por ID.' });
  }
};