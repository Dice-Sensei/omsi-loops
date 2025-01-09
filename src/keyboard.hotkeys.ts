import { Keyboard } from './logic/keyboard.ts';
import { Listeners } from './logic/listeners.ts';
import { t } from './locales/translations.utils.ts';
import { actions } from './actions.ts';
import { view } from './views/main.view.ts';
import {
  changeActionAmount,
  checkExtraSpeed,
  clearList,
  loadList,
  loadLoadout,
  manualRestart,
  pauseGame,
  saveList,
  toggleOffline,
} from './driver.ts';

export function setShiftKey(value: boolean): void {
  if (KeyboardKey.shift === value) return;
  KeyboardKey.shift = value;

  document.documentElement.classList.toggle('shift-key-pressed', value);
  globalThis.dispatchEvent(new Event('modifierkeychange'));
}

export function setControlKey(value: boolean): void {
  if (KeyboardKey.control === value) return;
  KeyboardKey.control = value;

  document.documentElement.classList.toggle('control-key-pressed', value);
  globalThis.dispatchEvent(new Event('modifierkeychange'));
}

export function moveToTown(townNum: number | undefined): void {
  if (townNum === undefined) return;
  if (!globalThis.saving.vals.townsUnlocked.includes(townNum)) return;

  view.showTown(townNum);
}

export namespace KeyboardKey {
  export const shift = false;
  export const control = false;
}

export const createKeyboardHotkeys = () => {
  Keyboard
    .listens([{
      onDown: {
        fn: () => pauseGame(),
        description: t('shortcuts.pauseGame'),
      },
      combination: 'space',
    }, {
      onDown: {
        fn: () => manualRestart(),
        description: t('shortcuts.manualRestart'),
      },
      combination: 'r',
    }, {
      onDown: {
        fn: () => toggleOffline(),
        description: t('shortcuts.toggleOffline'),
      },
      combination: 'b',
    }, {
      onDown: {
        fn: () => loadLoadout(1),
        description: t('shortcuts.loadLoadout1'),
      },
      combination: 'shift+1',
    }, {
      onDown: {
        fn: () => loadLoadout(2),
        description: t('shortcuts.loadLoadout2'),
      },
      combination: 'shift+2',
    }, {
      onDown: {
        fn: () => loadLoadout(3),
        description: t('shortcuts.loadLoadout3'),
      },
      combination: 'shift+3',
    }, {
      onDown: {
        fn: () => loadLoadout(4),
        description: t('shortcuts.loadLoadout4'),
      },
      combination: 'shift+4',
    }, {
      onDown: {
        fn: () => loadLoadout(5),
        description: t('shortcuts.loadLoadout5'),
      },
      combination: 'shift+5',
    }, {
      onDown: {
        fn: () => changeActionAmount(1),
        description: t('shortcuts.changeActionAmount1'),
      },
      combination: '1',
    }, {
      onDown: {
        fn: () => changeActionAmount(2),
        description: t('shortcuts.changeActionAmount2'),
      },
      combination: '2',
    }, {
      onDown: {
        fn: () => changeActionAmount(3),
        description: t('shortcuts.changeActionAmount3'),
      },
      combination: '3',
    }, {
      onDown: {
        fn: () => changeActionAmount(4),
        description: t('shortcuts.changeActionAmount4'),
      },
      combination: '4',
    }, {
      onDown: {
        fn: () => changeActionAmount(5),
        description: t('shortcuts.changeActionAmount5'),
      },
      combination: '5',
    }, {
      onDown: {
        fn: () => changeActionAmount(6),
        description: t('shortcuts.changeActionAmount6'),
      },
      combination: '6',
    }, {
      onDown: {
        fn: () => changeActionAmount(7),
        description: t('shortcuts.changeActionAmount7'),
      },
      combination: '7',
    }, {
      onDown: {
        fn: () => changeActionAmount(8),
        description: t('shortcuts.changeActionAmount8'),
      },
      combination: '8',
    }, {
      onDown: {
        fn: () => changeActionAmount(9),
        description: t('shortcuts.changeActionAmount9'),
      },
      combination: '9',
    }, {
      onDown: {
        fn: () => changeActionAmount(actions.addAmount * 10),
        description: t('shortcuts.changeActionExponent10'),
      },
      combination: '0',
    }, {
      onDown: {
        fn: () => changeActionAmount(Math.floor(actions.addAmount / 10)),
        description: t('shortcuts.changeActionExponent01'),
      },
      combination: 'backspace',
    }, {
      onDown: {
        fn: () => saveList(),
        description: t('shortcuts.saveLoadout'),
      },
      combination: 'shift+s',
    }, {
      onDown: {
        fn: () => loadList(),
        description: t('shortcuts.loadLoadout'),
      },
      combination: 'shift+l',
    }, {
      onDown: {
        fn: () => clearList(),
        description: t('shortcuts.clearLoadout'),
      },
      combination: 'shift+c',
    }, {
      onDown: {
        fn: () => setShiftKey(true),
        description: t('shortcuts.toggleShiftKeyOn'),
      },
      onUp: {
        fn: () => setShiftKey(false),
        description: t('shortcuts.toggleShiftKeyOff'),
      },
      combination: 'shift',
    }, {
      onDown: {
        fn: () => setControlKey(true),
        description: t('shortcuts.toggleControlKeyOn'),
      },
      onUp: {
        fn: () => setControlKey(false),
        description: t('shortcuts.toggleControlKeyOff'),
      },
      combination: ['ctrl', 'command'],
    }, {
      onDown: {
        fn: () =>
          moveToTown(
            globalThis.saving.vals
              .townsUnlocked[globalThis.saving.vals.townsUnlocked.indexOf(globalThis.saving.vals.townshowing) + 1],
          ),
        description: t('shortcuts.moveToNextTown'),
      },
      combination: ['right', 'd'],
    }, {
      onDown: {
        fn: () =>
          moveToTown(
            globalThis.saving.vals
              .townsUnlocked[globalThis.saving.vals.townsUnlocked.indexOf(globalThis.saving.vals.townshowing) - 1],
          ),
        description: t('shortcuts.moveToPreviousTown'),
      },
      combination: ['left', 'a'],
    }, {
      onDown: {
        fn: () => view.showActions(true),
        description: t('shortcuts.showActions'),
      },
      combination: ['shift+right', 'shift+d'],
    }, {
      onDown: {
        fn: () => view.showActions(false),
        description: t('shortcuts.hideActions'),
      },
      combination: ['shift+left', 'shift+a'],
    }, {
      onDown: {
        fn: () => {
          actions.undoLast();
          view.updateNextActions();
          view.updateLockedHidden();
        },
        description: t('shortcuts.undoLastAction'),
      },
      combination: 'shift+z',
    }]);

  Listeners.add('focus', () => {
    setShiftKey(false);
    setControlKey(false);

    checkExtraSpeed();
  });

  Listeners.add('blur', () => {
    checkExtraSpeed();
  });
};
