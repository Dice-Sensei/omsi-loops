import { et } from '../../../../locales/translations.utils.ts';
import { For } from '../../../../components/flow/For/For.tsx';
import { Tooltip } from '../../../../components/containers/Overlay/primitives/Tooltip.tsx';
import { HorizontalBar } from '../../../../components/flow/HorizontalBar/HorizontalBar.tsx';
import { MenuOption } from './MenuOption.tsx';

const t = et('menu.faq');
export const FaqMenu = () => (
  <MenuOption title={t('title')}>
    <For each={t('questions')} as='ul' class='flex flex-col gap-1'>
      {(question) => (
        <>
          <Tooltip>
            <Tooltip.Trigger>
              <span class='font-medium'>{t('question')}:{' '}</span>
              {question.q}
            </Tooltip.Trigger>
            <Tooltip.Content>
              <span class='font-medium'>{t('answer')}:{' '}</span>
              {question.a}
            </Tooltip.Content>
          </Tooltip>
          <HorizontalBar />
        </>
      )}
    </For>
  </MenuOption>
);
