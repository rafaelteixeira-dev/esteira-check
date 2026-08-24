document.addEventListener("DOMContentLoaded", () => {
  const selectOperador = document.getElementById("operadorName");
  const inputSenha = document.getElementById("senha-input");
  const inputLote = document.getElementById("workShift");
  const formLogin = document.getElementById("loginForm") || document.querySelector("form");
  const btnCadastro = document.getElementById("open-cadastro");

  // Operadores padrão com senha
  const operadoresPadrao = [
    { nome: "Lucas Santos", senha: "1234" },
    { nome: "Ryan Nicolas", senha: "1234" },
    { nome: "Rafael Teixeira", senha: "1234" },
    { nome: "Levi", senha: "1234" }
  ];

  // Recupera e corrige dados salvos que estavam sem senha no localStorage
  function obterOperadoresAtualizados() {
    let salvos = JSON.parse(localStorage.getItem("operadoresCadastrados"));

    if (!salvos || !Array.isArray(salvos) || salvos.length === 0) {
      salvos = operadoresPadrao;
    } else {
      // Garante que cadastros antigos sem senha recebam "1234" por padrão
      salvos = salvos.map(op => {
        if (!op.senha) op.senha = "1234";
        return op;
      });

      // Inclui operadores padrão faltantes
      operadoresPadrao.forEach(padrao => {
        const existe = salvos.some(s => s.nome.toLowerCase() === padrao.nome.toLowerCase());
        if (!existe) {
          salvos.push(padrao);
        }
      });
    }

    localStorage.setItem("operadoresCadastrados", JSON.stringify(salvos));
    return salvos;
  }

  function carregarOperadores() {
    if (!selectOperador) return;

    const salvos = obterOperadoresAtualizados();

    selectOperador.innerHTML = `<option value="" disabled selected hidden>Selecione seu nome</option>`;
    salvos.forEach(op => {
      const option = document.createElement("option");
      option.value = op.nome;
      option.textContent = op.nome;
      selectOperador.appendChild(option);
    });
  }

  carregarOperadores();

  // Botão +Cadastrar novo operador
  if (btnCadastro) {
    btnCadastro.addEventListener("click", () => {
      const novoNome = prompt("Digite o nome do novo operador:");
      if (!novoNome || novoNome.trim() === "") return;

      const novaSenha = prompt(`Digite a senha para ${novoNome.trim()}:`);
      if (!novaSenha || novaSenha.trim() === "") {
        alert("A senha não pode ser vazia!");
        return;
      }

      let salvos = obterOperadoresAtualizados();
      const jaExiste = salvos.some(op => op.nome.toLowerCase() === novoNome.trim().toLowerCase());

      if (!jaExiste) {
        const novoOperador = { nome: novoNome.trim(), senha: novaSenha.trim() };
        salvos.push(novoOperador);
        localStorage.setItem("operadoresCadastrados", JSON.stringify(salvos));

        carregarOperadores();
        selectOperador.value = novoOperador.nome;
        alert(`Operador "${novoNome.trim()}" cadastrado com sucesso!`);
      } else {
        alert("Este operador já está cadastrado!");
      }
    });
  }

  // Validação do formulário de login
  if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
      e.preventDefault();

      const nomeSelecionado = selectOperador ? selectOperador.value : "";
      const senhaDigitada = inputSenha ? inputSenha.value.trim() : "";
      const lote = inputLote && inputLote.value.trim() !== "" ? inputLote.value.trim() : "LOTE-01";

      if (!nomeSelecionado) {
        alert("Por favor, selecione um operador!");
        return;
      }

      if (!senhaDigitada) {
        alert("Por favor, digite a sua senha!");
        return;
      }

      const salvos = obterOperadoresAtualizados();
      const operadorEncontrado = salvos.find(
        op => op.nome.toLowerCase() === nomeSelecionado.toLowerCase()
      );

      if (operadorEncontrado && operadorEncontrado.senha === senhaDigitada) {
        localStorage.setItem("sessaoAtiva", JSON.stringify({ operador: operadorEncontrado.nome, lote: lote }));
        window.location.href = "barras.html";
      } else {
        alert("Senha incorreta! Tente novamente.");
      }
    });
  }
});