import { apiFetch } from "./api";

// Wrapper para listagens com suporte a tipos genéricos
export const apiFetchListagem = async <T = any>(
  endpoint: string,
  method: string = "GET"
): Promise<T> => {
  return apiFetch(endpoint, method);
};

// Interfaces para os diferentes tipos de listagens
export interface ClienteConsumo {
  nome: string;
  quantidadeProdutos?: number;
  quantidadeServicos?: number;
  totalValorConsumido?: string;
}

export interface ProdutoConsumo {
  nome: string;
  total: number;
}

export interface ConsumoPorPet {
  tipo: string;
  raca: string;
  produto?: string;
  servico?: string;
  quantidade: number;
}

export interface RacaConsumo {
    raca: string;
    produtos?: {
      nome: string;
      quantidade: number;
    }[];
    servicos?: {
      nome: string;
      quantidade: number;
    }[];
  }

  export interface TipoConsumo {
    tipo: string;
    racas: RacaConsumo[];
  }

// Funções de listagem que usam o wrapper com tipagem
export const listarClientesMaisConsumiramProdutos = async (): Promise<ClienteConsumo[]> => {
  return apiFetchListagem<ClienteConsumo[]>("listagem/clientes-mais-consumiram-produtos");
};

export const listarClientesMaisConsumiramServicos = async (): Promise<ClienteConsumo[]> => {
  return apiFetchListagem<ClienteConsumo[]>("listagem/clientes-mais-consumiram-servicos");
};

export const listarClientesMaisConsumiramValor = async (): Promise<ClienteConsumo[]> => {
  return apiFetchListagem<ClienteConsumo[]>("listagem/clientes-mais-consumiram-valor");
};

export const listarProdutosMaisConsumidos = async (): Promise<ProdutoConsumo[]> => {
  return apiFetchListagem<ProdutoConsumo[]>("listagem/produtos-mais-consumidos");
};

export const listarServicosMaisConsumidos = async (): Promise<ProdutoConsumo[]> => {
  return apiFetchListagem<ProdutoConsumo[]>("listagem/servicos-mais-consumidos");
};

export const listarProdutosPorPet = async (): Promise<TipoConsumo[]> => {
    return apiFetchListagem<TipoConsumo[]>("listagem/produtos-por-pet");
  };
  
  export const listarServicosPorPet = async (): Promise<TipoConsumo[]> => {
    return apiFetchListagem<TipoConsumo[]>("listagem/servicos-por-pet");
  };
