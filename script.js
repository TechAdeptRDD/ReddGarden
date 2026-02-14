// Simple prototype logic for ReddGarden

let points = 0;
let energy = 10;
const maxEnergy = 10;
let staked = 0;
let walletRDD = 0;
const basePointsPerClick = 10;

// Total number of taps (for achievements and level calculation)
let totalTaps = 0;

// Player level; starts at 1
let level = 1;

// Number of successful referrals credited to the player (placeholder for future backend integration)
let referralCount = 0;

// Prestige count: number of times player has performed a prestige reset
let prestigeCount = 0;

// Threshold of points needed to prestige (player must accumulate at least this many points to reset)
const prestigeThreshold = 10000;

// Quiz questions for Learn & Earn feature. Each entry has a question, array of options,
// the index of the correct answer, and an explanation. Players earn bonus points for
// correct answers about ReddCoin and cryptocurrency. These questions teach users about
// PoSV, block times and zero‑fee transactions on the ReddCoin network.
const quizQuestions = [
  {
    question: 'What consensus algorithm secures the ReddCoin network?',
    options: [
      'Proof-of-Work (PoW)',
      'Proof-of-Stake Velocity (PoSV)',
      'Delegated Proof-of-Stake (DPoS)',
      'Proof-of-Authority (PoA)',
    ],
    correct: 1,
    explanation:
      'ReddCoin uses Proof-of-Stake Velocity (PoSV), which rewards both coin ownership and transaction activity to secure the network.',
  },
  {
    question: 'How often are new blocks generated on the ReddCoin blockchain?',
    options: ['Every 10 minutes', 'Every 2.5 minutes', 'Every 60 seconds', 'Every hour'],
    correct: 2,
    explanation:
      'ReddCoin’s network is much faster than Bitcoin, targeting a 60‑second block time, meaning transactions confirm roughly every minute.',
  },
  {
    question: 'What is the default transaction fee in ReddCoin Core 4.22?',
    options: ['0 RDD (zero fee)', '0.0001 RDD', '0.001 RDD', '1 RDD'],
    correct: 0,
    explanation:
      'The ReddCoin v3.10.1 release set the default transaction fee to zero, and ReddCoin Core 4.22 continues to support zero‑fee transfers by default.',
  },
];

// Achievements configuration: id, name, description and condition function
const achievementsData = [
  {
    id: 'firstWater',
    name: 'First Watering',
    description: 'Tap the plant for the first time',
    condition: () => totalTaps >= 1,
  },
  {
    id: 'powerClicker',
    name: 'Power Clicker',
    description: 'Make 100 taps',
    condition: () => totalTaps >= 100,
  },
  {
    id: 'staker',
    name: 'Staker',
    description: 'Stake at least 1 RDD',
    condition: () => staked >= 1,
  },
  {
    id: 'firstClaim',
    name: 'First Claim',
    description: 'Claim RDD for the first time',
    condition: () => walletRDD >= 1,
  },
  {
    id: 'refMaster',
    name: 'Referral Master',
    description: 'Have at least 1 referral',
    condition: () => referralCount >= 1,
  },
];

// Unlocked achievements map (id => true)
let achievementsUnlocked = {};
// Timestamp of last daily bonus claim (milliseconds)
let lastDailyBonusTime = 0;

// Calculate the current prestige multiplier (each prestige increases multiplier by 0.2x)
function getPrestigeMultiplier() {
  return 1 + prestigeCount * 0.2;
}

// Referral code generation and referral link. These values are persisted in localStorage.
let referralCode = '';
let referralLink = '';

// countdown until next energy regeneration
let timeToNextEnergy = 5;

// DOM elements
const pointsSpan = document.getElementById('points');
const energyFill = document.getElementById('energy-fill');
const energyText = document.getElementById('energy-text');
const stakedSpan = document.getElementById('staked');
const walletSpan = document.getElementById('wallet-rdd');
const message = document.getElementById('message');
const tapButton = document.getElementById('tap-button');
const stakeButton = document.getElementById('stake-button');
const claimButton = document.getElementById('claim-button');
const fertilizerButton = document.getElementById('fertilizer-button');

// New UI elements for daily bonus, deposit and withdraw
const dailyButton = document.getElementById('daily-button');
const depositButton = document.getElementById('deposit-button');
const withdrawButton = document.getElementById('withdraw-button');

// Referral button element
const referralButton = document.getElementById('referral-button');

// New UI elements for level, referrals, share button and achievements list
const levelSpan = document.getElementById('level');
const referralsSpan = document.getElementById('referrals');
const shareButton = document.getElementById('share-button');
const achievementsList = document.getElementById('achievements-list');

// Prestige button element
const prestigeButton = document.getElementById('prestige-button');

// Learn & Earn elements
const learnButton = document.getElementById('learn-button');
const learnModal = document.getElementById('learn-modal');
const learnQuestionElem = document.getElementById('learn-question');
const learnOptionsElem = document.getElementById('learn-options');
const learnClose = document.getElementById('learn-close');

// Help modal elements
const helpButton = document.getElementById('help-button');
const helpModal = document.getElementById('help-modal');
const helpClose = document.getElementById('help-close');

// Persist and restore state from localStorage
function loadState() {
  try {
    const saved = localStorage.getItem('reddgardenState');
    if (saved) {
      const data = JSON.parse(saved);
      points = data.points ?? points;
      energy = data.energy ?? energy;
      staked = data.staked ?? staked;
      walletRDD = data.walletRDD ?? walletRDD;
      lastDailyBonusTime = data.lastDailyBonusTime ?? lastDailyBonusTime;
      referralCode = data.referralCode ?? referralCode;
      totalTaps = data.totalTaps ?? totalTaps;
      level = data.level ?? level;
      referralCount = data.referralCount ?? referralCount;
      achievementsUnlocked = data.achievementsUnlocked ?? achievementsUnlocked;

      // Load prestige count if available
      prestigeCount = data.prestigeCount ?? prestigeCount;
    }
  } catch (err) {
    console.error('Error loading state:', err);
  }
}

function saveState() {
  try {
    const data = {
      points,
      energy,
      staked,
      walletRDD,
      lastDailyBonusTime,
      referralCode,
      totalTaps,
      level,
      referralCount,
      achievementsUnlocked,
      prestigeCount,
    };
    localStorage.setItem('reddgardenState', JSON.stringify(data));
  } catch (err) {
    console.error('Error saving state:', err);
  }
}

// Update UI to reflect current state
function updateUI() {
  pointsSpan.textContent = points;
  const energyPercentage = (energy / maxEnergy) * 100;
  energyFill.style.width = `${energyPercentage}%`;
  energyText.textContent = `${energy}/${maxEnergy}`;
  stakedSpan.textContent = staked;
  walletSpan.textContent = walletRDD.toFixed(2);
  // Update level and referral displays
  if (levelSpan) levelSpan.textContent = level;
  if (referralsSpan) referralsSpan.textContent = referralCount;
  // If energy is not full, show countdown
  if (energy < maxEnergy) {
    message.textContent = `Next energy in: ${timeToNextEnergy}s`;
  }
  // Update achievements display
  updateAchievementsUI();

  // Update prestige multiplier display
  const prestigeSpan = document.getElementById('prestige-multiplier');
  if (prestigeSpan) {
    const multiplier = getPrestigeMultiplier();
    prestigeSpan.textContent = multiplier % 1 === 0 ? `${multiplier.toFixed(0)}x` : `${multiplier.toFixed(1)}x`;
  }
  saveState();
}

// Handle plant taps
tapButton.addEventListener('click', () => {
  if (energy > 0) {
    energy--;
    // Calculate multiplier: base 1 plus 0.1 per staked RDD, times prestige multiplier
    const multiplier = (1 + staked * 0.1) * getPrestigeMultiplier();
    const gained = Math.floor(basePointsPerClick * multiplier);
    points += gained;
    // Count the tap for level and achievements
    totalTaps++;
    updateLevel();
    message.textContent = `You gained ${gained} influence points!`;
    // reset countdown timer for next energy since user spent energy
    if (energy < maxEnergy) {
      timeToNextEnergy = 5;
    }
    updateUI();
  } else {
    message.textContent = 'Out of energy! Use a booster, stake RDD or wait for recharge.';
  }
});

// Regenerate energy every 5 seconds and update countdown each second
setInterval(() => {
  // countdown every second
  if (energy < maxEnergy) {
    timeToNextEnergy--;
    if (timeToNextEnergy <= 0) {
      energy++;
      timeToNextEnergy = 5;
    }
  }
  updateUI();
}, 1000);

// Simulate staking RDD: increments staked amount and refills energy
stakeButton.addEventListener('click', () => {
  staked++;
  energy = maxEnergy;
  timeToNextEnergy = 5;
  message.textContent = `You staked 1 RDD! Energy refilled and future clicks earn more.`;
  updateLevel();
  updateUI();
});

// Claim rewards: convert influence points to RDD (1000 points = 1 RDD)
claimButton.addEventListener('click', () => {
  const convertible = Math.floor(points / 1000);
  if (convertible > 0) {
    walletRDD += convertible;
    points = points % 1000;
    message.textContent = `You claimed ${convertible.toFixed(2)} RDD! Remaining points: ${points}.`;
    updateLevel();
    updateUI();
  } else {
    message.textContent = 'Not enough points to claim RDD. You need at least 1000 points.';
  }
});

// Fertilizer booster: refills energy for 50 points
fertilizerButton.addEventListener('click', () => {
  const cost = 50;
  if (points >= cost) {
    points -= cost;
    energy = maxEnergy;
    timeToNextEnergy = 5;
    message.textContent = 'Fertilizer used! Energy refilled.';
    updateLevel();
    updateUI();
  } else {
    message.textContent = 'Not enough points to purchase Fertilizer.';
  }
});

// Daily bonus: claim once every 24 hours
dailyButton.addEventListener('click', () => {
  const now = Date.now();
  // 24 hours in milliseconds
  const DAY = 24 * 60 * 60 * 1000;
  if (!lastDailyBonusTime || now - lastDailyBonusTime >= DAY) {
    lastDailyBonusTime = now;
    // grant reward: 200 points and energy refill
    points += 200;
    energy = maxEnergy;
    timeToNextEnergy = 5;
    message.textContent = 'Daily bonus claimed! +200 points and energy refilled.';
    updateLevel();
    updateUI();
  } else {
    const remaining = DAY - (now - lastDailyBonusTime);
    const hours = Math.ceil(remaining / (60 * 60 * 1000));
    message.textContent = `Daily bonus already claimed. Next bonus in ${hours}h.`;
  }
});

// Deposit: show deposit address (static for prototype)
const depositAddress = 'ReddCoinDepositAddress1Example...';
depositButton.addEventListener('click', () => {
  message.textContent = `Deposit RDD to this address: ${depositAddress}`;
});

// Withdraw: prompt for amount and decrease wallet balance (simulation)
withdrawButton.addEventListener('click', () => {
  const amountStr = prompt('Enter amount of RDD to withdraw:');
  if (!amountStr) return;
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    message.textContent = 'Invalid withdrawal amount.';
    return;
  }
  if (amount > walletRDD) {
    message.textContent = 'Insufficient RDD balance to withdraw.';
    return;
  }
  // Deduct from balance and show message
  walletRDD -= amount;
  message.textContent = `Withdrawal of ${amount.toFixed(2)} RDD requested. Funds will be sent to your wallet.`;
  updateLevel();
  updateUI();
});

// Referral button: copy referral link to clipboard
referralButton.addEventListener('click', () => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(referralLink).then(() => {
      message.textContent = 'Referral link copied! Invite friends to earn rewards together.';
    }).catch(() => {
      message.textContent = `Referral link: ${referralLink}`;
    });
  } else {
    // Fallback: show the link for manual copy
    message.textContent = `Referral link: ${referralLink}`;
  }
});

// Share button: open social share on Twitter with the referral link
shareButton.addEventListener('click', () => {
  const text = encodeURIComponent('Join ReddGarden to earn free RDD! Use my referral link: ' + referralLink);
  const url = `https://twitter.com/intent/tweet?text=${text}`;
  window.open(url, '_blank');
});

// Display a random quiz question and set up answer buttons for the Learn & Earn feature
function openQuiz() {
  // Pick a random question
  const idx = Math.floor(Math.random() * quizQuestions.length);
  const q = quizQuestions[idx];
  // Populate question text
  if (learnQuestionElem) learnQuestionElem.textContent = q.question;
  // Clear any existing options
  if (learnOptionsElem) learnOptionsElem.innerHTML = '';
  // Build option buttons
  q.options.forEach((option, i) => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.addEventListener('click', () => {
      // Check if answer is correct
      if (i === q.correct) {
        // award points for correct answer
        const reward = 50;
        points += reward;
        message.textContent = `Correct! You earned ${reward} points. ${q.explanation}`;
      } else {
        message.textContent = `Incorrect. ${q.explanation}`;
      }
      // Hide quiz after answer and update UI
      if (learnModal) learnModal.classList.add('hidden');
      updateLevel();
      updateUI();
    });
    if (learnOptionsElem) learnOptionsElem.appendChild(btn);
  });
  // Show the modal
  if (learnModal) learnModal.classList.remove('hidden');
}

// Open Learn & Earn modal on button click
if (learnButton) {
  learnButton.addEventListener('click', () => {
    openQuiz();
  });
}

// Close Learn modal
if (learnClose) {
  learnClose.addEventListener('click', () => {
    if (learnModal) learnModal.classList.add('hidden');
  });
}

// Open Help modal
if (helpButton) {
  helpButton.addEventListener('click', () => {
    if (helpModal) helpModal.classList.remove('hidden');
  });
}

// Close Help modal
if (helpClose) {
  helpClose.addEventListener('click', () => {
    if (helpModal) helpModal.classList.add('hidden');
  });
}

// Prestige button: allow player to reset progress for a permanent multiplier boost
prestigeButton.addEventListener('click', () => {
  // Check if player has enough points to prestige
  if (points < prestigeThreshold) {
    const needed = prestigeThreshold - points;
    message.textContent = `You need ${needed} more points to Prestige.`;
    return;
  }
  // Confirm with the player
  const confirmReset = window.confirm(
    'Prestige will reset your Influence Points, energy, level and staked RDD in exchange for a permanent earnings multiplier. Do you want to continue?'
  );
  if (!confirmReset) return;
  // Perform prestige reset: keep wallet balance and referral progress
  points = 0;
  energy = maxEnergy;
  staked = 0;
  totalTaps = 0;
  level = 1;
  achievementsUnlocked = {};
  prestigeCount++;
  message.textContent = 'Prestige complete! Your earnings multiplier has increased.';
  updateLevel();
  updateUI();
});

// Update player level based on total taps and staked RDD
function updateLevel() {
  const tapLevel = Math.floor(totalTaps / 100) + 1;
  const stakeLevel = staked + 1;
  level = Math.max(tapLevel, stakeLevel);
}

// Render the achievements list and unlock new achievements
function updateAchievementsUI() {
  // Clear existing list
  while (achievementsList.firstChild) {
    achievementsList.removeChild(achievementsList.firstChild);
  }
  achievementsData.forEach((ach) => {
    const conditionMet = ach.condition();
    const isUnlocked = achievementsUnlocked[ach.id] || conditionMet;
    if (conditionMet && !achievementsUnlocked[ach.id]) {
      achievementsUnlocked[ach.id] = true;
      message.textContent = `Achievement unlocked: ${ach.name}!`;
    }
    const li = document.createElement('li');
    li.textContent = ach.name;
    if (isUnlocked) {
      li.classList.add('unlocked');
    }
    achievementsList.appendChild(li);
  });
}

// Parse the 'ref' query parameter to credit referrals (placeholder)
function checkReferralQuery() {
  try {
    const url = new URL(window.location.href);
    const refParam = url.searchParams.get('ref');
    if (refParam && refParam !== referralCode) {
      message.textContent = `Thanks for using referral code: ${refParam}! Enjoy your stay.`;
      // Only credit once per session
      if (!localStorage.getItem('reddgardenReferralCredited')) {
        referralCount++;
        localStorage.setItem('reddgardenReferralCredited', '1');
      }
    }
  } catch (err) {
    console.error('Error parsing referral query:', err);
  }
}

// Load stored state and initialize UI on page load
loadState();
// Check if there is a referral code in the URL and credit accordingly
checkReferralQuery();

// If no referral code is stored, generate a random one
if (!referralCode || referralCode === '') {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  referralCode = code;
}

// Build referral link using current URL. Use search param 'ref' to carry the code.
try {
  const url = new URL(window.location.href);
  url.searchParams.set('ref', referralCode);
  referralLink = url.toString();
} catch (err) {
  referralLink = window.location.href + '?ref=' + referralCode;
}

updateUI();