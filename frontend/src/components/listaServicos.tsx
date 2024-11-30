import React, { useEffect, useState } from "react";
import { ServicoListagem,listarServicos, deletarServico } from "../services/servicoService";
import EditFormsServico from "./editForms/editFormsServico";

interface Servico {
  id: number;
  nome: string;
  valor: number;
  descricao?: string;
}

export default function ListaServicos(props: { tema: string }) {
  const { tema } = props;

  const [servicos, setServicos] = useState<ServicoListagem[]>([]);
  const [servicoSelecionado, setServicoSelecionado] = useState<number | null>(
    null
  );
  const [editServico, setEditServico] = useState<Servico | null>(null);

  // Buscar serviços no backend
  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const data = await listarServicos();
        setServicos(data);
      } catch (error) {
        console.error("Erro ao buscar serviços:", error);
      }
    };

    fetchServicos();
  }, []);

  // Alternar dropdown do serviço selecionado
  const toggleDropdown = (index: number) => {
    setServicoSelecionado((prev) => (prev === index ? null : index));
  };

  // Função para editar o serviço
  const handleEditServico = (servico: Servico) => {
    setEditServico(servico);
  };

  // Função para excluir o serviço
  const handleDeleteServico = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este serviço?")) {
      try {
        await deletarServico(id);
        setServicos((prev) => prev.filter((servico) => servico.id !== id));
        alert("Serviço excluído com sucesso.");
      } catch (error) {
        console.error("Erro ao excluir serviço:", error);
        alert("Erro ao excluir serviço.");
      }
    }
  };

  // Fechar modal de edição
  const closeEditModal = () => {
    setEditServico(null);
  };

  // Atualizar lista após edição
  const updateServicoList = () => {
    const fetchServicos = async () => {
      try {
        const data = await listarServicos();
        setServicos(data);
      } catch (error) {
        console.error("Erro ao atualizar lista de serviços:", error);
      }
    };

    fetchServicos();
  };

  return (
    <div className="container mt-3">
      <h1 className="mb-4">Lista de Serviços</h1>
      <div className="accordion" id="listaServicos">
        {servicos.map((servico, index) => (
          <div className="accordion-item" key={servico.id}>
            <h2 className="accordion-header">
              <div className="d-flex w-100 align-items-center justify-content-between">
                <button
                  className={`accordion-button ${
                    servicoSelecionado === index ? "" : "collapsed"
                  }`}
                  type="button"
                  onClick={() => toggleDropdown(index)}
                  style={{ background: tema }}
                >
                  {servico.nome}
                </button>
                <div className="dropdown">
                  <button
                    className="btn btn-sm btn-secondary dropdown-toggle"
                    type="button"
                    id={`dropdownMenuButton-${index}`}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Ações
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby={`dropdownMenuButton-${index}`}
                  >
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => handleEditServico(servico)}
                      >
                        Editar
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => handleDeleteServico(servico.id)}
                      >
                        Excluir
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </h2>
            <div
              className={`accordion-collapse collapse ${
                servicoSelecionado === index ? "show" : ""
              }`}
              data-bs-parent="#listaServicos"
            >
              <div className="accordion-body">
                <p>
                  <strong>Nome:</strong> {servico.nome}
                </p>
                <p>
                  <strong>Preço:</strong>{" "}
                  {servico.valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
                {servico.descricao && (
                  <p>
                    <strong>Descrição:</strong> {servico.descricao}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edição */}
      {editServico && (
        <EditFormsServico
          servico={editServico}
          onClose={closeEditModal}
          onSave={updateServicoList}
        />
      )}
    </div>
  );
}
