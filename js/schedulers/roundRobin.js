import { cloneForSimulation } from "../domain/process.js";
import { applyMetrics, averages, executionOrder, mergeGantt } from "../domain/metrics.js";

export function roundRobin(processes, { quantum } = {}) {
  const slice = Number(quantum);
  if (!Number.isFinite(slice) || slice <= 0) {
    throw new Error("El quantum debe ser un número mayor que 0.");
  }

  const simulated = cloneForSimulation(processes);
  const gantt = [];
  const queue = [];
  let time = 0;

  const enqueueArrivals = (limit, running = null) => {
    simulated
      .filter((process) => (
        process.at <= limit
        && process.remaining > 0
        && process !== running
        && !queue.includes(process)
      ))
      .sort((a, b) => a.at - b.at || a.order - b.order)
      .forEach((process) => queue.push(process));
  };

  if (simulated.length === 0) {
    return { gantt: [], results: [], order: [], averages: averages([]) };
  }

  const firstArrival = Math.min(...simulated.map((process) => process.at));
  if (firstArrival > 0) {
    gantt.push({ pid: null, start: 0, end: firstArrival });
  }
  time = firstArrival;
  enqueueArrivals(time);

  while (simulated.some((process) => process.remaining > 0)) {
    if (queue.length === 0) {
      const nextArrival = Math.min(
        ...simulated.filter((process) => process.remaining > 0).map((process) => process.at)
      );
      if (time < nextArrival) {
        gantt.push({ pid: null, start: time, end: nextArrival });
      }
      time = nextArrival;
      enqueueArrivals(time);
      continue;
    }

    const current = queue.shift();
    const runFor = Math.min(slice, current.remaining);
    const start = time;

    if (current.firstStart === null) {
      current.firstStart = start;
    }

    time += runFor;
    current.remaining -= runFor;
    enqueueArrivals(time, current);

    if (current.remaining > 0) {
      queue.push(current);
    } else {
      current.ct = time;
    }

    gantt.push({ pid: current.id, start, end: time });
  }

  const results = applyMetrics(simulated);
  return {
    gantt: mergeGantt(gantt),
    results,
    order: executionOrder(gantt),
    averages: averages(results),
  };
}
