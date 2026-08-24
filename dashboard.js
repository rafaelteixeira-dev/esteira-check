let filtroStatusAtual = "Em Andamento";

// 1. Troca de Abas (Pedidos x Cadastro de Produtos)
function trocarAba(aba) {
  const sectionPedidos = document.getElementById("sectionPedidos");
  const sectionProdutos = document.getElementById("sectionProdutos");
  const btnPedidos = document.getElementById("tabBtnPedidos");
  const btnProdutos = document.getElementById("tabBtnProdutos");

  if (aba === "pedidos") {
    if (sectionPedidos) sectionPedidos.style.display = "block";
    if (sectionProdutos) sectionProdutos.style.display = "none";
    if (btnPedidos) btnPedidos.classList.add("active");
    if (btnProdutos) btnProdutos.classList.remove("active");
  } else {
    if (sectionPedidos) sectionPedidos.style.display = "none";
    if (sectionProdutos) sectionProdutos.style.display = "block";
    if (btnProdutos) btnProdutos.classList.add("active");
    if (btnPedidos) btnPedidos.classList.remove("active");
  }
}

// 2. Carregar Pedidos Filtrados
function carregarPedidosDashboard() {
  const pedidos = JSON.parse(localStorage.getItem("pedidosSmartPicking")) || [];
  const tabelaPedidos = document.getElementById("tabelaPedidos");
  const inputBusca = document.querySelector("input[placeholder*='Buscar']");
  const termoBusca = inputBusca ? inputBusca.value.toLowerCase().trim() : "";

  if (!tabelaPedidos) return;
  tabelaPedidos.innerHTML = "";

  let concluidos = 0;
  let emAndamento = 0;

  pedidos.forEach((p) => {
    if (p.status === "Concluído") concluidos++;
    else emAndamento++;
  });

  const kpiConcluidos = document.getElementById("kpiConcluidos");
  const kpiAndamento = document.getElementById("kpiAndamento");
  const kpiTotal = document.getElementById("kpiTotal");

  if (kpiConcluidos) kpiConcluidos.textContent = concluidos;
  if (kpiAndamento) kpiAndamento.textContent = emAndamento;
  if (kpiTotal) kpiTotal.textContent = pedidos.length;

  const pedidosFiltrados = pedidos.filter((p) => {
    const bateuStatus = p.status === filtroStatusAtual;
    const bateuTexto = p.id.toString().toLowerCase().includes(termoBusca) || 
                       p.lote.toString().toLowerCase().includes(termoBusca) || 
                       p.operador.toLowerCase().includes(termoBusca);
    return bateuStatus && bateuTexto;
  });

  pedidosFiltrados.forEach((p) => {
    const indexOriginal = pedidos.findIndex(item => item.id === p.id);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>#${p.id} (Lote: ${p.lote})</strong></td>
      <td>${p.operador}</td>
      <td>${p.pecasConferidas} / ${p.totalPecas} (${p.porcentagem}%)</td>
      <td><span class="badge-status ${p.status === 'Concluído' ? 'badge-concluded' : 'badge-progress'}">${p.status}</span></td>
      <td><button class="btn-details" onclick="abrirDetalhes(${indexOriginal})" style="padding: 6px 12px; cursor: pointer; background: #fff; border: 1px solid #000; font-weight: bold; border-radius: 4px;">[ DETALHES ]</button></td>
    `;
    tabelaPedidos.appendChild(tr);
  });
}

// 3. Carregar e Exibir Produtos Cadastrados
function carregarProdutosDashboard() {
  const produtos = JSON.parse(localStorage.getItem("produtosSmartPicking")) || [];
  const tabelaProdutos = document.getElementById("tabelaProdutos") || document.querySelector(".product-table");

  if (!tabelaProdutos) return;

  let tbody = tabelaProdutos.tagName === "TABLE" ? tabelaProdutos.querySelector("tbody") : tabelaProdutos;
  if (!tbody && tabelaProdutos.tagName === "TABLE") {
    tbody = document.createElement("tbody");
    tabelaProdutos.appendChild(tbody);
  }

  if (tbody) {
    tbody.innerHTML = "";
    produtos.forEach((prod, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${prod.codigo || index + 1}</td>
        <td>${prod.nome || "Produto sem nome"}</td>
        <td>${prod.qtd || 0}</td>
        <td><button onclick="excluirProduto(${index})" style="padding: 4px 8px; cursor: pointer; background: #ff4d4d; color: #fff; border: none; border-radius: 4px;">Excluir</button></td>
      `;
      tbody.appendChild(tr);
    });
  }
}

// 4. Cadastrar Novo Produto
function configurarFormularioProduto() {
  const formProduto = document.getElementById("formProduto") || document.querySelector("#sectionProdutos form");

  if (!formProduto) return;

  formProduto.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputs = formProduto.querySelectorAll("input, select");
    
    const codigo = document.getElementById("prodCodigo")?.value || inputs[0]?.value || "";
    const nome = document.getElementById("prodNome")?.value || inputs[1]?.value || "";
    const qtd = document.getElementById("prodQtd")?.value || inputs[2]?.value || "1";

    if (!nome && !codigo) {
      alert("Por favor, preencha os dados do produto!");
      return;
    }

    let produtos = JSON.parse(localStorage.getItem("produtosSmartPicking")) || [];
    produtos.unshift({
      codigo: codigo || `PRD-${Date.now().toString().slice(-4)}`,
      nome: nome || "Novo Produto",
      qtd: qtd || 1
    });

    localStorage.setItem("produtosSmartPicking", JSON.stringify(produtos));
    formProduto.reset();
    carregarProdutosDashboard();
    alert("Produto cadastrado com sucesso!");
  });
}

// Excluir Produto
function excluirProduto(index) {
  let produtos = JSON.parse(localStorage.getItem("produtosSmartPicking")) || [];
  produtos.splice(index, 1);
  localStorage.setItem("produtosSmartPicking", JSON.stringify(produtos));
  carregarProdutosDashboard();
}

// 5. Configuração dos Filtros Apenas para (Em Andamento, Concluídos, Com Divergência)
function configurarFiltros() {
  const botoesFiltro = document.querySelectorAll(".sidebar button, .sidebar div");

  botoesFiltro.forEach((btn) => {
    const texto = btn.textContent.trim();

    if (texto.includes("Em Andamento") || texto.includes("Concluídos") || texto.includes("Com Divergência")) {
      btn.style.cursor = "pointer";
      btn.addEventListener("click", () => {
        if (texto.includes("Em Andamento")) filtroStatusAtual = "Em Andamento";
        else if (texto.includes("Concluídos")) filtroStatusAtual = "Concluído";
        else if (texto.includes("Com Divergência")) filtroStatusAtual = "Com Divergência";

        carregarPedidosDashboard();
      });
    }
  });

  const inputBusca = document.querySelector("input[placeholder*='Buscar']");
  if (inputBusca) {
    inputBusca.addEventListener("input", () => {
      carregarPedidosDashboard();
    });
  }
}

function abrirDetalhes(index) {
  const pedidos = JSON.parse(localStorage.getItem("pedidosSmartPicking")) || [];
  const pedido = pedidos[index];

  if (pedido) {
    document.getElementById("detalheId").textContent = `#${pedido.id}`;
    document.getElementById("detalheLote").textContent = pedido.lote;
    document.getElementById("detalheOperador").textContent = pedido.operador;
    document.getElementById("detalheProgresso").textContent = `${pedido.pecasConferidas} / ${pedido.totalPecas} (${pedido.porcentagem}%)`;
    document.getElementById("detalheStatus").textContent = pedido.status;

    const modal = document.getElementById("modalDetalhes");
    if (modal) modal.showModal();
  }
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  carregarPedidosDashboard();
  carregarProdutosDashboard();
  configurarFiltros();
  configurarFormularioProduto();

  const btnPedidos = document.getElementById("tabBtnPedidos");
  const btnProdutos = document.getElementById("tabBtnProdutos");

  if (btnPedidos) btnPedidos.addEventListener("click", () => trocarAba("pedidos"));
  if (btnProdutos) btnProdutos.addEventListener("click", () => trocarAba("produtos"));
});