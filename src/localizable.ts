import { Localization } from './localization.ts';

export class Localizable {
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

  constructor(rootPath, lib) {
    this.#rootPath = rootPath;
    this.#lib = lib;
  }

  memoize(property, subPath = `>${property}`) {
    let value = this.txtsObj.find(subPath).text();
    if (!value) value = Localization.txt(this.#rootPath + subPath, this.#lib);

    Object.defineProperty(this, property, { value, configurable: true });

    return value;
  }
}
