# NEON VAULT — Arcade Demo

A static, fictional-credit arcade prototype designed to drop into GitHub and deploy directly on Vercel.

## Included
- Starts with 10M fictional chips
- Dark black + metallic neon-green UI
- Animated 3D-style game covers
- Roulette with all 0–36 pockets, red/black/even/odd/low/high bets
- Roulette result and pocket/color logic use the same wheel order, so the displayed result matches the winning pocket
- Chip-style betting with `10K`, `100K`, `1M`, and `5M` shortcuts
- Blackjack with Hit, Stand, Double, and Split
- Three slot cabinets: Pulse Jackpot, Wild Reactor, Crystal Vault
- Synchronized reel stopping and exact-pair payout logic
- Animated bonus board with guaranteed bonus test buttons
- 2×/5×/10×/25×/50× style bonus multipliers depending on cabinet
- Handpay display at 10M+ chips
- Generated browser audio for UI, roulette, blackjack, slots, and bonuses
- Developer menu for adding/resetting fictional chips
- LocalStorage persistence
- Mobile responsive
- No build step required

## Safety note
This build intentionally does **not** include Russian roulette or an animated revolver. That would turn a dangerous real-world activity into an interactive game. A future replacement can use a harmless sci-fi chamber/reactor mechanic instead.

## Fastest GitHub + Vercel deployment
1. Unzip the folder.
2. Create a new empty GitHub repository.
3. Upload all files inside `neon-arcade-demo` to the repository root.
4. In Vercel, choose **Add New → Project**.
5. Import the GitHub repository.
6. Framework preset: **Other**.
7. Leave the build command empty.
8. Deploy.

## PowerShell: create the Git repository
Open PowerShell inside the unzipped folder:

```powershell
git init
git add .
git commit -m "Neon Vault arcade demo"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

## Run locally
If Python is installed:

```powershell
python -m http.server 3000
```

Then open `http://localhost:3000`.

## Files
- `index.html` — page structure and game screens
- `style.css` — dark 3D/neon UI, animations, tables, covers
- `app.js` — chip system, roulette, blackjack, slots, bonuses, sound, dev tools
- `vercel.json` — static Vercel routing

Everything is fictional demo credit only. There is no DonutSMP bot transfer, cash-out, or real-value wagering connection.

## Latest build
- Added Neon Plinko with animated peg drops, Low/Medium/High risk maps, chip notation, multiplier slots, and polished responsive UI.
- Added stronger colorful motion/hover effects across the game floor and new-game architecture.
- The project remains fictional-credit only; no DonutSMP transfer, cash-out, or real-value wagering is connected.
