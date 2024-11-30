import React, { useEffect, useState } from "react";
import { listarClientes } from "../services/clienteService";
import { listarProdutos } from "../services/produtoService";
import { listarServicos } from "../services/servicoService";
import { registrarConsumo } from "../services/consumoService";

export default function RegistrarCompras(props: { tema: string }) {
  const { tema } = props;

  const [clientes, setClientes] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [servicos, setServicos] = useState<any[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<number | null>(
    null
  );
  const [produtoSelecionado, setProdutoSelecionado] = useState<number | null>(
    null
  );
  const [servicoSelecionado, setServicoSelecionado] = useState<number | null>(
    null
  );
  const [quantidadeProduto, setQuantidadeProduto] = useState<number>(0);
  const [quantidadeServico, setQuantidadeServico] = useState<number>(0);

  // Carregar dados do backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesData = await listarClientes();
        const produtosData = await listarProdutos();
        const servicosData = await listarServicos();
        setClientes(clientesData);
        setProdutos(produtosData);
        setServicos(servicosData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, []);

  // Adicionar uma compra
  const handleAdicionarCompra = async () => {
    if (!clienteSelecionado) {
      alert("Por favor, selecione um cliente.");
      return;
    }

    if (!produtoSelecionado && !servicoSelecionado) {
      alert("Por favor, selecione pelo menos um produto ou serviço.");
      return;
    }

    try {
      if (produtoSelecionado) {
        await registrarConsumo({
          clienteId: clienteSelecionado,
          produtoId: produtoSelecionado,
          quantidade: quantidadeProduto,
        });
      }

      if (servicoSelecionado) {
        await registrarConsumo({
          clienteId: clienteSelecionado,
          servicoId: servicoSelecionado,
          quantidade: quantidadeServico,
        });
      }

      alert("Compra registrada com sucesso!");
      setProdutoSelecionado(null);
      setServicoSelecionado(null);
      setQuantidadeProduto(0);
      setQuantidadeServico(0);
    } catch (error) {
      console.error("Erro ao registrar compra:", error);
      alert("Erro ao registrar compra.");
    }
  };

  return (
    <div className="container mt-3">
      <h1 className="mb-4">Registrar Compras</h1>
      <form>
        <div className="mb-3">
          <label className="form-label">Selecione um Cliente</label>
          <select
            className="form-select"
            onChange={(e) => setClienteSelecionado(Number(e.target.value))}
            value={clienteSelecionado || ""}
            style={{ background: tema }}
          >
            <option value="">Selecione...</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Selecione um Produto</label>
          <select
            className="form-select"
            onChange={(e) => setProdutoSelecionado(Number(e.target.value))}
            value={produtoSelecionado || ""}
            style={{ background: tema }}
          >
            <option value="">Selecione...</option>
            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome} -{" "}
                {produto.preco.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Quantidade de Produto</label>
          <input
            type="number"
            className="form-control"
            value={quantidadeProduto}
            min={1}
            onChange={(e) => setQuantidadeProduto(Number(e.target.value))}
            disabled={!produtoSelecionado}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Selecione um Serviço</label>
          <select
            className="form-select"
            onChange={(e) => setServicoSelecionado(Number(e.target.value))}
            value={servicoSelecionado || ""}
            style={{ background: tema }}
          >
            <option value="">Selecione...</option>
            {servicos.map((servico) => (
              <option key={servico.id} value={servico.id}>
                {servico.nome} -{" "}
                {servico.valor.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Quantidade de Serviço</label>
          <input
            type="number"
            className="form-control"
            value={quantidadeServico}
            min={1}
            onChange={(e) => setQuantidadeServico(Number(e.target.value))}
            disabled={!servicoSelecionado}
          />
        </div>

        <button
          type="button"
          className="btn"
          style={{ backgroundColor: "#6c757d", color: "white" }}
          onClick={handleAdicionarCompra}
        >
          Adicionar Compra
        </button>
      </form>
    </div>
  );
}
