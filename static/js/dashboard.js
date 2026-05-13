const NAVY = '#1B3A6B', RED = '#C8102E', GOLD = '#F4A900', GREEN = '#16a34a', TEAL = '#0d9488';

const layout = (yTitle) => ({
  margin: { t: 10, r: 10, b: 40, l: 50 },
  paper_bgcolor: 'transparent', plot_bgcolor: 'transparent',
  font: { family: 'Segoe UI, system-ui, sans-serif', size: 11, color: '#4B5563' },
  xaxis: { gridcolor: '#F1F5F9', tickangle: -35, tickfont: { size: 9 } },
  yaxis: { gridcolor: '#F1F5F9', title: yTitle || '', titlefont: { size: 10 } },
  showlegend: true,
  legend: { orientation: 'h', y: -0.3, font: { size: 10 } },
  hovermode: 'x unified',
});

const config = { responsive: true, displayModeBar: false };

function setKPI(id, value, change, unit = '%') {
  document.getElementById(`val-${id}`).textContent = value + unit;
  const el = document.getElementById(`chg-${id}`);
  const arrow = change >= 0 ? '▲' : '▼';
  el.textContent = `${arrow} ${Math.abs(change)}${unit} vs year ago`;
  el.className = 'kpi-change ' + (change >= 0 ? 'up' : 'down');
  // For inflation & FX, up is bad
  if ((id === 'inflation' || id === 'fx') && change > 0) {
    el.className = 'kpi-change down';
  } else if ((id === 'inflation' || id === 'fx') && change <= 0) {
    el.className = 'kpi-change up';
  }
}

async function loadDashboard() {
  const [macroRes, bankRes, sumRes] = await Promise.all([
    fetch('/api/macro'), fetch('/api/banking'), fetch('/api/summary')
  ]);
  const macro = await macroRes.json();
  const bank  = await bankRes.json();
  const sum   = await sumRes.json();

  // KPIs
  setKPI('inflation', sum.inflation, sum.inflation_chg);
  setKPI('gdp',       sum.gdp,       sum.gdp_chg);
  setKPI('fx',        sum.fx,        sum.fx_chg, ' GHS');
  setKPI('policy',    sum.policy,    sum.policy_chg);

  const periods = macro.period;

  // Chart 1: Inflation vs Policy Rate
  Plotly.newPlot('chart-inflation', [
    { x: periods, y: macro.inflation_rate, name: 'Inflation (%)', type: 'scatter', mode: 'lines',
      line: { color: RED, width: 2.5 }, fill: 'tozeroy', fillcolor: 'rgba(200,16,46,0.08)' },
    { x: periods, y: macro.policy_rate, name: 'Policy Rate (%)', type: 'scatter', mode: 'lines',
      line: { color: NAVY, width: 2, dash: 'dot' } },
  ], { ...layout('Rate (%)'), }, config);

  // Chart 2: GDP Growth
  Plotly.newPlot('chart-gdp', [
    { x: periods, y: macro.gdp_growth, name: 'GDP Growth (%)', type: 'bar',
      marker: { color: macro.gdp_growth.map(v => v >= 0 ? TEAL : RED), opacity: 0.85 } },
  ], layout('Growth (%)'), config);

  // Chart 3: FX Rate
  Plotly.newPlot('chart-fx', [
    { x: periods, y: macro.usd_exchange_rate, name: 'USD/GHS', type: 'scatter', mode: 'lines',
      line: { color: GOLD, width: 2.5 }, fill: 'tozeroy', fillcolor: 'rgba(244,169,0,0.1)' },
  ], layout('GHS per USD'), config);

  // Chart 4: Credit Growth
  Plotly.newPlot('chart-credit', [
    { x: periods, y: macro.credit_growth, name: 'Credit Growth (%)', type: 'scatter', mode: 'lines+markers',
      line: { color: GREEN, width: 2 }, marker: { size: 3 } },
  ], layout('Growth (%)'), config);

  // Chart 5: Banking Assets
  Plotly.newPlot('chart-assets', [
    { x: bank.year, y: bank.total_assets_bn_ghs, name: 'Total Assets (GHS Bn)', type: 'bar',
      marker: { color: NAVY, opacity: 0.85 } },
  ], layout('GHS Billion'), config);

  // Chart 6: NPL vs Capital Adequacy
  Plotly.newPlot('chart-npl', [
    { x: bank.year, y: bank.npls_ratio, name: 'NPL Ratio (%)', type: 'scatter', mode: 'lines+markers',
      line: { color: RED, width: 2 }, marker: { size: 5 } },
    { x: bank.year, y: bank.capital_adequacy, name: 'Capital Adequacy (%)', type: 'scatter', mode: 'lines+markers',
      line: { color: GREEN, width: 2, dash: 'dash' }, marker: { size: 5 } },
  ], layout('Ratio (%)'), config);
}

loadDashboard();
