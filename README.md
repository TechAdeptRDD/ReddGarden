# ReddGarden Game

Welcome to **ReddGarden**, a click‑to‑earn game built around the ReddCoin (RDD) ecosystem.  This project is **non‑profit** and **user‑centric**—we charge no fees, and all RDD used in the game comes from a community‑funded reward pool.  Our goal is to make it fun and easy to earn micro‑amounts of real cryptocurrency while educating players about social tipping and Proof‑of‑Stake Velocity.

## Features

* **Tap to earn:** Click the plant to generate Influence Points, which can be claimed as RDD.  Every 1000 points converts to 1 RDD, so even casual players earn micro‑amounts of real crypto.
* **Staking multiplier:** Stake RDD to increase your earnings per tap.  Staking reinforces ReddCoin’s Proof‑of‑Stake Velocity mechanism, rewarding both ownership and activity.【345413388892893†L69-L94】
* **Energy system:** Energy regenerates over time; boosters and daily bonuses refill it instantly.
* **Daily bonus:** Claim a free bonus every 24 hours to keep your garden growing.
* **Deposit & withdraw:** The prototype includes buttons to view a deposit address and request withdrawals.  In the production version these will connect to a ReddCoin Core 4.22 node capable of generating addresses, sending transactions and managing HD wallets【420753704828795†L61-L82】.

* **Referral system:** Each player is given a unique referral code and copy‑link button.  Sharing this link invites friends to join and earn bonuses, helping ReddGarden grow virally.

* **Level & Achievements:** Tap and stake to level up your garden.  Unlock achievements like *First Watering*, *Power Clicker*, *Staker*, and *First Claim* as you progress.  An achievements panel tracks which badges you’ve earned.

* **Share to social:** A built‑in Share button opens a tweet with your referral link, making it easy to spread the word.  More social integrations will follow as the project develops.

* **Learn & Earn:** The **Learn & Earn** button presents short multiple‑choice quizzes about ReddCoin and cryptocurrency.  Players learn about topics like Proof‑of‑Stake Velocity, block times and zero‑fee transactions.  Correct answers grant bonus Influence Points, so you earn by learning.

* **Help & Info:** A dedicated help modal explains how to play, how staking works, how to claim RDD, and what prestige does.  It also includes educational notes about ReddCoin and its technology, so new players can understand the broader context.

* **Prestige system:** Once you accumulate enough Influence Points (10 000 by default), you can perform a **Prestige** reset.  Prestiging resets your points, level, staked amount and achievements, but grants a permanent earnings multiplier that applies to every tap thereafter.  This mechanic—borrowed from popular idle/incremental games—encourages long‑term engagement and meaningful progression【671811913815138†L94-L110】.

## Running locally

1. Clone or download this repository.
2. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, etc.).
3. The game stores your progress in your browser’s `localStorage`, so returning later will resume where you left off.

## Hosting on GitHub Pages

This repository is designed to be hosted via GitHub Pages.  To publish it:

1. Create a new repository on your GitHub account (e.g., `reddgarden`), then upload the contents of this `reddgarden_github_pages` folder.
2. Commit and push the files to the `main` branch.  GitHub Pages will automatically serve `index.html` from the root of the repository.
3. In your repository settings, enable GitHub Pages and select the `main` branch as the source.  After a few minutes, your site will be live at `https://USERNAME.github.io/REPOSITORY_NAME`.

## Real RDD and Exchanges

ReddCoin has real‑world value and can be exchanged for Bitcoin (BTC), Ethereum (ETH) and other cryptocurrencies on various exchanges.  The final version of ReddGarden will connect to a **ReddCoin Core 4.22** node—which supports modern features like SegWit, Bech32, HD wallets and multiple staking wallets—to securely distribute RDD to players and allow them to withdraw their earnings【420753704828795†L61-L82】【78813438162522†L55-L58】.  Because RDD transactions can be zero‑fee【485648577892058†L74-L82】, players receive the full value of their rewards.

If you’d like to convert your RDD earnings to BTC, ETH or another currency, you can transfer RDD from your personal wallet to a cryptocurrency exchange or use a decentralized exchange supporting RDD.  Always research the platform’s fees, liquidity and security before exchanging.

## Contributing

ReddGarden is an open‑source project.  Feel free to fork the repository, submit pull requests, or suggest features and improvements.  We have enlisted an **experienced game designer** and **virality expert** to review our work and propose enhancements.  Your contributions—whether code, design, marketing or community engagement—are welcome.  Together we can refine the core mechanics, improve retention and virality, and make ReddGarden a delightful way to discover and earn ReddCoin.

## License

This project is licensed under the MIT License; see the `LICENSE` file for details.