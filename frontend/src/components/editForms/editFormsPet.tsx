import React, { useState } from "react";
import InputMask from "react-input-mask"; // Biblioteca para máscara
import { atualizarPet } from "../../services/petService";

interface EditFormsPetProps {
  pet: {
    id: number;
    nome: string;
    raca: string;
    tipo: string;
    genero: string;
    cpf: string; // CPF do dono
  };
  onClose: () => void; // Função para fechar o modal
  onSave: () => void; // Função para recarregar a lista de pets
}

const EditFormsPet: React.FC<EditFormsPetProps> = ({ pet, onClose, onSave }) => {
  const [nome, setNome] = useState(pet.nome);
  const [raca, setRaca] = useState(pet.raca);
  const [tipo, setTipo] = useState(pet.tipo);
  const [genero, setGenero] = useState(pet.genero);
  const [cpf, setCpf] = useState(pet.cpf);

  const handleSave = async () => {
    const updatedPet = { id: pet.id, nome, raca, tipo, genero, cpf };

    try {
      await atualizarPet(pet.id, updatedPet); // Atualiza o pet no backend
      alert("Pet atualizado com sucesso!");
      onSave(); // Recarrega a lista de pets
      onClose(); // Fecha o modal
    } catch (error) {
      console.error("Erro ao atualizar pet:", error);
      alert("Erro ao atualizar pet.");
    }
  };

  return (
    <div
      className="modal fade show"
      tabIndex={-1}
      role="dialog"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Pet</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="nome" className="form-label">
                  Nome
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="raca" className="form-label">
                  Raça
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="raca"
                  value={raca}
                  onChange={(e) => setRaca(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="tipo" className="form-label">
                  Tipo
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Gênero</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="genero"
                    id="macho"
                    value="Macho"
                    checked={genero === "Macho"}
                    onChange={(e) => setGenero(e.target.value)}
                    required
                  />
                  <label className="form-check-label" htmlFor="macho">
                    Macho
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="genero"
                    id="femea"
                    value="Fêmea"
                    checked={genero === "Fêmea"}
                    onChange={(e) => setGenero(e.target.value)}
                    required
                  />
                  <label className="form-check-label" htmlFor="femea">
                    Fêmea
                  </label>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="cpf" className="form-label">
                  CPF do Novo Dono
                </label>
                <InputMask
                  mask="999.999.999-99"
                  className="form-control"
                  id="cpf"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="CPF"
                  required
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Fechar
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFormsPet;
