import React, { useState } from "react";
import InputMask from "react-input-mask"; // Biblioteca para máscara
import { cadastrarCliente } from "../services/clienteService";

const FormularioCadastroCliente: React.FC<{ tema: string }> = ({ tema }) => {
  const [nome, setNome] = useState<string>("");
  const [nomeSocial, setNomeSocial] = useState<string>("");
  const [cpf, setCpf] = useState<string>(""); // Com máscara
  const [dataEmissaoCpf, setDataEmissaoCpf] = useState<string>(""); // Data de emissão do CPF
  const [rgPrincipal, setRgPrincipal] = useState<string>(""); // Campo obrigatório de RG principal
  const [dataEmissaoRgPrincipal, setDataEmissaoRgPrincipal] = useState<string>(""); // Data de emissão do RG principal
  const [rgsAdicionais, setRgsAdicionais] = useState<{ valor: string; dataEmissao: string }[]>([]); // Lista de RGs adicionais
  const [telefones, setTelefones] = useState<{ ddd: string; numero: string }[]>([
    { ddd: "", numero: "" }, // Campo inicial obrigatório de telefone
  ]);

  // Função para limpar o formulário
  const limparFormulario = () => {
    setNome("");
    setNomeSocial("");
    setCpf("");
    setDataEmissaoCpf("");
    setRgPrincipal("");
    setDataEmissaoRgPrincipal("");
    setRgsAdicionais([]);
    setTelefones([{ ddd: "", numero: "" }]);
  };

  // Adicionar um novo RG adicional
  const adicionarRG = () => {
    setRgsAdicionais((prev) => [...prev, { valor: "", dataEmissao: "" }]);
  };

  // Remover um RG adicional
  const removerRG = (index: number) => {
    setRgsAdicionais((prev) => prev.filter((_, i) => i !== index));
  };

  // Atualizar o valor ou a data de emissão de um RG adicional
  const atualizarRG = (index: number, campo: "valor" | "dataEmissao", valor: string) => {
    setRgsAdicionais((prev) =>
      prev.map((rg, i) => (i === index ? { ...rg, [campo]: valor } : rg))
    );
  };

  // Adicionar um telefone
  const adicionarTelefone = () => {
    setTelefones((prev) => [...prev, { ddd: "", numero: "" }]);
  };

  // Remover um telefone
  const removerTelefone = (index: number) => {
    setTelefones((prev) => prev.filter((_, i) => i !== index));
  };

  // Atualizar o valor de um telefone
  const atualizarTelefone = (index: number, campo: "ddd" | "numero", valor: string) => {
    setTelefones((prev) =>
      prev.map((tel, i) => (i === index ? { ...tel, [campo]: valor } : tel))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Remove máscara do CPF e telefones
    const cpfSemMascara = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos

    const cliente = {
      nome,
      nomeSocial,
      cpf: cpfSemMascara,
      dataEmissao: new Date().toISOString().split("T")[0], // Data de cadastro automática (YYYY-MM-DD)
      telefones: telefones.map((tel) => ({
        ddd: tel.ddd,
        numero: tel.numero.replace(/\D/g, ""), // Remove máscara
      })),
      rgs: [
        { valor: rgPrincipal.replace(/\D/g, ""), dataEmissao: dataEmissaoRgPrincipal },
        ...rgsAdicionais.map((rg) => ({
          ...rg,
          valor: rg.valor.replace(/\D/g, ""), // Remove máscara do RG adicional
        })),
      ],
    };

    console.log("Payload enviado ao backend:", cliente);

    try {
      await cadastrarCliente(cliente);
      alert("Cliente cadastrado com sucesso!");
      limparFormulario();
    } catch (error: any) {
      console.error("Erro ao cadastrar cliente:", error);
      alert(error.message || "Erro ao cadastrar cliente.");
    }
  };

  return (
    <div className="container mt-3">
      <h1>Cadastro de Clientes</h1>
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
            placeholder="Nome Social"
            aria-label="Nome Social"
            value={nomeSocial}
            onChange={(e) => setNomeSocial(e.target.value)}
          />
        </div>

        {/* CPF e Data de Emissão */}
        <p className="field-title">Adicione o CPF e a respectiva data de emissão:</p>
        <div className="input-group mb-3">
          <InputMask
            mask="999.999.999-99" // Máscara de CPF
            className="form-control me-2"
            placeholder="CPF"
            aria-label="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />
          <input
            type="date"
            className="form-control"
            value={dataEmissaoCpf}
            onChange={(e) => setDataEmissaoCpf(e.target.value)}
            required
          />
        </div>

        {/* RG Principal */}
        <p className="field-title">Adicione o RG e a respectiva data de emissão:</p>
        <div className="input-group mb-3">
          <InputMask
            mask="99.999.999-9" // Máscara de RG
            className="form-control me-2"
            placeholder="RG"
            aria-label="RG"
            value={rgPrincipal}
            onChange={(e) => setRgPrincipal(e.target.value)}
            required
          />
          <input
            type="date"
            className="form-control"
            value={dataEmissaoRgPrincipal}
            onChange={(e) => setDataEmissaoRgPrincipal(e.target.value)}
            required
          />
        </div>

        {/* Lista de RGs adicionais */}
        <div className="mb-3">
          {rgsAdicionais.map((rg, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <InputMask
                mask="99.999.999-9" // Máscara de RG
                className="form-control me-2"
                placeholder="RG"
                aria-label="RG"
                value={rg.valor}
                onChange={(e) => atualizarRG(index, "valor", e.target.value)}
                required
              />
              <input
                type="date"
                className="form-control"
                value={rg.dataEmissao}
                onChange={(e) => atualizarRG(index, "dataEmissao", e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-danger ms-2"
                onClick={() => removerRG(index)}
              >
                Remover
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={adicionarRG}>
            Adicionar RG
          </button>
        </div>

        {/* Telefones */}
        <p className="field-title">Telefones:</p>
        <div className="mb-3">
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
                    onChange={(e) => atualizarTelefone(index, "ddd", e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-10">
                  <InputMask
                    mask={telefone.numero.length > 8 ? "99999-9999" : "9999-9999"}
                    className="form-control"
                    placeholder="Número do celular"
                    aria-label="Número"
                    value={telefone.numero}
                    onChange={(e) => atualizarTelefone(index, "numero", e.target.value)}
                    required
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
          <button type="button" className="btn btn-primary" onClick={adicionarTelefone}>
            Adicionar Telefone
          </button>
        </div>

        <div className="input-group mb-3">
          <button className="btn btn-outline-secondary" type="submit" style={{ background: tema }}>
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioCadastroCliente;
