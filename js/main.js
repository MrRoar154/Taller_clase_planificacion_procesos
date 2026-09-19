import { createProcess } from "./domain/process.js";
import { policies, runPolicy } from "./schedulers/registry.js";
import { renderGlossary } from "./ui/glossary.js";
import { bindProcessForm } from "./ui/processForm.js";
import { renderGantt } from "./ui/gantt.js";
import { renderResults } from "./ui/results.js";

const CLASS_EXAMPLE = [
  { id: "P1", at: 0, bt: 5 },
  { id: "P2", at: 1, bt: 3 },
  { id: "P3", at: 2, bt: 4 },
  { id: "P4", at: 4, bt: 2 },
];

const LEVEL2_EXAMPLE = [
  { id: "P1", at: 0, bt: 8 },
  { id: "P2", at: 1, bt: 2 },
  { id: "P3", at: 2, bt: 1 },
  { id: "P4", at: 3, bt: 3 },
];

const state = {
  processes: CLASS_EXAMPLE.map((process, order) => createProcess({ ...process, order })),
  policyId: "fcfs",
  quantum: 3,
};

const glossary = document.querySelector("#glossary");
const policyButtons = document.querySelector("#policy-buttons");
const policyHint = document.querySelector("#policy-hint");
const quantumWrap = document.querySelector("#quantum-wrap");
const quantumInput = document.querySelector("#quantum");
const form = document.querySelector("#process-form");
const idInput = document.querySelector("#process-id");
const atInput = document.querySelector("#process-at");
const btInput = document.querySelector("#process-bt");
const list = document.querySelector("#process-list");
const gantt = document.querySelector("#gantt");
const results = document.querySelector("#results");
const errorBox = document.querySelector("#error-box");

renderGlossary(glossary);

policyButtons.innerHTML = Object.values(policies).map((policy) => `
  <button type="button" class="policy-btn" data-policy="${policy.id}">${policy.name}</button>
`).join("");

const formApi = bindProcessForm({
  form,
  idInput,
  atInput,
  btInput,
  list,
  onChange: {
    get: () => state.processes,
    set: (processes) => {
      state.processes = processes;
      refresh();
    },
  },
});

function setExample(rows) {
  state.processes = rows.map((process, order) => createProcess({ ...process, order }));
  refresh();
}

function refresh() {
  const policy = policies[state.policyId];
  document.querySelectorAll(".policy-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.policy === state.policyId);
  });
  policyHint.textContent = policy.description;
  quantumWrap.hidden = !policy.needsQuantum;
  formApi.renderList(state.processes);
  formApi.suggestId(state.processes);

  try {
    const simulation = runPolicy(state.policyId, state.processes, { quantum: state.quantum });
    errorBox.hidden = true;
    renderGantt(gantt, { gantt: simulation.gantt, processes: state.processes });
    renderResults(results, {
      policyName: policy.name,
      order: simulation.order,
      results: simulation.results,
      averages: simulation.averages,
      processes: state.processes,
    });
  } catch (error) {
    errorBox.hidden = false;
    errorBox.textContent = error.message;
    gantt.innerHTML = "";
    results.innerHTML = "";
  }
}

policyButtons.addEventListener("click", (event) => {
  const button = event.target.closest("[data-policy]");
  if (!button) {
    return;
  }
  state.policyId = button.dataset.policy;
  refresh();
});

quantumInput.addEventListener("input", () => {
  state.quantum = Number(quantumInput.value);
  refresh();
});

document.querySelector("#example-class").addEventListener("click", () => {
  state.quantum = 2;
  quantumInput.value = "2";
  setExample(CLASS_EXAMPLE);
});

document.querySelector("#example-level2").addEventListener("click", () => {
  state.quantum = 2;
  quantumInput.value = "2";
  setExample(LEVEL2_EXAMPLE);
});

document.querySelector("#clear-processes").addEventListener("click", () => {
  state.processes = [];
  refresh();
});

quantumInput.value = String(state.quantum);
refresh();
