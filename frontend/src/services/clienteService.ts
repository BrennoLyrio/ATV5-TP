import { apiFetch } from "./api";

export interface Cliente {
  id?: number;
  nome: string;
  nomeSocial?: string;
  cpf: string;
  dataEmissao: string; // No formato DD/MM/YYYY
  telefones: { ddd: string; numero: string }[];
  rgs: { valor: string; dataEmissao: string }[];
}

export const listarClientes = async (): Promise<Cliente[]> => {
  return apiFetch("clientes", "GET");
};

export const buscarClientePorId = async (id: number): Promise<Cliente> => {
  return apiFetch(`clientes/${id}`, "GET");
};

export const cadastrarCliente = async (cliente: Cliente): Promise<void> => {
  // Converte datas para o formato DD/MM/YYYY antes de enviar
  cliente.dataEmissao = formatarData(cliente.dataEmissao);
  cliente.rgs.forEach(rg => {
    rg.dataEmissao = formatarData(rg.dataEmissao);
  });

  return apiFetch("clientes", "POST", cliente);
};

export const atualizarCliente = async (id: number, cliente: Cliente): Promise<void> => {
  cliente.dataEmissao = formatarData(cliente.dataEmissao);
  cliente.rgs.forEach(rg => {
    rg.dataEmissao = formatarData(rg.dataEmissao);
  });

  return apiFetch(`clientes/${id}`, "PUT", cliente);
};

export const deletarCliente = async (id: number): Promise<{ message: string }> => {
  return apiFetch(`clientes/${id}`, "DELETE");
};

// Função utilitária para formatar datas no formato DD/MM/YYYY
function formatarData(data?: string): string {
  if (!data || typeof data !== "string") {
    console.warn("Data inválida recebida para formatação:", data);
    return ""; // Retorna string vazia para dados inválidos
  }

  // Verifica se já está no formato DD/MM/YYYY
  if (data.includes("/")) {
    const partes = data.split("/");
    if (partes.length === 3) {
      return `${partes[0]}/${partes[1]}/${partes[2]}`; // Mantém o formato DD/MM/YYYY
    }
  }

  // Converte de YYYY-MM-DD para DD/MM/YYYY
  const partes = data.split("-");
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  console.warn("Formato de data desconhecido:", data);
  return ""; // Retorna string vazia se o formato for inesperado
}
