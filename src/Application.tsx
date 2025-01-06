import { WelcomeMessage } from './modules/WelcomeMessage.tsx';

const Header = () => (
  <header id='timeInfo' style='width: 100%; text-align: center'>
    <div
      id='timeBarContainer'
      style='width: 100%; height: 10px; background: var(--progress-bar-background); text-align: center; position: relative'
    >
      <div
        id='timeBar'
        style='height: 100%; width: 20%; background-color: var(--progress-bar-mana-color); display: block; margin: auto'
      >
      </div>
    </div>
    <menu id='menu' style='float: left; height: 30px; margin-left: 24px; margin-right: -24px'></menu>
    <div id='trackedResources'></div>
    <br></br>
    <div id='timeControls'></div>
  </header>
);

const Actions = () => {
  return (
    <div id='actionsColumn'>
      <div id='actionList' style='width: 100%; text-align: center'>
        <div class='showthat'>
          <div class='large bold localized' style='margin-right: -49px' data-locale='actions>title_list'></div>
          <span id='predictorTotalDisplay' class='koviko'></span>
          <span id='predictorStatisticDisplay' class='koviko'></span>
          <div class='showthis'>
            <i class='actionIcon far fa-circle'></i>
            <span class='localized' data-locale='actions>tooltip>icons>circle'></span>
            <br></br>
            <i class='actionIcon fas fa-plus'></i>
            <span class='localized' data-locale='actions>tooltip>icons>plus'></span>
            <br></br>
            <i class='actionIcon fas fa-minus'></i>
            <span class='localized' data-locale='actions>tooltip>icons>minus'></span>
            <br></br>
            <i class='actionIcon fas fa-arrows-alt-h'></i>
            <span class='localized' data-locale='actions>tooltip>icons>arrows_h'></span>
            <br></br>
            <i class='actionIcon fas fa-sort-up'></i>
            <span class='localized' data-locale='actions>tooltip>icons>sort_up'></span>
            <br></br>
            <i class='actionIcon fas fa-sort-down'></i>
            <span class='localized' data-locale='actions>tooltip>icons>sort_down'></span>
            <br></br>
            <i class='actionIcon far fa-check-circle'></i>
            <span style='margin-left: -2px'>/</span>
            <i class='actionIcon far fa-times-circle'></i>
            <span class='localized' data-locale='actions>tooltip>icons>circles'></span>
            <br></br>
            <i class='actionIcon fas fa-times'></i>
            <span class='localized' data-locale='actions>tooltip>icons>times'></span>
            <br></br>
            <span class='localized' data-locale='actions>tooltip>list_explanation'></span>
          </div>
        </div>
        <div style='position: relative; left: 135px'>
          <button class='button' style='z-index: 0' onclick='globalThis.view.adjustActionListSize(100)'>
            <i class='fas fa-plus'></i>
          </button>
          <button class='button' style='z-index: 0' onclick='globalThis.view.adjustActionListSize(-100)'>
            <i class='fas fa-minus'></i>
          </button>
        </div>
        <br></br>
        <div id='expandableList'>
          <div id='curActionsListContainer'>
            <div id='curActionsList'></div>
            <div id='curActionsManaUsed' class='showthat'>
              <div class='bold localized' data-locale='actions>tooltip>mana_used'></div>
              <div id='totalTicks' style='font-size: 0.75rem'></div>
              <div class='showthis localized' data-locale='actions>tooltip>mana_used_explanation'></div>
            </div>
          </div>
          <div id='nextActionsListContainer'>
            <div id='nextActionsList'></div>
            <div
              id='actionTooltipContainer'
              style='margin-top: 10px; width: 100%; text-align: left; max-height: 357px; overflow: auto'
            >
            </div>
            <div id='nextActionsAmountButtons'>
              <div class='bold localized' data-locale='actions>tooltip>amount'></div>
              <button class='button change-amount' onclick='globalThis.driver.changeActionAmount(1)'>1</button>
              <button class='button change-amount' onclick='globalThis.driver.changeActionAmount(5)'>5</button>
              <button class='button change-amount' onclick='globalThis.driver.changeActionAmount(10)'>10</button>
              <input
                id='amountCustom'
                oninput='globalThis.driver.setCustomActionAmount()'
                onblur='globalThis.driver.setCustomActionAmount()'
                value='1'
                style='width: 75px; position: relative; left: 0; top: -2px; border: 1px solid var(--input-border); height: 16px'
              >
              </input>
            </div>
          </div>
        </div>
        <div id='actionChanges' style='display: flex; text-align: left; width: 100%; margin-top: 5px'>
          <div id='actionChangeOptions' style='width: 50%'>
            <input
              type='checkbox'
              id='keepCurrentListInput'
              class='checkbox'
              onchange="globalThis.saving.setOption('keepCurrentList', this.checked)"
            >
            </input>
            <label
              for='keepCurrentListInput'
              class='localized'
              data-locale='actions>tooltip>current_list_active'
            >
            </label>
            <br></br>
            <input
              type='checkbox'
              id='repeatLastActionInput'
              class='checkbox'
              onchange="globalThis.saving.setOption('repeatLastAction', this.checked)"
            >
            </input>
            <label
              for='repeatLastActionInput'
              class='localized'
              data-locale='actions>tooltip>repeat_last_action'
            >
            </label>
            <br></br>
            <input
              type='checkbox'
              id='addActionsToTopInput'
              class='checkbox'
              onchange="globalThis.saving.setOption('addActionsToTop', this.checked)"
            >
            </input>
            <label for='addActionsToTopInput' class='localized' data-locale='actions>tooltip>add_action_top'></label>
          </div>
          <div id='actionChangeButtons' style='margin-left: -4px; text-align: right; width: 50%'>
            <button
              id='maxTraining'
              class='button localized'
              style='margin-right: 0px; display: none'
              onclick='globalThis.driver.capAllTraining()'
              data-locale='actions>tooltip>max_training'
            >
            </button>
            <button
              id='clearList'
              class='button localized'
              style='margin-right: 0px'
              onclick='globalThis.driver.clearList()'
              data-locale='actions>tooltip>clear_list'
            >
            </button>
            <div tabindex='0' class='showthatloadout'>
              Manage Loadouts
              <div class='showthisloadout'>
                <button
                  class='loadoutbutton unused'
                  id='load1'
                  onclick='globalThis.driver.selectLoadout(1)'
                  style='width: 200px'
                >
                  Loadout 1
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load2'
                  onclick='globalThis.driver.selectLoadout(2)'
                  style='width: 200px'
                >
                  Loadout 2
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load3'
                  onclick='globalThis.driver.selectLoadout(3)'
                  style='width: 200px'
                >
                  Loadout 3
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load4'
                  onclick='globalThis.driver.selectLoadout(4)'
                  style='width: 200px'
                >
                  Loadout 4
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load5'
                  onclick='globalThis.driver.selectLoadout(5)'
                  style='width: 200px'
                >
                  Loadout 5
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load6'
                  onclick='globalThis.driver.selectLoadout(6)'
                  style='width: 200px'
                >
                  Loadout 6
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load7'
                  onclick='globalThis.driver.selectLoadout(7)'
                  style='width: 200px'
                >
                  Loadout 7
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load8'
                  onclick='globalThis.driver.selectLoadout(8)'
                  style='width: 200px'
                >
                  Loadout 8
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load9'
                  onclick='globalThis.driver.selectLoadout(9)'
                  style='width: 200px'
                >
                  Loadout 9
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load10'
                  onclick='globalThis.driver.selectLoadout(10)'
                  style='width: 200px'
                >
                  Loadout 10
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load11'
                  onclick='globalThis.driver.selectLoadout(11)'
                  style='width: 200px'
                >
                  Loadout 11
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load12'
                  onclick='globalThis.driver.selectLoadout(12)'
                  style='width: 200px'
                >
                  Loadout 12
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load13'
                  onclick='globalThis.driver.selectLoadout(13)'
                  style='width: 200px'
                >
                  Loadout 13
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load14'
                  onclick='globalThis.driver.selectLoadout(14)'
                  style='width: 200px'
                >
                  Loadout 14
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load15'
                  onclick='globalThis.driver.selectLoadout(15)'
                  style='width: 200px'
                >
                  Loadout 15
                </button>
                <br></br>
                <button
                  class='loadoutbutton localized'
                  style='margin-bottom: 5px; margin-top: 3px'
                  onclick='globalThis.driver.saveList()'
                  data-locale='actions>tooltip>save_loadout'
                >
                </button>
                <button
                  class='loadoutbutton localized'
                  style='margin-bottom: 5px'
                  onclick='globalThis.driver.loadList()'
                  data-locale='actions>tooltip>load_loadout'
                >
                </button>
                <br></br>
                <input
                  id='renameLoadout'
                  value='Loadout Name'
                  style='width: 100px; height: 16px; border: 1px solid var(--input-border); margin-left: 5px; margin-bottom: 2px'
                >
                </input>
                <button
                  class='loadoutbutton'
                  style='margin-bottom: 5px; margin-top: 3px; margin-right: -4px'
                  onclick='globalThis.driver.nameList(true)'
                >
                  Rename
                </button>
              </div>
            </div>
            <select
              id='predictorTrackedStatInput'
              class='button'
              onchange="globalThis.saving.setOption('predictorTrackedStat', this.value)"
            >
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const Towns = () => (
  <div id='townColumn' style='width: 535px; vertical-align: top'>
    <div id='shortTownColumn'>
      <div id='townWindow' style='width: 100%; text-align: center; height: 34px'>
        <div
          style='float: left; margin-left: 150px'
          class='actionIcon fa fa-arrow-left'
          id='townViewLeft'
          onclick='globalThis.saving.view.showTown(globalThis.saving.vals.townsUnlocked[globalThis.saving.vals.townsUnlocked.indexOf(globalThis.globals.townshowing)-1])'
        >
        </div>
        <div class='showthat'>
          <div class='large bold'>
            <select class='bold' style='text-align: center' id='TownSelect'></select>
          </div>
          <div id='townDesc' class='showthis'></div>
        </div>
        <div
          style='float: right; margin-right: 150px'
          class='actionIcon fa fa-arrow-right'
          id='townViewRight'
          onclick='globalThis.saving.view.showTown(globalThis.saving.vals.townsUnlocked[globalThis.saving.vals.townsUnlocked.indexOf(globalThis.globals.townshowing)+1])'
        >
        </div>
        <div id='hideVarsButton' class='far fa-eye' onclick='globalThis.saving.view.toggleHiding()'></div>
      </div>
      <br></br>
      <div id='townInfos'>
        <div id='townInfo0' class='townInfo'></div>
        <div id='townInfo1' class='townInfo' style='display: none'></div>
        <div id='townInfo2' class='townInfo' style='display: none'></div>
        <div id='townInfo3' class='townInfo' style='display: none'></div>
        <div id='townInfo4' class='townInfo' style='display: none'></div>
        <div id='townInfo5' class='townInfo' style='display: none'></div>
        <div id='townInfo6' class='townInfo' style='display: none'></div>
        <div id='townInfo7' class='townInfo' style='display: none'></div>
        <div id='townInfo8' class='townInfo' style='display: none'></div>
      </div>

      <div id='townActionTitle' class='block showthat' style='text-align: center'>
        <div
          style='float: left; margin-left: 150px'
          class='actionIcon fa fa-arrow-left'
          id='actionsViewLeft'
          onclick='globalThis.saving.view.showActions(false)'
        >
        </div>
        <span class='large bold' id='actionsTitle'></span>
        <div class='showthis localized' data-locale='actions>tooltip>desc'></div>
        <div
          style='float: right; margin-right: 150px'
          class='actionIcon fa fa-arrow-right'
          id='actionsViewRight'
          onclick='globalThis.saving.view.showActions(true)'
        >
        </div>
      </div>
      <div id='townActions'>
        <div id='actionOptionsTown0' class='actionOptions'></div>
        <div id='actionOptionsTown1' class='actionOptions' style='display: none'></div>
        <div id='actionOptionsTown2' class='actionOptions' style='display: none'></div>
        <div id='actionOptionsTown3' class='actionOptions' style='display: none'></div>
        <div id='actionOptionsTown4' class='actionOptions' style='display: none'></div>
        <div id='actionOptionsTown5' class='actionOptions' style='display: none'></div>
        <div id='actionOptionsTown6' class='actionOptions' style='display: none'></div>
        <div id='actionOptionsTown7' class='actionOptions' style='display: none'></div>
        <div id='actionOptionsTown8' class='actionOptions' style='display: none'></div>
        <div id='actionStoriesTown0' class='actionStories' style='display: none'></div>
        <div id='actionStoriesTown1' class='actionStories' style='display: none'></div>
        <div id='actionStoriesTown2' class='actionStories' style='display: none'></div>
        <div id='actionStoriesTown3' class='actionStories' style='display: none'></div>
        <div id='actionStoriesTown4' class='actionStories' style='display: none'></div>
        <div id='actionStoriesTown5' class='actionStories' style='display: none'></div>
        <div id='actionStoriesTown6' class='actionStories' style='display: none'></div>
        <div id='actionStoriesTown7' class='actionStories' style='display: none'></div>
        <div id='actionStoriesTown8' class='actionStories' style='display: none'></div>
        <div id='addActionAtCapText' class='localized' data-locale='actions>tooltip>add_at_cap'></div>
      </div>
    </div>
    <div id='actionLogContainer'>
      <div
        id='actionLogTitle'
        class='large bold block localized'
        data-locale='actions>title_log'
        style='margin: 10px auto 2px auto; text-align: center'
      >
      </div>
      <ul id='actionLog'>
        <li
          id='actionLogLoadPrevious'
          class='small italic localized'
          data-locale='actions>log>load_previous'
          onclick='globalThis.globals.actionLog.loadHistory(5)'
        >
        </li>
        <li id='actionLogLatest' class='small italic localized' data-locale='actions>log>latest'></li>
      </ul>
    </div>
  </div>
);
const Stats = () => (
  <div id='statsColumn'>
    <div id='statsWindow' data-view='radar'>
      <div id='statsTitle' class='showthat block'>
        <div class='large bold localized' data-locale='stats>title'></div>
        <div class='showthis localized' data-locale='stats>tooltip>explanation' style='width: 550px'></div>
      </div>
      <div id='statViewSelector' class='block'>
        <input
          type='radio'
          id='regularStats'
          name='statView'
          onclick='globalThis.saving.view.changeStatView()'
          checked
        >
        </input>
        <label for='regularStats' class='localized' data-locale='stats>view>regular'></label>
        <input type='radio' id='radarStats' name='statView' onclick='globalThis.saving.view.changeStatView()'>
        </input>
        <label for='radarStats' class='localized' data-locale='stats>view>radar'></label>
      </div>
      <div class='showthat block' id='radarChart'>
        <svg id='statChart' class='radar-chart' viewBox='-200 -200 400 400' preserveAspectRatio='xMidYMin meet'>
        </svg>
        <div
          class='showthis localized'
          style='margin-top: 20px; width: 375px'
          data-locale='stats>tooltip>graph_legend'
        >
          gfv
        </div>
      </div>
      <div id='statsContainer'>
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
          onmouseover="globalThis.saving.view.showSkill('Combat')"
          onmouseout='globalThis.saving.view.showSkill(undefined)'
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
          onmouseover="globalThis.saving.view.showSkill('Magic')"
          onmouseout='globalThis.saving.view.showSkill(undefined)'
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
          onmouseover="globalThis.saving.view.showSkill('Practical')"
          onmouseout='globalThis.saving.view.showSkill(undefined)'
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
          onmouseover="globalThis.saving.view.showSkill('Alchemy')"
          onmouseout='globalThis.saving.view.showSkill(undefined)'
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
          onmouseover="globalThis.saving.view.showSkill('Dark')"
          onmouseout='globalThis.saving.view.showSkill(undefined)'
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
          onmouseover="globalThis.saving.view.showSkill('Crafting')"
          onmouseout='globalThis.saving.view.showSkill(undefined)'
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
          onmouseover="globalThis.saving.view.showSkill('Chronomancy')"
          onmouseout='globalThis.saving.view.showSkill(undefined)'
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
          onmouseover="globalThis.saving.view.showSkill('Pyromancy')"
          onmouseout='globalThis.saving.view.showSkill(undefined)'
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
          onmouseover="globalThis.saving.view.showSkill('Restoration')"
          onmouseout='globalThis.saving.view.showSkill(undefined)'
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
          onmouseover="globalThis.saving.view.showSkill('Spatiomancy')"
          onmouseout='globalThis.saving.view.showSkill(undefined)'
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
          onmouseover="globalThis.saving.view.showSkill('Mercantilism')"
          onmouseout='globalThis.saving.view.showSkill(undefined)'
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
          onmouseover="globalThis.saving.view.showSkill('Divine')"
          onmouseout='globalThis.saving.view.showSkill(undefined)'
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
          onmouseover="globalThis.saving.view.showSkill('Commune')"
          onmouseout='globalThis.saving.view.showSkill(undefined)'
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
          onmouseover="globalThis.saving.view.showSkill('Gluttony')"
          onmouseout='globalThis.saving.view.showSkill(undefined)'
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
          onmouseover="globalThis.saving.view.showSkill('Wunderkind')"
          onmouseout='globalThis.saving.view.showSkill(undefined)'
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
          onmouseover="globalThis.saving.view.showSkill('Thievery')"
          onmouseout='globalThis.saving.view.showSkill(undefined)'
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
          onmouseover="globalThis.saving.view.showSkill('Leadership')"
          onmouseout='globalThis.saving.view.showSkill(undefined)'
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
          onmouseover="globalThis.saving.view.showSkill('Assassin')"
          onmouseout='globalThis.saving.view.showSkill(undefined)'
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
        <div id='buffsContainer' style='display: flex; flex-direction: column'></div>
      </div>
    </div>
  </div>
);

export const Application = () => {
  return (
    <>
      <Header />
      <Actions />
      <Towns />
      <Stats />
      <WelcomeMessage />
    </>
  );
};
