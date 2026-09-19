import { cloneForSimulation } from "../domain/process.js";
import { applyMetrics, averages, executionOrder, mergeGantt } from "../domain/metrics.js";

export function fcfs(processes) {
  const simulated = cloneForSimulation(processes);
  const readyOrder = simulated.slice().sort((a, b) => a.at - b.at || a.order - b.order);
  const gantt = [];
  let time = 0;

  readyOrder.forEach((process) => {
    if (time < process.at) {
      gantt.push({ pid: null, start: time, end: process.at });
      time = process.at;
    }

    process.firstStart = time;
    gantt.push({ pid: process.id, start: time, end: time + process.bt });
    time += process.bt;
    process.ct = time;
  });

  const results = applyMetrics(simulated);
  return {
    gantt: mergeGantt(gantt),
    results,
    order: executionOrder(gantt),
    averages: averages(results),
  };
}
