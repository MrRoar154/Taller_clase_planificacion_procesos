export function applyMetrics(simulated) {
  return simulated
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((process) => {
      const tat = process.ct - process.at;
      const wt = tat - process.bt;
      const rt = process.firstStart - process.at;
      return {
        id: process.id,
        at: process.at,
        bt: process.bt,
        ct: process.ct,
        tat,
        wt,
        rt,
      };
    });
}

export function averages(results) {
  if (results.length === 0) {
    return { wt: 0, tat: 0, rt: 0 };
  }

  const sum = (key) => results.reduce((total, row) => total + row[key], 0);
  const count = results.length;
  return {
    wt: sum("wt") / count,
    tat: sum("tat") / count,
    rt: sum("rt") / count,
  };
}

export function executionOrder(gantt) {
  return gantt
    .filter((segment) => segment.pid)
    .map((segment) => segment.pid);
}

export function mergeGantt(gantt) {
  return gantt.reduce((segments, current) => {
    const last = segments[segments.length - 1];
    if (last && last.pid === current.pid && last.end === current.start) {
      last.end = current.end;
      return segments;
    }
    segments.push({ ...current });
    return segments;
  }, []);
}

export function formatNumber(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}
