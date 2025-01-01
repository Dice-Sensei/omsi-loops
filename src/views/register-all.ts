const getDisabledMenus = () => {
  let disabledMenus = [];

  try {
    disabledMenus = JSON.parse(localStorage.getItem('disabledMenus')) ?? disabledMenus;
  } catch {}

  return disabledMenus;
};

const buffsContainer = {
  selector: '#buffsContainer',
  html() {
    let html = '';

    for (const name of buffList) {
      const fullName = Buff.fullNames[name];
      const XMLName = getXMLName(fullName);
      const desc2 = globalThis.Localization.txtsObj(`buffs>${XMLName}`)[0].innerHTML.includes('desc2');

      html += `
        <div 
          class="buffContainer showthat" 
          id="buff${name}Container" 
          onmouseover="view.showBuff('${name}')" 
          onmouseout="view.showBuff(undefined)">
          <div class="buffNameContainer">
            <img class="buffIcon" src="icons/${globalThis.helpers.camelize(fullName)}.svg">
            <div class="skillLabel medium bold">${globalThis.Localization.txt(`buffs>${XMLName}>label`)}</div>
            <div class="showthis">
              <span>${globalThis.Localization.txt(`buffs>${XMLName}>desc`)}</span>
              <br>
              ${desc2 ? `<span class="localized" data-locale="buffs>${XMLName}>desc2"></span>` : ''}
            </div>
          </div>
          <div class="buffNumContainer">
            <div id="buff${name}Level">0/</div>
            <input 
              type="number" 
              id="buff${name}Cap" 
              class="buffmaxinput" 
              value="${buffHardCaps[name]}" 
              onchange="updateBuffCaps()">
          </div>
        </div>
      `;
    }

    return html;
  },
};

const menu = {
  selector: '#menu',
  html() {
    let html = '';
    html += menu.htmlMenusMenu();
    html += menu.htmlChangelog();
    html += menu.htmlSaveMenu();
    html += menu.htmlFAQMenu();
    html += menu.htmlOptionsMenu();
    html += menu.htmlExtrasMenu();
    html += menu.htmlChallengeMenu();
    html += menu.htmlTotalsMenu();
    html += menu.htmlPrestigeMenu();
    return html;
  },
  htmlMenusMenu() {
    const menus = [
      'changelog',
      'save',
      'faq',
      'options',
      'extras',
      'challenges',
      'totals',
      'prestige_bonus',
    ];
    const disabledMenus = getDisabledMenus();
    const html = `
      <li id='menusMenu' tabindex='0' style='display:inline-block;height:30px;margin-right:10px;' class='showthatH${
      menus.map((menu) => disabledMenus.includes(menu) ? ` disabled-${menu}` : '').join('')
    }'>
        <i class='fas fa-bars'></i>
        <div class='showthisH' id='menus'>
          <ul>
            ${
      menus.map((menu) => `
              <li>
                <input type='checkbox' id='enableMenu_${menu}' data-menu='${menu}' onchange='onEnableMenu(this)' 
                ${disabledMenus.includes(menu) ? '' : 'checked'}>
                        <label for='enableMenu_${menu}'>${
        globalThis.Localization.txt(`menu>${menu}>meta>title`)
      }</label>
                    </li>`).join('\n')
    }
                </ul>
            </div>
      </li>
        `;
    return html;
  },
  versions() {
    let html = '';
    const versions = globalThis.Localization.txtsObj('menu>changelog>version');
    $(versions).each((_index, version) => {
      const caption = $(version).attr('caption');
      const verNum = $(version).attr('verNum');
      html += `
                    <li class='showthat2' tabindex='0' ${verNum ? `data-verNum="${verNum}"` : ''}>
                        ${
        caption ? caption : `${globalThis.Localization.txt('menu>changelog>meta>version_prefix')} ${verNum}`
      }
                        <div class='showthis2'>
                            ${$(version).text()}
                        </div>
                    </li>`;
    });
    return html;
  },
  htmlChangelog() {
    const html =
      `<li id='changelogMenu' tabindex='0' style='display:inline-block;height:30px;margin-left:10px;' class='showthatH'>
            ${globalThis.Localization.txt('menu>changelog>meta>title')}
            <ul class='showthisH' id='changelog'>
                ${this.versions()}
            </ul>
        </li>`;
    return html;
  },
  htmlSaveMenu() {
    const html =
      `<li id='saveMenu' tabindex='0' style='display:inline-block;height:30px;margin-left:10px;' class='showthatH'>
            ${globalThis.Localization.txt('menu>save>meta>title')}
            <div class='showthisH'>
                <button class='button' onclick='globalThis.saving.save()'>${
        globalThis.Localization.txt('menu>save>manual_save')
      }</button>
                <br>
                <textarea id='exportImportList'></textarea><label for='exportImportList'> ${
        globalThis.Localization.txt('menu>save>list_label')
      }</label>
                <br>
                <button class='button' style='margin-right: 2px;' onclick='globalThis.saving.exportCurrentList()'>${
        globalThis.Localization.txt('menu>save>export_button')
      }</button>
                <button class='button' onclick='globalThis.saving.importCurrentList()'>${
        globalThis.Localization.txt('menu>save>import_button')
      }</button>
                <br>
                ${globalThis.Localization.txt('menu>save>list_comment')}
                <br><br>
                <input id='exportImport'><label for='exportImport'> ${
        globalThis.Localization.txt('menu>save>input_label')
      }</label><br>
                <button class='button' style='margin-top: 5px; margin-right: 2px;' onclick='globalThis.saving.exportSave()'>${
        globalThis.Localization.txt('menu>save>export_button')
      }</button>
                <button class='button' style='margin-top: 1px;' onclick='globalThis.saving.importSave()'>${
        globalThis.Localization.txt('menu>save>import_button')
      }</button><br>
                ${globalThis.Localization.txt('menu>save>export_comment')}<br>
                ${globalThis.Localization.txt('menu>save>import_comment')}<br>
                <button class='button' style='margin-top: 5px; margin-right: 2px;' onclick='globalThis.saving.exportSaveFile()'>${
        globalThis.Localization.txt('menu>save>exportfile_button')
      }</button>
                <button class='button' style='margin-top: 1px;' onclick='globalThis.saving.openSaveFile()'>${
        globalThis.Localization.txt('menu>save>importfile_button')
      }</button>
                <input id="SaveFileInput" type='file' style="visibility:hidden;" onchange="globalThis.saving.importSaveFile(event)" />
                <br>
            </div>
        </li>`;
    return html;
  },
  FAQs() {
    return Array.from(globalThis.Localization.txtsObj('menu>faq>q_a')).map((QA) => `
      <li class='showthat2' tabindex='0'>
        ${$(QA).find('q').html()}
        <div class='showthis2'>
          ${$(QA).find('a').html()}
        </div>
      </li>
    `).join('');
  },
  htmlFAQMenu() {
    return `
      <li id='faqMenu' tabindex='0' style='display:inline-block;height:30px;margin-left:10px;' class='showthatH'>
        ${globalThis.Localization.txt('menu>faq>meta>title')}
        <ul class='showthisH' id="faq">
          ${this.FAQs()}
        </ul>
      </li>
    `;
  },
  htmlOptionsMenu() {
    return `
      <li id='optionsMenu' tabindex='0' style='display:inline-block;height:30px;margin-left:10px;' class='showthatH'>
        ${globalThis.Localization.txt('menu>options>meta>title')}
        <div class='showthisH'>
          <a target='_blank' href='${globalThis.Localization.txt('menu>options>discord>link')}'>
            ${globalThis.Localization.txt('menu>options>discord>title')}
          </a><br>
          ${menu.htmlThemeMenu()}
          ${menu.htmlLocalizationMenu()}
          ${globalThis.Localization.txt('menu>options>adblock_warning')}<br>
          <input id='responsiveUIInput' type='checkbox' onchange='globalThis.saving.setOption("responsiveUI", this.checked)'/>
          <label for='responsiveUIInput'>${globalThis.Localization.txt('menu>options>responsive_ui')}</label>
          <br>
          <input id='actionLogInput' type='checkbox' onchange='globalThis.saving.setOption("actionLog", this.checked)'/>
          <label for='actionLogInput'>${globalThis.Localization.txt('menu>options>action_log')}</label>
          <br>
          <input id='highlightNewInput' type='checkbox' onchange='globalThis.saving.setOption("highlightNew", this.checked)'/>
          <label for='highlightNewInput'>${globalThis.Localization.txt('menu>options>highlight_new')}</label>
          <br>
          <input id='statColorsInput' type='checkbox' onchange='globalThis.saving.setOption("statColors", this.checked)'/>
          <label for='statColorsInput'>${globalThis.Localization.txt('menu>options>stat_colors')}</label>
          <br>
          <input id='statHintsInput' type='checkbox' onchange='globalThis.saving.setOption("statHints", this.checked)'/>
          <label for='statHintsInput'>${globalThis.Localization.txt('menu>options>stat_hints')}</label>
          <br>
          <input id='pingOnPauseInput' type='checkbox' onchange='globalThis.saving.setOption("pingOnPause", this.checked)'/>
          <label for='pingOnPauseInput'>${globalThis.Localization.txt('menu>options>pause_audio_cue')}</label>
          <br>
          <input id='notifyOnPauseInput' type='checkbox' onchange='globalThis.saving.setOption("notifyOnPause", this.checked)'/>
          <label for='notifyOnPauseInput'>${globalThis.Localization.txt('menu>options>pause_notify_cue')}</label>
          <br>
          <input id='autoMaxTrainingInput' type='checkbox' onchange='globalThis.saving.setOption("autoMaxTraining", this.checked)'/>
          <label for='autoMaxTrainingInput'>${globalThis.Localization.txt('menu>options>auto_max_training')}</label>
          <br>
          <input id='hotkeysInput' type='checkbox' onchange='globalThis.saving.setOption("hotkeys", this.checked)'/>
              <label class='showthat' for='hotkeysInput'>${globalThis.Localization.txt('menu>options>hotkeys')}
              <div class='showthis'>${globalThis.Localization.txt('menu>options>hotkeys_tooltip')}</div>
          </label>
          <br>
          ${globalThis.Localization.txt('menu>options>update_rate')}
          <input id='updateRateInput' type='number' value='50' min='1' style='width: 50px;transform: translateY(-2px);' oninput='globalThis.saving.setOption("updateRate", parseInt(this.value))' />
          <br>
          ${globalThis.Localization.txt('menu>options>autosave_rate')}
          <input id='autosaveRateInput' type='number' value='30' min='1' style='width: 50px;transform: translateY(-2px);' oninput='globalThis.saving.setOption("autosaveRate", parseInt(this.value))' />
          <br>
        </div>
      </li>
    `;
  },
  htmlLocalizationMenu() {
    const options = Object.entries(globalThis.Localization.languages).map(([value, str]) => {
      return `<option value='${value}'>${str}</option>`;
    }).join('');

    return `
      <div>
        <span>${globalThis.Localization.txt('menu>options>localization_title')}:</span>
        <select id='localization_menu' onchange='globalThis.Localization.change()'>
          ${options}
        </select>
      </div>
      <br>
    `;
  },
  htmlThemeMenu() {
    const themeList = ['normal', 'dark', 'cubic', 'cubic t-dark', 'zen', 'zen t-dark'];

    const themes = globalThis.Localization.txtsObj('menu>options>theme');

    let html = `${
      globalThis.Localization.txt('menu>options>theme_title')
    }: <select id='themeInput' onchange='view.changeTheme();'>`;

    $(themes).each((index, theme) => {
      html += `<option value='${themeList[index]}'>${
        $(theme).find(themeList[index].replaceAll(' ', '_')).text()
      }</option>`;
    });
    html += '</select><br>';
    html += `<div class='block' id='themeVariantSection'>${
      globalThis.Localization.txt('menu>options>theme_variant_title')
    }: <select id='themeVariantInput' onchange='view.changeTheme();'>`;
    $(themes).each((index, theme) => {
      $(theme).find('variants>*').each((vindex, variant) => {
        html += `<option class='variant-${themeList[index].replaceAll(' ', '_')}' value='${variant.tagName}'>${
          $(variant).text()
        }</option>`;
      });
    });
    html += '</select></div>';
    return html;
  },
  htmlExtrasMenu() {
    const html =
      `<li id='extrasMenu' tabindex='0' style='display:inline-block;height:30px;margin-left:10px;' class='showthatH'>
            ${globalThis.Localization.txt('menu>extras>meta>title')}
            <div class='showthisH' style='padding-top:1ex'>
                ${globalThis.Localization.txt('menu>options>extras_warning')}<br>
                <br>
                <input id='fractionalManaInput' type='checkbox' onchange='globalThis.saving.setOption("fractionalMana", this.checked)'/>
                    <label for='fractionalManaInput'>${
        globalThis.Localization.txt('menu>options>fractional_mana')
      }</label>
                <br>
                <input id='predictorInput' type='checkbox' onchange='globalThis.saving.setOption("predictor", this.checked)'/>
                    <label for='predictorInput'>${globalThis.Localization.txt('menu>options>predictor')}</label>
                <br>
                <div class='control'>
                    <input type='checkbox' id='speedIncrease10xInput' onchange='globalThis.saving.setOption("speedIncrease10x", this.checked)'>
                    <label for='speedIncrease10xInput'>${
        globalThis.Localization.txt('menu>options>speedIncrease10x_text')
      }</label>
                </div>
                <br>
                <div class='control'>
                    <input type='checkbox' id='speedIncrease20xInput' onchange='globalThis.saving.setOption("speedIncrease20x", this.checked)'>
                    <label for='speedIncrease20xInput'>${
        globalThis.Localization.txt('menu>options>speedIncrease20x_text')
      }</label>
                </div>
                <br>
                ${globalThis.Localization.txt('menu>options>speedIncreaseCustom_text')}
                <input id='speedIncreaseCustomInput' type='number' value='5' min='1' style='width: 50px;transform: translateY(-2px);' oninput='globalThis.saving.setOption("speedIncreaseCustom", parseInt(this.value))' />
                <br>
                ${globalThis.Localization.txt('menu>options>speedIncreaseBackground_text')}
                <input id='speedIncreaseBackgroundInput' type='number' value='' placeholder='same' min='0' style='width: 50px;transform: translateY(-2px);' oninput='globalThis.saving.setOption("speedIncreaseBackground", parseFloat(this.value))' />
                <div id='speedIncreaseBackgroundWarning' class='small block' style='display:none'>${
        globalThis.Localization.txt('menu>options>speedIncreaseBackground_warning')
      }</div>
                <br>
                <button id='borrowTimeButton' class='button showthat control' onclick='borrowTime()'>${
        globalThis.Localization.txt('menu>options>borrow_time')
      }
                    <div class='showthis'>${globalThis.Localization.txt('menu>options>borrow_time_tooltip')}</div>
                </button>
                <div class='show-when-time-borrowed'>
                    <button id='returnTimeButton' class='button control' onclick='returnTime()'>${
        globalThis.Localization.txt('menu>options>return_time')
      }</button>
                    ${globalThis.Localization.txt('menu>options>time_borrowed')} <span id='borrowedTimeDays'></span>
                </div><br>
                <div id='predictorSettings'>
                    <br>
                    <b>${globalThis.Localization.txt('predictor>settings')}</b>
                    <br>
                    <input id='predictorBackgroundThreadInput' type='checkbox' onchange='globalThis.saving.setOption("predictorBackgroundThread", this.checked)'>
                    <label for='predictorBackgroundThreadInput'>${
        globalThis.Localization.txt('predictor>background_thread')
      }</label>
                    <br>
                    <label for='predictorTimePrecisionInput'>${
        globalThis.Localization.txt('predictor>time_precision')
      }</label>
                    <input id='predictorTimePrecisionInput' type='number' value='1' min='1' max='10' style='width: 50px;' oninput='globalThis.saving.setOption("predictorTimePrecision", parseInt(this.value))'>
                    <br>
                    <label for='predictorNextPrecisionInput'>${
        globalThis.Localization.txt('predictor>next_precision')
      }</label>
                    <input id='predictorNextPrecisionInput' type='number' value='2' min='1' max='10' style='width: 50px;' oninput='globalThis.saving.setOption("predictorNextPrecision", parseInt(this.value))'>
                    <br>
                    <label for='predictorActionWidthInput'>${
        globalThis.Localization.txt('predictor>action_list_width')
      }</label>
                    <input id='predictorActionWidthInput' type='number' value='500' min='100' max='4000' style='width: 50px; margin-left:40px' oninput='globalThis.saving.setOption("predictorActionWidth", parseInt(this.value))'>
                    <br>
                    <input id='predictorRepeatPredictionInput' type='checkbox' onchange='globalThis.saving.setOption("predictorRepeatPrediction", this.checked)'>
                    <label for='predictorRepeatPredictionInput'>${
        globalThis.Localization.txt('predictor>repeat_last_action')
      }</label>
                    <br>
                    <input id='predictorSlowModeInput' type='checkbox' onchange='globalThis.saving.setOption("predictorSlowMode", this.checked)'>
                    <label for='predictorSlowModeInput'>${
        globalThis.Localization.txt('predictor>slow_mode')
          .replace(
            '{slowMode}',
            `<input id='predictorSlowTimerInput' type='number' value='1' min='1' style='width: 20px;' oninput='globalThis.saving.setOption("predictorSlowTimer", parseInt(this.value))'>`,
          )
      }</label>
                </div>
            </div>
        </li>`;
    return html;
  },
  htmlChallengeMenu() {
    const html =
      `<li id='challengesMenu' tabindex='0' style='display:inline-block;height:30px;margin-left:10px;' class='showthatH'>
            ${globalThis.Localization.txt('menu>challenges>meta>title')}
            <div class='showthisH'>
                ${this.challenges()}
            </div>
        </li>`;
    return html;
  },
  htmlTotalsMenu() {
    const html =
      `<li id='totalsMenu' tabindex='0' style='display:inline-block;height:30px;margin-left:10px;' class='showthatH'>
            ${globalThis.Localization.txt('menu>totals>meta>title')}
            <div class='showthisH'>
                ${this.totals()}
            </div>
        </li>`;
    return html;
  },
  htmlPrestigeMenu() {
    const html =
      `<li id='prestige_bonusesMenu' tabindex='0' style='display:inline-block;height:30px;margin-left:10px;' class='showthatH'>
            ${globalThis.Localization.txt('menu>prestige_bonus>meta>title')}
            <div class='showthisH'>
                ${this.prestige_bonuses()}
            </div>
        </li>`;
    return html;
  },
  challenges() {
    let html = `<div>Challenges are special modes that impose special conditions and heavy restrictions.<br> 
            They give no rewards ard are just here for fun.<br>
            It is only recommended to try them after beating the main game.<br>
            Please export and save your data locally before starting.<br>
            <b>Beginning a challenge will permanently delete your current save.</b><br>
            `;
    if (challengeSave.challengeMode !== 0 || 1 === 1) {
      html +=
        `<button class='button showthat control' style='margin-top: 2px;' onclick='globalThis.saving.exitChallenge()'>Exit Challenge 
                </button>
                <button class='button showthat control' style='margin-top: 2px;' onclick='globalThis.saving.resumeChallenge()'>Resume Challenge 
                </button><br>`;
    }
    html +=
      `<button class='button showthat control' style='margin-top: 2px;' onclick='globalThis.saving.beginChallenge(1)'>Mana Drought 
            <div class='showthis' style='color:var(--default-color);width:230px;margin-left:100px;'>${
        globalThis.Localization.txt('menu>challenges>mana_drought')
      }</div>
        </button><br>
        <button class='button showthat control' style='margin-top: 2px;' onclick='globalThis.saving.beginChallenge(2)'>Noodle Arms
            <div class='showthis' style='color:var(--default-color);width:230px;margin-left:100px;'>${
        globalThis.Localization.txt('menu>challenges>noodle_arms')
      }</div>
        </button><br>
        <button class='button showthat control' style='margin-top: 2px;' onclick='globalThis.saving.beginChallenge(3)'>Mana Burn
            <div class='showthis' style='color:var(--default-color);width:230px;margin-left:100px;'>${
        globalThis.Localization.txt('menu>challenges>mana_burn')
      }</div>
        </button><br>`;
    html += `</div>`;
    return html;
  },
  totals() {
    let html = `<div>
        Effective Time: <div id='totalEffectiveTime'></div><br>
        Running Time: <div id='totalPlaytime'></div><br>
        <span class='show-when-time-borrowed'>${
      globalThis.Localization.txt('menu>options>time_borrowed')
    } <div id='borrowedTimeBalance'></div><br></span>
        Loops: <div id='totalLoops'></div><br>
        Actions: <div id='totalActions'></div><br>
        </div>`;
    return html;
  },
  prestige_bonuses() {
    let html = `<div><br> 
        Prestige bonuses are always active.<br>
        Each time you complete the game, you receive 90 points to spend on these bonuses.<br>
        Please export and save your data locally before attempting to trigger a prestige.<br>
        <br>
        <b>The ability to spec into prestige bonuses may be done at any time, but keep in mind this will reset ALL progress.</b>
        <br><br>
        Imbue Soul levels will carry over between prestiges, up to the maximum number of prestiges you've completed. <br>
        Max carryover possible: <div id='maxTotalImbueSoulLevels'></div>
        <br>
        <br><br><br>
        <b>Total Prestiges Completed: <div id='currentPrestigesCompleted'></div></b><br>
        Available points: <div id='currentPrestigePoints'></div> / <div id='totalPrestigePoints'></div>
        <br>
        Upgrade cost follows the format of: 
        <br>
        30 -> 40 -> 55 -> 75 -> 100 -> 130 -> ...
        <br>

        `;
    html += `
        <br>
        <button class='button showthat control' style='margin-top: -50px;' onclick='globalThis.prestige.prestigeUpgrade("PrestigePhysical")'>Prestige Physical
            <div class='showthis' style='color:var(--default-color);width:230px;margin-left:200px;'>${
      globalThis.Localization.txt('menu>prestige_bonus>PrestigePhysical')
    }
                <br><br>
                Current Bonus: <div id='prestigePhysicalCurrentBonus'></div>%<br>
                Next level cost: <div id='prestigePhysicalNextCost'></div> points<br> 
            </div>
        </button><br>

        <button class='button showthat control' style='margin-top: -50px;' onclick='globalThis.prestige.prestigeUpgrade("PrestigeMental")'>Prestige Mental
        <div class='showthis' style='color:var(--default-color);width:230px;margin-left:200px;'>${
      globalThis.Localization.txt('menu>prestige_bonus>PrestigeMental')
    }
            <br><br>
            Current Bonus: <div id='prestigeMentalCurrentBonus'></div>%<br>
            Next level cost: <div id='prestigeMentalNextCost'></div> points<br> 
        </div>
        </button><br>


        <button class='button showthat control' style='margin-top: -50px;' onclick='globalThis.prestige.prestigeUpgrade("PrestigeCombat")'>Prestige Combat
            <div class='showthis' style='color:var(--default-color);width:230px;margin-left:200px;'>${
      globalThis.Localization.txt('menu>prestige_bonus>PrestigeCombat')
    }
                <br><br>
                Current Bonus: <div id='prestigeCombatCurrentBonus'></div>%<br>
                Next level cost: <div id='prestigeCombatNextCost'></div> points<br> 
            </div>
        </button><br>

        <button class='button showthat control' style='margin-top: -50px;' onclick='globalThis.prestige.prestigeUpgrade("PrestigeSpatiomancy")'>Prestige Spatiomancy
            <div class='showthis' style='color:var(--default-color);width:230px;margin-left:200px;'>${
      globalThis.Localization.txt('menu>prestige_bonus>PrestigeSpatiomancy')
    }
                <br><br>
                Current Bonus: <div id='prestigeSpatiomancyCurrentBonus'></div>%<br>
                Next level cost: <div id='prestigeSpatiomancyNextCost'></div> points<br> 
            </div>
        </button><br>

        <button class='button showthat control' style='margin-top: -50px;' onclick='globalThis.prestige.prestigeUpgrade("PrestigeChronomancy")'>Prestige Chronomancy
            <div class='showthis' style='color:var(--default-color);width:230px;margin-left:200px;'>${
      globalThis.Localization.txt('menu>prestige_bonus>PrestigeChronomancy')
    }
                <br><br>
                Current Bonus: <div id='prestigeChronomancyCurrentBonus'></div>%<br>
                Next level cost: <div id='prestigeChronomancyNextCost'></div> points<br> 
            </div>
        </button><br>

        <button class='button showthat control' style='margin-top: -50px;' onclick='globalThis.prestige.prestigeUpgrade("PrestigeBartering")'>Prestige Bartering
            <div class='showthis' style='color:var(--default-color);width:230px;margin-left:200px;'>${
      globalThis.Localization.txt('menu>prestige_bonus>PrestigeBartering')
    }
                <br><br>
                Current Bonus: <div id='prestigeBarteringCurrentBonus'></div>%<br>
                Next level cost: <div id='prestigeBarteringNextCost'></div> points<br> 
            </div>
        </button><br>

        <button class='button showthat control' style='margin-top: -50px;' onclick='globalThis.prestige.prestigeUpgrade("PrestigeExpOverflow")'>Prestige Experience Overflow
            <div class='showthis' style='color:var(--default-color);width:230px;margin-left:200px;'>${
      globalThis.Localization.txt('menu>prestige_bonus>PrestigeExpOverflow')
    }
                <br><br>
                Current Bonus: <div id='prestigeExpOverflowCurrentBonus'></div>%<br>
                Next level cost: <div id='prestigeExpOverflowNextCost'></div> points<br> 
            </div>
        </button><br>

        <br><br>

        <button class='button showthat control' style='margin-top: -50px;' onclick='globalThis.prestige.resetAllPrestiges()'>Reset All Prestiges
            <div class='showthis' style='color:var(--default-color);width:230px;margin-left:200px;'>${
      globalThis.Localization.txt('menu>prestige_bonus>PrestigeResetAll')
    }
            </div>
        </button><br>

        `;
    return html;
  },
};

const timeControls = {
  selector: '#timeControls',
  html() {
    const stories = () => {
      let html = '';
      globalThis.Localization.txtsObj('time_controls>stories>story').each((index, story) => {
        html += `
          <div id='story${$(story).attr('num')}'>
            ${$(story).text()}
          </div>
        `;
      });

      return html;
    };

    return `
      <div id='timeControlsMain'>
        <button id='pausePlay' onclick='pauseGame()'' class='button control'>
          ${globalThis.Localization.txt('time_controls>pause_button')}
        </button>
        <button onclick='manualRestart()' class='button showthatO control'>
          ${globalThis.Localization.txt('time_controls>restart_button')}
          <div class='showthis' style='color:var(--default-color);width:230px;'>
          ${globalThis.Localization.txt('time_controls>restart_text')}</div>
        </button>
        <input id='bonusIsActiveInput' type='checkbox' onchange='setOption("bonusIsActive", this.checked)'/>
        <button class='button showthatO control' onclick='toggleOffline()'>
          ${globalThis.Localization.txt('time_controls>bonus_seconds>title')}
          <div class='showthis' id='bonusText' style='max-width:500px;color:var(--default-color);'>
            ${view.getBonusText()}
          </div>
        </button>
        <div class='control'>
          <div tabindex='0' id='story_control' class='showthatH' onmouseover='view.updateStory(storyShowing)' onfocus='view.updateStory(storyShowing)' style='height:30px;'>
            <div class='large bold'>
              ${globalThis.Localization.txt('time_controls>story_title')}
            </div>
            <div id='newStory' style='color:var(--alert-color);display:none;'>(!)</div>
            <div id='story_tooltip' class='showthisH' style='width:400px;'>
              <button style='margin-left:175px;' class='actionIcon fa fa-arrow-left control' id='storyLeft' onclick='view.updateStory(storyShowing-1)'></button>
              <div style='' id='storyPage' class='bold control'></div>
              <button style='' class='actionIcon fa fa-arrow-right control' id='storyRight' onclick='view.updateStory(storyShowing+1)'></button>
              ${stories()}
            </div>
          </div>
        </div>
      </div>
      <div id='timeControlsOptions'>
        <div class='control'>
          <input type='checkbox' id='pauseBeforeRestartInput' onchange='globalThis.saving.setOption("pauseBeforeRestart", this.checked)'>
          <label for='pauseBeforeRestartInput'>${
      globalThis.Localization.txt('time_controls>pause_before_restart')
    }</label>
        </div>
        <div class='control'>
          <input type='checkbox' id='pauseOnFailedLoopInput' onchange='globalThis.saving.setOption("pauseOnFailedLoop", this.checked)'>
          <label for='pauseOnFailedLoopInput'>${
      globalThis.Localization.txt('time_controls>pause_on_failed_loop')
    }</label>
        </div>
        <div class='control'>
          <input type='checkbox' id='pauseOnCompleteInput' onchange='globalThis.saving.setOption("pauseOnComplete", this.checked)'>
          <label for='pauseOnCompleteInput'>${globalThis.Localization.txt('time_controls>pause_on_complete')}</label>
        </div>
      </div>
    `;
  },
};

const trackedResources = {
  selector: '#trackedResources',
  html() {
    let html = '';

    const resources = globalThis.Localization.txtsObj('tracked_resources>resource');

    $(resources).each((_index, resource) => {
      const hasCount = !$(resource).attr('no_count');
      const resetOnRestart = !$(resource).attr('no_reset_on_restart');
      const isHidden = $(resource).attr('initially_hidden');

      html += `
        <div class='showthat resource'${isHidden ? ` style='display:none' id='${$(resource).attr('id')}Div'` : ''}>
          <div class='bold'>${$(resource).find('title').text()}</div>
          ${hasCount ? `<div id='${$(resource).attr('id')}'>0</div>` : ''}
          <div class='showthis'>
            ${$(resource).find('desc').text()}
            ${resetOnRestart ? `<br>${globalThis.Localization.txt('tracked_resources>reset_on_restart_txt')}` : ''}
          </div>
        </div>
      `;
    });

    return html;
  },
};

const views = [
  buffsContainer,
  menu,
  timeControls,
  trackedResources,
];

globalThis.onEnableMenu = (input) => {
  const menu = input.dataset.menu;
  globalThis.helpers.htmlElement('menusMenu').classList.toggle(`disabled-${menu}`, !input.checked);

  const disabledMenus = getDisabledMenus();

  const index = disabledMenus.indexOf(menu);
  if (index === -1 && !input.checked) {
    disabledMenus.push(menu);
  } else if (index >= 0 && input.checked) {
    disabledMenus.splice(index, 1);
  }

  localStorage.setItem('disabledMenus', JSON.stringify(disabledMenus));
};

export const renderViews = () => {
  for (const { selector, html } of views) {
    const element = document.querySelector(selector);
    if (!element) throw Error(`Invalid selector for view ${selector}`);

    element.innerHTML = html();
  }
};
