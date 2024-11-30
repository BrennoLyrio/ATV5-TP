import React, { useState } from "react";
import { Servico, atualizarServico } from "../../services/servicoService";

interface EditFormsServicoProps {
  servico: Servico;
  onClose: () => void;
  onSave: () => void;
}

const EditFormsServico: React.FC<EditFormsServicoProps> = ({
  servico,
  onClose,
  onSave,
}) => {
  const [nome, setNome] = useState(servico.nome || "");
  const [valor, setValor] = useState(
    typeof servico.valor === "number"
      ? servico.valor.toFixed(2).replace(".", ",") // Formata no padrão brasileiro
      : servico.valor || "0,00"
  );
  const [descricao, setDescricao] = useState(servico.descricao || "");

  const handleSave = async () => {
    if (!nome || !valor) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }

    // Remover "R$" caso esteja presente e substituir vírgula por ponto
    const valorSemSimbolo = valor.trim().replace("R$", "").replace(",", ".");

    // Verifica e mantém o valor original se o campo estiver vazio
    const valorNumerico = valorSemSimbolo
      ? parseFloat(valorSemSimbolo)
      : typeof servico.valor === "number"
      ? servico.valor
      : 0;

    if (isNaN(valorNumerico)) {
      alert("O valor deve ser um número válido no formato brasileiro (ex: 12,90).");
      return;
    }

    const updatedServico: Servico = {
      id: servico.id,
      nome: nome.trim() || servico.nome,
      valor: valorNumerico, // Valor convertido para número
      descricao: descricao.trim() || servico.descricao,
    };

    try {
      await atualizarServico(servico.id!, updatedServico);
      alert("Serviço atualizado com sucesso!");
      onSave(); // Callback para recarregar a lista de serviços
      onClose(); // Fecha o modal
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
      alert("Erro ao atualizar serviço.");
    }
  };

  return (
    <div className="modal show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Serviço</h5>
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
                <label className="form-label">Valor</label>
                <input
                  type="text"
                  className="form-control"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="Ex: 12,90"
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

export default EditFormsServico;
