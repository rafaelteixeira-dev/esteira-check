let totalPecas = 30;
let pecasConferidas = 0;
let idPedidoAtual = null;

// Recupera dados do operador e do turno/lote logados
const sessao = JSON.parse(localStorage.getItem("sessaoAtiva")) || { operador: "Operador Padrão", lote: "100" };
const loteAtual = sessao.lote;
const operadorAtual = sessao.operador;

// Inicializa a conferência (recupera progresso se coincidir LOTE e OPERADOR)
function inicializarConferenca() {
  let pedidos = JSON.parse(localStorage.getItem("pedidosSmartPicking")) || [];

  // Procura se já existe um pedido em andamento para o MESMO LOTE e MESMO OPERADOR
  let pedidoExistente = pedidos.find(p => p.lote === loteAtual && p.operador === operadorAtual && p.status !== "Concluído");

  if (pedidoExistente) {
    idPedidoAtual = pedidoExistente.id;
    pecasConferidas = pedidoExistente.pecasConferidas;
  } else {
    idPedidoAtual = Math.floor(1000 + Math.random() * 9000);
    salvarEstadoNoDashboard("Em Andamento");
  }

  atualizarInterface();
}

// Atualiza o localStorage sincronizando o progresso com o Dashboard
function salvarEstadoNoDashboard(status) {
  let pedidos = JSON.parse(localStorage.getItem("pedidosSmartPicking")) || [];
  const porcentagem = Math.round((pecasConferidas / totalPecas) * 100);

  const dadosPedido = {
    id: idPedidoAtual,
    lote: loteAtual,
    operador: operadorAtual,
    pecasConferidas: pecasConferidas,
    totalPecas: totalPecas,
    porcentagem: porcentagem,
    status: status
  };

  const index = pedidos.findIndex(p => p.id === idPedidoAtual);
  if (index !== -1) {
    pedidos[index] = dadosPedido;
  } else {
    pedidos.unshift(dadosPedido);
  }

  localStorage.setItem("pedidosSmartPicking", JSON.stringify(pedidos));
}

// Atualiza contadores, barra de progresso e estado do botão no HTML
function atualizarInterface() {
  const counterText = document.getElementById("counterText");
  const progressPercent = document.getElementById("progressPercent");
  const progressBarFill = document.getElementById("progressBarFill");
  const btnFinalizar = document.getElementById("btnFinalizar");

  if (counterText) counterText.textContent = `${pecasConferidas} / ${totalPecas}`;
  
  const porcentagem = Math.round((pecasConferidas / totalPecas) * 100);
  if (progressPercent) progressPercent.textContent = `${porcentagem}%`;
  if (progressBarFill) progressBarFill.style.width = `${porcentagem}%`;

  if (btnFinalizar) {
    if (pecasConferidas >= totalPecas) {
      btnFinalizar.disabled = false;
      btnFinalizar.style.backgroundColor = "#000000";
      btnFinalizar.style.color = "#ffffff";
      btnFinalizar.style.cursor = "pointer";
    } else {
      btnFinalizar.disabled = true;
      btnFinalizar.style.backgroundColor = "#e8e8e8";
      btnFinalizar.style.color = "#666666";
      btnFinalizar.style.cursor = "not-allowed";
    }
  }
}

// Função centralizada para processar peças
function registrarPeca(sucesso, textoStatus, novoStatusDashboard = "Em Andamento") {
  if (pecasConferidas < totalPecas) {
    pecasConferidas++;
    
    const statusBanner = document.getElementById("statusBanner");
    if (statusBanner) {
      statusBanner.textContent = textoStatus;
      statusBanner.style.backgroundColor = sucesso ? "#000000" : "#d97706";
    }

    atualizarInterface();
    salvarEstadoNoDashboard(novoStatusDashboard);
  }
}

// Eventos da Tela
document.addEventListener("DOMContentLoaded", () => {
  inicializarConferenca();

  // Modal Divergência / Erro
  const btnReportar = document.getElementById("btnReportar");
  const modalDivergencia = document.getElementById("modalDivergencia");

  if (btnReportar && modalDivergencia) {
    btnReportar.addEventListener("click", () => {
      if (pecasConferidas < totalPecas) {
        modalDivergencia.showModal();
      } else {
        alert("Todas as peças deste lote já foram processadas!");
      }
    });
  }

  // Confirmação de Erro
  const btnConfirmarErro = document.getElementById("btnConfirmarErro");
  if (btnConfirmarErro) {
    btnConfirmarErro.addEventListener("click", () => {
      const motivoSelect = document.getElementById("motivoErro");
      const motivo = motivoSelect ? motivoSelect.value : "Divergência";

      if (modalDivergencia) modalDivergencia.close();

      registrarPeca(false, `[ DIVERGÊNCIA REGISTRADA: ${motivo.toUpperCase()} ]`, "Com Divergência");
    });
  }

  // Simulação de Leitura OK
  const btnSimular = document.getElementById("btnSimular");
  if (btnSimular) {
    btnSimular.addEventListener("click", () => {
      registrarPeca(true, "✓ PEÇA VALIDADA VIA SIMULAÇÃO");
    });
  }

  // Upload de Arquivo
  const inputFile = document.getElementById("inputFile");
  if (inputFile) {
    inputFile.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        registrarPeca(true, `✓ ARQUIVO ${e.target.files[0].name} ENVIADO`);
        inputFile.value = "";
      }
    });
  }

  // Finalizar Pedido
  const btnFinalizar = document.getElementById("btnFinalizar");
  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
      salvarEstadoNoDashboard("Concluído");
      alert("Pedido finalizado com sucesso!");
      window.location.href = "dashboard.html";
    });
  }
});
const inputCodigo = document.getElementById("inputCodigoManual");
const btnValidar = document.getElementById("btnValidarManual");

function processarCodigoManual() {
  const codigo = inputCodigo.value.trim();
  
  if (!codigo) {
    alert("Por favor, digite um código de barras.");
    return;
  }

  // Substitua 'validarCodigo' pelo nome da sua função existente que confere o item
  if (typeof validarCodigoLido === "function") {
    validarCodigoLido(codigo);
  } else {
    console.log("Código digitado:", codigo);
  }

  inputCodigo.value = ""; // Limpa o campo após validar
}

btnValidar.addEventListener("click", processarCodigoManual);

// Permite acionar a validação pressionando a tecla ENTER no teclado
inputCodigo.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    processarCodigoManual();
  }
});