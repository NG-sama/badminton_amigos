# Badminton ELO Tracker

Weekly ELO leaderboard for a casual badminton group.

## Live Site

The site is hosted on GitHub Pages (see repo Settings → Pages for the URL).

## How It Works

- ELO ratings are calculated client-side from `data/matches.json` on every page load
- Starting ELO: **1000** · K-factor: **32** · Team ELO = average of both players
- Both singles and doubles supported

## Adding Results After a Matchday

1. Open `matchday.html` locally in your browser (works as a `file://` — no server needed)
2. Fill in each game and click **Add Match**
3. Click **Generate JSON** and copy the output
4. On GitHub, edit `data/matches.json` and append the copied entries inside the `[…]` array
5. Commit — the leaderboard updates automatically

## GitHub Pages Setup

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Source: **Deploy from a branch** → `main` → `/ (root)`
4. Save — the site will be live in ~1 minute
