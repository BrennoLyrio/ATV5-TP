import React, { useEffect, useState } from "react";
import { listarPets, deletarPet } from "../services/petService";
import EditFormsPet from "./editForms/editFormsPet";

export default function ListaPets(props: { tema: string }) {
  const { tema } = props;

  const [pets, setPets] = useState<any[]>([]);
  const [petSelecionado, setPetSelecionado] = useState<number | null>(null);
  const [petParaEditar, setPetParaEditar] = useState<any | null>(null);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await listarPets();
        setPets(data);
      } catch (error) {
        console.error("Erro ao buscar pets:", error);
      }
    };

    fetchPets();
  }, []);

  const toggleDropdown = (index: number) => {
    setPetSelecionado((prev) => (prev === index ? null : index));
  };

  const handleEditPet = (pet: any) => {
    setPetParaEditar(pet);
  };

  const handleCloseModal = () => {
    setPetParaEditar(null);
  };

  const handleSave = async () => {
    try {
      const data = await listarPets();
      setPets(data);
    } catch (error) {
      console.error("Erro ao atualizar lista de pets:", error);
    }
    handleCloseModal();
  };

  const handleDeletePet = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este pet?")) {
      try {
        await deletarPet(id);
        setPets((prev) => prev.filter((pet) => pet.id !== id));
        alert("Pet excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir pet:", error);
        alert("Erro ao excluir pet.");
      }
    }
  };

  return (
    <div className="container mt-3">
      <h1 className="mb-4">Lista de Pets</h1>
      <div className="accordion" id="listaPets">
        {pets.map((pet, index) => (
          <div className="accordion-item" key={pet.id}>
            <h2 className="accordion-header">
              <div className="d-flex w-100 align-items-center justify-content-between">
                <button
                  className={`accordion-button ${
                    petSelecionado === index ? "" : "collapsed"
                  }`}
                  type="button"
                  onClick={() => toggleDropdown(index)}
                  style={{ background: tema }}
                >
                  {pet.nome}
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
                        onClick={() => handleEditPet(pet)}
                      >
                        Editar
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => handleDeletePet(pet.id)}
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
                petSelecionado === index ? "show" : ""
              }`}
              data-bs-parent="#listaPets"
            >
              <div className="accordion-body">
                <p>
                  <strong>Nome:</strong> {pet.nome}
                </p>
                <p>
                  <strong>Raça:</strong> {pet.raca}
                </p>
                <p>
                  <strong>Tipo:</strong> {pet.tipo}
                </p>
                <p>
                  <strong>Gênero:</strong> {pet.genero}
                </p>
                <p>
                  <strong>Nome do Dono:</strong> {pet.cliente?.nome || "Não informado"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {petParaEditar && (
        <EditFormsPet
          pet={petParaEditar}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
