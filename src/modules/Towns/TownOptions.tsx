import { createEffect, createMemo, Show } from 'solid-js';
import { addActionToList } from '../../original/driver.ts';
import { towns } from '../../original/globals.ts';
import { For } from '../../components/flow/For/For.tsx';
import { createIntervalAccessor } from '../../signals/createInterval.ts';
import { Tooltip } from '../../components/containers/Overlay/primitives/Tooltip.tsx';
import { translateClassNames } from '../../original/actionList.ts';
import cx from 'clsx';
import { camelize } from '../../original/helpers.ts';
import { Button } from '../../components/buttons/Button/Button.tsx';
import { getNumOnList } from '../../original/actions.ts';

interface PieChartProps {
  stats: { name: string; percentage: number }[];
  class?: string;
}

const PieChart = (props: PieChartProps) => {
  const paths = createMemo(() => {
    let total = 0;

    for (let i = 0; i < props.stats.length; ++i) {
      total += props.stats[i].percentage;
    }

    const paths: string[] = [];
    let angleOffset = 0;

    for (let i = 0; i < props.stats.length; ++i) {
      const percentage = props.stats[i].percentage / total;
      const angle = percentage * 2 * Math.PI;

      const ax = Math.sin(angleOffset);
      const ay = -Math.cos(angleOffset);
      const bx = Math.sin(angleOffset + angle);
      const by = -Math.cos(angleOffset + angle);
      angleOffset += angle;

      paths.push(`M0,0 L${ax},${ay} A1,1 0,${angle > Math.PI ? 1 : 0},1 ${bx},${by} Z`);
    }

    return paths;
  });

  return (
    <svg viewBox='-1 -1 2 2' class={cx('stat-pie', props.class)}>
      <g>
        <For each={paths()}>
          {(path, index) => (
            <path
              class={`pie-slice stat-${statNameMap[props.stats[index()].name]}`}
              d={path}
            />
          )}
        </For>
      </g>
    </svg>
  );
};
const statNameMap = {
  speed: 'Spd',
  constitution: 'Con',
  perception: 'Per',
  charisma: 'Cha',
  luck: 'Luck',
  intelligence: 'Int',
  soul: 'Soul',
  strength: 'Str',
  dexterity: 'Dex',
} as const;
const nameStatMap = {
  Spd: 'speed',
  Con: 'constitution',
  Per: 'perception',
  Cha: 'charisma',
  Luck: 'luck',
  Int: 'intelligence',
  Soul: 'soul',
  Str: 'strength',
  Dex: 'dexterity',
} as const;

interface ActionCardProps {
  action: string;
}

const ActionCard = (props: ActionCardProps) => {
  const action = translateClassNames(props.action);

  const values = createIntervalAccessor({
    experienceMultiplier: 100,
    stats: [],
    manaCost: 0,
    manaGain: 0,
    affectedBy: [],
    limit: Infinity,
    src: '',
    isUnlocked: true,
    isVisible: true,
    isCapped: false,
    total: 0,
    name: '',
    tooltip1: '',
    tooltip2: '',
    id: '',
  }, () => ({
    experienceMultiplier: action.expMult + 1,
    stats: Object.entries(action.stats).map(([name, value]) => ({
      name: nameStatMap[name],
      percentage: value * 100,
    })),
    src: action.imageName ? `icons/${action.imageName}.svg` : '',
    manaGain: action.cost?.() ?? 0,
    manaCost: action.manaCost(),
    isUnlocked: action.unlocked(),
    isVisible: action.visible(),
    limit: action.allowed?.() ?? Infinity,
    affectedBy: action.affectedBy ?? [],
    total: action.affectedBy?.length ?? 0,
    name: action.name,
    tooltip1: action.tooltip,
    tooltip2: action.tooltip2,
    id: action.varName,
    isCapped: action.allowed !== undefined ? action.allowed() >= getNumOnList(action.name) : false,
  }), (a, b) => (a.experienceMultiplier === b.experienceMultiplier &&
    a.stats.every((stat, index) =>
      stat.percentage === b.stats[index].percentage && stat.name === b.stats[index].name
    ) &&
    a.src === b.src &&
    a.manaGain === b.manaGain &&
    a.manaCost === b.manaCost &&
    a.isUnlocked === b.isUnlocked &&
    a.isVisible === b.isVisible &&
    a.isCapped === b.isCapped &&
    a.limit === b.limit &&
    a.affectedBy === b.affectedBy &&
    a.total === b.total &&
    a.name === b.name &&
    a.tooltip1 === b.tooltip1 &&
    a.tooltip2 === b.tooltip2));

  const state = createMemo(() => {
    if (!values().isUnlocked) return 'locked';
    if (values().isCapped) return 'capped';
    return 'unlocked';
  });

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Button
          id={`container${action.varName}`}
          variant='text'
          class={cx(
            `
          border transition-all 
          py-1 px-2
          flex flex-col
          w-full h-full
          `,
            state() === 'unlocked' && 'hover:bg-amber-100 border-amber-600 hover:border-amber-700 active:bg-amber-400',
            state() === 'locked' &&
              'border-red-600 hover:border-red-700 bg-red-100 hover:bg-red-300 !text-red-900 hover:text-red-950',
            state() === 'capped' &&
              'bg-gray-300 border-gray-600 hover:border-gray-700 !text-gray-900 hover:text-gray-950',
          )}
          disabled={state() === 'locked' || state() === 'capped'}
        >
          <span class='text-sm text-center'>{action.name}</span>
          <div class='grid grid-cols-3 w-full'>
            <div class='flex self-end w-8 h-8'>
              <PieChart stats={values().stats} class='self-end w-6 h-6 hover:w-8 hover:h-8 transition-all' />
            </div>
            <img
              src={values().src}
              class='col-start-2 w-10 h-10 object-contain'
            />
            <For each={values().affectedBy} as='div' class='grid grid-cols-2 gap-1 w-full'>
              {(affectedBy) => (
                <img
                  src={`icons/${camelize(affectedBy)}.svg`}
                  class={cx(
                    'w-5 h-5 object-contain place-self-end',
                    values().total === 1 && 'col-start-2',
                  )}
                />
              )}
            </For>
          </div>
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>
        <Show when={values().isUnlocked}>
          <div class='flex flex-col gap-2'>
            <span>{values().tooltip1}</span>
            <span>{values().tooltip2}</span>
          </div>
          <div class='grid grid-cols-[auto_1fr] gap-x-2'>
            <span class='font-medium'>Mana Cost:</span>
            <span id={`manaCost${values().id}`}>{values().manaCost}</span>
            <span class='font-medium'>Mana Gain:</span>
            <span id={`goldCost${values().id}`}>{values().manaGain}</span>
            <span class='font-medium'>Exp Multiplier:</span>
            <span>{values().experienceMultiplier}%</span>
          </div>
          <For each={values().stats} as='div' class='grid grid-cols-[auto_1fr_auto_1fr_auto_1fr] gap-0.5'>
            {(stat) => {
              const abbr = statNameMap[stat.name];

              return (
                <>
                  <div class='w-12'>
                    <span class={`font-medium stat-color stat-${abbr}`}>{abbr}</span>
                    <span>:</span>
                  </div>
                  <span>{stat.percentage}%</span>
                </>
              );
            }}
          </For>
        </Show>
        <Show when={!values().isUnlocked}>
          <div class='flex flex-col gap-2'>
            <span>{values().tooltip1}</span>
            <span>{values().tooltip2}</span>
          </div>
          <div>
            <span>(</span>
            <For each={values().stats}>
              {(stat, index) => {
                const abbr = statNameMap[stat.name];

                return (
                  <>
                    <span class={`font-medium stat-color stat-${abbr}`}>{abbr}</span>
                    <Show when={index() !== values().stats.length - 1}>
                      <span>{', '}</span>
                    </Show>
                  </>
                );
              }}
            </For>
            <span>)</span>
          </div>
        </Show>
      </Tooltip.Content>
    </Tooltip>
  );
};

export const ZoneOptionsSelects = () => {
  createEffect(() => {
    for (const action of towns.flatMap((t) => t.totalActionList)) {
      const container = document.getElementById(`container${action.varName}`) as HTMLButtonElement;

      requestAnimationFrame(() => {
        container.onclick = () => addActionToList(action.name, action.townNum);
      });
    }
  });

  return (
    <div class='grid grid-cols-4 gap-2'>
      <div class='flex flex-col border border-black rounded-sm'>
        <div class='grid grid-cols-2 gap-2 p-2'>
          <ActionCard action='Wander' />
          <ActionCard action='Smash Pots' />
          <ActionCard action='Pick Locks' />
          <ActionCard action='Buy Glasses' />
          <ActionCard action='Found Glasses' />
          <ActionCard action='Buy Mana Z1' />
          <ActionCard action='Meet People' />
          <div>
            <button
              id='containerTrainStrength'
              class='actionContainer cappableActionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Train Strength</label>
              <div style='position:relative'>
                <img src='icons/trainStrength.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Str' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951536,-0.30901699437494723 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.4turn,var(--stat-Str-color) calc(0.4turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Str-color) calc(1turn - (0.4turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Build up those muscles. Again.Has 4x exp/talent gain, and can only be done
                <div id='trainingLimitStr'></div> times per reset.Unlocked at 5% People Met.
                <span id='goldCostTrainStrength'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostTrainStrength'>2,000</div>
                <dl>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>80%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultTrainStrength'>400</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Build up those muscles. Again.Has 4x exp/talent gain, and can only be done
                <div id='trainingLimitStr'></div> times per reset.Unlocked at 5% People Met.

                (<span class='bold stat-Str stat-color'>Str</span>, <span class=' stat-Con stat-color'>Con</span>)
              </div>
            </button>
          </div>
          <ActionCard action='Short Quest' />
          <ActionCard action='Investigate' />
          <ActionCard action='Long Quest' />
          <div>
            <button
              id='containerWarriorLessons'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Warrior Lessons</label>
              <div style='position:relative'>
                <img src='icons/warriorLessons.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Str' d='M0,0 L0,-1 A1,1 0,1,1 1.2246467991473532e-16,1 Z'></path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.25turn,var(--stat-Str-color) calc(0.25turn * var(--pie-ratio)),var(--stat-Dex-color) calc(0.4turn - (0.15turn * var(--pie-ratio))) calc(0.4turn + (0.15turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.65turn - (0.1turn * var(--pie-ratio))) calc(0.65turn + (0.1turn * var(--pie-ratio))),var(--stat-Str-color) calc(1turn - (0.25turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Learning to fight is probably important; you have a long journey ahead of you.Requires a reputation of 2
                or above.Unlocked at 20% Investigated.
                <span id='goldCostWarriorLessons'></span>

                <div class='bold'>Combat Exp:</div>
                <span id='expGainWarriorLessonsCombat'>100</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostWarriorLessons'>1,000</div>
                <dl>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>50%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>30%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultWarriorLessons'>150</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Combat</div>
                <i>Fight for your lives.</i>
              </div>
              <div class='showthis when-locked' draggable='false'>
                Learning to fight is probably important; you have a long journey ahead of you.Requires a reputation of 2
                or above.Unlocked at 20% Investigated.

                <div class='bold'>Learn skill:</div> <span>Combat</span>
                (<span class='bold stat-Str stat-color'>Str</span>, <span class=' stat-Dex stat-color'>Dex</span>,
                <span class=' stat-Con stat-color'>Con</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerMageLessons'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Mage Lessons</label>
              <div style='position:relative'>
                <img src='icons/mageLessons.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,1,1 1.2246467991473532e-16,1 Z'></path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.25turn,var(--stat-Int-color) calc(0.25turn * var(--pie-ratio)),var(--stat-Per-color) calc(0.4turn - (0.15turn * var(--pie-ratio))) calc(0.4turn + (0.15turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.65turn - (0.1turn * var(--pie-ratio))) calc(0.65turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.25turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The mystic arts got you into this mess, maybe they can help you get out of it.Requires a reputation of 2
                or above.Unlocked at 20% Investigated.
                <span id='goldCostMageLessons'></span>

                <div class='bold'>Magic Exp:</div>
                <span id='expGainMageLessonsMagic'>100</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostMageLessons'>1,000</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>50%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>30%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultMageLessons'>150</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Magic</div>
                <i>Control the aether to cast and conjure.</i>
              </div>
              <div class='showthis when-locked' draggable='false'>
                The mystic arts got you into this mess, maybe they can help you get out of it.Requires a reputation of 2
                or above.Unlocked at 20% Investigated.

                <div class='bold'>Learn skill:</div> <span>Magic</span>
                (<span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Per stat-color'>Per</span>,
                <span class=' stat-Con stat-color'>Con</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerHeal'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Heal The Sick</label>
              <div style='position:relative'>
                <img src='icons/healTheSick.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Soul' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Soul-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Per-color) calc(0.3turn - (0.1turn * var(--pie-ratio))) calc(0.3turn + (0.1turn * var(--pie-ratio))),var(--stat-Cha-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Soul-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                You won't be able to heal them all, but they'll be thankful for doing what you can.Healing is always 3
                parts, each with a main stat - Diagnose (Per), Treat (Int), Inform (Cha).Gives (magic skill) *
                max(restoration skill/50, 1) * (1 + main stat / 100) * sqrt(1 + times completed / 100) * (original mana
                cost / actual mana cost) progress points per mana.Requires a reputation of 1 or above.Unlocked at 12
                Magic skill.Gives 3 reputation upon patient completion.
                <span id='goldCostHeal'></span>

                <div class='bold'>Magic Exp:</div>
                <span id='expGainHealMagic'>10</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostHeal'>2,500</div>
                <dl>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>40%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>20%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultHeal'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                You won't be able to heal them all, but they'll be thankful for doing what you can.Healing is always 3
                parts, each with a main stat - Diagnose (Per), Treat (Int), Inform (Cha).Gives (magic skill) *
                max(restoration skill/50, 1) * (1 + main stat / 100) * sqrt(1 + times completed / 100) * (original mana
                cost / actual mana cost) progress points per mana.Requires a reputation of 1 or above.Unlocked at 12
                Magic skill.Gives 3 reputation upon patient completion.

                (<span class='bold stat-Soul stat-color'>Soul</span>, <span class=' stat-Per stat-color'>Per</span>,

                <span class=' stat-Cha stat-color'>Cha</span>, <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerFight'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Fight Monsters</label>
              <div style='position:relative'>
                <img src='icons/fightMonsters.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Str' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 -0.587785252292473,0.8090169943749475 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Str-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.29999999999999993turn - (0.15turn * var(--pie-ratio))) calc(0.29999999999999993turn + (0.15turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.6turn - (0.15turn * var(--pie-ratio))) calc(0.6turn + (0.15turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7999999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.7999999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Str-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Slowly, you're figuring out their patterns.Fighting rotates between 3 types of battles, each with a main
                stat - Quick (Spd), Defensive (Str), Aggressive (Con).Gives (self combat) * (1 + main stat / 100) *
                sqrt(1 + times completed / 100) * (original mana cost / actual mana cost) progress points per
                mana.Requires a reputation of 2 or above.Unlocked at 10 Combat skill.Gives 20 gold per fight segment
                completion.
                <span id='goldCostFight'></span>

                <div class='bold'>Combat Exp:</div>
                <span id='expGainFightCombat'>10</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostFight'>2,000</div>
                <dl>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>30%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>30%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>30%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultFight'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Slowly, you're figuring out their patterns.Fighting rotates between 3 types of battles, each with a main
                stat - Quick (Spd), Defensive (Str), Aggressive (Con).Gives (self combat) * (1 + main stat / 100) *
                sqrt(1 + times completed / 100) * (original mana cost / actual mana cost) progress points per
                mana.Requires a reputation of 2 or above.Unlocked at 10 Combat skill.Gives 20 gold per fight segment
                completion.

                (<span class='bold stat-Str stat-color'>Str</span>, <span class='bold stat-Con stat-color'>Con</span>,

                <span class='bold stat-Spd stat-color'>Spd</span>, <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerSDungeon'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Small Dungeon</label>
              <div style='position:relative'>
                <img src='icons/smallDungeon.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Str'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Dex-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.35000000000000003turn - (0.15turn * var(--pie-ratio))) calc(0.35000000000000003turn + (0.15turn * var(--pie-ratio))),var(--stat-Str-color) calc(0.55turn - (0.05turn * var(--pie-ratio))) calc(0.55turn + (0.05turn * var(--pie-ratio))),var(--stat-Cha-color) calc(0.6499999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.75turn - (0.05turn * var(--pie-ratio))) calc(0.75turn + (0.05turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                There are small changes each time; it's harder to get used to. The soulstones at the end last through
                loops, but they're not always in the dungeon... Strange.The dungeon requires different skills at
                different points.One action can clear multiple floors if your stats are high enough.Gives (magic + self
                combat) * (1 + main stat / 100) * sqrt(1 + times floor completed / 200) * (original mana cost / actual
                mana cost) progress points per mana.Unlocked at a combined Combat and Magic skill of 35.Requires a
                reputation of 2 or above.Gives 1 soulstone per completion - hover over Looted for info.
                <span id='goldCostSDungeon'></span>

                <div class='bold'>Combat Exp:</div>
                <span id='expGainSDungeonCombat'>5</span>
                <div class='bold'>Magic Exp:</div>
                <span id='expGainSDungeonMagic'>5</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostSDungeon'>2,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>40%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>30%</dd>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>10%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>10%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultSDungeon'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                There are small changes each time; it's harder to get used to. The soulstones at the end last through
                loops, but they're not always in the dungeon... Strange.The dungeon requires different skills at
                different points.One action can clear multiple floors if your stats are high enough.Gives (magic + self
                combat) * (1 + main stat / 100) * sqrt(1 + times floor completed / 200) * (original mana cost / actual
                mana cost) progress points per mana.Unlocked at a combined Combat and Magic skill of 35.Requires a
                reputation of 2 or above.Gives 1 soulstone per completion - hover over Looted for info.

                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Str stat-color'>Str</span>, <span class=' stat-Cha stat-color'>Cha</span>,
                <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <ActionCard action='Buy Supplies' />
          <ActionCard action='Haggle' />
          <div>
            <button
              id='containerSurveyZ0'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Survey</label>
              <div style='position:relative'>
                <img src='icons/surveyZ0.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Per-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.3turn - (0.1turn * var(--pie-ratio))) calc(0.3turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The explorers guild has taught you how to find what most would miss. Gives max(1,floor(sqrt(average
                survey progress))) exp per action. (Currently
                <div class='surveySkill'>0</div>) Each percent surveyed gives an additional 0.5% findables in this zone
                (additive with Spatiomancy). Costs 1 map and gives 1 completed map, unless this zone's survey is at
                100%.
                <span id='goldCostSurveyZ0'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostSurveyZ0'>10,000</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>40%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultSurveyZ0'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                The explorers guild has taught you how to find what most would miss. Gives max(1,floor(sqrt(average
                survey progress))) exp per action. (Currently
                <div class='surveySkill'>0</div>) Each percent surveyed gives an additional 0.5% findables in this zone
                (additive with Spatiomancy). Costs 1 map and gives 1 completed map, unless this zone's survey is at
                100%.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Spd stat-color'>Spd</span>, <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerAssassinZ0'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Assassinate</label>
              <div style='position:relative'>
                <img src='icons/assassin.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 1.2246467991473532e-16,1 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Dex-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.25turn - (0.1turn * var(--pie-ratio))) calc(0.25turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.6499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.7999999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.7999999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Discreetly kill your mark in this town. The more well-known you are, for either good or evil, the harder
                pulling this off will be... Gives progress equal to (sqrt(practical) + thievery + assassination) *
                (1+stat/1000) * sqrt(1+completions/100) / max(1,abs(reputation)) / max(1,hearts) * base/actual cost.
                Lose max(0,250*zone-assassination) reputation, regardless of whether you were successful or not. Rewards
                a heart on successful kill.
                <span id='goldCostAssassinZ0'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostAssassinZ0'>50,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>30%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultAssassinZ0'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Discreetly kill your mark in this town. The more well-known you are, for either good or evil, the harder
                pulling this off will be... Gives progress equal to (sqrt(practical) + thievery + assassination) *
                (1+stat/1000) * sqrt(1+completions/100) / max(1,abs(reputation)) / max(1,hearts) * base/actual cost.
                Lose max(0,250*zone-assassination) reputation, regardless of whether you were successful or not. Rewards
                a heart on successful kill.

                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Per stat-color'>Per</span>, <span class=' stat-Luck stat-color'>Luck</span>,
                <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerMap'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Purchase Map</label>
              <div style='position:relative'>
                <img src='icons/map.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951536,-0.30901699437494723 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -0.5877852522924734,-0.8090169943749473 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L-0.5877852522924734,-0.8090169943749473 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.4turn,var(--stat-Cha-color) calc(0.4turn * var(--pie-ratio)),var(--stat-Luck-color) calc(0.45000000000000007turn - (0.05turn * var(--pie-ratio))) calc(0.45000000000000007turn + (0.05turn * var(--pie-ratio))),var(--stat-Soul-color) calc(0.5499999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.4turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The Explorers' guild has taught you how to use cartographer's kits to map your surroundings. This will
                help you keep track of things and, with some luck, find secrets you overlooked before. There's a shop
                here in Beginnersville that will sell them for just <span id='goldCostMap'>15</span>
                gold each.

                <div class='bold'>Mana Cost:</div> <div id='manaCostMap'>200</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>80%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>10%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultMap'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                The Explorers' guild has taught you how to use cartographer's kits to map your surroundings. This will
                help you keep track of things and, with some luck, find secrets you overlooked before. There's a shop
                here in Beginnersville that will sell them for just gold each.

                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class=' stat-Luck stat-color'>Luck</span>,

                <span class=' stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
        </div>
        <div>
          <ActionCard action='Start Journey' />
          <ActionCard action='Hitch Ride' />
          <div>
            <button
              id='containerOpenRift'
              class='travelContainer actionOrTravelContainer normalActionContainer showthat locked hidden'
              draggable='true'
            >
              <label>Open Rift</label>
              <div style='position:relative'>
                <img src='icons/openRift.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Soul' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951535,0.30901699437494756 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.35turn,var(--stat-Soul-color) calc(0.35turn * var(--pie-ratio)),var(--stat-Int-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.6turn - (0.05turn * var(--pie-ratio))) calc(0.6turn + (0.05turn * var(--pie-ratio))),var(--stat-Soul-color) calc(1turn - (0.35turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Using your vast knowledge of the dark arts, you can open a rift into the shadow realm to send you
                straight to Startington.Unfortunately, it doesn't seem like you can fit any supplies through the
                rift.Unlocked at 300 Dark Magic and 100 Spatiomancy.
                <span id='goldCostOpenRift'></span>

                <div class='bold'>Dark Magic Exp:</div>
                <span id='expGainOpenRiftDark'>1000</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostOpenRift'>50,000</div>
                <dl>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>70%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultOpenRift'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Using your vast knowledge of the dark arts, you can open a rift into the shadow realm to send you
                straight to Startington.Unfortunately, it doesn't seem like you can fit any supplies through the
                rift.Unlocked at 300 Dark Magic and 100 Spatiomancy.

                (<span class='bold stat-Soul stat-color'>Soul</span>, <span class=' stat-Int stat-color'>Int</span>,

                <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div>
            <button
              id='containerForest'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight'
              draggable='true'
            >
              <label>Explore Forest</label>
              <div style='position:relative'>
                <img src='icons/exploreForest.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/buyGlasses.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Per-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.3turn - (0.1turn * var(--pie-ratio))) calc(0.3turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                What a pleasant area.2x progress with glasses.
                <span id='goldCostForest'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostForest'>400</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>40%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultForest'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                What a pleasant area.2x progress with glasses.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Spd stat-color'>Spd</span>, <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerWildMana'
              class='actionContainer cappableActionContainer actionOrTravelContainer limitedActionContainer showthat actionHighlight locked'
              draggable='true'
            >
              <label>Wild Mana</label>
              <div style='position:relative'>
                <img src='icons/wildMana.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,1,1 -0.587785252292473,0.8090169943749475 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.3turn,var(--stat-Int-color) calc(0.3turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.39999999999999997turn - (0.1turn * var(--pie-ratio))) calc(0.39999999999999997turn + (0.1turn * var(--pie-ratio))),var(--stat-Soul-color) calc(0.6000000000000001turn - (0.1turn * var(--pie-ratio))) calc(0.6000000000000001turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.3turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                They're out of sight of most travellers, but you have time to find and harvest them.Every good mana spot
                has
                <span id='goldCostWildMana'>250</span>

                mana.Every 10 mana spots have good mana.

                <div class='bold'>Mana Cost:</div> <div id='manaCostWildMana'>150</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>60%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultWildMana'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                They're out of sight of most travellers, but you have time to find and harvest them.Every good mana spot
                has

                mana.Every 10 mana spots have good mana.

                (<span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerHerbs'
              class='actionContainer cappableActionContainer actionOrTravelContainer limitedActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Gather Herbs</label>
              <div style='position:relative'>
                <img src='icons/gatherHerbs.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Str' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Str-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Dex-color) calc(0.35000000000000003turn - (0.15turn * var(--pie-ratio))) calc(0.35000000000000003turn + (0.15turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.6499999999999999turn - (0.15turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.15turn * var(--pie-ratio))),var(--stat-Str-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Might as well dig up anything useful you find.Every 10 funny plants are herbs.Unlocked at 10% Forest
                Explored.
                <span id='goldCostHerbs'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostHerbs'>200</div>
                <dl>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>40%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>30%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>30%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultHerbs'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Might as well dig up anything useful you find.Every 10 funny plants are herbs.Unlocked at 10% Forest
                Explored.

                (<span class='bold stat-Str stat-color'>Str</span>, <span class=' stat-Dex stat-color'>Dex</span>,
                <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerHunt'
              class='actionContainer cappableActionContainer actionOrTravelContainer limitedActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Hunt</label>
              <div style='position:relative'>
                <img src='icons/hunt.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Spd' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Spd-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Dex-color) calc(0.3turn - (0.1turn * var(--pie-ratio))) calc(0.3turn + (0.1turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The forest provides.Every 10 animals have good hides.Unlocked at 40% Forest Explored.
                <span id='goldCostHunt'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostHunt'>800</div>
                <dl>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>40%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>20%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultHunt'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                The forest provides.Every 10 animals have good hides.Unlocked at 40% Forest Explored.

                (<span class='bold stat-Spd stat-color'>Spd</span>, <span class=' stat-Dex stat-color'>Dex</span>,
                <span class=' stat-Con stat-color'>Con</span>, <span class=' stat-Per stat-color'>Per</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerSitByWaterfall'
              class='actionContainer cappableActionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Sit By Waterfall</label>
              <div style='position:relative'>
                <img src='icons/sitByWaterfall.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.4turn,var(--stat-Soul-color) calc(0.4turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Soul-color) calc(1turn - (0.4turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                It's peaceful here. Loud, but peaceful.Has 4x exp/talent gain, and can only be done
                <div id='trainingLimitSoul'></div> times per reset.Unlocked at 70% Forest Explored.
                <span id='goldCostSitByWaterfall'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostSitByWaterfall'>2,000</div>
                <dl>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>80%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultSitByWaterfall'>400</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                It's peaceful here. Loud, but peaceful.Has 4x exp/talent gain, and can only be done
                <div id='trainingLimitSoul'></div> times per reset.Unlocked at 70% Forest Explored.

                (<span class='bold stat-Soul stat-color'>Soul</span>, <span class=' stat-Con stat-color'>Con</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerShortcut'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked'
              draggable='true'
            >
              <label>Old Shortcut</label>
              <div style='position:relative'>
                <img src='icons/oldShortcut.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Con' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Con-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Per-color) calc(0.35000000000000003turn - (0.15turn * var(--pie-ratio))) calc(0.35000000000000003turn + (0.15turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.5999999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.5999999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.75turn - (0.05turn * var(--pie-ratio))) calc(0.75turn + (0.05turn * var(--pie-ratio))),var(--stat-Con-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                No one has come down this way in quite some time.Gives some additional herbs.Old men are a pain unless
                you know something they care about. Talk to Hermit gives 1% more Hermit Knowledge Learned per 1%
                Shortcut Explored.Unlocked at 20% Forest Explored.
                <span id='goldCostShortcut'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostShortcut'>800</div>
                <dl>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>40%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>30%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultShortcut'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                No one has come down this way in quite some time.Gives some additional herbs.Old men are a pain unless
                you know something they care about. Talk to Hermit gives 1% more Hermit Knowledge Learned per 1%
                Shortcut Explored.Unlocked at 20% Forest Explored.

                (<span class='bold stat-Con stat-color'>Con</span>, <span class=' stat-Per stat-color'>Per</span>,
                <span class=' stat-Spd stat-color'>Spd</span>, <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerHermit'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked'
              draggable='true'
            >
              <label>Talk To Hermit</label>
              <div style='position:relative'>
                <img src='icons/talkToHermit.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Con' d='M0,0 L0,-1 A1,1 0,1,1 1.2246467991473532e-16,1 Z'></path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.25turn,var(--stat-Con-color) calc(0.25turn * var(--pie-ratio)),var(--stat-Cha-color) calc(0.4turn - (0.15turn * var(--pie-ratio))) calc(0.4turn + (0.15turn * var(--pie-ratio))),var(--stat-Soul-color) calc(0.65turn - (0.1turn * var(--pie-ratio))) calc(0.65turn + (0.1turn * var(--pie-ratio))),var(--stat-Con-color) calc(1turn - (0.25turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                This old man is happy to have a listening ear, surely he has some useful knowledge. You hope. He's
                initially confrontational, but opens up once you start talking about the road.Reduces mana cost of
                Gather Herbs, Practical Magic, and Learn Alchemy by 0.5% per 1% of Hermit Knowledge.Unlocked with both
                20% Shortcut Explored and 40 Magic.
                <span id='goldCostHermit'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostHermit'>1,200</div>
                <dl>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>50%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>30%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultHermit'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                This old man is happy to have a listening ear, surely he has some useful knowledge. You hope. He's
                initially confrontational, but opens up once you start talking about the road.Reduces mana cost of
                Gather Herbs, Practical Magic, and Learn Alchemy by 0.5% per 1% of Hermit Knowledge.Unlocked with both
                20% Shortcut Explored and 40 Magic.

                (<span class='bold stat-Con stat-color'>Con</span>, <span class=' stat-Cha stat-color'>Cha</span>,
                <span class=' stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerPracticalMagic'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Practical Magic</label>
              <div style='position:relative'>
                <img src='icons/practicalMagic.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,1,1 1.2246467991473532e-16,1 Z'></path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.25turn,var(--stat-Int-color) calc(0.25turn * var(--pie-ratio)),var(--stat-Per-color) calc(0.4turn - (0.15turn * var(--pie-ratio))) calc(0.4turn + (0.15turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.65turn - (0.1turn * var(--pie-ratio))) calc(0.65turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.25turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Such simple uses to help out with everyday tasks. Genius, really. It's like pulling teeth getting this
                knowledge from the Hermit though.Unlocked with both 20% Hermit Knowledge and 50 Magic.
                <span id='goldCostPracticalMagic'></span>

                <div class='bold'>Practical Magic Exp:</div>
                <span id='expGainPracticalMagicPractical'>100</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostPracticalMagic'>4,000</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>50%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>30%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultPracticalMagic'>150</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Practical Magic</div>
                <i>Mage Hand, Prestidigitation, Detect Magic, and other useful tricks to help out.</i>Smash Pots and
                Wild Mana costs are reduced to the original / (1 + level / 100) (rounded up). The following actions get
                1% more gold per level in their level range (rounded down). 1-200 Pick Locks 101-300 Short Quests
                201-400 Long Quests
              </div>
              <div class='showthis when-locked' draggable='false'>
                Such simple uses to help out with everyday tasks. Genius, really. It's like pulling teeth getting this
                knowledge from the Hermit though.Unlocked with both 20% Hermit Knowledge and 50 Magic.

                <div class='bold'>Learn skill:</div> <span>Practical Magic</span>
                (<span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Per stat-color'>Per</span>,
                <span class=' stat-Con stat-color'>Con</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerLearnAlchemy'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Learn Alchemy</label>
              <div style='position:relative'>
                <img src='icons/learnAlchemy.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,1,1 -0.587785252292473,0.8090169943749475 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.3turn,var(--stat-Int-color) calc(0.3turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.45turn - (0.15turn * var(--pie-ratio))) calc(0.45turn + (0.15turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.6499999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.3turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                You can listen to him yammer while making light healing and remedy potions.You're starting to think the
                potion that caused you to loop time was a complex one.You provide the ingredients; costs 10 herbs.Gives
                alchemy and magic skill.Unlocked with both 40% Hermit Knowledge and 60 Magic.
                <span id='goldCostLearnAlchemy'></span>

                <div class='bold'>Magic Exp:</div>
                <span id='expGainLearnAlchemyMagic'>50</span>
                <div class='bold'>Alchemy Exp:</div>
                <span id='expGainLearnAlchemyAlchemy'>50</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostLearnAlchemy'>5,000</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>60%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>30%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultLearnAlchemy'>150</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Alchemy</div>
                <i>Brewing potions is hard work! It's a good thing you found a teacher.</i>The Magic teacher in
                Beginnersville adores alchemists. +1% Magic exp gain from the Mage Lessons action (rounded down) per
                level.
              </div>
              <div class='showthis when-locked' draggable='false'>
                You can listen to him yammer while making light healing and remedy potions.You're starting to think the
                potion that caused you to loop time was a complex one.You provide the ingredients; costs 10 herbs.Gives
                alchemy and magic skill.Unlocked with both 40% Hermit Knowledge and 60 Magic.

                <div class='bold'>Learn skill:</div> <span>Alchemy</span>
                (<span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Per stat-color'>Per</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerBrewPotions'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Brew Potions</label>
              <div style='position:relative'>
                <img src='icons/brewPotions.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,1,1 -0.587785252292473,0.8090169943749475 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.3turn,var(--stat-Int-color) calc(0.3turn * var(--pie-ratio)),var(--stat-Dex-color) calc(0.45turn - (0.15turn * var(--pie-ratio))) calc(0.45turn + (0.15turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.6499999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.3turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Bubbles and Flasks. Potions and Magic.Requires a reputation of 5 or above, or he won't let you near his
                stuff.Creates a potion from 10 herbs to sell at the next town.Gives alchemy and magic skill.Unlocked
                with 10 Alchemy.
                <span id='goldCostBrewPotions'></span>

                <div class='bold'>Magic Exp:</div>
                <span id='expGainBrewPotionsMagic'>50</span>
                <div class='bold'>Alchemy Exp:</div>
                <span id='expGainBrewPotionsAlchemy'>25</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostBrewPotions'>4,000</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>60%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>30%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultBrewPotions'>150</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Bubbles and Flasks. Potions and Magic.Requires a reputation of 5 or above, or he won't let you near his
                stuff.Creates a potion from 10 herbs to sell at the next town.Gives alchemy and magic skill.Unlocked
                with 10 Alchemy.

                (<span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Dex stat-color'>Dex</span>,
                <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerTrainDexterity'
              class='actionContainer cappableActionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Train Dexterity</label>
              <div style='position:relative'>
                <img src='icons/trainDexterity.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951536,-0.30901699437494723 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.4turn,var(--stat-Dex-color) calc(0.4turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.4turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                There's a nice array of rocks to hop between. It's a lot of fun.Has 4x exp/talent gain, and can only be
                done <div id='trainingLimitDex'></div> times per reset.Unlocked at 60% Forest Explored.
                <span id='goldCostTrainDexterity'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostTrainDexterity'>2,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>80%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultTrainDexterity'>400</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                There's a nice array of rocks to hop between. It's a lot of fun.Has 4x exp/talent gain, and can only be
                done <div id='trainingLimitDex'></div> times per reset.Unlocked at 60% Forest Explored.

                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class=' stat-Con stat-color'>Con</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerTrainSpeed'
              class='actionContainer cappableActionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Train Speed</label>
              <div style='position:relative'>
                <img src='icons/trainSpeed.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Spd' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951536,-0.30901699437494723 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.4turn,var(--stat-Spd-color) calc(0.4turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(1turn - (0.4turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                A forest run is fantastic. You feel like you're learning a lot as you push your limits.Has 4x exp/talent
                gain, and can only be done <div id='trainingLimitSpd'></div>
                times per reset.Unlocked at 80% Forest Explored.
                <span id='goldCostTrainSpeed'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostTrainSpeed'>2,000</div>
                <dl>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>80%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultTrainSpeed'>400</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                A forest run is fantastic. You feel like you're learning a lot as you push your limits.Has 4x exp/talent
                gain, and can only be done <div id='trainingLimitSpd'></div>
                times per reset.Unlocked at 80% Forest Explored.

                (<span class='bold stat-Spd stat-color'>Spd</span>, <span class=' stat-Con stat-color'>Con</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerFlowers'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Follow Flowers</label>
              <div style='position:relative'>
                <img src='icons/followFlowers.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/buyGlasses.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951535,0.30901699437494756 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.35turn,var(--stat-Per-color) calc(0.35turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.6turn - (0.05turn * var(--pie-ratio))) calc(0.6turn + (0.05turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.35turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                You've located an oddly out of place trail of flowers, why not see where it leads. You can find more
                herbs along the path.2x progress with glasses.Unlocked at 50% Forest Explored.
                <span id='goldCostFlowers'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostFlowers'>300</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>70%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultFlowers'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                You've located an oddly out of place trail of flowers, why not see where it leads. You can find more
                herbs along the path.2x progress with glasses.Unlocked at 50% Forest Explored.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Con stat-color'>Con</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerBirdWatching'
              class='actionContainer cappableActionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Bird Watching</label>
              <div style='position:relative'>
                <img src='icons/birdWatching.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/buyGlasses.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951536,-0.30901699437494723 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.4turn,var(--stat-Per-color) calc(0.4turn * var(--pie-ratio)),var(--stat-Int-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.4turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Far along the flower trail, there seems to be a large variety of birds flying about. Perhaps you could
                take up a new hobby.Requires glasses.Has 4x exp/talent gain, and can only be done
                <div id='trainingLimitPer'></div> times per reset.Unlocked at 80% Flower Trail Followed.
                <span id='goldCostBirdWatching'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostBirdWatching'>2,000</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>80%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultBirdWatching'>400</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Far along the flower trail, there seems to be a large variety of birds flying about. Perhaps you could
                take up a new hobby.Requires glasses.Has 4x exp/talent gain, and can only be done
                <div id='trainingLimitPer'></div> times per reset.Unlocked at 80% Flower Trail Followed.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerThicket'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Clear Thicket</label>
              <div style='position:relative'>
                <img src='icons/clearThicket.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Str'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 1.2246467991473532e-16,1 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Per-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Str-color) calc(0.25turn - (0.1turn * var(--pie-ratio))) calc(0.25turn + (0.1turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.6499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Dex-color) calc(0.7999999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.7999999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The path of flowers has lead you to a thicket, seemingly in the middle of nowhere. Perhaps it's some
                strange magic. You can clear out the thicket to find some more wild mana.Unlocked at 20% Flower Trail
                Followed.
                <span id='goldCostThicket'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostThicket'>500</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>30%</dd>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>20%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultThicket'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                The path of flowers has lead you to a thicket, seemingly in the middle of nowhere. Perhaps it's some
                strange magic. You can clear out the thicket to find some more wild mana.Unlocked at 20% Flower Trail
                Followed.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class=' stat-Str stat-color'>Str</span>,
                <span class=' stat-Con stat-color'>Con</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Dex stat-color'>Dex</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerWitch'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Talk To Witch</label>
              <div style='position:relative'>
                <img src='icons/talkToWitch.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Soul' d='M0,0 L0,-1 A1,1 0,1,1 1.2246467991473532e-16,1 Z'></path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.25turn,var(--stat-Soul-color) calc(0.25turn * var(--pie-ratio)),var(--stat-Cha-color) calc(0.4turn - (0.15turn * var(--pie-ratio))) calc(0.4turn + (0.15turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.65turn - (0.1turn * var(--pie-ratio))) calc(0.65turn + (0.1turn * var(--pie-ratio))),var(--stat-Soul-color) calc(1turn - (0.25turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Talk to the witch to learn her secrets of the dark arts.Unlocked with both 60% Thicket Explored and 80
                Magic.Reduces mana cost of Dark Magic and Dark Ritual by 0.5% per 1% of Witch Knowledge.
                <span id='goldCostWitch'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostWitch'>1,500</div>
                <dl>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>50%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>30%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultWitch'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Talk to the witch to learn her secrets of the dark arts.Unlocked with both 60% Thicket Explored and 80
                Magic.Reduces mana cost of Dark Magic and Dark Ritual by 0.5% per 1% of Witch Knowledge.

                (<span class='bold stat-Soul stat-color'>Soul</span>, <span class=' stat-Cha stat-color'>Cha</span>,

                <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerDarkMagic'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Dark Magic</label>
              <div style='position:relative'>
                <img src='icons/darkMagic.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,1,1 1.2246467991473532e-16,1 Z'></path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.25turn,var(--stat-Int-color) calc(0.25turn * var(--pie-ratio)),var(--stat-Soul-color) calc(0.4turn - (0.15turn * var(--pie-ratio))) calc(0.4turn + (0.15turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.65turn - (0.1turn * var(--pie-ratio))) calc(0.65turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.25turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Embrace the dark arts to more efficiently harvest mana. But at what cost?Adds 1 negative
                reputation.Requires a reputation of 0 or below.Unlocked with both 20% Witch Knowledge and 100 Magic.
                <span id='goldCostDarkMagic'></span>

                <div class='bold'>Dark Magic Exp:</div>
                <span id='expGainDarkMagicDark'>100</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostDarkMagic'>6,000</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>50%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>30%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultDarkMagic'>150</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Dark Magic</div>
                <i>Use various dark arts to help you harvest mana.</i>Multiply the mana gain from Smash Pots and Wild
                Mana by (1 + level / 60) ^ 0.25 (rounded down).
              </div>
              <div class='showthis when-locked' draggable='false'>
                Embrace the dark arts to more efficiently harvest mana. But at what cost?Adds 1 negative
                reputation.Requires a reputation of 0 or below.Unlocked with both 20% Witch Knowledge and 100 Magic.

                <div class='bold'>Learn skill:</div> <span>Dark Magic</span>
                (<span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Soul stat-color'>Soul</span>,

                <span class=' stat-Con stat-color'>Con</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerDarkRitual'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Dark Ritual</label>
              <div style='position:relative'>
                <img src='icons/darkRitual.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -0.5877852522924734,-0.8090169943749473 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.5877852522924734,-0.8090169943749473 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.4turn,var(--stat-Soul-color) calc(0.4turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.45000000000000007turn - (0.05turn * var(--pie-ratio))) calc(0.45000000000000007turn + (0.05turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.5499999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Soul-color) calc(1turn - (0.4turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Sacrifice an increasing amount of soulstones to the dark gods, granting a permanent speed 10% boost to
                all actions in Beginnersville.Gives (dark magic skill) * (1 + witch knowledge / 100) * (1 + main stat /
                100) * (original mana cost / actual mana cost) progress points per mana.Requires a reputation of -5 or
                below.Can only have 1 Dark Ritual action.Unlocked with both 50% Witch Knowledge and 50 Dark
                Magic.Sacrifices (50 * (rituals completed+1)) soulstones. Currently sacrificing
                <span id='goldCostDarkRitual'>50</span>

                soulstones.

                <div class='bold'>Mana Cost:</div> <div id='manaCostDarkRitual'>50,000</div>
                <dl>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>80%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>10%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultDarkRitual'>1000</div>%

                <div class='bold'>Grants buff:</div> <div class='bold underline'>Dark Ritual</div>
                <i>
                  The witch appreciates your dedication to the dark arts. +1% to Dark Magic exp gain from the Dark Magic
                  action (rounded down) per ritual.
                </i>
              </div>
              <div class='showthis when-locked' draggable='false'>
                Sacrifice an increasing amount of soulstones to the dark gods, granting a permanent speed 10% boost to
                all actions in Beginnersville.Gives (dark magic skill) * (1 + witch knowledge / 100) * (1 + main stat /
                100) * (original mana cost / actual mana cost) progress points per mana.Requires a reputation of -5 or
                below.Can only have 1 Dark Ritual action.Unlocked with both 50% Witch Knowledge and 50 Dark
                Magic.Sacrifices (50 * (rituals completed+1)) soulstones. Currently sacrificing

                soulstones.

                <div class='bold'>Grants buff:</div> <span>Dark Ritual</span>
                (<span class='bold stat-Soul stat-color'>Soul</span>, <span class=' stat-Spd stat-color'>Spd</span>,

                <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerSurveyZ1'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Survey</label>
              <div style='position:relative'>
                <img src='icons/surveyZ1.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Per-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.3turn - (0.1turn * var(--pie-ratio))) calc(0.3turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The explorers guild has taught you how to find what most would miss. Gives max(1,floor(sqrt(average
                survey progress))) exp per action. (Currently
                <div class='surveySkill'>0</div>) Each percent surveyed gives an additional 0.5% findables in this zone
                (additive with Spatiomancy). Costs 1 map and gives 1 completed map, unless this zone's survey is at
                100%.
                <span id='goldCostSurveyZ1'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostSurveyZ1'>20,000</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>40%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultSurveyZ1'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                The explorers guild has taught you how to find what most would miss. Gives max(1,floor(sqrt(average
                survey progress))) exp per action. (Currently
                <div class='surveySkill'>0</div>) Each percent surveyed gives an additional 0.5% findables in this zone
                (additive with Spatiomancy). Costs 1 map and gives 1 completed map, unless this zone's survey is at
                100%.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Spd stat-color'>Spd</span>, <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerRuinsZ1'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Ruins</label>
              <div style='position:relative'>
                <img src='icons/ruinsZ1.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/surveyZ1.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Per-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.3turn - (0.1turn * var(--pie-ratio))) calc(0.3turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                As you explore, you find ruins scattered among the trees. You better explore them, who knows what useful
                secrets they hide.
                <span id='goldCostRuinsZ1'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostRuinsZ1'>100,000</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>40%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultRuinsZ1'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                As you explore, you find ruins scattered among the trees. You better explore them, who knows what useful
                secrets they hide.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Spd stat-color'>Spd</span>, <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerStonesZ1'
              class='actionContainer actionOrTravelContainer limitedActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Haul</label>
              <div style='position:relative'>
                <img src='icons/haulZ1.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/surveyZ1.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Con' d='M0,0 L0,-1 A1,1 0,1,1 -0.587785252292473,0.8090169943749475 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Str'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.3turn,var(--stat-Con-color) calc(0.3turn * var(--pie-ratio)),var(--stat-Str-color) calc(0.5turn - (0.2turn * var(--pie-ratio))) calc(0.5turn + (0.2turn * var(--pie-ratio))),var(--stat-Con-color) calc(1turn - (0.3turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                You find a strange kind of stone that resists change from the loop. When you move them, they remain in
                the new location the next time you return. Most of the rocks around are just ordinary though. It'll take
                a while to find the interesting ones. You're sure you can use them for something, but they're too heavy
                to move more than one at a time. One in every one thousand Stones is Temporal. Action fails if you have
                a Temporal Stone.
                <span id='goldCostStonesZ1'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostStonesZ1'>50,000</div>
                <dl>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>60%</dd>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>40%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultStonesZ1'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                You find a strange kind of stone that resists change from the loop. When you move them, they remain in
                the new location the next time you return. Most of the rocks around are just ordinary though. It'll take
                a while to find the interesting ones. You're sure you can use them for something, but they're too heavy
                to move more than one at a time. One in every one thousand Stones is Temporal. Action fails if you have
                a Temporal Stone.

                (<span class='bold stat-Con stat-color'>Con</span>, <span class=' stat-Str stat-color'>Str</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerAssassinZ1'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Assassinate</label>
              <div style='position:relative'>
                <img src='icons/assassin.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 1.2246467991473532e-16,1 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Dex-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.25turn - (0.1turn * var(--pie-ratio))) calc(0.25turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.6499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.7999999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.7999999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Discreetly kill your mark in this town. The more well-known you are, for either good or evil, the harder
                pulling this off will be... Gives progress equal to (sqrt(practical) + thievery + assassination) *
                (1+stat/1000) * sqrt(1+completions/100) / max(1,abs(reputation)) / max(1,hearts) * base/actual cost.
                Lose max(0,250*zone-assassination) reputation, regardless of whether you were successful or not. Rewards
                a heart on successful kill.
                <span id='goldCostAssassinZ1'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostAssassinZ1'>50,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>30%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultAssassinZ1'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Discreetly kill your mark in this town. The more well-known you are, for either good or evil, the harder
                pulling this off will be... Gives progress equal to (sqrt(practical) + thievery + assassination) *
                (1+stat/1000) * sqrt(1+completions/100) / max(1,abs(reputation)) / max(1,hearts) * base/actual cost.
                Lose max(0,250*zone-assassination) reputation, regardless of whether you were successful or not. Rewards
                a heart on successful kill.

                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Per stat-color'>Per</span>, <span class=' stat-Luck stat-color'>Luck</span>,
                <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
        </div>
        <div>
          <div>
            <button
              id='containerContinueOn'
              class='travelContainer actionOrTravelContainer normalActionContainer showthat'
              draggable='true'
            >
              <label>Continue On</label>
              <div style='position:relative'>
                <img src='icons/continueOn.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Con' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Con-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.4000000000000001turn - (0.2turn * var(--pie-ratio))) calc(0.4000000000000001turn + (0.2turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Con-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Keep walking to the next town, Merchanton.Mana cost reduced by 60 per Old Shortcut %.
                <span id='goldCostContinueOn'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostContinueOn'>8,000</div>
                <dl>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>40%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>40%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultContinueOn'>200</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Keep walking to the next town, Merchanton.Mana cost reduced by 60 per Old Shortcut %.

                (<span class='bold stat-Con stat-color'>Con</span>, <span class='bold stat-Spd stat-color'>Spd</span>,

                <span class=' stat-Per stat-color'>Per</span>)
              </div>
            </button>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div>
            <button
              id='containerCity'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight'
              draggable='true'
            >
              <label>Explore City</label>
              <div style='position:relative'>
                <img src='icons/exploreCity.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/buyGlasses.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Spd' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 -0.587785252292473,0.8090169943749475 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -0.5877852522924734,-0.8090169943749473 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.5877852522924734,-0.8090169943749473 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Spd-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Per-color) calc(0.29999999999999993turn - (0.15turn * var(--pie-ratio))) calc(0.29999999999999993turn + (0.15turn * var(--pie-ratio))),var(--stat-Cha-color) calc(0.5499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.7000000000000001turn - (0.05turn * var(--pie-ratio))) calc(0.7000000000000001turn + (0.05turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7999999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.7999999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Spd-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Everyone is so busy, and there's so much to do.2x progress with glasses.
                <span id='goldCostCity'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostCity'>750</div>
                <dl>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>30%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>30%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>20%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>10%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultCity'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Everyone is so busy, and there's so much to do.2x progress with glasses.

                (<span class='bold stat-Spd stat-color'>Spd</span>, <span class='bold stat-Per stat-color'>Per</span>,

                <span class=' stat-Cha stat-color'>Cha</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerGamble'
              class='actionContainer cappableActionContainer actionOrTravelContainer limitedActionContainer showthat actionHighlight locked'
              draggable='true'
            >
              <label>Gamble</label>
              <div style='position:relative'>
                <img src='icons/gamble.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.4turn,var(--stat-Luck-color) calc(0.4turn * var(--pie-ratio)),var(--stat-Cha-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(1turn - (0.4turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The cards still somehow come out different every time.Has 2x exp/talent gainCosts 20 gold and 1
                reputation.Requires a reputation above -6.You win against every 10 suckers, and get 60 gold for
                winning.Unlocked at 10% City Explored.
                <span id='goldCostGamble'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostGamble'>1,000</div>
                <dl>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>80%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultGamble'>200</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                The cards still somehow come out different every time.Has 2x exp/talent gainCosts 20 gold and 1
                reputation.Requires a reputation above -6.You win against every 10 suckers, and get 60 gold for
                winning.Unlocked at 10% City Explored.

                (<span class='bold stat-Luck stat-color'>Luck</span>, <span class=' stat-Cha stat-color'>Cha</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerDrunk'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked'
              draggable='true'
            >
              <label>Get Drunk</label>
              <div style='position:relative'>
                <img src='icons/getDrunk.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,1,1 1.2246467991473532e-16,1 Z'></path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Str'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.25turn,var(--stat-Cha-color) calc(0.25turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.35turn - (0.1turn * var(--pie-ratio))) calc(0.35turn + (0.1turn * var(--pie-ratio))),var(--stat-Soul-color) calc(0.5499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Str-color) calc(0.7turn - (0.05turn * var(--pie-ratio))) calc(0.7turn + (0.05turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.25turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Sometimes you just need a drink.Requires a reputation above -4.Has 3x exp/talent gain.Costs 1
                reputation.Unlocked at 20% City Explored.
                <span id='goldCostDrunk'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostDrunk'>1,000</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>50%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>20%</dd>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultDrunk'>300</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Sometimes you just need a drink.Requires a reputation above -4.Has 3x exp/talent gain.Costs 1
                reputation.Unlocked at 20% City Explored.

                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Soul stat-color'>Soul</span>, <span class=' stat-Str stat-color'>Str</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerBuyManaZ3'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight'
              draggable='true'
            >
              <label>Buy Mana</label>
              <div style='position:relative'>
                <img src='icons/buyManaZ3.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951535,0.30901699437494756 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.35turn,var(--stat-Cha-color) calc(0.35turn * var(--pie-ratio)),var(--stat-Int-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.6turn - (0.05turn * var(--pie-ratio))) calc(0.6turn + (0.05turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.35turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                1 gold =
                <span id='goldCostBuyManaZ3'>50</span>

                mana. Buys all the mana you can.

                <div class='bold'>Mana Cost:</div> <div id='manaCostBuyManaZ3'>100</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>70%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultBuyManaZ3'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                1 gold =

                mana. Buys all the mana you can.

                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class=' stat-Int stat-color'>Int</span>,
                <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerSellPotions'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight'
              draggable='true'
            >
              <label>Sell Potions</label>
              <div style='position:relative'>
                <img src='icons/sellPotions.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951535,0.30901699437494756 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.35turn,var(--stat-Cha-color) calc(0.35turn * var(--pie-ratio)),var(--stat-Int-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.6turn - (0.05turn * var(--pie-ratio))) calc(0.6turn + (0.05turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.35turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Potions are worth 1 gold per alchemy skill, but it takes a while to find a buyer.
                <span id='goldCostSellPotions'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostSellPotions'>1,000</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>70%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultSellPotions'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Potions are worth 1 gold per alchemy skill, but it takes a while to find a buyer.

                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class=' stat-Int stat-color'>Int</span>,
                <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerAdvGuild'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Adventure Guild</label>
              <div style='position:relative'>
                <img src='icons/adventureGuild.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Str' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Str-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Dex-color) calc(0.35000000000000003turn - (0.15turn * var(--pie-ratio))) calc(0.35000000000000003turn + (0.15turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.6499999999999999turn - (0.15turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.15turn * var(--pie-ratio))),var(--stat-Str-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The one-stop shop for all your adventuring needs.Take their tests and get a rank!You can only join 1
                guild at a time, and only try once.Gives 200 mana per rank.Gives ((magic skill)/2 + (self combat)) * (1
                + main stat / 100) * sqrt(1 + times completed / 1000) * (original mana cost / actual mana cost) progress
                points per mana.Unlocked at 20% Rumors Heard.
                <span id='goldCostAdvGuild'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostAdvGuild'>3,000</div>
                <dl>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>40%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>30%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>30%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultAdvGuild'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                The one-stop shop for all your adventuring needs.Take their tests and get a rank!You can only join 1
                guild at a time, and only try once.Gives 200 mana per rank.Gives ((magic skill)/2 + (self combat)) * (1
                + main stat / 100) * sqrt(1 + times completed / 1000) * (original mana cost / actual mana cost) progress
                points per mana.Unlocked at 20% Rumors Heard.

                (<span class='bold stat-Str stat-color'>Str</span>, <span class=' stat-Dex stat-color'>Dex</span>,
                <span class=' stat-Con stat-color'>Con</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerGatherTeam'
              class='actionContainer cappableActionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Gather Team</label>
              <div style='position:relative'>
                <img src='icons/gatherTeam.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/adventureGuild.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,1,1 1.2246467991473532e-16,1 Z'></path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.25turn,var(--stat-Cha-color) calc(0.25turn * var(--pie-ratio)),var(--stat-Per-color) calc(0.35turn - (0.1turn * var(--pie-ratio))) calc(0.35turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.5499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7turn - (0.05turn * var(--pie-ratio))) calc(0.7turn + (0.05turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.25turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                You don't have to take them on by yourself.Max 5 other team members, plus 1 for each 100 levels of
                Leadership.Costs <div id='teamCost'></div>
                gold, and the cost goes up by 100 gold per member.Each member adds (Adventure Guild Multiplier) *
                (Combat Skill / 2) to your Team Combat.Requires Adventure Guild.Has 3x exp/talent gain.Unlocked at 20%
                Rumors Heard.
                <span id='goldCostGatherTeam'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostGatherTeam'>2,000</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>50%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultGatherTeam'>300</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                You don't have to take them on by yourself.Max 5 other team members, plus 1 for each 100 levels of
                Leadership.Costs <div id='teamCost'></div>
                gold, and the cost goes up by 100 gold per member.Each member adds (Adventure Guild Multiplier) *
                (Combat Skill / 2) to your Team Combat.Requires Adventure Guild.Has 3x exp/talent gain.Unlocked at 20%
                Rumors Heard.

                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class=' stat-Per stat-color'>Per</span>,
                <span class=' stat-Int stat-color'>Int</span>, <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerLDungeon'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Large Dungeon</label>
              <div style='position:relative'>
                <img src='icons/largeDungeon.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/gatherTeam.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 1.2246467991473532e-16,1 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Str'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Cha-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Dex-color) calc(0.25turn - (0.1turn * var(--pie-ratio))) calc(0.25turn + (0.1turn * var(--pie-ratio))),var(--stat-Str-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.6499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7999999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.7999999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                With your party, you set out to accomplish great feats of dungeoneering that you couldn't have done
                while alone.Gives (magic + team combat) * (1 + main stat / 100) * sqrt(1 + times floor completed / 200)
                * (original mana cost / actual mana cost) progress points per mana.Requires at least one other party
                member.Unlocked at 20% Rumors Heard.Gives 10 soulstones per completion - hover over Looted for info.
                <span id='goldCostLDungeon'></span>

                <div class='bold'>Combat Exp:</div>
                <span id='expGainLDungeonCombat'>15</span>
                <div class='bold'>Magic Exp:</div>
                <span id='expGainLDungeonMagic'>15</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostLDungeon'>6,000</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>30%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>20%</dd>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>20%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultLDungeon'>200</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                With your party, you set out to accomplish great feats of dungeoneering that you couldn't have done
                while alone.Gives (magic + team combat) * (1 + main stat / 100) * sqrt(1 + times floor completed / 200)
                * (original mana cost / actual mana cost) progress points per mana.Requires at least one other party
                member.Unlocked at 20% Rumors Heard.Gives 10 soulstones per completion - hover over Looted for info.

                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class=' stat-Dex stat-color'>Dex</span>,
                <span class=' stat-Str stat-color'>Str</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerCraftGuild'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Crafting Guild</label>
              <div style='position:relative'>
                <img src='icons/craftingGuild.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Int-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Dex-color) calc(0.35000000000000003turn - (0.15turn * var(--pie-ratio))) calc(0.35000000000000003turn + (0.15turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.6499999999999999turn - (0.15turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.15turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Learn to use your hands to build big structures.Take their tests and get a rank!You can only join 1
                guild at a time, and only try once.Gives 10 gold per segment completed.Gives ((magic skill)/2 +
                (crafting skill)) * (1 + main stat / 100) * sqrt(1 + times completed / 1000) * (original mana cost /
                actual mana cost) progress points per mana.Unlocked at 30% Rumors Heard.Gives Crafting exp upon segment
                completion, rather than upon action completion.
                <span id='goldCostCraftGuild'></span>

                <div class='bold'>Crafting Exp:</div>
                <span id='expGainCraftGuildCrafting'>50</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostCraftGuild'>3,000</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>40%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>30%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>30%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultCraftGuild'>100</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Crafting</div>
                <i>The skill of using your hands and creativity when doing physical work.</i>
              </div>
              <div class='showthis when-locked' draggable='false'>
                Learn to use your hands to build big structures.Take their tests and get a rank!You can only join 1
                guild at a time, and only try once.Gives 10 gold per segment completed.Gives ((magic skill)/2 +
                (crafting skill)) * (1 + main stat / 100) * sqrt(1 + times completed / 1000) * (original mana cost /
                actual mana cost) progress points per mana.Unlocked at 30% Rumors Heard.Gives Crafting exp upon segment
                completion, rather than upon action completion.

                <div class='bold'>Learn skill:</div> <span>Crafting</span>
                (<span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Dex stat-color'>Dex</span>,
                <span class=' stat-Per stat-color'>Per</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerCraftArmor'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Craft Armor</label>
              <div style='position:relative'>
                <img src='icons/craftArmor.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 -0.587785252292473,0.8090169943749475 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Str'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Dex-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.29999999999999993turn - (0.15turn * var(--pie-ratio))) calc(0.29999999999999993turn + (0.15turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.6turn - (0.15turn * var(--pie-ratio))) calc(0.6turn + (0.15turn * var(--pie-ratio))),var(--stat-Str-color) calc(0.7999999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.7999999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Turn hide into armor through hard work.Gives (20% * Crafting Guild Multiplier) to Self Combat per
                armor.Costs 2 hides.Unlocked at 30% Rumors Heard.
                <span id='goldCostCraftArmor'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostCraftArmor'>1,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>30%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>30%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>30%</dd>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultCraftArmor'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Turn hide into armor through hard work.Gives (20% * Crafting Guild Multiplier) to Self Combat per
                armor.Costs 2 hides.Unlocked at 30% Rumors Heard.

                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class='bold stat-Con stat-color'>Con</span>,

                <span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Str stat-color'>Str</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerApprentice'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Apprentice</label>
              <div style='position:relative'>
                <img src='icons/apprentice.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/craftingGuild.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Cha-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Int-color) calc(0.4000000000000001turn - (0.2turn * var(--pie-ratio))) calc(0.4000000000000001turn + (0.2turn * var(--pie-ratio))),var(--stat-Dex-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                You decided that knowing more about construction would help. You use your Crafting Guild license to hit
                the books.Goes faster with a higher guild multiplier.Gives 10-20 exp to Crafting for 0-100%Requires
                Crafting Guild.Unlocked at 40% Rumors heard.
                <span id='goldCostApprentice'></span>

                <div class='bold'>Crafting Exp:</div>
                <span id='expGainApprenticeCrafting'>10</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostApprentice'>2,000</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>40%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>40%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultApprentice'>150</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Crafting</div>
                <i>The skill of using your hands and creativity when doing physical work.</i>
              </div>
              <div class='showthis when-locked' draggable='false'>
                You decided that knowing more about construction would help. You use your Crafting Guild license to hit
                the books.Goes faster with a higher guild multiplier.Gives 10-20 exp to Crafting for 0-100%Requires
                Crafting Guild.Unlocked at 40% Rumors heard.

                <div class='bold'>Learn skill:</div> <span>Crafting</span>
                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class='bold stat-Int stat-color'>Int</span>,

                <span class=' stat-Dex stat-color'>Dex</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerMason'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Mason</label>
              <div style='position:relative'>
                <img src='icons/mason.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/craftingGuild.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,1,1 1.2246467991473532e-16,1 Z'></path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.25turn,var(--stat-Int-color) calc(0.25turn * var(--pie-ratio)),var(--stat-Cha-color) calc(0.4turn - (0.15turn * var(--pie-ratio))) calc(0.4turn + (0.15turn * var(--pie-ratio))),var(--stat-Dex-color) calc(0.65turn - (0.1turn * var(--pie-ratio))) calc(0.65turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.25turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                You've completed your apprenticeship and have the theoretical knowledge - now you need to get hands
                on.Goes faster with a higher guild multiplier.Requires Crafting Guild.Gives 20-40 exp to Crafting for
                0-100%Unlocked at 60% Rumors heard and 100% Apprenticeship.
                <span id='goldCostMason'></span>

                <div class='bold'>Crafting Exp:</div>
                <span id='expGainMasonCrafting'>20</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostMason'>2,000</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>50%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>30%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultMason'>200</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Crafting</div>
                <i>The skill of using your hands and creativity when doing physical work.</i>
              </div>
              <div class='showthis when-locked' draggable='false'>
                You've completed your apprenticeship and have the theoretical knowledge - now you need to get hands
                on.Goes faster with a higher guild multiplier.Requires Crafting Guild.Gives 20-40 exp to Crafting for
                0-100%Unlocked at 60% Rumors heard and 100% Apprenticeship.

                <div class='bold'>Learn skill:</div> <span>Crafting</span>
                (<span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Cha stat-color'>Cha</span>,
                <span class=' stat-Dex stat-color'>Dex</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerArchitect'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Architect</label>
              <div style='position:relative'>
                <img src='icons/architect.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/craftingGuild.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,1,1 -0.587785252292473,0.8090169943749475 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.3turn,var(--stat-Int-color) calc(0.3turn * var(--pie-ratio)),var(--stat-Dex-color) calc(0.39999999999999997turn - (0.1turn * var(--pie-ratio))) calc(0.39999999999999997turn + (0.1turn * var(--pie-ratio))),var(--stat-Cha-color) calc(0.6000000000000001turn - (0.1turn * var(--pie-ratio))) calc(0.6000000000000001turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.3turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Now that you know how things work, it's better to learn how to design them.Goes faster with a higher
                guild multiplier.Requires Crafting Guild.Gives 40-80 exp to Crafting for 0-100%Unlocked at 80% Rumors
                heard and 100% Buildings Built.
                <span id='goldCostArchitect'></span>

                <div class='bold'>Crafting Exp:</div>
                <span id='expGainArchitectCrafting'>40</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostArchitect'>2,000</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>60%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>20%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultArchitect'>250</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Crafting</div>
                <i>The skill of using your hands and creativity when doing physical work.</i>
              </div>
              <div class='showthis when-locked' draggable='false'>
                Now that you know how things work, it's better to learn how to design them.Goes faster with a higher
                guild multiplier.Requires Crafting Guild.Gives 40-80 exp to Crafting for 0-100%Unlocked at 80% Rumors
                heard and 100% Buildings Built.

                <div class='bold'>Learn skill:</div> <span>Crafting</span>
                (<span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Dex stat-color'>Dex</span>,
                <span class=' stat-Cha stat-color'>Cha</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerReadBooks'
              class='actionContainer cappableActionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Read Books</label>
              <div style='position:relative'>
                <img src='icons/readBooks.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/buyGlasses.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951536,-0.30901699437494723 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.4turn,var(--stat-Int-color) calc(0.4turn * var(--pie-ratio)),var(--stat-Soul-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.4turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                There's a library! You always loved reading.Discover new worlds and perspectives, get ideas from fiction
                characters, and empathize with the desire to be stronger.Requires glasses.Has 4x exp/talent gain, and
                can only be done <div id='trainingLimitInt'></div> times per reset.Unlocked at 50% city explored.
                <span id='goldCostReadBooks'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostReadBooks'>2,000</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>80%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultReadBooks'>400</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                There's a library! You always loved reading.Discover new worlds and perspectives, get ideas from fiction
                characters, and empathize with the desire to be stronger.Requires glasses.Has 4x exp/talent gain, and
                can only be done <div id='trainingLimitInt'></div> times per reset.Unlocked at 50% city explored.

                (<span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerBuyPickaxe'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Buy Pickaxe</label>
              <div style='position:relative'>
                <img src='icons/buyPickaxe.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951536,-0.30901699437494723 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -0.5877852522924734,-0.8090169943749473 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.5877852522924734,-0.8090169943749473 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.4turn,var(--stat-Cha-color) calc(0.4turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.45000000000000007turn - (0.05turn * var(--pie-ratio))) calc(0.45000000000000007turn + (0.05turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.5499999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.4turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Getting the pickaxe vendor to talk to you is a tricky task, but at least he'll offer it to you for 200
                gold after some convincing.Affects any action with the pickaxe icon.Can only have 1 Buy Pickaxe
                action.Unlocked at 90% City Explored.
                <span id='goldCostBuyPickaxe'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostBuyPickaxe'>3,000</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>80%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>10%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultBuyPickaxe'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Getting the pickaxe vendor to talk to you is a tricky task, but at least he'll offer it to you for 200
                gold after some convincing.Affects any action with the pickaxe icon.Can only have 1 Buy Pickaxe
                action.Unlocked at 90% City Explored.

                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerHTrial'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Heroes Trial</label>
              <div style='position:relative'>
                <img src='icons/heroesTrial.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/team.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,0,1 0.6374239897486896,-0.7705132427757893 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Str'
                    d='M0,0 L0.6374239897486896,-0.7705132427757893 A1,1 0,0,1 0.9822872507286886,-0.18738131458572474 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.9822872507286886,-0.18738131458572474 A1,1 0,0,1 0.8763066800438635,0.48175367410171543 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.8763066800438635,0.48175367410171543 A1,1 0,0,1 0.36812455268467814,0.9297764858882513 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L0.36812455268467814,0.9297764858882513 A1,1 0,0,1 -0.30901699437494773,0.9510565162951535 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L-0.30901699437494773,0.9510565162951535 A1,1 0,0,1 -0.8443279255020153,0.5358267949789963 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.8443279255020153,0.5358267949789963 A1,1 0,0,1 -0.9921147013144779,-0.12533323356430423 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9921147013144779,-0.12533323356430423 A1,1 0,0,1 -0.684547105928689,-0.7289686274214112 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L-0.684547105928689,-0.7289686274214112 A1,1 0,0,1 -0.06279051952931326,-0.9980267284282716 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.055turn,var(--stat-Dex-color) calc(0.055turn * var(--pie-ratio)),var(--stat-Str-color) calc(0.11000000000000001turn - (0.055turn * var(--pie-ratio))) calc(0.11000000000000001turn + (0.055turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.22000000000000003turn - (0.055turn * var(--pie-ratio))) calc(0.22000000000000003turn + (0.055turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.33turn - (0.055turn * var(--pie-ratio))) calc(0.33turn + (0.055turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.44turn - (0.055turn * var(--pie-ratio))) calc(0.44turn + (0.055turn * var(--pie-ratio))),var(--stat-Cha-color) calc(0.5499999999999999turn - (0.055turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.055turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.66turn - (0.055turn * var(--pie-ratio))) calc(0.66turn + (0.055turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7699999999999999turn - (0.055turn * var(--pie-ratio))) calc(0.7699999999999999turn + (0.055turn * var(--pie-ratio))),var(--stat-Soul-color) calc(0.88turn - (0.055turn * var(--pie-ratio))) calc(0.88turn + (0.055turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.055turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Gather your party to take on the trial of heroes! Progress is based on Team Combat.
                <span id='goldCostHTrial'></span>

                <div class='bold'>Combat Exp:</div>
                <span id='expGainHTrialCombat'>500</span>
                <div class='bold'>Pyromancy Exp:</div>
                <span id='expGainHTrialPyromancy'>100</span>
                <div class='bold'>Restoration Exp:</div>
                <span id='expGainHTrialRestoration'>100</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostHTrial'>100,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>11%</dd>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>11%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>11%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>11%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>11%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>11%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>11%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>11%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>11%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultHTrial'>20</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Pyromancy</div>
                <i>
                  Fireball, Fire Bolt, Fire Shield, Burning Rays, just a veritable assortment of flaming fun!
                </i>Increases self combat with 5x the efficiency of the combat skill.
                <div class='bold'>Learn skill:</div> <div class='bold underline'>Restoration</div>
                <i>
                  From healing cantrips to mass resurrection, you'll be sure to make good use of these spells.
                </i>Increases team combat with 4x the efficiency of the combat skill and improves the Heal the Sick
                action.
                <div class='bold'>Grants buff:</div> <div class='bold underline'>Heroism</div>
                <i>
                  Completing the Trial fills you with determination. Combat, Pyromancy, and Restoration Skill Exp gain
                  increased by 2% per level.
                </i>
              </div>
              <div class='showthis when-locked' draggable='false'>
                Gather your party to take on the trial of heroes! Progress is based on Team Combat.

                <div class='bold'>Learn skill:</div> <span>Pyromancy</span>
                <div class='bold'>Learn skill:</div> <span>Restoration</span>
                <div class='bold'>Grants buff:</div> <span>Heroism</span>
                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class='bold stat-Str stat-color'>Str</span>,

                <span class='bold stat-Con stat-color'>Con</span>, <span class='bold stat-Spd stat-color'>Spd</span>,

                <span class='bold stat-Per stat-color'>Per</span>, <span class='bold stat-Cha stat-color'>Cha</span>,

                <span class='bold stat-Int stat-color'>Int</span>, <span class='bold stat-Luck stat-color'>Luck</span>,

                <span class='bold stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerSurveyZ2'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Survey</label>
              <div style='position:relative'>
                <img src='icons/surveyZ2.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Per-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.3turn - (0.1turn * var(--pie-ratio))) calc(0.3turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The explorers guild has taught you how to find what most would miss. Gives max(1,floor(sqrt(average
                survey progress))) exp per action. (Currently
                <div class='surveySkill'>0</div>) Each percent surveyed gives an additional 0.5% findables in this zone
                (additive with Spatiomancy). Costs 1 map and gives 1 completed map, unless this zone's survey is at
                100%.
                <span id='goldCostSurveyZ2'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostSurveyZ2'>30,000</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>40%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultSurveyZ2'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                The explorers guild has taught you how to find what most would miss. Gives max(1,floor(sqrt(average
                survey progress))) exp per action. (Currently
                <div class='surveySkill'>0</div>) Each percent surveyed gives an additional 0.5% findables in this zone
                (additive with Spatiomancy). Costs 1 map and gives 1 completed map, unless this zone's survey is at
                100%.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Spd stat-color'>Spd</span>, <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerAssassinZ2'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Assassinate</label>
              <div style='position:relative'>
                <img src='icons/assassin.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 1.2246467991473532e-16,1 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Dex-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.25turn - (0.1turn * var(--pie-ratio))) calc(0.25turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.6499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.7999999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.7999999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Discreetly kill your mark in this town. The more well-known you are, for either good or evil, the harder
                pulling this off will be... Gives progress equal to (sqrt(practical) + thievery + assassination) *
                (1+stat/1000) * sqrt(1+completions/100) / max(1,abs(reputation)) / max(1,hearts) * base/actual cost.
                Lose max(0,250*zone-assassination) reputation, regardless of whether you were successful or not. Rewards
                a heart on successful kill.
                <span id='goldCostAssassinZ2'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostAssassinZ2'>50,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>30%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultAssassinZ2'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Discreetly kill your mark in this town. The more well-known you are, for either good or evil, the harder
                pulling this off will be... Gives progress equal to (sqrt(practical) + thievery + assassination) *
                (1+stat/1000) * sqrt(1+completions/100) / max(1,abs(reputation)) / max(1,hearts) * base/actual cost.
                Lose max(0,250*zone-assassination) reputation, regardless of whether you were successful or not. Rewards
                a heart on successful kill.

                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Per stat-color'>Per</span>, <span class=' stat-Luck stat-color'>Luck</span>,
                <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
        </div>
        <div>
          <div>
            <button
              id='containerStartTrek'
              class='travelContainer actionOrTravelContainer normalActionContainer showthat locked hidden'
              draggable='true'
            >
              <label>Start Trek</label>
              <div style='position:relative'>
                <img src='icons/startTrek.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Con' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951535,0.30901699437494756 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.35turn,var(--stat-Con-color) calc(0.35turn * var(--pie-ratio)),var(--stat-Per-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.6turn - (0.05turn * var(--pie-ratio))) calc(0.6turn + (0.05turn * var(--pie-ratio))),var(--stat-Con-color) calc(1turn - (0.35turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Begin your trek to the top of Mt. Olympus.Unlocked at 60% City Explored.
                <span id='goldCostStartTrek'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostStartTrek'>12,000</div>
                <dl>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>70%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultStartTrek'>200</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Begin your trek to the top of Mt. Olympus.Unlocked at 60% City Explored.

                (<span class='bold stat-Con stat-color'>Con</span>, <span class=' stat-Per stat-color'>Per</span>,
                <span class=' stat-Spd stat-color'>Spd</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerUnderworld'
              class='travelContainer actionOrTravelContainer normalActionContainer showthat locked hidden'
              draggable='true'
            >
              <label>Underworld</label>
              <div style='position:relative'>
                <img src='icons/underworld.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,1,1 1.2246467991473532e-16,1 Z'></path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,1,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.25turn,var(--stat-Per-color) calc(0.25turn * var(--pie-ratio)),var(--stat-Cha-color) calc(0.5turn - (0.25turn * var(--pie-ratio))) calc(0.5turn + (0.25turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.25turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Your knowledge in the explorers guild continues to open new doors. Grease the right hinges with a bit of
                gold, and who knows where you can end up. Unlocked with 50% of the world surveyed. Travels to
                Commerceville.Costs
                <span id='goldCostUnderworld'>500</span>
                gold.

                <div class='bold'>Mana Cost:</div> <div id='manaCostUnderworld'>50,000</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>50%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>50%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultUnderworld'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Your knowledge in the explorers guild continues to open new doors. Grease the right hinges with a bit of
                gold, and who knows where you can end up. Unlocked with 50% of the world surveyed. Travels to
                Commerceville.Costs gold.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class='bold stat-Cha stat-color'>Cha</span>)
              </div>
            </button>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div>
            <button
              id='containerMountain'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight'
              draggable='true'
            >
              <label>Climb Mountain</label>
              <div style='position:relative'>
                <img src='icons/climbMountain.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/buyPickaxe.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Con' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Str'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -0.5877852522924734,-0.8090169943749473 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.5877852522924734,-0.8090169943749473 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Con-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Str-color) calc(0.3turn - (0.1turn * var(--pie-ratio))) calc(0.3turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Dex-color) calc(0.6500000000000001turn - (0.05turn * var(--pie-ratio))) calc(0.6500000000000001turn + (0.05turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.75turn - (0.05turn * var(--pie-ratio))) calc(0.75turn + (0.05turn * var(--pie-ratio))),var(--stat-Con-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Traversing the mountain will be difficult, but you can use your pickaxe as a makeshift climbing pick of
                sorts to help you get around.2x progress with pickaxe.
                <span id='goldCostMountain'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostMountain'>800</div>
                <dl>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>40%</dd>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>20%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>10%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultMountain'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Traversing the mountain will be difficult, but you can use your pickaxe as a makeshift climbing pick of
                sorts to help you get around.2x progress with pickaxe.

                (<span class='bold stat-Con stat-color'>Con</span>, <span class=' stat-Str stat-color'>Str</span>,
                <span class=' stat-Per stat-color'>Per</span>, <span class=' stat-Dex stat-color'>Dex</span>,
                <span class=' stat-Spd stat-color'>Spd</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerGeysers'
              class='actionContainer cappableActionContainer actionOrTravelContainer limitedActionContainer showthat actionHighlight locked'
              draggable='true'
            >
              <label>Mana Geyser</label>
              <div style='position:relative'>
                <img src='icons/manaGeyser.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/buyPickaxe.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Str' d='M0,0 L0,-1 A1,1 0,1,1 -0.587785252292473,0.8090169943749475 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.3turn,var(--stat-Str-color) calc(0.3turn * var(--pie-ratio)),var(--stat-Per-color) calc(0.45turn - (0.15turn * var(--pie-ratio))) calc(0.45turn + (0.15turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.6499999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Str-color) calc(1turn - (0.3turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Search the ground for weak points in the hopes of revealing massive mana geysers.Spots with geysers have
                5000 mana.Every 100 weak points has a mana geyser.Requires pickaxe.
                <span id='goldCostGeysers'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostGeysers'>2,000</div>
                <dl>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>60%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>30%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultGeysers'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Search the ground for weak points in the hopes of revealing massive mana geysers.Spots with geysers have
                5000 mana.Every 100 weak points has a mana geyser.Requires pickaxe.

                (<span class='bold stat-Str stat-color'>Str</span>, <span class=' stat-Per stat-color'>Per</span>,
                <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerRunes'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Decipher Runes</label>
              <div style='position:relative'>
                <img src='icons/decipherRunes.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/buyGlasses.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951535,0.30901699437494756 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.35turn,var(--stat-Int-color) calc(0.35turn * var(--pie-ratio)),var(--stat-Per-color) calc(0.5turn - (0.15turn * var(--pie-ratio))) calc(0.5turn + (0.15turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.35turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                There are many different runic markings on weathered headstones around the mountain, perhaps you can
                glean some sort of knowledge from them.Reduces mana cost of Chronomancy and Pyromancy by 0.5% per 1% of
                Glyphs Deciphered.2x progress with glasses.Unlocked at 20% Mountain Explored.
                <span id='goldCostRunes'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostRunes'>1,200</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>70%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>30%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultRunes'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                There are many different runic markings on weathered headstones around the mountain, perhaps you can
                glean some sort of knowledge from them.Reduces mana cost of Chronomancy and Pyromancy by 0.5% per 1% of
                Glyphs Deciphered.2x progress with glasses.Unlocked at 20% Mountain Explored.

                (<span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Per stat-color'>Per</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerChronomancy'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Chronomancy</label>
              <div style='position:relative'>
                <img src='icons/chronomancy.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,1,1 -0.587785252292473,0.8090169943749475 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.3turn,var(--stat-Int-color) calc(0.3turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.45turn - (0.15turn * var(--pie-ratio))) calc(0.45turn + (0.15turn * var(--pie-ratio))),var(--stat-Soul-color) calc(0.6499999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.3turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Controlling time seems like it would be a great idea, and thankfully for you, the runes around here
                contain lots of information on the art of Chronomancy.Unlocked with both 30% Runic Symbols Deciphered
                and 150 Magic.
                <span id='goldCostChronomancy'></span>

                <div class='bold'>Chronomancy Exp:</div>
                <span id='expGainChronomancyChronomancy'>100</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostChronomancy'>10,000</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>60%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>30%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultChronomancy'>200</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Chronomancy</div>
                <i>Harness the magic of time to, well, speed up time.</i>Actions in all zones are (1 + level / 60) ^
                0.25 times faster.
              </div>
              <div class='showthis when-locked' draggable='false'>
                Controlling time seems like it would be a great idea, and thankfully for you, the runes around here
                contain lots of information on the art of Chronomancy.Unlocked with both 30% Runic Symbols Deciphered
                and 150 Magic.

                <div class='bold'>Learn skill:</div> <span>Chronomancy</span>
                (<span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerLoopingPotion'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Looping Potion</label>
              <div style='position:relative'>
                <img src='icons/loopingPotion.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951535,0.30901699437494756 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.35turn,var(--stat-Int-color) calc(0.35turn * var(--pie-ratio)),var(--stat-Dex-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Soul-color) calc(0.6turn - (0.05turn * var(--pie-ratio))) calc(0.6turn + (0.05turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.35turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Using your aptitude of alchemy and your talent for time, you've managed to recreate the very potion that
                got you into this whole mess! It can't cure you, but maybe you can find another use for it. Costs 400
                herbs. You can only have one looping potion at a time. Unlocked with 200 Alchemy.
                <span id='goldCostLoopingPotion'></span>

                <div class='bold'>Alchemy Exp:</div>
                <span id='expGainLoopingPotionAlchemy'>100</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostLoopingPotion'>30,000</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>70%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>20%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultLoopingPotion'>200</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Using your aptitude of alchemy and your talent for time, you've managed to recreate the very potion that
                got you into this whole mess! It can't cure you, but maybe you can find another use for it. Costs 400
                herbs. You can only have one looping potion at a time. Unlocked with 200 Alchemy.

                (<span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Dex stat-color'>Dex</span>,
                <span class=' stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerPyromancy'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Pyromancy</label>
              <div style='position:relative'>
                <img src='icons/pyromancy.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951535,0.30901699437494756 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.35turn,var(--stat-Int-color) calc(0.35turn * var(--pie-ratio)),var(--stat-Per-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Soul-color) calc(0.6turn - (0.05turn * var(--pie-ratio))) calc(0.6turn + (0.05turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.35turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Conjure the power of feverishly forceful and furiously fiery flickering flames to aid you in combat. And
                yeah, the runes contain some stuff about this too. Unlocked with both 60% Runic Symbols Deciphered and
                200 Magic.
                <span id='goldCostPyromancy'></span>

                <div class='bold'>Pyromancy Exp:</div>
                <span id='expGainPyromancyPyromancy'>100</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostPyromancy'>14,000</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>70%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultPyromancy'>200</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Pyromancy</div>
                <i>
                  Fireball, Fire Bolt, Fire Shield, Burning Rays, just a veritable assortment of flaming fun!
                </i>Increases self combat with 5x the efficiency of the combat skill.
              </div>
              <div class='showthis when-locked' draggable='false'>
                Conjure the power of feverishly forceful and furiously fiery flickering flames to aid you in combat. And
                yeah, the runes contain some stuff about this too. Unlocked with both 60% Runic Symbols Deciphered and
                200 Magic.

                <div class='bold'>Learn skill:</div> <span>Pyromancy</span>
                (<span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Per stat-color'>Per</span>,
                <span class=' stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerCavern'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Explore Cavern</label>
              <div style='position:relative'>
                <img src='icons/exploreCavern.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Str' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 -0.587785252292473,0.8090169943749475 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -0.5877852522924734,-0.8090169943749473 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.5877852522924734,-0.8090169943749473 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Str-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Per-color) calc(0.29999999999999993turn - (0.15turn * var(--pie-ratio))) calc(0.29999999999999993turn + (0.15turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.5499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Dex-color) calc(0.7000000000000001turn - (0.05turn * var(--pie-ratio))) calc(0.7000000000000001turn + (0.05turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.7999999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.7999999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Str-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Explore the expansive and twisting cavern beneath the mountain, who knows what wonders (or terrors)
                you'll find down there.Unlocked at 40% Mountain Explored.
                <span id='goldCostCavern'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostCavern'>1,500</div>
                <dl>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>30%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>30%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>10%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultCavern'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Explore the expansive and twisting cavern beneath the mountain, who knows what wonders (or terrors)
                you'll find down there.Unlocked at 40% Mountain Explored.

                (<span class='bold stat-Str stat-color'>Str</span>, <span class='bold stat-Per stat-color'>Per</span>,

                <span class=' stat-Con stat-color'>Con</span>, <span class=' stat-Dex stat-color'>Dex</span>,
                <span class=' stat-Spd stat-color'>Spd</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerMineSoulstones'
              class='actionContainer cappableActionContainer actionOrTravelContainer limitedActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Mine Soulstone</label>
              <div style='position:relative'>
                <img src='icons/mineSoulstones.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/buyPickaxe.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Str' d='M0,0 L0,-1 A1,1 0,1,1 -0.587785252292473,0.8090169943749475 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.3turn,var(--stat-Str-color) calc(0.3turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.45turn - (0.15turn * var(--pie-ratio))) calc(0.45turn + (0.15turn * var(--pie-ratio))),var(--stat-Dex-color) calc(0.6499999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Str-color) calc(1turn - (0.3turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Extract soulstones lodged in the walls of the tunnels in the massive underground cavern.Every 10 shiny
                spots has a soulstone.Requires pickaxe.Unlocked with 20% Cavern Explored.
                <span id='goldCostMineSoulstones'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostMineSoulstones'>5,000</div>
                <dl>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>60%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>30%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultMineSoulstones'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Extract soulstones lodged in the walls of the tunnels in the massive underground cavern.Every 10 shiny
                spots has a soulstone.Requires pickaxe.Unlocked with 20% Cavern Explored.

                (<span class='bold stat-Str stat-color'>Str</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Dex stat-color'>Dex</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerHuntTrolls'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Hunt Trolls</label>
              <div style='position:relative'>
                <img src='icons/huntTrolls.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Str'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 -0.587785252292473,0.8090169943749475 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -0.5877852522924734,-0.8090169943749473 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.5877852522924734,-0.8090169943749473 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Dex-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Str-color) calc(0.29999999999999993turn - (0.15turn * var(--pie-ratio))) calc(0.29999999999999993turn + (0.15turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.5499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.7000000000000001turn - (0.05turn * var(--pie-ratio))) calc(0.7000000000000001turn + (0.05turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.7999999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.7999999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The cavern is teeming with trolls, but thankfully they appear to be friendly from the encounters you've
                had with them. However, you could do with some troll's blood.Gives (self combat) * (1 + main stat / 100)
                * sqrt(1 + times completed / 100) * (original mana cost / actual mana cost) progress points per
                mana.Unlocked with 50% Cavern Explored.Gives Combat exp per troll kill, rather than upon action
                completion.
                <span id='goldCostHuntTrolls'></span>

                <div class='bold'>Combat Exp:</div>
                <span id='expGainHuntTrollsCombat'>1000</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostHuntTrolls'>8,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>30%</dd>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>30%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>10%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultHuntTrolls'>150</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                The cavern is teeming with trolls, but thankfully they appear to be friendly from the encounters you've
                had with them. However, you could do with some troll's blood.Gives (self combat) * (1 + main stat / 100)
                * sqrt(1 + times completed / 100) * (original mana cost / actual mana cost) progress points per
                mana.Unlocked with 50% Cavern Explored.Gives Combat exp per troll kill, rather than upon action
                completion.

                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class='bold stat-Str stat-color'>Str</span>,

                <span class=' stat-Con stat-color'>Con</span>, <span class=' stat-Per stat-color'>Per</span>,
                <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerIllusions'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Check Walls</label>
              <div style='position:relative'>
                <img src='icons/checkWalls.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -0.5877852522924734,-0.8090169943749473 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.5877852522924734,-0.8090169943749473 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Per-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Int-color) calc(0.4000000000000001turn - (0.2turn * var(--pie-ratio))) calc(0.4000000000000001turn + (0.2turn * var(--pie-ratio))),var(--stat-Dex-color) calc(0.6500000000000001turn - (0.05turn * var(--pie-ratio))) calc(0.6500000000000001turn + (0.05turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.75turn - (0.05turn * var(--pie-ratio))) calc(0.75turn + (0.05turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Now that you know the ins and outs of the cavern, you start to notice certain spots of the walls that
                are illusory! There seems to be all manner of goodies hidden behind them.Unlocked with 80% Cavern
                Explored.
                <span id='goldCostIllusions'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostIllusions'>3,000</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>40%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>40%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>10%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultIllusions'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Now that you know the ins and outs of the cavern, you start to notice certain spots of the walls that
                are illusory! There seems to be all manner of goodies hidden behind them.Unlocked with 80% Cavern
                Explored.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class='bold stat-Int stat-color'>Int</span>,

                <span class=' stat-Dex stat-color'>Dex</span>, <span class=' stat-Spd stat-color'>Spd</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerArtifacts'
              class='actionContainer cappableActionContainer actionOrTravelContainer limitedActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Take Artifacts</label>
              <div style='position:relative'>
                <img src='icons/takeArtifacts.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,1,1 -0.587785252292473,0.8090169943749475 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.3turn,var(--stat-Per-color) calc(0.3turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.39999999999999997turn - (0.1turn * var(--pie-ratio))) calc(0.39999999999999997turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.6000000000000001turn - (0.1turn * var(--pie-ratio))) calc(0.6000000000000001turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.3turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Behind some of the illusory walls, there are various sorts of artifacts that seem to belong to some sort
                of ancient civilization. Or at least that's what you'll say if anybody comes looking for them.Every 25
                alcoves has an artifact.Unlocked with 5% Illusory Walls Discovered.
                <span id='goldCostArtifacts'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostArtifacts'>1,500</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>60%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultArtifacts'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Behind some of the illusory walls, there are various sorts of artifacts that seem to belong to some sort
                of ancient civilization. Or at least that's what you'll say if anybody comes looking for them.Every 25
                alcoves has an artifact.Unlocked with 5% Illusory Walls Discovered.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerImbueMind'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Imbue Mind</label>
              <div style='position:relative'>
                <img src='icons/imbueMind.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951536,-0.30901699437494723 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -0.5877852522924734,-0.8090169943749473 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.5877852522924734,-0.8090169943749473 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.4turn,var(--stat-Int-color) calc(0.4turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.45000000000000007turn - (0.05turn * var(--pie-ratio))) calc(0.45000000000000007turn + (0.05turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.5499999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.4turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Deep behind one of the many illusory walls, you've found a small glowing lake full of some sort of
                liquid. Your soulstones seem to glow when they get close to it. You appear to be able to use them as a
                link to your mind, but the process requires a very large amount of mana and will destroy them once it's
                complete. Each imbuement will increase the training limit by 1.Gives (magic skill) * (1 + main stat /
                100) * (original mana cost / actual mana cost) progress points per mana.Can only have 1 Imbue Mind
                action.Unlocked with both 70% Illusory Walls Discovered and 300 Magic.Sacrifices (20 * (imbuements+1))
                soulstones. Currently sacrificing
                <span id='goldCostImbueMind'>20</span>

                soulstones.

                <div class='bold'>Mana Cost:</div> <div id='manaCostImbueMind'>500,000</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>80%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>10%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultImbueMind'>500</div>%

                <div class='bold'>Grants buff:</div> <div class='bold underline'>Imbue Mind</div>
                <i>
                  Using power from soulstones, you can increase your mental prowess. Increases the max amount of times
                  you can do each stat training action by 1 per level.
                </i>
              </div>
              <div class='showthis when-locked' draggable='false'>
                Deep behind one of the many illusory walls, you've found a small glowing lake full of some sort of
                liquid. Your soulstones seem to glow when they get close to it. You appear to be able to use them as a
                link to your mind, but the process requires a very large amount of mana and will destroy them once it's
                complete. Each imbuement will increase the training limit by 1.Gives (magic skill) * (1 + main stat /
                100) * (original mana cost / actual mana cost) progress points per mana.Can only have 1 Imbue Mind
                action.Unlocked with both 70% Illusory Walls Discovered and 300 Magic.Sacrifices (20 * (imbuements+1))
                soulstones. Currently sacrificing

                soulstones.

                <div class='bold'>Grants buff:</div> <span>Imbue Mind</span>
                (<span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Per stat-color'>Per</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerImbueBody'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Imbue Body</label>
              <div style='position:relative'>
                <img src='icons/imbueBody.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Con' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951536,-0.30901699437494723 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -0.5877852522924734,-0.8090169943749473 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Str'
                    d='M0,0 L-0.5877852522924734,-0.8090169943749473 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.4turn,var(--stat-Con-color) calc(0.4turn * var(--pie-ratio)),var(--stat-Dex-color) calc(0.45000000000000007turn - (0.05turn * var(--pie-ratio))) calc(0.45000000000000007turn + (0.05turn * var(--pie-ratio))),var(--stat-Str-color) calc(0.5499999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Con-color) calc(1turn - (0.4turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                With your new knowledge, you believe you can also use the lake to reinforce your body across time. Each
                imbuement will increase starting stats by 1.Gives (magic skill) * (1 + main stat / 100) * (original mana
                cost / actual mana cost) progress points per mana.Can only have 1 Imbue Body action.Level is limited by
                imbue mind rank.Sacrifices (imbuements+1) levels of talent. Currently sacrificing
                <span id='goldCostImbueBody'>1</span>

                levels of talent from each stat.

                <div class='bold'>Mana Cost:</div> <div id='manaCostImbueBody'>500,000</div>
                <dl>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>80%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>10%</dd>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultImbueBody'>500</div>%

                <div class='bold'>Grants buff:</div> <div class='bold underline'>Imbue Body</div>
                <i>
                  By sacrificing your accumulated talent, you can permanently improve yourself. At the start of a new
                  loop, all stats begin at Imbue Body level.
                </i>
              </div>
              <div class='showthis when-locked' draggable='false'>
                With your new knowledge, you believe you can also use the lake to reinforce your body across time. Each
                imbuement will increase starting stats by 1.Gives (magic skill) * (1 + main stat / 100) * (original mana
                cost / actual mana cost) progress points per mana.Can only have 1 Imbue Body action.Level is limited by
                imbue mind rank.Sacrifices (imbuements+1) levels of talent. Currently sacrificing

                levels of talent from each stat.

                <div class='bold'>Grants buff:</div> <span>Imbue Body</span>
                (<span class='bold stat-Con stat-color'>Con</span>, <span class=' stat-Dex stat-color'>Dex</span>,
                <span class=' stat-Str stat-color'>Str</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerSurveyZ3'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Survey</label>
              <div style='position:relative'>
                <img src='icons/surveyZ3.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Per-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.3turn - (0.1turn * var(--pie-ratio))) calc(0.3turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The explorers guild has taught you how to find what most would miss. Gives max(1,floor(sqrt(average
                survey progress))) exp per action. (Currently
                <div class='surveySkill'>0</div>) Each percent surveyed gives an additional 0.5% findables in this zone
                (additive with Spatiomancy). Costs 1 map and gives 1 completed map, unless this zone's survey is at
                100%.
                <span id='goldCostSurveyZ3'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostSurveyZ3'>40,000</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>40%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultSurveyZ3'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                The explorers guild has taught you how to find what most would miss. Gives max(1,floor(sqrt(average
                survey progress))) exp per action. (Currently
                <div class='surveySkill'>0</div>) Each percent surveyed gives an additional 0.5% findables in this zone
                (additive with Spatiomancy). Costs 1 map and gives 1 completed map, unless this zone's survey is at
                100%.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Spd stat-color'>Spd</span>, <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerRuinsZ3'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Ruins</label>
              <div style='position:relative'>
                <img src='icons/ruinsZ3.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/surveyZ1.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Per-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.3turn - (0.1turn * var(--pie-ratio))) calc(0.3turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                As you explore, you find ruins scattered around the Mountain. You better explore them, who knows what
                useful secrets they hide.
                <span id='goldCostRuinsZ3'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostRuinsZ3'>100,000</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>40%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultRuinsZ3'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                As you explore, you find ruins scattered around the Mountain. You better explore them, who knows what
                useful secrets they hide.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Spd stat-color'>Spd</span>, <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerStonesZ3'
              class='actionContainer actionOrTravelContainer limitedActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Haul</label>
              <div style='position:relative'>
                <img src='icons/haulZ3.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/surveyZ1.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Con' d='M0,0 L0,-1 A1,1 0,1,1 -0.587785252292473,0.8090169943749475 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Str'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.3turn,var(--stat-Con-color) calc(0.3turn * var(--pie-ratio)),var(--stat-Str-color) calc(0.5turn - (0.2turn * var(--pie-ratio))) calc(0.5turn + (0.2turn * var(--pie-ratio))),var(--stat-Con-color) calc(1turn - (0.3turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Among the ruins on Mount Olympus, you find several large stones that appear mundane at first, but which
                seem unaffected by the time loops you're stuck in. Not many, and finding the ones with this trait will
                take some serious work. You're sure you can use them for something, but they're too heavy to move more
                than one at a time. One in every one thousand Stones is Temporal. Action fails if you have a Temporal
                Stone.
                <span id='goldCostStonesZ3'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostStonesZ3'>50,000</div>
                <dl>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>60%</dd>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>40%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultStonesZ3'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Among the ruins on Mount Olympus, you find several large stones that appear mundane at first, but which
                seem unaffected by the time loops you're stuck in. Not many, and finding the ones with this trait will
                take some serious work. You're sure you can use them for something, but they're too heavy to move more
                than one at a time. One in every one thousand Stones is Temporal. Action fails if you have a Temporal
                Stone.

                (<span class='bold stat-Con stat-color'>Con</span>, <span class=' stat-Str stat-color'>Str</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerAssassinZ3'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Assassinate</label>
              <div style='position:relative'>
                <img src='icons/assassin.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 1.2246467991473532e-16,1 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Dex-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.25turn - (0.1turn * var(--pie-ratio))) calc(0.25turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.6499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.7999999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.7999999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Discreetly kill your mark in this town. The more well-known you are, for either good or evil, the harder
                pulling this off will be... Gives progress equal to (sqrt(practical) + thievery + assassination) *
                (1+stat/1000) * sqrt(1+completions/100) / max(1,abs(reputation)) / max(1,hearts) * base/actual cost.
                Lose max(0,250*zone-assassination) reputation, regardless of whether you were successful or not. Rewards
                a heart on successful kill.
                <span id='goldCostAssassinZ3'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostAssassinZ3'>50,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>30%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultAssassinZ3'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Discreetly kill your mark in this town. The more well-known you are, for either good or evil, the harder
                pulling this off will be... Gives progress equal to (sqrt(practical) + thievery + assassination) *
                (1+stat/1000) * sqrt(1+completions/100) / max(1,abs(reputation)) / max(1,hearts) * base/actual cost.
                Lose max(0,250*zone-assassination) reputation, regardless of whether you were successful or not. Rewards
                a heart on successful kill.

                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Per stat-color'>Per</span>, <span class=' stat-Luck stat-color'>Luck</span>,
                <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
        </div>
        <div>
          <div>
            <button
              id='containerFaceJudgement'
              class='travelContainer actionOrTravelContainer normalActionContainer showthat locked hidden'
              draggable='true'
            >
              <label>Face Judgement</label>
              <div style='position:relative'>
                <img src='icons/faceJudgement.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Soul' d='M0,0 L0,-1 A1,1 0,1,1 1.2246467991473532e-16,1 Z'></path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.25turn,var(--stat-Soul-color) calc(0.25turn * var(--pie-ratio)),var(--stat-Cha-color) calc(0.4turn - (0.15turn * var(--pie-ratio))) calc(0.4turn + (0.15turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.65turn - (0.1turn * var(--pie-ratio))) calc(0.65turn + (0.1turn * var(--pie-ratio))),var(--stat-Soul-color) calc(1turn - (0.25turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Face the judgement of the gods. If your reputation is 50 or above, you'll be accepted into their good
                graces and granted passage to Valhalla. If your reputation is -50 or below, you'll be cast into the
                shadow realm.(If neither, nothing happens.)Unlocked at 100% Mountain Explored.
                <span id='goldCostFaceJudgement'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostFaceJudgement'>30,000</div>
                <dl>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>50%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>30%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultFaceJudgement'>200</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Face the judgement of the gods. If your reputation is 50 or above, you'll be accepted into their good
                graces and granted passage to Valhalla. If your reputation is -50 or below, you'll be cast into the
                shadow realm.(If neither, nothing happens.)Unlocked at 100% Mountain Explored.

                (<span class='bold stat-Soul stat-color'>Soul</span>, <span class=' stat-Cha stat-color'>Cha</span>,

                <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerGuru'
              class='travelContainer actionOrTravelContainer normalActionContainer showthat locked hidden'
              draggable='true'
            >
              <label>Guru</label>
              <div style='position:relative'>
                <img src='icons/guru.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,1,1 1.2246467991473532e-16,1 Z'></path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,1,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.25turn,var(--stat-Cha-color) calc(0.25turn * var(--pie-ratio)),var(--stat-Soul-color) calc(0.5turn - (0.25turn * var(--pie-ratio))) calc(0.5turn + (0.25turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.25turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The greatest explorer the guild has ever known was said to have found a path without judgement to
                Valhalla itself. Now, as his equal, he is willing to show you the way if you bring him a few herbs.
                Unlocked with 100% of the world surveyed. Travels to Valhalla, bypassing Face Judgement and Reputation
                requirements. Requires 1000 herbs.
                <span id='goldCostGuru'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostGuru'>100,000</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>50%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>50%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultGuru'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                The greatest explorer the guild has ever known was said to have found a path without judgement to
                Valhalla itself. Now, as his equal, he is willing to show you the way if you bring him a few herbs.
                Unlocked with 100% of the world surveyed. Travels to Valhalla, bypassing Face Judgement and Reputation
                requirements. Requires 1000 herbs.

                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class='bold stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div>
            <button
              id='containerTour'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight'
              draggable='true'
            >
              <label>Guided Tour</label>
              <div style='position:relative'>
                <img src='icons/guidedTour.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/buyGlasses.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 -0.587785252292473,0.8090169943749475 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -0.5877852522924734,-0.8090169943749473 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.5877852522924734,-0.8090169943749473 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Per-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Cha-color) calc(0.29999999999999993turn - (0.15turn * var(--pie-ratio))) calc(0.29999999999999993turn + (0.15turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.5499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.7000000000000001turn - (0.05turn * var(--pie-ratio))) calc(0.7000000000000001turn + (0.05turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7999999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.7999999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The city doesn't take too kindly to visitors snooping around, so you'll have to take all their tours to
                scope it out instead.Costs 10 gold.2x progress with glasses.
                <span id='goldCostTour'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostTour'>2,500</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>30%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>30%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>10%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultTour'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                The city doesn't take too kindly to visitors snooping around, so you'll have to take all their tours to
                scope it out instead.Costs 10 gold.2x progress with glasses.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class='bold stat-Cha stat-color'>Cha</span>,

                <span class=' stat-Con stat-color'>Con</span>, <span class=' stat-Int stat-color'>Int</span>,
                <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerCanvassed'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked'
              draggable='true'
            >
              <label>Canvass</label>
              <div style='position:relative'>
                <img src='icons/canvass.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,1,1 1.2246467991473532e-16,1 Z'></path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.25turn,var(--stat-Cha-color) calc(0.25turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.35turn - (0.1turn * var(--pie-ratio))) calc(0.35turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.5499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.7turn - (0.05turn * var(--pie-ratio))) calc(0.7turn + (0.05turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.25turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The city has a local charity that's looking for volunteers to canvass around for potential benefactors.
                Maybe if you know the information of some of said people, it could be helpful.Unlocked at 10% of city
                toured.
                <span id='goldCostCanvassed'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostCanvassed'>4,000</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>50%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultCanvassed'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                The city has a local charity that's looking for volunteers to canvass around for potential benefactors.
                Maybe if you know the information of some of said people, it could be helpful.Unlocked at 10% of city
                toured.

                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Luck stat-color'>Luck</span>, <span class=' stat-Con stat-color'>Con</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerDonate'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked'
              draggable='true'
            >
              <label>Donate</label>
              <div style='position:relative'>
                <img src='icons/donate.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Int-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.3turn - (0.1turn * var(--pie-ratio))) calc(0.3turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Cha-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                You can donate to the charity yourself if you'd like.Costs 20 gold.Gives 1 reputation.Unlocked at 5% of
                houses canvassed.
                <span id='goldCostDonate'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostDonate'>2,000</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>40%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultDonate'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                You can donate to the charity yourself if you'd like.Costs 20 gold.Gives 1 reputation.Unlocked at 5% of
                houses canvassed.

                (<span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Per stat-color'>Per</span>, <span class=' stat-Cha stat-color'>Cha</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerDonations'
              class='actionContainer cappableActionContainer actionOrTravelContainer limitedActionContainer showthat actionHighlight locked'
              draggable='true'
            >
              <label>Collect Donation</label>
              <div style='position:relative'>
                <img src='icons/acceptDonations.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Luck' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Luck-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.35000000000000003turn - (0.15turn * var(--pie-ratio))) calc(0.35000000000000003turn + (0.15turn * var(--pie-ratio))),var(--stat-Cha-color) calc(0.5999999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.5999999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.75turn - (0.05turn * var(--pie-ratio))) calc(0.75turn + (0.05turn * var(--pie-ratio))),var(--stat-Luck-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                After doing some canvassing for the local charity, you're now able to accept some donations on their
                behalf, since you know the routine.Costs 1 reputation.Requires a reputation above 0.Meaningful donations
                are worth 20 gold each.Every 5 donations is worth a meaningful amount.Unlocked at 5% of houses
                canvassed.
                <span id='goldCostDonations'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostDonations'>2,000</div>
                <dl>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>40%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>30%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>20%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultDonations'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                After doing some canvassing for the local charity, you're now able to accept some donations on their
                behalf, since you know the routine.Costs 1 reputation.Requires a reputation above 0.Meaningful donations
                are worth 20 gold each.Every 5 donations is worth a meaningful amount.Unlocked at 5% of houses
                canvassed.

                (<span class='bold stat-Luck stat-color'>Luck</span>, <span class=' stat-Spd stat-color'>Spd</span>,

                <span class=' stat-Cha stat-color'>Cha</span>, <span class=' stat-Con stat-color'>Con</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerTidy'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Tidy Up</label>
              <div style='position:relative'>
                <img src='icons/tidyUp.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 -0.587785252292473,0.8090169943749475 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Str'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Dex-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.29999999999999993turn - (0.15turn * var(--pie-ratio))) calc(0.29999999999999993turn + (0.15turn * var(--pie-ratio))),var(--stat-Str-color) calc(0.5499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.75turn - (0.1turn * var(--pie-ratio))) calc(0.75turn + (0.1turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Tidy up the place.Gives (Practical Magic) * (1 + main stat / 100) * sqrt(1 + times completed / 100) *
                (original mana cost / actual mana cost) progress points per mana.Gives 5 gold and 1 reputation per mess
                cleaned.Unlocked at 30% of houses canvassed.
                <span id='goldCostTidy'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostTidy'>10,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>30%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>30%</dd>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>20%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultTidy'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Tidy up the place.Gives (Practical Magic) * (1 + main stat / 100) * sqrt(1 + times completed / 100) *
                (original mana cost / actual mana cost) progress points per mana.Gives 5 gold and 1 reputation per mess
                cleaned.Unlocked at 30% of houses canvassed.

                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class='bold stat-Spd stat-color'>Spd</span>,

                <span class=' stat-Str stat-color'>Str</span>, <span class=' stat-Con stat-color'>Con</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerBuyManaZ5'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight'
              draggable='true'
            >
              <label>Buy Mana</label>
              <div style='position:relative'>
                <img src='icons/buyManaZ5.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951535,0.30901699437494756 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.35turn,var(--stat-Cha-color) calc(0.35turn * var(--pie-ratio)),var(--stat-Int-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.6turn - (0.05turn * var(--pie-ratio))) calc(0.6turn + (0.05turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.35turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                1 gold =
                <span id='goldCostBuyManaZ5'>50</span>

                mana. Buys all the mana you can.

                <div class='bold'>Mana Cost:</div> <div id='manaCostBuyManaZ5'>100</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>70%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultBuyManaZ5'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                1 gold =

                mana. Buys all the mana you can.

                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class=' stat-Int stat-color'>Int</span>,
                <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerSellArtifact'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Sell Artifact</label>
              <div style='position:relative'>
                <img src='icons/sellArtifact.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Cha-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Per-color) calc(0.35000000000000003turn - (0.15turn * var(--pie-ratio))) calc(0.35000000000000003turn + (0.15turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.5999999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.5999999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Soul-color) calc(0.75turn - (0.05turn * var(--pie-ratio))) calc(0.75turn + (0.05turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Sell one of the artifacts you found on Mt. Olympus as a priceless ancient heirloom.Costs one
                artifact.Gives 50 gold.Unlocked at 20% of city toured.
                <span id='goldCostSellArtifact'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostSellArtifact'>500</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>40%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>30%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultSellArtifact'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Sell one of the artifacts you found on Mt. Olympus as a priceless ancient heirloom.Costs one
                artifact.Gives 50 gold.Unlocked at 20% of city toured.

                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class=' stat-Per stat-color'>Per</span>,
                <span class=' stat-Luck stat-color'>Luck</span>, <span class=' stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerGiftArtifact'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Donate Artifact</label>
              <div style='position:relative'>
                <img src='icons/giftArtifact.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,1,1 -0.587785252292473,0.8090169943749475 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.3turn,var(--stat-Cha-color) calc(0.3turn * var(--pie-ratio)),var(--stat-Luck-color) calc(0.45turn - (0.15turn * var(--pie-ratio))) calc(0.45turn + (0.15turn * var(--pie-ratio))),var(--stat-Soul-color) calc(0.6499999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.3turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Donate a precious artifact to the museum of heroes. It's okay - with each act of generosity you earn
                friends in high places.Costs one artifact.Gives one favor.Unlocked at 20% of city toured.
                <span id='goldCostGiftArtifact'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostGiftArtifact'>500</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>60%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>30%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultGiftArtifact'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Donate a precious artifact to the museum of heroes. It's okay - with each act of generosity you earn
                friends in high places.Costs one artifact.Gives one favor.Unlocked at 20% of city toured.

                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class=' stat-Luck stat-color'>Luck</span>,

                <span class=' stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerMercantilism'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Mercantilism</label>
              <div style='position:relative'>
                <img src='icons/mercantilism.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951535,0.30901699437494756 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.35turn,var(--stat-Int-color) calc(0.35turn * var(--pie-ratio)),var(--stat-Per-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Soul-color) calc(0.6turn - (0.05turn * var(--pie-ratio))) calc(0.6turn + (0.05turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.35turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Practice your mercantile skills, which are sorely lacking considering how poor of a deal you're getting
                from those mana merchants.Costs 1 reputation.Requires positive reputation.Unlocked at 30% of city
                toured.
                <span id='goldCostMercantilism'></span>

                <div class='bold'>Mercantilism Exp:</div>
                <span id='expGainMercantilismMercantilism'>100</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostMercantilism'>10,000</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>70%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultMercantilism'>100</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Mercantilism</div>
                <i>Smooth talk your way to better rates with the mana merchants.</i>Multiply the mana gain from Buy Mana
                by (1 + level / 60) ^ 0.25 (rounds down).
              </div>
              <div class='showthis when-locked' draggable='false'>
                Practice your mercantile skills, which are sorely lacking considering how poor of a deal you're getting
                from those mana merchants.Costs 1 reputation.Requires positive reputation.Unlocked at 30% of city
                toured.

                <div class='bold'>Learn skill:</div> <span>Mercantilism</span>
                (<span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Per stat-color'>Per</span>,
                <span class=' stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerCharmSchool'
              class='actionContainer cappableActionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Charm School</label>
              <div style='position:relative'>
                <img src='icons/charmSchool.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951536,-0.30901699437494723 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.4turn,var(--stat-Cha-color) calc(0.4turn * var(--pie-ratio)),var(--stat-Int-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.4turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Learn to make people love you!Has 4x exp/talent gain, and can only be done
                <div id='trainingLimitCha'></div> times per reset.Unlocked at 30% of city toured.
                <span id='goldCostCharmSchool'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostCharmSchool'>2,000</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>80%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultCharmSchool'>400</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Learn to make people love you!Has 4x exp/talent gain, and can only be done
                <div id='trainingLimitCha'></div> times per reset.Unlocked at 30% of city toured.

                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerOracle'
              class='actionContainer cappableActionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Oracle</label>
              <div style='position:relative'>
                <img src='icons/oracle.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.4turn,var(--stat-Luck-color) calc(0.4turn * var(--pie-ratio)),var(--stat-Soul-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(1turn - (0.4turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Peer into the future to better your fortune!Has 4x exp/talent gain, and can only be done
                <div id='trainingLimitLuck'></div> times per reset.Unlocked at 40% of city toured.
                <span id='goldCostOracle'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostOracle'>2,000</div>
                <dl>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>80%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultOracle'>400</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Peer into the future to better your fortune!Has 4x exp/talent gain, and can only be done
                <div id='trainingLimitLuck'></div> times per reset.Unlocked at 40% of city toured.

                (<span class='bold stat-Luck stat-color'>Luck</span>, <span class=' stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerEnchantArmor'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Enchant Armor</label>
              <div style='position:relative'>
                <img src='icons/enchantArmor.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,1,1 -0.587785252292473,0.8090169943749475 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.3turn,var(--stat-Cha-color) calc(0.3turn * var(--pie-ratio)),var(--stat-Int-color) calc(0.39999999999999997turn - (0.1turn * var(--pie-ratio))) calc(0.39999999999999997turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.6000000000000001turn - (0.1turn * var(--pie-ratio))) calc(0.6000000000000001turn + (0.1turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.3turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Pull some strings to convince a divine blacksmith to enchant your armor.Costs one favor and one
                armor.Gives one enchanted armor.Enchanted armor is three times as effective as normal armor.Unlocked at
                40% of city toured.
                <span id='goldCostEnchantArmor'></span>

                <div class='bold'>Crafting Exp:</div>
                <span id='expGainEnchantArmorCrafting'>50</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostEnchantArmor'>1,000</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>60%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultEnchantArmor'>100</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Crafting</div>
                <i>The skill of using your hands and creativity when doing physical work.</i>
              </div>
              <div class='showthis when-locked' draggable='false'>
                Pull some strings to convince a divine blacksmith to enchant your armor.Costs one favor and one
                armor.Gives one enchanted armor.Enchanted armor is three times as effective as normal armor.Unlocked at
                40% of city toured.

                <div class='bold'>Learn skill:</div> <span>Crafting</span>
                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class=' stat-Int stat-color'>Int</span>,
                <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerwizCollege'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Wizard College</label>
              <div style='position:relative'>
                <img src='icons/wizardCollege.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,1,1 1.2246467991473532e-16,1 Z'></path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.25turn,var(--stat-Int-color) calc(0.25turn * var(--pie-ratio)),var(--stat-Soul-color) calc(0.4turn - (0.15turn * var(--pie-ratio))) calc(0.4turn + (0.15turn * var(--pie-ratio))),var(--stat-Cha-color) calc(0.65turn - (0.1turn * var(--pie-ratio))) calc(0.65turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.25turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The wizard college is the finest school in all the realms. You're lucky to be afforded a chance to get
                in, although it will cost you a small fortune in tuition.Take their tests and get a grade!Can only have
                1 Wizard College action.Costs 500 gold and 10 favors.Gives (all schools of magic skills) * (1 + main
                stat / 100) * sqrt(1 + times completed / 1000) * (original mana cost / actual mana cost) progress points
                per mana.Unlocked at 60% of city toured.
                <span id='goldCostwizCollege'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostwizCollege'>10,000</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>50%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>30%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultwizCollege'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                The wizard college is the finest school in all the realms. You're lucky to be afforded a chance to get
                in, although it will cost you a small fortune in tuition.Take their tests and get a grade!Can only have
                1 Wizard College action.Costs 500 gold and 10 favors.Gives (all schools of magic skills) * (1 + main
                stat / 100) * sqrt(1 + times completed / 1000) * (original mana cost / actual mana cost) progress points
                per mana.Unlocked at 60% of city toured.

                (<span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Soul stat-color'>Soul</span>,

                <span class=' stat-Cha stat-color'>Cha</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerRestoration'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Restoration</label>
              <div style='position:relative'>
                <img src='icons/restoration.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/wizardCollege.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,1,1 1.2246467991473532e-16,1 Z'></path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.25turn,var(--stat-Int-color) calc(0.25turn * var(--pie-ratio)),var(--stat-Soul-color) calc(0.4turn - (0.15turn * var(--pie-ratio))) calc(0.4turn + (0.15turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.65turn - (0.1turn * var(--pie-ratio))) calc(0.65turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.25turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                You've gone all this way without learning how to use your magic to heal people, or even yourself. You
                should probably get around to learning that.Requires Wizard College.Mana cost is reduced by Wizard
                College Grade.Unlocked at 60% of city toured.
                <span id='goldCostRestoration'></span>

                <div class='bold'>Restoration Exp:</div>
                <span id='expGainRestorationRestoration'>100</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostRestoration'>15,000</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>50%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>30%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultRestoration'>100</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Restoration</div>
                <i>
                  From healing cantrips to mass resurrection, you'll be sure to make good use of these spells.
                </i>Increases team combat with 4x the efficiency of the combat skill and improves the Heal the Sick
                action.
              </div>
              <div class='showthis when-locked' draggable='false'>
                You've gone all this way without learning how to use your magic to heal people, or even yourself. You
                should probably get around to learning that.Requires Wizard College.Mana cost is reduced by Wizard
                College Grade.Unlocked at 60% of city toured.

                <div class='bold'>Learn skill:</div> <span>Restoration</span>
                (<span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Soul stat-color'>Soul</span>,

                <span class=' stat-Con stat-color'>Con</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerSpatiomancy'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Spatiomancy</label>
              <div style='position:relative'>
                <img src='icons/spatiomancy.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/wizardCollege.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,1,1 -0.587785252292473,0.8090169943749475 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -0.5877852522924734,-0.8090169943749473 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.5877852522924734,-0.8090169943749473 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.3turn,var(--stat-Int-color) calc(0.3turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.39999999999999997turn - (0.1turn * var(--pie-ratio))) calc(0.39999999999999997turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.55turn - (0.05turn * var(--pie-ratio))) calc(0.55turn + (0.05turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.6499999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.3turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Learn how to control space and matter. Turns out making big changes is
                <i>hard</i>, but even small changes might allow you to get more done each loop. Requires Wizard
                College.Mana cost is reduced by Wizard College Grade.Unlocked at 60% of city toured.
                <span id='goldCostSpatiomancy'></span>

                <div class='bold'>Spatiomancy Exp:</div>
                <span id='expGainSpatiomancySpatiomancy'>100</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostSpatiomancy'>20,000</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>60%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>10%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultSpatiomancy'>100</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Spatiomancy</div>
                <i>Who knew bending reality to your will could be so useful!</i>Mana Geyser and Mana Well are reduced to
                the original / (1 + level / 100). Houses to build increased by 1% per level from 1 - 500. The following
                actions are increased by 0.5% per level in their level range. 101-300 Locked houses 201-400 Short quests
                to finish 301-500 Long quests to finish 401-600 Animals in the forest 501-700 Herbs to gather 601-800
                Possible suckers 701-900 Soulstones to mine 801-1000 Artifacts to take 901-1100 People to ask for
                donations 1001-1200 Buildings to check for pylons 1101-1300 Pockets to pick 1201-1400 Warehouses to rob
                1301-1500 Insurance companies to defraud
              </div>
              <div class='showthis when-locked' draggable='false'>
                Learn how to control space and matter. Turns out making big changes is
                <i>hard</i>, but even small changes might allow you to get more done each loop. Requires Wizard
                College.Mana cost is reduced by Wizard College Grade.Unlocked at 60% of city toured.

                <div class='bold'>Learn skill:</div> <span>Spatiomancy</span>
                (<span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Spd stat-color'>Spd</span>, <span class=' stat-Per stat-color'>Per</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerCitizen'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Citizenship</label>
              <div style='position:relative'>
                <img src='icons/seekCitizenship.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,1,1 1.2246467991473532e-16,1 Z'></path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.25turn,var(--stat-Cha-color) calc(0.25turn * var(--pie-ratio)),var(--stat-Int-color) calc(0.35turn - (0.1turn * var(--pie-ratio))) calc(0.35turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.5499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.7turn - (0.05turn * var(--pie-ratio))) calc(0.7turn + (0.05turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.25turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Right now, you're just visiting. If you want to be accepted into their ranks for real, you'll need to
                study and pass a rigorous exam on Valhallan history and culture.Unlocked at 80% of city toured.
                <span id='goldCostCitizen'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostCitizen'>1,500</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>50%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultCitizen'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Right now, you're just visiting. If you want to be accepted into their ranks for real, you'll need to
                study and pass a rigorous exam on Valhallan history and culture.Unlocked at 80% of city toured.

                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class=' stat-Int stat-color'>Int</span>,
                <span class=' stat-Luck stat-color'>Luck</span>, <span class=' stat-Per stat-color'>Per</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerBuildHousing'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Build Housing</label>
              <div style='position:relative'>
                <img src='icons/buildHousing.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/craftingGuild.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Str' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Str-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.35000000000000003turn - (0.15turn * var(--pie-ratio))) calc(0.35000000000000003turn + (0.15turn * var(--pie-ratio))),var(--stat-Dex-color) calc(0.5999999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.5999999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.75turn - (0.05turn * var(--pie-ratio))) calc(0.75turn + (0.05turn * var(--pie-ratio))),var(--stat-Str-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Build a house in the city that you can rent out.Can build (crafting guild multiplier) *
                (1+min(5,spatiomancy/100)) houses. Requires Crafting Guild.Unlocked at 100% Citizenship Exam Studied.
                <span id='goldCostBuildHousing'></span>

                <div class='bold'>Crafting Exp:</div>
                <span id='expGainBuildHousingCrafting'>100</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostBuildHousing'>2,000</div>
                <dl>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>40%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>30%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>20%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultBuildHousing'>100</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Crafting</div>
                <i>The skill of using your hands and creativity when doing physical work.</i>
              </div>
              <div class='showthis when-locked' draggable='false'>
                Build a house in the city that you can rent out.Can build (crafting guild multiplier) *
                (1+min(5,spatiomancy/100)) houses. Requires Crafting Guild.Unlocked at 100% Citizenship Exam Studied.

                <div class='bold'>Learn skill:</div> <span>Crafting</span>
                (<span class='bold stat-Str stat-color'>Str</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Dex stat-color'>Dex</span>, <span class=' stat-Spd stat-color'>Spd</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerCollectTaxes'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Collect Taxes</label>
              <div style='position:relative'>
                <img src='icons/collectTaxes.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/buildHousing.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Cha-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.3turn - (0.1turn * var(--pie-ratio))) calc(0.3turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Collect taxes from the properties you have built.Gives (houses * Mercantilism / 10) gold.Requires
                housing.Unlocked at 100% Citizenship Exam Studied (and 1 Mercantilism).
                <span id='goldCostCollectTaxes'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostCollectTaxes'>10,000</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>40%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultCollectTaxes'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Collect taxes from the properties you have built.Gives (houses * Mercantilism / 10) gold.Requires
                housing.Unlocked at 100% Citizenship Exam Studied (and 1 Mercantilism).

                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Per stat-color'>Per</span>, <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerPegasus'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Pegasus</label>
              <div style='position:relative'>
                <img src='icons/pegasus.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 -0.587785252292473,0.8090169943749475 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Int-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Soul-color) calc(0.29999999999999993turn - (0.15turn * var(--pie-ratio))) calc(0.29999999999999993turn + (0.15turn * var(--pie-ratio))),var(--stat-Cha-color) calc(0.5499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.75turn - (0.1turn * var(--pie-ratio))) calc(0.75turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Valhalla has more than its fair share of wonders. Amongst them are the Pegasi; mythical winged steeds,
                only available to the finest of citizens. If you wish to get your hands on one, you'll need to convince
                a local to guide you to one of their meeting grounds, and then prove yourself to it. Swift on land and
                sky, it takes more than just gold to own a creature like this. Costs 200 gold and 20 favors.Unlocked at
                90% of city toured.
                <span id='goldCostPegasus'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostPegasus'>3,000</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>30%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>30%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultPegasus'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Valhalla has more than its fair share of wonders. Amongst them are the Pegasi; mythical winged steeds,
                only available to the finest of citizens. If you wish to get your hands on one, you'll need to convince
                a local to guide you to one of their meeting grounds, and then prove yourself to it. Swift on land and
                sky, it takes more than just gold to own a creature like this. Costs 200 gold and 20 favors.Unlocked at
                90% of city toured.

                (<span class='bold stat-Int stat-color'>Int</span>, <span class='bold stat-Soul stat-color'>Soul</span>,

                <span class=' stat-Cha stat-color'>Cha</span>, <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerFightFrostGiants'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Fight Giants</label>
              <div style='position:relative'>
                <img src='icons/fightFrostGiants.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/pegasus.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Str' d='M0,0 L0,-1 A1,1 0,1,1 1.2246467991473532e-16,1 Z'></path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.25turn,var(--stat-Str-color) calc(0.25turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.4turn - (0.15turn * var(--pie-ratio))) calc(0.4turn + (0.15turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.65turn - (0.1turn * var(--pie-ratio))) calc(0.65turn + (0.1turn * var(--pie-ratio))),var(--stat-Str-color) calc(1turn - (0.25turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Join the Valkyries in their fight against the Frost Giants.Improves your ability to seek favor from the
                Gods.Can only have 1 Fight Frost Giants action.Requires a Pegasus.Gives (self combat) * (1 + main stat /
                100) * sqrt(1 + times completed / 1000) * (original mana cost / actual mana cost) progress points per
                mana.Unlocked at 100% Citizenship Exam Studied.
                <span id='goldCostFightFrostGiants'></span>

                <div class='bold'>Combat Exp:</div>
                <span id='expGainFightFrostGiantsCombat'>1500</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostFightFrostGiants'>20,000</div>
                <dl>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>50%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>30%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultFightFrostGiants'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Join the Valkyries in their fight against the Frost Giants.Improves your ability to seek favor from the
                Gods.Can only have 1 Fight Frost Giants action.Requires a Pegasus.Gives (self combat) * (1 + main stat /
                100) * sqrt(1 + times completed / 1000) * (original mana cost / actual mana cost) progress points per
                mana.Unlocked at 100% Citizenship Exam Studied.

                (<span class='bold stat-Str stat-color'>Str</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Per stat-color'>Per</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerSeekBlessing'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Seek Blessing</label>
              <div style='position:relative'>
                <img src='icons/seekBlessing.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/pegasus.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,1,1 1.2246467991473532e-16,1 Z'></path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,1,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.25turn,var(--stat-Cha-color) calc(0.25turn * var(--pie-ratio)),var(--stat-Luck-color) calc(0.5turn - (0.25turn * var(--pie-ratio))) calc(0.5turn + (0.25turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.25turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Pray to the Gods to grant you their favor.Increases the number of soulstones earned from all actions.Can
                only have 1 Seek Blessing action.Requires a Pegasus.Gives (50 * Frost Giants Multiplier) Divine Favor
                experience.Unlocked at 100% Citizenship Exam Studied.
                <span id='goldCostSeekBlessing'></span>

                <div class='bold'>Divine Favor Exp:</div>
                <span id='expGainSeekBlessingDivine'>50</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostSeekBlessing'>1,000,000</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>50%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>50%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultSeekBlessing'>500</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Divine Favor</div>
                <i>The gods have answered your prayers and given you their blessing.</i>Increases soulstones gained from
                actions by (1 + level / 60) ^ 0.25.
              </div>
              <div class='showthis when-locked' draggable='false'>
                Pray to the Gods to grant you their favor.Increases the number of soulstones earned from all actions.Can
                only have 1 Seek Blessing action.Requires a Pegasus.Gives (50 * Frost Giants Multiplier) Divine Favor
                experience.Unlocked at 100% Citizenship Exam Studied.

                <div class='bold'>Learn skill:</div> <span>Divine Favor</span>
                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class='bold stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerGreatFeast'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Great Feast</label>
              <div style='position:relative'>
                <img src='icons/greatFeast.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -0.5877852522924734,-0.8090169943749473 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.5877852522924734,-0.8090169943749473 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.4turn,var(--stat-Soul-color) calc(0.4turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.45000000000000007turn - (0.05turn * var(--pie-ratio))) calc(0.45000000000000007turn + (0.05turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.5499999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Soul-color) calc(1turn - (0.4turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                You realize now that you've forgotten the joy of food, after having gone for so "long" without needing
                to eat anything. It's about time for a feast of grand proportions. Unfortunately, all the catering
                services here only accept payments in soulstones. Permanently increases self and team combat. Gives
                (practical magic skill) * (1 + main stat / 100) * (original mana cost / actual mana cost) progress
                points per mana.Can only have 1 Great Feast action.Requires 100 reputation.Sacrifices (5,000 *
                (feasts+1)) soulstones. Currently sacrificing
                <span id='goldCostGreatFeast'>5,000</span>

                soulstones.Unlocked at 100% of city toured.

                <div class='bold'>Mana Cost:</div> <div id='manaCostGreatFeast'>5,000,000</div>
                <dl>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>80%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>10%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultGreatFeast'>500</div>%

                <div class='bold'>Grants buff:</div> <div class='bold underline'>Great Feast</div>
                <i>
                  That feast was so filling that it manages to keep you well satiated through your loops! That's some
                  impressive magic. Combat (from all sources) is increased by 5% per level.
                </i>
              </div>
              <div class='showthis when-locked' draggable='false'>
                You realize now that you've forgotten the joy of food, after having gone for so "long" without needing
                to eat anything. It's about time for a feast of grand proportions. Unfortunately, all the catering
                services here only accept payments in soulstones. Permanently increases self and team combat. Gives
                (practical magic skill) * (1 + main stat / 100) * (original mana cost / actual mana cost) progress
                points per mana.Can only have 1 Great Feast action.Requires 100 reputation.Sacrifices (5,000 *
                (feasts+1)) soulstones. Currently sacrificing

                soulstones.Unlocked at 100% of city toured.

                <div class='bold'>Grants buff:</div> <span>Great Feast</span>
                (<span class='bold stat-Soul stat-color'>Soul</span>, <span class=' stat-Spd stat-color'>Spd</span>,

                <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerSurveyZ4'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Survey</label>
              <div style='position:relative'>
                <img src='icons/surveyZ4.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Per-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.3turn - (0.1turn * var(--pie-ratio))) calc(0.3turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The explorers guild has taught you how to find what most would miss. Gives max(1,floor(sqrt(average
                survey progress))) exp per action. (Currently
                <div class='surveySkill'>0</div>) Each percent surveyed gives an additional 0.5% findables in this zone
                (additive with Spatiomancy). Costs 1 map and gives 1 completed map, unless this zone's survey is at
                100%.
                <span id='goldCostSurveyZ4'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostSurveyZ4'>50,000</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>40%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultSurveyZ4'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                The explorers guild has taught you how to find what most would miss. Gives max(1,floor(sqrt(average
                survey progress))) exp per action. (Currently
                <div class='surveySkill'>0</div>) Each percent surveyed gives an additional 0.5% findables in this zone
                (additive with Spatiomancy). Costs 1 map and gives 1 completed map, unless this zone's survey is at
                100%.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Spd stat-color'>Spd</span>, <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerAssassinZ4'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Assassinate</label>
              <div style='position:relative'>
                <img src='icons/assassin.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 1.2246467991473532e-16,1 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Dex-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.25turn - (0.1turn * var(--pie-ratio))) calc(0.25turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.6499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.7999999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.7999999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Discreetly kill your mark in this town. The more well-known you are, for either good or evil, the harder
                pulling this off will be... Gives progress equal to (sqrt(practical) + thievery + assassination) *
                (1+stat/1000) * sqrt(1+completions/100) / max(1,abs(reputation)) / max(1,hearts) * base/actual cost.
                Lose max(0,250*zone-assassination) reputation, regardless of whether you were successful or not. Rewards
                a heart on successful kill.
                <span id='goldCostAssassinZ4'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostAssassinZ4'>50,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>30%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultAssassinZ4'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Discreetly kill your mark in this town. The more well-known you are, for either good or evil, the harder
                pulling this off will be... Gives progress equal to (sqrt(practical) + thievery + assassination) *
                (1+stat/1000) * sqrt(1+completions/100) / max(1,abs(reputation)) / max(1,hearts) * base/actual cost.
                Lose max(0,250*zone-assassination) reputation, regardless of whether you were successful or not. Rewards
                a heart on successful kill.

                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Per stat-color'>Per</span>, <span class=' stat-Luck stat-color'>Luck</span>,
                <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
        </div>
        <div>
          <div>
            <button
              id='containerFallFromGrace'
              class='travelContainer actionOrTravelContainer normalActionContainer showthat locked'
              draggable='true'
            >
              <label>Fall From Grace</label>
              <div style='position:relative'>
                <img src='icons/fallFromGrace.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Dex-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Luck-color) calc(0.35000000000000003turn - (0.15turn * var(--pie-ratio))) calc(0.35000000000000003turn + (0.15turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.5999999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.5999999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.75turn - (0.05turn * var(--pie-ratio))) calc(0.75turn + (0.05turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Looks like the only way to leave this place is to make them dislike you enough to kick you out. Some
                moderate vandalism will probably do the job. Some people just want to watch something beyond the world
                burn. You'll be cast into the shadow realm and thrown back to the beginning of your journey.Unlocked at
                200 Pyromancy.
                <span id='goldCostFallFromGrace'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostFallFromGrace'>30,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>40%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>30%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultFallFromGrace'>200</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Looks like the only way to leave this place is to make them dislike you enough to kick you out. Some
                moderate vandalism will probably do the job. Some people just want to watch something beyond the world
                burn. You'll be cast into the shadow realm and thrown back to the beginning of your journey.Unlocked at
                200 Pyromancy.

                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class=' stat-Luck stat-color'>Luck</span>,

                <span class=' stat-Spd stat-color'>Spd</span>, <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div>
            <button
              id='containerMeander'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight'
              draggable='true'
            >
              <label>Meander</label>
              <div style='position:relative'>
                <img src='icons/meander.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/imbueMind.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Spd' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 1.2246467991473532e-16,1 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Spd-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.25turn - (0.1turn * var(--pie-ratio))) calc(0.25turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Cha-color) calc(0.6499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7999999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.7999999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Spd-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                This place seems familiar, and yet... not. Everything is twisted and wrong. Just being here hurts your
                head. You'll need to fortify your mind to make any progress here. Gives exp equal to Imbue Mind level.
                (You make no progress with 0 Imbue Mind.)
                <span id='goldCostMeander'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostMeander'>2,500</div>
                <dl>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>30%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultMeander'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                This place seems familiar, and yet... not. Everything is twisted and wrong. Just being here hurts your
                head. You'll need to fortify your mind to make any progress here. Gives exp equal to Imbue Mind level.
                (You make no progress with 0 Imbue Mind.)

                (<span class='bold stat-Spd stat-color'>Spd</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Per stat-color'>Per</span>, <span class=' stat-Cha stat-color'>Cha</span>,
                <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerWells'
              class='actionContainer cappableActionContainer actionOrTravelContainer limitedActionContainer showthat actionHighlight locked'
              draggable='true'
            >
              <label>Mana Well</label>
              <div style='position:relative'>
                <img src='icons/manaWell.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Str' d='M0,0 L0,-1 A1,1 0,1,1 -0.587785252292473,0.8090169943749475 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.3turn,var(--stat-Str-color) calc(0.3turn * var(--pie-ratio)),var(--stat-Per-color) calc(0.45turn - (0.15turn * var(--pie-ratio))) calc(0.45turn + (0.15turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.6499999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Str-color) calc(1turn - (0.3turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Search the town for wells that still have any mana left. They seem to be rapidly draining. Full wells
                have 5000 mana, but lose 10 mana for every second that has passed in the loop (based on effective time),
                currently
                <span id='goldCostWells'>5,000</span>

                mana. Every 100 wells still has mana. Unlocked with 2% town meandered.

                <div class='bold'>Mana Cost:</div> <div id='manaCostWells'>2,500</div>
                <dl>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>60%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>30%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultWells'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Search the town for wells that still have any mana left. They seem to be rapidly draining. Full wells
                have 5000 mana, but lose 10 mana for every second that has passed in the loop (based on effective time),
                currently

                mana. Every 100 wells still has mana. Unlocked with 2% town meandered.

                (<span class='bold stat-Str stat-color'>Str</span>, <span class=' stat-Per stat-color'>Per</span>,
                <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerPylons'
              class='actionContainer cappableActionContainer actionOrTravelContainer limitedActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Destroy Pylons</label>
              <div style='position:relative'>
                <img src='icons/destroyPylons.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Str' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Str-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Dex-color) calc(0.35000000000000003turn - (0.15turn * var(--pie-ratio))) calc(0.35000000000000003turn + (0.15turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.6499999999999999turn - (0.15turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.15turn * var(--pie-ratio))),var(--stat-Str-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                There are strange pylons humming with energy in the abandoned buildings of this town. You're not sure
                why, but you feel compelled to break them. Every 100 abandon buildings have 1 breakable pylon.Each pylon
                destroyed increases progress on The Spire by 10%. Unlocked at 5% town meandered.
                <span id='goldCostPylons'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostPylons'>10,000</div>
                <dl>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>40%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>30%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>30%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultPylons'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                There are strange pylons humming with energy in the abandoned buildings of this town. You're not sure
                why, but you feel compelled to break them. Every 100 abandon buildings have 1 breakable pylon.Each pylon
                destroyed increases progress on The Spire by 10%. Unlocked at 5% town meandered.

                (<span class='bold stat-Str stat-color'>Str</span>, <span class=' stat-Dex stat-color'>Dex</span>,
                <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerRaiseZombie'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Raise Zombie</label>
              <div style='position:relative'>
                <img src='icons/raiseZombie.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Con' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Con-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Int-color) calc(0.35000000000000003turn - (0.15turn * var(--pie-ratio))) calc(0.35000000000000003turn + (0.15turn * var(--pie-ratio))),var(--stat-Soul-color) calc(0.6499999999999999turn - (0.15turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.15turn * var(--pie-ratio))),var(--stat-Con-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Upon stumbling by the local cemetery, you realize that those numerous tombstones could perhaps benefit
                you in ways besides acting as building materials. With your knowledge of dark magic and a hint of
                troll's blood, you might just be able to raise a zombie of your very own! Costs 1 blood.Each zombie adds
                (dark magic / 2) * max(1,dark ritual / 100) to your team combat.Unlocked at 1000 dark magic.
                <span id='goldCostRaiseZombie'></span>

                <div class='bold'>Dark Magic Exp:</div>
                <span id='expGainRaiseZombieDark'>100</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostRaiseZombie'>10,000</div>
                <dl>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>40%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>30%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>30%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultRaiseZombie'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Upon stumbling by the local cemetery, you realize that those numerous tombstones could perhaps benefit
                you in ways besides acting as building materials. With your knowledge of dark magic and a hint of
                troll's blood, you might just be able to raise a zombie of your very own! Costs 1 blood.Each zombie adds
                (dark magic / 2) * max(1,dark ritual / 100) to your team combat.Unlocked at 1000 dark magic.

                (<span class='bold stat-Con stat-color'>Con</span>, <span class=' stat-Int stat-color'>Int</span>,
                <span class=' stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerDarkSacrifice'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Dark Sacrifice</label>
              <div style='position:relative'>
                <img src='icons/darkSacrifice.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.4turn,var(--stat-Soul-color) calc(0.4turn * var(--pie-ratio)),var(--stat-Int-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Soul-color) calc(1turn - (0.4turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                You make a sacrifice of troll's blood to dark gods.Costs 1 blood. Reduces the soulstone cost of dark
                ritual.Unlocked at 60 dark ritual.
                <span id='goldCostDarkSacrifice'></span>

                <div class='bold'>Communion Exp:</div>
                <span id='expGainDarkSacrificeCommune'>100</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostDarkSacrifice'>20,000</div>
                <dl>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>80%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultDarkSacrifice'>100</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Communion</div>
                <i>Your blood sacrifices to dark beings makes it easier to communicate with them.</i>Dark Ritual
                soulstone costs are reduced to the original / (1 + level / 100).
              </div>
              <div class='showthis when-locked' draggable='false'>
                You make a sacrifice of troll's blood to dark gods.Costs 1 blood. Reduces the soulstone cost of dark
                ritual.Unlocked at 60 dark ritual.

                <div class='bold'>Learn skill:</div> <span>Communion</span>
                (<span class='bold stat-Soul stat-color'>Soul</span>, <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerTheSpire'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>The Spire</label>
              <div style='position:relative'>
                <img src='icons/theSpire.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/team.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951535,-0.30901699437494745 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L0.9510565162951535,-0.30901699437494745 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Str'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -0.5877852522924734,-0.8090169943749473 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.5877852522924734,-0.8090169943749473 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.1turn,var(--stat-Per-color) calc(0.1turn * var(--pie-ratio)),var(--stat-Int-color) calc(0.20000000000000004turn - (0.1turn * var(--pie-ratio))) calc(0.20000000000000004turn + (0.1turn * var(--pie-ratio))),var(--stat-Soul-color) calc(0.4turn - (0.1turn * var(--pie-ratio))) calc(0.4turn + (0.1turn * var(--pie-ratio))),var(--stat-Dex-color) calc(0.5500000000000002turn - (0.05turn * var(--pie-ratio))) calc(0.5500000000000002turn + (0.05turn * var(--pie-ratio))),var(--stat-Str-color) calc(0.65turn - (0.05turn * var(--pie-ratio))) calc(0.65turn + (0.05turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.7500000000000001turn - (0.05turn * var(--pie-ratio))) calc(0.7500000000000001turn + (0.05turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.85turn - (0.05turn * var(--pie-ratio))) calc(0.85turn + (0.05turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.1turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Standing tall in the dead center of the town is the towering Spire. Surrounded by an eternal storm, it
                seems to drain the life from the shadowy world around it. This is surely your greatest task yet.Gives
                (team combat) * (1 + main stat / 100) * sqrt(1 + times floor completed / 200) * (1 + pylons destroyed /
                10) * (original mana cost / actual mana cost) progress points per mana.Unlocked with 5% town
                meandered.Gives 100 soulstones per completion - hover over Looted for info.
                <span id='goldCostTheSpire'></span>

                <div class='bold'>Combat Exp:</div>
                <span id='expGainTheSpireCombat'>100</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostTheSpire'>100,000</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>20%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>20%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>10%</dd>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>10%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>10%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultTheSpire'>100</div>%

                <div class='bold'>Grants buff:</div> <div class='bold underline'>Aspirant</div>
                <i>
                  Reaching new heights in the spire fills your mind and soul with vigor and clarity. Talent Exp gain is
                  increased by 1% per level.
                </i>
              </div>
              <div class='showthis when-locked' draggable='false'>
                Standing tall in the dead center of the town is the towering Spire. Surrounded by an eternal storm, it
                seems to drain the life from the shadowy world around it. This is surely your greatest task yet.Gives
                (team combat) * (1 + main stat / 100) * sqrt(1 + times floor completed / 200) * (1 + pylons destroyed /
                10) * (original mana cost / actual mana cost) progress points per mana.Unlocked with 5% town
                meandered.Gives 100 soulstones per completion - hover over Looted for info.

                <div class='bold'>Grants buff:</div> <span>Aspirant</span>
                (<span class='bold stat-Per stat-color'>Per</span>, <span class='bold stat-Int stat-color'>Int</span>,

                <span class='bold stat-Soul stat-color'>Soul</span>, <span class=' stat-Dex stat-color'>Dex</span>,
                <span class=' stat-Str stat-color'>Str</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Spd stat-color'>Spd</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerPurchaseSupplies'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Buy Supplies</label>
              <div style='position:relative'>
                <img src='icons/purchaseSupplies.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951536,-0.30901699437494723 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -0.5877852522924734,-0.8090169943749473 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L-0.5877852522924734,-0.8090169943749473 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.4turn,var(--stat-Cha-color) calc(0.4turn * var(--pie-ratio)),var(--stat-Luck-color) calc(0.45000000000000007turn - (0.05turn * var(--pie-ratio))) calc(0.45000000000000007turn + (0.05turn * var(--pie-ratio))),var(--stat-Soul-color) calc(0.5499999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.4turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Prepare to move on.This merchant doesn't seem to be willing to haggle with you though. Costs 500
                gold.You only need one set of supplies.Unlocked with 75% town meandered.
                <span id='goldCostPurchaseSupplies'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostPurchaseSupplies'>2,000</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>80%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>10%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultPurchaseSupplies'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Prepare to move on.This merchant doesn't seem to be willing to haggle with you though. Costs 500
                gold.You only need one set of supplies.Unlocked with 75% town meandered.

                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class=' stat-Luck stat-color'>Luck</span>,

                <span class=' stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerDeadTrial'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Trial of the Dead</label>
              <div style='position:relative'>
                <img src='icons/deadTrial.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/raiseZombie.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,0,1 1,-6.123233995736766e-17 Z'></path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L1,-6.123233995736766e-17 A1,1 0,0,1 1.2246467991473532e-16,1 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -1,1.8369701987210297e-16 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L-1,1.8369701987210297e-16 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.125turn,var(--stat-Cha-color) calc(0.125turn * var(--pie-ratio)),var(--stat-Int-color) calc(0.25turn - (0.125turn * var(--pie-ratio))) calc(0.25turn + (0.125turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.5turn - (0.125turn * var(--pie-ratio))) calc(0.5turn + (0.125turn * var(--pie-ratio))),var(--stat-Soul-color) calc(0.75turn - (0.125turn * var(--pie-ratio))) calc(0.75turn + (0.125turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.125turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                You've found an old necropolis. It's <i>way</i>
                too haunted for you and your party, but you could probably send some zombies in to look for more bodies.
                Only the combat gained from zombies counts toward this trial.Rewards 1 Zombie per floor
                completion.Unlocks when this zone is fully surveyed.
                <span id='goldCostDeadTrial'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostDeadTrial'>100,000</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>25%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>25%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>25%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>25%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultDeadTrial'>25</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                You've found an old necropolis. It's <i>way</i>
                too haunted for you and your party, but you could probably send some zombies in to look for more bodies.
                Only the combat gained from zombies counts toward this trial.Rewards 1 Zombie per floor
                completion.Unlocks when this zone is fully surveyed.

                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class='bold stat-Int stat-color'>Int</span>,

                <span class='bold stat-Luck stat-color'>Luck</span>,
                <span class='bold stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerSurveyZ5'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Survey</label>
              <div style='position:relative'>
                <img src='icons/surveyZ5.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Per-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.3turn - (0.1turn * var(--pie-ratio))) calc(0.3turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The explorers guild has taught you how to find what most would miss. Gives max(1,floor(sqrt(average
                survey progress))) exp per action. (Currently
                <div class='surveySkill'>0</div>) Each percent surveyed gives an additional 0.5% findables in this zone
                (additive with Spatiomancy). Costs 1 map and gives 1 completed map, unless this zone's survey is at
                100%.
                <span id='goldCostSurveyZ5'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostSurveyZ5'>60,000</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>40%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultSurveyZ5'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                The explorers guild has taught you how to find what most would miss. Gives max(1,floor(sqrt(average
                survey progress))) exp per action. (Currently
                <div class='surveySkill'>0</div>) Each percent surveyed gives an additional 0.5% findables in this zone
                (additive with Spatiomancy). Costs 1 map and gives 1 completed map, unless this zone's survey is at
                100%.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Spd stat-color'>Spd</span>, <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerRuinsZ5'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Ruins</label>
              <div style='position:relative'>
                <img src='icons/ruinsZ5.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/surveyZ1.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Per-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.3turn - (0.1turn * var(--pie-ratio))) calc(0.3turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                As you explore, you find ruins scattered around the shadowy village. You better explore them, who knows
                what useful secrets they hide.
                <span id='goldCostRuinsZ5'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostRuinsZ5'>100,000</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>40%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultRuinsZ5'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                As you explore, you find ruins scattered around the shadowy village. You better explore them, who knows
                what useful secrets they hide.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Spd stat-color'>Spd</span>, <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerStonesZ5'
              class='actionContainer actionOrTravelContainer limitedActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Haul</label>
              <div style='position:relative'>
                <img src='icons/haulZ5.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/surveyZ1.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Con' d='M0,0 L0,-1 A1,1 0,1,1 -0.587785252292473,0.8090169943749475 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Str'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.3turn,var(--stat-Con-color) calc(0.3turn * var(--pie-ratio)),var(--stat-Str-color) calc(0.5turn - (0.2turn * var(--pie-ratio))) calc(0.5turn + (0.2turn * var(--pie-ratio))),var(--stat-Con-color) calc(1turn - (0.3turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                While exploring Startington, you find the ruins of a few buildings you're certain do not exist in
                Beginnersville. Investigating further, you find that some of the stonework of those buildings is
                unaffected by the loops. Figuring which ones is going to take some doing... You're sure you can use them
                for something, but they're too heavy to move more than one at a time. One in every one thousand Stones
                is Temporal. Action fails if you have a Temporal Stone.
                <span id='goldCostStonesZ5'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostStonesZ5'>50,000</div>
                <dl>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>60%</dd>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>40%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultStonesZ5'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                While exploring Startington, you find the ruins of a few buildings you're certain do not exist in
                Beginnersville. Investigating further, you find that some of the stonework of those buildings is
                unaffected by the loops. Figuring which ones is going to take some doing... You're sure you can use them
                for something, but they're too heavy to move more than one at a time. One in every one thousand Stones
                is Temporal. Action fails if you have a Temporal Stone.

                (<span class='bold stat-Con stat-color'>Con</span>, <span class=' stat-Str stat-color'>Str</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerAssassinZ5'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Assassinate</label>
              <div style='position:relative'>
                <img src='icons/assassin.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 1.2246467991473532e-16,1 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Dex-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.25turn - (0.1turn * var(--pie-ratio))) calc(0.25turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.6499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.7999999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.7999999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Discreetly kill your mark in this town. The more well-known you are, for either good or evil, the harder
                pulling this off will be... Gives progress equal to (sqrt(practical) + thievery + assassination) *
                (1+stat/1000) * sqrt(1+completions/100) / max(1,abs(reputation)) / max(1,hearts) * base/actual cost.
                Lose max(0,250*zone-assassination) reputation, regardless of whether you were successful or not. Rewards
                a heart on successful kill.
                <span id='goldCostAssassinZ5'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostAssassinZ5'>50,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>30%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultAssassinZ5'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Discreetly kill your mark in this town. The more well-known you are, for either good or evil, the harder
                pulling this off will be... Gives progress equal to (sqrt(practical) + thievery + assassination) *
                (1+stat/1000) * sqrt(1+completions/100) / max(1,abs(reputation)) / max(1,hearts) * base/actual cost.
                Lose max(0,250*zone-assassination) reputation, regardless of whether you were successful or not. Rewards
                a heart on successful kill.

                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Per stat-color'>Per</span>, <span class=' stat-Luck stat-color'>Luck</span>,
                <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
        </div>
        <div>
          <div>
            <button
              id='containerJourneyForth'
              class='travelContainer actionOrTravelContainer normalActionContainer showthat locked hidden'
              draggable='true'
            >
              <label>Journey Forth</label>
              <div style='position:relative'>
                <img src='icons/journeyForth.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Con' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Con-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.35000000000000003turn - (0.15turn * var(--pie-ratio))) calc(0.35000000000000003turn + (0.15turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.6499999999999999turn - (0.15turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.15turn * var(--pie-ratio))),var(--stat-Con-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Follow the trail out of town. Anywhere has to be better than here, you think as you look at the looming
                Jungle ahead. Requires (and costs) supplies.Unlocked with 100% town meandered.
                <span id='goldCostJourneyForth'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostJourneyForth'>20,000</div>
                <dl>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>40%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>30%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>30%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultJourneyForth'>200</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Follow the trail out of town. Anywhere has to be better than here, you think as you look at the looming
                Jungle ahead. Requires (and costs) supplies.Unlocked with 100% town meandered.

                (<span class='bold stat-Con stat-color'>Con</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Per stat-color'>Per</span>)
              </div>
            </button>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div>
            <button
              id='containerExploreJungle'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight'
              draggable='true'
            >
              <label>Explore Jungle</label>
              <div style='position:relative'>
                <img src='icons/exploreJungle.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/fightJungleMonsters.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Spd' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 1.2246467991473532e-16,1 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Spd-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.25turn - (0.1turn * var(--pie-ratio))) calc(0.25turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Cha-color) calc(0.6499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7999999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.7999999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Spd-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                It would be easier to explore here if there wasn't something waiting to jump out at you behind every
                tree. Gives progress based on Fight Jungle multiplier.Gives 1 herb.
                <span id='goldCostExploreJungle'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostExploreJungle'>25,000</div>
                <dl>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>30%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultExploreJungle'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                It would be easier to explore here if there wasn't something waiting to jump out at you behind every
                tree. Gives progress based on Fight Jungle multiplier.Gives 1 herb.

                (<span class='bold stat-Spd stat-color'>Spd</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Per stat-color'>Per</span>, <span class=' stat-Cha stat-color'>Cha</span>,
                <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerFightJungleMonsters'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight'
              draggable='true'
            >
              <label>Fight Jungle</label>
              <div style='position:relative'>
                <img src='icons/fightJungleMonsters.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Str'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Per-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Dex-color) calc(0.35000000000000003turn - (0.15turn * var(--pie-ratio))) calc(0.35000000000000003turn + (0.15turn * var(--pie-ratio))),var(--stat-Str-color) calc(0.6499999999999999turn - (0.15turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.15turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Even the basic creatures here are terrifying. Gives (self combat) * (1 + main stat / 100) * sqrt(1 +
                times completed / 1000) * (original mana cost / actual mana cost) progress points per mana.Gives 1 blood
                per segment completed.
                <span id='goldCostFightJungleMonsters'></span>

                <div class='bold'>Combat Exp:</div>
                <span id='expGainFightJungleMonstersCombat'>2000</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostFightJungleMonsters'>30,000</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>40%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>30%</dd>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>30%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultFightJungleMonsters'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Even the basic creatures here are terrifying. Gives (self combat) * (1 + main stat / 100) * sqrt(1 +
                times completed / 1000) * (original mana cost / actual mana cost) progress points per mana.Gives 1 blood
                per segment completed.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class=' stat-Dex stat-color'>Dex</span>,
                <span class=' stat-Str stat-color'>Str</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerRescue'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Rescue Survivor</label>
              <div style='position:relative'>
                <img src='icons/rescueSurvivors.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Per-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Dex-color) calc(0.3turn - (0.1turn * var(--pie-ratio))) calc(0.3turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Cha-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                There are people lost wandering the jungle. If you can find them, you can patch them up and bring them
                back to camp.Gives (magic skill) * (restoration skill / 100) * (1 + main stat / 100) * sqrt(1 + times
                completed / 100) * (original mana cost / actual mana cost) * (Jungle Explored %) progress points per
                mana.Rescued survivors give 4 reputation.Unlocked at 20% Jungle explored.
                <span id='goldCostRescue'></span>

                <div class='bold'>Restoration Exp:</div>
                <span id='expGainRescueRestoration'>25</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostRescue'>25,000</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>40%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>20%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultRescue'>100</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Restoration</div>
                <i>
                  From healing cantrips to mass resurrection, you'll be sure to make good use of these spells.
                </i>Increases team combat with 4x the efficiency of the combat skill and improves the Heal the Sick
                action.
              </div>
              <div class='showthis when-locked' draggable='false'>
                There are people lost wandering the jungle. If you can find them, you can patch them up and bring them
                back to camp.Gives (magic skill) * (restoration skill / 100) * (1 + main stat / 100) * sqrt(1 + times
                completed / 100) * (original mana cost / actual mana cost) * (Jungle Explored %) progress points per
                mana.Rescued survivors give 4 reputation.Unlocked at 20% Jungle explored.

                <div class='bold'>Learn skill:</div> <span>Restoration</span>
                (<span class='bold stat-Per stat-color'>Per</span>, <span class=' stat-Dex stat-color'>Dex</span>,
                <span class=' stat-Spd stat-color'>Spd</span>, <span class=' stat-Cha stat-color'>Cha</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerPrepareBuffet'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Prepare Buffet</label>
              <div style='position:relative'>
                <img src='icons/prepareBuffet.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,1,1 -0.587785252292473,0.8090169943749475 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.3turn,var(--stat-Int-color) calc(0.3turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.45turn - (0.15turn * var(--pie-ratio))) calc(0.45turn + (0.15turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.6499999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.3turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                It's not quite the same as making potions, but you can use your alchemy skills to prepare food for the
                gathered group.Costs 10 herbs and 1 blood.Gives Gluttony exp equal to (Rescued Survivors * 5).Unlocked
                at 20% Jungle explored
                <span id='goldCostPrepareBuffet'></span>

                <div class='bold'>Alchemy Exp:</div>
                <span id='expGainPrepareBuffetAlchemy'>25</span>
                <div class='bold'>Gluttony Exp:</div>
                <span id='expGainPrepareBuffetGluttony'>5</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostPrepareBuffet'>30,000</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>60%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>30%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultPrepareBuffet'>100</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Alchemy</div>
                <i>Brewing potions is hard work! It's a good thing you found a teacher.</i>The Magic teacher in
                Beginnersville adores alchemists. +1% Magic exp gain from the Mage Lessons action (rounded down) per
                level.
                <div class='bold'>Learn skill:</div> <div class='bold underline'>Gluttony</div>
                <i>The insatiable hunger of the jungle has started to rub off on you.</i>Great Feast soulstone costs are
                reduced to the original / (1 + level / 100).
              </div>
              <div class='showthis when-locked' draggable='false'>
                It's not quite the same as making potions, but you can use your alchemy skills to prepare food for the
                gathered group.Costs 10 herbs and 1 blood.Gives Gluttony exp equal to (Rescued Survivors * 5).Unlocked
                at 20% Jungle explored

                <div class='bold'>Learn skill:</div> <span>Alchemy</span>
                <div class='bold'>Learn skill:</div> <span>Gluttony</span>
                (<span class='bold stat-Int stat-color'>Int</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Per stat-color'>Per</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerTotem'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Totem</label>
              <div style='position:relative'>
                <img src='icons/totem.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Soul' d='M0,0 L0,-1 A1,1 0,1,1 1.2246467991473532e-16,1 Z'></path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.25turn,var(--stat-Soul-color) calc(0.25turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.4turn - (0.15turn * var(--pie-ratio))) calc(0.4turn + (0.15turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.65turn - (0.1turn * var(--pie-ratio))) calc(0.65turn + (0.1turn * var(--pie-ratio))),var(--stat-Soul-color) calc(1turn - (0.25turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Deep within the jungle, you find a totem pulsing with energy. Just standing near it, you feel more
                capable. If you drink a looping potion here, perhaps some of that energy will stay with you on future
                loops.Doubles the initial stat gain bonus of Imbue Body on first completion.Requires a looping
                potion.Unlocked at 50% Jungle Explored.Grants 100 Wunderkind exp.
                <span id='goldCostTotem'></span>

                <div class='bold'>Wunderkind Exp:</div>
                <span id='expGainTotemWunderkind'>100</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostTotem'>30,000</div>
                <dl>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>50%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>30%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultTotem'>100</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Wunderkind</div>
                <i>Even with your eyes closed, you still see the glow of the totem.</i>
                Doubles the initial stat gain of Imbue Body Talent exp gain is increased by (1 + level / 60) ^ 0.25.
              </div>
              <div class='showthis when-locked' draggable='false'>
                Deep within the jungle, you find a totem pulsing with energy. Just standing near it, you feel more
                capable. If you drink a looping potion here, perhaps some of that energy will stay with you on future
                loops.Doubles the initial stat gain bonus of Imbue Body on first completion.Requires a looping
                potion.Unlocked at 50% Jungle Explored.Grants 100 Wunderkind exp.

                <div class='bold'>Learn skill:</div> <span>Wunderkind</span>
                (<span class='bold stat-Soul stat-color'>Soul</span>, <span class=' stat-Con stat-color'>Con</span>,

                <span class=' stat-Per stat-color'>Per</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerSurveyZ6'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Survey</label>
              <div style='position:relative'>
                <img src='icons/surveyZ6.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Per-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.3turn - (0.1turn * var(--pie-ratio))) calc(0.3turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The explorers guild has taught you how to find what most would miss. Gives max(1,floor(sqrt(average
                survey progress))) exp per action. (Currently
                <div class='surveySkill'>0</div>) Each percent surveyed gives an additional 0.5% findables in this zone
                (additive with Spatiomancy). Costs 1 map and gives 1 completed map, unless this zone's survey is at
                100%.
                <span id='goldCostSurveyZ6'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostSurveyZ6'>70,000</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>40%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultSurveyZ6'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                The explorers guild has taught you how to find what most would miss. Gives max(1,floor(sqrt(average
                survey progress))) exp per action. (Currently
                <div class='surveySkill'>0</div>) Each percent surveyed gives an additional 0.5% findables in this zone
                (additive with Spatiomancy). Costs 1 map and gives 1 completed map, unless this zone's survey is at
                100%.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Spd stat-color'>Spd</span>, <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerRuinsZ6'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Ruins</label>
              <div style='position:relative'>
                <img src='icons/ruinsZ6.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/surveyZ1.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Per-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.3turn - (0.1turn * var(--pie-ratio))) calc(0.3turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                As you explore, you find ruins scattered around the dense jungle. You better explore them, who knows
                what useful secrets they hide.
                <span id='goldCostRuinsZ6'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostRuinsZ6'>100,000</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>40%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultRuinsZ6'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                As you explore, you find ruins scattered around the dense jungle. You better explore them, who knows
                what useful secrets they hide.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Spd stat-color'>Spd</span>, <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerStonesZ6'
              class='actionContainer actionOrTravelContainer limitedActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Haul</label>
              <div style='position:relative'>
                <img src='icons/haulZ6.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/surveyZ1.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Con' d='M0,0 L0,-1 A1,1 0,1,1 -0.587785252292473,0.8090169943749475 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Str'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.3turn,var(--stat-Con-color) calc(0.3turn * var(--pie-ratio)),var(--stat-Str-color) calc(0.5turn - (0.2turn * var(--pie-ratio))) calc(0.5turn + (0.2turn * var(--pie-ratio))),var(--stat-Con-color) calc(1turn - (0.3turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                On one loop, you trip over a loose piece of stone. On the following loop, you notice it's no longer in
                the spot you tripped over it. Looking around more closely, you find that there are a few stones with
                this property. Too bad the Jungle is home to a <b>lot</b>
                of stones... You're sure you can use them for something, but they're too heavy to move more than one at
                a time. One in every one thousand Stones is Temporal. Action fails if you have a Temporal Stone.
                <span id='goldCostStonesZ6'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostStonesZ6'>50,000</div>
                <dl>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>60%</dd>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>40%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultStonesZ6'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                On one loop, you trip over a loose piece of stone. On the following loop, you notice it's no longer in
                the spot you tripped over it. Looking around more closely, you find that there are a few stones with
                this property. Too bad the Jungle is home to a <b>lot</b>
                of stones... You're sure you can use them for something, but they're too heavy to move more than one at
                a time. One in every one thousand Stones is Temporal. Action fails if you have a Temporal Stone.

                (<span class='bold stat-Con stat-color'>Con</span>, <span class=' stat-Str stat-color'>Str</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerAssassinZ6'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Assassinate</label>
              <div style='position:relative'>
                <img src='icons/assassin.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 1.2246467991473532e-16,1 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Dex-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.25turn - (0.1turn * var(--pie-ratio))) calc(0.25turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.6499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.7999999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.7999999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Discreetly kill your mark in this town. The more well-known you are, for either good or evil, the harder
                pulling this off will be... Gives progress equal to (sqrt(practical) + thievery + assassination) *
                (1+stat/1000) * sqrt(1+completions/100) / max(1,abs(reputation)) / max(1,hearts) * base/actual cost.
                Lose max(0,250*zone-assassination) reputation, regardless of whether you were successful or not. Rewards
                a heart on successful kill.
                <span id='goldCostAssassinZ6'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostAssassinZ6'>50,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>30%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultAssassinZ6'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Discreetly kill your mark in this town. The more well-known you are, for either good or evil, the harder
                pulling this off will be... Gives progress equal to (sqrt(practical) + thievery + assassination) *
                (1+stat/1000) * sqrt(1+completions/100) / max(1,abs(reputation)) / max(1,hearts) * base/actual cost.
                Lose max(0,250*zone-assassination) reputation, regardless of whether you were successful or not. Rewards
                a heart on successful kill.

                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Per stat-color'>Per</span>, <span class=' stat-Luck stat-color'>Luck</span>,
                <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
        </div>
        <div>
          <div>
            <button
              id='containerEscape'
              class='travelContainer actionOrTravelContainer normalActionContainer showthat locked hidden'
              draggable='true'
            >
              <label>Escape</label>
              <div style='position:relative'>
                <img src='icons/escape.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Spd' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951536,-0.30901699437494723 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.4turn,var(--stat-Spd-color) calc(0.4turn * var(--pie-ratio)),var(--stat-Dex-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(1turn - (0.4turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The Jungle seems to grow ever larger with every passing moment. You'll have to get out of here
                fast.Unlocked at 100% Jungle explored.Must be started before 60 seconds have passed this loop (hover
                Mana Used for effective time.)
                <span id='goldCostEscape'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostEscape'>50,000</div>
                <dl>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>80%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultEscape'>200</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                The Jungle seems to grow ever larger with every passing moment. You'll have to get out of here
                fast.Unlocked at 100% Jungle explored.Must be started before 60 seconds have passed this loop (hover
                Mana Used for effective time.)

                (<span class='bold stat-Spd stat-color'>Spd</span>, <span class=' stat-Dex stat-color'>Dex</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerOpenPortal'
              class='travelContainer actionOrTravelContainer normalActionContainer showthat locked hidden'
              draggable='true'
            >
              <label>Open Portal</label>
              <div style='position:relative'>
                <img src='icons/openPortal.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Soul' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951535,0.30901699437494756 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.35turn,var(--stat-Soul-color) calc(0.35turn * var(--pie-ratio)),var(--stat-Int-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.6turn - (0.05turn * var(--pie-ratio))) calc(0.6turn + (0.05turn * var(--pie-ratio))),var(--stat-Soul-color) calc(1turn - (0.35turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The Explorers' guild tells you of a secret grove within the Jungle, where the barrier between realms is
                weakest. With enough restoration skill, you might be able to open a rift back and leave the shadow
                realm. However, it seems quite a bit of time passes in the portal, and some merchants have closed up
                shop. Unlocked with 75% of the world surveyed. Travels to Forest Path.Buy Mana actions can not be used
                for the rest of the current loop.Requires 1000 Restoration.
                <span id='goldCostOpenPortal'></span>

                <div class='bold'>Restoration Exp:</div>
                <span id='expGainOpenPortalRestoration'>2500</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostOpenPortal'>50,000</div>
                <dl>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>70%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultOpenPortal'>100</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Restoration</div>
                <i>
                  From healing cantrips to mass resurrection, you'll be sure to make good use of these spells.
                </i>Increases team combat with 4x the efficiency of the combat skill and improves the Heal the Sick
                action.
              </div>
              <div class='showthis when-locked' draggable='false'>
                The Explorers' guild tells you of a secret grove within the Jungle, where the barrier between realms is
                weakest. With enough restoration skill, you might be able to open a rift back and leave the shadow
                realm. However, it seems quite a bit of time passes in the portal, and some merchants have closed up
                shop. Unlocked with 75% of the world surveyed. Travels to Forest Path.Buy Mana actions can not be used
                for the rest of the current loop.Requires 1000 Restoration.

                <div class='bold'>Learn skill:</div> <span>Restoration</span>
                (<span class='bold stat-Soul stat-color'>Soul</span>, <span class=' stat-Int stat-color'>Int</span>,

                <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div>
            <button
              id='containerExcursion'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight'
              draggable='true'
            >
              <label>Excursion</label>
              <div style='position:relative'>
                <img src='icons/excursion.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/buyGlasses.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Spd' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 1.2246467991473532e-16,1 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Spd-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.25turn - (0.1turn * var(--pie-ratio))) calc(0.25turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Cha-color) calc(0.6499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7999999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.7999999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Spd-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Pay a local street urchin to show you around town. As a tourist, it feels like you're getting ripped
                off.Cost is reduced by 80% with local guild membership.2× progress with glasses.Currently costs
                <span id='goldCostExcursion'>10</span>
                gold.

                <div class='bold'>Mana Cost:</div> <div id='manaCostExcursion'>25,000</div>
                <dl>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>30%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultExcursion'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Pay a local street urchin to show you around town. As a tourist, it feels like you're getting ripped
                off.Cost is reduced by 80% with local guild membership.2× progress with glasses.Currently costs gold.

                (<span class='bold stat-Spd stat-color'>Spd</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Per stat-color'>Per</span>, <span class=' stat-Cha stat-color'>Cha</span>,
                <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerExplorersGuild'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Explorers' Guild</label>
              <div style='position:relative'>
                <img src='icons/explorersGuild.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 -0.587785252292473,0.8090169943749475 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Per-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Cha-color) calc(0.29999999999999993turn - (0.15turn * var(--pie-ratio))) calc(0.29999999999999993turn + (0.15turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.5499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.75turn - (0.1turn * var(--pie-ratio))) calc(0.75turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Ever feel like there's more stuff out there that you're missing? The Explorer's guild knows it! Learn to
                find more of everything, and with enough standing you'll even be taught new ways to move about the
                world. You can only join 1 guild at a time (including those in Merchanton). On first completion, unlocks
                the Buy Map action in Beginnersville and the Survey action in all zones. If you bring completed maps,
                you'll gain exp as if you surveyed two random incomplete zones (per map). Also gives you 30 maps if you
                have 0 maps. Unlocks new shortcuts for every 25% world survey progress Current world survey progress:

                <div id='totalSurveyProgress'>0</div>%. Unlocked at 10% City seen.
                <span id='goldCostExplorersGuild'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostExplorersGuild'>65,000</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>30%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>30%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultExplorersGuild'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Ever feel like there's more stuff out there that you're missing? The Explorer's guild knows it! Learn to
                find more of everything, and with enough standing you'll even be taught new ways to move about the
                world. You can only join 1 guild at a time (including those in Merchanton). On first completion, unlocks
                the Buy Map action in Beginnersville and the Survey action in all zones. If you bring completed maps,
                you'll gain exp as if you surveyed two random incomplete zones (per map). Also gives you 30 maps if you
                have 0 maps. Unlocks new shortcuts for every 25% world survey progress Current world survey progress:

                <div id='totalSurveyProgress'></div>%. Unlocked at 10% City seen.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class='bold stat-Cha stat-color'>Cha</span>,

                <span class=' stat-Int stat-color'>Int</span>, <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerThievesGuild'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Thieves Guild</label>
              <div style='position:relative'>
                <img src='icons/thievesGuild.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Dex-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.35000000000000003turn - (0.15turn * var(--pie-ratio))) calc(0.35000000000000003turn + (0.15turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.6499999999999999turn - (0.15turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.15turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Learn to transfer wealth to those most in need. You, mostly.Take their tests and earn a rank!Requires
                negative reputation. You can only join 1 guild at a time (including those in Merchanton), and only try
                once. Gives 10 gold per segment completed. Gives (practical magic skill + thievery skill) * (1 + main
                stat / 100) * sqrt(1 + times completed / 1000) * (original mana cost / actual mana cost) progress points
                per mana. Unlocked at 25% City seen.Gives Thievery exp upon segment completion, rather than upon action
                completion.
                <span id='goldCostThievesGuild'></span>

                <div class='bold'>Practical Magic Exp:</div>
                <span id='expGainThievesGuildPractical'>50</span>
                <div class='bold'>Thievery Exp:</div>
                <span id='expGainThievesGuildThievery'>50</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostThievesGuild'>75,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>40%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>30%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>30%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultThievesGuild'>200</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Practical Magic</div>
                <i>Mage Hand, Prestidigitation, Detect Magic, and other useful tricks to help out.</i>Smash Pots and
                Wild Mana costs are reduced to the original / (1 + level / 100) (rounded up). The following actions get
                1% more gold per level in their level range (rounded down). 1-200 Pick Locks 101-300 Short Quests
                201-400 Long Quests
                <div class='bold'>Learn skill:</div> <div class='bold underline'>Thievery</div>
                <i>Allows you to redistribute wealth. Other people's wealth.</i>Increases gold gain from Pick Locks,
                Gamble, and Thieving Guild actions by (1 + level / 60) ^ 0.25.
              </div>
              <div class='showthis when-locked' draggable='false'>
                Learn to transfer wealth to those most in need. You, mostly.Take their tests and earn a rank!Requires
                negative reputation. You can only join 1 guild at a time (including those in Merchanton), and only try
                once. Gives 10 gold per segment completed. Gives (practical magic skill + thievery skill) * (1 + main
                stat / 100) * sqrt(1 + times completed / 1000) * (original mana cost / actual mana cost) progress points
                per mana. Unlocked at 25% City seen.Gives Thievery exp upon segment completion, rather than upon action
                completion.

                <div class='bold'>Learn skill:</div> <span>Practical Magic</span>
                <div class='bold'>Learn skill:</div> <span>Thievery</span>
                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Per stat-color'>Per</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerPickPockets'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden capped'
              draggable='true'
            >
              <label>Pick Pockets</label>
              <div style='position:relative'>
                <img src='icons/pickPockets.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/thievesGuild.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Dex-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.4000000000000001turn - (0.2turn * var(--pie-ratio))) calc(0.4000000000000001turn + (0.2turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Help travelers by making their burdens a bit lighter. Requires thieves guild. Can be completed
                <div id='actionAllowedPockets'>0</div>
                times based on excursion progress and spatiomancy. Pockets picked progress is multiplied by Thieves
                guild multiplier. Rewards <span id='goldCostPickPockets'>2</span>
                gold, multiplied by your Thieves guild multiplier.

                <div class='bold'>Thievery Exp:</div>
                <span id='expGainPickPocketsThievery'>10</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostPickPockets'>20,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>40%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>40%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultPickPockets'>150</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Help travelers by making their burdens a bit lighter. Requires thieves guild. Can be completed
                <div id='actionAllowedPockets'>x</div>
                times based on excursion progress and spatiomancy. Pockets picked progress is multiplied by Thieves
                guild multiplier. Rewards gold, multiplied by your Thieves guild multiplier.

                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class='bold stat-Spd stat-color'>Spd</span>,

                <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerRobWarehouse'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden capped'
              draggable='true'
            >
              <label>Rob Warehouse</label>
              <div style='position:relative'>
                <img src='icons/robWarehouse.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/thievesGuild.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Dex-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.3turn - (0.1turn * var(--pie-ratio))) calc(0.3turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Diversify your skills into inventory management. Requires thieves guild. Unlocked at 100% pockets
                picked. Can be completed <div id='actionAllowedWarehouses'>0</div>
                times based on excursion progress and spatiomancy. Warehouses robbed progress is multiplied by Thieves
                guild multiplier. Rewards <span id='goldCostRobWarehouse'>20</span>
                gold, multiplied by your Thieves guild multiplier.

                <div class='bold'>Thievery Exp:</div>
                <span id='expGainRobWarehouseThievery'>20</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostRobWarehouse'>50,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>40%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultRobWarehouse'>200</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Thievery</div>
                <i>Allows you to redistribute wealth. Other people's wealth.</i>Increases gold gain from Pick Locks,
                Gamble, and Thieving Guild actions by (1 + level / 60) ^ 0.25.
              </div>
              <div class='showthis when-locked' draggable='false'>
                Diversify your skills into inventory management. Requires thieves guild. Unlocked at 100% pockets
                picked. Can be completed <div id='actionAllowedWarehouses'>x</div>
                times based on excursion progress and spatiomancy. Warehouses robbed progress is multiplied by Thieves
                guild multiplier. Rewards gold, multiplied by your Thieves guild multiplier.

                <div class='bold'>Learn skill:</div> <span>Thievery</span>
                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Int stat-color'>Int</span>, <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerInsuranceFraud'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden capped'
              draggable='true'
            >
              <label>Insurance Fraud</label>
              <div style='position:relative'>
                <img src='icons/insuranceFraud.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/thievesGuild.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Int' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 -0.587785252292473,0.8090169943749475 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Int-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Luck-color) calc(0.29999999999999993turn - (0.15turn * var(--pie-ratio))) calc(0.29999999999999993turn + (0.15turn * var(--pie-ratio))),var(--stat-Dex-color) calc(0.5499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.75turn - (0.1turn * var(--pie-ratio))) calc(0.75turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Insurance is a scam, anyway. You're basically Robin Hood. Requires thieves guild. Unlocked at 100%
                warehouses robbed. Can be completed <div id='actionAllowedInsurance'>0</div>
                times based on excursion progress and spatiomancy. Fraud committed progress is multiplied by Thieves
                guild multiplier. Rewards <span id='goldCostInsuranceFraud'>200</span>
                gold, multiplied by your Thieves guild multiplier.

                <div class='bold'>Thievery Exp:</div>
                <span id='expGainInsuranceFraudThievery'>40</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostInsuranceFraud'>100,000</div>
                <dl>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>30%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>30%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>20%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultInsuranceFraud'>250</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Thievery</div>
                <i>Allows you to redistribute wealth. Other people's wealth.</i>Increases gold gain from Pick Locks,
                Gamble, and Thieving Guild actions by (1 + level / 60) ^ 0.25.
              </div>
              <div class='showthis when-locked' draggable='false'>
                Insurance is a scam, anyway. You're basically Robin Hood. Requires thieves guild. Unlocked at 100%
                warehouses robbed. Can be completed <div id='actionAllowedInsurance'>x</div>
                times based on excursion progress and spatiomancy. Fraud committed progress is multiplied by Thieves
                guild multiplier. Rewards gold, multiplied by your Thieves guild multiplier.

                <div class='bold'>Learn skill:</div> <span>Thievery</span>
                (<span class='bold stat-Int stat-color'>Int</span>, <span class='bold stat-Luck stat-color'>Luck</span>,

                <span class=' stat-Dex stat-color'>Dex</span>, <span class=' stat-Spd stat-color'>Spd</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerGuildAssassin'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Assassins Guild</label>
              <div style='position:relative'>
                <img src='icons/guildAssassin.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Dex-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Cha-color) calc(0.35000000000000003turn - (0.15turn * var(--pie-ratio))) calc(0.35000000000000003turn + (0.15turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.5999999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.5999999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.75turn - (0.05turn * var(--pie-ratio))) calc(0.75turn + (0.05turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Join the Assassins guild and learn of their targets across the world. Bring back their hearts to learn
                more secrets from the guild. You can only join 1 guild at a time (including those in Merchanton). On
                first completion, unlocks an Assassinate action in each of the first 8 zones. Gives Assassin exp equal
                to 100 * hearts^2. Unlocked at 100% Insurance Fraud.
                <span id='goldCostGuildAssassin'></span>

                <div class='bold'>Assassination Exp:</div>
                <span id='expGainGuildAssassinAssassin'>100</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostGuildAssassin'>100,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>40%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>30%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultGuildAssassin'>100</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Assassination</div>
                <i>Nothing is true. Everything is permitted.</i>Increases progress of assassination actions, reduces the
                reputation penalty of assassination, and reduces the difficulty scaling of trials by original / (1 +
                level / 2000).
              </div>
              <div class='showthis when-locked' draggable='false'>
                Join the Assassins guild and learn of their targets across the world. Bring back their hearts to learn
                more secrets from the guild. You can only join 1 guild at a time (including those in Merchanton). On
                first completion, unlocks an Assassinate action in each of the first 8 zones. Gives Assassin exp equal
                to 100 * hearts^2. Unlocked at 100% Insurance Fraud.

                <div class='bold'>Learn skill:</div> <span>Assassination</span>
                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class=' stat-Cha stat-color'>Cha</span>,
                <span class=' stat-Luck stat-color'>Luck</span>, <span class=' stat-Per stat-color'>Per</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerInvest'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight'
              draggable='true'
            >
              <label>Invest</label>
              <div style='position:relative'>
                <img src='icons/invest.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Con' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Con-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.35000000000000003turn - (0.15turn * var(--pie-ratio))) calc(0.35000000000000003turn + (0.15turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.6499999999999999turn - (0.15turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.15turn * var(--pie-ratio))),var(--stat-Con-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Invest into the perpetual bank. Invested gold remains between loops. Total gold invested:
                <div id='goldInvested'>0</div> (max 999999999999)
                <span id='goldCostInvest'></span>

                <div class='bold'>Mercantilism Exp:</div>
                <span id='expGainInvestMercantilism'>100</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostInvest'>50,000</div>
                <dl>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>40%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>30%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>30%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultInvest'>100</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Mercantilism</div>
                <i>Smooth talk your way to better rates with the mana merchants.</i>Multiply the mana gain from Buy Mana
                by (1 + level / 60) ^ 0.25 (rounds down).
              </div>
              <div class='showthis when-locked' draggable='false'>
                Invest into the perpetual bank. Invested gold remains between loops. Total gold invested:
                <div id='goldInvested'></div> (max 999999999999)

                <div class='bold'>Learn skill:</div> <span>Mercantilism</span>
                (<span class='bold stat-Con stat-color'>Con</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Per stat-color'>Per</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerCollectInterest'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight'
              draggable='true'
            >
              <label>Collect Interest</label>
              <div style='position:relative'>
                <img src='icons/collectInterest.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Con' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Con-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.35000000000000003turn - (0.15turn * var(--pie-ratio))) calc(0.35000000000000003turn + (0.15turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.6499999999999999turn - (0.15turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.15turn * var(--pie-ratio))),var(--stat-Con-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Collect your interest from the perpetual bank. Gives 0.1% of your total gold invested. Can only be
                collected once per loop. Current interest: <div id='bankInterest'>0</div>
                <span id='goldCostCollectInterest'></span>

                <div class='bold'>Mercantilism Exp:</div>
                <span id='expGainCollectInterestMercantilism'>50</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostCollectInterest'>1</div>
                <dl>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>40%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>30%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>30%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultCollectInterest'>100</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Mercantilism</div>
                <i>Smooth talk your way to better rates with the mana merchants.</i>Multiply the mana gain from Buy Mana
                by (1 + level / 60) ^ 0.25 (rounds down).
              </div>
              <div class='showthis when-locked' draggable='false'>
                Collect your interest from the perpetual bank. Gives 0.1% of your total gold invested. Can only be
                collected once per loop. Current interest: <div id='bankInterest'></div>

                <div class='bold'>Learn skill:</div> <span>Mercantilism</span>
                (<span class='bold stat-Con stat-color'>Con</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Per stat-color'>Per</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerSeminar'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Seminar</label>
              <div style='position:relative'>
                <img src='icons/seminar.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951536,-0.30901699437494723 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -0.5877852522924734,-0.8090169943749473 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L-0.5877852522924734,-0.8090169943749473 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.4turn,var(--stat-Cha-color) calc(0.4turn * var(--pie-ratio)),var(--stat-Luck-color) calc(0.45000000000000007turn - (0.05turn * var(--pie-ratio))) calc(0.45000000000000007turn + (0.05turn * var(--pie-ratio))),var(--stat-Soul-color) calc(0.5499999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.4turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                You can buy entrance to a motivational seminar - learn to be your best self and make people love you.
                You're pretty sure turning back time is the only way you can get off these people's mailing list.Costs
                <span id='goldCostSeminar'>1,000</span>
                gold.Unlocked at 100% City surveyed.

                <div class='bold'>Leadership Exp:</div>
                <span id='expGainSeminarLeadership'>200</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostSeminar'>20,000</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>80%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>10%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultSeminar'>100</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Leadership</div>
                <i>You're ready to start your own cult!</i>Increases the number of followers you can recruit by 1 for
                every 100 levels. Increases your followers' contributions to team combat by (1 + level / 60) ^ 0.25.
              </div>
              <div class='showthis when-locked' draggable='false'>
                You can buy entrance to a motivational seminar - learn to be your best self and make people love you.
                You're pretty sure turning back time is the only way you can get off these people's mailing list.Costs
                gold.Unlocked at 100% City surveyed.

                <div class='bold'>Learn skill:</div> <span>Leadership</span>
                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class=' stat-Luck stat-color'>Luck</span>,

                <span class=' stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerPurchaseKey'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight'
              draggable='true'
            >
              <label>Purchase Key</label>
              <div style='position:relative'>
                <img src='icons/purchaseKey.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Cha' d='M0,0 L0,-1 A1,1 0,1,1 -0.9510565162951536,-0.30901699437494723 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -0.5877852522924734,-0.8090169943749473 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L-0.5877852522924734,-0.8090169943749473 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.4turn,var(--stat-Cha-color) calc(0.4turn * var(--pie-ratio)),var(--stat-Luck-color) calc(0.45000000000000007turn - (0.05turn * var(--pie-ratio))) calc(0.45000000000000007turn + (0.05turn * var(--pie-ratio))),var(--stat-Soul-color) calc(0.5499999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Cha-color) calc(1turn - (0.4turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                With enough money, you can buy the town itself. Then they'll <i>have</i> to let you out.Costs
                <span id='goldCostPurchaseKey'>1,000,000</span>
                gold.

                <div class='bold'>Mana Cost:</div> <div id='manaCostPurchaseKey'>20,000</div>
                <dl>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>80%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>10%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultPurchaseKey'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                With enough money, you can buy the town itself. Then they'll <i>have</i> to let you out.Costs gold.

                (<span class='bold stat-Cha stat-color'>Cha</span>, <span class=' stat-Luck stat-color'>Luck</span>,

                <span class=' stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerSTrial'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Trial of Vanity</label>
              <div style='position:relative'>
                <img src='icons/secretTrial.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/team.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,0,1 0.6374239897486896,-0.7705132427757893 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Str'
                    d='M0,0 L0.6374239897486896,-0.7705132427757893 A1,1 0,0,1 0.9822872507286886,-0.18738131458572474 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.9822872507286886,-0.18738131458572474 A1,1 0,0,1 0.8763066800438635,0.48175367410171543 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.8763066800438635,0.48175367410171543 A1,1 0,0,1 0.36812455268467814,0.9297764858882513 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L0.36812455268467814,0.9297764858882513 A1,1 0,0,1 -0.30901699437494773,0.9510565162951535 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L-0.30901699437494773,0.9510565162951535 A1,1 0,0,1 -0.8443279255020153,0.5358267949789963 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.8443279255020153,0.5358267949789963 A1,1 0,0,1 -0.9921147013144779,-0.12533323356430423 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9921147013144779,-0.12533323356430423 A1,1 0,0,1 -0.684547105928689,-0.7289686274214112 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L-0.684547105928689,-0.7289686274214112 A1,1 0,0,1 -0.06279051952931326,-0.9980267284282716 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.055turn,var(--stat-Dex-color) calc(0.055turn * var(--pie-ratio)),var(--stat-Str-color) calc(0.11000000000000001turn - (0.055turn * var(--pie-ratio))) calc(0.11000000000000001turn + (0.055turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.22000000000000003turn - (0.055turn * var(--pie-ratio))) calc(0.22000000000000003turn + (0.055turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.33turn - (0.055turn * var(--pie-ratio))) calc(0.33turn + (0.055turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.44turn - (0.055turn * var(--pie-ratio))) calc(0.44turn + (0.055turn * var(--pie-ratio))),var(--stat-Cha-color) calc(0.5499999999999999turn - (0.055turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.055turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.66turn - (0.055turn * var(--pie-ratio))) calc(0.66turn + (0.055turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7699999999999999turn - (0.055turn * var(--pie-ratio))) calc(0.7699999999999999turn + (0.055turn * var(--pie-ratio))),var(--stat-Soul-color) calc(0.88turn - (0.055turn * var(--pie-ratio))) calc(0.88turn + (0.055turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.055turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                There is a crowd watching as you and your team step up to the trial, and you're pretty sure some bets
                are made against you. Progress is based on Team Combat. Rewards +1 Bragging Rights.
                <span id='goldCostSTrial'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostSTrial'>100,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>11%</dd>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>11%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>11%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>11%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>11%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>11%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>11%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>11%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>11%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultSTrial'>0</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                There is a crowd watching as you and your team step up to the trial, and you're pretty sure some bets
                are made against you. Progress is based on Team Combat. Rewards +1 Bragging Rights.

                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class='bold stat-Str stat-color'>Str</span>,

                <span class='bold stat-Con stat-color'>Con</span>, <span class='bold stat-Spd stat-color'>Spd</span>,

                <span class='bold stat-Per stat-color'>Per</span>, <span class='bold stat-Cha stat-color'>Cha</span>,

                <span class='bold stat-Int stat-color'>Int</span>, <span class='bold stat-Luck stat-color'>Luck</span>,

                <span class='bold stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerSurveyZ7'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Survey</label>
              <div style='position:relative'>
                <img src='icons/surveyZ7.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Per-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.3turn - (0.1turn * var(--pie-ratio))) calc(0.3turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The explorers guild has taught you how to find what most would miss. Gives max(1,floor(sqrt(average
                survey progress))) exp per action. (Currently
                <div class='surveySkill'>0</div>) Each percent surveyed gives an additional 0.5% findables in this zone
                (additive with Spatiomancy). Costs 1 map and gives 1 completed map, unless this zone's survey is at
                100%.
                <span id='goldCostSurveyZ7'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostSurveyZ7'>80,000</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>40%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultSurveyZ7'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                The explorers guild has taught you how to find what most would miss. Gives max(1,floor(sqrt(average
                survey progress))) exp per action. (Currently
                <div class='surveySkill'>0</div>) Each percent surveyed gives an additional 0.5% findables in this zone
                (additive with Spatiomancy). Costs 1 map and gives 1 completed map, unless this zone's survey is at
                100%.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Spd stat-color'>Spd</span>, <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerAssassinZ7'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Assassinate</label>
              <div style='position:relative'>
                <img src='icons/assassin.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 1.2246467991473532e-16,1 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -0.587785252292474,-0.8090169943749468 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.587785252292474,-0.8090169943749468 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Dex-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.25turn - (0.1turn * var(--pie-ratio))) calc(0.25turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.44999999999999996turn - (0.1turn * var(--pie-ratio))) calc(0.44999999999999996turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.6499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.7999999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.7999999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Discreetly kill your mark in this town. The more well-known you are, for either good or evil, the harder
                pulling this off will be... Gives progress equal to (sqrt(practical) + thievery + assassination) *
                (1+stat/1000) * sqrt(1+completions/100) / max(1,abs(reputation)) / max(1,hearts) * base/actual cost.
                Lose max(0,250*zone-assassination) reputation, regardless of whether you were successful or not. Rewards
                a heart on successful kill.
                <span id='goldCostAssassinZ7'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostAssassinZ7'>50,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>30%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultAssassinZ7'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                Discreetly kill your mark in this town. The more well-known you are, for either good or evil, the harder
                pulling this off will be... Gives progress equal to (sqrt(practical) + thievery + assassination) *
                (1+stat/1000) * sqrt(1+completions/100) / max(1,abs(reputation)) / max(1,hearts) * base/actual cost.
                Lose max(0,250*zone-assassination) reputation, regardless of whether you were successful or not. Rewards
                a heart on successful kill.

                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Per stat-color'>Per</span>, <span class=' stat-Luck stat-color'>Luck</span>,
                <span class=' stat-Int stat-color'>Int</span>)
              </div>
            </button>
          </div>
        </div>
        <div>
          <div>
            <button
              id='containerLeaveCity'
              class='travelContainer actionOrTravelContainer normalActionContainer showthat'
              draggable='true'
            >
              <label>Leave City</label>
              <div style='position:relative'>
                <img src='icons/leaveCity.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Con' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.9510565162951535,0.30901699437494756 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.9510565162951535,0.30901699437494756 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Con-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Spd-color) calc(0.35000000000000003turn - (0.15turn * var(--pie-ratio))) calc(0.35000000000000003turn + (0.15turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.6499999999999999turn - (0.15turn * var(--pie-ratio))) calc(0.6499999999999999turn + (0.15turn * var(--pie-ratio))),var(--stat-Con-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                These people are wolves, it's time to get out of here.Requires the Key to the City.
                <span id='goldCostLeaveCity'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostLeaveCity'>100,000</div>
                <dl>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>40%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>30%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>30%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultLeaveCity'>200</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                These people are wolves, it's time to get out of here.Requires the Key to the City.

                (<span class='bold stat-Con stat-color'>Con</span>, <span class=' stat-Spd stat-color'>Spd</span>,
                <span class=' stat-Per stat-color'>Per</span>)
              </div>
            </button>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div>
            <button
              id='containerSurveyZ8'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Survey</label>
              <div style='position:relative'>
                <img src='icons/surveyZ8.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Per' d='M0,0 L0,-1 A1,1 0,0,1 0.5877852522924732,0.8090169943749473 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.5877852522924732,0.8090169943749473 A1,1 0,0,1 -0.5877852522924734,0.8090169943749472 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.5877852522924734,0.8090169943749472 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.2turn,var(--stat-Per-color) calc(0.2turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.3turn - (0.1turn * var(--pie-ratio))) calc(0.3turn + (0.1turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.5turn - (0.1turn * var(--pie-ratio))) calc(0.5turn + (0.1turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7turn - (0.1turn * var(--pie-ratio))) calc(0.7turn + (0.1turn * var(--pie-ratio))),var(--stat-Per-color) calc(1turn - (0.2turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The explorers guild has taught you how to find what most would miss. Gives max(1,floor(sqrt(average
                survey progress))) exp per action. (Currently
                <div class='surveySkill'>0</div>) Each percent surveyed gives an additional 0.5% findables in this zone
                (additive with Spatiomancy). Costs 1 map and gives 1 completed map, unless this zone's survey is at
                100%.
                <span id='goldCostSurveyZ8'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostSurveyZ8'>90,000</div>
                <dl>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>40%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>20%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>20%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>20%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultSurveyZ8'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                The explorers guild has taught you how to find what most would miss. Gives max(1,floor(sqrt(average
                survey progress))) exp per action. (Currently
                <div class='surveySkill'>0</div>) Each percent surveyed gives an additional 0.5% findables in this zone
                (additive with Spatiomancy). Costs 1 map and gives 1 completed map, unless this zone's survey is at
                100%.

                (<span class='bold stat-Per stat-color'>Per</span>, <span class=' stat-Con stat-color'>Con</span>,
                <span class=' stat-Spd stat-color'>Spd</span>, <span class=' stat-Luck stat-color'>Luck</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerImbueSoul'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked'
              draggable='true'
            >
              <label>Imbue Soul</label>
              <div style='position:relative'>
                <img src='icons/imbueSoul.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Soul' d='M0,0 L0,-1 A1,1 0,1,1 -2.4492935982947064e-16,-1 Z'></path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.5turn,var(--stat-Soul-color) calc(0.5turn * var(--pie-ratio)),var(--stat-Soul-color) calc(1turn - (0.5turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                Resets all talent levels, soulstones, imbue mind and imbue body. Other skills and buffs are unchanged.
                Requires both 500 Imbue Mind and 500 Imbue Body. Increases the exp multiplier of training actions by
                100% and raises all action speeds by 50% per level.
                <span id='goldCostImbueSoul'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostImbueSoul'>5,000,000</div>
                <dl>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>100%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultImbueSoul'>500</div>%

                <div class='bold'>Grants buff:</div> <div class='bold underline'>Imbue Soul</div>
                <i>
                  (Incomplete) Sacrifice everything for the ultimate power. Increases the exp multiplier of training
                  actions by 100% and raises all action speeds by 50% per level.
                </i>
              </div>
              <div class='showthis when-locked' draggable='false'>
                Resets all talent levels, soulstones, imbue mind and imbue body. Other skills and buffs are unchanged.
                Requires both 500 Imbue Mind and 500 Imbue Body. Increases the exp multiplier of training actions by
                100% and raises all action speeds by 50% per level.

                <div class='bold'>Grants buff:</div> <span>Imbue Soul</span>
                (<span class='bold stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerBuildTower'
              class='actionContainer actionOrTravelContainer progressActionContainer showthat actionHighlight'
              draggable='true'
            >
              <label>Build Tower</label>
              <div style='position:relative'>
                <img src='icons/buildTower.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/temporalStone.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Str' d='M0,0 L0,-1 A1,1 0,0,1 0.9510565162951536,0.30901699437494734 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.9510565162951536,0.30901699437494734 A1,1 0,0,1 -0.587785252292473,0.8090169943749475 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L-0.587785252292473,0.8090169943749475 A1,1 0,0,1 -0.9510565162951536,-0.30901699437494723 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Dex'
                    d='M0,0 L-0.9510565162951536,-0.30901699437494723 A1,1 0,0,1 -0.5877852522924734,-0.8090169943749473 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L-0.5877852522924734,-0.8090169943749473 A1,1 0,0,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.15turn,var(--stat-Str-color) calc(0.15turn * var(--pie-ratio)),var(--stat-Con-color) calc(0.29999999999999993turn - (0.15turn * var(--pie-ratio))) calc(0.29999999999999993turn + (0.15turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.5499999999999999turn - (0.1turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.1turn * var(--pie-ratio))),var(--stat-Dex-color) calc(0.7000000000000001turn - (0.05turn * var(--pie-ratio))) calc(0.7000000000000001turn + (0.05turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.7999999999999999turn - (0.05turn * var(--pie-ratio))) calc(0.7999999999999999turn + (0.05turn * var(--pie-ratio))),var(--stat-Str-color) calc(1turn - (0.15turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                You've hit rock bottom and now there's nowhere to go but up. If only you had some way to climb back to
                Valhalla. Requires a Temporal Stone. Hauling and Building persist through loops. Each stone used to
                build removes one from the piles in the various ruins you found along your journey.
                <span id='goldCostBuildTower'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostBuildTower'>250,000</div>
                <dl>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>30%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>30%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>20%</dd>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>10%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>10%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultBuildTower'>100</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                You've hit rock bottom and now there's nowhere to go but up. If only you had some way to climb back to
                Valhalla. Requires a Temporal Stone. Hauling and Building persist through loops. Each stone used to
                build removes one from the piles in the various ruins you found along your journey.

                (<span class='bold stat-Str stat-color'>Str</span>, <span class='bold stat-Con stat-color'>Con</span>,

                <span class=' stat-Per stat-color'>Per</span>, <span class=' stat-Dex stat-color'>Dex</span>,
                <span class=' stat-Spd stat-color'>Spd</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerGTrial'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Trial of the Gods</label>
              <div style='position:relative'>
                <img src='icons/godsTrial.svg' class='superLargeIcon' draggable='false' />
                <img
                  src='icons/team.svg'
                  class='smallIcon'
                  draggable='false'
                  style='position:absolute;margin-top:17px;margin-left:5px;'
                />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,0,1 0.6374239897486896,-0.7705132427757893 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Str'
                    d='M0,0 L0.6374239897486896,-0.7705132427757893 A1,1 0,0,1 0.9822872507286886,-0.18738131458572474 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.9822872507286886,-0.18738131458572474 A1,1 0,0,1 0.8763066800438635,0.48175367410171543 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.8763066800438635,0.48175367410171543 A1,1 0,0,1 0.36812455268467814,0.9297764858882513 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L0.36812455268467814,0.9297764858882513 A1,1 0,0,1 -0.30901699437494773,0.9510565162951535 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L-0.30901699437494773,0.9510565162951535 A1,1 0,0,1 -0.8443279255020153,0.5358267949789963 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.8443279255020153,0.5358267949789963 A1,1 0,0,1 -0.9921147013144779,-0.12533323356430423 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9921147013144779,-0.12533323356430423 A1,1 0,0,1 -0.684547105928689,-0.7289686274214112 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L-0.684547105928689,-0.7289686274214112 A1,1 0,0,1 -0.06279051952931326,-0.9980267284282716 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.055turn,var(--stat-Dex-color) calc(0.055turn * var(--pie-ratio)),var(--stat-Str-color) calc(0.11000000000000001turn - (0.055turn * var(--pie-ratio))) calc(0.11000000000000001turn + (0.055turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.22000000000000003turn - (0.055turn * var(--pie-ratio))) calc(0.22000000000000003turn + (0.055turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.33turn - (0.055turn * var(--pie-ratio))) calc(0.33turn + (0.055turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.44turn - (0.055turn * var(--pie-ratio))) calc(0.44turn + (0.055turn * var(--pie-ratio))),var(--stat-Cha-color) calc(0.5499999999999999turn - (0.055turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.055turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.66turn - (0.055turn * var(--pie-ratio))) calc(0.66turn + (0.055turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7699999999999999turn - (0.055turn * var(--pie-ratio))) calc(0.7699999999999999turn + (0.055turn * var(--pie-ratio))),var(--stat-Soul-color) calc(0.88turn - (0.055turn * var(--pie-ratio))) calc(0.88turn + (0.055turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.055turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                The gods have filled the 100 floors of the tower you built with monsters to stop you from returning to
                Valhalla. Rude. Progress is based on Team Combat. Requires 100% Tower built.
                <span id='goldCostGTrial'></span>

                <div class='bold'>Combat Exp:</div>
                <span id='expGainGTrialCombat'>250</span>
                <div class='bold'>Pyromancy Exp:</div>
                <span id='expGainGTrialPyromancy'>50</span>
                <div class='bold'>Restoration Exp:</div>
                <span id='expGainGTrialRestoration'>50</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostGTrial'>50,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>11%</dd>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>11%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>11%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>11%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>11%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>11%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>11%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>11%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>11%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultGTrial'>20</div>%

                <div class='bold'>Learn skill:</div> <div class='bold underline'>Pyromancy</div>
                <i>
                  Fireball, Fire Bolt, Fire Shield, Burning Rays, just a veritable assortment of flaming fun!
                </i>Increases self combat with 5x the efficiency of the combat skill.
                <div class='bold'>Learn skill:</div> <div class='bold underline'>Restoration</div>
                <i>
                  From healing cantrips to mass resurrection, you'll be sure to make good use of these spells.
                </i>Increases team combat with 4x the efficiency of the combat skill and improves the Heal the Sick
                action.
              </div>
              <div class='showthis when-locked' draggable='false'>
                The gods have filled the 100 floors of the tower you built with monsters to stop you from returning to
                Valhalla. Rude. Progress is based on Team Combat. Requires 100% Tower built.

                <div class='bold'>Learn skill:</div> <span>Pyromancy</span>
                <div class='bold'>Learn skill:</div> <span>Restoration</span>
                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class='bold stat-Str stat-color'>Str</span>,

                <span class='bold stat-Con stat-color'>Con</span>, <span class='bold stat-Spd stat-color'>Spd</span>,

                <span class='bold stat-Per stat-color'>Per</span>, <span class='bold stat-Cha stat-color'>Cha</span>,

                <span class='bold stat-Int stat-color'>Int</span>, <span class='bold stat-Luck stat-color'>Luck</span>,

                <span class='bold stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerGFight'
              class='actionContainer actionOrTravelContainer multipartActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Challenge Gods</label>
              <div style='position:relative'>
                <img src='icons/challengeGods.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Dex' d='M0,0 L0,-1 A1,1 0,0,1 0.6374239897486896,-0.7705132427757893 Z'>
                  </path>
                  <path
                    class='pie-slice stat-Str'
                    d='M0,0 L0.6374239897486896,-0.7705132427757893 A1,1 0,0,1 0.9822872507286886,-0.18738131458572474 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Con'
                    d='M0,0 L0.9822872507286886,-0.18738131458572474 A1,1 0,0,1 0.8763066800438635,0.48175367410171543 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Spd'
                    d='M0,0 L0.8763066800438635,0.48175367410171543 A1,1 0,0,1 0.36812455268467814,0.9297764858882513 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Per'
                    d='M0,0 L0.36812455268467814,0.9297764858882513 A1,1 0,0,1 -0.30901699437494773,0.9510565162951535 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Cha'
                    d='M0,0 L-0.30901699437494773,0.9510565162951535 A1,1 0,0,1 -0.8443279255020153,0.5358267949789963 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Int'
                    d='M0,0 L-0.8443279255020153,0.5358267949789963 A1,1 0,0,1 -0.9921147013144779,-0.12533323356430423 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Luck'
                    d='M0,0 L-0.9921147013144779,-0.12533323356430423 A1,1 0,0,1 -0.684547105928689,-0.7289686274214112 Z'
                  >
                  </path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L-0.684547105928689,-0.7289686274214112 A1,1 0,0,1 -0.06279051952931326,-0.9980267284282716 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.055turn,var(--stat-Dex-color) calc(0.055turn * var(--pie-ratio)),var(--stat-Str-color) calc(0.11000000000000001turn - (0.055turn * var(--pie-ratio))) calc(0.11000000000000001turn + (0.055turn * var(--pie-ratio))),var(--stat-Con-color) calc(0.22000000000000003turn - (0.055turn * var(--pie-ratio))) calc(0.22000000000000003turn + (0.055turn * var(--pie-ratio))),var(--stat-Spd-color) calc(0.33turn - (0.055turn * var(--pie-ratio))) calc(0.33turn + (0.055turn * var(--pie-ratio))),var(--stat-Per-color) calc(0.44turn - (0.055turn * var(--pie-ratio))) calc(0.44turn + (0.055turn * var(--pie-ratio))),var(--stat-Cha-color) calc(0.5499999999999999turn - (0.055turn * var(--pie-ratio))) calc(0.5499999999999999turn + (0.055turn * var(--pie-ratio))),var(--stat-Int-color) calc(0.66turn - (0.055turn * var(--pie-ratio))) calc(0.66turn + (0.055turn * var(--pie-ratio))),var(--stat-Luck-color) calc(0.7699999999999999turn - (0.055turn * var(--pie-ratio))) calc(0.7699999999999999turn + (0.055turn * var(--pie-ratio))),var(--stat-Soul-color) calc(0.88turn - (0.055turn * var(--pie-ratio))) calc(0.88turn + (0.055turn * var(--pie-ratio))),var(--stat-Dex-color) calc(1turn - (0.055turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                This is it. The final showdown. If you can defeat the seven gods, you can finally end all this looping
                nonsense for good. Progress is based on Self Combat. Requires all 100 floors of Trial of the gods
                completed this loop.
                <span id='goldCostGFight'></span>

                <div class='bold'>Combat Exp:</div>
                <span id='expGainGFightCombat'>500</span>
                <div class='bold'>Mana Cost:</div> <div id='manaCostGFight'>50,000</div>
                <dl>
                  <dt class='stat-Dex'>Dex</dt> <dd class='stat-Dex'>11%</dd>
                  <dt class='stat-Str'>Str</dt> <dd class='stat-Str'>11%</dd>
                  <dt class='stat-Con'>Con</dt> <dd class='stat-Con'>11%</dd>
                  <dt class='stat-Spd'>Spd</dt> <dd class='stat-Spd'>11%</dd>
                  <dt class='stat-Per'>Per</dt> <dd class='stat-Per'>11%</dd>
                  <dt class='stat-Cha'>Cha</dt> <dd class='stat-Cha'>11%</dd>
                  <dt class='stat-Int'>Int</dt> <dd class='stat-Int'>11%</dd>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>11%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>11%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultGFight'>50</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                This is it. The final showdown. If you can defeat the seven gods, you can finally end all this looping
                nonsense for good. Progress is based on Self Combat. Requires all 100 floors of Trial of the gods
                completed this loop.

                (<span class='bold stat-Dex stat-color'>Dex</span>, <span class='bold stat-Str stat-color'>Str</span>,

                <span class='bold stat-Con stat-color'>Con</span>, <span class='bold stat-Spd stat-color'>Spd</span>,

                <span class='bold stat-Per stat-color'>Per</span>, <span class='bold stat-Cha stat-color'>Cha</span>,

                <span class='bold stat-Int stat-color'>Int</span>, <span class='bold stat-Luck stat-color'>Luck</span>,

                <span class='bold stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
          <div>
            <button
              id='containerRestoreTime'
              class='actionContainer actionOrTravelContainer normalActionContainer showthat actionHighlight locked hidden'
              draggable='true'
            >
              <label>Restore Time</label>
              <div style='position:relative'>
                <img src='icons/restoreTime.svg' class='superLargeIcon' draggable='false' />
              </div>

              <svg viewBox='-1 -1 2 2' class='stat-pie'>
                <g>
                  <path class='pie-slice stat-Luck' d='M0,0 L0,-1 A1,1 0,1,1 1.2246467991473532e-16,1 Z'></path>
                  <path
                    class='pie-slice stat-Soul'
                    d='M0,0 L1.2246467991473532e-16,1 A1,1 0,1,1 -2.4492935982947064e-16,-1 Z'
                  >
                  </path>
                </g>
              </svg>
              <div
                class='stat-pie mask'
                style='background:conic-gradient(from 0.25turn,var(--stat-Luck-color) calc(0.25turn * var(--pie-ratio)),var(--stat-Soul-color) calc(0.5turn - (0.25turn * var(--pie-ratio))) calc(0.5turn + (0.25turn * var(--pie-ratio))),var(--stat-Luck-color) calc(1turn - (0.25turn * var(--pie-ratio))))'
              >
              </div>
              <div class='showthis when-unlocked' draggable='false'>
                You've done it. With the power of the gods, you can undo this looping nonsense and fix time. Requires
                the powers of the gods.
                <span id='goldCostRestoreTime'></span>

                <div class='bold'>Mana Cost:</div> <div id='manaCostRestoreTime'>7,777,777</div>
                <dl>
                  <dt class='stat-Luck'>Luck</dt> <dd class='stat-Luck'>50%</dd>
                  <dt class='stat-Soul'>Soul</dt> <dd class='stat-Soul'>50%</dd>
                </dl>
                <div class='bold'>Exp Multiplier:</div>
                <div id='expMultRestoreTime'>0</div>%
              </div>
              <div class='showthis when-locked' draggable='false'>
                You've done it. With the power of the gods, you can undo this looping nonsense and fix time. Requires
                the powers of the gods.

                (<span class='bold stat-Luck stat-color'>Luck</span>,
                <span class='bold stat-Soul stat-color'>Soul</span>)
              </div>
            </button>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};
