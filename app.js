"use strict";

document.addEventListener("DOMContentLoaded", function () {

  console.log("IRONCORE carregado");

  /* =========================================================
     NAVEGAÇÃO
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

    window.scrollTo(0, 0);
  }

  navItems.forEach(function (item) {

    item.addEventListener(
      "click",
      function () {

        abrirTela(
          item.dataset.target
        );

      }
    );

  });


  /* =========================================================
     ABRIR / FECHAR TREINO
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

  if (iniciarTreino && telaTreino) {

    iniciarTreino.addEventListener(
      "click",
      function () {

        telaTreino.classList.remove(
          "hidden"
        );

        document.body.style.overflow =
          "hidden";

      }
    );

  }

  if (fecharTreino && telaTreino) {

    fecharTreino.addEventListener(
      "click",
      function () {

        telaTreino.classList.add(
          "hidden"
        );

        document.body.style.overflow =
          "";

      }
    );

  }


  /* =========================================================
     SÉRIES
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
    "ironcore_series_teste";


  function carregarSeries() {

    try {

      const salvo =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!salvo) {
        return [];
      }

      return JSON.parse(salvo);

    } catch (erro) {

      console.error(
        "Erro ao carregar séries:",
        erro
      );

      return [];

    }

  }


  function salvarSeries(series) {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(series)
    );

  }


  let seriesSalvas =
    carregarSeries();


  function configurarLinhas() {

    if (!setsContainer) {
      return;
    }

    const linhas =
      setsContainer.querySelectorAll(
        ".set-row"
      );

    linhas.forEach(function (
      linha,
      indice
    ) {

      const inputs =
        linha.querySelectorAll(
          "input"
        );

      const botao =
        linha.querySelector(
          ".complete-set-button"
        );

      if (
        inputs.length < 2 ||
        !botao
      ) {
        return;
      }

      const inputKg =
        inputs[0];

      const inputReps =
        inputs[1];

      const salvo =
        seriesSalvas[indice];

      if (salvo) {

        inputKg.value =
          salvo.kg ?? "";

        inputReps.value =
          salvo.reps ?? "";

        if (salvo.concluida) {

          linha.classList.add(
            "completed"
          );

          botao.classList.add(
            "completed"
          );

        }

      }


      inputKg.addEventListener(
        "input",
        function () {

          salvarLinha(
            indice,
            linha
          );

        }
      );


      inputReps.addEventListener(
        "input",
        function () {

          salvarLinha(
            indice,
            linha
          );

        }
      );


      botao.addEventListener(
        "click",
        function () {

          const kg =
            Number(
              inputKg.value
            );

          const reps =
            Number(
              inputReps.value
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

          salvarLinha(
            indice,
            linha
          );

        }
      );

    });

  }


  function salvarLinha(
    indice,
    linha
  ) {

    const inputs =
      linha.querySelectorAll(
        "input"
      );

    if (inputs.length < 2) {
      return;
    }

    seriesSalvas[indice] = {

      kg:
        inputs[0].value,

      reps:
        inputs[1].value,

      concluida:
        linha.classList.contains(
          "completed"
        )

    };

    salvarSeries(
      seriesSalvas
    );

  }


  /* =========================================================
     ADICIONAR SÉRIE
  ========================================================= */

  if (
    addSetButton &&
    setsContainer
  ) {

    addSetButton.addEventListener(
      "click",
      function () {

        const numero =
          setsContainer.querySelectorAll(
            ".set-row"
          ).length + 1;

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

        setsContainer.appendChild(
          linha
        );

        configurarLinhas();

      }
    );

  }


  /* =========================================================
     INICIAR SISTEMA DE SÉRIES
  ========================================================= */

  configurarLinhas();

});
