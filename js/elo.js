const STARTING_ELO = 1000;
const K = 32;

function computeElo(players, matches) {
  const elo = {};
  const record = {};

  players.forEach(p => {
    elo[p] = STARTING_ELO;
    record[p] = { w: 0, d: 0, l: 0 };
  });

  matches.forEach(({ team1, team2, result }) => {
    const teamAvg = team => team.reduce((s, p) => s + elo[p], 0) / team.length;
    const avg1 = teamAvg(team1);
    const avg2 = teamAvg(team2);

    const exp1 = 1 / (1 + Math.pow(10, (avg2 - avg1) / 400));
    const exp2 = 1 - exp1;

    let act1, act2;
    if (result === 'team1') {
      act1 = 1; act2 = 0;
      team1.forEach(p => record[p].w++);
      team2.forEach(p => record[p].l++);
    } else if (result === 'team2') {
      act1 = 0; act2 = 1;
      team1.forEach(p => record[p].l++);
      team2.forEach(p => record[p].w++);
    } else {
      act1 = 0.5; act2 = 0.5;
      team1.forEach(p => record[p].d++);
      team2.forEach(p => record[p].d++);
    }

    const delta1 = K * (act1 - exp1);
    const delta2 = K * (act2 - exp2);

    team1.forEach(p => { elo[p] += delta1; });
    team2.forEach(p => { elo[p] += delta2; });
  });

  return players
    .map(p => ({
      name: p,
      elo: Math.round(elo[p]),
      delta: Math.round(elo[p] - STARTING_ELO),
      record: record[p],
    }))
    .sort((a, b) => b.elo - a.elo);
}
