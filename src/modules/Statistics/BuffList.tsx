import { Tooltip } from '../../components/containers/Overlay/primitives/Tooltip.tsx';
import { Label } from '../../components/containers/Overlay/uses/Label.tsx';
import { et } from '../../locales/translations.utils.ts';
import { getBuffCap, getBuffLevel } from '../../original/stats.ts';
import { createIntervalSignal } from '../../signals/createInterval.ts';
const t = et('statistics');

interface BuffLocale {
  name: string;
  description: string;
  explaination?: string;
}
const IntegerBuff = (props: { id: string; icon: string; locale: BuffLocale }) => {
  const [values] = createIntervalSignal({
    level: 0,
    cap: 666,
  }, () => ({
    level: getBuffLevel(props.id),
    cap: getBuffCap(props.id),
  }));

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <div id={props.id} class='flex w-full flex-grow gap-1'>
          <img class='w-5 h-5' src={`icons/${props.icon}.svg`}></img>
          <div class='font-medium'>{props.locale.name}</div>
          <span class='ml-auto'>{values().level}/{values().cap}</span>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <span>{props.locale.description}</span>
        <span>{props.locale.explaination}</span>
      </Tooltip.Content>
    </Tooltip>
  );
};

export const BuffList = () => (
  <div class='flex flex-col gap-1'>
    <Label label={t('sections.buffs.title')} class='font-bold'>{t('sections.buffs.title')}</Label>
    <div class='grid grid-cols-2 gap-0.5'>
      <IntegerBuff locale={t('buffs.ritual')} icon='darkRitual' id='Ritual' />
      <IntegerBuff locale={t('buffs.mindImbuement')} icon='imbueMind' id='Imbuement' />
      <IntegerBuff locale={t('buffs.bodyImbuement')} icon='imbueBody' id='Imbuement2' />
      <IntegerBuff locale={t('buffs.greatFeast')} icon='greatFeast' id='Feast' />
      <IntegerBuff locale={t('buffs.aspirant')} icon='aspirant' id='Aspirant' />
      <IntegerBuff locale={t('buffs.heroism')} icon='heroism' id='Heroism' />
      <IntegerBuff locale={t('buffs.soulImbuement')} icon='imbueSoul' id='Imbuement3' />
      <IntegerBuff locale={t('buffs.prestigePhysical')} icon='prestige-Physical' id='PrestigePhysical' />
      <IntegerBuff locale={t('buffs.prestigeMental')} icon='prestige-Mental' id='PrestigeMental' />
      <IntegerBuff locale={t('buffs.prestigeCombat')} icon='prestige-Combat' id='PrestigeCombat' />
      <IntegerBuff locale={t('buffs.prestigeSpatiomancy')} icon='prestige-Spatiomancy' id='PrestigeSpatiomancy' />
      <IntegerBuff locale={t('buffs.prestigeChronomancy')} icon='prestige-Chronomancy' id='PrestigeChronomancy' />
      <IntegerBuff locale={t('buffs.prestigeBartering')} icon='prestige-Bartering' id='PrestigeBartering' />
      <IntegerBuff
        locale={t('buffs.prestigeExpOverflow')}
        icon='prestige-ExperienceOverflow'
        id='PrestigeExpOverflow'
      />
    </div>
  </div>
);
