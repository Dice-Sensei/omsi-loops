import { createMemo } from 'solid-js';
import { Tooltip } from '../../components/containers/Overlay/primitives/Tooltip.tsx';
import { For } from '../../components/flow/For/For.tsx';
import { statList, stats } from '../../original/globals.ts';
import { getLevel, getPrcToNextLevel, getPrcToNextTalent, getTalent, getTotalBonusXP } from '../../original/stats.ts';
import { createIntervalSignal } from '../../signals/createInterval.ts';
import { HorizontalBar } from '../../components/flow/HorizontalBar/HorizontalBar.tsx';
import { et } from '../../locales/translations.utils.ts';
import { Label } from '../../components/containers/Overlay/uses/Label.tsx';

export const t = et('statistics');

const statToName = {
  Cha: 'charisma',
  Int: 'intelligence',
  Dex: 'dexterity',
  Str: 'strength',
  Con: 'constitution',
  Spd: 'speed',
  Per: 'perception',
  Luck: 'luck',
  Soul: 'soul',
} as const;

const Attribute = (props: { stat: (typeof statList)[number] }) => {
  const name = statToName[props.stat];
  const stat = props.stat;

  const [values] = createIntervalSignal({
    talent: 0,
    level: 0,
    soulstone: 0,
    totalMult: 1.00,
    talentExpNeeded: 0,
    talentProgress: 0,
    talentMult: 1.00,
    levelExp: 0,
    levelExpNeeded: 0,
    levelProgress: 0,
    talentExp: 0,
    soulstoneMult: 1.00,
  }, () => ({
    talent: getTalent(stat),
    talentExpNeeded: stats[stat].talentLevelExp.expRequiredForNextLevel,
    talentMult: stats[stat].talentMult,
    totalMult: getTotalBonusXP(stat),
    level: getLevel(stat),
    levelExp: stats[stat].statLevelExp.exp,
    levelExpNeeded: stats[stat].statLevelExp.expRequiredForNextLevel,
    soulstone: stats[stat].soulstone,
    soulstoneMult: stats[stat].soulstoneMult,
    talentExp: stats[stat].talentLevelExp.exp,
    talentProgress: getPrcToNextTalent(stat),
    levelProgress: getPrcToNextLevel(stat),
  }));

  const total = createMemo(() => values().level + values().talent + values().soulstone);
  const ratios = createMemo(() => ({
    level: values().level / total() * 100,
    talent: values().talent / total() * 100,
    soulstone: values().soulstone / total() * 100,
  }));

  return (
    <Tooltip>
      <Tooltip.Trigger class='grid grid-cols-12 gap-2'>
        <span class='col-span-2 font-medium text-left'>{t(`attributes.${name}.name`)}</span>
        <div class='col-span-7 border border-slate-800 rounded-sm flex flex-col h-full gap-px'>
          <div class='h-full bg-amber-500' style={{ width: `${ratios().level}%` }} />
          <div class='h-full bg-emerald-500' style={{ width: `${ratios().talent}%` }} />
          <div class='h-full bg-indigo-500' style={{ width: `${ratios().soulstone}%` }} />
        </div>
        <div class='relative border rounded-sm border-amber-700'>
          <div class='absolute h-full bg-amber-500' style={{ width: `${values().levelProgress}%` }} />
          <span class='text-amber-900'>{values().level}</span>
        </div>
        <div class='relative border rounded-sm border-emerald-700'>
          <div class='absolute h-full bg-emerald-500' style={{ width: `${values().talentProgress}%` }} />
          <span class='text-emerald-900'>{values().talent}</span>
        </div>
        <div class='border rounded-sm border-indigo-700'>
          <span class='text-indigo-900'>{values().soulstone}</span>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content class='w-[500px]'>
        <div class='font-medium'>{t(`attributes.${name}.name`)}</div>
        <div>{t(`attributes.${name}.description`)}</div>
        <div class='grid grid-cols-2 gap-x-2'>
          <span class='font-medium'>{t('tooltips.level')}:</span>
          <span>{values().level}</span>
          <span class='font-medium'>{t('tooltips.levelExperience')}:</span>
          <span>
            <span>{values().levelExp}</span>/<span>{values().levelExpNeeded}</span>
            <span>({values().levelProgress}%)</span>
          </span>
          <span class='font-medium'>{t('tooltips.talent')}:</span>
          <span>{values().talent}</span>
          <span class='font-medium'>{t('tooltips.talentExperience')}:</span>
          <span>
            <span>{values().talentExp}</span>/<span>{values().talentExpNeeded}</span>
            <span>({values().talentProgress}%)</span>
          </span>
          <span class='font-medium'>{t('tooltips.talentMultiplier')}:</span>
          <span>x{values().talentMult}</span>
          <span class='font-medium'>{t('tooltips.soulstone')}:</span>
          <span>{values().soulstone}</span>
          <span class='font-medium'>{t('tooltips.soulstoneMultiplier')}:</span>
          <span>x{values().soulstoneMult}</span>
          <span class='font-medium'>{t('tooltips.totalMultiplier')}:</span>
          <span>x{values().totalMult}</span>
        </div>
      </Tooltip.Content>
    </Tooltip>
  );
};

const AttributeTotal = () => {
  const [values] = createIntervalSignal({
    talent: 0,
    level: 0,
    soulstone: 0,
  }, () => ({
    talent: Object.values(stats).map((s) => s.talentLevelExp.level).reduce((a, b) => a + b),
    level: Object.values(stats).map((s) => s.statLevelExp.level).reduce((a, b) => a + b),
    soulstone: Object.values(stats).map((s) => s.soulstone).reduce((a, b) => a + (b ?? 0), 0),
  }));

  return (
    <Tooltip>
      <Tooltip.Trigger class='grid grid-cols-12 gap-2'>
        <div class='col-span-2 font-medium text-left'>{t('total.singular')}</div>
        <div class='col-start-10'>{values().talent}</div>
        <div>{values().level}</div>
        <div>{values().soulstone}</div>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <div class='font-medium'>{t('total.plural')}</div>
        <div>{t('total.description')}</div>
        <div class='grid grid-cols-2 gap-x-2'>
          <span class='font-medium'>{t('tooltips.level')}:</span>
          <span>{values().level}</span>
          <span class='font-medium'>{t('tooltips.talent')}:</span>
          <span>{values().talent}</span>
          <span class='font-medium'>{t('tooltips.soulstone')}:</span>
          <span>{values().soulstone}</span>
        </div>
      </Tooltip.Content>
    </Tooltip>
  );
};

export const AttributeList = () => (
  <div class='flex flex-col gap-1'>
    <Label label={t('sections.attributes.title')} class='font-bold'>{t('sections.attributes.title')}</Label>
    <For each={statList} as='div' class='flex flex-col gap-0.5'>
      {(stat) => <Attribute stat={stat} />}
    </For>
    <HorizontalBar />
    <AttributeTotal />
  </div>
);
