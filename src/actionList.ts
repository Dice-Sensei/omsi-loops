// @ts-check
'use strict';

class ClassNameNotFoundError extends TypeError {}

/**
 * @template {string} S
 * @typedef {S extends `${infer S1} ${infer S2}` ? `${S1}${WithoutSpaces<S2>}` : S} WithoutSpaces
 */

/**
 * @template {string} S
 * @param {S} name @returns {WithoutSpaces<S>}
 */
function withoutSpaces(name) {
  // @ts-ignore
  return name.replace(/ /gu, '');
}

// reverse lookup

// selection
/**
 * @template {number} TN townNum
 * @template {ActionType} T type
 * @typedef {ActionOfTownAndType<TN, T>["varName"]} ActionVarOfTownAndType
 */
/**
 * @template {number} TN townNum
 * @template {ActionType} T type
 * @typedef {Extract<AnyAction, {townNum: TN, type: T}>} ActionOfTownAndType
 */

/**
 * @typedef {Action<any>|MultipartAction<any>} AnyActionType
 * @typedef {typeof Action} ActionConstructor
 * @typedef {{
 *  [K in Exclude<keyof ActionConstructor, "prototype">]: ActionConstructor[K] extends Action<any, any> ? K : never
 * }[Exclude<keyof ActionConstructor, "prototype">]} ActionId
 *
 * @typedef {ActionConstructor[ActionId]} AnyAction
 *
 * @typedef {{
 *  [K in ActionId]: string extends VarNameOf<ActionConstructor[K]> ? never : VarNameOf<ActionConstructor[K]>
 * }[ActionId]} ActionVarName
 *
 * @typedef {{
 *  [K in ActionId]: string extends ActionTypeOf<ActionConstructor[K]> ? never : ActionTypeOf<ActionConstructor[K]> extends 'limited'|'normal' ? VarNameOf<ActionConstructor[K]> : never
 * }[ActionId]} StandardActionVarName
 *
 * @typedef {{
 *  [K in ActionId]: string extends ActionTypeOf<ActionConstructor[K]> ? never : ActionTypeOf<ActionConstructor[K]> extends 'progress' ? VarNameOf<ActionConstructor[K]> : never
 * }[ActionId]} ProgressActionVarName
 *
 * @typedef {{
 *  [K in ActionId]: ActionConstructor[K] extends MultipartAction<any> ? VarNameOf<ActionConstructor[K]> : never
 * }[ActionId]} MultipartActionVarName
 *
 * @typedef {{
 *  [K in ActionId]: string extends NameOf<ActionConstructor[K]> ? never : NameOf<ActionConstructor[K]>
 * }[ActionId]} ActionName
 */

/**
 * @template {ActionId|ActionName} N
 * @typedef {ActionId extends N ? AnyAction : N extends ActionId ? ActionConstructor[N] : WithoutSpaces<N> extends ActionId ? ActionConstructor[WithoutSpaces<N>] : never} LookupAction
 */
/**
 * @template {ActionId|ActionName} N
 * @typedef {ActionId extends N ? AnyAction : N extends ActionId ? ActionConstructor[N] : WithoutSpaces<N> extends ActionId ? ActionConstructor[WithoutSpaces<N>] : false} TryLookupAction
 */

/**
 * @template {ActionId|ActionName} N
 * @param {N} name @returns {TryLookupAction<N>}
 */
function getActionPrototype(name) {
  if (!name) return undefined;
  const nameWithoutSpaces = withoutSpaces(name);
  if (nameWithoutSpaces in Action && Action[nameWithoutSpaces] instanceof Action) {
    // @ts-ignore
    return Action[nameWithoutSpaces];
  }
  console.warn(`error trying to create ${name}`);
  return undefined;
}

function translateClassNames(name) {
  // construct a new action object with appropriate prototype
  const nameWithoutSpaces = withoutSpaces(name);
  if (nameWithoutSpaces in Action) {
    return Object.create(Action[nameWithoutSpaces]);
  }
  throw new ClassNameNotFoundError(`error trying to create ${name}`);
}

const limitedActions = [
  'Smash Pots',
  'Pick Locks',
  'Short Quest',
  'Long Quest',
  'Gather Herbs',
  'Wild Mana',
  'Hunt',
  'Gamble',
  'Gather Team',
  'Mana Geyser',
  'Mine Soulstones',
  'Take Artifacts',
  'Accept Donations',
  'Mana Well',
  'Destroy Pylons',
];

const trainingActions = [
  'Train Speed',
  'Train Strength',
  'Train Dexterity',
  'Sit By Waterfall',
  'Read Books',
  'Bird Watching',
  'Oracle',
  'Charm School',
];

function hasLimit(name) {
  // @ts-ignore
  return limitedActions.includes(name);
}

function isTravel(name) {
  return getTravelNum(name) !== 0;
}

function getPossibleTravel(name) {
  if (name === 'Face Judgement') return [1, 2];
  const travelNum = getTravelNum(name);
  return travelNum ? [travelNum] : [];
}

function getTravelNum(name) {
  if (name === 'Face Judgement' && resources.reputation <= 50) return 2;
  if (name === 'Face Judgement' && resources.reputation >= 50) return 1;
  if (
    name === 'Start Journey' || name === 'Continue On' || name === 'Start Trek' || name === 'Fall From Grace' ||
    name === 'Journey Forth' || name === 'Escape' || name === 'Leave City' || name === 'Guru'
  ) return 1;
  if (name === 'Hitch Ride') return 2;
  if (name === 'Underworld' || name === 'Open Rift') return 5;
  if (name === 'Open Portal') return -5;
  return 0;
}

function isTraining(name) {
  // @ts-ignore
  return trainingActions.includes(name);
}

function isActionOfType(action, type) {
  return action.type === type;
}

function getXMLName(name) {
  return name.toLowerCase().replace(/ /gu, '_');
}

const townNames = [
  'Beginnersville',
  'Forest Path',
  'Merchanton',
  'Mt. Olympus',
  'Valhalla',
  'Startington',
  'Jungle Path',
  'Commerceville',
  'Valley of Olympus',
];

// there are 4 types of actions
// 1: normal actions. normal actions have no additional UI (haggle, train strength)
// 2: progress actions. progress actions have a progress bar and use 100, 200, 300, etc. leveling system (wander, meet people)
// 3: limited actions. limited actions have town info for their limit, and a set of town vars for their "data"
// 4: multipart actions. multipart actions have multiple distinct parts to get through before repeating. they also get a bonus depending on how often you complete them

// type names are "normal", "progress", "limited", and "multipart".
// define one of these in the action, and they will create any additional UI elements that are needed

const actionTypes = ['normal', 'progress', 'limited', 'multipart'];
/**
 * @typedef {{
 *     type: ActionType,
 *     varName?: string,
 *     expMult: number,
 *     townNum: number,
 *     story?: (completed: number) => void,
 *     storyReqs?: (storyNum: number) => boolean,
 *     stats: Partial<Record<StatName, number>>,
 *     canStart?: (loopCounter?: number) => boolean,
 *     cost?: () => void,
 *     manaCost(): number,
 *     goldCost?: () => number,
 *     allowed?: () => number,
 *     visible(): boolean,
 *     unlocked(): boolean,
 *     finish(): void,
 *     skills?: Partial<Record<SkillName, number | (() => number)>>,
 *     grantsBuff?: BuffName,
 *     affectedBy?: readonly string[],
 *     progressScaling?: ProgressScalingType,
 * }} ActionExtras
 */

// exp mults are default 100%, 150% for skill training actions, 200% for actions that cost a resource, 300% for actions that cost 2 resources, and 500% for actions that cost soulstones
// todo: ^^ currently some actions are too high, but I am saving these balance changes for the z5/z6 update

// actions are all sorted below by town in order

/**
 * @template {string} N The name passed to the constructor
 * @template {ActionExtras} [E=ActionExtras] The extras parameter passed to the constructor
 */

class Localizable1 {
  #txtsObj;
  #rootPath;
  #lib;

  get rootPath() {
    return this.#rootPath;
  }
  get lib() {
    return this.#lib;
  }
  get txtsObj() {
    return this.#txtsObj ??= globalThis.Localization.txtsObj(this.#rootPath, this.#lib);
  }

  constructor(rootPath, lib) {
    this.#rootPath = rootPath;
    this.#lib = lib;
  }

  memoize(property, subPath = `>${property}`) {
    let value = this.txtsObj.find(subPath).text();
    if (!value) value = globalThis.Localization.txt(this.#rootPath + subPath, this.#lib);

    Object.defineProperty(this, property, { value, configurable: true });

    return value;
  }
}

class Action extends Localizable1 {
  name;

  varName;

  /**
   * @overload @param {N} name @param {E & ThisType<Action<N>>} extras
   * @constructor
   * @param {N} name @param {E} extras
   */
  constructor(name, extras) {
    super(`actions>${Action.xmlNameFor(name)}`);
    this.name = name;
    // many actions have to override this (in extras) for save compatibility, because the
    // varName is often used in parts of the game state
    this.varName = withoutSpaces(name);
    Object.assign(this, extras);
  }

  static xmlNameFor(name) {
    return name.startsWith('Assassin') ? 'assassin' : name.startsWith('Survey') ? 'survey' : getXMLName(name);
  }

  get imageName() {
    return globalThis.helpers.camelize(this.name);
  }

  /* eslint-disable no-invalid-this */
  // not all actions have tooltip2 or labelDone, but among actions that do, the XML format is
  // always the same; these are loaded lazily once (and then they become own properties of the
  // specific Action object)
  get tooltip() {
    return this.memoize('tooltip');
  }
  get tooltip2() {
    return this.memoize('tooltip2');
  }
  get label() {
    return this.memoize('label');
  }
  get labelDone() {
    return this.memoize('labelDone', '>label_done');
  }
  get labelGlobal() {
    return this.memoize('labelGlobal', '>label_global');
  }

  static {
    // listing these means they won't get stored even if memoized
    globalThis.Data.omitProperties(this.prototype, ['tooltip', 'tooltip2', 'label', 'labelDone', 'labelGlobal']);
  }

  // all actions to date with info text have the same info text, so presently this is
  // centralized here (function will not be called by the game code if info text is not
  // applicable)
  infoText() {
    return `${globalThis.Localization.txt(`actions>${getXMLName(this.name)}>info_text1`)}
                <i class='fa fa-arrow-left'></i>
                ${globalThis.Localization.txt(`actions>${getXMLName(this.name)}>info_text2`)}
                <i class='fa fa-arrow-left'></i>
                ${globalThis.Localization.txt(`actions>${getXMLName(this.name)}>info_text3`)}
                <br><span class='bold'>${`${
      globalThis.Localization.txt('actions>tooltip>total_found')
    }: `}</span><div id='total${this.varName}'></div>
                <br><span class='bold'>${`${
      globalThis.Localization.txt('actions>tooltip>total_checked')
    }: `}</span><div id='checked${this.varName}'></div>`;
  }

  teachesSkill(skill) {
    // if we don't give exp in the skill we don't teach it
    if (this.skills?.[skill] === undefined) return false;
    // if we have an unlock function and it references the skill, we don't teach it
    if (this.unlocked?.toString().search(`getSkillLevel\\("${skill}"\\)`) >= 0) return false;
    // if this is combat or magic and this isn't town 0, we don't teach it
    if ((skill === 'Combat' || skill === 'Magic') && this.townNum > 0) return false;
    // otherwise we do (as long as we actually give exp in it and it isn't zeroed out)
    const reward = this.skills[skill];
    const exp = typeof reward === 'function' ? reward() : reward;
    return exp > 0;
  }

  getStoryTexts(rawStoriesDataForAction = this.txtsObj[0].children) {
    const storyTexts = [];

    for (const rawStoryData of rawStoriesDataForAction) {
      if (rawStoryData.nodeName.startsWith('story_')) {
        const num = parseInt(rawStoryData.nodeName.replace('story_', ''));
        const [conditionHTML, text] = rawStoryData.textContent.split('⮀');
        const condition = conditionHTML.replace(/^<b>|:<\/b>$/g, '');
        storyTexts.push({ num, condition, conditionHTML, text });
      } else if (rawStoryData.nodeName === 'story') {
        const num = parseInt(rawStoryData.getAttribute('num'));
        const condition = rawStoryData.getAttribute('condition');
        const conditionHTML = `<b>${condition}:</b> `;
        const text = rawStoryData.children.length > 0 ? rawStoryData.innerHTML : rawStoryData.textContent;
        storyTexts.push({ num, condition, conditionHTML, text });
      }
    }
    return storyTexts;
  }
}

/**
 * @typedef {{
 *     loopStats: readonly StatName[],
 *     loopCost(segment: number, loopCounter?: number): number,
 *     tickProgress(offset: number, loopCounter?: number, totalCompletions?: number): number,
 *     segmentFinished?: (loopCounter?: number) => void,
 *     loopsFinished(loopCounter?: number): void,
 *     getSegmentName?: (segment: number) => string,
 *     getPartName(loopCounter?: number): string,
 *     completedTooltip?: () => string,
 * } & ActionExtras} MultipartActionExtras
 */

// same as Action, but contains shared code to load segment names for multipart actions.
// (constructor takes number of segments as a second argument)
/**
 * @template {string} N The name passed to the constructor
 * @template {MultipartActionExtras} [E=MultipartActionExtras] The extras parameter passed to the constructor
 * @extends {Action<N,E>}
 */
class MultipartAction extends Action {
  segments;

  /**
   * @param {N} name @param {E & ThisType<MultipartAction<N>>} extras
   */
  constructor(name, extras) {
    super(name, extras);
    this.segments = (extras.varName === 'Fight') ? 3 : extras.loopStats.length;
  }

  // lazily calculate segment names when explicitly requested (to give chance for localization
  // code to be loaded first)

  get segmentNames() {
    this._segmentNames ??= Array.from(this.txtsObj.find('>segment_names>name')).map((e) => e.textContent);

    return this._segmentNames;
  }

  get altSegmentNames() {
    this._altSegmentNames ??= Array.from(this.txtsObj.find('>segment_alt_names>name')).map((e) => e.textContent);

    return this._altSegmentNames;
  }

  get segmentModifiers() {
    this._segmentModifiers ??= Array.from(this.txtsObj.find('>segment_modifiers>segment_modifier')).map((e) =>
      e.textContent
    );

    return this._segmentModifiers;
  }

  static {
    globalThis.Data.omitProperties(this.prototype, ['segmentNames', 'altSegmentNames', 'segmentModifiers']);
  }

  getSegmentName(segment) {
    return this.segmentNames[segment % this.segmentNames.length];
  }

  canMakeProgress(offset, loopCounter, totalCompletions) {
    try {
      return this.tickProgress(offset, loopCounter, totalCompletions) > 0;
    } catch {
      return false;
    }
  }
}

/**
 * @typedef {{
 *      completedTooltip(): string;
 *      getPartName(loopCounter?: number): string;
 * }} DungeonActionImpl
 * @typedef {{
 * } & Omit<MultipartActionExtras, keyof DungeonActionImpl>} DungeonActionExtras
 */
// same as MultipartAction, but includes shared code to generate dungeon completion tooltip
// as well as specifying 7 segments (constructor takes dungeon ID number as a second
// argument)
/**
 * @template {string} N The name passed to the constructor
 * @template {DungeonActionExtras} [E=DungeonActionExtras] The extras parameter passed to the constructor
 * @extends {MultipartAction<N,E&DungeonActionImpl>}
 */
class DungeonAction extends MultipartAction {
  dungeonNum;

  /**
   * @param {N} name @param {number} dungeonNum, @param {E & ThisType<DungeonAction<N>>} extras
   */
  constructor(name, dungeonNum, extras) {
    // @ts-ignore
    super(name, extras);
    this.dungeonNum = dungeonNum;
  }

  // @ts-ignore
  completedTooltip() {
    let ssDivContainer = '';
    if (this.dungeonNum < 3) {
      for (let i = 0; i < globalThis.saving.vals.dungeons[this.dungeonNum].length; i++) {
        ssDivContainer += `Floor ${i + 1} |
                                    <div class='bold'>${
          globalThis.Localization.txt(`actions>${getXMLName(this.name)}>chance_label`)
        } </div> <div id='soulstoneChance${this.dungeonNum}_${i}'></div>% -
                                    <div class='bold'>${
          globalThis.Localization.txt(`actions>${getXMLName(this.name)}>last_stat_label`)
        } </div> <div id='soulstonePrevious${this.dungeonNum}_${i}'>NA</div> -
                                    <div class='bold'>${
          globalThis.Localization.txt(`actions>${getXMLName(this.name)}>label_done`)
        }</div> <div id='soulstoneCompleted${this.dungeonNum}_${i}'></div><br>`;
      }
    }
    return globalThis.Localization.txt(`actions>${getXMLName(this.name)}>completed_tooltip`) + ssDivContainer;
  }
  getPartName(loopCounter = towns[this.townNum][`${this.varName}LoopCounter`] + 0.0001) {
    const floor = Math.floor(loopCounter / this.segments + 1);
    return `${globalThis.Localization.txt(`actions>${getXMLName(this.name)}>label_part`)} ${
      floor <= globalThis.saving.vals.dungeons[this.dungeonNum].length
        ? globalThis.helpers.numberToWords(floor)
        : globalThis.Localization.txt(`actions>${getXMLName(this.name)}>label_complete`)
    }`;
  }
}

/**
 * @typedef {{
 *      completedTooltip(): string;
 *      getPartName(loopCounter?: number): string;
 *      currentFloor(loopCounter?: number): number;
 *      loopCost(segment: number, loopCounter?: number): number;
 *      tickProgress(offset: number, loopCounter?: number, totalCompletions?: number): number;
 *      loopsFinished(loopCounter?: number): void;
 * }} TrialActionImpl
 * @typedef {{
 *    floorReward(): void,
 *    baseProgress(): number,
 *    baseScaling: number,
 *    exponentScaling?: number,
 * } & Omit<MultipartActionExtras, keyof TrialActionImpl>} TrialActionExtras
 */
/**
 * @template {string} N The name passed to the constructor
 * @template {TrialActionExtras} [E=TrialActionExtras] The extras parameter passed to the constructor
 * @extends {MultipartAction<N,E&TrialActionImpl>}
 * @implements {TrialActionImpl}
 */
class TrialAction extends MultipartAction {
  trialNum;
  /**
   * @param {N} name @param {number} trialNum, @param {E & ThisType<E & TrialAction<N>>} extras
   */
  constructor(name, trialNum, extras) {
    // @ts-ignore
    super(name, extras);
    this.trialNum = trialNum;
  }
  // @ts-ignore
  completedTooltip() {
    return this.name + ` Highest Floor: <div id='trial${this.trialNum}HighestFloor'>0</div><br>
        Current Floor: <div id='trial${this.trialNum}CurFloor'>0</div> - Completed <div id='trial${this.trialNum}CurFloorCompleted'>x</div> times<br>
        Last Floor: <div id='trial${this.trialNum}LastFloor'>N/A</div> - Completed <div id='trial${this.trialNum}LastFloorCompleted'>N/A</div> times<br>`;
  }
  getPartName(loopCounter = towns[this.townNum][`${this.varName}LoopCounter`]) {
    const floor = Math.floor((loopCounter + 0.0001) / this.segments + 1);
    return `${globalThis.Localization.txt(`actions>${getXMLName(this.name)}>label_part`)} ${
      floor <= globalThis.saving.trials[this.trialNum].length
        ? globalThis.helpers.numberToWords(floor)
        : globalThis.Localization.txt(`actions>${getXMLName(this.name)}>label_complete`)
    }`;
  }
  currentFloor(loopCounter = globalThis.globals.towns[this.townNum][`${this.varName}LoopCounter`]) {
    return Math.floor(loopCounter / this.segments + 0.0000001);
  }

  loopCost(segment, loopCounter = globalThis.globals.towns[this.townNum][`${this.varName}LoopCounter`]) {
    return globalThis.helpers.precision3(
      Math.pow(this.baseScaling, Math.floor((loopCounter + segment) / this.segments + 0.0000001)) *
        this.exponentScaling * globalThis.stats.getSkillBonus('Assassin'),
    );
  }

  tickProgress(offset, loopCounter) {
    return this.baseProgress() *
      Math.sqrt(1 + globalThis.saving.trials[this.trialNum][this.currentFloor(loopCounter)].completed / 200);
  }
  loopsFinished(loopCounter) {
    const finishedFloor = this.currentFloor(loopCounter) - 1;
    //console.log("Finished floor: " + finishedFloor + " Current Floor: " + this.currentFloor());
    globalThis.saving.trials[this.trialNum][finishedFloor].completed++;
    if (
      finishedFloor > globalThis.saving.trials[this.trialNum].highestFloor ||
      globalThis.saving.trials[this.trialNum].highestFloor === undefined
    ) {
      globalThis.saving.trials[this.trialNum].highestFloor = finishedFloor;
    }
    globalThis.saving.view.requestUpdate('updateTrialInfo', {
      trialNum: this.trialNum,
      curFloor: this.currentFloor(loopCounter),
    });
    this.floorReward();
  }
}

/**
 * @typedef {typeof AssassinAction.$defaults} AssassinActionDefaults
 * @typedef {{
 *      manaCost(): number,
 *      allowed(): number,
 *      canStart(loopCounter?: number): boolean,
 *      loopCost(segment: number, loopCounter?: number): number,
 *      tickProgress(offset: number, loopCounter?: number, totalCompletions?: number): number,
 *      getPartName(loopCounter?: number): string,
 *      loopsFinished(loopCounter?: number): void,
 *      finish(): void,
 *      visible(): boolean,
 *      unlocked(): boolean,
 *      storyReqs(storyNum: number): boolean,
 *  }} AssassinActionImpl
 * @typedef {{
 * } & Omit<MultipartActionExtras, keyof (AssassinActionDefaults & AssassinActionImpl)>} AssassinActionExtras
 */
/**
 * @template {string} N The name passed to the constructor
 * @template {AssassinActionExtras} [E=AssassinActionExtras] The extras parameter passed to the constructor
 * @extends {MultipartAction<N,E&AssassinActionDefaults&AssassinActionImpl>}
 */
class AssassinAction extends MultipartAction {
  /**
   * @param {N} name @param {E & ThisType<E & AssassinAction<N>>} extras
   */
  constructor(name, extras) {
    // @ts-ignore
    super(name, {
      ...extras,
      ...AssassinAction.$defaults,
    });
  }

  get imageName() {
    return 'assassin';
  }

  getStoryTexts(
    rawStoriesDataForAction = globalThis.Localization.txtsObj(this.name.toLowerCase().replace(/ /gu, '_'))[0].children,
  ) { // I hate this
    return super.getStoryTexts(rawStoriesDataForAction);
  }

  static $defaults = ({
    type: 'multipart',
    expMult: 1,
    stats: { Per: 0.2, Int: 0.1, Dex: 0.3, Luck: 0.2, Spd: 0.2 },
    loopStats: ['Per', 'Int', 'Dex', 'Luck', 'Spd'],
  });

  manaCost() {
    return 50000;
  }
  // @ts-ignore
  allowed() {
    return 1;
  }
  canStart(loopCounter = towns[this.townNum][`${this.varName}LoopCounter`]) {
    return loopCounter === 0;
  }
  loopCost(_segment) {
    return 50000000;
  }
  tickProgress(_offset, _loopCounter, totalCompletions = towns[this.townNum]['total' + this.varName]) {
    let baseSkill = Math.sqrt(globalThis.stats.getSkillLevel('Practical')) +
      globalThis.stats.getSkillLevel('Thievery') + globalThis.stats.getSkillLevel('Assassin');
    let loopStat = 1 / 10;
    let completions = Math.sqrt(1 + totalCompletions / 100);
    let reputationPenalty = resources.reputation != 0 ? Math.abs(resources.reputation) : 1;
    let killStreak = resources.heart > 0 ? resources.heart : 1;
    return baseSkill * loopStat * completions / reputationPenalty / killStreak;
  }
  getPartName() {
    return 'Assassination';
  }
  loopsFinished() {
    globalThis.driver.addResource('heart', 1);
    hearts.push(this.varName);
  }
  finish() {
    let rep = Math.min((this.townNum + 1) * -250 + globalThis.stats.getSkillLevel('Assassin'), 0);
    globalThis.driver.addResource('reputation', rep);
  }
  visible() {
    return globalThis.stats.getSkillLevel('Assassin') > 0;
  }
  unlocked() {
    return globalThis.stats.getSkillLevel('Assassin') > 0;
  }
  // @ts-ignore
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[this.townNum][`totalAssassinZ${this.townNum}`] >= 1;
    }
    return false;
  }
}

//====================================================================================================
//Survery Actions (All Zones)
//====================================================================================================

function SurveyAction(townNum) {
  return ({
    type: 'progress',
    expMult: 1,
    townNum,
    stats: {
      Per: 0.4,
      Spd: 0.2,
      Con: 0.2,
      Luck: 0.2,
    },
    canStart() {
      return (resources.map > 0) || towns[this.townNum].getLevel('Survey') == 100;
    },
    manaCost() {
      return 10000 * (this.townNum + 1);
    },
    visible() {
      return getExploreProgress() > 0;
    },
    unlocked() {
      return getExploreProgress() > 0;
    },
    finish() {
      if (globalThis.saving.vals.towns[this.townNum].getLevel('Survey') != 100) {
        globalThis.saving.viewalThis.driver.addResource('map', -1);
        globalThis.driver.addResource('completedMap', 1);
        globalThis.saving.vals.towns[this.townNum].finishProgress(this.varName, getExploreSkill());
        globalThis.saving.view.requestUpdate('updateActionTooltips', null);
      } else if (globalThis.saving.vals.options.pauseOnComplete) {
        globalThis.driver.pauseGame(true, 'Survey complete! (Game paused)');
      }
    },
  });
}

Action.SurveyZ0 = new Action('SurveyZ0', SurveyAction(0));
Action.SurveyZ1 = new Action('SurveyZ1', SurveyAction(1));
Action.SurveyZ2 = new Action('SurveyZ2', SurveyAction(2));
Action.SurveyZ3 = new Action('SurveyZ3', SurveyAction(3));
Action.SurveyZ4 = new Action('SurveyZ4', SurveyAction(4));
Action.SurveyZ5 = new Action('SurveyZ5', SurveyAction(5));
Action.SurveyZ6 = new Action('SurveyZ6', SurveyAction(6));
Action.SurveyZ7 = new Action('SurveyZ7', SurveyAction(7));
Action.SurveyZ8 = new Action('SurveyZ8', SurveyAction(8));

function RuinsAction(townNum) {
  return ({
    type: 'progress',
    expMult: 1,
    townNum,
    stats: {
      Per: 0.4,
      Spd: 0.2,
      Con: 0.2,
      Luck: 0.2,
    },
    manaCost() {
      return 100000;
    },
    affectedBy: ['SurveyZ1'],
    visible() {
      return towns[this.townNum].getLevel('Survey') >= 100;
    },
    unlocked() {
      return towns[this.townNum].getLevel('Survey') >= 100;
    },
    finish() {
      towns[this.townNum].finishProgress(this.varName, 1);
      adjustRocks(this.townNum);
    },
    storyReqs(storyNum) {
      switch (storyNum) {
        case 1:
          return towns[this.townNum].getLevel(this.varName) >= 10;
        case 2:
          return towns[this.townNum].getLevel(this.varName) >= 50;
        case 3:
          return towns[this.townNum].getLevel(this.varName) >= 100;
      }
      return false;
    },
  });
}

Action.RuinsZ1 = new Action('RuinsZ1', RuinsAction(1));
Action.RuinsZ3 = new Action('RuinsZ3', RuinsAction(3));
Action.RuinsZ5 = new Action('RuinsZ5', RuinsAction(5));
Action.RuinsZ6 = new Action('RuinsZ6', RuinsAction(6));

function adjustRocks(townNum) {
  let town = globalThis.saving.vals.towns[townNum];
  let baseStones = town.getLevel('RuinsZ' + townNum) * 2500;
  let usedStones = globalThis.saving.vals.stonesUsed[townNum];
  town[`totalStonesZ${townNum}`] = baseStones;
  town[`goodStonesZ${townNum}`] = Math.floor(town[`checkedStonesZ${townNum}`] / 1000) - usedStones;
  town[`goodTempStonesZ${townNum}`] = Math.floor(town[`checkedStonesZ${townNum}`] / 1000) - usedStones;
  if (usedStones === 250) town[`checkedStonesZ${townNum}`] = 250000;
}
function adjustAllRocks() {
  adjustRocks(1);
  adjustRocks(3);
  adjustRocks(5);
  adjustRocks(6);
}

function HaulAction(townNum) {
  return ({
    type: 'limited',
    expMult: 1,
    townNum,
    varName: `StonesZ${townNum}`,
    stats: {
      Str: 0.4,
      Con: 0.6,
    },
    affectedBy: ['SurveyZ1'],
    canStart() {
      return !resources.stone && globalThis.saving.vals.stonesUsed[this.townNum] < 250;
    },
    manaCost() {
      return 50000;
    },
    visible() {
      return globalThis.saving.vals.towns[this.townNum].getLevel('RuinsZ' + townNum) > 0;
    },
    unlocked() {
      return globalThis.saving.vals.towns[this.townNum].getLevel('RuinsZ' + townNum) > 0;
    },
    finish() {
      globalThis.saving.vals.stoneLoc = this.townNum;
      globalThis.saving.vals.towns[this.townNum].finishRegular(this.varName, 1000, () => {
        globalThis.driver.addResource('stone', true);
      });
    },
    storyReqs(storyNum) {
      switch (storyNum) {
        case 1:
          return globalThis.saving.vals.towns[this.townNum][`good${this.varName}`] +
              globalThis.saving.vals.stonesUsed[this.townNum] >= 1;
        case 2:
          return globalThis.saving.vals.towns[this.townNum][`good${this.varName}`] +
              globalThis.saving.vals.stonesUsed[this.townNum] >= 100;
        case 3:
          return globalThis.saving.vals.towns[this.townNum][`good${this.varName}`] +
              globalThis.saving.vals.stonesUsed[this.townNum] >= 250;
      }
      return false;
    },
  });
}

Action.HaulZ1 = new Action('HaulZ1', HaulAction(1));
Action.HaulZ3 = new Action('HaulZ3', HaulAction(3));
Action.HaulZ5 = new Action('HaulZ5', HaulAction(5));
Action.HaulZ6 = new Action('HaulZ6', HaulAction(6));

//====================================================================================================
//Assassination Actions
//====================================================================================================

Action.AssassinZ0 = new AssassinAction('AssassinZ0', {
  townNum: 0,
});
Action.AssassinZ1 = new AssassinAction('AssassinZ1', {
  townNum: 1,
});
Action.AssassinZ2 = new AssassinAction('AssassinZ2', {
  townNum: 2,
});
Action.AssassinZ3 = new AssassinAction('AssassinZ3', {
  townNum: 3,
});
Action.AssassinZ4 = new AssassinAction('AssassinZ4', {
  townNum: 4,
});
Action.AssassinZ5 = new AssassinAction('AssassinZ5', {
  townNum: 5,
});
Action.AssassinZ6 = new AssassinAction('AssassinZ6', {
  townNum: 6,
});
Action.AssassinZ7 = new AssassinAction('AssassinZ7', {
  townNum: 7,
});

const lateGameActions = Object.values(Action).filter((a) => a instanceof Action).map((a) => a.name);

//====================================================================================================
//Zone 1 - Beginnersville
//====================================================================================================
Action.Map = new Action('Map', {
  type: 'normal',
  expMult: 1,
  townNum: 0,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return getExploreProgress() > 1;
    }
    return false;
  },
  stats: {
    Cha: 0.8,
    Luck: 0.1,
    Soul: 0.1,
  },
  manaCost() {
    return 200;
  },
  canStart() {
    return resources.gold >= 15;
  },
  visible() {
    return getExploreProgress() > 0;
  },
  unlocked() {
    return getExploreProgress() > 0;
  },
  goldCost() {
    return 15;
  },
  finish() {
    globalThis.driver.addResource('gold', -this.goldCost());
    globalThis.driver.addResource('map', 1);
  },
});
lateGameActions.push('Map');

Action.Wander = new Action('Wander', {
  type: 'progress',
  expMult: 1,
  townNum: 0,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[0].getLevel(this.varName) >= 20;
      case 2:
        return towns[0].getLevel(this.varName) >= 40;
      case 3:
        return towns[0].getLevel(this.varName) >= 60;
      case 4:
        return towns[0].getLevel(this.varName) >= 80;
      case 5:
        return towns[0].getLevel(this.varName) >= 100;
    }
    return false;
  },
  stats: {
    Per: 0.2,
    Con: 0.2,
    Cha: 0.2,
    Spd: 0.3,
    Luck: 0.1,
  },
  affectedBy: ['Buy Glasses'],
  manaCost() {
    return 250;
  },
  visible() {
    return true;
  },
  unlocked() {
    return true;
  },
  finish() {
    towns[0].finishProgress(this.varName, 200 * (resources.glasses ? 4 : 1));
  },
});
function adjustPots() {
  let town = towns[0];
  let basePots = Math.round(town.getLevel('Wander') * 5 * globalThis.prestige.adjustContentFromPrestige());
  town.totalPots = Math.floor(basePots + basePots * globalThis.stats.getSurveyBonus(town));
}
function adjustLocks() {
  let town = towns[0];
  let baseLocks = Math.round(town.getLevel('Wander') * globalThis.prestige.adjustContentFromPrestige());
  town.totalLocks = Math.floor(
    baseLocks * globalThis.stats.getSkillMod('Spatiomancy', 100, 300, .5) +
      baseLocks * globalThis.stats.getSurveyBonus(town),
  );
}

Action.SmashPots = new Action('Smash Pots', {
  type: 'limited',
  expMult: 1,
  townNum: 0,
  varName: 'Pots',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[0][`good${this.varName}`] >= 50;
      case 2:
        return towns[0][`good${this.varName}`] >= 75;
    }
    return false;
  },
  stats: {
    Str: 0.2,
    Per: 0.2,
    Spd: 0.6,
  },
  manaCost() {
    return Math.ceil(50 * globalThis.stats.getSkillBonus('Practical'));
  },
  visible() {
    return true;
  },
  unlocked() {
    return true;
  },
  // note this name is misleading: it is used for mana and gold gain.
  goldCost() {
    return Math.floor(100 * globalThis.stats.getSkillBonus('Dark'));
  },
  finish() {
    towns[0].finishRegular(this.varName, 10, () => {
      const manaGain = this.goldCost();
      globalThis.driver.addMana(manaGain);
      return manaGain;
    });
  },
});

Action.PickLocks = new Action('Pick Locks', {
  type: 'limited',
  varName: 'Locks',
  expMult: 1,
  townNum: 0,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[0][`checked${this.varName}`] >= 1;
      case 2:
        return towns[0][`checked${this.varName}`] >= 50;
      case 3:
        return towns[0][`good${this.varName}`] >= 10;
      case 4:
        return towns[0][`good${this.varName}`] >= 25;
    }
    return false;
  },
  stats: {
    Dex: 0.5,
    Per: 0.3,
    Spd: 0.1,
    Luck: 0.1,
  },
  manaCost() {
    return 400;
  },
  visible() {
    return towns[0].getLevel('Wander') >= 3;
  },
  unlocked() {
    return towns[0].getLevel('Wander') >= 20;
  },
  goldCost() {
    let base = 10;
    return Math.floor(
      base * globalThis.stats.getSkillMod('Practical', 0, 200, 1) * globalThis.stats.getSkillBonus('Thievery'),
    );
  },
  finish() {
    towns[0].finishRegular(this.varName, 10, () => {
      const goldGain = this.goldCost();
      globalThis.driver.addResource('gold', goldGain);
      return goldGain;
    });
  },
});

Action.BuyGlasses = new Action('Buy Glasses', {
  type: 'normal',
  expMult: 1,
  townNum: 0,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.glassesBought;
      case 2:
        return getExploreProgress() >= 100;
    }
    return false;
  },
  stats: {
    Cha: 0.7,
    Spd: 0.3,
  },
  allowed() {
    return 1;
  },
  canStart() {
    return resources.gold >= 10;
  },
  cost() {
    globalThis.driver.addResource('gold', -10);
  },
  manaCost() {
    return 50;
  },
  visible() {
    return towns[0].getLevel('Wander') >= 3 && getExploreProgress() < 100 &&
      !globalThis.prestige.prestigeValues['completedAnyPrestige'];
  },
  unlocked() {
    return towns[0].getLevel('Wander') >= 20;
  },
  finish() {
    globalThis.driver.addResource('glasses', true);
  },
  story(completed) {
    globalThis.view.setStoryFlag('glassesBought');
  },
});

Action.FoundGlasses = new Action('Found Glasses', {
  type: 'normal',
  expMult: 0,
  townNum: 0,
  stats: {},
  affectedBy: ['SurveyZ1'],
  allowed() {
    return 0;
  },
  canStart() {
    return false;
  },
  manaCost() {
    return 0;
  },
  visible() {
    return getExploreProgress() >= 100 || globalThis.prestige.prestigeValues['completedAnyPrestige'];
  },
  unlocked() {
    return false;
  },
  finish() {
  },
});

Action.BuyManaZ1 = new Action('Buy Mana Z1', {
  type: 'normal',
  expMult: 1,
  townNum: 0,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        //Strange unlock condition; this story unlocks after meeting
        //people, rather than when you buy from here?
        return towns[0].getLevel('Met') > 0;
    }
    return false;
  },
  stats: {
    Cha: 0.7,
    Int: 0.2,
    Luck: 0.1,
  },
  manaCost() {
    return 100;
  },
  visible() {
    return towns[0].getLevel('Wander') >= 3;
  },
  unlocked() {
    return towns[0].getLevel('Wander') >= 20;
  },
  goldCost() {
    return Math.floor(
      50 * globalThis.stats.getSkillBonus('Mercantilism') * globalThis.prestige.adjustGoldCostFromPrestige(),
    );
  },
  finish() {
    globalThis.driver.addMana(resources.gold * this.goldCost());
    globalThis.driver.resetResource('gold');
  },
});

Action.MeetPeople = new Action('Meet People', {
  type: 'progress',
  expMult: 1,
  townNum: 0,
  varName: 'Met',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[0].getLevel(this.varName) >= 1;
      case 2:
        return towns[0].getLevel(this.varName) >= 20;
      case 3:
        return towns[0].getLevel(this.varName) >= 40;
      case 4:
        return towns[0].getLevel(this.varName) >= 60;
      case 5:
        return towns[0].getLevel(this.varName) >= 80;
      case 6:
        return towns[0].getLevel(this.varName) >= 100;
    }
    return false;
  },
  stats: {
    Int: 0.1,
    Cha: 0.8,
    Soul: 0.1,
  },
  manaCost() {
    return 800;
  },
  visible() {
    return towns[0].getLevel('Wander') >= 10;
  },
  unlocked() {
    return towns[0].getLevel('Wander') >= 22;
  },
  finish() {
    towns[0].finishProgress(this.varName, 200);
  },
});
function adjustSQuests() {
  let town = towns[0];
  let baseSQuests = Math.round(town.getLevel('Met') * globalThis.prestige.adjustContentFromPrestige());
  town.totalSQuests = Math.floor(
    baseSQuests * globalThis.stats.getSkillMod('Spatiomancy', 200, 400, .5) +
      baseSQuests * globalThis.stats.getSurveyBonus(town),
  );
}

Action.TrainStrength = new Action('Train Strength', {
  type: 'normal',
  expMult: 4,
  townNum: 0,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.strengthTrained;
      case 2:
        return storyFlags.strengthTrained && globalThis.stats.getTalent('Str') >= 100;
      case 3:
        return storyFlags.strengthTrained && globalThis.stats.getTalent('Str') >= 1000;
      case 4:
        return storyFlags.strengthTrained && globalThis.stats.getTalent('Str') >= 10000;
      case 5:
        return storyFlags.strengthTrained && globalThis.stats.getTalent('Str') >= 100000;
    }
    return false;
  },
  stats: {
    Str: 0.8,
    Con: 0.2,
  },
  allowed() {
    return globalThis.saving.vals.trainingLimits;
  },
  manaCost() {
    return 2000;
  },
  visible() {
    return towns[0].getLevel('Met') >= 1;
  },
  unlocked() {
    return towns[0].getLevel('Met') >= 5;
  },
  finish() {
  },
  story(completed) {
    globalThis.view.setStoryFlag('strengthTrained');
  },
});

Action.ShortQuest = new Action('Short Quest', {
  type: 'limited',
  expMult: 1,
  townNum: 0,
  varName: 'SQuests',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[0][`checked${this.varName}`] >= 1;
      case 2:
        // 20 short quests in a loop
        return storyFlags.maxSQuestsInALoop;
      case 3:
        // 50 short quests in a loop
        return storyFlags.realMaxSQuestsInALoop;
    }
    return false;
  },
  stats: {
    Str: 0.2,
    Dex: 0.1,
    Cha: 0.3,
    Spd: 0.2,
    Luck: 0.1,
    Soul: 0.1,
  },
  manaCost() {
    return 600;
  },
  visible() {
    return towns[0].getLevel('Met') >= 1;
  },
  unlocked() {
    return towns[0].getLevel('Met') >= 5;
  },
  goldCost() {
    let base = 20;
    return Math.floor(base * globalThis.stats.getSkillMod('Practical', 100, 300, 1));
  },
  finish() {
    towns[0].finishRegular(this.varName, 5, () => {
      const goldGain = this.goldCost();
      globalThis.driver.addResource('gold', goldGain);
      return goldGain;
    });
  },
  story(completed) {
    if (
      towns[0][`good${this.varName}`] >= 20 &&
      towns[0][`goodTemp${this.varName}`] <= towns[0][`good${this.varName}`] - 20
    ) globalThis.view.setStoryFlag('maxSQuestsInALoop');
    if (
      towns[0][`good${this.varName}`] >= 50 &&
      towns[0][`goodTemp${this.varName}`] <= towns[0][`good${this.varName}`] - 50
    ) globalThis.view.setStoryFlag('realMaxSQuestsInALoop');
  },
});

Action.Investigate = new Action('Investigate', {
  type: 'progress',
  expMult: 1,
  townNum: 0,
  varName: 'Secrets',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[0].getLevel(this.varName) >= 20;
      case 2:
        return towns[0].getLevel(this.varName) >= 40;
      case 3:
        return towns[0].getLevel(this.varName) >= 60;
      case 4:
        return towns[0].getLevel(this.varName) >= 80;
      case 5:
        return towns[0].getLevel(this.varName) >= 100;
    }
    return false;
  },
  stats: {
    Per: 0.3,
    Cha: 0.4,
    Spd: 0.2,
    Luck: 0.1,
  },
  manaCost() {
    return 1000;
  },
  visible() {
    return towns[0].getLevel('Met') >= 5;
  },
  unlocked() {
    return towns[0].getLevel('Met') >= 25;
  },
  finish() {
    towns[0].finishProgress(this.varName, 500);
  },
});
function adjustLQuests() {
  let town = towns[0];
  let baseLQuests = Math.round(town.getLevel('Secrets') / 2 * globalThis.prestige.adjustContentFromPrestige());
  town.totalLQuests = Math.floor(
    baseLQuests * globalThis.stats.getSkillMod('Spatiomancy', 300, 500, .5) +
      baseLQuests * globalThis.stats.getSurveyBonus(town),
  );
}

Action.LongQuest = new Action('Long Quest', {
  type: 'limited',
  expMult: 1,
  townNum: 0,
  varName: 'LQuests',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[0][`checked${this.varName}`] >= 1;
      case 2:
        // 10 long quests in a loop
        return storyFlags.maxLQuestsInALoop;
      case 3:
        // 25 long quests in a loop
        return storyFlags.realMaxLQuestsInALoop;
    }
    return false;
  },
  stats: {
    Str: 0.2,
    Int: 0.2,
    Con: 0.4,
    Spd: 0.2,
  },
  manaCost() {
    return 1500;
  },
  visible() {
    return towns[0].getLevel('Secrets') >= 1;
  },
  unlocked() {
    return towns[0].getLevel('Secrets') >= 10;
  },
  goldCost() {
    let base = 30;
    return Math.floor(base * globalThis.stats.getSkillMod('Practical', 200, 400, 1));
  },
  finish() {
    towns[0].finishRegular(this.varName, 5, () => {
      globalThis.driver.addResource('reputation', 1);
      const goldGain = this.goldCost();
      globalThis.driver.addResource('gold', goldGain);
      return goldGain;
    });
  },
  story(completed) {
    if (
      towns[0][`good${this.varName}`] >= 10 &&
      towns[0][`goodTemp${this.varName}`] <= towns[0][`good${this.varName}`] - 10
    ) globalThis.view.setStoryFlag('maxLQuestsInALoop');
    if (
      towns[0][`good${this.varName}`] >= 25 &&
      towns[0][`goodTemp${this.varName}`] <= towns[0][`good${this.varName}`] - 25
    ) globalThis.view.setStoryFlag('realMaxLQuestsInALoop');
  },
});

Action.ThrowParty = new Action('Throw Party', {
  type: 'normal',
  expMult: 2,
  townNum: 0,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.partyThrown;
      case 2:
        return storyFlags.partyThrown2;
    }
    return false;
  },
  stats: {
    Cha: 0.8,
    Soul: 0.2,
  },
  manaCost() {
    return 1600;
  },
  canStart() {
    return resources.reputation >= 2;
  },
  cost() {
    globalThis.driver.addResource('reputation', -2);
  },
  visible() {
    return towns[this.townNum].getLevel('Secrets') >= 20;
  },
  unlocked() {
    return towns[this.townNum].getLevel('Secrets') >= 30;
  },
  finish() {
    towns[0].finishProgress('Met', 3200);
  },
  story(completed) {
    globalThis.view.setStoryFlag('partyThrown');
    if (completed >= 10) globalThis.view.setStoryFlag('partyThrown2');
  },
});

Action.WarriorLessons = new Action('Warrior Lessons', {
  type: 'normal',
  expMult: 1.5,
  townNum: 0,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return globalThis.stats.getSkillLevel('Combat') >= 1;
      case 2:
        return globalThis.stats.getSkillLevel('Combat') >= 100;
      case 3:
        return globalThis.stats.getSkillLevel('Combat') >= 200;
      case 4:
        return globalThis.stats.getSkillLevel('Combat') >= 250;
      case 5:
        return globalThis.stats.getSkillLevel('Combat') >= 500;
      case 6:
        return globalThis.stats.getSkillLevel('Combat') >= 1000;
    }
    return false;
  },
  stats: {
    Str: 0.5,
    Dex: 0.3,
    Con: 0.2,
  },
  skills: {
    Combat: 100,
  },
  manaCost() {
    return 1000;
  },
  canStart() {
    return resources.reputation >= 2;
  },
  visible() {
    return towns[0].getLevel('Secrets') >= 10;
  },
  unlocked() {
    return towns[0].getLevel('Secrets') >= 20;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
  },
});

Action.MageLessons = new Action('Mage Lessons', {
  type: 'normal',
  expMult: 1.5,
  townNum: 0,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return globalThis.stats.getSkillLevel('Magic') >= 1;
      case 2:
        return globalThis.stats.getSkillLevel('Magic') >= 100;
      case 3:
        return globalThis.stats.getSkillLevel('Magic') >= 200;
      case 4:
        return globalThis.stats.getSkillLevel('Magic') >= 250;
      case 5:
        return globalThis.stats.getSkillLevel('Alchemy') >= 10;
      case 6:
        return globalThis.stats.getSkillLevel('Alchemy') >= 50;
      case 7:
        return globalThis.stats.getSkillLevel('Alchemy') >= 100;
    }
    return false;
  },
  stats: {
    Per: 0.3,
    Int: 0.5,
    Con: 0.2,
  },
  skills: {
    Magic() {
      return 100 * (1 + globalThis.stats.getSkillLevel('Alchemy') / 100);
    },
  },
  manaCost() {
    return 1000;
  },
  canStart() {
    return resources.reputation >= 2;
  },
  visible() {
    return towns[0].getLevel('Secrets') >= 10;
  },
  unlocked() {
    return towns[0].getLevel('Secrets') >= 20;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
  },
});

Action.HealTheSick = new MultipartAction('Heal The Sick', {
  type: 'multipart',
  expMult: 1,
  townNum: 0,
  varName: 'Heal',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[0].totalHeal >= 1;
      case 2:
        // 10 patients healed in a loop
        return storyFlags.heal10PatientsInALoop;
      case 3:
        return towns[0].totalHeal >= 100;
      case 4:
        return towns[0].totalHeal >= 1000;
      case 5:
        // fail reputation req
        return storyFlags.failedHeal;
      case 6:
        return globalThis.stats.getSkillLevel('Restoration') >= 50;
    }
    return false;
  },
  stats: {
    Per: 0.2,
    Int: 0.2,
    Cha: 0.2,
    Soul: 0.4,
  },
  skills: {
    Magic: 10,
  },
  loopStats: ['Per', 'Int', 'Cha'],
  manaCost() {
    return 2500;
  },
  canStart() {
    return resources.reputation >= 1;
  },
  loopCost(segment, loopCounter = towns[0].HealLoopCounter) {
    return globalThis.helpers.fibonacci(2 + Math.floor((loopCounter + segment) / this.segments + 0.0000001)) * 5000;
  },
  tickProgress(_offset, _loopCounter, totalCompletions = towns[0].totalHeal) {
    return globalThis.stats.getSkillLevel('Magic') * Math.max(globalThis.stats.getSkillLevel('Restoration') / 50, 1) *
      Math.sqrt(1 + totalCompletions / 100);
  },
  loopsFinished() {
    globalThis.driver.addResource('reputation', 3);
  },
  getPartName(loopCounter = towns[0].HealLoopCounter) {
    return `${globalThis.Localization.txt(`actions>${getXMLName(this.name)}>label_part`)} ${
      globalThis.helpers.numberToWords(Math.floor((loopCounter + 0.0001) / this.segments + 1))
    }`;
  },
  visible() {
    return towns[0].getLevel('Secrets') >= 20;
  },
  unlocked() {
    return globalThis.stats.getSkillLevel('Magic') >= 12;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
  },
  story(completed) {
    if (towns[0].HealLoopCounter / 3 + 1 >= 10) globalThis.view.setStoryFlag('heal10PatientsInALoop');
  },
});

Action.FightMonsters = new MultipartAction('Fight Monsters', {
  type: 'multipart',
  expMult: 1,
  townNum: 0,
  varName: 'Fight',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[0].totalFight >= 1;
      case 2:
        return towns[0].totalFight >= 100;
      case 3:
        return towns[0].totalFight >= 500;
      case 4:
        return towns[0].totalFight >= 1000;
      case 5:
        return towns[0].totalFight >= 5000;
      case 6:
        return towns[0].totalFight >= 10000;
      case 7:
        return towns[0].totalFight >= 20000;
    }
    return false;
  },
  stats: {
    Str: 0.3,
    Spd: 0.3,
    Con: 0.3,
    Luck: 0.1,
  },
  skills: {
    Combat: 10,
  },
  loopStats: ['Spd', 'Spd', 'Spd', 'Str', 'Str', 'Str', 'Con', 'Con', 'Con'],
  manaCost() {
    return 2000;
  },
  canStart() {
    return resources.reputation >= 2;
  },
  loopCost(segment, loopCounter = towns[0].FightLoopCounter) {
    return globalThis.helpers.fibonacci(Math.floor((loopCounter + segment) - loopCounter / 3 + 0.0000001)) * 10000;
  },
  tickProgress(_offset, _loopCounter, totalCompletions = towns[0].totalFight) {
    return globalThis.stats.getSelfCombat() * Math.sqrt(1 + totalCompletions / 100);
  },
  loopsFinished() {
    // empty
  },
  segmentFinished() {
    globalThis.driver.addResource('gold', 20);
  },
  getPartName(loopCounter = towns[0].FightLoopCounter) {
    const monster = Math.floor(loopCounter / 3 + 0.0000001);
    if (monster >= this.segmentNames.length) return this.altSegmentNames[monster % 3];
    return this.segmentNames[monster];
  },
  getSegmentName(segment) {
    return `${this.segmentModifiers[segment % 3]} ${this.getPartName()}`;
  },
  visible() {
    return towns[0].getLevel('Secrets') >= 20;
  },
  unlocked() {
    return globalThis.stats.getSkillLevel('Combat') >= 10;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
  },
});

Action.SmallDungeon = new DungeonAction('Small Dungeon', 0, {
  type: 'multipart',
  expMult: 1,
  townNum: 0,
  varName: 'SDungeon',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.smallDungeonAttempted;
      case 2:
        return towns[0][`total${this.varName}`] >= 1000;
      case 3:
        return towns[0][`total${this.varName}`] >= 5000;
      case 4:
        return towns[0][`total${this.varName}`] >= 10000;
      case 5:
        return storyFlags.clearSDungeon;
    }
    return false;
  },
  stats: {
    Str: 0.1,
    Dex: 0.4,
    Con: 0.3,
    Cha: 0.1,
    Luck: 0.1,
  },
  skills: {
    Combat: 5,
    Magic: 5,
  },
  loopStats: ['Dex', 'Con', 'Dex', 'Cha', 'Dex', 'Str', 'Luck'],
  manaCost() {
    return 2000;
  },
  canStart(loopCounter = towns[this.townNum].SDungeonLoopCounter) {
    const curFloor = Math.floor(loopCounter / this.segments + 0.0000001);
    return resources.reputation >= 2 && curFloor < globalThis.saving.vals.dungeons[this.dungeonNum].length;
  },
  loopCost(segment, loopCounter = towns[this.townNum].SDungeonLoopCounter) {
    return globalThis.helpers.precision3(
      Math.pow(2, Math.floor((loopCounter + segment) / this.segments + 0.0000001)) * 15000,
    );
  },
  tickProgress(offset, loopCounter = towns[this.townNum].SDungeonLoopCounter) {
    const floor = Math.floor(loopCounter / this.segments + 0.0000001);
    return (globalThis.stats.getSelfCombat() + globalThis.stats.getSkillLevel('Magic')) *
      Math.sqrt(1 + globalThis.saving.vals.dungeons[this.dungeonNum][floor].completed / 200);
  },
  loopsFinished() {
    const curFloor = Math.floor((towns[this.townNum].SDungeonLoopCounter) / this.segments + 0.0000001 - 1);
    const success = this.finishDungeon(curFloor);
    if (success === true && globalThis.saving.vals.storyMax <= 1) {
      globalThis.view.unlockGlobalStory(1);
    } else if (success === false && globalThis.saving.vals.storyMax <= 2) {
      globalThis.view.unlockGlobalStory(2);
    }
  },
  visible() {
    return (globalThis.stats.getSkillLevel('Combat') + globalThis.stats.getSkillLevel('Magic')) >= 15;
  },
  unlocked() {
    return (globalThis.stats.getSkillLevel('Combat') + globalThis.stats.getSkillLevel('Magic')) >= 35;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
  },
  story(completed) {
    globalThis.view.setStoryFlag('smallDungeonAttempted');
    if (towns[this.townNum][this.varName + 'LoopCounter'] >= 42) globalThis.view.setStoryFlag('clearSDungeon');
  },
});
DungeonAction.prototype.finishDungeon = function finishDungeon(floorNum) {
  const dungeonNum = this.dungeonNum;
  const floor = globalThis.saving.vals.dungeons[dungeonNum][floorNum];
  if (!floor) {
    return false;
  }
  floor.completed++;
  const rand = Math.random();
  if (rand <= floor.ssChance) {
    const statToAdd = globalThis.globals.statList[Math.floor(Math.random() * globalThis.globals.statList.length)];
    floor.lastStat = statToAdd;
    const countToAdd = Math.floor(Math.pow(10, dungeonNum) * globalThis.stats.getSkillBonus('Divine'));
    stats[statToAdd].soulstone = (globalThis.globals.stats[statToAdd].soulstone ?? 0) + countToAdd;
    floor.ssChance *= 0.98;
    globalThis.saving.view.requestUpdate('updateSoulstones', null);
    globalThis.globals.actionLog.addSoulstones(this, statToAdd, countToAdd);
    return true;
  }
  return false;
};

Action.BuySupplies = new Action('Buy Supplies', {
  type: 'normal',
  expMult: 1,
  townNum: 0,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.suppliesBought;
      case 2:
        return storyFlags.suppliesBoughtWithoutHaggling;
    }
    return false;
  },
  stats: {
    Cha: 0.8,
    Luck: 0.1,
    Soul: 0.1,
  },
  allowed() {
    return 1;
  },
  manaCost() {
    return 200;
  },
  canStart() {
    return resources.gold >= towns[0].suppliesCost && !resources.supplies;
  },
  cost() {
    globalThis.driver.addResource('gold', -towns[0].suppliesCost);
  },
  visible() {
    return (globalThis.stats.getSkillLevel('Combat') + globalThis.stats.getSkillLevel('Magic')) >= 15;
  },
  unlocked() {
    return (globalThis.stats.getSkillLevel('Combat') + globalThis.stats.getSkillLevel('Magic')) >= 35;
  },
  finish() {
    globalThis.driver.addResource('supplies', true);
  },
  story(completed) {
    globalThis.view.setStoryFlag('suppliesBought');
    if (towns[0].suppliesCost === 300) globalThis.view.setStoryFlag('suppliesBoughtWithoutHaggling');
  },
});

Action.Haggle = new Action('Haggle', {
  type: 'normal',
  expMult: 1,
  townNum: 0,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.haggle;
      case 2:
        return storyFlags.haggle15TimesInALoop;
      case 3:
        return storyFlags.haggle16TimesInALoop;
    }
    return false;
  },
  stats: {
    Cha: 0.8,
    Luck: 0.1,
    Soul: 0.1,
  },
  manaCost() {
    return 100;
  },
  canStart() {
    return resources.reputation >= 1;
  },
  cost() {
    globalThis.driver.addResource('reputation', -1);
  },
  visible() {
    return (globalThis.stats.getSkillLevel('Combat') + globalThis.stats.getSkillLevel('Magic')) >= 15;
  },
  unlocked() {
    return (globalThis.stats.getSkillLevel('Combat') + globalThis.stats.getSkillLevel('Magic')) >= 35;
  },
  finish() {
    towns[0].suppliesCost -= 20;
    if (towns[0].suppliesCost < 0) {
      towns[0].suppliesCost = 0;
    }
    globalThis.saving.view.requestUpdate('updateResource', 'supplies');
  },
  story(completed) {
    if (completed >= 15) globalThis.globalThis.saving.view.setStoryFlag('haggle15TimesInALoop');
    if (completed >= 16) globalThis.globalThis.saving.view.setStoryFlag('haggle16TimesInALoop');
    globalThis.view.setStoryFlag('haggle');
  },
});

Action.StartJourney = new Action('Start Journey', {
  type: 'normal',
  expMult: 2,
  townNum: 0,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return globalThis.saving.vals.townsUnlocked.includes(1);
    }
    return false;
  },
  stats: {
    Con: 0.4,
    Per: 0.3,
    Spd: 0.3,
  },
  allowed() {
    return 1;
  },
  manaCost() {
    return 1000;
  },
  canStart() {
    return resources.supplies;
  },
  cost() {
    globalThis.driver.addResource('supplies', false);
  },
  visible() {
    return (globalThis.stats.getSkillLevel('Combat') + globalThis.stats.getSkillLevel('Magic')) >= 15;
  },
  unlocked() {
    return (globalThis.stats.getSkillLevel('Combat') + globalThis.stats.getSkillLevel('Magic')) >= 35;
  },
  finish() {
    globalThis.driver.unlockTown(1);
  },
  story(completed) {
    globalThis.view.unlockGlobalStory(3);
  },
});

Action.HitchRide = new Action('Hitch Ride', {
  type: 'normal',
  expMult: 1,
  townNum: 0,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return getExploreProgress() >= 25;
    }
    return false;
  },
  stats: {
    Cha: 0.5,
    Per: 0.5,
  },
  allowed() {
    return 1;
  },
  manaCost() {
    return 1;
  },
  canStart() {
    return true;
  },
  visible() {
    return getExploreProgress() > 1;
  },
  unlocked() {
    return getExploreProgress() >= 25;
  },
  finish() {
    globalThis.driver.unlockTown(2);
  },
});

Action.OpenRift = new Action('Open Rift', {
  type: 'normal',
  expMult: 1,
  townNum: 0,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[5].getLevel('Meander') >= 1;
    }
    return false;
  },
  stats: {
    Int: 0.2,
    Luck: 0.1,
    Soul: 0.7,
  },
  skills: {
    Dark: 1000,
  },
  allowed() {
    return 1;
  },
  manaCost() {
    return 50000;
  },
  visible() {
    return towns[5].getLevel('Meander') >= 1;
  },
  unlocked() {
    return globalThis.stats.getSkillLevel('Dark') >= 300 && globalThis.stats.getSkillLevel('Spatiomancy') >= 100;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.driver.addResource('supplies', false);
    globalThis.driver.unlockTown(5);
  },
});

//====================================================================================================
//Zone 2 - Forest Path
//====================================================================================================
Action.ExploreForest = new Action('Explore Forest', {
  type: 'progress',
  expMult: 1,
  townNum: 1,
  varName: 'Forest',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[1].getLevel(this.varName) >= 1;
      case 2:
        return towns[1].getLevel(this.varName) >= 10;
      case 3:
        return towns[1].getLevel(this.varName) >= 20;
      case 4:
        return towns[1].getLevel(this.varName) >= 40;
      case 5:
        return towns[1].getLevel(this.varName) >= 50;
      case 6:
        return towns[1].getLevel(this.varName) >= 60;
      case 7:
        return towns[1].getLevel(this.varName) >= 80;
      case 8:
        return towns[1].getLevel(this.varName) >= 100;
    }
    return false;
  },
  stats: {
    Per: 0.4,
    Con: 0.2,
    Spd: 0.2,
    Luck: 0.2,
  },
  affectedBy: ['Buy Glasses'],
  manaCost() {
    return 400;
  },
  visible() {
    return true;
  },
  unlocked() {
    return true;
  },
  finish() {
    towns[1].finishProgress(this.varName, 100 * (resources.glasses ? 2 : 1));
  },
});
function adjustWildMana() {
  let town = towns[1];
  let baseWildMana = Math.round(
    (town.getLevel('Forest') * 5 + town.getLevel('Thicket') * 5) * globalThis.prestige.adjustContentFromPrestige(),
  );
  town.totalWildMana = Math.floor(baseWildMana + baseWildMana * globalThis.stats.getSurveyBonus(town));
}
function adjustHunt() {
  let town = towns[1];
  let baseHunt = Math.round(town.getLevel('Forest') * 2 * globalThis.prestige.adjustContentFromPrestige());
  town.totalHunt = Math.floor(
    baseHunt * globalThis.stats.getSkillMod('Spatiomancy', 400, 600, .5) +
      baseHunt * globalThis.stats.getSurveyBonus(town),
  );
}
function adjustHerbs() {
  let town = towns[1];
  let baseHerbs = Math.round(
    (town.getLevel('Forest') * 5 + town.getLevel('Shortcut') * 2 + town.getLevel('Flowers') * 13) *
      globalThis.prestige.adjustContentFromPrestige(),
  );
  town.totalHerbs = Math.floor(
    baseHerbs * globalThis.stats.getSkillMod('Spatiomancy', 500, 700, .5) +
      baseHerbs * globalThis.stats.getSurveyBonus(town),
  );
}

Action.WildMana = new Action('Wild Mana', {
  type: 'limited',
  expMult: 1,
  townNum: 1,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[1][`checked${this.varName}`] >= 1;
      case 2:
        return towns[1][`good${this.varName}`] >= 100;
      case 3:
        return towns[1][`good${this.varName}`] >= 150;
    }
    return false;
  },
  stats: {
    Con: 0.2,
    Int: 0.6,
    Soul: 0.2,
  },
  manaCost() {
    return Math.ceil(150 * globalThis.stats.getSkillBonus('Practical'));
  },
  visible() {
    return true;
  },
  unlocked() {
    return towns[1].getLevel('Forest') >= 2;
  },
  goldCost() {
    return Math.floor(250 * globalThis.stats.getSkillBonus('Dark'));
  },
  finish() {
    towns[1].finishRegular(this.varName, 10, () => {
      const manaGain = this.goldCost();
      globalThis.driver.addMana(manaGain);
      return manaGain;
    });
  },
});

Action.GatherHerbs = new Action('Gather Herbs', {
  type: 'limited',
  expMult: 1,
  townNum: 1,
  varName: 'Herbs',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[1][`checked${this.varName}`] >= 1;
      case 2:
        return towns[1][`good${this.varName}`] >= 200;
      case 3:
        return towns[1][`good${this.varName}`] >= 500;
    }
    return false;
  },
  stats: {
    Str: 0.4,
    Dex: 0.3,
    Int: 0.3,
  },
  manaCost() {
    return Math.ceil(200 * (1 - towns[1].getLevel('Hermit') * 0.005));
  },
  visible() {
    return towns[1].getLevel('Forest') >= 2;
  },
  unlocked() {
    return towns[1].getLevel('Forest') >= 10;
  },
  finish() {
    towns[1].finishRegular(this.varName, 10, () => {
      globalThis.driver.addResource('herbs', 1);
      return 1;
    });
  },
});

Action.Hunt = new Action('Hunt', {
  type: 'limited',
  expMult: 1,
  townNum: 1,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[1][`checked${this.varName}`] >= 1;
      case 2:
        return towns[1][`good${this.varName}`] >= 10;
      case 3:
        return towns[1][`good${this.varName}`] >= 20;
      case 4:
        return towns[1][`good${this.varName}`] >= 50;
    }
    return false;
  },
  stats: {
    Dex: 0.2,
    Con: 0.2,
    Per: 0.2,
    Spd: 0.4,
  },
  manaCost() {
    return 800;
  },
  visible() {
    return towns[1].getLevel('Forest') >= 10;
  },
  unlocked() {
    return towns[1].getLevel('Forest') >= 40;
  },
  finish() {
    towns[1].finishRegular(this.varName, 10, () => {
      globalThis.driver.addResource('hide', 1);
      return 1;
    });
  },
});

Action.SitByWaterfall = new Action('Sit By Waterfall', {
  type: 'normal',
  expMult: 4,
  townNum: 1,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.satByWaterfall;
      case 2:
        return storyFlags.satByWaterfall && globalThis.stats.getTalent('Soul') >= 100;
      case 3:
        return storyFlags.satByWaterfall && globalThis.stats.getTalent('Soul') >= 1000;
      case 4:
        return storyFlags.satByWaterfall && globalThis.stats.getTalent('Soul') >= 10000;
      case 5:
        return storyFlags.satByWaterfall && globalThis.stats.getTalent('Soul') >= 100000;
    }
    return false;
  },
  stats: {
    Con: 0.2,
    Soul: 0.8,
  },
  allowed() {
    return globalThis.saving.vals.trainingLimits;
  },
  manaCost() {
    return 2000;
  },
  visible() {
    return towns[1].getLevel('Forest') >= 10;
  },
  unlocked() {
    return towns[1].getLevel('Forest') >= 70;
  },
  finish() {
    globalThis.view.setStoryFlag('satByWaterfall');
  },
});

Action.OldShortcut = new Action('Old Shortcut', {
  type: 'progress',
  expMult: 1,
  townNum: 1,
  varName: 'Shortcut',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[1].getLevel(this.varName) >= 1;
      case 2:
        return towns[1].getLevel(this.varName) >= 10;
      case 3:
        return towns[1].getLevel(this.varName) >= 20;
      case 4:
        return towns[1].getLevel(this.varName) >= 40;
      case 5:
        return towns[1].getLevel(this.varName) >= 60;
      case 6:
        return towns[1].getLevel(this.varName) >= 80;
      case 7:
        return towns[1].getLevel(this.varName) >= 100;
    }
    return false;
  },
  stats: {
    Per: 0.3,
    Con: 0.4,
    Spd: 0.2,
    Luck: 0.1,
  },
  manaCost() {
    return 800;
  },
  visible() {
    return true;
  },
  unlocked() {
    return towns[1].getLevel('Forest') >= 20;
  },
  finish() {
    towns[1].finishProgress(this.varName, 100);
    globalThis.saving.view.requestUpdate('adjustManaCost', 'Continue On');
  },
});

Action.TalkToHermit = new Action('Talk To Hermit', {
  type: 'progress',
  expMult: 1,
  townNum: 1,
  varName: 'Hermit',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[1].getLevel(this.varName) >= 1;
      case 2:
        return towns[1].getLevel(this.varName) >= 10;
      case 3:
        return towns[1].getLevel(this.varName) >= 20;
      case 4:
        return towns[1].getLevel(this.varName) >= 40;
      case 5:
        return towns[1].getLevel(this.varName) >= 60;
      case 6:
        return towns[1].getLevel(this.varName) >= 80;
      case 7:
        return towns[1].getLevel(this.varName) >= 100;
    }
    return false;
  },
  stats: {
    Con: 0.5,
    Cha: 0.3,
    Soul: 0.2,
  },
  manaCost() {
    return 1200;
  },
  visible() {
    return true;
  },
  unlocked() {
    return towns[1].getLevel('Shortcut') >= 20 && globalThis.stats.getSkillLevel('Magic') >= 40;
  },
  finish() {
    towns[1].finishProgress(this.varName, 50 * (1 + towns[1].getLevel('Shortcut') / 100));
    globalThis.saving.view.requestUpdate('adjustManaCost', 'Learn Alchemy');
    globalThis.saving.view.requestUpdate('adjustManaCost', 'Gather Herbs');
    globalThis.saving.view.requestUpdate('adjustManaCost', 'Practical Magic');
  },
});

Action.PracticalMagic = new Action('Practical Magic', {
  type: 'normal',
  expMult: 1.5,
  townNum: 1,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return globalThis.stats.getSkillLevel('Practical') >= 1;
      case 2:
        return globalThis.stats.getSkillLevel('Practical') >= 100;
      case 3:
        return globalThis.stats.getSkillLevel('Practical') >= 400;
    }
    return false;
  },
  stats: {
    Per: 0.3,
    Con: 0.2,
    Int: 0.5,
  },
  skills: {
    Practical: 100,
  },
  manaCost() {
    return Math.ceil(4000 * (1 - towns[1].getLevel('Hermit') * 0.005));
  },
  visible() {
    return towns[1].getLevel('Hermit') >= 10;
  },
  unlocked() {
    return towns[1].getLevel('Hermit') >= 20 && globalThis.stats.getSkillLevel('Magic') >= 50;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.saving.view.requestUpdate('adjustManaCost', 'Wild Mana');
    globalThis.saving.view.requestUpdate('adjustManaCost', 'Smash Pots');
    globalThis.saving.view.requestUpdate('adjustGoldCosts', null);
  },
});

Action.LearnAlchemy = new Action('Learn Alchemy', {
  type: 'normal',
  expMult: 1.5,
  townNum: 1,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return skills.Alchemy.exp >= 50;
      case 2:
        return globalThis.stats.getSkillLevel('Alchemy') >= 25;
      case 3:
        return globalThis.stats.getSkillLevel('Alchemy') >= 100;
      case 4:
        return globalThis.stats.getSkillLevel('Alchemy') >= 500;
    }
    return false;
  },
  stats: {
    Con: 0.3,
    Per: 0.1,
    Int: 0.6,
  },
  skills: {
    Magic: 50,
    Alchemy: 50,
  },
  canStart() {
    return resources.herbs >= 10;
  },
  cost() {
    globalThis.driver.addResource('herbs', -10);
  },
  manaCost() {
    return Math.ceil(5000 * (1 - towns[1].getLevel('Hermit') * 0.005));
  },
  visible() {
    return towns[1].getLevel('Hermit') >= 10;
  },
  unlocked() {
    return towns[1].getLevel('Hermit') >= 40 && globalThis.stats.getSkillLevel('Magic') >= 60;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.saving.view.requestUpdate('adjustExpGain', Action.MageLessons);
  },
});

Action.BrewPotions = new Action('Brew Potions', {
  type: 'normal',
  expMult: 1.5,
  townNum: 1,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.potionBrewed;
      case 2:
        return storyFlags.brewed50PotionsInALoop;
      case 3:
        return storyFlags.failedBrewPotions;
      case 4:
        return storyFlags.failedBrewPotionsNegativeRep;
    }
    return false;
  },
  stats: {
    Dex: 0.3,
    Int: 0.6,
    Luck: 0.1,
  },
  skills: {
    Magic: 50,
    Alchemy: 25,
  },
  canStart() {
    return resources.herbs >= 10 && resources.reputation >= 5;
  },
  cost() {
    globalThis.driver.addResource('herbs', -10);
  },
  manaCost() {
    return Math.ceil(4000);
  },
  visible() {
    return globalThis.stats.getSkillLevel('Alchemy') >= 1;
  },
  unlocked() {
    return globalThis.stats.getSkillLevel('Alchemy') >= 10;
  },
  finish() {
    globalThis.driver.addResource('potions', 1);
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.view.setStoryFlag('potionBrewed');
    if (resources.potions >= 50) {
      globalThis.view.setStoryFlag('brewed50PotionsInALoop');
    }
  },
});

Action.TrainDexterity = new Action('Train Dexterity', {
  type: 'normal',
  expMult: 4,
  townNum: 1,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.dexterityTrained;
      case 2:
        return storyFlags.dexterityTrained && globalThis.stats.getTalent('Dex') >= 100;
      case 3:
        return storyFlags.dexterityTrained && globalThis.stats.getTalent('Dex') >= 1000;
      case 4:
        return storyFlags.dexterityTrained && globalThis.stats.getTalent('Dex') >= 10000;
      case 5:
        return storyFlags.dexterityTrained && globalThis.stats.getTalent('Dex') >= 100000;
    }
    return false;
  },
  stats: {
    Dex: 0.8,
    Con: 0.2,
  },
  allowed() {
    return globalThis.saving.vals.trainingLimits;
  },
  manaCost() {
    return 2000;
  },
  visible() {
    return towns[1].getLevel('Forest') >= 20;
  },
  unlocked() {
    return towns[1].getLevel('Forest') >= 60;
  },
  finish() {
    globalThis.view.setStoryFlag('dexterityTrained');
  },
});

Action.TrainSpeed = new Action('Train Speed', {
  type: 'normal',
  expMult: 4,
  townNum: 1,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.speedTrained;
      case 2:
        return storyFlags.speedTrained && globalThis.stats.getTalent('Spd') >= 100;
      case 3:
        return storyFlags.speedTrained && globalThis.stats.getTalent('Spd') >= 1000;
      case 4:
        return storyFlags.speedTrained && globalThis.stats.getTalent('Spd') >= 10000;
      case 5:
        return storyFlags.speedTrained && globalThis.stats.getTalent('Spd') >= 100000;
    }
    return false;
  },
  stats: {
    Spd: 0.8,
    Con: 0.2,
  },
  allowed() {
    return globalThis.saving.vals.trainingLimits;
  },
  manaCost() {
    return 2000;
  },
  visible() {
    return towns[1].getLevel('Forest') >= 20;
  },
  unlocked() {
    return towns[1].getLevel('Forest') >= 80;
  },
  finish() {
    globalThis.view.setStoryFlag('speedTrained');
  },
});

Action.FollowFlowers = new Action('Follow Flowers', {
  type: 'progress',
  expMult: 1,
  townNum: 1,
  varName: 'Flowers',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[1].getLevel(this.varName) >= 1;
      case 2:
        return towns[1].getLevel(this.varName) >= 10;
      case 3:
        return towns[1].getLevel(this.varName) >= 20;
      case 4:
        return towns[1].getLevel(this.varName) >= 40;
      case 5:
        return towns[1].getLevel(this.varName) >= 60;
      case 6:
        return towns[1].getLevel(this.varName) >= 80;
      case 7:
        return towns[1].getLevel(this.varName) >= 100;
    }
    return false;
  },
  stats: {
    Per: 0.7,
    Con: 0.1,
    Spd: 0.2,
  },
  affectedBy: ['Buy Glasses'],
  manaCost() {
    return 300;
  },
  visible() {
    return towns[1].getLevel('Forest') >= 30;
  },
  unlocked() {
    return towns[1].getLevel('Forest') >= 50;
  },
  finish() {
    towns[1].finishProgress(this.varName, 100 * (resources.glasses ? 2 : 1));
  },
});

Action.BirdWatching = new Action('Bird Watching', {
  type: 'normal',
  expMult: 4,
  townNum: 1,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.birdsWatched;
      case 2:
        return storyFlags.birdsWatched && globalThis.stats.getTalent('Per') >= 100;
      case 3:
        return storyFlags.birdsWatched && globalThis.stats.getTalent('Per') >= 1000;
      case 4:
        return storyFlags.birdsWatched && globalThis.stats.getTalent('Per') >= 10000;
      case 5:
        return storyFlags.birdsWatched && globalThis.stats.getTalent('Per') >= 100000;
    }
    return false;
  },
  stats: {
    Per: 0.8,
    Int: 0.2,
  },
  affectedBy: ['Buy Glasses'],
  allowed() {
    return globalThis.saving.vals.trainingLimits;
  },
  manaCost() {
    return 2000;
  },
  canStart() {
    return resources.glasses;
  },
  visible() {
    return towns[1].getLevel('Flowers') >= 30;
  },
  unlocked() {
    return towns[1].getLevel('Flowers') >= 80;
  },
  finish() {
    globalThis.view.setStoryFlag('birdsWatched');
  },
});

Action.ClearThicket = new Action('Clear Thicket', {
  type: 'progress',
  expMult: 1,
  townNum: 1,
  varName: 'Thicket',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[1].getLevel(this.varName) >= 1;
      case 2:
        return towns[1].getLevel(this.varName) >= 10;
      case 3:
        return towns[1].getLevel(this.varName) >= 20;
      case 4:
        return towns[1].getLevel(this.varName) >= 40;
      case 5:
        return towns[1].getLevel(this.varName) >= 60;
      case 6:
        return towns[1].getLevel(this.varName) >= 80;
      case 7:
        return towns[1].getLevel(this.varName) >= 100;
    }
    return false;
  },
  stats: {
    Dex: 0.1,
    Str: 0.2,
    Per: 0.3,
    Con: 0.2,
    Spd: 0.2,
  },
  manaCost() {
    return 500;
  },
  visible() {
    return towns[1].getLevel('Flowers') >= 10;
  },
  unlocked() {
    return towns[1].getLevel('Flowers') >= 20;
  },
  finish() {
    towns[1].finishProgress(this.varName, 100);
  },
});

Action.TalkToWitch = new Action('Talk To Witch', {
  type: 'progress',
  expMult: 1,
  townNum: 1,
  varName: 'Witch',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[1].getLevel(this.varName) >= 1;
      case 2:
        return towns[1].getLevel(this.varName) >= 10;
      case 3:
        return towns[1].getLevel(this.varName) >= 20;
      case 4:
        return towns[1].getLevel(this.varName) >= 40;
      case 5:
        return towns[1].getLevel(this.varName) >= 50;
      case 6:
        return towns[1].getLevel(this.varName) >= 60;
      case 7:
        return towns[1].getLevel(this.varName) >= 80;
      case 8:
        return towns[1].getLevel(this.varName) >= 100;
    }
    return false;
  },
  stats: {
    Cha: 0.3,
    Int: 0.2,
    Soul: 0.5,
  },
  manaCost() {
    return 1500;
  },
  visible() {
    return towns[1].getLevel('Thicket') >= 20;
  },
  unlocked() {
    return towns[1].getLevel('Thicket') >= 60 && globalThis.stats.getSkillLevel('Magic') >= 80;
  },
  finish() {
    towns[1].finishProgress(this.varName, 100);
    globalThis.saving.view.requestUpdate('adjustManaCost', 'Dark Magic');
    globalThis.saving.view.requestUpdate('adjustManaCost', 'Dark Ritual');
  },
});

Action.DarkMagic = new Action('Dark Magic', {
  type: 'normal',
  expMult: 1.5,
  townNum: 1,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return globalThis.stats.getSkillLevel('Dark') >= 1;
      case 2:
        return globalThis.stats.getSkillLevel('Dark') >= 25;
      case 3:
        return globalThis.stats.getSkillLevel('Dark') >= 50;
      case 4:
        return globalThis.stats.getSkillLevel('Dark') >= 300;
    }
    return false;
  },
  stats: {
    Con: 0.2,
    Int: 0.5,
    Soul: 0.3,
  },
  skills: {
    Dark() {
      return Math.floor(100 * (1 + globalThis.stats.getBuffLevel('Ritual') / 100));
    },
  },
  manaCost() {
    return Math.ceil(6000 * (1 - towns[1].getLevel('Witch') * 0.005));
  },
  canStart() {
    return resources.reputation <= 0;
  },
  cost() {
    globalThis.driver.addResource('reputation', -1);
  },
  visible() {
    return towns[1].getLevel('Witch') >= 10;
  },
  unlocked() {
    return towns[1].getLevel('Witch') >= 20 && globalThis.stats.getSkillLevel('Magic') >= 100;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.saving.view.requestUpdate('adjustGoldCost', { varName: 'Pots', cost: Action.SmashPots.goldCost() });
    globalThis.saving.view.requestUpdate('adjustGoldCost', { varName: 'WildMana', cost: Action.WildMana.goldCost() });
  },
});

Action.DarkRitual = new MultipartAction('Dark Ritual', {
  type: 'multipart',
  expMult: 10,
  townNum: 1,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.darkRitualThirdSegmentReached;
      case 2:
        return globalThis.stats.getBuffLevel('Ritual') >= 1;
      case 3:
        return globalThis.stats.getBuffLevel('Ritual') >= 50;
      case 4:
        return globalThis.stats.getBuffLevel('Ritual') >= 300;
      case 5:
        return globalThis.stats.getBuffLevel('Ritual') >= 666;
    }
    return false;
  },
  stats: {
    Spd: 0.1,
    Int: 0.1,
    Soul: 0.8,
  },
  loopStats: ['Spd', 'Int', 'Soul'],
  manaCost() {
    return Math.ceil(50000 * (1 - towns[1].getLevel('Witch') * 0.005));
  },
  allowed() {
    return 1;
  },
  canStart(loopCounter = towns[this.townNum].DarkRitualLoopCounter) {
    return resources.reputation <= -5 && loopCounter === 0 && checkSoulstoneSac(this.goldCost()) &&
      globalThis.stats.getBuffLevel('Ritual') < globalThis.stats.getBuffCap('Ritual');
  },
  loopCost(segment) {
    return 1000000 * (segment * 2 + 1);
  },
  tickProgress(offset) {
    return globalThis.stats.getSkillLevel('Dark') / (1 - towns[1].getLevel('Witch') * 0.005);
  },
  grantsBuff: 'Ritual',
  loopsFinished() {
    const spent = sacrificeSoulstones(this.goldCost());
    globalThis.stats.addBuffAmt('Ritual', 1, this, 'soulstone', spent);
    globalThis.saving.view.requestUpdate('updateSoulstones', null);
    globalThis.saving.view.requestUpdate('adjustGoldCost', { varName: 'DarkRitual', cost: this.goldCost() });
  },
  getPartName() {
    return 'Perform Dark Ritual';
  },
  visible() {
    return towns[1].getLevel('Witch') >= 20;
  },
  unlocked() {
    return towns[1].getLevel('Witch') >= 50 && globalThis.stats.getSkillLevel('Dark') >= 50;
  },
  goldCost() {
    return Math.ceil(50 * (globalThis.stats.getBuffLevel('Ritual') + 1) * globalThis.stats.getSkillBonus('Commune'));
  },
  finish() {
    globalThis.saving.view.requestUpdate('updateBuff', 'Ritual');
    globalThis.saving.view.requestUpdate('adjustExpGain', Action.DarkMagic);
    if (towns[1].DarkRitualLoopCounter >= 0) globalThis.view.setStoryFlag('darkRitualThirdSegmentReached');
  },
});

function checkSoulstoneSac(amount) {
  let sum = 0;
  for (const stat in stats) {
    sum += stats[stat].soulstone;
  }
  return sum >= amount ? true : false;
}

let sacrificeSoulstones = sacrificeSoulstonesBySegments;

function sacrificeSoulstonesBySegments(
  amount,
  segments = 9,
  stonesSpent = {},
  sortedStats = Object.values(stats).sort(globalThis.stats.Stat.compareSoulstoneDescending),
) {
  // console.log(`Sacrificing ${amount} soulstones in ${segments} segments from stats: ${sortedStats.map(s=>`${s.name} ${s.soulstone}`).join(", ")}`, sortedStats);
  while (amount > 0) {
    // pull off the front of the list, since its sort order may change
    const highestSoulstoneStat = sortedStats.shift();
    const count = Math.min(Math.ceil(amount / segments), highestSoulstoneStat.soulstone); // don't spend more than ss we have in this stat (edge case for if you're spending all your ss)
    highestSoulstoneStat.soulstone -= count;
    stonesSpent[highestSoulstoneStat.name] ??= 0;
    stonesSpent[highestSoulstoneStat.name] += count;
    amount -= count;
    // console.log(`Sacrificed ${count} soulstones from ${highestSoulstoneStat.name}, now ${highestSoulstoneStat.soulstone}, ${amount} remaining to sacrifice`);
    // put it back in the list in the proper place
    if (highestSoulstoneStat.soulstone <= sortedStats.at(-1).soulstone) {
      // ...which is the end if the stats were roughly in sync
      sortedStats.push(highestSoulstoneStat);
    } else {
      // ... or somewhere in the list if they weren't
      sortedStats.splice(
        sortedStats.findIndex((s) => highestSoulstoneStat.soulstone > s.soulstone),
        0,
        highestSoulstoneStat,
      );
    }
    if (segments > 0) segments--; // 1 less segment remains, unless we hit the edge case above in the second-to-last stat
  }
  return stonesSpent;
}

function sacrificeSoulstonesProportional(amount, power = 1, stonesSpent = {}, sortedStats = Object.values(stats)) { //initializer does not sort because we do every loop anyway
  // extremely unlikely that we have to use more than one iteration for typical cases, but some powers can cause degenerate behavior
  while (amount > 0) {
    // (re-)sort stats by soulstone count of stats, high to low
    sortedStats.sort(globalThis.stats.Stat.compareSoulstoneDescending);
    // edge case: only handle stats with soulstones, remove those with 0
    while (sortedStats.at(-1).soulstone === 0) sortedStats.pop();
    // make parallel array of ss raised to specified power (negative powers would cause problems without the above filter)
    const stonePowers = sortedStats.map((s) => Math.pow(s.soulstone, power));
    let totalPower = stonePowers.reduce((a, b) => a + b);
    for (const [i, stat] of sortedStats.entries()) {
      // power ratio determines how much of amount we will consume.
      const ratio = i === sortedStats.length - 1
        ? 1 // force a ratio of 1 for the last stat to avoid floating-point error
        : stonePowers[i] / totalPower;
      // try to spend that much, limited by the amount of ss we have in this stat
      const count = Math.min(Math.round(amount * ratio), stat.soulstone);
      stat.soulstone -= count;
      stonesSpent[stat.name] ??= 0;
      stonesSpent[stat.name] += count;
      totalPower -= stonePowers[i];
      amount -= count;
      if (amount === 0) break;
    }
  }
  return stonesSpent;
}

function sacrificeSoulstonesToEquality(
  amount,
  allowedDifference = 0,
  stonesSpent = {},
  sortedStats = Object.values(stats).sort(globalThis.stats.Stat.compareSoulstoneDescending),
) {
  let maxSoulstone = sortedStats[0].soulstone; // what's the highest number of soulstones among stats?
  let minSoulstone = sortedStats.at(-1).soulstone; // and the lowest?
  let statsAtMaximum = 1; // how many stats have the same number of soulstones as the highest?

  while (amount > 0 && minSoulstone < maxSoulstone - allowedDifference) {
    // extend statsAtMaximum appropriately. we know there will be at least one stat not at maximum bc of the above check
    while (sortedStats[statsAtMaximum].soulstone === maxSoulstone) {
      statsAtMaximum++;
    }
    // find the second-highest count of soulstones between the remaining stats and whatever would satisfy our allowedDifference
    const submaxSoulstone = Math.max(sortedStats[statsAtMaximum].soulstone, minSoulstone + allowedDifference);

    // we can spend up to the difference between the highest number of soulstones and the submax, times the number of stats at that level
    const stonesAvailable = (maxSoulstone - submaxSoulstone) * statsAtMaximum;

    if (stonesAvailable >= amount) {
      // sacrifice all remaining soulstones equally from the highest stats
      return sacrificeSoulstonesBySegments(amount, statsAtMaximum, stonesSpent, sortedStats);
    } else {
      // sacrifice soulstones from the highest stats to bring them down to the submax level
      sacrificeSoulstonesBySegments(stonesAvailable, statsAtMaximum, stonesSpent, sortedStats);
      amount -= stonesAvailable;
      maxSoulstone = sortedStats[0].soulstone;
    }
  }
  if (amount > 0) {
    // all stats already close enough to equality, just sacrifice equal numbers from each stat
    sacrificeSoulstonesProportional(amount, 0, stonesSpent, sortedStats);
  }
  return stonesSpent;
}

Action.ContinueOn = new Action('Continue On', {
  type: 'normal',
  expMult: 2,
  townNum: 1,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return globalThis.saving.vals.townsUnlocked.includes(2);
    }
    return false;
  },
  stats: {
    Con: 0.4,
    Per: 0.2,
    Spd: 0.4,
  },
  allowed() {
    return globalThis.actions.getNumOnList('Open Portal') > 0 ? 2 : 1;
  },
  manaCost() {
    return Math.ceil(8000 - (60 * towns[1].getLevel('Shortcut')));
  },
  visible() {
    return true;
  },
  unlocked() {
    return true;
  },
  finish() {
    globalThis.driver.unlockTown(2);
  },
  story(completed) {
    globalThis.view.unlockGlobalStory(4);
  },
});

//====================================================================================================
//Zone 3 - Merchanton
//====================================================================================================
Action.ExploreCity = new Action('Explore City', {
  type: 'progress',
  expMult: 1,
  townNum: 2,
  varName: 'City',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[2].getLevel(this.varName) >= 1;
      case 2:
        return towns[2].getLevel(this.varName) >= 10;
      case 3:
        return towns[2].getLevel(this.varName) >= 20;
      case 4:
        return towns[2].getLevel(this.varName) >= 40;
      case 5:
        return towns[2].getLevel(this.varName) >= 50;
      case 6:
        return towns[2].getLevel(this.varName) >= 60;
      case 7:
        return towns[2].getLevel(this.varName) >= 80;
      case 8:
        return towns[2].getLevel(this.varName) >= 90;
      case 9:
        return towns[2].getLevel(this.varName) >= 100;
    }
    return false;
  },
  stats: {
    Con: 0.1,
    Per: 0.3,
    Cha: 0.2,
    Spd: 0.3,
    Luck: 0.1,
  },
  affectedBy: ['Buy Glasses'],
  manaCost() {
    return 750;
  },
  visible() {
    return true;
  },
  unlocked() {
    return true;
  },
  finish() {
    towns[2].finishProgress(this.varName, 100 * (resources.glasses ? 2 : 1));
  },
});
function adjustSuckers() {
  let town = towns[2];
  let baseGamble = Math.round(town.getLevel('City') * 3 * globalThis.prestige.adjustContentFromPrestige());
  town.totalGamble = Math.floor(
    baseGamble * globalThis.stats.getSkillMod('Spatiomancy', 600, 800, .5) +
      baseGamble * globalThis.stats.getSurveyBonus(town),
  );
}

Action.Gamble = new Action('Gamble', {
  type: 'limited',
  expMult: 2,
  townNum: 2,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[2][`checked${this.varName}`] >= 1;
      case 2:
        return towns[2][`good${this.varName}`] >= 1;
      case 3:
        return towns[2][`good${this.varName}`] >= 30;
      case 4:
        return towns[2][`good${this.varName}`] >= 75;
      case 5:
        return storyFlags.failedGamble;
      case 6:
        return storyFlags.failedGambleLowMoney;
    }
    return false;
  },
  stats: {
    Cha: 0.2,
    Luck: 0.8,
  },
  canStart() {
    return resources.gold >= 20 && resources.reputation >= -5;
  },
  cost() {
    globalThis.driver.addResource('gold', -20);
    globalThis.driver.addResource('reputation', -1);
  },
  manaCost() {
    return 1000;
  },
  visible() {
    return true;
  },
  unlocked() {
    return towns[2].getLevel('City') >= 10;
  },
  finish() {
    towns[2].finishRegular(this.varName, 10, () => {
      let goldGain = Math.floor(60 * globalThis.stats.getSkillBonus('Thievery'));
      globalThis.driver.addResource('gold', goldGain);
      return 60;
    });
  },
});

Action.GetDrunk = new Action('Get Drunk', {
  type: 'progress',
  expMult: 3,
  townNum: 2,
  varName: 'Drunk',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[2].getLevel(this.varName) >= 1;
      case 2:
        return towns[2].getLevel(this.varName) >= 10;
      case 3:
        return towns[2].getLevel(this.varName) >= 20;
      case 4:
        return towns[2].getLevel(this.varName) >= 30;
      case 5:
        return towns[2].getLevel(this.varName) >= 40;
      case 6:
        return towns[2].getLevel(this.varName) >= 60;
      case 7:
        return towns[2].getLevel(this.varName) >= 80;
      case 8:
        return towns[2].getLevel(this.varName) >= 100;
    }
    return false;
  },
  stats: {
    Str: 0.1,
    Cha: 0.5,
    Con: 0.2,
    Soul: 0.2,
  },
  canStart() {
    return resources.reputation >= -3;
  },
  cost() {
    globalThis.driver.addResource('reputation', -1);
  },
  manaCost() {
    return 1000;
  },
  visible() {
    return true;
  },
  unlocked() {
    return towns[2].getLevel('City') >= 20;
  },
  finish() {
    towns[2].finishProgress(this.varName, 100);
  },
});

Action.BuyManaZ3 = new Action('Buy Mana Z3', {
  type: 'normal',
  expMult: 1,
  townNum: 2,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.manaZ3Bought;
    }
  },
  stats: {
    Cha: 0.7,
    Int: 0.2,
    Luck: 0.1,
  },
  manaCost() {
    return 100;
  },
  canStart() {
    return !globalThis.saving.vals.portalUsed;
  },
  visible() {
    return true;
  },
  unlocked() {
    return true;
  },
  goldCost() {
    return Math.floor(
      50 * globalThis.stats.getSkillBonus('Mercantilism') * globalThis.prestige.adjustGoldCostFromPrestige(),
    );
  },
  finish() {
    globalThis.driver.addMana(resources.gold * this.goldCost());
    globalThis.view.setStoryFlag('manaZ3Bought');
    globalThis.driver.resetResource('gold');
  },
});

Action.SellPotions = new Action('Sell Potions', {
  type: 'normal',
  expMult: 1,
  townNum: 2,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.potionSold;
      case 2:
        return storyFlags.sell20PotionsInALoop;
      case 3:
        return storyFlags.sellPotionFor100Gold;
      case 4:
        return storyFlags.sellPotionFor1kGold;
    }
    return false;
  },
  stats: {
    Cha: 0.7,
    Int: 0.2,
    Luck: 0.1,
  },
  manaCost() {
    return 1000;
  },
  visible() {
    return true;
  },
  unlocked() {
    return true;
  },
  finish() {
    if (resources.potions >= 20) globalThis.view.setStoryFlag('sell20PotionsInALoop');
    globalThis.driver.addResource('gold', resources.potions * globalThis.stats.getSkillLevel('Alchemy'));
    globalThis.driver.resetResource('potions');
    globalThis.view.setStoryFlag('potionSold');
    if (globalThis.stats.getSkillLevel('Alchemy') >= 100) globalThis.view.setStoryFlag('sellPotionFor100Gold');
    if (globalThis.stats.getSkillLevel('Alchemy') >= 1000) globalThis.view.setStoryFlag('sellPotionFor1kGold');
  },
});

// the guild actions are somewhat unique in that they override the default segment naming
// with their own segment names, and so do not use the segmentNames inherited from
// MultipartAction
Action.AdventureGuild = new MultipartAction('Adventure Guild', {
  type: 'multipart',
  expMult: 1,
  townNum: 2,
  varName: 'AdvGuild',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.advGuildTestsTaken;
      case 2:
        return storyFlags.advGuildRankEReached;
      case 3:
        return storyFlags.advGuildRankDReached;
      case 4:
        return storyFlags.advGuildRankCReached;
      case 5:
        return storyFlags.advGuildRankBReached;
      case 6:
        return storyFlags.advGuildRankAReached;
      case 7:
        return storyFlags.advGuildRankSReached;
      case 8:
        return storyFlags.advGuildRankUReached;
      case 9:
        return storyFlags.advGuildRankGodlikeReached;
    }
    return false;
  },
  stats: {
    Str: 0.4,
    Dex: 0.3,
    Con: 0.3,
  },
  loopStats: ['Str', 'Dex', 'Con'],
  manaCost() {
    return 3000;
  },
  allowed() {
    return 1;
  },
  canStart() {
    return globalThis.saving.vals.guild === '';
  },
  loopCost(segment, loopCounter = towns[2][`${this.varName}LoopCounter`]) {
    return globalThis.helpers.precision3(Math.pow(1.2, loopCounter + segment)) * 5e6;
  },
  tickProgress(offset, loopCounter, totalCompletions = towns[2][`total${this.varName}`]) {
    return (globalThis.stats.getSkillLevel('Magic') / 2 +
      globalThis.stats.getSelfCombat()) *
      Math.sqrt(1 + totalCompletions / 1000);
  },
  loopsFinished() {
    if (globalThis.saving.vals.curAdvGuildSegment >= 0) globalThis.view.setStoryFlag('advGuildRankEReached');
    if (globalThis.saving.vals.curAdvGuildSegment >= 3) globalThis.view.setStoryFlag('advGuildRankDReached');
    if (globalThis.saving.vals.curAdvGuildSegment >= 6) globalThis.view.setStoryFlag('advGuildRankCReached');
    if (globalThis.saving.vals.curAdvGuildSegment >= 9) globalThis.view.setStoryFlag('advGuildRankBReached');
    if (globalThis.saving.vals.curAdvGuildSegment >= 12) globalThis.view.setStoryFlag('advGuildRankAReached');
    if (globalThis.saving.vals.curAdvGuildSegment >= 15) globalThis.view.setStoryFlag('advGuildRankSReached');
    if (globalThis.saving.vals.curAdvGuildSegment >= 27) globalThis.view.setStoryFlag('advGuildRankUReached');
    if (globalThis.saving.vals.curAdvGuildSegment >= 39) globalThis.view.setStoryFlag('advGuildRankGodlikeReached');
  },
  segmentFinished() {
    globalThis.saving.vals.curAdvGuildSegment++;
    globalThis.driver.addMana(200);
  },
  getPartName() {
    return `Rank ${getAdvGuildRank().name}`;
  },
  getSegmentName(segment) {
    return `Rank ${getAdvGuildRank(segment % 3).name}`;
  },
  visible() {
    return towns[2].getLevel('Drunk') >= 5;
  },
  unlocked() {
    return towns[2].getLevel('Drunk') >= 20;
  },
  finish() {
    globalThis.saving.vals.guild = 'Adventure';
    globalThis.view.setStoryFlag('advGuildTestsTaken');
  },
});
function getAdvGuildRank(offset) {
  let name = [
    'F',
    'E',
    'D',
    'C',
    'B',
    'A',
    'S',
    'SS',
    'SSS',
    'SSSS',
    'U',
    'UU',
    'UUU',
    'UUUU',
  ][Math.floor(globalThis.saving.vals.curAdvGuildSegment / 3 + 0.00001)];

  const segment = (offset === undefined ? 0 : offset - (globalThis.saving.vals.curAdvGuildSegment % 3)) +
    globalThis.saving.vals.curAdvGuildSegment;
  let bonus = globalThis.helpers.precision3(1 + segment / 20 + Math.pow(segment, 2) / 300);
  if (name) {
    if (offset === undefined) {
      name += ['-', '', '+'][globalThis.saving.vals.curAdvGuildSegment % 3];
    } else {
      name += ['-', '', '+'][offset % 3];
    }
  } else {
    name = 'Godlike';
    bonus = 10;
  }
  name += `, Mult x${bonus}`;
  return { name, bonus };
}

Action.GatherTeam = new Action('Gather Team', {
  type: 'normal',
  expMult: 3,
  townNum: 2,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.teammateGathered;
      case 2:
        return storyFlags.fullParty;
      case 3:
        return storyFlags.failedGatherTeam;
    }
    return false;
  },
  stats: {
    Per: 0.2,
    Cha: 0.5,
    Int: 0.2,
    Luck: 0.1,
  },
  affectedBy: ['Adventure Guild'],
  allowed() {
    return 5 + Math.floor(globalThis.stats.getSkillLevel('Leadership') / 100);
  },
  canStart() {
    return globalThis.saving.vals.guild === 'Adventure' && resources.gold >= (resources.teamMembers + 1) * 100;
  },
  cost() {
    // cost comes after finish
    globalThis.driver.addResource('gold', -(resources.teamMembers) * 100);
  },
  manaCost() {
    return 2000;
  },
  visible() {
    return towns[2].getLevel('Drunk') >= 10;
  },
  unlocked() {
    return towns[2].getLevel('Drunk') >= 20;
  },
  finish() {
    globalThis.driver.addResource('teamMembers', 1);
    globalThis.view.setStoryFlag('teammateGathered');
    if (resources.teamMembers >= 5) globalThis.view.setStoryFlag('fullParty');
  },
});

Action.LargeDungeon = new DungeonAction('Large Dungeon', 1, {
  type: 'multipart',
  expMult: 2,
  townNum: 2,
  varName: 'LDungeon',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.largeDungeonAttempted;
      case 2:
        return towns[2][`total${this.varName}`] >= 2000;
      case 3:
        return towns[2][`total${this.varName}`] >= 10000;
      case 4:
        return towns[2][`total${this.varName}`] >= 20000;
      case 5:
        return storyFlags.clearLDungeon;
    }
    return false;
  },
  stats: {
    Str: 0.2,
    Dex: 0.2,
    Con: 0.2,
    Cha: 0.3,
    Luck: 0.1,
  },
  skills: {
    Combat: 15,
    Magic: 15,
  },
  loopStats: ['Cha', 'Spd', 'Str', 'Cha', 'Dex', 'Dex', 'Str'],
  affectedBy: ['Gather Team'],
  manaCost() {
    return 6000;
  },
  canStart(loopCounter = towns[this.townNum].LDungeonLoopCounter) {
    const curFloor = Math.floor(loopCounter / this.segments + 0.0000001);
    return resources.teamMembers >= 1 && curFloor < globalThis.saving.vals.dungeons[this.dungeonNum].length;
  },
  loopCost(segment, loopCounter = towns[this.townNum].LDungeonLoopCounter) {
    return globalThis.helpers.precision3(
      Math.pow(3, Math.floor((loopCounter + segment) / this.segments + 0.0000001)) * 5e5,
    );
  },
  tickProgress(offset, loopCounter = towns[this.townNum].LDungeonLoopCounter) {
    const floor = Math.floor(loopCounter / this.segments + 0.0000001);
    return (globalThis.stats.getTeamCombat() + globalThis.stats.getSkillLevel('Magic')) *
      Math.sqrt(1 + globalThis.saving.vals.dungeons[this.dungeonNum][floor].completed / 200);
  },
  loopsFinished(loopCounter = towns[this.townNum].LDungeonLoopCounter) {
    const curFloor = Math.floor(loopCounter / this.segments + 0.0000001 - 1);
    this.finishDungeon(curFloor);
  },
  visible() {
    return towns[2].getLevel('Drunk') >= 5;
  },
  unlocked() {
    return towns[2].getLevel('Drunk') >= 20;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.view.setStoryFlag('largeDungeonAttempted');
    if (towns[2].LDungeonLoopCounter >= 63) globalThis.view.setStoryFlag('clearLDungeon');
  },
});

Action.CraftingGuild = new MultipartAction('Crafting Guild', {
  type: 'multipart',
  expMult: 1,
  townNum: 2,
  varName: 'CraftGuild',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.craftGuildTestsTaken;
      case 2:
        return storyFlags.craftGuildRankEReached;
      case 3:
        return storyFlags.craftGuildRankDReached;
      case 4:
        return storyFlags.craftGuildRankCReached;
      case 5:
        return storyFlags.craftGuildRankBReached;
      case 6:
        return storyFlags.craftGuildRankAReached;
      case 7:
        return storyFlags.craftGuildRankSReached;
      case 8:
        return storyFlags.craftGuildRankUReached;
      case 9:
        return storyFlags.craftGuildRankGodlikeReached;
    }
    return false;
  },
  stats: {
    Dex: 0.3,
    Per: 0.3,
    Int: 0.4,
  },
  skills: {
    Crafting: 50,
  },
  loopStats: ['Int', 'Per', 'Dex'],
  manaCost() {
    return 3000;
  },
  allowed() {
    return 1;
  },
  canStart() {
    return globalThis.saving.vals.guild === '';
  },
  loopCost(segment, loopCounter = towns[2][`${this.varName}LoopCounter`]) {
    return globalThis.helpers.precision3(Math.pow(1.2, loopCounter + segment)) * 2e6;
  },
  tickProgress(_offset, _loopCounter, totalCompletions = towns[2][`total${this.varName}`]) {
    return (globalThis.stats.getSkillLevel('Magic') / 2 +
      globalThis.stats.getSkillLevel('Crafting')) *
      Math.sqrt(1 + totalCompletions / 1000);
  },
  loopsFinished() {
    if (globalThis.saving.vals.curCraftGuildSegment >= 0) globalThis.view.setStoryFlag('craftGuildRankEReached');
    if (globalThis.saving.vals.curCraftGuildSegment >= 3) globalThis.view.setStoryFlag('craftGuildRankDReached');
    if (globalThis.saving.vals.curCraftGuildSegment >= 6) globalThis.view.setStoryFlag('craftGuildRankCReached');
    if (globalThis.saving.vals.curCraftGuildSegment >= 9) globalThis.view.setStoryFlag('craftGuildRankBReached');
    if (globalThis.saving.vals.curCraftGuildSegment >= 12) globalThis.view.setStoryFlag('craftGuildRankAReached');
    if (globalThis.saving.vals.curCraftGuildSegment >= 15) globalThis.view.setStoryFlag('craftGuildRankSReached');
    if (globalThis.saving.vals.curCraftGuildSegment >= 27) globalThis.view.setStoryFlag('craftGuildRankUReached');
    if (globalThis.saving.vals.curCraftGuildSegment >= 39) globalThis.view.setStoryFlag('craftGuildRankGodlikeReached');
  },
  segmentFinished() {
    globalThis.saving.vals.curCraftGuildSegment++;
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.driver.addResource('gold', 10);
  },
  getPartName() {
    return `Rank ${getCraftGuildRank().name}`;
  },
  getSegmentName(segment) {
    return `Rank ${getCraftGuildRank(segment % 3).name}`;
  },
  visible() {
    return towns[2].getLevel('Drunk') >= 5;
  },
  unlocked() {
    return towns[2].getLevel('Drunk') >= 30;
  },
  finish() {
    globalThis.saving.vals.guild = 'Crafting';
    globalThis.view.setStoryFlag('craftGuildTestsTaken');
  },
});
function getCraftGuildRank(offset) {
  let name = [
    'F',
    'E',
    'D',
    'C',
    'B',
    'A',
    'S',
    'SS',
    'SSS',
    'SSSS',
    'U',
    'UU',
    'UUU',
    'UUUU',
  ][Math.floor(globalThis.saving.vals.curCraftGuildSegment / 3 + 0.00001)];

  const segment = (offset === undefined ? 0 : offset - (globalThis.saving.vals.curCraftGuildSegment % 3)) +
    globalThis.saving.vals.curCraftGuildSegment;
  let bonus = globalThis.helpers.precision3(1 + segment / 20 + Math.pow(segment, 2) / 300);
  if (name) {
    if (offset === undefined) {
      name += ['-', '', '+'][globalThis.saving.vals.curCraftGuildSegment % 3];
    } else {
      name += ['-', '', '+'][offset % 3];
    }
  } else {
    name = 'Godlike';
    bonus = 10;
  }
  name += `, Mult x${bonus}`;
  return { name, bonus };
}

Action.CraftArmor = new Action('Craft Armor', {
  type: 'normal',
  expMult: 1,
  townNum: 2,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.armorCrafted;
      case 2:
        return storyFlags.craft10Armor;
      case 3:
        return storyFlags.craft20Armor;
      case 4:
        return storyFlags.failedCraftArmor;
    }
    return false;
  },
  stats: {
    Str: 0.1,
    Dex: 0.3,
    Con: 0.3,
    Int: 0.3,
  },
  // this.affectedBy = ["Crafting Guild"];
  canStart() {
    return resources.hide >= 2;
  },
  cost() {
    globalThis.driver.addResource('hide', -2);
  },
  manaCost() {
    return 1000;
  },
  visible() {
    return towns[2].getLevel('Drunk') >= 15;
  },
  unlocked() {
    return towns[2].getLevel('Drunk') >= 30;
  },
  finish() {
    globalThis.driver.addResource('armor', 1);
    globalThis.view.setStoryFlag('armorCrafted');
    if (resources.armor >= 10) globalThis.view.setStoryFlag('craft10Armor');
    if (resources.armor >= 25) globalThis.view.setStoryFlag('craft20Armor');
  },
});

Action.Apprentice = new Action('Apprentice', {
  type: 'progress',
  expMult: 1.5,
  townNum: 2,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[2].getLevel(this.varName) >= 1;
      case 2:
        return towns[2].getLevel(this.varName) >= 10;
      case 3:
        return towns[2].getLevel(this.varName) >= 20;
      case 4:
        return towns[2].getLevel(this.varName) >= 40;
      case 5:
        return towns[2].getLevel(this.varName) >= 60;
      case 6:
        return towns[2].getLevel(this.varName) >= 80;
      case 7:
        return towns[2].getLevel(this.varName) >= 100;
    }
    return false;
  },
  stats: {
    Dex: 0.2,
    Int: 0.4,
    Cha: 0.4,
  },
  skills: {
    Crafting() {
      return 10 * (1 + towns[2].getLevel('Apprentice') / 100);
    },
  },
  affectedBy: ['Crafting Guild'],
  canStart() {
    return globalThis.saving.vals.guild === 'Crafting';
  },
  manaCost() {
    return 2000;
  },
  visible() {
    return towns[2].getLevel('Drunk') >= 20;
  },
  unlocked() {
    return towns[2].getLevel('Drunk') >= 40;
  },
  finish() {
    towns[2].finishProgress(this.varName, 30 * getCraftGuildRank().bonus);
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.saving.view.requestUpdate('adjustExpGain', Action.Apprentice);
  },
});

Action.Mason = new Action('Mason', {
  type: 'progress',
  expMult: 2,
  townNum: 2,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[2].getLevel(this.varName) >= 1;
      case 2:
        return towns[2].getLevel(this.varName) >= 10;
      case 3:
        return towns[2].getLevel(this.varName) >= 20;
      case 4:
        return towns[2].getLevel(this.varName) >= 40;
      case 5:
        return towns[2].getLevel(this.varName) >= 60;
      case 6:
        return towns[2].getLevel(this.varName) >= 80;
      case 7:
        return towns[2].getLevel(this.varName) >= 100;
    }
    return false;
  },
  stats: {
    Dex: 0.2,
    Int: 0.5,
    Cha: 0.3,
  },
  skills: {
    Crafting() {
      return 20 * (1 + towns[2].getLevel('Mason') / 100);
    },
  },
  affectedBy: ['Crafting Guild'],
  canStart() {
    return globalThis.saving.vals.guild === 'Crafting';
  },
  manaCost() {
    return 2000;
  },
  visible() {
    return towns[2].getLevel('Drunk') >= 40;
  },
  unlocked() {
    return towns[2].getLevel('Drunk') >= 60 && towns[2].getLevel('Apprentice') >= 100;
  },
  finish() {
    towns[2].finishProgress(this.varName, 20 * getCraftGuildRank().bonus);
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.saving.view.requestUpdate('adjustExpGain', Action.Mason);
  },
});

Action.Architect = new Action('Architect', {
  type: 'progress',
  expMult: 2.5,
  townNum: 2,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[2].getLevel(this.varName) >= 1;
      case 2:
        return towns[2].getLevel(this.varName) >= 10;
      case 3:
        return towns[2].getLevel(this.varName) >= 20;
      case 4:
        return towns[2].getLevel(this.varName) >= 40;
      case 5:
        return towns[2].getLevel(this.varName) >= 60;
      case 6:
        return towns[2].getLevel(this.varName) >= 80;
      case 7:
        return towns[2].getLevel(this.varName) >= 100;
    }
    return false;
  },
  stats: {
    Dex: 0.2,
    Int: 0.6,
    Cha: 0.2,
  },
  skills: {
    Crafting() {
      return 40 * (1 + towns[2].getLevel('Architect') / 100);
    },
  },
  affectedBy: ['Crafting Guild'],
  canStart() {
    return globalThis.saving.vals.guild === 'Crafting';
  },
  manaCost() {
    return 2000;
  },
  visible() {
    return towns[2].getLevel('Drunk') >= 60;
  },
  unlocked() {
    return towns[2].getLevel('Drunk') >= 80 && towns[2].getLevel('Mason') >= 100;
  },
  finish() {
    towns[2].finishProgress(this.varName, 10 * getCraftGuildRank().bonus);
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.saving.view.requestUpdate('adjustExpGain', Action.Architect);
  },
});

Action.ReadBooks = new Action('Read Books', {
  type: 'normal',
  expMult: 4,
  townNum: 2,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.booksRead;
      case 2:
        return storyFlags.booksRead && globalThis.stats.getTalent('Int') >= 100;
      case 3:
        return storyFlags.booksRead && globalThis.stats.getTalent('Int') >= 1000;
      case 4:
        return storyFlags.booksRead && globalThis.stats.getTalent('Int') >= 10000;
      case 5:
        return storyFlags.booksRead && globalThis.stats.getTalent('Int') >= 100000;
    }
    return false;
  },
  stats: {
    Int: 0.8,
    Soul: 0.2,
  },
  affectedBy: ['Buy Glasses'],
  allowed() {
    return globalThis.saving.vals.trainingLimits;
  },
  canStart() {
    return resources.glasses;
  },
  manaCost() {
    return 2000;
  },
  visible() {
    return towns[2].getLevel('City') >= 5;
  },
  unlocked() {
    return towns[2].getLevel('City') >= 50;
  },
  finish() {
    globalThis.view.setStoryFlag('booksRead');
  },
});

Action.BuyPickaxe = new Action('Buy Pickaxe', {
  type: 'normal',
  expMult: 1,
  townNum: 2,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.pickaxeBought;
    }
    return false;
  },
  stats: {
    Cha: 0.8,
    Int: 0.1,
    Spd: 0.1,
  },
  allowed() {
    return 1;
  },
  canStart() {
    return resources.gold >= 200;
  },
  cost() {
    globalThis.driver.addResource('gold', -200);
  },
  manaCost() {
    return 3000;
  },
  visible() {
    return towns[2].getLevel('City') >= 60;
  },
  unlocked() {
    return towns[2].getLevel('City') >= 90;
  },
  finish() {
    globalThis.driver.addResource('pickaxe', true);
    globalThis.view.setStoryFlag('pickaxeBought');
  },
});

Action.HeroesTrial = new TrialAction('Heroes Trial', 0, {
  //50 floors
  type: 'multipart',
  expMult: 0.2,
  townNum: 2,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.heroTrial1Done;
      case 2:
        return storyFlags.heroTrial10Done;
      case 3:
        return storyFlags.heroTrial25Done;
      case 4:
        return storyFlags.heroTrial50Done;
    }
  },
  varName: 'HTrial',
  stats: {
    Dex: 0.11,
    Str: 0.11,
    Con: 0.11,
    Spd: 0.11,
    Per: 0.11,
    Cha: 0.11,
    Int: 0.11,
    Luck: 0.11,
    Soul: 0.11,
  },
  skills: {
    Combat: 500,
    Pyromancy: 100,
    Restoration: 100,
  },
  loopStats: ['Dex', 'Str', 'Con', 'Spd', 'Per', 'Cha', 'Int', 'Luck', 'Soul'],
  affectedBy: ['Team'],
  baseScaling: 2,
  exponentScaling: 1e8,
  manaCost() {
    return 100000;
  },
  canStart() {
    return this.currentFloor() < globalThis.saving.trialFloors[this.trialNum];
  },
  baseProgress() {
    return globalThis.stats.getTeamCombat();
  },
  grantsBuff: 'Heroism',
  floorReward() {
    if (this.currentFloor() >= globalThis.stats.getBuffLevel('Heroism')) {
      globalThis.stats.addBuffAmt('Heroism', 1, this);
    }
    if (this.currentFloor() >= 1) globalThis.view.setStoryFlag('heroTrial1Done');
    if (this.currentFloor() >= 10) globalThis.view.setStoryFlag('heroTrial10Done');
    if (this.currentFloor() >= 25) globalThis.view.setStoryFlag('heroTrial25Done');
    if (this.currentFloor() >= 50) globalThis.view.setStoryFlag('heroTrial50Done');
  },
  visible() {
    return towns[this.townNum].getLevel('Survey') >= 100;
  },
  unlocked() {
    return towns[this.townNum].getLevel('Survey') >= 100;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.saving.view.requestUpdate('updateBuff', 'Heroism');
  },
});

Action.StartTrek = new Action('Start Trek', {
  type: 'normal',
  expMult: 2,
  townNum: 2,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return globalThis.saving.vals.townsUnlocked.includes(3);
    }
    return false;
  },
  stats: {
    Con: 0.7,
    Per: 0.2,
    Spd: 0.1,
  },
  allowed() {
    return globalThis.actions.getNumOnList('Open Portal') > 0 ? 2 : 1;
  },
  manaCost() {
    return Math.ceil(12000);
  },
  visible() {
    return towns[2].getLevel('City') >= 30;
  },
  unlocked() {
    return towns[2].getLevel('City') >= 60;
  },
  finish() {
    globalThis.driver.unlockTown(3);
  },
  story(completed) {
    globalThis.view.unlockGlobalStory(5);
  },
});

Action.Underworld = new Action('Underworld', {
  type: 'normal',
  expMult: 1,
  townNum: 2,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.charonPaid;
    }
  },
  stats: {
    Cha: 0.5,
    Per: 0.5,
  },
  allowed() {
    return 1;
  },
  cost() {
    globalThis.driver.addResource('gold', -500);
  },
  manaCost() {
    return 50000;
  },
  canStart() {
    return resources.gold >= 500;
  },
  visible() {
    return getExploreProgress() > 25;
  },
  unlocked() {
    return getExploreProgress() >= 50;
  },
  goldCost() {
    return 500;
  },
  finish() {
    globalThis.driver.unlockTown(7);
    globalThis.view.setStoryFlag('charonPaid');
  },
});

//====================================================================================================
//Zone 4 - Mt Olympus
//====================================================================================================

Action.ClimbMountain = new Action('Climb Mountain', {
  type: 'progress',
  expMult: 1,
  townNum: 3,
  varName: 'Mountain',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[3].getLevel(this.varName) >= 1;
      case 2:
        return towns[3].getLevel(this.varName) >= 10;
      case 3:
        return towns[3].getLevel(this.varName) >= 20;
      case 4:
        return towns[3].getLevel(this.varName) >= 40;
      case 5:
        return towns[3].getLevel(this.varName) >= 60;
      case 6:
        return towns[3].getLevel(this.varName) >= 80;
      case 7:
        return towns[3].getLevel(this.varName) >= 100;
    }
    return false;
  },
  stats: {
    Dex: 0.1,
    Str: 0.2,
    Con: 0.4,
    Per: 0.2,
    Spd: 0.1,
  },
  affectedBy: ['Buy Pickaxe'],
  manaCost() {
    return 800;
  },
  visible() {
    return true;
  },
  unlocked() {
    return true;
  },
  finish() {
    towns[3].finishProgress(this.varName, 100 * (resources.pickaxe ? 2 : 1));
  },
});

Action.ManaGeyser = new Action('Mana Geyser', {
  type: 'limited',
  expMult: 1,
  townNum: 3,
  varName: 'Geysers',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[3][`good${this.varName}`] >= 1;
      case 2:
        return towns[3][`good${this.varName}`] >= 10;
      case 3:
        return towns[3][`good${this.varName}`] >= 15;
    }
    return false;
  },
  stats: {
    Str: 0.6,
    Per: 0.3,
    Int: 0.1,
  },
  affectedBy: ['Buy Pickaxe'],
  manaCost() {
    return Math.ceil(2000 * globalThis.stats.getSkillBonus('Spatiomancy'));
  },
  canStart() {
    return resources.pickaxe;
  },
  visible() {
    return true;
  },
  unlocked() {
    return towns[3].getLevel('Mountain') >= 2;
  },
  finish() {
    towns[3].finishRegular(this.varName, 100, () => {
      globalThis.driver.addMana(5000);
      return 5000;
    });
  },
});
function adjustGeysers() {
  let town = towns[3];
  let baseGeysers = Math.round(town.getLevel('Mountain') * 10 * globalThis.prestige.adjustContentFromPrestige());
  town.totalGeysers = Math.round(baseGeysers + baseGeysers * globalThis.stats.getSurveyBonus(town));
}

Action.DecipherRunes = new Action('Decipher Runes', {
  type: 'progress',
  expMult: 1,
  townNum: 3,
  varName: 'Runes',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[3].getLevel(this.varName) >= 1;
      case 2:
        return towns[3].getLevel(this.varName) >= 10;
      case 3:
        return towns[3].getLevel(this.varName) >= 20;
      case 4:
        return towns[3].getLevel(this.varName) >= 30;
      case 5:
        return towns[3].getLevel(this.varName) >= 40;
      case 6:
        return towns[3].getLevel(this.varName) >= 60;
      case 7:
        return towns[3].getLevel(this.varName) >= 80;
      case 8:
        return towns[3].getLevel(this.varName) >= 100;
    }
    return false;
  },
  stats: {
    Per: 0.3,
    Int: 0.7,
  },
  affectedBy: ['Buy Glasses'],
  manaCost() {
    return 1200;
  },
  visible() {
    return towns[3].getLevel('Mountain') >= 2;
  },
  unlocked() {
    return towns[3].getLevel('Mountain') >= 20;
  },
  finish() {
    towns[3].finishProgress(this.varName, 100 * (resources.glasses ? 2 : 1));
    globalThis.saving.view.requestUpdate('adjustManaCost', 'Chronomancy');
    globalThis.saving.view.requestUpdate('adjustManaCost', 'Pyromancy');
  },
});

Action.Chronomancy = new Action('Chronomancy', {
  type: 'normal',
  expMult: 2,
  townNum: 3,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return globalThis.stats.getSkillLevel('Chronomancy') >= 1;
      case 2:
        return globalThis.stats.getSkillLevel('Chronomancy') >= 50;
      case 3:
        return globalThis.stats.getSkillLevel('Chronomancy') >= 100;
      case 4:
        return globalThis.stats.getSkillLevel('Chronomancy') >= 1000;
    }
    return false;
  },
  stats: {
    Soul: 0.1,
    Spd: 0.3,
    Int: 0.6,
  },
  skills: {
    Chronomancy: 100,
  },
  manaCost() {
    return Math.ceil(10000 * (1 - towns[3].getLevel('Runes') * 0.005));
  },
  visible() {
    return towns[3].getLevel('Runes') >= 8;
  },
  unlocked() {
    return towns[3].getLevel('Runes') >= 30 && globalThis.stats.getSkillLevel('Magic') >= 150;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
  },
});

Action.LoopingPotion = new Action('Looping Potion', {
  type: 'normal',
  expMult: 2,
  townNum: 3,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.loopingPotionMade;
    }
    return false;
  },
  stats: {
    Dex: 0.2,
    Int: 0.7,
    Soul: 0.1,
  },
  skills: {
    Alchemy: 100,
  },
  canStart() {
    return resources.herbs >= 400;
  },
  cost() {
    globalThis.driver.addResource('herbs', -400);
  },
  manaCost() {
    return Math.ceil(30000);
  },
  visible() {
    return globalThis.stats.getSkillLevel('Spatiomancy') >= 1;
  },
  unlocked() {
    return globalThis.stats.getSkillLevel('Alchemy') >= 200;
  },
  finish() {
    globalThis.driver.addResource('loopingPotion', true);
    globalThis.stats.handleSkillExp(this.skills);
  },
  story(completed) {
    globalThis.view.setStoryFlag('loopingPotionMade');
    globalThis.view.unlockGlobalStory(9);
  },
});

Action.Pyromancy = new Action('Pyromancy', {
  type: 'normal',
  expMult: 2,
  townNum: 3,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return globalThis.stats.getSkillLevel('Pyromancy') >= 1;
      case 2:
        return globalThis.stats.getSkillLevel('Pyromancy') >= 50;
      case 3:
        return globalThis.stats.getSkillLevel('Pyromancy') >= 100;
      case 4:
        return globalThis.stats.getSkillLevel('Pyromancy') >= 500;
      case 5:
        return globalThis.stats.getSkillLevel('Pyromancy') >= 1000;
    }
    return false;
  },
  stats: {
    Per: 0.2,
    Int: 0.7,
    Soul: 0.1,
  },
  skills: {
    Pyromancy: 100,
  },
  manaCost() {
    return Math.ceil(14000 * (1 - towns[3].getLevel('Runes') * 0.005));
  },
  visible() {
    return towns[3].getLevel('Runes') >= 16;
  },
  unlocked() {
    return towns[3].getLevel('Runes') >= 60 && globalThis.stats.getSkillLevel('Magic') >= 200;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
  },
});

Action.ExploreCavern = new Action('Explore Cavern', {
  type: 'progress',
  expMult: 1,
  townNum: 3,
  varName: 'Cavern',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[3].getLevel(this.varName) >= 1;
      case 2:
        return towns[3].getLevel(this.varName) >= 10;
      case 3:
        return towns[3].getLevel(this.varName) >= 20;
      case 4:
        return towns[3].getLevel(this.varName) >= 40;
      case 5:
        return towns[3].getLevel(this.varName) >= 50;
      case 6:
        return towns[3].getLevel(this.varName) >= 60;
      case 7:
        return towns[3].getLevel(this.varName) >= 80;
      case 8:
        return towns[3].getLevel(this.varName) >= 100;
    }
    return false;
  },
  stats: {
    Dex: 0.1,
    Str: 0.3,
    Con: 0.2,
    Per: 0.3,
    Spd: 0.1,
  },
  manaCost() {
    return 1500;
  },
  visible() {
    return towns[3].getLevel('Mountain') >= 10;
  },
  unlocked() {
    return towns[3].getLevel('Mountain') >= 40;
  },
  finish() {
    towns[3].finishProgress(this.varName, 100);
  },
});

Action.MineSoulstones = new Action('Mine Soulstones', {
  type: 'limited',
  expMult: 1,
  townNum: 3,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[3][`checked${this.varName}`] >= 1;
      case 2:
        return towns[3][`good${this.varName}`] >= 1;
      case 3:
        return towns[3][`good${this.varName}`] >= 30;
      case 4:
        return towns[3][`good${this.varName}`] >= 75;
    }
    return false;
  },
  stats: {
    Str: 0.6,
    Dex: 0.1,
    Con: 0.3,
  },
  affectedBy: ['Buy Pickaxe'],
  manaCost() {
    return 5000;
  },
  canStart() {
    return resources.pickaxe;
  },
  visible() {
    return towns[3].getLevel('Cavern') >= 2;
  },
  unlocked() {
    return towns[3].getLevel('Cavern') >= 20;
  },
  finish() {
    towns[3].finishRegular(this.varName, 10, () => {
      const statToAdd = globalThis.globals.statList[Math.floor(Math.random() * globalThis.globals.statList.length)];
      const countToAdd = Math.floor(globalThis.stats.getSkillBonus('Divine'));
      stats[statToAdd].soulstone += countToAdd;
      globalThis.globals.actionLog.addSoulstones(this, statToAdd, countToAdd);
      globalThis.saving.view.requestUpdate('updateSoulstones', null);
    });
  },
});

function adjustMineSoulstones() {
  let town = towns[3];
  let baseMine = Math.round(town.getLevel('Cavern') * 3 * globalThis.prestige.adjustContentFromPrestige());
  town.totalMineSoulstones = Math.floor(
    baseMine * globalThis.stats.getSkillMod('Spatiomancy', 700, 900, .5) +
      baseMine * globalThis.stats.getSurveyBonus(town),
  );
}

Action.HuntTrolls = new MultipartAction('Hunt Trolls', {
  type: 'multipart',
  expMult: 1.5,
  townNum: 3,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[3].totalHuntTrolls >= 1;
      case 2:
        return storyFlags.slay6TrollsInALoop;
      case 3:
        return storyFlags.slay20TrollsInALoop;
    }
    return false;
  },
  stats: {
    Str: 0.3,
    Dex: 0.3,
    Con: 0.2,
    Per: 0.1,
    Int: 0.1,
  },
  skills: {
    Combat: 1000,
  },
  loopStats: ['Per', 'Con', 'Dex', 'Str', 'Int'],
  manaCost() {
    return 8000;
  },
  loopCost(segment, loopCounter = towns[this.townNum].HuntTrollsLoopCounter) {
    return globalThis.helpers.precision3(
      Math.pow(2, Math.floor((loopCounter + segment) / this.segments + 0.0000001)) * 1e6,
    );
  },
  tickProgress(_offset, _loopCounter, totalCompletions = towns[3].totalHuntTrolls) {
    return (globalThis.stats.getSelfCombat() * Math.sqrt(1 + totalCompletions / 100));
  },
  loopsFinished() {
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.driver.addResource('blood', 1);
    if (resources.blood >= 6) globalThis.view.setStoryFlag('slay6TrollsInALoop');
    if (resources.blood >= 20) globalThis.view.setStoryFlag('slay20TrollsInALoop');
  },
  segmentFinished() {
  },
  getPartName() {
    return 'Hunt Troll';
  },
  visible() {
    return towns[3].getLevel('Cavern') >= 5;
  },
  unlocked() {
    return towns[3].getLevel('Cavern') >= 50;
  },
  finish() {
    //globalThis.stats.handleSkillExp(this.skills);
  },
});

Action.CheckWalls = new Action('Check Walls', {
  type: 'progress',
  expMult: 1,
  townNum: 3,
  varName: 'Illusions',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[3].getLevel(this.varName) >= 1;
      case 2:
        return towns[3].getLevel(this.varName) >= 10;
      case 3:
        return towns[3].getLevel(this.varName) >= 20;
      case 4:
        return towns[3].getLevel(this.varName) >= 40;
      case 5:
        return towns[3].getLevel(this.varName) >= 60;
      case 6:
        return towns[3].getLevel(this.varName) >= 70;
      case 7:
        return towns[3].getLevel(this.varName) >= 80;
      case 8:
        return towns[3].getLevel(this.varName) >= 100;
    }
    return false;
  },
  stats: {
    Spd: 0.1,
    Dex: 0.1,
    Per: 0.4,
    Int: 0.4,
  },
  manaCost() {
    return 3000;
  },
  visible() {
    return towns[3].getLevel('Cavern') >= 40;
  },
  unlocked() {
    return towns[3].getLevel('Cavern') >= 80;
  },
  finish() {
    towns[3].finishProgress(this.varName, 100);
  },
});

Action.TakeArtifacts = new Action('Take Artifacts', {
  type: 'limited',
  expMult: 1,
  townNum: 3,
  varName: 'Artifacts',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[3][`good${this.varName}`] >= 1;
      case 2:
        return towns[3][`good${this.varName}`] >= 20;
      case 3:
        return towns[3][`good${this.varName}`] >= 50;
    }
    return false;
  },
  stats: {
    Spd: 0.2,
    Per: 0.6,
    Int: 0.2,
  },
  manaCost() {
    return 1500;
  },
  visible() {
    return towns[3].getLevel('Illusions') >= 1;
  },
  unlocked() {
    return towns[3].getLevel('Illusions') >= 5;
  },
  finish() {
    towns[3].finishRegular(this.varName, 25, () => {
      globalThis.driver.addResource('artifacts', 1);
    });
  },
});
function adjustArtifacts() {
  let town = towns[3];
  let baseArtifacts = Math.round(town.getLevel('Illusions') * 5 * globalThis.prestige.adjustContentFromPrestige());
  town.totalArtifacts = Math.floor(
    baseArtifacts * globalThis.stats.getSkillMod('Spatiomancy', 800, 1000, .5) +
      baseArtifacts * globalThis.stats.getSurveyBonus(town),
  );
}

Action.ImbueMind = new MultipartAction('Imbue Mind', {
  type: 'multipart',
  expMult: 5,
  townNum: 3,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.imbueMindThirdSegmentReached || globalThis.stats.getBuffLevel('Imbuement') >= 1;
      case 2:
        return globalThis.stats.getBuffLevel('Imbuement') >= 1;
      case 3:
        return globalThis.stats.getBuffLevel('Imbuement') >= 50;
      case 4:
        return globalThis.stats.getBuffLevel('Imbuement') >= 500;
    }
    return false;
  },
  stats: {
    Spd: 0.1,
    Per: 0.1,
    Int: 0.8,
  },
  loopStats: ['Spd', 'Per', 'Int'],
  manaCost() {
    return 500000;
  },
  allowed() {
    return 1;
  },
  canStart(loopCounter = towns[3].ImbueMindLoopCounter) {
    return loopCounter === 0 && checkSoulstoneSac(this.goldCost()) &&
      globalThis.stats.getBuffLevel('Imbuement') < globalThis.stats.getBuffCap('Imbuement');
  },
  loopCost(segment) {
    return 100000000 * (segment * 5 + 1);
  },
  tickProgress(offset) {
    return globalThis.stats.getSkillLevel('Magic');
  },
  grantsBuff: 'Imbuement',
  loopsFinished() {
    const spent = sacrificeSoulstones(this.goldCost());
    globalThis.saving.vals.trainingLimits++;
    globalThis.stats.addBuffAmt('Imbuement', 1, this, 'soulstone', spent);
    globalThis.saving.view.requestUpdate('updateSoulstones', null);
    globalThis.saving.view.requestUpdate('adjustGoldCost', { varName: 'ImbueMind', cost: this.goldCost() });
  },
  getPartName() {
    return 'Imbue Mind';
  },
  visible() {
    return towns[3].getLevel('Illusions') >= 50;
  },
  unlocked() {
    return towns[3].getLevel('Illusions') >= 70 && globalThis.stats.getSkillLevel('Magic') >= 300;
  },
  goldCost() {
    return 20 * (globalThis.stats.getBuffLevel('Imbuement') + 1);
  },
  finish() {
    globalThis.saving.view.requestUpdate('updateBuff', 'Imbuement');
    if (globalThis.saving.vals.options.autoMaxTraining) globalThis.driver.capAllTraining();
    if (globalThis.saving.vals.towns[3].ImbueMindLoopCounter >= 0) {
      globalThis.view.setStoryFlag('imbueMindThirdSegmentReached');
    }
  },
});

Action.ImbueBody = new MultipartAction('Imbue Body', {
  type: 'multipart',
  expMult: 5,
  townNum: 3,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.imbueBodyThirdSegmentReached || globalThis.stats.getBuffLevel('Imbuement2') >= 1;
      case 2:
        return globalThis.stats.getBuffLevel('Imbuement2') >= 1;
      case 3:
        return globalThis.stats.getBuffLevel('Imbuement2') >= 50;
      case 4:
        return globalThis.stats.getBuffLevel('Imbuement2') >= 500;
      case 5:
        //Since the action cannot be performed once you hit level 500, give the
        //action story here so you don't end up unable to 100% the action stories.
        return storyFlags.failedImbueBody || globalThis.stats.getBuffLevel('Imbuement2') >= 500;
    }
    return false;
  },
  stats: {
    Dex: 0.1,
    Str: 0.1,
    Con: 0.8,
  },
  loopStats: ['Dex', 'Str', 'Con'],
  manaCost() {
    return 500000;
  },
  allowed() {
    return 1;
  },
  canStart(loopCounter = towns[3].ImbueBodyLoopCounter) {
    let tempCanStart = true;
    for (const stat of globalThis.globals.statList) {
      if (globalThis.stats.getTalent(stat) < globalThis.stats.getBuffLevel('Imbuement2') + 1) {
        tempCanStart = false;
      }
    }
    return loopCounter === 0 &&
      (globalThis.stats.getBuffLevel('Imbuement') >
        globalThis.stats.getBuffLevel('Imbuement2')) &&
      tempCanStart;
  },
  loopCost(segment) {
    return 100000000 * (segment * 5 + 1);
  },
  tickProgress(offset) {
    return globalThis.stats.globalThis.stats.getSkillLevel('Magic');
  },
  grantsBuff: 'Imbuement2',
  loopsFinished() {
    const spent = {};
    for (const stat of globalThis.globals.statList) {
      const currentTalentLevel = globalThis.stats.getTalent(stat);
      const targetTalentLevel = Math.max(
        currentTalentLevel - globalThis.stats.getBuffLevel('Imbuement2') - 1,
        0,
      );
      stats[stat].talentLevelExp.setLevel(targetTalentLevel);
      spent[stat] = currentTalentLevel - targetTalentLevel;
    }
    globalThis.saving.view.updateStats();
    globalThis.stats.addBuffAmt('Imbuement2', 1, this, 'talent', spent);
    globalThis.saving.view.requestUpdate('adjustGoldCost', { varName: 'ImbueBody', cost: this.goldCost() });
  },
  getPartName() {
    return 'Imbue Body';
  },
  visible() {
    return globalThis.stats.getBuffLevel('Imbuement') >= 1;
  },
  unlocked() {
    return globalThis.stats.getBuffLevel('Imbuement') >= 1;
  },
  goldCost() {
    return globalThis.stats.getBuffLevel('Imbuement2') + 1;
  },
  finish() {
    globalThis.saving.view.requestUpdate('updateBuff', 'Imbuement2');
  },
});

Action.FaceJudgement = new Action('Face Judgement', {
  type: 'normal',
  expMult: 2,
  townNum: 3,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.judgementFaced;
      case 2:
        return storyFlags.acceptedIntoValhalla;
      case 3:
        return storyFlags.castIntoShadowRealm;
      case 4:
        return storyFlags.ignoredByGods;
    }
    return false;
  },
  stats: {
    Cha: 0.3,
    Luck: 0.2,
    Soul: 0.5,
  },
  allowed() {
    return 1;
  },
  manaCost() {
    return 30000;
  },
  visible() {
    return towns[3].getLevel('Mountain') >= 40;
  },
  unlocked() {
    return towns[3].getLevel('Mountain') >= 100;
  },
  finish() {
    globalThis.view.setStoryFlag('judgementFaced');
    if (resources.reputation >= 50) {
      globalThis.view.setStoryFlag('acceptedIntoValhalla');
      globalThis.view.unlockGlobalStory(6);
      globalThis.driver.unlockTown(4);
    } else if (resources.reputation <= -50) {
      globalThis.view.setStoryFlag('castIntoShadowRealm');
      globalThis.view.unlockGlobalStory(7);
      globalThis.driver.unlockTown(5);
    } else {
      globalThis.view.setStoryFlag('ignoredByGods');
    }
  },
});

Action.Guru = new Action('Guru', {
  type: 'normal',
  expMult: 1,
  townNum: 3,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.spokeToGuru;
    }
  },
  stats: {
    Cha: 0.5,
    Soul: 0.5,
  },
  allowed() {
    return 1;
  },
  manaCost() {
    return 100000;
  },
  cost() {
    globalThis.driver.addResource('herbs', -1000);
  },
  canStart() {
    return resources.herbs >= 1000;
  },
  visible() {
    return getExploreProgress() > 75;
  },
  unlocked() {
    return getExploreProgress() >= 100;
  },
  finish() {
    globalThis.driver.unlockTown(4);
    globalThis.view.setStoryFlag('spokeToGuru');
  },
});

//====================================================================================================
//Zone 5 - Valhalla
//====================================================================================================
Action.GuidedTour = new Action('Guided Tour', {
  type: 'progress',
  expMult: 1,
  townNum: 4,
  varName: 'Tour',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[4].getLevel(this.varName) >= 1;
      case 2:
        return towns[4].getLevel(this.varName) >= 10;
      case 3:
        return towns[4].getLevel(this.varName) >= 20;
      case 4:
        return towns[4].getLevel(this.varName) >= 30;
      case 5:
        return towns[4].getLevel(this.varName) >= 40;
      case 6:
        return towns[4].getLevel(this.varName) >= 60;
      case 7:
        return towns[4].getLevel(this.varName) >= 80;
      case 8:
        return towns[4].getLevel(this.varName) >= 90;
      case 9:
        return towns[4].getLevel(this.varName) >= 100;
    }
    return false;
  },
  stats: {
    Per: 0.3,
    Con: 0.2,
    Cha: 0.3,
    Int: 0.1,
    Luck: 0.1,
  },
  affectedBy: ['Buy Glasses'],
  canStart() {
    return resources.gold >= 10;
  },
  cost() {
    globalThis.driver.addResource('gold', -10);
  },
  manaCost() {
    return 2500;
  },
  visible() {
    return true;
  },
  unlocked() {
    return true;
  },
  finish() {
    towns[4].finishProgress(this.varName, 100 * (resources.glasses ? 2 : 1));
  },
});

Action.Canvass = new Action('Canvass', {
  type: 'progress',
  expMult: 1,
  townNum: 4,
  varName: 'Canvassed',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[4].getLevel(this.varName) >= 5;
      case 2:
        return towns[4].getLevel(this.varName) >= 15;
      case 3:
        return towns[4].getLevel(this.varName) >= 30;
      case 4:
        return towns[4].getLevel(this.varName) >= 50;
      case 5:
        return towns[4].getLevel(this.varName) >= 75;
      case 6:
        return towns[4].getLevel(this.varName) >= 100;
    }
    return false;
  },
  stats: {
    Con: 0.1,
    Cha: 0.5,
    Spd: 0.2,
    Luck: 0.2,
  },
  manaCost() {
    return 4000;
  },
  visible() {
    return true;
  },
  unlocked() {
    return towns[4].getLevel('Tour') >= 10;
  },
  finish() {
    towns[4].finishProgress(this.varName, 50);
  },
});

Action.Donate = new Action('Donate', {
  type: 'normal',
  expMult: 1,
  townNum: 4,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.donatedToCharity;
    }
    return false;
  },
  stats: {
    Per: 0.2,
    Cha: 0.2,
    Spd: 0.2,
    Int: 0.4,
  },
  canStart() {
    return resources.gold >= 20;
  },
  manaCost() {
    return 2000;
  },
  visible() {
    return true;
  },
  unlocked() {
    return towns[4].getLevel('Canvassed') >= 5;
  },
  finish() {
    globalThis.driver.addResource('gold', -20);
    globalThis.driver.addResource('reputation', 1);
    globalThis.view.setStoryFlag('donatedToCharity');
  },
});

Action.AcceptDonations = new Action('Accept Donations', {
  type: 'limited',
  expMult: 1,
  townNum: 4,
  varName: 'Donations',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.receivedDonation;
      case 2:
        return towns[4][`good${this.varName}`] >= 1;
      case 3:
        return towns[4][`good${this.varName}`] >= 100;
      case 4:
        return towns[4][`good${this.varName}`] >= 250;
      case 5:
        return storyFlags.failedReceivedDonation;
    }
  },
  stats: {
    Con: 0.1,
    Cha: 0.2,
    Spd: 0.3,
    Luck: 0.4,
  },
  canStart() {
    return resources.reputation > 0;
  },
  cost() {
    globalThis.driver.addResource('reputation', -1);
  },
  manaCost() {
    return 2000;
  },
  visible() {
    return true;
  },
  unlocked() {
    return towns[4].getLevel('Canvassed') >= 5;
  },
  finish() {
    globalThis.view.setStoryFlag('receivedDonation');
    towns[4].finishRegular(this.varName, 5, () => {
      globalThis.driver.addResource('gold', 20);
      return 20;
    });
  },
});

function adjustDonations() {
  let town = towns[4];
  let base = Math.round(town.getLevel('Canvassed') * 5 * globalThis.prestige.adjustContentFromPrestige());
  town.totalDonations = Math.floor(
    base * globalThis.stats.getSkillMod('Spatiomancy', 900, 1100, .5) + base * globalThis.stats.getSurveyBonus(town),
  );
}

Action.TidyUp = new MultipartAction('Tidy Up', {
  type: 'multipart',
  expMult: 1,
  townNum: 4,
  varName: 'Tidy',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.tidiedUp;
      case 5:
        return towns[4].totalTidy >= 100;
      case 6:
        return towns[4].totalTidy >= 1000;
      case 7:
        return towns[4].totalTidy >= 10000;
    }
  },
  stats: {
    Spd: 0.3,
    Dex: 0.3,
    Str: 0.2,
    Con: 0.2,
  },
  loopStats: ['Str', 'Dex', 'Spd', 'Con'],
  manaCost() {
    return 10000;
  },
  loopCost(segment, loopCounter = towns[4].TidyLoopCounter) {
    return globalThis.helpers.fibonacci(Math.floor((loopCounter + segment) - loopCounter / 3 + 0.0000001)) * 1000000; // Temp.
  },
  tickProgress(offset, _loopCounter, totalCompletions = towns[4].totalTidy) {
    return globalThis.stats.getSkillLevel('Practical') * Math.sqrt(1 + totalCompletions / 100);
  },
  loopsFinished(loopCounter = towns[4].TidyLoopCounter) {
    globalThis.driver.addResource('reputation', 1);
    globalThis.driver.addResource('gold', 5);
    globalThis.view.setStoryFlag('tidiedUp');
  },
  segmentFinished() {
    // empty.
  },
  getPartName(loopCounter = towns[4].TidyLoopCounter) {
    return `${globalThis.Localization.txt(`actions>${getXMLName(this.name)}>label_part`)} ${
      globalThis.helpers.numberToWords(Math.floor((loopCounter + 0.0001) / this.segments + 1))
    }`;
  },
  visible() {
    return towns[4].getLevel('Canvassed') >= 10;
  },
  unlocked() {
    return towns[4].getLevel('Canvassed') >= 30;
  },
  finish() {
    globalThis.view.setStoryFlag('tidiedUp');
  },
});

Action.BuyManaZ5 = new Action('Buy Mana Z5', {
  type: 'normal',
  expMult: 1,
  townNum: 4,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.manaZ5Bought;
    }
  },
  stats: {
    Cha: 0.7,
    Int: 0.2,
    Luck: 0.1,
  },
  manaCost() {
    return 100;
  },
  canStart() {
    return !globalThis.saving.vals.portalUsed;
  },
  visible() {
    return true;
  },
  unlocked() {
    return true;
  },
  goldCost() {
    return Math.floor(
      50 * globalThis.stats.getSkillBonus('Mercantilism') * globalThis.prestige.adjustGoldCostFromPrestige(),
    );
  },
  finish() {
    globalThis.driver.addMana(resources.gold * this.goldCost());
    globalThis.driver.resetResource('gold');
    globalThis.view.setStoryFlag('manaZ5Bought');
  },
});

Action.SellArtifact = new Action('Sell Artifact', {
  type: 'normal',
  expMult: 1,
  townNum: 4,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.artifactSold;
    }
  },
  stats: {
    Cha: 0.4,
    Per: 0.3,
    Luck: 0.2,
    Soul: 0.1,
  },
  canStart() {
    return resources.artifacts >= 1;
  },
  cost() {
    globalThis.driver.addResource('artifacts', -1);
  },
  manaCost() {
    return 500;
  },
  visible() {
    return towns[4].getLevel('Tour') >= 10;
  },
  unlocked() {
    return towns[4].getLevel('Tour') >= 20;
  },
  finish() {
    globalThis.view.setStoryFlag('artifactSold');
    globalThis.driver.addResource('gold', 50);
  },
});

Action.GiftArtifact = new Action('Gift Artifact', {
  type: 'normal',
  expMult: 1,
  townNum: 4,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.artifactDonated;
      case 2:
        return storyFlags.donated20Artifacts;
      case 3:
        return storyFlags.donated40Artifacts;
    }
  },
  stats: {
    Cha: 0.6,
    Luck: 0.3,
    Soul: 0.1,
  },
  canStart() {
    return resources.artifacts >= 1;
  },
  cost() {
    globalThis.driver.addResource('artifacts', -1);
  },
  manaCost() {
    return 500;
  },
  visible() {
    return towns[4].getLevel('Tour') >= 10;
  },
  unlocked() {
    return towns[4].getLevel('Tour') >= 20;
  },
  finish() {
    globalThis.view.setStoryFlag('artifactDonated');
    globalThis.driver.addResource('favors', 1);
    if (resources['favors'] >= 20) globalThis.view.setStoryFlag('donated20Artifacts');
    if (resources['favors'] >= 50) globalThis.view.setStoryFlag('donated40Artifacts');
  },
});

Action.Mercantilism = new Action('Mercantilism', {
  type: 'normal',
  expMult: 1,
  townNum: 4,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return globalThis.stats.getSkillLevel('Mercantilism') >= 1;
      case 2:
        return globalThis.stats.getSkillLevel('Mercantilism') >= 30;
      case 3:
        return globalThis.stats.getSkillLevel('Mercantilism') >= 100;
      case 4:
        return globalThis.stats.getSkillLevel('Mercantilism') >= 500;
    }
  },
  stats: {
    Per: 0.2, // Temp
    Int: 0.7,
    Soul: 0.1,
  },
  skills: {
    Mercantilism: 100,
  },
  canStart() {
    return resources.reputation > 0;
  },
  manaCost() {
    return 10000; // Temp
  },
  cost() {
    globalThis.driver.addResource('reputation', -1);
  },
  visible() {
    return towns[4].getLevel('Tour') >= 20;
  },
  unlocked() {
    return towns[4].getLevel('Tour') >= 30;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.saving.view.requestUpdate('adjustManaCost', 'Buy Mana Z1');
    globalThis.saving.view.requestUpdate('adjustManaCost', 'Buy Mana Z3');
    globalThis.saving.view.requestUpdate('adjustManaCost', 'Buy Mana Z5');
  },
});

Action.CharmSchool = new Action('Charm School', {
  type: 'normal',
  expMult: 4,
  townNum: 4,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.charmSchoolVisited;
      case 2:
        return storyFlags.charmSchoolVisited && globalThis.stats.getTalent('Cha') >= 100;
      case 3:
        return storyFlags.charmSchoolVisited && globalThis.stats.getTalent('Cha') >= 1000;
      case 4:
        return storyFlags.charmSchoolVisited && globalThis.stats.getTalent('Cha') >= 10000;
      case 5:
        return storyFlags.charmSchoolVisited && globalThis.stats.getTalent('Cha') >= 100000;
    }
  },
  stats: {
    Cha: 0.8,
    Int: 0.2,
  },
  allowed() {
    return globalThis.saving.vals.trainingLimits;
  },
  manaCost() {
    return 2000;
  },
  visible() {
    return towns[4].getLevel('Tour') >= 20;
  },
  unlocked() {
    return towns[4].getLevel('Tour') >= 30;
  },
  finish() {
    globalThis.view.setStoryFlag('charmSchoolVisited');
  },
});

Action.Oracle = new Action('Oracle', {
  type: 'normal',
  expMult: 4,
  townNum: 4,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.oracleVisited;
      case 2:
        return storyFlags.oracleVisited && globalThis.stats.getTalent('Luck') >= 100;
      case 3:
        return storyFlags.oracleVisited && globalThis.stats.getTalent('Luck') >= 1000;
      case 4:
        return storyFlags.oracleVisited && globalThis.stats.getTalent('Luck') >= 10000;
      case 5:
        return storyFlags.oracleVisited && globalThis.stats.getTalent('Luck') >= 100000;
    }
  },
  stats: {
    Luck: 0.8,
    Soul: 0.2,
  },
  allowed() {
    return globalThis.saving.vals.trainingLimits;
  },
  manaCost() {
    return 2000;
  },
  visible() {
    return towns[4].getLevel('Tour') >= 30;
  },
  unlocked() {
    return towns[4].getLevel('Tour') >= 40;
  },
  finish() {
    globalThis.view.setStoryFlag('oracleVisited');
  },
});

Action.EnchantArmor = new Action('Enchant Armor', {
  type: 'normal',
  expMult: 1,
  townNum: 4,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.armorEnchanted;
      case 2:
        return storyFlags.enchanted10Armor;
      case 3:
        return storyFlags.enchanted20Armor;
    }
  },
  stats: {
    Cha: 0.6,
    Int: 0.2,
    Luck: 0.2,
  },
  skills: {
    Crafting: 50,
  },
  manaCost() {
    return 1000; // Temp
  },
  canStart() {
    return resources.favors >= 1 && resources.armor >= 1;
  },
  cost() {
    globalThis.driver.addResource('favors', -1);
    globalThis.driver.addResource('armor', -1);
  },
  visible() {
    return towns[4].getLevel('Tour') >= 30;
  },
  unlocked() {
    return towns[4].getLevel('Tour') >= 40;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.driver.addResource('enchantments', 1);
    globalThis.view.setStoryFlag('armorEnchanted');
    if (resources['enchantments'] >= 10) globalThis.view.setStoryFlag('enchanted10Armor');
    if (resources['enchantments'] >= 25) globalThis.view.setStoryFlag('enchanted20Armor');
  },
});

Action.WizardCollege = new MultipartAction('Wizard College', {
  type: 'multipart',
  expMult: 1,
  townNum: 4,
  varName: 'wizCollege',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyVars.maxWizardGuildSegmentCleared >= 0;
      case 12:
        return storyVars.maxWizardGuildSegmentCleared >= 3;
      case 2:
        return storyVars.maxWizardGuildSegmentCleared >= 6;
      case 3:
        return storyVars.maxWizardGuildSegmentCleared >= 12;
      case 4:
        return storyVars.maxWizardGuildSegmentCleared >= 18;
      case 6:
        return storyVars.maxWizardGuildSegmentCleared >= 30;
      case 8:
        return storyVars.maxWizardGuildSegmentCleared >= 42;
      case 10:
        return storyVars.maxWizardGuildSegmentCleared >= 54;
      case 13:
        return storyVars.maxWizardGuildSegmentCleared >= 57;
    }
  },
  stats: {
    Int: 0.5,
    Soul: 0.3,
    Cha: 0.2,
  },
  loopStats: ['Int', 'Cha', 'Soul'],
  manaCost() {
    return 10000;
  },
  allowed() {
    return 1;
  },
  canStart() {
    return resources.gold >= 500 && resources.favors >= 10;
  },
  cost() {
    globalThis.driver.addResource('gold', -500);
    globalThis.driver.addResource('favors', -10);
  },
  loopCost(segment, loopCounter = towns[4][`${this.varName}LoopCounter`]) {
    return globalThis.helpers.precision3(Math.pow(1.3, loopCounter + segment)) * 1e7; // Temp
  },
  tickProgress(offset, _loopCounter, totalCompletions = towns[4][`total${this.varName}`]) {
    return (
      globalThis.stats.getSkillLevel('Magic') + globalThis.stats.getSkillLevel('Practical') +
      globalThis.stats.getSkillLevel('Dark') +
      globalThis.stats.getSkillLevel('Chronomancy') + globalThis.stats.getSkillLevel('Pyromancy') +
      globalThis.stats.getSkillLevel('Restoration') +
      globalThis.stats.getSkillLevel('Spatiomancy')
    ) *
      Math.sqrt(1 + totalCompletions / 1000);
  },
  loopsFinished() {
    // empty.
  },
  segmentFinished() {
    globalThis.saving.vals.curWizCollegeSegment++;
    globalThis.saving.view.requestUpdate('adjustManaCost', 'Restoration');
    globalThis.saving.view.requestUpdate('adjustManaCost', 'Spatiomancy');
    globalThis.view.increaseStoryVarTo('maxWizardGuildSegmentCleared', globalThis.saving.vals.curWizCollegeSegment);
  },
  getPartName() {
    return `${getWizCollegeRank().name}`;
  },
  getSegmentName(segment) {
    return `${getWizCollegeRank(segment % 3).name}`;
  },
  visible() {
    return towns[4].getLevel('Tour') >= 40;
  },
  unlocked() {
    return towns[4].getLevel('Tour') >= 60;
  },
  finish() {
    resources.wizardCollege = true;
    globalThis.view.increaseStoryVarTo('maxWizardGuildSegmentCleared', 0);
  },
});
function getWizCollegeRank(offset) {
  let name = [
    'Initiate',
    'Student',
    'Apprentice',
    'Disciple',
    'Spellcaster',
    'Magician',
    'Wizard',
    'Great Wizard',
    'Grand Wizard',
    'Archwizard',
    'Sage',
    'Great Sage',
    'Grand Sage',
    'Archsage',
    'Magus',
    'Great Magus',
    'Grand Magus',
    'Archmagus',
    'Member of The Council of the Seven',
  ][Math.floor(globalThis.saving.vals.curWizCollegeSegment / 3 + 0.00001)];
  const segment = (offset === undefined ? 0 : offset - (globalThis.saving.vals.curWizCollegeSegment % 3)) +
    globalThis.saving.vals.curWizCollegeSegment;
  let bonus = globalThis.helpers.precision3(1 + 0.02 * Math.pow(segment, 1.05));
  if (name) {
    if (offset === undefined) {
      name += ['-', '', '+'][globalThis.saving.vals.curWizCollegeSegment % 3];
    } else {
      name += ['-', '', '+'][offset % 3];
    }
  } else {
    name = 'Chair of The Council of the Seven';
    bonus = 5;
  }
  name += `, Mult x${bonus}`;
  return { name, bonus };
}

Action.Restoration = new Action('Restoration', {
  type: 'normal',
  expMult: 1,
  townNum: 4,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return globalThis.stats.getSkillLevel('Restoration') >= 1;
      case 2:
        return globalThis.stats.getSkillLevel('Restoration') >= 50;
      case 3:
        return globalThis.stats.getSkillLevel('Restoration') >= 200;
      case 4:
        return globalThis.stats.getSkillLevel('Restoration') >= 500;
    }
  },
  stats: {
    Int: 0.5,
    Soul: 0.3,
    Con: 0.2,
  },
  canStart() {
    return resources.wizardCollege;
  },
  affectedBy: ['Wizard College'],
  skills: {
    Restoration: 100,
  },
  manaCost() {
    return 15000 / getWizCollegeRank().bonus;
  },
  visible() {
    return towns[4].getLevel('Tour') >= 40;
  },
  unlocked() {
    return towns[4].getLevel('Tour') >= 60;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
  },
});

Action.Spatiomancy = new Action('Spatiomancy', {
  type: 'normal',
  expMult: 1,
  townNum: 4,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return globalThis.stats.getSkillLevel('Spatiomancy') >= 1;
      case 2:
        return globalThis.stats.getSkillLevel('Spatiomancy') >= 50;
      case 3:
        return globalThis.stats.getSkillLevel('Spatiomancy') >= 200;
      case 4:
        return globalThis.stats.getSkillLevel('Spatiomancy') >= 600;
      case 5:
        return globalThis.stats.getSkillLevel('Spatiomancy') >= 1000;
      case 6:
        return globalThis.stats.getSkillLevel('Spatiomancy') >= 1500;
    }
  },
  stats: {
    Int: 0.6,
    Con: 0.2,
    Per: 0.1,
    Spd: 0.1,
  },
  affectedBy: ['Wizard College'],
  skills: {
    Spatiomancy: 100,
  },
  canStart() {
    return resources.wizardCollege;
  },
  manaCost() {
    return 20000 / getWizCollegeRank().bonus;
  },
  visible() {
    return towns[4].getLevel('Tour') >= 40;
  },
  unlocked() {
    return towns[4].getLevel('Tour') >= 60;
  },
  finish() {
    const oldSpatioSkill = globalThis.stats.getSkillLevel('Spatiomancy');
    globalThis.stats.handleSkillExp(this.skills);
    if (globalThis.stats.getSkillLevel('Spatiomancy') !== oldSpatioSkill) {
      globalThis.saving.view.requestUpdate('adjustManaCost', 'Mana Geyser');
      globalThis.saving.view.requestUpdate('adjustManaCost', 'Mana Well');
      globalThis.driver.adjustAll();
      for (const action of globalThis.saving.vals.totalActionList) {
        if (towns[action.townNum].varNames.indexOf(action.varName) !== -1) {
          globalThis.saving.view.requestUpdate('updateRegular', { name: action.varName, index: action.townNum });
        }
      }
    }
  },
});

Action.SeekCitizenship = new Action('Seek Citizenship', {
  type: 'progress',
  expMult: 1,
  townNum: 4,
  varName: 'Citizen',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[4].getLevel(this.varName) >= 1;
      case 2:
        return towns[4].getLevel(this.varName) >= 20;
      case 3:
        return towns[4].getLevel(this.varName) >= 40;
      case 4:
        return towns[4].getLevel(this.varName) >= 60;
      case 5:
        return towns[4].getLevel(this.varName) >= 80;
      case 6:
        return towns[4].getLevel(this.varName) >= 100;
    }
  },
  stats: {
    Cha: 0.5,
    Int: 0.2,
    Luck: 0.2,
    Per: 0.1,
  },
  manaCost() {
    return 1500; // Temp
  },
  visible() {
    return towns[4].getLevel('Tour') >= 60;
  },
  unlocked() {
    return towns[4].getLevel('Tour') >= 80;
  },
  finish() {
    towns[4].finishProgress(this.varName, 100);
    //Todo: Figure out a way to check if this is the first time the Seek Citizenship
    //action was performed in a loop *after* the loop in which 100% was achieved,
    //and unlock the repeatedCitizenExam story.
  },
});

Action.BuildHousing = new Action('Build Housing', {
  type: 'normal',
  expMult: 1,
  townNum: 4,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.houseBuilt;
      case 2:
        return storyFlags.housesBuiltGodlike;
      case 3:
        return storyFlags.built50Houses;
    }
  },
  stats: {
    Str: 0.4,
    Con: 0.3,
    Dex: 0.2,
    Spd: 0.1,
  },
  skills: {
    Crafting: 100,
  },
  affectedBy: ['Crafting Guild'],
  canStart() {
    //Maximum crafting guild bonus is 10, maximum spatiomancy mult is 5.
    let maxHouses = Math.floor(getCraftGuildRank().bonus * globalThis.stats.getSkillMod('Spatiomancy', 0, 500, 1));
    return globalThis.saving.vals.guild === 'Crafting' && towns[4].getLevel('Citizen') >= 100 &&
      resources.houses < maxHouses;
  },
  manaCost() {
    return 2000;
  },
  visible() {
    return towns[4].getLevel('Citizen') >= 80;
  },
  unlocked() {
    return towns[4].getLevel('Citizen') >= 100;
  },
  finish() {
    globalThis.driver.addResource('houses', 1);
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.view.setStoryFlag('houseBuilt');
    if (resources.houses >= 10 && getCraftGuildRank().name == 'Godlike') {
      globalThis.view.setStoryFlag('housesBuiltGodlike');
    }
    if (resources.houses >= 50) {
      globalThis.view.setStoryFlag('built50Houses');
    }
  },
});

Action.CollectTaxes = new Action('Collect Taxes', {
  type: 'normal',
  expMult: 1,
  townNum: 4,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.collectedTaxes;
      case 2:
        return storyFlags.collected50Taxes;
    }
  },
  stats: {
    Cha: 0.4,
    Spd: 0.2,
    Per: 0.2,
    Luck: 0.2,
  },
  affectedBy: ['Build Housing'],
  canStart() {
    return resources.houses > 0;
  },
  allowed() {
    return 1;
  },
  manaCost() {
    return 10000;
  },
  visible() {
    return towns[4].getLevel('Citizen') >= 60;
  },
  unlocked() {
    return towns[4].getLevel('Citizen') >= 100 && globalThis.stats.getSkillLevel('Mercantilism') > 0;
  },
  finish() {
    const goldGain = Math.floor(resources.houses * globalThis.stats.getSkillLevel('Mercantilism') / 10);
    globalThis.driver.addResource('gold', goldGain);
    globalThis.view.setStoryFlag('collectedTaxes');
    if (resources.houses >= 50) {
      globalThis.view.setStoryFlag('collected50Taxes');
    }

    //Is this necessary? The return value for finish() seems unused.
    return goldGain;
  },
});

Action.Pegasus = new Action('Pegasus', {
  type: 'normal',
  expMult: 1,
  townNum: 4,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.acquiredPegasus;
      case 2:
        return storyFlags.acquiredPegasusWithTeam;
    }
  },
  stats: {
    Soul: 0.3,
    Cha: 0.2,
    Luck: 0.2,
    Int: 0.3,
  },
  allowed() {
    return 1;
  },
  manaCost() {
    return 3000;
  },
  canStart() {
    return resources.gold >= 200 && resources.favors >= 20;
  },
  cost() {
    globalThis.driver.addResource('favors', -20);
    globalThis.driver.addResource('gold', -200);
  },
  visible() {
    return towns[4].getLevel('Tour') >= 70;
  },
  unlocked() {
    return towns[4].getLevel('Tour') >= 90;
  },
  finish() {
    globalThis.driver.addResource('pegasus', true);
    globalThis.view.setStoryFlag('acquiredPegasus');
    if (resources.teamMembers >= 5) {
      globalThis.view.setStoryFlag('acquiredPegasusWithTeam');
    }
  },
});

Action.FightFrostGiants = new MultipartAction('Fight Frost Giants', {
  type: 'multipart',
  expMult: 1,
  townNum: 4,
  varName: 'FightFrostGiants',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.giantGuildTestTaken;
      case 2:
        return storyFlags.giantGuildRankEReached;
      case 3:
        return storyFlags.giantGuildRankDReached;
      case 4:
        return storyFlags.giantGuildRankCReached;
      case 5:
        return storyFlags.giantGuildRankBReached;
      case 6:
        return storyFlags.giantGuildRankAReached;
      case 7:
        return storyFlags.giantGuildRankSReached;
      case 8:
        return storyFlags.giantGuildRankSSReached;
      case 9:
        return storyFlags.giantGuildRankSSSReached;
      case 10:
        return storyFlags.giantGuildRankUReached;
      case 11:
        return storyFlags.giantGuildRankGodlikeReached;
    }
  },
  stats: {
    Str: 0.5,
    Con: 0.3,
    Per: 0.2,
  },
  skills: {
    Combat: 1500,
  },
  loopStats: ['Per', 'Con', 'Str'],
  manaCost() {
    return 20000;
  },
  allowed() {
    return 1;
  },
  affectedBy: ['Pegasus'],
  canStart() {
    return resources.pegasus;
  },
  loopCost(segment, loopCounter = towns[4][`${this.varName}LoopCounter`]) {
    return globalThis.helpers.precision3(Math.pow(1.3, loopCounter + segment)) * 1e7; // Temp
  },
  tickProgress(_offset, _loopCounter, totalCompletions = towns[4][`total${this.varName}`]) {
    return (globalThis.stats.getSelfCombat() *
      Math.sqrt(1 + totalCompletions / 1000));
  },
  loopsFinished() {
    globalThis.stats.handleSkillExp(this.skills);
  },
  segmentFinished() {
    globalThis.saving.vals.curFightFrostGiantsSegment++;
    if (globalThis.saving.vals.curFightFrostGiantsSegment >= 6) globalThis.view.setStoryFlag('giantGuildRankEReached');
    if (globalThis.saving.vals.curFightFrostGiantsSegment >= 12) globalThis.view.setStoryFlag('giantGuildRankDReached');
    if (globalThis.saving.vals.curFightFrostGiantsSegment >= 18) globalThis.view.setStoryFlag('giantGuildRankCReached');
    if (globalThis.saving.vals.curFightFrostGiantsSegment >= 24) globalThis.view.setStoryFlag('giantGuildRankBReached');
    if (globalThis.saving.vals.curFightFrostGiantsSegment >= 30) globalThis.view.setStoryFlag('giantGuildRankAReached');
    if (globalThis.saving.vals.curFightFrostGiantsSegment >= 36) globalThis.view.setStoryFlag('giantGuildRankSReached');
    if (globalThis.saving.vals.curFightFrostGiantsSegment >= 42) {
      globalThis.view.setStoryFlag('giantGuildRankSSReached');
    }
    if (globalThis.saving.vals.curFightFrostGiantsSegment >= 48) {
      globalThis.view.setStoryFlag('giantGuildRankSSSReached');
    }
    if (globalThis.saving.vals.curFightFrostGiantsSegment >= 54) globalThis.view.setStoryFlag('giantGuildRankUReached');
    if (globalThis.saving.vals.curFightFrostGiantsSegment >= 60) {
      globalThis.view.setStoryFlag('giantGuildRankGodlikeReached');
    }
  },
  getPartName() {
    return `${getFrostGiantsRank().name}`;
  },
  getSegmentName(segment) {
    return `${getFrostGiantsRank(segment % 3).name}`;
  },
  visible() {
    return towns[4].getLevel('Citizen') >= 80 || storyFlags.acquiredPegasus;
  },
  unlocked() {
    return towns[4].getLevel('Citizen') >= 100;
  },
  finish() {
    globalThis.view.setStoryFlag('giantGuildTestTaken');
  },
});
function getFrostGiantsRank(offset) {
  let name = [
    'Private',
    'Corporal', //E
    'Specialist',
    'Sergeant', //D
    'Staff Sergeant',
    'Sergeant First Class', //C
    'Master Sergeant',
    'Sergeant Major', //B
    'Warrant Officer',
    'Chief Warrant Officer', //A
    'Second Lieutenant',
    'First Lieutenant', //S
    'Major',
    'Lieutenant Colonel', //SS
    'Colonel',
    'Lieutenant Commander', //SSS
    'Commander',
    'Captain', //U
    'Rear Admiral',
    'Vice Admiral', //godlike
  ][Math.floor(globalThis.saving.vals.curFightFrostGiantsSegment / 3 + 0.00001)];
  const segment = (offset === undefined ? 0 : offset - (globalThis.saving.vals.curFightFrostGiantsSegment % 3)) +
    globalThis.saving.vals.curFightFrostGiantsSegment;
  let bonus = globalThis.helpers.precision3(1 + 0.05 * Math.pow(segment, 1.05));
  if (name) {
    if (offset === undefined) {
      name += ['-', '', '+'][globalThis.saving.vals.curFightFrostGiantsSegment % 3];
    } else {
      name += ['-', '', '+'][offset % 3];
    }
  } else {
    name = 'Admiral';
    bonus = 10;
  }
  name += `, Mult x${bonus}`;
  return { name, bonus };
}

Action.SeekBlessing = new Action('Seek Blessing', {
  type: 'normal',
  expMult: 5,
  townNum: 4,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.blessingSought;
      case 2:
        return globalThis.stats.getSkillLevel('Divine') >= 1;
      case 3:
        return storyFlags.greatBlessingSought;
    }
  },
  stats: {
    Cha: 0.5,
    Luck: 0.5,
  },
  skills: {
    Divine: 50,
  },
  canStart() {
    return resources.pegasus;
  },
  allowed() {
    return 1;
  },
  affectedBy: ['Pegasus'],
  manaCost() {
    return 1000000;
  },
  visible() {
    return towns[4].getLevel('Citizen') >= 80 || storyFlags.acquiredPegasus;
  },
  unlocked() {
    return towns[4].getLevel('Citizen') >= 100;
  },
  finish() {
    globalThis.view.setStoryFlag('blessingSought');
    if (getFrostGiantsRank().bonus >= 10) globalThis.view.setStoryFlag('greatBlessingSought');
    // @ts-ignore
    this.skills.Divine = Math.floor(50 * getFrostGiantsRank().bonus);
    globalThis.stats.handleSkillExp(this.skills);
  },
});

Action.GreatFeast = new MultipartAction('Great Feast', {
  type: 'multipart',
  expMult: 5,
  townNum: 4,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.feastAttempted;
      case 2:
        return globalThis.stats.getBuffLevel('Feast') >= 1;
    }
  },
  stats: {
    Spd: 0.1,
    Int: 0.1,
    Soul: 0.8,
  },
  loopStats: ['Spd', 'Int', 'Soul'],
  manaCost() {
    return 5000000;
  },
  allowed() {
    return 1;
  },
  canStart(loopCounter = towns[this.townNum].GreatFeastLoopCounter) {
    return resources.reputation >= 100 && loopCounter === 0 && checkSoulstoneSac(this.goldCost()) &&
      globalThis.stats.getBuffLevel('Feast') < globalThis.stats.getBuffCap('Feast');
  },
  loopCost(segment) {
    return 1000000000 * (segment * 5 + 1);
  },
  tickProgress(offset) {
    return globalThis.stats.getSkillLevel('Practical');
  },
  grantsBuff: 'Feast',
  loopsFinished() {
    const spent = sacrificeSoulstones(this.goldCost());
    globalThis.stats.addBuffAmt('Feast', 1, this, 'soulstone', spent);
    globalThis.saving.view.requestUpdate('updateSoulstones', null);
    globalThis.saving.view.requestUpdate('adjustGoldCost', { varName: 'GreatFeast', cost: this.goldCost() });
  },
  getPartName() {
    return 'Host Great Feast';
  },
  visible() {
    return towns[4].getLevel('Tour') >= 80;
  },
  unlocked() {
    return towns[4].getLevel('Tour') >= 100;
  },
  goldCost() {
    return Math.ceil(5000 * (globalThis.stats.getBuffLevel('Feast') + 1) * globalThis.stats.getSkillBonus('Gluttony'));
  },
  finish() {
    globalThis.saving.view.requestUpdate('updateBuff', 'Feast');
  },
});

Action.FallFromGrace = new Action('Fall From Grace', {
  type: 'normal',
  expMult: 2,
  townNum: 4,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.fellFromGrace;
    }
    return false;
  },
  stats: {
    Dex: 0.4,
    Luck: 0.3,
    Spd: 0.2,
    Int: 0.1,
  },
  allowed() {
    return 1;
  },
  manaCost() {
    return 30000;
  },
  visible() {
    return true;
  },
  unlocked() {
    return globalThis.stats.getSkillLevel('Pyromancy') >= 200;
  },
  finish() {
    if (resources.reputation >= 0) resources.reputation = -1;
    globalThis.saving.view.requestUpdate('updateResource', 'reputation');
    globalThis.view.setStoryFlag('fellFromGrace');
    globalThis.driver.unlockTown(5);
  },
});

//====================================================================================================
//Zone 6 - Startington
//====================================================================================================
Action.Meander = new Action('Meander', {
  type: 'progress',
  expMult: 1,
  townNum: 5,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[5].getLevel('Meander') >= 1;
      case 2:
        return towns[5].getLevel('Meander') >= 2;
      case 3:
        return towns[5].getLevel('Meander') >= 5;
      case 4:
        return towns[5].getLevel('Meander') >= 15;
      case 5:
        return towns[5].getLevel('Meander') >= 25;
      case 6:
        return towns[5].getLevel('Meander') >= 50;
      case 7:
        return towns[5].getLevel('Meander') >= 75;
      case 8:
        return towns[5].getLevel('Meander') >= 100;
      case 9:
        return storyFlags.meanderIM100;
    }
  },
  stats: {
    Per: 0.2,
    Con: 0.2,
    Cha: 0.2,
    Spd: 0.3,
    Luck: 0.1,
  },
  affectedBy: ['Imbue Mind'],
  manaCost() {
    return 2500;
  },
  visible() {
    return true;
  },
  unlocked() {
    return true;
  },
  finish() {
    if (globalThis.stats.getBuffLevel('Imbuement') >= 100) globalThis.view.setStoryFlag('meanderIM100');
    towns[5].finishProgress(this.varName, globalThis.stats.getBuffLevel('Imbuement'));
  },
});
function adjustPylons() {
  let town = towns[5];
  let base = Math.round(town.getLevel('Meander') * 10 * globalThis.prestige.adjustContentFromPrestige());
  town.totalPylons = Math.floor(
    base * globalThis.stats.getSkillMod('Spatiomancy', 1000, 1200, .5) + base * globalThis.stats.getSurveyBonus(town),
  );
}

Action.ManaWell = new Action('Mana Well', {
  type: 'limited',
  expMult: 1,
  townNum: 5,
  varName: 'Wells',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.wellDrawn;
      case 2:
        return storyFlags.drew10Wells;
      case 3:
        return storyFlags.drew15Wells;
      case 4:
        return storyFlags.drewDryWell;
    }
  },
  stats: {
    Str: 0.6,
    Per: 0.3,
    Int: 0.1,
  },
  manaCost() {
    return Math.ceil(2500 * globalThis.stats.getSkillBonus('Spatiomancy'));
  },
  canStart() {
    return true;
  },
  visible() {
    return true;
  },
  unlocked() {
    return towns[5].getLevel('Meander') >= 2;
  },
  goldCost() { // in this case, "amount of mana in well"
    return Math.max(5000 - Math.floor(10 * globalThis.driver.effectiveTime), 0);
  },
  finish() {
    towns[5].finishRegular(this.varName, 100, () => {
      let wellMana = this.goldCost();
      globalThis.driver.addMana(wellMana);
      if (wellMana === 0) {
        globalThis.view.setStoryFlag('drewDryWell');
      } else {
        globalThis.view.setStoryFlag('wellDrawn');
      }
      return wellMana;
    });
    if (towns[5].goodWells >= 10) globalThis.view.setStoryFlag('drew10Wells');
    if (towns[5].goodWells >= 15) globalThis.view.setStoryFlag('drew15Wells');
  },
});
function adjustWells() {
  let town = towns[5];
  let base = Math.round(town.getLevel('Meander') * 10 * globalThis.prestige.adjustContentFromPrestige());
  town.totalWells = Math.floor(base + base * globalThis.stats.getSurveyBonus(town));
}

Action.DestroyPylons = new Action('Destroy Pylons', {
  type: 'limited',
  expMult: 1,
  townNum: 5,
  varName: 'Pylons',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[5].goodPylons >= 1;
      case 2:
        return towns[5].goodPylons >= 10;
      case 3:
        return towns[5].goodPylons >= 25;
    }
  },
  stats: {
    Str: 0.4,
    Dex: 0.3,
    Int: 0.3,
  },
  manaCost() {
    return 10000;
  },
  visible() {
    return towns[5].getLevel('Meander') >= 1;
  },
  unlocked() {
    return towns[5].getLevel('Meander') >= 5;
  },
  finish() {
    towns[5].finishRegular(this.varName, 100, () => {
      globalThis.driver.addResource('pylons', 1);
      //globalThis.saving.view.requestUpdate("adjustManaCost", "The Spire");
      return 1;
    });
  },
});

Action.RaiseZombie = new Action('Raise Zombie', {
  type: 'normal',
  expMult: 1,
  townNum: 5,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.attemptedRaiseZombie;
      case 3:
        return storyVars.maxZombiesRaised >= 10;
      case 4:
        return storyVars.maxZombiesRaised >= 25;
    }
  },
  stats: {
    Con: 0.4,
    Int: 0.3,
    Soul: 0.3,
  },
  skills: {
    Dark: 100,
  },
  canStart() {
    return resources.blood >= 1;
  },
  cost() {
    globalThis.driver.addResource('blood', -1);
  },
  manaCost() {
    return 10000;
  },
  visible() {
    return towns[5].getLevel('Meander') >= 15;
  },
  unlocked() {
    return globalThis.stats.getSkillLevel('Dark') >= 1000;
  },
  finish() {
    globalThis.view.setStoryFlag('attemptedRaiseZombie');
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.driver.addResource('zombie', 1);
    globalThis.view.increaseStoryVarTo('maxZombiesRaised', resources.zombie);
  },
});

Action.DarkSacrifice = new Action('Dark Sacrifice', {
  type: 'normal',
  expMult: 1,
  townNum: 5,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return globalThis.stats.getSkillLevel('Commune') >= 1;
      case 2:
        return globalThis.stats.getSkillLevel('Commune') >= 100;
      case 3:
        return globalThis.stats.getSkillLevel('Commune') >= 1000;
    }
  },
  stats: {
    Int: 0.2,
    Soul: 0.8,
  },
  skills: {
    Commune: 100,
  },
  canStart() {
    return resources.blood >= 1;
  },
  cost() {
    globalThis.driver.addResource('blood', -1);
  },
  manaCost() {
    return 20000;
  },
  visible() {
    return towns[5].getLevel('Meander') >= 25;
  },
  unlocked() {
    return globalThis.stats.getBuffLevel('Ritual') >= 60;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.saving.view.requestUpdate('adjustGoldCost', {
      varName: 'DarkRitual',
      cost: Action.DarkRitual.goldCost(),
    });
  },
});

Action.TheSpire = new DungeonAction('The Spire', 2, {
  type: 'multipart',
  expMult: 1,
  townNum: 5,
  varName: 'TheSpire',
  storyReqs(storyNum) {
    switch (storyNum) {
      //TODO: decide on some reasonable/better floor requirements for progress stories.
      case 1:
        return storyFlags.spireAttempted;
      case 2:
        return towns[5].totalTheSpire >= 1000;
      case 3:
        return towns[5].totalTheSpire >= 5000;
      case 4:
        return storyFlags.clearedSpire;
      case 5:
        return storyFlags.spire10Pylons;
      case 6:
        return storyFlags.spire20Pylons;
    }
  },
  stats: {
    Str: 0.1,
    Dex: 0.1,
    Spd: 0.1,
    Con: 0.1,
    Per: 0.2,
    Int: 0.2,
    Soul: 0.2,
  },
  skills: {
    Combat: 100,
  },
  loopStats: ['Per', 'Int', 'Con', 'Spd', 'Dex', 'Per', 'Int', 'Str', 'Soul'],
  affectedBy: ['Team'],
  manaCost() {
    return 100000;
  },
  canStart(loopCounter = towns[this.townNum].TheSpireLoopCounter) {
    const curFloor = Math.floor(loopCounter / this.segments + 0.0000001);
    return curFloor < globalThis.saving.vals.dungeons[this.dungeonNum].length;
  },
  loopCost(segment, loopCounter = towns[this.townNum].TheSpireLoopCounter) {
    return globalThis.helpers.precision3(
      Math.pow(2, Math.floor((loopCounter + segment) / this.segments + 0.0000001)) * 1e7,
    );
  },
  tickProgress(_offset, loopCounter = towns[this.townNum].TheSpireLoopCounter) {
    const floor = Math.floor(loopCounter / this.segments + 0.0000001);
    return globalThis.stats.getTeamCombat() * (1 + 0.1 * resources.pylons) *
      Math.sqrt(1 + globalThis.saving.vals.dungeons[this.dungeonNum][floor].completed / 200);
  },
  grantsBuff: 'Aspirant',
  loopsFinished(loopCounter = towns[this.townNum].TheSpireLoopCounter) {
    const curFloor = Math.floor(loopCounter / this.segments + 0.0000001 - 1);
    this.finishDungeon(curFloor);
    if (curFloor >= globalThis.stats.getBuffLevel('Aspirant')) globalThis.stats.addBuffAmt('Aspirant', 1, this);
    if (curFloor == globalThis.globals.dungeonFloors[this.dungeonNum] - 1) globalThis.view.setStoryFlag('clearedSpire');
  },
  visible() {
    return globalThis.globals.towns[5].getLevel('Meander') >= 5;
  },
  unlocked() {
    return (globalThis.stats.getSkillLevel('Combat') + globalThis.stats.getSkillLevel('Magic')) >= 35;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.saving.view.requestUpdate('updateBuff', 'Aspirant');
    globalThis.view.setStoryFlag('spireAttempted');
    if (resources.pylons >= 10) globalThis.view.setStoryFlag('spire10Pylons');
    if (resources.pylons >= 25) globalThis.view.setStoryFlag('spire20Pylons');
  },
});

Action.PurchaseSupplies = new Action('Purchase Supplies', {
  type: 'normal',
  expMult: 1,
  townNum: 5,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.suppliesPurchased;
    }
  },
  stats: {
    Cha: 0.8,
    Luck: 0.1,
    Soul: 0.1,
  },
  allowed() {
    return 1;
  },
  manaCost() {
    return 2000;
  },
  canStart() {
    return resources.gold >= 500 && !resources.supplies;
  },
  cost() {
    globalThis.driver.addResource('gold', -500);
  },
  visible() {
    return towns[5].getLevel('Meander') >= 50;
  },
  unlocked() {
    return towns[5].getLevel('Meander') >= 75;
  },
  finish() {
    globalThis.view.setStoryFlag('suppliesPurchased');
    globalThis.driver.addResource('supplies', true);
  },
});

Action.DeadTrial = new TrialAction('Dead Trial', 4, {
  //25 floors
  type: 'multipart',
  expMult: 0.25,
  townNum: 5,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.deadTrial1Done;
      case 2:
        return storyFlags.deadTrial10Done;
      case 3:
        return storyFlags.deadTrial25Done;
    }
  },
  stats: {
    Cha: 0.25,
    Int: 0.25,
    Luck: 0.25,
    Soul: 0.25,
  },
  loopStats: ['Cha', 'Int', 'Luck', 'Soul'],
  affectedBy: ['RaiseZombie'],
  baseScaling: 2, //Difficulty is raised to this exponent each floor
  exponentScaling: 1e9, //Difficulty is multiplied by this number each floor
  manaCost() {
    return 100000;
  },
  baseProgress() {
    //Determines what skills give progress to the trial
    return globalThis.stats.getZombieStrength();
  },
  floorReward() {
    //Rewards given per floor
    globalThis.driver.addResource('zombie', 1);
  },
  canStart() {
    return this.currentFloor() < globalThis.saving.trialFloors[this.trialNum];
  },
  visible() {
    return towns[this.townNum].getLevel('Survey') >= 100;
  },
  unlocked() {
    return towns[this.townNum].getLevel('Survey') >= 100;
  },
  finish() {
    if (this.currentFloor() >= 1) globalThis.view.setStoryFlag('deadTrial1Done');
    if (this.currentFloor() >= 10) globalThis.view.setStoryFlag('deadTrial10Done');
    if (this.currentFloor() >= 25) globalThis.view.setStoryFlag('deadTrial25Done');
  },
});

Action.JourneyForth = new Action('Journey Forth', {
  type: 'normal',
  expMult: 2,
  townNum: 5,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return globalThis.saving.vals.townsUnlocked.includes(6);
    }
  },
  stats: {
    Con: 0.4,
    Per: 0.3,
    Spd: 0.3,
  },
  allowed() {
    return globalThis.actions.getNumOnList('Open Portal') > 0 ? 2 : 1;
  },
  manaCost() {
    return 20000;
  },
  canStart() {
    return resources.supplies;
  },
  cost() {
    globalThis.driver.addResource('supplies', false);
  },
  visible() {
    return towns[5].getLevel('Meander') >= 75;
  },
  unlocked() {
    return towns[5].getLevel('Meander') >= 100;
  },
  finish() {
    globalThis.driver.unlockTown(6);
  },
  story(completed) {
    globalThis.view.unlockGlobalStory(8);
  },
});

//====================================================================================================
//Zone 7 - Jungle Path
//====================================================================================================
Action.ExploreJungle = new Action('Explore Jungle', {
  type: 'progress',
  expMult: 1,
  townNum: 6,
  varName: 'ExploreJungle',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[6].getLevel(this.varName) >= 1;
      case 2:
        return towns[6].getLevel(this.varName) >= 10;
      case 3:
        return towns[6].getLevel(this.varName) >= 20;
      case 4:
        return towns[6].getLevel(this.varName) >= 40;
      case 5:
        return towns[6].getLevel(this.varName) >= 50;
      case 6:
        return towns[6].getLevel(this.varName) >= 60;
      case 7:
        return towns[6].getLevel(this.varName) >= 80;
      case 8:
        return towns[6].getLevel(this.varName) >= 100;
    }
  },
  stats: {
    Per: 0.2,
    Con: 0.2,
    Cha: 0.2,
    Spd: 0.3,
    Luck: 0.1,
  },
  affectedBy: ['Fight Jungle Monsters'],
  manaCost() {
    return 25000;
  },
  visible() {
    return true;
  },
  unlocked() {
    return true;
  },
  finish() {
    towns[6].finishProgress(this.varName, 20 * getFightJungleMonstersRank().bonus);
    globalThis.driver.addResource('herbs', 1);
  },
});

Action.FightJungleMonsters = new MultipartAction('Fight Jungle Monsters', {
  type: 'multipart',
  expMult: 1,
  townNum: 6,
  varName: 'FightJungleMonsters',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.monsterGuildTestTaken;
      case 2:
        return storyFlags.monsterGuildRankDReached;
      case 3:
        return storyFlags.monsterGuildRankCReached;
      case 4:
        return storyFlags.monsterGuildRankBReached;
      case 5:
        return storyFlags.monsterGuildRankAReached;
      case 6:
        return storyFlags.monsterGuildRankSReached;
      case 7:
        return storyFlags.monsterGuildRankSSReached;
      case 8:
        return storyFlags.monsterGuildRankSSSReached;
      case 9:
        return storyFlags.monsterGuildRankUReached;
      case 10:
        return storyFlags.monsterGuildRankGodlikeReached;
    }
  },
  stats: {
    Str: 0.3,
    Dex: 0.3,
    Per: 0.4,
  },
  skills: {
    Combat: 2000,
  },
  loopStats: ['Dex', 'Str', 'Per'],
  manaCost() {
    return 30000;
  },
  canStart() {
    return true;
  },
  loopCost(segment, loopCounter = towns[6][`${this.varName}LoopCounter`]) {
    return globalThis.helpers.precision3(Math.pow(1.3, loopCounter + segment)) * 1e8; // Temp
  },
  tickProgress(_offset, _loopCounter, totalCompletions = towns[6][`total${this.varName}`]) {
    return (globalThis.stats.getSelfCombat() *
      Math.sqrt(1 + totalCompletions / 1000));
  },
  loopsFinished() {
    globalThis.stats.handleSkillExp(this.skills);
  },
  segmentFinished() {
    globalThis.saving.vals.curFightJungleMonstersSegment++;
    globalThis.driver.addResource('blood', 1);
    //Since the action stories are for having *slain* the beast,
    //unlock *after* the last segment of the beast in question.
    //I.e., the sloth fight is segments 6, 7 and 8, so the unlock
    //happens when the 8th segment is done and the current segment
    //is 9 or more.
    if (globalThis.saving.vals.curFightJungleMonstersSegment > 8) {
      globalThis.view.setStoryFlag('monsterGuildRankDReached');
    }
    if (globalThis.saving.vals.curFightJungleMonstersSegment > 14) {
      globalThis.view.setStoryFlag('monsterGuildRankCReached');
    }
    if (globalThis.saving.vals.curFightJungleMonstersSegment > 20) {
      globalThis.view.setStoryFlag('monsterGuildRankBReached');
    }
    if (globalThis.saving.vals.curFightJungleMonstersSegment > 26) {
      globalThis.view.setStoryFlag('monsterGuildRankAReached');
    }
    if (globalThis.saving.vals.curFightJungleMonstersSegment > 32) {
      globalThis.view.setStoryFlag('monsterGuildRankSReached');
    }
    if (globalThis.saving.vals.curFightJungleMonstersSegment > 38) {
      globalThis.view.setStoryFlag('monsterGuildRankSSReached');
    }
    if (globalThis.saving.vals.curFightJungleMonstersSegment > 44) {
      globalThis.view.setStoryFlag('monsterGuildRankSSSReached');
    }
    if (globalThis.saving.vals.curFightJungleMonstersSegment > 50) {
      globalThis.view.setStoryFlag('monsterGuildRankUReached');
    }
    if (globalThis.saving.vals.curFightJungleMonstersSegment > 56) {
      globalThis.view.setStoryFlag('monsterGuildRankGodlikeReached');
    }
    // Additional thing?
  },
  getPartName() {
    return `${getFightJungleMonstersRank().name}`;
  },
  getSegmentName(segment) {
    return `${getFightJungleMonstersRank(segment % 3).name}`;
  },
  visible() {
    return true;
  },
  unlocked() {
    return true;
  },
  finish() {
    globalThis.view.setStoryFlag('monsterGuildTestTaken');
  },
});
function getFightJungleMonstersRank(offset) {
  let name = [
    'Frog',
    'Toucan',
    'Sloth', //D
    'Pangolin',
    'Python', //C
    'Tapir',
    'Okapi', //B
    'Bonobo',
    'Jaguar', //A
    'Chimpanzee',
    'Annaconda', //S
    'Lion',
    'Tiger', //SS
    'Bear',
    'Crocodile', //SSS
    'Rhino',
    'Gorilla', //U
    'Hippo',
    'Elephant', //godlike
  ][Math.floor(globalThis.saving.vals.curFightJungleMonstersSegment / 3 + 0.00001)];
  const segment = (offset === undefined ? 0 : offset - (globalThis.saving.vals.curFightJungleMonstersSegment % 3)) +
    globalThis.saving.vals.curFightJungleMonstersSegment;
  let bonus = globalThis.helpers.precision3(1 + 0.05 * Math.pow(segment, 1.05));
  if (name) {
    if (offset === undefined) {
      name += ['-', '', '+'][globalThis.saving.vals.curFightJungleMonstersSegment % 3];
    } else {
      name += ['-', '', '+'][offset % 3];
    }
  } else {
    name = 'Stampede';
    bonus = 10;
  }
  name += `, Mult x${bonus}`;
  return { name, bonus };
}

Action.RescueSurvivors = new MultipartAction('Rescue Survivors', {
  type: 'multipart',
  expMult: 1,
  townNum: 6,
  varName: 'Rescue',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.survivorRescued;
      case 2:
        return storyFlags.rescued6Survivors;
      case 3:
        return storyFlags.rescued20Survivors;
    }
  },
  stats: {
    Per: 0.4,
    Dex: 0.2,
    Cha: 0.2,
    Spd: 0.2,
  },
  skills: {
    Restoration: 25,
  },
  loopStats: ['Per', 'Spd', 'Cha'],
  manaCost() {
    return 25000;
  },
  canStart() {
    return true;
  },
  loopCost(segment, loopCounter = towns[6].RescueLoopCounter) {
    return globalThis.helpers.fibonacci(2 + Math.floor((loopCounter + segment) / this.segments + 0.0000001)) * 5000;
  },
  tickProgress(offset, loopCounter, totalCompletions = towns[6].totalRescue) {
    return globalThis.stats.getSkillLevel('Magic') * Math.max(globalThis.stats.getSkillLevel('Restoration') / 100, 1) *
      Math.sqrt(1 + totalCompletions / 100);
  },
  loopsFinished(loopCounter = towns[6].RescueLoopCounter) {
    globalThis.driver.addResource('reputation', 4);
    globalThis.view.setStoryFlag('survivorRescued');
    if (loopCounter >= 6) globalThis.view.setStoryFlag('rescued6Survivors');
    if (loopCounter >= 20) globalThis.view.setStoryFlag('rescued20Survivors');
  },
  getPartName(loopCounter = towns[6].RescueLoopCounter) {
    return `${globalThis.Localization.txt(`actions>${getXMLName(this.name)}>label_part`)} ${
      globalThis.helpers.numberToWords(Math.floor((loopCounter + 0.0001) / this.segments + 1))
    }`;
  },
  visible() {
    return towns[6].getLevel('ExploreJungle') >= 10;
  },
  unlocked() {
    return towns[6].getLevel('ExploreJungle') >= 20;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
  },
});

Action.PrepareBuffet = new Action('Prepare Buffet', {
  type: 'normal',
  expMult: 1,
  townNum: 6,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.buffetHeld;
      case 2:
        return storyFlags.buffetFor1;
      case 3:
        return storyFlags.buffetFor6;
      case 4:
        return globalThis.stats.getSkillLevel('Gluttony') >= 10;
      case 5:
        return globalThis.stats.getSkillLevel('Gluttony') >= 100;
    }
  },
  stats: {
    Con: 0.3,
    Per: 0.1,
    Int: 0.6,
  },
  skills: {
    Alchemy: 25,
    Gluttony: 5,
  },
  canStart() {
    return resources.herbs >= 10 && resources.blood > 0;
  },
  cost() {
    globalThis.driver.addResource('herbs', -10);
    globalThis.driver.addResource('blood', -1);
  },
  manaCost() {
    return 30000;
  },
  visible() {
    return towns[6].getLevel('ExploreJungle') >= 15;
  },
  unlocked() {
    return towns[6].getLevel('ExploreJungle') >= 20;
  },
  finish() {
    // @ts-ignore
    this.skills.Gluttony = Math.floor(towns[6].RescueLoopCounter * 5);
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.view.setStoryFlag('buffetHeld');
    if (towns[6].RescueLoopCounter >= 1) globalThis.view.setStoryFlag('buffetFor1');
    if (towns[6].RescueLoopCounter >= 6) globalThis.view.setStoryFlag('buffetFor6');
  },
});

Action.Totem = new Action('Totem', {
  type: 'normal',
  expMult: 1,
  townNum: 6,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return globalThis.stats.getSkillLevel('Wunderkind') >= 1;
      case 2:
        return globalThis.stats.getSkillLevel('Wunderkind') >= 5;
      case 3:
        return globalThis.stats.getSkillLevel('Wunderkind') >= 60;
      case 4:
        return globalThis.stats.getSkillLevel('Wunderkind') >= 360;
    }
  },
  stats: {
    Con: 0.3,
    Per: 0.2,
    Soul: 0.5,
  },
  skills: {
    Wunderkind: 100,
  },
  canStart() {
    return resources.loopingPotion;
  },
  cost() {
    globalThis.driver.addResource('loopingPotion', false);
  },
  manaCost() {
    return 30000;
  },
  visible() {
    return towns[6].getLevel('ExploreJungle') >= 25;
  },
  unlocked() {
    return towns[6].getLevel('ExploreJungle') >= 50;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
  },
});

Action.Escape = new Action('Escape', {
  type: 'normal',
  expMult: 2,
  townNum: 6,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return globalThis.saving.vals.townsUnlocked.includes(7);
    }
  },
  stats: {
    Dex: 0.2,
    Spd: 0.8,
  },
  allowed() {
    return 1;
  },
  canStart() {
    if (globalThis.saving.vals.escapeStarted) return true;
    else if (globalThis.driver.effectiveTime < 60) {
      globalThis.saving.vals.escapeStarted = true;
      return true;
    } else return false;
  },
  manaCost() {
    return 50000;
  },
  visible() {
    return towns[6].getLevel('ExploreJungle') >= 75;
  },
  unlocked() {
    return towns[6].getLevel('ExploreJungle') >= 100;
  },
  finish() {
    globalThis.driver.unlockTown(7);
  },
  story(completed) {
    globalThis.view.unlockGlobalStory(10);
  },
});

Action.OpenPortal = new Action('Open Portal', {
  type: 'normal',
  expMult: 1,
  townNum: 6,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.portalOpened;
    }
  },
  stats: {
    Int: 0.2,
    Luck: 0.1,
    Soul: 0.7,
  },
  skills: {
    Restoration: 2500,
  },
  allowed() {
    return 1;
  },
  manaCost() {
    return 50000;
  },
  visible() {
    return getExploreProgress() > 50;
  },
  unlocked() {
    return getExploreProgress() >= 75;
  },
  canStart() {
    return globalThis.stats.getSkillLevel('Restoration') >= 1000;
  },
  finish() {
    globalThis.saving.vals.portalUsed = true;
    globalThis.view.setStoryFlag('portalOpened');
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.driver.unlockTown(1);
  },
});

//====================================================================================================
//Zone 8 - Commerceville
//====================================================================================================
Action.Excursion = new Action('Excursion', {
  type: 'progress',
  expMult: 1,
  townNum: 7,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[7].getLevel('Excursion') >= 1;
      case 2:
        return towns[7].getLevel('Excursion') >= 10;
      case 3:
        return towns[7].getLevel('Excursion') >= 25;
      case 4:
        return towns[7].getLevel('Excursion') >= 40;
      case 5:
        return towns[7].getLevel('Excursion') >= 60;
      case 6:
        return towns[7].getLevel('Excursion') >= 80;
      case 7:
        return towns[7].getLevel('Excursion') >= 100;
      case 8:
        return storyFlags.excursionAsGuildmember;
    }
  },
  stats: {
    Per: 0.2,
    Con: 0.2,
    Cha: 0.2,
    Spd: 0.3,
    Luck: 0.1,
  },
  affectedBy: ['Buy Glasses'],
  manaCost() {
    return 25000;
  },
  canStart() {
    return resources.gold >= this.goldCost();
  },
  visible() {
    return true;
  },
  unlocked() {
    return true;
  },
  goldCost() {
    return (globalThis.saving.vals.guild === 'Thieves' || globalThis.saving.vals.guild === 'Explorer') ? 2 : 10;
  },
  finish() {
    if (globalThis.saving.vals.guild === 'Thieves' || globalThis.saving.vals.guild === 'Explorer') {
      globalThis.view.setStoryFlag('excursionAsGuildmember');
    }
    towns[7].finishProgress(this.varName, 50 * (resources.glasses ? 2 : 1));
    globalThis.driver.addResource('gold', -1 * this.goldCost());
  },
});
function adjustPockets() {
  let town = towns[7];
  let base = Math.round(town.getLevel('Excursion') * globalThis.prestige.adjustContentFromPrestige());
  town.totalPockets = Math.floor(
    base * globalThis.stats.getSkillMod('Spatiomancy', 1100, 1300, .5) + base * globalThis.stats.getSurveyBonus(town),
  );
  globalThis.saving.view.requestUpdate('updateActionTooltips', null);
}
function adjustWarehouses() {
  let town = towns[7];
  let base = Math.round(town.getLevel('Excursion') / 2.5 * globalThis.prestige.adjustContentFromPrestige());
  town.totalWarehouses = Math.floor(
    base * globalThis.stats.getSkillMod('Spatiomancy', 1200, 1400, .5) + base * globalThis.stats.getSurveyBonus(town),
  );
  globalThis.saving.view.requestUpdate('updateActionTooltips', null);
}
function adjustInsurance() {
  let town = towns[7];
  let base = Math.round(town.getLevel('Excursion') / 10 * globalThis.prestige.adjustContentFromPrestige());
  town.totalInsurance = Math.floor(
    base * globalThis.stats.getSkillMod('Spatiomancy', 1300, 1500, .5) + base * globalThis.stats.getSurveyBonus(town),
  );
  globalThis.saving.view.requestUpdate('updateActionTooltips', null);
}

Action.ExplorersGuild = new Action('Explorers Guild', {
  //Note: each time the 'survey' action is performed, one 'map' is exchanged for a
  //'completed map'; not just when a zone is 100% surveyed.
  type: 'normal',
  expMult: 1,
  townNum: 7,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.explorerGuildTestTaken;
      case 2:
        return storyFlags.mapTurnedIn;
      case 3:
        return fullyExploredZones() >= 1;
      case 4:
        return fullyExploredZones() >= 4;
      case 5:
        return fullyExploredZones() >= towns.length;
    }
  },
  stats: {
    Per: 0.3,
    Cha: 0.3,
    Int: 0.2,
    Luck: 0.2,
  },
  manaCost() {
    return 65000;
  },
  allowed() {
    return 1;
  },
  canStart() {
    return globalThis.saving.vals.guild === '';
  },
  visible() {
    return towns[7].getLevel('Excursion') >= 5;
  },
  unlocked() {
    return towns[7].getLevel('Excursion') >= 10;
  },
  finish() {
    globalThis.view.setStoryFlag('explorerGuildTestTaken');
    if (getExploreSkill() == 0) towns[this.townNum].finishProgress('SurveyZ' + this.townNum, 100);
    if (resources.map === 0) globalThis.driver.addResource('map', 30);
    if (resources.completedMap > 0) {
      exchangeMap();
      globalThis.view.setStoryFlag('mapTurnedIn');
    }
    globalThis.saving.vals.guild = 'Explorer';
    globalThis.saving.view.requestUpdate('adjustGoldCost', { varName: 'Excursion', cost: Action.Excursion.goldCost() });
  },
});
function fullyExploredZones() {
  let fullyExplored = 0;
  towns.forEach((town, index) => {
    if (town.getLevel(`SurveyZ${index}`) == 100) fullyExplored++;
  });
  return fullyExplored;
}
function getTotalExploreProgress() {
  //TotalExploreProgress == total of all zones' survey progress.
  let totalExploreProgress = 0;
  towns.forEach((town, index) => {
    if (town.getLevel('SurveyZ' + index)) totalExploreProgress += town.getLevel('SurveyZ' + index);
  });
  return totalExploreProgress;
}
function getExploreProgress() {
  //ExploreProgress == mean of all zones' survey progress, rounded down.
  const totalExploreProgress = getTotalExploreProgress();
  if (totalExploreProgress == 0) return 0;
  else return Math.max(Math.floor(totalExploreProgress / towns.length), 1);
}
function getExploreExp() {
  //ExploreExp == total survey exp across all zones
  let totalExploreExp = 0;
  towns.forEach((town, index) => {
    if (town.getLevel('SurveyZ' + index)) totalExploreExp += town[`expSurveyZ${index}`];
  });
  return totalExploreExp;
}
function getExploreExpSinceLastProgress() {
  const totalExploreProgress = getTotalExploreProgress();
  if (totalExploreProgress === 100 * towns.length) return 1;
  let levelsSinceLastProgress = totalExploreProgress <= 1
    ? 1
    : totalExploreProgress < towns.length * 2
    ? totalExploreProgress - 1
    : totalExploreProgress % towns.length + 1;

  const levelsPerTown = {};

  function expSinceLast(town) {
    const varName = `SurveyZ${town.index}`;
    const level = town.getLevel(varName) - (levelsPerTown[town.index] ?? 0);
    if (level === 0 || level === 100) return Infinity;
    if (levelsPerTown[town.index]) {
      return globalThis.stats.getExpOfSingleLevel(level);
    } else {
      const curExp = town[`exp${varName}`];
      return curExp - globalThis.stats.getExpOfLevel(level) + 1;
    }
  }
  const townsByExpOrder = [...towns].sort((a, b) => expSinceLast(a) - expSinceLast(b));
  let totalExpGained = 0;
  while (levelsSinceLastProgress--) {
    totalExpGained += expSinceLast(townsByExpOrder[0]);
    const index = townsByExpOrder[0].index;
    levelsPerTown[index] ??= 0;
    levelsPerTown[index]++;
    townsByExpOrder.sort((a, b) => expSinceLast(a) - expSinceLast(b));
  }
  return totalExpGained;
}
function getExploreExpToNextProgress() {
  const totalExploreProgress = getTotalExploreProgress();
  if (totalExploreProgress === 100 * towns.length) return 0;
  let levelsToNextProgress = totalExploreProgress === 0
    ? 1
    : totalExploreProgress < towns.length * 2
    ? towns.length * 2 - totalExploreProgress
    : towns.length - (totalExploreProgress % towns.length);

  const levelsPerTown = {};

  function expToNext(town) {
    const varName = `SurveyZ${town.index}`;
    const level = town.getLevel(varName) + (levelsPerTown[town.index] ?? 0);
    if (level >= 100) return Infinity;
    if (levelsPerTown[town.index]) {
      // we're at a level boundary so we can shortcut
      return globalThis.stats.getExpOfSingleLevel(level + 1);
    } else {
      return globalThis.stats.getExpOfLevel(level + 1) - town[`exp${varName}`];
    }
  }
  const townsByExpOrder = [...towns].sort((a, b) => expToNext(a) - expToNext(b));
  let totalExpNeeded = 0;
  while (levelsToNextProgress--) {
    totalExpNeeded += expToNext(townsByExpOrder[0]);
    const index = townsByExpOrder[0].index;
    levelsPerTown[index] ??= 0;
    levelsPerTown[index]++;
    townsByExpOrder.sort((a, b) => expToNext(a) - expToNext(b));
  }
  return totalExpNeeded;
}
function getExploreSkill() {
  return Math.floor(Math.sqrt(getExploreProgress()));
}
function exchangeMap() {
  let unfinishedSurveyZones = [];
  towns.forEach((town, index) => {
    if (town.getLevel('Survey') < 100) unfinishedSurveyZones.push(index);
  });
  //For each completed map, give 2*ExploreSkill survey exp to a random unfinished zone's
  //survey progress (if no unfinished zones remain, skip all of this.)
  while (resources.completedMap > 0 && unfinishedSurveyZones.length > 0) {
    let rand = unfinishedSurveyZones[Math.floor(Math.random() * unfinishedSurveyZones.length)];
    let name = 'expSurveyZ' + rand;
    towns[rand][name] += getExploreSkill() * 2;
    if (towns[rand][name] >= 505000) {
      towns[rand][name] = 505000;
      for (var i = 0; i < unfinishedSurveyZones.length; i++) {
        if (unfinishedSurveyZones[i] === rand) {
          unfinishedSurveyZones.splice(i, 1);
        }
      }
    }
    globalThis.saving.view.requestUpdate('updateProgressAction', { name: 'SurveyZ' + rand, town: towns[rand] });
    globalThis.driver.addResource('completedMap', -1);
  }
}

Action.ThievesGuild = new MultipartAction('Thieves Guild', {
  type: 'multipart',
  expMult: 2,
  townNum: 7,
  varName: 'ThievesGuild',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.thiefGuildTestsTaken;
      case 2:
        return storyFlags.thiefGuildRankEReached;
      case 3:
        return storyFlags.thiefGuildRankDReached;
      case 4:
        return storyFlags.thiefGuildRankCReached;
      case 5:
        return storyFlags.thiefGuildRankBReached;
      case 6:
        return storyFlags.thiefGuildRankAReached;
      case 7:
        return storyFlags.thiefGuildRankSReached;
      case 8:
        return storyFlags.thiefGuildRankUReached;
      case 9:
        return storyFlags.thiefGuildRankGodlikeReached;
    }
  },
  stats: {
    Dex: 0.4,
    Per: 0.3,
    Spd: 0.3,
  },
  skills: {
    Thievery: 50,
    Practical: 50,
  },
  loopStats: ['Per', 'Dex', 'Spd'],
  manaCost() {
    return 75000;
  },
  allowed() {
    return 1;
  },
  canStart() {
    return globalThis.saving.vals.guild === '' && resources.reputation < 0;
  },
  loopCost(segment, loopCounter = towns[7][`${this.varName}LoopCounter`]) {
    return globalThis.helpers.precision3(Math.pow(1.2, loopCounter + segment)) * 5e8;
  },
  tickProgress(_offset, _loopCounter, totalCompletions = towns[7][`total${this.varName}`]) {
    return (globalThis.stats.getSkillLevel('Practical') +
      globalThis.stats.getSkillLevel('Thievery')) *
      Math.sqrt(1 + totalCompletions / 1000);
  },
  loopsFinished() {
  },
  segmentFinished() {
    globalThis.saving.vals.curThievesGuildSegment++;
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.driver.addResource('gold', 10);
  },
  getPartName() {
    return `Rank ${getThievesGuildRank().name}`;
  },
  getSegmentName(segment) {
    return `Rank ${getThievesGuildRank(segment % 3).name}`;
  },
  visible() {
    return towns[7].getLevel('Excursion') >= 20;
  },
  unlocked() {
    return towns[7].getLevel('Excursion') >= 25;
  },
  finish() {
    globalThis.saving.vals.guild = 'Thieves';
    globalThis.saving.view.requestUpdate('adjustGoldCost', { varName: 'Excursion', cost: Action.Excursion.goldCost() });
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.view.setStoryFlag('thiefGuildTestsTaken');
    if (globalThis.saving.vals.curThievesGuildSegment >= 3) globalThis.view.setStoryFlag('thiefGuildRankEReached');
    if (globalThis.saving.vals.curThievesGuildSegment >= 6) globalThis.view.setStoryFlag('thiefGuildRankDReached');
    if (globalThis.saving.vals.curThievesGuildSegment >= 9) globalThis.view.setStoryFlag('thiefGuildRankCReached');
    if (globalThis.saving.vals.curThievesGuildSegment >= 12) globalThis.view.setStoryFlag('thiefGuildRankBReached');
    if (globalThis.saving.vals.curThievesGuildSegment >= 15) globalThis.view.setStoryFlag('thiefGuildRankAReached');
    if (globalThis.saving.vals.curThievesGuildSegment >= 18) globalThis.view.setStoryFlag('thiefGuildRankSReached');
    if (globalThis.saving.vals.curThievesGuildSegment >= 30) globalThis.view.setStoryFlag('thiefGuildRankUReached');
    if (globalThis.saving.vals.curThievesGuildSegment >= 42) {
      globalThis.view.setStoryFlag('thiefGuildRankGodlikeReached');
    }
  },
});
function getThievesGuildRank(offset) {
  let name = [
    'F',
    'E',
    'D',
    'C',
    'B',
    'A',
    'S',
    'SS',
    'SSS',
    'SSSS',
    'U',
    'UU',
    'UUU',
    'UUUU',
  ][Math.floor(globalThis.saving.vals.curThievesGuildSegment / 3 + 0.00001)];

  const segment = (offset === undefined ? 0 : offset - (globalThis.saving.vals.curThievesGuildSegment % 3)) +
    globalThis.saving.vals.curThievesGuildSegment;
  let bonus = globalThis.helpers.precision3(1 + segment / 20 + Math.pow(segment, 2) / 300);
  if (name) {
    if (offset === undefined) {
      name += ['-', '', '+'][globalThis.saving.vals.curThievesGuildSegment % 3];
    } else {
      name += ['-', '', '+'][offset % 3];
    }
  } else {
    name = 'Godlike';
    bonus = 10;
  }
  name += `, Mult x${bonus}`;
  return { name, bonus };
}

Action.PickPockets = new Action('Pick Pockets', {
  type: 'progress',
  expMult: 1.5,
  townNum: 7,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[7].getLevel('PickPockets') >= 1;
      case 2:
        return towns[7].getLevel('PickPockets') >= 10;
      case 3:
        return towns[7].getLevel('PickPockets') >= 20;
      case 4:
        return towns[7].getLevel('PickPockets') >= 40;
      case 5:
        return towns[7].getLevel('PickPockets') >= 60;
      case 6:
        return towns[7].getLevel('PickPockets') >= 80;
      case 7:
        return towns[7].getLevel('PickPockets') >= 100;
    }
  },
  stats: {
    Dex: 0.4,
    Spd: 0.4,
    Luck: 0.2,
  },
  skills: {
    Thievery() {
      return 10 * (1 + towns[7].getLevel('PickPockets') / 100);
    },
  },
  affectedBy: ['Thieves Guild'],
  allowed() {
    return towns[7].totalPockets;
  },
  canStart() {
    return globalThis.saving.vals.guild === 'Thieves';
  },
  manaCost() {
    return 20000;
  },
  visible() {
    return globalThis.stats.getSkillLevel('Thievery') > 0;
  },
  unlocked() {
    return globalThis.stats.getSkillLevel('Thievery') > 0;
  },
  goldCost() {
    return Math.floor(2 * globalThis.stats.getSkillBonus('Thievery'));
  },
  finish() {
    towns[7].finishProgress(this.varName, 30 * getThievesGuildRank().bonus);
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.saving.view.requestUpdate('adjustExpGain', Action.ThievesGuild);
    const goldGain = Math.floor(this.goldCost() * getThievesGuildRank().bonus);
    globalThis.driver.addResource('gold', goldGain);
    return goldGain;
  },
});

Action.RobWarehouse = new Action('Rob Warehouse', {
  type: 'progress',
  expMult: 2,
  townNum: 7,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[7].getLevel('RobWarehouse') >= 1;
      case 2:
        return towns[7].getLevel('RobWarehouse') >= 10;
      case 3:
        return towns[7].getLevel('RobWarehouse') >= 20;
      case 4:
        return towns[7].getLevel('RobWarehouse') >= 40;
      case 5:
        return towns[7].getLevel('RobWarehouse') >= 60;
      case 6:
        return towns[7].getLevel('RobWarehouse') >= 80;
      case 7:
        return towns[7].getLevel('RobWarehouse') >= 100;
    }
  },
  stats: {
    Dex: 0.4,
    Spd: 0.2,
    Int: 0.2,
    Luck: 0.2,
  },
  skills: {
    Thievery() {
      return 20 * (1 + towns[7].getLevel('RobWarehouse') / 100);
    },
  },
  affectedBy: ['Thieves Guild'],
  allowed() {
    return towns[7].totalWarehouses;
  },
  canStart() {
    return globalThis.saving.vals.guild === 'Thieves';
  },
  manaCost() {
    return 50000;
  },
  visible() {
    return towns[7].getLevel('PickPockets') >= 25;
  },
  unlocked() {
    return towns[7].getLevel('PickPockets') >= 100;
  },
  goldCost() {
    return Math.floor(20 * globalThis.stats.getSkillBonus('Thievery'));
  },
  finish() {
    towns[7].finishProgress(this.varName, 20 * getThievesGuildRank().bonus);
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.saving.view.requestUpdate('adjustExpGain', Action.ThievesGuild);
    const goldGain = Math.floor(this.goldCost() * getThievesGuildRank().bonus);
    globalThis.driver.addResource('gold', goldGain);
    return goldGain;
  },
});

Action.InsuranceFraud = new Action('Insurance Fraud', {
  type: 'progress',
  expMult: 2.5,
  townNum: 7,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return towns[7].getLevel('InsuranceFraud') >= 1;
      case 2:
        return towns[7].getLevel('InsuranceFraud') >= 10;
      case 3:
        return towns[7].getLevel('InsuranceFraud') >= 20;
      case 4:
        return towns[7].getLevel('InsuranceFraud') >= 40;
      case 5:
        return towns[7].getLevel('InsuranceFraud') >= 60;
      case 6:
        return towns[7].getLevel('InsuranceFraud') >= 75;
      case 7:
        return towns[7].getLevel('InsuranceFraud') >= 100;
    }
  },
  stats: {
    Dex: 0.2,
    Spd: 0.2,
    Int: 0.3,
    Luck: 0.3,
  },
  skills: {
    Thievery() {
      return 40 * (1 + towns[7].getLevel('InsuranceFraud') / 100);
    },
  },
  affectedBy: ['Thieves Guild'],
  allowed() {
    return towns[7].totalInsurance;
  },
  canStart() {
    return globalThis.saving.vals.guild === 'Thieves';
  },
  manaCost() {
    return 100000;
  },
  visible() {
    return towns[7].getLevel('RobWarehouse') >= 50;
  },
  unlocked() {
    return towns[7].getLevel('RobWarehouse') >= 100;
  },
  goldCost() {
    return Math.floor(200 * globalThis.stats.getSkillBonus('Thievery'));
  },
  finish() {
    towns[7].finishProgress(this.varName, 10 * getThievesGuildRank().bonus);
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.saving.view.requestUpdate('adjustExpGain', Action.ThievesGuild);
    const goldGain = Math.floor(this.goldCost() * getThievesGuildRank().bonus);
    globalThis.driver.addResource('gold', goldGain);
    return goldGain;
  },
});

Action.GuildAssassin = new Action('Guild Assassin', {
  type: 'normal',
  expMult: 1,
  townNum: 7,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return globalThis.stats.getSkillLevel('Assassin') > 0;
      case 2:
        return storyFlags.assassinHeartDelivered;
      case 3:
        return totalAssassinations() >= 4;
      case 4:
        return storyFlags.assassin4HeartsDelivered;
      case 5:
        return totalAssassinations() >= 8;
      case 6:
        return storyFlags.assassin8HeartsDelivered;
    }
  },
  stats: {
    Per: 0.1,
    Cha: 0.3,
    Dex: 0.4,
    Luck: 0.2,
  },
  skills: {
    Assassin: 100,
  },
  manaCost() {
    return 100000;
  },
  allowed() {
    return 1;
  },
  canStart() {
    return globalThis.saving.vals.guild === '';
  },
  visible() {
    return towns[this.townNum].getLevel('InsuranceFraud') >= 75;
  },
  unlocked() {
    return towns[this.townNum].getLevel('InsuranceFraud') >= 100;
  },
  finish() {
    if (resources.heart >= 1) globalThis.view.setStoryFlag('assassinHeartDelivered');
    if (resources.heart >= 4) globalThis.view.setStoryFlag('assassin4HeartsDelivered');
    if (resources.heart >= 8) globalThis.view.setStoryFlag('assassin8HeartsDelivered');
    let assassinExp = 0;
    if (globalThis.stats.getSkillLevel('Assassin') === 0) assassinExp = 100;
    if (resources.heart > 0) assassinExp = 100 * Math.pow(resources.heart, 2);
    this.skills.Assassin = assassinExp;
    globalThis.stats.handleSkillExp(this.skills);
    resources.heart = 0;
    globalThis.saving.vals.guild = 'Assassin';
  },
});

function totalAssassinations() {
  //Counts all zones with at least one successful assassination.
  let total = 0;
  for (var i = 0; i < towns.length; i++) {
    if (towns[i][`totalAssassinZ${i}`] > 0) total++;
  }
  return total;
}

Action.Invest = new Action('Invest', {
  type: 'normal',
  expMult: 1,
  townNum: 7,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.investedOne;
      case 2:
        return storyFlags.investedTwo;
      case 3:
        return globalThis.saving.vals.goldInvested >= 1000000;
      case 4:
        return globalThis.saving.vals.goldInvested >= 1000000000;
      case 5:
        return globalThis.saving.vals.goldInvested == 999999999999;
    }
  },
  stats: {
    Con: 0.4,
    Per: 0.3,
    Spd: 0.3,
  },
  skills: {
    Mercantilism: 100,
  },
  allowed() {
    return 1;
  },
  manaCost() {
    return 50000;
  },
  canStart() {
    return resources.gold > 0;
  },
  visible() {
    return true;
  },
  unlocked() {
    return true;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
    globalThis.saving.vals.goldInvested += resources.gold;
    if (globalThis.saving.vals.goldInvested > 999999999999) globalThis.saving.vals.goldInvested = 999999999999;
    globalThis.driver.resetResource('gold');
    if (storyFlags.investedOne) globalThis.view.setStoryFlag('investedTwo');
    globalThis.view.setStoryFlag('investedOne');
    globalThis.saving.view.requestUpdate('updateActionTooltips', null);
  },
});

Action.CollectInterest = new Action('Collect Interest', {
  type: 'normal',
  expMult: 1,
  townNum: 7,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.interestCollected;
      case 2:
        return storyFlags.collected1KInterest;
      case 3:
        return storyFlags.collected1MInterest;
      case 4:
        return storyFlags.collectedMaxInterest;
    }
  },
  stats: {
    Con: 0.4,
    Per: 0.3,
    Spd: 0.3,
  },
  skills: {
    Mercantilism: 50,
  },
  allowed() {
    return 1;
  },
  manaCost() {
    return 1;
  },
  canStart() {
    return true;
  },
  visible() {
    return true;
  },
  unlocked() {
    return true;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
    let interestGold = Math.floor(globalThis.saving.vals.goldInvested * .001);
    globalThis.driver.addResource('gold', interestGold);
    globalThis.view.setStoryFlag('interestCollected');
    if (interestGold >= 1000) globalThis.view.setStoryFlag('collected1KInterest');
    if (interestGold >= 1000000) globalThis.view.setStoryFlag('collected1MInterest');
    if (interestGold >= 999999999) globalThis.view.setStoryFlag('collectedMaxInterest');
    return interestGold;
  },
});

Action.Seminar = new Action('Seminar', {
  type: 'normal',
  expMult: 1,
  townNum: 7,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.seminarAttended;
      case 2:
        return storyFlags.leadership10;
      case 3:
        return storyFlags.leadership100;
      case 4:
        return storyFlags.leadership1k;
    }
  },
  stats: {
    Cha: 0.8,
    Luck: 0.1,
    Soul: 0.1,
  },
  skills: {
    Leadership: 200,
  },
  manaCost() {
    return 20000;
  },
  canStart() {
    return resources.gold >= 1000;
  },
  cost() {
    globalThis.driver.addResource('gold', -1000);
  },
  visible() {
    return towns[this.townNum].getLevel('Survey') >= 100;
  },
  unlocked() {
    return towns[this.townNum].getLevel('Survey') >= 100;
  },
  goldCost() {
    return 1000;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
    let leadershipLevel = globalThis.stats.getSkillLevel('Leadership');
    if (leadershipLevel >= 10) globalThis.view.setStoryFlag('leadership10');
    if (leadershipLevel >= 100) globalThis.view.setStoryFlag('leadership100');
    if (leadershipLevel >= 1000) globalThis.view.setStoryFlag('leadership1k');
    globalThis.view.setStoryFlag('seminarAttended');
  },
});

Action.PurchaseKey = new Action('Purchase Key', {
  type: 'normal',
  expMult: 1,
  townNum: 7,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.keyBought;
    }
  },
  stats: {
    Cha: 0.8,
    Luck: 0.1,
    Soul: 0.1,
  },
  allowed() {
    return 1;
  },
  manaCost() {
    return 20000;
  },
  canStart() {
    return resources.gold >= 1000000 && !resources.key;
  },
  cost() {
    globalThis.driver.addResource('gold', -1000000);
  },
  visible() {
    return true;
  },
  unlocked() {
    return true;
  },
  goldCost() {
    return 1000000;
  },
  finish() {
    globalThis.driver.addResource('key', true);
    globalThis.view.setStoryFlag('keyBought');
  },
});

Action.SecretTrial = new TrialAction('Secret Trial', 3, {
  //1000 floors
  type: 'multipart',
  expMult: 0,
  townNum: 7,
  varName: 'STrial',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.trailSecretFaced;
      case 2:
        return storyFlags.trailSecret1Done;
      case 3:
        return storyFlags.trailSecret10Done;
      case 4:
        return storyFlags.trailSecret100Done;
      case 5:
        return storyFlags.trailSecret500Done;
      case 6:
        return storyFlags.trailSecretAllDone;
    }
  },
  stats: {
    Dex: 0.11,
    Str: 0.11,
    Con: 0.11,
    Spd: 0.11,
    Per: 0.11,
    Cha: 0.11,
    Int: 0.11,
    Luck: 0.11,
    Soul: 0.11,
  },
  loopStats: ['Dex', 'Str', 'Con', 'Spd', 'Per', 'Cha', 'Int', 'Luck', 'Soul'],
  affectedBy: ['Team'],
  baseScaling: 1.25,
  exponentScaling: 1e10,
  manaCost() {
    return 100000;
  },
  canStart() {
    return this.currentFloor() < globalThis.saving.trialFloors[this.trialNum];
  },
  baseProgress() {
    return globalThis.stats.getTeamCombat();
  },
  floorReward() {
    //None
  },
  visible() {
    return globalThis.saving.vals.storyMax >= 12 && globalThis.stats.getBuffLevel('Imbuement3') >= 7;
  },
  unlocked() {
    return globalThis.saving.vals.storyMax >= 12 && globalThis.stats.getBuffLevel('Imbuement3') >= 7;
  },
  finish() {
    globalThis.view.setStoryFlag('trailSecretFaced');
    let floor = this.currentFloor();
    if (floor >= 1) globalThis.view.setStoryFlag('trailSecret1Done');
    if (floor >= 10) globalThis.view.setStoryFlag('trailSecret10Done');
    if (floor >= 100) globalThis.view.setStoryFlag('trailSecret100Done');
    if (floor >= 500) globalThis.view.setStoryFlag('trailSecret500Done');
    if (floor == 1000) globalThis.view.setStoryFlag('trailSecretAllDone');
  },
});

Action.LeaveCity = new Action('Leave City', {
  type: 'normal',
  expMult: 2,
  townNum: 7,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return globalThis.saving.vals.townsUnlocked.includes(8);
    }
  },
  stats: {
    Con: 0.4,
    Per: 0.3,
    Spd: 0.3,
  },
  allowed() {
    return 1;
  },
  manaCost() {
    return 100000;
  },
  cost() {
    globalThis.driver.addResource('key', false);
  },
  canStart() {
    return resources.key;
  },
  visible() {
    return true;
  },
  unlocked() {
    return true;
  },
  finish() {
    globalThis.driver.unlockTown(8);
  },
  story(completed) {
    globalThis.view.unlockGlobalStory(11);
  },
});

//====================================================================================================
//Zone 9 - Valley of Olympus
//====================================================================================================
Action.ImbueSoul = new MultipartAction('Imbue Soul', {
  type: 'multipart',
  expMult: 5,
  townNum: 8,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.soulInfusionAttempted;
      case 2:
        return globalThis.globals.buffs['Imbuement3'].amt > 0;
      case 3:
        return globalThis.globals.buffs['Imbuement3'].amt > 6;
      case 4:
        return globalThis.globals.buffs['Imbuement'].amt > 499 &&
          globalThis.globals.buffs['Imbuement2'].amt > 499 &&
          globalThis.globals.buffs['Imbuement3'].amt > 6;
    }
  },
  stats: {
    Soul: 1.0,
  },
  loopStats: ['Soul', 'Soul', 'Soul'],
  manaCost() {
    return 5000000;
  },
  allowed() {
    return 1;
  },
  canStart(loopCounter = towns[8].ImbueSoulLoopCounter) {
    return loopCounter === 0 && globalThis.stats.getBuffLevel('Imbuement') > 499 &&
      globalThis.stats.getBuffLevel('Imbuement2') > 499 &&
      globalThis.stats.getBuffLevel('Imbuement3') < 7;
  },
  loopCost(segment) {
    return 100000000 * (segment * 5 + 1);
  },
  tickProgress(offset) {
    return globalThis.stats.getSkillLevel('Magic');
  },
  grantsBuff: 'Imbuement3',
  loopsFinished() {
    for (const stat of globalThis.globals.statList) {
      stats[stat].talentLevelExp.setLevel(0);
      stats[stat].soulstone = 0;
      globalThis.saving.view.requestUpdate('updateStat', stat);
    }
    globalThis.globals.buffs['Imbuement'].amt = 0;
    globalThis.globals.buffs['Imbuement2'].amt = 0;
    globalThis.saving.vals.trainingLimits = 10;
    globalThis.stats.addBuffAmt('Imbuement3', 1, this, 'imbuement3');
    globalThis.saving.view.updateBuffs();
    globalThis.saving.view.updateStats();
    globalThis.saving.view.requestUpdate('updateSoulstones', null);
  },
  getPartName() {
    return 'Imbue Soul';
  },
  visible() {
    return true;
  },
  unlocked() {
    return globalThis.stats.getBuffLevel('Imbuement') > 499 && globalThis.stats.getBuffLevel('Imbuement2') > 499;
  },
  finish() {
    globalThis.saving.view.requestUpdate('updateBuff', 'Imbuement3');
    globalThis.driver.capAllTraining();
    adjustTrainingExpMult();
  },
});

function adjustTrainingExpMult() {
  for (let actionName of trainingActions) {
    const actionProto = getActionPrototype(actionName);
    // @ts-ignore shh we're pretending it's frozen
    actionProto.expMult = 4 + globalThis.stats.getBuffLevel('Imbuement3');
    globalThis.saving.view.adjustExpMult(actionName);
  }
}

Action.BuildTower = new Action('Build Tower', {
  type: 'progress',
  progressScaling: 'linear',
  expMult: 1,
  townNum: 8,
  storyReqs(storyNum) {
    let buildingProg = towns[this.townNum].expBuildTower / 505;
    switch (storyNum) {
      case 1:
        return buildingProg >= 1;
      case 2:
        return buildingProg >= 10;
      case 3:
        return buildingProg >= 100;
      case 4:
        return buildingProg >= 250;
      case 5:
        return buildingProg >= 500;
      case 6:
        return buildingProg >= 750;
      case 7:
        return buildingProg >= 999;
    }
  },
  stats: {
    Dex: 0.1,
    Str: 0.3,
    Con: 0.3,
    Per: 0.2,
    Spd: 0.1,
  },
  affectedBy: ['Temporal Stone'],
  manaCost() {
    return 250000;
  },
  canStart() {
    return resources.stone;
  },
  visible() {
    return true;
  },
  unlocked() {
    return true;
  },
  finish() {
    globalThis.saving.vals.stonesUsed[globalThis.saving.vals.stoneLoc]++;
    globalThis.saving.vals.towns[this.townNum].finishProgress(this.varName, 505);
    globalThis.driver.addResource('stone', false);
    if (globalThis.saving.vals.towns[this.townNum].getLevel(this.varName) >= 100) {
      globalThis.saving.vals.stonesUsed = { 1: 250, 3: 250, 5: 250, 6: 250 };
    }
    adjustRocks(globalThis.saving.vals.stoneLoc);
  },
});

Action.GodsTrial = new TrialAction('Gods Trial', 1, {
  //100 floors
  type: 'multipart',
  expMult: 0.2,
  townNum: 8,
  varName: 'GTrial',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.trailGodsFaced;
      case 2:
        return storyFlags.trailGods10Done;
      case 3:
        return storyFlags.trailGods20Done;
      case 4:
        return storyFlags.trailGods30Done;
      case 5:
        return storyFlags.trailGods40Done;
      case 6:
        return storyFlags.trailGods50Done;
      case 7:
        return storyFlags.trailGods60Done;
      case 8:
        return storyFlags.trailGods70Done;
      case 9:
        return storyFlags.trailGods80Done;
      case 10:
        return storyFlags.trailGods90Done;
      case 11:
        return storyFlags.trailGodsAllDone;
    }
  },
  stats: {
    Dex: 0.11,
    Str: 0.11,
    Con: 0.11,
    Spd: 0.11,
    Per: 0.11,
    Cha: 0.11,
    Int: 0.11,
    Luck: 0.11,
    Soul: 0.11,
  },
  skills: {
    Combat: 250,
    Pyromancy: 50,
    Restoration: 50,
  },
  loopStats: ['Dex', 'Str', 'Con', 'Spd', 'Per', 'Cha', 'Int', 'Luck', 'Soul'],
  affectedBy: ['Team'],
  baseScaling: 1.3,
  exponentScaling: 1e7,
  manaCost() {
    return 50000;
  },
  canStart() {
    return this.currentFloor() < globalThis.saving.trialFloors[this.trialNum] && resources.power < 7;
  },
  baseProgress() {
    return globalThis.stats.getTeamCombat();
  },
  floorReward() {
    globalThis.view.setStoryFlag('trailGodsFaced');
    if (this.currentFloor() >= 10) globalThis.view.setStoryFlag('trailGods10Done');
    if (this.currentFloor() >= 20) globalThis.view.setStoryFlag('trailGods20Done');
    if (this.currentFloor() >= 30) globalThis.view.setStoryFlag('trailGods30Done');
    if (this.currentFloor() >= 40) globalThis.view.setStoryFlag('trailGods40Done');
    if (this.currentFloor() >= 50) globalThis.view.setStoryFlag('trailGods50Done');
    if (this.currentFloor() >= 60) globalThis.view.setStoryFlag('trailGods60Done');
    if (this.currentFloor() >= 70) globalThis.view.setStoryFlag('trailGods70Done');
    if (this.currentFloor() >= 80) globalThis.view.setStoryFlag('trailGods80Done');
    if (this.currentFloor() >= 90) globalThis.view.setStoryFlag('trailGods90Done');

    if (this.currentFloor() === globalThis.saving.trialFloors[this.trialNum]) { //warning: the predictor assumes the old behavior, but this is clearly the intended
      globalThis.view.setStoryFlag('trailGodsAllDone');
      globalThis.driver.addResource('power', 1);
    }
  },
  visible() {
    return towns[this.townNum].getLevel('BuildTower') >= 100;
  },
  unlocked() {
    return towns[this.townNum].getLevel('BuildTower') >= 100;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
  },
});

Action.ChallengeGods = new TrialAction('Challenge Gods', 2, {
  //7 floors
  type: 'multipart',
  expMult: 0.5,
  townNum: 8,
  varName: 'GFight',
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return storyFlags.fightGods01;
      case 2:
        return storyFlags.fightGods02;
      case 3:
        return storyFlags.fightGods03;
      case 4:
        return storyFlags.fightGods04;
      case 5:
        return storyFlags.fightGods05;
      case 6:
        return storyFlags.fightGods06;
      case 7:
        return storyFlags.fightGods07;
      case 8:
        return storyFlags.fightGods08;
      case 9:
        return storyFlags.fightGods09;
      case 10:
        return storyFlags.fightGods10;
      case 11:
        return storyFlags.fightGods11;
      case 12:
        return storyFlags.fightGods12;
      case 13:
        return storyFlags.fightGods13;
      case 14:
        return storyFlags.fightGods14;
      case 15:
        return storyFlags.fightGods15;
      case 16:
        return storyFlags.fightGods16;
      case 17:
        return storyFlags.fightGods17;
      case 18:
        return storyFlags.fightGods18;
    }
  },
  stats: {
    Dex: 0.11,
    Str: 0.11,
    Con: 0.11,
    Spd: 0.11,
    Per: 0.11,
    Cha: 0.11,
    Int: 0.11,
    Luck: 0.11,
    Soul: 0.11,
  },
  skills: {
    Combat: 500,
  },
  loopStats: ['Dex', 'Str', 'Con', 'Spd', 'Per', 'Cha', 'Int', 'Luck', 'Soul'],
  baseScaling: 2,
  exponentScaling: 1e16,
  manaCost() {
    return 50000;
  },
  canStart() {
    return this.currentFloor() < globalThis.saving.trialFloors[this.trialNum] && resources.power > 0 &&
      resources.power < 8;
  },
  baseProgress() {
    return globalThis.stats.getSelfCombat();
  },
  floorReward() {
    globalThis.driver.addResource('power', 1);
  },
  visible() {
    return towns[this.townNum].getLevel('BuildTower') >= 100;
  },
  unlocked() {
    return towns[this.townNum].getLevel('BuildTower') >= 100;
  },
  finish() {
    globalThis.stats.handleSkillExp(this.skills);
  },
  segmentFinished() {
    globalThis.saving.vals.curGodsSegment++;
    //Round 7 is segments 55 through 63
    switch (globalThis.saving.vals.curGodsSegment) {
      case 1:
        globalThis.view.setStoryFlag('fightGods01');
        break;
      case 2:
        globalThis.view.setStoryFlag('fightGods03');
        break;
      case 3:
        globalThis.view.setStoryFlag('fightGods05');
        break;
      case 4:
        globalThis.view.setStoryFlag('fightGods07');
        break;
      case 5:
        globalThis.view.setStoryFlag('fightGods09');
        break;
      case 6:
        globalThis.view.setStoryFlag('fightGods11');
        break;
      case 7:
        globalThis.view.setStoryFlag('fightGods13');
        break;
      case 8:
        globalThis.view.setStoryFlag('fightGods15');
        break;
      case 9:
        globalThis.view.setStoryFlag('fightGods17');
        break;
      case 55:
        if (globalThis.stats.getTalent('Dex') > 500000) globalThis.view.setStoryFlag('fightGods02');
        break;
      case 56:
        if (globalThis.stats.getTalent('Str') > 500000) globalThis.view.setStoryFlag('fightGods04');
        break;
      case 57:
        if (globalThis.stats.getTalent('Con') > 500000) globalThis.view.setStoryFlag('fightGods06');
        break;
      case 58:
        if (globalThis.stats.getTalent('Spd') > 500000) globalThis.view.setStoryFlag('fightGods08');
        break;
      case 59:
        if (globalThis.stats.getTalent('Per') > 500000) globalThis.view.setStoryFlag('fightGods10');
        break;
      case 60:
        if (globalThis.stats.getTalent('Cha') > 500000) globalThis.view.setStoryFlag('fightGods12');
        break;
      case 61:
        if (globalThis.stats.getTalent('Int') > 500000) globalThis.view.setStoryFlag('fightGods14');
        break;
      case 62:
        if (globalThis.stats.getTalent('Luck') > 500000) globalThis.view.setStoryFlag('fightGods16');
        break;
      case 63:
        if (globalThis.stats.getTalent('Soul') > 500000) globalThis.view.setStoryFlag('fightGods18');
        break;
      default:
        break;
    }
  },
});

Action.RestoreTime = new Action('Restore Time', {
  type: 'normal',
  expMult: 0,
  townNum: 8,
  storyReqs(storyNum) {
    switch (storyNum) {
      case 1:
        return globalThis.saving.vals.storyMax >= 12;
    }
  },
  stats: {
    Luck: 0.5,
    Soul: 0.5,
  },
  allowed() {
    return 1;
  },
  manaCost() {
    return 7777777;
  },
  canStart() {
    return resources.power >= 8;
  },
  visible() {
    return towns[this.townNum].getLevel('BuildTower') >= 100;
  },
  unlocked() {
    return towns[this.townNum].getLevel('BuildTower') >= 100;
  },
  finish() {
    globalThis.driver.addResource('reputation', 9999999);
    globalThis.prestige.completedCurrentGame();
  },
  story(completed) {
    globalThis.view.unlockGlobalStory(12);
  },
});

const actionsWithGoldCost = Object.values(Action).filter(
  (action) => action.goldCost !== undefined,
);

const _actionList = {
  actionsWithGoldCost,
  adjustTrainingExpMult,
  adjustPots,
  adjustLocks,
  adjustSQuests,
  adjustLQuests,
  adjustWildMana,
  adjustHerbs,
  adjustHunt,
  adjustSuckers,
  adjustGeysers,
  adjustMineSoulstones,
  adjustArtifacts,
  adjustDonations,
  adjustWells,
  adjustPylons,
  adjustPockets,
  adjustWarehouses,
  adjustInsurance,
  adjustAllRocks,
  exchangeMap,
  getExploreSkill,
  getExploreExp,
  getExploreExpSinceLastProgress,
  getExploreExpToNextProgress,
  getExploreProgress,
  getTotalExploreProgress,
  fullyExploredZones,
  Action,
  getCraftGuildRank,
  getAdvGuildRank,
  lateGameActions,
  actionTypes,
  townNames,
  getXMLName,
  isActionOfType,
  isTraining,
  getTravelNum,
  getPossibleTravel,
  isTravel,
  hasLimit,
  trainingActions,
  limitedActions,
  translateClassNames,
  ClassNameNotFoundError,
  withoutSpaces,
  getActionPrototype,
};

globalThis.actionList = _actionList;
