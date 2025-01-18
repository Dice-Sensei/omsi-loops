export const PrestigeMenu = () => {
  return (
    <div class='contains-popover'>
      Prestige Perks
      <div class='popover-content'>
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
              Resets all current prestige bonuses, giving you back the points to allocate again. Note, this DOES trigger
              a reset, so this cannot be done mid-playthrough.
            </div>
          </button>
          <br></br>
        </div>
      </div>
    </div>
  );
};
