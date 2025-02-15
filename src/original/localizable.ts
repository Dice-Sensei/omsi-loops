import { Localization } from './localization.ts';

export class Localizable {
  _txtsObj;
  _rootPath;
  _lib;

  get rootPath() {
    return this._rootPath;
  }
  get lib() {
    return this._lib;
  }
  get txtsObj() {
    return this._txtsObj ??= Localization.txtsObj(this._rootPath, this._lib);
  }

  constructor(rootPath, lib) {
    this._rootPath = rootPath;
    this._lib = lib;
  }

  memoize(property, subPath = `>${property}`) {
    let value = this.txtsObj.find(subPath).text();
    if (!value) value = Localization.txt(this._rootPath + subPath, this._lib);

    Object.defineProperty(this, property, { value, configurable: true });

    return value;
  }
}
