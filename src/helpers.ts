import { vals } from './saving.ts';

export function precision3(num) {
  return Number(num.toPrecision(3));
}

export function formatNumber(num) {
  return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/gu, ',');
}

export function copyArray(arr) {
  return JSON.parse(JSON.stringify(arr));
}

export function copyObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function intToString(value, amount, fixPrecision = false) {
  const prefix = value < 0 ? '-' : '';
  value = Math.abs(parseFloat(value));
  if (value >= 10000) {
    return prefix + nFormatter(value, 3, fixPrecision);
  }
  if (value >= 1000) {
    let baseValue = 3;
    if (amount) {
      baseValue = amount;
    }
    const returnVal = parseFloat(value).toFixed(baseValue - 1);
    return `${prefix}${returnVal[0]},${returnVal.substring(1)}`;
  }
  let baseValue = 3;
  if (amount) {
    baseValue = amount;
  }
  return prefix + parseFloat(value).toFixed(baseValue - 1);
}

export function intToStringRound(value) {
  if (value >= 10000) {
    return nFormatter(value, 3);
  }
  return Math.floor(value);
}

export function toSuffix(value) {
  value = Math.round(value);
  const suffixes = [
    '',
    'K',
    'M',
    'B',
    'T',
    'Qa',
    'Qi',
    'Sx',
    'Sp',
    'O',
    'N',
    'Dc',
    'Ud',
    'Dd',
    'Td',
    'qd',
    'Qd',
    'sd',
    'Sd',
    'Od',
    'Nd',
    'V',
  ];
  const suffixNum = Math.floor(((String(value)).length - 1) / 3);
  const shortValue = parseFloat((suffixNum === 0 ? value : (value / Math.pow(1000, suffixNum))).toPrecision(3));
  const valueRepr = shortValue % 1 !== 0 ? shortValue.toPrecision(3) : shortValue.toString();
  return valueRepr + suffixes[suffixNum];
}

export const Mana = {
  ceil(value, minNonZero) {
    return value === 0
      ? 0
      : !vals.options.fractionalMana
      ? Math.ceil(value)
      : !minNonZero
      ? value
      : value > 0
      ? Math.max(value, minNonZero)
      : Math.min(value, -minNonZero);
  },

  floor(value, minNonZero) {
    return value === 0
      ? 0
      : !vals.options.fractionalMana
      ? Math.floor(value)
      : !minNonZero
      ? value
      : value > 0
      ? Math.max(value, minNonZero)
      : Math.min(value, -minNonZero);
  },

  round(value, minNonZero) {
    return value === 0
      ? 0
      : !vals.options.fractionalMana
      ? Math.round(value)
      : !minNonZero
      ? value
      : value > 0
      ? Math.max(value, minNonZero)
      : Math.min(value, -minNonZero);
  },
};

export function clamp(value, min, max) {
  value = Math.max(value, min ?? -Infinity);
  value = Math.min(value, max ?? Infinity);
  return value;
}

const si = [
  { value: 1E63, symbol: 'V' },
  { value: 1E60, symbol: 'Nd' },
  { value: 1E57, symbol: 'Od' },
  { value: 1E54, symbol: 'Sd' },
  { value: 1E51, symbol: 'sd' },
  { value: 1E48, symbol: 'Qd' },
  { value: 1E45, symbol: 'qd' },
  { value: 1E42, symbol: 'Td' },
  { value: 1E39, symbol: 'Dd' },
  { value: 1E36, symbol: 'Ud' },
  { value: 1E33, symbol: 'Dc' },
  { value: 1E30, symbol: 'N' },
  { value: 1E27, symbol: 'O' },
  { value: 1E24, symbol: 'Sp' },
  { value: 1E21, symbol: 'Sx' },
  { value: 1E18, symbol: 'Qi' },
  { value: 1E15, symbol: 'Qa' },
  { value: 1E12, symbol: 'T' },
  { value: 1E9, symbol: 'B' },
  { value: 1E6, symbol: 'M' },
  { value: 1E3, symbol: 'K' },
];

const rx = /\.0+$|(\.[0-9]*[1-9])0+$/u;

export function nFormatter(num, digits, fixPrecision = false) {
  for (let i = 0; i < si.length; i++) {
    // /1.000501 to handle rounding
    if (num >= si[i].value / 1.000501) {
      // not the most elegant way to implement fixPrecision but whatever
      return (num / si[i].value).toPrecision(digits).replace(rx, fixPrecision ? '$&' : '$1') + si[i].symbol;
    }
  }
  return num.toPrecision(digits).replace(rx, fixPrecision ? '$&' : '$1');
}

export function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/gu, (match, index) => {
    if (Number(match) === 0) return '';
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

const fibonaccis = [];
export function fibonacci(n) {
  if (n === 0 || n === 1 || n === undefined) {
    return 1;
  }
  if (fibonaccis[n] > 0) {
    return fibonaccis[n];
  }
  return fibonaccis[n] = fibonacci(n - 1) + fibonacci(n - 2);
}
export function addClassToDiv(div, className) {
  const arr = div.className.split(' ');
  if (arr.indexOf(className) === -1) {
    div.className += ` ${className}`;
  }
}
export function removeClassFromDiv(div, className) {
  div.classList.remove(className);
}

const wrappedElementSymbol = Symbol('wrappedElement');
export function getElement(
  elementOrId,
  expectedClass = Element,
  throwIfMissing = true,
  warnIfMissing = true,
) {
  const expectedClasses = Array.isArray(expectedClass) ? expectedClass : [expectedClass];
  const element = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
  for (const expected of expectedClasses) {
    if (element instanceof expected) return element;
  }
  if (element && wrappedElementSymbol in element) {
    // last try before bailing
    const wrappedResult = getElement(
      element[wrappedElementSymbol],
      expectedClasses,
      false,
      false,
    );
    if (wrappedResult) return element; // returning the wrapper so it can intercept IDL behaviors
  }
  if (warnIfMissing) {
    console.warn('Expected element missing or wrong type!', elementOrId, expectedClass, element);
  }
  if (throwIfMissing) {
    throw new Error(
      `Expected to find element of type ${
        expectedClasses.map((c) => c.name).join('|')
      } with ${elementOrId}, instead found ${element}!`,
    );
  }
  return undefined;
}
export function htmlElement(elementOrId, throwIfMissing = true, warnIfMissing = true) {
  return getElement(elementOrId, HTMLElement, throwIfMissing, warnIfMissing);
}
export function inputElement(elementOrId, throwIfMissing = true, warnIfMissing = true) {
  return getElement(elementOrId, HTMLInputElement, throwIfMissing, warnIfMissing);
}
export function textAreaElement(elementOrId, throwIfMissing = true, warnIfMissing = true) {
  return getElement(elementOrId, HTMLTextAreaElement, throwIfMissing, warnIfMissing);
}
export function selectElement(elementOrId, throwIfMissing = true, warnIfMissing = true) {
  return getElement(elementOrId, HTMLSelectElement, throwIfMissing, warnIfMissing);
}
export function valueElement(elementOrId, throwIfMissing = true, warnIfMissing = true) {
  return getElement(
    elementOrId,
    [HTMLInputElement, HTMLTextAreaElement, HTMLSelectElement],
    throwIfMissing,
    warnIfMissing,
  );
}

const numbers =
  'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'
    .split(' ');

const tens = 'twenty thirty forty fifty sixty seventy eighty ninety'.split(' ');

export function number2Words(n) {
  if (n < 20) return numbers[n];
  const digit = n % 10;
  if (n < 100) return tens[~~(n / 10) - 2] + (digit ? `-${numbers[digit]}` : '');
  if (n < 1000) return `${numbers[~~(n / 100)]} hundred${n % 100 === 0 ? '' : ` ${number2Words(n % 100)}`}`;
  return `${number2Words(~~(n / 1000))} thousand${n % 1000 === 0 ? '' : ` ${number2Words(n % 1000)}`}`;
}

export function capitalizeFirst(s) {
  return s.charAt(0).toUpperCase() + s.substr(1);
}

export function numberToWords(n) {
  return capitalizeFirst(number2Words(n));
}

export function extractStrings(object, strings, map) {
  const isToplevel = strings == undefined;
  strings ??= [];
  map ??= {};
  function extract(v) {
    if (typeof v === 'string' || typeof v === 'number') {
      if (!(v in map)) {
        map[v] = strings.length;
        strings.push(v);
      }
      return map[v];
    }
    return extractStrings(v, strings, map);
  }
  if (object?.toJSON) object = object.toJSON();
  if (Array.isArray(object)) {
    const arr = [];
    for (const i in object) {
      arr[i] = extract(object[i]);
    }
    return isToplevel ? [strings, arr] : arr;
  } else if (object && typeof object === 'object') {
    const exObj = {};
    for (const prop in object) {
      const idx = extract(prop);
      const v = extract(object[prop]);
      exObj[idx] = v;
    }
    return isToplevel ? { '': strings, ...exObj } : exObj;
  }
  return object;
}

export function restoreStrings(object, strings) {
  const isTopLevel = strings == undefined;
  if (isTopLevel) {
    if (Array.isArray(object)) {
      [strings, object] = object;
    } else {
      let { '': s, ...o } = object;
      strings = s;
      object = o;
    }
  }
  function restore(v) {
    if (typeof v === 'string') v = parseInt(v);
    if (typeof v === 'number') return strings[v];
    return restoreStrings(v, strings);
  }
  if (Array.isArray(object)) {
    const arr = [];
    for (const i in object) {
      arr[i] = restore(object[i]);
    }
    return arr;
  } else if (object && typeof object === 'object') {
    const resObj = {};
    for (const prop in object) {
      const v = object[prop];
      resObj[restore(prop)] = restore(v);
    }
    return resObj;
  }
  return object;
}

export async function delay(milliseconds) {
  await new Promise((r) => setTimeout(r, milliseconds));
}

export function nextIdle(idleRequestOptions) {
  return new Promise((r) => requestIdleCallback(r, idleRequestOptions));
}

export function beep(duration) {
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();

  // stop/start for new browsers, on/off for old
  osc.connect(ctx.destination);
  if (osc.noteOn) osc.noteOn(0);
  if (osc.start) osc.start();

  setTimeout(() => {
    if (osc.noteOff) osc.noteOff(0);
    if (osc.stop) osc.stop();
  }, duration);
}
