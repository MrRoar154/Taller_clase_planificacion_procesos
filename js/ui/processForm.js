import { createProcess, nextProcessId } from "../domain/process.js";

export function bindProcessForm({
  form,
  idInput,
  atInput,
  btInput,
  list,
  onChange,
}) {
  const suggestId = (processes) => {
    idInput.value = nextProcessId(processes);
  };

  const renderList = (processes) => {
    if (processes.length === 0) {
      list.innerHTML = '<p class="empty-hint">No hay procesos. Agrega uno o carga un ejemplo.</p>';
      return;
    }

    list.innerHTML = processes.map((process) => `
      <article class="process-chip" data-id="${process.id}">
        <strong>${process.id}</strong>
        <span>AT ${process.at}</span>
        <span>BT ${process.bt}</span>
        <button type="button" class="ghost-btn" data-remove="${process.id}">Quitar</button>
      </article>
    `).join("");
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const processes = onChange.get();
    const id = idInput.value.trim() || nextProcessId(processes);
    const at = Number(atInput.value);
    const bt = Number(btInput.value);

    if (!id || Number.isNaN(at) || at < 0 || Number.isNaN(bt) || bt <= 0) {
      return;
    }

    if (processes.some((process) => process.id.toLowerCase() === id.toLowerCase())) {
      idInput.focus();
      return;
    }

    const next = [
      ...processes,
      createProcess({ id, at, bt, order: processes.length }),
    ];
    onChange.set(next);
    atInput.value = "0";
    btInput.value = "1";
    suggestId(next);
    atInput.focus();
  });

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove]");
    if (!button) {
      return;
    }

    const next = onChange
      .get()
      .filter((process) => process.id !== button.dataset.remove)
      .map((process, order) => ({ ...process, order }));
    onChange.set(next);
    suggestId(next);
  });

  return { renderList, suggestId };
}
