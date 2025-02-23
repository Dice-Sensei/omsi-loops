import './styles.css';

import { render } from 'solid-js/web';
import { loadDefaults, startGame } from './original/saving.ts';
import { createKeyboardHotkeys } from './modules/hotkeys/keyboard.hotkeys.ts';
import { Header } from './modules/Header/Header.tsx';
import { Actions } from './modules/Actions/Actions.tsx';
import { Zones } from './modules/Towns/Zones.tsx';
import { Stats } from './modules/Statistics/Stats.tsx';
import { WelcomeMessage } from './modules/WelcomeMessage.tsx';
import { ActionLogView } from './modules/Towns/ActionLogView.tsx';

const main = document.getElementById('app');
if (main) {
  render(() => {
    createKeyboardHotkeys();

    return (
      <section class='contents'>
        <Header />
        <Actions />
        <div class='flex flex-col'>
          <Zones />
          <ActionLogView />
        </div>
        <Stats />
        <WelcomeMessage />
        <div id='overlays' />
      </section>
    );
  }, main);
}

loadDefaults();

startGame();
