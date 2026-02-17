let points = 0;
let energy = 10;
const maxEnergy = 10;
let staked = 0;
let walletRDD = 5;
const basePointsPerClick = 10;

let totalTaps = 0;
let level = 1;
let referralCount = 0;
let prestigeCount = 0;
const prestigeThreshold = 10000;
let lastDailyBonusTime = 0;
let timeToNextEnergy = 5;

let totalClaimedRDD = 0;
let totalToPlayersRDD = 0;
let charityVaultRDD = 0;
let charityPercent = 10;
const protocolFeePercent = 0;

let achievementsUnlocked = {};
let referralCode = '';
let referralLink = '';
let ledger = [];

const quizQuestions = [
  {
    question: 'What consensus algorithm secures the ReddCoin network?',
    options: ['Proof-of-Work (PoW)', 'Proof-of-Stake Velocity (PoSV)', 'Delegated Proof-of-Stake (DPoS)', 'Proof-of-Authority (PoA)'],
    correct: 1,
    explanation: 'ReddCoin uses PoSV, rewarding both ownership and activity.',
  },
  {
    question: 'How often are new blocks generated on the ReddCoin blockchain?',
    options: ['Every 10 minutes', 'Every 2.5 minutes', 'Every 60 seconds', 'Every hour'],
    correct: 2,
    explanation: 'ReddCoin targets roughly 60-second block times.',
  },
  {
    question: 'What is the default transaction fee in this game economy?',
    options: ['0 RDD', '0.1 RDD', '1 RDD', 'Variable by level'],
    correct: 0,
    explanation: 'The protocol fee is fixed at 0%, so players receive full value minus optional charity.',
  },
];

const achievementsData = [
  { id: 'firstWater', name: 'First Watering', condition: () => totalTaps >= 1 },
  { id: 'powerClicker', name: 'Power Clicker', condition: () => totalTaps >= 100 },
  { id: 'staker', name: 'Staker', condition: () => staked >= 1 },
  { id: 'firstClaim', name: 'First Claim', condition: () => totalClaimedRDD >= 1 },
  { id: 'charityStarter', name: 'Charity Starter', condition: () => charityVaultRDD >= 1 },
];

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
const dailyButton = document.getElementById('daily-button');
const depositButton = document.getElementById('deposit-button');
const withdrawButton = document.getElementById('withdraw-button');
const referralButton = document.getElementById('referral-button');
const levelSpan = document.getElementById('level');
const referralsSpan = document.getElementById('referrals');
const shareButton = document.getElementById('share-button');
const achievementsList = document.getElementById('achievements-list');
const prestigeButton = document.getElementById('prestige-button');
const learnButton = document.getElementById('learn-button');
const learnModal = document.getElementById('learn-modal');
const learnQuestionElem = document.getElementById('learn-question');
const learnOptionsElem = document.getElementById('learn-options');
const learnClose = document.getElementById('learn-close');
const helpButton = document.getElementById('help-button');
const helpModal = document.getElementById('help-modal');
const helpClose = document.getElementById('help-close');

const protocolFeeSpan = document.getElementById('protocol-fee');
const totalClaimedSpan = document.getElementById('total-claimed');
const totalToPlayersSpan = document.getElementById('total-to-players');
const charityVaultSpan = document.getElementById('charity-vault');
const charityPercentInput = document.getElementById('charity-percent');
const charityPercentText = document.getElementById('charity-percent-text');
const grantButton = document.getElementById('grant-button');
const reportButton = document.getElementById('report-button');
const ledgerList = document.getElementById('ledger-list');

function getPrestigeMultiplier() {
  return 1 + prestigeCount * 0.2;
}

function formatRDD(value) {
  return `${value.toFixed(2)} RDD`;
}

function makeLedgerEntry(action, detail) {
  const hash = Math.random().toString(16).slice(2, 10).toUpperCase();
  const entry = {
    timestamp: new Date().toISOString(),
    action,
    detail,
    hash,
  };
  ledger.unshift(entry);
  if (ledger.length > 10) {
    ledger = ledger.slice(0, 10);
  }
}

function updateLedgerUI() {
  if (!ledgerList) return;
  ledgerList.innerHTML = '';
  if (ledger.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'No ledger actions yet.';
    ledgerList.appendChild(li);
    return;
  }
  ledger.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.timestamp} | ${item.action} | ${item.detail} | #${item.hash}`;
    ledgerList.appendChild(li);
  });
}

function loadState() {
  try {
    const saved = localStorage.getItem('reddgardenState');
    if (!saved) return;
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
    prestigeCount = data.prestigeCount ?? prestigeCount;
    totalClaimedRDD = data.totalClaimedRDD ?? totalClaimedRDD;
    totalToPlayersRDD = data.totalToPlayersRDD ?? totalToPlayersRDD;
    charityVaultRDD = data.charityVaultRDD ?? charityVaultRDD;
    charityPercent = data.charityPercent ?? charityPercent;
    ledger = data.ledger ?? ledger;
  } catch (err) {
    console.error('Failed to load state:', err);
  }
}

function saveState() {
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
    totalClaimedRDD,
    totalToPlayersRDD,
    charityVaultRDD,
    charityPercent,
    ledger,
  };
  localStorage.setItem('reddgardenState', JSON.stringify(data));
}

function updateLevel() {
  const tapLevel = Math.floor(totalTaps / 100) + 1;
  const stakeLevel = staked + 1;
  level = Math.max(tapLevel, stakeLevel);
}

function updateAchievementsUI() {
  achievementsList.innerHTML = '';
  achievementsData.forEach((achievement) => {
    const conditionMet = achievement.condition();
    const unlocked = achievementsUnlocked[achievement.id] || conditionMet;
    if (conditionMet && !achievementsUnlocked[achievement.id]) {
      achievementsUnlocked[achievement.id] = true;
      message.textContent = `Achievement unlocked: ${achievement.name}!`;
    }
    const li = document.createElement('li');
    li.textContent = achievement.name;
    if (unlocked) li.classList.add('unlocked');
    achievementsList.appendChild(li);
  });
}

function updateUI() {
  pointsSpan.textContent = points;
  stakedSpan.textContent = staked.toFixed(2);
  walletSpan.textContent = walletRDD.toFixed(2);
  levelSpan.textContent = level;
  referralsSpan.textContent = referralCount;

  const energyPercent = (energy / maxEnergy) * 100;
  energyFill.style.width = `${energyPercent}%`;
  energyText.textContent = energy < maxEnergy ? `${energy}/${maxEnergy} (${timeToNextEnergy}s)` : `${energy}/${maxEnergy}`;

  const prestigeSpan = document.getElementById('prestige-multiplier');
  const multiplier = getPrestigeMultiplier();
  prestigeSpan.textContent = multiplier % 1 === 0 ? `${multiplier.toFixed(0)}x` : `${multiplier.toFixed(1)}x`;

  protocolFeeSpan.textContent = `${protocolFeePercent}%`;
  totalClaimedSpan.textContent = formatRDD(totalClaimedRDD);
  totalToPlayersSpan.textContent = formatRDD(totalToPlayersRDD);
  charityVaultSpan.textContent = formatRDD(charityVaultRDD);
  charityPercentInput.value = charityPercent;
  charityPercentText.textContent = `${charityPercent}%`;

  updateAchievementsUI();
  updateLedgerUI();
  saveState();
}

function checkReferralQuery() {
  try {
    const url = new URL(window.location.href);
    const refParam = url.searchParams.get('ref');
    if (refParam && refParam !== referralCode && !localStorage.getItem('reddgardenReferralCredited')) {
      referralCount += 1;
      walletRDD += 1;
      localStorage.setItem('reddgardenReferralCredited', '1');
      makeLedgerEntry('Referral Bonus', `Received 1.00 RDD from referral code ${refParam}`);
      message.textContent = `Welcome! Referral credited and 1 RDD gifted.`;
    }
  } catch (err) {
    console.error('Error parsing referral query:', err);
  }
}

tapButton.addEventListener('click', () => {
  if (energy <= 0) {
    message.textContent = 'Out of energy! Use fertilizer or wait for recharge.';
    return;
  }
  energy -= 1;
  const multiplier = (1 + staked * 0.1) * getPrestigeMultiplier();
  const gained = Math.floor(basePointsPerClick * multiplier);
  points += gained;
  totalTaps += 1;
  if (energy < maxEnergy) timeToNextEnergy = 5;
  updateLevel();
  message.textContent = `You gained ${gained} influence points.`;
  updateUI();
});

setInterval(() => {
  if (energy < maxEnergy) {
    timeToNextEnergy -= 1;
    if (timeToNextEnergy <= 0) {
      energy += 1;
      timeToNextEnergy = 5;
    }
  }
  updateUI();
}, 1000);

stakeButton.addEventListener('click', () => {
  if (walletRDD < 1) {
    message.textContent = 'You need at least 1 RDD in your wallet to stake honestly.';
    return;
  }
  walletRDD -= 1;
  staked += 1;
  energy = maxEnergy;
  timeToNextEnergy = 5;
  makeLedgerEntry('Stake', 'Staked 1.00 RDD from wallet');
  message.textContent = 'You staked 1 RDD. Future taps now earn more.';
  updateLevel();
  updateUI();
});

claimButton.addEventListener('click', () => {
  const gross = Math.floor(points / 1000);
  if (gross <= 0) {
    message.textContent = 'Not enough points to claim RDD. You need 1000 points.';
    return;
  }

  const donation = Number((gross * (charityPercent / 100)).toFixed(2));
  const protocolFee = Number((gross * (protocolFeePercent / 100)).toFixed(2));
  const playerReceives = Number((gross - donation - protocolFee).toFixed(2));

  totalClaimedRDD += gross;
  totalToPlayersRDD += playerReceives;
  charityVaultRDD += donation;
  walletRDD += playerReceives;
  points %= 1000;

  makeLedgerEntry('Claim', `Gross ${gross.toFixed(2)} | Player ${playerReceives.toFixed(2)} | Charity ${donation.toFixed(2)} | Fee ${protocolFee.toFixed(2)}`);
  message.textContent = `Claimed ${gross.toFixed(2)} RDD: ${playerReceives.toFixed(2)} to you, ${donation.toFixed(2)} to charity, ${protocolFee.toFixed(2)} fee.`;
  updateLevel();
  updateUI();
});

fertilizerButton.addEventListener('click', () => {
  if (points < 50) {
    message.textContent = 'Not enough points to buy Fertilizer.';
    return;
  }
  points -= 50;
  energy = maxEnergy;
  timeToNextEnergy = 5;
  message.textContent = 'Fertilizer used. Energy fully refilled.';
  updateLevel();
  updateUI();
});

dailyButton.addEventListener('click', () => {
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;
  if (!lastDailyBonusTime || now - lastDailyBonusTime >= DAY) {
    lastDailyBonusTime = now;
    points += 200;
    energy = maxEnergy;
    timeToNextEnergy = 5;
    makeLedgerEntry('Daily Bonus', 'Granted 200 points and full energy');
    message.textContent = 'Daily bonus claimed: +200 points and energy refill.';
    updateLevel();
    updateUI();
    return;
  }
  const remaining = DAY - (now - lastDailyBonusTime);
  const hours = Math.ceil(remaining / (60 * 60 * 1000));
  message.textContent = `Daily bonus already claimed. Next bonus in ${hours}h.`;
});

const depositAddress = 'RddGardenCommunityPoolAddressExample';
depositButton.addEventListener('click', () => {
  message.textContent = `Deposit address: ${depositAddress}`;
});

withdrawButton.addEventListener('click', () => {
  const amountStr = prompt('Enter amount of RDD to withdraw (0% fee):');
  if (!amountStr) return;
  const amount = Number(amountStr);
  if (Number.isNaN(amount) || amount <= 0) {
    message.textContent = 'Invalid withdrawal amount.';
    return;
  }
  if (amount > walletRDD) {
    message.textContent = 'Insufficient wallet balance.';
    return;
  }
  walletRDD = Number((walletRDD - amount).toFixed(2));
  makeLedgerEntry('Withdraw', `Sent ${amount.toFixed(2)} RDD with 0.00 fee`);
  message.textContent = `Withdrawal requested: ${amount.toFixed(2)} RDD (0 fee).`;
  updateUI();
});

referralButton.addEventListener('click', () => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(referralLink).then(() => {
      message.textContent = 'Referral link copied. Share and grow the RDD commons.';
    }).catch(() => {
      message.textContent = `Referral link: ${referralLink}`;
    });
    return;
  }
  message.textContent = `Referral link: ${referralLink}`;
});

shareButton.addEventListener('click', () => {
  const text = encodeURIComponent(`Join ReddGarden: open, transparent, low-friction RDD rewards. ${referralLink}`);
  window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
});

charityPercentInput.addEventListener('input', () => {
  charityPercent = Number(charityPercentInput.value);
  charityPercentText.textContent = `${charityPercent}%`;
  saveState();
});

grantButton.addEventListener('click', () => {
  if (charityVaultRDD < 1) {
    message.textContent = 'Charity vault needs at least 1 RDD for a grant.';
    return;
  }
  charityVaultRDD -= 1;
  walletRDD += 1;
  makeLedgerEntry('Community Grant', '1.00 RDD grant issued from charity vault');
  message.textContent = 'Community grant sent: +1.00 RDD from charity vault.';
  updateUI();
});

reportButton.addEventListener('click', () => {
  const report = {
    generatedAt: new Date().toISOString(),
    protocolFeePercent,
    charityPercent,
    totals: {
      totalClaimedRDD,
      totalToPlayersRDD,
      charityVaultRDD,
      walletRDD,
      staked,
    },
    ledger,
  };
  const text = JSON.stringify(report, null, 2);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      message.textContent = 'Transparency report copied to clipboard as JSON.';
    }).catch(() => {
      message.textContent = 'Unable to copy report. Check console output.';
      console.log(text);
    });
  } else {
    console.log(text);
    message.textContent = 'Transparency report logged to console.';
  }
  makeLedgerEntry('Report Export', 'Transparency JSON report exported');
  updateUI();
});

function openQuiz() {
  const idx = Math.floor(Math.random() * quizQuestions.length);
  const q = quizQuestions[idx];
  learnQuestionElem.textContent = q.question;
  learnOptionsElem.innerHTML = '';

  q.options.forEach((option, i) => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.addEventListener('click', () => {
      if (i === q.correct) {
        points += 50;
        message.textContent = `Correct! +50 points. ${q.explanation}`;
      } else {
        message.textContent = `Incorrect. ${q.explanation}`;
      }
      learnModal.classList.add('hidden');
      updateLevel();
      updateUI();
    });
    learnOptionsElem.appendChild(btn);
  });

  learnModal.classList.remove('hidden');
}

learnButton.addEventListener('click', openQuiz);
learnClose.addEventListener('click', () => learnModal.classList.add('hidden'));
helpButton.addEventListener('click', () => helpModal.classList.remove('hidden'));
helpClose.addEventListener('click', () => helpModal.classList.add('hidden'));

prestigeButton.addEventListener('click', () => {
  if (points < prestigeThreshold) {
    message.textContent = `You need ${prestigeThreshold - points} more points to Prestige.`;
    return;
  }
  if (!window.confirm('Prestige resets points, level and staked RDD for a permanent multiplier. Continue?')) {
    return;
  }
  points = 0;
  energy = maxEnergy;
  staked = 0;
  totalTaps = 0;
  level = 1;
  achievementsUnlocked = {};
  prestigeCount += 1;
  makeLedgerEntry('Prestige', `Prestiged successfully. New multiplier ${getPrestigeMultiplier().toFixed(1)}x`);
  message.textContent = 'Prestige complete. Your permanent multiplier increased.';
  updateUI();
});

loadState();
checkReferralQuery();

if (!referralCode) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789';
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  referralCode = code;
}

try {
  const url = new URL(window.location.href);
  url.searchParams.set('ref', referralCode);
  referralLink = url.toString();
} catch (err) {
  referralLink = `${window.location.href}?ref=${referralCode}`;
}

updateLevel();
updateUI();
