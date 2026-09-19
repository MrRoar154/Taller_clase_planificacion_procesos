import { formatNumber } from "../domain/metrics.js";
import { colorForProcess } from "./gantt.js";

export function renderResults(container, { policyName, order, results, averages, processes }) {
  if (results.length === 0) {
    container.innerHTML = '<p class="empty-hint">Sin resultados. Agrega al menos un proceso.</p>';
    return;
  }

  const rows = results.map((row) => `
    <tr>
      <td><span class="swatch" style="background:${colorForProcess(row.id, processes)}"></span>${row.id}</td>
      <td>${row.at}</td>
      <td>${row.bt}</td>
      <td>${row.ct}</td>
      <td>${row.tat}</td>
      <td>${row.wt}</td>
      <td>${row.rt}</td>
    </tr>
  `).join("");

  container.innerHTML = `
    <p class="order-line"><strong>${policyName}:</strong> ${order.join(" → ")}</p>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>P</th>
            <th>AT</th>
            <th>BT</th>
            <th>CT</th>
            <th>TAT</th>
            <th>WT</th>
            <th>RT</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p class="averages">
      Promedios: WT = ${formatNumber(averages.wt)}
      · TAT = ${formatNumber(averages.tat)}
      · RT = ${formatNumber(averages.rt)}
    </p>
  `;
}
