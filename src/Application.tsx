import { view } from './views/main.view.ts';
import { setOption, vals } from './original/saving.ts';
import { t } from './locales/translations.utils.ts';

import { WelcomeMessage } from './modules/WelcomeMessage.tsx';
import { actionLog } from './original/globals.ts';
import { capAllTraining, clearList, loadList, nameList, saveList, selectLoadout } from './original/driver.ts';
import { createKeyboardHotkeys } from './keyboard.hotkeys.ts';
import { actionAmount, setActionAmount } from './values.ts';
import { Button } from './components/buttons/Button/Button.tsx';
import { NumberField } from './components/forms/NumberField.tsx';
import { MenuBar } from './modules/Header/MenuBar/MenuBar.tsx';

const Header = () => (
  <header id='timeInfo' style='width: 100%; text-align: center'>
    <div
      id='timeBarContainer'
      style='width: 100%; height: 10px; background: var(--progress-bar-background); text-align: center; position: relative'
    >
      <div
        id='timeBar'
        style='height: 100%; width: 20%; background-color: var(--progress-bar-mana-color); display: block; margin: auto'
      >
      </div>
    </div>
    <MenuBar />
    <div id='trackedResources'>
      <div class='showthat resource' style='display:none' id='powerDiv'>
        <div class='bold'>
          <img src='icons/power.svg' class='smallIcon'></img>
        </div>
        <div id='power'>0</div>
        <div class='showthis'>
          Powers of the gods.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource'>
        <div class='bold'>
          Mana:
        </div>
        <div id='timer'>0 | 0s</div>
        <div class='showthis' style='position: fixed; inset: 28px auto auto 1642.12px; margin: 0px;'>
          Your main resource. The higher your mana, the more you can do before reset.
        </div>
      </div>
      <div class='showthat resource'>
        <div class='bold'>Gold:</div>
        <div id='gold'>0</div>
        <div class='showthis'>
          Coins to buy mana crystals and other items with.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='reputationDiv'>
        <div class='bold'>Reputation:</div>
        <div id='reputation'>0</div>
        <div class='showthis'>
          The influence you have over the people in town.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='herbsDiv'>
        <div class='bold'>Herbs:</div>
        <div id='herbs'>0</div>
        <div class='showthis'>
          The beneficial plants you've found.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='hideDiv'>
        <div class='bold'>Hide:</div>
        <div id='hide'>0</div>
        <div class='showthis'>
          Results of successful hunting.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='potionsDiv'>
        <div class='bold'>Potions:</div>
        <div id='potions'>0</div>
        <div class='showthis'>
          Rare, but not complex. Worth some money.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='teamMembersDiv'>
        <div class='bold'>Team Members:</div>
        <div id='teamMembers'>0</div>
        <div class='showthis'>
          You know their personalities and fighting style. They don't know your name.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='armorDiv'>
        <div class='bold'>Armor:</div>
        <div id='armor'>0</div>
        <div class='showthis'>
          Crafted by your own hand, it protects you from dangers.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='bloodDiv'>
        <div class='bold'>Blood:</div>
        <div id='blood'>0</div>
        <div class='showthis'>
          Regaled for its regenerative properties.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='artifactsDiv'>
        <div class='bold'>Artifacts:</div>
        <div id='artifacts'>0</div>
        <div class='showthis'>
          Various old rings, bracelets, amulets, and pendants. They look like they're worth a pretty penny.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='favorsDiv'>
        <div class='bold'>Favors:</div>
        <div id='favors'>0</div>
        <div class='showthis'>
          You've been generous to important people.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='enchantmentsDiv'>
        <div class='bold'>Enchanted Armor:</div>
        <div id='enchantments'>0</div>
        <div class='showthis'>
          Divinely blessed weapons and armor, like a hero of legend.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='housesDiv'>
        <div class='bold'>Houses:</div>
        <div id='houses'>0</div>
        <div class='showthis'>
          Property constructed in Valhalla. You can collect taxes from tenants.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='pylonsDiv'>
        <div class='bold'>Pylons:</div>
        <div id='pylons'>0</div>
        <div class='showthis'>
          Lingering fragments from the destroyed pylon.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='zombieDiv'>
        <div class='bold'>Zombies:</div>
        <div id='zombie'>0</div>
        <div class='showthis'>
          A shambling pile of deceased flesh. Super gross.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='mapDiv'>
        <div class='bold'>Maps:</div>
        <div id='map'>0</div>
        <div class='showthis'>
          A cartographer's kit that can be used to survey areas and discover new secrets.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='completedMapDiv'>
        <div class='bold'>Finished Maps:</div>
        <div id='completedMap'>0</div>
        <div class='showthis'>
          You've mapped out some part of the world. The Explorer's guild would happily buy this knowledge off of you.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='heartDiv'>
        <div class='bold'>
          <img src='icons/heart.svg' class='smallIcon'></img>
        </div>
        <div id='heart'>0</div>
        <div class='showthis'>
          The still-beating heart of your target. The Assassin's guild will reward you for this.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='glassesDiv'>
        <div class='bold'>
          <img src='icons/buyGlasses.svg' class='smallIcon'></img>
        </div>

        <div class='showthis'>
          Woah, trees have so many leaves on them.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='suppliesDiv'>
        <div class='bold'>
          <img src='icons/buySupplies.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          Needed to go to the next town.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='pickaxeDiv'>
        <div class='bold'>
          <img src='icons/buyPickaxe.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          It's heavy, but you can make use of it.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='loopingPotionDiv'>
        <div class='bold'>
          <img src='icons/loopingPotion.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          It's a potion made with the very same formula that got you into this mess. Why exactly did you make this?
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='citizenshipDiv'>
        <div class='bold'>
          <img src='icons/seekCitizenship.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          You're one of Valhalla's proud citizens now, giving you the right to fight in their honor.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='pegasusDiv'>
        <div class='bold'>
          <img src='icons/pegasus.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          A horse with great angelic wings. It can run across clouds as easily as dirt.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='keyDiv'>
        <div class='bold'>
          <img src='icons/purchaseKey.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          Needed to go to the next town.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
      <div class='showthat resource' style='display:none' id='stoneDiv'>
        <div class='bold'>
          <img src='icons/temporalStone.svg' class='smallIcon'></img>
        </div>
        <div class='showthis'>
          A strange rock that seems unaffected by the time loops.
          <br></br>Resets when the loop restarts.
        </div>
      </div>
    </div>
    <br></br>
    <div id='timeControls'>
      <div id='timeControlsMain'>
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

              <div id='story0'>
                You're a simple courier, on a long trip to deliver a high priority package. Just as you entered town,
                you tripped - breaking your glasses - and the package burst open, spilling a strange liquid on you.
                Immediately, your meager amount of mana started draining rapidly. Right as your mana completely ran out,
                you found yourself back in the moment the liquid was absorbed into your skin, with your tiny reserves
                filled... yet draining just as before. This happened again and again, the world resetting with you,
                until you decided you had to figure out a way to prolong how long these 'loops' were. Mana crystals are
                often stored in pottery around town, perhaps you'll start there ...
              </div>
              <div id='story1'>
                You reach the end of the dungeon, where a softly glowing orb floats on a pedestal. You've found the
                dungeon core - for the first level of the dungeon, at least. As you grasp it, the essence dives into
                you, infusing your very being with the power it holds. It is a small amount of power, but this is a
                small dungeon. You'll be back to take this power again, knowing with the foreign knowledge implanted
                that it will stay with you no matter when you are.
              </div>
              <div id='story2'>
                You reach the end of the dungeon again, but for the first time the core isn't glowing. It's always been
                thought that dungeon cores feed upon the mana spent around them, but you're beginning to think the
                essence of its previous incarnations drains it somehow. It doesn't always happen, but you'll need to put
                more mana into the world to reap the core's benefits out of it. You shrug, accepting yet another oddity
                of the loops.
              </div>
              <div id='story3'>
                After spending most of a loop preparing, you're finally ready to leave Beginnersville. In a way, you're
                going to miss this town, and the thought of leaving almost brings a tear to your eye - until you realize
                you'll just be back next loop. Grumbling, you set off, hiking into the forest. By the time you're ready
                to make camp, you're in a good mood again. The forest is beautiful, teeming with life, and looks to have
                boundless places to explore. Best of all, on your way here, you passed several locations that are
                absolutely saturated with mana - you think you'll check those out first.
              </div>
              <div id='story4'>
                It's always nice, after doing the same dull tasks over and over, to make your way through the forest and
                get to do something new. Whether you're exploring, hunting, learning something or just sitting by the
                waterfall, the forest always makes a great backdrop. However, as pleasant as it's been here, it's time
                to move on, at least for now. It would be a long trip, but luckily, after all your exploring, you know
                some shortcuts, and before long, Merchanton emerges out of the trees. There's a lot to do here! Maybe
                one of the guilds can help you with your looping problem! Or maybe there's a book in the library that
                can lead you to a solution! Or maybe... or maybe... that all sounds like a lot of work, and you have
                been going through a lot lately. Maybe before any of that, you should find a bar and get a drink.
              </div>
              <div id='story5'>
                Abandoning Merchanton's warm and inviting cityscape for the cold and empty hills, you continue on your
                quest, now moving towards Mount Olympus. As the mountain's jagged peaks grow ever larger on the horizon,
                you groan at the thought that you're going to have to climb that colossus. The only things that keep you
                from turning right around and just looking for another town are the stories you heard in Merchanton.
                Stories of ancient cities made from fire; of a secret civilization of immortals hiding in the caverns;
                of mana so plentiful that it takes only seconds to perform magics that would normally take hours. The
                stories are so outrageous you're sure they're only myths, but myths have to come from somewhere, and if
                these have even a grain of truth to them, the power you could gain far outweighs the unpleasantness of
                simply climbing a mountain.
              </div>
              <div id='story6'>
                You expected to be whisked away to a land of opulence and wonder beyond your wildest dreams. Instead,
                you sat in a cramped room filling out paperwork for three hours before being dropped off outside what
                appears to be an ordinary town, with manicured lawns and meandering sidewalks leading to tidy parks and
                decorations. It's not ordinary though, if you stare at the grass you notice it's just a bit too green,
                the sky just a bit too blue. The literal deity taking a seven foot tall dog on a walk doesn't help
                either. A god passing by asks if you want to contribute to a local charity, and you see another god
                offering tours of 'Valhalla, the greatest city above the world!'
              </div>
              <div id='story7'>
                You find yourself in a land covered in a perpetual haze, with a deep red sky casting an eerie glow over
                the landscape. Alien and oppressive, it's unlike anywhere you've ever been; it feels more claustrophobic
                here than in the shrouded thickets of the forest or the deepest caves of Mt. Olympus. This is the shadow
                realm, a place of such natural hostility that it hurts just to stand here and look at it - it's like the
                haze is reaching inside your mind and suppressing your thoughts. One thing it can't suppress, though, is
                the intense feeling of familiarity at your immediate surroundings. The trees may be gnarled and the dirt
                may be dusty and ashen, but you've walked this road thousands of times - you could recognize the
                outskirts of Beginnersville in your sleep. It's not Beginnersville you see off in the distance though.
                In its place, you find only a desecrated ruin of a village, dominated by a massive dark spire sitting in
                the dead center of town.
              </div>
              <div id='story8'>
                Shadow realm or not, there are enough things that haven't changed that you still lean on your
                established routine. Right down to the part where you have to get some supplies to brave the jungle just
                outside the small town, from a local trader. Too bad this one is quite selectively deaf to your attempts
                at haggling, but hey. You've gotten good enough at budgeting and scrounging up coins that you could pay
                him in the end. Turning your eyes to the narrow trail through the dense jungle before you, you set foot
                among the wild trees, noting the ruins among the tree-trunks. You wonder if this place has always been a
                jungle...
              </div>
              <div id='story9'>
                Learning the finer points of alchemy, of the subtle rules underpinning the "simple" brewing of potions
                had been a long, exhausting trial, but since you have nothing but time on your hands, you have become an
                expert by any standard. As you let a bundle of herbs soak in a mana geyser, you double-check your notes
                and prepare your equipment. The brew itself is finicky but finally, you fill a bottle with the fruits of
                your Great Work. The Loop Potion, the exact same brew that got you into this situation. ...Reflecting
                for a moment, you wonder if there was much of a point to all of this. Not like making more of the stuff
                will get you out of the loops.
              </div>
              <div id='story10'>
                Exploring the jungle took quite a lot of time, and you just barely manage to make your way to the other
                side before the imposing gate among the trees closes. You mentally take note that you're on a time limit
                if you want to make it here on future loops, and that the pattern of the "normal" world still holds: On
                the other side of the jungle lies a small-ish city that proudly identifies itself as "Commerceville, the
                heart of trade!" according to the statue along the way to the city gates. While just wandering is liable
                to get you in trouble with some of the townsfolk, there is a helpful tourist guide willing to show you
                around for a "reasonable" sum. Even if the guide looks a little too eager to lead you down the city's
                many narrow alleyways, you can't deny that learning about the Thieves guild was worth the risk to get
                there. Finally, at the end of the tour, you learn that your guide also works for the tax collectors and
                really can't stay to chat. At least your guide was nice enough to show you to the Bank. There is an
                imposing hooded figure leaning against a wall of the bank, maybe they can tell you something more...
              </div>
              <div id='story11'>
                You can't help but chuckle as you make your way out of the Bank's "Big Shot" office, keys to the{' '}
                <i>entirety</i>{' '}
                of Commerceville in hand. Sure, the loan wasn't cheap and you'd probably get into a lot of trouble if
                you'd stick around for the first payment, but there's no way your mana reserves will last that long.
                Looking ahead, you blink at the first blatant difference between this world and the normal one: There is
                no Mt. Olympus. Instead, there is a large, wide valley with the ruins of a tower in the middle of it. It
                takes a bit of Doing, but you eventually find a stone covered in familiar runic script: "Children of the
                land! We, the seven guardian deities, challenge you! Find us, fight us, and claim the throne of the
                gods!" ...Oh well, time for a bit of deicide. The "throne of the gods" sounds like just the kind of
                thing that could break you out of the loops, and they <i>did</i>{' '}
                issue a challenge for anyone to find. Step one will be to reach them.
              </div>
              <div id='story12'>
                You've done it! You've bested the gods themselves and restored time to its rightful flow. You can stop
                looping at any moment. But, then again, you could keep going. There's always time later... Thanks for
                playing my fan mod of Idle Loops! Big shout-out to the wonderful Stop_Sign for creating this amazing
                game and Omsi for all the Omsi version. You both have inspired me more than you can imagine. Hope
                everyone had fun! &lt;3 <br></br>
                --Lloyd
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id='timeControlsOptions'>
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
  </header>
);

const Actions = () => {
  return (
    <div id='actionsColumn'>
      <div id='actionList' style='width: 100%; text-align: center'>
        <div class='showthat'>
          <div class='large bold localized' style='margin-right: -49px' data-locale='actions>title_list'></div>
          <span id='predictorTotalDisplay' class='koviko'></span>
          <span id='predictorStatisticDisplay' class='koviko'></span>
          <div class='showthis'>
            <i class='actionIcon far fa-circle'></i>
            <span class='localized' data-locale='actions>tooltip>icons>circle'></span>
            <br></br>
            <i class='actionIcon fas fa-plus'></i>
            <span class='localized' data-locale='actions>tooltip>icons>plus'></span>
            <br></br>
            <i class='actionIcon fas fa-minus'></i>
            <span class='localized' data-locale='actions>tooltip>icons>minus'></span>
            <br></br>
            <i class='actionIcon fas fa-arrows-alt-h'></i>
            <span class='localized' data-locale='actions>tooltip>icons>arrows_h'></span>
            <br></br>
            <i class='actionIcon fas fa-sort-up'></i>
            <span class='localized' data-locale='actions>tooltip>icons>sort_up'></span>
            <br></br>
            <i class='actionIcon fas fa-sort-down'></i>
            <span class='localized' data-locale='actions>tooltip>icons>sort_down'></span>
            <br></br>
            <i class='actionIcon far fa-check-circle'></i>
            <span style='margin-left: -2px'>/</span>
            <i class='actionIcon far fa-times-circle'></i>
            <span class='localized' data-locale='actions>tooltip>icons>circles'></span>
            <br></br>
            <i class='actionIcon fas fa-times'></i>
            <span class='localized' data-locale='actions>tooltip>icons>times'></span>
            <br></br>
            <span class='localized' data-locale='actions>tooltip>list_explanation'></span>
          </div>
        </div>
        <br></br>
        <div id='expandableList'>
          <div id='curActionsListContainer'>
            <div id='curActionsList'></div>
            <div id='curActionsManaUsed' class='showthat'>
              <div class='bold localized' data-locale='actions>tooltip>mana_used'></div>
              <div id='totalTicks' style='font-size: 0.75rem'></div>
              <div class='showthis localized' data-locale='actions>tooltip>mana_used_explanation'></div>
            </div>
          </div>
          <div id='nextActionsListContainer'>
            <div id='nextActionsList'></div>
            <div
              id='actionTooltipContainer'
              style='margin-top: 10px; width: 100%; text-align: left; max-height: 357px; overflow: auto'
            >
            </div>
            <div class='flex gap-2 items-center'>
              <span class='font-bold'>{t('actions.amounts.title')}</span>
              <Button class='w-8' onClick={() => setActionAmount(1)}>1</Button>
              <Button class='w-8' onClick={() => setActionAmount(5)}>5</Button>
              <Button class='w-8' onClick={() => setActionAmount(10)}>10</Button>
              <NumberField id='actionAmount' value={actionAmount()} onChange={setActionAmount} />
            </div>
          </div>
        </div>
        <div id='actionChanges' style='display: flex; text-align: left; width: 100%; margin-top: 5px'>
          <div id='actionChangeOptions' style='width: 50%'>
            <input
              type='checkbox'
              id='keepCurrentListInput'
              class='checkbox'
              onchange={({ target: { checked } }) => setOption('keepCurrentList', checked)}
            >
            </input>
            <label
              for='keepCurrentListInput'
              class='localized'
              data-locale='actions>tooltip>current_list_active'
            >
            </label>
            <br></br>
            <input
              type='checkbox'
              id='repeatLastActionInput'
              class='checkbox'
              onchange={({ target: { checked } }) => setOption('repeatLastAction', checked)}
            >
            </input>
            <label
              for='repeatLastActionInput'
              class='localized'
              data-locale='actions>tooltip>repeat_last_action'
            >
            </label>
            <br></br>
            <input
              type='checkbox'
              id='addActionsToTopInput'
              class='checkbox'
              onchange={({ target: { checked } }) => setOption('addActionsToTop', checked)}
            >
            </input>
            <label for='addActionsToTopInput' class='localized' data-locale='actions>tooltip>add_action_top'></label>
          </div>
          <div id='actionChangeButtons' style='margin-left: -4px; text-align: right; width: 50%'>
            <button
              id='maxTraining'
              class='button localized'
              style='margin-right: 0px; display: none'
              onClick={() => capAllTraining()}
              data-locale='actions>tooltip>max_training'
            >
            </button>
            <button
              id='clearList'
              class='button localized'
              style='margin-right: 0px'
              onClick={() => clearList()}
              data-locale='actions>tooltip>clear_list'
            >
            </button>
            <div tabindex='0' class='showthatloadout'>
              Manage Loadouts
              <div class='showthisloadout'>
                <button
                  class='loadoutbutton unused'
                  id='load1'
                  onClick={() => selectLoadout(1)}
                  style='width: 200px'
                >
                  Loadout 1
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load2'
                  onClick={() => selectLoadout(2)}
                  style='width: 200px'
                >
                  Loadout 2
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load3'
                  onClick={() => selectLoadout(3)}
                  style='width: 200px'
                >
                  Loadout 3
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load4'
                  onClick={() => selectLoadout(4)}
                  style='width: 200px'
                >
                  Loadout 4
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load5'
                  onClick={() => selectLoadout(5)}
                  style='width: 200px'
                >
                  Loadout 5
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load6'
                  onClick={() => selectLoadout(6)}
                  style='width: 200px'
                >
                  Loadout 6
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load7'
                  onClick={() => selectLoadout(7)}
                  style='width: 200px'
                >
                  Loadout 7
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load8'
                  onClick={() => selectLoadout(8)}
                  style='width: 200px'
                >
                  Loadout 8
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load9'
                  onClick={() => selectLoadout(9)}
                  style='width: 200px'
                >
                  Loadout 9
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load10'
                  onClick={() => selectLoadout(10)}
                  style='width: 200px'
                >
                  Loadout 10
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load11'
                  onClick={() => selectLoadout(11)}
                  style='width: 200px'
                >
                  Loadout 11
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load12'
                  onClick={() => selectLoadout(12)}
                  style='width: 200px'
                >
                  Loadout 12
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load13'
                  onClick={() => selectLoadout(13)}
                  style='width: 200px'
                >
                  Loadout 13
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load14'
                  onClick={() => selectLoadout(14)}
                  style='width: 200px'
                >
                  Loadout 14
                </button>
                <br></br>
                <button
                  class='loadoutbutton unused'
                  id='load15'
                  onClick={() => selectLoadout(15)}
                  style='width: 200px'
                >
                  Loadout 15
                </button>
                <br></br>
                <button
                  class='loadoutbutton localized'
                  style='margin-bottom: 5px; margin-top: 3px'
                  onClick={() => saveList()}
                  data-locale='actions>tooltip>save_loadout'
                >
                </button>
                <button
                  class='loadoutbutton localized'
                  style='margin-bottom: 5px'
                  onClick={() => loadList()}
                  data-locale='actions>tooltip>load_loadout'
                >
                </button>
                <br></br>
                <input
                  id='renameLoadout'
                  value='Loadout Name'
                  style='width: 100px; height: 16px; border: 1px solid var(--input-border); margin-left: 5px; margin-bottom: 2px'
                >
                </input>
                <button
                  class='loadoutbutton'
                  style='margin-bottom: 5px; margin-top: 3px; margin-right: -4px'
                  onClick={() => nameList(true)}
                >
                  Rename
                </button>
              </div>
            </div>
            <select
              id='predictorTrackedStatInput'
              class='button'
              onchange={({ target: { value } }) => setOption('predictorTrackedStat', value)}
            >
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

const Towns = () => (
  <div id='townColumn' style='width: 535px; vertical-align: top'>
    <div id='shortTownColumn'>
      <div id='townWindow' style='width: 100%; text-align: center; height: 34px'>
        <div
          style='float: left; margin-left: 150px'
          class='actionIcon fa fa-arrow-left'
          id='townViewLeft'
          onClick={() => view.showTown(vals.townsUnlocked[vals.townsUnlocked.indexOf(vals.townshowing) - 1])}
        >
        </div>
        <div class='showthat'>
          <div class='large bold'>
            <select class='bold' style='text-align: center' id='TownSelect'></select>
          </div>
          <div id='townDesc' class='showthis'></div>
        </div>
        <div
          style='float: right; margin-right: 150px'
          class='actionIcon fa fa-arrow-right'
          id='townViewRight'
          onClick={() => view.showTown(vals.townsUnlocked[vals.townsUnlocked.indexOf(vals.townshowing) + 1])}
        >
        </div>
        <div id='hideVarsButton' class='far fa-eye' onClick={() => view.toggleHiding()}></div>
      </div>
      <br></br>
      <div id='townInfos'>
        <div id='townInfo0' class='townInfo'></div>
        <div id='townInfo1' class='townInfo' style='display: none'></div>
        <div id='townInfo2' class='townInfo' style='display: none'></div>
        <div id='townInfo3' class='townInfo' style='display: none'></div>
        <div id='townInfo4' class='townInfo' style='display: none'></div>
        <div id='townInfo5' class='townInfo' style='display: none'></div>
        <div id='townInfo6' class='townInfo' style='display: none'></div>
        <div id='townInfo7' class='townInfo' style='display: none'></div>
        <div id='townInfo8' class='townInfo' style='display: none'></div>
      </div>

      <div id='townActionTitle' class='block showthat' style='text-align: center'>
        <div
          style='float: left; margin-left: 150px'
          class='actionIcon fa fa-arrow-left'
          id='actionsViewLeft'
          onClick={() => view.showActions(false)}
        >
        </div>
        <span class='large bold' id='actionsTitle'></span>
        <div class='showthis localized' data-locale='actions>tooltip>desc'></div>
        <div
          style='float: right; margin-right: 150px'
          class='actionIcon fa fa-arrow-right'
          id='actionsViewRight'
          onClick={() => view.showActions(true)}
        >
        </div>
      </div>
      <div id='townActions'>
        <div id='actionOptionsTown0' class='actionOptions'></div>
        <div id='actionOptionsTown1' class='actionOptions' style='display: none'></div>
        <div id='actionOptionsTown2' class='actionOptions' style='display: none'></div>
        <div id='actionOptionsTown3' class='actionOptions' style='display: none'></div>
        <div id='actionOptionsTown4' class='actionOptions' style='display: none'></div>
        <div id='actionOptionsTown5' class='actionOptions' style='display: none'></div>
        <div id='actionOptionsTown6' class='actionOptions' style='display: none'></div>
        <div id='actionOptionsTown7' class='actionOptions' style='display: none'></div>
        <div id='actionOptionsTown8' class='actionOptions' style='display: none'></div>
        <div id='actionStoriesTown0' class='actionStories' style='display: none'></div>
        <div id='actionStoriesTown1' class='actionStories' style='display: none'></div>
        <div id='actionStoriesTown2' class='actionStories' style='display: none'></div>
        <div id='actionStoriesTown3' class='actionStories' style='display: none'></div>
        <div id='actionStoriesTown4' class='actionStories' style='display: none'></div>
        <div id='actionStoriesTown5' class='actionStories' style='display: none'></div>
        <div id='actionStoriesTown6' class='actionStories' style='display: none'></div>
        <div id='actionStoriesTown7' class='actionStories' style='display: none'></div>
        <div id='actionStoriesTown8' class='actionStories' style='display: none'></div>
        <div id='addActionAtCapText' class='localized' data-locale='actions>tooltip>add_at_cap'></div>
      </div>
    </div>
    <div id='actionLogContainer'>
      <div
        id='actionLogTitle'
        class='large bold block localized'
        data-locale='actions>title_log'
        style='margin: 10px auto 2px auto; text-align: center'
      >
      </div>
      <ul id='actionLog'>
        <li
          id='actionLogLoadPrevious'
          class='small italic localized'
          data-locale='actions>log>load_previous'
          onClick={() => actionLog.loadHistory(5)}
        >
        </li>
        <li id='actionLogLatest' class='small italic localized' data-locale='actions>log>latest'></li>
      </ul>
    </div>
  </div>
);
const Stats = () => (
  <div id='statsColumn'>
    <div id='statsWindow' data-view='radar'>
      <div id='statsTitle' class='showthat block'>
        <div class='large bold localized' data-locale='stats>title'></div>
        <div class='showthis localized' data-locale='stats>tooltip>explanation' style='width: 550px'></div>
      </div>
      <div id='statViewSelector' class='block'>
        <input
          type='radio'
          id='regularStats'
          name='statView'
          onClick={() => view.changeStatView()}
          checked
        >
        </input>
        <label for='regularStats' class='localized' data-locale='stats>view>regular'></label>
        <input type='radio' id='radarStats' name='statView' onClick={() => view.changeStatView()}>
        </input>
        <label for='radarStats' class='localized' data-locale='stats>view>radar'></label>
      </div>
      <div class='showthat block' id='radarChart'>
        <svg id='statChart' class='radar-chart' viewBox='-200 -200 400 400' preserveAspectRatio='xMidYMin meet'>
        </svg>
        <div
          class='showthis localized'
          style='margin-top: 20px; width: 375px'
          data-locale='stats>tooltip>graph_legend'
        >
          gfv
        </div>
      </div>
      <div id='statsContainer'>
        <div class='statContainer stat-total showthat' id='totalStatContainer'>
          <div class='statLabelContainer'>
            <div
              class='medium bold stat-name localized'
              style='margin-left: 18px; margin-top: 5px'
              data-locale='stats>total>singular'
            >
            </div>
            <div class='medium statNum stat-soulstone' style='color: var(--stat-soulstone-color)' id='stattotalss'>
            </div>
            <div class='medium statNum stat-talent' id='stattotalTalent'>0</div>
            <div class='medium statNum stat-level' id='stattotalLevel'>0</div>
          </div>
          <div class='showthis' id='stattotalTooltip' style='width: 225px'>
            <div class='medium bold localized' data-locale='stats>total>plural'></div>
            <br></br>
            <div class='localized' data-locale='stats>total>blurb'></div>
            <br></br>
            <div class='medium bold localized colon-after' data-locale='stats>tooltip>level'></div>
            <div id='stattotalLevel2'></div>
            <br></br>
            <div class='medium bold localized colon-after' data-locale='stats>tooltip>talent'></div>
            <div id='stattotalTalent2'></div>
            <br></br>
            <div id='sstotalContainer' class='ssContainer'>
              <div class='bold localized colon-after' data-locale='stats>tooltip>soulstone'></div>
              <div id='sstotal'></div>
            </div>
          </div>
        </div>
      </div>
      <div id='skillList' style='width: 100%; display: none'>
        <div class='showthat'>
          <div class='large bold localized' data-locale='skills>title'></div>
          <div class='showthis localized' data-locale='skills>tooltip>no_reset_on_restart'></div>
        </div>
        <br></br>
        <div class='skillContainer showthat' id='skillSCombatContainer'>
          <div class='skillLabel medium bold localized' data-locale='skills>scombat>label'></div>
          <div class='statNum medium'>
            <div id='skillSCombatLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='showthis'>
            <span class='localized' data-locale='skills>scombat>desc'></span>
            <br></br>
          </div>
        </div>
        <div class='skillContainer showthat' id='skillTCombatContainer'>
          <div class='skillLabel medium bold localized' data-locale='skills>tcombat>label'></div>
          <div class='statNum medium'>
            <div id='skillTCombatLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='showthis'>
            <span class='localized' data-locale='skills>tcombat>desc'></span>
            <br></br>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillCombatContainer'
          onMouseOver={() => view.showSkill('Combat')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>combat>label'></div>
          <div class='statNum medium'>
            <div id='skillCombatLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillCombatLevelBar'></div>
          </div>
          <div class='showthis'>
            <span class='localized' data-locale='skills>combat>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillCombatLevelExp'></div>/<div id='skillCombatLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillCombatLevelProgress'></div>%)
            </div>
            <br></br>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillMagicContainer'
          onMouseOver={() => view.showSkill('Magic')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>magic>label'></div>
          <div class='statNum medium'>
            <div id='skillMagicLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillMagicLevelBar'></div>
          </div>
          <div class='showthis'>
            <span class='localized' data-locale='skills>magic>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillMagicLevelExp'></div>/<div id='skillMagicLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillMagicLevelProgress'></div>%)
            </div>
            <br></br>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillPracticalContainer'
          onMouseOver={() => view.showSkill('Practical')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>practical>label'></div>
          <div class='statNum medium'>
            <div id='skillPracticalLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillPracticalLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>practical>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillPracticalLevelExp'></div>/<div id='skillPracticalLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillPracticalLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>practical>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillAlchemyContainer'
          onMouseOver={() => view.showSkill('Alchemy')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>alchemy>label'>Alchemy</div>
          <div class='statNum medium'>
            <div id='skillAlchemyLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillAlchemyLevelBar'></div>
          </div>
          <div class='showthis'>
            <span class='localized' data-locale='skills>alchemy>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillAlchemyLevelExp'></div>/<div id='skillAlchemyLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillAlchemyLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>alchemy>desc2'></span>
            <br></br>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillDarkContainer'
          onMouseOver={() => view.showSkill('Dark')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>dark>label'></div>
          <div class='statNum medium'>
            <div id='skillDarkLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillDarkLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>dark>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillDarkLevelExp'></div>/<div id='skillDarkLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillDarkLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>dark>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillCraftingContainer'
          onMouseOver={() => view.showSkill('Crafting')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>crafting>label'></div>
          <div class='statNum medium'>
            <div id='skillCraftingLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillCraftingLevelBar'></div>
          </div>
          <div class='showthis'>
            <span class='localized' data-locale='skills>crafting>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillCraftingLevelExp'></div>/<div id='skillCraftingLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillCraftingLevelProgress'></div>%)
            </div>
            <br></br>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillChronomancyContainer'
          onMouseOver={() => view.showSkill('Chronomancy')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>chronomancy>label'></div>
          <div class='statNum medium'>
            <div id='skillChronomancyLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillChronomancyLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>chronomancy>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillChronomancyLevelExp'></div>/<div id='skillChronomancyLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillChronomancyLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>chronomancy>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillPyromancyContainer'
          onMouseOver={() => view.showSkill('Pyromancy')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>pyromancy>label'></div>
          <div class='statNum medium'>
            <div id='skillPyromancyLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillPyromancyLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>pyromancy>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillPyromancyLevelExp'></div>/<div id='skillPyromancyLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillPyromancyLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>pyromancy>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillRestorationContainer'
          onMouseOver={() => view.showSkill('Restoration')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>restoration>label'></div>
          <div class='statNum medium'>
            <div id='skillRestorationLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillRestorationLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>restoration>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillRestorationLevelExp'></div>/<div id='skillRestorationLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillRestorationLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>restoration>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillSpatiomancyContainer'
          onMouseOver={() => view.showSkill('Spatiomancy')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>spatiomancy>label'></div>
          <div class='statNum medium'>
            <div id='skillSpatiomancyLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillSpatiomancyLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>spatiomancy>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillSpatiomancyLevelExp'></div>/<div id='skillSpatiomancyLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillSpatiomancyLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>spatiomancy>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillMercantilismContainer'
          onMouseOver={() => view.showSkill('Mercantilism')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>mercantilism>label'></div>
          <div class='statNum medium'>
            <div id='skillMercantilismLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillMercantilismLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>mercantilism>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillMercantilismLevelExp'></div>/<div id='skillMercantilismLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillMercantilismLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>mercantilism>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillDivineContainer'
          onMouseOver={() => view.showSkill('Divine')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>divine>label'></div>
          <div class='statNum medium'>
            <div id='skillDivineLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillDivineLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>divine>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillDivineLevelExp'></div>/<div id='skillDivineLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillDivineLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>divine>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillCommuneContainer'
          onMouseOver={() => view.showSkill('Commune')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>commune>label'></div>
          <div class='statNum medium'>
            <div id='skillCommuneLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillCommuneLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>commune>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillCommuneLevelExp'></div>/<div id='skillCommuneLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillCommuneLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>commune>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillGluttonyContainer'
          onMouseOver={() => view.showSkill('Gluttony')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>gluttony>label'></div>
          <div class='statNum medium'>
            <div id='skillGluttonyLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillGluttonyLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>gluttony>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillGluttonyLevelExp'></div>/<div id='skillGluttonyLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillGluttonyLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>gluttony>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillWunderkindContainer'
          onMouseOver={() => view.showSkill('Wunderkind')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>wunderkind>label'></div>
          <div class='statNum medium'>
            <div id='skillWunderkindLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillWunderkindLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>wunderkind>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillWunderkindLevelExp'></div>/<div id='skillWunderkindLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillWunderkindLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>wunderkind>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillThieveryContainer'
          onMouseOver={() => view.showSkill('Thievery')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>thievery>label'></div>
          <div class='statNum medium'>
            <div id='skillThieveryLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillThieveryLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>thievery>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillThieveryLevelExp'></div>/<div id='skillThieveryLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillThieveryLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>thievery>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillLeadershipContainer'
          onMouseOver={() => view.showSkill('Leadership')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>leadership>label'></div>
          <div class='statNum medium'>
            <div id='skillLeadershipLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillLeadershipLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>leadership>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillLeadershipLevelExp'></div>/<div id='skillLeadershipLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillLeadershipLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>leadership>desc2'></span>
          </div>
        </div>
        <div
          class='skillContainer showthat'
          id='skillAssassinContainer'
          onMouseOver={() => view.showSkill('Assassin')}
          onMouseOut={() => view.showSkill(undefined)}
        >
          <div class='skillLabel medium bold localized' data-locale='skills>assassin>label'></div>
          <div class='statNum medium'>
            <div id='skillAssassinLevel'>0</div>
          </div>
          <div style='margin-top: 18px'></div>
          <div class='thinProgressBarUpper'>
            <div class='statBar skillExpBar townExpBar' id='skillAssassinLevelBar'></div>
          </div>
          <div class='showthis' style='width: 490px'>
            <span class='localized' data-locale='skills>assassin>desc'></span>
            <br></br>
            <div class='medium bold localized' data-locale='skills>tooltip>level_exp'></div>
            <div id='skillAssassinLevelExp'></div>/<div id='skillAssassinLevelExpNeeded'></div>
            <div class='statTooltipPerc'>
              (<div id='skillAssassinLevelProgress'></div>%)
            </div>
            <br></br>
            <span class='localized' data-locale='skills>assassin>desc2'></span>
          </div>
        </div>
      </div>
      <div id='buffList' style='width: 100%; margin-top: 25px; flex-direction: column; display: none'>
        <div class='showthat'>
          <div class='large bold localized' data-locale='buffs>title'></div>
          <div class='showthis localized' data-locale='buffs>tooltip>no_reset_on_restart'></div>
        </div>
        <br></br>
        <div id='buffsContainer' style='display:flex;flex-direction:column'>
          <div class='buffContainer showthat' id='buffRitualContainer' style='display: none;'>
            <img class='buffIcon' src='icons/darkRitual.svg'></img>
            <div class='skillLabel medium bold'>Dark Ritual</div>
            <div class='showthis'>
              <span>
                The witch appreciates your dedication to the dark arts. +1% to Dark Magic exp gain from the Dark Magic
                action (rounded down) per ritual.
              </span>
              <br></br>
              <span class='localized' data-locale='buffs>dark_ritual>desc2'>
                <div id='DRText'>
                  Actions are:<br></br>10% faster in Beginnersville per ritual from 1-20<br></br>
                </div>
              </span>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffRitualLevel'>0/</div>
            <input type='number' id='buffRitualCap' class='buffmaxinput' value='666'></input>
          </div>
          <div class='buffContainer showthat' id='buffImbuementContainer' style='display: none;'>
            <img class='buffIcon' src='icons/imbueMind.svg'></img>
            <div class='skillLabel medium bold'>Imbue Mind</div>
            <div class='showthis'>
              <span>
                Using power from soulstones, you can increase your mental prowess.<br></br>
                Increases the max amount of times you can do each stat training action by 1 per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffImbuementLevel'>0/</div>
            <input type='number' id='buffImbuementCap' class='buffmaxinput' value='500'></input>
          </div>
          <div class='buffContainer showthat' id='buffImbuement2Container' style='display: none;'>
            <img class='buffIcon' src='icons/imbueBody.svg'></img>
            <div class='skillLabel medium bold'>Imbue Body</div>
            <div class='showthis'>
              <span>
                By sacrificing your accumulated talent, you can permanently improve yourself.<br></br>
                At the start of a new loop, all stats begin at Imbue Body level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffImbuement2Level'>0/</div>
            <input type='number' id='buffImbuement2Cap' class='buffmaxinput' value='500'></input>
          </div>
          <div class='buffContainer showthat' id='buffFeastContainer' style='display: none;'>
            <img class='buffIcon' src='icons/greatFeast.svg'></img>
            <div class='skillLabel medium bold'>Great Feast</div>
            <div class='showthis'>
              <span>
                That feast was so filling that it manages to keep you well satiated through your loops! That's some
                impressive magic.<br></br>
                Combat (from all sources) is increased by 5% per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffFeastLevel'>0/</div>
            <input type='number' id='buffFeastCap' class='buffmaxinput' value='100'></input>
          </div>
          <div class='buffContainer showthat' id='buffAspirantContainer' style='display: none;'>
            <img class='buffIcon' src='icons/aspirant.svg'></img>
            <div class='skillLabel medium bold'>Aspirant</div>
            <div class='showthis'>
              <span>
                Reaching new heights in the spire fills your mind and soul with vigor and clarity.<br></br>
                Talent Exp gain is increased by 1% per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffAspirantLevel'>0/</div>
            <input type='number' id='buffAspirantCap' class='buffmaxinput' value='20'></input>
          </div>
          <div class='buffContainer showthat' id='buffHeroismContainer' style='display: none;'>
            <img class='buffIcon' src='icons/heroism.svg'></img>
            <div class='skillLabel medium bold'>Heroism</div>
            <div class='showthis'>
              <span>
                Completing the Trial fills you with determination.<br></br>
                Combat, Pyromancy, and Restoration Skill Exp gain increased by 2% per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffHeroismLevel'>0/</div>
            <input type='number' id='buffHeroismCap' class='buffmaxinput' value='50'></input>
          </div>
          <div class='buffContainer showthat' id='buffImbuement3Container' style='display: none;'>
            <img class='buffIcon' src='icons/imbueSoul.svg'></img>
            <div class='skillLabel medium bold'>Imbue Soul</div>
            <div class='showthis'>
              <span>
                (Incomplete) Sacrifice everything for the ultimate power.<br></br>
                Increases the exp multiplier of training actions by 100% and raises all action speeds by 50% per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffImbuement3Level'>0/</div>
            <input type='number' id='buffImbuement3Cap' class='buffmaxinput' value='7'></input>
          </div>
          <div class='buffContainer showthat' id='buffPrestigePhysicalContainer' style='display: none;'>
            <img class='buffIcon' src='icons/prestige-Physical.svg'></img>
            <div class='skillLabel medium bold'>Prestige - Physical</div>
            <div class='showthis'>
              <span>
                Increases Experience gain of all Physical stats (Dex, Str, Con, Spd, Per) by 20% per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffPrestigePhysicalLevel'>0/</div>
            <input type='number' id='buffPrestigePhysicalCap' class='buffmaxinput' value='100'></input>
          </div>
          <div class='buffContainer showthat' id='buffPrestigeMentalContainer' style='display: none;'>
            <img class='buffIcon' src='icons/prestige-Mental.svg'></img>
            <div class='skillLabel medium bold'>Prestige - Mental</div>
            <div class='showthis'>
              <span>
                Increases Experience gain of all Mental stats (Cha, Int, Soul, Luck) by 20% per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffPrestigeMentalLevel'>0/</div>
            <input type='number' id='buffPrestigeMentalCap' class='buffmaxinput' value='100'></input>
          </div>
          <div class='buffContainer showthat' id='buffPrestigeCombatContainer' style='display: none;'>
            <img class='buffIcon' src='icons/prestige-Combat.svg'></img>
            <div class='skillLabel medium bold'>Prestige - Combat</div>
            <div class='showthis'>
              <span>
                Increases Self and Team Combat by 20% per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffPrestigeCombatLevel'>0/</div>
            <input type='number' id='buffPrestigeCombatCap' class='buffmaxinput' value='100'></input>
          </div>
          <div class='buffContainer showthat' id='buffPrestigeSpatiomancyContainer' style='display: none;'>
            <img class='buffIcon' src='icons/prestige-Spatiomancy.svg'></img>
            <div class='skillLabel medium bold'>Prestige - Spatiomancy</div>
            <div class='showthis'>
              <span>
                Increases the number of "Findables" per zone by 10% per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffPrestigeSpatiomancyLevel'>0/</div>
            <input type='number' id='buffPrestigeSpatiomancyCap' class='buffmaxinput' value='100'></input>
          </div>
          <div class='buffContainer showthat' id='buffPrestigeChronomancyContainer' style='display: none;'>
            <img class='buffIcon' src='icons/prestige-Chronomancy.svg'></img>
            <div class='skillLabel medium bold'>Prestige - Chronomancy</div>
            <div class='showthis'>
              <span>
                Increases speed of all zones by a multiplier of 5% per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffPrestigeChronomancyLevel'>0/</div>
            <input type='number' id='buffPrestigeChronomancyCap' class='buffmaxinput' value='100'></input>
          </div>
          <div class='buffContainer showthat' id='buffPrestigeBarteringContainer' style='display: none;'>
            <img class='buffIcon' src='icons/prestige-Bartering.svg'></img>
            <div class='skillLabel medium bold'>Prestige - Bartering</div>
            <div class='showthis'>
              <span>
                Increases received from merchants by 10% per level.
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffPrestigeBarteringLevel'>0/</div>
            <input type='number' id='buffPrestigeBarteringCap' class='buffmaxinput' value='100'></input>
          </div>
          <div class='buffContainer showthat' id='buffPrestigeExpOverflowContainer' style='display: none;'>
            <img class='buffIcon' src='icons/prestige-ExperienceOverflow.svg'></img>
            <div class='skillLabel medium bold'>Prestige - Experience Overflow</div>
            <div class='showthis'>
              <span>
                Gives (1.00222^n-1) times the normal amount of experience as extra, given to each stat.<br></br>
                (n = the level of this buff.)
              </span>
              <br></br>
            </div>
          </div>
          <div class='buffNumContainer'>
            <div id='buffPrestigeExpOverflowLevel'>0/</div>
            <input type='number' id='buffPrestigeExpOverflowCap' class='buffmaxinput' value='100'></input>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const Application = () => {
  createKeyboardHotkeys();

  return (
    <>
      <Header />
      <Actions />
      <Towns />
      <Stats />
      <WelcomeMessage />
    </>
  );
};
