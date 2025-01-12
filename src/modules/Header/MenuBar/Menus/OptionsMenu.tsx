import { Localization } from '../../../../localization.ts';
import { setOption } from '../../../../saving.ts';

export const OptionsMenu = () => {
  return (
    <li class='contains-popover'>
      Options
      <div class='popover-content'>
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
  );
};
