import { Button } from '../../../../components/buttons/Button/Button.tsx';
import { beginChallenge, exitChallenge, resumeChallenge } from '../../../../saving.ts';

export const ChallengeMenu = () => {
  return (
    <li class='contains-popover'>
      {t('menu.challenges.title')}
      <div class='popover-content'>
        <div>{t('menu.challenges.messages.description')}</div>
        <div>{t('menu.challenges.messages.recommendation')}</div>
        <div>{t('menu.challenges.messages.saveBeforeStarting')}</div>
        <div class='font-bold'>{t('menu.challenges.messages.warnBeginChallenge')}</div>
        <div class='flex gap-2'>
          <Button onClick={() => exitChallenge()}>
            {t('menu.challenges.challenges.exit')}
          </Button>
          <Button onClick={() => resumeChallenge()}>
            {t('menu.challenges.challenges.resume')}
          </Button>
        </div>
        <div>
          <Button class='showthat' onClick={() => beginChallenge(1)}>
            {t('menu.challenges.challenges.manaDrought.title')}
            <div class='showthis'>
              {t('menu.challenges.challenges.manaDrought.description')}
            </div>
          </Button>
          <Button class='showthat' onClick={() => beginChallenge(2)}>
            {t('menu.challenges.challenges.noodleArms.title')}
            <div class='showthis'>
              {t('menu.challenges.challenges.noodleArms.description')}
            </div>
          </Button>
          <Button class='showthat' onClick={() => beginChallenge(3)}>
            {t('menu.challenges.challenges.manaBurn.title')}
            <div class='showthis'>
              {t('menu.challenges.challenges.manaBurn.description')}
            </div>
          </Button>
        </div>
      </div>
    </li>
  );
};
