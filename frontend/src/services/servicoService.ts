import { apiFetch } from "./api";

export interface Servico {
  id?: number;
  nome: string;
  valor: number;
  descricao?: string;
}

export interface ServicoListagem extends Servico {
  id: number; // Obrigatório para listagem e edição
}

export const listarServicos = async (): Promise<ServicoListagem[]> => {
  return apiFetch("servicos", "GET");
};

export const cadastrarServico = async (servico: Servico): Promise<void> => {
  return apiFetch("servicos", "POST", servico);
};

export const atualizarServico = async (
  id: number,
  servico: Servico
): Promise<void> => {
  return apiFetch(`servicos/${id}`, "PUT", servico);
};

export const deletarServico = async (id: number): Promise<void> => {
  return apiFetch(`servicos/${id}`, "DELETE");
};
