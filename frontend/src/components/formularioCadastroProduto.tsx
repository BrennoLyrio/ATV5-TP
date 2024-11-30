import React, { useState } from "react";
import { cadastrarProduto } from "../services/produtoService";

const FormularioCadastroProduto: React.FC<{ tema: string }> = ({ tema }) => {
  const [codigo, setCodigo] = useState<string>(""); // Adicionando o campo de código
  const [nome, setNome] = useState<string>("");
  const [preco, setPreco] = useState<string>("");
  const [marca, setMarca] = useState<string>("");
  const [categoria, setCategoria] = useState<string>("");
  const [tipoAnimal, setTipoAnimal] = useState<string>("");
  const [quantidade, setQuantidade] = useState<string>("");
  const [unidade, setUnidade] = useState<string>("g");
  const [descricao, setDescricao] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!codigo || !nome || !preco || !categoria || !descricao) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const produto = {
      codigo, // Incluindo o código no objeto enviado ao backend
      nome,
      preco: parseFloat(preco), // Convertendo o preço para número
      marca,
      categoria,
      tipoAnimal,
      pesoQuantidade: `${quantidade}${unidade}`,
      descricao,
    };

    try {
      await cadastrarProduto(produto);
      alert("Produto cadastrado com sucesso!");
      limparFormulario();
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      alert("Erro ao cadastrar produto.");
    }
  };

  const limparFormulario = () => {
    setCodigo("");
    setNome("");
    setPreco("");
    setMarca("");
    setCategoria("");
    setTipoAnimal("");
    setQuantidade("");
    setUnidade("g");
    setDescricao("");
  };

  return (
    <div className="container mt-3">
      <h1>Cadastro de Produtos</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Código"
            aria-label="Código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />
        </div>
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
            placeholder="Preço"
            aria-label="Preço"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            step="0.01"
            min="0"
            required
          />
        </div>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Marca"
            aria-label="Marca"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <select
            className="form-select"
            aria-label="Categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          >
            <option value="">Selecione a categoria</option>
            <option value="Alimentos">Alimentos</option>
            <option value="Brinquedos">Brinquedos</option>
            <option value="Medicamentos">Medicamentos</option>
            <option value="Higiene">Higiene</option>
            <option value="Roupas e acessórios">Roupas e acessórios</option>
            <option value="Habitação e conforto">Habitação e conforto</option>
          </select>
        </div>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Tipo de animal (ex: cachorro, gato, todos)"
            aria-label="Tipo de animal"
            value={tipoAnimal}
            onChange={(e) => setTipoAnimal(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Quantidade"
            aria-label="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            min="0"
            required
          />
          <select
            className="form-select"
            aria-label="Unidade"
            value={unidade}
            onChange={(e) => setUnidade(e.target.value)}
          >
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="L">L</option>
            <option value="unidade">Unidade</option>
          </select>
        </div>
        <b>Descreva brevemente o produto:</b>
        <div className="input-group mb-3">
          <textarea
            className="form-control"
            placeholder="Descreva brevemente o produto"
            aria-label="Descrição"
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
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
    </div>
  );
};

export default FormularioCadastroProduto;
