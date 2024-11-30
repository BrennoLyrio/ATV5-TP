/* eslint-disable no-unused-vars */
import { useState } from "react";
import BarraNavegacao from "./barraNavegacao";
import FormularioCadastroCliente from "./formularioCadastroCliente";
import FormularioCadastroPet from "./formularioCadastroPet";
import FormularioCadastroProduto from "./formularioCadastroProduto";
import FormularioCadastroServico from "./formularioCadastroServico";
import ListaClientes from "./listaClientes";
import ListaPets from "./listaPets";
import ListaProdutos from "./listaProdutos";
import ListaServicos from "./listaServicos";
import RegistrarCompras from "./AssociarCompras";
import ListaDadosEspecificos from "./listaDadosEspecificos";

export default function Roteador() {
  const [tela, setTela] = useState<string>("Clientes");

  const selecionarView = (
    valor: string,
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    setTela(valor);
  };

  const construirView = () => {
    const barraNavegacao = (
      <BarraNavegacao
        seletorView={selecionarView}
        tema="#e3f2fd"
        botoes={[
          "Clientes",
          "Pets",
          "Produtos",
          "Serviços",
          "Cadastros",
          "Registro de Compras",
          "Dados Avançados",
        ]}
      />
    );

    switch (tela) {
      case "Clientes":
        return (
          <>
            {barraNavegacao}
            <ListaClientes tema="#e3f2fd" />
          </>
        );
      case "Pets":
        return (
          <>
            {barraNavegacao}
            <ListaPets tema="#e3f2fd" />
          </>
        );
      case "Produtos":
        return (
          <>
            {barraNavegacao}
            <ListaProdutos tema="#e3f2fd" />
          </>
        );
      case "Serviços":
        return (
          <>
            {barraNavegacao}
            <ListaServicos tema="#e3f2fd" />
          </>
        );
      case "Cadastros":
        return (
          <>
            {barraNavegacao}
            <FormularioCadastroCliente tema="#e3f2fd" />
            <FormularioCadastroPet tema="#e3f2fd" />
            <FormularioCadastroProduto tema="#e3f2fd" />
            <FormularioCadastroServico tema="#e3f2fd" />
          </>
        );
      case "Registro de Compras":
        return (
          <>
            {barraNavegacao}
            <RegistrarCompras tema="#e3f2fd" />
          </>
        );
      case "Dados Avançados":
        return (
          <>
            {barraNavegacao}
            <ListaDadosEspecificos tema="#e3f2fd" />
          </>
        );
      default:
        return null; // Caso nenhuma tela seja selecionada
    }
  };

  return construirView();
}
