let d3;
const D3Promise = import('d3').then((module) => {
  d3 = module;
});

let LZString;
const LZStringPromise = import('lz-string').then((module) => {
  LZString = module;
});

let Mousetrap;
const MousetrapPromise = import('mousetrap').then((module) => {
  Mousetrap = module.default;
});
