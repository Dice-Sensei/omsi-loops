import {
  Action,
  actionsWithGoldCost,
  getExploreExpSinceLastProgress,
  getExploreExpToNextProgress,
  getExploreProgress,
  getExploreSkill,
  translateClassNames,
} from '../original/actionList.ts';
import { vals } from '../original/saving.ts';
import { formatNumber, intToString, intToStringRound } from '../original/helpers.ts';
import { actions } from '../original/actions.ts';
import { actionLog, resources, towns } from '../original/globals.ts';
import { adjustAll, showNotification } from '../original/driver.ts';
import { t } from '../locales/translations.utils.ts';

export function formatTime(seconds: number) {
  if (seconds > 300) {
    const second = Math.floor(seconds % 60);
    const minute = Math.floor(seconds / 60 % 60);
    const hour = Math.floor(seconds / 60 / 60 % 24);
    const day = Math.floor(seconds / 60 / 60 / 24);

    let timeString = '';
    if (day > 0) timeString += day + 'd ';
    if (day > 0 || hour > 0) timeString += hour + 'h ';
    if (day > 0 || hour > 0 || minute > 0) timeString += minute + 'm ';
    timeString += second + 's';

    return timeString;
  }

  if (Number.isInteger(seconds)) {
    return (formatNumber(seconds) + 's').replace(/\B(?=(\d{3})+(?!\d))/gu, ',');
  }

  if (seconds < 10) {
    return seconds.toFixed(2) + 's';
  }

  return (seconds.toFixed(1) + 's').replace(/\B(?=(\d{3})+(?!\d))/gu, ',');
}

let dungeonShowing;

export class View {
  initalize() {
    this.updateTime();
    this.updateProgressActions();
    this.adjustGoldCosts();
    this.adjustExpGains();
    this.updateTrials();

    setInterval(() => {
      view.updateStories();
    }, 2000);

    adjustAll();
    this.updateActionTooltips();
  }

  requests = {
    updateTrialInfo: [],
    updateTrials: [],
    updateRegular: [],
    updateProgressAction: [],
    updateMultiPartSegments: [],
    updateMultiPart: [],
    updateMultiPartActions: [],
    updateTime: [],
    updateStories: [],
    updateCurrentActionBar: [],
    updateTotalTicks: [],
    updateActionTooltips: [],
    adjustManaCost: [],
    adjustGoldCost: [],
    adjustGoldCosts: [],
    adjustExpGain: [],
    removeAllHighlights: [],
    highlightIncompleteActions: [],
    highlightAction: [],
  };

  requestUpdate(category, target) {
    if (!this.requests[category].includes(target)) this.requests[category].push(target);
  }

  handleUpdateRequests() {
    for (const category in this.requests) {
      for (const target of this.requests[category]) {
        this[category]?.(target);
      }
      this.requests[category] = [];
    }
  }

  update() {
    this.handleUpdateRequests();

    if (dungeonShowing !== undefined) this.updateSoulstoneChance(dungeonShowing);
    this.updateTime();
  }

  updateTime() {
    this.adjustGoldCost({ varName: 'Wells', cost: Action.ManaWell.goldCost() });
  }

  updateActionTooltips() {
    document.getElementById('goldInvested').textContent = intToStringRound(
      vals.goldInvested,
    );
    document.getElementById('bankInterest').textContent = intToStringRound(
      vals.goldInvested * .001,
    );
    document.getElementById('actionAllowedPockets').textContent = intToStringRound(
      towns[7].totalPockets,
    );
    document.getElementById('actionAllowedWarehouses').textContent = intToStringRound(
      towns[7].totalWarehouses,
    );
    document.getElementById('actionAllowedInsurance').textContent = intToStringRound(
      towns[7].totalInsurance,
    );
    document.getElementById('totalSurveyProgress').textContent = `${getExploreProgress()}`;
    Array.from(document.getElementsByClassName('surveySkill')).forEach((div) => {
      div.textContent = `${getExploreSkill()}`;
    });
    for (const town of towns) {
      const varName = town.progressVars.find((v) => v.startsWith('Survey'));
      this.updateGlobalSurvey(varName, town);
    }
  }
  zoneTints = [
    'var(--zone-tint-1)', //Beginnersville
    'var(--zone-tint-2)', //Forest Path
    'var(--zone-tint-3)', //Merchanton
    'var(--zone-tint-4)', //Mt Olympus
    'var(--zone-tint-5)', //Valhalla
    'var(--zone-tint-6)', //Startington
    'var(--zone-tint-7)', //Jungle Path
    'var(--zone-tint-8)', //Commerceville
    'var(--zone-tint-9)', //Valley of Olympus
  ];
  highlightAction(index) {
    const element = document.getElementById(`nextActionContainer${index}`);
    if (!(element instanceof HTMLElement)) return;
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }

  updateCurrentActionBar(index) {
    const action = actions.current[index];
    if (!action) return;

    if (action.errorMessage) {
      if (action.name === 'Heal The Sick') setStoryFlag('failedHeal');

      if (
        action.name === 'Brew Potions' && resources.reputation >= 0 &&
        resources.herbs >= 10
      ) {
        setStoryFlag('failedBrewPotions');
      }
      if (
        action.name === 'Brew Potions' && resources.reputation < 0 &&
        resources.herbs >= 10
      ) {
        setStoryFlag('failedBrewPotionsNegativeRep');
      }
      if (action.name === 'Gamble' && resources.reputation < -5) setStoryFlag('failedGamble');
      if (
        action.name === 'Gamble' && resources.gold < 20 &&
        resources.reputation > -6
      ) {
        setStoryFlag('failedGambleLowMoney');
      }
      if (action.name === 'Gather Team') setStoryFlag('failedGatherTeam');
      if (action.name === 'Craft Armor') setStoryFlag('failedCraftArmor');
      if (action.name === 'Imbue Body') setStoryFlag('failedImbueBody');
      if (action.name === 'Accept Donations') setStoryFlag('failedReceivedDonations');
      if (action.name === 'Raise Zombie') setStoryFlag('failedRaiseZombie');
    }
  }

  updateProgressAction(
    { name: varName, town },
    level = town.getLevel(varName),
    levelPrc = `${town.getPrcToNext(varName)}%`,
  ) {
    document.getElementById(`prc${varName}`).textContent = `${level}`;
    document.getElementById(`expBar${varName}`)?.style.setProperty('width', levelPrc);
    document.getElementById(`progress${varName}`).textContent = intToString(levelPrc, 2);
    document.getElementById(`bar${varName}`).style.width = `${level}%`;
    if (varName.startsWith('Survey') && !varName.endsWith('Global')) {
      this.updateGlobalSurvey(varName, town);
    }
  }

  updateGlobalSurvey(varName, town) {
    const expToNext = getExploreExpToNextProgress();
    const expSinceLast = getExploreExpSinceLastProgress();
    this.updateProgressAction(
      { name: `${varName}Global`, town },
      getExploreProgress(),
      `${expSinceLast * 100 / (expSinceLast + expToNext)}%`,
    );
  }

  updateProgressActions() {
    for (const town of towns) {
      for (let i = 0; i < town.progressVars.length; i++) {
        const varName = town.progressVars[i];
        this.updateProgressAction({ name: varName, town: town });
      }
    }
  }

  updateStories(init: boolean = false) {
    // several ms cost per run. run once every 2000ms on an interval
    for (const action of vals.totalActionList) {
      if (action.storyReqs !== undefined) {
        // greatly reduces/nullifies the cost of checking actions with all stories unlocked, which is nice,
        // since you're likely to have more stories unlocked at end game, which is when performance is worse
        const divName = `storyContainer${action.varName}`;
        if (init || document.getElementById(divName).innerHTML.includes('???')) {
          let storyTooltipText = '';
          let lastInBranch = false;
          let allStoriesForActionUnlocked = true;

          for (const { num: storyId, conditionHTML, text } of action.getStoryTexts()) {
            storyTooltipText += '<p>';
            if (action.storyReqs(storyId)) {
              storyTooltipText += conditionHTML + text;
              lastInBranch = false;
              if (
                action.visible() && action.unlocked() &&
                vals.completedActions.includes(action.varName)
              ) {
                actionLog.addActionStory(action, storyId, init);
              }
            } else {
              allStoriesForActionUnlocked = false;

              if (lastInBranch) {
                storyTooltipText += '<b>???:</b> ???';
              } else {
                storyTooltipText += `${conditionHTML} ???`;
                lastInBranch = true;
              }
            }
            storyTooltipText += '</p>\n';
          }

          if (document.getElementById(divName).children[1].innerHTML !== storyTooltipText) {
            document.getElementById(divName).children[1].innerHTML = storyTooltipText;
            if (!init) {
              showNotification(divName);
              if (!vals.unreadActionStories.includes(divName)) {
                vals.unreadActionStories.push(divName);
              }
            }
            if (allStoriesForActionUnlocked) {
              document.getElementById(divName).classList.add('storyContainerCompleted');
            } else {
              document.getElementById(divName).classList.remove('storyContainerCompleted');
            }
          }
        }
      }
    }
  }

  updateRegular(updateInfo) {
    const varName = updateInfo.name;
    const index = updateInfo.index;
    const town = towns[index];
    document.getElementById(`total${varName}`).textContent = String(town[`total${varName}`]);
    document.getElementById(`checked${varName}`).textContent = String(town[`checked${varName}`]);
    document.getElementById(`unchecked${varName}`).textContent = String(
      town[`total${varName}`] - town[`checked${varName}`],
    );
    document.getElementById(`goodTemp${varName}`).textContent = String(town[`goodTemp${varName}`]);
    document.getElementById(`good${varName}`).textContent = String(town[`good${varName}`]);
  }

  adjustManaCost(actionName) {
    const action = translateClassNames(actionName);
    document.getElementById(`manaCost${action.varName}`).textContent = formatNumber(
      action.manaCost(),
    );
  }

  adjustExpMult(actionName) {
    const action = translateClassNames(actionName);
    document.getElementById(`expMult${action.varName}`).textContent = formatNumber(
      action.expMult * 100,
    );
  }

  goldCosts = {};
  adjustGoldCost(updateInfo) {
    const varName = updateInfo.varName;
    const amount = updateInfo.cost;
    const element = document.getElementById(`goldCost${varName}`);
    if (this.goldCosts[varName] !== amount && element) {
      element.textContent = formatNumber(amount);
      this.goldCosts[varName] = amount;
    }
  }
  adjustGoldCosts() {
    for (const action of actionsWithGoldCost) {
      this.adjustGoldCost({ varName: action.varName, cost: action.goldCost() });
    }
  }
  adjustExpGain(action) {
    for (const skill in action.skills) {
      if (Number.isInteger(action.skills[skill])) {
        document.getElementById(`expGain${action.varName}${skill}`).textContent = ` ${action.skills[skill].toFixed(0)}`;
      } else {document.getElementById(`expGain${action.varName}${skill}`).textContent = ` ${
          action.skills[skill]().toFixed(0)
        }`;}
    }
  }
  adjustExpGains() {
    for (const action of vals.totalActionList) {
      if (action.skills) this.adjustExpGain(action);
    }
  }

  updateMultiPartActions() {
    for (const action of vals.totalActionList) {
      if (action.type === 'multipart') {
        this.updateMultiPart(action);
        this.updateMultiPartSegments(action);
      }
    }
  }

  updateMultiPartSegments(action) {
    let segment = 0;
    let curProgress = towns[action.townNum][action.varName];
    let loopCost = action.loopCost(segment);

    while (curProgress >= loopCost && segment < action.segments) {
      document.getElementById(`expBar${segment}${action.varName}`).style.width = '0px';
      const roundedLoopCost = intToStringRound(loopCost);
      if (document.getElementById(`progress${segment}${action.varName}`).textContent !== roundedLoopCost) {
        document.getElementById(`progress${segment}${action.varName}`).textContent = roundedLoopCost;
        document.getElementById(`progressNeeded${segment}${action.varName}`).textContent = roundedLoopCost;
      }

      curProgress -= loopCost;
      segment++;
      loopCost = action.loopCost(segment);
    }

    if (document.getElementById(`progress${segment}${action.varName}`)) {
      document.getElementById(`expBar${segment}${action.varName}`).style.width = `${
        100 - 100 * curProgress / loopCost
      }%`;
      document.getElementById(`progress${segment}${action.varName}`).textContent = intToStringRound(
        curProgress,
      );
      document.getElementById(`progressNeeded${segment}${action.varName}`).textContent = intToStringRound(loopCost);
    }

    for (let i = segment + 1; i < action.segments; i++) {
      document.getElementById(`expBar${i}${action.varName}`).style.width = '100%';
      if (document.getElementById(`progress${i}${action.varName}`).textContent !== '0') {
        document.getElementById(`progress${i}${action.varName}`).textContent = '0';
      }
      document.getElementById(`progressNeeded${i}${action.varName}`).textContent = intToStringRound(
        action.loopCost(i),
      );
    }
  }

  showDungeon(index) {
    dungeonShowing = index;
    if (index !== undefined) this.updateSoulstoneChance(index);
  }

  updateSoulstoneChance(index) {
    const dungeon = vals.dungeons[index];
    for (let i = 0; i < dungeon.length; i++) {
      const level = dungeon[i];
      document.getElementById(`soulstoneChance${index}_${i}`).textContent = intToString(
        level.ssChance * 100,
        4,
      );
      document.getElementById(`soulstonePrevious${index}_${i}`).textContent = level.lastStat;
      document.getElementById(`soulstoneCompleted${index}_${i}`).textContent = formatNumber(
        level.completed,
      );
    }
  }

  updateTrials() {
    for (let i = 0; i < vals.trials.length; i++) {
      this.updateTrialInfo({ trialNum: i, curFloor: 0 });
    }
  }

  updateTrialInfo(updateInfo) {
    const curFloor = updateInfo.curFloor;
    const trialNum = updateInfo.trialNum;
    const trial = vals.trials[trialNum];
    document.getElementById(`trial${trialNum}HighestFloor`).textContent = String(trial.highestFloor + 1);
    if (curFloor >= trial.length) {
      document.getElementById(`trial${trialNum}CurFloor`).textContent = '';
      document.getElementById(`trial${trialNum}CurFloorCompleted`).textContent = '';
    } else {
      document.getElementById(`trial${trialNum}CurFloor`).textContent = '' + (curFloor + 1);
      document.getElementById(`trial${trialNum}CurFloorCompleted`).textContent = trial[curFloor].completed;
    }
    if (curFloor > 0) {
      document.getElementById(`trial${trialNum}LastFloor`).textContent = curFloor;
      document.getElementById(`trial${trialNum}LastFloorCompleted`).textContent = trial[curFloor - 1].completed;
    }
  }

  updateMultiPart(action) {
    const town = towns[action.townNum];
    document.getElementById(`multiPartName${action.varName}`).textContent = action.getPartName();
    document.getElementById(`completed${action.varName}`).textContent = ` ${
      formatNumber(town[`total${action.varName}`])
    }`;
    for (let i = 0; i < action.segments; i++) {
      const expBar = document.getElementById(`expBar${i}${action.varName}`);
      if (!expBar) {
        continue;
      }
      const mainStat = action.loopStats[(town[`${action.varName}LoopCounter`] + i) % action.loopStats.length];

      const nameStatMap = {
        Spd: 'speed',
        Con: 'constitution',
        Per: 'perception',
        Cha: 'charisma',
        Luck: 'luck',
        Int: 'intelligence',
        Soul: 'soul',
        Str: 'strength',
        Dex: 'dexterity',
      } as const;
      const stat = nameStatMap[mainStat];
      document.getElementById(`mainStat${i}${action.varName}`).textContent = t(
        `statistics.attributes.${stat}.abbreviation`,
      );

      document.getElementById(`segmentName${i}${action.varName}`).textContent = action.getSegmentName(
        town[`${action.varName}LoopCounter`] + i,
      );
    }
  }
}

export function unlockGlobalStory(num) {
  if (num > vals.storyMax) {
    document.getElementById('newStory').style.display = 'inline-block';
    vals.storyMax = num;
    actionLog.addGlobalStory(num);
  }
}

export function setStoryFlag(name) {
  if (!storyFlags[name]) {
    storyFlags[name] = true;
    if (vals.options.actionLog) view.requestUpdate('updateStories', false);
  }
}

export function increaseStoryVarTo(name, value) {
  if (storyFlags[name] < value) {
    storyFlags[name] = value;
    if (vals.options.actionLog) view.requestUpdate('updateStories', false);
  }
}

export const view = new View();
