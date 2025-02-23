import { Label } from '../../components/containers/Overlay/uses/Label.tsx';
import { et } from '../../locales/translations.utils.ts';
import { resources, towns } from '../../original/globals.ts';
import { createIntervalAccessor } from '../../signals/createInterval.ts';
import { vals } from '../../original/saving.ts';

interface NumericResourceProps {
  id: string;
  resource: { name: string; description: string };
}

const ConsumableResource = (props: NumericResourceProps) => {
  const value = createIntervalAccessor(0, () => {
    if (props.id === 'teamMembers') {
      return (resources.teamMembers + 1) * 100;
    }
    if (props.id === 'supplies') {
      return towns[0].suppliesCost;
    }

    if (props.id === 'mana') {
      return vals.timeNeeded - vals.timer;
    }

    return resources[props.id];
  });

  return (
    <Label label={props.resource.description} class='flex justify-between'>
      <span class='font-medium'>{props.resource.name}:</span>
      <span class='text-right' id={props.id}>{value()}</span>
    </Label>
  );
};

interface ItemResourceProps {
  id: string;
  resource: { name: string; description: string };
}

const ToolResource = (props: ItemResourceProps) => {
  const isAcquired = createIntervalAccessor(false, () => resources[props.id]);

  return (
    <Label label={props.resource.description} class='font-medium'>
      {props.resource.name}:{isAcquired() ? 'y' : 'n'}
    </Label>
  );
};

const t = et('statistics');
export const ResourceList = () => (
  <div class='flex flex-col'>
    <Label label={t('sections.resources.description')} class='font-bold'>{t('sections.resources.title')}</Label>
    <div class='flex flex-col gap-1'>
      <Label label={t('sections.resources.sections.consumables.title')} class='font-bold'>
        {t('sections.resources.sections.consumables.title')}
      </Label>
      <div class='grid grid-cols-3 flex-grow gap-x-2'>
        <ConsumableResource id='power' resource={t('resources.power')} />
        <ConsumableResource id='mana' resource={t('resources.mana')} />
        <ConsumableResource id='gold' resource={t('resources.gold')} />
        <ConsumableResource id='reputation' resource={t('resources.reputation')} />
        <ConsumableResource id='herbs' resource={t('resources.herbs')} />
        <ConsumableResource id='hide' resource={t('resources.hides')} />
        <ConsumableResource id='potions' resource={t('resources.potions')} />
        <ConsumableResource id='teamMembers' resource={t('resources.teamMembers')} />
        <ConsumableResource id='armor' resource={t('resources.armor')} />
        <ConsumableResource id='blood' resource={t('resources.blood')} />
        <ConsumableResource id='artifacts' resource={t('resources.artifacts')} />
        <ConsumableResource id='favors' resource={t('resources.favors')} />
        <ConsumableResource id='enchantments' resource={t('resources.enchantments')} />
        <ConsumableResource id='houses' resource={t('resources.houses')} />
        <ConsumableResource id='pylons' resource={t('resources.pylons')} />
        <ConsumableResource id='zombie' resource={t('resources.zombies')} />
        <ConsumableResource id='map' resource={t('resources.maps')} />
        <ConsumableResource id='completedMap' resource={t('resources.finishedMaps')} />
        <ConsumableResource id='heart' resource={t('resources.hearts')} />
      </div>
    </div>
    <div class='flex flex-col gap-1'>
      <Label label={t('sections.resources.sections.tools.title')} class='font-bold'>
        {t('sections.resources.sections.tools.title')}
      </Label>
      <div class='flex flex-wrap gap-1'>
        <ToolResource id='glasses' resource={t('resources.glasses')} />
        <ToolResource id='supplies' resource={t('resources.supplies')} />
        <ToolResource id='pickaxe' resource={t('resources.pickaxe')} />
        <ToolResource id='loopingPotion' resource={t('resources.loopingPotion')} />
        <ToolResource id='citizenship' resource={t('resources.citizenship')} />
        <ToolResource id='pegasus' resource={t('resources.pegasus')} />
        <ToolResource id='key' resource={t('resources.key')} />
        <ToolResource id='stone' resource={t('resources.temporalStone')} />
      </div>
    </div>
  </div>
);
