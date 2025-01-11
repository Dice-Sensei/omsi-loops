import { Keyboard } from './logic/keyboard.ts';
import { Listeners } from './logic/listeners.ts';
import { t } from './locales/translations.utils.ts';
import { actions } from './actions.ts';
import { view } from './views/main.view.ts';
import { vals } from './saving.ts';
import {
  checkExtraSpeed,
  clearList,
  loadList,
  loadLoadout,
  manualRestart,
  pauseGame,
  saveList,
  toggleOffline,
} from './driver.ts';
import { actionAmount, setActionAmount } from './values.ts';

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
  if (!vals.townsUnlocked.includes(townNum)) return;

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
        fn: () => setActionAmount(1),
        description: t('shortcuts.changeActionAmount1'),
      },
      combination: 'alt+1',
    }, {
      onDown: {
        fn: () => setActionAmount(2),
        description: t('shortcuts.changeActionAmount2'),
      },
      combination: 'alt+2',
    }, {
      onDown: {
        fn: () => setActionAmount(3),
        description: t('shortcuts.changeActionAmount3'),
      },
      combination: 'alt+3',
    }, {
      onDown: {
        fn: () => setActionAmount(4),
        description: t('shortcuts.changeActionAmount4'),
      },
      combination: 'alt+4',
    }, {
      onDown: {
        fn: () => setActionAmount(5),
        description: t('shortcuts.changeActionAmount5'),
      },
      combination: 'alt+5',
    }, {
      onDown: {
        fn: () => setActionAmount(6),
        description: t('shortcuts.changeActionAmount6'),
      },
      combination: 'alt+6',
    }, {
      onDown: {
        fn: () => setActionAmount(7),
        description: t('shortcuts.changeActionAmount7'),
      },
      combination: 'alt+7',
    }, {
      onDown: {
        fn: () => setActionAmount(8),
        description: t('shortcuts.changeActionAmount8'),
      },
      combination: 'alt+8',
    }, {
      onDown: {
        fn: () => setActionAmount(9),
        description: t('shortcuts.changeActionAmount9'),
      },
      combination: 'alt+9',
    }, {
      onDown: {
        fn: () => setActionAmount(actionAmount() * 10),
        description: t('shortcuts.changeActionExponent10'),
      },
      combination: 'alt+0',
    }, {
      onDown: {
        fn: () => setActionAmount(Math.floor(actionAmount() / 10)),
        description: t('shortcuts.changeActionExponent01'),
      },
      combination: 'alt+backspace',
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
            vals
              .townsUnlocked[vals.townsUnlocked.indexOf(vals.townshowing) + 1],
          ),
        description: t('shortcuts.moveToNextTown'),
      },
      combination: ['right', 'd'],
    }, {
      onDown: {
        fn: () =>
          moveToTown(
            vals
              .townsUnlocked[vals.townsUnlocked.indexOf(vals.townshowing) - 1],
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
