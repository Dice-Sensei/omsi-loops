import { Accessor } from 'solid-js';
import { Tooltip } from '../../components/containers/Overlay/primitives/Tooltip.tsx';
import { Label } from '../../components/containers/Overlay/uses/Label.tsx';
import { et } from '../../locales/translations.utils.ts';
import { getPrcToNextSkillLevel, getSelfCombat, getSkillLevel, getTeamCombat } from '../../original/stats.ts';
import { createIntervalSignal } from '../../signals/createInterval.ts';
import { view } from '../../views/main.view.ts';
import { skills } from '../../original/globals.ts';

const t = et('statistics');
interface IntegerSkillLocale {
  name: string;
  description: string;
}

const IntegerSkill = (props: { value: Accessor<number>; locale: IntegerSkillLocale }) => {
  const [values] = createIntervalSignal(0, props.value);

  return (
    <Tooltip>
      <Tooltip.Trigger class='grid grid-cols-12 gap-2'>
        <div class='col-span-11 font-medium'>{props.locale.name}</div>
        <div class='text-right'>{values()}</div>
      </Tooltip.Trigger>
      <Tooltip.Content>
        {props.locale.description}
      </Tooltip.Content>
    </Tooltip>
  );
};

interface DecimalSkillLocale {
  name: string;
  description: string;
  explaination?: string;
}

const DecimalSkill = (
  props: {
    skill: string;
    locale: DecimalSkillLocale;
  },
) => {
  const [values] = createIntervalSignal({
    level: 0,
    exp: 0,
    expNeeded: 0,
    progress: 0,
  }, () => ({
    level: getSkillLevel(props.skill),
    exp: skills[props.skill].levelExp.exp,
    expNeeded: skills[props.skill].levelExp.expRequiredForNextLevel,
    progress: getPrcToNextSkillLevel(props.skill),
  }));

  return (
    <Tooltip>
      <Tooltip.Trigger class='flex flex-col'>
        <div class='flex justify-between w-full'>
          <span class='font-medium'>{props.locale.name}</span>
          <span class='text-right'>{values().level}</span>
        </div>
        <div class='relative h-2 rounded-sm border border-slate-800 w-full'>
          <div class='absolute h-full bg-blue-500 w-full' style={{ width: `${values().progress}%` }} />
        </div>
      </Tooltip.Trigger>

      <Tooltip.Content>
        {props.locale.description}
        <div class='medium bold'>{t('tooltips.levelExperience')}</div>
        <span>{values().exp}/{values().expNeeded} ({values().progress}%)</span>
        {props.locale.explaination}
      </Tooltip.Content>
    </Tooltip>
  );
};

export const SkillList = () => (
  <div class='flex flex-col gap-2'>
    <Label class='font-bold' label={t('tooltips.notRestarting')}>{t('sections.skills.title')}</Label>
    <div class='grid grid-cols-3 gap-x-2'>
      <IntegerSkill value={getSelfCombat} locale={t('skills.soloCombat')} />
      <IntegerSkill value={getTeamCombat} locale={t('skills.teamCombat')} />
      <DecimalSkill skill='Combat' locale={t('skills.combat')} />
      <DecimalSkill skill='Magic' locale={t('skills.magic')} />
      <DecimalSkill skill='Practical' locale={t('skills.practical')} />
      <DecimalSkill skill='Alchemy' locale={t('skills.alchemy')} />
      <DecimalSkill skill='Dark' locale={t('skills.dark')} />
      <DecimalSkill skill='Crafting' locale={t('skills.crafting')} />
      <DecimalSkill skill='Chronomancy' locale={t('skills.chronomancy')} />
      <DecimalSkill skill='Pyromancy' locale={t('skills.pyromancy')} />
      <DecimalSkill skill='Restoration' locale={t('skills.restoration')} />
      <DecimalSkill skill='Spatiomancy' locale={t('skills.spatiomancy')} />
      <DecimalSkill skill='Mercantilism' locale={t('skills.mercantilism')} />
      <DecimalSkill skill='Divine' locale={t('skills.divine')} />
      <DecimalSkill skill='Commune' locale={t('skills.commune')} />
      <DecimalSkill skill='Gluttony' locale={t('skills.gluttony')} />
      <DecimalSkill skill='Wunderkind' locale={t('skills.wunderkind')} />
      <DecimalSkill skill='Thievery' locale={t('skills.thievery')} />
      <DecimalSkill skill='Leadership' locale={t('skills.leadership')} />
      <DecimalSkill skill='Assassin' locale={t('skills.assassination')} />
    </div>
  </div>
);
