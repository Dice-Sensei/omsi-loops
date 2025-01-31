import { buffList, statList } from '../original/globals.ts';
import { actions } from '../original/actions.ts';
import { updateBuffCaps, view } from './main.view.ts';

export const setActions = () => {
  requestAnimationFrame(() => {
    for (const name of buffList) {
      const id = `buff${name}Container`;

      const container = document.getElementById(id)!;
      container.onmouseover = () => view.showBuff(name);
      container.onmouseout = () => view.showBuff(undefined);

      const cap = document.getElementById(`buff${name}Cap`)!;
      cap.onchange = () => updateBuffCaps();
    }

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
