import { apiFetch } from "./api";

interface Consumo {
  clienteId: number;
  produtoId?: number;
  servicoId?: number;
  quantidade: number;
}

export const registrarConsumo = async (consumo: Consumo): Promise<void> => {
  return apiFetch("consumos", "POST", consumo);
};
