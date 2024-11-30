import React, { useState } from "react";
import InputMask from "react-input-mask"; // Biblioteca para máscara
import { atualizarCliente } from "../../services/clienteService";

// Função para formatar datas no padrão yyyy-MM-dd
const formatarDataParaInput = (dataISO?: string) => {
  if (!dataISO || typeof dataISO !== "string") return ""; // Verifica se é uma string válida
  return dataISO.split("T")[0]; // Mantém apenas yyyy-MM-dd
};

// Função para formatar data para DD/MM/YYYY (exigido pela API)
const formatarDataParaEnvio = (dataISO?: string) => {
  if (!dataISO || typeof dataISO !== "string") return "";
  const partes = dataISO.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
};

interface EditFormsClienteProps {
  cliente: {
    id: number;
    nome: string;
    nomeSocial?: string;
    cpf: { valor: string; dataEmissao: string };
    telefones: { ddd: string; numero: string }[];
    rgs: { valor: string; dataEmissao: string }[];
  };
  onClose: () => void;
  onSave: () => void;
}

const EditFormsCliente: React.FC<EditFormsClienteProps> = ({
  cliente,
  onClose,
  onSave,
}) => {
  const [nome, setNome] = useState(cliente.nome);
  const [nomeSocial, setNomeSocial] = useState(cliente.nomeSocial || "");
  const [cpf, setCpf] = useState(cliente.cpf.valor);
  const [dataEmissao, setDataEmissao] = useState(
    formatarDataParaInput(cliente.cpf.dataEmissao)
  );
  const [telefones, setTelefones] = useState(cliente.telefones);
  const [rgs, setRgs] = useState(
    cliente.rgs.map((rg) => ({
      ...rg,
      dataEmissao: formatarDataParaInput(rg.dataEmissao || ""), // Garante string válida
    }))
  );

  const handleSave = async () => {
    if (!cpf || !dataEmissao) {
      alert("CPF e Data de Emissão são obrigatórios.");
      return;
    }

    const updatedCliente = {
      id: cliente.id,
      nome: nome.trim() || cliente.nome,
      nomeSocial: nomeSocial.trim() || cliente.nomeSocial,
      cpf: cpf.trim(), // CPF como string simples
      dataEmissao: formatarDataParaEnvio(dataEmissao), // Formata para DD/MM/YYYY
      telefones: telefones.map((tel) => ({
        ddd: tel.ddd.trim(),
        numero: tel.numero.trim(),
      })),
      rgs: rgs.map((rg) => ({
        valor: rg.valor.trim(),
        dataEmissao: formatarDataParaEnvio(rg.dataEmissao), // Formata para DD/MM/YYYY
      })),
    };

    try {
      await atualizarCliente(cliente.id, updatedCliente);
      alert("Cliente atualizado com sucesso!");
      onSave();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      alert("Erro ao atualizar cliente.");
    }
  };

  const handleTelefoneChange = (index: number, field: "ddd" | "numero", value: string) => {
    const novosTelefones = [...telefones];
    novosTelefones[index] = { ...novosTelefones[index], [field]: value };
    setTelefones(novosTelefones);
  };

  const handleRGChange = (index: number, field: "valor" | "dataEmissao", value: string) => {
    const novosRGs = [...rgs];
    novosRGs[index] = { ...novosRGs[index], [field]: value };
    setRgs(novosRGs);
  };

  const adicionarTelefone = () => {
    setTelefones([...telefones, { ddd: "", numero: "" }]);
  };

  const removerTelefone = (index: number) => {
    setTelefones(telefones.filter((_, i) => i !== index));
  };

  const adicionarRG = () => {
    setRgs([...rgs, { valor: "", dataEmissao: "" }]);
  };

  const removerRG = (index: number) => {
    setRgs(rgs.filter((_, i) => i !== index));
  };

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Cliente</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
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
                />
              </div>
              <div className="mb-3">
                <label htmlFor="nomeSocial" className="form-label">
                  Nome Social
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nomeSocial"
                  value={nomeSocial}
                  onChange={(e) => setNomeSocial(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">CPF</label>
                <InputMask
                  mask="999.999.999-99"
                  className="form-control"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="CPF"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Data de Emissão</label>
                <input
                  type="date"
                  className="form-control"
                  value={dataEmissao}
                  onChange={(e) => setDataEmissao(e.target.value)}
                />
              </div>
              <h5>Telefones</h5>
              {telefones.map((telefone, index) => (
                <div key={index} className="input-group mb-3">
                  <div className="row g-2" style={{ flex: 1 }}>
                    <div className="col-md-2">
                      <InputMask
                        mask="99"
                        className="form-control"
                        placeholder="DDD"
                        aria-label="DDD"
                        value={telefone.ddd}
                        onChange={(e) =>
                          handleTelefoneChange(index, "ddd", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-10">
                      <InputMask
                        mask={telefone.numero.length > 8 ? "99999-9999" : "9999-9999"}
                        className="form-control"
                        placeholder="Número do celular"
                        aria-label="Número"
                        value={telefone.numero}
                        onChange={(e) =>
                          handleTelefoneChange(index, "numero", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      className="btn btn-danger ms-2"
                      onClick={() => removerTelefone(index)}
                    >
                      Remover
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-primary mb-3"
                onClick={adicionarTelefone}
              >
                Adicionar Telefone
              </button>

              <h5>RGs</h5>
              {rgs.map((rg, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <InputMask
                    mask="99.999.999-9"
                    className="form-control me-2"
                    placeholder="Número"
                    value={rg.valor}
                    onChange={(e) =>
                      handleRGChange(index, "valor", e.target.value)
                    }
                  />
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Data de Emissão"
                    value={rg.dataEmissao}
                    onChange={(e) =>
                      handleRGChange(index, "dataEmissao", e.target.value)
                    }
                  />
                  {index > 0 && ( // Remove botão de deletar do primeiro RG
                    <button
                      type="button"
                      className="btn btn-danger ms-2"
                      onClick={() => removerRG(index)}
                    >
                      Remover
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn btn-primary mb-3"
                onClick={adicionarRG}
              >
                Adicionar RG
              </button>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Fechar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditFormsCliente;
