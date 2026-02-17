# ReddGarden Game

**ReddGarden** is a click-to-earn RDD game prototype designed around crypto ethics:

- **Openness:** players can inspect the core economy directly in the UI.
- **Honesty:** protocol fee is explicitly shown and set to **0%**.
- **Transparency:** an on-screen ledger logs claims, stakes, grants, withdrawals, and report exports.
- **Generosity:** players can route a configurable percentage of each claim into a shared charity vault.

## What's new in this build

- **Transparency & Charity Ledger panel** with live totals for:
  - total claimed RDD,
  - total RDD delivered to players,
  - charity vault balance,
  - protocol fee percentage.
- **Configurable donation slider** (`0–50%`) applied per claim.
- **Community grant button** that issues 1 RDD from charity vault funds.
- **Exportable transparency report** (JSON) for open auditing.
- **Honest staking rule:** staking now uses wallet funds instead of minting stake from nothing.
- **Referral onboarding reward:** referral visitors receive 1 RDD once.

## Existing gameplay loop

- Tap to earn Influence Points.
- Convert every 1,000 points into claimable RDD.
- Stake RDD to improve point gain.
- Daily bonus, fertilizer boosts, referrals, achievements, prestige, and learn-and-earn quizzes.

## Running locally

1. Clone/download this repository.
2. Open `index.html` in a modern browser.
3. Progress is saved to browser `localStorage`.

## License

MIT (`LICENSE`).
