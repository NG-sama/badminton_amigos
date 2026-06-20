# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

A GitHub Pages static site for tracking ELO ratings in a casual badminton group. After each weekly matchday, the owner logs results via `matchday.html` opened locally in a browser, copies the generated JSON, and manually appends it to `data/matches.json` on GitHub. The leaderboard on `index.html` recalculates from scratch on every page load.

No build step. No backend. No npm. Push to `main` = deploy.

## Local Development

```bash
# Serve with any static file server (required for fetch() to work on index.html)
python3 -m http.server 8080
# Then open http://localhost:8080

# matchday.html can be opened directly via file:// — it makes no fetch() calls
```

## Architecture

```
index.html        # Leaderboard — fetches data, runs ELO, renders rankings
matchday.html     # Form to stage new match results and generate JSON for manual copy-paste
data/
  players.json    # player name list — the fixed roster
  matches.json    # Flat chronological array of all matches (all sessions)
js/
  elo.js          # computeElo(players, matches) → ranked array; no DOM, no imports
  leaderboard.js  # Fetches data, calls computeElo, renders index.html
  matchday.js     # Form state, staged match list, JSON generator; no fetch() calls
css/
  style.css       # Mobile-first dark theme; shared by both pages
```

## ELO System

- Starting ELO: 1000, K-factor: 32
- Team ELO = average of the two players' current ELOs (singles: just that player)
- `expected = 1 / (1 + 10^((opponentAvg - teamAvg) / 400))`
- Win: `actual = 1.0`, Draw: `actual = 0.5`, Loss: `actual = 0.0`
- `delta = K × (actual − expected)` — both players on a team move by the same delta

## Data Format

`matches.json` — flat array, one object per game, in chronological order:
```json
{ "date": "2026-06-20", "round": "R1", "court": "C1",
  "team1": ["Sid", "Ammu"], "team2": ["Srikanth", "Venky"],
  "score": "21-10", "result": "team1" }
```
- `result`: `"team1"` | `"team2"` | `"draw"`
- Singles: `"team1": ["Sid"]` (single-element array)

## Adding a New Week

1. Open `matchday.html` locally (works via `file://`)
2. Fill in each game and click **Add Match**
3. Click **Generate JSON** → copy the textarea
4. On GitHub, edit `data/matches.json` → append the copied entries inside the outer `[…]` array → commit
5. The leaderboard updates automatically on next page load

## GitHub Pages Setup

Repo Settings → Pages → Source: `main` branch, `/ (root)` — no Actions needed.
