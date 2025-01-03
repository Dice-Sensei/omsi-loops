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
    if (!init && globalThis.saving.vals.options.actionLog) {
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
      globalThis.saving.view.requestUpdate('updateActionLogEntry', --this.earliestShownEntry);
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

// Globals!!!!!
const actions = new globalThis.actions.Actions();

const selfIsGame = typeof globalThis?.view?.View !== 'undefined';
const actionLog = selfIsGame ? new ActionLog() : null;

const towns = /** @type {TownList<9>} */ (/** @type {Town[]} */ ([]));

const statList = /** @type {const} */ ['Dex', 'Str', 'Con', 'Spd', 'Per', 'Cha', 'Int', 'Luck', 'Soul'];
const stats = /** @type {{[K in StatName]: Stat}} */ ({});

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
const resourcesTemplate = globalThis.helpers.copyObject(resources);
let hearts = [];

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
// Globals!!!!!
