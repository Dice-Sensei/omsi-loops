import { buffList, statList } from '../original/globals.ts';
import { borrowTime, manualRestart, performGamePause, returnTime, toggleOffline } from '../original/driver.ts';
import { actions } from '../original/actions.ts';
import { updateBuffCaps, view } from './main.view.ts';
import { vals } from '../original/saving.ts';

export const setActions = () => {
  requestAnimationFrame(() => {
    const pauseButtonId = 'pausePlay';
    const restartButtonId = 'manualRestart';
    const offlineButtonId = 'toggleOfflineButton';

    const pauseButton = document.getElementById(pauseButtonId)!;
    pauseButton.onclick = () => performGamePause();

    const restartButton = document.getElementById(restartButtonId)!;
    restartButton.onclick = () => manualRestart();

    const offlineButton = document.getElementById(offlineButtonId)!;
    offlineButton.onclick = () => toggleOffline();

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
