enum ChallengeMode {
  ManaDrought = 1,
  NoodleArms = 2,
  ManaBurn = 3,
}

const setupManaDrought = () => {
  globalThis.driver.gameSpeed = 2;

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
    return Math.max(globalThis.stats.getZombieStrength(), globalThis.stats.getTeamStrength()) / 2;
  };
  getTeamCombat = function () {
    return globalThis.stats.getZombieStrength() + globalThis.stats.getTeamStrength();
  };
};

const setupManaBurn = () => {
  restart = function () {
    shouldRestart = false;
    timer = 0;
    globalThis.driver.timeCounter = 0;
    globalThis.driver.effectiveTime = 0;
    timeNeeded = 4320000 - totals.effectiveTime * 50;
    document.title = 'Idle Loops';
    globalThis.driver.resetResources();
    globalThis.stats.restartStats();
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
