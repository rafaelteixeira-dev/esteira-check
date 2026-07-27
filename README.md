# 📦 SmartPicking Web - Conferência e Separação de Peças

## 👥 Integrantes
* Ryan Nicolas
* Rafael Teixeira

## 🏫 Informações do Curso
* **Turma:** Turma B  
* **Disciplina:** Front-End 2  
* **Professor:** Wesley Pecoraro  

---

## 📋 Descrição do Projeto

* **Domínio:** Automação e Gestão de Estoque Industrial (Indústria Metalmecânica / Esteiras Plásticas).
* **Cliente:** Bumerangue Brasil Industrial Ltda (Chapecó - SC).
* **Dores do Cliente:** 
  * Média de 3 reclamações/mês por entrega de pedidos com divergência de peças.
  * Custos extras com frete para envio de peças faltantes.
  * Processo de separação 100% manual em caixas de papelão, suscetível a erros de contagem repetitiva em lotes maiores que 30 peças.
* **Objetivo:** Zerar o índice de divergências na separação de peças por meio de uma interface web intuitiva para conferência visual e auditiva em tempo real.
* **Solução Proposta:** Uma aplicação web voltada para tablets/smartphones de chão de fábrica com leitura de código de barras/QR Code via câmera do navegador, assistente de contagem passo a passo com alertas de erro e painel administrativo de acompanhamento de pedidos.

---

## 🎯 Requisitos Funcionais (RF)

1. **RF01 - Autenticação de Operador:** O operador deve conseguir selecionar seu perfil/login simples para iniciar o turno de separação.
2. **RF02 - Seleção de Pedido de Montagem:** O sistema deve listar os pedidos pendentes de separação com detalhes da quantidade de peças por tipo (engrenagens, roldanas e roletes).
3. **RF03 - Interface de Conferência (Picking):** Exibir tela com contador em tempo real ("25/30 peças conferidas") e barra de progresso visual.
4. **RF04 - Leitura por QR Code/Código de Barro:** Permitir a validação da peça bipando/escaneando com a câmera do dispositivo móvel.
5. **RF05 - Alertas Visuais e Sonoros:** Emitir sinal sonoro/visual verde para peça correta e vermelho/sinal de erro para peça incorreta ou quantidade excedida.
6. **RF06 - Finalização e Emissão de Etiqueta de Conferência:** Permitir a trava do pedido somente após 100% dos itens serem validados corretamente.
7. **RF07 - Dashboard do Supervisor:** Painel desktop com histórico de pedidos finalizados, tempo médio de separação e taxa de acertos.

---

## 🔒 Requisitos Não-Funcionais (RNF)

1. **RNF01 - Usabilidade e Acessibilidade (Padrão Industrial):** Interface com botões grandes, contraste elevado e alta legibilidade para operação fácil com luvas ou em ambientes de fábrica.
2. **RNF02 - Responsividade:** A interface de separação deve ser 100% otimizada para smartphones e tablets (Mobile-First).
3. **RNF03 - Baixo Custo / Leveza:** O sistema deve rodar direto em navegadores modernos sem necessidade de hardware dedicado caro.
4. **RNF04 - Performance:** O feedback de leitura da peça deve ocorrer em menos de 1 segundo para não atrasar a produção.
