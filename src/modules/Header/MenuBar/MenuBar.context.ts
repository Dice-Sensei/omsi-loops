import { createContext } from '../../../signals/createContext.tsx';
import { Menu, MenuNs } from './MenuBar.types.ts';
import { createSignal } from 'solid-js';

export const [useMenuBar, MenuBarProvider] = createContext(() => {
  const [visible, setVisible] = createSignal<Set<Menu>>(new Set(MenuNs.list));

  const isVisible = (menu: Menu) => visible().has(menu);

  const toggleVisible = (menu: Menu, value: boolean) => {
    const menus = new Set(visible());
    if (value) {
      menus.add(menu);
    } else {
      menus.delete(menu);
    }

    setVisible(menus);
  };

  return { visible, toggleVisible, isVisible };
});
