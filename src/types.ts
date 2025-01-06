export type Stat = {
  name: StatName;
  short_form: StatName;
  manaMultiplier: number;
};

export type StatName = 'Dex' | 'Str' | 'Con' | 'Spd' | 'Per' | 'Cha' | 'Int' | 'Luck' | 'Soul';
export type StatRecord = Record<StatName, Stat>;
