import { Button } from '../../components/buttons/Button/Button.tsx';
import { t } from '../../locales/translations.utils.ts';
import { actionLog } from '../../original/globals.ts';
import { createIntervalSignal } from '../../signals/createInterval.ts';

export const ActionLogView = () => {
  const [entries] = createIntervalSignal([], () => [...actionLog.entries]);

  return (
    <div class='flex flex-col gap-2'>
      <span class='font-bold w-full text-center'>
        {t('actionLog.title')}
      </span>
      <Button variant='text' class='font-xs italic' onClick={() => actionLog.loadHistory(5)}>
        {t('actionLog.actions.loadPrevious')}
      </Button>
      <ul class='flex flex-col gap-0.5'>
        <For each={entries()}>
          {(entry) => (
            <li>
              {entry.format(entry.getText())}
            </li>
          )}
        </For>
        <li class='text-sm font-medium w-full text-center text-neutral-500 italic'>
          {t('actionLog.messages.latest')}
        </li>
      </ul>
    </div>
  );
};
