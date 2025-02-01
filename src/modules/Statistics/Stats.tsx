import { For } from 'solid-js';
import { Tooltip } from '../../components/containers/Overlay/primitives/Tooltip.tsx';
import { et } from '../../locales/translations.utils.ts';
import { statList } from '../../original/globals.ts';
import { view } from '../../views/main.view.ts';

const t = et('statistics');

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

const AttributeList = () => {
  return (
    <div id='statsContainer'>
      <For each={statList}>
        {(stat) => {
          const name = statToName[stat];

          return (
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
        }}
      </For>
      <div class='statContainer stat-total showthat' id='totalStatContainer'>
        <div class='statLabelContainer'>
          <div
            class='medium bold stat-name'
            style='margin-left: 18px; margin-top: 5px'
          >
            {t('total.singular')}
          </div>
          <div class='medium statNum stat-soulstone' style='color: var(--stat-soulstone-color)' id='stattotalss'>
          </div>
          <div class='medium statNum stat-talent' id='stattotalTalent'>0</div>
          <div class='medium statNum stat-level' id='stattotalLevel'>0</div>
        </div>
        <div class='showthis' id='stattotalTooltip'>
          <div class='medium bold'>{t('total.plural')}</div>
          <br></br>
          <div>{t('total.description')}</div>
          <br></br>
          <div class='medium bold colon-after'>{t('tooltips.level')}</div>
          <div id='stattotalLevel2'></div>

          <br></br>
          <div class='medium bold colon-after'>{t('tooltips.talent')}</div>
          <div id='stattotalTalent2'></div>
          <br></br>
          <div id='sstotalContainer' class='ssContainer'>
            <div class='bold colon-after'>{t('tooltips.soulstone')}</div>
            <div id='sstotal'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillList = () => {
  return (
    <div id='skillList'>
      <div class='showthat'>
        <div class='large bold'>{t('sections.skills.title')}</div>
        <div class='showthis'>{t('tooltips.notRestarting')}</div>
      </div>
      <br></br>
      <div class='skillContainer showthat' id='skillSCombatContainer'>
        <div class='skillLabel medium bold'>{t('skills.soloCombat.name')}</div>
        <div class='statNum medium'>
          <div id='skillSCombatLevel'>0</div>
        </div>
        <div style='margin-top: 18px'></div>
        <div class='showthis'>
          {t('skills.soloCombat.description')}
          <br></br>
        </div>
      </div>
      <div class='skillContainer showthat' id='skillTCombatContainer'>
        <div class='skillLabel medium bold'>{t('skills.teamCombat.name')}</div>
        <div class='statNum medium'>
          <div id='skillTCombatLevel'>0</div>
        </div>
        <div style='margin-top: 18px'></div>
        <div class='showthis'>
          {t('skills.teamCombat.description')}
          <br></br>
        </div>
      </div>
      <div
        class='skillContainer showthat'
        id='skillCombatContainer'
        onMouseOver={() => view.showSkill('Combat')}
        onMouseOut={() => view.showSkill(undefined)}
      >
        <div class='skillLabel medium bold'>{t('skills.combat.name')}</div>
        <div class='statNum medium'>
          <div id='skillCombatLevel'>0</div>
        </div>
        <div style='margin-top: 18px'></div>
        <div class='thinProgressBarUpper'>
          <div class='statBar skillExpBar townExpBar' id='skillCombatLevelBar'></div>
        </div>
        <div class='showthis'>
          {t('skills.combat.description')}
          <br></br>
          <div class='medium bold'>{t('tooltips.levelExperience')}</div>
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
        <div class='skillLabel medium bold'>{t('skills.magic.name')}</div>
        <div class='statNum medium'>
          <div id='skillMagicLevel'>0</div>
        </div>
        <div style='margin-top: 18px'></div>
        <div class='thinProgressBarUpper'>
          <div class='statBar skillExpBar townExpBar' id='skillMagicLevelBar'></div>
        </div>
        <div class='showthis'>
          {t('skills.magic.description')}
          <br></br>
          <div class='medium bold'>{t('tooltips.levelExperience')}</div>
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
        <div class='skillLabel medium bold'>{t('skills.practical.name')}</div>
        <div class='statNum medium'>
          <div id='skillPracticalLevel'>0</div>
        </div>
        <div style='margin-top: 18px'></div>
        <div class='thinProgressBarUpper'>
          <div class='statBar skillExpBar townExpBar' id='skillPracticalLevelBar'></div>
        </div>
        <div class='showthis' style='width: 490px'>
          {t('skills.practical.description')}
          <br></br>
          <div class='medium bold'>{t('tooltips.levelExperience')}</div>
          <div id='skillPracticalLevelExp'></div>/<div id='skillPracticalLevelExpNeeded'></div>
          <div class='statTooltipPerc'>
            (<div id='skillPracticalLevelProgress'></div>%)
          </div>
          <br></br>
          {t('skills.practical.explaination')}
        </div>
      </div>
      <div
        class='skillContainer showthat'
        id='skillAlchemyContainer'
        onMouseOver={() => view.showSkill('Alchemy')}
        onMouseOut={() => view.showSkill(undefined)}
      >
        <div class='skillLabel medium bold'>{t('skills.alchemy.name')}</div>
        <div class='statNum medium'>
          <div id='skillAlchemyLevel'>0</div>
        </div>
        <div style='margin-top: 18px'></div>
        <div class='thinProgressBarUpper'>
          <div class='statBar skillExpBar townExpBar' id='skillAlchemyLevelBar'></div>
        </div>
        <div class='showthis'>
          {t('skills.alchemy.description')}
          <br></br>
          <div class='medium bold'>{t('tooltips.levelExperience')}</div>
          <div id='skillAlchemyLevelExp'></div>/<div id='skillAlchemyLevelExpNeeded'></div>
          <div class='statTooltipPerc'>
            (<div id='skillAlchemyLevelProgress'></div>%)
          </div>
          <br></br>
          {t('skills.alchemy.explaination')}
        </div>
      </div>
      <div
        class='skillContainer showthat'
        id='skillDarkContainer'
        onMouseOver={() => view.showSkill('Dark')}
        onMouseOut={() => view.showSkill(undefined)}
      >
        <div class='skillLabel medium bold'>{t('skills.dark.name')}</div>
        <div class='statNum medium'>
          <div id='skillDarkLevel'>0</div>
        </div>
        <div style='margin-top: 18px'></div>
        <div class='thinProgressBarUpper'>
          <div class='statBar skillExpBar townExpBar' id='skillDarkLevelBar'></div>
        </div>
        <div class='showthis' style='width: 490px'>
          {t('skills.dark.description')}
          <br></br>
          <div class='medium bold'>{t('tooltips.levelExperience')}</div>
          <div id='skillDarkLevelExp'></div>/<div id='skillDarkLevelExpNeeded'></div>
          <div class='statTooltipPerc'>
            (<div id='skillDarkLevelProgress'></div>%)
          </div>
          <br></br>
          {t('skills.dark.explaination')}
        </div>
      </div>
      <div
        class='skillContainer showthat'
        id='skillCraftingContainer'
        onMouseOver={() => view.showSkill('Crafting')}
        onMouseOut={() => view.showSkill(undefined)}
      >
        <div class='skillLabel medium bold'>{t('skills.crafting.name')}</div>
        <div class='statNum medium'>
          <div id='skillCraftingLevel'>0</div>
        </div>
        <div style='margin-top: 18px'></div>
        <div class='thinProgressBarUpper'>
          <div class='statBar skillExpBar townExpBar' id='skillCraftingLevelBar'></div>
        </div>
        <div class='showthis'>
          {t('skills.crafting.description')}
          <br></br>
          <div class='medium bold'>{t('tooltips.levelExperience')}</div>
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
        <div class='skillLabel medium bold'>{t('skills.chronomancy.name')}</div>
        <div class='statNum medium'>
          <div id='skillChronomancyLevel'>0</div>
        </div>
        <div style='margin-top: 18px'></div>
        <div class='thinProgressBarUpper'>
          <div class='statBar skillExpBar townExpBar' id='skillChronomancyLevelBar'></div>
        </div>
        <div class='showthis' style='width: 490px'>
          {t('skills.chronomancy.description')}
          <br></br>
          <div class='medium bold'>{t('tooltips.levelExperience')}</div>
          <div id='skillChronomancyLevelExp'></div>/<div id='skillChronomancyLevelExpNeeded'></div>
          <div class='statTooltipPerc'>
            (<div id='skillChronomancyLevelProgress'></div>%)
          </div>
          <br></br>
          {t('skills.chronomancy.explaination')}
        </div>
      </div>
      <div
        class='skillContainer showthat'
        id='skillPyromancyContainer'
        onMouseOver={() => view.showSkill('Pyromancy')}
        onMouseOut={() => view.showSkill(undefined)}
      >
        <div class='skillLabel medium bold'>{t('skills.pyromancy.name')}</div>
        <div class='statNum medium'>
          <div id='skillPyromancyLevel'>0</div>
        </div>
        <div style='margin-top: 18px'></div>
        <div class='thinProgressBarUpper'>
          <div class='statBar skillExpBar townExpBar' id='skillPyromancyLevelBar'></div>
        </div>
        <div class='showthis' style='width: 490px'>
          {t('skills.pyromancy.description')}
          <br></br>
          <div class='medium bold'>{t('tooltips.levelExperience')}</div>
          <div id='skillPyromancyLevelExp'></div>/<div id='skillPyromancyLevelExpNeeded'></div>
          <div class='statTooltipPerc'>
            (<div id='skillPyromancyLevelProgress'></div>%)
          </div>
          <br></br>
          {t('skills.pyromancy.explaination')}
        </div>
      </div>
      <div
        class='skillContainer showthat'
        id='skillRestorationContainer'
        onMouseOver={() => view.showSkill('Restoration')}
        onMouseOut={() => view.showSkill(undefined)}
      >
        <div class='skillLabel medium bold'>{t('skills.restoration.name')}</div>
        <div class='statNum medium'>
          <div id='skillRestorationLevel'>0</div>
        </div>
        <div style='margin-top: 18px'></div>
        <div class='thinProgressBarUpper'>
          <div class='statBar skillExpBar townExpBar' id='skillRestorationLevelBar'></div>
        </div>
        <div class='showthis' style='width: 490px'>
          {t('skills.restoration.description')}
          <br></br>
          <div class='medium bold'>{t('tooltips.levelExperience')}</div>
          <div id='skillRestorationLevelExp'></div>/<div id='skillRestorationLevelExpNeeded'></div>
          <div class='statTooltipPerc'>
            (<div id='skillRestorationLevelProgress'></div>%)
          </div>
          <br></br>
          {t('skills.restoration.explaination')}
        </div>
      </div>
      <div
        class='skillContainer showthat'
        id='skillSpatiomancyContainer'
        onMouseOver={() => view.showSkill('Spatiomancy')}
        onMouseOut={() => view.showSkill(undefined)}
      >
        <div class='skillLabel medium bold'>{t('skills.spatiomancy.name')}</div>
        <div class='statNum medium'>
          <div id='skillSpatiomancyLevel'>0</div>
        </div>
        <div style='margin-top: 18px'></div>
        <div class='thinProgressBarUpper'>
          <div class='statBar skillExpBar townExpBar' id='skillSpatiomancyLevelBar'></div>
        </div>
        <div class='showthis' style='width: 490px'>
          {t('skills.spatiomancy.description')}
          <br></br>
          <div class='medium bold'>{t('tooltips.levelExperience')}</div>
          <div id='skillSpatiomancyLevelExp'></div>/<div id='skillSpatiomancyLevelExpNeeded'></div>
          <div class='statTooltipPerc'>
            (<div id='skillSpatiomancyLevelProgress'></div>%)
          </div>
          <br></br>
          {t('skills.spatiomancy.explaination')}
        </div>
      </div>
      <div
        class='skillContainer showthat'
        id='skillMercantilismContainer'
        onMouseOver={() => view.showSkill('Mercantilism')}
        onMouseOut={() => view.showSkill(undefined)}
      >
        <div class='skillLabel medium bold'>{t('skills.mercantilism.name')}</div>
        <div class='statNum medium'>
          <div id='skillMercantilismLevel'>0</div>
        </div>
        <div style='margin-top: 18px'></div>
        <div class='thinProgressBarUpper'>
          <div class='statBar skillExpBar townExpBar' id='skillMercantilismLevelBar'></div>
        </div>
        <div class='showthis' style='width: 490px'>
          {t('skills.mercantilism.description')}
          <br></br>
          <div class='medium bold'>{t('tooltips.levelExperience')}</div>
          <div id='skillMercantilismLevelExp'></div>/<div id='skillMercantilismLevelExpNeeded'></div>
          <div class='statTooltipPerc'>
            (<div id='skillMercantilismLevelProgress'></div>%)
          </div>
          <br></br>
          {t('skills.mercantilism.explaination')}
        </div>
      </div>
      <div
        class='skillContainer showthat'
        id='skillDivineContainer'
        onMouseOver={() => view.showSkill('Divine')}
        onMouseOut={() => view.showSkill(undefined)}
      >
        <div class='skillLabel medium bold'>{t('skills.divine.name')}</div>
        <div class='statNum medium'>
          <div id='skillDivineLevel'>0</div>
        </div>
        <div style='margin-top: 18px'></div>
        <div class='thinProgressBarUpper'>
          <div class='statBar skillExpBar townExpBar' id='skillDivineLevelBar'></div>
        </div>
        <div class='showthis' style='width: 490px'>
          {t('skills.divine.description')}
          <br></br>
          <div class='medium bold'>{t('tooltips.levelExperience')}</div>
          <div id='skillDivineLevelExp'></div>/<div id='skillDivineLevelExpNeeded'></div>
          <div class='statTooltipPerc'>
            (<div id='skillDivineLevelProgress'></div>%)
          </div>
          <br></br>
          {t('skills.divine.explaination')}
        </div>
      </div>
      <div
        class='skillContainer showthat'
        id='skillCommuneContainer'
        onMouseOver={() => view.showSkill('Commune')}
        onMouseOut={() => view.showSkill(undefined)}
      >
        <div class='skillLabel medium bold'>{t('skills.commune.name')}</div>
        <div class='statNum medium'>
          <div id='skillCommuneLevel'>0</div>
        </div>
        <div style='margin-top: 18px'></div>
        <div class='thinProgressBarUpper'>
          <div class='statBar skillExpBar townExpBar' id='skillCommuneLevelBar'></div>
        </div>
        <div class='showthis' style='width: 490px'>
          {t('skills.commune.description')}
          <br></br>
          <div class='medium bold'>{t('tooltips.levelExperience')}</div>
          <div id='skillCommuneLevelExp'></div>/<div id='skillCommuneLevelExpNeeded'></div>
          <div class='statTooltipPerc'>
            (<div id='skillCommuneLevelProgress'></div>%)
          </div>
          <br></br>
          {t('skills.commune.explaination')}
        </div>
      </div>
      <div
        class='skillContainer showthat'
        id='skillGluttonyContainer'
        onMouseOver={() => view.showSkill('Gluttony')}
        onMouseOut={() => view.showSkill(undefined)}
      >
        <div class='skillLabel medium bold'>{t('skills.gluttony.name')}</div>
        <div class='statNum medium'>
          <div id='skillGluttonyLevel'>0</div>
        </div>
        <div style='margin-top: 18px'></div>
        <div class='thinProgressBarUpper'>
          <div class='statBar skillExpBar townExpBar' id='skillGluttonyLevelBar'></div>
        </div>
        <div class='showthis' style='width: 490px'>
          {t('skills.gluttony.description')}
          <br></br>
          <div class='medium bold'>{t('tooltips.levelExperience')}</div>
          <div id='skillGluttonyLevelExp'></div>/<div id='skillGluttonyLevelExpNeeded'></div>
          <div class='statTooltipPerc'>
            (<div id='skillGluttonyLevelProgress'></div>%)
          </div>
          <br></br>
          {t('skills.gluttony.explaination')}
        </div>
      </div>
      <div
        class='skillContainer showthat'
        id='skillWunderkindContainer'
        onMouseOver={() => view.showSkill('Wunderkind')}
        onMouseOut={() => view.showSkill(undefined)}
      >
        <div class='skillLabel medium bold'>{t('skills.wunderkind.name')}</div>
        <div class='statNum medium'>
          <div id='skillWunderkindLevel'>0</div>
        </div>
        <div style='margin-top: 18px'></div>
        <div class='thinProgressBarUpper'>
          <div class='statBar skillExpBar townExpBar' id='skillWunderkindLevelBar'></div>
        </div>
        <div class='showthis' style='width: 490px'>
          {t('skills.wunderkind.description')}
          <br></br>
          <div class='medium bold'>{t('tooltips.levelExperience')}</div>
          <div id='skillWunderkindLevelExp'></div>/<div id='skillWunderkindLevelExpNeeded'></div>
          <div class='statTooltipPerc'>
            (<div id='skillWunderkindLevelProgress'></div>%)
          </div>
          <br></br>
          {t('skills.wunderkind.explaination')}
        </div>
      </div>
      <div
        class='skillContainer showthat'
        id='skillThieveryContainer'
        onMouseOver={() => view.showSkill('Thievery')}
        onMouseOut={() => view.showSkill(undefined)}
      >
        <div class='skillLabel medium bold'>{t('skills.thievery.name')}</div>
        <div class='statNum medium'>
          <div id='skillThieveryLevel'>0</div>
        </div>
        <div style='margin-top: 18px'></div>
        <div class='thinProgressBarUpper'>
          <div class='statBar skillExpBar townExpBar' id='skillThieveryLevelBar'></div>
        </div>
        <div class='showthis' style='width: 490px'>
          {t('skills.thievery.description')}
          <br></br>
          <div class='medium bold'>{t('tooltips.levelExperience')}</div>
          <div id='skillThieveryLevelExp'></div>/<div id='skillThieveryLevelExpNeeded'></div>
          <div class='statTooltipPerc'>
            (<div id='skillThieveryLevelProgress'></div>%)
          </div>
          <br></br>
          {t('skills.thievery.explaination')}
        </div>
      </div>
      <div
        class='skillContainer showthat'
        id='skillLeadershipContainer'
        onMouseOver={() => view.showSkill('Leadership')}
        onMouseOut={() => view.showSkill(undefined)}
      >
        <div class='skillLabel medium bold'>{t('skills.leadership.name')}</div>
        <div class='statNum medium'>
          <div id='skillLeadershipLevel'>0</div>
        </div>
        <div style='margin-top: 18px'></div>
        <div class='thinProgressBarUpper'>
          <div class='statBar skillExpBar townExpBar' id='skillLeadershipLevelBar'></div>
        </div>
        <div class='showthis' style='width: 490px'>
          {t('skills.leadership.description')}
          <br></br>
          <div class='medium bold'>{t('tooltips.levelExperience')}</div>
          <div id='skillLeadershipLevelExp'></div>/<div id='skillLeadershipLevelExpNeeded'></div>
          <div class='statTooltipPerc'>
            (<div id='skillLeadershipLevelProgress'></div>%)
          </div>
          <br></br>
          {t('skills.leadership.explaination')}
        </div>
      </div>
      <div
        class='skillContainer showthat'
        id='skillAssassinContainer'
        onMouseOver={() => view.showSkill('Assassin')}
        onMouseOut={() => view.showSkill(undefined)}
      >
        <div class='skillLabel medium bold'>{t('skills.assassination.name')}</div>
        <div class='statNum medium'>
          <div id='skillAssassinLevel'>0</div>
        </div>
        <div style='margin-top: 18px'></div>
        <div class='thinProgressBarUpper'>
          <div class='statBar skillExpBar townExpBar' id='skillAssassinLevelBar'></div>
        </div>
        <div class='showthis' style='width: 490px'>
          {t('skills.assassination.description')}
          <br></br>
          <div class='medium bold'>{t('tooltips.levelExperience')}</div>
          <div id='skillAssassinLevelExp'></div>/<div id='skillAssassinLevelExpNeeded'></div>
          <div class='statTooltipPerc'>
            (<div id='skillAssassinLevelProgress'></div>%)
          </div>
          <br></br>
          {t('skills.assassination.explaination')}
        </div>
      </div>
    </div>
  );
};

const BuffList = () => {
  return (
    <div id='buffList'>
      <div class='showthat'>
        <div class='large bold'>{t('sections.buffs.title')}</div>
        <div class='showthis'>{t('tooltips.notRestarting')}</div>
      </div>
      <br></br>
      <div id='buffsContainer' style='display:flex;flex-direction:column'>
        <div class='buffContainer showthat' id='buffRitualContainer'>
          <img class='buffIcon' src='icons/darkRitual.svg'></img>
          <div class='skillLabel medium bold'>{t('buffs.ritual.name')}</div>
          <div class='showthis'>
            <span>
              {t('buffs.ritual.description')}
            </span>
            <br></br>
            <div id='DRText'>{t('buffs.ritual.explaination')}</div>
          </div>
        </div>
        <div class='buffNumContainer'>
          <div id='buffRitualLevel'>0/</div>
          <input type='number' id='buffRitualCap' class='buffmaxinput' value='666'></input>
        </div>
        <div class='buffContainer showthat' id='buffImbuementContainer'>
          <img class='buffIcon' src='icons/imbueMind.svg'></img>
          <div class='skillLabel medium bold'>{t('buffs.mindImbuement.name')}</div>
          <div class='showthis'>
            <span>
              {t('buffs.mindImbuement.description')}
              <br></br>
              {t('buffs.mindImbuement.explaination')}
            </span>
          </div>
        </div>
        <div class='buffNumContainer'>
          <div id='buffImbuementLevel'>0/</div>
          <input type='number' id='buffImbuementCap' class='buffmaxinput' value='500'></input>
        </div>
        <div class='buffContainer showthat' id='buffImbuement2Container'>
          <img class='buffIcon' src='icons/imbueBody.svg'></img>
          <div class='skillLabel medium bold'>{t('buffs.bodyImbuement.name')}</div>
          <div class='showthis'>
            <span>
              {t('buffs.bodyImbuement.description')}
              <br></br>
              {t('buffs.bodyImbuement.explaination')}
            </span>
            <br></br>
          </div>
        </div>
        <div class='buffNumContainer'>
          <div id='buffImbuement2Level'>0/</div>
          <input type='number' id='buffImbuement2Cap' class='buffmaxinput' value='500'></input>
        </div>
        <div class='buffContainer showthat' id='buffFeastContainer'>
          <img class='buffIcon' src='icons/greatFeast.svg'></img>
          <div class='skillLabel medium bold'>{t('buffs.greatFeast.name')}</div>
          <div class='showthis'>
            <span>
              {t('buffs.greatFeast.description')}
              <br></br>
              {t('buffs.greatFeast.explaination')}
            </span>
            <br></br>
          </div>
        </div>
        <div class='buffNumContainer'>
          <div id='buffFeastLevel'>0/</div>
          <input type='number' id='buffFeastCap' class='buffmaxinput' value='100'></input>
        </div>
        <div class='buffContainer showthat' id='buffAspirantContainer'>
          <img class='buffIcon' src='icons/aspirant.svg'></img>
          <div class='skillLabel medium bold'>{t('buffs.aspirant.name')}</div>
          <div class='showthis'>
            <span>
              {t('buffs.aspirant.description')}
              <br></br>
              {t('buffs.aspirant.explaination')}
            </span>
            <br></br>
          </div>
        </div>
        <div class='buffNumContainer'>
          <div id='buffAspirantLevel'>0/</div>
          <input type='number' id='buffAspirantCap' class='buffmaxinput' value='20'></input>
        </div>
        <div class='buffContainer showthat' id='buffHeroismContainer'>
          <img class='buffIcon' src='icons/heroism.svg'></img>
          <div class='skillLabel medium bold'>{t('buffs.heroism.name')}</div>
          <div class='showthis'>
            <span>
              {t('buffs.heroism.description')}
              <br></br>
              {t('buffs.heroism.explaination')}
            </span>
            <br></br>
          </div>
        </div>
        <div class='buffNumContainer'>
          <div id='buffHeroismLevel'>0/</div>
          <input type='number' id='buffHeroismCap' class='buffmaxinput' value='50'></input>
        </div>
        <div class='buffContainer showthat' id='buffImbuement3Container'>
          <img class='buffIcon' src='icons/imbueSoul.svg'></img>
          <div class='skillLabel medium bold'>{t('buffs.soulImbuement.name')}</div>
          <div class='showthis'>
            <span>
              {t('buffs.soulImbuement.description')}
              <br></br>
              {t('buffs.soulImbuement.explaination')}
            </span>
            <br></br>
          </div>
        </div>
        <div class='buffNumContainer'>
          <div id='buffImbuement3Level'>0/</div>
          <input type='number' id='buffImbuement3Cap' class='buffmaxinput' value='7'></input>
        </div>
        <div class='buffContainer showthat' id='buffPrestigePhysicalContainer'>
          <img class='buffIcon' src='icons/prestige-Physical.svg'></img>
          <div class='skillLabel medium bold'>{t('buffs.prestigePhysical.name')}</div>
          <div class='showthis'>
            <span>
              {t('buffs.prestigePhysical.description')}
              <br></br>
              {t('buffs.prestigePhysical.explaination')}
            </span>
          </div>
        </div>
        <div class='buffNumContainer'>
          <div id='buffPrestigePhysicalLevel'>0/</div>
          <input type='number' id='buffPrestigePhysicalCap' class='buffmaxinput' value='100'></input>
        </div>
        <div class='buffContainer showthat' id='buffPrestigeMentalContainer'>
          <img class='buffIcon' src='icons/prestige-Mental.svg'></img>
          <div class='skillLabel medium bold'>{t('buffs.prestigeMental.name')}</div>
          <div class='showthis'>
            <span>
              {t('buffs.prestigeMental.description')}
            </span>
            <br></br>
          </div>
        </div>
        <div class='buffNumContainer'>
          <div id='buffPrestigeMentalLevel'>0/</div>
          <input type='number' id='buffPrestigeMentalCap' class='buffmaxinput' value='100'></input>
        </div>
        <div class='buffContainer showthat' id='buffPrestigeCombatContainer'>
          <img class='buffIcon' src='icons/prestige-Combat.svg'></img>
          <div class='skillLabel medium bold'>{t('buffs.prestigeCombat.name')}</div>
          <div class='showthis'>
            <span>
              {t('buffs.prestigeCombat.description')}
            </span>
            <br></br>
          </div>
        </div>
        <div class='buffNumContainer'>
          <div id='buffPrestigeCombatLevel'>0/</div>
          <input type='number' id='buffPrestigeCombatCap' class='buffmaxinput' value='100'></input>
        </div>
        <div class='buffContainer showthat' id='buffPrestigeSpatiomancyContainer'>
          <img class='buffIcon' src='icons/prestige-Spatiomancy.svg'></img>
          <div class='skillLabel medium bold'>{t('buffs.prestigeSpatiomancy.name')}</div>
          <div class='showthis'>
            <span>
              {t('buffs.prestigeSpatiomancy.description')}
            </span>
            <br></br>
          </div>
        </div>
        <div class='buffNumContainer'>
          <div id='buffPrestigeSpatiomancyLevel'>0/</div>
          <input type='number' id='buffPrestigeSpatiomancyCap' class='buffmaxinput' value='100'></input>
        </div>
        <div class='buffContainer showthat' id='buffPrestigeChronomancyContainer'>
          <img class='buffIcon' src='icons/prestige-Chronomancy.svg'></img>
          <div class='skillLabel medium bold'>{t('buffs.prestigeChronomancy.name')}</div>
          <div class='showthis'>
            <span>
              {t('buffs.prestigeChronomancy.description')}
            </span>
            <br></br>
          </div>
        </div>
        <div class='buffNumContainer'>
          <div id='buffPrestigeChronomancyLevel'>0/</div>
          <input type='number' id='buffPrestigeChronomancyCap' class='buffmaxinput' value='100'></input>
        </div>
        <div class='buffContainer showthat' id='buffPrestigeBarteringContainer'>
          <img class='buffIcon' src='icons/prestige-Bartering.svg'></img>
          <div class='skillLabel medium bold'>{t('buffs.prestigeBartering.name')}</div>
          <div class='showthis'>
            <span>
              {t('buffs.prestigeBartering.description')}
            </span>
            <br></br>
          </div>
        </div>
        <div class='buffNumContainer'>
          <div id='buffPrestigeBarteringLevel'>0/</div>
          <input type='number' id='buffPrestigeBarteringCap' class='buffmaxinput' value='100'></input>
        </div>
        <div class='buffContainer showthat' id='buffPrestigeExpOverflowContainer'>
          <img class='buffIcon' src='icons/prestige-ExperienceOverflow.svg'></img>
          <div class='skillLabel medium bold'>{t('buffs.prestigeExpOverflow.name')}</div>
          <div class='showthis'>
            <span>
              {t('buffs.prestigeExpOverflow.description')}
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
  );
};

const SectionTitle = () => (
  <Tooltip>
    <Tooltip.Trigger>
      <div class='font-bold'>{t('title')}</div>
    </Tooltip.Trigger>
    <Tooltip.Content>
      Each stat level reduces the relevant part of an action's mana cost by a percentage. Talent exp gain is equal to 1%
      of stat exp gain, and persists through loops. Talent multiplies xp gain by (1+(talentLevel)^0.4/3). XP gain
      towards a stat per action is (original mana / actual mana) * (talent bonus) per tick. Total Mult is the product of
      your talent and soulstone bonuses. e.g. Meet People costs 800 mana and has a breakdown of{' '}
      <div class='bold'>Int</div> 10% <div class='bold'>Cha</div> 80% <div class='bold'>Soul</div>{' '}
      10%. This effectively means 80 of the mana is controlled by <div class='bold'>Int</div>, another 80 by{' '}
      <div class='bold'>Soul</div>, and the remaining 640 by <div class='bold'>Cha</div>. If your{' '}
      <div class='bold'>Cha</div>{' '}
      is level 20 when the action is started, the bonus would be x1.2 so it'd be 640 / 1.2 = 533.33 Adding back the 160
      from <div class='bold'>Soul</div> and{' '}
      <div class='bold'>Int</div>, the total mana the action takes (rounded up) is now 694, so ~87% of the original mana
      cost. The action would give (800/694)*(1+(talent)^0.4/3) level exp per mana for the 694 mana.
    </Tooltip.Content>
  </Tooltip>
);

export const Stats = () => {
  return (
    <div id='statsWindow' data-view='regular'>
      <SectionTitle />
      <AttributeList />
      <SkillList />
      <BuffList />
    </div>
  );
};
