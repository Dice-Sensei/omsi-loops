import { view } from './views/main.view.ts';
import {
  beginChallenge,
  exitChallenge,
  exportCurrentList,
  exportSave,
  exportSaveFile,
  importCurrentList,
  importSave,
  importSaveFile,
  openSaveFile,
  resumeChallenge,
  save,
  setOption,
  vals,
} from './saving.ts';
import { t } from './locales/translations.utils.ts';

import { WelcomeMessage } from './modules/WelcomeMessage.tsx';
import { actionLog } from './globals.ts';
import { capAllTraining, clearList, loadList, nameList, saveList, selectLoadout } from './driver.ts';
import { createKeyboardHotkeys } from './keyboard.hotkeys.ts';
import { actionAmount, setActionAmount } from './values.ts';
import { createSignal } from 'solid-js';
import { Button } from './components/buttons/Button/Button.tsx';
import { NumberField } from './components/forms/NumberField.tsx';
import { Localization } from './localization.ts';
import { EventType } from './components/forms/InputField.tsx';

const [disabledMenus, setDisabledMenus] = createSignal<string[]>([]);

const onEnableMenu = (event: EventType<HTMLInputElement>) => {
  const input = event.currentTarget;

  const menu = input.dataset.menu!;
  document.getElementById('menusMenu')?.classList.toggle(`disabled-${menu}`, !input.checked);

  const menus = disabledMenus();
  const index = menus.indexOf(menu);
  if (index === -1 && !input.checked) {
    menus.push(menu);
  } else if (index >= 0 && input.checked) {
    menus.splice(index, 1);
  }

  setDisabledMenus(menus);
};

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
    <menu id='menu' style='float: left; height: 30px; margin-left: 24px; margin-right: -24px'>
      <li
        id='menusMenu'
        tabindex='0'
        style='display:inline-block;height:30px;margin-right:10px;'
        class='w-8 h-8 showthatH'
      >
        <i class='fas fa-bars w-8 h-8 block'></i>
        <div class='showthisH' id='menus'>
          <ul>
            <li>
              <input
                type='checkbox'
                id='enableMenu_changelog'
                data-menu='changelog'
                onChange={(e) => onEnableMenu(this)}
                onchange='onEnableMenu(this)'
                checked=''
              >
              </input>
              <label for='enableMenu_changelog'>Changelog</label>
            </li>
            <li>
              <input type='checkbox' id='enableMenu_save' data-menu='save' onchange='onEnableMenu(this)' checked=''>
              </input>
              <label for='enableMenu_save'>Saving</label>
            </li>
            <li>
              <input type='checkbox' id='enableMenu_faq' data-menu='faq' onchange='onEnableMenu(this)' checked=''>
              </input>
              <label for='enableMenu_faq'>FAQ</label>
            </li>
            <li>
              <input
                type='checkbox'
                id='enableMenu_options'
                data-menu='options'
                onchange='onEnableMenu(this)'
                checked=''
              >
              </input>
              <label for='enableMenu_options'>Options</label>
            </li>

            <li>
              <input type='checkbox' id='enableMenu_extras' data-menu='extras' onchange='onEnableMenu(this)' checked=''>
              </input>
              <label for='enableMenu_extras'>Extras</label>
            </li>

            <li>
              <input
                type='checkbox'
                id='enableMenu_challenges'
                data-menu='challenges'
                onchange='onEnableMenu(this)'
                checked=''
              >
              </input>
              <label for='enableMenu_challenges'>Challenges</label>
            </li>

            <li>
              <input type='checkbox' id='enableMenu_totals' data-menu='totals' onchange='onEnableMenu(this)' checked=''>
              </input>
              <label for='enableMenu_totals'>Totals</label>
            </li>

            <li>
              <input
                type='checkbox'
                id='enableMenu_prestige_bonus'
                data-menu='prestige_bonus'
                onchange='onEnableMenu(this)'
                checked=''
              >
              </input>
              <label for='enableMenu_prestige_bonus'>Prestige Perks</label>
            </li>
          </ul>
        </div>
      </li>
      <li id='changelogMenu' tabindex='0' style='display:inline-block;height:30px;margin-left:10px;' class='showthatH'>
        Changelog
        <ul class='showthisH' id='changelog'>
          <li class='showthat2' tabindex='0'>
            Latest
            <div class='showthis2'>
              <b>Recent changes</b>
              • Fixed the first Wander action failing when fractional mana consumption is enabled in Extras.<br></br>
              • The two-column layout in the responsive UI now sets a minimum height for the Action List.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3P.1.1'>
            Version 3P.1.1
            <div class='showthis2'>
              <b>Mar 1st, 2024</b>
              • The Action List no longer completely redraws itself with every change you make, so the UI should feel
              somewhat snappier.<br></br>
              • The predictor now waits 100ms after starting a prediction before marking the existing one as stale. If
              the prediction finishes within that time, it avoids some UI flashing.<br></br>
              • The action buttons on the Action List now show their keyboard-focus state visibly, and when they are
              sharing space with the predictor, having keyboard focus will keep them expanded. Click away from the
              action list if you want to see the predictor stats again.<br></br>
              • The predictor will try a little harder to keep the tracked stat dropdown in sync with what it's actually
              tracking.<br></br>
              • Fixed the unlock conditions for a couple late-game global stories.<br></br>
              • The predictor will stop spawning ever-more tooltips as you play the game, causing the browser to slow to
              a crawl. Thanks to Desent from the discord for helping me track this one down!<br></br>
              • The game will no longer save the hidden state of town window items for actions that you have not
              unlocked. This should remove the pitfall of having all your bars hidden after you prestige.<br></br>
              • Relatedly, the game will reset the hidden state of all town window items when you prestige.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3P.1.0'>
            Version 3P.1.0
            <div class='showthis2'>
              <b>Feb 29th, 2024</b>
              • Writing update! A great many brand-new action stories have been contributed by Inferno Vulpix, Nikki,
              and scout from the Discord, along with lots of very welcome proofreading and other improvements! You'll
              find their writing all over, but my favorite might be the new storyline for the Wizard College in zone 5.
              Check the Action Stories tab - even actions you've already completed might have surprises for you!<br>
              </br>
              • The inline stat bars should show up properly on all browsers now, I think.<br></br>
              • Progress bars (like for Wander) now use the inline style as well, to take up less space on the
              screen.<br></br>
              • Collapsing a zone in the Action List (using the arrows button) now uses the same logic as the
              functionality for snapping actions to their appropriate zones. This means, among other things, that trying
              to collapse an invalid travel action (one where you weren't in the right zone to begin with) will do
              nothing.<br></br>
              • Town info bars can now be hidden on a per-zone, per-action basis. Click the eye icon to the right of the
              zone name.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.25'>
            Version 3.P16.25
            <div class='showthis2'>
              <b>Feb 27th, 2024</b>
              • Removed the Adblock Plus warning, which is no longer relevant.<br></br>
              • Edited the final Pyromancy action story to make the reference clearer.<br></br>
              • Mana remaining should now display with fixed precision, making the screen a little less jumpy.<br></br>
              • Tweaked the display algorithm of the Actions List while the predictor is active, to allow buttons and
              predictions to coexist better. Hopefully.<br></br>
              • Holding shift while clicking the "Clear List" button will clear only the disabled actions from your
              action list.<br></br>
              • Holding shift will indicate which actions can be added at cap by holding shift while clicking.<br></br>
              • The tooltips for the Prestige Mental and Physical buffs now also note that they affect stats, just like
              their Prestige menu tooltips.<br></br>
              • The Fractional Mana option will auto-disable itself when you prestige, since the first Wander action can
              fail when it's enabled.<br></br>
              • The "Open Rift" and "Open Portal" actions are now correctly recognized as travel actions, for the
              purposes of display styling and actions snapping to zones.<br></br>
              • Endgame actions that show up in earlier zones now appear at the end of the respective zone's action
              buttons, just before the zone travel actions.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.24'>
            Version 3.P16.24
            <div class='showthis2'>
              <b>Feb 20th, 2024</b>
              • When no input field has focus, the digits 1-9 now act as hotkeys to set the Amount field directly to
              that value, the 0 key multiplies it by 10, and Backspace removes the last digit. (Other hotkeys are
              unchanged and can be viewed by hovering the Hotkeys option.)<br></br>
              • Inline stat bars should now display properly when you have no soulstones.<br></br>
              • Fixed Prestige Mental/Physical tooltips to note that they affect stats, not skills. Thanks to Kagato87
              from the discord for the heads-up!<br></br>
              • By request of Mithlug from the discord, your total level, talent, and soulstones can be seen in full by
              hovering the Total line in the stats panel. The other stat tooltips will now also show these numbers in
              full, rather than abbreviated.<br></br>
              • The current zone color is now used to decorate the town area, to improve the association with the action
              list backgrounds.<br></br>
              • The on/off state of bonus seconds will now be saved with the game, and the current state is visible in
              the UI. Thank you so much to juulsezaar from the discord for the request, I'd been meaning to get to this
              one for a while! ♥<br></br>
              • By popular acclaim, actions will now sort themselves into the right zone when adding actions to the list
              or when dragging actions around within the list. The up and down arrows still let you move actions to
              impossible places, if you really want to.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.23'>
            Version 3.P16.23
            <div class='showthis2'>
              <b>Feb 11th, 2024</b>
              • Build Tower now displays progress with linear scaling, so the percentage displayed will be accurate to
              the amount of progress required. This does not change the actual progress required, only how it is
              displayed.<br></br>
              • Fixed a bug that prevented Action Log entries from properly merging with each other when the Action Log
              is hidden, which allowed the log to grow to an unbounded size. Added code to fix unmerged log entries on
              game load.<br></br>
              • Added detection and warning for if your game save exceeds your browser's localStorage quota, like for
              example as a result of the above bug. Many apologies to OWD from the Discord for the lost progress, but
              thanks for bringing it to my attention!<br></br>
              • The "Use stat colors in menu and tooltips" option now defaults to on for new games, because I like
              colorful things. This should not affect existing games, and you can turn it off if it's too much or makes
              things hard to read.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.22'>
            Version 3.P16.22
            <div class='showthis2'>
              <b>Feb 9th, 2024</b>
              • Yet more typos quashed.<br></br>
              • Adjusted visibility conditions for some actions.<br></br>
              • Added world survey display. Thanks to Eyel from the Discord for the idea!<br></br>
              • Added inline level, talent, and soulstone bars for the Stats panel in the responsive UI, and rearranged
              the two-column layout to take advantage of the smaller footprint.<br></br>
              • Stat bars now have a faded right edge to signify that they don't have a maximum, and they will rescale
              more often so that more of the bar width gets used more often.<br></br>
              • The action list should stop scrolling up when you click action buttons in Chrome.<br></br>
              • Loop numbers now display in full in the Action Log.<br></br>
              • Fixed the story unlock conditions for the Haul action.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.21'>
            Version 3.P16.21
            <div class='showthis2'>
              <b>Feb 5th, 2024</b>
              • More typo fixes in tooltips and action stories.<br></br>
              • The "Time Spent" statistic that appears when you hover an action you completed this loop now measures
              effective in-game time, rather than realtime. In other words, it won't change based on whether or not
              Bonus Seconds is enabled.<br></br>
              • Another statistic, "Time In Loop", has been added, which measures the total amount of effective in-game
              time you'd spent in this loop so far, at the time you finished the action. Just in case you ever have a
              need for that information—iykyk.<br></br>
              • The Wizard College has tightened its requirements for whom it is willing to teach its secrets to: you
              are now required to enroll prior to attending your first class.<br></br>
              • The Responsive UI is no longer experimental! It is now enabled by default for new games (but can still
              be turned off from the Options menu). Existing games should not be affected.<br></br>
              • The initial story describing how you got into this mess will now show up in the Action Log when you
              start a new game, to reduce some amount of "what am I doing here" from new players.<br></br>
              • It wouldn't be an Idle Loops update without small fixes for tooltip behavior. In particular, predictor
              tooltips should no longer obscure the predictor display in the classic UI.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.20'>
            Version 3.P16.20
            <div class='showthis2'>
              <b>Jan 31st, 2024</b>
              • Many updates to the responsive UI, which should be better-behaved in Chrome and related browsers now.
              Give it a try; or, alternatively, don't.<br></br>
              • Broke, and then fixed, the background predictor thread. It should disable more fully now, when
              disabled.<br></br>
              • Broke, and then fixed, the prestige mechanic. Really on a roll here.<br></br>
              • Fixed an issue where multiple actions would get added to the list when you click the button once. (Might
              have broken it first. Hard to say.)<br></br>
              • General code cleanup, moving all prestige code into a single file where it will be safe from meddling.
              (It won't be.)<br></br>
              • Added a workaround for the bug that causes "NaN" to show up in the predictor. Now it should show
              question marks instead.<br></br>
              • Merged a PR from slabdrill on the Discord, updating lots of tooltips to match the game logic and
              addressing some long-standing calculation issues: the Imbue Soul buff and Thievery skill now have a
              multiplicative, rather than additive, effect. Thanks slabdrill!<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.19'>
            Version 3.P16.19
            <div class='showthis2'>
              <b>Jan 22nd, 2024</b>
              • Spatiomancy training should no longer cause the game to slow to a crawl.<br></br>
              • Many fixes to toolips and action stories. Big thanks to slabdrill from the Discord for the PR!<br></br>
              • Imbue Body is now displayed as a "capped" rather than a "locked" action when it reaches its limit.<br>
              </br>
              • The game now auto-saves whenever you change an option. Huge thank you to kopita from the Discord for the
              brilliant and obvious-in-retrospect suggestion.<br></br>
              • The data layer now has the ability to pass gamestate between threads.<br></br>
              • Relatedly, the predictor (when enabled) now runs in a background thread by default. This should
              significantly increase its performance, especially while the game is running, but if it causes problems
              the background thread can be disabled from the Extras menu.<br></br>
              • Soulstones will now try and keep themselves somewhat closer to each other in count when sacrificing
              them. I have discovered a truly marvelous explanation for this algorithm, which this changelog is too
              narrow to conta<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.18'>
            Version 3.P16.18
            <div class='showthis2'>
              <b>Jan 15th, 2024</b>
              • When sacrificing soulstones, each stat will lose an amount proportional to how many soulstones you have
              in each stat rather than attempting to equalize the number of soulstones you have across stats.<br></br>
              • The "Mana Used" display at the bottom of the current actions list is now always in two lines, to avoid
              some of the jumpiness of the page in Responsive UI mode.<br></br>
              • FAQ menu now displays entries like the Changelog menu does. Also, you can now copy text from the
              Changelog and the FAQ (just click the header to pin the entry in place first).<br></br>
              • Typo fixes and typing fixes.<br></br>
              • Sparkles.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.17'>
            Version 3.P16.17
            <div class='showthis2'>
              <b>Jan 10th, 2024</b>
              • The Statistics panel now shows your current level, talent, and soulstones as bars under each stat. The
              display of progress to next stat level or talent level is now shown in a colored box behind that
              number.<br></br>
              • The Changelog seems to have gotten taller than some people's screens, somehow. Now it will keep itself
              contained in the viewport and scroll entries.<br></br>
              • Finally fixed the tooltip issues for real, I think, I hope.<br></br>
              • If the game detects that it's lagging (usually because the Bonus Time multiplier is set too high) it
              will report it in the Bonus Seconds tooltip.<br></br>
              • The game no longer does a rapid (but potentially very long) catchup if the computer wakes up from sleep
              with the tab already open. It'll come back as a proper feature soon, don't worry.<br></br>
              • Added "Zen" and "Zen Dark" color schemes, which are a 180° palette rotation from the default colors, for
              those who miss the old inverse-color magenta look.<br></br>
              • Progress bar tracks in dark mode are now a slightly more visible dark gray, rather than flat black.
              Also, they line up properly against the right edge. Thanks to deadling from the discord for the sharp
              eye!<br></br>
              • The predictor can now be enabled and disabled without reloading the page, and it should stop repeating
              numbers at high bonus speeds. This also resolves the issue of phantom scrollbars appearing on the actions
              list with the predictor enabled. Thanks very much to Kagato87 from the discord for the invaluable testing
              help!<br></br>
              • Individual menus can now be shown or hidden by hovering the menu icon in the upper-left. The list of
              disabled menus is only saved in your browser and is not part of the saved game.<br></br>
              • The Action Log will no longer be quite so attention-grabbing and no longer scrolls the screen when new
              log entries are added. Say hello to the little "End of log" text; if you keep that in view, then all new
              entries will push old ones up above the scroll.<br></br>
              • The Action Log will try and keep itself scrolled to the same point when switching zones or when resizing
              the window in Responsive UI mode.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.16'>
            Version 3.P16.16
            <div class='showthis2'>
              <b>Jan 7th, 2024</b>
              • More colors in more places! The "Use stat colors in menu" option now colors the stat name and your
              current level in the Stats display, as well as stat names in action tooltips.<br></br>
              • On that note, some of the stat colors were hard to distinguish against the background, so all stat
              colors have been tweaked to be easier on the eyes, in both light and dark themes.<br></br>
              • You can now turn on an option that shows an indicator of what stats each action requires, without having
              to mouse-over.<br></br>
              • The Action Log will now record whenever you gain a new buff or increase the level of an existing buff,
              along with how much you paid for it.<br></br>
              • The "Bonus Seconds" tooltip now properly reflects any changes to bonus speed from the Extras menu.<br>
              </br>
              • Still trying to get the tooltips to position properly, but they should be behaving at least somewhat
              better now, the little gremlins.<br></br>
              • The tooltip for Mana Wells now updates to reflect the amount of mana in them at that moment in time.<br>
              </br>
              • The tooltips in zone 6 now properly hide their contents before you unlock them.<br></br>
              • Some rendering fixes for various browsers that weren't playing nice with the CSS I've been writing.<br>
              </br>
              • Lots—and I mean LOTS—of typechecking comments have been added to the code. This doesn't change anything
              about how the game runs, but it makes me happier.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.15'>
            Version 3.P16.15
            <div class='showthis2'>
              <b>Dec 18th, 2023</b>
              • Fixed a bug where skill experience would not get awarded if the amount of exp wasn't an integer.<br>
              </br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.14'>
            Version 3.P16.14
            <div class='showthis2'>
              <b>Dec 16th, 2023</b>
              • Initial reimplementation of the radar graph in SVG, using the D3 library.<br></br>
              • Fixed alignment errors with multipart progress bars and with stats, when text overflows.<br></br>
              • Progress bar actions now display a full, rather than an empty, Exp bar once progress reaches 100% -
              thanks to Velociraptured from the discord for the suggestion!<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.13'>
            Version 3.P16.13
            <div class='showthis2'>
              <b>Dec 13th, 2023</b>
              • The Dark theme has been completely redone using actual colors rather than a CSS inversion filter. All
              text should now be readable without having to switch filters around. (This does break the radar graph view
              of stats, sorry. I'm working on that.)<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.12'>
            Version 3.P16.12
            <div class='showthis2'>
              <b>Dec 12th, 2023</b>
              • Many, many small optimizations, and many more yet to come. This probably won't affect you... unless you
              like setting your Bonus Speed really high. In that case, you might find that you can set it even
              higher.<br></br>
              • Added unlock conditions to the "Buy Supplies" tooltip in Beginnersville. Thanks to Velociraptured on the
              discord for the report!<br></br>
              • Action stories will not show up in the Action Log until you've completed the associated action at least
              once.<br></br>
              • The extra settings for the predictor are available in the Extras menu again. Whoops.<br></br>
              • You can now borrow Bonus Seconds from the Extras menu. It's up to you whether the Extras menu gets them
              back.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.11'>
            Version 3.P16.11
            <div class='showthis2'>
              <b>Dec 10th, 2023</b>
              • Fixed story unlock conditions for global story chapters 7-10, so that the game doesn't tell you about
              [redacted] before you even see [redacted].<br></br>
              • Fixed a bug that could cause a softlock with multipart action bars when fractional mana consumption was
              enabled. Thanks very much to potetgull from the discord for the reproduction!<br></br>
              • Fixed the tooltips not displaying over each Challenge type, so you know what you're getting into before
              you click.<br></br>
              • Tooltips are a little less sticky now, so you don't have to keep clicking on the background to dismiss
              them.<br></br>
              • The predictor should cause less UI lag now. (This may cause predictions to take longer, but you should
              still be able to modify the action list while it's going.)<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.10'>
            Version 3.P16.10
            <div class='showthis2'>
              <b>Dec 8th, 2023</b>
              • Added Dark Cubic theme, for people who really like square borders but don't like eye strain, because why
              not.<br></br>
              • Fixed tab navigation on most controls; the game should now be playable by keyboard. Can't say it'll be
              easy but it should work, at least.<br></br>
              • As a happy side effect of the above, most tooltip-style popovers should stay visible if you click to
              focus in them. Accessibility benefits everyone!<br></br>
              • Fixed a bug that could cause the game to freeze at extremely high Talent levels.<br></br>
              • First attempts at making a mobile version of the UI (only in Responsive mode).<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.9'>
            Version 3.P16.9
            <div class='showthis2'>
              <b>Dec 7th, 2023</b>
              • Added cloud saves via Google Drive. Many thanks to Mawan from the discord for the testing help!<br></br>
              • Many improvements to the Action Log. Enabled by default and no longer marked experimental!<br></br>
              • Tooltip display has been improved, and menus will no longer close if the focus is inside them.<br></br>
              • Town progress displays now align column-wise in both the classic and responsive UI, from a great
              suggestion by Ham5terzilla on the discord!<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.8'>
            Version 3.P16.8
            <div class='showthis2'>
              <b>Dec 4th, 2023</b>
              • There is now an option to enable fractional mana usage, for late-game actions where the mana cost is
              less than 1. This may cause issues and the predictor doesn't account for it, so it is disabled by
              default.<br></br>
              • Fixing some layout issues with the responsive UI.<br></br>
              • Adding an experimental Action Log, which reports interesting things that happen (currently: global
              stories, action stories, skill levels, and soulstones from actions) during a play session.<br></br>
              • Fixed a mana accounting bug that could cause up to double mana consumption in some cases.<br></br>
              • Actions with multipart progress bars will no longer go past their expected limits if too much progress
              is made in 1 tick.<br></br>
              • Options that change the game balance have been moved to the Extras menu.<br></br>
              • Fixed a game-breaking bug, whoops. Sorry folks!<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.7'>
            Version 3.P16.7
            <div class='showthis2'>
              <b>Dec 3rd, 2023</b>
              • Dark theme now has different variants to choose from, representing different color filter methods, so
              you can choose which works best for your computer/monitor/eyes/taste. Thank you to zenonline for making
              the request!<br></br>
              • Enabling the predictor no longer causes the action list to overflow in the experimental responsive UI.
              (This is part of why it's called "experimental".)<br></br>
              • The game will no longer attempt to keep an empty action list active, even if the checkbox is
              checked.<br></br>
              • Switched the default dark mode variant to one that's better for legibility, especially with the
              predictor. (Previous default was "Matrix 2", now is "Matrix 4".)<br></br>
              • If the "Background Bonus Speed" option is set to a value less than 1, it will apply in the background
              regardless of whether or not bonus is active.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.6'>
            Version 3.P16.6
            <div class='showthis2'>
              <b>Dec 2nd, 2023</b>
              • Survey actions will no longer trigger "pause on complete" before reaching 100%. (Thanks to baldain from
              the discord!)<br></br>
              • Survey actions will not consume resources once progress reaches 100%.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.5'>
            Version 3.P16.5
            <div class='showthis2'>
              <b>Dec 1st, 2023</b>
              • Fixed a bug where dungeon actions would break if the last floor was completed in under a tick. (Thanks
              to slabdrill from the discord for the report and the repro!)<br></br>
              • The tick driver will not attempt to spend more than one frame's worth of time processing actions, no
              matter how high you set your bonus multiplier.<br></br>
              • Experimental implementation of a responsive UI, can be enabled in Options.<br></br>
              • Added the predictor script, which can be enabled in the Options menu.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.P16.4'>
            Version 3.P16.4
            <div class='showthis2'>
              <b>Nov 30th, 2023</b>
              • Merged in WaylonJ's prestige version. Save compatibility is now only guaranteed with the prestige fork,
              not the lloyd fork.<br></br>
              • Added "Background Bonus Speed" option. If set to a number &gt;= 0, bonus time will be used at this rate
              instead of the normal bonus rate whenever the tab is running in the background.<br></br>
              • New color inversion filter for Dark theme, maintains colors better.<br></br>
              • Set the theme before loading any other JavaScript to avoid a flash of white when reloading.<br></br>
              • Add a loading screen to avoid showing unstyled content when reloading the page.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.0.3'>
            Version 3.0.3
            <div class='showthis2'>
              <b>Nov 30th, 2023</b>
              • Added some workaround code to make sure saves exported from the dmchurch fork can be imported back into
              the lloyd fork, for portability.<br></br>
              • Tooltips for actions that are visible but not yet unlocked now show in abbreviated form, to reduce
              flavor text confusion.<br></br>
              • Actions that teach skills now show a description of the skill in the action tooltip.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.0.2'>
            Version 3.0.2
            <div class='showthis2'>
              <b>Nov 15th, 2023</b>
              • Rewritten tick() code uses browser's requestAnimationFrame if available. Ticks should be more efficient
              as well, especially under high game speeds.<br></br>
              • Fix to Actions.tick() from Gustav from Discord, now multi-segment actions that complete multiple
              segments in a single tick will calculate each segment individually.<br></br>
              • The "visual updates per second" option is now stored separately from saves, so you won't import refresh
              rate with a pasted savedata.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.0.1'>
            Version 3.0.1
            <div class='showthis2'>
              <b>Nov 14th, 2023</b>
              (from lloyd fork, version 3.0)<br></br>
              • Yarr, the game has been taken over by dmchurch, where is this boat even going?<br></br>
              • Dark theme now rotates the colors back into the right hues.<br></br>
              • "Notify on Pause" option to send an HTML5 notification to your system tray instead of a beep when the
              game pauses.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='P: 0.1.6c'>
            Version P: 0.1.6c
            <div class='showthis2'>
              <b>Mar 20th, 2023</b>
              <br></br>
              <b>Changelog:</b>
              • Bux fix<br></br>
              • Fixed: Previous change caused check boxes to not save their states. <br></br>
              • Fixed: Geysers could be fractionated depending on survey progress. <br></br>
              • Fixed: Surveying 100% areas shouldn't give completed maps. <br></br>
              • Fixed: Reset All Prestige didn't remove old values. <br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='P: 0.1.5'>
            Version P: 0.1.5
            <div class='showthis2'>
              <b>Mar 20th, 2023</b>
              <br></br>
              <b>Changelog:</b>
              • Options -&gt; Custom Bonus Speed:<br></br>
              • Now allows you to enter a value into a text box for whatever customSpeed you desire :)
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='P: 0.1.4'>
            Version P: 0.1.4
            <div class='showthis2'>
              <b>Mar 13th, 2023</b>
              <br></br>
              <b>Changelog:</b>
              • I stopped being lazy and added a change log!<br></br>
              <br></br>
              <b>PrestigeMental:</b>
              • Tooltip now reflects that it affects luck.<br></br>
              <br></br>
              <b>PrestigeBartering:</b>
              • Tooltip now specifies that it affects the amount of *mana* bought from merchants.<br></br>
              <b>Bug:</b>
              • Trying to fix prestige bug not reset-ing values (V1).<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='P: 0.1.3'>
            Version P: 0.1.3
            <div class='showthis2'>
              <b>Mar 12th, 2023</b>
              <br></br>
              <b>PrestigeExpOverflow:</b>
              • Now gains the bonuses of PrestigePhysical and PrestigeMental when their respective skills are being
              added to.<br></br>
              <br></br>
              <b>PrestigeMental:</b>
              • By popular questioning and request, now has "Luck" as one of the skills it provides a bonus to.<br></br>
              <br></br>
              <b>PrestigePhysical:</b>
              • By an absolute blunder on my part, now actually provides a bonus for Strength.<br></br>
              <br></br>
              <b>Other Changes:</b>
              • Otherwise just a small tooltip adjustment as ExpOverflow wasn't giving you the "Current Bonus" in the
              prestige dropdown<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='P: 0.1.2'>
            Version P: 0.1.2
            <div class='showthis2'>
              <b>Mar 6th, 2023</b>
              <br></br>
              <b>Prestige buffs:</b>
              • Combat: 1.10 -&gt; 1.20<br></br>
              • Spationmancy: 1.10 -&gt; 1.20<br></br>
              • Bartering: 1.10 -&gt; 1.20<br></br>
              <br></br>
              <b>Other Changes:</b>
              • Triggers a save after prestiging to prevent refresh errors<br></br>
              • Updates text content to reflect prestige bonuses correctly.<br></br>
              • Bug fix for Spatio / Barter<br></br>
              • Survey action can now be done even when at 100% surveyed, but it will result in no progress and remove a
              map. This allows it to work with "Pause on progress complete"<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='P: 0.1.1'>
            Version P: 0.1.1
            <div class='showthis2'>
              <b>Mar 5th, 2023</b>
              <br></br>
              <b>Updates:</b>
              • Prestiges will now begin with the "Found Glasses" action thanks to the overwhelming feeling that you're
              forgetting something important when you prestige<br></br>
              • Buffed prestigeMental and prestigePhysical to give 10 -&gt; 20% bonuses to their respective skills<br>
              </br>
              <br></br>
              <b>Quick Followups:</b>
              • Added "Reset all Prestiges" to recoup your spent points<br></br>
              • Prevents buy glasses action in all prestiges.<br></br>
              • Updated tooltips to reflect the buff change from above<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='P: 0.1.0'>
            Version P: 0.1.0
            <div class='showthis2'>
              <b>Feb 15th, 2023</b>
              <br></br>
              <b>Prestige mode</b>
              • Once you've restored time, you'll gain 90 points to spend on a variety of prestige bonuses.<br></br>
              • These may be viewed in the "Prestige Perks" menu dropdown at the top left.<br></br>
              • Imbue Soul levels will carry over between prestiges, up to the maximum number of prestiges you've
              completed.<br></br>
              <b>QoL</b>
              • Added a 10x and 20x checkbox in the "Options" drop down when using Bonus time<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='3.0'>
            Version 3.0
            <div class='showthis2'>
              <b>Jan 23rd, 2023</b>
              • Writing update! Vera from Discord has contributed a ton of new action stories for content across the
              game.<br></br>
              • Tooltip updates from Quiaaaa to Spatiomancyy and Practical magic.<br></br>
              • Tooltip fixes from SyDr to hopefully resolve the age-old bug with tooltips going off-screen.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='2.9'>
            Version 2.9
            <div class='showthis2'>
              <b>July 25th, 2022</b>
              Performance Update!<br></br>
              With help from Hordex from Discord, we've rewritten most of the explicit update calls to be deferred to
              the update handler.<br></br>
              This means that most UI refreshes are now correctly controlled by the "Updates Per Second" setting in the
              options menu.<br></br>
              High level players who are still experiencing lag can significantly improve performance by reducing this
              number - this will only decrease how often the screen refreshes, not how often the game updates.<br></br>
              ---<br></br>
              Additionally, we have a number of new global stories for all the zones, action segments, and other updates
              from MrPitt!
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='2.8'>
            Version 2.8
            <div class='showthis2'>
              <b>July 25th, 2022</b>
              • A new guild has opened in Commerceville - Assassins Guild! Kill targets across the world, collect their
              hearts (why is it always hearts?), and return them to the guild to learn the ways of the assassin<br></br>
              • New Actions: Assassinate: Assassination targets are now available in every zone. Every assassination
              carries a very heavy reputation penalty (mitigated by assassin skill) and gets harder based on your
              reputation and number of assassinations completed this loop<br></br>
              • New Skill: Assassin - Improves assassination actions and reduces the difficultly scaling in trials<br>
              </br>
              • New Menu: Totals - Records play metrics including total time played and loops/actions completed<br></br>
              • Balance: Thieves guild actions gold rewards x2<br></br>
              • New Option: Highlight New Actions - Places a border around actions that have not yet been completed on
              this save. Defaults to on, but can be toggled off in options<br></br>
              • Added max button to Gather Team<br></br>
              • Typo fixes
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='2.7'>
            Version 2.7
            <div class='showthis2'>
              <b>July 20th, 2022</b>
              • Survey Update! Survey is now completed using maps purchased in Beginnersville. Completed maps can be
              returned to the explorer's guild for extra progress in a random uncompleted area.<br></br>
              • A few minor bugfixes
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='2.6'>
            Version 2.6
            <div class='showthis2'>
              <b>July 20th, 2022</b>
              • Added Quick Travel Menu to better navigate all the zones<br></br>
              • Dark Ritual now only shows speed increases for unlocked zones
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='2.5'>
            Version 2.5
            <div class='showthis2'>
              <b>July 19th, 2022</b>
              • New Option: Stat Colors - Changes stat menu bars to be the same colors used in multipart action bars<br>
              </br>
              • Removed Simple Tooltips Option - It was extra work to maintain on every update / change<br></br>
              • Bugfix: DR was not properly increasing zombie strength<br></br>
              • Balance: Added great feast's bonus to team members and zombies to bring team combat better in line with
              self combat (this seemed more interesting than just adding a flat x5, but may be changed later)
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='2.4'>
            Version 2.4
            <div class='showthis2'>
              <b>July 20th, 2022</b>
              • Balance: Team combat buffs! Restoration now contributes 4x its level instead of 2x to team member
              strength<br></br>
              We'll see how this feels, and can revisit and improve leadership, too, if needed<br></br>
              • New Option: Players can now enable a setting to have the game automatically pause when a progress action
              reaches 100% so they can accrue bonus seconds rather than waste time on a loop making little progress<br>
              </br>
              • Tooltip Updates: Many thanks to MakroCZ from the discord for tireless work on a fix for tooltip
              placement<br></br>
              • Tooltip Updates: Kallious from the discord has helped clarify a number of unlock conditions and tided up
              the tidy up action in Valhalla<br></br>
              • Bugfix: Imbue Soul could be started at max buff rank, resetting all progress for no reward<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='2.3'>
            Version 2.3
            <div class='showthis2'>
              <b>July 19th, 2022</b>
              • Bugfix: With thanks to Kallious from the Discord, we've finally fixed the bug sometimes making
              soulstones go negative on DR/IM/GF<br></br>
              • Bugfix: Added additional error checks to loading save files to autofix some of the common error
              states<br></br>
              • Bugfix: Trial of dead was not using updated zombie strength formula<br></br>
              • Bugfix: Imbue Soul was not updating training tooltips until next restart
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='2.2'>
            Version 2.2
            <div class='showthis2'>
              <b>July 19th, 2022</b>
              • New Skill: Leadership - Increases your max follower count by 1 for every 100 levels and increases their
              contribution to team combat<br></br>
              • New Action (Commerceville): Motivational Seminar - Get advice from the head of a totally-not-an-MLM to
              learn how to be a better leader<br></br>
              • Balance: Zombie Strength is now increased by Dark Ritual / 100(min 1x, up to 6.66x increase)<br></br>
              • Balance: Fight Jungle Monsters now rewards blood instead of hides. Prepare Buffet is now made of blood
              instead of hide. Still gross.<br></br>
              Note - We'll have to see how these changes land. It may end up being that now Team Combat is too strong
              compared to self combat. Also, trials will almost certainly need rebalancing.<br></br>
              • Bugfix: Fight actions were giving exp on segment in addition to completion. Increased combat exp of
              frost/giants &amp; jungle monsters to compensate<br></br>
              • Bugfix: Explorer's guild was not reducing the cost of excursion<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='2.1'>
            Version 2.1
            <div class='showthis2'>
              <b>July 18th, 2022</b>
              • Balance: Imbue soul now adds +100% exp mult to training actions per level<br></br>
              • Balance: Reduced Alchemy Skill requirement of Looping potion from 500 to 200<br></br>
              • Balance: Jungle Escape now only needs to be started within 60s, not completed within 60s<br></br>
              • Bugfix: Excursion was requiring the player to have more gold than the cost rather than more or equal<br>
              </br>
              • Bugfix: Troll's blood still said it did nothing<br></br>
              • Bugfix: Reduce the amount of time "Saved" appear on loadouts from 2s -&gt; 1s<br></br>
              • Bugfix: Secret trial couldn't be started<br></br>
              • Bugfix: Soulstone display wasn't being updated after imbue soul<br></br>
              • Change: The game will now persist any current options set when starting a new game or beginning a
              challenge<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='2.0'>
            Version 2.0
            <div class='showthis2'>
              <b>July 16th, 2022</b>
              Added Challenge Modes!<br></br>
              Challenges are super hard modifications to the base game with extra restrictions in place.<br></br>
              These are only for fun and do not give any rewards.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='1.9'>
            Version 1.9
            <div class='showthis2'>
              <b>July 16th, 2022</b>
              • Change: Added "Max Training" button to bottom of action list that will cap all training actions present
              on the list. This button only appears after players have completed their first imbue mind to reduce
              clutter<br></br>
              • Change: Completing the "Imbue Mind" action will automatically cap any training actions on the list. This
              can be disabled in the options menu<br></br>
              • Bugfix: StonesUsed from Haul was not properly resetting on clearing saves<br></br>
              • Bugfix: Off-by-One error in final trial was preventing players from being able to finish<br></br>
              • Bugfix: Trial tooltips were displaying incorrect floor numbers<br></br>
              • Bugfix: Trolls, Frost Giants, and Jungle Monsters were giving combat exp per action rather than per
              kill. These actions will likely need significant combat skill exp buffs after to compensate for this fix
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='1.8'>
            Version 1.8
            <div class='showthis2'>
              <b>July 14th, 2022</b>
              • New Trial: Trial of the Dead (Startington) - Based solely off your Zombie contributions to team combat,
              completing floors rewards even more zombies<br></br>
              • Bugfix: Swapped the Clear List and Manage Loadout buttons so the loadout popup would be less likely to
              get in the way when editing action amounts<br></br>
              • Bugfix: Added survey icon to new actions added by survey so they are easier to notice<br></br>
              • Bugfix: Haul wasn't being properly capped per zone, allowing stones to become negative
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='1.7'>
            Version 1.7
            <div class='showthis2'>
              <b>July 14th, 2022</b>
              Endgame content complete!<br></br>
              The endgame has been reworked to be a series of a team trial, solo trial, and final action that must all
              be completed in order in a single loop.<br></br>
              This update marks the end of my planned content. From here out it'll be mostly balancing, bugfixes, and
              perhaps the occasional addition as whimsy strikes.<br></br>
              • New Actions: Delve &amp; Haul - Find and collect temporal stones used for an end-game action (Note:
              completely unbalanced right now - attempt at your own peril)<br></br>
              • New Action: Build Tower - New endgame action (Note: completely unbalanced right now - attempt at your
              own peril)<br></br>
              • New Actions: Endgame trials (Note: completely unbalanced right now - attempt at your own peril)<br></br>
              • New Action: Secret Trial - No one should ever bother with this, but some of you all are just crazy
              enough to try<br></br>
              • Balance: Buy Mana is no longer available after using the Jungle Portal<br></br>
              • Balance: Reduced Stat and Skill gain from heroes trial<br></br>
              • Balance: Reduced Combat Skill exp gain from late game fight actions<br></br>
              • Change: New option available for simple tooltips. Removes the formulas from skill and action tooltips to
              reduce clutter. You can select this from the options menu under "Language".<br></br>
              • Change: Removed the ability to edit buff caps<br></br>
              • Bugfix: Minor tooltip updates<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='1.6'>
            Version 1.6
            <div class='showthis2'>
              <b>July 13th, 2022</b>
              • Change: Reworked Loadouts, allowing up to 15 to be saved<br></br>
              • Bugfix: Restoration skill was applying to self combat instead of team combat<br></br>
              • Bugfix: A number of actions that had skill exp added to them weren't properly granting the exp<br></br>
              • Bugfix: Added descriptions of where each shortcut takes you to the tooltip
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='1.5'>
            Version 1.5
            <div class='showthis2'>
              <b>July 13th, 2022</b>
              • New Action Type: Trial - Trials are longer form dungeons, but without the soulstone gain<br></br>
              • New Trial (Merchanton): Heroes Trial - 50 floors. Grants Heroism buff per floor completed<br></br>
              • New Buff: Heroism - Grants 2% increased Combat, Pyromancy, and Restoration skill exp per level<br></br>
              • Bugfix: Rewrote soulstone sacrifice code<br></br>
              • Bugfix: The Spire was based on self-combat rather than team-combat<br></br>
              • Bugfix: Totem didn't effect Imbue Body until the third completion
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='1.4'>
            Version 1.4
            <div class='showthis2'>
              <b>July 12th, 2022</b>
              • Change: Added max actions to oracle and charm school<br></br>
              • Change: Completing totem for the first time doubles the bonus from imbue body<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='1.3'>
            Version 1.3
            <div class='showthis2'>
              <b>July 12th, 2022</b>
              Minor Survey Rework - still needs a bit more attention and explorers guild needs a use<br></br>
              • Change: Survey is unlocked in all zones after joining explorers guild<br></br>
              • Change: Survey actions cap raised to 500, but now applies across all survey actions<br></br>
              • Change: Survey added as limited action, so the circle icon can be used<br></br>
              • Bugfix: Looping potion tooltip<br></br>
              • Bugfix: Spatiomancy was increasing mana well costs
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='1.2'>
            Version 1.2
            <div class='showthis2'>
              <b>July 12th, 2022</b>
              • Change: Constructed additional warehouses so numbers would be prettier with all increases<br></br>
              • Bugfix: Player was falling asleep on the wagon, missing the Merchanton stop, and ending up on the
              mountain<br></br>
              • Bugfix: Imbue soul wasn't resetting buffs<br></br>
              • Bugfix: Excursion costs weren't modified by explorers guild<br></br>
              • Bugfix: Key wasn't being reset correctly<br></br>
              • Bugfix: Underworld action was showing failed, even when successful<br></br>
              • Bugfix: Mana well and Buy mana tooltips now update when leveling skills that benefit them<br></br>
              • Bugfix: Skill rework was causing pick locks to give double gold<br></br>
              • Bugfix: Guided tour was being removed from active list on refresh
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='1.1'>
            Version 1.1
            <div class='showthis2'>
              <b>July 11th, 2022</b>
              • New Guild: Explorers - Voted by the community, the explorers guild has opened shop in Commerceville!<br>
              </br>
              • Unlocks a new "Survey" action in all zones - Survey progress mildly increases the number of limited
              resources (% * 0.5)<br></br>
              • Overall Survey progress also unlocks shortcuts for new ways to move between zones<br></br>
              • Bugfix: Mana well costs could become negative, subtracting mana from the player<br></br>
              • Bugfix: Excursion didn't check if you had enough gold to start<br></br>
              • Bugfix: Reputation display wasn't updated after fall from grace action<br></br>
              • Backend: Major rework of how skill bonuses are calculated in code. The results should be the same, but
              make the code easier to read and maintain. Unfortunately, I expect at least a few bugs from typos in
              this.<br></br>
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='1.0'>
            Version 1.0
            <div class='showthis2'>
              <b>July 9th, 2022</b>
              • New Skill: Wunderkind - Increases talent exp gain<br></br>
              • New Action (Jungle Path): Totem - Consumes a looping potion to give Wunderkind skill Exp<br></br>
              • Change: Moved the Oracle skill to be next to Charm School<br></br>
              • Bugfix: Aspirant bonus was being applied to all exp gain, not just talent exp<br></br>
              • Bugfix: Gamble action gold was not rounding<br></br>
              • Bugfix: Removed reputation requirement from collect interest tooltip<br></br>
              • Bugfix: Removed "this does nothing" from Collect Artifacts<br></br>
              • Bugfix: Added the max quantity button to the Collect Artifacts action<br></br>
              • Removed versions from changelog &gt;1 year old
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='.99'>
            Version .99
            <div class='showthis2'>
              <b>July 7th, 2022</b>
              • New Action (Commerceville): Excursion - Exploration action to reveal other actions in the zone<br></br>
              • New Actions (Commerceville): Pick Pocket, Rob Warehouse, Insurance Fraud - Gold gain based on thieves
              guild bonus &amp; thievery<br></br>
              • Finished implementation of thievery skill - Increases gold gain of pick locks, gamble, and thieves guild
              actions<br></br>
              • Added temporary effect for imbue soul - Adds 50% action speed per completion. Will likely be changed
              later<br></br>
              • Improved handling of bonus time on time-gated actions. Effective time used for these actions can be
              viewed in the "Mana Used" tooltip<br></br>
              • Bugfix: Donate allowed going negative on gold<br></br>
              • Bugfix: Collect interest was only rewarding 1/10th of the intended amount<br></br>
              • Bugfix: Excursion didn't cost gold<br></br>
              • Bugfix: Imbue Soul didn't have costs<br></br>
              • Bugfix: Thieves guild segments weren't resetting<br></br>
              • Bugfix: Great feast throwing an error<br></br>
              • Numerous updates and clarifications in various tooltips
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='.98'>
            Version .98
            <div class='showthis2'>
              <b>July 6th, 2022</b>
              • New Zones - Jungle Path, Commerceville, and Valley of Olympus. Major milestones are implemented, with
              more content to come • New Buff: Imbue Body - Sacrifices talent exp to permanently raise starting
              stats.<br></br>
              • New Skill: Gluttony - Decreases the soulstone cost of great feast.<br></br>
              • New Skill: Thievery - Improves gold gain of certain actions<br></br>
              • New Action (Startington): Mana Well - Gives mana based on how quickly in the loop it is completed
              (adjusted for bonus second use)<br></br>
              • New Actions (Jungle Path): Explore Jungle &amp; Fight Jungle Monsters - Generic exploration/progress
              action where exp is based on fight monsters completion<br></br>
              • New Actions (Jungle Path): Rescue Survivors &amp; Prepare Buffet - Uses Resto skill, then herbs and hide
              to give Gluttony exp<br></br>
              • New Action (Jungle Path): Escape - Unlocks next zone, but requires being completed within 60 seconds of
              starting the loop (adjusted for bonus second use) • New Actions (Commerceville): Thieves Guild - Functions
              similar to crafting guild, but with a focus on gold income<br></br>
              • New Actions (Commerceville): Invest &amp; Collect interest. Grants a small percentage of lifetime
              investments<br></br>
              • New Actions (Commerceville): Purchase Key &amp; Leave City - Progress to next zone for cost of 1M
              gold<br></br>
              • New Actions (Valley Of Olympus): Imbue Soul &amp; Challenge Gods - (Incomplete) Planned end of game<br>
              </br>
              • Dark Ritual now works in all zones and provides a very minor speed increase up to max level. Need to
              find a way to hide description for locked zones<br></br>
              • Decreased mana cost of open rift from 100k -&gt; 50k<br></br>
              • Minor fix to how Spatiomancy effects herbs
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='.97'>
            Version .97
            <div class='showthis2'>
              <b>July 4th, 2022</b>
              • Added Build Housing and Collect Taxes actions in Valhalla - a new source of gold gain that uses Crafting
              Guild Rank and Mercantilism skill.<br></br>
              • Renamed Adeptsville to Startington<br></br>
              • Added Meander action in Startington and set as a requirement to see other actions<br></br>
              • Added Destroy Pylon action in startington to reduce the mana cost of spire<br></br>
              • Increased the base mana cost of The Spire significantly, mostly offset by destroying pylons<br></br>
              • Allowed Spatiomancy to benefit more actions<br></br>
              • Fixed Great Feast buff so it actually improves Self Combat<br></br>
              • Training mercantilism now costs reputation<br></br>
              • Fall From Grace now removes all positive reputation<br></br>
              • Tweaked Looping potion to require doubling herbs with spatiomancy in anticipation of end-game use<br>
              </br>
              • Cleaned up a bunch more tooltips
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='.96'>
            Version .96
            <div class='showthis2'>
              <b>June 24th, 2022</b>
              • The spire now gives rewards! It gives 100 soulstones per floor and well as aspirant ranks <br></br>
              • New Skill: Divine Favor. Increases soulstones gained from actions<br></br>
              • New Skill: Communing. Reduces soulstone costs of dark ritual<br></br>
              • New Buff: Aspirant. Increases talent xp multiplier<br></br>
              • New Action: Fight Giants - Self combat fight that increases the effectiveness of seek blessing<br></br>
              • New Action: Seek Blessing - Gives divine favor skill xp based on fight giants progress<br></br>
              • New Action: Raise Zombies - Increases team combat<br></br>
              • New Action: Dark Sacrifice - Gives communing skill xp<br></br>
              • Cleaned up a number of tooltips
            </div>
          </li>
          <li class='showthat2' tabindex='0' data-vernum='.95'>
            Version .95
            <div class='showthis2'>
              <b>March 18th, 2022</b>
              • Omsi's beta content! • Added Valhalla zone with numerous new actions - reachable with Face Judgement<br>
              </br>
              • Added Adeptsville zone and The Spire dungeon - reachable with Face Judgement<br></br>
              • New Skill: Restoration - Improves team combat and effectiveness of Heal the Sick<br></br>
              • New Skill: Spatiomancy - Reduces mana geyser costs and increases possible rewards from zone 1 and 3
              actions<br></br>
              • New Skill: Mercantilism - Increases gold received from Buy Mana actions<br></br>
              • New Buff: Great Feast - Increases self combat score<br></br>
              • More new actions than you can shake a stick at!<br></br>
              • Probably lots more stuff, too?
            </div>
          </li>
        </ul>
      </li>
      <li id='saveMenu' tabindex='0' style='display:inline-block;height:30px;margin-left:10px;' class='showthatH'>
        Saving
        <div class='showthisH'>
          <button class='button' onClick={() => save()}>Save Manually</button>
          <br></br>
          <textarea id='exportImportList'></textarea>
          <label for='exportImportList'>Export/Import List</label>
          <br></br>
          <button class='button' style='margin-right: 2px;' onClick={() => exportCurrentList()}>
            Export
          </button>
          <button class='button' onClick={() => importCurrentList()}>Import</button>
          <br></br>
          Exports the current list in a plain-text format you can paste and share with others
          <br></br>
          <br></br>
          <input id='exportImport'></input>
          <label for='exportImport'>Export/Import Savefile</label>
          <br></br>
          <button class='button' style='margin-top: 5px; margin-right: 2px;' onClick={() => exportSave()}>
            Export
          </button>
          <button class='button' style='margin-top: 1px;' onClick={() => importSave()}>Import</button>
          <br></br>
          Click Export to export to your clipboard (ctrl-v somewhere else).<br></br>
          Paste a save and click Import to import.<br></br>

          WARNING: Import will break the game if invalid save. Empty import will hard clear the game<br></br>
          If you reaaallly want to edit your save file, <br></br>
          <button
            class='button'
            style='margin-top: 5px; margin-right: 2px;'
            onClick={() => exportSaveFile()}
          >
            Export File
          </button>
          <button class='button' style='margin-top: 1px;' onClick={() => openSaveFile()}>
            Import File
          </button>
          <input
            id='SaveFileInput'
            type='file'
            style='visibility:hidden;'
            onChange={() => importSaveFile(event)}
          >
          </input>
          <br></br>
        </div>
      </li>
      <li id='faqMenu' tabindex='0' style='display:inline-block;height:30px;margin-left:10px;' class='showthatH'>
        FAQ
        <ul class='showthisH' id='faq'>
          <li class='showthat2' tabindex='0'>
            What do stats do?
            <div class='showthis2'>
              Hover over "Stats" for how they work. What stats are important depend on what actions you need that uses
              them. In general, higher stats mean more work done in a loop.
            </div>
          </li>

          <li class='showthat2' tabindex='0'>
            Short runs seem better.
            <div class='showthis2'>
              Short runs are better for the early game, but as your runs get longer and you accrue talent and
              soulstones, longer runs become more useful.
            </div>
          </li>

          <li class='showthat2' tabindex='0'>
            What should my first goal be?
            <div class='showthis2'>
              Start with wandering until you have ways of getting mana back. Then try to find how to get some warrior
              lessons to give yourself a permanent boost, and then try fighting monsters!
            </div>
          </li>

          <li class='showthat2' tabindex='0'>
            How do skill increases / reductions work?
            <div class='showthis2'>
              Increases multiply a reward by (1 + level / 60) ^ .25, so you'll see diminishing returns at higher levels.
              Reductions multiply a cost by 1 / (1 + level / 100), so you'll never be able to bring a cost completely to
              zero.
            </div>
          </li>

          <li class='showthat2' tabindex='0'>
            When should I use Dark Ritual?
            <div class='showthis2'>
              Many people recommend performing another ritual when the cost is less than 5% of your soulstones. Of
              course, the choice is up to you and there may be cases where it's better to perform it sooner or later.
            </div>
          </li>

          <li class='showthat2' tabindex='0'>
            I found a bug!
            <div class='showthis2'>
              Some problems are the result of the browser cache mixing files between versions of Idle Loops. If
              something seems broken, first try doing a hard reload in your browser, usually Control-Shift-R or
              Command-Shift-R. (Don't tell your browser to clear all data for the site unless you've saved and exported
              your game!) If that doesn't work, please join the Discord (link under Options) and report it in the
              #loops-bugs channel! I try to resolve bug reports as quickly as I can, and I always appreciate hearing
              about them!
            </div>
          </li>
        </ul>
      </li>

      <li id='optionsMenu' tabindex='0' style='display:inline-block;height:30px;margin-left:10px;' class='showthatH'>
        Options
        <div class='showthisH'>
          <a target='_blank' href='https://discord.gg/dnKA6Xd'>
            Discord Link
          </a>
          <br></br>

          <div>
            <span>Language:</span>
            <select id='localization_menu' onChange={() => Localization.change()}>
              <option value='en-EN'>English</option>
            </select>
          </div>
          <br></br>

          WARNING: This game won't ever have ads.{' '}
          <small>
            (This spot used to mention an incompatibility with ad-blockers, but that has since been fixed. Feel free to
            leave them enabled.)
          </small>
          <br></br>
          <input
            id='responsiveUIInput'
            type='checkbox'
            onChange={({ target: { checked } }) => setOption('responsiveUI', checked)}
          >
          </input>
          <label for='responsiveUIInput'>Responsive UI</label>
          <br></br>
          <input
            id='actionLogInput'
            type='checkbox'
            onChange={({ target: { checked } }) => setOption('actionLog', checked)}
          >
          </input>
          <label for='actionLogInput'>Show action log</label>
          <br></br>
          <input
            id='highlightNewInput'
            type='checkbox'
            onChange={({ target: { checked } }) => setOption('highlightNew', checked)}
          >
          </input>
          <label for='highlightNewInput'>Highlight new actions</label>
          <br></br>
          <input
            id='statColorsInput'
            type='checkbox'
            onChange={({ target: { checked } }) => setOption('statColors', checked)}
          >
          </input>
          <label for='statColorsInput'>Use stat colors in menu and tooltips</label>
          <br></br>
          <input
            id='statHintsInput'
            type='checkbox'
            onChange={({ target: { checked } }) => setOption('statHints', checked)}
          >
          </input>
          <label for='statHintsInput'>Show stat hints on actions</label>
          <br></br>
          <input
            id='pingOnPauseInput'
            type='checkbox'
            onChange={({ target: { checked } }) => setOption('pingOnPause', checked)}
          >
          </input>
          <label for='pingOnPauseInput'>Ping on pause</label>
          <br></br>
          <input
            id='notifyOnPauseInput'
            type='checkbox'
            onChange={({ target: { checked } }) => setOption('notifyOnPause', checked)}
          >
          </input>
          <label for='notifyOnPauseInput'>Notify on pause</label>
          <br></br>
          <input
            id='autoMaxTrainingInput'
            type='checkbox'
            onChange={({ target: { checked } }) => setOption('autoMaxTraining', checked)}
          >
          </input>
          <label for='autoMaxTrainingInput'>Max All Training Actions on Training cap increase</label>
          <br></br>
          <input
            id='hotkeysInput'
            type='checkbox'
            onChange={({ target: { checked } }) => setOption('hotkeys', checked)}
          >
          </input>
          <label class='showthat' for='hotkeysInput'>
            Hotkeys
            <div class='showthis'>
              Spacebar: Pause/play<br></br>
              R: Restart<br></br>
              B: Toggle bonus seconds<br></br>
              1-9: Set current action list multiplier to 1-9<br></br>
              0: Multiply action list multiplier by 10<br></br>
              Backspace: Remove last digit of action list multiplier<br></br>
              Shift+1-5: Select and load loadout 1-5<br></br>
              +/-: Increase/decrease action list size<br></br>
              Shift+S: Save current list to selected loadout<br></br>
              Shift+L: Load selected loadout<br></br>
              Shift+C: Clear current list<br></br>
              Right/D: Show next zone<br></br>
              Left/A: Show previous zone<br></br>
              Shift+Right/D: Show action stories<br></br>
              Shift+Left/A: Show action options<br></br>
              Shift+Z: Undo most recent change to action list
            </div>
          </label>
          <br></br>
          Visual updates per second:
          <input
            id='updateRateInput'
            type='number'
            value='50'
            min='1'
            style='width: 50px;transform: translateY(-2px);'
            oninput={({ target: { value } }) => setOption('updateRate', parseInt(value))}
          >
          </input>
          <br></br>
          Autosave rate (seconds):
          <input
            id='autosaveRateInput'
            type='number'
            value='30'
            min='1'
            style='width: 50px;transform: translateY(-2px);'
            oninput={({ target: { value } }) => setOption('autosaveRate', parseInt(value))}
          >
          </input>
          <br></br>
        </div>
      </li>
      <li id='extrasMenu' tabindex='0' style='display:inline-block;height:30px;margin-left:10px;' class='showthatH'>
        Extras
        <div class='showthisH' style='padding-top:1ex'>
          The options in this menu allow you to customize the balance and functionality of the game in ways that affect
          the play experience. If experiencing the "vanilla" Idle Loops experience is important to you, leave these
          options unchanged. Otherwise, have fun!
          <br></br>
          <br></br>
          <input
            id='fractionalManaInput'
            type='checkbox'
            onChange={({ target: { checked } }) => setOption('fractionalMana', checked)}
          >
          </input>
          <label for='fractionalManaInput'>Fractional mana consumption</label>
          <br></br>
          <input
            id='predictorInput'
            type='checkbox'
            onChange={({ target: { checked } }) => setOption('predictor', checked)}
          >
          </input>
          <label for='predictorInput'>Enable predictor</label>
          <br></br>
          <div class='control'>
            <input
              type='checkbox'
              id='speedIncrease10xInput'
              onChange={({ target: { checked } }) => setOption('speedIncrease10x', checked)}
            >
            </input>
            <label for='speedIncrease10xInput'>10x Bonus Speed</label>
          </div>
          <br></br>
          <div class='control'>
            <input
              type='checkbox'
              id='speedIncrease20xInput'
              onChange={({ target: { checked } }) => setOption('speedIncrease20x', checked)}
            >
            </input>
            <label for='speedIncrease20xInput'>20x Bonus Speed</label>
          </div>
          <br></br>
          Custom Bonus Speed
          <input
            id='speedIncreaseCustomInput'
            type='number'
            value='5'
            min='1'
            style='width: 50px;transform: translateY(-2px);'
            oninput={({ target: { value } }) => setOption('speedIncreaseCustom', parseInt(value))}
          >
          </input>
          <br></br>
          Background Bonus Speed
          <input
            id='speedIncreaseBackgroundInput'
            type='number'
            value=''
            placeholder='same'
            min='0'
            style='width: 50px;transform: translateY(-2px);'
            oninput={({ target: { value } }) => setOption('speedIncreaseBackground', parseFloat(value))}
          >
          </input>
          <div id='speedIncreaseBackgroundWarning' class='small block' style='display:none'>
            (This will apply even if bonus is inactive. To make the game run at full speed in the background, unset this
            or set it to 1 or greater)
          </div>
          <br></br>
          <button id='borrowTimeButton' class='button showthat control'>
            Borrow Time
            <div class='showthis'>
              You can grant yourself extra Bonus Seconds with this button, in one-day increments. You will always be
              able to see how much time you have borrowed in this way, and it will never have any impact on anything
              else in the game. You can return time you've borrowed if you want to get the number back down to zero, but
              you aren't required to.
            </div>
          </button>
          <div class='show-when-time-borrowed'>
            <button id='returnTimeButton' class='button control'>Return Time</button>
            Time borrowed: <span id='borrowedTimeDays'>0d</span>
          </div>
          <br></br>
          <div id='predictorSettings'>
            <br></br>
            <b>Predictor Settings</b>
            <br></br>
            <input
              id='predictorBackgroundThreadInput'
              type='checkbox'
              onChange={({ target: { checked } }) => setOption('predictorBackgroundThread', checked)}
            >
            </input>{' '}
            <label for='predictorBackgroundThreadInput'>Run predictor in background thread</label>
            <br></br>
            <label for='predictorTimePrecisionInput'>Degrees of precision on Time</label>
            <input
              id='predictorTimePrecisionInput'
              type='number'
              value='1'
              min='1'
              max='10'
              style='width: 50px;'
              oninput={({ target: { value } }) => setOption('predictorTimePrecision', parseInt(value))}
            >
            </input>
            <br></br>
            <label for='predictorNextPrecisionInput'>Degrees of precision on Next</label>
            <input
              id='predictorNextPrecisionInput'
              type='number'
              value='2'
              min='1'
              max='10'
              style='width: 50px;'
              oninput={({ target: { value } }) => setOption('predictorNextPrecision', parseInt(value))}
            >
            </input>
            <br></br>
            <label for='predictorActionWidthInput'>Width of the Action List (non-responsive UI only)</label>
            <input
              id='predictorActionWidthInput'
              type='number'
              value='500'
              min='100'
              max='4000'
              style='width: 50px; margin-left:40px'
              oninput={({ target: { value } }) => setOption('predictorActionWidth', parseInt(value))}
            >
            </input>
            <br></br>
            <input
              id='predictorRepeatPredictionInput'
              type='checkbox'
              onChange={({ target: { checked } }) => setOption('predictorRepeatPrediction', checked)}
            >
            </input>
            <label for='predictorRepeatPredictionInput'>"Repeat last action on list" applies to the Predictor</label>
            <br></br>
            <input
              id='predictorSlowModeInput'
              type='checkbox'
              onChange={({ target: { checked } }) => setOption('predictorSlowMode', checked)}
            >
            </input>
            <label for='predictorSlowModeInput'>
              Only update the predictor every
              <input
                id='predictorSlowTimerInput'
                type='number'
                value='1'
                min='1'
                style='width: 20px;'
                oninput={({ target: { value } }) => setOption('predictorSlowTimer', parseInt(value))}
              >
              </input>{' '}
              Minutes
            </label>
          </div>
        </div>
      </li>
      <li id='challengesMenu' tabindex='0' style='display:inline-block;height:30px;margin-left:10px;' class='showthatH'>
        Challenges
        <div class='showthisH'>
          <div>
            Challenges are special modes that impose special conditions and heavy restrictions.<br></br>
            They give no rewards ard are just here for fun.<br></br>
            It is only recommended to try them after beating the main game.<br></br>
            Please export and save your data locally before starting.<br></br>
            <b>Beginning a challenge will permanently delete your current save.</b>
            <br></br>
            <button
              class='button showthat control'
              style='margin-top: 2px;'
              onClick={() => exitChallenge()}
            >
              Exit Challenge
            </button>
            <button
              class='button showthat control'
              style='margin-top: 2px;'
              onClick={() => resumeChallenge()}
            >
              Resume Challenge
            </button>
            <br></br>
            <button
              class='button showthat control'
              style='margin-top: 2px;'
              onClick={() => beginChallenge(1)}
            >
              Mana Drought
              <div class='showthis' style='color:var(--default-color);width:230px;margin-left:100px;'>
                The mana merchant in Beginnersville only has 5k mana to sell, and they're charging double the usual
                price. No other mana merchants exist.
              </div>
            </button>
            <br></br>
            <button
              class='button showthat control'
              style='margin-top: 2px;'
              onClick={() => beginChallenge(2)}
            >
              Noodle Arms
              <div class='showthis' style='color:var(--default-color);width:230px;margin-left:100px;'>
                You have no base Self-Combat ability. All combat is based on followers. Self combat is half of your team
                member or zombie strength (whichever is higher).
              </div>
            </button>
            <br></br>
            <button
              class='button showthat control'
              style='margin-top: 2px;'
              onClick={() => beginChallenge(3)}
            >
              Mana Burn
              <div class='showthis' style='color:var(--default-color);width:230px;margin-left:100px;'>
                You have a day's worth of mana that persists through loops, but once that runs out, you'll be stuck in
                time. How far can you make it?
              </div>
            </button>
            <br></br>
          </div>
        </div>
      </li>
      <li id='totalsMenu' tabindex='0' style='display:inline-block;height:30px;margin-left:10px;' class='showthatH'>
        Totals
        <div class='showthisH'>
          <div>
            Effective Time: <div id='totalEffectiveTime'>1h 11m 41s</div>
            <br></br>
            Running Time: <div id='totalPlaytime'>12m 32s</div>
            <br></br>
            <span class='show-when-time-borrowed'>
              Time borrowed: <div id='borrowedTimeBalance'>0s</div>
              <br></br>
            </span>
            Loops: <div id='totalLoops'>891</div>
            <br></br>
            Actions: <div id='totalActions'>455</div>
            <br></br>
          </div>
        </div>
      </li>
      <li
        id='prestige_bonusesMenu'
        tabindex='0'
        style='display:inline-block;height:30px;margin-left:10px;'
        class='showthatH'
      >
        Prestige Perks
        <div class='showthisH'>
          <div>
            <br></br>
            Prestige bonuses are always active.<br></br>
            Each time you complete the game, you receive 90 points to spend on these bonuses.<br></br>
            Please export and save your data locally before attempting to trigger a prestige.<br></br>
            <br></br>
            <b>
              The ability to spec into prestige bonuses may be done at any time, but keep in mind this will reset ALL
              progress.
            </b>
            <br></br>
            <br></br>
            Imbue Soul levels will carry over between prestiges, up to the maximum number of prestiges you've completed.
            {' '}
            <br></br>
            Max carryover possible: <div id='maxTotalImbueSoulLevels'>0</div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <b>
              Total Prestiges Completed: <div id='currentPrestigesCompleted'>0</div>
            </b>
            <br></br>
            Available points: <div id='currentPrestigePoints'>0</div> / <div id='totalPrestigePoints'>0</div>
            <br></br>
            Upgrade cost follows the format of:
            <br></br>
            30 -&gt; 40 -&gt; 55 -&gt; 75 -&gt; 100 -&gt; 130 -&gt; ...
            <br></br>

            <br></br>
            <button class='button showthat control' style='margin-top: -50px;' id='prestigeUpgradePhysical'>
              Prestige Physical
              <div class='showthis' style='color:var(--default-color);width:230px;margin-left:200px;'>
                Increases Experience gain of all Physical stats (Dex, Str, Con, Spd, Per) by 20% per level.
                <br></br>
                <br></br>
                Current Bonus: <div id='prestigePhysicalCurrentBonus'>0</div>%<br></br>
                Next level cost: <div id='prestigePhysicalNextCost'>30</div> points<br></br>
              </div>
            </button>
            <br></br>

            <button class='button showthat control' style='margin-top: -50px;' id='prestigeUpgradeMental'>
              Prestige Mental
              <div class='showthis' style='color:var(--default-color);width:230px;margin-left:200px;'>
                Increases Experience gain of all Mental stats (Cha, Int, Soul, Luck) by 20% per level.
                <br></br>
                <br></br>
                Current Bonus: <div id='prestigeMentalCurrentBonus'>0</div>%<br></br>
                Next level cost: <div id='prestigeMentalNextCost'>30</div> points<br></br>
              </div>
            </button>
            <br></br>

            <button class='button showthat control' style='margin-top: -50px;' id='prestigeUpgradeCombat'>
              Prestige Combat
              <div class='showthis' style='color:var(--default-color);width:230px;margin-left:200px;'>
                Increases Self and Team Combat by 20% per level.
                <br></br>
                <br></br>
                Current Bonus: <div id='prestigeCombatCurrentBonus'>0</div>%<br></br>
                Next level cost: <div id='prestigeCombatNextCost'>30</div> points<br></br>
              </div>
            </button>
            <br></br>

            <button class='button showthat control' style='margin-top: -50px;' id='prestigeUpgradeSpatiomancy'>
              Prestige Spatiomancy
              <div class='showthis' style='color:var(--default-color);width:230px;margin-left:200px;'>
                Increases the number of "Findables" per zone by 10% per level.
                <br></br>
                <br></br>
                Current Bonus: <div id='prestigeSpatiomancyCurrentBonus'>0</div>%<br></br>
                Next level cost: <div id='prestigeSpatiomancyNextCost'>30</div> points<br></br>
              </div>
            </button>
            <br></br>

            <button class='button showthat control' style='margin-top: -50px;' id='prestigeUpgradeChronomancy'>
              Prestige Chronomancy
              <div class='showthis' style='color:var(--default-color);width:230px;margin-left:200px;'>
                Increases speed of all zones by a multiplier of 5% per level.
                <br></br>
                <br></br>
                Current Bonus: <div id='prestigeChronomancyCurrentBonus'>0</div>%<br></br>
                Next level cost: <div id='prestigeChronomancyNextCost'>30</div> points<br></br>
              </div>
            </button>
            <br></br>
            <button class='button showthat control' style='margin-top: -50px;' id='prestigeUpgradeBartering'>
              Prestige Bartering
              <div class='showthis' style='color:var(--default-color);width:230px;margin-left:200px;'>
                Increases mana received from merchants by 10% per level.
                <br></br>
                <br></br>
                Current Bonus: <div id='prestigeBarteringCurrentBonus'>0</div>%<br></br>
                Next level cost: <div id='prestigeBarteringNextCost'>30</div> points<br></br>
              </div>
            </button>
            <br></br>
            <button class='button showthat control' style='margin-top: -50px;' id='prestigeUpgradeExpOverflow'>
              Prestige Experience Overflow
              <div class='showthis' style='color:var(--default-color);width:230px;margin-left:200px;'>
                Experience earned is spread amongst all stats by 2% per level.
                <br></br>
                <br></br>
                Current Bonus: <div id='prestigeExpOverflowCurrentBonus'>0</div>%<br></br>
                Next level cost: <div id='prestigeExpOverflowNextCost'>30</div> points<br></br>
              </div>
            </button>
            <br></br>
            <br></br>
            <br></br>
            <button class='button showthat control' style='margin-top: -50px;' id='prestigeResetAll'>
              Reset All Prestiges
              <div class='showthis' style='color:var(--default-color);width:230px;margin-left:200px;'>
                Resets all current prestige bonuses, giving you back the points to allocate again. Note, this DOES
                trigger a reset, so this cannot be done mid-playthrough.
              </div>
            </button>
            <br></br>
          </div>
        </div>
      </li>
    </menu>
    <div id='trackedResources'>
      <div class='showthat resource' style='display:none' id='powerDiv'>
        <div class='bold'>
          <img src='icons/power.svg' class='smallIcon'></img>
        </div>
        <div id='power'>0</div>
        <div class='showthis'>
          Powers of the gods.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource'>
        <div class='bold'>
          Mana:
        </div>
        <div id='timer'>0 | 0s</div>
        <div class='showthis' style='position: fixed; inset: 28px auto auto 1642.12px; margin: 0px;'>
          Your main resource. The higher your mana, the more you can do before reset.
        </div>
      </div>
      <div class='showthat resource'>
        <div class='bold'>Gold:</div>
        <div id='gold'>0</div>
        <div class='showthis'>
          Coins to buy mana crystals and other items with.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='reputationDiv'>
        <div class='bold'>Reputation:</div>
        <div id='reputation'>0</div>
        <div class='showthis'>
          The influence you have over the people in town.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='herbsDiv'>
        <div class='bold'>Herbs:</div>
        <div id='herbs'>0</div>
        <div class='showthis'>
          The beneficial plants you've found.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='hideDiv'>
        <div class='bold'>Hide:</div>
        <div id='hide'>0</div>
        <div class='showthis'>
          Results of successful hunting.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='potionsDiv'>
        <div class='bold'>Potions:</div>
        <div id='potions'>0</div>
        <div class='showthis'>
          Rare, but not complex. Worth some money.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='teamMembersDiv'>
        <div class='bold'>Team Members:</div>
        <div id='teamMembers'>0</div>
        <div class='showthis'>
          You know their personalities and fighting style. They don't know your name.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='armorDiv'>
        <div class='bold'>Armor:</div>
        <div id='armor'>0</div>
        <div class='showthis'>
          Crafted by your own hand, it protects you from dangers.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='bloodDiv'>
        <div class='bold'>Blood:</div>
        <div id='blood'>0</div>
        <div class='showthis'>
          Regaled for its regenerative properties.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='artifactsDiv'>
        <div class='bold'>Artifacts:</div>
        <div id='artifacts'>0</div>
        <div class='showthis'>
          Various old rings, bracelets, amulets, and pendants. They look like they're worth a pretty penny.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='favorsDiv'>
        <div class='bold'>Favors:</div>
        <div id='favors'>0</div>
        <div class='showthis'>
          You've been generous to important people.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='enchantmentsDiv'>
        <div class='bold'>Enchanted Armor:</div>
        <div id='enchantments'>0</div>
        <div class='showthis'>
          Divinely blessed weapons and armor, like a hero of legend.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='housesDiv'>
        <div class='bold'>Houses:</div>
        <div id='houses'>0</div>
        <div class='showthis'>
          Property constructed in Valhalla. You can collect taxes from tenants.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='pylonsDiv'>
        <div class='bold'>Pylons:</div>
        <div id='pylons'>0</div>
        <div class='showthis'>
          Lingering fragments from the destroyed pylon.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='zombieDiv'>
        <div class='bold'>Zombies:</div>
        <div id='zombie'>0</div>
        <div class='showthis'>
          A shambling pile of deceased flesh. Super gross.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='mapDiv'>
        <div class='bold'>Maps:</div>
        <div id='map'>0</div>
        <div class='showthis'>
          A cartographer's kit that can be used to survey areas and discover new secrets.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='completedMapDiv'>
        <div class='bold'>Finished Maps:</div>
        <div id='completedMap'>0</div>
        <div class='showthis'>
          You've mapped out some part of the world. The Explorer's guild would happily buy this knowledge off of you.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='heartDiv'>
        <div class='bold'>
          <img src='icons/heart.svg' class='smallIcon'></img>
        </div>
        <div id='heart'>0</div>
        <div class='showthis'>
          The still-beating heart of your target. The Assassin's guild will reward you for this.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='glassesDiv'>
        <div class='bold'>
          <img src='icons/buyGlasses.svg' class='smallIcon'></img>
        </div>

        <div class='showthis'>
          Woah, trees have so many leaves on them.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='suppliesDiv'>
        <div class='bold'>
          <img src='icons/buySupplies.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          Needed to go to the next town.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='pickaxeDiv'>
        <div class='bold'>
          <img src='icons/buyPickaxe.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          It's heavy, but you can make use of it.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='loopingPotionDiv'>
        <div class='bold'>
          <img src='icons/loopingPotion.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          It's a potion made with the very same formula that got you into this mess. Why exactly did you make this?
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='citizenshipDiv'>
        <div class='bold'>
          <img src='icons/seekCitizenship.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          You're one of Valhalla's proud citizens now, giving you the right to fight in their honor.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='pegasusDiv'>
        <div class='bold'>
          <img src='icons/pegasus.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          A horse with great angelic wings. It can run across clouds as easily as dirt.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='keyDiv'>
        <div class='bold'>
          <img src='icons/purchaseKey.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          Needed to go to the next town.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='stoneDiv'>
        <div class='bold'>
          <img src='icons/temporalStone.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          A strange rock that seems unaffected by the time loops.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
    </div>
    <br></br>
    <div id='timeControls'>
      <div id='timeControlsMain'>
        <button id='pausePlay' class='button control'>Play</button>
        <button id='manualRestart' class='button showthatO control'>
          Restart
          <div class='showthis' style='color:var(--default-color);width:230px;'>
            Resets the loop. Not a hard reset.
          </div>
        </button>
        <input id='bonusIsActiveInput' type='checkbox' onchange='setOption(&quot;bonusIsActive&quot;, this.checked)'>
        </input>
        <button id='toggleOfflineButton' class='button showthatO control'>
          Bonus Seconds
          <div class='showthis' id='bonusText' style='max-width:500px;color:var(--default-color);'>
            <p>While this bonus is on, you get 19 extra seconds per second (20x game speed).</p>
            <p>
              You can adjust this speed or set a different speed for while this tab is in the background in the Extras
              menu.
            </p>
            <p>Accrue 1 bonus second per second when paused or offline. (capped at 1 month per offline period)</p>
            <p>
              Bonus is <span class='bold' id='isBonusOn'>ON</span>
            </p>
            <p>
              <span class='bold'>Total Bonus Seconds</span> <span id='bonusSeconds'>16d 8h 12m 27s</span>
            </p>
          </div>
        </button>
        <div class='control'>
          <div
            tabindex='0'
            id='story_control'
            class='showthatH'
            onfocus={() => view.updateStory(vals.storyShowing)}
            style='height:30px;'
          >
            <div class='large bold'>
              Story
            </div>
            <div id='newStory' style='color:var(--alert-color);display:none;'>(!)</div>
            <div id='story_tooltip' class='showthisH' style='width:400px;'>
              <button style='margin-left:175px;' class='actionIcon fa fa-arrow-left control' id='storyLeft'></button>
              <div style='' id='storyPage' class='bold control'></div>
              <button style='' class='actionIcon fa fa-arrow-right control' id='storyRight'></button>

              <div id='story0'>
                You're a simple courier, on a long trip to deliver a high priority package. Just as you entered town,
                you tripped - breaking your glasses - and the package burst open, spilling a strange liquid on you.
                Immediately, your meager amount of mana started draining rapidly. Right as your mana completely ran out,
                you found yourself back in the moment the liquid was absorbed into your skin, with your tiny reserves
                filled... yet draining just as before. This happened again and again, the world resetting with you,
                until you decided you had to figure out a way to prolong how long these 'loops' were. Mana crystals are
                often stored in pottery around town, perhaps you'll start there ...
              </div>
              <div id='story1'>
                You reach the end of the dungeon, where a softly glowing orb floats on a pedestal. You've found the
                dungeon core - for the first level of the dungeon, at least. As you grasp it, the essence dives into
                you, infusing your very being with the power it holds. It is a small amount of power, but this is a
                small dungeon. You'll be back to take this power again, knowing with the foreign knowledge implanted
                that it will stay with you no matter when you are.
              </div>
              <div id='story2'>
                You reach the end of the dungeon again, but for the first time the core isn't glowing. It's always been
                thought that dungeon cores feed upon the mana spent around them, but you're beginning to think the
                essence of its previous incarnations drains it somehow. It doesn't always happen, but you'll need to put
                more mana into the world to reap the core's benefits out of it. You shrug, accepting yet another oddity
                of the loops.
              </div>
              <div id='story3'>
                After spending most of a loop preparing, you're finally ready to leave Beginnersville. In a way, you're
                going to miss this town, and the thought of leaving almost brings a tear to your eye - until you realize
                you'll just be back next loop. Grumbling, you set off, hiking into the forest. By the time you're ready
                to make camp, you're in a good mood again. The forest is beautiful, teeming with life, and looks to have
                boundless places to explore. Best of all, on your way here, you passed several locations that are
                absolutely saturated with mana - you think you'll check those out first.
              </div>
              <div id='story4'>
                It's always nice, after doing the same dull tasks over and over, to make your way through the forest and
                get to do something new. Whether you're exploring, hunting, learning something or just sitting by the
                waterfall, the forest always makes a great backdrop. However, as pleasant as it's been here, it's time
                to move on, at least for now. It would be a long trip, but luckily, after all your exploring, you know
                some shortcuts, and before long, Merchanton emerges out of the trees. There's a lot to do here! Maybe
                one of the guilds can help you with your looping problem! Or maybe there's a book in the library that
                can lead you to a solution! Or maybe... or maybe... that all sounds like a lot of work, and you have
                been going through a lot lately. Maybe before any of that, you should find a bar and get a drink.
              </div>
              <div id='story5'>
                Abandoning Merchanton's warm and inviting cityscape for the cold and empty hills, you continue on your
                quest, now moving towards Mount Olympus. As the mountain's jagged peaks grow ever larger on the horizon,
                you groan at the thought that you're going to have to climb that colossus. The only things that keep you
                from turning right around and just looking for another town are the stories you heard in Merchanton.
                Stories of ancient cities made from fire; of a secret civilization of immortals hiding in the caverns;
                of mana so plentiful that it takes only seconds to perform magics that would normally take hours. The
                stories are so outrageous you're sure they're only myths, but myths have to come from somewhere, and if
                these have even a grain of truth to them, the power you could gain far outweighs the unpleasantness of
                simply climbing a mountain.
              </div>
              <div id='story6'>
                You expected to be whisked away to a land of opulence and wonder beyond your wildest dreams. Instead,
                you sat in a cramped room filling out paperwork for three hours before being dropped off outside what
                appears to be an ordinary town, with manicured lawns and meandering sidewalks leading to tidy parks and
                decorations. It's not ordinary though, if you stare at the grass you notice it's just a bit too green,
                the sky just a bit too blue. The literal deity taking a seven foot tall dog on a walk doesn't help
                either. A god passing by asks if you want to contribute to a local charity, and you see another god
                offering tours of 'Valhalla, the greatest city above the world!'
              </div>
              <div id='story7'>
                You find yourself in a land covered in a perpetual haze, with a deep red sky casting an eerie glow over
                the landscape. Alien and oppressive, it's unlike anywhere you've ever been; it feels more claustrophobic
                here than in the shrouded thickets of the forest or the deepest caves of Mt. Olympus. This is the shadow
                realm, a place of such natural hostility that it hurts just to stand here and look at it - it's like the
                haze is reaching inside your mind and suppressing your thoughts. One thing it can't suppress, though, is
                the intense feeling of familiarity at your immediate surroundings. The trees may be gnarled and the dirt
                may be dusty and ashen, but you've walked this road thousands of times - you could recognize the
                outskirts of Beginnersville in your sleep. It's not Beginnersville you see off in the distance though.
                In its place, you find only a desecrated ruin of a village, dominated by a massive dark spire sitting in
                the dead center of town.
              </div>
              <div id='story8'>
                Shadow realm or not, there are enough things that haven't changed that you still lean on your
                established routine. Right down to the part where you have to get some supplies to brave the jungle just
                outside the small town, from a local trader. Too bad this one is quite selectively deaf to your attempts
                at haggling, but hey. You've gotten good enough at budgeting and scrounging up coins that you could pay
                him in the end. Turning your eyes to the narrow trail through the dense jungle before you, you set foot
                among the wild trees, noting the ruins among the tree-trunks. You wonder if this place has always been a
                jungle...
              </div>
              <div id='story9'>
                Learning the finer points of alchemy, of the subtle rules underpinning the "simple" brewing of potions
                had been a long, exhausting trial, but since you have nothing but time on your hands, you have become an
                expert by any standard. As you let a bundle of herbs soak in a mana geyser, you double-check your notes
                and prepare your equipment. The brew itself is finicky but finally, you fill a bottle with the fruits of
                your Great Work. The Loop Potion, the exact same brew that got you into this situation. ...Reflecting
                for a moment, you wonder if there was much of a point to all of this. Not like making more of the stuff
                will get you out of the loops.
              </div>
              <div id='story10'>
                Exploring the jungle took quite a lot of time, and you just barely manage to make your way to the other
                side before the imposing gate among the trees closes. You mentally take note that you're on a time limit
                if you want to make it here on future loops, and that the pattern of the "normal" world still holds: On
                the other side of the jungle lies a small-ish city that proudly identifies itself as "Commerceville, the
                heart of trade!" according to the statue along the way to the city gates. While just wandering is liable
                to get you in trouble with some of the townsfolk, there is a helpful tourist guide willing to show you
                around for a "reasonable" sum. Even if the guide looks a little too eager to lead you down the city's
                many narrow alleyways, you can't deny that learning about the Thieves guild was worth the risk to get
                there. Finally, at the end of the tour, you learn that your guide also works for the tax collectors and
                really can't stay to chat. At least your guide was nice enough to show you to the Bank. There is an
                imposing hooded figure leaning against a wall of the bank, maybe they can tell you something more...
              </div>
              <div id='story11'>
                You can't help but chuckle as you make your way out of the Bank's "Big Shot" office, keys to the{' '}
                <i>entirety</i>{' '}
                of Commerceville in hand. Sure, the loan wasn't cheap and you'd probably get into a lot of trouble if
                you'd stick around for the first payment, but there's no way your mana reserves will last that long.
                Looking ahead, you blink at the first blatant difference between this world and the normal one: There is
                no Mt. Olympus. Instead, there is a large, wide valley with the ruins of a tower in the middle of it. It
                takes a bit of Doing, but you eventually find a stone covered in familiar runic script: "Children of the
                land! We, the seven guardian deities, challenge you! Find us, fight us, and claim the throne of the
                gods!" ...Oh well, time for a bit of deicide. The "throne of the gods" sounds like just the kind of
                thing that could break you out of the loops, and they <i>did</i>{' '}
                issue a challenge for anyone to find. Step one will be to reach them.
              </div>
              <div id='story12'>
                You've done it! You've bested the gods themselves and restored time to its rightful flow. You can stop
                looping at any moment. But, then again, you could keep going. There's always time later... Thanks for
                playing my fan mod of Idle Loops! Big shout-out to the wonderful Stop_Sign for creating this amazing
                game and Omsi for all the Omsi version. You both have inspired me more than you can imagine. Hope
                everyone had fun! &lt;3 <br></br>
                --Lloyd
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id='timeControlsOptions'>
        <div class='control'>
          <input
            type='checkbox'
            id='pauseBeforeRestartInput'
            onChange={({ target: { checked } }) => setOption('pauseBeforeRestart', checked)}
          >
          </input>
          <label for='pauseBeforeRestartInput'>Pause before restart</label>
        </div>
        <div class='control'>
          <input
            type='checkbox'
            id='pauseOnFailedLoopInput'
            onChange={({ target: { checked } }) => setOption('pauseOnFailedLoop', checked)}
          >
          </input>
          <label for='pauseOnFailedLoopInput'>Pause on failed loop</label>
        </div>
        <div class='control'>
          <input
            type='checkbox'
            id='pauseOnCompleteInput'
            onChange={({ target: { checked } }) => setOption('pauseOnComplete', checked)}
          >
          </input>
          <label for='pauseOnCompleteInput'>Pause on progress complete</label>
        </div>
      </div>
    </div>
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
            <div class='flex gap-2 items-center'>
              <span class='font-bold'>{t('actions.amounts.title')}</span>
              <Button class='w-8' onClick={() => setActionAmount(1)}>1</Button>
              <Button class='w-8' onClick={() => setActionAmount(5)}>5</Button>
              <Button class='w-8' onClick={() => setActionAmount(10)}>10</Button>
              <NumberField id='actionAmount' value={actionAmount()} onChange={setActionAmount} />
            </div>
          </div>
        </div>
        <div id='actionChanges' style='display: flex; text-align: left; width: 100%; margin-top: 5px'>
          <div id='actionChangeOptions' style='width: 50%'>
            <input
              type='checkbox'
              id='keepCurrentListInput'
              class='checkbox'
              onchange={({ target: { checked } }) => setOption('keepCurrentList', checked)}
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
              onchange={({ target: { checked } }) => setOption('repeatLastAction', checked)}
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
              onchange={({ target: { checked } }) => setOption('addActionsToTop', checked)}
            >
            </input>
            <label for='addActionsToTopInput' class='localized' data-locale='actions>tooltip>add_action_top'></label>
          </div>
          <div id='actionChangeButtons' style='margin-left: -4px; text-align: right; width: 50%'>
            <button
              id='maxTraining'
              class='button localized'
              style='margin-right: 0px; display: none'
              onClick={() => capAllTraining()}
              data-locale='actions>tooltip>max_training'
            >
            </button>
            <button
              id='clearList'
              class='button localized'
              style='margin-right: 0px'
              onClick={() => clearList()}
              data-locale='actions>tooltip>clear_list'
            >
            </button>
            <div tabindex='0' class='showthatloadout'>
              Manage Loadouts
              <div class='showthisloadout'>
                <button
                  class='loadoutbutton unused'
                  id='load1'
                  onClick={() => selectLoadout(1)}
                  style='width: 200px'
                >
                  Loadout 1
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load2'
                  onClick={() => selectLoadout(2)}
                  style='width: 200px'
                >
                  Loadout 2
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load3'
                  onClick={() => selectLoadout(3)}
                  style='width: 200px'
                >
                  Loadout 3
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load4'
                  onClick={() => selectLoadout(4)}
                  style='width: 200px'
                >
                  Loadout 4
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load5'
                  onClick={() => selectLoadout(5)}
                  style='width: 200px'
                >
                  Loadout 5
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load6'
                  onClick={() => selectLoadout(6)}
                  style='width: 200px'
                >
                  Loadout 6
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load7'
                  onClick={() => selectLoadout(7)}
                  style='width: 200px'
                >
                  Loadout 7
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load8'
                  onClick={() => selectLoadout(8)}
                  style='width: 200px'
                >
                  Loadout 8
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load9'
                  onClick={() => selectLoadout(9)}
                  style='width: 200px'
                >
                  Loadout 9
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load10'
                  onClick={() => selectLoadout(10)}
                  style='width: 200px'
                >
                  Loadout 10
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load11'
                  onClick={() => selectLoadout(11)}
                  style='width: 200px'
                >
                  Loadout 11
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load12'
                  onClick={() => selectLoadout(12)}
                  style='width: 200px'
                >
                  Loadout 12
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load13'
                  onClick={() => selectLoadout(13)}
                  style='width: 200px'
                >
                  Loadout 13
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load14'
                  onClick={() => selectLoadout(14)}
                  style='width: 200px'
                >
                  Loadout 14
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load15'
                  onClick={() => selectLoadout(15)}
                  style='width: 200px'
                >
                  Loadout 15
                </button>
                <br></br>
                <button
                  class='loadoutbutton localized'
                  style='margin-bottom: 5px; margin-top: 3px'
                  onClick={() => saveList()}
                  data-locale='actions>tooltip>save_loadout'
                >
                </button>
                <button
                  class='loadoutbutton localized'
                  style='margin-bottom: 5px'
                  onClick={() => loadList()}
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
                  onClick={() => nameList(true)}
                >
                  Rename
                </button>
              </div>
            </div>
            <select
              id='predictorTrackedStatInput'
              class='button'
              onchange={({ target: { value } }) => setOption('predictorTrackedStat', value)}
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
          onClick={() => view.showTown(vals.townsUnlocked[vals.townsUnlocked.indexOf(vals.townshowing) - 1])}
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
          onClick={() => view.showTown(vals.townsUnlocked[vals.townsUnlocked.indexOf(vals.townshowing) + 1])}
        >
        </div>
        <div id='hideVarsButton' class='far fa-eye' onClick={() => view.toggleHiding()}></div>
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
          onClick={() => view.showActions(false)}
        >
        </div>
        <span class='large bold' id='actionsTitle'></span>
        <div class='showthis localized' data-locale='actions>tooltip>desc'></div>
        <div
          style='float: right; margin-right: 150px'
          class='actionIcon fa fa-arrow-right'
          id='actionsViewRight'
          onClick={() => view.showActions(true)}
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
          onClick={() => actionLog.loadHistory(5)}
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
          onClick={() => view.changeStatView()}
          checked
        >
        </input>
        <label for='regularStats' class='localized' data-locale='stats>view>regular'></label>
        <input type='radio' id='radarStats' name='statView' onClick={() => view.changeStatView()}>
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
  </div>
);

export const Application = () => {
  createKeyboardHotkeys();

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
