export enum Menu {
  Changelog = 'changelog',
  Save = 'save',
  Faq = 'faq',
  Options = 'options',
  Extra = 'extras',
  Challenge = 'challenges',
  Statistic = 'totals',
  Prestige = 'prestige_bonus',
}

export namespace MenuNs {
  export const list = [
    Menu.Changelog,
    Menu.Save,
    Menu.Faq,
    Menu.Options,
    Menu.Extra,
    Menu.Challenge,
    Menu.Statistic,
    Menu.Prestige,
  ];
}
