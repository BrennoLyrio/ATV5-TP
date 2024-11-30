import { Request, Response } from "express";
import { Produto } from "../models/produto";
import { error } from "console";

export const getProdutos = async (req: Request, res: Response): Promise<void> => {
    try {
        const produtos = await Produto.findAll(); // Busca todos os produtos

        // Formata o preço para exibição no formato brasileiro
        const produtosFormatados = produtos.map((produto) => ({
            ...produto.toJSON(),
            preco: new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(produto.preco),
        }));

        res.status(200).json(produtosFormatados);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ error: 'Erro ao buscar produtos.' });
    }
};


export const createProduto = async (req: Request, res: Response): Promise<void> => {
    try {
      const { codigo, nome, preco, marca, categoria, tipoAnimal, pesoQuantidade, descricao } = req.body;
  
      // Conversão robusta do preço
      const precoNormalizado = (() => {
        if (typeof preco === 'string') {
          // Remove espaços e substitui vírgula por ponto
          const precoSanitizado = preco.trim().replace(',', '.');
          const valor = parseFloat(precoSanitizado);
          return isNaN(valor) ? null : valor; // Retorna `null` se não for numérico
        }
        return typeof preco === 'number' && preco > 0 ? preco : null; // Retorna o número se for válido
      })();
  
      // Validação do preço
      if (precoNormalizado === null || precoNormalizado <= 0) {
        res.status(400).json({ error: 'O preço deve ser um valor numérico maior que zero.' });
        return;
      }
  
      // Criação do produto
      const produto = await Produto.create({
        codigo,
        nome,
        preco: precoNormalizado,
        marca,
        categoria,
        tipoAnimal,
        pesoQuantidade,
        descricao,
      });
  
      res.status(201).json(produto);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: 'Já existe um produto com o código informado.' });
        return;
      }
      console.error('Erro ao criar produto:', error);
      res.status(500).json({ error: 'Erro ao criar produto.' });
    }
  };

export const updateProduto = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params; // ID do produto a ser atualizado
        const { nome, preco, marca, categoria, tipoAnimal, pesoQuantidade, descricao } = req.body;

        const produto = await Produto.findByPk(id);
        if (!produto) {
            res.status(404).json({ error: 'Produto não encontrado.' });
            return;
        }

        if (preco !== undefined) {
            const precoValidado = parseFloat(String(preco).replace('.', '').replace(',', '.'));
            if (isNaN(precoValidado) || precoValidado <= 0) {
                res.status(400).json({ error: 'O preço deve ser um valor numérico válido no formato brasileiro.' });
                return;
            }
            produto.preco = precoValidado;
        }

        if (nome) produto.nome = nome;
        if (marca) produto.marca = marca;
        if (categoria) produto.categoria = categoria;
        if (tipoAnimal) produto.tipoAnimal = tipoAnimal;
        if (pesoQuantidade) produto.pesoQuantidade = pesoQuantidade;
        if (descricao) produto.descricao = descricao;

        await produto.save();
        res.status(200).json(produto);
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ error: 'Erro ao atualizar produto.' });
    }
};


export const deleteProduto = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const produto = await Produto.findByPk(id);
        if (!produto) {
            res.status(404).json({ error: 'Produto não encontrado.' });
            return;
        }

        await produto.destroy();
        res.status(200).json({ message: 'Produto deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({ error: 'Erro ao deletar produto.' });
    }
};
