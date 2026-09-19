export function createProcess({ id, at, bt, order }) {
  return {
    id: String(id).trim(),
    at: Number(at),
    bt: Number(bt),
    order: Number(order),
  };
}

export function cloneForSimulation(processes) {
  return processes.map((process) => ({
    id: process.id,
    at: process.at,
    bt: process.bt,
    order: process.order,
    remaining: process.bt,
    firstStart: null,
    ct: null,
  }));
}

export function nextProcessId(processes) {
  const used = new Set(processes.map((process) => process.id.toUpperCase()));
  let index = 1;
  while (used.has(`P${index}`)) {
    index += 1;
  }
  return `P${index}`;
}
