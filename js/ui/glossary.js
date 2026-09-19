const TERMS = [
  { key: "P", name: "Proceso", text: "Identificador de la tarea que solicita la CPU (P1, P2, P3…)." },
  { key: "AT", name: "Arrival Time", text: "Instante en que el proceso llega a la cola de listos." },
  { key: "BT", name: "Burst Time", text: "Tiempo de CPU que el proceso necesita para terminar." },
  { key: "CT", name: "Completion Time", text: "Instante en que el proceso termina su ejecución." },
  { key: "TAT", name: "Turnaround Time", text: "Tiempo de vida total. Fórmula: TAT = CT − AT." },
  { key: "WT", name: "Waiting Time", text: "Tiempo en cola, sumando pausas. Fórmula: WT = TAT − BT." },
  { key: "RT", name: "Response Time", text: "Espera hasta el primer uso de CPU. Fórmula: RT = primer inicio − AT." },
];

export function renderGlossary(container) {
  container.innerHTML = TERMS.map((term) => `
    <article class="glossary-item">
      <p class="glossary-key">${term.key}</p>
      <p class="glossary-name">${term.name}</p>
      <p class="glossary-text">${term.text}</p>
    </article>
  `).join("");
}
