import { Buff } from '../original/stats.ts';
import {
  Action,
  actionsWithGoldCost,
  actionTypes,
  getActionPrototype,
  getExploreExpSinceLastProgress,
  getExploreExpToNextProgress,
  getExploreProgress,
  getExploreSkill,
  getPossibleTravel,
  getTravelNum,
  getXMLName,
  hasLimit,
  isActionOfType,
  isTraining,
  townNames,
  translateClassNames,
} from '../original/actionList.ts';
import { isBuffName, vals } from '../original/saving.ts';

import $ from 'jquery';
import * as d3 from 'd3';
import { Localization } from '../original/localization.ts';
import { prestigeValues } from '../original/prestige.ts';
import { camelize, formatNumber, intToString, intToStringRound, toSuffix } from '../original/helpers.ts';
import { getNumOnList } from '../original/actions.ts';
import { actions } from '../original/actions.ts';
import { actionLog, resources, statList, stats, towns } from '../original/globals.ts';
import {
  addLoop,
  adjustAll,
  capAction,
  collapse,
  disableAction,
  driverVals,
  handleDragDrop,
  handleDragOver,
  handleDragStart,
  isBonusActive,
  moveDown,
  moveUp,
  removeAction,
  removeLoop,
  showActionIcons,
  showNotification,
  split,
} from '../original/driver.ts';
import { Koviko } from '../original/predictor.ts';

export function formatTime(seconds: number) {
  if (seconds > 300) {
    let second = Math.floor(seconds % 60);
    let minute = Math.floor(seconds / 60 % 60);
    let hour = Math.floor(seconds / 60 / 60 % 24);
    let day = Math.floor(seconds / 60 / 60 / 24);

    let timeString = '';
    if (day > 0) timeString += day + 'd ';
    if (day > 0 || hour > 0) timeString += hour + 'h ';
    if (day > 0 || hour > 0 || minute > 0) timeString += minute + 'm ';
    timeString += second + 's';

    return timeString;
  }
  if (Number.isInteger(seconds)) {
    return (formatNumber(seconds) + Localization.txt('time_controls>seconds')).replace(
      /\B(?=(\d{3})+(?!\d))/gu,
      ',',
    );
  }
  if (seconds < 10) {
    return seconds.toFixed(2) + Localization.txt('time_controls>seconds');
  }
  return (seconds.toFixed(1) + Localization.txt('time_controls>seconds')).replace(
    /\B(?=(\d{3})+(?!\d))/gu,
    ',',
  );
}

let curActionShowing;
let dungeonShowing;

let curActionsDiv;
let nextActionsDiv;

export class View {
  initalize() {
    curActionsDiv = document.getElementById('curActionsList');
    nextActionsDiv = document.getElementById('nextActionsList');

    this.updateTime();
    this.updateCurrentActionsDivs();
    this.updateTotalTicks();
    this.updateAddAmount(1);
    this.updateProgressActions();
    this.updateLockedHidden();
    this.adjustGoldCosts();
    this.adjustExpGains();
    this.updateLoadoutNames();
    this.updateTrials();

    setInterval(() => {
      view.updateStories();
      view.updateLockedHidden();
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
    updateNextActions: [],
    updateTime: [],
    updateStories: [],
    updateGlobalStory: [],
    updateCurrentActionBar: [],
    updateCurrentActionsDivs: [],
    updateTotalTicks: [],
    updateCurrentActionLoops: [],
    updateActionTooltips: [],
    updateLockedHidden: [],
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

  getBonusReplacement(lhs, op, rhs) {
    const fgSpeed = Math.max(1, vals.options.speedIncreaseCustom);
    const bgSpeed = !isFinite(vals.options.speedIncreaseBackground) ? -1 : vals.options.speedIncreaseBackground ?? -1;

    const variables = {
      __proto__: null,
      get background_info() {
        if (bgSpeed < 0 || bgSpeed === fgSpeed) {
          return Localization.txt('time_controls>bonus_seconds>background_disabled');
        } else if (bgSpeed === 0) {
          return Localization.txt('time_controls>bonus_seconds>background_0x');
        } else if (bgSpeed < 1) {
          return Localization.txt('time_controls>bonus_seconds>background_regen');
        } else if (bgSpeed === 1) {
          return Localization.txt('time_controls>bonus_seconds>background_1x');
        } else if (bgSpeed < fgSpeed) {
          return Localization.txt('time_controls>bonus_seconds>background_slower');
        } else {
          return Localization.txt('time_controls>bonus_seconds>background_faster');
        }
      },
      get state() {
        return `<span class='bold' id='isBonusOn'>${
          Localization.txt(
            `time_controls>bonus_seconds>state>${isBonusActive() ? 'on' : 'off'}`,
          )
        }</span>`;
      },
      get counter_text() {
        return `<span class='bold'>${Localization.txt('time_controls>bonus_seconds>counter_text')}</span>`;
      },
      get bonusSeconds() {
        return `<span id='bonusSeconds'>${formatTime(vals.totalOfflineMs / 1000)}</span>`;
      },
      get lag_warning() {
        return driverVals.lagSpeed > 0 ? Localization.txt('time_controls>bonus_seconds>lag_warning') : '';
      },
      speed: fgSpeed,
      background_speed: bgSpeed,
      lagSpeed: driverVals.lagSpeed,
    };
    const lval = variables[lhs] ?? (parseFloat(lhs) || 0);
    const rval = variables[rhs] ?? (parseFloat(rhs) || 0);
    return String(
      op === '+' ? lval + rval : op === '-' ? lval - rval : lval,
    );
  }
  updateTotalTicks() {
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
  updateNextActions() {
    const { scrollTop } = nextActionsDiv; // save the current scroll position
    if (vals.options.predictor) {
      Koviko.preUpdateHandler(nextActionsDiv);
    }

    d3.select(nextActionsDiv)
      .selectAll('.nextActionContainer')
      .data(
        actions.next.map((a, index) => ({
          ...a,
          actionId: a.actionId,
          index,
          action: getActionPrototype(a.name),
        })),
        (a) => a.actionId,
      )
      .join((enter) => {
        enter.append(({ actionId: id }) => {
          const actions = {
            cap: capAction.bind(null, id),
            plus: addLoop.bind(null, id),
            minus: removeLoop.bind(null, id),
            split: split.bind(null, id),
            compress: collapse.bind(null, id),
            up: moveUp.bind(null, id),
            down: moveDown.bind(null, id),
            skip: disableAction.bind(null, id),
            remove: removeAction.bind(null, id),
          };
          const drags = {
            ondrop: handleDragDrop,
            ondragover: handleDragOver,
            ondragstart: handleDragStart,
            ondragend: draggedUndecorate.bind(null, id),
            ondragenter: dragOverDecorate.bind(null, id),
            ondragleave: dragExitUndecorate.bind(null, id),
          };

          const container = document.createElement('div');
          container.id = `nextActionContainer${id}`;
          container.classList.add('nextActionContainer', 'small', 'showthat');
          container.ondragover = drags.ondragover;
          container.ondrop = drags.ondrop;
          container.ondragstart = drags.ondragstart;
          container.ondragend = drags.ondragend;
          container.ondragenter = drags.ondragenter;
          container.ondragleave = drags.ondragleave;
          container.draggable = true;
          container.dataset.actionId = id;

          const counter = document.createElement('div');
          counter.classList.add('nextActionLoops');
          counter.innerHTML = `
            <img class='smallIcon imageDragFix'> 
            ×
            <div class='bold'></div>
          `;

          container.append(counter);

          const buttons = document.createElement('div');
          buttons.classList.add('nextActionButtons');
          const capButton = document.createElement('button');
          capButton.classList.add('capButton', 'actionIcon', 'far', 'fa-circle');
          capButton.onclick = actions.cap;
          buttons.append(capButton);

          const plusButton = document.createElement('button');
          plusButton.classList.add('plusButton', 'actionIcon', 'fas', 'fa-plus');
          plusButton.onclick = actions.plus;
          buttons.append(plusButton);

          const minusButton = document.createElement('button');
          minusButton.classList.add('minusButton', 'actionIcon', 'fas', 'fa-minus');
          minusButton.onclick = actions.minus;
          buttons.append(minusButton);

          const splitButton = document.createElement('button');
          splitButton.classList.add('splitButton', 'actionIcon', 'fas', 'fa-arrows-alt-h');
          splitButton.onclick = actions.split;
          buttons.append(splitButton);

          const compressButton = document.createElement('button');
          compressButton.classList.add('collapseButton', 'actionIcon', 'fas', 'fa-compress-alt');
          compressButton.onclick = actions.compress;
          buttons.append(compressButton);

          const upButton = document.createElement('button');
          upButton.classList.add('upButton', 'actionIcon', 'fas', 'fa-sort-up');
          upButton.onclick = actions.up;
          buttons.append(upButton);

          const downButton = document.createElement('button');
          downButton.classList.add('downButton', 'actionIcon', 'fas', 'fa-sort-down');
          downButton.onclick = actions.down;
          buttons.append(downButton);

          const skipButton = document.createElement('button');
          skipButton.classList.add('skipButton', 'actionIcon', 'far', 'fa-times-circle');
          skipButton.onclick = actions.skip;
          buttons.append(skipButton);

          const removeButton = document.createElement('button');
          removeButton.classList.add('removeButton', 'actionIcon', 'fas', 'fa-times');
          removeButton.onclick = actions.remove;
          buttons.append(removeButton);

          container.append(buttons);

          const koviko = document.createElement('ul');
          koviko.classList.add('koviko');
          container.append(koviko);

          return container;
        });
      })
      .property('data-index', (_a, i) => i)
      .call((container) => {
        for (const { index } of towns) {
          container.classed(`zone-${index + 1}`, (a) => a.action.townNum === index);
        }
        for (const type of actionTypes) {
          container.classed(`action-type-${type}`, (a) => a.action.type === type);
        }
      })
      .classed('action-has-limit', (a) => hasLimit(a.name))
      .classed('action-is-training', (a) => isTraining(a.name))
      .classed('action-is-singular', (a) => a.action.allowed?.() === 1)
      .classed('action-is-travel', (a) => getPossibleTravel(a.name).length > 0)
      .classed('action-disabled', (a) => !actions.isValidAndEnabled(a))
      .classed('user-disabled', (a) => !!a.disabled)
      .classed('user-collapsed', (a) => !!a.collapsed)
      .classed('zone-collapsed', (a) => actions.zoneSpanAtIndex(a.index).isCollapsed)
      .classed('action-is-collapsing-zone', (a) => {
        const zoneSpan = actions.zoneSpanAtIndex(a.index);
        return zoneSpan.end === a.index && zoneSpan.isCollapsed;
      })
      .style('background', ({ action }) => {
        const { townNum } = action;
        const travelNums = getPossibleTravel(action.name);
        let color = this.zoneTints[townNum];
        if (travelNums.length === 1) {
          color = `linear-gradient(${color} 49%, ${this.zoneTints[townNum + travelNums[0]]} 51%)`;
        } else if (travelNums.length > 1) {
          color = `conic-gradient(${color} 100grad, ${
            travelNums.map((travelNum, i) =>
              `${this.zoneTints[townNum + travelNum]} ${i * 200 / travelNums.length + 100}grad ${
                (i + 1) * 200 / travelNums.length + 100
              }grad`
            ).join(', ')
          }, ${color} 300grad)`;
        }
        return color;
      })
      .call((container) =>
        container
          .select('div.nextActionLoops > img')
          .property('src', (a) => `icons/${a.action.imageName}.svg`)
      )
      .call((container) =>
        container
          .select('div.nextActionLoops > div.bold')
          .text((action) => action.loops > 99999 ? toSuffix(action.loops) : formatNumber(action.loops))
      );

    if (vals.options.predictor) {
      Koviko.postUpdateHandler(actions.next, nextActionsDiv);
    }
    // scrolling down to see the new thing added is okay, scrolling up when you click an action button is not
    nextActionsDiv.scrollTop = Math.max(nextActionsDiv.scrollTop, scrollTop);
  }

  updateCurrentActionsDivs() {
    let totalDivText = '';

    // definite leak - need to remove listeners and images
    for (let i = 0; i < actions.current.length; i++) {
      const action = actions.current[i];
      const actionLoops = action.loops > 99999 ? toSuffix(action.loops) : formatNumber(action.loops);
      const actionLoopsDone = (action.loops - action.loopsLeft) > 99999
        ? toSuffix(action.loops - action.loopsLeft)
        : formatNumber(action.loops - action.loopsLeft);
      const imageName = action.name.startsWith('Assassin') ? 'assassin' : camelize(action.name);
      totalDivText += `<div id='action${i}Container' class='curActionContainer small'>
                    <div class='curActionBar' id='action${i}Bar'></div>
                    <div class='actionSelectedIndicator' id='action${i}Selected'></div>
                    <img src='icons/${imageName}.svg' class='smallIcon'>
                    <div id='action${i}LoopsDone' style='margin-left:3px; border-left: 1px solid var(--action-separator-border);padding-left: 3px;'>${actionLoopsDone}</div>
                    /<div id='action${i}Loops'>${actionLoops}</div>
                </div>`;
    }

    curActionsDiv.innerHTML = totalDivText;

    totalDivText = '';

    for (let i = 0; i < actions.current.length; i++) {
      const action = actions.current[i];
      totalDivText += `<div id='actionTooltip${i}' style='display:none;padding-left:10px;width:90%'>` +
        `<div style='text-align:center;width:100%'>${action.label}</div>` +
        `<b>${Localization.txt('actions>current_action>mana_original')}</b> <div id='action${i}ManaOrig'></div>` +
        `<b>${Localization.txt('actions>current_action>mana_used')}</b> <div id='action${i}ManaUsed'></div>` +
        `<b>${Localization.txt('actions>current_action>last_mana')}</b> <div id='action${i}LastMana'></div>` +
        `<b>${Localization.txt('actions>current_action>mana_remaining')}</b> <div id='action${i}Remaining'></div>` +
        `<b>${Localization.txt('actions>current_action>gold_remaining')}</b> <div id='action${i}GoldRemaining'></div>` +
        `<b>${Localization.txt('actions>current_action>time_spent')}</b> <div id='action${i}TimeSpent'></div>` +
        `<b>${
          Localization.txt('actions>current_action>total_time_elapsed')
        }</b> <div id='action${i}TotalTimeElapsed'></div>` +
        `` +
        `<div id='action${i}ExpGain'></div>` +
        `<div id='action${i}HasFailed' style='display:none'>` +
        `<b>${Localization.txt('actions>current_action>failed_attempts')}</b> <div id='action${i}Failed'></div>` +
        `<b>${Localization.txt('actions>current_action>error')}</b> <div id='action${i}Error'></div>` +
        `</div>` +
        `</div>`;
    }

    this.mouseoverAction(0, false);
  }

  updateCurrentActionBar(index) {
    const div = document.getElementById(`action${index}Bar`);
    if (!div) {
      return;
    }
    const action = actions.current[index];
    if (!action) {
      return;
    }
    if (action.errorMessage) {
      document.getElementById(`action${index}Failed`).textContent = `${action.loopsLeft}`;
      document.getElementById(`action${index}Error`).textContent = action.errorMessage;
      document.getElementById(`action${index}HasFailed`).style.display = '';
      div.style.width = '100%';
      div.style.backgroundColor = 'var(--cur-action-error-indicator)';
      div.style.height = '30%';
      div.style.marginTop = '5px';
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
    } else if (action.loopsLeft === 0) {
      div.style.width = '100%';
      div.style.backgroundColor = 'var(--cur-action-completed-background)';
    } else {
      div.style.width = `${100 * action.ticks / action.adjustedTicks}%`;
    }

    // only update tooltip if it's open
    if (curActionShowing === index) {
      document.getElementById(`action${index}ManaOrig`).textContent = intToString(
        action.manaCost() * action.loops,
        vals.options.fractionalMana ? 3 : 1,
      );
      document.getElementById(`action${index}ManaUsed`).textContent = intToString(
        action.manaUsed,
        vals.options.fractionalMana ? 3 : 1,
      );
      document.getElementById(`action${index}LastMana`).textContent = intToString(
        action.lastMana,
        3,
      );
      document.getElementById(`action${index}Remaining`).textContent = intToString(
        action.manaRemaining,
        vals.options.fractionalMana ? 3 : 1,
      );
      document.getElementById(`action${index}GoldRemaining`).textContent = formatNumber(
        action.goldRemaining,
      );
      document.getElementById(`action${index}TimeSpent`).textContent = formatTime(action.timeSpent);
      document.getElementById(`action${index}TotalTimeElapsed`).textContent = formatTime(action.effectiveTimeElapsed);

      let statExpGain = '';
      const expGainDiv = document.getElementById(`action${index}ExpGain`);
      while (expGainDiv.firstChild) {
        expGainDiv.removeChild(expGainDiv.firstChild);
      }
      for (const stat of statList) {
        if (action[`statExp${stat}`]) {
          statExpGain += `<div class='bold'>${Localization.txt(`stats>${stat}>short_form`)}:</div> ${
            intToString(action[`statExp${stat}`], 2)
          }`;
        }
      }
      expGainDiv.innerHTML = statExpGain;
    }
  }

  recordScrollPosition() {
    const { scrollTop, scrollHeight, clientHeight } = this;
    this.lastScroll = { scrollTop, scrollHeight, clientHeight };
  }

  mouseoverAction(index, isShowing) {
  }

  updateCurrentActionLoops(index) {
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

  updateLockedHidden() {
    for (const action of vals.totalActionList) {
      const actionDiv = document.getElementById(`container${action.varName}`);
      const infoDiv = document.getElementById(`infoContainer${action.varName}`);
      const storyDiv = document.getElementById(`storyContainer${action.varName}`);

      if (action.allowed && getNumOnList(action.name) >= action.allowed()) {
        // actionDiv.classList.add('capped');
      } else if (action.unlocked()) {
        if (infoDiv) {
          infoDiv.classList.remove('hidden');

          if (action.varName.startsWith('Survey')) {
            document.getElementById(`infoContainer${action.varName}Global`).classList.remove('hidden');
          }
        }
        // actionDiv.classList.remove('locked');
        // actionDiv.classList.remove('capped');
      } else {
        // actionDiv.classList.add('locked');
        if (infoDiv) {
          infoDiv.classList.add('hidden');

          if (action.varName.startsWith('Survey')) {
            document.getElementById(`infoContainer${action.varName}Global`).classList.add('hidden');
          }
        }
      }
      if (action.unlocked() && infoDiv) {
        infoDiv.classList.remove('hidden');
      }
      if (action.visible()) {
        // actionDiv.classList.remove('hidden');
        if (storyDiv !== null) storyDiv.classList.remove('hidden');
      } else {
        // actionDiv.classList.add('hidden');
        if (storyDiv !== null) storyDiv.classList.add('hidden');
      }
      if (storyDiv !== null) {
        if (action.unlocked()) {
          storyDiv.classList.remove('hidden');
        } else {
          storyDiv.classList.add('hidden');
        }
      }
    }
    if (
      vals.totalActionList.filter((action) => action.finish.toString().includes('handleSkillExp'))
        .filter((action) => action.unlocked()).length > 0
    ) {
    } else {
    }
    if (
      vals.totalActionList.filter((action) => action.finish.toString().includes('updateBuff')).filter(
          (action) => action.unlocked(),
        ).length > 0 ||
      prestigeValues['completedAnyPrestige']
    ) {
    } else {
    }
  }

  updateGlobalStory(num) {
    actionLog.addGlobalStory(num);
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

  updateAddAmount(amount) {
    for (const elem of document.getElementsByClassName('change-amount')) {
      elem.classList.toggle('unused', elem.textContent !== String(amount));
    }
  }

  updateLoadout(num) {
    for (let i = 0; i < 16; i++) {
      const elem = document.getElementById(`load${i}`);
      if (elem) {
        elem.classList.add('unused');
      }
    }
    const elem = document.getElementById(`load${num}`);
    if (elem) {
      elem.classList.remove('unused');
    }
  }

  updateLoadoutNames() {
    for (let i = 0; i < vals.loadoutnames.length; i++) {
      document.getElementById(`load${i + 1}`).textContent = vals.loadoutnames[i];
    }
    document.getElementById('renameLoadout').value = vals.loadoutnames[vals.curLoadout - 1];
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

  createTownInfo(action) {
  }

  createMultiPartPBar(action) {
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
    // update previous segments
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

    // update current segments
    if (document.getElementById(`progress${segment}${action.varName}`)) {
      document.getElementById(`expBar${segment}${action.varName}`).style.width = `${
        100 - 100 * curProgress / loopCost
      }%`;
      document.getElementById(`progress${segment}${action.varName}`).textContent = intToStringRound(
        curProgress,
      );
      document.getElementById(`progressNeeded${segment}${action.varName}`).textContent = intToStringRound(loopCost);
    }

    // update later segments
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
      document.getElementById(`mainStat${i}${action.varName}`).textContent = Localization.txt(
        `stats>${mainStat}>short_form`,
      );
      addStatColors(expBar, mainStat, true);
      document.getElementById(`segmentName${i}${action.varName}`).textContent = action.getSegmentName(
        town[`${action.varName}LoopCounter`] + i,
      );
    }
  }

  highlightIncompleteActions() {
    let actionDivs = Array.from(document.getElementsByClassName('actionContainer'));
    actionDivs.forEach((div) => {
      let actionName = div.id.replace('container', '');
      if (!vals.completedActions.includes(actionName)) {
        div.classList.add('actionHighlight');
      }
    });
  }

  removeAllHighlights() {
    let actionDivs = Array.from(document.getElementsByClassName('actionHighlight'));
    actionDivs.forEach((div) => {
      div.classList.remove('actionHighlight');
    });
  }
}

export function unlockGlobalStory(num) {
  if (num > vals.storyMax) {
    document.getElementById('newStory').style.display = 'inline-block';
    vals.storyMax = num;
    view.requestUpdate('updateGlobalStory', num);
  }
}

export function setStoryFlag(name) {
  if (!storyFlags[name]) {
    storyFlags[name] = true;
    if (vals.options.actionLog) view.requestUpdate('updateStories', false);
  }
}

export function increaseStoryVarTo(name, value) {
  if (storyVars[name] < value) {
    storyVars[name] = value;
    if (vals.options.actionLog) view.requestUpdate('updateStories', false);
  }
}

export function scrollToPanel(event, target) {
  event.preventDefault();
  const element = document.getElementById(target);
  const main = document.getElementById('main');

  if (element instanceof HTMLElement && main) {
    main.scroll({
      behavior: 'smooth',
      left: element.offsetLeft,
    });
  }

  return false;
}

export function addStatColors(theDiv, stat, forceColors = false) {
  for (const className of Array.from(theDiv.classList)) {
    if (className.startsWith('stat-') && className.slice(5) in stats) {
      theDiv.classList.remove(className);
    }
  }
  theDiv.classList.add(`stat-${stat}`, 'stat-background');
  if (forceColors) {
    theDiv.classList.add('use-stat-colors');
  }
}

export function dragOverDecorate(i) {
  if (document.getElementById(`nextActionContainer${i}`)) {
    document.getElementById(`nextActionContainer${i}`).classList.add('draggedOverAction');
  }
}

export function dragExitUndecorate(i) {
  if (document.getElementById(`nextActionContainer${i}`)) {
    document.getElementById(`nextActionContainer${i}`).classList.remove('draggedOverAction');
  }
}

export function draggedDecorate(i) {
  if (document.getElementById(`nextActionContainer${i}`)) {
    document.getElementById(`nextActionContainer${i}`).classList.add('draggedAction');
  }
}

export function draggedUndecorate(i) {
  if (document.getElementById(`nextActionContainer${i}`)) {
    document.getElementById(`nextActionContainer${i}`).classList.remove('draggedAction');
  }
  showActionIcons();
}

export const view = new View();
