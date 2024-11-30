import React, { useState } from "react";
import InputMask from "react-input-mask"; // Biblioteca para máscara
import { cadastrarPet } from "../services/petService";

const FormularioCadastroPet: React.FC<{ tema: string }> = ({ tema }) => {
  const [nome, setNome] = useState<string>("");
  const [raca, setRaca] = useState<string>("");
  const [tipo, setTipo] = useState<string>("");
  const [genero, setGenero] = useState<string>("");
  const [cpfDono, setCpfDono] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !raca || !tipo || !genero || !cpfDono) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const pet = {
      nome,
      raca,
      tipo,
      genero,
      cpf: cpfDono.replace(/\D/g, ""), // Remove máscara ao enviar
    };

    try {
      await cadastrarPet(pet);
      alert("Pet cadastrado com sucesso!");
      limparFormulario();
    } catch (error) {
      console.error("Erro ao cadastrar pet:", error);
      alert("Erro ao cadastrar pet.");
    }
  };

  const limparFormulario = () => {
    setNome("");
    setRaca("");
    setTipo("");
    setGenero("");
    setCpfDono("");
  };

  return (
    <div className="container mt-3">
      <h1>Cadastro de Pets</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nome"
            aria-label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Raça"
            aria-label="Raça"
            value={raca}
            onChange={(e) => setRaca(e.target.value)}
            required
          />
        </div>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Tipo"
            aria-label="Tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label field-title">Gênero</label>
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
        <div className="input-group mb-3">
          <InputMask
            mask="999.999.999-99"
            className="form-control"
            placeholder="CPF do dono"
            aria-label="CPF"
            value={cpfDono}
            onChange={(e) => setCpfDono(e.target.value)}
            required
          />
        </div>
        <div className="input-group mb-3">
          <button
            className="btn btn-outline-secondary"
            type="submit"
            style={{ background: tema }}
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioCadastroPet;
