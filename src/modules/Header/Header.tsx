import { ParentProps } from 'solid-js';
import { For } from 'solid-js';
import { t } from '../../locales/translations.utils.ts';
import { MenuBar } from './MenuBar/MenuBar.tsx';
import { TimeBar } from './TimeBar/TimeBar.tsx';
import { setOption, vals } from '../../original/saving.ts';
import { view } from '../../views/main.view.ts';

const Story = (props: ParentProps<{ story: number }>) => <div id={`story${props.story}`}>{props.children}</div>;
const Stories = () => (
  <For each={t('stories.items')}>
    {(item, index) => <Story story={index()}>{item.story}</Story>}
  </For>
);
const StoryOption = () => (
  <div class='control'>
    <div
      tabindex='0'
      id='story_control'
      class='contains-popover'
      onfocus={() => view.updateStory(vals.storyShowing)}
      style='height:30px;'
    >
      <div class='large bold'>
        Story
      </div>
      <div id='newStory' style='color:var(--alert-color);display:none;'>(!)</div>
      <div id='story_tooltip' class='popover-content' style='width:400px;'>
        <button style='margin-left:175px;' class='actionIcon fa fa-arrow-left control' id='storyLeft'></button>
        <div style='' id='storyPage' class='bold control'></div>
        <button style='' class='actionIcon fa fa-arrow-right control' id='storyRight'></button>
        <Stories />
      </div>
    </div>
  </div>
);
const Resources = () => {
  return (
    <div class='grid grid-cols-4 gap-2'>
      <div class='showthat resource !block' id='powerDiv'>
        <div class='bold'>
          <img src='icons/power.svg' class='smallIcon'></img>
        </div>
        <div id='power'>0</div>
        <div class='showthis'>
          Powers of the gods.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='manaDiv'>
        <div class='bold'>
          Mana:
        </div>
        <div id='timer'>0 | 0s</div>
        <div class='showthis' style='position: fixed; inset: 28px auto auto 1642.12px; margin: 0px;'>
          Your main resource. The higher your mana, the more you can do before reset.
        </div>
      </div>
      <div class='showthat resource !block' id='goldDiv'>
        <div class='bold'>Gold:</div>
        <div id='gold'>0</div>
        <div class='showthis'>
          Coins to buy mana crystals and other items with.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='reputationDiv'>
        <div class='bold'>Reputation:</div>
        <div id='reputation'>0</div>
        <div class='showthis'>
          The influence you have over the people in town.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='herbsDiv'>
        <div class='bold'>Herbs:</div>
        <div id='herbs'>0</div>
        <div class='showthis'>
          The beneficial plants you've found.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='hideDiv'>
        <div class='bold'>Hide:</div>
        <div id='hide'>0</div>
        <div class='showthis'>
          Results of successful hunting.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='potionsDiv'>
        <div class='bold'>Potions:</div>
        <div id='potions'>0</div>
        <div class='showthis'>
          Rare, but not complex. Worth some money.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='teamMembersDiv'>
        <div class='bold'>Team Members:</div>
        <div id='teamMembers'>0</div>
        <div class='showthis'>
          You know their personalities and fighting style. They don't know your name.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='armorDiv'>
        <div class='bold'>Armor:</div>
        <div id='armor'>0</div>
        <div class='showthis'>
          Crafted by your own hand, it protects you from dangers.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='bloodDiv'>
        <div class='bold'>Blood:</div>
        <div id='blood'>0</div>
        <div class='showthis'>
          Regaled for its regenerative properties.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='artifactsDiv'>
        <div class='bold'>Artifacts:</div>
        <div id='artifacts'>0</div>
        <div class='showthis'>
          Various old rings, bracelets, amulets, and pendants. They look like they're worth a pretty penny.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='favorsDiv'>
        <div class='bold'>Favors:</div>
        <div id='favors'>0</div>
        <div class='showthis'>
          You've been generous to important people.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='enchantmentsDiv'>
        <div class='bold'>Enchanted Armor:</div>
        <div id='enchantments'>0</div>
        <div class='showthis'>
          Divinely blessed weapons and armor, like a hero of legend.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='housesDiv'>
        <div class='bold'>Houses:</div>
        <div id='houses'>0</div>
        <div class='showthis'>
          Property constructed in Valhalla. You can collect taxes from tenants.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='pylonsDiv'>
        <div class='bold'>Pylons:</div>
        <div id='pylons'>0</div>
        <div class='showthis'>
          Lingering fragments from the destroyed pylon.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='zombieDiv'>
        <div class='bold'>Zombies:</div>
        <div id='zombie'>0</div>
        <div class='showthis'>
          A shambling pile of deceased flesh. Super gross.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='mapDiv'>
        <div class='bold'>Maps:</div>
        <div id='map'>0</div>
        <div class='showthis'>
          A cartographer's kit that can be used to survey areas and discover new secrets.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='completedMapDiv'>
        <div class='bold'>Finished Maps:</div>
        <div id='completedMap'>0</div>
        <div class='showthis'>
          You've mapped out some part of the world. The Explorer's guild would happily buy this knowledge off of you.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='heartDiv'>
        <div class='bold flex items-center gap-2'>
          <span>Hearts</span>
          <img src='icons/heart.svg' class='smallIcon'></img>
          <span>:</span>
        </div>
        <div id='heart'>0</div>
        <div class='showthis'>
          The still-beating heart of your target. The Assassin's guild will reward you for this.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='glassesDiv'>
        <div class='bold'>
          <img src='icons/buyGlasses.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          Woah, trees have so many leaves on them.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='suppliesDiv'>
        <div class='bold'>
          <img src='icons/buySupplies.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          Needed to go to the next town.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='pickaxeDiv'>
        <div class='bold'>
          <img src='icons/buyPickaxe.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          It's heavy, but you can make use of it.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='loopingPotionDiv'>
        <div class='bold'>
          <img src='icons/loopingPotion.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          It's a potion made with the very same formula that got you into this mess. Why exactly did you make this?
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='citizenshipDiv'>
        <div class='bold'>
          <img src='icons/seekCitizenship.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          You're one of Valhalla's proud citizens now, giving you the right to fight in their honor.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='pegasusDiv'>
        <div class='bold'>
          <img src='icons/pegasus.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          A horse with great angelic wings. It can run across clouds as easily as dirt.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='keyDiv'>
        <div class='bold'>
          <img src='icons/purchaseKey.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          Needed to go to the next town.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource !block' id='stoneDiv'>
        <div class='bold'>
          <img src='icons/temporalStone.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          A strange rock that seems unaffected by the time loops.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
    </div>
  );
};
export const Header = () => (
  <header class='col-span-3 flex flex-col gap-2'>
    <TimeBar />
    <div class='grid grid-cols-3 gap-2'>
      <MenuBar />
      <div>
        <div>
          <button id='pausePlay' class='button control'>Play</button>
          <button id='manualRestart' class='button showthat control'>
            Restart
            <div class='showthis' style='color:var(--default-color);width:230px;'>
              Resets the loop. Not a hard reset.
            </div>
          </button>
          <input
            id='bonusIsActiveInput'
            type='checkbox'
            onchange={() => setOption('bonusIsActive', !vals.options.bonusIsActive)}
          >
          </input>
          <button id='toggleOfflineButton' class='button showthat control'>
            Bonus Seconds
            <div class='showthis' id='bonusText' style='max-width:500px;color:var(--default-color);'>
              <p>While this bonus is on, you get 19 extra seconds per second (20x game speed).</p>
              <p>
                You can adjust this speed or set a different speed for while this tab is in the background in the Extras
                menu.
              </p>
              <p>Accrue 1 bonus second per second when paused or offline. (capped at 1 month per offline period)</p>
              <p>
                Bonus is <span class='bold' id='isBonusOn'>ON</span>
              </p>
              <p>
                <span class='bold'>Total Bonus Seconds</span> <span id='bonusSeconds'>16d 8h 12m 27s</span>
              </p>
            </div>
          </button>
          <StoryOption />
        </div>
        <div>
          <div class='control'>
            <input
              type='checkbox'
              id='pauseBeforeRestartInput'
              onChange={({ target: { checked } }) => setOption('pauseBeforeRestart', checked)}
            >
            </input>
            <label for='pauseBeforeRestartInput'>Pause before restart</label>
          </div>
          <div class='control'>
            <input
              type='checkbox'
              id='pauseOnFailedLoopInput'
              onChange={({ target: { checked } }) => setOption('pauseOnFailedLoop', checked)}
            >
            </input>
            <label for='pauseOnFailedLoopInput'>Pause on failed loop</label>
          </div>
          <div class='control'>
            <input
              type='checkbox'
              id='pauseOnCompleteInput'
              onChange={({ target: { checked } }) => setOption('pauseOnComplete', checked)}
            >
            </input>
            <label for='pauseOnCompleteInput'>Pause on progress complete</label>
          </div>
        </div>
      </div>
      <Resources />
    </div>
  </header>
);
