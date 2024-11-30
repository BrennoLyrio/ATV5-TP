import React, { useEffect, useState } from "react";
import {
  listarClientesMaisConsumiramProdutos,
  listarClientesMaisConsumiramServicos,
  listarClientesMaisConsumiramValor,
  listarProdutosMaisConsumidos,
  listarServicosMaisConsumidos,
  listarProdutosPorPet,
  listarServicosPorPet,
  ClienteConsumo,
  ProdutoConsumo,
  TipoConsumo,
} from "../services/listagemService";

export default function ListaDadosEspecificos(props: { tema: string }) {
  const { tema } = props;

  const [clientesProdutos, setClientesProdutos] = useState<ClienteConsumo[]>([]);
  const [clientesServicos, setClientesServicos] = useState<ClienteConsumo[]>([]);
  const [clientesValor, setClientesValor] = useState<ClienteConsumo[]>([]);
  const [produtos, setProdutos] = useState<ProdutoConsumo[]>([]);
  const [servicos, setServicos] = useState<ProdutoConsumo[]>([]);
  const [produtosPorPet, setProdutosPorPet] = useState<TipoConsumo[]>([]);
  const [servicosPorPet, setServicosPorPet] = useState<TipoConsumo[]>([]);
  const [dadoSelecionado, setDadoSelecionado] = useState<number | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [
          clientesProdutosData,
          clientesServicosData,
          clientesValorData,
          produtosData,
          servicosData,
          produtosPorPetData,
          servicosPorPetData,
        ] = await Promise.all([
          listarClientesMaisConsumiramProdutos(),
          listarClientesMaisConsumiramServicos(),
          listarClientesMaisConsumiramValor(),
          listarProdutosMaisConsumidos(),
          listarServicosMaisConsumidos(),
          listarProdutosPorPet(),
          listarServicosPorPet(),
        ]);

        setClientesProdutos(clientesProdutosData || []);
        setClientesServicos(clientesServicosData || []);
        setClientesValor(clientesValorData || []);
        setProdutos(produtosData || []);
        setServicos(servicosData || []);
        setProdutosPorPet(produtosPorPetData || []);
        setServicosPorPet(servicosPorPetData || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    carregarDados();
  }, []);

  const toggleDropdown = (index: number) => {
    setDadoSelecionado((prev) => (prev === index ? null : index));
  };

  const categorias: {
    titulo: string;
    dados: any[];
    render: (item: any) => JSX.Element;
  }[] = [
    {
      titulo: "10 Clientes que Mais Consumiram Produtos",
      dados: clientesProdutos,
      render: (item: ClienteConsumo) => (
        <>
          <p>
            <strong>Nome:</strong> {item.nome}
          </p>
          <p>
            <strong>Quantidade de Produtos:</strong> {item.quantidadeProdutos}
          </p>
        </>
      ),
    },
    {
      titulo: "10 Clientes que Mais Consumiram Serviços",
      dados: clientesServicos,
      render: (item: ClienteConsumo) => (
        <>
          <p>
            <strong>Nome:</strong> {item.nome}
          </p>
          <p>
            <strong>Quantidade de Serviços:</strong> {item.quantidadeServicos}
          </p>
        </>
      ),
    },
    {
      titulo: "5 Clientes que Mais Consumiram em Valor",
      dados: clientesValor,
      render: (item: ClienteConsumo) => (
        <>
          <p>
            <strong>Nome:</strong> {item.nome}
          </p>
          <p>
            <strong>Total Consumido:</strong> {item.totalValorConsumido}
          </p>
        </>
      ),
    },
    {
      titulo: "Produtos Mais Consumidos",
      dados: produtos,
      render: (item: ProdutoConsumo) => (
        <>
          <p>
            <strong>Produto:</strong> {item.nome}
          </p>
          <p>
            <strong>Quantidade Consumida:</strong> {item.total}
          </p>
        </>
      ),
    },
    {
      titulo: "Serviços Mais Consumidos",
      dados: servicos,
      render: (item: ProdutoConsumo) => (
        <>
          <p>
            <strong>Serviço:</strong> {item.nome}
          </p>
          <p>
            <strong>Quantidade Consumida:</strong> {item.total}
          </p>
        </>
      ),
    },
    {
      titulo: "Produtos Mais Consumidos por Tipo e Raça de Pets",
      dados: produtosPorPet,
      render: (item: TipoConsumo) => (
        <>
          <p>
            <strong>Tipo:</strong> {item.tipo}
          </p>
          {item.racas.map((raca) => (
            <div key={raca.raca} style={{ marginLeft: "20px" }}>
              <p>
                <strong>Raça:</strong> {raca.raca}
              </p>
              {raca.produtos?.map((produto) => (
                <div key={produto.nome} style={{ marginLeft: "40px" }}>
                  <p>
                    <strong>Produto:</strong> {produto.nome}
                  </p>
                  <p>
                    <strong>Quantidade:</strong> {produto.quantidade}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </>
      ),
    },
    {
      titulo: "Serviços Mais Consumidos por Tipo e Raça de Pets",
      dados: servicosPorPet,
      render: (item: TipoConsumo) => (
        <>
          <p>
            <strong>Tipo:</strong> {item.tipo}
          </p>
          {item.racas.map((raca) => (
            <div key={raca.raca} style={{ marginLeft: "20px" }}>
              <p>
                <strong>Raça:</strong> {raca.raca}
              </p>
              {raca.servicos?.map((servico) => (
                <div key={servico.nome} style={{ marginLeft: "40px" }}>
                  <p>
                    <strong>Serviço:</strong> {servico.nome}
                  </p>
                  <p>
                    <strong>Quantidade:</strong> {servico.quantidade}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </>
      ),
    },
  ];

  return (
    <div className="container mt-3">
      <h1 className="mb-4">Dados Específicos</h1>
      <div className="accordion" id="dadosEspecificos">
        {categorias.map((categoria, index) => (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header">
              <button
                className={`accordion-button ${
                  dadoSelecionado === index ? "" : "collapsed"
                }`}
                type="button"
                onClick={() => toggleDropdown(index)}
                style={{ background: tema }}
              >
                {categoria.titulo}
              </button>
            </h2>
            <div
              className={`accordion-collapse collapse ${
                dadoSelecionado === index ? "show" : ""
              }`}
              data-bs-parent="#dadosEspecificos"
            >
              <div className="accordion-body">
                {categoria.dados.map((item, i) => (
                  <React.Fragment key={i}>
                    {categoria.render(item)}
                    <hr className="my-3" /> {/* Linha horizontal entre itens */}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
