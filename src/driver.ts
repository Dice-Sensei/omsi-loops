import { Data } from './data.ts';
import { KeyboardKey } from './keyboard.hotkeys.ts';
import { Localization } from './Localization.ts';
import { beep, clamp, copyArray, inputElement, Mana } from './helpers.ts';
import { actions, actionStory, getNumOnList, markActionsComplete } from './actions.ts';
import { resources, resourcesTemplate, towns } from './globals.ts';

let curTime = Date.now();
let gameTicksLeft = 0; // actually milliseconds, not ticks
let refund = false;
let radarUpdateTime = 0;
let lastSave = Date.now();

export function getSpeedMult(zone = globalThis.saving.vals.curTown) {
  let speedMult = 1;

  // Dark Ritual
  if (zone === 0) speedMult *= globalThis.stats.getRitualBonus(0, 20, 10);
  else if (zone === 1) speedMult *= globalThis.stats.getRitualBonus(20, 40, 5);
  else if (zone === 2) speedMult *= globalThis.stats.getRitualBonus(40, 60, 2.5);
  else if (zone === 3) speedMult *= globalThis.stats.getRitualBonus(60, 80, 1.5);
  else if (zone === 4) speedMult *= globalThis.stats.getRitualBonus(80, 100, 1);
  else if (zone === 5) speedMult *= globalThis.stats.getRitualBonus(100, 150, .5);
  else if (zone === 6) speedMult *= globalThis.stats.getRitualBonus(150, 200, .5);
  else if (zone === 7) speedMult *= globalThis.stats.getRitualBonus(200, 250, .5);
  else if (zone === 8) speedMult *= globalThis.stats.getRitualBonus(250, 300, .5);
  speedMult *= globalThis.stats.getRitualBonus(300, 666, .1);

  // Chronomancy
  speedMult *= globalThis.stats.getSkillBonus('Chronomancy');

  // Imbue Soul
  speedMult *= 1 + 0.5 * globalThis.stats.getBuffLevel('Imbuement3');

  // Prestige Chronomancy
  speedMult *= globalThis.prestige.prestigeBonus('PrestigeChronomancy');

  return speedMult;
}

export function getActualGameSpeed() {
  return driverVals.gameSpeed * getSpeedMult() * bonusSpeed;
}

export function refreshDungeons(manaSpent) {
  for (const dungeon of globalThis.saving.vals.dungeons) {
    for (const level of dungeon) {
      const chance = level.ssChance;
      if (chance < 1) level.ssChance = Math.min(chance + 0.0000001 * manaSpent, 1);
    }
  }
}

export function singleTick() {
  globalThis.saving.timer++;
  driverVals.timeCounter += 1 / driverVals.baseManaPerSecond;
  driverVals.effectiveTime += 1 / driverVals.baseManaPerSecond;

  globalThis.saving.actions.tick();

  refreshDungeons(1);

  if (globalThis.saving.vals.shouldRestart || globalThis.saving.timer >= globalThis.saving.timeNeeded) {
    loopEnd();
    prepareRestart();
  }
  gameTicksLeft -= 1000 / driverVals.baseManaPerSecond;
}

let lastAnimationTime = 0;
let animationFrameRequest = 0;
let animationTicksEnabled = true;

export function animationTick(animationTime) {
  if (animationTime == lastAnimationTime || !animationTicksEnabled) {
    // double tick in the same frame, drop this one
    return;
  }
  try {
    tick();
  } finally {
    animationFrameRequest = requestAnimationFrame(animationTick);
  }
}

export function tick() {
  const newTime = Date.now();
  gameTicksLeft += newTime - curTime;
  if (inputElement('radarStats').checked) radarUpdateTime += newTime - curTime;
  const delta = newTime - curTime;
  curTime = newTime;

  // save even when paused
  if (curTime - lastSave > globalThis.saving.vals.options.autosaveRate * 1000) {
    lastSave = curTime;
    globalThis.saving.save();
  }

  // don't do any updates until we've got enough time built up to match the refresh rate setting
  if (gameTicksLeft < 1000 / windowFps) {
    return;
  }

  if (gameIsStopped) {
    addOffline(gameTicksLeft);
    updateLag(0);
    globalThis.saving.view.update();
    gameTicksLeft = 0;
    return;
  }

  const deadline = performance.now() + 1000 / windowFps; // don't go past the current frame update time

  executeGameTicks(deadline);
}

export function executeGameTicks(deadline) {
  // convert "gameTicksLeft" (actually milliseconds) into equivalent base-mana count, aka actual game ticks
  // including the gameSpeed multiplier here because it is effectively constant over the course of a single
  // update, and it affects how many actual game ticks pass in a given span of realtime.
  let baseManaToBurn = Mana.floor(
    gameTicksLeft * driverVals.baseManaPerSecond * driverVals.gameSpeed / 1000,
  );
  const originalManaToBurn = baseManaToBurn;
  let cleanExit = false;

  while (
    baseManaToBurn * bonusSpeed >= (globalThis.saving.vals.options.fractionalMana ? 0.01 : 1) &&
    performance.now() < deadline
  ) {
    if (gameIsStopped) {
      cleanExit = true;
      break;
    }
    // first, figure out how much *actual* mana is available to get spent. bonusSpeed gets rolled in first,
    // since it can change over the course of an update (if offline time runs out)
    let manaAvailable = baseManaToBurn;
    // totalMultiplier lets us back-convert from manaAvailable (in units of "effective game ticks") to
    // baseManaToBurn (in units of "realtime ticks modulated by gameSpeed") once we figure out how much
    // of our mana we're using in this cycle
    let totalMultiplier = 1;

    manaAvailable *= bonusSpeed;
    totalMultiplier *= bonusSpeed;

    if (bonusSpeed > 1) {
      // can't spend more mana than offline time available
      manaAvailable = Math.min(
        manaAvailable,
        Mana.ceil(
          globalThis.saving.vals.totalOfflineMs * driverVals.baseManaPerSecond * driverVals.gameSpeed *
            bonusSpeed / 1000,
        ),
      );
    }

    // next, roll in the multiplier from skills/etc
    let speedMult = getSpeedMult();
    manaAvailable *= speedMult;
    totalMultiplier *= speedMult;

    // limit to only how much time we have available
    manaAvailable = Math.min(manaAvailable, globalThis.saving.timeNeeded - globalThis.saving.timer);

    // don't run more than 1 tick
    if (globalThis.saving.vals.shouldRestart) {
      manaAvailable = Math.min(manaAvailable, 1);
    }

    // a single action may not use a partial tick, so ceil() to be sure unless fractionalMana.
    // Even with fractionalMana, we need to set a minimum so that mana usages aren't lost to floating-point precision.
    const manaSpent = Mana.ceil(
      globalThis.saving.actions.tick(manaAvailable),
      globalThis.saving.timer / 1e15,
    );

    // okay, so the current action has used manaSpent effective ticks. figure out how much of our realtime
    // that accounts for, in base ticks and in seconds.
    const baseManaSpent = manaSpent / totalMultiplier;
    const timeSpent = baseManaSpent / driverVals.gameSpeed / driverVals.baseManaPerSecond;

    // update timers
    globalThis.saving.timer += manaSpent; // number of effective mana ticks
    driverVals.timeCounter += timeSpent; // realtime seconds
    driverVals.effectiveTime += timeSpent * driverVals.gameSpeed * bonusSpeed; // "seconds" modified only by gameSpeed and offline bonus
    baseManaToBurn -= baseManaSpent; // burn spent mana
    gameTicksLeft -= timeSpent * 1000;

    // spend bonus time for this segment
    if (bonusSpeed !== 1) {
      addOffline(-timeSpent * (bonusSpeed - 1) * 1000);
    }

    refreshDungeons(manaSpent);

    if (globalThis.saving.vals.shouldRestart || globalThis.saving.timer >= globalThis.saving.timeNeeded) {
      cleanExit = true;
      loopEnd();
      prepareRestart();
      break; // don't span loops within tick()
    }
  }

  if (radarUpdateTime > 100) {
    globalThis.saving.view.updateStatGraphNeeded = true;
    radarUpdateTime %= 100;
  }

  if (!gameIsStopped && baseManaToBurn * bonusSpeed >= 10) {
    if (!cleanExit || driverVals.lagSpeed > 0) {
      // lagging. refund all backlog as bonus time to clear the queue
      addOffline(gameTicksLeft);
      gameTicksLeft = 0;
    }
    updateLag((originalManaToBurn - baseManaToBurn) * bonusSpeed);
  } else if (baseManaToBurn * bonusSpeed < 1) {
    // lag cleared
    updateLag(0);
  }

  globalThis.saving.view.update();
}
let windowFps = 50;
let mainTickLoop;
export function recalcInterval(fps) {
  windowFps = fps;
  if (mainTickLoop !== undefined) {
    clearInterval(mainTickLoop);
  }
  if (globalThis.requestAnimationFrame) {
    animationFrameRequest = requestAnimationFrame(animationTick);
    mainTickLoop = setInterval(tick, 1000);
  } else {
    mainTickLoop = setInterval(tick, 1000 / fps);
  }
}

let gameIsStopped = false;
export function stopGame() {
  gameIsStopped = true;
  globalThis.saving.view.requestUpdate('updateTime', null);
  globalThis.saving.view.requestUpdate('updateCurrentActionBar', actions.currentPos);
  globalThis.saving.view.update();
  document.title = '*PAUSED* Idle Loops';
  document.getElementById('pausePlay').textContent = Localization.txt('time_controls>play_button');
  if (globalThis.saving.needsDataSnapshots()) {
    Data.updateSnapshot('stop', 'base');
  }
  if (globalThis.saving.vals.options.predictor) {
    globalThis.saving.view.requestUpdate('updateNextActions');
  }
}

export function pauseGame(ping, message) {
  gameIsStopped = !gameIsStopped;
  if (globalThis.saving.needsDataSnapshots()) {
    Data.discardToSnapshot('base', 1);
    Data.recordSnapshot('pause');
  }
  globalThis.saving.view.requestUpdate('updateTime', null);
  globalThis.saving.view.requestUpdate('updateCurrentActionBar', actions.currentPos);
  globalThis.saving.view.update();
  if (!gameIsStopped && globalThis.saving.vals.options.notifyOnPause) {
    globalThis.saving.clearPauseNotification();
  }
  document.title = gameIsStopped ? '*PAUSED* Idle Loops' : 'Idle Loops';
  document.getElementById('pausePlay').textContent = Localization.txt(
    `time_controls>${gameIsStopped ? 'play_button' : 'pause_button'}`,
  );
  if (
    !gameIsStopped && (globalThis.saving.vals.shouldRestart || globalThis.saving.timer >= globalThis.saving.timeNeeded)
  ) {
    restart();
  } else if (ping) {
    if (globalThis.saving.vals.options.pingOnPause) {
      beep(250);
      setTimeout(() => beep(250), 500);
    }
    if (globalThis.saving.vals.options.notifyOnPause) {
      globalThis.saving.showPauseNotification(message || 'Game paused!');
    }
  }
}

export function loopEnd() {
  if (driverVals.effectiveTime > 0) {
    globalThis.saving.vals.totals.time += driverVals.timeCounter;
    globalThis.saving.vals.totals.effectiveTime += driverVals.effectiveTime;
    globalThis.saving.vals.totals.loops++;
    globalThis.saving.view.requestUpdate('updateTotals', null);
    const loopCompletedActions = actions.current.slice(0, actions.currentPos);
    if (
      actions.current[actions.currentPos] !== undefined &&
      actions.current[actions.currentPos].loopsLeft <
        actions.current[actions.currentPos].loops
    ) {
      loopCompletedActions.push(actions.current[actions.currentPos]);
    }
    markActionsComplete(loopCompletedActions);
    actionStory(loopCompletedActions);
    if (globalThis.saving.vals.options.highlightNew) {
      globalThis.saving.view.requestUpdate('removeAllHighlights', null);
      globalThis.saving.view.requestUpdate('highlightIncompleteActions', null);
    }
  }
}

export function prepareRestart() {
  const curAction = actions.getNextValidAction();
  if (
    globalThis.saving.vals.options.pauseBeforeRestart ||
    (globalThis.saving.vals.options.pauseOnFailedLoop &&
      (actions.current.filter((action) => action.loopsLeft - action.extraLoops > 0).length > 0))
  ) {
    if (globalThis.saving.vals.options.pingOnPause) {
      beep(250);
      setTimeout(() => beep(250), 500);
    }
    if (globalThis.saving.vals.options.notifyOnPause) {
      globalThis.saving.showPauseNotification('Game paused!');
    }
    if (curAction) {
      actions.completedTicks += actions.getNextValidAction().ticks;
      globalThis.saving.view.requestUpdate('updateTotalTicks', null);
    }
    for (let i = 0; i < actions.current.length; i++) {
      globalThis.saving.view.requestUpdate('updateCurrentActionBar', i);
    }
    stopGame();
  } else {
    restart();
  }
}

export function restart() {
  globalThis.saving.vals.shouldRestart = false;
  globalThis.saving.timer = 0;
  driverVals.timeCounter = 0;
  driverVals.effectiveTime = 0;
  globalThis.saving.timeNeeded = globalThis.saving.timeNeededInitial;
  document.title = 'Idle Loops';
  globalThis.saving.vals.currentLoop = globalThis.saving.vals.totals.loops + 1; // don't let currentLoop get out of sync with totals.loops, that'd cause problems
  resetResources();
  globalThis.stats.restartStats();
  for (let i = 0; i < towns.length; i++) {
    towns[i].restart();
  }
  globalThis.saving.view.requestUpdate('updateSkills');
  actions.restart();
  globalThis.saving.view.requestUpdate('updateCurrentActionsDivs');
  globalThis.saving.view.requestUpdate('updateTrials', null);
  if (globalThis.saving.needsDataSnapshots()) {
    Data.updateSnapshot('restart', 'base');
  }
}

export function manualRestart() {
  loopEnd();
  restart();
  globalThis.saving.view.update();
}

export function addActionToList(name, townNum, isTravelAction, insertAtIndex) {
  for (const action of towns[townNum].totalActionList) {
    if (action.name === name) {
      if (
        action.visible() && action.unlocked() &&
        (!action.allowed || getNumOnList(action.name) < action.allowed())
      ) {
        let addAmount = actions.addAmount;
        if (action.allowed) {
          const numMax = action.allowed();
          const numHave = getNumOnList(action.name);
          if (numMax - numHave < addAmount) {
            addAmount = numMax - numHave;
          }
        }
        if (isTravelAction) {
          const index = actions.addAction(name, 1, insertAtIndex);
          globalThis.saving.view.requestUpdate('highlightAction', index);
        } else {
          const index = actions.addAction(name, addAmount, insertAtIndex);
          globalThis.saving.view.requestUpdate('highlightAction', index);
          if (KeyboardKey.shift && globalThis.actionList.hasLimit(name)) {
            capAmount(index, townNum);
          } else if (KeyboardKey.shift && globalThis.actionList.isTraining(name)) {
            capTraining(index);
          }
        }
      }
    }
  }
  globalThis.saving.view.updateNextActions();
  globalThis.saving.view.updateLockedHidden();
}

// mana and resources

export function addMana(amount) {
  globalThis.saving.timeNeeded += amount;
}

export function addResource(resource, amount) {
  if (Number.isFinite(amount)) resources[resource] += amount;
  else resources[resource] = amount;
  globalThis.saving.view.requestUpdate('updateResource', resource);

  if (resource === 'teamMembers' || resource === 'armor' || resource === 'zombie') {
    globalThis.saving.view.requestUpdate('updateTeamCombat', null);
  }
}

export function resetResource(resource) {
  resources[resource] = resourcesTemplate[resource];
  globalThis.saving.view.requestUpdate('updateResource', resource);
}

export function resetResources() {
  Object.assign(resources, resourcesTemplate);

  if (globalThis.actionList.getExploreProgress() >= 100 || globalThis.prestige.prestigeValues['completedAnyPrestige']) {
    addResource('glasses', true);
  }
  globalThis.saving.view.requestUpdate('updateResources', null);
}

export function changeActionAmount(amount) {
  amount = Math.max(amount, 1);
  amount = Math.min(amount, 1e12);
  actions.addAmount = amount;
  const customInput = inputElement('amountCustom');
  if (document.activeElement !== customInput) {
    customInput.value = amount;
  }
  globalThis.saving.view.updateAddAmount(amount);
}

export function setCustomActionAmount() {
  const value = parseInt(inputElement('amountCustom').value) || 1;
  changeActionAmount(value);
}

export function selectLoadout(num) {
  if (globalThis.saving.vals.curLoadout === num) {
    globalThis.saving.vals.curLoadout = 0;
  } else {
    globalThis.saving.vals.curLoadout = num;
  }
  inputElement('renameLoadout').value = globalThis.saving.vals.loadoutnames[globalThis.saving.vals.curLoadout - 1];
  globalThis.saving.view.updateLoadout(globalThis.saving.vals.curLoadout);
}

export function loadLoadout(num) {
  globalThis.saving.vals.curLoadout = num;
  globalThis.saving.view.updateLoadout(globalThis.saving.vals.curLoadout);
  loadList();
}

let globalCustomInput = '';
export function saveList() {
  if (globalThis.saving.vals.curLoadout === 0) {
    globalThis.saving.save();
    return;
  }
  nameList(false);
  globalThis.saving.vals.loadouts[globalThis.saving.vals.curLoadout] = copyArray(actions.next);
  globalThis.saving.save();
  if ((inputElement('renameLoadout').value !== 'Saved!')) {
    globalCustomInput = inputElement('renameLoadout').value;
  }
  inputElement('renameLoadout').value = 'Saved!';
  setTimeout(() => {
    inputElement('renameLoadout').value = globalCustomInput;
  }, 1000);
}

export function nameList(saveGame) {
  // if the loadout has already been saved under a non-numeric name
  // and the user tries to save under a numeric name, the loadout will
  // be saved under an old name
  // if both the old AND the new names are numeric, then we insist on a non-numeric name
  if (isNaN(parseFloat(inputElement('renameLoadout').value))) {
    if (inputElement('renameLoadout').value.length > 30) {
      inputElement('renameLoadout').value = '30 Letter Max';
    } else if (inputElement('renameLoadout').value !== 'Saved!') {
      globalThis.saving.vals.loadoutnames[globalThis.saving.vals.curLoadout - 1] = inputElement('renameLoadout').value;
    }
  } else if (!isNaN(parseFloat(globalThis.saving.vals.loadoutnames[globalThis.saving.vals.curLoadout - 1]))) {
    inputElement('renameLoadout').value = 'Enter a name!';
  }
  document.getElementById(`load${globalThis.saving.vals.curLoadout}`).textContent =
    globalThis.saving.vals.loadoutnames[globalThis.saving.vals.curLoadout - 1];
  if (saveGame) globalThis.saving.save();
}

export function loadList() {
  if (globalThis.saving.vals.curLoadout === 0) {
    return;
  }
  inputElement('amountCustom').value = actions.addAmount.toString();
  actions.clearActions();
  if (globalThis.saving.vals.loadouts[globalThis.saving.vals.curLoadout]) {
    actions.appendActionRecords(globalThis.saving.vals.loadouts[globalThis.saving.vals.curLoadout]);
  }
  globalThis.saving.view.updateNextActions();
  globalThis.saving.view.adjustDarkRitualText();
}
export function clearList() {
  actions.clearActions(KeyboardKey.shiftDown ? ((a) => (a.disabled || a.loops === 0)) : null);
  globalThis.saving.view.updateNextActions();
}
export function unlockTown(townNum) {
  if (!towns[townNum].unlocked()) {
    globalThis.saving.vals.townsUnlocked.push(townNum);
    globalThis.saving.vals.townsUnlocked.sort();
    // refresh current
    globalThis.saving.view.showTown(townNum);
    globalThis.saving.view.requestUpdate('updateTravelMenu', null);
  }
  let cNum = globalThis.saving.vals.challengeSave.challengeMode;
  if (cNum !== 0) {
    if (globalThis.saving.vals.challengeSave['c' + cNum] < townNum) {
      globalThis.saving.vals.challengeSave['c' + cNum] = townNum;
    } else if (globalThis.saving.vals.challengeSave['c' + cNum] === undefined) {
      globalThis.saving.vals.challengeSave['c' + cNum] = townNum;
    }
  }
  globalThis.saving.vals.curTown = townNum;
}
export function adjustAll() {
  globalThis.actionList.adjustPots();
  globalThis.actionList.adjustLocks();
  globalThis.actionList.adjustSQuests();
  globalThis.actionList.adjustLQuests();
  globalThis.actionList.adjustWildMana();
  globalThis.actionList.adjustHerbs();
  globalThis.actionList.adjustHunt();
  globalThis.actionList.adjustSuckers();
  globalThis.actionList.adjustGeysers();
  globalThis.actionList.adjustMineSoulstones();
  globalThis.actionList.adjustArtifacts();
  globalThis.actionList.adjustDonations();
  globalThis.actionList.adjustWells();
  globalThis.actionList.adjustPylons();
  globalThis.actionList.adjustPockets();
  globalThis.actionList.adjustWarehouses();
  globalThis.actionList.adjustInsurance();
  globalThis.actionList.adjustAllRocks();
  globalThis.actionList.adjustTrainingExpMult();
  globalThis.saving.view.requestUpdate('adjustManaCost', 'Continue On');
}
export function capAction(actionId) {
  const action = actions.findActionWithId(actionId);
  if (!action) return;
  if (globalThis.actionList.hasLimit(action.name)) {
    return capAmount(action.index, globalThis.actionList.getActionPrototype(action.name).townNum);
  } else if (globalThis.actionList.isTraining(action.name)) {
    return capTraining(action.index);
  }
}
export function capAmount(index, townNum) {
  const action = actions.next[index];
  const varName = `good${globalThis.actionList.getActionPrototype(action.name)?.varName}`;
  let alreadyExisting;
  alreadyExisting = getNumOnList(action.name) +
    (action.disabled ? action.loops : 0);
  let newLoops;
  if (action.name.startsWith('Survey')) newLoops = 500 - alreadyExisting;
  if (action.name === 'Gather Team') {
    newLoops = 5 + Math.floor(globalThis.stats.getSkillLevel('Leadership') / 100) - alreadyExisting;
  } else newLoops = towns[townNum][varName] - alreadyExisting;
  actions.updateAction(index, { loops: clamp(action.loops + newLoops, 0, null) });
  globalThis.saving.view.updateNextActions();
  globalThis.saving.view.updateLockedHidden();
}
export function capTraining(index) {
  const action = actions.next[index];
  const alreadyExisting = getNumOnList(action.name) + (action.disabled ? action.loops : 0);
  const newLoops = globalThis.saving.vals.trainingLimits - alreadyExisting;
  actions.updateAction(index, { loops: clamp(action.loops + newLoops, 0, null) });
  globalThis.saving.view.updateNextActions();
  globalThis.saving.view.updateLockedHidden();
}
export function capAllTraining() {
  for (const [index, action] of actions.next.entries()) {
    // @ts-ignore
    if (globalThis.actionList.trainingActions.includes(action.name)) {
      //console.log("Training Action on list: " + action.name);
      capTraining(index);
    }
  }
}
export function addLoop(actionId) {
  const action = actions.findActionWithId(actionId);
  const theClass = globalThis.actionList.getActionPrototype(action.name);
  let addAmount = actions.addAmount;
  if (theClass.allowed) {
    const numMax = theClass.allowed();
    const numHave = getNumOnList(theClass.name) + (action.disabled ? action.loops : 0);
    if ((numMax - numHave) < addAmount) {
      addAmount = numMax - numHave;
    }
  }
  actions.updateAction(action.index, {
    loops: clamp(action.loops + addAmount, 0, 1e12),
  });
  globalThis.saving.view.updateNextActions();
  globalThis.saving.view.updateLockedHidden();
}
export function removeLoop(actionId) {
  const action = actions.findActionWithId(actionId);
  actions.updateAction(action.index, {
    loops: clamp(action.loops - actions.addAmount, 0, 1e12),
  });
  globalThis.saving.view.updateNextActions();
  globalThis.saving.view.updateLockedHidden();
}
export function split(actionId) {
  const action = actions.findActionWithId(actionId);
  actions.splitAction(action.index);
  globalThis.saving.view.updateNextActions();
}
export function collapse(actionId) {
  const action = actions.findActionWithId(actionId);
  actions.updateAction(action.index, { collapsed: !action.collapsed });
  globalThis.saving.view.updateNextActions();
}
export function showNotification(name) {
  document.getElementById(`${name}Notification`).style.display = 'block';
}
export function hideNotification(name) {
  globalThis.saving.vals.unreadActionStories = globalThis.saving.vals.unreadActionStories.filter((toRead) =>
    toRead !== name
  );
  document.getElementById(`${name}Notification`).style.display = 'none';
}
export function hideActionIcons() {
  document.getElementById('nextActionsList').className = 'disabled';
}
export function showActionIcons() {
  document.getElementById('nextActionsList').className = '';
}

export function handleDragStart(event) {
  const index = event.target.getAttribute('data-action-id');
  globalThis.view.draggedDecorate(index);
  event.dataTransfer.setData('text/html', index);
  hideActionIcons();
}

export function handleDirectActionDragStart(event, actionName, townNum, actionVarName, isTravelAction) {
  // @ts-ignore
  document.getElementById(`container${actionVarName}`).children[2].style.display = 'none';
  const actionData = { _actionName: actionName, _townNum: townNum, _isTravelAction: isTravelAction };
  const serialData = JSON.stringify(actionData);
  event.dataTransfer.setData('actionData', serialData);
  hideActionIcons();
}

export function handleDirectActionDragEnd(actionVarName) {
  // @ts-ignore
  document.getElementById(`container${actionVarName}`).children[2].style.display = '';
  showActionIcons();
}

export function handleDragOver(event) {
  event.preventDefault();
}

export function handleDragDrop(event) {
  const idOfDroppedOverElement = event.target.getAttribute('data-action-id');
  const indexOfDroppedOverElement = actions.findIndexOfActionWithId(idOfDroppedOverElement);
  globalThis.view.dragExitUndecorate(idOfDroppedOverElement);
  const initialId = event.dataTransfer.getData('text/html');
  if (initialId === '') {
    const actionData = JSON.parse(event.dataTransfer.getData('actionData'));
    addActionToList(actionData._actionName, actionData._townNum, actionData._isTravelAction, indexOfDroppedOverElement);
  } else {
    moveQueuedAction(actions.findIndexOfActionWithId(initialId), indexOfDroppedOverElement);
  }
  showActionIcons();
}

export function moveQueuedAction(initialIndex, resultingIndex) {
  if (
    initialIndex < 0 || initialIndex > actions.next.length || resultingIndex < 0 ||
    resultingIndex > actions.next.length - 1
  ) {
    return;
  }

  actions.moveAction(initialIndex, resultingIndex, true);

  globalThis.saving.view.updateNextActions();
}

export function moveUp(actionId) {
  const index = actions.findIndexOfActionWithId(actionId);
  if (index <= 0) {
    return;
  }
  actions.moveAction(index, index - 1);
  globalThis.saving.view.updateNextActions();
}
export function moveDown(actionId) {
  const index = actions.findIndexOfActionWithId(actionId);
  if (index >= actions.next.length - 1) {
    return;
  }
  actions.moveAction(index, index + 1);
  globalThis.saving.view.updateNextActions();
}
export function disableAction(actionId) {
  const index = actions.findIndexOfActionWithId(actionId);
  const action = actions.next[index];
  const translated = globalThis.actionList.getActionPrototype(action.name);
  if (action.disabled) {
    if (!translated.allowed || getNumOnList(action.name) + action.loops <= translated.allowed()) {
      actions.updateAction(index, { disabled: false });
    }
  } else {
    actions.updateAction(index, { disabled: true });
  }
  globalThis.saving.view.updateNextActions();
  globalThis.saving.view.requestUpdate('updateLockedHidden', null);
}
export function removeAction(actionId) {
  const index = actions.findIndexOfActionWithId(actionId);
  actions.removeAction(index);
  globalThis.saving.view.updateNextActions();
  globalThis.saving.view.requestUpdate('updateLockedHidden', null);
}

export function borrowTime() {
  addOffline(86400_000);
  globalThis.saving.vals.totals.borrowedTime += 86400;
  globalThis.saving.view.requestUpdate('updateOffline', null);
  globalThis.saving.view.requestUpdate('updateTotals', null);
}

export function returnTime() {
  if (globalThis.saving.vals.totalOfflineMs >= 86400_000) {
    addOffline(-86400_000);
    globalThis.saving.vals.totals.borrowedTime -= 86400;
    globalThis.saving.view.requestUpdate('updateOffline', null);
    globalThis.saving.view.requestUpdate('updateTotals', null);
  }
}

let lagStart = 0;
let lagSpent = 0;
export function updateLag(manaSpent) {
  if (manaSpent === 0) { // cancel lag display
    if (driverVals.lagSpeed !== 0) {
      driverVals.lagSpeed = 0;
      globalThis.saving.view.requestUpdate('updateBonusText', null);
    }
    return;
  }
  if (driverVals.lagSpeed === 0) {
    // initial lag.
    lagStart = performance.now();
    lagSpent = 0;
    driverVals.lagSpeed = 1;
    return;
  }
  // update lag
  lagSpent += manaSpent;
  const now = performance.now();
  const measuredSpeed = lagSpent / (now - lagStart) * 1000 / driverVals.baseManaPerSecond;
  driverVals.lagSpeed = measuredSpeed;
  globalThis.saving.view.requestUpdate('updateBonusText', null);
}

export function addOffline(num) {
  if (num) {
    if (globalThis.saving.vals.totalOfflineMs + num < 0 && bonusSpeed > 1) {
      toggleOffline();
    }
    globalThis.saving.vals.totalOfflineMs += num;
    if (globalThis.saving.vals.totalOfflineMs < 0) {
      globalThis.saving.vals.totalOfflineMs = 0;
    }
    globalThis.saving.view.requestUpdate('updateOffline', null);
  }
}

export function toggleOffline() {
  if (globalThis.saving.vals.totalOfflineMs === 0) return;
  if (!isBonusActive()) {
    bonusSpeed = 5;
    bonusActive = true;
    checkExtraSpeed();
    document.getElementById('isBonusOn').textContent = Localization.txt(
      'time_controls>bonus_seconds>state>on',
    );
  } else {
    bonusSpeed = 1;
    bonusActive = false;
    document.getElementById('isBonusOn').textContent = Localization.txt(
      'time_controls>bonus_seconds>state>off',
    );
  }
  globalThis.saving.setOption('bonusIsActive', bonusActive, true);
  globalThis.saving.view.requestUpdate('updateTime', null);
}

let bonusSpeed = 1;
let bonusActive = false;
export function isBonusActive() {
  return bonusActive && bonusSpeed !== 1;
}

export function checkExtraSpeed() {
  globalThis.saving.view.requestUpdate('updateBonusText', null);
  if (
    typeof globalThis.saving.vals.options.speedIncreaseBackground === 'number' &&
    !isNaN(globalThis.saving.vals.options.speedIncreaseBackground) &&
    globalThis.saving.vals.options.speedIncreaseBackground >= 0 && !document.hasFocus() &&
    (globalThis.saving.vals.options.speedIncreaseBackground < 1 || isBonusActive())
  ) {
    if (globalThis.saving.vals.options.speedIncreaseBackground === 1) {
      bonusSpeed = 1.00001;
    } else if (globalThis.saving.vals.options.speedIncreaseBackground === 0) {
      bonusSpeed = 0.0000001; // let's avoid any divide by zero errors shall we
    } else {
      bonusSpeed = globalThis.saving.vals.options.speedIncreaseBackground;
    }
    return;
  }
  if (!isBonusActive()) {
    bonusSpeed = 1;
    return;
  }
  if (globalThis.saving.vals.options.speedIncrease10x === true) bonusSpeed = 10;
  if (globalThis.saving.vals.options.speedIncrease20x === true) bonusSpeed = 20;
  if (bonusSpeed < globalThis.saving.vals.options.speedIncreaseCustom) {
    bonusSpeed = globalThis.saving.vals.options.speedIncreaseCustom;
  }
}

export const driverVals = {
  lagSpeed: 0,
  effectiveTime: 0,
  timeCounter: 0,
  baseManaPerSecond: 50,
  gameSpeed: 1,
};
