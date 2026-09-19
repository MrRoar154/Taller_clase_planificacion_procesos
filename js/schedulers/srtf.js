import { cloneForSimulation } from "../domain/process.js";
import { applyMetrics, averages, executionOrder, mergeGantt } from "../domain/metrics.js";

export function srtf(processes) {
  const simulated = cloneForSimulation(processes);
  const gantt = [];
  let time = 0;
  let current = null;
  let segmentStart = 0;

  const closeSegment = (end) => {
    if (current && end > segmentStart) {
      gantt.push({ pid: current.id, start: segmentStart, end });
    }
  };

  while (simulated.some((process) => process.remaining > 0)) {
    const ready = simulated.filter((process) => process.at <= time && process.remaining > 0);

    if (ready.length === 0) {
      closeSegment(time);
      current = null;
      const nextArrival = Math.min(
        ...simulated.filter((process) => process.remaining > 0).map((process) => process.at)
      );
      if (time < nextArrival) {
        gantt.push({ pid: null, start: time, end: nextArrival });
      }
      time = nextArrival;
      continue;
    }

    ready.sort((a, b) => a.remaining - b.remaining || a.at - b.at || a.order - b.order);
    const selected = ready[0];

    if (current !== selected) {
      closeSegment(time);
      current = selected;
      segmentStart = time;
      if (current.firstStart === null) {
        current.firstStart = time;
      }
    }

    const futureArrivals = simulated
      .filter((process) => process.at > time)
      .map((process) => process.at);
    const completion = time + current.remaining;
    const nextEvent = futureArrivals.length > 0
      ? Math.min(completion, ...futureArrivals)
      : completion;

    current.remaining -= nextEvent - time;
    time = nextEvent;

    if (current.remaining === 0) {
      current.ct = time;
      closeSegment(time);
      current = null;
    }
  }

  const results = applyMetrics(simulated);
  return {
    gantt: mergeGantt(gantt),
    results,
    order: executionOrder(gantt),
    averages: averages(results),
  };
}
