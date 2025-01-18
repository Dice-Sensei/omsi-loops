import { t } from '../../../../locales/translations.utils.ts';
import { For } from '../../../../components/flow/For/For.tsx';

export const FaqMenu = () => {
  return (
    <div class='contains-popover'>
      {t('menu.faq.title')}
      <For each={t('menu.faq.questions')} as='ul' class='flex flex-col gap-1 popover-content'>
        {(question) => (
          <div class='showthat' tabindex='0'>
            <div>
              <span class='font-medium'>{t('menu.faq.question')}:</span> {question.q}
            </div>
            <div class='showthis'>
              <span class='font-medium'>{t('menu.faq.answer')}:</span>
              {question.a}
            </div>
            <hr class='border-neutral-500'></hr>
          </div>
        )}
      </For>
    </div>
  );
};
