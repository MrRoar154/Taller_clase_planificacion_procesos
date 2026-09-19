import { fcfs } from "./fcfs.js";
import { sjf } from "./sjf.js";
import { srtf } from "./srtf.js";
import { roundRobin } from "./roundRobin.js";

export const policies = {
  fcfs: {
    id: "fcfs",
    name: "FCFS",
    shortName: "FCFS",
    description: "El primero en llegar es el primero en ejecutarse. No apropiativo.",
    needsQuantum: false,
    run: fcfs,
  },
  sjf: {
    id: "sjf",
    name: "SJF",
    shortName: "SJF",
    description: "Entre los procesos listos, gana el de menor ráfaga. No apropiativo.",
    needsQuantum: false,
    run: sjf,
  },
  srtf: {
    id: "srtf",
    name: "SRTF",
    shortName: "SRTF",
    description: "SJF apropiativo: se expropia si llega uno con menor tiempo restante.",
    needsQuantum: false,
    run: srtf,
  },
  rr: {
    id: "rr",
    name: "Round Robin",
    shortName: "RR",
    description: "Turnos por quantum. El proceso vuelve al final de la cola si no termina.",
    needsQuantum: true,
    run: roundRobin,
  },
};

export function runPolicy(policyId, processes, options = {}) {
  const policy = policies[policyId];
  if (!policy) {
    throw new Error(`Política no encontrada: ${policyId}`);
  }
  return policy.run(processes, options);
}
