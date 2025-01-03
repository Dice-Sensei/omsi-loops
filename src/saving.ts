class ActionLog {
  /** @type {ActionLogEntry[]} */
  entries = [];
  /** @type {Record<string, UniqueLogEntry>} */
  #uniqueEntries = {};
  /** @type {number | null} */
  firstNewOrUpdatedEntry = null;
  /** @type {number | null} */
  earliestShownEntry = null;

  /**
   * @template {ActionLogEntry} T
   * @param {T} entry
   * @param {boolean} init
   * @returns {T}
   */
  addEntry(entry, init) {
    if (entry instanceof UniqueLogEntry) {
      if (entry.key in this.#uniqueEntries) return /** @type {any} */ (this.#uniqueEntries[entry.key]);
      this.#uniqueEntries[entry.key] = entry;
    }
    if (entry.entryIndex === null) {
      entry.entryIndex = this.entries.length;
      this.entries.push(entry);
    }
    if (!init && options.actionLog) {
      this.firstNewOrUpdatedEntry = Math.min(this.firstNewOrUpdatedEntry ?? Infinity, entry.entryIndex);
      this.earliestShownEntry ??= entry.entryIndex;
      if (this.earliestShownEntry > entry.entryIndex + 1) {
        this.loadHistoryBackTo(entry.entryIndex + 1);
      }
      globalThis.saving.view.requestUpdate('updateActionLogEntry', entry.entryIndex);
    }
    return entry;
  }

  hasPrevious() {
    if (this.entries.length === 0) return false;
    return this.earliestShownEntry == null || this.earliestShownEntry > 0;
  }

  getEntry(index) {
    if (index === 'clear') {
      this.firstNewOrUpdatedEntry = null;
      this.earliestShownEntry = null;
      return null;
    } else if (index < (this.earliestShownEntry ?? Infinity)) {
      this.earliestShownEntry = index;
    }
    return this.entries[index];
  }

  toJSON() {
    return globalThis.helpers.extractStrings(this.entries);
  }

  initialize() {
    this.entries = [];
    this.#uniqueEntries = {};
    this.firstNewOrUpdatedEntry = null;
    this.earliestShownEntry = null;
    globalThis.saving.view.requestUpdate('updateActionLogEntry', 'clear');
  }

  /** @param {unknown} data  */
  load(data) {
    this.initialize();
    if (!Array.isArray(data)) return;
    for (const entryData of globalThis.helpers.restoreStrings(data)) {
      const entry = ActionLogEntry.create(entryData);
      if (entry) {
        this.addOrUpdateEntry(entry, true);
      }
    }
  }

  loadHistory(count) {
    this.earliestShownEntry ??= this.entries.length;
    this.loadHistoryBackTo(this.earliestShownEntry - count);
  }

  loadHistoryBackTo(index) {
    this.earliestShownEntry ??= this.entries.length;
    while (this.earliestShownEntry > Math.max(0, index)) {
      globalThis.saving.view.requestUpdate('updateActionLogEntry', --this.earliestShownEntry);
    }
  }

  loadRecent() {
    this.earliestShownEntry ??= this.entries.length;
    while (
      this.earliestShownEntry > 0 &&
      (this.entries[this.earliestShownEntry - 1].repeatable || this.earliestShownEntry > this.entries.length - 3)
    ) {
      view.requestUpdate('updateActionLogEntry', --this.earliestShownEntry);
    }
  }

  /**
   * @template {ActionLogEntry} T
   * @param {T} entry
   * @param {boolean} init
   * @returns {T}
   */
  addOrUpdateEntry(entry, init) {
    for (let i = this.entries.length - 1; i >= 0; i--) {
      const other = this.entries[i];
      if (other instanceof RepeatableLogEntry && other.canMerge(entry)) {
        other.merge(entry);
        return this.addEntry(other, init);
      } else if (!other.repeatable) {
        break;
      }
    }
    return this.addEntry(entry, init);
  }

  addActionStory(action, storyindex, init) {
    const entry = new ActionStoryEntry(action, storyindex);
    this.addEntry(entry, init);
  }

  addGlobalStory(num) {
    const entry = new GlobalStoryEntry(num);
    this.addEntry(entry, false);
  }

  /** @type {(action: Action, stat: StatName, count: number, init?: boolean) => void} */
  addSoulstones(action, stat, count, init = false) {
    const entry = new SoulstoneEntry(action).addSoulstones(stat, count);
    this.addOrUpdateEntry(entry, init);
  }

  /** @type {(action: Action, skill: SkillName, toLevel: number, fromLevel?: number, init?: boolean) => void} */
  addSkillLevel(action, skill, toLevel, fromLevel, init) {
    const entry = new SkillEntry(action, skill, toLevel, fromLevel);
    this.addOrUpdateEntry(entry, init);
  }

  /** @type {(action: Action, buff: BuffName, toAmt: number, fromAmt: number, spendType?:BuffEntry["statSpendType"], statsSpent?: SoulstoneEntry["stones"]) => void} */
  addBuff(action, buff, toAmt, fromAmt, spendType, statsSpent) {
    const entry = new BuffEntry(action, buff, toAmt, fromAmt, undefined, statsSpent, spendType);
    this.addOrUpdateEntry(entry, false);
  }
}

class ActionLogEntry {
  /** @type {ActionLogEntryTypeName} */
  type;
  /** @type {number} */
  #entryIndex = null;
  get entryIndex() {
    return this.#entryIndex;
  }
  set entryIndex(index) {
    this.#entryIndex = index;
  }
  /** @type {number} */
  loop;
  /** @type {ActionName|ActionId|null} */
  actionName;

  get action() {
    return globalThis.actionList.getActionPrototype(this.actionName) || null;
  }

  get repeatable() {
    return false;
  }

  /** @type {HTMLElement} */
  #element;
  get element() {
    return this.#element ??= this.createElement();
  }
  set element(value) {
    this.#element = value;
  }

  /** @param {[type: ActionLogEntryTypeName, ...unknown[]]} data @returns {ActionLogEntryInstance | null} */
  static create(data) {
    if (!Array.isArray(data)) return null;
    const type = actionLogEntryTypeMap[data[0]];
    if (!type) return null;
    const entry = new type();
    entry.load(data);
    return entry;
  }

  /**
   * @param {ActionLogEntryTypeName} type
   * @param {Action|string|null} action
   * @param {number=} loop
   */
  constructor(type, action, loop) {
    this.type = type;
    this.loop = typeof loop === 'number' && loop >= 0 ? loop : globalThis.saving.vals.currentLoop;
    this.actionName = typeof action === 'string' ? action : action?.name ?? null;
  }
  /** @returns {any[]} */
  toJSON() {
    return [this.type, this.actionName, this.loop];
  }
  load(data) {
    const [_type, actionName, loop, ...rest] = data;
    this.actionName = typeof actionName === 'string' ? /** @type {ActionName|ActionId} */ (actionName) : null;
    this.loop = typeof loop === 'number' && loop >= 0 ? loop : globalThis.saving.vals.currentLoop;
    return rest;
  }
  createElement() {
    const div = document.createElement('div');
    div.innerHTML = `<li class="actionLogEntry" data-type="${this.type}" data-${
      this.repeatable ? 'repeatable' : 'unique'
    }="${this.repeatable ? 'repeatable' : 'unique'}">${this.format(this.getText())}</li>`;
    return /** @type {HTMLElement} */ (div.children[0]);
  }
  updateElement() {
    if (this.#element) {
      this.#element.innerHTML = this.format(this.getText());
    }
  }
  /** @type {(text: string) => string} */
  format(text) {
    let lastText = null;
    while (lastText !== text) {
      lastText = text;
      text = text.replace(/{(.*?)}/g, (_, k) => this.getReplacement(k));
    }
    return text;
  }

  /** @type {(key: string) => string} */
  getReplacement(key) {
    if (key === 'loop') return globalThis.helpers.formatNumber(this.loop);
    if (key === 'loopStart') return globalThis.helpers.formatNumber(this.loop);
    if (key === 'loopEnd') return globalThis.helpers.formatNumber(this.loop);
    if (key === 'town') return globalThis.actionList.townNames[this.action?.townNum];
    if (key === 'action') return this.action?.label;
    if (key === 'header') return globalThis.Localization.txt('actions>log>header');
    throw new Error(`Bad key ${key}`);
  }

  /** @returns {string} */
  getText() {
    throw new Error('Method not implemented.');
  }
}

class UniqueLogEntry extends ActionLogEntry {
  /** @type {string} */
  get key() {
    return `${this.type}:${this.actionName}`;
  }
}

class RepeatableLogEntry extends ActionLogEntry {
  /** @type {number} */
  loopEnd;

  get repeatable() {
    return true;
  }

  /**
   * @param {ActionLogEntryTypeName} type
   * @param {Action|string|null} action
   * @param {(number | [loopStart: number, loopEnd: number])=} loop
   */
  constructor(type, action, loop) {
    super(type, action, Array.isArray(loop) ? loop[0] : loop);
    this.loopEnd = Array.isArray(loop) && typeof loop[1] === 'number' && loop[1] >= 0 ? loop[1] : this.loop;
  }
  toJSON() {
    return [...super.toJSON(), this.loopEnd];
  }
  load(data) {
    const [loopEnd, ...rest] = super.load(data);
    this.loopEnd = typeof loopEnd === 'number' ? loopEnd : this.loop;
    return rest;
  }

  /** @param {string} key  */
  getReplacement(key) {
    if (key === 'loop') {
      return this.loop === this.loopEnd
        ? globalThis.helpers.formatNumber(this.loop)
        : globalThis.Localization.txt('actions>log>multiloop');
    }
    if (key === 'loopEnd') return globalThis.helpers.formatNumber(this.loopEnd);
    return super.getReplacement(key);
  }

  merge(other) {
    this.loopEnd = Math.max(this.loopEnd, other.loopEnd);
    this.loop = Math.min(this.loop, other.loop);
    return this;
  }

  /** @type {<T extends ActionLogEntry>(other: T) => this is T} */
  canMerge(other) {
    return this.type === other.type && this.actionName === other.actionName && this.canMergeParameters(other);
  }

  /** @returns {boolean} */
  canMergeParameters(_other) {
    return false;
  }
}

class ActionStoryEntry extends UniqueLogEntry {
  /** @type {number} */
  storyIndex;

  get key() {
    return `${super.key}:${this.storyIndex}`;
  }

  /**
   * @param {Action|string=} action
   * @param {number=} storyIndex
   * @param {number=} loop
   */
  constructor(action, storyIndex, loop) {
    super('story', action, loop);
    this.storyIndex = storyIndex;
  }
  toJSON() {
    return [...super.toJSON(), this.storyIndex];
  }
  load(data) {
    const [storyIndex] = super.load(data);
    this.storyIndex = typeof storyIndex === 'number' && storyIndex >= 0 ? storyIndex : null;
  }

  getText() {
    return globalThis.Localization.txt('actions>log>action_story');
  }

  getReplacement(key) {
    if (key === 'condition' || key === 'story') {
      const storyInfo = globalThis.actionList.getActionPrototype(this.actionName)?.getStoryTexts()?.find(({ num }) =>
        num === this.storyIndex
      );

      if (storyInfo) {
        if (key === 'condition') return storyInfo.condition;
        if (key === 'story') return storyInfo.text;
      } else {
        if (key === 'condition') return '???';
        if (key === 'story') return globalThis.Localization.txt(`actions>log>action_story_not_found`);
      }
    }

    return super.getReplacement(key);
  }
}

class GlobalStoryEntry extends UniqueLogEntry {
  /** @type {number} */
  chapter;

  get key() {
    return `${super.key}:${this.chapter}`;
  }

  /**
   * @param {number=} chapter
   * @param {number=} loop
   */
  constructor(chapter, loop) {
    super('global', null, loop);
    this.chapter = chapter;
  }
  toJSON() {
    return [...super.toJSON(), this.chapter];
  }
  load(data) {
    const [chapter] = super.load(data);
    this.chapter = typeof chapter === 'number' ? chapter : null;
  }

  getText() {
    return globalThis.Localization.txt('actions>log>global_story');
  }

  getReplacement(key) {
    if (key === 'story') return globalThis.Localization.txt(`time_controls>stories>story[num="${this.chapter}"]`);
    return super.getReplacement(key);
  }
}

class SoulstoneEntry extends RepeatableLogEntry {
  count = 0;
  /** @type {{[K in StatName]?: number}} */
  stones = {};

  /**
   * @param {Action=} action
   * @param {(number | [loopStart: number, loopEnd: number])=} loop
   */
  constructor(action, loop) {
    super('soulstone', action, loop);
  }
  // @ts-ignore
  toJSON() {
    return [...super.toJSON(), this.stones];
  }
  load(data) {
    const [stones] = super.load(data);
    this.count = 0;
    this.stones = {};
    if (stones && typeof stones === 'object') {
      this.addAllSoulstones(stones);
    }
  }

  /** @type {(stat: StatName, count: number) => SoulstoneEntry} */
  addSoulstones(stat, count) {
    this.stones[stat] ??= 0;
    this.stones[stat] += count;
    this.count += count;
    return this;
  }

  /** @param {SoulstoneEntry["stones"]} stones  */
  addAllSoulstones(stones) {
    for (const stat of statList) {
      if (stat in stones && typeof stones[stat] === 'number') {
        this.addSoulstones(stat, stones[stat]);
      }
    }
  }

  getText() {
    return globalThis.Localization.txt(
      this.count === 1
        ? 'actions>log>soulstone'
        : Object.keys(this.stones).length === 1
        ? 'actions>log>soulstone_singlemulti'
        : 'actions>log>soulstone_multi',
    );
  }

  getReplacement(key) {
    if (key === 'count') return globalThis.helpers.intToString(this.count, 1);
    if (key === 'stat_long') return globalThis.Localization.txt(`stats>${Object.keys(this.stones)[0]}>long_form`);
    if (key === 'stat') return globalThis.Localization.txt(`stats>${Object.keys(this.stones)[0]}>short_form`);
    if (key === 'stats') {
      const strs = [];
      const template = globalThis.Localization.txt(
        Object.keys(this.stones).length > 3 ? 'actions>log>soulstone_stat_short' : 'actions>log>soulstone_stat',
      );
      for (const stat in stats) {
        if (stat in this.stones) {
          strs.push(
            template
              .replace('{count}', globalThis.helpers.intToString(this.stones[stat], 1))
              .replace('{stat_long}', globalThis.Localization.txt(`stats>${stat}>long_form`))
              .replace('{stat}', globalThis.Localization.txt(`stats>${stat}>short_form`)),
          );
        }
      }
      return strs.join(', ');
    }
    return super.getReplacement(key);
  }

  canMergeParameters() {
    return true;
  }

  /** @param {SoulstoneEntry} other */
  merge(other) {
    this.addAllSoulstones(other.stones);
    return super.merge(other);
  }
}

class LeveledLogEntry extends RepeatableLogEntry {
  /** @type {string} */
  name;

  /** @type {number} */
  fromLevel;
  /** @type {number} */
  toLevel;

  /**
   * @param {ActionLogEntryTypeName} type
   * @param {Action} action
   * @param {string} name
   * @param {number} toLevel
   * @param {number=} fromLevel
   * @param {(number | [loopStart: number, loopEnd: number])=} loop
   */
  constructor(type, action, name, toLevel, fromLevel, loop) {
    super(type, action, loop);
    this.name = name;
    this.fromLevel = fromLevel ?? toLevel - 1;
    this.toLevel = toLevel;
  }
  toJSON() {
    return [...super.toJSON(), this.name, this.fromLevel, this.toLevel];
  }
  load(data) {
    const [name, fromLevel, toLevel, ...rest] = super.load(data);
    this.name = typeof name === 'string' ? name : null;
    this.fromLevel = typeof fromLevel === 'number' ? fromLevel : null;
    this.toLevel = typeof toLevel === 'number' ? toLevel : null;
    return rest;
  }

  getReplacement(key) {
    if (key === 'levels') return globalThis.helpers.formatNumber(this.toLevel - this.fromLevel);
    if (key === 'fromLevel') return globalThis.helpers.formatNumber(this.fromLevel);
    if (key === 'toLevel') return globalThis.helpers.formatNumber(this.toLevel);
    return super.getReplacement(key);
  }

  /** @param {LeveledLogEntry} other */
  canMergeParameters(other) {
    return this.name === other.name;
  }

  /** @param {LeveledLogEntry} other */
  merge(other) {
    this.fromLevel = Math.min(this.fromLevel, other.fromLevel);
    this.toLevel = Math.max(this.toLevel, other.toLevel);
    return super.merge(other);
  }
}

class SkillEntry extends LeveledLogEntry {
  /**
   * @param {Action=} action
   * @param {SkillName=} skill
   * @param {number=} toLevel
   * @param {number=} fromLevel
   * @param {(number | [loopStart: number, loopEnd: number])=} loop
   */
  constructor(action, skill, toLevel, fromLevel, loop) {
    super('skill', action, skill, toLevel, fromLevel, loop);
  }

  getText() {
    return globalThis.Localization.txt(
      this.toLevel === this.fromLevel + 1 ? 'actions>log>skill' : 'actions>log>skill_multi',
    );
  }

  getReplacement(key) {
    if (key === 'skill') {
      return globalThis.Localization.txt(`skills>${globalThis.actionList.getXMLName(this.name)}>label`);
    }
    return super.getReplacement(key);
  }
}

class BuffEntry extends LeveledLogEntry {
  // the list of soulstones/talent levels spent is stored in-memory as a fake soulstone log entry so we can use its replacements
  /** @type {SoulstoneEntry} */
  soulstoneEntry;
  /** @type {"soulstone" | "talent" | "imbuement3"} */
  statSpendType;

  /**
   * @param {Action=} action
   * @param {BuffName=} buff
   * @param {number=} toLevel
   * @param {number=} fromLevel
   * @param {(number | [loopStart: number, loopEnd: number])=} loop
   * @param {SoulstoneEntry["stones"]=} statsSpent
   * @param {BuffEntry["statSpendType"]=} statSpendType
   */
  constructor(action, buff, toLevel, fromLevel, loop, statsSpent, statSpendType) {
    super('buff', action, buff, toLevel, fromLevel, loop);

    this.statSpendType = statSpendType;
    this.soulstoneEntry = new SoulstoneEntry();
    if (statsSpent) {
      this.soulstoneEntry.addAllSoulstones(statsSpent);
    }
  }
  toJSON() {
    return [...super.toJSON(), this.statSpendType, this.soulstoneEntry.stones];
  }
  load(data) {
    const [spendType, stones] = super.load(data);
    // @ts-ignore
    this.statSpendType = typeof spendType === 'string' ? spendType : '';
    if (stones && typeof stones === 'object') {
      this.soulstoneEntry.addAllSoulstones(stones);
    }
  }

  getText() {
    let tag = 'buff';
    if (this.fromLevel === 0) tag += '_from0';
    if (this.toLevel !== this.fromLevel + 1) tag += '_multi';
    return globalThis.Localization.txt(`actions>log>${tag}`);
  }

  /** @param {string} key */
  getReplacement(key) {
    if (key === 'buff') {
      return globalThis.Localization.txt(
        `buffs>${globalThis.actionList.getXMLName(globalThis.stats.Buff.fullNames[this.name])}>label`,
      );
    }
    if (key === 'buff_cost') {
      return this.statSpendType
        ? globalThis.Localization.txt(
          `actions>log>buff_cost_${
            this.statSpendType === 'soulstone' && Object.keys(this.soulstoneEntry.stones).length === 1
              ? 'soulstone_single'
              : this.statSpendType
          }`,
        )
        : '';
    }
    if (key === 'count' || key.startsWith('stat')) return this.soulstoneEntry.getReplacement(key);
    return super.getReplacement(key);
  }

  /** @param {BuffEntry} other  */
  canMergeParameters(other) {
    return this.statSpendType === other.statSpendType && super.canMergeParameters(other) &&
      this.soulstoneEntry.canMerge(other.soulstoneEntry);
  }

  /** @param {BuffEntry} other  */
  merge(other) {
    this.soulstoneEntry.merge(other.soulstoneEntry);
    return super.merge(other);
  }
}

const actionLogEntryTypeMap = {
  'story': ActionStoryEntry,
  'global': GlobalStoryEntry,
  'soulstone': SoulstoneEntry,
  'skill': SkillEntry,
  'buff': BuffEntry,
};

const defaultSaveName = 'idleLoops1';
const challengeSaveName = 'idleLoopsChallenge';
let saveName = defaultSaveName;

const selfIsGame = typeof globalThis?.view?.View !== 'undefined';

const timeNeededInitial = 5 * 50;
const view = selfIsGame ? new globalThis.view.View() : null;

const vals = {
  trainingLimits: 10,
};

// Globals!!!!!
const actions = new globalThis.actions.Actions();

const actionLog = selfIsGame ? new ActionLog() : null;

const towns = /** @type {TownList<9>} */ (/** @type {Town[]} */ ([]));

let curTown = 0;
const statList = /** @type {const} */ ['Dex', 'Str', 'Con', 'Spd', 'Per', 'Cha', 'Int', 'Luck', 'Soul'];
const stats = /** @type {{[K in StatName]: Stat}} */ ({});

let totalTalent = 0;
let shouldRestart = true;

let resources = {
  gold: 0,
  reputation: 0,
  herbs: 0,
  hide: 0,
  potions: 0,
  teamMembers: 0,
  armor: 0,
  blood: 0,
  artifacts: 0,
  favors: 0,
  enchantments: 0,
  houses: 0,
  pylons: 0,
  zombie: 0,
  map: 0,
  completedMap: 0,
  heart: 0,
  power: 0,
  glasses: false,
  supplies: false,
  pickaxe: false,
  loopingPotion: false,
  citizenship: false,
  pegasus: false,
  key: false,
  stone: false,
  wizardCollege: false,
};
let hearts = [];
const resourcesTemplate = globalThis.helpers.copyObject(resources);
let guild = '';
let escapeStarted = false;
let portalUsed = false;
let stoneLoc = 0;

let curLoadout = 0;
let loadouts;
let loadoutnames;
const skillList = /** @type {const} */ ([
  'Combat',
  'Magic',
  'Practical',
  'Alchemy',
  'Crafting',
  'Dark',
  'Chronomancy',
  'Pyromancy',
  'Restoration',
  'Spatiomancy',
  'Mercantilism',
  'Divine',
  'Commune',
  'Wunderkind',
  'Gluttony',
  'Thievery',
  'Leadership',
  'Assassin',
]);
const skills = /** @type {{[K in SkillName]: Skill}} */ ({});
const buffList = /** @type {const} */ ([
  'Ritual',
  'Imbuement',
  'Imbuement2',
  'Feast',
  'Aspirant',
  'Heroism',
  'Imbuement3',
  'PrestigePhysical',
  'PrestigeMental',
  'PrestigeCombat',
  'PrestigeSpatiomancy',
  'PrestigeChronomancy',
  'PrestigeBartering',
  'PrestigeExpOverflow',
]);

const dungeonFloors = [6, 9, 20];
const buffHardCaps = {
  Ritual: 666,
  Imbuement: 500,
  Imbuement2: 500,
  Imbuement3: 7,
  Feast: 100,
  Aspirant: 20,
  Heroism: 50,
  PrestigePhysical: 100,
  PrestigeMental: 100,
  PrestigeCombat: 100,
  PrestigeSpatiomancy: 100,
  PrestigeChronomancy: 100,
  PrestigeBartering: 100,
  PrestigeExpOverflow: 100,
};
const buffCaps = {
  Ritual: 666,
  Imbuement: 500,
  Imbuement2: 500,
  Imbuement3: 7,
  Feast: 100,
  Aspirant: 20,
  Heroism: 50,
  PrestigePhysical: 100,
  PrestigeMental: 100,
  PrestigeCombat: 100,
  PrestigeSpatiomancy: 100,
  PrestigeChronomancy: 100,
  PrestigeBartering: 100,
  PrestigeExpOverflow: 100,
};
const buffs = /** @type {{[K in BuffName]: Buff}} */ ({});
let goldInvested = 0;
let stonesUsed;
let townShowing = 0;
let actionStoriesShowing = false;
let townsUnlocked = [];
let completedActions = [];

let storyShowing = 0;
let storyMax = 0;
let unreadActionStories;

const storyFlags = {
  maxSQuestsInALoop: false,
  realMaxSQuestsInALoop: false,
  maxLQuestsInALoop: false,
  realMaxLQuestsInALoop: false,
  heal10PatientsInALoop: false,
  failedHeal: false,
  clearSDungeon: false,
  haggle: false,
  haggle15TimesInALoop: false,
  haggle16TimesInALoop: false,
  glassesBought: false,
  partyThrown: false,
  partyThrown2: false,
  strengthTrained: false,
  suppliesBought: false,
  suppliesBoughtWithoutHaggling: false,
  smallDungeonAttempted: false,
  satByWaterfall: false,
  dexterityTrained: false,
  speedTrained: false,
  birdsWatched: false,
  darkRitualThirdSegmentReached: false,
  brewed50PotionsInALoop: false,
  failedBrewPotions: false,
  failedBrewPotionsNegativeRep: false,
  potionBrewed: false,
  failedGamble: false,
  failedGambleLowMoney: false,
  potionSold: false,
  sell20PotionsInALoop: false,
  sellPotionFor100Gold: false,
  sellPotionFor1kGold: false,
  manaZ3Bought: false,
  advGuildTestsTaken: false,
  advGuildRankEReached: false,
  advGuildRankDReached: false,
  advGuildRankCReached: false,
  advGuildRankBReached: false,
  advGuildRankAReached: false,
  advGuildRankSReached: false,
  advGuildRankUReached: false,
  advGuildRankGodlikeReached: false,
  teammateGathered: false,
  fullParty: false,
  failedGatherTeam: false,
  largeDungeonAttempted: false,
  clearLDungeon: false,
  craftGuildTestsTaken: false,
  craftGuildRankEReached: false,
  craftGuildRankDReached: false,
  craftGuildRankCReached: false,
  craftGuildRankBReached: false,
  craftGuildRankAReached: false,
  craftGuildRankSReached: false,
  craftGuildRankUReached: false,
  craftGuildRankGodlikeReached: false,
  armorCrafted: false,
  craft10Armor: false,
  craft20Armor: false,
  failedCraftArmor: false,
  booksRead: false,
  pickaxeBought: false,
  heroTrial1Done: false,
  heroTrial10Done: false,
  heroTrial25Done: false,
  heroTrial50Done: false,
  charonPaid: false,
  loopingPotionMade: false,
  slay6TrollsInALoop: false,
  slay20TrollsInALoop: false,
  imbueMindThirdSegmentReached: false,
  imbueBodyThirdSegmentReached: false,
  failedImbueBody: false,
  judgementFaced: false,
  ignoredByGods: false,
  acceptedIntoValhalla: false,
  castIntoShadowRealm: false,
  spokeToGuru: false,
  fellFromGrace: false,
  donatedToCharity: false,
  receivedDonation: false,
  failedReceivedDonations: false,
  tidiedUp: false,
  manaZ5Bought: false,
  artifactSold: false,
  artifactDonated: false,
  donated20Artifacts: false,
  donated40Artifacts: false,
  charmSchoolVisited: false,
  oracleVisited: false,
  armorEnchanted: false,
  enchanted10Armor: false,
  enchanted20Armor: false,
  repeatedCitizenExam: false,
  houseBuilt: false,
  housesBuiltGodlike: false,
  built50Houses: false,
  collectedTaxes: false,
  collected50Taxes: false,
  acquiredPegasus: false,
  acquiredPegasusWithTeam: false,
  giantGuildTestTaken: false,
  giantGuildRankDReached: false,
  giantGuildRankCReached: false,
  giantGuildRankEReached: false,
  giantGuildRankBReached: false,
  giantGuildRankAReached: false,
  giantGuildRankSReached: false,
  giantGuildRankSSReached: false,
  giantGuildRankSSSReached: false,
  giantGuildRankUReached: false,
  giantGuildRankGodlikeReached: false,
  blessingSought: false,
  greatBlessingSought: false,
  feastAttempted: false,
  meanderIM100: false,
  wellDrawn: false,
  drew10Wells: false,
  drew15Wells: false,
  drewDryWell: false,
  attemptedRaiseZombie: false,
  failedRaiseZombie: false,
  spireAttempted: false,
  clearedSpire: false,
  spire10Pylons: false,
  spire20Pylons: false,
  suppliesPurchased: false,
  deadTrial1Done: false,
  deadTrial10Done: false,
  deadTrial25Done: false,
  monsterGuildTestTaken: false,
  monsterGuildRankDReached: false,
  monsterGuildRankCReached: false,
  monsterGuildRankBReached: false,
  monsterGuildRankAReached: false,
  monsterGuildRankSReached: false,
  monsterGuildRankSSReached: false,
  monsterGuildRankSSSReached: false,
  monsterGuildRankUReached: false,
  monsterGuildRankGodlikeReached: false,
  survivorRescued: false,
  rescued6Survivors: false,
  rescued20Survivors: false,
  buffetHeld: false,
  buffetFor1: false,
  buffetFor6: false,
  portalOpened: false,
  excursionAsGuildmember: false,
  explorerGuildTestTaken: false,
  mapTurnedIn: false,
  thiefGuildTestsTaken: false,
  thiefGuildRankEReached: false,
  thiefGuildRankDReached: false,
  thiefGuildRankCReached: false,
  thiefGuildRankBReached: false,
  thiefGuildRankAReached: false,
  thiefGuildRankSReached: false,
  thiefGuildRankUReached: false,
  thiefGuildRankGodlikeReached: false,
  assassinHeartDelivered: false,
  assassin4HeartsDelivered: false,
  assassin8HeartsDelivered: false,
  investedOne: false,
  investedTwo: false,
  interestCollected: false,
  collected1KInterest: false,
  collected1MInterest: false,
  collectedMaxInterest: false,
  seminarAttended: false,
  leadership10: false,
  leadership100: false,
  leadership1k: false,
  keyBought: false,
  trailSecretFaced: false,
  trailSecret1Done: false,
  trailSecret10Done: false,
  trailSecret100Done: false,
  trailSecret500Done: false,
  trailSecretAllDone: false,
  soulInfusionAttempted: false,
  trailGodsFaced: false,
  trailGods10Done: false,
  trailGods20Done: false,
  trailGods30Done: false,
  trailGods40Done: false,
  trailGods50Done: false,
  trailGods60Done: false,
  trailGods70Done: false,
  trailGods80Done: false,
  trailGods90Done: false,
  trailGodsAllDone: false,
  fightGods01: false,
  fightGods02: false,
  fightGods03: false,
  fightGods04: false,
  fightGods05: false,
  fightGods06: false,
  fightGods07: false,
  fightGods08: false,
  fightGods09: false,
  fightGods10: false,
  fightGods11: false,
  fightGods12: false,
  fightGods13: false,
  fightGods14: false,
  fightGods15: false,
  fightGods16: false,
  fightGods17: false,
  fightGods18: false,
};
const storyReqs = storyFlags;

const storyVars = {
  maxWizardGuildSegmentCleared: -1,
  maxZombiesRaised: -1,
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
      if (loadingFlags['wizardGuildRankEReached']) return 6;
      if (loadingFlags['wizardGuildTestTaken']) return 0;
    },
  },
};

let totals = {
  time: 0,
  effectiveTime: 0,
  borrowedTime: 0,
  loops: 0,
  actions: 0,
};

let challengeSave = {
  challengeMode: 0,
  inChallenge: false,
};

let totalActionList = [];
let dungeons = [[], [], []];

const options = {
  theme: 'normal',
  themeVariant: '',
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
};
// Globals!!!!!

let trials = [[], [], [], [], []];
const trialFloors = [50, 100, 7, 1000, 25];

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

globalThis.Data.registerAll({
  actions,
  towns,
  stats,
  resources,
  hearts,
  skills,
  buffs,
  prestigeValues: globalThis.prestige.prestigeValues,
  townsUnlocked,
  completedActions,
  storyFlags,
  storyVars,
  totals,
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
  'theme',
  'themeVariant',
  'predictorTrackedStat',
];

const isStandardOption = {
  theme: true,
  themeVariant: false,
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
    const input = /** @type {HTMLInputElement} */ (getInput());
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
      options.notifyOnPause = false;
      input.checked = false;
      input.indeterminate = false;
    }
  },
  updateRate(value, init) {
    if (!init) globalThis.driver.recalcInterval(value);
  },
  actionLog(value, init) {
    document.getElementById('actionLogContainer').style.display = value ? '' : 'none';
    document.getElementById('navbar_action_log').style.display = value ? '' : 'none';
  },
  predictor(value, init) {
    localStorage['loadPredictor'] = value || '';
  },
  speedIncrease10x: globalThis.driver.checkExtraSpeed,
  speedIncrease20x: globalThis.driver.checkExtraSpeed,
  speedIncreaseCustom: globalThis.driver.checkExtraSpeed,
  speedIncreaseBackground(value, init) {
    globalThis.driver.checkExtraSpeed();
    if (typeof value === 'number' && !isNaN(value) && value < 1 && value >= 0) {
      document.getElementById('speedIncreaseBackgroundWarning').style.display = '';
    } else {
      document.getElementById('speedIncreaseBackgroundWarning').style.display = 'none';
    }
  },
  bonusIsActive(value, init) {
    if (!value !== !globalThis.driver.isBonusActive()) {
      globalThis.driver.toggleOffline();
    }
  },
  repeatLastAction() {
    if (options.predictor) {
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
      globalThis.Koviko.instance.terminateWorker();
    }
  },
};

if (selfIsGame) {
  Object.assign(options, importPredictorSettings()); // override hardcoded defaults if not in worker
}

function decompressFromBase64(item) {
  return globalThis.trash.LZString.decompressFromBase64(item);
}

function compressToBase64(item) {
  return globalThis.trash.LZString.compressToBase64(item);
}

function startGame() {
  // load calls recalcInterval, which will start the callbacks
  load();
  globalThis.view.setScreenSize();
}

function cheat() {
  if (globalThis.driver.gameSpeed === 1) globalThis.driver.gameSpeed = 20;
  else globalThis.driver.gameSpeed = 1;
}

function _town(townNum) {
  // @ts-ignore
  return towns[townNum];
}

function initializeTowns() {
  for (let i = 0; i <= 8; i++) {
    // @ts-ignore
    towns[i] = new globalThis.trash.Town(i);
  }
}

function isStatName(name) {
  return statList.includes(name);
}

function isSkillName(name) {
  return skillList.includes(name);
}

function isBuffName(name) {
  return buffList.includes(name);
}

function initializeActions() {
  totalActionList.length = 0;
  for (const prop in globalThis.actionList.Action) {
    const action = globalThis.actionList.Action[prop];
    totalActionList.push(action);
  }
}

function virtualizeGlobalVariables(variables) {
  const globals = Data.rootObjects.globals ?? {};
  for (const name in variables) {
    const get = /** @type {() => any} */ (new Function(`return ${name};`));
    const set = /** @type {(any) => void} */ (new Function('v__', `${name} = v__`));
    Object.defineProperty(globals, name, {
      get,
      set,
      enumerable: true,
      configurable: true,
    });
  }
  return globalThis.Data.register('globals', globals);
}

function isNumericOption(option) {
  return numericOptions.includes(/** @type {NumericOptionName} */ (option));
}

function isStringOption(option) {
  return stringOptions.includes(/** @type {StringOptionName} */ (option));
}

function isBooleanOption(option) {
  // I'm explicitly deciding to leave this open-ended, so unknown options are treated as booleans
  return !numericOptions.includes(/** @type {NumericOptionName} */ (option)) &&
    !stringOptions.includes(/** @type {StringOptionName} */ (option));
}

function importPredictorSettings() {
  /** @type {Record<string, OptionName>} */
  const settingsMap = {
    __proto__: null,
    timePrecision: 'predictorTimePrecision',
    nextPrecision: 'predictorNextPrecision',
    actionWidth: 'predictorActionWidth',
    repeatPrediction: 'predictorRepeatPrediction',
    slowMode: 'predictorSlowMode',
    slowTimer: 'predictorSlowTimer',
  };
  /** @type {Partial<typeof options>} */
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

function handleOption(option, value, init, getInput) {
  optionValueHandlers[option]?.(value, init, getInput);
  // The handler can change the value of the option. Recheck when setting or clearing the indicator class.
  if (option in optionIndicatorClasses) {
    document.documentElement.classList.toggle(optionIndicatorClasses[option], !!options[option]);
  }
}

function setOption(option, value, updateUI = false) {
  const oldValue = options[option];
  options[option] = value;
  handleOption(option, value, false, () => globalThis.helpers.valueElement(`${option}Input`));
  if (options[option] !== oldValue) {
    save();
  }
  if (updateUI && (options[option] !== oldValue || options[option] !== value)) {
    loadOption(option, options[option], false);
  }
}

function loadOption(option, value, callHandler = true) {
  const input = globalThis.helpers.valueElement(`${option}Input`, false); // this is allowed to have errors
  if (!input) return;
  if (input instanceof HTMLInputElement && input.type === 'checkbox') input.checked = !!value;
  else if (option === 'speedIncreaseBackground' && (typeof value !== 'number' || isNaN(value) || value < 0)) {
    input.value = '';
  } else input.value = String(value);
  handleOption(option, value, true, () => input);
}

function showPauseNotification(message) {
  pauseNotification = new Notification('Idle Loops', {
    icon: 'favicon-32x32.png',
    body: message,
    tag: 'paused',
    renotify: true,
  });
}

function clearPauseNotification() {
  if (pauseNotification) {
    pauseNotification.close();
    pauseNotification = null;
  }
}

function closeTutorial() {
  document.getElementById('tutorial').style.display = 'none';
}

function clearSave() {
  globalThis.localStorage[globalThis.saving.defaultSaveName] = '';
  globalThis.localStorage[globalThis.saving.challengeSaveName] = '';
  location.reload();
}

let defaultsRecorded = false;
function loadDefaults() {
  if (defaultsRecorded) {
    globalThis.Data.resetToDefaults();
  }
  globalThis.stats.initializeStats();
  globalThis.stats.initializeSkills();
  globalThis.stats.initializeBuffs();
  initializeActions();
  initializeTowns();
  globalThis.prestige.prestigeValues['prestigeCurrentPoints'] = 0;
  globalThis.prestige.prestigeValues['prestigeTotalPoints'] = 0;
  globalThis.prestige.prestigeValues['prestigeTotalCompletions'] = 0;
  globalThis.prestige.prestigeValues['completedCurrentPrestige'] = false;
  globalThis.prestige.prestigeValues['completedAnyPrestige'] = false;
  globalThis.Data.recordDefaults();
  defaultsRecorded = true;
}

function loadUISettings() {
  const height = localStorage.getItem('actionListHeight');
  if (height !== '') document.documentElement.style.setProperty('--action-list-height', height);
}

function saveUISettings() {
  const height = document.documentElement.style.getPropertyValue('--action-list-height');
  if (height !== '') localStorage.setItem('actionListHeight', height);
}

function needsDataSnapshots() {
  return options.predictor && options.predictorBackgroundThread;
}

function load(inChallenge, saveJson = globalThis.localStorage[saveName]) {
  loadDefaults();
  loadUISettings();

  loadouts = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
  loadoutnames = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
  // loadoutnames[-1] is what displays in the loadout renaming box when no loadout is selected
  // It isn't technically part of the array, just a property on it, so it doesn't count towards loadoutnames.length
  loadoutnames[-1] = '';

  let toLoad = {};
  // has a save file
  if (saveJson && saveJson !== 'null') {
    closeTutorial();
    toLoad = JSON.parse(saveJson);
  }

  console.log('Loading game from: ' + saveName + ' inChallenge: ' + inChallenge);

  if (toLoad.challengeSave !== undefined) {
    for (let challengeProgress in toLoad.challengeSave) {
      challengeSave[challengeProgress] = toLoad.challengeSave[challengeProgress];
    }
  }
  if (inChallenge !== undefined) challengeSave.inChallenge = inChallenge;

  console.log('Challenge Mode: ' + challengeSave.challengeMode + ' In Challenge: ' + challengeSave.inChallenge);

  if (saveName === defaultSaveName && challengeSave.inChallenge === true) {
    console.log('Switching to challenge save');
    saveName = challengeSaveName;
    load(true);
    return;
  }

  if (challengeSave.challengeMode !== 0) {
    saveName = challengeSaveName;
  }

  doLoad(toLoad);
}

function doLoad(toLoad) {
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
      buffs[property].amt = Math.min(toLoad.buffs[property].amt, buffHardCaps[property]);
    }
  }

  if (toLoad.buffCaps !== undefined) {
    for (const property in buffCaps) {
      if (toLoad.buffCaps.hasOwnProperty(property)) {
        buffCaps[property] = toLoad.buffCaps[property];
        globalThis.helpers.inputElement(`buff${property}Cap`).value = buffCaps[property];
      }
    }
  }

  if (toLoad.prestigeValues !== undefined) {
    globalThis.prestige.prestigeValues['prestigeCurrentPoints'] =
      toLoad.prestigeValues['prestigeCurrentPoints'] === undefined ? 0 : toLoad.prestigeValues['prestigeCurrentPoints'];
    globalThis.prestige.prestigeValues['prestigeTotalPoints'] =
      toLoad.prestigeValues['prestigeTotalPoints'] === undefined ? 0 : toLoad.prestigeValues['prestigeTotalPoints'];
    globalThis.prestige.prestigeValues['prestigeTotalCompletions'] =
      toLoad.prestigeValues['prestigeTotalCompletions'] === undefined
        ? 0
        : toLoad.prestigeValues['prestigeTotalCompletions'];
    globalThis.prestige.prestigeValues['completedCurrentPrestige'] =
      toLoad.prestigeValues['completedCurrentPrestige'] === undefined
        ? 0
        : toLoad.prestigeValues['completedCurrentPrestige'];
    globalThis.prestige.prestigeValues['completedAnyPrestige'] =
      toLoad.prestigeValues['completedAnyPrestige'] === undefined
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
    globalThis.saving.actionLog.load(toLoad.actionLog);
    globalThis.saving.actionLog.loadRecent();
  } else {
    globalThis.saving.actionLog.initialize();
  }
  if (globalThis.saving.actionLog.entries.length === 0) {
    globalThis.saving.actionLog.addGlobalStory(0);
  }

  if (toLoad.totalTalent === undefined) {
    let temptotalTalent = 0;
    for (const property in toLoad.stats) {
      if (toLoad.stats.hasOwnProperty(property)) {
        temptotalTalent += toLoad.stats[property].talent * 100;
      }
    }
    totalTalent = temptotalTalent;
  } else {
    totalTalent = toLoad.totalTalent;
  }

  if (toLoad.maxTown) {
    townsUnlocked = [0];
    for (let i = 1; i <= toLoad.maxTown; i++) {
      townsUnlocked.push(i);
    }
  } else {
    townsUnlocked = toLoad.townsUnlocked === undefined ? [0] : toLoad.townsUnlocked;
  }
  completedActions = [];
  if (toLoad.completedActions && toLoad.completedActions.length > 0) {
    toLoad.completedActions.forEach((action) => {
      completedActions.push(action);
    });
  }
  completedActions.push('FoundGlasses');
  globalThis.saving.vals.trainingLimits = 10 + globalThis.stats.getBuffLevel('Imbuement');
  goldInvested = toLoad.goldInvested === undefined ? 0 : toLoad.goldInvested;
  stonesUsed = toLoad.stonesUsed === undefined ? { 1: 0, 3: 0, 5: 0, 6: 0 } : toLoad.stonesUsed;

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
      if (totalActionList.some((x) => x.name === action.name)) {
        actions.addActionRecord(action, -1, false);
      }
    }
  }

  if (toLoad.loadouts) {
    for (let i = 0; i < loadouts.length; i++) {
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
        if (totalActionList.some((x) => x.name === action.name)) {
          loadouts[i].push(action);
        }
      }
    }
  }
  for (let i = 0; i < loadoutnames.length; i++) {
    loadoutnames[i] = 'Loadout ' + (i + 1);
  }
  if (toLoad.loadoutnames) {
    for (let i = 0; i < loadoutnames.length; i++) {
      if (toLoad.loadoutnames[i] != undefined && toLoad.loadoutnames != '') {
        loadoutnames[i] = toLoad.loadoutnames[i];
      } else {
        loadoutnames[i] = 'Loadout ' + (i + 1);
      }
    }
  }
  curLoadout = toLoad.curLoadout;
  const elem = typeof document === 'undefined' ? undefined : document.getElementById(`load${curLoadout}`);
  if (elem) {
    globalThis.helpers.removeClassFromDiv(document.getElementById(`load${curLoadout}`), 'unused');
  }

  /*if (toLoad.dungeons) {
        if (toLoad.dungeons.length < dungeons.length) {
            toLoad.dungeons.push([]);
        }
    }*/
  dungeons = [[], [], []];
  const level = { ssChance: 1, completed: 0 };
  let floors = 0;
  if (toLoad.dungeons === undefined) toLoad.dungeons = globalThis.helpers.copyArray(dungeons);
  for (let i = 0; i < dungeons.length; i++) {
    floors = dungeonFloors[i];
    for (let j = 0; j < floors; j++) {
      if (toLoad.dungeons[i] != undefined && toLoad.dungeons && toLoad.dungeons[i][j]) {
        dungeons[i][j] = toLoad.dungeons[i][j];
      } else {
        dungeons[i][j] = globalThis.helpers.copyArray(level);
      }
      dungeons[i][j].lastStat = 'NA';
    }
  }

  trials = [[], [], [], [], []];
  const trialLevel = { completed: 0 };
  if (toLoad.trials === undefined) toLoad.trials = globalThis.helpers.copyArray(trials);
  for (let i = 0; i < globalThis.saving.trials.length; i++) {
    floors = trialFloors[i];
    trials[i].highestFloor = 0;
    for (let j = 0; j < floors; j++) {
      if (toLoad.trials[i] != undefined && toLoad.trials && toLoad.trials[i][j]) {
        trials[i][j] = toLoad.trials[i][j];
        if (trials[i][j].completed > 0) trials[i].highestFloor = j;
      } else {
        trials[i][j] = globalThis.helpers.copyArray(trialLevel);
      }
    }
  }

  if (toLoad.options === undefined) {
    options.theme = toLoad.currentTheme === undefined ? options.theme : toLoad.currentTheme;
    options.repeatLastAction = toLoad.repeatLast;
    options.pingOnPause = toLoad.pingOnPause === undefined ? options.pingOnPause : toLoad.pingOnPause;
    options.notifyOnPause = toLoad.notifyOnPause === undefined ? options.notifyOnPause : toLoad.notifyOnPause;
    options.autoMaxTraining = toLoad.autoMaxTraining === undefined ? options.autoMaxTraining : toLoad.autoMaxTraining;
    options.highlightNew = toLoad.highlightNew === undefined ? options.highlightNew : toLoad.highlightNew;
    options.hotkeys = toLoad.hotkeys === undefined ? options.hotkeys : toLoad.hotkeys;
    options.updateRate = toLoad.updateRate === undefined
      ? options.updateRate
      : globalThis.localStorage['updateRate'] ?? toLoad.updateRate;
  } else {
    const optionsToLoad = { ...toLoad.options, ...toLoad.extraOptions };
    for (const option in optionsToLoad) {
      if (option in options) {
        options[option] = optionsToLoad[option];
      }
    }
    if ('updateRate' in optionsToLoad && globalThis.localStorage['updateRate']) {
      options.updateRate = globalThis.localStorage['updateRate'];
    }
  }

  /** @type {string[]} */
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

  globalThis.trash.loadChallenge();
  view.initalize();

  for (const town of towns) {
    for (const action of town.totalActionList) {
      if (action.type === 'limited') {
        const varName = action.varName;
        if (toLoad[`searchToggler${varName}`] !== undefined) {
          globalThis.helpers.inputElement(`searchToggler${varName}`).checked = toLoad[`searchToggler${varName}`];
        }
        view.updateRegular({ name: action.varName, index: town.index });
      }
    }
  }

  globalThis.saving.vals.totalOfflineMs = toLoad.totalOfflineMs === undefined ? 0 : toLoad.totalOfflineMs; // must load before options

  for (const option of Object.keys(options)) {
    loadOption(option, options[option]);
  }
  storyShowing = toLoad.storyShowing === undefined ? 0 : toLoad.storyShowing;
  storyMax = toLoad.storyMax === undefined ? 0 : toLoad.storyMax;
  if (
    toLoad.unreadActionStories === undefined ||
    toLoad.unreadActionStories.find((s) => !s.includes('storyContainer'))
  ) {
    unreadActionStories = [];
  } else {
    unreadActionStories = toLoad.unreadActionStories;
    for (const name of unreadActionStories) {
      globalThis.driver.showNotification(name);
    }
  }

  if (toLoad.totals != undefined) {
    totals.time = toLoad.totals.time === undefined ? 0 : toLoad.totals.time;
    totals.effectiveTime = toLoad.totals.effectiveTime === undefined ? 0 : toLoad.totals.effectiveTime;
    totals.borrowedTime = toLoad.totals.borrowedTime ?? 0;
    totals.loops = toLoad.totals.loops === undefined ? 0 : toLoad.totals.loops;
    totals.actions = toLoad.totals.actions === undefined ? 0 : toLoad.totals.actions;
  } else totals = { time: 0, effectiveTime: 0, borrowedTime: 0, loops: 0, actions: 0 };
  globalThis.saving.vals.currentLoop = totals.loops;
  view.updateTotals();
  console.log('Updating prestige values from load');
  view.updatePrestigeValues();

  // capped at 1 month of gain
  globalThis.driver.addOffline(Math.min(Math.floor(Date.now() - Date.parse(toLoad.date)), 2678400000));

  if (toLoad.version75 === undefined) {
    const total = towns[0].totalSDungeon;
    dungeons[0][0].completed = Math.floor(total / 2);
    dungeons[0][1].completed = Math.floor(total / 4);
    dungeons[0][2].completed = Math.floor(total / 8);
    dungeons[0][3].completed = Math.floor(total / 16);
    dungeons[0][4].completed = Math.floor(total / 32);
    dungeons[0][5].completed = Math.floor(total / 64);
    towns[0].totalSDungeon = dungeons[0][0].completed + dungeons[0][1].completed + dungeons[0][2].completed +
      dungeons[0][3].completed + dungeons[0][4].completed + dungeons[0][5].completed;
  }

  //Handle players on previous challenge system
  if (toLoad.challenge !== undefined && toLoad.challenge !== 0) {
    challengeSave.challengeMode = 0;
    challengeSave.inChallenge = true;
    save();

    challengeSave.challengeMode = toLoad.challenge;
    saveName = challengeSaveName;
    save();
    location.reload();
  }

  if (globalThis.actionList.getExploreProgress() >= 100) globalThis.driver.addResource('glasses', true);

  globalThis.driver.adjustAll();

  globalThis.Data.recordBase();

  view.updateLoadoutNames();
  view.changeStatView();
  view.updateNextActions();
  view.updateMultiPartActions();
  view.updateStories(true);
  view.update();
  globalThis.driver.recalcInterval(options.updateRate);
  globalThis.driver.pauseGame();
}

function doSave() {
  const toSave = {};
  toSave.curLoadout = curLoadout;
  toSave.dungeons = dungeons;
  toSave.trials = trials;
  toSave.townsUnlocked = townsUnlocked;
  toSave.completedActions = completedActions;

  toSave.stats = stats;
  toSave.totalTalent = totalTalent;
  toSave.skills = skills;
  toSave.buffs = buffs;
  toSave.prestigeValues = globalThis.prestige.prestigeValues;
  toSave.goldInvested = goldInvested;
  toSave.stonesUsed = stonesUsed;
  toSave.version75 = true;

  /** @type {string[][]} */
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
          toSave[`searchToggler${varName}`] = globalThis.helpers.inputElement(`searchToggler${varName}`).checked;
        }
      }
    }
  }
  toSave.hiddenVars = hiddenVars;
  toSave.nextList = actions.next;
  toSave.loadouts = loadouts;
  toSave.loadoutnames = loadoutnames;
  toSave.options = {};
  toSave.extraOptions = {}; // to avoid crashing when exporting to lloyd, etc
  for (const option in options) {
    if (isStandardOption[option]) {
      toSave.options[option] = options[option];
    } else {
      toSave.extraOptions[option] = options[option];
    }
  }
  toSave.storyShowing = storyShowing;
  toSave.storyMax = storyMax;
  toSave.storyReqs = storyFlags; // save uses the legacy name "storyReqs" for compatibility
  toSave.storyVars = storyVars;
  toSave.unreadActionStories = unreadActionStories;
  toSave.actionLog = globalThis.saving.actionLog;
  toSave.buffCaps = buffCaps;

  toSave.date = new Date();
  toSave.totalOfflineMs = globalThis.saving.vals.totalOfflineMs;
  toSave.totals = totals;

  toSave.challengeSave = challengeSave;
  for (const challengeProgress in challengeSave) {
    toSave.challengeSave[challengeProgress] = challengeSave[challengeProgress];
  }

  return toSave;
}

function save() {
  const toSave = doSave();
  const saveJson = JSON.stringify(toSave);
  storeSaveJson(saveJson);
  globalThis.localStorage['updateRate'] = options.updateRate;
  return saveJson;
}

function exportSave() {
  const saveJson = save();
  // idle loops save version 01. patch v0.94, moved from old save system to lzstring base 64
  globalThis.helpers.inputElement('exportImport').value = `ILSV01${compressToBase64(saveJson)}`;
  globalThis.helpers.inputElement('exportImport').select();
  if (!document.execCommand('copy')) {
    alert('Copying the save to the clipboard failed! You will need to copy the highlighted value yourself.');
  }
}

function importSave() {
  const saveData = globalThis.helpers.inputElement('exportImport').value;
  processSave(saveData);
}

function processSave(saveData) {
  if (saveData === '') {
    if (confirm('Importing nothing will delete your save. Are you sure you want to delete your save?')) {
      challengeSave = {};
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
  globalThis.driver.pauseGame();
  globalThis.driver.restart();
}

let overquotaWarned = false;
function storeSaveJson(saveJson) {
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

function saveFileName() {
  const gameName = document.title.replace('*PAUSED* ', '');
  const version = document.querySelector('#changelog > li[data-verNum]').firstChild.textContent.trim();
  return `${gameName} ${version} - Loop ${totals.loops}.txt`;
}

function exportSaveFile() {
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

function openSaveFile() {
  document.getElementById('SaveFileInput').click();
}

function importSaveFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const saveData = e.target.result;
    processSave(saveData);
  };
  reader.readAsText(file);
}

function exportCurrentList() {
  let toReturn = '';
  for (const action of actions.next) {
    toReturn += `${action.loops}x ${action.name}`;
    toReturn += '\n';
  }
  globalThis.helpers.textAreaElement('exportImportList').value = toReturn.slice(0, -1);
  globalThis.helpers.textAreaElement('exportImportList').select();
  document.execCommand('copy');
}

function importCurrentList() {
  const toImport = globalThis.helpers.textAreaElement('exportImportList').value.split('\n');
  actions.clearActions();
  for (let i = 0; i < toImport.length; i++) {
    if (!toImport[i]) {
      continue;
    }
    const name = /** @type {ActionName} */ (toImport[i].substr(toImport[i].indexOf('x') + 1).trim());
    const loops = toImport[i].substr(0, toImport[i].indexOf('x'));
    try {
      const action = globalThis.actionList.getActionPrototype(name);
      if (action.unlocked()) {
        actions.addActionRecord({ name, loops: Number(loops), disabled: false }, -1, false);
      }
    } catch (e) {
      if (e instanceof globalThis.actionList.ClassNameNotFoundError) {
        console.log(e.message);
      } else {
        throw e;
      }
    }
  }
  view.updateNextActions();
}

function beginChallenge(challengeNum) {
  console.log('Beginning Challenge');
  if (globalThis.localStorage[challengeSaveName] && globalThis.localStorage[challengeSaveName] !== '') {
    if (confirm('Beginning a new challenge will delete your current challenge save. Are you sure you want to begin?')) {
      globalThis.localStorage[challengeSaveName] = '';
    } else {
      return false;
    }
  }
  if (challengeSave.challengeMode === 0) {
    challengeSave.inChallenge = true;
    save();
    console.log('Saving to: ' + saveName);
  }
  challengeSave.challengeMode = challengeNum;
  saveName = challengeSaveName;
  load(true);
  globalThis.saving.vals.totalOfflineMs = 1000000;
  save();
  globalThis.driver.pauseGame();
  globalThis.driver.restart();
}

function exitChallenge() {
  if (challengeSave.challengeMode !== 0) {
    saveName = defaultSaveName;
    load(false);
    save();
    location.reload();
  }
}

function resumeChallenge() {
  if (
    challengeSave.challengeMode === 0 && globalThis.localStorage[challengeSaveName] &&
    globalThis.localStorage[challengeSaveName] !== ''
  ) {
    challengeSave.inChallenge = true;
    save();
    saveName = challengeSaveName;
    load(true);
    save();
    globalThis.driver.pauseGame();
    globalThis.driver.restart();
  }
}

const _saving = {
  towns,
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
  saveName,
  challengeSaveName,
  challengeSave,
  dungeons,
  trials,
  trialFloors,
  stats,
  totalTalent,
  skills,
  buffs,
  goldInvested,
  stonesUsed,
  loadoutnames,
  options,
  storyMax,
  storyReqs,
  storyVars,
  unreadActionStories,
  actionLog,
  actions,
  view,
  buffCaps,
  totals,
  loadDefaults,
  needsDataSnapshots,
  closeTutorial,
  startGame,
  cheat,
  setOption,
  defaultSaveName,
  timeNeededInitial,
  timer: timeNeededInitial,
  timeNeeded: timeNeededInitial,
  vals,
};

declare global {
  var saving: typeof _saving;
}

globalThis.saving = _saving;
