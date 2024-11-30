// src/services/produtoService.ts
import { apiFetch } from "./api";

interface Produto {
  id: number; // Sempre presente em retornos do backend
  codigo: string;
  nome: string;
  preco: number;
  marca?: string;
  categoria?: string;
  tipoAnimal?: string;
  pesoQuantidade?: string;
  descricao?: string;
}

interface ProdutoParaCadastro {
  codigo: string;
  nome: string;
  preco: number;
  marca?: string;
  categoria?: string;
  tipoAnimal?: string;
  pesoQuantidade?: string;
  descricao?: string;
}

export const listarProdutos = async (): Promise<Produto[]> => {
  return apiFetch("produtos", "GET");
};

export const cadastrarProduto = async (
  produto: ProdutoParaCadastro
): Promise<void> => {
  return apiFetch("produtos", "POST", produto);
};

export const atualizarProduto = async (
  id: number,
  produto: ProdutoParaCadastro
): Promise<void> => {
  return apiFetch(`produtos/${id}`, "PUT", produto);
};

export const deletarProduto = async (id: number): Promise<void> => {
  return apiFetch(`produtos/${id}`, "DELETE");
};

export type { Produto, ProdutoParaCadastro };
