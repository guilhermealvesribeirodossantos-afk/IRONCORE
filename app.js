/* =========================================================
   IRONCORE
   APP.JS
   VERSÃO INICIAL FUNCIONAL
========================================================= */

"use strict";


/* =========================================================
   CONFIGURAÇÕES
========================================================= */

const STORAGE_KEYS = {
  workouts: "ironcore_workouts",
  history: "ironcore_history",
  profile: "ironcore_profile",
  currentWorkout: "ironcore_current_workout"
};

const DEFAULT_REST_TIME = 120;


/* =========================================================
   DADOS INICIAIS
   Depois vamos substituir pelos seus treinos reais A–E.
========================================================= */

const defaultWorkouts = [
  {
    id: "A",
    name: "PEITO + TRÍCEPS",
    exercises: [
      {
        id: crypto.randomUUID(),
        name: "Supino Reto",
        muscle: "Peito",
        sets: 4,
        reps: "6-8",
        rest: 120
      },
      {
        id: crypto.randomUUID(),
        name: "Supino Inclinado",
        muscle: "Peito",
        sets: 4,
        reps: "6-10",
        rest: 120
      },
      {
        id: crypto.randomUUID(),
        name: "Crucifixo Máquina",
        muscle: "Peito",
        sets: 3,
        reps: "8-12",
        rest: 90
      },
      {
        id: crypto.randomUUID(),
        name: "Tríceps Testa",
        muscle: "Tríceps",
        sets: 3,
        reps: "8-12",
        rest: 90
      },
      {
        id: crypto.randomUUID(),
        name: "Tríceps Corda",
        muscle: "Tríceps",
        sets: 3,
        reps: "10-15",
        rest: 75
      }
    ]
  },

  {
    id: "B",
    name: "COSTAS + BÍCEPS",
    exercises: [
      {
        id: crypto.randomUUID(),
        name: "Puxada Alta",
        muscle: "Costas",
        sets: 4,
        reps: "6-10",
        rest: 120
      },
      {
        id: crypto.randomUUID(),
        name: "Remada Baixa",
        muscle: "Costas",
        sets: 4,
        reps: "8-12",
        rest: 120
      },
      {
        id: crypto.randomUUID(),
        name: "Remada Unilateral",
        muscle: "Costas",
        sets: 3,
        reps: "8-12",
        rest: 90
      },
      {
        id: crypto.randomUUID(),
        name: "Rosca Direta",
        muscle: "Bíceps",
        sets: 3,
        reps: "6-10",
        rest: 90
      },
      {
        id: crypto.randomUUID(),
        name: "Rosca Martelo",
        muscle: "Bíceps",
        sets: 3,
        reps: "8-12",
        rest: 75
      }
    ]
  },

  {
    id: "C",
    name: "PERNAS",
    exercises: [
      {
        id: crypto.randomUUID(),
        name: "Agachamento",
        muscle: "Pernas",
        sets: 4,
        reps: "6-10",
        rest: 150
      },
      {
        id: crypto.randomUUID(),
        name: "Leg Press",
        muscle: "Pernas",
        sets: 4,
        reps: "8-12",
        rest: 120
      },
      {
        id: crypto.randomUUID(),
        name: "Cadeira Extensora",
        muscle: "Pernas",
        sets: 3,
        reps: "10-15",
        rest: 75
      },
      {
        id: crypto.randomUUID(),
        name: "Mesa Flexora",
        muscle: "Pernas",
        sets: 3,
        reps: "8-12",
        rest: 90
      },
      {
        id: crypto.randomUUID(),
        name: "Panturrilha",
        muscle: "Panturrilha",
        sets: 4,
        reps: "10-15",
        rest: 60
      }
    ]
  },

  {
    id: "D",
    name: "OMBROS + BRAÇOS",
    exercises: [
      {
        id: crypto.randomUUID(),
        name: "Desenvolvimento",
        muscle: "Ombros",
        sets: 4,
        reps: "6-10",
        rest: 120
      },
      {
        id: crypto.randomUUID(),
        name: "Elevação Lateral",
        muscle: "Ombros",
        sets: 4,
        reps: "10-15",
        rest: 75
      },
      {
        id: crypto.randomUUID(),
        name: "Rosca Direta",
        muscle: "Bíceps",
        sets: 3,
        reps: "8-12",
        rest: 90
      },
      {
        id: crypto.randomUUID(),
        name: "Tríceps Corda",
        muscle: "Tríceps",
        sets: 3,
        reps: "8-12",
        rest: 90
      }
    ]
  },

  {
    id: "E",
    name: "FULL BODY",
    exercises: [
      {
        id: crypto.randomUUID(),
        name: "Supino Reto",
        muscle: "Peito",
        sets: 3,
        reps: "6-10",
        rest: 120
      },
      {
        id: crypto.randomUUID(),
        name: "Puxada Alta",
        muscle: "Costas",
        sets: 3,
        reps: "6-10",
        rest: 120
      },
      {
        id: crypto.randomUUID(),
        name: "Leg Press",
        muscle: "Pernas",
        sets: 3,
        reps: "8-12",
        rest: 120
      },
      {
        id: crypto.randomUUID(),
        name: "Elevação Lateral",
        muscle: "Ombros",
        sets: 3,
        reps: "10-15",
        rest: 75
      },
      {
        id: crypto.randomUUID(),
        name: "Rosca Direta",
        muscle: "Bíceps",
        sets: 3,
        reps: "8-12",
        rest: 75
      },
      {
        id: crypto.randomUUID(),
        name: "Tríceps Corda",
        muscle: "Tríceps",
        sets: 3,
        reps: "8-12",
        rest: 75
      }
    ]
  }
];


/* =========================================================
   ESTADO
========================================================= */

let workouts = loadData(
  STORAGE_KEYS.workouts,
  defaultWorkouts
);

let history = loadData(
  STORAGE_KEYS.history,
  []
);

let currentWorkout = null;

let currentExerciseIndex = 0;

let workoutStartTime = null;

let sessionTimerInterval = null;

let restTimerInterval = null;

let restSeconds = DEFAULT_REST_TIME;

let toastTimeout = null;


/* =========================================================
   ELEMENTOS
========================================================= */

const screens =
  document.querySelectorAll(".screen");

const navItems =
  document.querySelectorAll(".nav-item");

const workoutSession =
  document.getElementById("workoutSession");

const startWorkoutButton =
  document.getElementById("startWorkoutButton");

const closeWorkoutSession =
  document.getElementById("closeWorkoutSession");

const finishWorkoutButton =
  document.getElementById("finishWorkoutButton");

const sessionWorkoutName =
  document.getElementById("sessionWorkoutName");

const sessionDuration =
  document.getElementById("sessionDuration");

const currentExerciseName =
  document.getElementById("currentExerciseName");

const exerciseLastPerformance =
  document.getElementById("exerciseLastPerformance");

const exerciseTarget =
  document.getElementById("exerciseTarget");

const setsContainer =
  document.getElementById("setsContainer");

const exerciseNotes =
  document.getElementById("exerciseNotes");

const previousExerciseButton =
  document.getElementById("previousExerciseButton");

const nextExerciseButton =
  document.getElementById("nextExerciseButton");

const addSetButton =
  document.getElementById("addSetButton");

const restTimer =
  document.getElementById("restTimer");

const restTimerDisplay =
  document.getElementById("restTimerDisplay");

const skipRestButton =
  document.getElementById("skipRestButton");

const toast =
  document.getElementById("toast");

const historyContent =
  document.getElementById("historyContent");


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  init
);

function init() {

  setupNavigation();

  setupWorkoutButtons();

  setupSessionControls();

  updateWorkoutCards();

  updateDashboard();

  renderHistory();

  updateProgress();

  updateGreeting();

  registerServiceWorker();

}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function loadData(key, fallback) {

  try {

    const saved =
      localStorage.getItem(key);

    if (!saved) {
      return structuredClone(fallback);
    }

    return JSON.parse(saved);

  } catch (error) {

    console.error(
      "Erro ao carregar:",
      key,
      error
    );

    return structuredClone(fallback);

  }

}


function saveData(key, data) {

  try {

    localStorage.setItem(
      key,
      JSON.stringify(data)
    );

  } catch (error) {

    console.error(
      "Erro ao salvar:",
      key,
      error
    );

  }

}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function setupNavigation() {

  navItems.forEach(item => {

    item.addEventListener(
      "click",
      () => {

        const target =
          item.dataset.target;

        openScreen(target);

      }
    );

  });

}


function openScreen(target) {

  screens.forEach(screen => {

    screen.classList.toggle(
      "active",
      screen.dataset.screen === target
    );

  });

  navItems.forEach(item => {

    item.classList.toggle(
      "active",
      item.dataset.target === target
    );

  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================================================
   SAUDAÇÃO
========================================================= */

function updateGreeting() {

  const greeting =
    document.querySelector(
      ".welcome-block .eyebrow"
    );

  if (!greeting) {
    return;
  }

  const hour =
    new Date().getHours();

  let text = "BOM DIA,";

  if (hour >= 12 && hour < 18) {
    text = "BOA TARDE,";
  }

  if (hour >= 18 || hour < 5) {
    text = "BOA NOITE,";
  }

  greeting.textContent = text;

}


/* =========================================================
   CARDS DE TREINO
========================================================= */

function updateWorkoutCards() {

  const workoutList =
    document.getElementById(
      "workoutList"
    );

  if (!workoutList) {
    return;
  }

  workoutList.innerHTML = "";

  workouts.forEach(workout => {

    const card =
      document.createElement("article");

    card.className =
      "workout-card";

    card.dataset.workout =
      workout.id;

    card.innerHTML = `
      <button
        class="workout-card-main"
        type="button"
        data-open-workout="${workout.id}"
      >

        <div class="workout-letter">
          ${workout.id}
        </div>

        <div class="workout-info">

          <strong>
            ${escapeHTML(workout.name)}
          </strong>

          <span>
            ${workout.exercises.length}
            exercícios
          </span>

        </div>

        <svg class="chevron">
          <use href="#icon-chevron-right"></use>
        </svg>

      </button>

      <button
        class="workout-edit"
        type="button"
        data-edit-workout="${workout.id}"
      >
        <svg>
          <use href="#icon-edit"></use>
        </svg>
      </button>
    `;

    workoutList.appendChild(card);

  });

  setupWorkoutButtons();

}


/* =========================================================
   BOTÕES DOS TREINOS
========================================================= */

function setupWorkoutButtons() {

  document
    .querySelectorAll(
      "[data-open-workout]"
    )
    .forEach(button => {

      button.onclick = () => {

        const id =
          button.dataset.openWorkout;

        startWorkout(id);

      };

    });


  document
    .querySelectorAll(
      "[data-edit-workout]"
    )
    .forEach(button => {

      button.onclick = () => {

        showToast(
          "Edição completa dos treinos será adicionada na próxima etapa."
        );

      };

    });


  if (startWorkoutButton) {

    startWorkoutButton.onclick =
      () => startWorkout("A");

  }

}


/* =========================================================
   INICIAR TREINO
========================================================= */

function startWorkout(workoutId) {

  const workout =
    workouts.find(
      item => item.id === workoutId
    );

  if (!workout) {
    return;
  }

  currentWorkout =
    structuredClone(workout);

  currentExerciseIndex = 0;

  workoutStartTime =
    Date.now();

  currentWorkout.startedAt =
    new Date().toISOString();

  currentWorkout.exercises =
    currentWorkout.exercises.map(
      exercise => ({
        ...exercise,

        completedSets: [],

        notes: ""
      })
    );

  saveCurrentWorkout();

  workoutSession.classList.remove(
    "hidden"
  );

  document.body.style.overflow =
    "hidden";

  sessionWorkoutName.textContent =
    currentWorkout.name;

  startSessionTimer();

  renderCurrentExercise();

}


/* =========================================================
   EXERCÍCIO ATUAL
========================================================= */

function renderCurrentExercise() {

  if (!currentWorkout) {
    return;
  }

  const exercise =
    currentWorkout.exercises[
      currentExerciseIndex
    ];

  if (!exercise) {
    return;
  }

  const indexLabel =
    document.querySelector(
      ".exercise-index"
    );

  if (indexLabel) {

    indexLabel.textContent =
      `EXERCÍCIO ${
        currentExerciseIndex + 1
      } DE ${
        currentWorkout.exercises.length
      }`;

  }

  currentExerciseName.textContent =
    exercise.name;

  exerciseTarget.textContent =
    `${exercise.reps} reps`;

  exerciseLastPerformance.textContent =
    getLastExercisePerformance(
      exercise.name
    );

  exerciseNotes.value =
    exercise.notes || "";

  renderSets(exercise);

  stopRestTimer();

  previousExerciseButton.disabled =
    currentExerciseIndex === 0;

  nextExerciseButton.textContent =
    currentExerciseIndex ===
    currentWorkout.exercises.length - 1
      ? "ÚLTIMO EXERCÍCIO"
      : "PRÓXIMO";

}


/* =========================================================
   SÉRIES
========================================================= */

function renderSets(exercise) {

  setsContainer.innerHTML = "";

  const setCount =
    Math.max(
      exercise.sets,
      exercise.completedSets.length
    );

  for (
    let index = 0;
    index < setCount;
    index++
  ) {

    const saved =
      exercise.completedSets[index];

    const row =
      document.createElement("div");

    row.className =
      "set-row";

    if (saved?.completed) {

      row.classList.add(
        "completed"
      );

    }

    row.innerHTML = `
      <strong>
        ${index + 1}
      </strong>

      <input
        type="number"
        inputmode="decimal"
        min="0"
        step="0.5"
        placeholder="0"
        value="${
          saved?.weight ?? ""
        }"
        data-weight-input="${index}"
      >

      <input
        type="number"
        inputmode="numeric"
        min="0"
        placeholder="0"
        value="${
          saved?.reps ?? ""
        }"
        data-reps-input="${index}"
      >

      <button
        class="complete-set-button ${
          saved?.completed
            ? "completed"
            : ""
        }"
        type="button"
        data-complete-set="${index}"
      >
        <svg>
          <use href="#icon-check"></use>
        </svg>
      </button>
    `;

    setsContainer.appendChild(row);

  }

  setupSetButtons();

}


/* =========================================================
   COMPLETAR SÉRIE
========================================================= */

function setupSetButtons() {

  document
    .querySelectorAll(
      "[data-complete-set]"
    )
    .forEach(button => {

      button.onclick = () => {

        completeSet(
          Number(
            button.dataset.completeSet
          )
        );

      };

    });

}


function completeSet(index) {

  const exercise =
    currentWorkout.exercises[
      currentExerciseIndex
    ];

  const weightInput =
    document.querySelector(
      `[data-weight-input="${index}"]`
    );

  const repsInput =
    document.querySelector(
      `[data-reps-input="${index}"]`
    );

  const weight =
    Number(weightInput.value);

  const reps =
    Number(repsInput.value);

  if (
    !weight ||
    weight <= 0 ||
    !reps ||
    reps <= 0
  ) {

    showToast(
      "Informe a carga e as repetições antes de concluir a série."
    );

    return;

  }

  const wasCompleted =
    exercise.completedSets[index]
      ?.completed;

  exercise.completedSets[index] = {
    weight,
    reps,
    completed: !wasCompleted,
    completedAt:
      new Date().toISOString()
  };

  renderSets(exercise);

  saveCurrentWorkout();

  if (!wasCompleted) {

    startRestTimer(
      exercise.rest ||
      DEFAULT_REST_TIME
    );

    showToast(
      `Série ${index + 1} concluída.`
    );

  }

}


/* =========================================================
   ADICIONAR SÉRIE
========================================================= */

function addSet() {

  const exercise =
    currentWorkout.exercises[
      currentExerciseIndex
    ];

  exercise.sets += 1;

  renderSets(exercise);

  saveCurrentWorkout();

}


/* =========================================================
   NAVEGAÇÃO ENTRE EXERCÍCIOS
========================================================= */

function nextExercise() {

  saveExerciseNotes();

  if (
    currentExerciseIndex <
    currentWorkout.exercises.length - 1
  ) {

    currentExerciseIndex++;

    renderCurrentExercise();

    window.scrollTo({
      top: 0
    });

    return;

  }

  showToast(
    "Você chegou ao último exercício."
  );

}


function previousExercise() {

  saveExerciseNotes();

  if (currentExerciseIndex > 0) {

    currentExerciseIndex--;

    renderCurrentExercise();

    window.scrollTo({
      top: 0
    });

  }

}


function saveExerciseNotes() {

  if (!currentWorkout) {
    return;
  }

  currentWorkout.exercises[
    currentExerciseIndex
  ].notes =
    exerciseNotes.value.trim();

  saveCurrentWorkout();

}


/* =========================================================
   CRONÔMETRO DA SESSÃO
========================================================= */

function startSessionTimer() {

  stopSessionTimer();

  updateSessionDuration();

  sessionTimerInterval =
    setInterval(
      updateSessionDuration,
      1000
    );

}


function updateSessionDuration() {

  if (!workoutStartTime) {
    return;
  }

  const elapsed =
    Math.floor(
      (
        Date.now() -
        workoutStartTime
      ) / 1000
    );

  sessionDuration.textContent =
    formatTime(elapsed);

}


function stopSessionTimer() {

  if (sessionTimerInterval) {

    clearInterval(
      sessionTimerInterval
    );

    sessionTimerInterval = null;

  }

}


/* =========================================================
   DESCANSO
========================================================= */

function startRestTimer(seconds) {

  stopRestTimer();

  restSeconds = seconds;

  restTimer.classList.remove(
    "hidden"
  );

  updateRestTimerDisplay();

  restTimerInterval =
    setInterval(() => {

      restSeconds--;

      updateRestTimerDisplay();

      if (restSeconds <= 0) {

        stopRestTimer();

        showToast(
          "Descanso finalizado. Próxima série!"
        );

        vibrate();

      }

    }, 1000);

}


function stopRestTimer() {

  if (restTimerInterval) {

    clearInterval(
      restTimerInterval
    );

    restTimerInterval = null;

  }

  if (restTimer) {

    restTimer.classList.add(
      "hidden"
    );

  }

}


function updateRestTimerDisplay() {

  restTimerDisplay.textContent =
    formatTime(
      Math.max(
        restSeconds,
        0
      )
    );

}


function adjustRestTimer(amount) {

  restSeconds =
    Math.max(
      0,
      restSeconds + amount
    );

  updateRestTimerDisplay();

}


/* =========================================================
   FINALIZAR TREINO
========================================================= */

function finishWorkout() {

  if (!currentWorkout) {
    return;
  }

  saveExerciseNotes();

  const completedSets =
    currentWorkout.exercises
      .flatMap(
        exercise =>
          exercise.completedSets
      )
      .filter(
        set => set.completed
      );

  if (completedSets.length === 0) {

    const confirmFinish =
      confirm(
        "Nenhuma série foi registrada. Deseja finalizar mesmo assim?"
      );

    if (!confirmFinish) {
      return;
    }

  }

  const endedAt =
    new Date();

  const duration =
    Math.floor(
      (
        Date.now() -
        workoutStartTime
      ) / 1000
    );

  const volume =
    calculateWorkoutVolume(
      currentWorkout
    );

  const record = {
    id: crypto.randomUUID(),

    workoutId:
      currentWorkout.id,

    workoutName:
      currentWorkout.name,

    startedAt:
      currentWorkout.startedAt,

    endedAt:
      endedAt.toISOString(),

    duration,

    volume,

    exercises:
      structuredClone(
        currentWorkout.exercises
      )
  };

  history.unshift(record);

  saveData(
    STORAGE_KEYS.history,
    history
  );

  localStorage.removeItem(
    STORAGE_KEYS.currentWorkout
  );

  stopSessionTimer();

  stopRestTimer();

  workoutSession.classList.add(
    "hidden"
  );

  document.body.style.overflow =
    "";

  currentWorkout = null;

  workoutStartTime = null;

  renderHistory();

  updateDashboard();

  updateProgress();

  showToast(
    `Treino concluído • ${formatNumber(volume)} kg de volume`
  );

}


/* =========================================================
   FECHAR TREINO
========================================================= */

function closeSession() {

  if (!currentWorkout) {

    workoutSession.classList.add(
      "hidden"
    );

    return;

  }

  const confirmClose =
    confirm(
      "Deseja sair do treino? O treino em andamento continuará salvo."
    );

  if (!confirmClose) {
    return;
  }

  saveExerciseNotes();

  saveCurrentWorkout();

  stopSessionTimer();

  stopRestTimer();

  workoutSession.classList.add(
    "hidden"
  );

  document.body.style.overflow =
    "";

}


/* =========================================================
   VOLUME
========================================================= */

function calculateWorkoutVolume(
  workout
) {

  let total = 0;

  workout.exercises.forEach(
    exercise => {

      exercise.completedSets
        .filter(
          set => set.completed
        )
        .forEach(set => {

          total +=
            Number(set.weight || 0) *
            Number(set.reps || 0);

        });

    }
  );

  return Math.round(total);

}


/* =========================================================
   ÚLTIMA PERFORMANCE DO EXERCÍCIO
========================================================= */

function getLastExercisePerformance(
  exerciseName
) {

  for (
    const workout of history
  ) {

    const exercise =
      workout.exercises.find(
        item =>
          item.name === exerciseName
      );

    if (!exercise) {
      continue;
    }

    const completed =
      exercise.completedSets
        .filter(
          set => set.completed
        );

    if (!completed.length) {
      continue;
    }

    const best =
      completed.reduce(
        (max, set) =>
          set.weight > max.weight
            ? set
            : max
      );

    return `${best.weight} kg × ${best.reps}`;

  }

  return "--";

}


/* =========================================================
   DASHBOARD
========================================================= */

function updateDashboard() {

  const totalWorkouts =
    history.length;

  const totalVolume =
    history.reduce(
      (sum, workout) =>
        sum + workout.volume,
      0
    );

  const last =
    history[0];

  setText(
    "totalWorkoutsHighlight",
    totalWorkouts
  );

  setText(
    "totalWorkoutsProgress",
    totalWorkouts
  );

  setText(
    "profileWorkoutCount",
    totalWorkouts
  );

  if (last) {

    setText(
      "lastWorkoutDate",
      formatDate(
        last.endedAt
      )
    );

    setText(
      "lastWorkoutVolume",
      `${formatNumber(
        last.volume
      )} kg`
    );

  } else {

    setText(
      "lastWorkoutDate",
      "--"
    );

    setText(
      "lastWorkoutVolume",
      "0 kg"
    );

  }

  const best =
    findBestSet();

  setText(
    "bestLoadHighlight",
    best
      ? `${best.weight} kg × ${best.reps}`
      : "--"
  );

  setText(
    "totalVolumeProgress",
    `${formatNumber(
      totalVolume
    )} kg`
  );

  updateTodayWorkout();

}


/* =========================================================
   TREINO DO DIA
========================================================= */

function updateTodayWorkout() {

  if (!workouts.length) {
    return;
  }

  const dayIndex =
    new Date().getDay();

  const workoutIndex =
    dayIndex %
    workouts.length;

  const workout =
    workouts[workoutIndex];

  const nextWorkout =
    workouts[
      (workoutIndex + 1) %
      workouts.length
    ];

  const totalSets =
    workout.exercises.reduce(
      (sum, exercise) =>
        sum + exercise.sets,
      0
    );

  setText(
    "todayWorkoutName",
    workout.name
  );

  setText(
    "todayWorkoutDetails",
    `${workout.exercises.length} exercícios • ${totalSets} séries`
  );

  const badge =
    document.querySelector(
      ".workout-badge"
    );

  if (badge) {

    badge.textContent =
      workout.id;

  }

  setText(
    "nextWorkoutName",
    nextWorkout.name
  );

  setText(
    "nextWorkoutInfo",
    `Treino ${nextWorkout.id}`
  );

  if (startWorkoutButton) {

    startWorkoutButton.onclick =
      () =>
        startWorkout(
          workout.id
        );

  }

}


/* =========================================================
   MELHOR SÉRIE
========================================================= */

function findBestSet() {

  let best = null;

  history.forEach(workout => {

    workout.exercises.forEach(
      exercise => {

        exercise.completedSets
          .filter(
            set => set.completed
          )
          .forEach(set => {

            if (
              !best ||
              set.weight >
              best.weight
            ) {

              best = {
                weight:
                  set.weight,

                reps:
                  set.reps,

                exercise:
                  exercise.name
              };

            }

          });

      }
    );

  });

  return best;

}


/* =========================================================
   HISTÓRICO
========================================================= */

function renderHistory() {

  if (!historyContent) {
    return;
  }

  if (!history.length) {

    historyContent.innerHTML = `
      <div class="empty-state">

        <div class="empty-state-icon">
          <svg>
            <use href="#icon-history"></use>
          </svg>
        </div>

        <h3>
          Nenhum treino registrado
        </h3>

        <p>
          Seus treinos concluídos aparecerão aqui.
        </p>

      </div>
    `;

    return;

  }

  historyContent.innerHTML =
    history
      .map(workout => `

        <article
          class="workout-card"
          style="margin-bottom:10px"
        >

          <div
            class="workout-card-main"
          >

            <div
              class="workout-letter"
            >
              ${escapeHTML(
                workout.workoutId
              )}
            </div>

            <div
              class="workout-info"
            >

              <strong>
                ${escapeHTML(
                  workout.workoutName
                )}
              </strong>

              <span>
                ${formatDate(
                  workout.endedAt
                )}
                •
                ${formatTime(
                  workout.duration
                )}
                •
                ${formatNumber(
                  workout.volume
                )}
                kg
              </span>

            </div>

          </div>

        </article>

      `)
      .join("");

}


/* =========================================================
   PROGRESSO
========================================================= */

function updateProgress() {

  const totalVolume =
    history.reduce(
      (sum, workout) =>
        sum + workout.volume,
      0
    );

  setText(
    "totalVolumeProgress",
    `${formatNumber(
      totalVolume
    )} kg`
  );

  setText(
    "totalWorkoutsProgress",
    history.length
  );

  setText(
    "profileWorkoutCount",
    history.length
  );

}


/* =========================================================
   SALVAR TREINO ATUAL
========================================================= */

function saveCurrentWorkout() {

  if (!currentWorkout) {
    return;
  }

  saveData(
    STORAGE_KEYS.currentWorkout,
    {
      workout:
        currentWorkout,

      exerciseIndex:
        currentExerciseIndex,

      startTime:
        workoutStartTime
    }
  );

}


/* =========================================================
   CONTROLES DO MODO TREINO
========================================================= */

function setupSessionControls() {

  if (closeWorkoutSession) {

    closeWorkoutSession.onclick =
      closeSession;

  }

  if (finishWorkoutButton) {

    finishWorkoutButton.onclick =
      finishWorkout;

  }

  if (nextExerciseButton) {

    nextExerciseButton.onclick =
      nextExercise;

  }

  if (previousExerciseButton) {

    previousExerciseButton.onclick =
      previousExercise;

  }

  if (addSetButton) {

    addSetButton.onclick =
      addSet;

  }

  if (skipRestButton) {

    skipRestButton.onclick =
      stopRestTimer;

  }

  document
    .querySelectorAll(
      "[data-rest-adjust]"
    )
    .forEach(button => {

      button.onclick = () => {

        adjustRestTimer(
          Number(
            button.dataset.restAdjust
          )
        );

      };

    });

}


/* =========================================================
   TABS DO HISTÓRICO
========================================================= */

document
  .querySelectorAll(
    "[data-history-tab]"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            "[data-history-tab]"
          )
          .forEach(item =>
            item.classList.remove(
              "active"
            )
          );

        button.classList.add(
          "active"
        );

        if (
          button.dataset.historyTab ===
          "workouts"
        ) {

          renderHistory();

        } else {

          historyContent.innerHTML = `
            <div class="empty-state">

              <div class="empty-state-icon">
                <svg>
                  <use href="#icon-dumbbell"></use>
                </svg>
              </div>

              <h3>
                Histórico por exercício
              </h3>

              <p>
                Essa análise será liberada na etapa de progressão de carga.
              </p>

            </div>
          `;

        }

      }
    );

  });


/* =========================================================
   BOTÕES AINDA EM DESENVOLVIMENTO
========================================================= */

[
  "addWorkoutButton",
  "bodyDataButton",
  "photosButton",
  "calendarButton",
  "backupButton",
  "settingsButton",
  "menuButton"
].forEach(id => {

  const element =
    document.getElementById(id);

  if (!element) {
    return;
  }

  element.addEventListener(
    "click",
    () => {

      showToast(
        "Essa função será adicionada nas próximas etapas."
      );

    }
  );

});


/* =========================================================
   PRÓXIMO TREINO
========================================================= */

const nextWorkoutCard =
  document.getElementById(
    "nextWorkoutCard"
  );

if (nextWorkoutCard) {

  nextWorkoutCard.addEventListener(
    "click",
    () => openScreen("workouts")
  );

}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

  if (!toast) {
    return;
  }

  clearTimeout(
    toastTimeout
  );

  toast.textContent =
    message;

  toast.classList.remove(
    "hidden"
  );

  toastTimeout =
    setTimeout(() => {

      toast.classList.add(
        "hidden"
      );

    }, 2500);

}


/* =========================================================
   UTILITÁRIOS
========================================================= */

function formatTime(seconds) {

  seconds =
    Math.max(
      0,
      Number(seconds) || 0
    );

  const hours =
    Math.floor(
      seconds / 3600
    );

  const minutes =
    Math.floor(
      (
        seconds % 3600
      ) / 60
    );

  const secs =
    seconds % 60;

  if (hours > 0) {

    return [
      hours,
      minutes,
      secs
    ]
      .map(value =>
        String(value)
          .padStart(2, "0")
      )
      .join(":");

  }

  return [
    minutes,
    secs
  ]
    .map(value =>
      String(value)
        .padStart(2, "0")
    )
    .join(":");

}


function formatDate(date) {

  try {

    return new Intl.DateTimeFormat(
      "pt-BR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }
    ).format(
      new Date(date)
    );

  } catch {

    return "--";

  }

}


function formatNumber(number) {

  return new Intl.NumberFormat(
    "pt-BR",
    {
      maximumFractionDigits: 0
    }
  ).format(
    Number(number) || 0
  );

}


function setText(id, value) {

  const element =
    document.getElementById(id);

  if (element) {

    element.textContent =
      value;

  }

}


function vibrate() {

  if (
    "vibrate" in navigator
  ) {

    navigator.vibrate(150);

  }

}


function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* =========================================================
   SERVICE WORKER
========================================================= */

function registerServiceWorker() {

  if (
    "serviceWorker" in navigator
  ) {

    window.addEventListener(
      "load",
      () => {

        navigator
          .serviceWorker
          .register("./sw.js")
          .catch(error => {

            console.log(
              "Service Worker ainda não configurado:",
              error
            );

          });

      }
    );

  }

}


/* =========================================================
   IRONCORE
========================================================= */

console.log(
  "%c IRONCORE ",
  "background:#ef1b1b;color:white;font-weight:bold;padding:6px 10px;border-radius:4px;"
);

console.log(
  "Sistema iniciado."
);
