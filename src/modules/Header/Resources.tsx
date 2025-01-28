import { Show } from 'solid-js';
import { Tooltip } from '../../components/containers/Overlay/primitives/Tooltip.tsx';
import { t } from '../../locales/translations.utils.ts';

interface NumericResourceProps {
  id: string;
  resource: { name: string; description: string };
}

const NumericResource = (props: NumericResourceProps) => {
  return (
    <Tooltip>
      <Tooltip.Trigger>
        <span class='bold'>{props.resource.name}:</span>
        <span id={props.id}>0</span>
      </Tooltip.Trigger>
      <Tooltip.Content>
        {props.resource.description}
      </Tooltip.Content>
    </Tooltip>
  );
};

interface ItemResourceProps {
  id: string;
  resource: { name: string; description: string };
}

const ItemResource = (props: ItemResourceProps) => (
  <Tooltip>
    <Tooltip.Trigger>
      <span class='bold'>{props.resource.name}</span>
    </Tooltip.Trigger>
    <Tooltip.Content>
      {props.resource.description}
    </Tooltip.Content>
  </Tooltip>
);

export const Resources = () => {
  return (
    <div class='flex gap-2'>
      <div class='grid grid-cols-4 flex-grow gap-2'>
        <NumericResource id='power' resource={t('resources.power')} />
        <NumericResource id='mana' resource={t('resources.mana')} />
        <NumericResource id='gold' resource={t('resources.gold')} />
        <NumericResource id='reputation' resource={t('resources.reputation')} />
        <NumericResource id='herbs' resource={t('resources.herbs')} />
        <NumericResource id='hide' resource={t('resources.hides')} />
        <NumericResource id='potions' resource={t('resources.potions')} />
        <NumericResource id='teamMembers' resource={t('resources.teamMembers')} />
        <NumericResource id='armor' resource={t('resources.armor')} />
        <NumericResource id='blood' resource={t('resources.blood')} />
        <NumericResource id='artifacts' resource={t('resources.artifacts')} />
        <NumericResource id='favors' resource={t('resources.favors')} />
        <NumericResource id='enchantments' resource={t('resources.enchantments')} />
        <NumericResource id='houses' resource={t('resources.houses')} />
        <NumericResource id='pylons' resource={t('resources.pylons')} />
        <NumericResource id='zombie' resource={t('resources.zombies')} />
        <NumericResource id='map' resource={t('resources.maps')} />
        <NumericResource id='completedMap' resource={t('resources.finishedMaps')} />
        <NumericResource id='heart' resource={t('resources.hearts')} />
      </div>
      <div class='flex flex-col flex-shrink flex-wrap gap-2'>
        <span class='font-bold'>Pocket:</span>
        <div class='flex flex-wrap gap-2'>
          <ItemResource id='glasses' resource={t('resources.glasses')} />
          <ItemResource id='supplies' resource={t('resources.supplies')} />
          <ItemResource id='pickaxe' resource={t('resources.pickaxe')} />
          <ItemResource id='loopingPotion' resource={t('resources.loopingPotion')} />
          <ItemResource id='citizenship' resource={t('resources.citizenship')} />
          <ItemResource id='pegasus' resource={t('resources.pegasus')} />
          <ItemResource id='key' resource={t('resources.key')} />
          <ItemResource id='stone' resource={t('resources.temporalStone')} />
        </div>
      </div>
    </div>
  );
};
