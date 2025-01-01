import * as d3 from 'd3';
import LZString from 'lz-string';
import { default as Mousetrap } from 'mousetrap';

globalThis.trash ??= {};
globalThis.trash.d3 = d3;
globalThis.trash.LZString = LZString;
globalThis.trash.Mousetrap = Mousetrap;
