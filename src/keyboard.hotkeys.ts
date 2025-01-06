import { Keyboard } from './logic/keyboard.ts';
import { Listeners } from './logic/listeners.ts';
import { t } from './locales/translations.utils.ts';

function setShiftKey(value: boolean): void {
  const previous = globalThis.trash.shiftDown;
  globalThis.trash.shiftDown = value;

  document.documentElement.classList.toggle('shift-key-pressed', value);
  if (globalThis.trash.shiftDown === previous) return;
  globalThis.dispatchEvent(new Event('modifierkeychange'));
}

function setControlKey(value: boolean): void {
  const previous = globalThis.trash.controlDown;
  globalThis.trash.controlDown = value;

  document.documentElement.classList.toggle('control-key-pressed', value);

  if (globalThis.trash.controlDown === previous) return;
  globalThis.dispatchEvent(new Event('modifierkeychange'));
}

function moveToTown(townNum: number | undefined): void {
  if (townNum === undefined) return;
  if (!globalThis.saving.vals.townsUnlocked.includes(townNum)) return;

  globalThis.saving.view.showTown(townNum);
}

Keyboard
  .listens([{
    onDown: {
      fn: () => globalThis.driver.pauseGame(),
      description: t('shortcuts.pauseGame'),
    },
    combination: 'space',
  }, {
    onDown: {
      fn: () => globalThis.driver.manualRestart(),
      description: t('shortcuts.manualRestart'),
    },
    combination: 'r',
  }, {
    onDown: {
      fn: () => globalThis.driver.toggleOffline(),
      description: t('shortcuts.toggleOffline'),
    },
    combination: 'b',
  }, {
    onDown: {
      fn: () => globalThis.driver.loadLoadout(1),
      description: t('shortcuts.loadLoadout1'),
    },
    combination: 'shift+1',
  }, {
    onDown: {
      fn: () => globalThis.driver.loadLoadout(2),
      description: t('shortcuts.loadLoadout2'),
    },
    combination: 'shift+2',
  }, {
    onDown: {
      fn: () => globalThis.driver.loadLoadout(3),
      description: t('shortcuts.loadLoadout3'),
    },
    combination: 'shift+3',
  }, {
    onDown: {
      fn: () => globalThis.driver.loadLoadout(4),
      description: t('shortcuts.loadLoadout4'),
    },
    combination: 'shift+4',
  }, {
    onDown: {
      fn: () => globalThis.driver.loadLoadout(5),
      description: t('shortcuts.loadLoadout5'),
    },
    combination: 'shift+5',
  }, {
    onDown: {
      fn: () => globalThis.driver.changeActionAmount(1),
      description: t('shortcuts.changeActionAmount1'),
    },
    combination: '1',
  }, {
    onDown: {
      fn: () => globalThis.driver.changeActionAmount(2),
      description: t('shortcuts.changeActionAmount2'),
    },
    combination: '2',
  }, {
    onDown: {
      fn: () => globalThis.driver.changeActionAmount(3),
      description: t('shortcuts.changeActionAmount3'),
    },
    combination: '3',
  }, {
    onDown: {
      fn: () => globalThis.driver.changeActionAmount(4),
      description: t('shortcuts.changeActionAmount4'),
    },
    combination: '4',
  }, {
    onDown: {
      fn: () => globalThis.driver.changeActionAmount(5),
      description: t('shortcuts.changeActionAmount5'),
    },
    combination: '5',
  }, {
    onDown: {
      fn: () => globalThis.driver.changeActionAmount(6),
      description: t('shortcuts.changeActionAmount6'),
    },
    combination: '6',
  }, {
    onDown: {
      fn: () => globalThis.driver.changeActionAmount(7),
      description: t('shortcuts.changeActionAmount7'),
    },
    combination: '7',
  }, {
    onDown: {
      fn: () => globalThis.driver.changeActionAmount(8),
      description: t('shortcuts.changeActionAmount8'),
    },
    combination: '8',
  }, {
    onDown: {
      fn: () => globalThis.driver.changeActionAmount(9),
      description: t('shortcuts.changeActionAmount9'),
    },
    combination: '9',
  }, {
    onDown: {
      fn: () => globalThis.driver.changeActionAmount(globalThis.saving.actions.addAmount * 10),
      description: t('shortcuts.changeActionExponent10'),
    },
    combination: '0',
  }, {
    onDown: {
      fn: () => globalThis.driver.changeActionAmount(Math.floor(globalThis.saving.actions.addAmount / 10)),
      description: t('shortcuts.changeActionExponent01'),
    },
    combination: 'backspace',
  }, {
    onDown: {
      fn: () => globalThis.driver.saveList(),
      description: t('shortcuts.saveLoadout'),
    },
    combination: 'shift+s',
  }, {
    onDown: {
      fn: () => globalThis.driver.loadList(),
      description: t('shortcuts.loadLoadout'),
    },
    combination: 'shift+l',
  }, {
    onDown: {
      fn: () => globalThis.driver.clearList(),
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
            .townsUnlocked[globalThis.saving.vals.townsUnlocked.indexOf(globalThis.saving.vals.townShowing) + 1],
        ),
      description: t('shortcuts.moveToNextTown'),
    },
    combination: ['right', 'd'],
  }, {
    onDown: {
      fn: () =>
        moveToTown(
          globalThis.saving.vals
            .townsUnlocked[globalThis.saving.vals.townsUnlocked.indexOf(globalThis.saving.vals.townShowing) - 1],
        ),
      description: t('shortcuts.moveToPreviousTown'),
    },
    combination: ['left', 'a'],
  }, {
    onDown: {
      fn: () => globalThis.saving.view.showActions(true),
      description: t('shortcuts.showActions'),
    },
    combination: ['shift+right', 'shift+d'],
  }, {
    onDown: {
      fn: () => globalThis.saving.view.showActions(false),
      description: t('shortcuts.hideActions'),
    },
    combination: ['shift+left', 'shift+a'],
  }, {
    onDown: {
      fn: () => {
        globalThis.globals.actions.undoLast();
        globalThis.saving.view.updateNextActions();
        globalThis.saving.view.updateLockedHidden();
      },
      description: t('shortcuts.undoLastAction'),
    },
    combination: 'shift+z',
  }]);

Listeners.add('focus', () => {
  setShiftKey(false);
  setControlKey(false);

  globalThis.driver.checkExtraSpeed();
});

Listeners.add('blur', () => {
  globalThis.driver.checkExtraSpeed();
});

declare global {
  interface Trash {
    shiftDown: boolean;
    controlDown: boolean;
  }
}

globalThis.trash.shiftDown = false;
globalThis.trash.controlDown = false;
