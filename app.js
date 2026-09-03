"use strict";

document.addEventListener("DOMContentLoaded", function () {

  console.log("IRONCORE carregado");

  /* =========================================================
     NAVEGAÇÃO
  ========================================================= */

  const screens = document.querySelectorAll(".screen");
  const navItems = document.querySelectorAll(".nav-item");

  function abrirTela(tela) {

    screens.forEach(function (screen) {
      screen.classList.remove("active");
    });

    const destino = document.querySelector(
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

    window.scrollTo(0, 0);
  }

  navItems.forEach(function (item) {

    item.addEventListener("click", function () {
      abrirTela(item.dataset.target);
    });

  });


  /* =========================================================
     ABRIR / FECHAR TREINO
  ========================================================= */

  const iniciarTreino =
    document.getElementById("startWorkoutButton");

  const telaTreino =
    document.getElementById("workoutSession");

  const fecharTreino =
    document.getElementById("closeWorkoutSession");

  if (iniciarTreino && telaTreino) {

    iniciarTreino.addEventListener("click", function () {

      telaTreino.classList.remove("hidden");

      document.body.style.overflow = "hidden";

    });

  }

  if (fecharTreino && telaTreino) {

    fecharTreino.addEventListener("click", function () {

      telaTreino.classList.add("hidden");

      document.body.style.overflow = "";

    });

  }


  /* =========================================================
     SISTEMA DE SÉRIES
  ========================================================= */

  const setsContainer =
    document.getElementById("setsContainer");

  const addSetButton =
    document.getElementById("addSetButton");

  const STORAGE_KEY =
    "ironcore_series_v2";


  /* =========================================================
     CARREGAR DADOS
  ========================================================= */

  function carregarSeries() {

    try {

      const dados =
        localStorage.getItem(STORAGE_KEY);

      if (!dados) {
        return [];
      }

      const convertido =
        JSON.parse(dados);

      if (!Array.isArray(convertido)) {
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
     SALVAR TODAS AS SÉRIES
  ========================================================= */

  function salvarTodasSeries() {

    if (!setsContainer) {
      return;
    }

    const linhas =
      setsContainer.querySelectorAll(".set-row");

    const dados = [];

    linhas.forEach(function (linha) {

      const inputs =
        linha.querySelectorAll("input");

      if (inputs.length < 2) {
        return;
      }

      dados.push({

        kg:
          inputs[0].value,

        reps:
          inputs[1].value,

        concluida:
          linha.classList.contains("completed")

      });

    });

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(dados)
    );

  }


  /* =========================================================
     CRIAR LINHA DE SÉRIE
  ========================================================= */

  function criarLinhaSerie(numero) {

    const linha =
      document.createElement("div");

    linha.className = "set-row";

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

    /*
      O HTML começa com 3 séries.

      Se o usuário salvou 4, 5, 6...
      recriamos automaticamente as extras.
    */

    while (
      setsContainer.querySelectorAll(".set-row").length <
      seriesSalvas.length
    ) {

      const numero =
        setsContainer.querySelectorAll(".set-row").length + 1;

      const novaLinha =
        criarLinhaSerie(numero);

      setsContainer.appendChild(
        novaLinha
      );

    }


    const linhas =
      setsContainer.querySelectorAll(".set-row");

    linhas.forEach(function (linha, indice) {

      const salvo =
        seriesSalvas[indice];

      if (!salvo) {
        return;
      }

      const inputs =
        linha.querySelectorAll("input");

      const botao =
        linha.querySelector(
          ".complete-set-button"
        );

      if (inputs.length >= 2) {

        inputs[0].value =
          salvo.kg ?? "";

        inputs[1].value =
          salvo.reps ?? "";

      }

      if (salvo.concluida) {

        linha.classList.add(
          "completed"
        );

        if (botao) {

          botao.classList.add(
            "completed"
          );

        }

      }

    });

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
          botao.closest(".set-row");

        if (!linha) {
          return;
        }

        const inputs =
          linha.querySelectorAll("input");

        if (inputs.length < 2) {
          return;
        }

        const kg =
          Number(inputs[0].value);

        const reps =
          Number(inputs[1].value);

        if (
          kg <= 0 ||
          reps <= 0
        ) {

          alert(
            "Informe a carga e as repetições antes de concluir a série."
          );

          return;

        }

        const concluida =
          !linha.classList.contains(
            "completed"
          );

        linha.classList.toggle(
          "completed",
          concluida
        );

        botao.classList.toggle(
          "completed",
          concluida
        );

        salvarTodasSeries();

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
          criarLinhaSerie(numero);

        setsContainer.appendChild(
          novaLinha
        );

        salvarTodasSeries();

        novaLinha.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });

        console.log(
          "Série " + numero + " adicionada"
        );

      }
    );

  }


  /* =========================================================
     INICIALIZAÇÃO
  ========================================================= */

  restaurarSeries();

});
