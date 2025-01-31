import { title } from 'node:process';

export type ChangelogEntry = {
  name: string;
  date: string;
  changes: string[];
};

export const translationsEn = {
  game: {
    title: 'omsi-loops',
  },
  actions: {
    amounts: {
      title: 'Amount',
    },
  },
  misc: {
    loading: 'Loading...',
  },
  menu: {
    enable: {
      title: 'Enabled menus',
    },
    changelog: {
      title: 'Changelog',
      version: 'Version',
      versions: [
        {
          name: '3P.1.2',
          date: '2024-03-19',
          changes: [
            `Fixed the first Wander action failing when fractional mana consumption is enabled in Extras.`,
            `The two-column layout in the responsive UI now sets a minimum height for the Action List.`,
          ],
        },
        {
          name: '3P.1.1',
          date: '2024-03-01',
          changes: [
            `Writing update! A great many brand-new action stories have been contributed by Inferno Vulpix, Nikki, and scout from the Discord, along with lots of very welcome proofreading and other improvements! You'll find their writing all over, but my favorite might be the new storyline for the Wizard College in zone 5. Check the Action Stories tab - even actions you've already completed might have surprises for you!`,
            `The inline stat bars should show up properly on all browsers now, I think.`,
            `Progress bars (like for Wander) now use the inline style as well, to take up less space on the screen.`,
            `Collapsing a zone in the Action List (using the arrows button) now uses the same logic as the functionality for snapping actions to their appropriate zones. This means, among other things, that trying to collapse an invalid travel action (one where you weren't in the right zone to begin with) will do nothing.`,
            `Town info bars can now be hidden on a per-zone, per-action basis. Click the eye icon to the right of the zone name.`,
          ],
        },
        {
          name: '3.P16.25',
          date: '2024-02-27',
          changes: [
            `Removed the Adblock Plus warning, which is no longer relevant.`,
            `Edited the final Pyromancy action story to make the reference clearer.`,
            `Mana remaining should now display with fixed precision, making the screen a little less jumpy.`,
            `Tweaked the display algorithm of the Actions List while the predictor is active, to allow buttons and predictions to coexist better. Hopefully.`,
            `Holding shift while clicking the "Clear List" button will clear only the disabled actions from your action list.`,
            `Holding shift will indicate which actions can be added at cap by holding shift while clicking.`,
            `The tooltips for the Prestige Mental and Physical buffs now also note that they affect stats, just like their Prestige menu tooltips.`,
            `The Fractional Mana option will auto-disable itself when you prestige, since the first Wander action can fail when it's enabled.`,
            `The "Open Rift" and "Open Portal" actions are now correctly recognized as travel actions, for the purposes of display styling and actions snapping to zones.`,
            `Endgame actions that show up in earlier zones now appear at the end of the respective zone's action buttons, just before the zone travel actions.`,
          ],
        },
        {
          name: '3.P16.24',
          date: '2024-02-20',
          changes: [
            `When no input field has focus, the digits 1-9 now act as hotkeys to set the Amount field directly to that value, the 0 key multiplies it by 10, and Backspace removes the last digit. (Other hotkeys are unchanged and can be viewed by hovering the Hotkeys option.)`,
            `Inline stat bars should now display properly when you have no soulstones.`,
            `Fixed Prestige Mental/Physical tooltips to note that they affect stats, not skills. Thanks to Kagato87 from the discord for the heads-up!`,
            `By request of Mithlug from the discord, your total level, talent, and soulstones can be seen in full by hovering the Total line in the stats panel. The other stat tooltips will now also show these numbers in full, rather than abbreviated.`,
            `The current zone color is now used to decorate the town area, to improve the association with the action list backgrounds.`,
            `The on/off state of bonus seconds will now be saved with the game, and the current state is visible in the UI. Thank you so much to juulsezaar from the discord for the request, I'd been meaning to get to this one for a while! ♥`,
            `By popular acclaim, actions will now sort themselves into the right zone when adding actions to the list or when dragging actions around within the list. The up and down arrows still let you move actions to impossible places, if you really want to.`,
          ],
        },
        {
          name: '3.P16.23',
          date: '2024-02-11',
          changes: [
            `Build Tower now displays progress with linear scaling, so the percentage displayed will be accurate to the amount of progress required. This does not change the actual progress required, only how it is displayed.`,
            `Fixed a bug that prevented Action Log entries from properly merging with each other when the Action Log is hidden, which allowed the log to grow to an unbounded size. Added code to fix unmerged log entries on game load.`,
            `Added detection and warning for if your game save exceeds your browser's localStorage quota, like for example as a result of the above bug. Many apologies to OWD from the Discord for the lost progress, but thanks for bringing it to my attention!`,
            `The "Use stat colors in menu and tooltips" option now defaults to on for new games, because I like colorful things. This should not affect existing games, and you can turn it off if it's too much or makes things hard to read.`,
          ],
        },
        {
          name: '3.P16.22',
          date: '2024-02-09',
          changes: [
            `Yet more typos quashed.`,
            `Adjusted visibility conditions for some actions.`,
            `Added world survey display. Thanks to Eyel from the Discord for the idea!`,
            `Added inline level, talent, and soulstone bars for the Stats panel in the responsive UI, and rearranged the two-column layout to take advantage of the smaller footprint.`,
            `Stat bars now have a faded right edge to signify that they don't have a maximum, and they will rescale more often so that more of the bar width gets used more often.`,
            `The action list should stop scrolling up when you click action buttons in Chrome.`,
            `Loop numbers now display in full in the Action Log.`,
            `Fixed the story unlock conditions for the Haul action.`,
          ],
        },
        {
          name: '3.P16.21',
          date: '2024-02-05',
          changes: [
            `More typo fixes in tooltips and action stories.`,
            `The "Time Spent" statistic that appears when you hover an action you completed this loop now measures effective in-game time, rather than realtime. In other words, it won't change based on whether or not Bonus Seconds is enabled.`,
            `Another statistic, "Time In Loop", has been added, which measures the total amount of effective in-game time you'd spent in this loop so far, at the time you finished the action. Just in case you ever have a need for that information—iykyk.`,
            `The Wizard College has tightened its requirements for whom it is willing to teach its secrets to: you are now required to enroll prior to attending your first class.`,
            `The Responsive UI is no longer experimental! It is now enabled by default for new games (but can still be turned off from the Options menu). Existing games should not be affected.`,
            `The initial story describing how you got into this mess will now show up in the Action Log when you start a new game, to reduce some amount of "what am I doing here" from new players.`,
            `It wouldn't be an Idle Loops update without small fixes for tooltip behavior. In particular, predictor tooltips should no longer obscure the predictor display in the classic UI.`,
          ],
        },
        {
          name: '3.P16.20',
          date: '2024-01-31',
          changes: [
            `Many updates to the responsive UI, which should be better-behaved in Chrome and related browsers now. Give it a try; or, alternatively, don't.`,
            `Broke, and then fixed, the background predictor thread. It should disable more fully now, when disabled.`,
            `Broke, and then fixed, the prestige mechanic. Really on a roll here.`,
            `Fixed an issue where multiple actions would get added to the list when you click the button once. (Might have broken it first. Hard to say.)`,
            `General code cleanup, moving all prestige code into a single file where it will be safe from meddling. (It won't be.)`,
            `Added a workaround for the bug that causes "NaN" to show up in the predictor. Now it should show question marks instead.`,
            `Merged a PR from slabdrill on the Discord, updating lots of tooltips to match the game logic and addressing some long-standing calculation issues: the Imbue Soul buff and Thievery skill now have a multiplicative, rather than additive, effect. Thanks slabdrill!`,
          ],
        },
        {
          name: '3.P16.19',
          date: '2024-01-22',
          changes: [
            `Spatiomancy training should no longer cause the game to slow to a crawl.`,
            `Many fixes to toolips and action stories. Big thanks to slabdrill from the Discord for the PR!`,
            `Imbue Body is now displayed as a "capped" rather than a "locked" action when it reaches its limit.`,
            `The game now auto-saves whenever you change an option. Huge thank you to kopita from the Discord for the brilliant and obvious-in-retrospect suggestion.`,
            `The data layer now has the ability to pass gamestate between threads.`,
            `Relatedly, the predictor (when enabled) now runs in a background thread by default. This should significantly increase its performance, especially while the game is running, but if it causes problems the background thread can be disabled from the Extras menu.`,
            `Soulstones will now try and keep themselves somewhat closer to each other in count when sacrificing them. I have discovered a truly marvelous explanation for this algorithm, which this changelog is too narrow to contain.`,
          ],
        },
        {
          name: '3.P16.18',
          date: '2024-01-15',
          changes: [
            `When sacrificing soulstones, each stat will lose an amount proportional to how many soulstones you have in each stat rather than attempting to equalize the number of soulstones you have across stats.`,
            `The "Mana Used" display at the bottom of the current actions list is now always in two lines, to avoid some of the jumpiness of the page in Responsive UI mode.`,
            `FAQ menu now displays entries like the Changelog menu does. Also, you can now copy text from the Changelog and the FAQ (just click the header to pin the entry in place first).`,
            `Typo fixes and typing fixes.`,
            `Sparkles.`,
          ],
        },
        {
          name: '3.P16.17',
          date: '2024-01-10',
          changes: [
            `The Statistics panel now shows your current level, talent, and soulstones as bars under each stat. The display of progress to next stat level or talent level is now shown in a colored box behind that number.`,
            `The Changelog seems to have gotten taller than some people's screens, somehow. Now it will keep itself contained in the viewport and scroll entries.`,
            `Finally fixed the tooltip issues for real, I think, I hope.`,
            `If the game detects that it's lagging (usually because the Bonus Time multiplier is set too high) it will report it in the Bonus Seconds tooltip.`,
            `The game no longer does a rapid (but potentially very long) catchup if the computer wakes up from sleep with the tab already open. It'll come back as a proper feature soon, don't worry.`,
            `Added "Zen" and "Zen Dark" color schemes, which are a 180° palette rotation from the default colors, for those who miss the old inverse-color magenta look.`,
            `Progress bar tracks in dark mode are now a slightly more visible dark gray, rather than flat black. Also, they line up properly against the right edge. Thanks to deadling from the discord for the sharp eye!`,
            `The predictor can now be enabled and disabled without reloading the page, and it should stop repeating numbers at high bonus speeds. This also resolves the issue of phantom scrollbars appearing on the actions list with the predictor enabled. Thanks very much to Kagato87 from the discord for the invaluable testing help!`,
            `Individual menus can now be shown or hidden by hovering the menu icon in the upper-left. The list of disabled menus is only saved in your browser and is not part of the saved game.`,
            `The Action Log will no longer be quite so attention-grabbing and no longer scrolls the screen when new log entries are added. Say hello to the little "End of log" text; if you keep that in view, then all new entries will push old ones up above the scroll.`,
            `The Action Log will try and keep itself scrolled to the same point when switching zones or when resizing the window in Responsive UI mode.`,
          ],
        },
        {
          name: '3.P16.16',
          date: '2024-01-07',
          changes: [
            `More colors in more places! The "Use stat colors in menu" option now colors the stat name and your current level in the Stats display, as well as stat names in action tooltips.`,
            `Some of the stat colors were hard to distinguish against the background, so all stat colors have been tweaked to be easier on the eyes, in both light and dark themes.`,
            `You can now turn on an option that shows an indicator of what stats each action requires, without having to mouse-over.`,
            `The Action Log will now record whenever you gain a new buff or increase the level of an existing buff, along with how much you paid for it.`,
            `The "Bonus Seconds" tooltip now properly reflects any changes to bonus speed from the Extras menu.`,
            `Still trying to get the tooltips to position properly, but they should be behaving at least somewhat better now, the little gremlins.`,
            `The tooltip for Mana Wells now updates to reflect the amount of mana in them at that moment in time.`,
            `The tooltips in zone 6 now properly hide their contents before you unlock them.`,
            `Some rendering fixes for various browsers that weren't playing nice with the CSS I've been writing.`,
            `Lots—and I mean LOTS—of typechecking comments have been added to the code. This doesn't change anything about how the game runs, but it makes me happier.`,
          ],
        },
        {
          name: '3.P16.15',
          date: '2023-12-18',
          changes: [
            `Fixed a bug where skill experience would not get awarded if the amount of exp wasn't an integer.`,
          ],
        },
        {
          name: '3.P16.14',
          date: '2023-12-16',
          changes: [
            `Initial reimplementation of the radar graph in SVG, using the D3 library.`,
            `Fixed alignment errors with multipart progress bars and with stats, when text overflows.`,
            `Progress bar actions now display a full, rather than an empty, Exp bar once progress reaches 100% - thanks to Velociraptured from the discord for the suggestion!`,
          ],
        },
        {
          name: '3.P16.13',
          date: '2023-12-13',
          changes: [
            "The Dark theme has been completely redone using actual colors rather than a CSS inversion filter. All text should now be readable without having to switch filters around. (This does break the radar graph view of stats, sorry. I'm working on that.)",
          ],
        },
        {
          name: '3.P16.12',
          date: '2023-12-12',
          changes: [
            "Many, many small optimizations, and many more yet to come. This probably won't affect you... unless you like setting your Bonus Speed really high. In that case, you might find that you can set it even higher.",
            'Added unlock conditions to the "Buy Supplies" tooltip in Beginnersville. Thanks to Velociraptured on the discord for the report!',
            "Action stories will not show up in the Action Log until you've completed the associated action at least once.",
            'The extra settings for the predictor are available in the Extras menu again. Whoops.',
            "You can now borrow Bonus Seconds from the Extras menu. It's up to you whether the Extras menu gets them back.",
          ],
        },
        {
          name: '3.P16.11',
          date: '2023-12-10',
          changes: [
            "Fixed story unlock conditions for global story chapters 7-10, so that the game doesn't tell you about [redacted] before you even see [redacted].",
            'Fixed a bug that could cause a softlock with multipart action bars when fractional mana consumption was enabled. Thanks very much to potetgull from the discord for the reproduction!',
            "Fixed the tooltips not displaying over each Challenge type, so you know what you're getting into before you click.",
            "Tooltips are a little less sticky now, so you don't have to keep clicking on the background to dismiss them.",
            "The predictor should cause less UI lag now. (This may cause predictions to take longer, but you should still be able to modify the action list while it's going.)",
          ],
        },
        {
          name: '3.P16.10',
          date: '2023-12-08',
          changes: [
            "Added Dark Cubic theme, for people who really like square borders but don't like eye strain, because why not.",
            "Fixed tab navigation on most controls; the game should now be playable by keyboard. Can't say it'll be easy but it should work, at least.",
            'As a happy side effect of the above, most tooltip-style popovers should stay visible if you click to focus in them. Accessibility benefits everyone!',
            'Fixed a bug that could cause the game to freeze at extremely high Talent levels.',
            'First attempts at making a mobile version of the UI (only in Responsive mode).',
          ],
        },
        {
          name: '3.P16.9',
          date: '2023-12-07',
          changes: [
            'Added cloud saves via Google Drive. Many thanks to Mawan from the discord for the testing help!',
            'Many improvements to the Action Log. Enabled by default and no longer marked experimental!',
            'Tooltip display has been improved, and menus will no longer close if the focus is inside them.',
            'Town progress displays now align column-wise in both the classic and responsive UI, from a great suggestion by Ham5terzilla on the discord!',
          ],
        },
        {
          name: '3.P16.8',
          date: '2023-12-04',
          changes: [
            "There is now an option to enable fractional mana usage, for late-game actions where the mana cost is less than 1. This may cause issues and the predictor doesn't account for it, so it is disabled by default.",
            'Fixing some layout issues with the responsive UI.',
            'Adding an experimental Action Log, which reports interesting things that happen (currently: global stories, action stories, skill levels, and soulstones from actions) during a play session.',
            'Fixed a mana accounting bug that could cause up to double mana consumption in some cases.',
            'Actions with multipart progress bars will no longer go past their expected limits if too much progress is made in 1 tick.',
            'Options that change the game balance have been moved to the Extras menu.',
            'Fixed a game-breaking bug, whoops. Sorry folks!',
          ],
        },
        {
          name: '3.P16.7',
          date: '2023-12-03',
          changes: [
            'Dark theme now has different variants to choose from, representing different color filter methods, so you can choose which works best for your computer/monitor/eyes/taste. Thank you to zenonline for making the request!',
            'Enabling the predictor no longer causes the action list to overflow in the experimental responsive UI. (This is part of why it\'s called "experimental".)',
            'The game will no longer attempt to keep an empty action list active, even if the checkbox is checked.',
            'Switched the default dark mode variant to one that\'s better for legibility, especially with the predictor. (Previous default was "Matrix 2", now is "Matrix 4".)',
            'If the "Background Bonus Speed" option is set to a value less than 1, it will apply in the background regardless of whether or not bonus is active.',
          ],
        },
        {
          name: '3.P16.6',
          date: '2023-12-02',
          changes: [
            'Survey actions will no longer trigger "pause on complete" before reaching 100%. (Thanks to baldain from the discord!)',
            'Survey actions will not consume resources once progress reaches 100%.',
          ],
        },
        {
          name: '3.P16.5',
          date: '2023-12-01',
          changes: [
            'Fixed a bug where dungeon actions would break if the last floor was completed in under a tick. (Thanks to slabdrill from the discord for the report and the repro!)',
            "The tick driver will not attempt to spend more than one frame's worth of time processing actions, no matter how high you set your bonus multiplier.",
            'Experimental implementation of a responsive UI, can be enabled in Options.',
            'Added the predictor script, which can be enabled in the Options menu.',
          ],
        },
        {
          name: '3.P16.4',
          date: '2023-11-30',
          changes: [
            "Merged in WaylonJ's prestige version. Save compatibility is now only guaranteed with the prestige fork, not the lloyd fork.",
            'Added "Background Bonus Speed" option. If set to a number >= 0, bonus time will be used at this rate instead of the normal bonus rate whenever the tab is running in the background.',
            'New color inversion filter for Dark theme, maintains colors better.',
            'Set the theme before loading any other JavaScript to avoid a flash of white when reloading.',
            'Add a loading screen to avoid showing unstyled content when reloading the page.',
          ],
        },
        {
          name: '3.0.3',
          date: '2023-11-30',
          changes: [
            'Added some workaround code to make sure saves exported from the dmchurch fork can be imported back into the lloyd fork, for portability.',
            'Tooltips for actions that are visible but not yet unlocked now show in abbreviated form, to reduce flavor text confusion.',
            'Actions that teach skills now show a description of the skill in the action tooltip.',
          ],
        },
        {
          name: '3.0.2',
          date: '2023-11-15',
          changes: [
            "Rewritten tick() code uses browser's requestAnimationFrame if available. Ticks should be more efficient as well, especially under high game speeds.",
            'Fix to Actions.tick() from Gustav from Discord, now multi-segment actions that complete multiple segments in a single tick will calculate each segment individually.',
            'The "visual updates per second" option is now stored separately from saves, so you won\'t import refresh rate with a pasted savedata.',
          ],
        },
        {
          name: '3.0.1',
          date: '2023-11-14',
          changes: [
            'Yarr, the game has been taken over by dmchurch, where is this boat even going?',
            'Dark theme now rotates the colors back into the right hues.',
            '"Notify on Pause" option to send an HTML5 notification to your system tray instead of a beep when the game pauses.',
          ],
        },
        {
          name: 'P: 0.1.6c',
          date: '2023-03-20',
          changes: [
            'Bug fix',
            'Fixed: Previous change caused check boxes to not save their states.',
            'Fixed: Geysers could be fractionated depending on survey progress.',
            "Fixed: Surveying 100% areas shouldn't give completed maps.",
            "Fixed: Reset All Prestige didn't remove old values.",
          ],
        },
        {
          name: 'P: 0.1.5',
          date: '2023-03-20',
          changes: [
            'Options -> Custom Bonus Speed:',
            'Now allows you to enter a value into a text box for whatever customSpeed you desire :)',
          ],
        },
        {
          name: 'P: 0.1.4',
          date: '2023-03-13',
          changes: [
            'I stopped being lazy and added a change log!',
            'PrestigeMental: Tooltip now reflects that it affects luck.',
            'PrestigeBartering: Tooltip now specifies that it affects the amount of *mana* bought from merchants.',
            'Bug: Trying to fix prestige bug not reset-ing values (V1).',
          ],
        },
        {
          name: 'P: 0.1.3',
          date: '2023-03-12',
          changes: [
            'PrestigeExpOverflow: Now gains the bonuses of PrestigePhysical and PrestigeMental when their respective skills are being added to.',
            'PrestigeMental: By popular questioning and request, now has "Luck" as one of the skills it provides a bonus to.',
            'PrestigePhysical: By an absolute blunder on my part, now actually provides a bonus for Strength.',
            'Other Changes: Otherwise just a small tooltip adjustment as ExpOverflow wasn\'t giving you the "Current Bonus" in the prestige dropdown',
          ],
        },
        {
          name: 'P: 0.1.2',
          date: '2023-03-06',
          changes: [
            'Prestige buffs: Combat: 1.10 -> 1.20',
            'Prestige buffs: Spationmancy: 1.10 -> 1.20',
            'Prestige buffs: Bartering: 1.10 -> 1.20',
            'Triggers a save after prestiging to prevent refresh errors',
            'Updates text content to reflect prestige bonuses correctly.',
            'Bug fix for Spatio / Barter',
            'Survey action can now be done even when at 100% surveyed, but it will result in no progress and remove a map. This allows it to work with "Pause on progress complete"',
          ],
        },
        {
          name: 'P: 0.1.1',
          date: '2023-03-05',
          changes: [
            'Prestiges will now begin with the "Found Glasses" action thanks to the overwhelming feeling that you\'re forgetting something important when you prestige',
            'Buffed prestigeMental and prestigePhysical to give 10 -> 20% bonuses to their respective skills',
            'Added "Reset all Prestiges" to recoup your spent points',
            'Prevents buy glasses action in all prestiges.',
            'Updated tooltips to reflect the buff change from above',
          ],
        },
        {
          name: 'P: 0.1.0',
          date: '2023-02-15',
          changes: [
            "Prestige mode: Once you've restored time, you'll gain 90 points to spend on a variety of prestige bonuses.",
            'These may be viewed in the "Prestige Perks" menu dropdown at the top left.',
            "Imbue Soul levels will carry over between prestiges, up to the maximum number of prestiges you've completed.",
            'QoL: Added a 10x and 20x checkbox in the "Options" drop down when using Bonus time',
          ],
        },
        {
          name: '3.0.0',
          date: '2023-01-23',
          changes: [
            'Writing update! Vera from Discord has contributed a ton of new action stories for content across the game.',
            'Tooltip updates from Quiaaaa to Spatiomancyy and Practical magic.',
            'Tooltip fixes from SyDr to hopefully resolve the age-old bug with tooltips going off-screen.',
          ],
        },
        {
          name: '2.9',
          date: '2022-07-25',
          changes: [
            "Performance Update! With help from Hordex from Discord, we've rewritten most of the explicit update calls to be deferred to the update handler.",
            'This means that most UI refreshes are now correctly controlled by the "Updates Per Second" setting in the options menu.',
            'High level players who are still experiencing lag can significantly improve performance by reducing this number - this will only decrease how often the screen refreshes, not how often the game updates.',
            'Additionally, we have a number of new global stories for all the zones, action segments, and other updates from MrPitt!',
          ],
        },
        {
          name: '2.8',
          date: '2022-07-25',
          changes: [
            'A new guild has opened in Commerceville - Assassins Guild! Kill targets across the world, collect their hearts (why is it always hearts?), and return them to the guild to learn the ways of the assassin',
            'New Actions: Assassinate: Assassination targets are now available in every zone. Every assassination carries a very heavy reputation penalty (mitigated by assassin skill) and gets harder based on your reputation and number of assassinations completed this loop',
            'New Skill: Assassin - Improves assassination actions and reduces the difficultly scaling in trials',
            'New Menu: Totals - Records play metrics including total time played and loops/actions completed',
            'Balance: Thieves guild actions gold rewards x2',
            'New Option: Highlight New Actions - Places a border around actions that have not yet been completed on this save. Defaults to on, but can be toggled off in options',
            'Added max button to Gather Team',
            'Typo fixes',
          ],
        },
        {
          name: '2.7',
          date: '2022-07-20',
          changes: [
            "Survey Update! Survey is now completed using maps purchased in Beginnersville. Completed maps can be returned to the explorer's guild for extra progress in a random uncompleted area.",
            'A few minor bugfixes',
          ],
        },
        {
          name: '2.6',
          date: '2022-07-20',
          changes: [
            'Added Quick Travel Menu to better navigate all the zones',
            'Dark Ritual now only shows speed increases for unlocked zones',
          ],
        },
        {
          name: '2.5',
          date: '2022-07-19',
          changes: [
            'New Option: Stat Colors - Changes stat menu bars to be the same colors used in multipart action bars',
            'Removed Simple Tooltips Option - It was extra work to maintain on every update / change',
            'Bugfix: DR was not properly increasing zombie strength',
            "Balance: Added great feast's bonus to team members and zombies to bring team combat better in line with self combat (this seemed more interesting than just adding a flat x5, but may be changed later)",
          ],
        },
        {
          name: '2.4',
          date: '2022-07-20',
          changes: [
            'Balance: Team combat buffs! Restoration now contributes 4x its level instead of 2x to team member strength',
            'New Option: Players can now enable a setting to have the game automatically pause when a progress action reaches 100% so they can accrue bonus seconds rather than waste time on a loop making little progress',
            'Tooltip Updates: Many thanks to MakroCZ from the discord for tireless work on a fix for tooltip placement',
            'Tooltip Updates: Kallious from the discord has helped clarify a number of unlock conditions and tided up the tidy up action in Valhalla',
            'Bugfix: Imbue Soul could be started at max buff rank, resetting all progress for no reward',
          ],
        },
        {
          name: '2.3',
          date: '2022-07-19',
          changes: [
            "Bugfix: With thanks to Kallious from the Discord, we've finally fixed the bug sometimes making soulstones go negative on DR/IM/GF",
            'Bugfix: Added additional error checks to loading save files to autofix some of the common error states',
            'Bugfix: Trial of dead was not using updated zombie strength formula',
            'Bugfix: Imbue Soul was not updating training tooltips until next restart',
          ],
        },
        {
          name: '2.2',
          date: '2022-07-19',
          changes: [
            'New Skill: Leadership - Increases your max follower count by 1 for every 100 levels and increases their contribution to team combat',
            'New Action (Commerceville): Motivational Seminar - Get advice from the head of a totally-not-an-MLM to learn how to be a better leader',
            'Balance: Zombie Strength is now increased by Dark Ritual / 100(min 1x, up to 6.66x increase)',
            'Balance: Fight Jungle Monsters now rewards blood instead of hides. Prepare Buffet is now made of blood instead of hide. Still gross.',
            "Note - We'll have to see how these changes land. It may end up being that now Team Combat is too strong compared to self combat. Also, trials will almost certainly need rebalancing.",
            'Bugfix: Fight actions were giving exp on segment in addition to completion. Increased combat exp of frost/giants & jungle monsters to compensate',
            "Bugfix: Explorer's guild was not reducing the cost of excursion",
          ],
        },
        {
          name: '2.1',
          date: '2022-07-18',
          changes: [
            'Balance: Imbue soul now adds +100% exp mult to training actions per level',
            'Balance: Reduced Alchemy Skill requirement of Looping potion from 500 to 200',
            'Balance: Jungle Escape now only needs to be started within 60s, not completed within 60s',
            'Bugfix: Excursion was requiring the player to have more gold than the cost rather than more or equal',
            "Bugfix: Troll's blood still said it did nothing",
            'Bugfix: Reduce the amount of time "Saved" appear on loadouts from 2s -> 1s',
            "Bugfix: Secret trial couldn't be started",
            "Bugfix: Soulstone display wasn't being updated after imbue soul",
            'Change: The game will now persist any current options set when starting a new game or beginning a challenge',
          ],
        },
        {
          name: '2.0',
          date: '2022-07-16',
          changes: [
            'Added Challenge Modes!',
            'Challenges are super hard modifications to the base game with extra restrictions in place.',
            'These are only for fun and do not give any rewards.',
          ],
        },
        {
          name: '1.9',
          date: '2022-07-16',
          changes: [
            'Change: Added "Max Training" button to bottom of action list that will cap all training actions present on the list. This button only appears after players have completed their first imbue mind to reduce clutter',
            'Change: Completing the "Imbue Mind" action will automatically cap any training actions on the list. This can be disabled in the options menu',
            'Bugfix: StonesUsed from Haul was not properly resetting on clearing saves',
            'Bugfix: Off-by-One error in final trial was preventing players from being able to finish',
            'Bugfix: Trial tooltips were displaying incorrect floor numbers',
            'Bugfix: Trolls, Frost Giants, and Jungle Monsters were giving combat exp per action rather than per kill. These actions will likely need significant combat skill exp buffs after to compensate for this fix',
          ],
        },
        {
          name: '1.8',
          date: '2022-07-14',
          changes: [
            'New Trial: Trial of the Dead (Startington) - Based solely off your Zombie contributions to team combat, completing floors rewards even more zombies',
            'Bugfix: Swapped the Clear List and Manage Loadout buttons so the loadout popup would be less likely to get in the way when editing action amounts',
            'Bugfix: Added survey icon to new actions added by survey so they are easier to notice',
            "Bugfix: Haul wasn't being properly capped per zone, allowing stones to become negative",
          ],
        },
        {
          name: '1.7',
          date: '2022-07-14',
          changes: [
            'Endgame content complete! The endgame has been reworked to be a series of a team trial, solo trial, and final action that must all be completed in order in a single loop.',
            "This update marks the end of my planned content. From here out it'll be mostly balancing, bugfixes, and perhaps the occasional addition as whimsy strikes.",
            'New Actions: Delve & Haul - Find and collect temporal stones used for an end-game action (Note: completely unbalanced right now - attempt at your own peril)',
            'New Action: Build Tower - New endgame action (Note: completely unbalanced right now - attempt at your own peril)',
            'New Actions: Endgame trials (Note: completely unbalanced right now - attempt at your own peril)',
            'New Action: Secret Trial - No one should ever bother with this, but some of you all are just crazy enough to try',
            'Balance: Buy Mana is no longer available after using the Jungle Portal',
            'Balance: Reduced Stat and Skill gain from heroes trial',
            'Balance: Reduced Combat Skill exp gain from late game fight actions',
            'Change: New option available for simple tooltips. Removes the formulas from skill and action tooltips to reduce clutter. You can select this from the options menu under "Language".',
            'Change: Removed the ability to edit buff caps',
            'Bugfix: Minor tooltip updates',
          ],
        },
        {
          name: '1.6',
          date: '2022-07-13',
          changes: [
            'Change: Reworked Loadouts, allowing up to 15 to be saved',
            'Bugfix: Restoration skill was applying to self combat instead of team combat',
            "Bugfix: A number of actions that had skill exp added to them weren't properly granting the exp",
            'Bugfix: Added descriptions of where each shortcut takes you to the tooltip',
          ],
        },
        {
          name: '1.5',
          date: '2022-07-13',
          changes: [
            'New Action Type: Trial - Trials are longer form dungeons, but without the soulstone gain',
            'New Trial (Merchanton): Heroes Trial - 50 floors. Grants Heroism buff per floor completed',
            'New Buff: Heroism - Grants 2% increased Combat, Pyromancy, and Restoration skill exp per level',
            'Bugfix: Rewrote soulstone sacrifice code',
            'Bugfix: The Spire was based on self-combat rather than team-combat',
            "Bugfix: Totem didn't effect Imbue Body until the third completion",
          ],
        },
        {
          name: '1.4',
          date: '2022-07-12',
          changes: [
            'Change: Added max actions to oracle and charm school',
            'Change: Completing totem for the first time doubles the bonus from imbue body',
          ],
        },
        {
          name: '1.3',
          date: '2022-07-12',
          changes: [
            'Minor Survey Rework - still needs a bit more attention and explorers guild needs a use',
            'Change: Survey is unlocked in all zones after joining explorers guild',
            'Change: Survey actions cap raised to 500, but now applies across all survey actions',
            'Change: Survey added as limited action, so the circle icon can be used',
            'Bugfix: Looping potion tooltip',
            'Bugfix: Spatiomancy was increasing mana well costs',
          ],
        },
        {
          name: '1.2',
          date: '2022-07-12',
          changes: [
            'Change: Constructed additional warehouses so numbers would be prettier with all increases',
            'Bugfix: Player was falling asleep on the wagon, missing the Merchanton stop, and ending up on the mountain',
            "Bugfix: Imbue soul wasn't resetting buffs",
            "Bugfix: Excursion costs weren't modified by explorers guild",
            "Bugfix: Key wasn't being reset correctly",
            'Bugfix: Underworld action was showing failed, even when successful',
            'Bugfix: Mana well and Buy mana tooltips now update when leveling skills that benefit them',
            'Bugfix: Skill rework was causing pick locks to give double gold',
            'Bugfix: Guided tour was being removed from active list on refresh',
          ],
        },
        {
          name: '1.1',
          date: '2022-07-11',
          changes: [
            'New Guild: Explorers - Voted by the community, the explorers guild has opened shop in Commerceville!',
            'Unlocks a new "Survey" action in all zones - Survey progress mildly increases the number of limited resources (% * 0.5)',
            'Overall Survey progress also unlocks shortcuts for new ways to move between zones',
            'Bugfix: Mana well costs could become negative, subtracting mana from the player',
            "Bugfix: Excursion didn't check if you had enough gold to start",
            "Bugfix: Reputation display wasn't updated after fall from grace action",
            'Backend: Major rework of how skill bonuses are calculated in code. The results should be the same, but make the code easier to read and maintain. Unfortunately, I expect at least a few bugs from typos in this.',
          ],
        },
        {
          name: '1.0',
          date: '2022-07-09',
          changes: [
            'New Skill: Wunderkind - Increases talent exp gain',
            'New Action (Jungle Path): Totem - Consumes a looping potion to give Wunderkind skill Exp',
            'Change: Moved the Oracle skill to be next to Charm School',
            'Bugfix: Aspirant bonus was being applied to all exp gain, not just talent exp',
            'Bugfix: Gamble action gold was not rounding',
            'Bugfix: Removed reputation requirement from collect interest tooltip',
            'Bugfix: Removed "this does nothing" from Collect Artifacts',
            'Bugfix: Added the max quantity button to the Collect Artifacts action',
            'Removed versions from changelog >1 year old',
          ],
        },
        {
          name: '0.99',
          date: '2022-07-07',
          changes: [
            'New Action (Commerceville): Excursion - Exploration action to reveal other actions in the zone',
            'New Actions (Commerceville): Pick Pocket, Rob Warehouse, Insurance Fraud - Gold gain based on thieves guild bonus & thievery',
            'Finished implementation of thievery skill - Increases gold gain of pick locks, gamble, and thieves guild actions',
            'Added temporary effect for imbue soul - Adds 50% action speed per completion. Will likely be changed later',
            'Improved handling of bonus time on time-gated actions. Effective time used for these actions can be viewed in the "Mana Used" tooltip',
            'Bugfix: Donate allowed going negative on gold',
            'Bugfix: Collect interest was only rewarding 1/10th of the intended amount',
            "Bugfix: Excursion didn't cost gold",
            "Bugfix: Imbue Soul didn't have costs",
            "Bugfix: Thieves guild segments weren't resetting",
            'Bugfix: Great feast throwing an error',
            'Numerous updates and clarifications in various tooltips',
          ],
        },
        {
          name: '0.98',
          date: '2022-07-06',
          changes: [
            'New Zones - Jungle Path, Commerceville, and Valley of Olympus. Major milestones are implemented, with more content to come',
            'New Buff: Imbue Body - Sacrifices talent exp to permanently raise starting stats.',
            'New Skill: Gluttony - Decreases the soulstone cost of great feast.',
            'New Skill: Thievery - Improves gold gain of certain actions',
            'New Action (Startington): Mana Well - Gives mana based on how quickly in the loop it is completed (adjusted for bonus second use)',
            'New Actions (Jungle Path): Explore Jungle & Fight Jungle Monsters - Generic exploration/progress action where exp is based on fight monsters completion',
            'New Actions (Jungle Path): Rescue Survivors & Prepare Buffet - Uses Resto skill, then herbs and hide to give Gluttony exp',
            'New Action (Jungle Path): Escape - Unlocks next zone, but requires being completed within 60 seconds of starting the loop (adjusted for bonus second use)',
            'New Actions (Commerceville): Thieves Guild - Functions similar to crafting guild, but with a focus on gold income',
            'New Actions (Commerceville): Invest & Collect interest. Grants a small percentage of lifetime investments',
            'New Actions (Commerceville): Purchase Key & Leave City - Progress to next zone for cost of 1M gold',
            'New Actions (Valley Of Olympus): Imbue Soul & Challenge Gods - (Incomplete) Planned end of game',
            'Dark Ritual now works in all zones and provides a very minor speed increase up to max level. Need to find a way to hide description for locked zones',
            'Decreased mana cost of open rift from 100k -> 50k',
            'Minor fix to how Spatiomancy effects herbs',
          ],
        },
        {
          name: '0.97',
          date: '2022-07-04',
          changes: [
            'Added Build Housing and Collect Taxes actions in Valhalla - a new source of gold gain that uses Crafting Guild Rank and Mercantilism skill.',
            'Renamed Adeptsville to Startington',
            'Added Meander action in Startington and set as a requirement to see other actions',
            'Added Destroy Pylon action in startington to reduce the mana cost of spire',
            'Increased the base mana cost of The Spire significantly, mostly offset by destroying pylons',
            'Allowed Spatiomancy to benefit more actions',
            'Fixed Great Feast buff so it actually improves Self Combat',
            'Training mercantilism now costs reputation',
            'Fall From Grace now removes all positive reputation',
            'Tweaked Looping potion to require doubling herbs with spatiomancy in anticipation of end-game use',
            'Cleaned up a bunch more tooltips',
          ],
        },
        {
          name: '0.96',
          date: '2022-06-24',
          changes: [
            'The spire now gives rewards! It gives 100 soulstones per floor and well as aspirant ranks',
            'New Skill: Divine Favor. Increases soulstones gained from actions',
            'New Skill: Communing. Reduces soulstone costs of dark ritual',
            'New Buff: Aspirant. Increases talent xp multiplier',
            'New Action: Fight Giants - Self combat fight that increases the effectiveness of seek blessing',
            'New Action: Seek Blessing - Gives divine favor skill xp based on fight giants progress',
            'New Action: Raise Zombies - Increases team combat',
            'New Action: Dark Sacrifice - Gives communing skill xp',
            'Cleaned up a number of tooltips',
          ],
        },
        {
          name: '0.95',
          date: '2022-03-18',
          changes: [
            "Omsi's beta content!",
            'Added Valhalla zone with numerous new actions - reachable with Face Judgement',
            'Added Adeptsville zone and The Spire dungeon - reachable with Face Judgement',
            'New Skill: Restoration - Improves team combat and effectiveness of Heal the Sick',
            'New Skill: Spatiomancy - Reduces mana geyser costs and increases possible rewards from zone 1 and 3 actions',
            'New Skill: Mercantilism - Increases gold received from Buy Mana actions',
            'New Buff: Great Feast - Increases self combat score',
            'More new actions than you can shake a stick at!',
            'Probably lots more stuff, too?',
          ],
        },
      ] satisfies ChangelogEntry[],
    },
    save: {
      title: 'Save',
      titles: {
        actionlist: 'Actionlist',
        saveToText: 'Save to text',
        saveToFile: 'Save to file',
      },
      messages: {
        manageActionlist: 'Exports the current list in plain-text',
        manageSaveText: 'Exports the savestate as a b64-text',
        manageSaveFile: 'Exports the savestate as a b64-file',
        loadWarning: 'Warning: This will overwrite your current save!',
      },
      actions: {
        saveGame: 'Save game',
        import: 'Import',
        export: 'Export',
      },
    },
    faq: {
      title: 'FAQ',
      question: 'Question',
      answer: 'Answer',
      questions: [
        {
          q: 'What do stats do?',
          a: 'Hover over "Stats" for how they work. What stats are important depend on what actions you need that uses them. In general, higher stats mean more work done in a loop.',
        },
        {
          q: 'Short runs seem better.',
          a: 'Short runs are better for the early game, but as your runs get longer and you accrue talent and soulstones, longer runs become more useful.',
        },
        {
          q: 'What should my first goal be?',
          a: 'Start with wandering until you have ways of getting mana back. Then try to find how to get some warrior lessons to give yourself a permanent boost, and then try fighting monsters!',
        },
        {
          q: 'How do skill increases / reductions work?',
          a: "Increases multiply a reward by (1 + level / 60) ^ .25, so you'll see diminishing returns at higher levels. Reductions multiply a cost by 1 / (1 + level / 100), so you'll never be able to bring a cost completely to zero.",
        },
        {
          q: 'When should I use Dark Ritual?',
          a: "Many people recommend performing another ritual when the cost is less than 5% of your soulstones. Of course, the choice is up to you and there may be cases where it's better to perform it sooner or later.",
        },
        {
          q: 'I found a bug!',
          a: "Some problems are the result of the browser cache mixing files between versions of Idle Loops. If something seems broken, first try doing a hard reload in your browser, usually Control-Shift-R or Command-Shift-R. (Don't tell your browser to clear all data for the site unless you've saved and exported your game!) If that doesn't work, please join the Discord (link under Options) and report it in the #loops-bugs channel! I try to resolve bug reports as quickly as I can, and I always appreciate hearing about them!",
        },
      ],
    },
    options: {
      title: 'Options',
      options: {
        language: {
          title: 'Language',
          description: 'Change the language of the game',
        },
      },
    },
    extras: {
      title: 'Extras',
      description: `
        The options in this menu allow you to customize the balance and functionality of the game in ways that affect
        the play experience. If experiencing the "vanilla" Idle Loops experience is important to you, leave these
        options unchanged. Otherwise, have fun!
      `,
      options: {
        fractionalMana: {
          title: 'Fractional mana consumption',
          description:
            'This option allows you to consume mana in fractional amounts. For example, if you have 100 mana and you consume 1.5 mana, you will lose 1 mana and have 0.5 mana left over.',
        },
        speed: {
          title: 'Speed Managment',
          custom: 'Custom',
          bonusMultiplier: 'Bonus Multiplier',
          bonusMultiplierDescription:
            'This option applies a multiplier to the speed of the game when it is running in the foreground and is using bonus seconds.',
          backgroundMultiplier: 'Background Multiplier',
          backgroundMultiplierDescription:
            'This option applies a multiplier to the speed of the game whether it is running in the background. To make the game run at full speed in the background, unset this or set it to 1 or greater.',
        },
        bonusTime: {
          title: 'Bonus Time',
          borrow: 'Borrow',
          borrowDescription:
            "You can grant yourself extra Bonus Seconds with this button, in one-day increments. You will always be able to see how much time you have borrowed in this way, and it will never have any impact on anything else in the game. You can return time you've borrowed if you want to get the number back down to zero, but you aren't required to.",
          return: 'Return',
          returnDescription:
            'Returns the time you have borrowed to the default amount. This will not remove any borrowed time from your current loop.',
        },
        predictor: {
          title: 'Predictor',
          description:
            'Predictor is a tool that helps you make decisions about your actions. It is not perfect, but it can help you make decisions about your actions.',
          enabled: 'Enabled',
          backgroundThread: 'Run predictor in background thread',
          timePrecision: 'Time precision',
          nextPrecision: 'Next precision',
          slowmode: 'Slowmode',
          slowTimer: 'Update every',
          minutes: 'Minutes',
        },
      },
    },
    challenges: {
      title: 'Challenges',
      messages: {
        description: 'Challenges are special modes that impose special conditions and restrictions.',
        recommendation: 'It is only recommended to try them after beating the main game.',
        saveBeforeStarting: 'Please export and save your data locally before starting.',
        warnBeginChallenge: 'Beginning a challenge will permanently delete your current save.',
      },

      challenges: {
        exit: 'Exit Challenge',
        resume: 'Resume Challenge',
        manaDrought: {
          title: 'Mana Drought',
          description:
            "The mana merchant in Beginnersville only has 5k mana to sell, and they're charging double the usual price. No other mana merchants exist.",
        },
        noodleArms: {
          title: 'Noodle Arms',
          description:
            'You have no base Self-Combat ability. All combat is based on followers. Self combat is half of your team member or zombie strength (whichever is higher).',
        },
        manaBurn: {
          title: 'Mana Burn',
          description:
            "You have a day's worth of mana that persists through loops, but once that runs out, you'll be stuck in time. How far can you make it?",
        },
      },
    },
    statistics: {
      title: 'Statistics',
      borrowedTime: 'Time borrowed',
      effectiveTime: 'Effective Time',
      runningTime: 'Running Time',
      loops: 'Loops',
      actions: 'Actions',
    },
    prestige: {
      title: 'Prestige Perks',
      descriptions: {
        active:
          "Prestige bonuses are always active. Each time you complete the game, you receive 90 points to spend on these bonuses. Please export and save your data locally before attempting to trigger a prestige. The ability to spec into prestige bonuses may be done at any time, but keep in mind this will reset ALL progress. Imbue Soul levels will carry over between prestiges, up to the maximum number of prestiges you've completed.",
        spec:
          'The ability to spec into prestige bonuses may be done at any time, but keep in mind this will reset ALL progress.',
        carryover:
          "Imbue Soul levels will carry over between prestiges, up to the maximum number of prestiges you've completed.",
        maxCarryover: 'Max carryover possible',
        totalPrestigesCompleted: 'Total Prestiges Completed',
        availablePoints: 'Available points',
        upgradeCost: 'Upgrade cost follows the format of',
        nextLevelCost: 'Next level cost',
        currentBonus: 'Current Bonus:',
        points: 'points',
      },
      actions: {
        reset: {
          title: 'Reset All Prestiges',
          description:
            'Resets all current prestige bonuses, giving you back the points to allocate again. Note, this DOES trigger a reset, so this cannot be done mid-playthrough.',
        },
        improvePhysical: {
          title: 'Prestige Physical',
          description: 'Increases Experience gain of all Physical stats (Dex, Str, Con, Spd, Per) by 20% per level.',
        },
        improveMental: {
          title: 'Prestige Mental',
          description: 'Increases Experience gain of all Mental stats (Cha, Int, Soul, Luck) by 20% per level.',
        },
        improveCombat: {
          title: 'Prestige Combat',
          description: 'Increases Self and Team Combat by 20% per level.',
        },
        improveSpatiomancy: {
          title: 'Prestige Spatiomancy',
          description: 'Increases the number of "Findables" per zone by 10% per level.',
        },
        improveChronomancy: {
          title: 'Prestige Chronomancy',
          description: 'Increases speed of all zones by a multiplier of 5% per level.',
        },
        improveBartering: {
          title: 'Prestige Bartering',
          description: 'Increases mana received from merchants by 10% per level.',
        },
        improveExpOverflow: {
          title: 'Prestige Experience Overflow',
          description: 'Experience earned is spread amongst all stats by 2% per level.',
        },
      },
    },
    navigation: {
      town: 'Location',
      actions: 'Actions',
      action_log: 'Log',
      stats: 'Stats',
    },
    tracked_resources: {
      reset_on_restart_txt: 'Resets when the loop restarts.',
      resources: {
        power: {
          label: 'Divine Power',
          title: '<img src="icons/power.svg" class="smallIcon">',
          desc: 'Powers of the gods.',
          initially_hidden: true,
        },
        timer: {
          label: 'Mana',
          title: 'Mana:',
          desc: 'Your main resource. The higher your mana, the more you can do before reset.',
          no_reset_on_restart: true,
        },
        gold: {
          label: 'Gold',
          title: 'Gold:',
          desc: 'Coins to buy mana crystals and other items with.',
        },
        reputation: {
          label: 'Reputation',
          title: 'Reputation:',
          desc: 'The influence you have over the people in town.',
          initially_hidden: true,
        },
        herbs: {
          label: 'Herbs',
          title: 'Herbs:',
          desc: "The beneficial plants you've found.",
          initially_hidden: true,
        },
        hide: {
          label: 'Hide',
          title: 'Hide:',
          desc: 'Results of successful hunting.',
          initially_hidden: true,
        },
        potions: {
          label: 'Potions',
          title: 'Potions:',
          desc: 'Rare, but not complex. Worth some money.',
          initially_hidden: true,
        },
        teamMembers: {
          label: 'Team Members',
          title: 'Team Members:',
          desc: "You know their personalities and fighting style. They don't know your name.",
          initially_hidden: true,
        },
        armor: {
          label: 'Armor',
          title: 'Armor:',
          desc: 'Crafted by your own hand, it protects you from dangers.',
          initially_hidden: true,
        },
        blood: {
          label: 'Blood',
          title: 'Blood:',
          desc: 'Regaled for its regenerative properties.',
          initially_hidden: true,
        },
        artifacts: {
          label: 'Artifacts',
          title: 'Artifacts:',
          desc: "Various old rings, bracelets, amulets, and pendants. They look like they're worth a pretty penny.",
          initially_hidden: true,
        },
        favors: {
          label: 'Favors',
          title: 'Favors:',
          desc: "You've been generous to important people.",
          initially_hidden: true,
        },
        enchantments: {
          label: 'Enchanted Armor',
          title: 'Enchanted Armor:',
          desc: 'Divinely blessed weapons and armor, like a hero of legend.',
          initially_hidden: true,
        },
        houses: {
          label: 'Houses',
          title: 'Houses:',
          desc: 'Property constructed in Valhalla. You can collect taxes from tenants.',
          initially_hidden: true,
        },
        pylons: {
          label: 'Pylons',
          title: 'Pylons:',
          desc: 'Lingering fragments from the destroyed pylon.',
          initially_hidden: true,
        },
        zombie: {
          label: 'Zombies',
          title: 'Zombies:',
          desc: 'A shambling pile of deceased flesh. Super gross.',
          initially_hidden: true,
        },
        map: {
          label: 'Maps',
          title: 'Maps:',
          desc: "A cartographer's kit that can be used to survey areas and discover new secrets.",
          initially_hidden: true,
        },
        completedMap: {
          label: 'Finished Maps',
          title: 'Finished Maps:',
          desc:
            "You've mapped out some part of the world. The Explorer's guild would happily buy this knowledge off of you.",
          initially_hidden: true,
        },
        heart: {
          label: 'Beating Hearts',
          title: '<img src="icons/heart.svg" class="smallIcon">',
          desc: "The still-beating heart of your target. The Assassin's guild will reward you for this.",
          initially_hidden: true,
        },
        glasses: {
          label: 'Glasses',
          title: '<img src="icons/buyGlasses.svg" class="smallIcon">',
          desc: 'Woah, trees have so many leaves on them.',
          initially_hidden: true,
          no_count: true,
        },
        supplies: {
          label: 'Travel Supplies',
          title: '<img src="icons/buySupplies.svg" class="smallIcon">',
          desc: 'Needed to go to the next town.',
          initially_hidden: true,
          no_count: true,
        },
        pickaxe: {
          label: 'Pickaxe',
          title: '<img src="icons/buyPickaxe.svg" class="smallIcon">',
          desc: "It's heavy, but you can make use of it.",
          initially_hidden: true,
          no_count: true,
        },
        loopingPotion: {
          label: 'Looping Potion',
          title: '<img src="icons/loopingPotion.svg" class="smallIcon">',
          desc:
            "It's a potion made with the very same formula that got you into this mess. Why exactly did you make this?",
          initially_hidden: true,
          no_count: true,
        },
        citizenship: {
          label: 'Valhalla Citizenship',
          title: '<img src="icons/seekCitizenship.svg" class="smallIcon">',
          desc: "You're one of Valhalla's proud citizens now, giving you the right to fight in their honor.",
          initially_hidden: true,
          no_count: true,
        },
        pegasus: {
          label: 'Pegasus',
          title: '<img src="icons/pegasus.svg" class="smallIcon">',
          desc: 'A horse with great angelic wings. It can run across clouds as easily as dirt.',
          initially_hidden: true,
          no_count: true,
        },
        key: {
          label: 'Commerceville Key',
          title: '<img src="icons/purchaseKey.svg" class="smallIcon">',
          desc: 'Needed to go to the next town.',
          initially_hidden: true,
          no_count: true,
        },
        stone: {
          label: 'Temporal Stone',
          title: '<img src="icons/temporalStone.svg" class="smallIcon">',
          desc: 'A strange rock that seems unaffected by the time loops.',
          initially_hidden: true,
          no_count: true,
        },
      },
    },
  },
  towns: {
    town0: {
      name: 'Beginnersville',
      desc:
        `Rats in basements, aggressive solo boars, bouncing slimes, and strangers that love exposition are some of the less common things you'll see around Beginnersville. Some people are missing helmets or shoes, and the fanciest sword around is still made out of iron. You got lucky with decent towns to start looping at. If only there weren't so many rules not letting you do dangerous things, it'd be perfect.`,
    },
    town1: {
      name: 'Forest Path',
      desc:
        'A forever green forest. You feel mana flowing around, but hiding in the dark, you sense an evil presence...',
    },
    town2: {
      name: 'Merchanton',
      desc:
        "Merchanton! A modest town bustling with activity. You can find many attractions here, such as the library, the adventuring guild, the crafting guild, and the bazaar. Oh, and did I mention there's loads of suckers to swindle?",
    },
    town3: {
      name: 'Mt. Olympus',
      desc:
        "You could have taken that path to the other town, but no! You just <i>had</i> to go to Mt. Olympus, didn't you. But anyways, while you're here, thanks to being neither a canine nor old, you can learn a few new tricks. And kill some innocent trolls while you're at it.",
    },
    town4: {
      name: 'Valhalla',
      desc:
        "A sprawling and jolly city filled with all manner of nice things. Vikings, beer, angels, beer, blah blah blah, and beer! You can spend your time in the great hall, or in the outskirts of the city. Either way, you'll surely have a great time.",
    },
    town5: {
      name: 'Startington',
      desc:
        "A once familiar place, now crawling with shadows and ominous feelings of wasted sick days. There stands a large pillar of gloomy purple light in the center of it all, emanating from a spire surrounded by black clouds. The pillar seems to be the only source of light in town, though it's connected to 10 locations in town with weaker beams. Maybe you should check those spots out.",
    },
    town6: {
      name: 'Jungle Path',
      desc:
        'A twisting jungle that seems determined to swallow you in its depths. All the same, you can hear people somewhere in the near distance and magical herbs growing by the bushel.',
    },
    town7: {
      name: 'Commerceville',
      desc:
        'A central hub of commerce in this dark, dour place. Everyone here is looking to make a buck and you don\'t get the feeling that "honest work" is paying much here.',
    },
    town8: {
      name: 'Valley of Olympus',
      desc:
        'A mountain-shaped hole in the ground. It is ever so faint, but even here in this dark realm, you can feel the presence of the gods looking down upon you.',
    },
  },
  spells: {
    title: 'Spells',
  },
  predictor: {
    settings: 'Predictor Settings',
    background_thread: 'Run predictor in background thread',
    time_precision: 'Degrees of precision on Time',
    next_precision: 'Degrees of precision on Next',
    action_list_width: 'Width of the Action List (non-responsive UI only)',
    repeat_last_action: '"Repeat last action on list" applies to the Predictor',
    slow_mode: 'Only update the predictor every {slowMode} Minutes',
  },
  shortcuts: {
    pauseGame: 'Pause game',
    manualRestart: 'Manual restart',
    toggleOffline: 'Toggle offline',
    loadLoadout1: 'Load loadout 1',
    loadLoadout2: 'Load loadout 2',
    loadLoadout3: 'Load loadout 3',
    loadLoadout4: 'Load loadout 4',
    loadLoadout5: 'Load loadout 5',
    changeActionAmount1: 'Change action count to 1',
    changeActionAmount2: 'Change action count to 2',
    changeActionAmount3: 'Change action count to 3',
    changeActionAmount4: 'Change action count to 4',
    changeActionAmount5: 'Change action count to 5',
    changeActionAmount6: 'Change action count to 6',
    changeActionAmount7: 'Change action count to 7',
    changeActionAmount8: 'Change action count to 8',
    changeActionAmount9: 'Change action count to 9',
    changeActionExponent10: 'Change action count by x10',
    changeActionExponent01: 'Change action count by x0.1',
    saveLoadout: 'Save loadout',
    loadLoadout: 'Load loadout',
    clearLoadout: 'Clear loadout',
    toggleShiftKeyOn: 'Turn on shift key',
    toggleShiftKeyOff: 'Turn off shift key',
    toggleControlKeyOn: 'Turn on control key',
    toggleControlKeyOff: 'Turn off control key',
    moveToNextTown: 'Move to next town',
    moveToPreviousTown: 'Move to previous town',
    showActions: 'Show actions',
    hideActions: 'Hide actions',
    undoLastAction: 'Undo last action',
  },
  stats: {
    title: 'Stats',
    attributes: {
      dexterity: {
        name: 'Dexterity',
        abbreviation: 'Dex',
        description: 'Know your body.',
      },
      strength: {
        name: 'Strength',
        abbreviation: 'Str',
        description: 'Train your body.',
      },
      constitution: {
        name: 'Constitution',
        abbreviation: 'Con',
        description: 'Just a little longer. Just a little more.',
      },
      speed: {
        name: 'Speed',
        abbreviation: 'Spd',
        description: 'Gotta go fast.',
      },
      charisma: {
        name: 'Charisma',
        abbreviation: 'Cha',
        description: 'Conversation is a battle.',
      },
      perception: {
        name: 'Perception',
        abbreviation: 'Per',
        description: "You see what others don't.",
      },
      intelligence: {
        name: 'Intelligence',
        abbreviation: 'Int',
        description: 'Learning to learn.',
      },
      luck: {
        name: 'Luck',
        abbreviation: 'Luck',
        description: 'Opportunity favors the fortunate.',
      },
      soul: {
        name: 'Soul',
        abbreviation: 'Soul',
        description: 'You are the captain.',
      },
    },
    total: {
      singular: 'Total',
      plural: 'Totals',
      description: 'It all adds up.',
    },
    tooltips: {
      level: 'Level',
      levelExperience: 'Level Exp',
      experience: 'Exp',
      talent: 'Talent',
      talentExperience: 'Talent Exp',
      talentMultiplier: 'Talent Mult',
      soulstone: 'Soulstones',
      soulstoneMultiplier: 'Soulstone Mult',
      totalMultiplier: 'Total Mult',
      manaCostReduction: 'Mana Cost Reduction',
      explanation:
        `Each stat level reduces the relevant part of an action's mana cost by a percentage. Talent exp gain is equal to 1% of stat exp gain, and persists through loops. Talent multiplies xp gain by (1+(talentLevel)^0.4/3). XP gain towards a stat per action is (original mana / actual mana) * (talent bonus) per tick. Total Mult is the product of your talent and soulstone bonuses. e.g. Meet People costs 800 mana and has a breakdown of <div class="bold">Int</div> 10% <div class="bold">Cha</div> 80% <div class="bold">Soul</div> 10%. This effectively means 80 of the mana is controlled by <div class="bold">Int</div>, another 80 by <div class="bold">Soul</div>, and the remaining 640 by <div class="bold">Cha</div>. If your <div class="bold">Cha</div> is level 20 when the action is started, the bonus would be x1.2 so it'd be 640 / 1.2 = 533.33 Adding back the 160 from <div class="bold">Soul</div> and <div class="bold">Int</div>, the total mana the action takes (rounded up) is now 694, so ~87% of the original mana cost. The action would give (800/694)*(1+(talent)^0.4/3) level exp per mana for the 694 mana.`,
      graphLegend:
        `Click the legend to show/hide each. Upon freshly starting, Levels and Talent won't change much. Hover Stats for more info.`,
    },
  },
  time_controls: {
    play_button: 'Play',
    pause_button: 'Pause',
    rewind_button: 'Rewind',
    pause_before_restart: 'Pause before restart',
    pause_on_failed_loop: 'Pause on failed loop',
    pause_on_complete: 'Pause on progress complete',
    restart_button: 'Restart',
    restart_text: 'Resets the loop. Not a hard reset.',
    days: 'd',
    hours: 'h',
    minutes: 'm',
    seconds: 's',
    talents_button: 'Talents',
    story_title: 'Story',
    bonus_seconds: {
      title: 'Bonus Seconds',
      main_text: 'While this bonus is on, you get {speed-1} extra seconds per second ({speed}x game speed). ',
      background_disabled:
        'You can adjust this speed or set a different speed for while this tab is in the background in the Extras menu.',
      background_0x:
        'While this tab is in the background (regardless of if this bonus is on or off), the game will not run, and you will gain bonus time as though paused.',
      background_regen:
        'While this tab is in the background (regardless of if this bonus is on or off), the game will run at {background_speed}x speed, and you will gain bonus time at a rate of {1-background_speed} bonus seconds per second.',
      background_1x:
        'While this tab is in the background (regardless of if this bonus is on or off), the game will run at normal speed and consume no bonus time.',
      background_slower:
        'While the bonus is on and this tab is in the background, the game will only consume {background_speed-1} seconds of bonus time per second ({background_speed}x game speed).',
      background_faster:
        'While the bonus is on and this tab is in the background, the game will consume an additional {background_speed-speed} seconds of bonus time per second ({background_speed}x game speed).',
      state: {
        on: 'ON',
        off: 'OFF',
      },
      counter_text: 'Total Bonus Seconds',
      lag_warning: 'Lag detected! Current effective game speed is {lagSpeed}x.',
    },
  },
  tracked_resources: {
    reset_on_restart_txt: 'Resets when the loop restarts.',
  },
  modals: {
    welcome: {
      title: 'Introduction',
      welcome: 'Welcome to Idle Loops!',
      content: `
      Idle Loops is a game where you can loop through time and explore the world. 
      You can do this by clicking the Wander action and clicking Play.
      Watch the numbers change, read all the tooltips, and complete towns to unlock new actions and zones.
      Thank you for playing, and have fun!
      `,
      actions: {
        begin: 'Begin!',
      },
    },
  },
  stories: {
    items: [
      {
        story: `
          You're a simple courier, on a long trip to deliver a high priority package. Just as you entered town,
          you tripped - breaking your glasses - and the package burst open, spilling a strange liquid on you.
          Immediately, your meager amount of mana started draining rapidly. Right as your mana completely ran
          out, you found yourself back in the moment the liquid was absorbed into your skin, with your tiny
          reserves filled... yet draining just as before. This happened again and again, the world resetting
          with you, until you decided you had to figure out a way to prolong how long these 'loops' were. 
          Mana crystals are often stored in pottery around town, perhaps you'll start there ...
        `,
      },
      {
        story: `
          You reach the end of the dungeon, where a softly glowing orb floats on a pedestal. You've found the
          dungeon core - for the first level of the dungeon, at least. As you grasp it, the essence dives into
          you, infusing your very being with the power it holds. It is a small amount of power, but this is a
          small dungeon. You'll be back to take this power again, knowing with the foreign knowledge implanted
          that it will stay with you no matter when you are.
        `,
      },
      {
        story: `
          You reach the end of the dungeon again, but for the first time the core isn't glowing. It's always
          been thought that dungeon cores feed upon the mana spent around them, but you're beginning to think
          the essence of its previous incarnations drains it somehow. It doesn't always happen, but you'll need
          to put more mana into the world to reap the core's benefits out of it. You shrug, accepting yet
          another oddity of the loops.
        `,
      },
      {
        story: `
          After spending most of a loop preparing, you're finally ready to leave Beginnersville. In a way,
          you're going to miss this town, and the thought of leaving almost brings a tear to your eye - until
          you realize you'll just be back next loop. Grumbling, you set off, hiking into the forest. By the time
          you're ready to make camp, you're in a good mood again. The forest is beautiful, teeming with life,
          and looks to have boundless places to explore. Best of all, on your way here, you passed several
          locations that are absolutely saturated with mana - you think you'll check those out first.
        `,
      },
      {
        story: `
          It's always nice, after doing the same dull tasks over and over, to make your way through the forest
          and get to do something new. Whether you're exploring, hunting, learning something or just sitting by
          the waterfall, the forest always makes a great backdrop. However, as pleasant as it's been here, it's
          time to move on, at least for now. It would be a long trip, but luckily, after all your exploring,
          you know some shortcuts, and before long, Merchanton emerges out of the trees. There's a lot to do here!
          Maybe one of the guilds can help you with your looping problem! Or maybe there's a book in the library
          that can lead you to a solution! Or maybe... or maybe... that all sounds like a lot of work, and you
          have been going through a lot lately. Maybe before any of that, you should find a bar and get a drink.
        `,
      },
      {
        story: `
          Abandoning Merchanton's warm and inviting cityscape for the cold and empty hills, you continue on your  
          quest, now moving towards Mount Olympus. As the mountain's jagged peaks grow ever larger on the
          horizon, you groan at the thought that you're going to have to climb that colossus. The only things
          that keep you from turning right around and just looking for another town are the stories you heard in
          Merchanton. Stories of ancient cities made from fire; of a secret civilization of immortals hiding in
          the caverns; of mana so plentiful that it takes only seconds to perform magics that would normally
          take hours. The stories are so outrageous you're sure they're only myths, but myths have to come from
          somewhere, and if these have even a grain of truth to them, the power you could gain far outweighs the
          unpleasantness of simply climbing a mountain.
        `,
      },
      {
        story: `
          You expected to be whisked away to a land of opulence and wonder beyond your wildest dreams. Instead,
          you sat in a cramped room filling out paperwork for three hours before being dropped off outside what
          appears to be an ordinary town, with manicured lawns and meandering sidewalks leading to tidy parks
          and decorations. It's not ordinary though, if you stare at the grass you notice it's just a bit too
          green, the sky just a bit too blue. The literal deity taking a seven foot tall dog on a walk doesn't
          help either. A god passing by asks if you want to contribute to a local charity, and you see another
          god offering tours of 'Valhalla, the greatest city above the world!'
        `,
      },
      {
        story: `
          You find yourself in a land covered in a perpetual haze, with a deep red sky casting an eerie glow
          over the landscape. Alien and oppressive, it's unlike anywhere you've ever been; it feels more
          claustrophobic here than in the shrouded thickets of the forest or the deepest caves of Mt. Olympus.
          This is the shadow realm, a place of such natural hostility that it hurts just to stand here and look
          at it - it's like the haze is reaching inside your mind and suppressing your thoughts. One thing it
          can't suppress, though, is the intense feeling of familiarity at your immediate surroundings. The
          trees may be gnarled and the dirt may be dusty and ashen, but you've walked this road thousands of
          times - you could recognize the outskirts of Beginnersville in your sleep. It's not Beginnersville you
          see off in the distance though. In its place, you find only a desecrated ruin of a village, dominated
          by a massive dark spire sitting in the dead center of town.
        `,
      },
      {
        story: `
          Shadow realm or not, there are enough things that haven't changed that you still lean on your
          established routine. Right down to the part where you have to get some supplies to brave the jungle
          just outside the small town, from a local trader. Too bad this one is quite selectively deaf to your
          attempts at haggling, but hey. You've gotten good enough at budgeting and scrounging up coins that
          you could pay him in the end. Turning your eyes to the narrow trail through the dense jungle before you,
          you set foot among the wild trees, noting the ruins among the tree-trunks. You wonder if this place
          has always been a jungle...
        `,
      },
      {
        story: `
          Learning the finer points of alchemy, of the subtle rules underpinning the "simple" brewing of potions
          had been a long, exhausting trial, but since you have nothing but time on your hands, you have become
          an expert by any standard. As you let a bundle of herbs soak in a mana geyser, you double-check your
          notes and prepare your equipment. The brew itself is finicky but finally, you fill a bottle with the
          fruits of your Great Work. The Loop Potion, the exact same brew that got you into this situation.
          ...Reflecting for a moment, you wonder if there was much of a point to all of this. Not like making
          more of the stuff will get you out of the loops.
        `,
      },
      {
        story: `
          Exploring the jungle took quite a lot of time, and you just barely manage to make your way to the
          other side before the imposing gate among the trees closes. You mentally take note that you're on a
          time limit if you want to make it here on future loops, and that the pattern of the "normal" world
          still holds: On the other side of the jungle lies a small-ish city that proudly identifies itself as
          "Commerceville, the heart of trade!" according to the statue along the way to the city gates. While
          just wandering is liable to get you in trouble with some of the townsfolk, there is a helpful tourist
          guide willing to show you around for a "reasonable" sum. Even if the guide looks a little too eager to
          lead you down the city's many narrow alleyways, you can't deny that learning about the Thieves guild
          was worth the risk to get there. Finally, at the end of the tour, you learn that your guide also works
          for the tax collectors and really can't stay to chat. At least your guide was nice enough to show you
          to the Bank. There is an imposing hooded figure leaning against a wall of the bank, maybe they can
          tell you something more...
        `,
      },
      {
        story: `
          You can't help but chuckle as you make your way out of the Bank's "Big Shot" office, keys to the
          entirety of Commerceville in hand. Sure, the loan wasn't cheap and you'd probably get into a lot of
          trouble if you'd stick around for the first payment, but there's no way your mana reserves will last
          that long. Looking ahead, you blink at the first blatant difference between this world and the normal
          one: There is no Mt. Olympus. Instead, there is a large, wide valley with the ruins of a tower in the
          middle of it. It takes a bit of Doing, but you eventually find a stone covered in familiar runic
          script: "Children of the land! We, the seven guardian deities, challenge you! Find us, fight us, and
          claim the throne of the gods!" ...Oh well, time for a bit of deicide. The "throne of the gods" sounds
          like just the kind of thing that could break you out of the loops, and they did issue a challenge
          for anyone to find. Step one will be to reach them.
        `,
      },
      {
        story: `
          You've done it! You've bested the gods themselves and restored time to its rightful flow. You can stop
          looping at any moment. But, then again, you could keep going. There's always time later... Thanks for
          playing my fan mod of Idle Loops! Big shout-out to the wonderful Stop_Sign for creating this amazing
          game and Omsi for all the Omsi version. You both have inspired me more than you can imagine. Hope
          everyone had fun! <3
          --Lloyd
        `,
      },
    ],
  },
  resources: {
    power: {
      name: 'Power',
      description: 'Power of gods.',
    },
    mana: {
      name: 'Mana',
      description: 'Your main resource. The higher your mana, the more you can do before reset.',
    },
    gold: {
      name: 'Gold',
      description: 'Coins to buy mana crystals and other items with.',
    },
    reputation: {
      name: 'Reputation',
      description: 'The influence you have over the people in town.',
    },
    herbs: {
      name: 'Herbs',
      description: "The beneficial plants you've found.",
    },
    hides: {
      name: 'Hides',
      description: 'Results of successful hunting.',
    },
    potions: {
      name: 'Potions',
      description: 'Rare, but not complex. Worth some money.',
    },
    teamMembers: {
      name: 'Team Members',
      description: "You know their personalities and fighting style. They don't know your name.",
    },
    armor: {
      name: 'Armor',
      description: 'Crafted by your own hand, it protects you from dangers.',
    },
    blood: {
      name: 'Blood',
      description: 'The lifeblood of your body.',
    },
    artifacts: {
      name: 'Artifacts',
      description: "Various old rings, bracelets, amulets, and pendants. They look like they're worth a pretty penny.",
    },
    favors: {
      name: 'Favors',
      description: "You've been generous to important people.",
    },
    enchantments: {
      name: 'Enchanted Armor',
      description: 'Divinely blessed weapons and armor, like a hero of legend.',
    },
    houses: {
      name: 'Houses',
      description: 'A place to call home.',
    },
    pylons: {
      name: 'Pylons',
      description: 'Lingering fragments from the destroyed pylon.',
    },
    zombies: {
      name: 'Zombies',
      description: 'A shambling pile of deceased flesh. Super gross.',
    },
    maps: {
      name: 'Maps',
      description: "A cartographer's kit that can be used to survey areas and discover new secrets.",
    },
    finishedMaps: {
      name: 'Finished Maps',
      description:
        "You've mapped out some part of the world. The Explorer's guild would happily buy this knowledge off of you.",
    },
    hearts: {
      name: 'Hearts',
      description: "The still-beating heart of your target. The Assassin's guild will reward you for this.",
    },
    glasses: {
      name: 'Glasses',
      description: 'Woah, trees have so many leaves on them.',
    },
    supplies: {
      name: 'Supplies',
      description: 'Needed to go to the next town.',
    },
    pickaxe: {
      name: 'Pickaxe',
      description: "It's heavy, but you can make use of it.",
    },
    loopingPotion: {
      name: 'Looping Potion',
      description:
        "It's a potion made with the very same formula that got you into this mess. Why exactly did you make this?",
    },
    citizenship: {
      name: 'Citizenship',
      description: "You're one of Valhalla's proud citizens now, giving you the right to fight in their honor.",
    },
    pegasus: {
      name: 'Pegasus',
      description: 'A horse with great angelic wings. It can run across clouds as easily as dirt.',
    },
    key: {
      name: 'Key',
      description: 'Needed to go to the next town.',
    },
    temporalStone: {
      name: 'Temporal Stone',
      description: 'A strange rock that seems unaffected by the time loops.',
    },
    modifiers: {
      resetable: {
        name: 'Resetable',
        description: 'Resets when the loop restarts.',
      },
    },
  },
} as const;
