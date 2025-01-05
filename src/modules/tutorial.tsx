import { Show } from 'solid-js';
import { createLocalStorageSignal } from '../signals/createPersistSignal.ts';

export const Tutorial = () => {
  const [showTutorial, toggleTutorial] = createLocalStorageSignal({
    key: 'is-tutorial-visible',
    fallback: true,
  });

  return (
    <Show when={showTutorial()}>
      <div class='fixed w-screen h-screen bg-gray-800 left-0 top-0 z-10'>
        <div class='bg-gray-500 w-10 h-10 relative opacity-50'></div>
        {
          /* <div style='padding: 20px; background-color: var(--body-background); border: 1px solid var(--input-border); position: absolute; text-align: left; left: 150px; top: 150px'>
          <span class='localized' data-locale='tutorial'></span>
          <button class='button' onClick={() => toggleTutorial(false)}>
            OK
          </button>
        </div> */
        }
      </div>
    </Show>
  );
};
