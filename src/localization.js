// @ts-check

const Localization = {
  // config
  // set to true for more console.log
  debug: false,
  defaultLang: 'en-EN',
  supportedLang: {
    'en-EN': 'English',
  },
  // key used in the get parameter of the URL to set a specific language
  getKey: 'lg',
  // html selector of the div to put the localization menu in
  handle: '#localization_menu',

  // ready detection
  isReady: false,
  /** @type {Promise} */
  ready: null,
  _resolveReady: (v) => {},

  // vars
  currentLang: null,
  libs: {},
  lastLib: null,

  // ====== PUBLIC ======
  // starts up the module
  init() {
    Localization.ready = new Promise((r) => Localization._resolveReady = r);
    Localization.currentLang = Localization.getUrlVars()[Localization.getKey];
    if (typeof (Localization.currentLang) === 'undefined') {
      Localization.currentLang = Localization.defaultLang;
    }
  },
  // to load a specific lib and have an optional callback
  loadLib(libName, callback) {
    Localization.loadXML(libName, function (xmlData) {
      Localization.saveLib(libName, xmlData);
      if (typeof callback !== 'undefined') callback.call(this);
    });
  },
  setReady() {
    Localization._resolveReady?.(Localization);
    delete Localization._resolveReady;
    Localization.isReady = true;
  },
  // lib can be ignored to use the last used lib. returns the text for the given key
  /** @type {(path: string, lib?: string) => string} */
  txt(path, lib) {
    // eslint-disable-next-line no-param-reassign
    if (typeof lib === 'undefined') lib = 'game';
    const libObject = $(Localization.libs[lib]);
    let txt;
    if (libObject.length) txt = $(Localization.libs[lib]).find(path).text();

    if (txt === '') {
      console.warn(`Missing text in lang '${Localization.currentLang}' for key ${path} in lib ${lib}`);
      txt = $(Localization.libs.fallback).find(path).text();
      if (txt === '') {
        console.warn(`Missing fallback for key ${path}`);
        txt = `[${path}]`;
      }
    }
    return txt;
  },
  // lib can be ignored to use the last used lib. returns the texts for the given key as objects
  /** @returns {JQuery<Element>} */
  txtsObj(path, lib) {
    if (typeof lib === 'undefined') return $(Localization.libs[Localization.lastLib]).find(path);
    return $(Localization.libs[lib]).find(path);
  },
  // will update every dom element using the .localized class, with a valid js-data "lockey"
  localizePage(lib) {
    $('.localized').each((_index, localizedElement) => {
      $(localizedElement).html(Localization.txt($(localizedElement).data('lockey'), lib));
    });
  },

  // ====== PRIVATE ======
  saveLib(libName, xmlData) {
    if (Localization.debug) {
      console.log(`Loaded lib ${libName} : `, xmlData);
    }
    Localization.libs[libName] = xmlData;
    Localization.lastLib = Localization.lastLib === null ? libName : Localization.lastLib;
  },
  // function triggered by the localization menu
  change() {
    const vars = Localization.getUrlVars();
    vars.lg = $(Localization.handle).val();
    globalThis.location.href = `${globalThis.location.origin + globalThis.location.pathname}?${$.param(vars)}`;
  },
  loadXML(libName, callback) {
    if (libName === 'fallback') $.get('locales/en-EN/game.xml', null, callback, 'xml');
    else $.get(`locales/${Localization.currentLang}/${libName}.xml`, null, callback, 'xml');
  },
  getUrlVars() {
    const vars = {};
    const _ = globalThis.location.href.replace(/[?&]+([^=&]+)=([^&]*)/giu, (_m, key, value) => {
      return vars[key] = value;
    });
    return vars;
  },
};

class Localizable {
  #txtsObj;
  #rootPath;
  #lib;

  get rootPath() {
    return this.#rootPath;
  }
  get lib() {
    return this.#lib;
  }
  get txtsObj() {
    return this.#txtsObj ??= Localization.txtsObj(this.#rootPath, this.#lib);
  }

  /** @param {string} rootPath @param {string} [lib] */
  constructor(rootPath, lib) {
    this.#rootPath = rootPath;
    this.#lib = lib;
  }

  /** @param {string} subPath  */
  txt(subPath) {
    const txt = this.txtsObj.find(subPath).text();

    return txt !== '' ? txt : Localization.txt(this.#rootPath + subPath, this.#lib);
  }

  memoizeValue(property, value) {
    if (Object.hasOwn(this, property)) {
      delete this[property];
    }
    Object.defineProperty(this, property, { value, configurable: true });
    return value;
  }

  memoize(property, subPath) {
    subPath ??= `>${String(property)}`;
    const value = this.txt(subPath);

    return this.memoizeValue(property, value);
  }
}
