import { vals } from './saving.ts';
import { extractStrings, formatNumber, intToString, restoreStrings } from './helpers.ts';
import { getActionPrototype, townNames } from './actionList.ts';
import { t } from '../locales/translations.utils.ts';

export class ActionLog {
  entries = [];
  #uniqueEntries = {};

  addEntry(entry) {
    if (entry instanceof UniqueLogEntry) {
      if (entry.key in this.#uniqueEntries) return this.#uniqueEntries[entry.key];
      this.#uniqueEntries[entry.key] = entry;
    }

    if (entry.entryIndex === null) {
      entry.entryIndex = this.entries.length;
      this.entries.push(entry);
    }

    return entry;
  }

  getEntry(index) {
    return this.entries[index];
  }

  toJSON() {
    return extractStrings(this.entries);
  }

  initialize() {
    this.entries = [];
    this.#uniqueEntries = {};
  }

  load(data) {
    this.initialize();

    if (!Array.isArray(data)) return;

    for (const entryData of restoreStrings(data)) {
      const entry = ActionLogEntry.create(entryData);

      if (entry) this.addOrUpdateEntry(entry);
    }
  }

  addOrUpdateEntry(entry) {
    for (let i = this.entries.length - 1; i >= 0; i--) {
      const other = this.entries[i];
      if (other instanceof RepeatableLogEntry && other.canMerge(entry)) {
        other.merge(entry);
        return this.addEntry(other);
      } else if (!other.repeatable) {
        break;
      }
    }

    return this.addEntry(entry);
  }

  addActionStory(action, storyindex, init) {
    const entry = new ActionStoryEntry(action, storyindex);
    this.addEntry(entry, init);
  }

  addGlobalStory(num) {
    const entry = new GlobalStoryEntry(num);
    this.addEntry(entry, false);
  }

  addSoulstones(action, stat, count) {
    const entry = new SoulstoneEntry(action).addSoulstones(stat, count);
    this.addOrUpdateEntry(entry);
  }

  addSkillLevel(action, skill, toLevel, fromLevel) {
    const entry = new SkillEntry(action, skill, toLevel, fromLevel);
    this.addOrUpdateEntry(entry);
  }

  addBuff(action, buff, toAmt, fromAmt, spendType, statsSpent) {
    const entry = new BuffEntry(action, buff, toAmt, fromAmt, undefined, statsSpent, spendType);
    this.addOrUpdateEntry(entry);
  }
}

class ActionLogEntry {
  type;
  #entryIndex = null;
  get entryIndex() {
    return this.#entryIndex;
  }
  set entryIndex(index) {
    this.#entryIndex = index;
  }
  loop;
  actionName;

  get action() {
    return getActionPrototype(this.actionName) || null;
  }

  get repeatable() {
    return false;
  }

  static create(data) {
    if (!Array.isArray(data)) return null;
    const type = actionLogEntryTypeMap[data[0]];
    if (!type) return null;
    const entry = new type();
    entry.load(data);
    return entry;
  }

  constructor(type, action, loop) {
    this.type = type;
    this.loop = typeof loop === 'number' && loop >= 0 ? loop : vals.currentLoop;
    this.actionName = typeof action === 'string' ? action : action?.name ?? null;
  }

  toJSON() {
    return [this.type, this.actionName, this.loop];
  }
  load(data) {
    const [_type, actionName, loop, ...rest] = data;
    this.actionName = typeof actionName === 'string' ? /** @type {ActionName|ActionId} */ (actionName) : null;
    this.loop = typeof loop === 'number' && loop >= 0 ? loop : vals.currentLoop;
    return rest;
  }

  format(text) {
    let lastText = null;
    while (lastText !== text) {
      lastText = text;
      text = text.replace(/{(.*?)}/g, (_, k) => this.getReplacement(k));
    }
    return text;
  }

  getReplacement(key) {
    if (key === 'loop') return formatNumber(this.loop);
    if (key === 'loopStart') return formatNumber(this.loop);
    if (key === 'loopEnd') return formatNumber(this.loop);
    if (key === 'town') return townNames[this.action?.townNum];
    if (key === 'action') return '{ACTION NAME}';
    if (key === 'header') return 'Loop {loop}, {action} in {town}';
    throw new Error(`Bad key ${key}`);
  }

  abstract getText() {
    throw new Error('Method not implemented.');
  }
}

class UniqueLogEntry extends ActionLogEntry {
  get key() {
    return `${this.type}:${this.actionName}`;
  }
}

class RepeatableLogEntry extends ActionLogEntry {
  loopEnd;

  get repeatable() {
    return true;
  }

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

  getReplacement(key) {
    if (key === 'loop') {
      return this.loop === this.loopEnd ? formatNumber(this.loop) : '{loopStart}–{loopEnd}';
    }
    if (key === 'loopEnd') return formatNumber(this.loopEnd);
    return super.getReplacement(key);
  }

  merge(other) {
    this.loopEnd = Math.max(this.loopEnd, other.loopEnd);
    this.loop = Math.min(this.loop, other.loop);
    return this;
  }

  canMerge(other) {
    return this.type === other.type && this.actionName === other.actionName && this.canMergeParameters(other);
  }

  canMergeParameters(_other) {
    return false;
  }
}

class ActionStoryEntry extends UniqueLogEntry {
  storyIndex;

  get key() {
    return `${super.key}:${this.storyIndex}`;
  }

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
    return '{header} ({condition}): {story}';
  }

  getReplacement(key) {
    if (key === 'condition' || key === 'story') {
      const storyInfo = getActionPrototype(this.actionName)?.getStoryTexts()?.find(({ num }) =>
        num === this.storyIndex
      );

      if (storyInfo) {
        if (key === 'condition') return storyInfo.condition;
        if (key === 'story') return storyInfo.text;
      } else {
        if (key === 'condition') return '???';
        if (key === 'story') return 'You remember that something happened here, but not what it was.';
      }
    }

    return super.getReplacement(key);
  }
}

class GlobalStoryEntry extends UniqueLogEntry {
  chapter;

  get key() {
    return `${super.key}:${this.chapter}`;
  }

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
    return 'Loop {loop}: {story}';
  }

  getReplacement(key) {
    if (key === 'story') return t(`stories.items.${this.chapter}.story`);
    return super.getReplacement(key);
  }
}

class SoulstoneEntry extends RepeatableLogEntry {
  count = 0;
  stones = {};

  constructor(action, loop) {
    super('soulstone', action, loop);
  }
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

  addSoulstones(stat, count) {
    this.stones[stat] ??= 0;
    this.stones[stat] += count;
    this.count += count;
    return this;
  }

  addAllSoulstones(stones) {
    for (const stat of statList) {
      if (stat in stones && typeof stones[stat] === 'number') {
        this.addSoulstones(stat, stones[stat]);
      }
    }
  }

  getText() {
    if (this.count === 1) {
      return '{header}: You find a soulstone attuned to {stat_long}!';
    }

    if (Object.keys(this.stones).length === 1) {
      return '{header}: You find {count} soulstones attuned to {stat_long}.';
    }

    return '{header}: You find {count} soulstones: {stats}';
  }

  getReplacement(key) {
    if (key === 'count') return intToString(this.count, 1);
    if (key === 'stat_long') return t(`statistics.attributes.${Object.keys(this.stones)[0]}.abbreviation`);
    if (key === 'stat') return t(`statistics.attributes.${Object.keys(this.stones)[0]}.abbreviation`);
    if (key === 'stats') {
      const strs = [];

      const template = Object.keys(this.stones).length > 3 ? '{count} {stat}' : '{count} of {stat_long}';

      for (const stat in stats) {
        if (stat in this.stones) {
          strs.push(
            template
              .replace('{count}', intToString(this.stones[stat], 1))
              .replace('{stat_long}', t(`stats.${stat}.long_form`))
              .replace('{stat}', t(`stats.${stat}.short_form`)),
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
  name;
  fromLevel;
  toLevel;

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
    if (key === 'levels') return formatNumber(this.toLevel - this.fromLevel);
    if (key === 'fromLevel') return formatNumber(this.fromLevel);
    if (key === 'toLevel') return formatNumber(this.toLevel);
    return super.getReplacement(key);
  }

  canMergeParameters(other) {
    return this.name === other.name;
  }

  merge(other) {
    this.fromLevel = Math.min(this.fromLevel, other.fromLevel);
    this.toLevel = Math.max(this.toLevel, other.toLevel);
    return super.merge(other);
  }
}

class SkillEntry extends LeveledLogEntry {
  constructor(action, skill, toLevel, fromLevel, loop) {
    super('skill', action, skill, toLevel, fromLevel, loop);
  }

  getText() {
    if (this.toLevel === this.fromLevel + 1) {
      return '{header}: You attain level {toLevel} in {skill}!';
    }

    return '{header}: Your skill in {skill} increases from {fromLevel} to {toLevel}.';
  }

  getReplacement(key) {
    const skillNameMap = {
      'Combat': 'combat',
      'Magic': 'magic',
      'Practical': 'practical',
      'Alchemy': 'alchemy',
      'Crafting': 'crafting',
      'Dark': 'dark',
      'Chronomancy': 'chronomancy',
      'Pyromancy': 'pyromancy',
      'Restoration': 'restoration',
      'Spatiomancy': 'spatiomancy',
      'Mercantilism': 'mercantilism',
      'Divine': 'divine',
      'Commune': 'commune',
      'Wunderkind': 'wunderkind',
      'Gluttony': 'gluttony',
      'Thievery': 'thievery',
      'Leadership': 'leadership',
      'Assassin': 'assassination',
    };

    if (key === 'skill') {
      return t(`statistics.statistics.skills.${skillNameMap[this.name]}.name`);
    }

    return super.getReplacement(key);
  }
}

class BuffEntry extends LeveledLogEntry {
  soulstoneEntry;
  statSpendType;

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
    this.statSpendType = typeof spendType === 'string' ? spendType : '';
    if (stones && typeof stones === 'object') {
      this.soulstoneEntry.addAllSoulstones(stones);
    }
  }

  getText() {
    const fromZero = this.fromLevel === 0;
    const multi = this.toLevel !== this.fromLevel + 1;

    if (fromZero) {
      if (multi) return t('actionLog.templates.buffFromZeroMulti');
      return t('actionLog.templates.buffFromZero');
    }

    if (multi) return t('actionLog.templates.buffMulti');
    return t('actionLog.templates.buff');
  }

  getReplacement(key) {
    const map = {
      'Ritual': 'ritual',
      'Imbuement': 'mindImbuement',
      'Imbuement2': 'bodyImbuement',
      'Feast': 'greatFeast',
      'Aspirant': 'aspirant',
      'Heroism': 'heroism',
      'Imbuement3': 'soulImbuement',
      'PrestigePhysical': 'prestigePhysical',
      'PrestigeMental': 'prestigeMental',
      'PrestigeCombat': 'prestigeCombat',
      'PrestigeSpatiomancy': 'prestigeSpatiomancy',
      'PrestigeChronomancy': 'prestigeChronomancy',
      'PrestigeBartering': 'prestigeBartering',
      'PrestigeExpOverflow': 'prestigeExpOverflow',
    } as const;

    if (key === 'buff') {
      return t(`statistics.buffs.${map[this.name]}.name`);
    }

    if (key === 'buff_cost') {
      if (this.statSpendType === 'imbuement3') {
        return t('actionLog.templates.buffCostSoulImbuement');
      }
      if (this.statSpendType === 'talent') {
        return t('actionLog.templates.buffCostTalent');
      }
      if (this.statSpendType === 'soulstone') {
        if (Object.keys(this.soulstoneEntry.stones).length === 1) {
          return t('actionLog.templates.buffCostSoulstoneSingle');
        }

        return t('actionLog.templates.buffCostSoulstone');
      }

      return '';
    }

    if (key === 'count' || key.startsWith('stat')) return this.soulstoneEntry.getReplacement(key);

    return super.getReplacement(key);
  }

  canMergeParameters(other) {
    return this.statSpendType === other.statSpendType && super.canMergeParameters(other) &&
      this.soulstoneEntry.canMerge(other.soulstoneEntry);
  }

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
