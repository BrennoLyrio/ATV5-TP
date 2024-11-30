import { apiFetch } from "./api";

export interface Pet {
  id?: number;
  nome: string;
  raca: string;
  tipo: string;
  genero: string;
  cpf: string; // CPF do dono
}

// Cadastrar um novo pet
export const cadastrarPet = async (pet: Pet): Promise<void> => {
  return apiFetch("pets", "POST", pet);
};

// Listar todos os pets
export const listarPets = async (): Promise<Pet[]> => {
  return apiFetch("pets", "GET");
};

// Atualizar um pet
export const atualizarPet = async (id: number, pet: Pet): Promise<void> => {
  return apiFetch(`pets/${id}`, "PUT", pet);
};

// Deletar um pet
export const deletarPet = async (id: number): Promise<void> => {
  return apiFetch(`pets/${id}`, "DELETE");
};

