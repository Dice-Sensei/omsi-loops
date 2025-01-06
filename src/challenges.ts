import { towns } from './globals.ts';
import { addMana, addResource, resetResources } from './driver.ts';

enum ChallengeMode {
  ManaDrought = 1,
  NoodleArms = 2,
  ManaBurn = 3,
}

const setupManaDrought = () => {
  globalThis.driver.gameSpeed = 2;

  globalThis.actionList.Action.BuyManaZ1.canStart = function () {
    return globalThis.saving.vals.totalMerchantMana > 0;
  };
  globalThis.actionList.Action.BuyManaZ1.manaCost = function () {
    return 1;
  };
  globalThis.actionList.Action.BuyManaZ1.goldCost = function () {
    return 30;
  };
  globalThis.actionList.Action.BuyManaZ1.finish = function () {
    const spendGold = Math.min(resources.gold, 300);
    const buyMana = Math.min(spendGold * this.goldCost(), globalThis.saving.vals.totalMerchantMana);

    addMana(buyMana);
    globalThis.saving.vals.totalMerchantMana -= buyMana;
    addResource('gold', -spendGold);
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
    globalThis.saving.vals.shouldRestart = false;
    globalThis.saving.timer = 0;
    globalThis.driver.timeCounter = 0;
    globalThis.driver.effectiveTime = 0;
    globalThis.saving.timeNeeded = 4320000 - globalThis.saving.vals.totals.effectiveTime * 50;
    document.title = 'Idle Loops';
    resetResources();
    globalThis.stats.restartStats();
    for (let i = 0; i < towns.length; i++) {
      towns[i].restart();
    }
    globalThis.saving.view.requestUpdate('updateSkills');
    globalThis.saving.actions.restart();
    globalThis.saving.view.requestUpdate('updateCurrentActionsDivs');
    globalThis.saving.view.requestUpdate('updateTrials', null);
  };
};

export function loadChallenge() {
  switch (globalThis.saving.vals.challengeSave.challengeMode) {
    case ChallengeMode.ManaDrought:
      return setupManaDrought();
    case ChallengeMode.NoodleArms:
      return setupNoodleArms();
    case ChallengeMode.ManaBurn:
      return setupManaBurn();
  }
}
