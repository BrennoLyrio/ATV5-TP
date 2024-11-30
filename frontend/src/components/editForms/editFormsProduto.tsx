import React, { useState } from "react";
import { Produto, atualizarProduto } from "../../services/produtoService";

interface EditFormsProdutoProps {
  produto: Produto;
  onClose: () => void;
  onSave: () => void;
}

const EditFormsProduto: React.FC<EditFormsProdutoProps> = ({
  produto,
  onClose,
  onSave,
}) => {
  const [nome, setNome] = useState(produto.nome || "");
  const [codigo, setCodigo] = useState(produto.codigo || "");
  const [preco, setPreco] = useState(
    typeof produto.preco === "number"
      ? produto.preco.toFixed(2).replace(".", ",") // Inicializa no formato brasileiro sem "R$"
      : produto.preco || "0,00"
  );
  const [marca, setMarca] = useState(produto.marca || "");
  const [categoria, setCategoria] = useState(produto.categoria || "");
  const [tipoAnimal, setTipoAnimal] = useState(produto.tipoAnimal || "");
  const [pesoQuantidade, setPesoQuantidade] = useState(produto.pesoQuantidade || "");
  const [descricao, setDescricao] = useState(produto.descricao || "");

  const handleSave = async () => {
    if (!nome || !codigo) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }

    // Remover "R$" caso esteja presente e substituir vírgula por ponto
    const precoSemSimbolo = preco.trim().replace("R$", "").replace(",", ".");

    // Verifica e mantém o valor original do preço se o campo estiver vazio
    const precoNumerico = precoSemSimbolo
      ? parseFloat(precoSemSimbolo)
      : typeof produto.preco === "number"
      ? produto.preco
      : 0; // Garantir valor padrão caso seja inválido

    if (isNaN(precoNumerico)) {
      alert("O preço deve ser um valor numérico válido no formato brasileiro (ex: 12,90).");
      return;
    }

    const updatedProduto: Produto = {
      id: produto.id,
      nome: nome.trim() || produto.nome,
      codigo: codigo.trim() || produto.codigo,
      preco: precoNumerico, // Preço convertido para número
      marca: marca.trim() || produto.marca,
      categoria: categoria.trim() || produto.categoria,
      tipoAnimal: tipoAnimal.trim() || produto.tipoAnimal,
      pesoQuantidade: pesoQuantidade.trim() || produto.pesoQuantidade,
      descricao: descricao.trim() || produto.descricao,
    };

    try {
      await atualizarProduto(produto.id, updatedProduto);
      alert("Produto atualizado com sucesso!");
      onSave(); // Callback para recarregar a lista de produtos
      onClose(); // Fecha o modal
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      alert("Erro ao atualizar produto.");
    }
  };

  return (
    <div className="modal show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Produto</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label className="form-label">Nome</label>
                <input
                  type="text"
                  className="form-control"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Código</label>
                <input
                  type="text"
                  className="form-control"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Preço</label>
                <input
                  type="text"
                  className="form-control"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  placeholder="Ex: 12,90"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Marca</label>
                <input
                  type="text"
                  className="form-control"
                  value={marca}
                  onChange={(e) => setMarca(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Categoria</label>
                <input
                  type="text"
                  className="form-control"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Tipo de Animal</label>
                <input
                  type="text"
                  className="form-control"
                  value={tipoAnimal}
                  onChange={(e) => setTipoAnimal(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Peso/Quantidade</label>
                <input
                  type="text"
                  className="form-control"
                  value={pesoQuantidade}
                  onChange={(e) => setPesoQuantidade(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descrição</label>
                <textarea
                  className="form-control"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={3}
                ></textarea>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
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

export default EditFormsProduto;
