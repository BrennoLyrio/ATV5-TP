import React, { useState, useEffect } from "react";
import { listarProdutos, deletarProduto } from "../services/produtoService";
import EditFormsProduto from "./editForms/editFormsProduto";
import { Produto } from "../services/produtoService";

export default function ListaProdutos(props: { tema: string }) {
  const { tema } = props;

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<number | null>(
    null
  );
  const [produtoParaEditar, setProdutoParaEditar] = useState<Produto | null>(
    null
  );

  // Função para buscar os produtos do backend
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const data = await listarProdutos();
        setProdutos(data); // Corrigido para tipagem consistente
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProdutos();
  }, []);

  // Alternar o dropdown do produto selecionado
  const toggleDropdown = (index: number) => {
    setProdutoSelecionado((prev) => (prev === index ? null : index));
  };

  // Editar produto
  const handleEditProduto = (produto: Produto) => {
    setProdutoParaEditar(produto); // Define o produto a ser editado e abre o modal
  };

  // Fechar modal de edição
  const handleCloseEditModal = () => {
    setProdutoParaEditar(null); // Fecha o modal
  };

  // Atualizar lista de produtos após edição
  const handleSaveEditModal = async () => {
    try {
      const updatedProdutos = await listarProdutos(); // Recarrega a lista de produtos
      setProdutos(updatedProdutos);
    } catch (error) {
      console.error("Erro ao atualizar a lista de produtos:", error);
    }
    handleCloseEditModal(); // Fecha o modal
  };

  // Excluir produto
  const handleDeleteProduto = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await deletarProduto(id);
        setProdutos((prev) => prev.filter((produto) => produto.id !== id));
        alert("Produto excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        alert("Erro ao excluir produto.");
      }
    }
  };

  return (
    <div className="container mt-3">
      <h1 className="mb-4">Lista de Produtos</h1>
      <div className="accordion" id="listaProdutos">
        {produtos.map((produto, index) => (
          <div className="accordion-item" key={produto.id}>
            <h2 className="accordion-header">
              <div className="d-flex w-100 align-items-center justify-content-between">
                <button
                  className={`accordion-button ${
                    produtoSelecionado === index ? "" : "collapsed"
                  }`}
                  type="button"
                  onClick={() => toggleDropdown(index)}
                  style={{ background: tema }}
                >
                  {produto.nome}
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
                        onClick={() => handleEditProduto(produto)}
                      >
                        Editar
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => handleDeleteProduto(produto.id)}
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
                produtoSelecionado === index ? "show" : ""
              }`}
              data-bs-parent="#listaProdutos"
            >
              <div className="accordion-body">
                <p>
                  <strong>Nome:</strong> {produto.nome}
                </p>
                <p>
                  <strong>Código:</strong> {produto.codigo}
                </p>
                <p>
                  <strong>Preço:</strong>{" "}
                  {produto.preco.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
                <p>
                  <strong>Marca:</strong> {produto.marca}
                </p>
                <p>
                  <strong>Categoria:</strong> {produto.categoria}
                </p>
                <p>
                  <strong>Tipo de Animal:</strong> {produto.tipoAnimal}
                </p>
                <p>
                  <strong>Peso/Quantidade:</strong> {produto.pesoQuantidade}
                </p>
                <p>
                  <strong>Descrição:</strong> {produto.descricao}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Edição */}
      {produtoParaEditar && (
        <EditFormsProduto
          produto={produtoParaEditar}
          onClose={handleCloseEditModal}
          onSave={handleSaveEditModal}
        />
      )}
    </div>
  );
}
