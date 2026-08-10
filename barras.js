
let totalPecas = 30;
let pecasConferidas = 22;
let itemAtual = {
    nome: "Engrenagem Plástica 50mm",
    codigo: "7891234567890"
};

let html5QrcodeScanner = null;


const progressPercent = document.getElementById("progressPercent");
const progressBarFill = document.getElementById("progressBarFill");
const counterText = document.getElementById("counterText");
const statusBanner = document.getElementById("statusBanner");
const btnToggleCamera = document.getElementById("btnToggleCamera");
const btnReportar = document.getElementById("btnReportar");
const btnConfirmarErro = document.getElementById("btnConfirmarErro");
const modalDivergencia = document.getElementById("modalDivergencia");


function atualizarInterface() {
    const percentual = Math.round((pecasConferidas / totalPecas) * 100);
    progressPercent.innerText = `${percentual}%`;
    progressBarFill.style.width = `${percentual}%`;
    counterText.innerText = `${pecasConferidas} / ${totalPecas}`;

    if (pecasConferidas >= totalPecas) {
        document.getElementById("btnFinalizar").disabled = false;
        document.getElementById("btnFinalizar").style.backgroundColor = "#000";
        document.getElementById("btnFinalizar").style.color = "#fff";
    }
}


function validarCodigoLido(codigoLido) {
   
    const produtosCadastrados = JSON.parse(localStorage.getItem('smartpicking_produtos')) || [];
    
    if (codigoLido === itemAtual.codigo) {
        
        pecasConferidas++;
        statusBanner.style.backgroundColor = "#10b981"; 
        statusBanner.innerText = "✓ [ STATUS: PEÇA CORRETA - VALIDADA ]";
        atualizarInterface();
    } else {
       
        statusBanner.style.backgroundColor = "#ef4444"; 
        statusBanner.innerText = `✖ [ ERRO: CÓDIGO LIDO (${codigoLido}) NÃO CORRESPONDE! ]`;
    }
}


btnToggleCamera.addEventListener("click", () => {
    const readerDiv = document.getElementById("reader");
    const placeholder = document.getElementById("scannerPlaceholder");

    if (!html5QrcodeScanner) {
        placeholder.style.display = "none";
        readerDiv.style.display = "block";

        html5QrcodeScanner = new Html5QrcodeScanner("reader", { 
            fps: 10, 
            qrbox: { width: 250, height: 150 } 
        });

        html5QrcodeScanner.render((decodedText) => {
            validarCodigoLido(decodedText);
            
            html5QrcodeScanner.clear();
            html5QrcodeScanner = null;
            readerDiv.style.display = "none";
            placeholder.style.display = "flex";
        }, (error) => {
        });
    }
});


btnReportar.addEventListener("click", () => {
    modalDivergencia.showModal();
});

btnConfirmarErro.addEventListener("click", () => {
    const motivo = document.getElementById("motivoErro").value;
    modalDivergencia.close();
    
    statusBanner.style.backgroundColor = "#f59e0b"; 
    statusBanner.innerText = `⚠️ [ DIVERGÊNCIA REGISTRADA: ${motivo.toUpperCase()} ]`;
});

atualizarInterface();