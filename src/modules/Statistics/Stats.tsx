import { createMemo } from 'solid-js';
import { Tooltip } from '../../components/containers/Overlay/primitives/Tooltip.tsx';
import { et } from '../../locales/translations.utils.ts';
import { statList } from '../../original/globals.ts';
import { view } from '../../views/main.view.ts';

const t = et('stats');

const statToName = {
  Cha: 'charisma',
  Int: 'intelligence',
  Dex: 'dexterity',
  Str: 'strength',
  Con: 'constitution',
  Spd: 'speed',
  Per: 'perception',
  Luck: 'luck',
  Soul: 'soul',
} as const;

export const Stats = () => {
  const templates = createMemo(() => {
    const templates = [];

    for (const stat of statList) {
      const name = statToName[stat];

      const template = (
        <div id={`stat${stat}`} class={`statContainer showthat stat-${stat}`}>
          <div class='statLabelContainer'>
            <div class='medium bold stat-name long-form' style='margin-left:18px;margin-top:5px;'>
              {t(`attributes.${name}.name`)}
            </div>
            <div class='medium bold stat-name short-form' style='margin-left:18px;margin-top:5px;'>
              {t(`attributes.${name}.abbreviation`)}
            </div>
            <div
              class='medium statNum stat-soulstone'
              style='color:var(--stat-soulstone-color);'
              id={`stat${stat}ss`}
            />
            <div class='statNum stat-talent' />
            <div class='medium statNum stat-talent statBarWrapper'>
              <div class='thinProgressBarLower tiny talentBar'>
                <div class='statBar statTalentBar' id={`stat${stat}TalentBar`} />
              </div>
              <div class='label' id={`stat${stat}Talent`}>
                0
              </div>
            </div>
            <div class='medium statNum stat-level statBarWrapper'>
              <div class='thinProgressBarLower tiny expBar'>
                <div class='statBar statLevelBar' id={`stat${stat}LevelBar`} />
              </div>
              <div class='label bold' id={`stat${stat}Level`}>
                0
              </div>
            </div>
          </div>
          <div class='statBars'>
            <div class='thinProgressBarUpper expBar'>
              <div class='statBar statLevelLogBar logBar' id={`stat${stat}LevelLogBar`}></div>
            </div>
            <div class='thinProgressBarLower talentBar'>
              <div class='statBar statTalentLogBar logBar' id={`stat${stat}TalentLogBar`}></div>
            </div>
            <div class='thinProgressBarLower soulstoneBar'>
              <div class='statBar statSoulstoneLogBar logBar' id={`stat${stat}SoulstoneLogBar`}></div>
            </div>
          </div>
          <div class='showthis' id={`stat${stat}Tooltip`} style='width:225px;'>
            <div class='medium bold'>{t(`attributes.${name}.name`)}</div>
            <br />
            {t(`attributes.${name}.description`)}
            <br />
            <div class='medium bold'>{t('tooltips.level')}:</div>
            <div id={`stat${stat}Level2`} />
            <br />
            <div class='medium bold'>{t('tooltips.levelExperience')}:</div>

            <div id={`stat${stat}LevelExp`}></div>/<div id={`stat${stat}LevelExpNeeded`}></div>
            <div class='statTooltipPerc'>
              (<div id={`stat${stat}LevelProgress`}></div>%)
            </div>
            <br />
            <div class='medium bold'>{t('tooltips.talent')}:</div>
            <div id={`stat${stat}Talent2`} />
            <br />
            <div class='medium bold'>{t('tooltips.talentExperience')}:</div>

            <div id={`stat${stat}TalentExp`}></div>/<div id={`stat${stat}TalentExpNeeded`}></div>
            <div class='statTooltipPerc'>
              (<div id={`stat${stat}TalentProgress`}></div>%)
            </div>
            <br />
            <div class='medium bold'>{t('tooltips.talentMultiplier')}:</div>
            x<div id={`stat${stat}TalentMult`} />
            <br />
            <div id={`ss${stat}Container`} class='ssContainer'>
              <div class='bold'>{t('tooltips.soulstone')}:</div>
              <div id={`ss${stat}`} />
              <br />
              <div class='medium bold'>{t('tooltips.soulstoneMultiplier')}:</div>
              x<div id={`stat${stat}SSBonus`} />
            </div>
            <br />
            <div class='medium bold'>{t('tooltips.totalMultiplier')}:</div>
            x<div id={`stat${stat}TotalMult`} />
          </div>
        </div>
      );

      templates.push(template);
    }

    return templates;
  });

  return (
    <div id='statsWindow' data-view='regular'>
      <Tooltip>
        <Tooltip.Trigger>
          <div class='font-bold'>Stats</div>
        </Tooltip.Trigger>
        <Tooltip.Content>
          Each stat level reduces the relevant part of an action's mana cost by a percentage. Talent exp gain is equal
          to 1% of stat exp gain, and persists through loops. Talent multiplies xp gain by (1+(talentLevel)^0.4/3). XP
          gain towards a stat per action is (original mana / actual mana) * (talent bonus) per tick. Total Mult is the
          product of your talent and soulstone bonuses. e.g. Meet People costs 800 mana and has a breakdown of{' '}
          <div class='bold'>Int</div> 10% <div class='bold'>Cha</div> 80% <div class='bold'>Soul</div>{' '}
          10%. This effectively means 80 of the mana is controlled by <div class='bold'>Int</div>, another 80 by{' '}
          <div class='bold'>Soul</div>, and the remaining 640 by <div class='bold'>Cha</div>. If your{' '}
          <div class='bold'>Cha</div>{' '}
          is level 20 when the action is started, the bonus would be x1.2 so it'd be 640 / 1.2 = 533.33 Adding back the
          160 from <div class='bold'>Soul</div> and{' '}
          <div class='bold'>Int</div>, the total mana the action takes (rounded up) is now 694, so ~87% of the original
          mana cost. The action would give (800/694)*(1+(talent)^0.4/3) level exp per mana for the 694 mana.
        </Tooltip.Content>
      </Tooltip>
      <div id='statsContainer'>
        {templates()}
        <div class='statContainer stat-total showthat' id='totalStatContainer'>
          <div class='statLabelContainer'>
            <div
              class='medium bold stat-name localized'
              style='margin-left: 18px; margin-top: 5px'
              data-locale='stats>total>singular'
            >
            </div>
            <div class='medium statNum stat-soulstone' style='color: var(--stat-soulstone-color)' id='stattotalss'>
            </div>
            <div class='medium statNum stat-talent' id='stattotalTalent'>0</div>
            <div class='medium statNum stat-level' id='stattotalLevel'>0</div>
          </div>
          <div class='showthis' id='stattotalTooltip' style='width: 225px'>
            <div class='medium bold localized' data-locale='stats>total>plural'></div>
            <br></br>
            <div class='localized' data-locale='stats>total>blurb'></div>
            <br></br>
            <div class='medium bold localized colon-after' data-locale='stats>tooltip>level'></div>
            <div id='stattotalLevel2'></div>
            <br></br>
            <div class='medium bold localized colon-after' data-locale='stats>tooltip>talent'></div>
            <div id='stattotalTalent2'></div>
            <br></br>
            <div id='sstotalContainer' class='ssContainer'>
              <div class='bold localized colon-after' data-locale='stats>tooltip>soulstone'></div>
              <div id='sstotal'></div>
            </div>
          </div>
        </div>
      </div>
      <div id='skillList' style='width: 100%; display: none'>
        <div class='showthat'>
          <div class='large bold localized' data-locale='skills>title'></div>
          <div class='showthis localized' data-locale='skills>tooltip>no_reset_on_restart'></div>
        </div>
        <br></br>
        <div class='skillContainer showthat' id='skillSCombatContainer'>
          <div class='skillLabel medium bold localized' data-locale='skills>scombat>label'></div>
          <div class='statNum medium'>
            <div id='skillSCombatLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='showthis'>
            <span class='localized' data-locale='skills>scombat>desc'></span>
            <br></br>
          </div>
        </div>
        <div class='skillContainer showthat' id='skillTCombatContainer'>
          <div class='skillLabel medium bold localized' data-locale='skills>tcombat>label'></div>
          <div class='statNum medium'>
            <div id='skillTCombatLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='showthis'>
            <span class='localized' data-locale='skills>tcombat>desc'></span>
            <br></br>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillCombatContainer'
          onMouseOver={() => view.showSkill('Combat')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>combat>label'></div>
          <div class='statNum medium'>
            <div id='skillCombatLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillCombatLevelBar'></div>
          </div>
          <div class='showthis'>
            <span class='localized' data-locale='skills>combat>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillCombatLevelExp'></div>/<div id='skillCombatLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillCombatLevelProgress'></div>%)
            </div>
            <br></br>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillMagicContainer'
          onMouseOver={() => view.showSkill('Magic')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>magic>label'></div>
          <div class='statNum medium'>
            <div id='skillMagicLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillMagicLevelBar'></div>
          </div>
          <div class='showthis'>
            <span class='localized' data-locale='skills>magic>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillMagicLevelExp'></div>/<div id='skillMagicLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillMagicLevelProgress'></div>%)
            </div>
            <br></br>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillPracticalContainer'
          onMouseOver={() => view.showSkill('Practical')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>practical>label'></div>
          <div class='statNum medium'>
            <div id='skillPracticalLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillPracticalLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>practical>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillPracticalLevelExp'></div>/<div id='skillPracticalLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillPracticalLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>practical>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillAlchemyContainer'
          onMouseOver={() => view.showSkill('Alchemy')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>alchemy>label'>Alchemy</div>
          <div class='statNum medium'>
            <div id='skillAlchemyLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillAlchemyLevelBar'></div>
          </div>
          <div class='showthis'>
            <span class='localized' data-locale='skills>alchemy>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillAlchemyLevelExp'></div>/<div id='skillAlchemyLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillAlchemyLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>alchemy>desc2'></span>
            <br></br>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillDarkContainer'
          onMouseOver={() => view.showSkill('Dark')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>dark>label'></div>
          <div class='statNum medium'>
            <div id='skillDarkLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillDarkLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>dark>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillDarkLevelExp'></div>/<div id='skillDarkLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillDarkLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>dark>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillCraftingContainer'
          onMouseOver={() => view.showSkill('Crafting')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>crafting>label'></div>
          <div class='statNum medium'>
            <div id='skillCraftingLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillCraftingLevelBar'></div>
          </div>
          <div class='showthis'>
            <span class='localized' data-locale='skills>crafting>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillCraftingLevelExp'></div>/<div id='skillCraftingLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillCraftingLevelProgress'></div>%)
            </div>
            <br></br>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillChronomancyContainer'
          onMouseOver={() => view.showSkill('Chronomancy')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>chronomancy>label'></div>
          <div class='statNum medium'>
            <div id='skillChronomancyLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillChronomancyLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>chronomancy>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillChronomancyLevelExp'></div>/<div id='skillChronomancyLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillChronomancyLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>chronomancy>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillPyromancyContainer'
          onMouseOver={() => view.showSkill('Pyromancy')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>pyromancy>label'></div>
          <div class='statNum medium'>
            <div id='skillPyromancyLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillPyromancyLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>pyromancy>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillPyromancyLevelExp'></div>/<div id='skillPyromancyLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillPyromancyLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>pyromancy>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillRestorationContainer'
          onMouseOver={() => view.showSkill('Restoration')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>restoration>label'></div>
          <div class='statNum medium'>
            <div id='skillRestorationLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillRestorationLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>restoration>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillRestorationLevelExp'></div>/<div id='skillRestorationLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillRestorationLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>restoration>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillSpatiomancyContainer'
          onMouseOver={() => view.showSkill('Spatiomancy')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>spatiomancy>label'></div>
          <div class='statNum medium'>
            <div id='skillSpatiomancyLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillSpatiomancyLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>spatiomancy>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillSpatiomancyLevelExp'></div>/<div id='skillSpatiomancyLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillSpatiomancyLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>spatiomancy>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillMercantilismContainer'
          onMouseOver={() => view.showSkill('Mercantilism')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>mercantilism>label'></div>
          <div class='statNum medium'>
            <div id='skillMercantilismLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillMercantilismLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>mercantilism>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillMercantilismLevelExp'></div>/<div id='skillMercantilismLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillMercantilismLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>mercantilism>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillDivineContainer'
          onMouseOver={() => view.showSkill('Divine')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>divine>label'></div>
          <div class='statNum medium'>
            <div id='skillDivineLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillDivineLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>divine>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillDivineLevelExp'></div>/<div id='skillDivineLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillDivineLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>divine>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillCommuneContainer'
          onMouseOver={() => view.showSkill('Commune')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>commune>label'></div>
          <div class='statNum medium'>
            <div id='skillCommuneLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillCommuneLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>commune>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillCommuneLevelExp'></div>/<div id='skillCommuneLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillCommuneLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>commune>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillGluttonyContainer'
          onMouseOver={() => view.showSkill('Gluttony')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>gluttony>label'></div>
          <div class='statNum medium'>
            <div id='skillGluttonyLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillGluttonyLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>gluttony>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillGluttonyLevelExp'></div>/<div id='skillGluttonyLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillGluttonyLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>gluttony>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillWunderkindContainer'
          onMouseOver={() => view.showSkill('Wunderkind')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>wunderkind>label'></div>
          <div class='statNum medium'>
            <div id='skillWunderkindLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillWunderkindLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>wunderkind>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillWunderkindLevelExp'></div>/<div id='skillWunderkindLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillWunderkindLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>wunderkind>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillThieveryContainer'
          onMouseOver={() => view.showSkill('Thievery')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>thievery>label'></div>
          <div class='statNum medium'>
            <div id='skillThieveryLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillThieveryLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>thievery>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillThieveryLevelExp'></div>/<div id='skillThieveryLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillThieveryLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>thievery>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillLeadershipContainer'
          onMouseOver={() => view.showSkill('Leadership')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>leadership>label'></div>
          <div class='statNum medium'>
            <div id='skillLeadershipLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillLeadershipLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>leadership>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillLeadershipLevelExp'></div>/<div id='skillLeadershipLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillLeadershipLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>leadership>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillAssassinContainer'
          onMouseOver={() => view.showSkill('Assassin')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>assassin>label'></div>
          <div class='statNum medium'>
            <div id='skillAssassinLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillAssassinLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>assassin>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillAssassinLevelExp'></div>/<div id='skillAssassinLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillAssassinLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>assassin>desc2'></span>
          </div>
        </div>
      </div>
      <div id='buffList' style='width: 100%; margin-top: 25px; flex-direction: column; display: none'>
        <div class='showthat'>
          <div class='large bold localized' data-locale='buffs>title'></div>
          <div class='showthis localized' data-locale='buffs>tooltip>no_reset_on_restart'></div>
        </div>
        <br></br>
        <div id='buffsContainer' style='display:flex;flex-direction:column'>
          <div class='buffContainer showthat' id='buffRitualContainer' style='display: none;'>
            <img class='buffIcon' src='icons/darkRitual.svg'></img>
            <div class='skillLabel medium bold'>Dark Ritual</div>
            <div class='showthis'>
              <span>
                The witch appreciates your dedication to the dark arts. +1% to Dark Magic exp gain from the Dark Magic
                action (rounded down) per ritual.
              </span>
              <br></br>
              <span class='localized' data-locale='buffs>dark_ritual>desc2'>
                <div id='DRText'>
                  Actions are:<br></br>10% faster in Beginnersville per ritual from 1-20<br></br>
                </div>
              </span>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffRitualLevel'>0/</div>
            <input type='number' id='buffRitualCap' class='buffmaxinput' value='666'></input>
          </div>
          <div class='buffContainer showthat' id='buffImbuementContainer' style='display: none;'>
            <img class='buffIcon' src='icons/imbueMind.svg'></img>
            <div class='skillLabel medium bold'>Imbue Mind</div>
            <div class='showthis'>
              <span>
                Using power from soulstones, you can increase your mental prowess.<br></br>
                Increases the max amount of times you can do each stat training action by 1 per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffImbuementLevel'>0/</div>
            <input type='number' id='buffImbuementCap' class='buffmaxinput' value='500'></input>
          </div>
          <div class='buffContainer showthat' id='buffImbuement2Container' style='display: none;'>
            <img class='buffIcon' src='icons/imbueBody.svg'></img>
            <div class='skillLabel medium bold'>Imbue Body</div>
            <div class='showthis'>
              <span>
                By sacrificing your accumulated talent, you can permanently improve yourself.<br></br>
                At the start of a new loop, all stats begin at Imbue Body level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffImbuement2Level'>0/</div>
            <input type='number' id='buffImbuement2Cap' class='buffmaxinput' value='500'></input>
          </div>
          <div class='buffContainer showthat' id='buffFeastContainer' style='display: none;'>
            <img class='buffIcon' src='icons/greatFeast.svg'></img>
            <div class='skillLabel medium bold'>Great Feast</div>
            <div class='showthis'>
              <span>
                That feast was so filling that it manages to keep you well satiated through your loops! That's some
                impressive magic.<br></br>
                Combat (from all sources) is increased by 5% per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffFeastLevel'>0/</div>
            <input type='number' id='buffFeastCap' class='buffmaxinput' value='100'></input>
          </div>
          <div class='buffContainer showthat' id='buffAspirantContainer' style='display: none;'>
            <img class='buffIcon' src='icons/aspirant.svg'></img>
            <div class='skillLabel medium bold'>Aspirant</div>
            <div class='showthis'>
              <span>
                Reaching new heights in the spire fills your mind and soul with vigor and clarity.<br></br>
                Talent Exp gain is increased by 1% per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffAspirantLevel'>0/</div>
            <input type='number' id='buffAspirantCap' class='buffmaxinput' value='20'></input>
          </div>
          <div class='buffContainer showthat' id='buffHeroismContainer' style='display: none;'>
            <img class='buffIcon' src='icons/heroism.svg'></img>
            <div class='skillLabel medium bold'>Heroism</div>
            <div class='showthis'>
              <span>
                Completing the Trial fills you with determination.<br></br>
                Combat, Pyromancy, and Restoration Skill Exp gain increased by 2% per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffHeroismLevel'>0/</div>
            <input type='number' id='buffHeroismCap' class='buffmaxinput' value='50'></input>
          </div>
          <div class='buffContainer showthat' id='buffImbuement3Container' style='display: none;'>
            <img class='buffIcon' src='icons/imbueSoul.svg'></img>
            <div class='skillLabel medium bold'>Imbue Soul</div>
            <div class='showthis'>
              <span>
                (Incomplete) Sacrifice everything for the ultimate power.<br></br>
                Increases the exp multiplier of training actions by 100% and raises all action speeds by 50% per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffImbuement3Level'>0/</div>
            <input type='number' id='buffImbuement3Cap' class='buffmaxinput' value='7'></input>
          </div>
          <div class='buffContainer showthat' id='buffPrestigePhysicalContainer' style='display: none;'>
            <img class='buffIcon' src='icons/prestige-Physical.svg'></img>
            <div class='skillLabel medium bold'>Prestige - Physical</div>
            <div class='showthis'>
              <span>
                Increases Experience gain of all Physical stats (Dex, Str, Con, Spd, Per) by 20% per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffPrestigePhysicalLevel'>0/</div>
            <input type='number' id='buffPrestigePhysicalCap' class='buffmaxinput' value='100'></input>
          </div>
          <div class='buffContainer showthat' id='buffPrestigeMentalContainer' style='display: none;'>
            <img class='buffIcon' src='icons/prestige-Mental.svg'></img>
            <div class='skillLabel medium bold'>Prestige - Mental</div>
            <div class='showthis'>
              <span>
                Increases Experience gain of all Mental stats (Cha, Int, Soul, Luck) by 20% per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffPrestigeMentalLevel'>0/</div>
            <input type='number' id='buffPrestigeMentalCap' class='buffmaxinput' value='100'></input>
          </div>
          <div class='buffContainer showthat' id='buffPrestigeCombatContainer' style='display: none;'>
            <img class='buffIcon' src='icons/prestige-Combat.svg'></img>
            <div class='skillLabel medium bold'>Prestige - Combat</div>
            <div class='showthis'>
              <span>
                Increases Self and Team Combat by 20% per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffPrestigeCombatLevel'>0/</div>
            <input type='number' id='buffPrestigeCombatCap' class='buffmaxinput' value='100'></input>
          </div>
          <div class='buffContainer showthat' id='buffPrestigeSpatiomancyContainer' style='display: none;'>
            <img class='buffIcon' src='icons/prestige-Spatiomancy.svg'></img>
            <div class='skillLabel medium bold'>Prestige - Spatiomancy</div>
            <div class='showthis'>
              <span>
                Increases the number of "Findables" per zone by 10% per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffPrestigeSpatiomancyLevel'>0/</div>
            <input type='number' id='buffPrestigeSpatiomancyCap' class='buffmaxinput' value='100'></input>
          </div>
          <div class='buffContainer showthat' id='buffPrestigeChronomancyContainer' style='display: none;'>
            <img class='buffIcon' src='icons/prestige-Chronomancy.svg'></img>
            <div class='skillLabel medium bold'>Prestige - Chronomancy</div>
            <div class='showthis'>
              <span>
                Increases speed of all zones by a multiplier of 5% per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffPrestigeChronomancyLevel'>0/</div>
            <input type='number' id='buffPrestigeChronomancyCap' class='buffmaxinput' value='100'></input>
          </div>
          <div class='buffContainer showthat' id='buffPrestigeBarteringContainer' style='display: none;'>
            <img class='buffIcon' src='icons/prestige-Bartering.svg'></img>
            <div class='skillLabel medium bold'>Prestige - Bartering</div>
            <div class='showthis'>
              <span>
                Increases received from merchants by 10% per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffPrestigeBarteringLevel'>0/</div>
            <input type='number' id='buffPrestigeBarteringCap' class='buffmaxinput' value='100'></input>
          </div>
          <div class='buffContainer showthat' id='buffPrestigeExpOverflowContainer' style='display: none;'>
            <img class='buffIcon' src='icons/prestige-ExperienceOverflow.svg'></img>
            <div class='skillLabel medium bold'>Prestige - Experience Overflow</div>
            <div class='showthis'>
              <span>
                Gives (1.00222^n-1) times the normal amount of experience as extra, given to each stat.<br></br>
                (n = the level of this buff.)
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffPrestigeExpOverflowLevel'>0/</div>
            <input type='number' id='buffPrestigeExpOverflowCap' class='buffmaxinput' value='100'></input>
          </div>
        </div>
      </div>
    </div>
  );
};
