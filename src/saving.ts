import { view } from './views/main.view.ts';
import { Town } from './town.ts';
import { Data } from './data.ts';
import { copyArray, inputElement, removeClassFromDiv, textAreaElement, valueElement } from './helpers.ts';
import { prestigeValues } from './prestige.ts';
import { getBuffLevel, initializeBuffs, initializeSkills, initializeStats } from './stats.ts';
import {
  actionLog,
  buffCaps,
  buffHardCaps,
  buffList,
  buffs,
  dungeonFloors,
  selfIsGame,
  skillList,
  skills,
  statList,
  stats,
  storyFlags,
  storyVars,
  towns,
} from './globals.ts';
import { actions } from './actions.ts';
import {
  addOffline,
  addResource,
  adjustAll,
  checkExtraSpeed,
  isBonusActive,
  pauseGame,
  recalcInterval,
  restart,
  showNotification,
  toggleOffline,
} from './driver.ts';
import { Action, ClassNameNotFoundError, getActionPrototype, getExploreProgress } from './actionList.ts';
import {
  compressToBase64 as lZStringCompressToBase64,
  decompressFromBase64 as lZStringDecompressFromBase64,
} from 'lz-string';
import { loadChallenge } from './challenges.ts';
import { Koviko } from './predictor.ts';

const defaultSaveName = 'idleLoops1';
const challengeSaveName = 'idleLoopsChallenge';
let saveName = defaultSaveName;

const timeNeededInitial = 5 * 50;

export const vals = {
  trainingLimits: 10,
  curTown: 0,
  shouldRestart: true,
  totalTalent: 0,
  stoneLoc: 0,
  guild: '',
  escapeStarted: false,
  portalUsed: false,
  curLoadout: 0,
  loadouts: undefined,
  loadoutnames: undefined,
  storyShowing: 0,
  storyMax: 0,
  unreadActionStories: undefined,
  goldInvested: 0,
  stonesUsed: undefined,
  townShowing: 0,
  actionStoriesShowing: false,
  townsUnlocked: [],
  completedActions: [],
  totalActionList: [],
  dungeons: [[], [], []],
  options: {
    responsiveUI: true,
    actionLog: true,
    fractionalMana: false,
    keepCurrentList: false,
    repeatLastAction: false,
    addActionsToTop: false,
    pauseBeforeRestart: false,
    pauseOnFailedLoop: false,
    pauseOnComplete: false,
    speedIncrease10x: false,
    speedIncrease20x: false,
    speedIncreaseCustom: 5,
    speedIncreaseBackground: -1,
    bonusIsActive: false,
    highlightNew: true,
    statColors: true,
    statHints: false,
    pingOnPause: false,
    notifyOnPause: false,
    autoMaxTraining: false,
    hotkeys: true,
    predictor: false,
    updateRate: 50,
    autosaveRate: 30,
    predictorTimePrecision: 1,
    predictorNextPrecision: 2,
    predictorActionWidth: 500,
    predictorRepeatPrediction: true,
    predictorSlowMode: false,
    predictorSlowTimer: 1,
    predictorTrackedStat: 'Rsoul',
    predictorBackgroundThread: true,
  },
  totals: {
    time: 0,
    effectiveTime: 0,
    borrowedTime: 0,
    loops: 0,
    actions: 0,
  },
  challengeSave: {
    challengeMode: 0,
    inChallenge: false,
  },
  trials: [[], [], [], [], []],
  trialFloors: [50, 100, 7, 1000, 25],
  defaultSaveName: 'idleLoops1',
  challengeSaveName: 'idleLoopsChallenge',
};

Object.assign(vals, {
  currentLoop: 0,
  totalMerchantMana: 7500,
  curAdvGuildSegment: 0,
  curCraftGuildSegment: 0,
  curWizCollegeSegment: 0,
  curFightFrostGiantsSegment: 0,
  curFightJungleMonstersSegment: 0,
  curThievesGuildSegment: 0,
  curGodsSegment: 0,
  totalOfflineMs: 0,
});

let pauseNotification = null;

const numericOptions = [
  'speedIncreaseCustom',
  'speedIncreaseBackground',
  'updateRate',
  'autosaveRate',
  'predictorTimePrecision',
  'predictorNextPrecision',
  'predictorActionWidth',
  'predictorSlowTimer',
];
const stringOptions = [
  'predictorTrackedStat',
];

const isStandardOption = {
  responsiveUI: false,
  actionLog: false,
  fractionalMana: false,
  keepCurrentList: true,
  repeatLastAction: true,
  addActionsToTop: true,
  pauseBeforeRestart: true,
  pauseOnFailedLoop: true,
  pauseOnComplete: true,
  speedIncrease10x: true,
  speedIncrease20x: true,
  speedIncreaseCustom: true,
  speedIncreaseBackground: false,
  bonusIsActive: false,
  highlightNew: true,
  statColors: true,
  statHints: false,
  pingOnPause: true,
  notifyOnPause: false,
  autoMaxTraining: true,
  hotkeys: true,
  predictor: false,
  updateRate: true,
  autosaveRate: true,
  predictorTimePrecision: false,
  predictorNextPrecision: false,
  predictorActionWidth: false,
  predictorRepeatPrediction: false,
  predictorSlowMode: false,
  predictorSlowTimer: false,
  predictorTrackedStat: false,
  predictorBackgroundThread: false,
};

const optionIndicatorClasses = {
  responsiveUI: 'responsive',
  statColors: 'use-stat-colors',
  statHints: 'show-stat-hints',
  predictor: 'usePredictor',
};

const optionValueHandlers = {
  notifyOnPause(value, init, getInput) {
    const input = getInput();
    if (value && !init) {
      if (Notification && Notification.permission === 'default') {
        input.checked = false;
        input.indeterminate = true;
        Notification.requestPermission((_) => {
          input.indeterminate = false;
          input.checked = value;
          setOption('notifyOnPause', value);
        });
      } else if (Notification && Notification.permission === 'denied') {
        input.checked = false;
        input.indeterminate = false;
        alert('Notification permission denied. You may need to allow this site to send you notifications manually.');
      } else if (!Notification || Notification.permission !== 'granted') {
        input.checked = false;
        input.indeterminate = false;
      }
    } else if (!value) {
      vals.options.notifyOnPause = false;
      input.checked = false;
      input.indeterminate = false;
    }
  },
  updateRate(value, init) {
    if (!init) recalcInterval(value);
  },
  actionLog(value, init) {
    document.getElementById('actionLogContainer').style.display = value ? '' : 'none';
  },
  predictor(value, init) {
    localStorage['loadPredictor'] = value || '';
  },
  speedIncrease10x: checkExtraSpeed,
  speedIncrease20x: checkExtraSpeed,
  speedIncreaseCustom: checkExtraSpeed,
  speedIncreaseBackground(value, init) {
    checkExtraSpeed();
    if (typeof value === 'number' && !isNaN(value) && value < 1 && value >= 0) {
      document.getElementById('speedIncreaseBackgroundWarning').style.display = '';
    } else {
      document.getElementById('speedIncreaseBackgroundWarning').style.display = 'none';
    }
  },
  bonusIsActive(value, init) {
    if (!value !== !isBonusActive()) {
      toggleOffline();
    }
  },
  repeatLastAction() {
    if (vals.options.predictor) {
      view.requestUpdate('updateNextActions');
    }
  },
  predictorActionWidth(value) {
    document.documentElement.style.setProperty('--predictor-actions-width', `${value}px`);
  },
  predictorTimePrecision(value) {
    if (value > 10) {
      setOption('predictorTimePrecision', 10);
    }
    if (value < 1) {
      setOption('predictorTimePrecision', 1);
    }
  },
  predictorNextPrecision(value) {
    if (value > 10) {
      setOption('predictorNextPrecision', 10);
    }
    if (value < 1) {
      setOption('predictorNextPrecision', 1);
    }
  },
  predictorTrackedStat(value, init) {
    if (!init) {
      view.requestUpdate('updateNextActions');
    }
  },
  predictorBackgroundThread(value, init) {
    if (!value && !init) {
      Koviko.instance.terminateWorker();
    }
  },
};

const storyInitializers = {
  storyFlags: {},
  storyVars: {
    maxWizardGuildSegmentCleared(loadingFlags, loadingVars) {
      if (loadingFlags['wizardGuildRankSSSReached']) return 48;
      if (loadingFlags['wizardGuildRankSSReached']) return 42;
      if (loadingFlags['wizardGuildRankSReached']) return 36;
      if (loadingFlags['wizardGuildRankAReached']) return 30;
      if (loadingFlags['wizardGuildRankBReached']) return 24;
      if (loadingFlags['wizardGuildRankCReached']) return 18;
      if (loadingFlags['wizardGuildRankDReached']) return 12;
      if (loadingFlags['wizardGuildTestTaken']) return 0;
    },
  },
};

if (selfIsGame) {
  Object.assign(vals.options, importPredictorSettings()); // override hardcoded defaults if not in worker
}

export function decompressFromBase64(item) {
  return lZStringDecompressFromBase64(item);
}

export function compressToBase64(item) {
  return lZStringCompressToBase64(item);
}

export function startGame() {
  // load calls recalcInterval, which will start the callbacks
  load();
  globalThis.view.setScreenSize();
}

export function _town(townNum) {
  return towns[townNum];
}

export function initializeTowns() {
  for (let i = 0; i <= 8; i++) {
    towns[i] = new Town(i);
  }
}

export function isStatName(name) {
  return statList.includes(name);
}

export function isSkillName(name) {
  return skillList.includes(name);
}

export function isBuffName(name) {
  return buffList.includes(name);
}

export function initializeActions() {
  vals.totalActionList.length = 0;
  for (const prop in Action) {
    const action = Action[prop];
    vals.totalActionList.push(action);
  }
}

export function isNumericOption(option) {
  return numericOptions.includes(option);
}

export function isStringOption(option) {
  return stringOptions.includes(option);
}

export function isBooleanOption(option) {
  return !numericOptions.includes(option) && !stringOptions.includes(option);
}

export function importPredictorSettings() {
  const settingsMap = {
    __proto__: null,
    timePrecision: 'predictorTimePrecision',
    nextPrecision: 'predictorNextPrecision',
    actionWidth: 'predictorActionWidth',
    repeatPrediction: 'predictorRepeatPrediction',
    slowMode: 'predictorSlowMode',
    slowTimer: 'predictorSlowTimer',
  };

  const newOptions = {};
  for (const [originalSetting, newOption] of Object.entries(settingsMap)) {
    const value = localStorage.getItem(originalSetting);
    if (value != null) {
      // has a setting
      if (isNumericOption(newOption)) {
        const numericValue = parseInt(value);
        if (isFinite(numericValue)) {
          newOptions[newOption] = numericValue;
        }
      } else if (isStringOption(newOption)) {
        newOptions[newOption] = value;
      } else {
        newOptions[newOption] = value === 'true';
      }
    }
  }
  return newOptions;
}

export function handleOption(option, value, init, getInput) {
  optionValueHandlers[option]?.(value, init, getInput);
  // The handler can change the value of the option. Recheck when setting or clearing the indicator class.
  if (option in optionIndicatorClasses) {
    document.documentElement.classList.toggle(optionIndicatorClasses[option], !!vals.options[option]);
  }
}

export function setOption(option, value, updateUI = false) {
  const oldValue = vals.options[option];
  vals.options[option] = value;
  handleOption(option, value, false, () => valueElement(`${option}Input`));
  if (vals.options[option] !== oldValue) {
    save();
  }
  if (
    updateUI &&
    (vals.options[option] !== oldValue || vals.options[option] !== value)
  ) {
    loadOption(option, vals.options[option], false);
  }
}

export function loadOption(option, value, callHandler = true) {
  const input = valueElement(`${option}Input`, false); // this is allowed to have errors
  if (!input) return;
  if (input instanceof HTMLInputElement && input.type === 'checkbox') input.checked = !!value;
  else if (option === 'speedIncreaseBackground' && (typeof value !== 'number' || isNaN(value) || value < 0)) {
    input.value = '';
  } else input.value = String(value);
  handleOption(option, value, true, () => input);
}

export function showPauseNotification(message) {
  pauseNotification = new Notification('Idle Loops', {
    icon: 'favicon-32x32.png',
    body: message,
    tag: 'paused',
    renotify: true,
  });
}

export function clearPauseNotification() {
  if (pauseNotification) {
    pauseNotification.close();
    pauseNotification = null;
  }
}

export function clearSave() {
  globalThis.localStorage[vals.defaultSaveName] = '';
  globalThis.localStorage[challengeSaveName] = '';
  location.reload();
}

let defaultsRecorded = false;
export function loadDefaults() {
  if (defaultsRecorded) {
    Data.resetToDefaults();
  }
  initializeStats();
  initializeSkills();
  initializeBuffs();
  initializeActions();
  initializeTowns();
  prestigeValues['prestigeCurrentPoints'] = 0;
  prestigeValues['prestigeTotalPoints'] = 0;
  prestigeValues['prestigeTotalCompletions'] = 0;
  prestigeValues['completedCurrentPrestige'] = false;
  prestigeValues['completedAnyPrestige'] = false;
  Data.recordDefaults();
  defaultsRecorded = true;
}

export function loadUISettings() {
  const height = localStorage.getItem('actionListHeight');
  if (height !== '') document.documentElement.style.setProperty('--action-list-height', height);
}

export function saveUISettings() {
  const height = document.documentElement.style.getPropertyValue('--action-list-height');
  if (height !== '') localStorage.setItem('actionListHeight', height);
}

export function needsDataSnapshots() {
  return vals.options.predictor && vals.options.predictorBackgroundThread;
}

export function load(inChallenge, saveJson = globalThis.localStorage[saveName]) {
  loadDefaults();
  loadUISettings();

  vals.loadouts = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
  vals.loadoutnames = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // loadoutnames[-1] is what displays in the loadout renaming box when no loadout is selected
  // It isn't technically part of the array, just a property on it, so it doesn't count towards loadoutnames.length
  vals.loadoutnames[-1] = '';

  let toLoad = {};
  // has a save file
  if (saveJson && saveJson !== 'null') {
    toLoad = JSON.parse(saveJson);
  }

  console.log('Loading game from: ' + saveName + ' inChallenge: ' + inChallenge);

  if (toLoad.challengeSave !== undefined) {
    for (let challengeProgress in toLoad.challengeSave) {
      vals.challengeSave[challengeProgress] = toLoad.challengeSave[challengeProgress];
    }
  }
  if (inChallenge !== undefined) vals.challengeSave.inChallenge = inChallenge;

  console.log(
    'Challenge Mode: ' + vals.challengeSave.challengeMode + ' In Challenge: ' +
      vals.challengeSave.inChallenge,
  );

  if (saveName === defaultSaveName && vals.challengeSave.inChallenge === true) {
    console.log('Switching to challenge save');
    saveName = challengeSaveName;
    load(true);
    return;
  }

  if (vals.challengeSave.challengeMode !== 0) {
    saveName = challengeSaveName;
  }

  doLoad(toLoad);
}

export function doLoad(toLoad) {
  for (const property of Object.getOwnPropertyNames(toLoad.stats ?? {})) {
    if (property in stats) {
      stats[property].load(toLoad.stats[property]);
    }
  }

  for (const property of Object.getOwnPropertyNames(toLoad.skills ?? {})) {
    if (property in skills) {
      skills[property].load(toLoad.skills[property]);
    }
  }

  for (const property in toLoad.buffs) {
    if (toLoad.buffs.hasOwnProperty(property)) {
      // need the min for people with broken buff amts from pre 0.93
      buffs[property].amt = Math.min(
        toLoad.buffs[property].amt,
        buffHardCaps[property],
      );
    }
  }

  if (toLoad.buffCaps !== undefined) {
    for (const property in buffCaps) {
      if (toLoad.buffCaps.hasOwnProperty(property)) {
        buffCaps[property] = toLoad.buffCaps[property];
        inputElement(`buff${property}Cap`).value = buffCaps[property];
      }
    }
  }

  if (toLoad.prestigeValues !== undefined) {
    prestigeValues['prestigeCurrentPoints'] = toLoad.prestigeValues['prestigeCurrentPoints'] === undefined
      ? 0
      : toLoad.prestigeValues['prestigeCurrentPoints'];
    prestigeValues['prestigeTotalPoints'] = toLoad.prestigeValues['prestigeTotalPoints'] === undefined
      ? 0
      : toLoad.prestigeValues['prestigeTotalPoints'];
    prestigeValues['prestigeTotalCompletions'] = toLoad.prestigeValues['prestigeTotalCompletions'] === undefined
      ? 0
      : toLoad.prestigeValues['prestigeTotalCompletions'];
    prestigeValues['completedCurrentPrestige'] = toLoad.prestigeValues['completedCurrentPrestige'] === undefined
      ? 0
      : toLoad.prestigeValues['completedCurrentPrestige'];
    prestigeValues['completedAnyPrestige'] = toLoad.prestigeValues['completedAnyPrestige'] === undefined
      ? false
      : toLoad.prestigeValues['completedAnyPrestige'];
  }

  for (const property in storyFlags) {
    if (toLoad.storyReqs?.hasOwnProperty(property)) {
      storyFlags[property] = toLoad.storyReqs[property];
    } else {
      storyFlags[property] = storyInitializers.storyFlags[property]?.(toLoad.storyReqs ?? {}, toLoad.storyVars ?? {}) ??
        false;
    }
  }

  for (const property in storyVars) {
    if (toLoad.storyVars?.hasOwnProperty(property)) {
      storyVars[property] = toLoad.storyVars[property];
    } else {
      storyVars[property] = storyInitializers.storyVars[property]?.(toLoad.storyReqs ?? {}, toLoad.storyVars ?? {}) ??
        -1;
    }
  }

  if (toLoad.actionLog !== undefined) {
    actionLog.load(toLoad.actionLog);
    actionLog.loadRecent();
  } else {
    actionLog.initialize();
  }
  if (actionLog.entries.length === 0) {
    actionLog.addGlobalStory(0);
  }

  if (toLoad.totalTalent === undefined) {
    let temptotalTalent = 0;
    for (const property in toLoad.stats) {
      if (toLoad.stats.hasOwnProperty(property)) {
        temptotalTalent += toLoad.stats[property].talent * 100;
      }
    }
    vals.totalTalent = temptotalTalent;
  } else {
    vals.totalTalent = toLoad.totalTalent;
  }

  if (toLoad.maxTown) {
    vals.townsUnlocked = [0];
    for (let i = 1; i <= toLoad.maxTown; i++) {
      vals.townsUnlocked.push(i);
    }
  } else {
    vals.townsUnlocked = toLoad.townsUnlocked === undefined ? [0] : toLoad.townsUnlocked;
  }
  vals.completedActions = [];
  if (toLoad.completedActions && toLoad.completedActions.length > 0) {
    toLoad.completedActions.forEach((action) => {
      vals.completedActions.push(action);
    });
  }
  vals.completedActions.push('FoundGlasses');
  vals.trainingLimits = 10 + getBuffLevel('Imbuement');
  vals.goldInvested = toLoad.goldInvested === undefined ? 0 : toLoad.goldInvested;
  vals.stonesUsed = toLoad.stonesUsed === undefined ? { 1: 0, 3: 0, 5: 0, 6: 0 } : toLoad.stonesUsed;

  actions.clearActions();
  if (toLoad.nextList) {
    for (const action of toLoad.nextList) {
      if (action.name === 'Sell Gold') {
        action.name = 'Buy Mana';
      }
      if (action.name === 'Buy Mana Challenge') {
        action.name = 'Buy Mana Z1';
      }
      if (action.name === 'Tournament') {
        action.name = 'Buy Pickaxe';
      }
      if (action.name === 'Train Dex') {
        action.name = 'Train Dexterity';
      }
      if (action.name === 'Buy Mana') {
        action.name = 'Buy Mana Z1';
      }
      if (action.name === 'Purchase Mana') {
        action.name = 'Buy Mana Z3';
      }
      if (vals.totalActionList.some((x) => x.name === action.name)) {
        actions.addActionRecord(action, -1, false);
      }
    }
  }

  if (toLoad.loadouts) {
    for (let i = 0; i < vals.loadouts.length; i++) {
      if (!toLoad.loadouts[i]) {
        continue;
      }
      //Translates old actions that no longer exist
      for (const action of toLoad.loadouts[i]) {
        if (action.name === 'Sell Gold') {
          action.name = 'Buy Mana';
        }
        if (action.name === 'Tournament') {
          action.name = 'Buy Pickaxe';
        }
        if (action.name === 'Train Dex') {
          action.name = 'Train Dexterity';
        }
        if (action.name === 'Buy Mana') {
          action.name = 'Buy Mana Z1';
        }
        if (action.name === 'Purchase Mana') {
          action.name = 'Buy Mana Z3';
        }
        if (vals.totalActionList.some((x) => x.name === action.name)) {
          vals.loadouts[i].push(action);
        }
      }
    }
  }
  for (let i = 0; i < vals.loadoutnames.length; i++) {
    vals.loadoutnames[i] = 'Loadout ' + (i + 1);
  }
  if (toLoad.loadoutnames) {
    for (let i = 0; i < vals.loadoutnames.length; i++) {
      if (toLoad.loadoutnames[i] != undefined && toLoad.loadoutnames != '') {
        vals.loadoutnames[i] = toLoad.loadoutnames[i];
      } else {
        vals.loadoutnames[i] = 'Loadout ' + (i + 1);
      }
    }
  }
  vals.curLoadout = toLoad.curLoadout;
  const elem = typeof document === 'undefined' ? undefined : document.getElementById(`load${vals.curLoadout}`);
  if (elem) {
    removeClassFromDiv(
      document.getElementById(`load${vals.curLoadout}`),
      'unused',
    );
  }

  vals.dungeons = [[], [], []];
  const level = { ssChance: 1, completed: 0 };
  let floors = 0;
  if (toLoad.dungeons === undefined) toLoad.dungeons = copyArray(vals.dungeons);
  for (let i = 0; i < vals.dungeons.length; i++) {
    floors = dungeonFloors[i];
    for (let j = 0; j < floors; j++) {
      if (toLoad.dungeons[i] != undefined && toLoad.dungeons && toLoad.dungeons[i][j]) {
        vals.dungeons[i][j] = toLoad.dungeons[i][j];
      } else {
        vals.dungeons[i][j] = copyArray(level);
      }
      vals.dungeons[i][j].lastStat = 'NA';
    }
  }

  vals.trials = [[], [], [], [], []];
  const trialLevel = { completed: 0 };
  if (toLoad.trials === undefined) toLoad.trials = copyArray(vals.trials);
  for (let i = 0; i < vals.trials.length; i++) {
    floors = vals.trialFloors[i];
    vals.trials[i].highestFloor = 0;
    for (let j = 0; j < floors; j++) {
      if (toLoad.trials[i] != undefined && toLoad.trials && toLoad.trials[i][j]) {
        vals.trials[i][j] = toLoad.trials[i][j];
        if (vals.trials[i][j].completed > 0) vals.trials[i].highestFloor = j;
      } else {
        vals.trials[i][j] = copyArray(trialLevel);
      }
    }
  }

  if (toLoad.options === undefined) {
    vals.options.theme = toLoad.currentTheme === undefined ? vals.options.theme : toLoad.currentTheme;
    vals.options.repeatLastAction = toLoad.repeatLast;
    vals.options.pingOnPause = toLoad.pingOnPause === undefined ? vals.options.pingOnPause : toLoad.pingOnPause;
    vals.options.notifyOnPause = toLoad.notifyOnPause === undefined ? vals.options.notifyOnPause : toLoad.notifyOnPause;
    vals.options.autoMaxTraining = toLoad.autoMaxTraining === undefined
      ? vals.options.autoMaxTraining
      : toLoad.autoMaxTraining;
    vals.options.highlightNew = toLoad.highlightNew === undefined ? vals.options.highlightNew : toLoad.highlightNew;
    vals.options.hotkeys = toLoad.hotkeys === undefined ? vals.options.hotkeys : toLoad.hotkeys;
    vals.options.updateRate = toLoad.updateRate === undefined
      ? vals.options.updateRate
      : globalThis.localStorage['updateRate'] ?? toLoad.updateRate;
  } else {
    const optionsToLoad = { ...toLoad.options, ...toLoad.extraOptions };
    for (const option in optionsToLoad) {
      if (option in vals.options) {
        vals.options[option] = optionsToLoad[option];
      }
    }
    if ('updateRate' in optionsToLoad && globalThis.localStorage['updateRate']) {
      vals.options.updateRate = globalThis.localStorage['updateRate'];
    }
  }

  const hiddenVarNames = toLoad.hiddenVars?.slice() ?? [];

  for (const town of towns) {
    const hiddenVars = hiddenVarNames.shift() ?? [];
    town.hiddenVars.clear();
    for (const action of town.totalActionList) {
      if ((action.visible?.() ?? true) && (action.unlocked?.() ?? true)) {
        if (hiddenVars.includes(action.varName)) {
          town.hiddenVars.add(action.varName);
        }
        if (action.name.startsWith('Survey') && hiddenVars.includes(`${action.varName}Global`)) {
          town.hiddenVars.add(`${action.varName}Global`);
        }
      }
      if (action.type === 'progress') {
        town[`exp${action.varName}`] = toLoad[`exp${action.varName}`] === undefined
          ? 0
          : toLoad[`exp${action.varName}`];
      } else if (action.type === 'multipart') {
        town[`total${action.varName}`] = toLoad[`total${action.varName}`] === undefined
          ? 0
          : toLoad[`total${action.varName}`];
      } else if (action.type === 'limited') {
        const varName = action.varName;
        if (toLoad[`total${varName}`] !== undefined) {
          town[`total${varName}`] = toLoad[`total${varName}`];
        }
        if (toLoad[`checked${varName}`] !== undefined) {
          town[`checked${varName}`] = toLoad[`checked${varName}`];
        }
        if (toLoad[`good${varName}`] !== undefined) {
          town[`good${varName}`] = toLoad[`good${varName}`];
        }
        if (toLoad[`good${varName}`] !== undefined) {
          town[`goodTemp${varName}`] = toLoad[`good${varName}`];
        }
      }
    }
  }

  loadChallenge();
  view.initalize();

  for (const town of towns) {
    for (const action of town.totalActionList) {
      if (action.type === 'limited') {
        const varName = action.varName;
        if (toLoad[`searchToggler${varName}`] !== undefined) {
          inputElement(`searchToggler${varName}`).checked = toLoad[`searchToggler${varName}`];
        }
        view.updateRegular({ name: action.varName, index: town.index });
      }
    }
  }

  vals.totalOfflineMs = toLoad.totalOfflineMs === undefined ? 0 : toLoad.totalOfflineMs; // must load before options

  for (const option of Object.keys(vals.options)) {
    loadOption(option, vals.options[option]);
  }
  vals.storyShowing = toLoad.storyShowing === undefined ? 0 : toLoad.storyShowing;
  vals.storyMax = toLoad.storyMax === undefined ? 0 : toLoad.storyMax;
  if (
    toLoad.unreadActionStories === undefined ||
    toLoad.unreadActionStories.find((s) => !s.includes('storyContainer'))
  ) {
    vals.unreadActionStories = [];
  } else {
    vals.unreadActionStories = toLoad.unreadActionStories;
    for (const name of vals.unreadActionStories) {
      showNotification(name);
    }
  }

  if (toLoad.totals != undefined) {
    vals.totals.time = toLoad.totals.time === undefined ? 0 : toLoad.totals.time;
    vals.totals.effectiveTime = toLoad.totals.effectiveTime === undefined ? 0 : toLoad.totals.effectiveTime;
    vals.totals.borrowedTime = toLoad.totals.borrowedTime ?? 0;
    vals.totals.loops = toLoad.totals.loops === undefined ? 0 : toLoad.totals.loops;
    vals.totals.actions = toLoad.totals.actions === undefined ? 0 : toLoad.totals.actions;
  } else vals.totals = { time: 0, effectiveTime: 0, borrowedTime: 0, loops: 0, actions: 0 };
  vals.currentLoop = vals.totals.loops;
  view.updateTotals();
  console.log('Updating prestige values from load');
  view.updatePrestigeValues();

  // capped at 1 month of gain
  addOffline(Math.min(Math.floor(Date.now() - Date.parse(toLoad.date)), 2678400000));

  if (toLoad.version75 === undefined) {
    const total = towns[0].totalSDungeon;
    vals.dungeons[0][0].completed = Math.floor(total / 2);
    vals.dungeons[0][1].completed = Math.floor(total / 4);
    vals.dungeons[0][2].completed = Math.floor(total / 8);
    vals.dungeons[0][3].completed = Math.floor(total / 16);
    vals.dungeons[0][4].completed = Math.floor(total / 32);
    vals.dungeons[0][5].completed = Math.floor(total / 64);
    towns[0].totalSDungeon = vals.dungeons[0][0].completed +
      vals.dungeons[0][1].completed + vals.dungeons[0][2].completed +
      vals.dungeons[0][3].completed + vals.dungeons[0][4].completed +
      vals.dungeons[0][5].completed;
  }

  //Handle players on previous challenge system
  if (toLoad.challenge !== undefined && toLoad.challenge !== 0) {
    vals.challengeSave.challengeMode = 0;
    vals.challengeSave.inChallenge = true;
    save();

    vals.challengeSave.challengeMode = toLoad.challenge;
    saveName = challengeSaveName;
    save();
    location.reload();
  }

  if (getExploreProgress() >= 100) addResource('glasses', true);

  adjustAll();

  Data.recordBase();

  view.updateLoadoutNames();
  view.changeStatView();
  view.updateNextActions();
  view.updateMultiPartActions();
  view.updateStories(true);
  view.update();
  recalcInterval(vals.options.updateRate);
  pauseGame();
}

export function doSave() {
  const toSave = {};
  toSave.curLoadout = vals.curLoadout;
  toSave.dungeons = vals.dungeons;
  toSave.trials = vals.trials;
  toSave.townsUnlocked = vals.townsUnlocked;
  toSave.completedActions = vals.completedActions;

  toSave.stats = stats;
  toSave.totalTalent = vals.totalTalent;
  toSave.skills = skills;
  toSave.buffs = buffs;
  toSave.prestigeValues = prestigeValues;
  toSave.goldInvested = vals.goldInvested;
  toSave.stonesUsed = vals.stonesUsed;
  toSave.version75 = true;

  const hiddenVars = [];

  for (const town of towns) {
    hiddenVars.push(Array.from(town.hiddenVars));
    for (const action of town.totalActionList) {
      if (action.type === 'progress') {
        toSave[`exp${action.varName}`] = town[`exp${action.varName}`];
      } else if (action.type === 'multipart') {
        toSave[`total${action.varName}`] = town[`total${action.varName}`];
      } else if (action.type === 'limited') {
        const varName = action.varName;
        toSave[`total${varName}`] = town[`total${varName}`];
        toSave[`checked${varName}`] = town[`checked${varName}`];
        toSave[`good${varName}`] = town[`good${varName}`];
        toSave[`goodTemp${varName}`] = town[`good${varName}`];
        if (document.getElementById(`searchToggler${varName}`)) {
          toSave[`searchToggler${varName}`] = inputElement(`searchToggler${varName}`).checked;
        }
      }
    }
  }
  toSave.hiddenVars = hiddenVars;
  toSave.nextList = actions.next;
  toSave.loadouts = vals.loadouts;
  toSave.loadoutnames = vals.loadoutnames;
  toSave.options = {};
  toSave.extraOptions = {}; // to avoid crashing when exporting to lloyd, etc
  for (const option in vals.options) {
    if (isStandardOption[option]) {
      toSave.options[option] = vals.options[option];
    } else {
      toSave.extraOptions[option] = vals.options[option];
    }
  }
  toSave.storyShowing = vals.storyShowing;
  toSave.storyMax = vals.storyMax;
  toSave.storyReqs = storyFlags; // save uses the legacy name "storyReqs" for compatibility
  toSave.storyVars = vals.storyVars;
  toSave.unreadActionStories = vals.unreadActionStories;
  toSave.actionLog = actionLog;
  toSave.buffCaps = buffCaps;

  toSave.date = new Date();
  toSave.totalOfflineMs = vals.totalOfflineMs;
  toSave.totals = vals.totals;

  toSave.challengeSave = vals.challengeSave;
  for (const challengeProgress in vals.challengeSave) {
    toSave.challengeSave[challengeProgress] = vals.challengeSave[challengeProgress];
  }

  return toSave;
}

export function save() {
  const toSave = doSave();
  const saveJson = JSON.stringify(toSave);
  storeSaveJson(saveJson);
  globalThis.localStorage['updateRate'] = vals.options.updateRate;
  return saveJson;
}

export function exportSave() {
  const saveJson = save();
  // idle loops save version 01. patch v0.94, moved from old save system to lzstring base 64
  inputElement('exportImport').value = `ILSV01${compressToBase64(saveJson)}`;
  inputElement('exportImport').select();
  if (!document.execCommand('copy')) {
    alert('Copying the save to the clipboard failed! You will need to copy the highlighted value yourself.');
  }
}

export function importSave() {
  const saveData = inputElement('exportImport').value;
  processSave(saveData);
}

export function processSave(saveData) {
  if (saveData === '') {
    if (confirm('Importing nothing will delete your save. Are you sure you want to delete your save?')) {
      vals.challengeSave = {};
      clearSave();
    } else {
      return;
    }
  }

  const saveJson = decompressFromBase64(saveData.slice(6));

  if (saveJson) {
    storeSaveJson(saveJson);
  }
  actions.clearActions();
  actions.current = [];
  load(null, saveJson);
  pauseGame();
  restart();
}

let overquotaWarned = false;
export function storeSaveJson(saveJson) {
  try {
    globalThis.localStorage[saveName] = saveJson;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      if (!overquotaWarned) {
        alert(
          "The game's save file has exceeded this browser's storage quota.\nThis is EXTREMELY unusual and means something has gone very wrong.\n\nYOU ARE AT RISK OF LOSING GAME PROGRESS.\n\nAttempting to proceed anyway. You should export your save and keep it somewhere safe, and if possible, please report this bug in the Discord (link under Options)!",
        );
        overquotaWarned = true;
      }
    } else {
      throw e;
    }
  }
}

export function saveFileName() {
  const gameName = document.title.replace('*PAUSED* ', '');
  const version = document.querySelector('#changelog > li[data-verNum]').firstChild.textContent.trim();
  return `${gameName} ${version} - Loop ${vals.totals.loops}.txt`;
}

export function exportSaveFile() {
  const saveJson = save();
  const saveData = `ILSV01${compressToBase64(saveJson)}`;
  const a = document.createElement('a');
  a.setAttribute('href', 'data:text/plain;charset=utf-8,' + saveData);
  a.setAttribute('download', saveFileName());
  a.setAttribute('id', 'downloadSave');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function openSaveFile() {
  document.getElementById('SaveFileInput').click();
}

export function importSaveFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const saveData = e.target.result;
    processSave(saveData);
  };
  reader.readAsText(file);
}

export function exportCurrentList() {
  let toReturn = '';
  for (const action of actions.next) {
    toReturn += `${action.loops}x ${action.name}`;
    toReturn += '\n';
  }
  textAreaElement('exportImportList').value = toReturn.slice(0, -1);
  textAreaElement('exportImportList').select();
  document.execCommand('copy');
}

export function importCurrentList() {
  const toImport = textAreaElement('exportImportList').value.split('\n');
  actions.clearActions();
  for (let i = 0; i < toImport.length; i++) {
    if (!toImport[i]) {
      continue;
    }
    const name = toImport[i].substr(toImport[i].indexOf('x') + 1).trim();
    const loops = toImport[i].substr(0, toImport[i].indexOf('x'));
    try {
      const action = getActionPrototype(name);
      if (action.unlocked()) {
        actions.addActionRecord({ name, loops: Number(loops), disabled: false }, -1, false);
      }
    } catch (e) {
      if (e instanceof ClassNameNotFoundError) {
        console.log(e.message);
      } else {
        throw e;
      }
    }
  }
  view.updateNextActions();
}

export function beginChallenge(challengeNum) {
  console.log('Beginning Challenge');
  if (globalThis.localStorage[challengeSaveName] && globalThis.localStorage[challengeSaveName] !== '') {
    if (confirm('Beginning a new challenge will delete your current challenge save. Are you sure you want to begin?')) {
      globalThis.localStorage[challengeSaveName] = '';
    } else {
      return false;
    }
  }
  if (vals.challengeSave.challengeMode === 0) {
    vals.challengeSave.inChallenge = true;
    save();
    console.log('Saving to: ' + saveName);
  }
  vals.challengeSave.challengeMode = challengeNum;
  saveName = challengeSaveName;
  load(true);
  vals.totalOfflineMs = 1000000;
  save();
  pauseGame();
  restart();
}

export function exitChallenge() {
  if (vals.challengeSave.challengeMode !== 0) {
    saveName = defaultSaveName;
    load(false);
    save();
    location.reload();
  }
}

export function resumeChallenge() {
  if (
    vals.challengeSave.challengeMode === 0 && globalThis.localStorage[challengeSaveName] &&
    globalThis.localStorage[challengeSaveName] !== ''
  ) {
    vals.challengeSave.inChallenge = true;
    save();
    saveName = challengeSaveName;
    load(true);
    save();
    pauseGame();
    restart();
  }
}

const _saving = {
  save,
  exportSave,
  importSave,
  exportSaveFile,
  openSaveFile,
  importSaveFile,
  exportCurrentList,
  importCurrentList,
  beginChallenge,
  exitChallenge,
  resumeChallenge,
  view,
  loadDefaults,
  needsDataSnapshots,
  startGame,
  setOption,
  timeNeededInitial,
  timer: timeNeededInitial,
  timeNeeded: timeNeededInitial,
  vals,
  isBuffName,
};

declare global {
  var saving: typeof _saving;
}

globalThis.saving = _saving;
