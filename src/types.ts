import type { StatGraph } from './stats-graph.ts';

declare global {
  interface Trash {
    StatGraph: typeof StatGraph;
  }

  var trash: Trash;
}

globalThis.trash ??= {} as Trash;

export type Stat = {
  name: StatName;
  short_form: StatName;
  manaMultiplier: number;
};

export type StatName = 'Dex' | 'Str' | 'Con' | 'Spd' | 'Per' | 'Cha' | 'Int' | 'Luck' | 'Soul';
export type StatRecord = Record<StatName, Stat>;

declare global {
  var statList: StatName[];
  var stats: StatRecord;
}
