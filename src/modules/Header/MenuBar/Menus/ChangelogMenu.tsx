import { t } from '../../../../locales/translations.utils.ts';
import { ChangelogEntry } from '../../../../locales/translations.en.ts';
import { For } from '../../../../components/flow/For/For.tsx';

interface ChangelogEntryProps {
  version: ChangelogEntry;
}

export const VersionOption = (props: ChangelogEntryProps) => (
  <div class='contains-popover w-40'>
    <span class='font-medium'>{t('menu.changelog.version')}</span>: {props.version.name}
    <div class='popover-content'>
      <div class='font-medium text-center'>{props.version.date}</div>
      <hr class='border-neutral-500'></hr>
      <For each={props.version.changes}>
        {(change) => <div>• {change}</div>}
      </For>
    </div>
  </div>
);

export const ChangelogMenu = () => {
  return (
    <div class='contains-popover'>
      {t('menu.changelog.title')}
      <For each={t('menu.changelog.versions')} as='ul' class='popover-content'>
        {(version) => <VersionOption version={version} />}
      </For>
    </div>
  );
};
