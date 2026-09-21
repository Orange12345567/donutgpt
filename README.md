# NEON VAULT — Casino-Style Arcade Demo

This is a **fictional-credit arcade demo**. It has no account system, deposits, cash-out, real-money wagering, DonutSMP bot connection, or item/value transfer.

## Included
- Starts at 10M demo credits
- Dark black + neon-green metallic UI
- Animated game covers
- Roulette with 0–36 number betting plus red/black/even/odd/high/low
- Roulette wheel/result sync
- Shorthand bets: `10K`, `100K`, `1M`, `5M`
- Blackjack with Hit, Stand, Double, and Split
- Slots with synchronized reel stopping
- Generated browser audio (no external audio files)
- Pinball multiplier bonus
- Bonus test buttons and handpay display
- Developer credit menu
- Saves demo credits in localStorage
- Mobile responsive
- No build step required

## Fastest GitHub + Vercel deployment
1. Unzip this folder.
2. Create a new empty GitHub repository.
3. Upload **all files inside** `neon-arcade-demo` to the repository root.
4. In Vercel, choose **Add New → Project**.
5. Import your GitHub repository.
6. Framework preset: **Other**.
7. Leave build command empty.
8. Deploy.

## PowerShell: create a Git repository from the folder
Open PowerShell inside the unzipped folder and run:

```powershell
git init
git add .
git commit -m "Initial Neon Vault demo"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

If Git asks you to sign in, complete the GitHub login window.

## Run locally
Because it is static, you can open `index.html` directly. For a local web server, if Python is installed:

```powershell
python -m http.server 3000
```

Then open `http://localhost:3000`.

## Files
- `index.html` — page structure
- `style.css` — visuals and responsive layout
- `app.js` — credits, roulette, blackjack, slots, sounds, dev tools
- `vercel.json` — Vercel static routing

## Safe future expansion
Good future additions are more **fictional-credit arcade games**, achievements, cosmetic themes, leaderboards using points with no cash value, and multiplayer social features. Keep real-money/item deposits and cash-out disabled.
