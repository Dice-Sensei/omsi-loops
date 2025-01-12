import { setOption } from '../../../../original/saving.ts';

export const ExtraMenu = () => {
  return (
    <li class='contains-popover'>
      Extras
      <div class='popover-content' style='padding-top:1ex'>
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
            You can grant yourself extra Bonus Seconds with this button, in one-day increments. You will always be able
            to see how much time you have borrowed in this way, and it will never have any impact on anything else in
            the game. You can return time you've borrowed if you want to get the number back down to zero, but you
            aren't required to.
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
  );
};
