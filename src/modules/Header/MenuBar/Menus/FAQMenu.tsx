import { For } from 'solid-js';
import { t } from '../../../../locales/translations.utils.ts';

export const FaqMenu = () => {
  return (
    <li class='showthatH'>
      {t('menu.faq.title')}
      <ul class='flex flex-col gap-1 visible-on-hover'>
        <For each={t('menu.faq.questions')}>
          {(question) => (
            <li class='showthat2' tabindex='0'>
              <div>
                <span class='font-medium'>{t('menu.faq.question')}:</span> {question.q}
              </div>
              <div class='showthis2'>
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
