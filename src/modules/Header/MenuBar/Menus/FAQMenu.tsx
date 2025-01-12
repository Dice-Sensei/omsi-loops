import { For } from 'solid-js';
import { t } from '../../../../locales/translations.utils.ts';

export const FaqMenu = () => {
  return (
    <li class='contains-popover'>
      {t('menu.faq.title')}
      <ul class='flex flex-col gap-1 popover-content'>
        <For each={t('menu.faq.questions')}>
          {(question) => (
            <li class='showthat' tabindex='0'>
              <div>
                <span class='font-medium'>{t('menu.faq.question')}:</span> {question.q}
              </div>
              <div class='showthis'>
                <span class='font-medium'>{t('menu.faq.answer')}:</span>
                {question.a}
              </div>
              <hr class='border-neutral-500'></hr>
            </li>
          )}
        </For>
      </ul>
    </li>
  );
};
