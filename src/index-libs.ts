import * as d3 from 'd3';
import LZString from 'lz-string';
import { default as Mousetrap } from 'mousetrap';

declare global {
  interface Trash {
    d3: typeof d3;
    LZString: typeof LZString;
    Mousetrap: typeof Mousetrap;
  }
}

globalThis.trash ??= {} as Trash;
globalThis.trash.d3 = d3;
globalThis.trash.LZString = LZString;
globalThis.trash.Mousetrap = Mousetrap;
