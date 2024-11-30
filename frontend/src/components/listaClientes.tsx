import React, { useEffect, useState } from "react";
import { listarClientes, deletarCliente } from "../services/clienteService";
import EditFormsCliente from "./editForms/editFormsCliente";

// Função para formatar CPF
const formatarCPF = (cpf: string) =>
  cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

// Função para formatar RG
const formatarRG = (rg: string) =>
  rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");

export default function ListaClientes(props: { tema: string }) {
  const { tema } = props;

  const [clientes, setClientes] = useState<any[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<number | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteParaEditar, setClienteParaEditar] = useState<any | null>(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await listarClientes();
        setClientes(data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  const toggleDropdown = (index: number) => {
    setClienteSelecionado((prev) => (prev === index ? null : index));
  };

  const handleEditCliente = (cliente: any) => {
    setClienteParaEditar(cliente);
    setModalOpen(true);
  };

  const handleSaveEdit = async () => {
    const updatedClientes = await listarClientes();
    setClientes(updatedClientes);
    setModalOpen(false);
  };

  const handleDeleteCliente = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await deletarCliente(id);
        setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
        alert("Cliente excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
        alert("Erro ao excluir cliente.");
      }
    }
  };

  return (
    <div className="container mt-3">
      <h1 className="mb-4">Lista de Clientes</h1>
      <div className="accordion" id="listaClientes">
        {clientes.map((cliente, index) => (
          <div className="accordion-item" key={cliente.id}>
            <h2 className="accordion-header">
              <div className="d-flex w-100 align-items-center justify-content-between">
                <button
                  className={`accordion-button ${
                    clienteSelecionado === index ? "" : "collapsed"
                  }`}
                  type="button"
                  onClick={() => toggleDropdown(index)}
                  style={{ background: tema }}
                >
                  {cliente.nome}
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
                        onClick={() => handleEditCliente(cliente)}
                      >
                        Editar
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => handleDeleteCliente(cliente.id)}
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
                clienteSelecionado === index ? "show" : ""
              }`}
              data-bs-parent="#listaClientes"
            >
              <div className="accordion-body">
                <p>
                  <strong>Nome:</strong> {cliente.nome}
                </p>
                {cliente.nomeSocial && (
                  <p>
                    <strong>Nome Social:</strong> {cliente.nomeSocial}
                  </p>
                )}
                <p>
                  <strong>CPF:</strong> {formatarCPF(cliente.cpf.valor)}
                </p>
                {cliente.rgs?.map((rg: any, i: number) => (
                  <p key={i}>
                    <strong>RG:</strong> {formatarRG(rg.valor)}
                  </p>
                ))}
                {cliente.telefones?.map((tel: any, i: number) => (
                  <p key={i}>
                    <strong>Telefone:</strong> ({tel.ddd}) {tel.numero}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edição */}
      {modalOpen && clienteParaEditar && (
        <EditFormsCliente
          cliente={clienteParaEditar}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
