import { ChallengeMode } from '../../../../original/challenges.ts';
import { Button } from '../../../../components/buttons/Button/Button.tsx';
import {
  challengeSaveName,
  getSaveName,
  performGameLoad,
  performSaveGame,
  setSaveName,
  vals,
} from '../../../../original/saving.ts';
import { et } from '../../../../locales/translations.utils.ts';
import { performGamePause, performGameRestart } from '../../../../original/driver.ts';
import { MenuOption } from './MenuOption.tsx';

function beginChallenge(challenge: ChallengeMode) {
  console.log('Beginning Challenge');

  if (globalThis.localStorage[challengeSaveName] && globalThis.localStorage[challengeSaveName] !== '') {
    if (confirm('Beginning a new challenge will delete your current challenge save. Are you sure you want to begin?')) {
      globalThis.localStorage[challengeSaveName] = '';
    } else {
      return;
    }
  }

  if (vals.challengeSave.challengeMode === 0) {
    vals.challengeSave.inChallenge = true;
    performSaveGame();
    console.log('Saving to: ' + getSaveName());
  }

  vals.challengeSave.challengeMode = challenge;
  setSaveName(challengeSaveName);

  performGameLoad(true);
  vals.totalOfflineMs = 1000000;

  performSaveGame();
  performGamePause();
  performGameRestart();
}

function exitChallenge() {
  if (vals.challengeSave.challengeMode !== 0) {
    setSaveName(vals.defaultSaveName);
    performGameLoad(false);
    performSaveGame();
    location.reload();
  }
}

function resumeChallenge() {
  if (
    vals.challengeSave.challengeMode === 0 && globalThis.localStorage[challengeSaveName] &&
    globalThis.localStorage[challengeSaveName] !== ''
  ) {
    vals.challengeSave.inChallenge = true;
    performSaveGame();
    setSaveName(challengeSaveName);
    performGameLoad(true);
    performSaveGame();
    performGamePause();
    performGameRestart();
  }
}

const t = et('menu.challenges');
export const ChallengeMenu = () => (
  <MenuOption title={t('title')}>
    <div>{t('messages.description')}</div>
    <div>{t('messages.recommendation')}</div>
    <div>{t('messages.saveBeforeStarting')}</div>
    <div class='font-bold'>{t('messages.warnBeginChallenge')}</div>
    <div class='font-bold'>Current challenge: {vals.challengeSave.challengeMode}</div>
    <div class='flex flex-col gap-4'>
      <div class='flex flex-col gap-2'>
        <Button class='showthat' onClick={() => beginChallenge(ChallengeMode.ManaDrought)}>
          {t('challenges.manaDrought.title')}
          <div class='showthis'>
            {t('challenges.manaDrought.description')}
          </div>
        </Button>
        <Button class='showthat' onClick={() => beginChallenge(ChallengeMode.NoodleArms)}>
          {t('challenges.noodleArms.title')}
          <div class='showthis'>
            {t('challenges.noodleArms.description')}
          </div>
        </Button>
        <Button class='showthat' onClick={() => beginChallenge(ChallengeMode.ManaBurn)}>
          {t('challenges.manaBurn.title')}
          <div class='showthis'>
            {t('challenges.manaBurn.description')}
          </div>
        </Button>
      </div>
      <div class='flex gap-2'>
        <Button class='w-full' onClick={() => exitChallenge()}>
          {t('challenges.exit')}
        </Button>
        <Button class='w-full' onClick={() => resumeChallenge()}>
          {t('challenges.resume')}
        </Button>
      </div>
    </div>
  </MenuOption>
);
