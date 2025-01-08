import { towns } from './globals.ts';
import { clearList, pauseGame, restart } from './driver.ts';
import { addBuffAmt, getBuffLevel } from './stats.ts';
export const prestigeValues: Record<string, number> = {};

export function completedCurrentGame() {
  console.log('completed current prestige');

  if (!prestigeValues['completedCurrentPrestige']) {
    prestigeValues['prestigeCurrentPoints'] += 90;
    prestigeValues['prestigeTotalPoints'] += 90;
    prestigeValues['prestigeTotalCompletions'] += 1;
    prestigeValues['completedCurrentPrestige'] = true;
    prestigeValues['completedAnyPrestige'] = true;

    globalThis.saving.view.updatePrestigeValues();
  }
}

export function prestigeUpgrade(prestigeSelected: PrestigeBuffName) {
  // Update prestige value
  const costOfPrestige = getPrestigeCost(prestigeSelected);
  if (costOfPrestige > prestigeValues['prestigeCurrentPoints']) {
    console.log('Not enough points available.');
    return;
  }
  // Confirmation of prestige
  if (!prestigeConfirmation()) {
    return;
  }

  addBuffAmt(prestigeSelected, 1);
  prestigeValues['prestigeCurrentPoints'] -= costOfPrestige;

  // Retain certain values between prestiges
  const nextPrestigeBuffs = {
    PrestigePhysical: getBuffLevel('PrestigePhysical'),
    PrestigeMental: getBuffLevel('PrestigeMental'),
    PrestigeCombat: getBuffLevel('PrestigeCombat'),
    PrestigeSpatiomancy: getBuffLevel('PrestigeSpatiomancy'),
    PrestigeChronomancy: getBuffLevel('PrestigeChronomancy'),
    PrestigeBartering: getBuffLevel('PrestigeBartering'),
    PrestigeExpOverflow: getBuffLevel('PrestigeExpOverflow'),

    // Imbue Soul carry overs between prestiges, but only up to the number of prestiges you have.
    Imbuement3: Math.min(prestigeValues['prestigeTotalCompletions'], getBuffLevel('Imbuement3')),
  };

  const nextPrestigeValues = {
    prestigeCurrentPoints: prestigeValues['prestigeCurrentPoints'],
    prestigeTotalPoints: prestigeValues['prestigeTotalPoints'],
    prestigeTotalCompletions: prestigeValues['prestigeTotalCompletions'],
    completedCurrentPrestige: false,
    completedAnyPrestige: prestigeValues['completedAnyPrestige'],
  };

  prestigeWithNewValues(nextPrestigeValues, nextPrestigeBuffs);
}

export function resetAllPrestiges() {
  // Retain certain values between prestiges
  const nextPrestigeBuffs = {
    PrestigePhysical: 0,
    PrestigeMental: 0,
    PrestigeCombat: 0,
    PrestigeSpatiomancy: 0,
    PrestigeChronomancy: 0,
    PrestigeBartering: 0,
    PrestigeExpOverflow: 0,

    // Imbue Soul carry overs between prestiges, but only up to the number of prestiges you have.
    Imbuement3: Math.min(prestigeValues['prestigeTotalCompletions'], getBuffLevel('Imbuement3')),
  };

  const nextPrestigeValues = {
    prestigeCurrentPoints: prestigeValues['prestigeTotalPoints'],
    prestigeTotalPoints: prestigeValues['prestigeTotalPoints'],
    prestigeTotalCompletions: prestigeValues['prestigeTotalCompletions'],
    completedCurrentPrestige: false,
    completedAnyPrestige: prestigeValues['completedAnyPrestige'],
  };

  prestigeWithNewValues(nextPrestigeValues, nextPrestigeBuffs);
}

export function prestigeWithNewValues(
  nextPrestigeValues: typeof prestigeValues,
  nextPrestigeBuffs: { [K in PrestigeBuffName | 'Imbuement3']: number },
) {
  const nextTotals = globalThis.saving.vals.totals;
  const nextOfflineMs = globalThis.saving.vals.totalOfflineMs;

  // Remove all progress and save totals
  globalThis.saving.load(false);
  clearList();
  restart();
  pauseGame();

  // Regain prestige values and Totals
  for (const [key, value] of Object.entries(nextPrestigeBuffs)) {
    addBuffAmt(key, 0); // Set them to 0
    addBuffAmt(key, value); // Then set them to actual value
    globalThis.saving.view.requestUpdate('updateBuff', key);
  }

  prestigeValues['prestigeCurrentPoints'] = nextPrestigeValues.prestigeCurrentPoints.valueOf();
  prestigeValues['prestigeTotalPoints'] = nextPrestigeValues.prestigeTotalPoints.valueOf();
  prestigeValues['prestigeTotalCompletions'] = nextPrestigeValues.prestigeTotalCompletions.valueOf();
  prestigeValues['completedCurrentPrestige'] = nextPrestigeValues.completedCurrentPrestige.valueOf();
  prestigeValues['completedAnyPrestige'] = nextPrestigeValues.completedAnyPrestige.valueOf();
  globalThis.saving.vals.totals = nextTotals;
  globalThis.saving.vals.totalOfflineMs = nextOfflineMs;
  globalThis.saving.view.updatePrestigeValues();
  globalThis.saving.save();
}

export function prestigeConfirmation() {
  globalThis.saving.save();
  if (
    globalThis.localStorage[globalThis.saving.defaultSaveName] &&
    globalThis.localStorage[globalThis.saving.defaultSaveName] !== ''
  ) {
    if (confirm(`Prestiging will reset all of your progress, but retain prestige points. Are you sure?`)) {
      for (const town of towns) {
        // this should be done in a more logical way but for now, just make sure to clear these out
        town?.hiddenVars?.clear();
      }
      globalThis.localStorage['prestigeBackup'] = globalThis.localStorage[globalThis.saving.defaultSaveName];
      globalThis.localStorage[globalThis.saving.defaultSaveName] = '';
    } else {
      return false;
    }
  }
  return true;
}

export function getPrestigeCost(prestigeSelected: PrestigeBuffName) {
  var currentCost = 30;

  for (var i = 0; i < getBuffLevel(prestigeSelected); i++) {
    currentCost += 10 + (5 * i);
  }

  return currentCost;
}

export function getPrestigeCurrentBonus(prestigeSelected: PrestigeBuffName) {
  return prestigeBonus(prestigeSelected) > 1
    // *100 - 100 is to get percent values, otherwise 1.02 will just round to 1, rather than 2%.
    ? prestigeBonus(prestigeSelected) * 100 - 100
    : 0;
}

export type PrestigeBuffName =
  | 'PrestigeBartering'
  | 'PrestigeChronomancy'
  | 'PrestigeCombat'
  | 'PrestigeExpOverflow'
  | 'PrestigeMental'
  | 'PrestigePhysical'
  | 'PrestigeSpatiomancy';
export type Cache = { calc: number; bonus: number };

export const prestigeCache: Record<PrestigeBuffName, Cache> = {
  PrestigeBartering: { calc: -1, bonus: -1 },
  PrestigeChronomancy: { calc: -1, bonus: -1 },
  PrestigeCombat: { calc: -1, bonus: -1 },
  PrestigeExpOverflow: { calc: -1, bonus: -1 },
  PrestigeMental: { calc: -1, bonus: -1 },
  PrestigePhysical: { calc: -1, bonus: -1 },
  PrestigeSpatiomancy: { calc: -1, bonus: -1 },
};

export const prestigeBases: Record<PrestigeBuffName, number> = {
  PrestigeBartering: 1.1,
  PrestigeChronomancy: 1.05,
  PrestigeCombat: 1.2,
  PrestigeExpOverflow: 1.00222,
  PrestigeMental: 1.2,
  PrestigePhysical: 1.2,
  PrestigeSpatiomancy: 1.1,
};

export function prestigeBonus(buff) {
  const cache = prestigeCache[buff];

  const level = getBuffLevel(buff);

  if (level !== cache.calc) {
    const base = prestigeBases[buff];
    cache.bonus = Math.pow(base, level);
    cache.calc = level;
  }
  return cache.bonus;
}

export function adjustContentFromPrestige() {
  return prestigeBonus('PrestigeSpatiomancy');
}

export function adjustGoldCostFromPrestige() {
  return prestigeBonus('PrestigeBartering');
}

const _prestige = {
  completedCurrentGame,
  prestigeUpgrade,
  resetAllPrestiges,
  prestigeWithNewValues,
  prestigeConfirmation,
  getPrestigeCost,
  getPrestigeCurrentBonus,
  adjustContentFromPrestige,
  adjustGoldCostFromPrestige,
  prestigeBonus,
  prestigeCache,
  prestigeBases,
  prestigeValues,
} as const;

globalThis.prestige = _prestige;

declare global {
  var prestige: typeof _prestige;
}
