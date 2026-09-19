import { cloneForSimulation } from "../domain/process.js";
import { applyMetrics, averages, executionOrder, mergeGantt } from "../domain/metrics.js";

export function sjf(processes) {
  const simulated = cloneForSimulation(processes);
  const pending = new Set(simulated);
  const gantt = [];
  let time = 0;

  while (pending.size > 0) {
    const ready = [...pending].filter((process) => process.at <= time);

    if (ready.length === 0) {
      const nextArrival = [...pending].sort((a, b) => a.at - b.at || a.order - b.order)[0];
      gantt.push({ pid: null, start: time, end: nextArrival.at });
      time = nextArrival.at;
      continue;
    }

    ready.sort((a, b) => a.bt - b.bt || a.at - b.at || a.order - b.order);
    const selected = ready[0];
    selected.firstStart = time;
    gantt.push({ pid: selected.id, start: time, end: time + selected.bt });
    time += selected.bt;
    selected.ct = time;
    pending.delete(selected);
  }

  const results = applyMetrics(simulated);
  return {
    gantt: mergeGantt(gantt),
    results,
    order: executionOrder(gantt),
    averages: averages(results),
  };
}
