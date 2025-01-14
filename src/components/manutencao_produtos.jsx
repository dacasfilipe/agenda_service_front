import {useForm} from "react-hook-form";
import { useState, useEffect } from "react";
import { api } from "../config_axios";
import ItemLista from "./ItemLista";  

const ManutencaoProdutos = () => {
    //servem para manipular os dados do formulário
    const {register, handleSubmit, reset} = useForm();
    //guardar e setar as informações do objeto
    const [produtos, setProdutos] = useState([]);

    const obterLista = async () => {
        try{
            const lista = await api.get("product/all");
            console.log("lista:"+lista.data);
            setProdutos(lista.data);
        }catch(error){
            alert(`Erro: ..Não foi possível obter os dados: ${error}`);
        }
    }


//define o método que será executado assim que o componente
// for renderizado
// Add a state variable to control page reload
const [produtosReload, setProdutosReload] = useState(false);

// Update the render condition to trigger reload when produtosReload changes
useEffect(() => {
    obterLista(); 
  if (produtosReload) {
    obterLista(); // Fetch updated data and re-render
    setProdutosReload(false); // Reset the reload flag
  }
}, [produtosReload]);

const filtrarLista = async (campos) => {
    try{
        const lista = await api.get(`product/filtro/${campos.palavra}`);
        lista.data.length
        ? setProdutos(lista.data)
        : alert("Não há produtos cadastrados com a palavra chave pesquisada");
    }catch(error){
        alert(`Erro: ..Não foi possível obter os dados: ${error}`);
    }
}

const excluir = async (id, name) => {
    if (!window.confirm(`Confirma a exclusão do Produto ${name}?`)) {
      return;
    }
  
    try {
      console.log("id é:" + id);
      await api.delete(`product/deleteProduct/${id}`);
  
      // Set a state variable to trigger page reload
      setProdutosReload(true);
  
      // Update the produtos state after the deletion is successful
      setProdutos(produtos.filter((produto) => produto.id !== id));
    } catch (error) {
      alert(`Erro: ..Não foi possível excluir o produto ${name}: ${error}`);
    }
  };

//alterar os registros
const alterar = async (id, name, description, price, index) => {
    const novoNome = prompt(`Digite o novo nome do produto ${name}`);
    if (novoNome == "") {
      alert('Digite um nome válido!(nome em branco)')
      return;
    }
    try {
      // Encapsulando os dados em um objeto
      const dadosProduto = {
        id: id,
        name: novoNome,
        description: description,
        price: price
      };
  
      // Passando o objeto com os dados para a requisição
      await api.put(`product/updateProduct`, dadosProduto);
  
      // Atualizando a lista de produtos no estado
      const updatedProdutos = [...produtos]; // Criando uma cópia da lista atual
      const produtoIndex = updatedProdutos.findIndex(produto => produto.id === id); // Encontrando o índice do produto a ser atualizado
  
      if (produtoIndex !== -1) {
        // Atualizando o produto na cópia da lista
        updatedProdutos[produtoIndex] = {
          id: id,
          name: novoNome,
          description: description,
          price: price
        };
  
        // Definindo a lista atualizada no estado
        setProdutos(updatedProdutos);
      } else {
        console.error(`Produto com id ${id} não encontrado na lista para ser atualizado.`);
      }
  
      // Set a state variable to trigger page reload
      setProdutosReload(true);
    } catch (error) {
      alert(`Erro: ..Não foi possível alterar o produto ${name}: ${error}`);
    }
  };
  

    return (
       <div className="container">
        <div className="row">
            <div className="col-sm-7">
                <h4 className="fst-italic mt-3">Manutenção de Produtos</h4>
            </div>
            <div className="col-sm-5">
                <form onSubmit={handleSubmit(filtrarLista)}>
                    <div className="input-group mt-3">
                        <input type="text" className="form-control" placeholder="Nome" required {...register("palavra")} />
                        <input type="submit" className="btn btn-primary" value="Pesquisar" />
                        <input type="button" className="btn btn-danger" value="Todos" onClick={()=>{reset({palavra:""});obterLista();}}/>
                    </div>
                </form>
            </div>
        </div>

        <table className="table table-striped mt-3">
            <thead>
                <tr>
                    <th>Cód.</th>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Preço</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {produtos.map((produto) => (
                    <ItemLista
                        key={produto.id}
                        id={produto.id}
                        name={produto.name}
                        description={produto.description} 
                        price={produto.price}                             
                        excluirClick={()=>excluir(produto.id,produto.name)}
                        alterarClick={()=>alterar(produto.id,produto.name,produto.description,produto.price)}
                    />
                ))}
            </tbody>
        </table>

       </div> 
    );
};

export default ManutencaoProdutos;