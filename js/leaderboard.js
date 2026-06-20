async function init() {
  const [players, matches] = await Promise.all([
    fetch('data/players.json').then(r => r.json()),
    fetch('data/matches.json').then(r => r.json()),
  ]);

  const ranked = computeElo(players, matches);
  renderLeaderboard(ranked);
  renderMovers(ranked);
  renderLastUpdated(matches);
}

function rankBadge(rank) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `${rank}`;
}

function renderLeaderboard(ranked) {
  const tbody = document.getElementById('leaderboard-body');
  tbody.innerHTML = ranked.map((p, i) => {
    const rank = i + 1;
    const sign = p.delta >= 0 ? '+' : '';
    const deltaClass = p.delta > 0 ? 'positive' : p.delta < 0 ? 'negative' : 'neutral';
    const { w, d, l } = p.record;
    const record = d > 0 ? `${w}-${d}-${l}` : `${w}-${l}`;
    return `<tr>
      <td class="col-rank">${rankBadge(rank)}</td>
      <td class="col-name">${p.name}</td>
      <td class="col-elo">${p.elo}</td>
      <td class="col-record">${record}</td>
      <td class="col-delta ${deltaClass}">${sign}${p.delta}</td>
    </tr>`;
  }).join('');
}

function renderMovers(ranked) {
  const byDelta = [...ranked].sort((a, b) => b.delta - a.delta);
  const top = byDelta[0];
  const bot = byDelta[byDelta.length - 1];

  document.getElementById('top-gainer').innerHTML =
    `📈 <strong>${top.name}</strong> <span class="positive">+${top.delta}</span> &nbsp;·&nbsp; ${top.record.w}W ${top.record.l}L`;
  document.getElementById('top-loser').innerHTML =
    `📉 <strong>${bot.name}</strong> <span class="negative">${bot.delta}</span> &nbsp;·&nbsp; ${bot.record.w}W ${bot.record.l}L`;
}

function renderLastUpdated(matches) {
  if (!matches.length) return;
  const dates = matches.map(m => m.date).sort();
  const last = dates[dates.length - 1];
  document.getElementById('last-updated').textContent = `Last updated: ${last}`;
}

init();
