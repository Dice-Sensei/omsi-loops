let d3;
import('d3').then((module) => {
  d3 = module;
});

let Mousetrap;
const MousetrapPromise = import('mousetrap').then((module) => {
  Mousetrap = module.default;
});
