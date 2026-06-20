const PLAYERS = ["Suyash", "Sid", "Ram", "Nikhil", "Ammu", "Srirup", "Venky", "Srikanth"];
const staged = [];

function buildDropdowns() {
  const opts = `<option value="">-- Select --</option>` +
    PLAYERS.map(p => `<option value="${p}">${p}</option>`).join('');
  document.querySelectorAll('.player-select').forEach(sel => { sel.innerHTML = opts; });
}

function isDoubles() {
  return document.getElementById('type-doubles').checked;
}

function updateMatchType() {
  const doubles = isDoubles();
  document.querySelectorAll('.partner-field').forEach(el => {
    el.style.display = doubles ? '' : 'none';
  });
  document.getElementById('label-team-a').textContent = doubles ? 'Team A' : 'Player A';
  document.getElementById('label-team-b').textContent = doubles ? 'Team B' : 'Player B';
}

function addMatch() {
  const doubles = isDoubles();
  const date  = document.getElementById('date').value;
  const round = document.getElementById('round').value.trim().toUpperCase();
  const court = document.querySelector('input[name="court"]:checked').value;
  const a1    = document.getElementById('a1').value;
  const a2    = document.getElementById('a2').value;
  const b1    = document.getElementById('b1').value;
  const b2    = document.getElementById('b2').value;
  const score = document.getElementById('score').value.trim();
  const result = document.querySelector('input[name="result"]:checked').value;

  if (!date || !round || !a1 || !b1 || !score) {
    alert('Please fill in all required fields.');
    return;
  }
  if (doubles && (!a2 || !b2)) {
    alert('Please select all four players for a doubles match.');
    return;
  }

  const team1 = doubles ? [a1, a2] : [a1];
  const team2 = doubles ? [b1, b2] : [b1];

  // Basic duplicate-player check
  const all = [...team1, ...team2];
  if (new Set(all).size !== all.length) {
    alert('The same player cannot appear twice in one match.');
    return;
  }

  staged.push({ date, round, court, team1, team2, score, result });
  renderStaged();
  clearForm();
}

function clearForm() {
  document.getElementById('round').value = '';
  document.getElementById('score').value = '';
  document.querySelectorAll('.player-select').forEach(sel => { sel.value = ''; });
  document.getElementById('result-team1').checked = true;
}

function removeMatch(i) {
  staged.splice(i, 1);
  renderStaged();
}

function renderStaged() {
  const list = document.getElementById('staged-list');
  if (staged.length === 0) {
    list.innerHTML = '<p class="empty-msg">No matches added yet.</p>';
    return;
  }
  list.innerHTML = staged.map((m, i) => {
    const t1 = m.team1.join(' + ');
    const t2 = m.team2.join(' + ');
    const resultLabel = m.result === 'team1' ? `${t1} won`
      : m.result === 'team2' ? `${t2} won` : 'Draw';
    return `<div class="match-card">
      <div class="match-info">
        <span class="match-tag">${m.round} ${m.court}</span>
        <span>${t1} vs ${t2}</span>
        <span class="match-score">${m.score}</span>
        <span class="match-result">${resultLabel}</span>
      </div>
      <button class="remove-btn" onclick="removeMatch(${i})">✕</button>
    </div>`;
  }).join('');
}

function generateJson() {
  if (staged.length === 0) {
    alert('Add at least one match before generating JSON.');
    return;
  }
  document.getElementById('json-output').value = JSON.stringify(staged, null, 2);
  document.getElementById('json-section').hidden = false;
  document.getElementById('json-section').scrollIntoView({ behavior: 'smooth' });
}

function copyJson() {
  const ta = document.getElementById('json-output');
  navigator.clipboard.writeText(ta.value).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('date').value = new Date().toISOString().split('T')[0];
  buildDropdowns();
  updateMatchType();

  document.querySelectorAll('input[name="type"]').forEach(r =>
    r.addEventListener('change', updateMatchType));
  document.getElementById('add-btn').addEventListener('click', addMatch);
  document.getElementById('generate-btn').addEventListener('click', generateJson);
  document.getElementById('copy-btn').addEventListener('click', copyJson);

  renderStaged();
});
