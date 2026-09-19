const COLORS = ["#2563eb", "#dc2626", "#d97706", "#059669", "#7c3aed", "#0891b2", "#be185d", "#4f46e5"];

export function colorForProcess(processId, processes) {
  const index = processes.findIndex((process) => process.id === processId);
  return COLORS[(index >= 0 ? index : 0) % COLORS.length];
}

export function renderGantt(container, { gantt, processes }) {
  if (!gantt.length) {
    container.innerHTML = '<p class="empty-hint">Agrega procesos para ver el orden de ejecución.</p>';
    return;
  }

  const total = gantt[gantt.length - 1].end;
  const marks = [];
  for (let tick = 0; tick <= total; tick += 1) {
    marks.push(tick);
  }

  const bars = gantt.map((segment) => {
    const width = ((segment.end - segment.start) / total) * 100;
    if (!segment.pid) {
      return `
        <div class="gantt-block idle" style="width:${width}%" title="CPU inactiva ${segment.start}–${segment.end}">
          <span>Idle</span>
        </div>
      `;
    }

    const color = colorForProcess(segment.pid, processes);
    return `
      <div class="gantt-block" style="width:${width}%; background:${color}" title="${segment.pid} ${segment.start}–${segment.end}">
        <span>${segment.pid}</span>
      </div>
    `;
  }).join("");

  container.innerHTML = `
    <div class="gantt-track">${bars}</div>
    <div class="gantt-scale">
      ${marks.map((tick) => `<span>${tick}</span>`).join("")}
    </div>
  `;
}
