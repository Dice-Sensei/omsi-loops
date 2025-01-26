import { et } from '../../../../locales/translations.utils.ts';
import { ChangelogEntry } from '../../../../locales/translations.en.ts';
import { For } from '../../../../components/flow/For/For.tsx';
import { Tooltip } from '../../../../components/containers/Overlay/primitives/Tooltip.tsx';
import { MenuOption } from './MenuOption.tsx';

interface ChangelogEntryProps {
  version: ChangelogEntry;
}

const t = et('menu.changelog');
export const VersionOption = (props: ChangelogEntryProps) => (
  <Tooltip placement='right'>
    <Tooltip.Trigger>
      <span class='font-medium'>{t('version')}</span>: {props.version.name}
    </Tooltip.Trigger>
    <Tooltip.Content>
      <div>
        <div class='font-medium text-center'>{props.version.date}</div>
        <hr class='border-neutral-500'></hr>
        <For each={props.version.changes}>
          {(change) => <div>• {change}</div>}
        </For>
      </div>
    </Tooltip.Content>
  </Tooltip>
);

export const ChangelogMenu = () => (
  <MenuOption title={t('title')}>
    <For each={t('versions')} as='ul'>
      {(version) => <VersionOption version={version} />}
    </For>
  </MenuOption>
);
