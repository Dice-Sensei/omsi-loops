import { For } from 'solid-js';
import { t } from '../../../../locales/translations.utils.ts';
import { ChangelogEntry } from '../../../../locales/translations.en.ts';

interface ChangelogEntryProps {
  version: ChangelogEntry;
}

export const VersionOption = (props: ChangelogEntryProps) => (
  <li class='showthat w-40'>
    <span class='font-medium'>{t('menu.changelog.version')}</span>: {props.version.name}
    <div class='showthis'>
      <div class='font-medium text-center'>{props.version.date}</div>
      <hr class='border-neutral-500'></hr>
      <For each={props.version.changes}>
        {(change) => <div>• {change}</div>}
      </For>
    </div>
  </li>
);

export const ChangelogMenu = () => {
  return (
    <li class='contains-popover'>
      {t('menu.changelog.title')}
      <ul class='popover-content'>
        <For each={t('menu.changelog.versions')}>
          {(version) => <VersionOption version={version} />}
        </For>
      </ul>
    </li>
  );
};
