# NEON VAULT V4 — Fictional Arcade Demo

A polished static arcade demo designed for GitHub + Vercel.

## Games
- Neon Roulette
- Blackjack 21
- Five slot rooms: Vault 777, Wild Reactor, Crystal Rush, Neon Fruits, Cosmic 7s
- Neon Plinko with Low / Medium / High risk
- Vector Crash with live cash-out
- Neon Mines with resettable rounds and animated reveals
- Six-Sided Dice with High / Low / Exact controls
- Limbo with a rising live multiplier and cash-out

## V4 fixes
- Roulette has a full 0–36 number grid and uses the same 37-pocket order for the wheel and result, so the shown color and number agree.
- Chip input accepts values such as `10K`, `100K`, `1M`, `2.5M`, and `5M`.
- Blackjack has animated card dealing, Hit, Stand, Double and Split.
- Slots live in their own section, have five distinct rooms, unique paytables and a bonus test button on every room.
- Plinko risk controls rebuild the visible multiplier map immediately and use smooth interpolated movement.
- Crash cash-out is bound once for the active round and remains live as the multiplier rises.
- Mines fully resets between rounds, visually reveals safe/mine tiles and plays win/lose sounds.
- Dice is an actual six-sided die with working High / Low / Exact selection and animated rolls.
- Limbo has an actively rising multiplier and working cash-out.
- All cover art is local SVG in `assets/` — no placeholder image URLs.

## Deploy
1. Unzip the project.
2. Upload the contents to the root of a GitHub repository.
3. Import the repository into Vercel.
4. No build command or environment variables are required.

## PowerShell
```powershell
git init
git add .
git commit -m "Neon Vault V4"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

## Scope
Fictional local demo chips only. There is no account system, DonutSMP transfer, deposits, withdrawals, or real-money wagering.
