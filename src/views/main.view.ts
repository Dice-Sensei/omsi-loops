'use strict';

const DarkRitualDescription = [
  `10% faster in Beginnersville per ritual from 1-20<br>`,
  `5% faster in the Forest Path per ritual from 21-40<br>`,
  `2.5% faster in Merchanton per ritual from 41-60<br>`,
  `1.5% faster in Mt. Olympus per ritual from 61-80<br>`,
  `1.0% faster in Valhalla per ritual from 81-100<br>`,
  `0.5% faster in Startington per ritual from 101-150<br>`,
  `0.5% faster in Jungle Path per ritual from 151-200<br>`,
  `0.5% faster in Commerceville per ritual from 201-250<br>`,
  `0.5% faster in Valley of Olympus per ritual from 251-300<br>`,
  `0.1% faster globally per ritual from 301-666`,
];

function formatTime(seconds) {
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
    return (globalThis.helpers.formatNumber(seconds) + globalThis.Localization.txt('time_controls>seconds')).replace(
      /\B(?=(\d{3})+(?!\d))/gu,
      ',',
    );
  }
  if (seconds < 10) {
    return seconds.toFixed(2) + globalThis.Localization.txt('time_controls>seconds');
  }
  return (seconds.toFixed(1) + globalThis.Localization.txt('time_controls>seconds')).replace(
    /\B(?=(\d{3})+(?!\d))/gu,
    ',',
  );
}

let statShowing;
let skillShowing;
let buffShowing;
let curActionShowing;
let dungeonShowing;

class View {
  initalize() {
    this.statGraph = new globalThis.trash.StatGraph();

    this.createTravelMenu();
    this.createStats();
    this.updateStats();
    this.updateSkills();
    this.adjustDarkRitualText();
    this.updateBuffs();
    this.updateTime();
    this.updateCurrentActionsDivs();
    this.updateTotalTicks();
    this.updateAddAmount(1);
    this.createTownActions();
    this.updateProgressActions();
    this.updateLockedHidden();
    this.updateSoulstones();
    this.showTown(0);
    this.showActions(false);
    this.updateTrainingLimits();
    this.changeStatView();
    this.changeTheme(true);
    this.adjustGoldCosts();
    this.adjustExpGains();
    this.updateTeamCombat();
    this.updateLoadoutNames();
    this.updateResources();
    this.updateTrials();
    if (storyMax >= 12) {
      setInterval(() => {
        globalThis.saving.view.updateStories();
        globalThis.saving.view.updateLockedHidden();
      }, 20000);
    } else {
      setInterval(() => {
        globalThis.saving.view.updateStories();
        globalThis.saving.view.updateLockedHidden();
      }, 2000);
    }
    globalThis.driver.adjustAll();
    this.updateActionTooltips();
    this.initActionLog();
    document.body.removeEventListener('mouseover', this.mouseoverHandler);
    document.body.addEventListener('mouseover', this.mouseoverHandler, { passive: true });
    document.body.removeEventListener('focusin', this.mouseoverHandler);
    document.body.addEventListener('focusin', this.mouseoverHandler, { passive: true });
    globalThis.addEventListener('modifierkeychange', this.modifierkeychangeHandler);
    /** @type {WeakMap<HTMLElement, Element | false>} */
    this.tooltipTriggerMap = new WeakMap();
    this.mouseoverCount = 0;
  }

  constructor() {
    this.mouseoverHandler = this.mouseoverHandler.bind(this);
    this.modifierkeychangeHandler = this.modifierkeychangeHandler.bind(this);
  }

  /** @param {UIEvent} event */
  mouseoverHandler(event) {
    if (!(event.target instanceof HTMLElement)) return;
    const trigger = this.getClosestTrigger(event.target);
    this.mouseoverCount++;
    if (trigger) {
      let tooltipSelector = '';
      for (const cls of trigger.classList) {
        if (cls.startsWith('showthat')) {
          tooltipSelector = `.showthis${cls.slice(8)}`;
          break;
        }
      }
      if (tooltipSelector === '') {
        console.warn('Could not find tooltip class for trigger! Using generic selector', trigger);
        tooltipSelector = '.showthis,.showthisO,.showthis2,.showthisH,.showthisloadout,.showthisstory';
      }
      for (const tooltip of trigger.querySelectorAll(tooltipSelector)) {
        if (tooltip instanceof HTMLElement) {
          this.fixTooltipPosition(tooltip, trigger, event.target);
        }
      }
    }
  }

  modifierkeychangeHandler() {
    globalThis.helpers.htmlElement('clearList').textContent = globalThis.trash.shiftDown
      ? globalThis.Localization.txt('actions>tooltip>clear_disabled')
      : globalThis.Localization.txt('actions>tooltip>clear_list');
  }

  /** @param {HTMLElement} element */
  getClosestTrigger(element) {
    let trigger = this.tooltipTriggerMap.get(element);
    if (trigger == null) {
      trigger = element.closest('.showthat,.showthatO,.showthat2,.showthatH,.showthatloadout,.showthatstory') || false;
      this.tooltipTriggerMap.set(element, trigger);
    }
    return trigger;
  }

  createStats() {
    if (this.statGraph.initalized) return;

    this.statGraph.init(document.getElementById('statsContainer'));
    const totalContainer = globalThis.helpers.htmlElement('totalStatContainer');
    for (const stat of statList) {
      const axisTip = this.statGraph.getAxisTip(stat);
      totalContainer.insertAdjacentHTML(
        'beforebegin',
        `<div class='statContainer showthat stat-${stat}' style='left:${axisTip[0]}%;top:${
          axisTip[1] + 3
        }%;' onmouseover='view.showStat("${stat}")' onmouseout='globalThis.saving.view.showStat(undefined)'>
                <div class='statLabelContainer'>
                    <div class='medium bold stat-name long-form' style='margin-left:18px;margin-top:5px;'>${
          globalThis.Localization.txt(`stats>${stat}>long_form`)
        }</div>
                    <div class='medium bold stat-name short-form' style='margin-left:18px;margin-top:5px;'>${
          globalThis.Localization.txt(`stats>${stat}>short_form`)
        }</div>
                    <div class='medium statNum stat-soulstone' style='color:var(--stat-soulstone-color);' id='stat${stat}ss'></div>
                    <div class=' statNum stat-talent'></div>
                    <div class='medium statNum stat-talent statBarWrapper'>
                        <div class='thinProgressBarLower tiny talentBar'><div class='statBar statTalentBar' id='stat${stat}TalentBar'></div></div>
                        <div class='label' id='stat${stat}Talent'>0</div>
                    </div>
                    <div class='medium statNum stat-level statBarWrapper'>
                        <div class='thinProgressBarLower tiny expBar'><div class='statBar statLevelBar' id='stat${stat}LevelBar'></div></div>
                        <div class='label bold' id='stat${stat}Level'>0</div>
                    </div>
                </div>
                <div class='statBars'>
                    <div class='thinProgressBarUpper expBar'><div class='statBar statLevelLogBar logBar' id='stat${stat}LevelLogBar'></div></div>
                    <div class='thinProgressBarLower talentBar'><div class='statBar statTalentLogBar logBar' id='stat${stat}TalentLogBar'></div></div>
                    <div class='thinProgressBarLower soulstoneBar'><div class='statBar statSoulstoneLogBar logBar' id='stat${stat}SoulstoneLogBar'></div></div>
                </div>
                <div class='showthis' id='stat${stat}Tooltip' style='width:225px;'>
                    <div class='medium bold'>${globalThis.Localization.txt(`stats>${stat}>long_form`)}</div><br>${
          globalThis.Localization.txt(`stats>${stat}>blurb`)
        }
                    <br>
                    <div class='medium bold'>${
          globalThis.Localization.txt('stats>tooltip>level')
        }:</div> <div id='stat${stat}Level2'></div>
                    <br>
                    <div class='medium bold'>${globalThis.Localization.txt('stats>tooltip>level_exp')}:</div>
                    <div id='stat${stat}LevelExp'></div>/<div id='stat${stat}LevelExpNeeded'></div>
                    <div class='statTooltipPerc'>(<div id='stat${stat}LevelProgress'></div>%)</div>
                    <br>
                    <div class='medium bold'>${globalThis.Localization.txt('stats>tooltip>talent')}:</div>
                    <div id='stat${stat}Talent2'></div>
                    <br>
                    <div class='medium bold'>${globalThis.Localization.txt('stats>tooltip>talent_exp')}:</div>
                    <div id='stat${stat}TalentExp'></div>/<div id='stat${stat}TalentExpNeeded'></div>
                    <div class='statTooltipPerc'>(<div id='stat${stat}TalentProgress'></div>%)</div>
                    <br>
                    <div class='medium bold'>${globalThis.Localization.txt('stats>tooltip>talent_multiplier')}:</div>
                    x<div id='stat${stat}TalentMult'></div>
                    <br>
                    <div id='ss${stat}Container' class='ssContainer'>
                        <div class='bold'>${
          globalThis.Localization.txt('stats>tooltip>soulstone')
        }:</div> <div id='ss${stat}'></div><br>
                        <div class='medium bold'>${
          globalThis.Localization.txt('stats>tooltip>soulstone_multiplier')
        }:</div> x<div id='stat${stat}SSBonus'></div>
                    </div><br>
                    <div class='medium bold'>${
          globalThis.Localization.txt('stats>tooltip>total_multiplier')
        }:</div> x<div id='stat${stat}TotalMult'></div>
                </div>
            </div>`,
      );
    }
  }

  // requests are properties, where the key is the function name,
  // and the array items in the value are the target of the function
  /** @satisfies {Partial<Record<keyof View, any[]>>} */
  requests = {
    updateStats: [],
    updateStat: [],
    updateSkill: [],
    updateSkills: [],
    updateBuff: [],
    updateTrialInfo: [],
    updateTrials: [],
    updateRegular: [],
    updateProgressAction: [],
    updateMultiPartSegments: [],
    updateMultiPart: [],
    updateMultiPartActions: [],
    updateNextActions: [],
    updateTime: [],
    updateOffline: [],
    updateBonusText: [],
    updateTotals: [],
    updateStories: [],
    updateGlobalStory: [],
    updateActionLogEntry: [],
    updateCurrentActionBar: [],
    updateCurrentActionsDivs: [],
    updateTotalTicks: [],
    updateCurrentActionLoops: [],
    updateSoulstones: [],
    updateResource: [],
    updateResources: [],
    updateActionTooltips: [],
    updateLockedHidden: [],
    updateTravelMenu: [],
    updateTeamCombat: [],
    adjustManaCost: [],
    adjustGoldCost: [],
    adjustGoldCosts: [],
    adjustExpGain: [],
    removeAllHighlights: [],
    highlightIncompleteActions: [],
    highlightAction: [],
  };

  // requesting an update will call that update on the next globalThis.saving.view.update tick (based off player set UPS)
  requestUpdate(category, target) {
    if (!this.requests[category].includes(target)) this.requests[category].push(target);
  }

  handleUpdateRequests() {
    for (const category in this.requests) {
      for (const target of this.requests[category]) {
        this[category](target);
      }
      this.requests[category] = [];
    }
  }

  update() {
    this.handleUpdateRequests();

    if (dungeonShowing !== undefined) this.updateSoulstoneChance(dungeonShowing);
    if (this.updateStatGraphNeeded) this.statGraph.update();
    this.updateTime();
  }

  adjustTooltipPosition(tooltipDiv) {
    // this is a no-op now, all repositioning happens dynamically on mouseover.
    // if the delegation in mouseoverHandler ends up being too costly, though, this is where
    // we'll bind discrete mouseenter handlers, like so:

    // const trigger = /** @type {HTMLElement} */(tooltipDiv.closest(".showthat,.showthatO,.showthat2,.showthatH,.showthatloadout"));
    // trigger.onmouseenter = e => this.fixTooltipPosition(tooltipDiv, trigger, e);
  }

  /**
   * @param {HTMLElement} tooltip
   * @param {Element} trigger
   * @param {Node} eventTarget
   */
  fixTooltipPosition(tooltip, trigger, eventTarget, delayedCall = false) {
    if (tooltip.contains(eventTarget)) {
      // console.log("Not fixing tooltip while cursor is inside",{tooltip,trigger,event});
      return;
    }
    if (!trigger.parentElement) {
      // trigger has been removed from document, abort
      return;
    }
    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportRect = {
      // document.documentElement.getBoundingClientRect();
      top: 0,
      left: 0,
      right: globalThis.innerWidth,
      bottom: globalThis.innerHeight,
    };
    const viewportMargins = {
      top: triggerRect.top - viewportRect.top,
      right: viewportRect.right - triggerRect.right,
      bottom: viewportRect.bottom - triggerRect.bottom,
      left: triggerRect.left - viewportRect.left,
    };
    const triggerParentStyle = getComputedStyle(trigger.parentElement);
    const wantsSidePosition = triggerParentStyle.display === 'flex' && triggerParentStyle.flexDirection === 'column';

    // We prefer to display tooltips above or below the trigger, except in the action list and the changelog
    let displayOverUnder = true;
    if (tooltipRect.height > Math.max(viewportMargins.top, viewportMargins.bottom)) displayOverUnder = false;
    if (wantsSidePosition && tooltipRect.width <= Math.max(viewportMargins.left, viewportMargins.right)) {
      displayOverUnder = false;
    }

    const targetPos = {
      x: 0,
      y: 0,
    };

    if (displayOverUnder) {
      targetPos.y = viewportMargins.top > viewportMargins.bottom
        ? triggerRect.top - tooltipRect.height
        : triggerRect.bottom;
      targetPos.x = viewportMargins.left > viewportMargins.right && tooltipRect.width > triggerRect.width
        ? triggerRect.right - tooltipRect.width
        : triggerRect.left;
    } else {
      targetPos.x = viewportMargins.left > viewportMargins.right
        ? triggerRect.left - tooltipRect.width
        : triggerRect.right;
      targetPos.y = viewportMargins.top > viewportMargins.bottom
        ? triggerRect.bottom - tooltipRect.height
        : triggerRect.top;
    }

    // check all bounds and nudge the tooltip back onto the screen if necessary, favoring the
    // top and left edges. don't trust the trbl on tooltipRect, since adjusting those isn't in spec.
    targetPos.x = Math.min(targetPos.x, viewportRect.right - tooltipRect.width);
    targetPos.y = Math.min(targetPos.y, viewportRect.bottom - tooltipRect.height);
    targetPos.x = Math.max(targetPos.x, viewportRect.left);
    targetPos.y = Math.max(targetPos.y, viewportRect.top);

    // console.log("Fixing tooltip:",{tooltip,tooltipRect,trigger,triggerRect,event});

    // Now, check and see if we can do a nudge (valid rect, currently fixed) or if we have to do initial position
    const curLeft = parseFloat(tooltip.style.left);
    const curTop = parseFloat(tooltip.style.top);
    if (
      tooltip.style.position === 'fixed' && isFinite(curLeft) && isFinite(curTop) && tooltipRect.width > 0 &&
      tooltipRect.height > 0
    ) {
      // simple nudge
      tooltip.style.left = `${curLeft + targetPos.x - tooltipRect.x}px`;
      tooltip.style.top = `${curTop + targetPos.y - tooltipRect.y}px`;
    } else {
      // initial positioning
      tooltip.style.position = 'fixed';
      tooltip.style.left = `${targetPos.x - viewportRect.left}px`;
      tooltip.style.top = `${targetPos.y - viewportRect.top}px`;
      tooltip.style.right = 'auto';
      tooltip.style.bottom = 'auto';
      tooltip.style.margin = '0';
      if (!delayedCall) {
        // queue up a nudge ASAP, but avoid infinite recursion
        requestAnimationFrame(() => this.fixTooltipPosition(tooltip, trigger, eventTarget, true));
      }
    }
  }

  showStat(stat) {
    statShowing = stat;
    if (stat !== undefined) this.updateStat(stat);
  }

  updateStatGraphNeeded = false;

  /** @param {StatName} stat */
  updateStat(stat) {
    const level = globalThis.stats.getLevel(stat);
    const talent = globalThis.stats.getTalent(stat);
    const totalLevel = Object.values(stats).map((s) => s.statLevelExp.level).reduce((a, b) => a + b);
    const totalTalent = Object.values(stats).map((s) => s.talentLevelExp.level).reduce((a, b) => a + b);
    const levelPrc = `${globalThis.stats.getPrcToNextLevel(stat)}%`;
    const talentPrc = `${globalThis.stats.getPrcToNextTalent(stat)}%`;

    this.updateLevelLogBar('statsContainer', `stat${stat}LevelLogBar`, level, `stat${stat}LevelBar`, levelPrc);
    this.updateLevelLogBar('statsContainer', `stat${stat}TalentLogBar`, talent, `stat${stat}TalentBar`, talentPrc);

    document.getElementById(`stat${stat}Level`).textContent = globalThis.helpers.intToString(level, 1);
    document.getElementById(`stat${stat}Talent`).textContent = globalThis.helpers.intToString(talent, 1);
    document.getElementById(`stattotalLevel`).textContent = globalThis.helpers.intToString(totalLevel, 1);
    document.getElementById(`stattotalTalent`).textContent = globalThis.helpers.intToString(totalTalent, 1);
    document.getElementById(`stattotalLevel2`).textContent = globalThis.helpers.formatNumber(totalLevel);
    document.getElementById(`stattotalTalent2`).textContent = globalThis.helpers.formatNumber(totalTalent);

    if (statShowing === stat || document.getElementById(`stat${stat}LevelExp`).innerHTML === '') {
      document.getElementById(`stat${stat}Level2`).textContent = globalThis.helpers.formatNumber(level);
      document.getElementById(`stat${stat}LevelExp`).textContent = globalThis.helpers.intToString(
        stats[stat].statLevelExp.exp,
        1,
      );
      document.getElementById(`stat${stat}LevelExpNeeded`).textContent = globalThis.helpers.intToString(
        stats[stat].statLevelExp.expRequiredForNextLevel,
        1,
      );
      document.getElementById(`stat${stat}LevelProgress`).textContent = globalThis.helpers.intToString(levelPrc, 2);

      document.getElementById(`stat${stat}Talent2`).textContent = globalThis.helpers.formatNumber(talent);
      document.getElementById(`stat${stat}TalentExp`).textContent = globalThis.helpers.intToString(
        stats[stat].talentLevelExp.exp,
        1,
      );
      document.getElementById(`stat${stat}TalentExpNeeded`).textContent = globalThis.helpers.intToString(
        stats[stat].talentLevelExp.expRequiredForNextLevel,
        1,
      );
      document.getElementById(`stat${stat}TalentMult`).textContent = globalThis.helpers.intToString(
        stats[stat].talentMult,
        3,
      );
      document.getElementById(`stat${stat}TalentProgress`).textContent = globalThis.helpers.intToString(talentPrc, 2);
      document.getElementById(`stat${stat}TotalMult`).textContent = globalThis.helpers.intToString(
        globalThis.stats.getTotalBonusXP(stat),
        3,
      );
    }
  }

  logBarScaleBase = 1.25;
  /** @param {number} maxValue  */
  getMaxLogBarScale(maxValue) {
    return this.logBarScaleBase ** Math.ceil(Math.log(maxValue) / Math.log(this.logBarScaleBase));
  }

  /**
   * @param {string} maxContainerId
   * @param {string} logBarId
   * @param {number} level
   * @param {string} [levelBarId]
   * @param {string} [levelPrc]
   */
  updateLevelLogBar(maxContainerId, logBarId, level, levelBarId, levelPrc) {
    const maxContainer = globalThis.helpers.htmlElement(maxContainerId);
    const logLevel = level; //Math.log10(level);
    let maxValue = parseFloat(getComputedStyle(maxContainer).getPropertyValue('--max-bar-value')) || 0;

    const logBar = globalThis.helpers.htmlElement(logBarId);
    if (level > maxValue) {
      maxValue = this.getMaxLogBarScale(level + 1);
      maxContainer.style.setProperty('--max-bar-value', String(maxValue));
    }
    logBar.style.setProperty('--bar-value', String(logLevel));
    if (levelBarId) document.getElementById(levelBarId).style.width = levelPrc;
  }

  updateStats(skipAnimation) {
    let maxValue = 100; // I really need to stop writing this default explicitly everywhere
    for (const stat of statList) {
      for (const value of [globalThis.stats.getLevel(stat), globalThis.stats.getTalent(stat), stats[stat].soulstone]) {
        maxValue = Math.max(value, maxValue);
      }
    }
    maxValue = this.getMaxLogBarScale(maxValue);
    const statsContainer = globalThis.helpers.htmlElement('statsContainer');
    if (skipAnimation) {
      statsContainer.classList.remove('animate-logBars');
      this.statGraph.update(true);
    }
    statsContainer.style.setProperty('--max-bar-value', String(maxValue));
    if (!statsContainer.classList.contains('animate-logBars')) {
      requestAnimationFrame(() => statsContainer.classList.add('animate-logBars'));
    }

    for (const stat of statList) {
      this.updateStat(stat);
    }
  }

  showSkill(skill) {
    skillShowing = skill;
    if (skill !== undefined) this.updateSkill(skill);
  }

  /** @param {SkillName} skill */
  updateSkill(skill) {
    if (skills[skill].levelExp.level === 0) {
      document.getElementById(`skill${skill}Container`).style.display = 'none';
      return;
    }
    let container = document.getElementById(`skill${skill}Container`);
    container.style.display = 'inline-block';
    if (skill === 'Combat' || skill === 'Pyromancy' || skill === 'Restoration') {
      this.updateTeamCombat();
    }

    const levelPrc = globalThis.stats.getPrcToNextSkillLevel(skill);
    document.getElementById(`skill${skill}Level`).textContent = (globalThis.stats.getSkillLevel(skill) > 9999)
      ? globalThis.helpers.toSuffix(globalThis.stats.getSkillLevel(skill))
      : globalThis.helpers.formatNumber(globalThis.stats.getSkillLevel(skill));
    document.getElementById(`skill${skill}LevelBar`).style.width = `${levelPrc}%`;

    if (skillShowing === skill) {
      document.getElementById(`skill${skill}LevelExp`).textContent = globalThis.helpers.intToString(
        skills[skill].levelExp.exp,
        1,
      );
      document.getElementById(`skill${skill}LevelExpNeeded`).textContent = globalThis.helpers.intToString(
        skills[skill].levelExp.expRequiredForNextLevel,
        1,
      );
      document.getElementById(`skill${skill}LevelProgress`).textContent = globalThis.helpers.intToString(levelPrc, 2);

      if (skill === 'Dark') {
        document.getElementById('skillBonusDark').textContent = globalThis.helpers.intToString(
          globalThis.stats.getSkillBonus('Dark'),
          4,
        );
      } else if (skill === 'Chronomancy') {
        document.getElementById('skillBonusChronomancy').textContent = globalThis.helpers.intToString(
          globalThis.stats.getSkillBonus('Chronomancy'),
          4,
        );
      } else if (skill === 'Practical') {
        document.getElementById('skillBonusPractical').textContent = globalThis.stats.getSkillBonus('Practical')
          .toFixed(3).replace(
            /(\.\d*?[1-9])0+$/gu,
            '$1',
          );
      } else if (skill === 'Mercantilism') {
        document.getElementById('skillBonusMercantilism').textContent = globalThis.helpers.intToString(
          globalThis.stats.getSkillBonus('Mercantilism'),
          4,
        );
      } else if (skill === 'Spatiomancy') {
        document.getElementById('skillBonusSpatiomancy').textContent = globalThis.stats.getSkillBonus('Spatiomancy')
          .toFixed(3).replace(
            /(\.\d*?[1-9])0+$/gu,
            '$1',
          );
      } else if (skill === 'Divine') {
        document.getElementById('skillBonusDivine').textContent = globalThis.helpers.intToString(
          globalThis.stats.getSkillBonus('Divine'),
          4,
        );
      } else if (skill === 'Commune') {
        document.getElementById('skillBonusCommune').textContent = globalThis.stats.getSkillBonus('Commune').toFixed(3)
          .replace(
            /(\.\d*?[1-9])0+$/gu,
            '$1',
          );
      } else if (skill === 'Wunderkind') {
        document.getElementById('skillBonusWunderkind').textContent = globalThis.helpers.intToString(
          globalThis.stats.getSkillBonus('Wunderkind'),
          4,
        );
      } else if (skill === 'Gluttony') {
        document.getElementById('skillBonusGluttony').textContent = globalThis.stats.getSkillBonus('Gluttony').toFixed(
          3,
        ).replace(
          /(\.\d*?[1-9])0+$/gu,
          '$1',
        );
      } else if (skill === 'Thievery') {
        document.getElementById('skillBonusThievery').textContent = globalThis.helpers.intToString(
          globalThis.stats.getSkillBonus('Thievery'),
          4,
        );
      } else if (skill === 'Leadership') {
        document.getElementById('skillBonusLeadership').textContent = globalThis.helpers.intToString(
          globalThis.stats.getSkillBonus('Leadership'),
          4,
        );
      } else if (skill === 'Assassin') {
        document.getElementById('skillBonusAssassin').textContent = globalThis.helpers.intToString(
          globalThis.stats.getSkillBonus('Assassin'),
          4,
        );
      }
    }
    this.adjustTooltipPosition(container.querySelector('div.showthis'));
  }

  updateSkills() {
    for (const skill of skillList) {
      this.updateSkill(skill);
    }
  }

  showBuff(buff) {
    buffShowing = buff;
    if (buff !== undefined) this.updateBuff(buff);
  }

  updateBuff(buff) {
    if (buffs[buff].amt === 0) {
      document.getElementById(`buff${buff}Container`).style.display = 'none';
      return;
    }
    let container = document.getElementById(`buff${buff}Container`);
    container.style.display = 'flex';
    document.getElementById(`buff${buff}Level`).textContent = `${globalThis.stats.getBuffLevel(buff)}/`;
    if (buff === 'Imbuement') {
      this.updateTrainingLimits();
    }
    this.adjustTooltipPosition(container.querySelector('div.showthis'));
  }

  updateBuffs() {
    for (const buff of buffList) {
      this.updateBuff(buff);
    }
  }

  updateTime() {
    document.getElementById('timeBar').style.width = `${
      100 - globalThis.saving.timer / globalThis.saving.timeNeeded * 100
    }%`;
    document.getElementById('timer').textContent = `${
      globalThis.helpers.intToString(
        globalThis.saving.timeNeeded - globalThis.saving.timer,
        options.fractionalMana ? 2 : 1,
        true,
      )
    } | ${
      formatTime((globalThis.saving.timeNeeded - globalThis.saving.timer) / 50 / globalThis.driver.getActualGameSpeed())
    }`;
    this.adjustGoldCost({ varName: 'Wells', cost: globalThis.actionList.Action.ManaWell.goldCost() });
  }
  updateOffline() {
    document.getElementById('bonusSeconds').textContent = formatTime(totalOfflineMs / 1000);
    const returnTimeButton = document.getElementById('returnTimeButton');
    if (returnTimeButton instanceof HTMLButtonElement) {
      returnTimeButton.disabled = totalOfflineMs < 86400_000;
    }
  }
  updateBonusText() {
    const element = document.getElementById('bonusText');
    if (!element) return;
    element.innerHTML = this.getBonusText() ?? '';
  }
  getBonusText() {
    let text = globalThis.Localization.txt('time_controls>bonus_seconds>main_text');
    let lastText = null;
    while (lastText !== text) {
      lastText = text;
      text = text?.replace(/{([^+{}-]*)([+-]?)(.*?)}/g, (_str, lhs, op, rhs) => this.getBonusReplacement(lhs, op, rhs));
    }
    return text;
  }
  /** @type {(lhs: string, op?: string, rhs?: string) => string} */
  getBonusReplacement(lhs, op, rhs) {
    // this is the second time I've manually implemented this text-replacement pattern (first was for Action Log entries). Next time I need to make it a
    // generic operation on Localization; I think I'm beginning to figure out what will be needed for it
    const fgSpeed = Math.max(
      5,
      options.speedIncrease10x ? 10 : 0,
      options.speedIncrease20x ? 20 : 0,
      options.speedIncreaseCustom,
    );
    const bgSpeed = !isFinite(options.speedIncreaseBackground) ? -1 : options.speedIncreaseBackground ?? -1;
    const variables = {
      __proto__: null, // toString is not a valid replacement name
      get background_info() {
        if (bgSpeed < 0 || bgSpeed === fgSpeed) {
          return globalThis.Localization.txt('time_controls>bonus_seconds>background_disabled');
        } else if (bgSpeed === 0) {
          return globalThis.Localization.txt('time_controls>bonus_seconds>background_0x');
        } else if (bgSpeed < 1) {
          return globalThis.Localization.txt('time_controls>bonus_seconds>background_regen');
        } else if (bgSpeed === 1) {
          return globalThis.Localization.txt('time_controls>bonus_seconds>background_1x');
        } else if (bgSpeed < fgSpeed) {
          return globalThis.Localization.txt('time_controls>bonus_seconds>background_slower');
        } else {
          return globalThis.Localization.txt('time_controls>bonus_seconds>background_faster');
        }
      },
      get state() {
        return `<span class='bold' id='isBonusOn'>${
          globalThis.Localization.txt(
            `time_controls>bonus_seconds>state>${globalThis.driver.isBonusActive() ? 'on' : 'off'}`,
          )
        }</span>`;
      },
      get counter_text() {
        return `<span class='bold'>${globalThis.Localization.txt('time_controls>bonus_seconds>counter_text')}</span>`;
      },
      get bonusSeconds() {
        return `<span id='bonusSeconds'>${formatTime(totalOfflineMs / 1000)}</span>`;
      },
      get lag_warning() {
        return globalThis.driver.lagSpeed > 0
          ? globalThis.Localization.txt('time_controls>bonus_seconds>lag_warning')
          : '';
      },
      speed: fgSpeed,
      background_speed: bgSpeed,
      lagSpeed: globalThis.driver.lagSpeed,
    };
    const lval = variables[lhs] ?? (parseFloat(lhs) || 0);
    const rval = variables[rhs] ?? (parseFloat(rhs) || 0);
    return String(
      op === '+' ? lval + rval : op === '-' ? lval - rval : lval,
    );
  }
  updateTotalTicks() {
    document.getElementById('totalTicks').textContent = `${globalThis.helpers.formatNumber(actions.completedTicks)} | ${
      formatTime(globalThis.driver.timeCounter)
    }`;
    document.getElementById('effectiveTime').textContent = `${formatTime(globalThis.driver.effectiveTime)}`;
  }
  updateResource(resource) {
    const element = globalThis.helpers.htmlElement(`${resource}Div`, false, false);
    if (element) element.style.display = resources[resource] ? 'inline-block' : 'none';

    if (resource === 'supplies') document.getElementById('suppliesCost').textContent = String(towns[0].suppliesCost);
    if (resource === 'teamMembers') {
      document.getElementById('teamCost').textContent = `${(resources.teamMembers + 1) * 100}`;
    }

    if (Number.isFinite(resources[resource])) {
      globalThis.helpers.htmlElement(resource).textContent = resources[resource];
    }
  }
  updateResources() {
    for (const resource in resources) this.updateResource(resource);
  }
  updateActionTooltips() {
    document.getElementById('goldInvested').textContent = globalThis.helpers.intToStringRound(goldInvested);
    document.getElementById('bankInterest').textContent = globalThis.helpers.intToStringRound(goldInvested * .001);
    document.getElementById('actionAllowedPockets').textContent = globalThis.helpers.intToStringRound(
      towns[7].totalPockets,
    );
    document.getElementById('actionAllowedWarehouses').textContent = globalThis.helpers.intToStringRound(
      towns[7].totalWarehouses,
    );
    document.getElementById('actionAllowedInsurance').textContent = globalThis.helpers.intToStringRound(
      towns[7].totalInsurance,
    );
    document.getElementById('totalSurveyProgress').textContent = `${globalThis.actionList.getExploreProgress()}`;
    Array.from(document.getElementsByClassName('surveySkill')).forEach((div) => {
      div.textContent = `${globalThis.actionList.getExploreSkill()}`;
    });
    for (const town of towns) {
      const varName = town.progressVars.find((v) => v.startsWith('Survey'));
      this.updateGlobalSurvey(varName, town);
    }
  }
  updateTeamCombat() {
    if (towns[2].unlocked) {
      document.getElementById('skillSCombatContainer').style.display = 'inline-block';
      document.getElementById('skillTCombatContainer').style.display = 'inline-block';
      document.getElementById('skillSCombatLevel').textContent = globalThis.helpers.intToString(
        globalThis.stats.getSelfCombat(),
        1,
      );
      document.getElementById('skillTCombatLevel').textContent = globalThis.helpers.intToString(
        globalThis.stats.getTeamCombat(),
        1,
      );
    } else {
      document.getElementById('skillSCombatContainer').style.display = 'none';
      document.getElementById('skillTCombatContainer').style.display = 'none';
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
    if (options.predictor) {
      globalThis.Koviko.preUpdateHandler(nextActionsDiv);
    }

    globalThis.trash.d3.select(nextActionsDiv)
      .selectAll('.nextActionContainer')
      .data(
        actions.next.map((a, index) => ({
          ...a,
          actionId: a.actionId,
          index,
          action: globalThis.actionList.getActionPrototype(a.name),
        })),
        (a) => a.actionId,
      )
      .join((enter) => {
        enter.append(({ actionId: id }) => {
          const actions = {
            cap: globalThis.driver.capAction.bind(null, id),
            plus: globalThis.driver.addLoop.bind(null, id),
            minus: globalThis.driver.removeLoop.bind(null, id),
            split: globalThis.driver.split.bind(null, id),
            compress: globalThis.driver.collapse.bind(null, id),
            up: globalThis.driver.moveUp.bind(null, id),
            down: globalThis.driver.moveDown.bind(null, id),
            skip: globalThis.driver.disableAction.bind(null, id),
            remove: globalThis.driver.removeAction.bind(null, id),
          };
          const drags = {
            ondrop: globalThis.driver.handleDragDrop,
            ondragover: globalThis.driver.handleDragOver,
            ondragstart: globalThis.driver.handleDragStart,
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
        for (const type of globalThis.actionList.actionTypes) {
          container.classed(`action-type-${type}`, (a) => a.action.type === type);
        }
      })
      .classed('action-has-limit', (a) => globalThis.actionList.hasLimit(a.name))
      .classed('action-is-training', (a) => globalThis.actionList.isTraining(a.name))
      .classed('action-is-singular', (a) => a.action.allowed?.() === 1)
      .classed('action-is-travel', (a) => globalThis.actionList.getPossibleTravel(a.name).length > 0)
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
        const travelNums = globalThis.actionList.getPossibleTravel(action.name);
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
          .text((action) =>
            action.loops > 99999
              ? globalThis.helpers.toSuffix(action.loops)
              : globalThis.helpers.formatNumber(action.loops)
          )
      );

    if (options.predictor) {
      Koviko.postUpdateHandler(actions.next, nextActionsDiv);
    }
    nextActionsDiv.scrollTop = Math.max(nextActionsDiv.scrollTop, scrollTop); // scrolling down to see the new thing added is okay, scrolling up when you click an action button is not
  }

  updateCurrentActionsDivs() {
    let totalDivText = '';

    // definite leak - need to remove listeners and image
    for (let i = 0; i < actions.current.length; i++) {
      const action = actions.current[i];
      const actionLoops = action.loops > 99999
        ? globalThis.helpers.toSuffix(action.loops)
        : globalThis.helpers.formatNumber(action.loops);
      const actionLoopsDone = (action.loops - action.loopsLeft) > 99999
        ? globalThis.helpers.toSuffix(action.loops - action.loopsLeft)
        : globalThis.helpers.formatNumber(action.loops - action.loopsLeft);
      const imageName = action.name.startsWith('Assassin') ? 'assassin' : globalThis.helpers.camelize(action.name);
      totalDivText +=
        `<div class='curActionContainer small' onmouseover='globalThis.saving.view.mouseoverAction(${i}, truglobalThis.saving.viewonmouseleave='view.mouseoverAction(${i}, false)'>
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
        `<div style='text-align:center;width:100%'>${action.label}</div><br><br>` +
        `<b>${
          globalThis.Localization.txt('actions>current_action>mana_original')
        }</b> <div id='action${i}ManaOrig'></div><br>` +
        `<b>${
          globalThis.Localization.txt('actions>current_action>mana_used')
        }</b> <div id='action${i}ManaUsed'></div><br>` +
        `<b>${
          globalThis.Localization.txt('actions>current_action>last_mana')
        }</b> <div id='action${i}LastMana'></div><br>` +
        `<b>${
          globalThis.Localization.txt('actions>current_action>mana_remaining')
        }</b> <div id='action${i}Remaining'></div><br>` +
        `<b>${
          globalThis.Localization.txt('actions>current_action>gold_remaining')
        }</b> <div id='action${i}GoldRemaining'></div><br>` +
        `<b>${
          globalThis.Localization.txt('actions>current_action>time_spent')
        }</b> <div id='action${i}TimeSpent'></div><br>` +
        `<b>${
          globalThis.Localization.txt('actions>current_action>total_time_elapsed')
        }</b> <div id='action${i}TotalTimeElapsed'></div><br>` +
        `<br>` +
        `<div id='action${i}ExpGain'></div>` +
        `<div id='action${i}HasFailed' style='display:none'>` +
        `<b>${
          globalThis.Localization.txt('actions>current_action>failed_attempts')
        }</b> <div id='action${i}Failed'></div><br>` +
        `<b>${globalThis.Localization.txt('actions>current_action>error')}</b> <div id='action${i}Error'></div>` +
        `</div>` +
        `</div>`;
    }

    document.getElementById('actionTooltipContainer').innerHTML = totalDivText;
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
      if (action.name === 'Brew Potions' && resources.reputation >= 0 && resources.herbs >= 10) {
        setStoryFlag('failedBrewPotions');
      }
      if (action.name === 'Brew Potions' && resources.reputation < 0 && resources.herbs >= 10) {
        setStoryFlag('failedBrewPotionsNegativeRep');
      }
      if (action.name === 'Gamble' && resources.reputation < -5) setStoryFlag('failedGamble');
      if (action.name === 'Gamble' && resources.gold < 20 && resources.reputation > -6) {
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
      document.getElementById(`action${index}ManaOrig`).textContent = globalThis.helpers.intToString(
        action.manaCost() * action.loops,
        options.fractionalMana ? 3 : 1,
      );
      document.getElementById(`action${index}ManaUsed`).textContent = globalThis.helpers.intToString(
        action.manaUsed,
        options.fractionalMana ? 3 : 1,
      );
      document.getElementById(`action${index}LastMana`).textContent = globalThis.helpers.intToString(
        action.lastMana,
        3,
      );
      document.getElementById(`action${index}Remaining`).textContent = globalThis.helpers.intToString(
        action.manaRemaining,
        options.fractionalMana ? 3 : 1,
      );
      document.getElementById(`action${index}GoldRemaining`).textContent = globalThis.helpers.formatNumber(
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
          statExpGain += `<div class='bold'>${globalThis.Localization.txt(`stats>${stat}>short_form`)}:</div> ${
            globalThis.helpers.intToString(action[`statExp${stat}`], 2)
          }<br>`;
        }
      }
      expGainDiv.innerHTML = statExpGain;
    }
  }

  /** @typedef {{lastScroll:Pick<HTMLElement,'scrollTop'|'scrollHeight'|'clientHeight'>}} LastScrollRecord */
  /** @type {string} */
  actionLogClearHTML;
  /** @type {ResizeObserver} */
  actionLogObserver;
  initActionLog() {
    const log = /** @type {HTMLElement & LastScrollRecord} */ (document.getElementById('actionLog'));
    this.actionLogClearHTML ??= log.innerHTML;
    this.actionLogObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target !== log) continue;
        // console.log(entry,entry.target,log,log.scrollTop,log.scrollHeight,log.clientHeight,log.lastScroll);
        // check the most recent position of the scroll bottom
        const { scrollTop, scrollHeight, clientHeight, lastScroll } = log;
        const lastScrollBottom = lastScroll
          ? lastScroll.scrollHeight - (lastScroll.scrollTop + lastScroll.clientHeight)
          : 0;
        // check the current position
        const scrollBottom = scrollHeight - (scrollTop + clientHeight);
        // shift by that delta
        log.scrollTop += scrollBottom - lastScrollBottom;
      }
    });
    this.actionLogObserver.observe(log);
    log.addEventListener('scroll', this.recordScrollPosition, { passive: true });
    log.addEventListener('scrollend', this.recordScrollPosition, { passive: true });
  }
  /** @this {HTMLElement & LastScrollRecord} */
  recordScrollPosition() {
    const { scrollTop, scrollHeight, clientHeight } = this;
    this.lastScroll = { scrollTop, scrollHeight, clientHeight };
  }
  updateActionLogEntry(index) {
    const log = document.getElementById('actionLog');
    this.actionLogClearHTML ??= log.innerHTML;
    if (index === 'clear') {
      log.innerHTML = this.actionLogClearHTML; // nuke it, dot it
    }
    const entry = globalThis.saving.actionLog.getEntry(index);
    if (globalThis.saving.actionLog.hasPrevious()) {
      log.classList.add('hasPrevious');
    } else {
      log.classList.remove('hasPrevious');
    }
    if (!entry) return;
    let element = document.getElementById(`actionLogEntry${index}`);
    if (element) {
      entry.element = element;
      entry.updateElement();
    } else {
      element = entry.createElement();
      element.id = `actionLogEntry${index}`;
      element.style.order = index;

      const nextEntry = globalThis.helpers.htmlElement(`actionLogEntry${index + 1}`, false, false);
      log.insertBefore(element, nextEntry ?? globalThis.helpers.htmlElement('actionLogLatest'));
    }
    if ((globalThis.saving.actionLog.firstNewOrUpdatedEntry ?? Infinity) <= index) {
      element.classList.add('highlight');
      // this is just causing problems right now. disable, it's not all that important if scroll anchors work properly
      // element.scrollIntoView({block: "nearest", inline: "nearest", behavior: "auto"});
      setTimeout(() => element.classList.remove('highlight'), 1);
    }
  }

  mouseoverAction(index, isShowing) {
    if (isShowing) curActionShowing = index;
    else curActionShowing = undefined;
    const div = document.getElementById(`action${index}Selected`);
    if (div) {
      div.style.opacity = isShowing ? '1' : '0';
      document.getElementById(`actionTooltip${index}`).style.display = isShowing ? '' : 'none';
    }
    nextActionsDiv.style.display = isShowing ? 'none' : '';
    document.getElementById('actionTooltipContainer').style.display = isShowing ? '' : 'none';
    globalThis.saving.view.updateCurrentActionBar(index);
  }

  updateCurrentActionLoops(index) {
    const action = actions.current[index];
    if (action !== undefined) {
      document.getElementById(`action${index}LoopsDone`).textContent = (action.loops - action.loopsLeft) > 99999
        ? globalThis.helpers.toSuffix(action.loops - action.loopsLeft)
        : globalThis.helpers.formatNumber(action.loops - action.loopsLeft);
      document.getElementById(`action${index}Loops`).textContent = action.loops > 99999
        ? globalThis.helpers.toSuffix(action.loops)
        : globalThis.helpers.formatNumber(action.loops);
    }
  }

  /** @param {{name: string, town: Town}} updateInfo */
  updateProgressAction(
    { name: varName, town },
    level = town.getLevel(varName),
    levelPrc = `${town.getPrcToNext(varName)}%`,
  ) {
    document.getElementById(`prc${varName}`).textContent = `${level}`;
    document.getElementById(`expBar${varName}`)?.style.setProperty('width', levelPrc);
    document.getElementById(`progress${varName}`).textContent = globalThis.helpers.intToString(levelPrc, 2);
    document.getElementById(`bar${varName}`).style.width = `${level}%`;
    if (varName.startsWith('Survey') && !varName.endsWith('Global')) {
      this.updateGlobalSurvey(varName, town);
    }
  }

  updateGlobalSurvey(varName, town) {
    const expToNext = globalThis.actionList.getExploreExpToNextProgress();
    const expSinceLast = globalThis.actionList.getExploreExpSinceLastProgress();
    this.updateProgressAction(
      { name: `${varName}Global`, town },
      globalThis.actionList.getExploreProgress(),
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
    for (const action of totalActionList) {
      const actionDiv = document.getElementById(`container${action.varName}`);
      const infoDiv = document.getElementById(`infoContainer${action.varName}`);
      const storyDiv = document.getElementById(`storyContainer${action.varName}`);
      if (action.allowed && globalThis.actions.getNumOnList(action.name) >= action.allowed()) {
        globalThis.helpers.addClassToDiv(actionDiv, 'capped');
      } else if (action.unlocked()) {
        if (infoDiv) {
          globalThis.helpers.removeClassFromDiv(infoDiv, 'hidden');
          if (action.varName.startsWith('Survey')) {
            globalThis.helpers.removeClassFromDiv(
              document.getElementById(`infoContainer${action.varName}Global`),
              'hidden',
            );
          }
        }
        globalThis.helpers.removeClassFromDiv(actionDiv, 'locked');
        globalThis.helpers.removeClassFromDiv(actionDiv, 'capped');
      } else {
        globalThis.helpers.addClassToDiv(actionDiv, 'locked');
        if (infoDiv) {
          globalThis.helpers.addClassToDiv(infoDiv, 'hidden');
          if (action.varName.startsWith('Survey')) {
            globalThis.helpers.addClassToDiv(document.getElementById(`infoContainer${action.varName}Global`), 'hidden');
          }
        }
      }
      if (action.unlocked() && infoDiv) {
        globalThis.helpers.removeClassFromDiv(infoDiv, 'hidden');
      }
      if (action.visible()) {
        globalThis.helpers.removeClassFromDiv(actionDiv, 'hidden');
        if (storyDiv !== null) globalThis.helpers.removeClassFromDiv(storyDiv, 'hidden');
      } else {
        globalThis.helpers.addClassToDiv(actionDiv, 'hidden');
        if (storyDiv !== null) globalThis.helpers.addClassToDiv(storyDiv, 'hidden');
      }
      if (storyDiv !== null) {
        if (action.unlocked()) {
          globalThis.helpers.removeClassFromDiv(storyDiv, 'hidden');
        } else {
          globalThis.helpers.addClassToDiv(storyDiv, 'hidden');
        }
      }
    }
    if (
      totalActionList.filter((action) => action.finish.toString().includes('handleSkillExp')).filter((action) =>
        action.unlocked()
      ).length > 0
    ) {
      document.getElementById('skillList').style.display = '';
    } else {
      document.getElementById('skillList').style.display = 'none';
    }
    if (
      totalActionList.filter((action) => action.finish.toString().includes('updateBuff')).filter((action) =>
          action.unlocked()
        ).length > 0 ||
      globalThis.prestige.prestigeValues['completedAnyPrestige']
    ) {
      document.getElementById('buffList').style.display = '';
    } else {
      document.getElementById('buffList').style.display = 'none';
    }
  }

  updateGlobalStory(num) {
    globalThis.saving.actionLog.addGlobalStory(num);
  }

  updateStories(init) {
    // several ms cost per run. run once every 2000ms on an interval
    for (const action of totalActionList) {
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
              if (action.visible() && action.unlocked() && completedActions.includes(action.varName)) {
                globalThis.saving.actionLog.addActionStory(action, storyId, init);
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

          if (document.getElementById(divName).children[2].innerHTML !== storyTooltipText) {
            document.getElementById(divName).children[2].innerHTML = storyTooltipText;
            if (!init) {
              globalThis.driver.showNotification(divName);
              if (!unreadActionStories.includes(divName)) unreadActionStories.push(divName);
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

  showTown(townNum) {
    if (!towns[townNum].unlocked()) return;

    if (townNum === 0) {
      document.getElementById('townViewLeft').style.visibility = 'hidden';
    } else {
      document.getElementById('townViewLeft').style.visibility = '';
    }

    if (townNum === Math.max(...townsUnlocked)) {
      document.getElementById('townViewRight').style.visibility = 'hidden';
    } else {
      document.getElementById('townViewRight').style.visibility = '';
    }

    for (let i = 0; i < actionOptionsTown.length; i++) {
      actionOptionsTown[i].style.display = 'none';
      actionStoriesTown[i].style.display = 'none';
      townInfos[i].style.display = 'none';
    }
    if (actionStoriesShowing) actionStoriesTown[townNum].style.display = '';
    else actionOptionsTown[townNum].style.display = '';
    townInfos[townNum].style.display = '';
    $('#TownSelect').val(townNum);

    globalThis.helpers.htmlElement('shortTownColumn').classList.remove(`zone-${townShowing + 1}`);
    globalThis.helpers.htmlElement('shortTownColumn').classList.add(`zone-${townNum + 1}`);
    document.getElementById('townDesc').textContent = globalThis.Localization.txt(`towns>town${townNum}>desc`);
    townShowing = townNum;
  }

  showActions(stories) {
    for (let i = 0; i < actionOptionsTown.length; i++) {
      actionOptionsTown[i].style.display = 'none';
      actionStoriesTown[i].style.display = 'none';
    }

    if (stories) {
      document.getElementById('actionsViewLeft').style.visibility = '';
      document.getElementById('actionsViewRight').style.visibility = 'hidden';
      actionStoriesTown[townShowing].style.display = '';
    } else {
      document.getElementById('actionsViewLeft').style.visibility = 'hidden';
      document.getElementById('actionsViewRight').style.visibility = '';
      actionOptionsTown[townShowing].style.display = '';
    }

    document.getElementById('actionsTitle').textContent = globalThis.Localization.txt(
      `actions>title${stories ? '_stories' : ''}`,
    );
    actionStoriesShowing = stories;
  }

  toggleHiding() {
    document.documentElement.classList.toggle('editing-hidden-vars');
  }

  toggleHidden(varName, force) {
    const isHidden = towns[townShowing].hiddenVars.has(varName);
    if ((isHidden && force !== true) || force === false) {
      towns[townShowing].hiddenVars.delete(varName);
      globalThis.helpers.htmlElement(`infoContainer${varName}`).classList.remove('user-hidden');
    } else if (!isHidden || force === true) {
      towns[townShowing].hiddenVars.add(varName);
      globalThis.helpers.htmlElement(`infoContainer${varName}`).classList.add('user-hidden');
    }
  }

  updateRegular(updateInfo) {
    const varName = updateInfo.name;
    const index = updateInfo.index;
    const town = towns[index];
    globalThis.helpers.htmlElement(`total${varName}`).textContent = String(town[`total${varName}`]);
    globalThis.helpers.htmlElement(`checked${varName}`).textContent = String(town[`checked${varName}`]);
    globalThis.helpers.htmlElement(`unchecked${varName}`).textContent = String(
      town[`total${varName}`] - town[`checked${varName}`],
    );
    globalThis.helpers.htmlElement(`goodTemp${varName}`).textContent = String(town[`goodTemp${varName}`]);
    globalThis.helpers.htmlElement(`good${varName}`).textContent = String(town[`good${varName}`]);
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
        globalThis.helpers.addClassToDiv(elem, 'unused');
      }
    }
    const elem = document.getElementById(`load${num}`);
    if (elem) {
      globalThis.helpers.removeClassFromDiv(document.getElementById(`load${num}`), 'unused');
    }
  }

  updateLoadoutNames() {
    for (let i = 0; i < loadoutnames.length; i++) {
      document.getElementById(`load${i + 1}`).textContent = loadoutnames[i];
    }
    globalThis.helpers.inputElement('renameLoadout').value = loadoutnames[curLoadout - 1];
  }

  createTownActions() {
    if (actionOptionsTown[0].querySelector('.actionOrTravelContainer')) return;
    for (const action of towns.flatMap((t) => t.totalActionList)) {
      this.createTownAction(action);
    }
    for (const varName of towns.flatMap((t) => t.allVarNames)) {
      const action = totalActionList.find((a) => a.varName === varName);
      if (globalThis.actionList.isActionOfType(action, 'limited')) this.createTownInfo(action);
      if (globalThis.actionList.isActionOfType(action, 'progress')) {
        if (action.name.startsWith('Survey')) this.createGlobalSurveyProgress(action);
        this.createActionProgress(action);
      }
      if (globalThis.actionList.isActionOfType(action, 'multipart')) this.createMultiPartPBar(action);
    }
    if (options.highlightNew) this.highlightIncompleteActions();
  }

  /** @param {ActionOfType<"progress">} action  */
  createGlobalSurveyProgress(action) {
    this.createActionProgress(action, 'Global', action.labelGlobal, true);
  }

  /** @param {ActionOfType<"progress">} action @param {string} [label] */
  createActionProgress(action, varSuffix = '', label, includeExpBar = true) {
    const totalDivText = `<div class='townStatContainer showthat'>
            <div class='bold townLabel'>${label ?? action.labelDone}</div>
            <div class='progressValue' id='prc${action.varName}${varSuffix}'>5</div><div class='percentSign'>%</div>
            <div class='progressBars'>
                ${
      includeExpBar
        ? `<div class='thinProgressBarUpper'><div id='expBar${action.varName}${varSuffix}' class='statBar townExpBar'></div></div>`
        : ''
    }
                <div class='thinProgressBarLower'><div id='bar${action.varName}${varSuffix}' class='statBar townBar'></div></div>
            </div>

            <div class='showthis'>
                ${globalThis.Localization.txt('actions>tooltip>higher_done_percent_benefic')}<br>
                <div class='bold'>${
      globalThis.Localization.txt('actions>tooltip>progress_label')
    }</div> <div id='progress${action.varName}${varSuffix}'></div>%
            </div>
            <div class='hideVarButton far' onclick='globalThis.saving.view.toggleHidden("${action.varName}${varSuffix}")'></div>
        </div>`;
    const progressDiv = document.createElement('div');
    progressDiv.className = 'townContainer progressType';
    progressDiv.id = `infoContainer${action.varName}${varSuffix}`;
    progressDiv.style.display = '';
    progressDiv.innerHTML = totalDivText;
    townInfos[action.townNum].appendChild(progressDiv);
    if (towns[action.townNum].hiddenVars.has(`${action.varName}${varSuffix}`)) {
      progressDiv.classList.add('user-hidden');
    }
  }

  /** @param {AnyAction} action  */
  createTownAction(action) {
    let actionStats = '';
    let actionSkills = '';
    let skillDetails = '';
    let lockedStats = '';
    let lockedSkills = '';
    const pieSlices = [];
    const gradientStops = [];
    const statEntries = Object.entries(action.stats);
    // sort high to low, then by statname index
    statEntries.sort((
      [aStat, aRatio],
      [bStat, bRatio],
    ) => ((bRatio - aRatio) || (statList.indexOf(aStat) - statList.indexOf(bStat))));
    let totalRatio = 0;
    let gradientOffset = 0;
    let lastArcPoint = [0, -1]; // start at 12 o'clock
    for (const [stat, ratio] of statEntries) {
      const statLabel = globalThis.Localization.txt(`stats>${stat}>short_form`);
      actionStats += `<dt class='stat-${stat}'>${statLabel}</dt> <dd class='stat-${stat}'>${ratio * 100}%</dd>`;
      const startRatio = totalRatio;
      totalRatio += ratio;
      if (totalRatio >= 0.999 && totalRatio <= 1.001) totalRatio = 1;
      const midRatio = (startRatio + totalRatio) / 2;
      const angle = Math.PI * 2 * totalRatio;
      const arcPoint = [Math.sin(angle), -Math.cos(angle)];
      pieSlices.push(
        `<path class='pie-slice stat-${stat}' d='M0,0 L${lastArcPoint.join()} A1,1 0,${
          ratio >= 0.5 ? 1 : 0
        },1 ${arcPoint.join()} Z' />`,
      );
      if (gradientStops.length === 0) {
        gradientOffset = midRatio;
        gradientStops.push(
          `from ${gradientOffset}turn`,
          `var(--stat-${stat}-color) calc(${gradientOffset}turn * var(--pie-ratio))`,
        );
      } else {
        gradientStops.push(
          `var(--stat-${stat}-color) calc(${midRatio - gradientOffset}turn - (${
            ratio / 2
          }turn * var(--pie-ratio))) calc(${midRatio - gradientOffset}turn + (${ratio / 2}turn * var(--pie-ratio)))`,
        );
      }
      lastArcPoint = arcPoint;
    }
    // this is *almost* always true (but not always)
    if (statEntries.length > 0) {
      gradientStops.push(
        `var(--stat-${statEntries[0][0]}-color) calc(1turn - (${gradientOffset}turn * var(--pie-ratio)))`,
      );
      const highestRatio = statEntries[0][1];
      lockedStats = `(${
        statEntries.map((
          [stat, ratio],
        ) => /** @type {const} */ ([
          ratio === highestRatio,
          stat,
          globalThis.Localization.txt(`stats>${stat}>short_form`),
        ]))
          .map(([isHighestStat, stat, label]) =>
            `<span class='${isHighestStat ? 'bold' : ''} stat-${stat} stat-color'>${label}</span>`
          )
          .join(', ')
      })<br>`;
    }
    const statPie = statEntries.length === 0 ? '' : `
                <svg viewBox='-1 -1 2 2' class='stat-pie' id='stat-pie-${action.varName}'>
                    <g id='stat-pie-${action.varName}-g'>
                        ${pieSlices.join('')}
                    </g>
                </svg>
                <div class='stat-pie mask' style='background:conic-gradient(${gradientStops.join()})'></div>`;
    if (action.skills !== undefined) {
      const skillKeyNames = Object.keys(action.skills);
      const l = skillList.length;
      for (let i = 0; i < l; i++) {
        for (const skill of skillKeyNames) {
          if (skillList[i] === skill) {
            const xmlName = globalThis.actionList.getXMLName(skill);
            const skillLabel = `${globalThis.Localization.txt(`skills>${xmlName}>label`)} ${
              globalThis.Localization.txt('stats>tooltip>exp')
            }`;
            actionSkills +=
              `<div class='bold'>${skillLabel}:</div><span id='expGain${action.varName}${skill}'></span><br>`;
            if (action.teachesSkill(skill)) {
              const learnSkill = `<div class='bold'>${
                globalThis.Localization.txt('actions>tooltip>learn_skill')
              }:</div>`;
              lockedSkills += `${learnSkill} <span>${
                globalThis.Localization.txt(`skills>${xmlName}>label`)
              }</span><br>`;
              skillDetails += `<hr>
                                ${learnSkill} <div class='bold underline'>${
                globalThis.Localization.txt(`skills>${xmlName}>label`)
              }</div><br>
                                <i>${globalThis.Localization.txt(`skills>${xmlName}>desc`)}</i><br>`;
              if (globalThis.Localization.txtsObj(`skills>${xmlName}>desc2`)?.length > 0) {
                skillDetails += `${
                  globalThis.Localization.txt(`skills>${xmlName}>desc2`).replace(/<br>\s*Currently.*(?:<br>|$)/sgi, '')
                }<br>`; // ugh
              }
            }
          }
        }
      }
    }
    if (isBuffName(action.grantsBuff)) {
      const xmlName = globalThis.actionList.getXMLName(globalThis.stats.Buff.fullNames[action.grantsBuff]);
      const grantsBuff = `<div class='bold'>${globalThis.Localization.txt('actions>tooltip>grants_buff')}:</div>`;
      lockedSkills += `${grantsBuff} <span>${globalThis.Localization.txt(`buffs>${xmlName}>label`)}</span><br>`;
      skillDetails += `<hr>
                ${grantsBuff} <div class='bold underline'>${
        globalThis.Localization.txt(`buffs>${xmlName}>label`)
      }</div><br>
                <i>${globalThis.Localization.txt(`buffs>${xmlName}>desc`)}</i><br>`;
    }
    let extraImage = '';
    const extraImagePositions = [
      'margin-top:17px;margin-left:5px;',
      'margin-top:17px;margin-left:-55px;',
      'margin-top:0px;margin-left:-55px;',
      'margin-top:0px;margin-left:5px;',
    ];
    if (action.affectedBy) {
      for (let i = 0; i < action.affectedBy.length; i++) {
        extraImage += `<img src='icons/${
          globalThis.helpers.camelize(action.affectedBy[i])
        }.svg' class='smallIcon' draggable='false' style='position:absolute;${extraImagePositions[i]}'>`;
      }
    }
    const isTravel = globalThis.actionList.getTravelNum(action.name) != 0;
    const divClass = `${isTravel ? 'travelContainer' : 'actionContainer'} ${
      globalThis.actionList.isTraining(action.name) || globalThis.actionList.hasLimit(action.name)
        ? 'cappableActionContainer'
        : ''
    }`;
    const imageName = action.name.startsWith('Assassin') ? 'assassin' : globalThis.helpers.camelize(action.name);
    const unlockConditions = /<br>\s*Unlocked (.*?)(?:<br>|$)/is.exec(
      `${action.tooltip}${action.goldCost === undefined ? '' : action.tooltip2}`,
    )?.[1]; // I hate this but wygd
    const lockedText = unlockConditions
      ? `${globalThis.Localization.txt('actions>tooltip>locked_tooltip')}<br>Will unlock ${unlockConditions}`
      : `${action.tooltip}${action.goldCost === undefined ? '' : action.tooltip2}`;
    const totalDivText = `<button
                id='container${action.varName}'
                class='${divClass} actionOrTravelContainer ${action.type}ActionContainer showthat'
                draggable='true'
                ondragover='globalThis.driver.handleDragOver(event)'
                ondragstart='globalThis.driver.handleDirectActionDragStart(event, "${action.name}", ${action.townNum}, "${action.varName}", false)'
                ondragend='globalThis.driver.handleDirectActionDragEnd("${action.varName}")'
                onclick='globalThis.driver.addActionToList("${action.name}", ${action.townNum})'
                onmouseover='.updateAction("${action.varName}")'
                onmouseout='.updateAction(undefined)'
            >
                <label>${action.label}</label><br>
                <div style='position:relative'>
                    <img src='icons/${imageName}.svg' class='superLargeIcon' draggable='false'>${extraImage}
                </div>
                ${statPie}
                <div class='showthis when-unlocked' draggable='false'>
                    ${action.tooltip}<span id='goldCost${action.varName}'></span>
                    ${(action.goldCost === undefined) ? '' : action.tooltip2}
                    <br>
                    ${actionSkills}
                    <div class='bold'>${
      globalThis.Localization.txt('actions>tooltip>mana_cost')
    }:</div> <div id='manaCost${action.varName}'>${globalThis.helpers.formatNumber(action.manaCost())}</div><br>
                    <dl class='action-stats'>${actionStats}</dl>
                    <div class='bold'>${
      globalThis.Localization.txt('actions>tooltip>exp_multiplier')
    }:</div><div id='expMult${action.varName}'>${action.expMult * 100}</div>%<br>
                    ${skillDetails}
                </div>
                <div class='showthis when-locked' draggable='false'>
                    ${lockedText}
                    <br>
                    ${lockedSkills}
                    ${lockedStats}
                </div>
            </button>`;

    const actionsDiv = document.createElement('div');
    actionsDiv.innerHTML = totalDivText;
    actionOptionsTown[action.townNum].querySelector(`:scope > .${isTravel ? 'travelDiv' : 'actionDiv'}`).appendChild(
      actionsDiv,
    );

    if (action.storyReqs !== undefined) {
      let storyTooltipText = '';
      let lastInBranch = false;

      for (const { num: storyId, conditionHTML, text } of action.getStoryTexts()) {
        storyTooltipText += '<p>';
        if (action.storyReqs(storyId)) {
          storyTooltipText += conditionHTML + text;
          lastInBranch = false;
        } else if (lastInBranch) {
          storyTooltipText += '<b>???:</b> ???';
        } else {
          storyTooltipText += `${conditionHTML} ???`;
          lastInBranch = true;
        }
        storyTooltipText += '</p>';
      }

      const storyDivText =
        `<div id='storyContainer${action.varName}' tabindex='0' class='storyContainer showthatstory' draggable='false' onmouseover='globalThis.driver.hideNotification("storyContainer${action.varName}")'>${action.label}
                    <br>
                    <div style='position:relative'>
                        <img src='icons/${
          globalThis.helpers.camelize(action.name)
        }.svg' class='superLargeIcon' draggable='false'>
                        <div id='storyContainer${action.varName}Notification' class='notification storyNotification'></div>
                    </div>
                    <div class='showthisstory' draggable='false'>
                        ${storyTooltipText}
                    </div>
                </div>`;

      const storyDiv = document.createElement('div');
      storyDiv.innerHTML = storyDivText;
      actionStoriesTown[action.townNum].appendChild(storyDiv);
    }
  }

  updateAction(action) {
    if (action === undefined) return;
    let container = document.getElementById(`container${action}`);
    this.adjustTooltipPosition(container.querySelector('div.showthis'));
  }

  adjustManaCost(actionName) {
    const action = globalThis.actionList.translateClassNames(actionName);
    document.getElementById(`manaCost${action.varName}`).textContent = globalThis.helpers.formatNumber(
      action.manaCost(),
    );
  }

  adjustExpMult(actionName) {
    const action = globalThis.actionList.translateClassNames(actionName);
    document.getElementById(`expMult${action.varName}`).textContent = globalThis.helpers.formatNumber(
      action.expMult * 100,
    );
  }

  goldCosts = {};

  adjustGoldCost(updateInfo) {
    const varName = updateInfo.varName;
    const amount = updateInfo.cost;
    const element = document.getElementById(`goldCost${varName}`);
    if (this.goldCosts[varName] !== amount && element) {
      element.textContent = globalThis.helpers.formatNumber(amount);
      this.goldCosts[varName] = amount;
    }
  }
  adjustGoldCosts() {
    for (const action of globalThis.actionList.actionsWithGoldCost) {
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
    for (const action of totalActionList) {
      if (action.skills) this.adjustExpGain(action);
    }
  }

  /** @param {ActionOfType<"limited">} action  */
  createTownInfo(action) {
    const totalInfoText =
      // important that there be 8 element children of townInfoContainer (excluding the showthis popup and hideVarButton)
      `
            <div class='townInfoContainer showthat'>
                <div class='bold townLabel'>${action.labelDone}</div>
                <div class='numeric goodTemp' id='goodTemp${action.varName}'>0</div> <i class='fa fa-arrow-left'></i>
                <div class='numeric good' id='good${action.varName}'>0</div> <i class='fa fa-arrow-left'></i>
                <div class='numeric unchecked' id='unchecked${action.varName}'>0</div>
                <input type='checkbox' id='searchToggler${action.varName}' style='margin-left:10px;'>
                <label for='searchToggler${action.varName}'> Lootable first</label>
                <div class='showthis'>${action.infoText()}</div>
                <div class='hideVarButton far' onclick='.toggleHidden("${action.varName}")'></div>
            </div><br>`;

    const infoDiv = document.createElement('div');
    infoDiv.className = 'townContainer infoType';
    infoDiv.id = `infoContainer${action.varName}`;
    infoDiv.style.display = '';
    infoDiv.innerHTML = totalInfoText;
    townInfos[action.townNum].appendChild(infoDiv);
    if (towns[action.townNum].hiddenVars.has(action.varName)) {
      infoDiv.classList.add('user-hidden');
    }
  }

  /** @param {ActionOfType<"multipart">} action  */
  createMultiPartPBar(action) {
    let pbars = '';
    const width = `style='width:calc(${91 / action.segments}% - 4px)'`;
    const varName = action.varName;
    for (let i = 0; i < action.segments; i++) {
      pbars += `<div class='thickProgressBar showthat' ${width}>
                        <div id='expBar${i}${varName}' class='segmentBar'></div>
                        <div class='showthis' id='tooltip${i}${varName}'>
                            <div id='segmentName${i}${varName}'></div><br>
                            <div class='bold'>Main Stat</div> <div id='mainStat${i}${varName}'></div><br>
                            <div class='bold'>Progress</div> <div id='progress${i}${varName}'></div> / <div id='progressNeeded${i}${varName}'></div>
                        </div>
                    </div>`;
    }
    const completedTooltip = action.completedTooltip ? action.completedTooltip() : '';
    let mouseOver = '';
    if (varName === 'SDungeon') {
      mouseOver = "onmouseover='.showDungeon(0)' onmouseout='viewwDungeon(undefined)'";
    } else if (varName === 'LDungeon') {
      mouseOver = "onmouseover='view.showDungeon(1)' onmouseout='view.showDungeon(undefined)'";
    } else if (varName === 'TheSpire') {
      mouseOver = "onmouseover='view.showDungeon(2)' onmouseout='view.showDungeon(undefined)'";
    }
    const totalDivText = `
            <div class='townStatContainer' id='infoContainer${varName}'>
                <div class='multipartLabel'>
                    <div class='flexMargin'></div>
                    <div class='bold townLabel' id='multiPartName${varName}'></div>
                    <div class='completedInfo showthat' ${mouseOver}>
                        <div class='bold'>${action.labelDone}</div>
                        <div id='completed${varName}'></div>
                        ${
      completedTooltip === '' ? '' : `<div class='showthis' id='completedContainer${varName}'>
                            ${completedTooltip}
                        </div>`
    }
                    </div>
                    <div class='flexMargin'></div>
                </div>
                <div class='multipartBars'>
                    ${pbars}
                </div>
                <div class='hideVarButton far' onclick='view.toggleHidden("${action.varName}")'></div>
            </div>`;

    const progressDiv = document.createElement('div');
    progressDiv.className = 'townContainer multipartType';
    progressDiv.style.display = '';
    progressDiv.innerHTML = totalDivText;
    townInfos[action.townNum].appendChild(progressDiv);
    if (towns[action.townNum].hiddenVars.has(action.varName)) {
      progressDiv.firstElementChild.classList.add('user-hidden');
    }
  }

  updateMultiPartActions() {
    for (const action of totalActionList) {
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
      const roundedLoopCost = globalThis.helpers.intToStringRound(loopCost);
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
      document.getElementById(`progress${segment}${action.varName}`).textContent = globalThis.helpers.intToStringRound(
        curProgress,
      );
      document.getElementById(`progressNeeded${segment}${action.varName}`).textContent = globalThis.helpers
        .intToStringRound(loopCost);
    }

    // update later segments
    for (let i = segment + 1; i < action.segments; i++) {
      document.getElementById(`expBar${i}${action.varName}`).style.width = '100%';
      if (document.getElementById(`progress${i}${action.varName}`).textContent !== '0') {
        document.getElementById(`progress${i}${action.varName}`).textContent = '0';
      }
      document.getElementById(`progressNeeded${i}${action.varName}`).textContent = globalThis.helpers.intToStringRound(
        action.loopCost(i),
      );
    }
  }

  showDungeon(index) {
    dungeonShowing = index;
    if (index !== undefined) this.updateSoulstoneChance(index);
  }

  updateSoulstoneChance(index) {
    const dungeon = globalThis.saving.dungeons[index];
    for (let i = 0; i < dungeon.length; i++) {
      const level = dungeon[i];
      document.getElementById(`soulstoneChance${index}_${i}`).textContent = globalThis.helpers.intToString(
        level.ssChance * 100,
        4,
      );
      document.getElementById(`soulstonePrevious${index}_${i}`).textContent = level.lastStat;
      document.getElementById(`soulstoneCompleted${index}_${i}`).textContent = globalThis.helpers.formatNumber(
        level.completed,
      );
    }
  }

  updateTrials() {
    for (let i = 0; i < globalThis.saving.trials.length; i++) {
      this.updateTrialInfo({ trialNum: i, curFloor: 0 });
    }
  }

  updateTrialInfo(updateInfo) {
    const curFloor = updateInfo.curFloor;
    const trialNum = updateInfo.trialNum;
    const trial = trials[trialNum];
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

  updateSoulstones() {
    let total = 0;
    for (const stat of statList) {
      if (stats[stat].soulstone) {
        total += stats[stat].soulstone;
        globalThis.helpers.htmlElement(`stat${stat}SoulstoneLogBar`).parentElement.style.display = '';
        this.updateLevelLogBar('statsContainer', `stat${stat}SoulstoneLogBar`, stats[stat].soulstone);
        document.getElementById(`ss${stat}Container`).style.display = '';
        document.getElementById(`ss${stat}`).textContent = globalThis.helpers.formatNumber(stats[stat].soulstone);
        document.getElementById(`stat${stat}SSBonus`).textContent = globalThis.helpers.intToString(
          stats[stat].soulstone ? stats[stat].soulstoneMult : 0,
        );
        document.getElementById(`stat${stat}ss`).textContent = globalThis.helpers.intToString(stats[stat].soulstone, 1);
      } else {
        globalThis.helpers.htmlElement(`stat${stat}SoulstoneLogBar`).parentElement.style.display = 'none';
        document.getElementById(`ss${stat}Container`).style.display = 'none';
        document.getElementById(`stat${stat}ss`).textContent = '';
      }
    }
    if (total > 0) {
      document.getElementById(`stattotalss`).style.display = '';
      document.getElementById(`stattotalss`).textContent = globalThis.helpers.intToString(total, 1);
      document.getElementById(`sstotalContainer`).style.display = '';
      document.getElementById(`sstotal`).textContent = globalThis.helpers.formatNumber(total);
    } else {
      document.getElementById(`stattotalss`).style.display = 'none';
      document.getElementById(`stattotalss`).textContent = '';
      document.getElementById(`sstotalContainer`).style.display = 'none';
    }
  }

  updateMultiPart(action) {
    const town = towns[action.townNum];
    document.getElementById(`multiPartName${action.varName}`).textContent = action.getPartName();
    document.getElementById(`completed${action.varName}`).textContent = ` ${
      globalThis.helpers.formatNumber(town[`total${action.varName}`])
    }`;
    for (let i = 0; i < action.segments; i++) {
      const expBar = document.getElementById(`expBar${i}${action.varName}`);
      if (!expBar) {
        continue;
      }
      const mainStat = action.loopStats[(town[`${action.varName}LoopCounter`] + i) % action.loopStats.length];
      document.getElementById(`mainStat${i}${action.varName}`).textContent = globalThis.Localization.txt(
        `stats>${mainStat}>short_form`,
      );
      addStatColors(expBar, mainStat, true);
      document.getElementById(`segmentName${i}${action.varName}`).textContent = action.getSegmentName(
        town[`${action.varName}LoopCounter`] + i,
      );
    }
  }

  updateTrainingLimits() {
    for (let i = 0; i < statList.length; i++) {
      const trainingDiv = document.getElementById(`trainingLimit${statList[i]}`);
      if (trainingDiv) {
        trainingDiv.textContent = String(trainingLimits);
      }
    }
    if (globalThis.stats.getBuffLevel('Imbuement') > 0 || globalThis.stats.getBuffLevel('Imbuement3') > 0) {
      document.getElementById('maxTraining').style.display = '';
    }
  }

  // when you mouseover Story
  updateStory(num) {
    document.getElementById('newStory').style.display = 'none';
    if (num <= 0) {
      num = 0;
      document.getElementById('storyLeft').style.visibility = 'hidden';
    } else {
      document.getElementById('storyLeft').style.visibility = '';
    }

    if (num >= storyMax) {
      num = storyMax;
      document.getElementById('storyRight').style.visibility = 'hidden';
    } else {
      document.getElementById('storyRight').style.visibility = '';
    }
    //Hard coded story count - need to fix this
    for (let i = 0; i <= 12; i++) {
      const storyDiv = document.getElementById(`story${i}`);
      if (storyDiv) {
        storyDiv.style.display = 'none';
      }
    }
    storyShowing = num;
    document.getElementById('storyPage').textContent = String(storyShowing + 1);
    document.getElementById(`story${num}`).style.display = 'inline-block';
  }

  changeStatView() {
    const statsWindow = document.getElementById('statsWindow');
    if (globalThis.helpers.inputElement('regularStats').checked) {
      statsWindow.dataset.view = 'regular';
    } else {
      statsWindow.dataset.view = 'radar';
      this.statGraph.update();
    }
  }

  changeTheme(init) {
    const themeInput = globalThis.helpers.selectElement('themeInput');
    const themeVariantInput = globalThis.helpers.selectElement('themeVariantInput');
    if (init) themeInput.value = options.theme;
    if (init) themeVariantInput.value = options.themeVariant;
    options.theme = themeInput.value;
    options.themeVariant = themeVariantInput.value;
    const variants = $(themeVariantInput).find(`.variant-${options.theme.replaceAll(' ', '_')}`);
    if (variants.length) {
      document.getElementById('themeVariantSection').style.display = '';
      $(themeVariantInput).find('option').css('display', 'none');
      variants.css('display', '');
    } else {
      document.getElementById('themeVariantSection').style.display = 'none';
    }
    document.getElementById('theBody').className = `t-${options.theme} ${options.themeVariant}`;
    localStorage['latestTheme'] = `${options.theme} ${options.themeVariant}`;
  }

  createTravelMenu() {
    let travelMenu = $('#TownSelect');
    travelMenu.empty();
    globalThis.actionList.townNames.forEach((town, index) => {
      travelMenu.append(`"<option value=${index} class='zone-${index + 1}' hidden=''>${town}</option>`);
    });
    travelMenu.change(function () {
      view.showTown(Number($(this).val()));
    });
    this.updateTravelMenu();
  }

  updateTravelMenu() {
    let travelOptions = $('#TownSelect').children();
    for (let i = 0; i < travelOptions.length; i++) {
      travelOptions[i].hidden = !townsUnlocked.includes(i);
    }
  }

  adjustDarkRitualText() {
    let DRdesc = document.getElementById('DRText');
    DRdesc.innerHTML = `Actions are:<br>`;
    townsUnlocked.forEach((townNum) => {
      DRdesc.innerHTML += DarkRitualDescription[townNum];
    });
    if (globalThis.stats.getBuffLevel('Ritual') > 200) DRdesc.innerHTML += DarkRitualDescription[9];
  }

  highlightIncompleteActions() {
    let actionDivs = Array.from(document.getElementsByClassName('actionContainer'));
    actionDivs.forEach((div) => {
      let actionName = div.id.replace('container', '');
      if (!completedActions.includes(actionName)) {
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

  updateTotals() {
    document.getElementById('totalPlaytime').textContent = `${formatTime(totals.time)}`;
    document.getElementById('totalEffectiveTime').textContent = `${formatTime(totals.effectiveTime)}`;
    document.getElementById('borrowedTimeBalance').textContent = formatTime(totals.borrowedTime);
    document.getElementById('borrowedTimeDays').textContent = `${
      globalThis.helpers.formatNumber(Math.floor(totals.borrowedTime / 86400))
    }${globalThis.Localization.txt('time_controls>days')}`;
    document.getElementById('totalLoops').textContent = `${globalThis.helpers.formatNumber(totals.loops)}`;
    document.getElementById('totalActions').textContent = `${globalThis.helpers.formatNumber(totals.actions)}`;
    if (totals.borrowedTime > 0) document.documentElement.classList.add('time-borrowed');
    else document.documentElement.classList.remove('time-borrowed');
  }

  updatePrestigeValues() {
    document.getElementById('currentPrestigePoints').textContent = `${
      globalThis.helpers.formatNumber(globalThis.prestige.prestigeValues['prestigeCurrentPoints'])
    }`;
    document.getElementById('currentPrestigesCompleted').textContent = `${
      globalThis.helpers.formatNumber(globalThis.prestige.prestigeValues['prestigeTotalCompletions'])
    }`;
    document.getElementById('maxTotalImbueSoulLevels').textContent = `${
      globalThis.helpers.formatNumber(Math.min(globalThis.prestige.prestigeValues['prestigeTotalCompletions'], 7))
    }`;

    document.getElementById('totalPrestigePoints').textContent = `${
      globalThis.helpers.formatNumber(globalThis.prestige.prestigeValues['prestigeTotalPoints'])
    }`;

    document.getElementById('prestigePhysicalCurrentBonus').textContent = `${
      globalThis.helpers.formatNumber(globalThis.prestige.getPrestigeCurrentBonus('PrestigePhysical'))
    }`;
    document.getElementById('prestigeMentalCurrentBonus').textContent = `${
      globalThis.helpers.formatNumber(globalThis.prestige.getPrestigeCurrentBonus('PrestigeMental'))
    }`;
    document.getElementById('prestigeCombatCurrentBonus').textContent = `${
      globalThis.helpers.formatNumber(globalThis.prestige.getPrestigeCurrentBonus('PrestigeCombat'))
    }`;
    document.getElementById('prestigeSpatiomancyCurrentBonus').textContent = `${
      globalThis.helpers.formatNumber(globalThis.prestige.getPrestigeCurrentBonus('PrestigeSpatiomancy'))
    }`;
    document.getElementById('prestigeChronomancyCurrentBonus').textContent = `${
      globalThis.helpers.formatNumber(globalThis.prestige.getPrestigeCurrentBonus('PrestigeChronomancy'))
    }`;
    document.getElementById('prestigeBarteringCurrentBonus').textContent = `${
      globalThis.helpers.formatNumber(globalThis.prestige.getPrestigeCurrentBonus('PrestigeBartering'))
    }`;
    document.getElementById('prestigeExpOverflowCurrentBonus').textContent = `${
      globalThis.helpers.formatNumber(globalThis.prestige.getPrestigeCurrentBonus('PrestigeExpOverflow') * 10)
    }`;

    document.getElementById('prestigePhysicalNextCost').textContent = `${
      globalThis.helpers.formatNumber(globalThis.prestige.getPrestigeCost('PrestigePhysical'))
    }`;
    document.getElementById('prestigeMentalNextCost').textContent = `${
      globalThis.helpers.formatNumber(globalThis.prestige.getPrestigeCost('PrestigeMental'))
    }`;
    document.getElementById('prestigeCombatNextCost').textContent = `${
      globalThis.helpers.formatNumber(globalThis.prestige.getPrestigeCost('PrestigeCombat'))
    }`;
    document.getElementById('prestigeSpatiomancyNextCost').textContent = `${
      globalThis.helpers.formatNumber(globalThis.prestige.getPrestigeCost('PrestigeSpatiomancy'))
    }`;
    document.getElementById('prestigeChronomancyNextCost').textContent = `${
      globalThis.helpers.formatNumber(globalThis.prestige.getPrestigeCost('PrestigeChronomancy'))
    }`;
    document.getElementById('prestigeBarteringNextCost').textContent = `${
      globalThis.helpers.formatNumber(globalThis.prestige.getPrestigeCost('PrestigeBartering'))
    }`;
    document.getElementById('prestigeExpOverflowNextCost').textContent = `${
      globalThis.helpers.formatNumber(globalThis.prestige.getPrestigeCost('PrestigeExpOverflow'))
    }`;
  }
}

function unlockGlobalStory(num) {
  if (num > storyMax) {
    document.getElementById('newStory').style.display = 'inline-block';
    storyMax = num;
    view.requestUpdate('updateGlobalStory', num);
  }
}

/** @param {StoryFlagName} name  */
function setStoryFlag(name) {
  if (!storyFlags[name]) {
    storyFlags[name] = true;
    if (options.actionLog) view.requestUpdate('updateStories', false);
  }
}
const unlockStory = setStoryFlag; // compatibility alias

/** @param {StoryVarName} name @param {number} value */
function increaseStoryVarTo(name, value) {
  if (storyVars[name] < value) {
    storyVars[name] = value;
    if (options.actionLog) view.requestUpdate('updateStories', false);
  }
}

function scrollToPanel(event, target) {
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

const curActionsDiv = document.getElementById('curActionsList');
const nextActionsDiv = document.getElementById('nextActionsList');

const actionOptionsTown = [];
for (let i = 0; i <= 8; i++) {
  const element = document.getElementById(`actionOptionsTown${i}`);
  if (!element) continue;

  const actionDiv = document.createElement('div');
  actionDiv.classList.add('actionDiv');
  element.append(actionDiv);

  const travelDiv = document.createElement('div');
  travelDiv.classList.add('travelDiv');
  element.append(travelDiv);

  actionOptionsTown[i] = element;
}

const actionStoriesTown = [];
for (let i = 0; i <= 8; i++) {
  actionStoriesTown[i] = document.getElementById(`actionStoriesTown${i}`);
}

const townInfos = [];
for (let i = 0; i <= 8; i++) {
  townInfos[i] = document.getElementById(`townInfo${i}`);
}

/** @param {Element} theDiv @param {StatName} stat  */
function addStatColors(theDiv, stat, forceColors = false) {
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

function dragOverDecorate(i) {
  if (document.getElementById(`nextActionContainer${i}`)) {
    document.getElementById(`nextActionContainer${i}`).classList.add('draggedOverAction');
  }
}

function dragExitUndecorate(i) {
  if (document.getElementById(`nextActionContainer${i}`)) {
    document.getElementById(`nextActionContainer${i}`).classList.remove('draggedOverAction');
  }
}

function draggedDecorate(i) {
  if (document.getElementById(`nextActionContainer${i}`)) {
    document.getElementById(`nextActionContainer${i}`).classList.add('draggedAction');
  }
}

function draggedUndecorate(i) {
  if (document.getElementById(`nextActionContainer${i}`)) {
    document.getElementById(`nextActionContainer${i}`).classList.remove('draggedAction');
  }
  globalThis.driver.showActionIcons();
}

function adjustActionListSize(amt) {
  let height = document.documentElement.style.getPropertyValue('--action-list-height');
  if (height === '' && amt > 0) {
    height = `${500 + amt}px`;
  } else if (height === '' && amt === -100) {
    height = '500px';
  } else {
    height = `${Math.min(Math.max(parseInt(height) + amt, 500), 2000)}px`;
  }
  document.documentElement.style.setProperty('--action-list-height', height);
  setScreenSize();
  globalThis.saving.saveUISettings();
}

function updateBuffCaps() {
  for (const buff of buffList) {
    globalThis.helpers.inputElement(`buff${buff}Cap`).value = String(
      Math.min(parseInt(globalThis.helpers.inputElement(`buff${buff}Cap`).value), buffHardCaps[buff]),
    );
    buffCaps[buff] = parseInt(globalThis.helpers.inputElement(`buff${buff}Cap`).value);
  }
}

function setScreenSize() {
  _view.screenSize = document.body.scrollHeight;
}

const _view = {
  screenSize: undefined,
  DarkRitualDescription,
  formatTime,
  setScreenSize,
  updateBuffCaps,
  adjustActionListSize,
  unlockGlobalStory,
  setStoryFlag,
  unlockStory,
  increaseStoryVarTo,
  scrollToPanel,
  addStatColors,
  dragOverDecorate,
  dragExitUndecorate,
  draggedDecorate,
  draggedUndecorate,
  townInfos,
  actionOptionsTown,
  actionStoriesTown,
  View,
};

globalThis.view = _view;
