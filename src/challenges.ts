enum ChallengeMode {
  ManaDrought = 1,
  NoodleArms = 2,
  ManaBurn = 3,
}

const setupManaDrought = () => {
  gameSpeed = 2;

  globalThis.actionList.Action.BuyManaZ1.canStart = function () {
    return totalMerchantMana > 0;
  };
  globalThis.actionList.Action.BuyManaZ1.manaCost = function () {
    return 1;
  };
  globalThis.actionList.Action.BuyManaZ1.goldCost = function () {
    return 30;
  };
  globalThis.actionList.Action.BuyManaZ1.finish = function () {
    const spendGold = Math.min(resources.gold, 300);
    const buyMana = Math.min(spendGold * this.goldCost(), totalMerchantMana);

    globalThis.driver.addMana(buyMana);
    totalMerchantMana -= buyMana;
    globalThis.driver.addResource('gold', -spendGold);
  };

  globalThis.actionList.Action.BuyManaZ3.visible = function () {
    return false;
  };
  globalThis.actionList.Action.BuyManaZ5.visible = function () {
    return false;
  };
};

const setupNoodleArms = () => {
  getSelfCombat = function () {
    return Math.max(getZombieStrength(), getTeamStrength()) / 2;
  };
  getTeamCombat = function () {
    return getZombieStrength() + getTeamStrength();
  };
};

const setupManaBurn = () => {
  restart = function () {
    shouldRestart = false;
    timer = 0;
    timeCounter = 0;
    effectiveTime = 0;
    timeNeeded = 4320000 - totals.effectiveTime * 50;
    document.title = 'Idle Loops';
    globalThis.driver.resetResources();
    restartStats();
    for (let i = 0; i < towns.length; i++) {
      towns[i].restart();
    }
    view.requestUpdate('updateSkills');
    actions.restart();
    view.requestUpdate('updateCurrentActionsDivs');
    view.requestUpdate('updateTrials', null);
  };
};

function loadChallenge() {
  switch (challengeSave.challengeMode) {
    case ChallengeMode.ManaDrought:
      return setupManaDrought();
    case ChallengeMode.NoodleArms:
      return setupNoodleArms();
    case ChallengeMode.ManaBurn:
      return setupManaBurn();
  }
}

globalThis.trash ??= {};
globalThis.trash.loadChallenge = loadChallenge;
