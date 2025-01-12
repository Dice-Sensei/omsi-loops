import { CheckboxField } from '../../../../components/forms/CheckboxField.tsx';
import { Menu } from '../MenuBar.types.ts';
import { useMenuBar } from '../MenuBar.context.ts';

export const ManagmentMenu = () => {
  const { toggleVisible, isVisible } = useMenuBar();

  const createOnChange = (menu: Menu) => (value: boolean) => toggleVisible(menu, value);

  return (
    <li class='w-8 h-8 contains-popover'>
      <span>O</span>
      <div class='popover-content'>
        <span class='font-medium'>{t('menu.enable.title')}</span>
        <CheckboxField onChange={createOnChange(Menu.Changelog)} value={isVisible(Menu.Changelog)}>
          {t('menu.changelog.title')}
        </CheckboxField>
        <CheckboxField onChange={createOnChange(Menu.Save)} value={isVisible(Menu.Save)}>
          {t('menu.save.title')}
        </CheckboxField>
        <CheckboxField onChange={createOnChange(Menu.Faq)} value={isVisible(Menu.Faq)}>
          {t('menu.faq.title')}
        </CheckboxField>
        <CheckboxField onChange={createOnChange(Menu.Options)} value={isVisible(Menu.Options)}>
          {t('menu.options.title')}
        </CheckboxField>
        <CheckboxField onChange={createOnChange(Menu.Extra)} value={isVisible(Menu.Extra)}>
          {t('menu.extras.title')}
        </CheckboxField>
        <CheckboxField onChange={createOnChange(Menu.Challenge)} value={isVisible(Menu.Challenge)}>
          {t('menu.challenges.title')}
        </CheckboxField>
        <CheckboxField onChange={createOnChange(Menu.Statistic)} value={isVisible(Menu.Statistic)}>
          {t('menu.totals.title')}
        </CheckboxField>
        <CheckboxField onChange={createOnChange(Menu.Prestige)} value={isVisible(Menu.Prestige)}>
          {t('menu.prestige.title')}
        </CheckboxField>
      </div>
    </li>
  );
};
