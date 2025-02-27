import { getTeamStrength, getZombieStrength, restartStats } from './stats.ts';
import { Action } from './actionList.ts';
import { actions } from './actions.ts';
import { towns } from './globals.ts';
import { addMana, addResource, driverVals, resetResources } from './driver.ts';
import { view } from '../views/main.view.ts';
import { vals } from './saving.ts';

export enum ChallengeMode {
  ManaDrought = 1,
  NoodleArms = 2,
  ManaBurn = 3,
}

const setupManaDrought = () => {
  driverVals.gameSpeed = 2;

  Action.BuyManaZ1.canStart = function () {
    return vals.totalMerchantMana > 0;
  };
  Action.BuyManaZ1.manaCost = function () {
    return 1;
  };
  Action.BuyManaZ1.goldCost = function () {
    return 30;
  };
  Action.BuyManaZ1.finish = function () {
    const spendGold = Math.min(resources.gold, 300);
    const buyMana = Math.min(spendGold * this.goldCost(), vals.totalMerchantMana);

    addMana(buyMana);
    vals.totalMerchantMana -= buyMana;
    addResource('gold', -spendGold);
  };

  Action.BuyManaZ3.visible = function () {
    return false;
  };
  Action.BuyManaZ5.visible = function () {
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
    vals.shouldRestart = false;
    vals.timer = 0;
    driverVals.timeCounter = 0;
    driverVals.effectiveTime = 0;
    vals.timeNeeded = 4320000 - vals.totals.effectiveTime * 50;
    document.title = 'Idle Loops';
    resetResources();
    restartStats();
    for (let i = 0; i < towns.length; i++) {
      towns[i].restart();
    }
    actions.restart();
    view.requestUpdate('updateTrials', null);
  };
};

export function loadChallenge() {
  switch (vals.challengeSave.challengeMode) {
    case ChallengeMode.ManaDrought:
      return setupManaDrought();
    case ChallengeMode.NoodleArms:
      return setupNoodleArms();
    case ChallengeMode.ManaBurn:
      return setupManaBurn();
  }
}
