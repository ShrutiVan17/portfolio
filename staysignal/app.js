const money0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const number0 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const percent1 = value => `${(value * 100).toFixed(1)}%`;

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
}

function renderBars(containerId, rows, labelKey, valueKey, formatter, limit = 5) {
  const container = document.getElementById(containerId);
  const selected = rows.slice(0, limit);
  const maximum = Math.max(...selected.map(row => Number(row[valueKey])), 1);
  container.innerHTML = selected.map(row => `
    <div class="bar-row">
      <div class="bar-label"><span>${row[labelKey]}</span><strong>${formatter(row[valueKey])}</strong></div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.max(2, Number(row[valueKey]) / maximum * 100)}%"></div></div>
    </div>`).join('');
}

function renderMonthlyChart(rows) {
  const svg = document.getElementById('monthlyChart');
  const width = 1200;
  const height = 340;
  const margin = { top: 20, right: 20, bottom: 45, left: 76 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const maxValue = Math.max(...rows.map(row => row.realized_revenue + row.revenue_at_risk)) * 1.08;
  const step = chartWidth / rows.length;
  const barWidth = Math.max(8, step * .58);
  const y = value => margin.top + chartHeight - value / maxValue * chartHeight;
  const parts = [];
  for (let i = 0; i <= 4; i += 1) {
    const value = maxValue * i / 4;
    const yy = y(value);
    parts.push(`<line x1="${margin.left}" x2="${width - margin.right}" y1="${yy}" y2="${yy}" stroke="rgba(23,25,20,.14)"/>`);
    parts.push(`<text x="${margin.left - 12}" y="${yy + 4}" text-anchor="end" font-size="10" fill="#666">${money0.format(value)}</text>`);
  }
  rows.forEach((row, index) => {
    const x = margin.left + index * step + (step - barWidth) / 2;
    const realizedHeight = row.realized_revenue / maxValue * chartHeight;
    const riskHeight = row.revenue_at_risk / maxValue * chartHeight;
    parts.push(`<rect x="${x}" y="${margin.top + chartHeight - realizedHeight}" width="${barWidth}" height="${realizedHeight}" fill="#263b30"/>`);
    parts.push(`<rect x="${x}" y="${margin.top + chartHeight - realizedHeight - riskHeight}" width="${barWidth}" height="${riskHeight}" fill="#c97962"/>`);
    if (index % 2 === 0 || rows.length < 13) parts.push(`<text x="${x + barWidth / 2}" y="${height - 17}" text-anchor="middle" font-size="9" fill="#666">${row.month.slice(2)}</text>`);
  });
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.innerHTML = parts.join('');
}

function renderTable(rows) {
  document.getElementById('actionTable').innerHTML = rows.slice(0, 8).map(row => `
    <tr>
      <td>${row.booking_id}</td>
      <td>${row.hotel_type.replace(' Hotel', '')}</td>
      <td>${row.market_segment}</td>
      <td>${percent1(row.cancellation_probability)}</td>
      <td>${money0.format(row.booked_revenue)}</td>
      <td><strong>${money0.format(row.expected_net_value)}</strong></td>
      <td><span class="action-pill">${row.recommended_action}</span></td>
    </tr>`).join('');
}

async function init() {
  const response = await fetch('data/summary.json');
  if (!response.ok) throw new Error('Dashboard data could not be loaded');
  const data = await response.json();
  const { kpis, model, decisioning, meta } = data;

  setText('dateRange', `${meta.date_start} → ${meta.date_end} · ${meta.data_type}`);
  setText('realizedRevenue', money0.format(kpis.realized_revenue));
  setText('realizationRate', `${percent1(kpis.realized_revenue / kpis.booked_revenue)} of booked revenue realized`);
  setText('revenueAtRisk', money0.format(kpis.revenue_at_risk));
  setText('cancellationRate', percent1(kpis.cancellation_rate));
  setText('bookingCount', `${number0.format(kpis.bookings)} total bookings`);
  setText('adr', money0.format(kpis.adr));
  setText('actionableBookings', number0.format(decisioning.actionable_bookings));
  setText('expectedNetValue', money0.format(decisioning.expected_net_value));
  setText('overbookingBuffer', `+${decisioning.recommended_overbooking_buffer} rooms`);
  setText('rocAuc', model.roc_auc.toFixed(3));
  setText('averagePrecision', model.average_precision.toFixed(3));
  setText('brierScore', model.brier_score.toFixed(3));
  setText('holdoutLabel', `${number0.format(model.holdout_rows)} future arrivals from ${model.holdout_start}`);

  const topSegment = data.market_segments[0];
  setText('operatingSignal', `${topSegment.market_segment} carries the largest cancellation exposure.`);
  setText('operatingDetail', `${money0.format(topSegment.revenue_at_risk)} is at risk across ${number0.format(topSegment.bookings)} bookings. Prioritization still uses booking-level economics rather than applying a blanket segment rule.`);

  renderMonthlyChart(data.monthly);
  renderBars('segmentBars', data.market_segments, 'market_segment', 'revenue_at_risk', money0.format.bind(money0));
  renderBars('featureBars', data.feature_importance, 'feature', 'importance', value => Number(value).toFixed(3), 6);
  renderTable(data.top_actions);
}

init().catch(error => {
  console.error(error);
  document.body.insertAdjacentHTML('beforeend', `<div style="position:fixed;left:20px;right:20px;bottom:20px;padding:16px;background:#c97962;color:white">${error.message}. Serve this folder through a local web server.</div>`);
});

