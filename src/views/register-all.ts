import { buffList, statList } from '../globals.ts';
import { prestigeUpgrade, resetAllPrestiges } from '../prestige.ts';
import { borrowTime, manualRestart, pauseGame, returnTime, toggleOffline } from '../driver.ts';
import { actions } from '../actions.ts';
import { updateBuffCaps, view } from './main.view.ts';
import { vals } from '../saving.ts';

export const setActions = () => {
  requestAnimationFrame(() => {
    const borrowTimeButtonId = 'borrowTimeButton';
    const returnTimeButtonId = 'returnTimeButton';
    const pauseButtonId = 'pausePlay';
    const restartButtonId = 'manualRestart';
    const offlineButtonId = 'toggleOfflineButton';

    const borrowTimeButton = document.getElementById(borrowTimeButtonId)!;
    borrowTimeButton.onclick = () => borrowTime();

    const returnTimeButton = document.getElementById(returnTimeButtonId)!;
    returnTimeButton.onclick = () => returnTime();

    const pauseButton = document.getElementById(pauseButtonId)!;
    pauseButton.onclick = () => pauseGame();

    const restartButton = document.getElementById(restartButtonId)!;
    restartButton.onclick = () => manualRestart();

    const offlineButton = document.getElementById(offlineButtonId)!;
    offlineButton.onclick = () => toggleOffline();

    const prestigeUpgradePhysicalId = 'prestigeUpgradePhysical';
    const prestigeUpgradeMentalId = 'prestigeUpgradeMental';
    const prestigeUpgradeCombatId = 'prestigeUpgradeCombat';
    const prestigeUpgradeSpatiomancyId = 'prestigeUpgradeSpatiomancy';
    const prestigeUpgradeChronomancyId = 'prestigeUpgradeChronomancy';
    const prestigeUpgradeBarteringId = 'prestigeUpgradeBartering';
    const prestigeUpgradeExpOverflowId = 'prestigeUpgradeExpOverflow';
    const prestigeResetAllId = 'prestigeResetAll';

    const prestigeUpgradePhysical = document.getElementById(prestigeUpgradePhysicalId)!;
    const prestigeUpgradeMental = document.getElementById(prestigeUpgradeMentalId)!;
    const prestigeUpgradeCombat = document.getElementById(prestigeUpgradeCombatId)!;
    const prestigeUpgradeSpatiomancy = document.getElementById(prestigeUpgradeSpatiomancyId)!;
    const prestigeUpgradeChronomancy = document.getElementById(prestigeUpgradeChronomancyId)!;
    const prestigeUpgradeBartering = document.getElementById(prestigeUpgradeBarteringId)!;
    const prestigeUpgradeExpOverflow = document.getElementById(prestigeUpgradeExpOverflowId)!;
    const prestigeResetAll = document.getElementById(prestigeResetAllId)!;

    prestigeUpgradePhysical.onclick = () => prestigeUpgrade('PrestigePhysical');
    prestigeUpgradeMental.onclick = () => prestigeUpgrade('PrestigeMental');
    prestigeUpgradeCombat.onclick = () => prestigeUpgrade('PrestigeCombat');
    prestigeUpgradeSpatiomancy.onclick = () => prestigeUpgrade('PrestigeSpatiomancy');
    prestigeUpgradeChronomancy.onclick = () => prestigeUpgrade('PrestigeChronomancy');
    prestigeUpgradeBartering.onclick = () => prestigeUpgrade('PrestigeBartering');
    prestigeUpgradeExpOverflow.onclick = () => prestigeUpgrade('PrestigeExpOverflow');
    prestigeResetAll.onclick = () => resetAllPrestiges();

    for (const name of buffList) {
      const id = `buff${name}Container`;

      const container = document.getElementById(id)!;
      container.onmouseover = () => view.showBuff(name);
      container.onmouseout = () => view.showBuff(undefined);

      const cap = document.getElementById(`buff${name}Cap`)!;
      cap.onchange = () => updateBuffCaps();
    }

    const storyControl = document.getElementById('story_control')!;
    storyControl.onmouseover = () => view.updateStory(vals.storyShowing);
    storyControl.onfocus = () => view.updateStory(vals.storyShowing);

    const storyLeft = document.getElementById('storyLeft')!;
    storyLeft.onclick = () => view.updateStory(vals.storyShowing - 1);
    const storyRight = document.getElementById('storyRight')!;
    storyRight.onclick = () => view.updateStory(vals.storyShowing + 1);

    for (const stat of statList) {
      const id = `stat${stat}`;
      const statElement = document.getElementById(id)!;

      statElement.onmouseover = () => view.showStat(stat);
      statElement.onmouseout = () => view.showStat(undefined);
    }

    for (let i = 0; i < actions.current.length; i++) {
      const id = `action${i}Container`;
      const actionElement = document.getElementById(id)!;

      actionElement.onmouseover = () => view.mouseoverAction(i, true);
      actionElement.onmouseleave = () => view.mouseoverAction(i, false);
    }
  });
};
