import { view } from '../views/main.view.ts';
import { Town } from './town.ts';
import { Data } from './data.ts';
import { copyArray } from './helpers.ts';
import { prestigeValues } from './prestige.ts';
import { getBuffLevel, initializeBuffs, initializeSkills, initializeStats } from './stats.ts';
import {
  actionLog,
  buffCaps,
  buffHardCaps,
  buffList,
  buffs,
  dungeonFloors,
  skillList,
  skills,
  statList,
  stats,
  storyFlags,
  storyFlags,
  towns,
} from './globals.ts';
import { actions } from './actions.ts';
import {
  addOffline,
  addResource,
  adjustAll,
  checkExtraSpeed,
  isBonusActive,
  performGamePause,
  recalcInterval,
  showNotification,
  toggleOffline,
} from './driver.ts';
import { Action, getExploreProgress } from './actionList.ts';
import { loadChallenge } from './challenges.ts';

const defaultSaveName = 'idleLoops1';
export const challengeSaveName = 'idleLoopsChallenge';
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
  timeNeededInitial,
  timer: timeNeededInitial,
  timeNeeded: timeNeededInitial,
};

export const selfIsGame = !(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope);
if (selfIsGame) {
  Object.assign(vals.options, importPredictorSettings());
}

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
  responsiveUI: true,
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
  notifyOnPause(value, init) {
    // const input = getInput();
    if (value && !init) {
      if (Notification && Notification.permission === 'default') {
        // input.checked = false;
        // input.indeterminate = true;
        Notification.requestPermission((_) => {
          // input.indeterminate = false;
          // input.checked = value;
          setOption('notifyOnPause', value);
        });
      } else if (Notification && Notification.permission === 'denied') {
        // input.checked = false;
        // input.indeterminate = false;
        alert('Notification permission denied. You may need to allow this site to send you notifications manually.');
      } else if (!Notification || Notification.permission !== 'granted') {
        // input.checked = false;
        // input.indeterminate = false;
      }
    } else if (!value) {
      vals.options.notifyOnPause = false;
      // input.checked = false;
      // input.indeterminate = false;
    }
  },
  updateRate(value, init) {
    if (!init) recalcInterval(value);
  },
  actionLog(value, init) {
    // document.getElementById('actionLogContainer').style.display = value ? '' : 'none';
  },
  predictor(value, init) {
    localStorage['loadPredictor'] = value || '';
  },
  speedIncrease10x: checkExtraSpeed,
  speedIncrease20x: checkExtraSpeed,
  speedIncreaseCustom: checkExtraSpeed,
  speedIncreaseBackground(value, init) {
    checkExtraSpeed();

    // if (typeof value === 'number' && !isNaN(value) && value < 1 && value >= 0) {
    //   document.getElementById('speedIncreaseBackgroundWarning').style.display = '';
    // } else {
    //   document.getElementById('speedIncreaseBackgroundWarning').style.display = 'none';
    // }
  },
  bonusIsActive(value, init) {
    if (!value !== !isBonusActive()) {
      toggleOffline();
    }
  },
  repeatLastAction() {
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
  },
  predictorBackgroundThread(value, init) {
  },
};

const storyInitializers = {
  storyFlags: {
    maxWizardGuildSegmentCleared(loadingFlags) {
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

export function startGame() {
  // load calls recalcInterval, which will start the callbacks
  performGameLoad();
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

export function handleOption(option, value, init) {
  optionValueHandlers[option]?.(value, init);
  if (option in optionIndicatorClasses) {
    document.documentElement.classList.toggle(optionIndicatorClasses[option], !!vals.options[option]);
  }
}

export function setOption(option, value) {
  const oldValue = vals.options[option];
  vals.options[option] = value;

  handleOption(option, value, false);

  if (vals.options[option] !== oldValue) {
    performSaveGame();
  }
}

export function loadOption(option, value) {
  handleOption(option, value, true);
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

export function performClearSave() {
  actions.clearActions();
  actions.current = [];
  vals.challengeSave = {};
  globalThis.localStorage[vals.defaultSaveName] = '';
  globalThis.localStorage[challengeSaveName] = '';
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

export function needsDataSnapshots() {
  return vals.options.predictor && vals.options.predictorBackgroundThread;
}

export function performGameLoad(inChallenge, saveJson = globalThis.localStorage[saveName]) {
  loadDefaults();

  vals.loadouts = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
  vals.loadoutnames = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];

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
    performGameLoad(true);
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
    if (toLoad.storyFlags?.hasOwnProperty(property)) {
      storyFlags[property] = toLoad.storyFlags[property];
    } else {
      storyFlags[property] = storyInitializers.storyFlags[property]?.(toLoad.storyFlags ?? {}) ??
        false;
    }
  }

  if (toLoad.actionLog !== undefined) {
    actionLog.load(toLoad.actionLog);
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
          document.getElementById(`searchToggler${varName}`).checked = toLoad[`searchToggler${varName}`];
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
  console.log('Updating prestige values from load');

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
    performSaveGame();

    vals.challengeSave.challengeMode = toLoad.challenge;
    saveName = challengeSaveName;
    performSaveGame();
    location.reload();
  }

  if (getExploreProgress() >= 100) addResource('glasses', true);

  adjustAll();

  Data.recordBase();

  view.updateMultiPartActions();
  view.updateStories(true);
  view.update();
  recalcInterval(vals.options.updateRate);
  performGamePause();
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
          toSave[`searchToggler${varName}`] = document.getElementById(`searchToggler${varName}`).checked;
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
  toSave.storyFlags = vals.storyFlags;
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

export function performSaveGame() {
  const toSave = doSave();

  const saveJson = JSON.stringify(toSave);
  globalThis.localStorage[saveName] = saveJson;
  globalThis.localStorage['updateRate'] = vals.options.updateRate;

  return saveJson;
}

export function setSaveName(name: string) {
  saveName = name;
}

export function getSaveName() {
  return saveName;
}
