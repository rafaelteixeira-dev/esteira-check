const form = document.getElementById('formProduto');

function obterProdutos() {
  const dados = localStorage.getItem('smartpicking_produtos');
  if (!dados) {
    return [{ nome: "Engrenagem Plástica 50mm", codigo: "7891234567890" }];
  }
  return JSON.parse(dados);
}

function carregarProdutos() {
  const tabela = document.getElementById('tabelaProdutos');
  if (!tabela) return; 

  const produtos = obterProdutos();
  tabela.innerHTML = '';

  if (produtos.length === 0) {
    tabela.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #888; padding: 15px;">Nenhum produto cadastrado.</td></tr>';
    return;
  }

  produtos.forEach((p, index) => {
    tabela.innerHTML += `
          <tr>
            <td>${p.nome}</td>
            <td><code>${p.codigo}</code></td>
            <td><button onclick="removerProduto(${index})" style="color: #d9534f; cursor: pointer; border: none; background: none; font-weight: bold;">Excluir</button></td>
          </tr>
        `;
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nomeInput = document.getElementById('nomeProduto');
  const codigoInput = document.getElementById('codigoProduto');

  if (!nomeInput.value.trim() || !codigoInput.value.trim()) return;

  const novoProduto = {
    nome: nomeInput.value.trim(),
    codigo: codigoInput.value.trim()
  };

  const produtos = obterProdutos();
  produtos.push(novoProduto);

  localStorage.setItem('smartpicking_produtos', JSON.stringify(produtos));

  
  nomeInput.value = '';
  codigoInput.value = '';

  
  carregarProdutos();
});

function removerProduto(index) {
  const produtos = obterProdutos();
  produtos.splice(index, 1);
  localStorage.setItem('smartpicking_produtos', JSON.stringify(produtos));
  carregarProdutos();
}


document.addEventListener('DOMContentLoaded', carregarProdutos);