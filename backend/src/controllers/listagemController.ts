import { Request, Response } from 'express';
import { Cliente } from '../models/cliente';
import { Produto } from '../models/produto';
import { Servico } from '../models/servico';
import { Consumo } from '../models/consumo';
import { Pet } from '../models/pet';
import { Op } from 'sequelize';
import sequelize from '../config/connection';


export const clientesMaisConsumiramProdutos = async (req: Request, res: Response) => {
  try {
    const clientes = await Cliente.findAll({
      include: [
        {
          model: Consumo,
          where: { produtoId: { [Op.not]: null } }, // Filtra apenas consumos associados a produtos
          required: false, // Inclui clientes mesmo sem consumos
        },
      ],
    });

    const clientesOrdenados = clientes
      .map(cliente => {
        const quantidadeProdutos = cliente.consumos.reduce((total, consumo) => {
          return total + (consumo.quantidade || 0); // Soma a quantidade de produtos consumidos
        }, 0);

        return {
          nome: cliente.nome,
          quantidadeProdutos,
        };
      })
      .sort((a, b) => b.quantidadeProdutos - a.quantidadeProdutos) // Ordena por quantidade decrescente
      .slice(0, 10); // Seleciona os 10 maiores consumidores

    res.status(200).json(clientesOrdenados);
  } catch (error) {
    console.error('Erro ao listar clientes que mais consumiram produtos:', error);
    res.status(500).json({ error: 'Erro ao listar clientes que mais consumiram produtos.' });
  }
};


export const clientesMaisConsumiramServicos = async (req: Request, res: Response) => {
  try {
    const clientes = await Cliente.findAll({
      include: [
        {
          model: Consumo,
          where: { servicoId: { [Op.not]: null } }, // Filtra apenas consumos associados a serviços
          required: false, // Inclui clientes mesmo sem consumos
        },
      ],
    });

    const clientesOrdenados = clientes
      .map(cliente => {
        // Soma todas as quantidades de serviços consumidos por cliente
        const quantidadeServicos = cliente.consumos.reduce((total, consumo) => {
          return total + (consumo.quantidade || 0); // Adiciona a quantidade ao total
        }, 0);

        return {
          nome: cliente.nome,
          quantidadeServicos,
        };
      })
      .sort((a, b) => b.quantidadeServicos - a.quantidadeServicos) // Ordena em ordem decrescente
      .slice(0, 10); // Seleciona os 10 maiores consumidores de serviços

    res.status(200).json(clientesOrdenados);
  } catch (error) {
    console.error('Erro ao listar clientes que mais consumiram serviços:', error);
    res.status(500).json({ error: 'Erro ao listar clientes que mais consumiram serviços.' });
  }
};


export const produtosMaisConsumidos = async (req: Request, res: Response) => {
    try {
      const produtos = await Produto.findAll({
        attributes: [
          'nome',
          [sequelize.fn('SUM', sequelize.col('consumos.quantidade')), 'total']
        ],
        include: [
          {
            model: Consumo,
            attributes: [], // Não precisa incluir os detalhes do consumo
          },
        ],
        group: ['Produto.id'],
        order: [[sequelize.literal('total'), 'DESC']],
      });
  
      const resultado = produtos.map(produto => ({
        nome: produto.nome,
        total: produto.getDataValue('total'),
      }));
  
      res.status(200).json(resultado);
    } catch (error) {
      console.error('Erro ao listar produtos mais consumidos:', error);
      res.status(500).json({ error: 'Erro ao listar produtos mais consumidos.' });
    }
  };
  
  

  export const servicosMaisConsumidos = async (req: Request, res: Response) => {
    try {
      const servicos = await Servico.findAll({
        attributes: [
          'nome',
          [sequelize.fn('SUM', sequelize.col('consumos.quantidade')), 'total']
        ],
        include: [
          {
            model: Consumo,
            attributes: [], // Não precisa incluir os detalhes do consumo
          },
        ],
        group: ['Servico.id'],
        order: [[sequelize.literal('total'), 'DESC']],
      });
  
      const resultado = servicos.map(servico => ({
        nome: servico.nome,
        total: servico.getDataValue('total'),
      }));
  
      res.status(200).json(resultado);
    } catch (error) {
      console.error('Erro ao listar serviços mais consumidos:', error);
      res.status(500).json({ error: 'Erro ao listar serviços mais consumidos.' });
    }
  };
  
  

  export const produtosPorPet = async (req: Request, res: Response) => {
    try {
      const pets = await Pet.findAll({
        include: [
          {
            model: Cliente,
            include: [
              {
                model: Consumo,
                include: [Produto],
              },
            ],
          },
        ],
      });
  
      const consumoPorPet: { [tipo: string]: { [raca: string]: { [produto: string]: number } } } = {};
  
      pets.forEach(pet => {
        const tipo = pet.tipo;
        const raca = pet.raca;
  
        if (!consumoPorPet[tipo]) {
          consumoPorPet[tipo] = {};
        }
        if (!consumoPorPet[tipo][raca]) {
          consumoPorPet[tipo][raca] = {};
        }
  
        pet.cliente?.consumos?.forEach(consumo => {
          if (consumo.produto) {
            const produtoNome = consumo.produto.nome;
            consumoPorPet[tipo][raca][produtoNome] =
              (consumoPorPet[tipo][raca][produtoNome] || 0) + consumo.quantidade;
          }
        });
      });
  
      const resultado = Object.entries(consumoPorPet).map(([tipo, racas]) => ({
        tipo,
        racas: Object.entries(racas).map(([raca, produtos]) => ({
          raca,
          produtos: Object.entries(produtos)
            .sort(([, qtdA], [, qtdB]) => qtdB - qtdA)
            .map(([nome, quantidade]) => ({ nome, quantidade })),
        })),
      }));
  
      res.status(200).json(resultado);
    } catch (error) {
      console.error('Erro ao listar produtos por pet:', error);
      res.status(500).json({ error: 'Erro ao listar produtos por pet.' });
    }
  };
  

  export const servicosPorPet = async (req: Request, res: Response) => {
    try {
      const pets = await Pet.findAll({
        include: [
          {
            model: Cliente,
            include: [
              {
                model: Consumo,
                include: [Servico],
              },
            ],
          },
        ],
      });
  
      const consumoPorPet: { [tipo: string]: { [raca: string]: { [servico: string]: number } } } = {};
  
      pets.forEach(pet => {
        const tipo = pet.tipo;
        const raca = pet.raca;
  
        if (!consumoPorPet[tipo]) {
          consumoPorPet[tipo] = {};
        }
        if (!consumoPorPet[tipo][raca]) {
          consumoPorPet[tipo][raca] = {};
        }
  
        pet.cliente?.consumos?.forEach(consumo => {
          if (consumo.servico) {
            const servicoNome = consumo.servico.nome;
            consumoPorPet[tipo][raca][servicoNome] =
              (consumoPorPet[tipo][raca][servicoNome] || 0) + consumo.quantidade;
          }
        });
      });
  
      const resultado = Object.entries(consumoPorPet).map(([tipo, racas]) => ({
        tipo,
        racas: Object.entries(racas).map(([raca, servicos]) => ({
          raca,
          servicos: Object.entries(servicos)
            .sort(([, qtdA], [, qtdB]) => qtdB - qtdA)
            .map(([nome, quantidade]) => ({ nome, quantidade })),
        })),
      }));
  
      res.status(200).json(resultado);
    } catch (error) {
      console.error('Erro ao listar serviços por pet:', error);
      res.status(500).json({ error: 'Erro ao listar serviços por pet.' });
    }
  };
  

  export const clientesMaisConsumiramEmValor = async (req: Request, res: Response) => {
    try {
      const clientes = await Cliente.findAll({
        include: [
          {
            model: Consumo,
            include: [
              { model: Produto, attributes: ['preco'], required: false },
              { model: Servico, attributes: ['valor'], required: false },
            ],
            required: false,
          },
        ],
      });
  
      const clientesOrdenados = clientes
        .map(cliente => {
          const totalValorConsumido = cliente.consumos.reduce((total, consumo) => {
            const valorProduto = consumo.produto?.preco || 0;
            const valorServico = consumo.servico?.valor || 0;
            return total + valorProduto * consumo.quantidade + valorServico * consumo.quantidade;
          }, 0);
  
          // Formata o valor para o formato brasileiro (R$)
          const totalValorConsumidoFormatado = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(totalValorConsumido);
  
          return {
            nome: cliente.nome,
            totalValorConsumido: totalValorConsumidoFormatado,
          };
        })
        // Ordena pelo valor numérico extraído do formato brasileiro
        .sort((a, b) => {
          const valorA = parseFloat(a.totalValorConsumido.replace(/[^\d,-]/g, '').replace(',', '.'));
          const valorB = parseFloat(b.totalValorConsumido.replace(/[^\d,-]/g, '').replace(',', '.'));
          return valorB - valorA; // Ordena em ordem decrescente
        })
        .slice(0, 5); // Seleciona os 10 maiores consumidores
  
      res.status(200).json(clientesOrdenados);
    } catch (error) {
      console.error('Erro ao listar clientes que mais consumiram em valor:', error);
      res.status(500).json({ error: 'Erro ao listar clientes que mais consumiram em valor.' });
    }
  };
  
  