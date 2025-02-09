import { WelcomeMessage } from './modules/WelcomeMessage.tsx';
import { createKeyboardHotkeys } from './modules/hotkeys/keyboard.hotkeys.ts';
import { Header } from './modules/Header/Header.tsx';
import { Actions } from './modules/Actions/Actions.tsx';
import { Towns } from './modules/Towns/Towns.tsx';
import { Stats } from './modules/Statistics/Stats.tsx';
import { ActionLogView } from './modules/Towns/ActionLogView.tsx';

export const Application = () => {
  createKeyboardHotkeys();

  return (
    <section class='contents'>
      <Header />
      <Actions />
      <div class='flex flex-col'>
        <Towns />
        <ActionLogView />
      </div>
      <Stats />
      <WelcomeMessage />
      <div id='overlays' />
    </section>
  );
};
