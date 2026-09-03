"use strict";

document.addEventListener("DOMContentLoaded", function () {

  console.log("IRONCORE carregado");

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

      const tela = item.dataset.target;

      abrirTela(tela);

    });

  });

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

});
