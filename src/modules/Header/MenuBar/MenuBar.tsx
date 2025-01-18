import { ChangelogMenu } from './Menus/ChangelogMenu.tsx';
import { SaveMenu } from './Menus/SaveMenu.tsx';
import { FaqMenu } from './Menus/FAQMenu.tsx';
import { OptionsMenu } from './Menus/OptionsMenu.tsx';
import { ExtraMenu } from './Menus/ExtraMenu.tsx';
import { ChallengeMenu } from './Menus/ChallengeMenu.tsx';
import { StatisticMenu } from './Menus/StatisticMenu.tsx';
import { PrestigeMenu } from './Menus/PrestigeMenu.tsx';
import { ManagmentMenu } from './Menus/ManagmentMenu.tsx';
import { Show } from 'solid-js';
import { MenuBarProvider, useMenuBar } from './MenuBar.context.ts';
import { withProvider } from '../../../signals/withProvider.tsx';
import { Menu } from './MenuBar.types.ts';

export const MenuBar = withProvider(MenuBarProvider, () => {
  const { isVisible } = useMenuBar();

  return (
    <div class='flex gap-2 h-8'>
      <ManagmentMenu />
      <Show when={isVisible(Menu.Changelog)}>
        <ChangelogMenu />
      </Show>
      <Show when={isVisible(Menu.Save)}>
        <SaveMenu />
      </Show>
      <Show when={isVisible(Menu.Faq)}>
        <FaqMenu />
      </Show>
      <Show when={isVisible(Menu.Options)}>
        <OptionsMenu />
      </Show>
      <Show when={isVisible(Menu.Extra)}>
        <ExtraMenu />
      </Show>
      <Show when={isVisible(Menu.Challenge)}>
        <ChallengeMenu />
      </Show>
      <Show when={isVisible(Menu.Statistic)}>
        <StatisticMenu />
      </Show>
      <Show when={isVisible(Menu.Prestige)}>
        <PrestigeMenu />
      </Show>
    </div>
  );
});
