import { createLocalStorageSignal } from '../signals/createPersistSignal.ts';
import { t } from '../locales/translations.utils.ts';
import { Button } from '../components/buttons/Button/Button.tsx';
import { Modal } from '../components/containers/Modal/Modal.tsx';
import { Show } from 'solid-js';

const createWelcomeMessage = () => createLocalStorageSignal({ key: createWelcomeMessage.key, fallback: true });
createWelcomeMessage.key = 'is-welcome-visible';

export const WelcomeMessage = () => {
  const [showWelcomeMessage, toggleWelcomeMessage] = createWelcomeMessage();

  return (
    <Show when={showWelcomeMessage()}>
      <Modal
        title={t('modals.welcome.title')}
        Actions={() => <Button onClick={() => toggleWelcomeMessage(false)}>{t('modals.welcome.actions.begin')}</Button>}
        class='min-h-96'
      >
        <div class='flex flex-col items-center justify-center gap-2'>
          <span class='text-lg'>{t('modals.welcome.welcome')}</span>
          <span>{t('modals.welcome.content')}</span>
        </div>
      </Modal>
    </Show>
  );
};
