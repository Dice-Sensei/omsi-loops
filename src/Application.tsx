import { WelcomeMessage } from './modules/WelcomeMessage.tsx';
import { createKeyboardHotkeys } from './modules/hotkeys/keyboard.hotkeys.ts';
import { Header } from './modules/Header/Header.tsx';
import { Actions } from './modules/Actions/Actions.tsx';
import { Towns } from './modules/Towns/Towns.tsx';
import { Stats } from './modules/Statistics/Stats.tsx';

export const Application = () => {
  createKeyboardHotkeys();

  return (
    <section class='contents'>
      <Header />
      <Actions />
      <Towns />
      <Stats />
      <WelcomeMessage />
      <div id='overlays' />
    </section>
  );
};
