import { beginChallenge, exitChallenge, resumeChallenge } from '../../../../saving.ts';

export const ChallengeMenu = () => {
  return (
    <li class='showthatH'>
      Challenges
      <div class='visible-on-hover'>
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
              The mana merchant in Beginnersville only has 5k mana to sell, and they're charging double the usual price.
              No other mana merchants exist.
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
  );
};
