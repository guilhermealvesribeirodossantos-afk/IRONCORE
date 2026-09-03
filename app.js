"use strict";

document.addEventListener("DOMContentLoaded", function () {

  console.log("IRONCORE carregado");

  /* =========================================================
     NAVEGAÇÃO PRINCIPAL
  ========================================================= */

  const screens =
    document.querySelectorAll(".screen");

  const navItems =
    document.querySelectorAll(".nav-item");

  function abrirTela(tela) {

    screens.forEach(function (screen) {
      screen.classList.remove("active");
    });

    const destino =
      document.querySelector(
        '[data-screen="' + tela + '"]'
      );

    if (destino) {
      destino.classList.add("active");
    }

    navItems.forEach(function (item) {

      item.classList.remove("active");

      if (item.dataset.target === tela) {
        item.classList.add("active");
      }

    });

    window.scrollTo({
      top: 0,
      behavior: "auto"
    });

  }

  navItems.forEach(function (item) {

    item.addEventListener(
      "click",
      function () {

        const tela =
          item.dataset.target;

        if (tela) {
          abrirTela(tela);
        }

      }
    );

  });


  /* =========================================================
     ELEMENTOS DA SESSÃO DE TREINO
  ========================================================= */

  const iniciarTreino =
    document.getElementById(
      "startWorkoutButton"
    );

  const telaTreino =
    document.getElementById(
      "workoutSession"
    );

  const fecharTreino =
    document.getElementById(
      "closeWorkoutSession"
    );

  const sessionDuration =
    document.getElementById(
      "sessionDuration"
    );


  /* =========================================================
     CRONÔMETRO DO TREINO
  ========================================================= */

  let treinoInicio = null;
  let treinoInterval = null;

  function formatarTempoTotal(
    totalSegundos
  ) {

    const horas =
      Math.floor(
        totalSegundos / 3600
      );

    const minutos =
      Math.floor(
        (totalSegundos % 3600) / 60
      );

    const segundos =
      totalSegundos % 60;

    if (horas > 0) {

      return (
        String(horas).padStart(2, "0") +
        ":" +
        String(minutos).padStart(2, "0") +
        ":" +
        String(segundos).padStart(2, "0")
      );

    }

    return (
      String(minutos).padStart(2, "0") +
      ":" +
      String(segundos).padStart(2, "0")
    );

  }

  function atualizarCronometroTreino() {

    if (
      !treinoInicio ||
      !sessionDuration
    ) {
      return;
    }

    const agora =
      Date.now();

    const segundos =
      Math.floor(
        (agora - treinoInicio) / 1000
      );

    sessionDuration.textContent =
      formatarTempoTotal(segundos);

  }

  function iniciarCronometroTreino() {

    if (!sessionDuration) {
      return;
    }

    if (!treinoInicio) {
      treinoInicio = Date.now();
    }

    atualizarCronometroTreino();

    if (treinoInterval) {
      clearInterval(
        treinoInterval
      );
    }

    treinoInterval =
      setInterval(
        atualizarCronometroTreino,
        1000
      );

  }

  function pausarCronometroTreino() {

    if (treinoInterval) {

      clearInterval(
        treinoInterval
      );

      treinoInterval = null;

    }

  }


  /* =========================================================
     ABRIR / FECHAR TREINO
  ========================================================= */

  if (
    iniciarTreino &&
    telaTreino
  ) {

    iniciarTreino.addEventListener(
      "click",
      function () {

        telaTreino.classList.remove(
          "hidden"
        );

        document.body.style.overflow =
          "hidden";

        iniciarCronometroTreino();

      }
    );

  }

  if (
    fecharTreino &&
    telaTreino
  ) {

    fecharTreino.addEventListener(
      "click",
      function () {

        telaTreino.classList.add(
          "hidden"
        );

        document.body.style.overflow =
          "";

        pausarCronometroTreino();

      }
    );

  }


  /* =========================================================
     SISTEMA DE SÉRIES
  ========================================================= */

  const setsContainer =
    document.getElementById(
      "setsContainer"
    );

  const addSetButton =
    document.getElementById(
      "addSetButton"
    );

  const STORAGE_KEY =
    "ironcore_series_v2";


  /* =========================================================
     CARREGAR SÉRIES SALVAS
  ========================================================= */

  function carregarSeries() {

    try {

      const dados =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!dados) {
        return [];
      }

      const convertido =
        JSON.parse(dados);

      if (
        !Array.isArray(
          convertido
        )
      ) {
        return [];
      }

      return convertido;

    } catch (erro) {

      console.error(
        "Erro ao carregar séries:",
        erro
      );

      return [];

    }

  }


  /* =========================================================
     SALVAR SÉRIES
  ========================================================= */

  function salvarTodasSeries() {

    if (!setsContainer) {
      return;
    }

    const linhas =
      setsContainer.querySelectorAll(
        ".set-row"
      );

    const dados = [];

    linhas.forEach(function (linha) {

      const inputs =
        linha.querySelectorAll(
          "input"
        );

      if (inputs.length < 2) {
        return;
      }

      dados.push({

        kg:
          inputs[0].value,

        reps:
          inputs[1].value,

        concluida:
          linha.classList.contains(
            "completed"
          )

      });

    });

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(dados)
    );

    atualizarContadorSeries();

  }


  /* =========================================================
     CRIAR NOVA LINHA DE SÉRIE
  ========================================================= */

  function criarLinhaSerie(
    numero
  ) {

    const linha =
      document.createElement(
        "div"
      );

    linha.className =
      "set-row";

    linha.innerHTML = `
      <strong>${numero}</strong>

      <input
        type="number"
        inputmode="decimal"
        min="0"
        step="0.5"
        placeholder="0"
        aria-label="Carga série ${numero}"
      >

      <input
        type="number"
        inputmode="numeric"
        min="0"
        step="1"
        placeholder="0"
        aria-label="Repetições série ${numero}"
      >

      <button
        class="complete-set-button"
        type="button"
        aria-label="Concluir série ${numero}"
      >

        <svg>
          <use href="#icon-check"></use>
        </svg>

      </button>
    `;

    return linha;

  }


  /* =========================================================
     RESTAURAR SÉRIES SALVAS
  ========================================================= */

  function restaurarSeries() {

    if (!setsContainer) {
      return;
    }

    const seriesSalvas =
      carregarSeries();

    while (
      setsContainer.querySelectorAll(
        ".set-row"
      ).length <
      seriesSalvas.length
    ) {

      const numero =
        setsContainer.querySelectorAll(
          ".set-row"
        ).length + 1;

      const novaLinha =
        criarLinhaSerie(
          numero
        );

      setsContainer.appendChild(
        novaLinha
      );

    }

    const linhas =
      setsContainer.querySelectorAll(
        ".set-row"
      );

    linhas.forEach(
      function (
        linha,
        indice
      ) {

        const salvo =
          seriesSalvas[indice];

        if (!salvo) {
          return;
        }

        const inputs =
          linha.querySelectorAll(
            "input"
          );

        const botao =
          linha.querySelector(
            ".complete-set-button"
          );

        if (
          inputs.length >= 2
        ) {

          inputs[0].value =
            salvo.kg ?? "";

          inputs[1].value =
            salvo.reps ?? "";

        }

        if (
          salvo.concluida
        ) {

          linha.classList.add(
            "completed"
          );

          if (botao) {

            botao.classList.add(
              "completed"
            );

          }

        } else {

          linha.classList.remove(
            "completed"
          );

          if (botao) {

            botao.classList.remove(
              "completed"
            );

          }

        }

      }
    );

    atualizarContadorSeries();

  }


  /* =========================================================
     CONTADOR DE SÉRIES CONCLUÍDAS
  ========================================================= */

  const seriesCounterStrong =
    document.querySelector(
      ".series-counter strong"
    );

  function atualizarContadorSeries() {

    if (
      !setsContainer ||
      !seriesCounterStrong
    ) {
      return;
    }

    const concluidas =
      setsContainer.querySelectorAll(
        ".set-row.completed"
      ).length;

    seriesCounterStrong.textContent =
      concluidas;

  }


  /* =========================================================
     DIGITAR KG / REPS
  ========================================================= */

  if (setsContainer) {

    setsContainer.addEventListener(
      "input",
      function (evento) {

        const alvo =
          evento.target;

        if (
          alvo &&
          alvo.tagName === "INPUT"
        ) {

          salvarTodasSeries();

        }

      }
    );

  }


  /* =========================================================
     CRONÔMETRO DE DESCANSO
  ========================================================= */

  const restTimerValue =
    document.getElementById(
      "restTimerValue"
    );

  const restMinusButton =
    document.getElementById(
      "restMinusButton"
    );

  const restPlusButton =
    document.getElementById(
      "restPlusButton"
    );

  const restSkipButton =
    document.getElementById(
      "restSkipButton"
    );

  const DESCANSO_PADRAO =
    120;

  let descansoRestante =
    DESCANSO_PADRAO;

  let descansoInterval =
    null;

  let descansoAtivo =
    false;


  function formatarDescanso(
    segundos
  ) {

    const minutos =
      Math.floor(
        segundos / 60
      );

    const resto =
      segundos % 60;

    return (
      String(minutos).padStart(2, "0") +
      ":" +
      String(resto).padStart(2, "0")
    );

  }

  function atualizarDisplayDescanso() {

    if (!restTimerValue) {
      return;
    }

    restTimerValue.textContent =
      formatarDescanso(
        Math.max(
          0,
          descansoRestante
        )
      );

  }

  function pararDescanso() {

    if (descansoInterval) {

      clearInterval(
        descansoInterval
      );

      descansoInterval = null;

    }

    descansoAtivo = false;

  }

  function finalizarDescanso() {

    pararDescanso();

    descansoRestante = 0;

    atualizarDisplayDescanso();

    if (
      navigator.vibrate
    ) {

      navigator.vibrate(
        [150, 80, 150]
      );

    }

  }

  function iniciarDescanso() {

    pararDescanso();

    descansoRestante =
      DESCANSO_PADRAO;

    descansoAtivo = true;

    atualizarDisplayDescanso();

    descansoInterval =
      setInterval(
        function () {

          descansoRestante -= 1;

          if (
            descansoRestante <= 0
          ) {

            finalizarDescanso();
            return;

          }

          atualizarDisplayDescanso();

        },
        1000
      );

  }

  function alterarDescanso(
    segundos
  ) {

    descansoRestante +=
      segundos;

    if (
      descansoRestante < 0
    ) {

      descansoRestante = 0;

    }

    atualizarDisplayDescanso();

    if (
      descansoRestante === 0
    ) {

      pararDescanso();

    }

  }

  if (restMinusButton) {

    restMinusButton.addEventListener(
      "click",
      function () {

        alterarDescanso(
          -15
        );

      }
    );

  }

  if (restPlusButton) {

    restPlusButton.addEventListener(
      "click",
      function () {

        alterarDescanso(
          15
        );

      }
    );

  }

  if (restSkipButton) {

    restSkipButton.addEventListener(
      "click",
      function () {

        finalizarDescanso();

      }
    );

  }


  /* =========================================================
     CONCLUIR SÉRIE
  ========================================================= */

  if (setsContainer) {

    setsContainer.addEventListener(
      "click",
      function (evento) {

        const botao =
          evento.target.closest(
            ".complete-set-button"
          );

        if (!botao) {
          return;
        }

        const linha =
          botao.closest(
            ".set-row"
          );

        if (!linha) {
          return;
        }

        const inputs =
          linha.querySelectorAll(
            "input"
          );

        if (
          inputs.length < 2
        ) {
          return;
        }

        const kg =
          Number(
            inputs[0].value
          );

        const reps =
          Number(
            inputs[1].value
          );

        if (
          kg <= 0 ||
          reps <= 0
        ) {

          alert(
            "Informe a carga e as repetições antes de concluir a série."
          );

          return;

        }

        const vaiConcluir =
          !linha.classList.contains(
            "completed"
          );

        linha.classList.toggle(
          "completed",
          vaiConcluir
        );

        botao.classList.toggle(
          "completed",
          vaiConcluir
        );

        salvarTodasSeries();

        if (vaiConcluir) {
          iniciarDescanso();
        }

      }
    );

  }


  /* =========================================================
     ADICIONAR NOVA SÉRIE
  ========================================================= */

  if (
    addSetButton &&
    setsContainer
  ) {

    addSetButton.addEventListener(
      "click",
      function (evento) {

        evento.preventDefault();

        const quantidade =
          setsContainer.querySelectorAll(
            ".set-row"
          ).length;

        const numero =
          quantidade + 1;

        const novaLinha =
          criarLinhaSerie(
            numero
          );

        setsContainer.appendChild(
          novaLinha
        );

        salvarTodasSeries();

        novaLinha.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });

        console.log(
          "Série " +
          numero +
          " adicionada"
        );

      }
    );

  }


  /* =========================================================
     INICIALIZAÇÃO
  ========================================================= */

  restaurarSeries();

  atualizarDisplayDescanso();

  if (sessionDuration) {
    sessionDuration.textContent =
      "00:00";
  }

});
