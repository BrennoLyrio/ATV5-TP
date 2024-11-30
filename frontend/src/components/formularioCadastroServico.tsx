import React, { useState } from "react";
import { cadastrarServico } from "../services/servicoService";

interface FormularioCadastroServicoProps {
  tema: string;
}

const FormularioCadastroServico: React.FC<FormularioCadastroServicoProps> = ({ tema }) => {
  const [nome, setNome] = useState<string>("");
  const [valor, setValor] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !valor) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const servico = {
      nome,
      valor: parseFloat(valor), // Valor numérico formatado
      descricao,
    };

    try {
      await cadastrarServico(servico);
      alert("Serviço cadastrado com sucesso!");
      limparFormulario();
    } catch (error) {
      console.error("Erro ao cadastrar serviço:", error);
      alert("Erro ao cadastrar serviço.");
    }
  };

  const limparFormulario = () => {
    setNome("");
    setValor("");
    setDescricao("");
  };

  return (
    <div className="container mt-3">
      <h1>Cadastro de Serviços</h1>
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
          <span
            className="input-group-text"
            id="basic-addon1"
            style={{ background: tema }}
          >
            R$
          </span>
          <input
            type="number"
            className="form-control"
            placeholder="Preço do serviço"
            aria-label="Preço"
            step="0.01"
            min="0"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            required
          />
        </div>
        <b>Descreva brevemente o serviço:</b>
        <div className="input-group mb-3">
          <textarea
            className="form-control"
            placeholder="Descreva brevemente o serviço"
            aria-label="Descrição"
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          ></textarea>
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
      <div className="footer">
        <p> Preencha só o formulário necessário</p>
      </div>
    </div>
  );
};

export default FormularioCadastroServico;
