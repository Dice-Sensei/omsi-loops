import { t } from '../../../../locales/translations.utils.ts';
import { ChangelogEntry } from '../../../../locales/translations.en.ts';
import { For } from '../../../../components/flow/For/For.tsx';
import { Popover } from '../../../../components/containers/Overlay/primitives/Popover.tsx';
import { Button } from '../../../../components/buttons/Button/Button.tsx';
import { Tooltip } from '../../../../components/containers/Overlay/primitives/Tooltip.tsx';

interface ChangelogEntryProps {
  version: ChangelogEntry;
}

export const VersionOption = (props: ChangelogEntryProps) => (
  <Tooltip placement='right'>
    <Tooltip.Trigger>
      <span class='font-medium'>{t('menu.changelog.version')}</span>: {props.version.name}
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
  <Popover>
    <Popover.Trigger>
      <Button variant='text'>{t('menu.changelog.title')}</Button>
    </Popover.Trigger>
    <Popover.Content>
      <For each={t('menu.changelog.versions')} as='ul'>
        {(version) => <VersionOption version={version} />}
      </For>
    </Popover.Content>
  </Popover>
);
