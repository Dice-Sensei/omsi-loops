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
    list: {
      name: 'Action list',
      actions: {
        cap: 'cap to current max',
        add: 'add one loop',
        remove: 'remove one loop',
        split: 'split action',
        moveUp: 'move action up',
        moveDown: 'move action down',
        toggle: 'enable/disable action',
        dragAndDrop:
          'drag and drop the actions to re-arrange them. The next list becomes the current list every restart. One second= 50 mana (times your speed multiplier). Minimum 1 tick per action. Restarts automatically upon no actions left.',
        maxTraining: 'max training',
      },
      current: {
        use: {
          manaUsed: 'mana used',
          tooltip: `
            Shows stat gain affecting speed.
            Updates every completed action.
            Accurate at the end of the run.
          `,
        },
      },
      options: {
        keepCurrentList: 'keep current list',
        repeatLastList: 'repeat last list',
        addActionToTop: 'add action to top',
      },
      amounts: {
        title: 'Amount',
      },
      loadouts: {
        title: 'Manage Loadouts',
        load: 'Load {{name}}',
        actions: {
          rename: 'rename',
          load: 'load',
          save: 'save',
        },
      },
    },
    actions: {
      survey: {
        name: 'Survey',
        states: {
          isLocalDone: 'Surveyed',
          isGlobalDone: 'World surveyed',
        },
        description: `
          The explorers guild has taught you how to find what most would miss.
          Gives max(1, floor(sqrt(avg(progress)))) talent exp per action.
          Each percent surveyed gives and additional 0.5% findables in this zone (additive with Spatiomancy).
          Costs 1 map and gives 1 completed map, unless this zone's survey is at 100%.
        `,
        stories: [
          `20% world survey: You decide it is time to discover the world, the journey is long but so worth it.`,
          `40% world survey: Crazy how discovering the world all over again is shedding a new light on the world! New things you have never seen before turned out to be just around the corner.`,
          `60% world survey: Nobody is stopping you from exploring more and more, it feels nice. And the views are spectacular to boot!`,
          `80% world survey: You are almost done with your world trip and you have enjoyed every second of it. You wish the explorer's guild would have found more locations to visit, but even the world has its boundaries.`,
          `100% world survey: You have discovered the whole world once more. Knowing there are no more new horizons to explore makes you a little sad, but the satisfaction from the achievement is stronger!`,
        ],
      },
      assassin: {
        name: 'Assassinate',
        states: {
          isDone: 'Assassinated',
        },
        description: `
          Discreetly kill your mark in this town. 
          The more well-known you are, for either good or evil, the harder pulling this off will be...
          Gives progress equal to (sqrt(practical) + thievery + assassination) * (1+stat/1000) * sqrt(1+completions/100) / max(1,abs(reputation)) / max(1,hearts) * base/actual cost.
          Lose max(0,250*zone-assassination) reputation, regardless of whether you were successful or not.
          Rewards a heart on successful kill.
        `,
        segments: [
          `scout target`,
          `devise plan`,
          `kill target`,
          `destroy evidence`,
          `flee the scene`,
        ],
        stories: [
          `Target assasinated: His name was Ethan, you met him on your fifteenth loop. Always seemed to be getting into some sort of trouble. You ambush him as he strolls down an alley and carve out his heart before he knows what happened. He'll be fine next loop, you tell yourself.`,
          `Target assasinated: A big man dressed in muddy leathers, he's crouching in the bushes with his bow as usual. They told you his name is Gustav, but you had to take their word for it; you've seen the man multiple times but have never actually spoken to him. You watch from behind a tree as he nocks an arrow and aims, his muscles flexing with the effort. His target, a bear, falls with a single arrow to the head, but before the hunter can rise to harvest his prey, one of your arrows stabs into his thigh. Instantly, he turns to run, but another arrow lands in his back, and before he gets far, he's falling with a final arrow to the head. You prepare your daggers to begin harvesting his heart. He never had a chance.`,
          `Target assasinated: You made your way into the casino, spending some time just playing around until you spotted your target. Aleandro, according to your contact in the Guild. Whether it's a nickname or his given name, a mark is a mark, so you set to work. Throwing your last game, you politely declare that you're out of money and leave the table, just as your mark heads out to the restrooms. You follow behind him and, once you've completed your mission, make sure to lock his stall behind you to try to delay the discovery as you leave with heart in hand.`,
          `Target assasinated: The name for your next mark is... just some kind of unintelligible jumble of throaty sounds. The hard part is to figure out which of the many trolls that make the mountain their home, but you get lucky eventually. Better yet, your mark is missing an arm, making it stand out in the crowd. Planning the kill is smooth sailing from there on out, and you manage to strike it in the neck while it's eating, then gut it for its heart.`,
          `Target assasinated: This mark is different in that you know her well. For a self-declared Goddess of hearth and home, Hestia sure is tardy when it comes to paying her taxes. The plan goes smoothly as well; build a house you know she'll like with a little extra sound insulation and a faulty lock on one of the windows, slip in under cover of night and slit her throat before she can wake up. Having the blood of a Goddess on your hands makes you feel dirty in a way that your previous marks didn't, though.`,
          `Target assasinated: You have to hurry to get the kill on your mark here, since everyone still around seems to be on the verge of death anyway. Subtlety goes straight out of the window as you walk over to your mark with knife drawn, while they look at you with a hopeful expression. You could even swear you heard a "thank you" on their last, gurgling breath.`,
          `Target assasinated: You swear this one would have been a sick joke from the Guild, if you weren't even more convinced that killing your sense of humour is part of the induction process. Having to track down some half-wild survivor and gut them before the jungle does it first is a pain, and it takes you far more time than you like to even find your mark in the first place. Thankfully, you eventually spot them, running away from the Jungle's actual inhabitants, and it doesn't take more than a few words to convince him to all but run into your blade.`,
          `Target assasinated: You idly wonder why the Guild even bothered to send you out for a job on their home turf. With the headquarters here, there should be plenty of more trusted guild members champing at the bit to take care of this one. In any case, you opt to blend into the crowd rather than jump across the roofs. Too many eyes looking up in the search for trouble around here. Getting the mark away from his entourage goes smoothly after you give a street urchin a bribe to cause a distraction, giving you plenty of time to drag the rich fool into an alleyway and cut him open for his heart.`,
        ],
      },
      ruinsZ1: {
        name: 'Ruins',
        states: {
          isDone: 'Delved',
        },
        description: `
          As you explore, you find ruins scattered among the trees. You better explore them, who knows what useful secrets they hide.
        `,
        stories: [
          `10% delved: You decide to explore the ruins in the Forest and notice some weird looking rocks, wondering idly what they do.`,
          `50% delved: After investigating these weird looking rocks you notice they are cubical and are heavy, looks like they are dusty from the time they have been sitting here.`,
          `100% delved: You have discovered everything in these ruins, and notice that there are so many cubical stones lying everywhere, as if a massive battle happened.`,
        ],
      },
      ruinsZ3: {
        name: 'Ruins',
        states: {
          isDone: 'Delved',
        },
        description: `
          As you explore, you find ruins scattered around the Mountain. You better explore them, who knows what useful secrets they hide.
        `,
        stories: [
          `10% delved: You decide to explore the ruins around Mt. Olympus and notice the same cubical rocks as you found in the forest. You wonder what they were made for.`,
          `50% delved: There is a stone with some writing, with your high intelligence you might be able to read this strange language.`,
          `100% delved: After looking around the ruins for some time, you find something curious: a rusted weapon, resembling that of Valhalla's Valkyries. You wonder what really happened here.`,
        ],
      },
      ruinsZ5: {
        name: 'Ruins',
        states: {
          isDone: 'Delved',
        },
        description: `
          As you explore, you find ruins scattered around the shadowy village. You better explore them, who knows what useful secrets they hide.
        `,
        stories: [
          `10% delved: You decide to explore the ruins of Startington and notice the same dusty cubical rocks as you found in the other ruins. You wonder what they do.`,
          `50% delved: After deciphering the text on this stone block, You can see some writing on them. Sadly, much of the writing is too eroded to make out.`,
          `100% delved: The text explains that the Valkyries started a war that lasted for a month, but after only a month of fighting they suddenly declared peace. Who did they fight against though?`,
        ],
      },
      ruinsZ6: {
        name: 'Ruins',
        states: {
          isDone: 'Delved',
        },
        description: `
          As you explore, you find ruins scattered around the dense jungle. You better explore them, who knows what useful secrets they hide.
        `,
        stories: [
          `10% delved: You decide to explore the ruins along the Jungle Path and notice yet again more of the same dusty and heavy cubical rocks. The mystery of the rocks endures...`,
          `50% delved: During your ruin exploration, you find a weapon. Ancient, heavy and ornate. It takes some thinking, but you eventually recall a legend of a God wielding this particular weapon into battle.`,
          `100% delved: After much delving, you find a different God's weapon. This one was buried under a small pile of rubble like a grave. The blade has an inscription declaring the end of a war. The same war the Valkyries' writing mentioned? Was there a war between the Gods and the Valkyries?`,
        ],
      },
      haulZ1: {
        name: 'Haul',
        states: {
          isDone: 'Stones hauled',
        },
        description: `
          You find a strange kind of stone that resists change from the loop. When you move them, they remain in the new location the next time you return. Most of the rocks around are just ordinary though. It'll take a while to find the interesting ones.
          You're sure you can use them for something, but they're too heavy to move more than one at a time.
          One in every one thousand Stones is Temporal.
          Action fails if you have a Temporal Stone.
        `,
        tooltips: {
          stonesLeft: 'Temporal Stones left',
          stonesTotal: 'Temporal Stones Total',
          stonesToCheck: 'Stones to check',
        },
        stories: [
          `First Temporal Stone Found: After digging through the cubical stones, you notice a swirl of light blue light glowing on the sides of the rock. While the light makes them easier to hold on to, they still weigh a ton...`,
          `Moved 100 Temporal Stones: Carrying a chunk of rock nearly all the way from the very start of the loop to the Valley of Olympus is backbreaking work, but you're managing! Just keep putting one foot in front of the other.`,
          `Moved 250 Temporal Stones: You wipe the sweat off your brow as the last Temporal stone from the Forest settles down in the Valley of Olympus. ...Imposing as the pile of rocks is, it won't be enough yet.`,
        ],
      },
      haulZ3: {
        name: 'Haul',
        states: {
          isDone: 'Stones hauled',
        },
        description: `
          Among the ruins on Mount Olympus, you find several large stones that appear mundane at first, but which seem unaffected by the time loops you're stuck in. Not many, and finding the ones with this trait will take some serious work.
          You're sure you can use them for something, but they're too heavy to move more than one at a time.
          One in every one thousand Stones is Temporal.
          Action fails if you have a Temporal Stone.
        `,
        tooltips: {
          stonesLeft: 'Temporal Stones left',
          stonesTotal: 'Temporal Stones Total',
          stonesToCheck: 'Stones to check',
        },
        stories: [
          `First Temporal Stone Found: Digging through the large stone cubes, your hand brushes over a spiral glyph. As the previously invisible design begins to glow a cool blue, you find that you can hold on to the rock more easily! It still weighs a ton, though.`,
          `Moved 100 Temporal Stones: You're not even halfway done and the pace is horrendously slow, but since you're certain you'd be crushed to jelly if you even tried to carry more than one, you just keep at it. One stone cube at a time.`,
          `Moved 250 Temporal Stones: You stretch with a satisfied groan as the final chunk of Temporal stone from Mount Olympus settles in the pile at the Valley of Olympus. Maybe you can rebuild the mountain, you have time...`,
        ],
      },
      haulZ5: {
        name: 'Haul',
        states: {
          isDone: 'Stones hauled',
        },
        description: `
          While exploring Startington, you find the ruins of a few buildings you're certain do not exist in Beginnersville. Investigating further, you find that some of the stonework of those buildings is unaffected by the loops. Figuring which ones is going to take some doing...
          You're sure you can use them for something, but they're too heavy to move more than one at a time.
          One in every one thousand Stones is Temporal.
          Action fails if you have a Temporal Stone.
        `,
        tooltips: {
          stonesLeft: 'Temporal Stones left',
          stonesTotal: 'Temporal Stones Total',
          stonesToCheck: 'Stones to check',
        },
        stories: [
          `First Temporal Stone Found: Practically the moment you identify one grey cube of rock as different from the surrounding, identical-looking grey cubes of rock, a spiral pattern lights up on its sides, practically gluing itself to your hand! You can still set it down, but it clearly wants to be carried.`,
          `Moved 100 Temporal Stones: Wiggling the temporal stones out from among the mundane ones is the easy part, dragging them to the Valley of Olympus is the real pain in your back.`,
          `Moved 250 Temporal Stones: The final stone, conveniently enough, was near the top of a wall that housed several Temporal stones. The wall has collapsed from having so many bricks removed by the time you're looking for the final stone, so you can just pick it up and make the final delivery to the Valley of Olympus.`,
        ],
      },
      haulZ6: {
        name: 'Haul',
        states: {
          isDone: 'Stones hauled',
        },
        description: `
          On one loop, you trip over a loose piece of stone. On the following loop, you notice it's no longer in the spot you tripped over it. Looking around more closely, you find that there are a few stones with this property. Too bad the Jungle is home to a lot of stones...
          You're sure you can use them for something, but they're too heavy to move more than one at a time.
          One in every one thousand Stones is Temporal.
          Action fails if you have a Temporal Stone.
        `,
        tooltips: {
          stonesLeft: 'Temporal Stones left',
          stonesTotal: 'Temporal Stones Total',
          stonesToCheck: 'Stones to check',
        },
        stories: [
          `First Temporal Stone Found: Many of the temporal stones are covered in vegetation, and you nearly throw out your back trying to dislodge one. Lift from your legs!`,
          `Moved 100 Temporal Stones: Heavy and hidden as they are, the blue swirl that ignites on the rocks makes them a lot easier to track. That, and it helps that they "let" you pick them up.`,
          `Moved 250 Temporal Stones: On the final stone-hauling trip from the Jungle to the Valley, you smirk a little at the various ditches and holes from which you pulled stones previously. Thank the stars you're done here.`,
        ],
      },
      townZ0: {
        options: {
          map: {
            name: 'Map',
            states: {
              isDone: 'Map found',
            },
            description: `
              The Explorers' guild has taught you how to use cartographer's kits to map your surroundings. This will help you keep track of things and, with some luck, find secrets you overlooked before.
              There's a shop here in Beginnersville that will sell them for just {{cost}} gold each.
            `,
            stories: [
              `Bought a Map: The map you purchase isn't exactly sparse; the roads are inked in with precision and all the major buildings are labeled. However, there's still a lot of work to do - many of the minor buildings are unlabeled, foliage is marked only as vague scribblings, and you distinctly recall several alleys that are missing on it. And this map is only for one small section of town; charting out the entirety of this place is going to take a lot of time... and a lot of ink. You wait until the attendant is occupied, then grab a set of scribing tools on your way out.`,
            ],
          },
          wander: {
            name: 'Wander',
            states: {
              isDone: 'Explored',
            },
            description: `
              Explore the town, look for hidden areas and treasures.
            `,
            stories: [
              `20% explored: You know the general layout of the small village now, you don't get lost walking from one side to another!`,
              `40% explored: You're starting to really know your way around, you can almost figure your way around without following a set path!`,
              `60% explored: You've trod all the main roads and you avail yourself to the unkempt side paths and less well-worn paths. If you let yourself into some houses along the way, well, no one needs to know, do they?`,
              `80% explored: You've decided to explore the houses now that you've trod every single feasible path in this small village. Man, the stuff people keep around.`,
              `100% explored: You've been everywhere, there is absolutely nowhere in this town you haven't been. You've been in every cellar, under every bed, and in every closet. You've pried all the floorboards, and just in general, been into everything. Except the houses with locks, those dastardly locks.`,
            ],
          },
          smashPots: {
            name: 'Smash Pots',
            states: {
              isDone: 'Pot smashed',
            },
            description: `
              They're just sitting there, unbroken, full of potential.Pots with mana in them have {{mana}} mana in them.
              Every 10th pot has mana in it.
            `,
            tooltips: {
              potsLeft: 'Pots with mana left',
              potsTotal: 'Pot with mana total',
              potsToCheck: 'Pots to check for mana',
            },
            stories: [
              `50 Pots with mana: You've smashed every single pot in this village, and have figured out all the pots that contain any trace of mana. Having to break them all physically was time-consuming, and your skills at absorbing the mana weren't the best. There must be more efficient ways of doing it.`,
              `75 Pots with mana: There are a lot more pots around this town than you originally thought, many of them in the weirdest of places. Down drains, inside vents... there's one on the roof of this house and another inside the wood foundation of the house next door. You're not sure how many of them are deliberately hidden and how many are just lost, but you are sure you never would have found them if you hadn't spent so long combing every inch of this place.`,
            ],
          },
          pickLocks: {
            name: 'Pick Locks',
            states: {
              isDone: 'Locks Picked',
            },
            description: `
            Don't worry; they won't remember.
            Houses with valuables in them have {{gold}} gold.
            Every 10 houses have gold.
            Unlocked at 20% Explored.
          `,
            tooltips: {
              housesLeft: 'Houses with valuables left',
              housesTotal: 'Houses with valuables total',
              housesToCheck: 'Houses to check for valuables',
            },
            stories: [
              `House checked: You manage to pick a lock that was in disrepair and opened the door, only to walk into the home's inhabitant. Good thing the loop ended not soon after. You're gonna have to figure out which houses are worth hitting. Some money wouldn't go astray.`,
              `50 Houses known: You really should look at hitting those locked houses around, who knows what goodies you'll manage to scrounge up.`,
              `10 Houses with loot: You've figured out which houses are uninhabited and have enough gold for it to be worth your time. As they say, time is mana!`,
              `25 Houses with loot in a loop: Some would say that entering a house from the back door instead of the front doesn't change what you find inside. Some people aren't masters of spatiomancy.`,
            ],
          },
          buyGlasses: {
            name: 'Buy Glasses',
            description: `
            That's not fair. There was time now. There was all the time I needed.
            Now you have to get new glasses again for 10 gold!
            Causes Wander to be 4x as effective for the rest of the loop.
            Affects any action with the glasses icon
            Can only have 1 Buy Glasses action.
            Unlocked at 20% explored.
          `,
            stories: [
              `Glasses bought: The world snaps into sharp focus as you put them on and you gawk a little as details that had slipped your eyes previously stood out in sharp contrast. You're a little gobsmacked at how much of a difference they make.`,
              `Glasses found: You grumble a little as you pull your backup glasses from your head and put them on. Got to give it to that merchant, he never so much as blinked in surprise while you were buying yet another pair from him.`,
            ],
          },
          foundGlasses: {
            name: 'Found Glasses',
            description: `
            You could have sworn you had a spare pair of glasses somewhere. Now you've explored to the ends of the world. Every nook and cranny has revealed to you their secrets. And you've found them - in the last place anyone would ever think to look: on top of your head.
            You now start all loops with glasses.
          `,
          },
          buyManaZ1: {
            name: 'Buy Mana',
            description: `
            1 gold = {{mana}} mana. Buys all the mana you can.
            Unlocked at 20% Explored.
          `,
            stories: [
              `Bought Mana: A mana salesman?! For most people, this would only be a convenience, but given your current situation, this might be the most valuable thing you ever could have found.`,
            ],
          },
          buyManaChallenge: {
            name: 'Buy Mana',
            description: `
            1 gold = {{mana}} mana. Buys all the mana you can.
            The merchant only has 7500 mana to sell, though.
            Unlocked at 20% Explored.
          `,
            stories: [
              `Bought Mana: You walk up to the mana stand, ready to throw your money at the man behind the counter, but he interrupts you before you can get a word out. "I'm sure you understand my <i>reasonable</i> prices, yes? Times are hard during this drought - my colleagues are all out of stock, and I only have 7500 mana left for sale myself." His prices are extortionate, but you pay them with gritted teeth, having no other option.`,
              `7500 Mana Bought: After you buy everything the man has for sale, he immediately states that he's out of stock and proceeds to slam the stall window on you. As he disappears, you spot a shadow of fear cross his face. He must have had to deal with a lot of angry would-be customers these days.`,
            ],
          },
          meetPeople: {
            name: 'Meet People',
            states: {
              isDone: 'People Met',
            },
            description: `
            They won't let you get away with a simple chat.
            Unlocked at 22% Explored.
          `,
            stories: [
              `1% People Met: You stand there, a little stumped at the situation you've gotten yourself into, when a young lass asks you about your day so far.`,
              `20% People Met: The people here are generally nice enough, if a bit brusque at times. Some people have small tasks that they're happy to pay for.`,
              `40% People Met: There are a surprising amount of people in the village. You didn't catch that when you were looking around.`,
              `60% People Met: It almost seems that most people have something they want done, the real problem is figuring out what's worth your time.`,
              `80% People Met: Having met such a large portion of the people in this village, you almost feel guilty about stealing from them. Almost.`,
              `100% People Met: You've spoken to everyone. Every child, adult, teen, animal and plant in this village. Everyone, and everything.`,
            ],
          },
          trainStrength: {
            name: 'Train Strength',
            description: `
            Build up those muscles. Again.Has 4x exp/talent gain, and can only be done {{limit}} times per reset.
            Unlocked at 5% People Met.
            `,
            stories: [
              `Strength trained: You lift the oak barrel filled with water, holding it while you squat again and again. The barrel rests upon your back as you do push up after push up. It's a trusty companion in your quest to regain your muscle.`,
              `100 Strength talent: Your body adapts faster and faster to the strains you put upon it. You know exactly how far to push it and can tell almost instinctively when to stop.`,
              `1,000 Strength talent: Your body seems to build itself up faster and faster each time you break it down. You can practically feel your mana purr in satisfaction as it rebuilds your body to be stronger and stronger.`,
              `10,000 Strength talent: You have gotten so strong, you can destroy a pot with a well-aimed flick of the fingers, and crush monsters in your grip. Yet you feel like you can still push even further beyond those limits, and train like no other!`,
              `100,000 Strength talents: One by one you run out of measurable limits to your strength. Armor shatters before your fist and stone yields like wet clay to your fingers. You yearn to push your limits even more. Maybe if you sought out a god for an arm-wrestling match?`,
            ],
          },
          shortQuest: {
            name: 'Short Quest',
            states: {
              isDone: 'Short quests done',
            },
            description: `
            Be a hero! ...If the reward is good and it doesn't take too long.
            Short Quests with loot give {{gold}} gold as a reward.
            Every 5 Short Quests have loot.
            Unlocked at 5% People Met.
          `,
            tooltips: {
              questsLeft: 'Quests with loot left',
              questsTotal: 'Quests with loot total',
              questsToCheck: 'Quests to finish',
            },
            stories: [
              `Short Quest finished: You help an elderly woman get her cat down from atop her house, she rewards you handsomely for your efforts.`,
              `20 Short Quests with loot in a loop: You've helped everyone who's been willing to take you on, and the gold from your work jingles beautifully in your pockets. The satisfaction of a job well done fills you with pride.`,
              `50 Short Quests with loot in a loop: You've gotten so familiar with residents' daily routines and needs that you can finish chores for them before they ever think to ask for help. The only problem is how much it unnerves people to see somebody just a bit too helpful, a bit too eager, a bit too... <i>convenient</i>.`,
            ],
          },
          investigate: {
            name: 'Investigate',
            states: {
              isDone: 'Investigated',
            },
            description: `
              You've been hearing some rumors...
              Unlocked at 25% People Met.
            `,
            stories: [
              `20% Investigated: You catch some snippets of truly interesting gossip. Apparently a Mage and Warrior duo had stopped in and were sticking around for a little while.`,
              `40% Investigated: People are really helpful when you help them, you're almost starting to get a reputation as a busybody around here, but it's offset in that you actually do help people.`,
              `60% Investigated: People are generally more willing to open up if you seem like you know things, and you do know things, as you've been around here awhile now.`,
              `80% Investigated: The villagers are all too happy to share some stories with you at this point, it doesn't hurt that you know a little about most people now and are more than willing to strike up a conversation.`,
              `100% Investigated: You've done it, spoken to everyone in this village. Spent a loop or more on each of them, actually. You know what needs to be done, and at this point you can just go straight there. You can also engineer a situation in which the more stubborn ones will offer you a quest.`,
            ],
          },
          longQuest: {
            name: 'Long Quest',
            states: {
              isDone: 'Long Quests Done',
            },
            description: `
              Be a more impressive hero! ...As long as someone is watching.
              Long Quests with loot give gold and 1 reputation as a reward.
              Every 5 Long Quests have loot.
              Unlocked at 10% Investigated.
            `,
            tooltips: {
              questsLeft: 'Quests with loot left',
              questsTotal: 'Quests with loot total',
              questsToCheck: 'Quests to finish',
            },
            stories: [
              `Long Quest finished: You cleared out a cellar of rats; there were at least sixty of the blighters. You were rewarded handsomely, and you got a small reputation boost to boot.`,
              `10 Long Quests with loot in a loop: You've cleared out cellars, helped build a house, collected flowers for dyes, worked in the bakery, taken out trash, and helped a seamstress finish a gift for her husband. Your reputation is spreading as the helpful courier. Everyone is at the very least willing to listen to you.`,
              `25 Long Quests with loot in a loop: The town has nothing left for you to do at this point and suggest that maybe you might find more work somewhere else. They appreciate everything you did, and many of the townsfolk are eager to put in a good word for you.`,
            ],
          },
          throwParty: {
            name: 'Throw Party',
            description: `
              Take a break and socialize.
              Gives people met progress equivalent to 16 Meet People actions.
              Costs 2 reputation.
              Unlocked at 30% Investigated.
            `,
            stories: [
              `Party thrown: You announce that it's your birthday and you want to throw a party. You commandeer the village square and the people necessary to make it happen. You don't have the gold but people aren't quite able to say no. You promise you'll pay it off with the money from this current job.`,
              `10 Party thrown in a loop: You throw a massive celebration that lasts the entire day. The whole town is invited, and since you're offering free food, most of them even show up! There are multiple parades as well as a dunk tank, the latter of which doesn't come cheap, but you don't care. You told them you'll pay it off "later," and since you've done such a massive amount for the town today, they didn't have much grounds to refuse you.`,
            ],
          },
          warriorLessons: {
            name: 'Warrior Lessons',
            description: `
            Learning to fight is probably important; you have a long journey ahead of you.
            Requires a reputation of 2 or above.
            Unlocked at 20% Investigated.
          `,
            stories: [
              `1 Combat: You manage to track down the warrior that was staying in town, and are greeted by a small woman holding a sword almost as tall as her. She introduces herself as "Iron" and smiles politely. Her pleasant demeanour doesn't stop her from thoroughly trouncing you.`,
              `100 Combat: You manage to give Iron a run for her money, but she still manages to eke out a victory. She is, however, noticeably worn out afterward.`,
              `200 Combat: You push Iron to the brink of defeat, and then she starts fighting dirty.`,
              `250 Combat: All your experience fighting Iron finally pays off when you manage to defeat her! You feel really proud of yourself, right up until she smacks your head with the flat of her sword and demands a rematch.`,
              `500 Combat: Rematch. Rematch. Rematch. Your training sessions with Iron have evolved into a nonstop gauntlet of sparring matches, as many as you can fit in a loop. You win a lot more than you lose, but Iron simply refuses to lie down and quit. She's clearly exhausted, but every time it looks like she's about to take a break you see a flash of determination in her eyes and she stands up again and demands another rematch.`,
              `1,000 Combat: Nowadays it takes everything Iron has just to keep up with you. Dirty tricks, masterful feints, sheer unadulterated stubbornness and spite. But you're wise to all her tricks and skilled enough to counter them, and you never let up the momentum, never let her catch her breath. The exhaustion catches up to her, sooner than in past loops, and eventually even Iron can't muster the strength to stand up and demand another rematch, instead collapsing flat on her back and falling asleep.`,
            ],
          },
          mageLessons: {
            name: 'Mage Lessons',
            description: `
            The mystic arts got you into this mess, maybe they can help you get out of it.
            Requires a reputation of 2 or above.
            Unlocked at 20% Investigated.
          `,
            stories: [
              `1 Magic: You approach a burly man dressed in flowing robes, and ask if he would be willing to teach you some magic. The man agrees to teach you some basic cantrips if you help him out with menial tasks. He introduces himself as Warrick.`,
              `100 Magic: Warrick compliments you on your ability to wield mana, and is happy to share some more dangerous cantrips with your promise to not use it for ill. He refuses to teach you about alchemy.`,
              `200 Magic: Warrick is suspicious about your proficiency with mana for someone he's just run into in the wild, but is still more than willing to humor you. If he throws appraising glances at you every now and then, you pay them no mind.`,
              `250 Magic: You and Warrick duel, your lessons from that point on are finding an out of the way location and duking it out with magic. Warrick seems appreciative about the exertion.`,
              `10 Alchemy: You offer to help him with his alchemy work and he immediately seems to develop a soft spot for you, talking about herbs and their effects when combined with each other and how they build together to create mystical potions. The man's passionate, that's for sure.`,
              `50 Alchemy: You offer Warrick some alchemy techniques that he's never heard of in exchange for some more magic techniques and lessons. He agrees readily.`,
              `100 Alchemy: You offer to teach Warrick about alchemy if he teaches you about the branches of magic you have little grounding in. The man himself is a genius and has much to teach. He gives it his all, tempted by the secrets of Alchemy.`,
            ],
          },
          healTheSick: {
            name: 'Heal The Sick',
            states: {
              isDone: 'Healed',
              isPart: 'Patient',
            },
            description: `
            You won't be able to heal them all, but they'll be thankful for doing what you can.
            Healing is always 3 parts, each with a main stat - Diagnose (Per), Treat (Int), Inform (Cha).
            Gives (magic skill) * max(restoration skill/50, 1) * (1 + main stat / 100) * sqrt(1 + times completed / 100) * (original mana cost / actual mana cost) progress points per mana.
            Requires a reputation of 1 or above.
            Unlocked at 12 Magic skill.
            Gives 3 reputation upon patient completion.
          `,
            stories: [
              `Patient healed: You're allowed in to see the patients and begin healing. You're not too experienced but neither is anyone else here, and your basic magic skills make some of the small things easier even if they can't heal people directly. It's excellent practice and everyone you heal, whether you're setting broken bones or bandaging small scrapes, is extraordinarily thankful for your help.`,
              `10 Patients healed in a loop: You wipe your brow after finishing a particularly difficult diagnosis. You wouldn't want to have to do something like that without magic. Divinations make diagnoses so much easier. At this point you've basically cleared out the entire healing home - your reputation is absolutely sterling and the nurses and healers are more than thankful for your help.`,
              `100 Patients healed: You've healed some of these townsfolk so many times, you don't actually need to speak to them or examine them to find out what's wrong. You go through the same steps anyways, because good bedside manners are an integral part of earning respect as a healer.`,
              `1000 Patients healed: You never formally trained as a healer, but you've healed so many people that you're pretty much an expert now. Nothing can stop you, nothing can stump you, nothing can even slow you down! ...Except when they bring in a patient you haven't seen before. When that happens, it usually takes you a while to figure out what their problem is.`,
              `Failed Action: You're turned away at the door, the small healers home stating that they can't trust you to not poison the people inside or make the situation worse.`,
              `50 Restoration: You'd say it's like magic, but you were already using magic so instead it's like double-magic. The medics can't tell what you're doing, it's completely outside their paradigm: you simply touch the patient's forehead and, with a surge of energy, they're healed. You don't do it to boast, though. All you want is to help.`,
            ],
            segments: [
              `diagnose`,
              `treat`,
              `inform`,
            ],
          },
          fightMonsters: {
            name: 'Fight Monsters',
            states: {
              isDone: 'Killed',
              part: 'Monster',
            },
            description: `
            Slowly, you're figuring out their patterns.
            Fighting rotates between 3 types of battles, each with a main stat - Quick (Spd), Defensive (Str), Aggressive (Con).
            Gives (self combat) * (1 + main stat / 100) * sqrt(1 + times completed / 100) * (original mana cost / actual mana cost) progress points per mana.
            Requires a reputation of 2 or above.
            Unlocked at 10 Combat skill.
            Gives 20 gold per fight segment completion.
          `,
            stories: [
              `Monster killed: It's all so new, the way they respond and attack, you're not ashamed to admit that you almost got brained by a deer. Either way, their hides and rendered components will sell well.`,
              `100 Monsters killed: You thought it would take longer to learn, but these monsters are pretty straightforward. Pay attention to their body language and they'll all but announce their next attack.`,
              `500 Monsters killed: Duck, sidestep, stab, and another monster goes down. You wipe some sweat off your brow and let the adrenaline fade. They always fall for that trick.`,
              `1,000 Monsters killed: Three monsters charge you at once. You lunge at the last second, scoring a blow against one while letting the other two crash into each other. By the time they're ready for a second attack, you'll be done with your current foe.`,
              `5,000 Monsters killed: If a herd's too big to fight, you pick off a few of them from ambush while the rest aren't looking. Let a few more fall into carefully-placed traps and then you take to the field yourself and finish the rest off.`,
              `10,000 Monsters killed: You only move the barest amount necessary to avoid getting hit. At this point you know all their movements like the back of your hand, and there's always a gap in their attack pattern. You're glad they're too dumb to coordinate with each other.`,
              `20,000 Monsters killed: The most efficient way to dodge, and the most efficient way to kill. You don't need ambushes anymore, you can wade into battle against any number of monsters and kill them all one after another, always inches away from death but never making a single misstep.`,
            ],
            segments: [
              `Deer`,
              `Giant Turtles`,
              `Goblins`,
              `Demon Rabbits`,
              `Giant Honey badgers`,
              `Venomous Snakes`,
              `Angry Monkeys`,
              `Trolls`,
              `Ogres`,
              `Pixies`,
              `Treants`,
              `Gelatinous Cubes`,
              `Fairies`,
              `Orcs`,
              `Beholders`,
              `Spectres`,
              `Mimics`,
              `Shambling Mounds`,
              `Corrupted Mushroomfolk`,
              `Giant Owls`,
              `Blood Trolls`,
              `Small Wyrms`,
              `Displacer Beasts`,
              `Gibbering Mouthers`,
              `Mind Flayers`,
              `Aboleths`,
              `Ancient Dragons`,
              `Liches`,
              `Tarrasques`,
              `Demiliches`,
              `Demigods`,
              `Gods`,
              `Deer but they're jerks and slightly larger than before`,
              `Giant Turtles with spherical shells`,
              `Goblins but they're late on their rent`,
              `Demon rabbits but they have massive teeth`,
              `Giant Honey badgers but they can turn invisible`,
              `Venomous Snakes that are also poisonous`,
              `Angry Monkeys with twelve arms`,
              `Trolls that aren't weak against fire`,
              `Ogres but they're smarter`,
              `Pixies with sand instead of pixie dust`,
              `Treants but they're on fire`,
              `Gelatinous Cubes that are constantly growing in size`,
              `Fairies with blindingly bright dresses`,
              `Orcs with multiple weapons`,
              `Beholders with mouths on every eye`,
              `Spectres that are actually scary`,
              `Mimics without an obvious tell`,
              `Shambling Mounds that can move quickly`,
              `Corrupted Mushroomfolk that taste bad`,
              `Giant Owls that can swim`,
              `Blood Trolls that don't like your hairstyle`,
              `Small Wyrms that aren't grounded`,
              `Displacer Beasts that can properly place themselves`,
              `Gibbering Mouthers with eyes on every mouth`,
              `Mind Flayers with pitchforks`,
              `Aboleths but harder, better, faster, and stronger`,
              `Ancient Dragons who've graduated from college`,
              `Liches with strong political opinions`,
              `Tarrasques that actually notice you`,
              `Demiliches happy about their condition`,
              `Demigods that are even more elitist than before`,
              `bob.`,
              `Gods but they had to come in on saturday`,
            ],
            segmentAltNames: [
              `Speedy Monsters`,
              `Tough Monsters`,
              `Scary Monsters`,
            ],
            segmentModifiers: [
              `A couple`,
              `A few`,
              `A bunch of`,
            ],
          },
          smallDungeon: {
            name: 'Small Dungeon',
            states: {
              isLocalDone: 'Looted',
              isGlobalDone: 'Completed',
              isPart: 'Small Dungeon',
            },
            description: `
              There are small changes each time; it's harder to get used to. The soulstones at the end last through loops, but they're not always in the dungeon... Strange.
              The dungeon requires different skills at different points.
              One action can clear multiple floors if your stats are high enough.
              Gives (magic + self combat) * (1 + main stat / 100) * sqrt(1 + times floor completed / 200) * (original mana cost / actual mana cost) progress points per mana.
              Unlocked at a combined Combat and Magic skill of 35.
              Requires a reputation of 2 or above.
              Gives 1 soulstone per completion - hover over Looted for info.
            `,
            completedTooltip: `
              Each soulstone improves a random stat's exp gain by (1+(soulstones)^.8/30).
              Each floor has a soulstone that, when received, multiplies the chance you'll get the next one by 0.98.
              Chance to receive a soulstone recovers per floor at 0.00001% per mana.
            `,
            chanceLabel: 'Chance',
            lastStatLabel: 'Last',
            segments: [
              'Spike Traps',
              'Long Hallways',
              'Arrow Traps',
              'Riddle Guardian',
              'Swinging Axes',
              'Boss',
              'Loot',
            ],
            stories: [
              "Small dungeon attempted: The cavernous entrance to the villages dungeon greets you. It's dark and looming, with rocks forming jagged fangs. It's the most imposing thing you've found in this town so far.",
              "1,000 Dungeon floors looted: You know your way around the dungeon like no one else, almost as if you've explored every nook and cranny. You have.",
              "5,000 Dungeon floors looted: The dungeon poses less and less of a threat to you each time you conquer it, the soulstones growing your power by small amounts now that you've accumulated so many of them.",
              "10,000 Dungeon floors looted: The dungeon is a joke to you, if you could teleport you'd simply jump straight to them, the dungeon in your mind has been reduced to how short it is to get from one soulstone to the next. If you have to destroy a couple walls, so be it.",
              "6 Floors cleared in a loop: You reach the actual end of the dungeon, the dungeon core glows an angry red as if irritated that you're at this floor at all. Regardless, you take your soulstone and leave, the dungeon core's red glow following you the whole time.",
            ],
          },
          buySupplies: {
            name: 'Buy Supplies',
            tooltip: `
              Prepare to move on.
              Costs <div id='suppliesCost'></div> gold.
              You only need one set of supplies.
              Unlocked at a combined Combat and Magic skill of 35.
            `,
            stories: [
              "Supplies bought: A tent, enough rations to last for a month, portable cooking equipment and other assorted paraphernalia for your trip. The tent is durable and the rations don't taste bland and lifeless. It was probably worth the 300 gold asking price. Good thing you knew how to haggle.",
              "Supplies bought without haggling: How luxurious! You had the gold to just throw it away now, even though the mana would've been more beneficial in the long run, not having to haggle once in a while was surprisingly nice. Truly, you have grown luxuriant.",
            ],
          },
          haggle: {
            name: 'Haggle',
            tooltip: `
              They won't like you as much, but hey - you're leaving.
              Costs 1 reputation to reduce the price of supplies by 20.
              Unlocked at a combined Combat and Magic skill of 35.
            `,
            stories: [
              "Haggle: The shopkeep has some of the supplies you need, but they are of inferior quality and you're not paying his asking price for them, at least that's what you tell him. You argue, grumble, make sharp comments and are just in general unpleasant to one another.",
              '15 Haggles in a loop: The shopkeep basically throws you out the store shouting and cursing vociferously at you. You ears ring slightly at the barrage.',
              "16 Haggles in a loop: At this point, it served no purpose, you were doing this solely for the fun of it. No matter how much you haggled, the merchant wasn't going to pay you to take the supplies. That was just wishful thinking. Although, losing the reputation you had accrued could be useful in the long run...",
            ],
          },
        },
        journeys: {
          startJourney: {
            name: 'Start Journey',
            tooltip: `
              Follow the trail to end up at the next town.
              You need to keep moving until you can learn how to shut these loops off.
              Costs 1 supplies.
              Finish once to unlock Forest Path's actions, then finish this in order to use Forest Path's actions.
              Unlocked at a combined Combat and Magic skill of 35.
            `,
            stories: [
              "Traveled to the second zone: You leave town, heading towards the forest that stood between the village and Merchanton. You've exhausted every option in Beginnersville, and there's nothing here that will stop the loops. It's time to look for solutions elsewhere.",
            ],
          },
          hitchRide: {
            name: 'Hitch Ride',
            tooltip: `
              The Explorers' guild has a contract with various caravans for transport around the world. They have taught you the secret handsigns to gain passage. And this one just happens to have some spare mana to share on the journey!
              Unlocked with 25% of the world surveyed.
              Travels to Merchanton.
            `,
            stories: [
              "Hitched a Ride: You step up to the caravan rolling by, give the necessary handsigns, and are directed to a small wagon near the back of the line. As you climb in and see your fellow explorers, you can't help but grin - they may not recognize you, but you recognize several of them. Drinks are eagerly shared, numerous bad jokes are made, and the trip passes in the blink of an eye. When the caravan reaches Merchanton, you're singing so loudly you miss the call to get off, and you end up having to walk the half mile the wagon traveled before you noticed the retreating city in the back window.",
            ],
          },
          openRift: {
            name: 'Open Rift',
            tooltip: `
              Using your vast knowledge of the dark arts, you can open a rift into the shadow realm to send you straight to Startington.
              Unfortunately, it doesn't seem like you can fit any supplies through the rift.
              Unlocked at 300 Dark Magic and 100 Spatiomancy.
            `,
            stories: [
              "Opening the Rift: Angering the gods just to reach the shadow realm is so much work, and makes you feel a bit bad inside. Thinking back to your lessons with the witch, you conjure a huge amount of destructive and chaotic energy and begin to fray at the fabric between worlds. After a long and strenuous period of brutally exhausting work, you finally feel something give, and the dark energy seems to evaporate. In its place, a small rift has been torn through reality, big enough to fit through and stable enough that it won't shred you to pieces. You can't say the same for the threadbare bags of supplies you've haggled for so many times, but it's quite a feat even so. Excited, you eagerly step across to Startington!",
            ],
          },
        },
      },
      townZ1: {
        options: {
          exploreForest: {
            name: 'Explore Forest',
            states: {
              isLocalDone: 'Forest Explored',
            },
            tooltip: `
              What a pleasant area.
              2x progress with glasses.
            `,
            stories: [
              '1% Forest explored: You look at the side of the path from your little campsite, and are struck with a sense of wanderlust. You leave your camp to explore. Not too far from your campsite you find a tiny glade practically overflowing with mana.',
              "10% Forest explored: Your sense of wanderlust hasn't faded, but you balk at the darker areas of the forest. You continue to find tiny glades filled with mana throughout the forest.",
              "20% Forest explored: You follow what at first looked like a game trail, only to find that it was actually a branch off of a ragged footpath when you break through some tall bushes. You decide to follow the path. If it's been walked down so often, it must lead somewhere worthwhile.",
              "40% Forest explored: You continue exploring the forest, and you've discovered something odd about it. One side of the main path is... calm, you suppose, peaceful even. Welcoming. The other makes you feel ill at ease, as if there are unseen eyes constantly on you. One side is light and airy, the other dark and gloomy.",
              '50% Forest explored: You found flowers in the forest, growing in the almost pitch black beneath the thick canopy on the gloomy side of the forest. Yet the flowers grow. There\'s a desire to follow them, almost as if they\'re saying, "Follow Me!"',
              "60% Forest explored: You continue searching around the forest, finding tracks and trails, boltholes and hollowed out tree trunks. Life is abundant in this forest, and you're seeing that. On both sides.",
              "80% Forest explored: You've managed to figure out the favorite roaming spots of most of the herds in the forest by this point. You've also stumbled across a fair number of funny little green plants that resonate with mana, but in a form that you're unable to absorb. You wonder if they can be used for some other purpose.",
              "100% Forest explored: You've done it! You find it impossible to get lost in the forest now, and your wanderlust is finally satisfied. You've seen practically all you can in this forest, although there are still some areas that remain barred to you, with no obvious means of entry revealed by your cursory examination.",
            ],
          },

          wildMana: {
            name: 'Wild Mana',
            states: {
              isLocalDone: 'Mana Sources Tapped',
            },
            infoText: {
              text1: 'Sources with mana left',
              text2: 'Sources with mana total',
              text3: 'Sources to check for mana',
            },
            tooltip: `
              They're out of sight of most travellers, but you have time to find and harvest them.
              Every good mana spot has {{mana}} mana.
              Every 10 mana spots have good mana.
            `,
            stories: [
              "Source checked for mana: It's just sitting there; you stray only slightly from the beaten path and you find an abundance of mana just waiting for someone to take it. The only catch is that you need to extract it from the plants surrounding it, and they've proven slightly unwilling to part with it.",
              "100 Sources with mana: The forest is teeming with clusters of mana, invariably choked by plants feeding off of the ever-useful energy. You're not exactly sure what's producing it all, but it's part of the natural rhythm of the forest. You're almost inclined to leave it be, but if you want to escape the loops you need the mana more than the plants do.",
              '150 Sources with mana: During your attempts to fully map out the forest, you found a few well-concealed copses containing even more mana spots! Honestly, by now the forest is worth visiting just to stock up on all the mana waiting to get scooped up!',
            ],
          },

          gatherHerbs: {
            name: 'Gather Herbs',
            states: {
              isLocalDone: 'Funny Plants Uprooted',
            },
            infoText: {
              text1: 'Plants with use left',
              text2: 'Plants with use total',
              text3: 'Plants to check for use',
            },
            tooltip: `
              Might as well dig up anything useful you find.
              Every 10 funny plants are herbs.
              Unlocked at 10% Forest Explored.
            `,
            stories: [
              "Plant checked for use: You pull up random plants across the forest that emanate mana only to find that in most cases, they're simply plants that have started gathering mana, but in some cases they're actually magical plants. Small distinction, but a significant one.",
              '200 Plants with use: You have picked absolutely every single plant in the forest, and now know of the shortest route to get even the smallest magical petal!',
              '500 Plants with use: As you map out the forest, you come to the conclusion that there are places where the world somehow got warped. A little bit of Spatiomancy lets you slip into one of these folded pockets, revealing even more plants with useful alchemical properties!',
            ],
          },

          hunt: {
            name: 'Hunt',
            states: {
              isLocalDone: 'Animals Skinned',
            },
            infoText: {
              text1: 'Animals with hides left',
              text2: 'Animals with hides total',
              text3: 'Animals to check for hides',
            },
            tooltip: `
              The forest provides.
              Every 10 animals have good hides.
              Unlocked at 40% Forest Explored.
            `,
            stories: [
              'Animal checked for hide: You manage to track down a relatively harmless animal, but in the time it took you to bring the critter down you had ruined its pelt beyond all use. You needed the practice, you tell yourself.',
              "10 Animals with hide: You ghost through the forest, targeting packs that you know graze or are moving through locations easily reached and ambushed. You're starting to get good at this tracking thing, but you suppose you only really have to do it once.",
              '20 Animals with hide: A deer rests by the water, lapping gently at the water, seemingly unaware of your presence. It remains unaware of your presence as you slowly edge closer. The deer continues to remain unaware of your presence until it is unaware of everything forevermore. You offer a silent thanks to the creature, as its pelt will be of much value to you.',
              "50 Animals with hide: The animal you're tracking isn't quite a deer. It walks like one, it vaguely looks like one if you squint, but deer usually aren't capable of bending space around themselves to avoid hunters. While the spatial trick this animal uses is fairly impressive, being able to hide anywhere has dulled its instincts to the point that it just freezes while you carefully take aim between its eyes. At least its hide is \"normal\" enough to be worth the effort.",
            ],
          },
          sitByWaterfall: {
            name: 'Sit By Waterfall',
            tooltip: `
              It's peaceful here. Loud, but peaceful.
              Has 4x exp/talent gain, and can only be done <div id='trainingLimitSoul'></div> times per reset.
              Unlocked at 70% Forest Explored.
            `,
            stories: [
              "Sat by waterfall: You find a surprisingly quiet waterfall flowing down a steep cliff and stop to stare for a while, simply to observe the natural beauty of the sight. As you watch, the force of the water manages to dislodge a small pebble from the top of the waterfall and send it careening down. You're oddly mesmerized as it bounces along the path, constantly being immersed and spat out again by the water. You don't know when you sat down and began meditating, only that you woke from your deep realization hours later.",
              "100 Soul Talent: Sometimes you get stressed, or scared, or lonely. You don't know how long it'll be until you escape the loops - you don't even know if you ever will escape the loops! It's pretty overwhelming, and the constant repetition of the same tasks over and over doesn't help. It's a relief to take some time to yourself; to relax, meditate, and just breathe.",
              "1,000 Soul Talent: You still get anxious sometimes, but you're getting better at relaxing at a moment's notice. A few minutes break, a couple of deep breaths, and you're fired up and ready to go again. It's still nice to sit by the waterfall sometimes, though.",
              "10,000 Soul Talent: You don't have to take breaks anymore to relax. Whenever you feel that anxiety bubbling up within you, you can effortlessly push it away by taking a single deep breath. In... and out.",
              "100,000 Soul Talent: Sometimes, things are hard, but it's okay. Everything will work out in the end, and you're at peace.",
            ],
          },

          oldShortcut: {
            name: 'Old Shortcut',
            states: {
              isLocalDone: 'Shortcut Explored',
            },
            tooltip: `
              No one has come down this way in quite some time.
              Gives some additional herbs.
              Old men are a pain unless you know something they care about.
              Talk to Hermit gives 1% more Hermit Knowledge Learned per 1% Shortcut Explored.
              Unlocked at 20% Forest Explored.
            `,
            stories: [
              '1% Shortcut explored: During your trip through the forest, you discover a small and worn path leading off the main thoroughfare. Wondering where it leads, you decide to explore it.',
              "10% Shortcut explored: You're mildly surprised to discover a seemingly sprawling network of interconnected paths that seem to get almost everywhere within the forest.",
              '20% Shortcut explored: You stumble across a small clearing in the forest, containing racks of drying herbs and bubbling cauldrons littered around a wooden hut. The moment you step into the open, an old man leaps out of the hut to yell at you for trespassing.',
              "40% Shortcut explored: You continue to explore the shortcuts, you're able to recognize where you are in the sprawling network with a glance. You're able to move freely around the forest.",
              "60% Shortcut explored: You've discovered another set of hidden shortcuts on the gloomy side of the forest and set about exploring them. They seem less looked after than those on the other side, but are still serviceable.",
              '80% Shortcut explored: These old shortcuts are incredible, they almost seem to tell a story of when this forest was more habitable. You wonder why they were forgotten.',
              "100% Shortcut explored: You dust your hands and smile contently, you've done it. You've traveled every single path to completion. You could start at a completely random point and find your way out. That old hermit seems to like these paths.",
            ],
          },

          talkToHermit: {
            name: 'Talk To Hermit',
            states: {
              isLocalDone: 'Hermit Knowledge Learned',
            },
            tooltip: `
              This old man is happy to have a listening ear, surely he has some useful knowledge. You hope.
              He's initially confrontational, but opens up once you start talking about the road.
              Reduces mana cost of Gather Herbs, Practical Magic, and Learn Alchemy by 0.5% per 1% of Hermit Knowledge.
              Unlocked with both 20% Shortcut Explored and 40 Magic.
            `,
            stories: [
              "1% Hermit knowledge learned: The Hermit is old, scraggly and surprisingly, not bald. Looks old as dirt. He doesn't know the name of the surrounding provinces, but knows the names of the provinces before the current ones.",
              "10% Hermit knowledge learned: The old hermit is an absolute genius at using magic to speed things up and just in general make things quicker and easier. You have much information to wring from him. He doesn't tell you his name and insists you call him 'Old man', or 'Hermit'.",
              "20% Hermit knowledge learned: You've tried to worm it out of him over multiple loops, but he still won't tell you his name. He just seems amused at your attempts to get him to say it. Either way, you're steadily wringing more information out of him.",
              '40% Hermit knowledge learned: Apparently, the old man was here before this forest was a forest. He remembers the first seeds being sown. Just, what? How old would that even make him?',
              "60% Hermit knowledge learned: You learn more about his tells, when to push and when not to. You've angered him and seen him joyful, made him laugh and cry. Reminisce on old memories and curse bitterly. You've almost figured him out. You still don't know his name.",
              "80% Hermit knowledge learned: You've spent more time learning about this one man than you have most other things, you've come to see him almost as a familiar figure. With how much time you've spent with him, it's hard not to. You still don't know his name. One thing you do know is that he's been around a long time and has forgotten more about magic than you've learned.",
              '100% Hermit knowledge learned: He finally told you his name. Gelt. He seemed almost knowing as he told you.',
            ],
          },

          practicalMagic: {
            name: 'Practical Magic',
            tooltip: `
              Such simple uses to help out with everyday tasks. Genius, really.
              It's like pulling teeth getting this knowledge from the Hermit though.
              Unlocked with both 20% Hermit Knowledge and 50 Magic.
            `,
            stories: [
              "1 Practical magic: You pester the hermit about magic and how to use it to make things easier on yourself. It's surprisingly handy to be able to move things around without having to be there - rather than smashing pots you could instead lift them up and drop them, or knock them off edges. Why pick a lock when you can just unlock the latch with Mage Hand, why walk over to the wardrobe if you can simply fling it open and ransack it from across the room? Magic, but practical. You're a little astonished that not everyone does this.",
              "100 Practical magic: Slowly, slowly, you're starting to become competent at the Hermit's special brand of magic - and it's really convenient. Just the other loop, he taught you a trick to find the value of a pile of coins with a small gesture and a single word!",
              '400 Practical magic: You barely have to pay attention to your magic anymore. Doors open before you reach them, blood and grime vanishes at a thought, and anything you reach for jumps straight into your hands. Life has never been so easy.',
            ],
          },
          learnAlchemy: {
            name: 'Learn Alchemy',
            tooltip: `
              You can listen to him yammer while making light healing and remedy potions.
              You're starting to think the potion that caused you to loop time was a complex one.
              You provide the ingredients; costs 10 herbs.
              Gives alchemy and magic skill.
              Unlocked with both 40% Hermit Knowledge and 60 Magic.
            `,
            stories: [
              'Alchemy learned: You ask the hermit about potions and are regaled of tales from his time as an apprentice, especially the mistakes he made. Chortling, he tells you how one time, he managed to douse his masters beard with potion that would wildly change the color of it every minute. For a full year, his master had to deal with a beard that was either glowing white like pure fallen snow or was more fit to be in the sky after rain. You take notes as the hermit speaks.',
              "25 Alchemy: You sit by the fire inside the hermit's clearing, fire dancing merrily away as he feeds magical herbs to the fire while throwing precise amounts into the large pot boiling above it. The stories he tells of his youth and learning alchemy under his master make you howl with laughter and provoke deep thoughtful silences.",
              "100 Alchemy: As you learn more and more about alchemy, the potion that caused you to start looping begins to seem more and more hideously complex. Something as simple as your reputation can effect the outcome of a potion. It's more of an art than a science, or anything even easily conveyed really.",
              '500 Alchemy: The potions you brew are on a whole different level than anyone the next town over has seen in their life. You idly wonder if you could make a potion so precious that people would actually bankrupt themselves for it...',
            ],
          },

          brewPotions: {
            name: 'Brew Potions',
            tooltip: `
              Bubbles and Flasks. Potions and Magic.
              Requires a reputation of 5 or above, or he won't let you near his stuff.
              Creates a potion from 10 herbs to sell at the next town.
              Gives alchemy and magic skill.
              Unlocked with 10 Alchemy.
            `,
            stories: [
              "Potion brewed: The old man happily lets you use his apparatus to brew your own potions. After much haranguing about your technique and the fact that you're not buying ingredients off him, he leaves you to it. His workstations are old, well used and obviously well looked after. The only fault you can lay at their feet is that the measuring system used is older than dirt. Fits, you suppose.",
              '50 Potions brewed in a loop: The hermit is impressed with the collection you have made as you showcase the multiple boxes full of flawless concoctions. Time to hit the next town and sell them!',
              "Action failed with low reputation: The hermit refuses to allow you near his workstations and potion brewing equipment no matter how much you ask and offer to pay. He tells you that you don't have a good enough karma for him to even be willing to risk you using his workstations and potion benches.",
              'Action failed with negative reputation: The hermit shoos you away from his clearing when you even make a mention of using his potion supplies, something about not wanting you to taint his equipment with your karma.',
            ],
          },

          trainDexterity: {
            name: 'Train Dexterity',
            tooltip: `
              There's a nice array of rocks to hop between. It's a lot of fun.
              Has 4x exp/talent gain, and can only be done <div id='trainingLimitDex'></div> times per reset.
              Unlocked at 60% Forest Explored.
            `,
            stories: [
              "Dexterity trained: You find rocks spaced intermittently in an open clearing. Your best guess is that they were set up as a training field for some mercenary group that had passed by. Either way, it's fun to bounce from one rock to another parrying invisible enemies and fighting the air.",
              '100 Dexterity Talent: You parry and fight invisible monsters for a lot longer than you thought you were gonna but you are now quick to dodge and evade!',
              "1,000 Dexterity Talent: You have grown so dexterous that it sometimes feels like you're flying while you practice, your feet barely touching the ground anymore.",
              '10,000 Dexterity Talent: You take a deep breath, then step up to the nicely arranged rocks. With trained ease beyond any mortal peer, you jump from one rock to another, dancing around the clearing as if gravity has no hold over you.',
              "100,000 Dexterity Talent: By now, you have been training on these rocks for so long that you know every last bump and divot on them. You can't recall the last time you fell off of one of them, nor can you remember the last time anything else made you fall in a way you couldn't catch in time. With a shrug, you move along, your feet moving so lightly that even the loose leaves on the forest floor remain undisturbed.",
            ],
          },

          trainSpeed: {
            name: 'Train Speed',
            tooltip: `
              A forest run is fantastic. You feel like you're learning a lot as you push your limits.
              Has 4x exp/talent gain, and can only be done <div id='trainingLimitSpd'></div> times per reset.
              Unlocked at 80% Forest Explored.
            `,
            stories: [
              'Speed trained: Sprinting through the forest is an exhilarating experience. The vines whip past your head, the roots beneath your feet. The leaves whip past your face and the breeze blows hard enough against your ears that you hear nothing but. You feel at one with the forest as you chase a finch around, up and down and even under trees at times. Through dilapidated trunks and wooden labyrinths.',
              '100 Speed Talent: You can feel your legs tense up as you prepare for another sprint, the tension releasing all at once as you take off and dash between the trees.',
              "1,000 Speed Talent: At the start of each loop, the pains and strains from the previous loop just vanish like everything else, giving you a lot more opportunity to exercise. Sure, losing the actual progress isn't much fun, but the more you train, the faster your training bears fruit.",
              "10,000 Speed Talent: If anyone was watching, they would probably assume you're doing something illegal as you train up from your usual jogging pace to setting speed records in mere hours. No foul play here though, just many lifetimes worth of practice paying off!",
              "100,000 Speed Talent: You find yourself thinking about teleportation. Looking up a few spells for it, you have come to the conclusion that it's just not worth the hassle for you anymore; you're so fast that you'd have to teleport from one end of the world to the other for it to be faster than just running.",
            ],
          },
          followFlowers: {
            name: 'Follow Flowers',
            states: {
              isLocalDone: 'Flower Trail Followed',
            },
            tooltip: `
              You've located an oddly out of place trail of flowers, why not see where it leads.
              You can find more herbs along the path.
              2x progress with glasses.
              Unlocked at 50% Forest Explored.
            `,
            stories: [
              '1% Flower trail followed: You stumble across a small lane of flowers that are obviously planted by hand. You decide to follow it.',
              '10% Flower trail followed: The planted flowers seem almost sprawling, threading to and fro across the forest.',
              "20% Flower trail followed: The flowers led you to places in the forest that you hadn't been, you discovered a thicket that was overflowing with mana, but you would need to experiment to figure out how to draw the mana out.",
              '40% Flower trail followed: The flowers continued to follow their unseen path, but you were starting to notice a pattern.',
              '60% Flower trail followed: There were strange plants aplenty to be found along the flower path, and you had noticed that some had medicinal properties, you remembered from when you were young, the smell unmistakable.',
              '80% Flower trail followed: The flower path was circuitous, circling around the darker side of the forest in patterns that you were starting to map out mentally.',
              "100% Flower trail followed: The patterns were strangely geometric, and you had an inkling that the flower path had some sinister beginnings. Regardless, you'd explored the entire path. You were right too, it never did stray from the darker side of the forest.",
            ],
          },

          birdWatching: {
            name: 'Bird Watching',
            tooltip: `
              Far along the flower trail, there seems to be a large variety of birds flying about. Perhaps you could take up a new hobby.
              Requires glasses.
              Has 4x exp/talent gain, and can only be done <div id='trainingLimitPer'></div> times per reset.
              Unlocked at 80% Flower Trail Followed.
            `,
            stories: [
              "Birds watched: You spot a colorful bird and attempt to follow it with your eyes, you fail. You try again and again until you can reliably pick out fast moving birds and animals with pinpoint precision. It's also strangely relaxing to watch birds congregate together, listening to the bird-call and watching them interact. It's fast, frenetic and savage at times, but that's nature.",
              "100 Perception Talent: While your eyes have not grown any sharper across the loops, your ability to interpret and understand what you're seeing has grown impressively. Most detectives don't have as good an eye for detail as you currently do.",
              '1,000 Perception Talent: Your eyesight without glasses is still pretty bad, but by this point the merchant is suggesting a different prescription. Your ability to interpret and infer has grown <i>that</i> much.',
              '10,000 Perception Talent: While your new glasses gave you a headache initially, by now they let you look almost to the edge of the horizon on a clear day while your Perception has grown sharp enough that the sheer amount of detail no longer overwhelms your ability to think.',
              '100,000 Perception Talent: You stand by the flower trail, eyes closed. For the past few loops, your eyes and eyesight have stopped getting any better, so you decided to train your hearing instead. You can hear a bird flying overhead, the subtle turbulence around its wings telling you that it needs to preen a feather near its shoulder. You smile.',
            ],
          },

          clearThicket: {
            name: 'Clear Thicket',
            states: {
              isLocalDone: 'Thicket Explored',
            },
            tooltip: `
              The path of flowers has lead you to a thicket, seemingly in the middle of nowhere.
              Perhaps it's some strange magic.
              You can clear out the thicket to find some more wild mana.
              Unlocked at 20% Flower Trail Followed.
            `,
            stories: [
              "1% Thicket explored: You trek to a thicket you found while following the flower path and decide to explore it. Maybe you'll find some more mana. It's not like it belongs to anyone.",
              "10% Thicket explored: You've found more of these secluded thickets off the flower path than you thought you would, and you have a sense that there are many more that you haven't found yet.",
              '20% Thicket explored: The mana in these thickets is rich and helpful, extending your time in the loop to let you search for more and more. The break from people is a nice break from normal too.',
              "40% Thicket explored: You've thoroughly explored the darker side of the forest, and while resting close to the path that cut the forest in half, you stumbled across another thicket in the lighter side of the forest.",
              '60% Thicket explored: You continued to stroll around to all the thickets you had found. They were innumerable at this point, just endless tangled tiny clearings and glades.',
              "80% Thicket explored: Surely by now you're getting close to finding them all? Every time you think you're getting close you find another section of the forest that had clearings. How did you not find these earlier?",
              "100% Thicket explored: You stumbled across another thicket and throw your hands up. You would question how you missed all these extra thickets but you don't really care at this point. You've gotten disturbingly good at ripping nature to pieces in search of more mana.",
            ],
          },

          talkToWitch: {
            name: 'Talk To Witch',
            states: {
              isLocalDone: 'Witch Knowledge Learned',
            },
            tooltip: `
              Talk to the witch to learn her secrets of the dark arts.
              Unlocked with both 60% Thicket Explored and 80 Magic.
              Reduces mana cost of Dark Magic and Dark Ritual by 0.5% per 1% of Witch Knowledge.
            `,
            stories: [
              "1% Witch knowledge learned: You stumble across a small crooked hut and as you approach the boundary, a small slip of a woman step outs. She's stunning and you're immediately on guard. The area pulses with a heady hum of magic that sends shivers down your spine. She introduces herself as Evis.",
              '10% Witch knowledge learned: The Witch as you taken to referring to her as, seeing as she changes her name every time she introduces herself to you, is a veritable font of magical knowledge, of how to dominate the mana itself and make more from less.',
              "20% Witch knowledge learned: You continue to hunt down the Witch and drag more information out of her, the magic she teaches you is cruel, callous even. The witch is surprisingly personable for what you would consider a stereotypical 'Wicked Witch'.",
              "40% Witch knowledge learned: You start to learn more about the witch's daily routine as you spend more and more time around her, the relationship you manage to cultivate with her at the start of each loop grows more familiar with each repetition. She seems to be slightly more interested each time you reveal your knowledge of dark magic.",
              '50% Witch knowledge learned: You had apparently impressed her enough this time that she took you to a clearing she had found, and explained to you a ritual that would give you a boost, permanently through any circumstances by calling upon the dark gods. The catch she explained, with ill concealed glee, was that you would need souls to sacrifice if you wanted to do this ritual.',
              '60% Witch knowledge learned: As you learn more and more about the witch and her varied names, one thing starts to become glaringly obvious. The Witch and The Hermit know one another. If her irritable grumbling about the old fool and his idiotic desires were anything to go by. You get the feeling that their relationship is complex.',
              "80% Witch knowledge learned: The witch is struck with a strange sense of melancholy one loop and you have no idea why, but the witch is strangely open with information and you manage to pry out more of the relationship between her and the Hermit. They were lovers once, and to your surprise, she used to be the one whom nature adores. She shuts up quickly after letting that slip. You're all the more determined to pry it out of her though.",
              "100% Witch knowledge learned: Somehow she seems to sense something about you this loop, and she tells you her name, and it's the name she gives for every loop after. Trisha. You manage to pry most of her relationship with the hermit from her. They were lovers once, this you knew, but what you didn't was that she was of nobility and he a common vagabond. She fell for him and he for her; it was a love for the ages, she tells you while drunk on the wine you brought along with you. He wanted to run away with her and she agreed, too lovestruck to question why. He was running from deals he had made and bargains he had forsaken, his glib tongue landing him in trouble of the otherworldly nature. Trisha seems frustrated with her youth's naïveté as she tells you how she was made a scapegoat for his failings and forfeits in his deals and bargains. How she was essentially sold to the dark gods as his forfeit. When you ask what she did in return, all Trisha does is smile with dark satisfaction, the fire flaring briefly.",
            ],
          },
          darkMagic: {
            name: 'Dark Magic',
            tooltip: `
              Embrace the dark arts to more efficiently harvest mana. But at what cost?
              Adds 1 negative reputation.
              Requires a reputation of 0 or below.
              Unlocked with both 20% Witch Knowledge and 100 Magic.
            `,
            stories: [
              '1 Dark magic: You ask the witch for more information on dark magic and then during the conversation slowly reveal your interest in the subject and float the offer that you would be willing to trade if she would teach you the beginning steps. She smirks deviously and agrees to the deal.',
              "25 Dark magic: The witch demands more and more of you and you slowly figure out ways of broaching the subject with her that doesn't startle her enough that she stops talking to you or just flat out shuts you down. The magic she begins to teach is brutal, ominous and forceful. You do not work with or help, you take and dominate.",
              "50 Dark magic: The dark magic she teaches seems to veer more to the side of ritualistic sacrifice and communion with the dark gods, she tells you when you ask that it's because she can't really teach you too much more unless you have a darker being backing you as her mana isn't inherent but a gift from the darker divine powers. She teaches you of a ritual that you can use to summon the dark gods and strike a bargain. She warns that you'll need souls as payment.",
              "300 Dark magic: As you become more skilled at dark magic, the number of applications for it continues to grow; now you're learning to connect to the Shadow Realm, a world parallel to this one full of dark energy. Unfortunately, whenever you try to access it, all you find is chaos. Trisha tells you that there are stable locations in the shadow realm, but to reach them you have to already know where they are, and to create a stable connection you'll need to know more spatial magic than she can teach you. While not very helpful by itself, at least you have an idea how to move forward now.",
            ],
          },
          darkRitual: {
            name: 'Dark Ritual',
            states: {
              isLocalDone: 'Completed',
            },
            tooltip: `
              Sacrifice an increasing amount of soulstones to the dark gods, granting a permanent speed 10% boost to all actions in Beginnersville.
              Gives (dark magic skill) * (1 + witch knowledge / 100) * (1 + main stat / 100) * (original mana cost / actual mana cost) progress points per mana.
              Requires a reputation of -5 or below.
              Can only have 1 Dark Ritual action.
              Unlocked with both 50% Witch Knowledge and 50 Dark Magic.
              Sacrifices (50 * (rituals completed+1)) soulstones.
            `,
            segments: [
              'Clear the Area',
              'Prepare the Altar',
              'Summon the Dark Gods',
            ],
            stories: [
              "3rd ritual segment reached: Knowing what the ritual was and how large a space you would need, you were mildly surprised to find a clearing large enough in the forest. Well, the clearing itself wasn't really large enough on its own. It was a dense cluster of clearings that you've taken mana from that you could easily clear out to make a ritual space. Preparing the altar is surprisingly tame, all said and done. Stone and wood comprise most of the altar and the rest you brought with you when you made this plan. In the end the altar you build is only small, a communion point instead of a summoning. Holding a heart from nearby deer, you pierce it and begin to chant ritualistic words of power. The clearing grows dark and the forest quietens, nary a sound is heard apart from the drip drip drip of the blood from the pierced heart in your hand. The blood you've spilled on the altar begins to blacken and swirl without outside force and eventually forms into a small face, disgusting to look at but enough to communicate through.",
              'Ritual completed: You commune with the dark gods long past the point that the blood has faded. The deal is struck thusly: time itself will move faster for you only in select areas, and you will pay a cost in souls. The dark god you commune with seems almost surprised as you immediately offer up some of the soulstones that you have.',
              "50 Rituals completed: The more rituals you perform, the more extravagant setups the dark gods demand, and the less they reward you with. Towers of soulstones swirl away into dust as you get up and stretch. You'd think they'd be more pleased to have a repeat customer.",
              "300 Rituals completed: The dark gods have been less and less willing to deal with you as of late, no matter how many soulstones you offer. Is their power stretching near its limits, or have you become so powerful that they're starting to see you as a threat? You're not sure.",
              "666 Rituals completed: The face emerges from the blood, but this time its expression is grim. It explains to you how, although your offering will be accepted this time, there can be no more deals made after today. No matter how much you poke or prod, it refuses to elaborate, and when it finally sinks back into the now-dry pool, you're just as baffled by the dark gods' motives as you were this morning.",
            ],
          },
        },
        journeys: {
          continueOn: {
            name: 'Continue On',
            tooltip: `
              Keep walking to the next town, Merchanton.
              Mana cost reduced by 60 per Old Shortcut %.
            `,
            stories: [
              "Traveled to the third zone: You sigh gustily to yourself, you've done all you cared to do here and there was nothing left to do really, time to move on and out of the boonies and into civilized territory. Laws, taxes and bribes. You were almost looking forward to it, given how long you had been out in the country for at this point.",
            ],
          },
        },
      },
      townZ2: {
        options: {
          exploreCity: {
            name: 'Explore City',
            states: {
              isLocalDone: 'City Explored',
            },
            tooltip: `
              Everyone is so busy, and there's so much to do.
              2x progress with glasses.
            `,
            stories: [
              "1% City Explored: This is a relatively big city, and as busy as you've ever seen. You have no idea where anything is and nobody seems inclined to spare enough time to talk to you.",
              "10% City Explored: You've found a jovial man willing to chat with you on his way to the casino, where he invited you in for a game of poker. You declined, but it might be a good idea to come here on your own sometime.",
              "20% City Explored: You're wandering the main streets, committing everything to memory. You find a bar or two along the way, and wonder how long it's been since you last had a good beer.",
              "40% City Explored: You're getting the hang of the layout of the city now, though you've stayed away from the wealthy districts and the slums. You feel underdressed in one, and like you'd get mugged in the other.",
              '50% City Explored: As you wander through a residential cluster, you spot a humble and welcoming library out of the corner of your eye. You wonder if it has your favourite book available.',
              "60% City Explored: You hear of Mt. Olympus. In the slums they speak fairy tales of gods and monsters, and in the richer areas you hear of strange magics and ancient history. The mountain is far away, but you're increasingly seeing it as the obvious next destination.",
              "80% City Explored: The more you venture into the slums and wealthy districts the more interesting places you find. The slums play host to businesses on the darker side of the law, while the richer areas display a parade of niche eccentric items, priceless commodities, and what you're pretty sure is a slave auction under all the frills. Maybe the slums aren't the only place you should be careful around back alleys.",
              "90% City Explored: In one of the snobbiest streets of the city, you find a man selling, of all things, mining supplies. He says that he's selling the absolute pinnacle of mining-related craftsmanship, and the second you appear less than enamored he scoffs and sends you away.",
              "100% City Explored: You've seen all that Merchanton has to offer, from all levels of society. The one constant is that no matter where you go, people are busy. This city is a hub for rare items and clandestine deals, and fortunes are made and lost like water to the frantic beat of the city.",
            ],
          },
          gamble: {
            name: 'Gamble',
            states: {
              isLocalDone: 'Suckers Swindled',
            },
            infoText: {
              text1: 'Suckers left',
              text2: 'Suckers total',
              text3: "People to check if they're suckers",
            },
            tooltip: `
              The cards still somehow come out different every time.
              Has 2x exp/talent gain.
              Costs 20 gold and 1 reputation.
              Requires a reputation above -6.
              You win against every 10 suckers, and get 60 gold for winning.
              Unlocked at 10% City Explored.
            `,
            stories: [
              'Sucker checked: You sit down at the poker table… and promptly lose everything you bet. It seems Merchanton has a very competitive gambling culture. Still, there must be some people you can win against.',
              "Sucker swindled: You've found him, barely old enough to enter and clearly struggling to remember the rules of the game. It doesn't take long before all his money belongs to you, and you make a mental note to find him next time you come here.",
              "30 Suckers swindled: A fool and his money are soon parted, and you've found every fool in Merchanton. The money you conned them out of will be worth quite a lot of mana, easily worth the time you spent on it.",
              "75 Suckers swindled: Playing this guy is not good for your nerves. The fact that you couldn't see them until you used a bit of creative spatiomancy on the casino is already setting off alarm bells in the back of your head, but seeing them fidget with a coin by repeatedly folding and unfolding it seals it for you: these suckers are something else. Regardless, by the time you're done with them, you have a bunch more (mostly unfolded) coins weighing your pocket down.",
              "Action failed with low reputation: You're not sure if it's the conspicuous winning streak or the smell of alcohol on your breath, but it seems casino security has decided to evict you. Big, intimidating thugs practically drag you out, and by the looks on their faces they don't want to see you again anytime soon.",
              "Action failed with low money: As you sit down at the table and reach into your pockets, you realize that you don't have any money left! You hastily excuse yourself and leave the casino, and try to ignore the looks of pity you're given as you go.",
            ],
          },
          getDrunk: {
            name: 'Get Drunk',
            states: {
              isLocalDone: 'Rumors Heard',
            },
            tooltip: `
              Sometimes you just need a drink.
              Requires a reputation above -4.
              Has 3x exp/talent gain.
              Costs 1 reputation.
              Unlocked at 20% City Explored.
            `,
            stories: [
              "1% Rumors Heard: A mug of beer and a cheerful environment, it's equal parts relaxing and enjoyable. You leave without paying, but it's okay if you're not welcome there anymore, since they won't remember next loop.",
              "10% Rumors Heard: Lots of people turn into rampant gossips after a few glasses. You're learning about all sorts of interesting places, as well as far too many cases of infidelity and other personal drama for your liking.",
              "20% Rumors Heard: A dangerous-looking man shows up and orders the strongest drink they have, and as he drinks he loudly boasts about his adventures in the dungeon near town. With some prodding, he gives you directions instead to the Adventurer Guild, saying without a team you shouldn't even bother trying.",
              '30% Rumors Heard: Today you sit next to a woodworker from the Crafting Guild. Apparently he spends his days building fine chairs and tables but his true passion is glasswork, which he sadly has no talent for. You commiserate, and get directions to the Crafting Guild before you leave.',
              "40% Rumors Heard: As you watch a loud drunken argument unfold, you see that the man next to you is looking rather glum. You buy a drink for him and he opens up, telling you that he quit his apprenticeship because he couldn't stand his boss. Another drink and he gives you the name of the master who needs a new apprentice.",
              "60% Rumors Heard: An infuriated man rants about the construction work near his house. Talking to him is difficult without provoking his anger, but after a while he tells you what street it's happening on.",
              '80% Rumors Heard: In a more high-class bar, you catch wind of an architectural design competition, where various architects each design the same house and the one with the best design wins the contract to build it. A polite inquiry gets you the name of the person you need to know to enter the competition.',
              "100% Rumors Heard: You've been to every bar and dinner party, and heard every bit of gossip there is to hear. While you've only met a tiny fraction of Merchanton's population you've had drinks with every rung of society, and you're starting to feel like the city's running out of secrets for you to uncover.",
            ],
          },
          buyManaZ3: {
            name: 'Buy Mana',
            tooltip: '1 gold = {{mana}} mana. Buys all the mana you can.',
            stories: [
              "Mana bought: Unsurprisingly, a hub of commerce such as Merchanton has its fair share of mana vendors. You give the marketplace a once-over, then head back to the cheapest vendor you've found.",
            ],
          },
          sellPotions: {
            name: 'Sell Potions',
            tooltip: `
              Potions are worth 1 gold per alchemy skill, but it takes a while to find a buyer.
            `,
            stories: [
              `Potion sold: You're part of the attention-grabbing vista now, trying to get people to listen to you long enough to convince them your potions are worth the money. It's surprisingly hard work, but you got a man to give you a small sum of gold for one of your potions.`,
              `20 Potions sold in a loop: All the good herbs of the forest, brewed into potions and sold to the people of Merchanton. It took you a while, but the weight in your coin pouch tells you it was worth the effort.`,
              `Potion sold for 100 gold: As you hawk your wares, you catch the eye of a passing noblewoman. She's apparently dabbled in alchemy herself, and knows a quality potion when she sees one. After a couple rounds of negotiation she buys the potion for a tidy sum, and you realize your alchemical skills have gotten good enough for you to start marketing to richer clientele.`,
              `Potion sold for 1000 gold: Potions this potent don't show up every day, even in the bustling hub of trade that is Merchanton, and that means the upper crust takes notice. Not directly, of course: they have people for that. You've started approaching the fancy auction houses with your wares, because it's a lot easier to play these nobles against each other when their agents are all in one place bidding directly against each other. The sale price of your latest masterpiece certainly agrees with you.`,
            ],
          },
          adventureGuild: {
            name: 'Adventure Guild',
            states: {
              isDone: 'Impressed',
            },
            tooltip: `
            The one-stop shop for all your adventuring needs.
            Take their tests and get a rank!
            You can only join 1 guild at a time, and only try once.
            Gives 200 mana per rank.
            Gives ((magic skill)/2 + (self combat)) * (1 + main stat / 100) * sqrt(1 + times completed / 1000) * (original mana cost / actual mana cost) progress points per mana.
            Unlocked at 20% Rumors Heard.
            `,
            stories: [
              `Tests taken: You've gone through the standardized tests of the guild, and you're a little surprised at how low you placed. It seems that what you've considered impressive up until now is just the bare minimum around here.`,
              `E Rank achieved: You've clawed your way out of the ranks of the common riffraff. You still don't stand out at all, but it feels good to not be on the bottom rung anymore.`,
              `D Rank achieved: They say you're good for a new recruit, but it's still with a bored tone and an apathetic face. It seems even though you're getting much better scores nobody actually cares yet. Well, at least you're better off than the people stuck in F-rank.`,
              `C Rank achieved: People seem to actually respect you now, all of a sudden. Apparently it's pretty common for people to fail to make it higher than E or D and quit, but those who make it to C-rank are in for the long haul. You're being treated like a comrade in arms now, and it feels good.`,
              `B Rank achieved: Now people are starting to take note. B-rank adventurers don't come around every day, and most of them started lower and climbed their way up. That you came out of nowhere and placed B-rank on arrival is stirring up quite a few rumours.`,
              `A Rank achieved: There are only about a dozen A-rank adventurers in Merchanton, and your arrival astonishes them all. Rumours fly, and some are even saying that you're an A-rank previously thought dead, disguised under a new identity. All the attention makes you uncomfortable, but at this point it's hard to avoid.`,
              `S Rank achieved: There's only one other S-rank adventurer around, Guildmaster Rannet himself. There aren't any rumours of you being a fake identity this time, because S-rank adventurers are so rare that Rannet personally knows all of them and he's convinced he's never seen you before. Instead, people whisper about everything from the legacy of heroes to divine blood and everything in-between. At this point the only things that could explain your existence are implausible, and you can't really disagree with that assessment.`,
              `U Rank achieved: You stand above even Rannet now, and you're told the only person who compares is the strongest Guildmaster, Diphon "Living Earthquake" Granwell. Word spreads like wildfire and you become an instant celebrity. Everyone seems to want you to go challenge Diphon to see who's the strongest, but you know that you'd run out of mana long before you even get close to his city.`,
              `Godlike rank achieved: This isn't really a formal rank, as much as it reflects how you're stronger than they have means to measure, stronger than they've thought possible. They tell you that you're the strongest human alive, perhaps the strongest to ever live, and while you hesitate to embrace such a status you can see that they honestly believe it.`,
            ],
          },
          gatherTeam: {
            name: 'Gather Team',
            tooltip: `
              You don't have to take them on by yourself.
              Max 5 other team members, plus 1 for each 100 levels of Leadership.
              Costs <div id='teamCost'></div> gold, and the cost goes up by 100 gold per member.
              Each member adds (Adventure Guild Multiplier) * (Combat Skill / 2) to your Team Combat.
              Requires Adventure Guild.
              Has 3x exp/talent gain.
              Unlocked at 20% Rumors Heard.
            `,
            stories: [
              `Teammate gathered: Cassandra, self-professed expert spell-slinger, makes no attempt to hide her suspicion of the newcomer who's insisting on an expedition the same day they joined the guild. Still, you're paying the asking price, so she grudgingly accepts. You can tell that she won't be a pleasant companion, though.`,
              `Full party: Cassandra was a solo adventurer, but you've located a full party willing to join you in the dungeon. There's Marcus the swordsman, Raven the archer, Harvey the spell-slinger, Emily the healer, and Kyla, a rare specialist in magic-augmented dagger fighting. And you, now that you've paid them handsomely to join you.`,
              `Failed Action: When Cassandra names her price, you mentally count the gold you have remaining and make a counteroffer. Before you can say anything else, Cassandra walks out and tells you to go home and stop wasting people's time.`,
            ],
          },
          largeDungeon: {
            name: 'Large Dungeon',
            states: {
              isDone: 'Looted',
              isComplete: 'Completed',
            },
            tooltip: `
              With your party, you set out to accomplish great feats of dungeoneering that you couldn't have done while alone.
              Gives (magic + team combat) * (1 + main stat / 100) * sqrt(1 + times floor completed / 200) * (original mana cost / actual mana cost) progress points per mana.
              Requires at least one other party member.
              Unlocked at 20% Rumors Heard.
              Gives 10 soulstones per completion - hover over Looted for info.
            `,
            segments: [
              `Rally Party`,
              `Journey to the Entrance`,
              `Fight Door Guardians`,
              `Argue over Loot`,
              `Dodge Traps`,
              `Dodge Friendly Fire`,
              `Fight Boss`,
            ],
            stories: [
              `Large Dungeon Attempted: You quickly understand why you couldn't do this alone. The strong guardians at the entrance aside, many of the traps can only be disarmed by multiple people working together. If you tried this on your own you would've been squashed like a bug.`,
              `2,000 Dungeon Floors Looted: Adventuring in a party is tricky. Everyone wants the kill, everyone wants the loot, and one wrong word from anyone can spell a cascade of arguments. It's frustrating how much time you need to spend defusing tensions and keeping the party focused.`,
              `10,000 Dungeon Floors Looted: While the dungeon is never quite the same, you have its measure, and that lets you persuade your party to go down the right corridors and avoid traps. You can tell they're suspicious, but you shrug it off as some kind of intuition and change the topic before an argument can start.`,
              `20,000 Dungeon Floors Looted: They probably don't realize how much you're pulling the strings. How many arguments you've stopped before they start, or why they've never once made a wrong turn. At this point you know them better than they know themselves, and adventuring has never been so peaceful.`,
              `9 Floors cleared in a loop: An ornate altar in a room full of carvings holds the final soulstones of the dungeon. It emanates a deep red tinted with gray and you feel slightly unsettled, but soulstones are soulstones. You pocket them and swiftly leave.`,
            ],
          },
          craftingGuild: {
            name: 'Crafting Guild',
            states: {
              isLocalDone: 'Cried From Beauty',
            },
            tooltip: `
              Learn to use your hands to build big structures.
              Take their tests and get a rank!
              You can only join 1 guild at a time, and only try once.
              Gives 10 gold per segment completed.
              Gives ((magic skill)/2 + (crafting skill)) * (1 + main stat / 100) * sqrt(1 + times completed / 1000) * (original mana cost / actual mana cost) progress points per mana.
              Unlocked at 30% Rumors Heard.
              Gives Crafting exp upon segment completion, rather than upon action completion.
            `,
            stories: [
              "Tests taken: You want to make a cool suit of armor, but you don't know the first thing about metalworking so you apply as a carpenter until you know more. Your results are… unimpressive, and the clerk confides that you're likely to spend a couple of years running errands before they let you actually learn anything.",
              "E Rank achieved: You've proven yourself handy with wood, and they grant you a higher rank. A particularly harsh examiner says your work is shoddy and crude, but you seem to be above the errand boys now.",
              "D Rank achieved: You hone your skills at all parts of a construction job, and the breadth seems to count in your favour. This is about the level, you're told, where people often settle into modestly-paying stable careers.",
              "C Rank achieved: B-rank craftswoman Wilfrey says a house you built wouldn't be out of place in most parts of town. She shares with you a tip: to make it into B-rank, you have to know more than construction. If building houses is all you can do, well, a C-rank income still isn't anything to scoff at.",
              "B Rank achieved: Taking Wilfrey's advice, you branch out into working with cloth, glass, and metal. The new skills are finicky and exhausting to get right, but you eventually impress the examiners enough to claim B-rank. You also take a moment to appreciate the first sword you've forged yourself. Shame it'll vanish at the end of the loop.",
              "A Rank achieved: You're finally forcing the old grandmasters to take notice of you, but you're not sure that's a good thing. They seem to be invested in tearing the talented upstart down, and even though your skills impress everyone else in the guild the grandmasters only scoff and point out every flaw they find.",
              'S Rank achieved: Slowly, you remove mistakes from your work and learn to find even the most subtle of defects. When you and the old grandmasters butt heads they have less to throw at you and you fire back with flaws in their own work.',
              "U Rank achieved: It's official: you're unmatched here in Merchanton. Try as they might, the grandmasters can't find any mistakes in the things you make, and as you begin an exhaustive list of their own imperfections they grudgingly agree that you are superior, though you don't miss the way they talk about you behind your back.",
              "Godlike Rank achieved: At last, you've finally broken their pride. You've gone beyond perfection and into the realm of revolution. Your new methods, honed by countless hours of experimentation, are so superior that even the proud old grandmasters bow their heads and humbly ask you to teach them. Victory is sweet.",
            ],
          },
          craftArmor: {
            name: 'Craft Armor',
            tooltip: `
              Turn hide into armor through hard work.
              Gives (20% * Crafting Guild Multiplier) to Self Combat per armor.
              Costs 2 hides.
              Unlocked at 30% Rumors Heard.
            `,
            stories: [
              "Armor crafted: It only covers your torso from the front, but it fits well and can take a blow. Getting stabbed in the chest sucks, so even if it doesn't cover everything you're glad you made it. Now, what about the rest of the set?",
              "10 Armor crafted: You're covered head to toe in hand-crafted leather armor. You even have gloves and a helmet, and you've taken care that it's comfortable and flexible. You feel ready to take on any monster, knowing that there's sturdy armor between it and you.",
              '25 Armor crafted: With all the extra hides you have on hand, you can afford to trade a bit of substance for style instead. Not only are you dressed to the nines (as much as that applies to dungeon-crawling adventurers,) but you can also use your body as a living wall!',
              "Failed Action: No matter how you cut it, there isn't enough hide here to make anything useful. Grumbling in frustration, you throw your unfinished product in the trash and leave. What you have will have to be enough.",
            ],
          },
          apprentice: {
            name: 'Apprentice',
            states: {
              isLocalDone: 'Apprenticeship',
            },
            tooltip: `
              You decided that knowing more about construction would help.
              You use your Crafting Guild license to hit the books.
              Goes faster with a higher guild multiplier.
              Gives 10-20 exp to Crafting for 0-100%.
              Requires Crafting Guild.
              Unlocked at 40% Rumors heard.
            `,
            stories: [
              "1% Apprenticeship: Meck seems determined to ignore you as he goes about his work, only remembering that you exist when he needs you to fetch something. It's not pleasant, but you're happy he accepted in the first place.",
              "10% Apprenticeship: Despite Meck's best efforts, he can't stop you from watching him work. You have to admit, for all his sour attitude he's got a steady hand and a keen mind. You could learn a lot from him if he didn't keep sending you away to fetch pointless things.",
              "20% Apprenticeship: After repeated badgering, you got Meck to explain his methods a little. You only get one nugget of knowledge at a time, but sooner or later it'll start adding up.",
              "40% Apprenticeship: Bit by bit you're gaining skills, and you're itching to try them out. Unfortunately, Meck forbids you touching his tools, and the last time you tried to use one he slapped it out of your hand and berated you for five minutes straight.",
              "60% Apprenticeship: You can follow along with most of what Meck says and have learned how to string him along into a longer lecture where you can pry some more advanced ideas out of him. Even better, once you start showing that you know what he's doing he eases up on the more frivolous fetch requests.",
              '80% Apprenticeship: You called Meck out on a mistake! You fight the smug grin off your face as he re-examines his work and curses. He has you fetching random things non-stop for an hour after that, but it was totally worth it.',
              "100% Apprenticeship: Meck is still a better craftsman by far, but he still won't let you touch his tools and you've learned enough to get certified, so it's time to find houses under construction and get some hands-on experience.",
            ],
          },
          mason: {
            name: 'Mason',
            states: {
              isLocalDone: 'Buildings Built',
            },
            tooltip: `
              You've completed your apprenticeship and have the theoretical knowledge - now you need to get hands on.
              Goes faster with a higher guild multiplier.
              Requires Crafting Guild.
              Gives 20-40 exp to Crafting for 0-100%.
              Unlocked at 60% Rumors heard and 100% Apprenticeship.
            `,
            stories: [
              "1% Buildings Built: You walk onto the construction site and ask if they need a hand. After convincing them you're good for the job they seem willing enough to let you do some of the less important work.",
              "10% Buildings Built: With a little more effort they'll let you help on other parts of the job, and soon enough you've helped out everywhere at some point. During a break you ask if they know about any other construction sites.",
              "20% Buildings Built: The job at this site is nearly done, so there isn't much for you to do except clean-up, but the workers are exceptionally friendly and they tell you about a few other active sites and even an upcoming project that's right about to start.",
              "40% Buildings Built: Different houses have different needs and are approached in completely different ways, you find. You've worked on a good few houses and each time you felt like you had to learn from scratch. It's enlightening.",
              "60% Buildings Built: You've gotten better at tracking down sites, and have wandered into construction teams all over the city by now. You're learning the difference between how a crew in the slums does it and how an aristocrat's crew operates.",
              "80% Buildings Built: You need to be more proactive to find new sites, now that you've built on all the active ones. With a little smooth talking you can often convince people to start work a week early, opening up new sites to build at.",
              "100% Buildings Built: You don't feel like you fully understand the art of construction, but you've exhausted all the construction opportunities you could find. If you want to continue advancing, you'll need to shift focus to the design side of things.",
            ],
          },
          architect: {
            name: 'Architect',
            states: {
              isLocalDone: 'Projects Planned',
            },
            tooltip: `
              Now that you know how things work, it's better to learn how to design them.
              Goes faster with a higher guild multiplier.
              Requires Crafting Guild.
              Gives 40-80 exp to Crafting for 0-100%.
              Unlocked at 80% Rumors heard and 100% Buildings Built.
            `,
            stories: [
              '1% Projects Planned: You sign up for a house design bid, but the deadline comes and goes as you struggle to turn your design plans into actual schematics.',
              "10% Projects Planned: With multiple tries to polish things, you finish before the deadline this time. You don't win, placing near the bottom of the ranking, but you're just glad to be on the charts.",
              "20% Projects Planned: You try another couple of the active bids, and with some effort you make submissions for them too. You aren't winning any bids yet, but you like to think you're getting better.",
              '40% Projects Planned: After many revisions and redesigns, you come in third place on the most recent competition, and your design is put up alongside the winner and second best for public display.',
              "60% Projects Planned: For the very first time, you've won a competition! You don't have time to actually supervise construction, so you turn down the bid itself, but your design still takes the place of honor on the public display.",
              "80% Projects Planned: These days you win as often as not, and you rarely place beneath top three. Part of it is that you're already familiar with all of the active competitions, but you wouldn't be winning if you weren't making good designs.",
              "100% Projects Planned: With this victory, you've won every design competition in Merchanton at least once. However, there are countless ways to design a house, so you aren't done designing and maybe never will be.",
            ],
          },
          readBooks: {
            name: 'Read Books',
            tooltip: `
              There's a library! You always loved reading.
              Discover new worlds and perspectives, get ideas from fiction characters, and empathize with the desire to be stronger.
              Requires glasses.
              Has 4x exp/talent gain, and can only be done <div id='trainingLimitInt'></div> times per reset.
              Unlocked at 50% city explored.
            `,
            stories: [
              "Books read: They do have it! You must have read this book a hundred times when you were a kid, and it's been a long time since you've found another copy. That's not all the library has to offer, far from it, but right now you're happy to settle down with your favourite book for an afternoon of reading.",
              "100 Intelligence Talent: You've been rereading all of your old favourites, and it's like a completely new experience. There's a lot of subtext that went over your head and subtle themes you never quite picked up on. You thought stories for kids were just a bunch of silly words strung together, but you can see that there's more beneath the surface now that you know how to look.",
              "1,000 Intelligence Talent: You've grown a fondness for mystery novels recently. You like teasing through all the hints, laying out what you know of all the characters and their motivations, and trying to figure out the solution before it's revealed to you. You're getting it right more often with each book you read!",
              "10,000 Intelligence Talent: You finish reading the last book in the library. It's bad, there's a reason you left it for last, but you needed to read it. The ways that it's bad throws the better qualities of more successful stories into stark relief, and by analyzing its failures you can better appreciate what makes good stories good. The search for knowledge leaves no stone unturned.",
              "100,000 Intelligence Talent: You can't help it. You read a story and just know that it could've been done better. Every mistake sticks out like a challenge, and you'll soon find yourself quill in hand answering the challenge. Better endings, more immersive worldbuilding, clearer themes, there's always something that can be done better. Your rewrites vanish at the end of the loop, never to be read by anyone, but you know that you'll be back here for real once you're free.",
            ],
          },
          buyPickaxe: {
            name: 'Buy Pickaxe',
            tooltip: `
              Getting the pickaxe vendor to talk to you is a tricky task, but at least he'll offer it to you for 200 gold after some convincing.
              Affects any action with the pickaxe icon.
              Can only have 1 Buy Pickaxe action.
              Unlocked at 90% City Explored.
            `,
            stories: [
              "Pickaxe bought: The merchant assures you that the pickaxe is made out of only the most sturdy materials and will last a lifetime without needing repair. You're not entirely convinced, but you don't need it to last a lifetime anyways, and it does have a good heft to it.",
            ],
          },
          heroesTrial: {
            name: 'Heroes Trial',
            states: {
              isLocalDone: 'Done',
              isComplete: 'Completed',
              isPart: 'Heroes Trial',
            },
            tooltip: `
              Gather your party to take on the trial of heroes!
              Progress is based on Team Combat.
            `,
            segments: [
              'Locate Entrance',
              'Navigate Door Maze',
              'Slay Spectres',
              'Escape Evaporating Tunnel',
              'Fend Off Spider Ambush',
              'Avoid Explosive Runes',
              'Disable Miniature Pylons',
              'Fight Dark Amalgamation',
              'Cleanse Floor',
            ],
            stories: [
              "Floor 1 Completed: You're not entirely sure how you failed to notice the immense tower before, but now that you've found it, you're determined to clear it. Cleansing the first floor, you can tell that you've got your work cut out for you.",
              'Floor 10 Completed: With every floor you climb, the enemies you face grow stronger. It is grueling work, even for something called "the Heroes Trial," and you\'re pretty sure that there won\'t be a reward other than bragging rights at the end.',
              "Floor 25 Completed: You feel like your legs will buckle if you have to climb the stairs for another floor, and yet you carry on. You've come this far, this is no time to just give up and back off!",
              'Floor 50 Completed: You fall to your knees as you reach the top of the tower, the structure beneath you glowing faintly with the results of your efforts. As you scream your victory to the heavens above, you <i>know</i> this kind of tale is worth a free round of drinks or two!',
            ],
          },
        },
        journeys: {
          startTrek: {
            name: 'Start Trek',
            tooltip: `
              Begin your trek to the top of Mt. Olympus.
              Unlocked at 60% City Explored.
            `,
            stories: [
              "Traveled to the fourth zone: Merchanton is an interesting place, but unfortunately it doesn't seem to have your cure. You've heard many wondrous things about Mt. Olympus though, and if the stories are real then maybe divine intervention or old magic could be the solution you're looking for. They also say the mountain is dangerous, but to be honest you've always wanted to go mountain climbing.",
            ],
          },

          underworld: {
            name: 'Underworld',
            tooltip: `
              Your knowledge in the explorers guild continues to open new doors. Grease the right hinges with a bit of gold, and who knows where you can end up.
              Unlocked with 50% of the world surveyed.
              Travels to Commerceville.
              Costs {{gold}} gold.
            `,
            stories: [
              'Traveled through the Underworld: Checking your map one more time, you make your way down the well-hidden alleyway and through a door that you\'re not quite sure is exactly <i>there.</i> Rather than any kind of room, you find yourself on the shore of an underground river, where a ferryman awaits you. "...You live yet," the ferryman whispers louder than an earthquake, "why do you seek passage?" Rather than explaining yourself, you hold up a heavy pouch of coins. Charon, as you somehow know the ferryman is named, silently nods and gestures for you to board. The trip across the waters is silent, steady and... boring. However, the moment you set foot on the Far Shore, the world twists around you and you are suddenly standing in front of Commerceville\'s gates! ...If this is the afterlife, you\'d rather stay alive a little longer.',
            ],
          },
        },
      },
      townZ3: {
        options: {
          climbMountain: {
            name: 'Climb Mountain',
            states: {
              isLocalDone: 'Mountain Explored',
            },
            tooltip: `
              Traversing the mountain will be difficult, but you can use your pickaxe as a makeshift climbing pick of sorts to help you get around.
              2x progress with pickaxe.
            `,
            stories: [
              "1% Mountain Explored: You stand at the foot of the mountain and look up at the peak. It's so far away, so high up. You take a minute to just stare in awe before looking for a good route up.",
              "10% Mountain Explored: As you climb up the foothills you see old abandoned campsites and think of the rumours you've heard. You're obviously not the first person to try to scale the mountain, but you wonder how the other expeditions ended.",
              '20% Mountain Explored: On the mountain proper, you start seeing odd symbols carved into stones here and there. It looks like the stories of an old civilization living here were true after all.',
              "40% Mountain Explored: Hidden away in the side of the mountain, you find a tunnel that seems to go deep under the mountain. There's more of those odd symbols near the entrance, perhaps a warning not to go in?",
              "60% Mountain Explored: The higher you climb the more remains of the ancient civilization you see. Even here at the outskirts you're finding bits of worked stone half-buried in the rocks. Time, it seems, has not been kind to their city.",
              "80% Mountain Explored: You're in the heart of the ruined city now, and there's no hiding what once was anymore. Houses, roads, a once-lovely fountain, it's all in ruins but you can picture what their city must have looked like in its prime.",
              "100% Mountain Explored: You reach the summit, and in front of you is a huge, magnificent temple. It, too, is in ruins, and the statues of the gods are worn and broken. Amidst the bleak scene, your attention is drawn to an inexplicably pristine altar in a position of prominence, and you feel strangely like you're being watched.",
            ],
          },
          manaGeyser: {
            name: 'Mana Geyser',
            states: {
              isLocalDone: 'Weak Spots Checked',
            },
            infoText: {
              text1: 'Spots with geysers left',
              text2: 'Spots with geysers total',
              text3: 'Spots to check for geysers',
            },
            tooltip: `
              Search the ground for weak points in the hopes of revealing massive mana geysers.
              Spots with geysers have 5000 mana.
              Every 100 weak points has a mana geyser.
              Requires pickaxe.
            `,
            stories: [
              'Geyser revealed: As your pickaxe digs into the ground, it suddenly shoots right out of your hands by an explosive pressure from beneath. You glance at where it fell and resolve to retrieve it later, and then turn your attention to the absolutely massive amount of mana bursting forth from the ground, doing your best to absorb as much as you can.',
              "10 Geysers revealed: Having canvassed the entire mountain, you know where all the pent-up mana is hiding, and where to strike to get access to it. You wonder what was causing so much mana to build up inside a mountain, but decide it doesn't really matter as long as you can get at it undisturbed.",
              "15 Geysers revealed: Comprehensive cross-referencing of your mountain and cavern maps indicates new spots where mana may have been building up, too deep to create weak spots visible from the surface. You'd never have thought to strike your pick here, but one heavy swing and the mountain yields up its bounty yet again.",
            ],
          },
          decipherRunes: {
            name: 'Decipher Runes',
            states: {
              isLocalDone: 'Runic Symbols Deciphered',
            },
            tooltip: `
              There are many different runic markings on weathered headstones around the mountain, perhaps you can glean some sort of knowledge from them.
              Reduces mana cost of Chronomancy and Pyromancy by 0.5% per 1% of Glyphs Deciphered.
              2x progress with glasses.
              Unlocked at 20% Mountain Explored.
            `,
            stories: [
              "1% Runic Symbols Deciphered: There are plenty of little ruins scattered around the mountain, with runic markings carved into various stone objects. You can't make heads or tails of them, unfortunately.",
              "10% Runic Symbols Deciphered: You borrowed a reference book from Merchanton's library, and can slowly assemble sentences in the 'language of the ancients' as it seems to be called. That doesn't help you translate them, though, so you'll need more reference books.",
              '20% Runic Symbols Deciphered: A whole stack of reference books on your back and now you can slowly translate the runes and understand them. This one appears to tell the story of how one of the gods fought a giant wolf with venomous claws and won by calling lightning down upon it. Interesting, but not very useful.',
              "30% Runic Symbols Deciphered: There's a whole cluster of engravings chronicling the saga of Tachytus, a time mage who fought against man, beast, and gods in his quest to save his beloved. What interests you more is the helpful how-to guide to time magic that he left behind in the runes.",
              "40% Runic Symbols Deciphered: The translation is moving more smoothly now, since you're getting used to the vocabulary and structure of the runic language. There are a lot of myths and legends recorded, many appearing to be older versions of fairy tales you heard as a kid.",
              '60% Runic Symbols Deciphered: This batch of runes is in a very open space, and it seems that this place is a training area for the art of pyromancy, with runic instructions on the walls. You wonder why whoever made this place felt the need to carve all this into stone. Surely there were mentors around to teach it the normal way?',
              '80% Runic Symbols Deciphered: Translation is quick and easy these days, and one by one you read stories of gods and heroes, man and monster, victory and tragedy. One thing gnaws at you, though: why? Why carve their stories into stones across the mountain? Why put to stone what people were around to share in voice and paper?',
              "100% Runic Symbols Deciphered: It's the last engraving on the mountain, on an intricately detailed but heavily worn headstone, and it explains why all these engravings exist. Out of nowhere, the gods left and a great blight fell upon the mountain. The doomed civilization, unable or unwilling to flee, spent its last days making these carvings. There's a final plea: don't let us be forgotten. Remember our magic, our stories, our way of life, even if nothing else of us survives.",
            ],
          },
          chronomancy: {
            name: 'Chronomancy',
            tooltip: `
              Controlling time seems like it would be a great idea, and thankfully for you, the runes around here contain lots of information on the art of Chronomancy.
              Unlocked with both 30% Runic Symbols Deciphered and 150 Magic.
            `,
            stories: [
              "1 Chronomancy: Chronomancy is unlike any other magic you've practiced, and unbelievably finicky. The mana has to be held perfectly still, as if time is at a standstill, and the slightest mistake will cause the entire spell to destabilize. It's hard work, but you finally get the hang of it and you feel yourself speed up by the barest fraction.",
              "50 Chronomancy: The effect is more pronounced now, and you find that your reflexes are keeping up with your increased speed. Unfortunately, though, the mana drain of the loops appears to have kept up as well, so even though you're getting the same amount of work done in less time you can't seem to get more work done in a loop.",
              "100 Chronomancy: You know that speeding up time isn't the only thing time magic can do, but it seems that for a human like you anything fancier is impossible without additional assistance. The runes recommend a group ritual but you're the only chronomancer you know, so instead you start learning what Tachytus has to say about chronomantic potions.",
              "1,000 Chronomancy: You live in a blur, the world flying by as you casually walk. You've learned how to interpret the agonizingly slow sounds that passes for speech among ordinary people, and how to speak the same glacial tongue back at them. You've got places to go, things to do, and never ever enough time to do it all in. You can slow down when you finally lift this curse.",
            ],
          },

          loopingPotion: {
            name: 'Looping Potion',
            tooltip: `
              Using your aptitude of alchemy and your talent for time, you've managed to recreate the very potion that got you into this whole mess! It can't cure you, but maybe you can find another use for it.
              Costs 400 herbs.
              You can only have one looping potion at a time.
              Unlocked with 200 Alchemy.
            `,
            stories: [
              "Potion Made: There's no mistake, this is the same potion that you were transporting what feels like an eternity ago. This is chronomancy you'd never be able to do as a spell, and you take a moment to feel proud at how far you've come. And yet, you don't really know what to do with the thing. Maybe you'll figure something out later.",
            ],
          },
          pyromancy: {
            name: 'Pyromancy',
            tooltip: `
              Conjure the power of feverishly forceful and furiously fiery flickering flames to aid you in combat.
              And yeah, the runes contain some stuff about this too.
              Unlocked with both 60% Runic Symbols Deciphered and 200 Magic.
            `,
            stories: [
              '1 Pyromancy: Pyromancy is more normal than chronomancy, but it makes up for it by being extra dangerous. Fire, you quickly learn, will consume you just as happily as your foes. Your control has to be ironclad at all times or you might lose a hand in the time it takes to draw a breath.',
              "50 Pyromancy: Without the loops to restore you to normal you'd probably be dead five times over by now, but the rewards you've gained are impressive indeed. Turning that lethality on monsters is a sight to behold, and it's much more versatile than melee combat. Fights often end before they even have a chance to get close.",
              "100 Pyromancy: You feel like an unstoppable wildfire, burning enemies to a crisp in an instant. You haven't had an… accident in a long time, and controlling the flames is becoming second-nature. Fire isn't the solution to every problem, but here and now you feel like it just might be.",
              "500 Pyromancy: You had read of the legendary pyromancer Mustang, and how he wore a pair of specially-crafted white gloves that granted him unprecedented control over his fires. Snapping your newly-gloved fingers and watching your flames etch a precise spiral into a tree trunk, you revel in having matched his achievements. This kind of fine control isn't easy... the smoldering remains of the mountainside behind you can attest to that.",
              '1,000 Pyromancy: The fire is conjured and extinguished in tune with your breath. Far beyond needing gloves to control it now, the blaze is an extension of your will as much as your arms and legs. In a fight you are the burning battlefield itself, every wisp of flame bends to your command and seeks only one thing: the complete incineration of your foes in a ravenous inferno. And then the battle ends and you withdraw the fire back into yourself, where it lies in wait for the next enemy to appear.',
            ],
          },
          exploreCavern: {
            name: 'Explore Cavern',
            states: {
              isLocalDone: 'Cavern Explored',
            },
            tooltip: `
              Explore the expansive and twisting cavern beneath the mountain, who knows what wonders (or terrors) you'll find down there.
              Unlocked at 40% Mountain Explored.
            `,
            stories: [
              '1% Cavern Explored: You carefully step inside the tunnel, the warning runes on your mind. When horrible things fail to happen, you go a little further. What awaits you in the depths of the mountain?',
              '10% Cavern Explored: Only a few minutes in you find a branching path. You pick one at random and investigate, only to find more branches further along. Keeping track of all of this is going to be a challenge.',
              '20% Cavern Explored: You step inside a side-tunnel and are awed by what you see. Embedded in the walls are gems of every colour you can imagine, and the light glimmering from them leaves you breathtaken. Even better, you think you sensed some mana coming from them. Is there perhaps a soulstone here?',
              "40% Cavern Explored: Slowly but inevitably, the tunnels lean downwards. As you clear out dead ends and loops, you find that the paths forward tend to be the ones that go further down. Despite how far underground you are, it's strangely warm.",
              '50% Cavern Explored: You turn a corner and find yourself face to face with a giant, monstrous troll. You leap back and prepare for battle, but the behemoth just gives you a curious look and waves some kind of greeting.',
              "60% Cavern Explored: The trolls seem to like it this far down, and you're seeing them all over the place. Maybe they like the heat? It's getting pretty warm, so maybe they aren't fond of cold.",
              "80% Cavern Explored: There are fewer branches to keep track of this far deep, which suggests you might be nearing the end. It's gotten really hot, though, so you're needing to take breaks to rehydrate.",
              "100% Cavern Explored: As you go down the last tunnel, you wonder what's causing all this heat. Maybe there's a giant lava pool just beneath your feet, heating the entire mountain. You reach the final dead-end, and the only thing your heat-baked mind can think of is that it doesn't look like you'll be getting an answer.",
            ],
          },
          mineSoulstones: {
            name: 'Mine Soulstone',
            states: {
              isLocalDone: 'Shiny Spots Checked',
            },
            infoText: {
              text1: 'Spots with soulstones left',
              text2: 'Spots with soulstones total',
              text3: 'Spots to check for soulstones',
            },
            tooltip: `
              Extract soulstones lodged in the walls of the tunnels in the massive underground cavern.
              Every 10 shiny spots has a soulstone.
              Requires pickaxe.
              Unlocked with 20% Cavern Explored.
            `,
            stories: [
              "Shiny spot checked: You chip away at the wall until the sparkling object that caught your eye falls free. To your disappointment, what comes out of the wall is just some shiny rock. You doubt it'd even be worth much at market.",
              "Soulstone mined: This time you're sure it's a soulstone, and as you pry it out of the wall you feel a rush of vindication. It glows an earthy brown with a slight blue tint, in contrast to the colors you found in the dungeon.",
              "30 Soulstones mined: As you found all the soulstones hiding in Mt. Olympus' cavern walls, you quickly realize that unlike the soulstones found in dungeons, these soulstones appear in every loop. You wonder what the cause of that might be, but whatever the reason it's pretty convenient.",
              '75 Soulstones mined: You whistle a tune while your mastery of Spatiomancy turns a small crack into a cave, letting you dig out a few more soulstones that were out of reach before. Do the wonders of magic ever cease? No, probably not. Nor do you expect to run out of soulstones ever again.',
            ],
          },
          huntTrolls: {
            name: 'Hunt Trolls',
            states: {
              isLocalDone: 'Slain',
            },
            tooltip: `
              The cavern is teeming with trolls, but thankfully they appear to be friendly from the encounters you've had with them.
              However, you could do with some troll's blood.
              Gives (self combat) * (1 + main stat / 100) * sqrt(1 + times completed / 100) * (original mana cost / actual mana cost) progress points per mana.
              Unlocked with 50% Cavern Explored.
              Gives Combat exp per troll kill, rather than upon action completion.
            `,
            segments: [
              'Find a Hiding Spot',
              'Scream Very Loudly to Lure Out the Troll',
              'Pounce on the Troll',
              'Fight the Troll',
              "Drain the Troll's Blood",
            ],
            stories: [
              "Troll slain: It was an exciting fight, the nimble human against the powerful troll. Its hide was magically tough and one solid hit could break you in half, but despite that you eventually prevailed. It groans an unintelligible question as it dies, perhaps asking why you wanted it dead, and you can't help but feel a little bad.",
              "6 Trolls slain in a loop: You've stopped getting looks of confusion. They know that something out there is hunting them, and when you bring one down it knows what is happening. Now you're getting hateful glares instead, and they die calling you something in their language. You doubt it's flattering.",
              "20 Trolls slain in a loop: By now many trolls attempt to flee when they see you. This one didn't, instead standing in your way and refusing to take a single step backwards. It was an easy kill. On the other side of its corpse you find a small cavern with a tent and the smoldering remains of a campfire. You spot footprints in the ground, some large and some small. It's a fresh trail, the hunt is on.",
            ],
          },
          checkWalls: {
            name: 'Check Walls',
            states: {
              isLocalDone: 'Illusory Walls Discovered',
            },
            tooltip: `
              Now that you know the ins and outs of the cavern, you start to notice certain spots of the walls that are illusory!
              There seems to be all manner of goodies hidden behind them.
              Unlocked with 80% Cavern Explored.
            `,
            stories: [
              "1% Illusory Walls Discovered: You lean back against the wall to drink some water, except the wall isn't there and you're flat on your back with your water splashed all over your face. Even though you're halfway through the wall, it still looks like it's perfectly solid. These alcoves could've been all over the caverns and you wouldn't have noticed a thing.",
              '10% Illusory Walls Discovered: You begin retracing your paths through the caverns, dragging your hand along the walls so you can notice illusions. Every so often your hand slips through the wall and you find another secret alcove.',
              "20% Illusory Walls Discovered: Most of the alcoves are empty, either emptied over the passage of time or never holding anything to begin with. A few of them seem to be untouched, even after all these years, and you're finding ancient artifacts in chests and on pedestals.",
              "40% Illusory Walls Discovered: You wonder if the ancients somehow hadn't invented locks. You can't really understand why they would go to the trouble of illusory-wall security but not add basic physical precautions.",
              "60% Illusory Walls Discovered: Maybe an alarm goes off in an empty room every time you cross a wall? Perhaps these walls used to be solid magical barriers but now all that remains is the illusion? You're not sure you'll ever know the answer.",
              '70% Illusory Walls Discovered: Instead of a normal alcove, the invisible wall you slipped through contained a large cavern full of a strange glowing liquid. The glow briefly intensifies when you touch it, and you feel your awareness expand a little, as if your mind is responding to the liquid in some way.',
              '80% Illusory Walls Discovered: No matter what you try, the only thing that shows an illusory wall as fake is to reach out and touch it. It would be great if you could just make a potion of see-through-fake-walls or something, but whoever made these walls covered all the bases.',
              '100% Illusory Walls Discovered: Traversing the entire cavern system the first time was time-consuming but interesting. Traveling it a second time with your hand on the walls was just boring. You just wish you knew to do this the first time around.',
            ],
          },
          takeArtifacts: {
            name: 'Take Artifacts',
            states: {
              isLocalDone: 'Artifacts Taken',
            },
            infoText: {
              text1: 'Alcoves with artifacts left',
              text2: 'Alcoves with artifacts total',
              text3: 'Alcoves to check for artifacts',
            },
            tooltip: `
              Behind some of the illusory walls, there are various sorts of artifacts that seem to belong to some sort of ancient civilization.
              Or at least that's what you'll say if anybody comes looking for them.
              Every 25 alcoves has an artifact.
              Unlocked with 5% Illusory Walls Discovered.
            `,
            stories: [
              "Artifact taken: You pick up an ornate necklace from the stone statue it was displayed on. It's made out of precious materials with incredible craftsmanship. If there's anything magical about it you can't figure it out, but there's really no reason to not take a priceless historical artifact with you.",
              "20 Artifacts taken: Your collection is an unfocused assortment of unrelated artifacts found from all over the mountain, the only quality they all share being impeccable detail and craftsmanship. It seems like you're only picking clean what hasn't been lost to other people over time, but what you found will fetch a pretty penny nonetheless.",
              '50 Artifacts taken in a loop: During your studies in Valhalla, you picked up on an odd tradition: The people from the mountain would leave one treasure out in the open, but bury a second or even a third nearby. You can kind of follow the logic there; let the intruders grab some small fraction of your wealth, but keep most of it out of sight. In any case, a bit of creative tinkering with Spatiomancy makes even the deepest-buried treasure no further below the surface than you can reach with your bare fingers, and the extra artefacts are a great bonus.',
            ],
          },
          imbueMind: {
            name: 'Imbue Mind',
            states: {
              isLocalDone: 'Completed',
            },
            tooltip: `
              Deep behind one of the many illusory walls, you've found a small glowing lake full of some sort of liquid.
              Your soulstones seem to glow when they get close to it.
              You appear to be able to use them as a link to your mind, but the process requires a very large amount of mana and will destroy them once it's complete.
              Each imbuement will increase the training limit by 1.
              Gives (magic skill) * (1 + main stat / 100) * (original mana cost / actual mana cost) progress points per mana.
              Can only have 1 Imbue Mind action.
              Unlocked with both 70% Illusory Walls Discovered and 300 Magic.
              Sacrifices (20 * (imbuements+1)) soulstones.
            `,
            segments: [
              'Submerge the Soulstones',
              'Arrange the Soulstones',
              'Absorb Knowledge',
            ],
            stories: [
              'Third phase reached: The soulstones are all arranged, glowing a bright uniform white. You sit in the center and close your eyes as the ritual begins. You can sense the soulstones all around you, bathed in light, and you mentally reach out and start pulling them closer.',
              "Imbuement complete: It's overwhelming. You're thinking faster than you remember ever thinking before, your mind flashing from scene to scene as fragments of knowledge float by on the sidelines. Slowing down would be fatal, you have no choice but to trust the strength of your mind. Finally, it ends, and you open your eyes. The soulstones are nowhere to be found and the lake is just clear water now.",
              "50 Imbuement completed: Each attempt involves more soulstones, more knowledge, but at the same time these very rituals fortify your mind and allow you to survive with increasing ease. The knowledge you absorb, it's more than simple book smarts or combat instincts. Your mind is expanding, its limits falling away with each imbuement. Once upon a time you were an ordinary human with ordinary comprehension, but now you're becoming something more.",
              "500 Imbuement completed: You'd say you can't imagine ever thinking as slowly as you once did, but that's not true. Your memory is perfect now, and you know exactly what your thoughts were like before the loops. Slow, muddled, incomplete. The one thing you can't imagine, with all your mental acuity, is the idea of giving all this up. You don't hate your past self, but you know deep in your bones that if you found yourself in their shoes again you'd do absolutely anything to regain what you lost.",
            ],
          },
          imbueBody: {
            name: 'Imbue Body',
            states: {
              isDone: 'Completed',
            },
            tooltip: `
              With your new knowledge, you believe you can also use the lake to reinforce your body across time. Each imbuement will increase starting stats by 1.
              Gives (magic skill) * (1 + main stat / 100) * (original mana cost / actual mana cost) progress points per mana.
              Can only have 1 Imbue Body action.
              Level is limited by imbue mind rank.
              Sacrifices (imbuements+1) levels of talent.
            `,
            segments: [
              'Submerge yourself',
              'Focus essence',
              'Absorb might',
            ],
            stories: [
              "Third phase reached: Even if the silvery glow of the lake has faded, this is still a place of power. You've been able to reinforce your mind in a way that persists through the loops, so why shouldn't you be able to do the same with your body? You meditate in the clear waters, trying to find the core of your being. There are no soulstones arrayed around you: you don't think they'll be needed.",
              "Imbuement complete: Your breath stills, the very blood in your veins crawls to a halt for the briefest of moments, and you finally reach your innermost self. With nowhere to go but forward, you press on, trying to fill the space within with what you've gathered in your practice and training. An indescribable feeling washes over you as a tiny sliver of your strength fades, invested into your future self. The needs of your body reassert themselves the moment you're done, and you're left gasping for air in the middle of a subterranean cave.",
              "50 Imbuement completed: Each time you come back here, it's with the intent to leave as something less than when you entered, the capability you've honed over many loops sacrificed to fill the depths of your being with a power that transcends time. No more do you begin each loop as the hapless courier who couldn't even keep a precious package safe; with every visit that person becomes more and more of a distant memory. Every time you return to that moment in Beginnersville, the resumed flow of time sees you moving faster, thinking clearer, and fighting better than your past self ever did, and you're glad for it. What better joy is there, you ask yourself, than self-improvement?",
              "500 Imbuement completed: Every loop you become a new person, growing and learning and training until you're more capable than in your wildest dreams, and every loop all that progress is stripped away from you. You're forced to watch it all slip through your fingers time and time again, reducing you to a shadow of your former self, only for you to build it all up gain and lose it all again. This imbuement isn't a true solution, not while the loops still persist, but it dulls the ache.",
              'Imbuement failed: You prepare to improve your body once again, but just as you get into the pool and start the process of drawing in the energy, you can tell something is horribly wrong. Your body strains against you, and your mind struggles to keep your instincts under control. There is hardly enough time to pull any appreciable amount of might before you sit bolt-upright, wheezing for breath while you try to keep your heart from breaking free from your chest. Looks like empowering your body more than your mind can handle is a non-starter.',
            ],
          },
        },
        journeys: {
          faceJudgement: {
            name: 'Face Judgement',
            tooltip: `
              Face the judgement of the gods. If your reputation is 50 or above, you'll be accepted into their good graces and granted passage to Valhalla. If your reputation is -50 or below, you'll be cast into the shadow realm.
              (If neither, nothing happens.)
              Unlocked at 100% Mountain Explored.
            `,
            stories: [
              "Judgement Faced: Their civilization may have fallen, but their gods are still very real, and the weight of their attention nearly drives you to your knees. Seeking to justify your presence, you begin to speak. Of your life, of your goals, and of your moral fibre. Every act of kindness, every misdeed, it all comes tumbling out one after another. The only secret you manage to withhold is the loops - you have a feeling that you'd be struck down immediately if you let that slip.",
              "Ignored by the Gods: You finish your story, trailing off awkwardly as you tell of the moment a few minutes ago, when you decided to appeal to the gods. Anxiously, you wait for their verdict, but your anxiety quickly turns into terrified shame as you sense emotions of boredom, annoyance, and even disgust. How dare you waste the time of the gods like this!? You cringe as their attention slowly fades away a bit at a time, until all that's left is you looking stupid, kneeling on a stone slab at the top of a mountain.",
              "Accepted by the Gods: At the end of your story, a crack of lightning strikes behind the altar and leaves behind a cheerful man. Between the perfect bodily form and the power radiating from him, there's no doubt you're meeting a god in the flesh. He extends his hand, an offer of invitation, and you happily reach out and take it.",
              "Cast into the Shadow Realm: There is only one word for the act of facing the gods while the stench of their dark cousins emanates from you: defiance. They know you aren't here to win their favour, but to spit in their faces as an emissary of their hated nemeses. Enraged, the gods strike you down, and you sink into a world of roiling black turmoil. And yet, the dark gods you're aligned with act too, and in the shadows, you find yourself along a twisted yet familiar path.",
            ],
          },
          guru: {
            name: 'Guru',
            tooltip: `
              The greatest explorer the guild has ever known was said to have found a path without judgement to Valhalla itself. Now, as his equal, he is willing to show you the way if you bring him a few herbs.
              Unlocked with 100% of the world surveyed.
              Travels to Valhalla, bypassing Face Judgement and Reputation requirements.
              Requires 1000 herbs.
            `,
            stories: [
              'Guru: The gods were once explorers themselves, the guru explains, for how else could they have discovered Valhalla to make it their home? You toss another herb in the smoky fire, listening to him speak. Seeking to rediscover the route found long ago, the guru had spent decades scouring the mountain that seems so connected to the gods. And at last, he found it. When you press him for details, he simply points upwards. You gaze at the sky and notice the smoke curve strangely around a spot in the air. An invisible gateway, high up in the sky above an unremarkable plateau on the mountain? You had wondered how it took the guru decades of work, but now you wonder how he ever managed it at all.',
            ],
          },
        },
      },
      townZ4: {
        options: {
          guidedTour: {
            name: 'Guided Tour',
            states: {
              isDone: 'Tour Routes Followed',
            },
            tooltip: `
              The city doesn't take too kindly to visitors snooping around, so you'll have to take all their tours to scope it out instead.
              Costs 10 gold.
              2x progress with glasses.
            `,
            stories: [
              "1% Tour Routes Followed: Your gold is still good money here, you note as you join a small gaggle of people following the tour guide around Valhalla. It's a lovely place full of lovely people, and the air smells fresh and clean beyond even the untamed countrysides you're used to.",
              "10% Tour Routes Followed: You're taken past some residential areas, each house immaculate, and you see someone going door to door collecting charitable donations. With how nice everything is here, you're not sure what cause they could be supporting.",
              "20% Tour Routes Followed: Valhalla's Museum of Heroes! You recognize a bunch of this stuff from the myths on Mt. Olympus. Everyone oohs and ahhs at the exact same time, as if following an invisible script. You try not to stand out too much.",
              "30% Tour Routes Followed: Proper decorum extends even to the markets, it seems. Every merchant takes lessons at rhetoric schools and haggling takes the form of a calm and steady debate. Compared to the lively racket of Merchanton, it's almost eerily quiet.",
              "40% Tour Routes Followed: You almost miss the fact that you're now touring Valhalla's magical district. The tour guide explains that even these buildings are not exempt from the Valhalla Beautification Code that 'ensures every building is in harmony with our fair city'.",
              '60% Tour Routes Followed: You finally encounter a place with a distinct style when your tour reaches the Wizard College. Spires rising high into the sky, detailed etchings on every wall, people in flowing robes flying from place to place. You want to stay and observe it some more but the tour guide rushes you along with a sour look on her face. Is there some kind of story here?',
              "80% Tour Routes Followed: The tour guide is much happier to show off the city hall, an utterly mundane building where bureaucrats scurry to and fro. The only tell that this is the domain of the gods is how everyone looks like a supermodel and there's never a speck of disorder no matter where you look.",
              "90% Tour Routes Followed: From a distance, you're allowed to view the grand mansions of the upper class. You see a god riding by on a great winged horse that rises into the sky. You're enraptured by its majesty.",
              "100% Tour Routes Followed: The tour comes to a close and you reflect on what you saw. Valhalla is a vision of perfection, everything in its place without the slightest deviation. Living here would either be idyllic bliss or oppressive torture, and you're not entirely sure which.",
            ],
          },
          canvass: {
            name: 'Canvass',
            states: {
              isDone: 'Houses Canvassed',
            },
            tooltip: `
              The city has a local charity that's looking for volunteers to canvass around for potential benefactors. Maybe if you know the information of some of said people, it could be helpful.
              Unlocked at 10% of city toured.
            `,
            stories: [
              "5% Houses Canvassed: You follow one of the donation-seeking gods around a bit. He's apparently gathering money for the 'Valhalla Garden Beautification Fund', which provides homeowners with flower seeds approved for garden use. A surprising number of residents are willing to contribute a few gold. If a cause like this can draw in money, then perhaps...",
              "15% Houses Canvassed: Valhalla's an odd mixture of extremely ordinary and extremely extraordinary. Right now you're talking to a god who controls the raging ocean currents, rivulets of water coiling around his button-up T-shirt. As you're chatting, he suddenly grins and tells you that a ship of mortals just fell beneath the waves, somewhere out there.",
              "30% Houses Canvassed: You weren't sure that any part of Valhalla could be messy, but it looks like the gods still love their lavish and raucous feasts. There's a divine amount of mess across this whole city block, and a dozen gods diligently cleaning it all up. You're told the Valhalla Feast Group Fund will pay anyone willing to help out.",
              "50% Houses Canvassed: Hair like lightning, scars on his face where the venomous wolf clawed at him, this is undoubtedly the same god you saw recorded on the slopes of Mt. Olympus. He's mowing his lawn and you see a watering can off to the side for the flowerbed. You ask about the story but he's profoundly uninterested in talking about his past, and politely tells you he'd like to get back to his mowing.",
              "75% Houses Canvassed: You may have made a mistake, a busybody from city hall is very suspicious of your made-up charity. You try to dodge the question but she isn't having any of it, and as you argue you see dozens of snakes start to slither out of her house. You decide to make yourself scarce.",
              "100% Houses Canvassed: In an odd house that you're pretty sure breaks several Valhalla regulations, dressed in a simple tunic nobody else would be caught dead in, you meet Valhalla's version of a nonconformist. It turns out, he gets away with it because he's the only god in city hall who can balance the budget, and everything would fall apart without him. That only grants him a little bit of leniency, but he'll take what he can get.",
            ],
          },
          donate: {
            name: 'Donate',
            tooltip:
              "You can donate to the charity yourself if you'd like. Costs 20 gold. Gives 1 reputation. Unlocked at 5% of houses canvassed.",
            stories: [
              "Donated to charity: It hurts to part ways with the money, and you're not sure why Valhalla needs an entire charity to 'fund inspections of exotic pet manicure facilities' in the first place, but the people here seem to consider it a worthwhile cause and that means you can look good by supporting it.",
            ],
          },
          acceptDonations: {
            name: 'Collect Donation',
            state: {
              isDone: 'Donations Accepted',
            },
            tooltips: {
              donationsLeft: 'Meaningful donations left',
              donationsTotal: 'Meaningful donations total',
              donationsToCheck: 'Donations to check for value',
            },
            tooltip:
              "After doing some canvassing for the local charity, you're now able to accept some donations on their behalf, since you know the routine. Costs 1 reputation. Requires a reputation above 0. Meaningful donations are worth 20 gold each. Every 5 donations is worth a meaningful amount. Unlocked at 5% of houses canvassed.",
            stories: [
              'Donation checked: You adjust your new "uniform" (really just a bog-normal toga) and make sure that the donation jar is presentable as well, before making your way over to the first house and knocking the door. While the God living here isn\'t in a very giving mood, at least you didn\'t get cussed at.',
              'Meaningful donation received: It took a bit of walking, but you\'ve found your first generous donor: some lesser God of the forest you passed through earlier. They do eye you up and down before dropping the coins into your "pre-emptive post-feast cleaning fund" jar.',
              "100 Meaningful donations: There are rumours circulating of a charlatan running around scamming people with fake charities, and it's getting harder and harder to keep ahead of them. You've changed the charity you're supposedly working for five times now, and gotten an entirely new outfit after they started identifying you by that instead. Their anger is probably warranted, given how much money you've scammed out of the community.",
              '250 Meaningful donations: A high-level application of Spatiomancy is to distort the very space your body occupies, shifting and warping how you look to outsiders. It has limits, but works wonders when people are on guard for someone with a face you stopped wearing hours ago. Finding more people to scam after a more thorough examination of the city is just a bonus.',
              "Action failed with low reputation: You hardly get time to take a breath and start your spiel about the alleged charity you represent before a look of recognition comes over the God, and they slam the door on you right away. Guess it's time to lie low before you get kicked out entirely.",
            ],
          },
          tidyUp: {
            name: 'Tidy Up',
            states: {
              isDone: 'Tidied',
              isPart: 'Mess',
            },
            tooltip:
              'Tidy up the place. Gives (Practical Magic) * (1 + main stat / 100) * sqrt(1 + times completed / 100) * (original mana cost / actual mana cost) progress points per mana. Gives 5 gold and 1 reputation per mess cleaned. Unlocked at 30% of houses canvassed.',
            segments: [
              'Move Boxes',
              'Sweep The Floor',
              'Fix Decorations',
              'Help Build',
            ],
            stories: [
              "Attempted to tidy up: There's broken furniture, holes punched in the walls, scorch marks on the floor, and food splattered absolutely everywhere. Valhalla's feasts must truly be a sight to behold, but for every wild party there's a beleaguered cleanup crew. It pays well - Valhalla knows nobody would ever do this without compensation - and all the tricks you learned from that old hermit are really handy for this job.",
              "100 Messes Tidied Up: You never quite expected this from the prim and proper Valhallans. It's an insight into their culture that you might not be able to find anywhere else. They go through ordinary lives every day, until they come to a feast and go utterly wild. Some of these messes even seem deliberate, like a god just wanted to see all these fruits squashed on the ground for the heck of it.",
              "1,000 Messes Tidied Up: Like an oracle picking through bones, you're starting to get a picture of what a feast looks like just from the mess it leaves behind. Food splatters differently based on who threw it, and you can almost re-enact a fight by piecing together which splatter belongs to which god. The shattered table lying against the wall also tells you how the fight must've ended.",
              "10,000 Messes Tidied Up: There are patterns beneath all the noise, a beauty to the madness. If there's a shattered glass on the floor, there's probably a table within ten feet. If the table is broken, check the ceiling for forks and knives embedded in the roof. Piles of meat tend to occur no more than three times per feast, surrounded by a loose radial pattern of scorch marks. The feasts are a symphony, a mad dance set to an inaudible beat, and every step of the dance leaves an undeniable mark on the refuse left behind.",
            ],
          },
          buyManaZ5: {
            name: 'Buy Mana',
            tooltip: '1 gold =',
            tooltip2: 'mana. Buys all the mana you can.',
            stories: [
              "Mana bought: Finding the God of Trade isn't hard, since he announces his presence loudly any time he's at the market. Apparently, he also has a lot of influence in the affairs of mortal traders, because he confirms that he sets the prices everyone else charges. Oh well, spares you the trouble of calculating exchange rates.",
            ],
          },
          sellArtifact: {
            name: 'Sell Artifact',
            tooltip:
              'Sell one of the artifacts you found on Mt. Olympus as a priceless ancient heirloom. Costs one artifact. Gives 50 gold. Unlocked at 20% of city toured.',
            stories: [
              "Artifact sold: On your tours around the city, you noticed this one small shop with a sign outside, inviting people to come on in if they had antiques they might want to sell. Sure enough, while the Goddess behind the counter takes her sweet time inspecting the artifact, she accepts it once she's certain of its genuinity and you leave the shop a fair bit richer.",
            ],
          },
          giftArtifact: {
            name: 'Donate Artifact',
            tooltip:
              "Donate a precious artifact to the museum of heroes. It's okay - with each act of generosity you earn friends in high places. Costs one artifact. Gives one favor. Unlocked at 20% of city toured.",
            stories: [
              "Donated an artifact: Turns out it's quite a hassle to donate an item to the museum, since the item has to be properly identified, can't be a \"known stolen\" item from someone's private collection, has to be of proper historical value... Regardless, you eventually get a firm handshake from the Head of Conservation and their personal thanks for delivering the artifact.",
              "Donated 20 artifacts in one loop: By the time you turn in the last artifact, everyone in the museum staff knows your face and your reputation. The Head of Conservation privately checks in with you to make sure you didn't make some deal with the God of Forgotten Things, but you reassure them as you turn in the artifact. By now, the Gods in the higher echelons of Valhallan society know your name too!",
              "Donated 50 artifacts in one loop: After turning in the final artifact, the Head of Conservation takes you aside. While they are very thankful for the priceless treasures from the past that now have found a safe home thanks to your efforts, they also politely recommend you slow down before you draw the attention of anything Old and Forgotten. Suits you well enough, you're out of artifacts anyway.",
            ],
          },
          mercantilism: {
            name: 'Mercantilism',
            tooltip:
              "Practice your mercantile skills, which are sorely lacking considering how poor of a deal you're getting from those mana merchants. Costs 1 reputation. Requires positive reputation. Unlocked at 30% of city toured.",
            stories: [
              '1 Mercantilism: You try your hand at haggling with the God of Trade... and promptly get laughed at in the face for your efforts. Thankfully, the God in question is a good sport and helpfully gives you a few tips before sending you on your way.',
              "30 Mercantilism: You're pretty good at haggling, if you do say so yourself, but these people are on a completely different level. They don't need to raise their voice or make wild claims that they'll be left destitute without a better deal, because they're too busy weaving traps in their words without ever breaking their unassailable mask of professionalism. There's a lot you can learn here.",
              "100 Mercantilism: The mana crystals the merchant's selling you aren't bad, but bad crystals are cheaper than good crystals so you call the quality of his wares into question anyways. He studiously defends his stock, but the mask of professional confidence you wear erodes his own conviction, until eventually he gives in and marks down the price.",
              '500 Mercantilism: Voice dripping with disdain but words unfailingly polite, you paint the goods you buy in the worst possible light. The counterarguments fail to find any footing against your cool unflinching gaze. You are the consummate professional, steady as a rock and incisive as a razor; none dare charge you full price.',
            ],
          },
          charmSchool: {
            name: 'Charm School',
            tooltip:
              'Learn to make people love you! Has 4x exp/talent gain, and can only be done {{limit}} times per reset. Unlocked at 30% of city toured.',
            stories: [
              "Charisma trained: The Charm school is mostly attended by the children of various high-ranking Gods, and you feel like you don't quite fit in. Still, you try your best to learn how to behave as a proper member of high society.",
              '100 Charisma talent: While you still pale in comparison to the Gods who also study at the school, you are finally starting to get good enough to properly charm all but the most charismatic mortals you encounter.',
              "1,000 Charisma talent: By this point, even your classmates are starting to look up to you, and more than once have you charmed your way into making some God in training carry out small chores for you. While the reputation of your silver tongue is still expanding, you're already benefiting greatly of your efforts.",
              '10,000 Charisma talent: Your teachers shake their heads as you enter the classroom, since by all accounts you ought to be a teacher rather than a student yourself. Still, while you have learned all the basics, you now attend the school to try and suss out the deeper secrets of charisma. That, and the adoration of your "peers" is not a bad perk either.',
              "100,000 Charisma talent: You completely ignore the lectures in favor of socializing with the other students. You already know all the theory, so the only way to get better is to practice. The teachers would never stand for it normally, but since it's you, they don't mind at all, even going so far as to ask if their teaching is too noisy for you on occasion.",
            ],
          },

          enchantArmor: {
            name: 'Enchant Armor',
            tooltip:
              'Pull some strings to convince a divine blacksmith to enchant your armor. Costs one favor and one armor. Gives one enchanted armor. Enchanted armor is three times as effective as normal armor. Unlocked at 40% of city toured.',
            stories: [
              "Enchanted armor gained: The best enchanter in Valhalla has a waiting list equally as impressive. It's not a matter of money - the loop will be finished long before you even meet the man. You mention some of this to your good friend the museum curator as you're donating a priceless relic, and he tells you he may have a solution. You're not sure what he did, but an hour later the god at the top of the list decides to offer you his spot.",
              "10 Enchanted armor: Shoes that step on the air like solid ground, a helmet that deflects projectiles before they even get close, gloves that hold onto your weapons even when you lose your grip - you underestimated the power of enchanted gear. Your every step is filled with augmented vigor and you know that claws and fangs will find no purchase against your reinforced defenses. As a bonus, they're all etched with the elegant patterns and runes you see all over Valhalla, making you look like a great warrior of old.",
              "25 Enchanted armor: With the curator pulling a truly immense number of strings for your cause, the enchanter agrees to use his most powerful and demanding spells on your armor. A corona of protective power now surrounds you from all sides, and you can project power out from your shoes to generate upward momentum, launching yourself into the sky. Your vital signs are constantly monitored by intricate spellwork, allowing automatic healing spells to keep you at full strength even when something pierces your incredible defenses. You've never felt safer in your life.",
            ],
          },
          wizardCollege: {
            name: 'Wizard College',
            labelDone: 'Spontaneously Combusted From Wonder',
            tooltip:
              "The wizard college is the finest school in all the realms. You're lucky to be afforded a chance to get in, although it will cost you a small fortune in tuition. Take their tests and get a grade! Can only have 1 Wizard College action. Costs 500 gold and 10 favors. Gives (all schools of magic skills) * (1 + main stat / 100) * sqrt(1 + times completed / 1000) * (original mana cost / actual mana cost) progress points per mana. Unlocked at 60% of city toured.",
            stories: [
              `Attempted to attend: The entry fee allows you to attend basic classes, but that's about it, and for less respected individuals it can be months before they even get around to processing your paperwork. Rising in the ranks won't be easy, either, since advancement in the Wizard College is determined by wizard duels. To rise to a title higher than Initiate, you must challenge someone at that rank and duel them for it. Every trick you can perform that they can't wins you a point, and vice versa. It looks like you'll need skills in all kinds of magic to succeed here.`,
              `Achieved student status: Reading from the library, using the spellcasting arenas, you need to be a student to do much of anything here. Agazan is a fresh young student, only 130 years old, and you're already the third initiate he's dueled. He's good at pyromancy, but what gives you the edge is all the tricks you learned from that old hermit.`,
              `Achieved apprentice status: Dark magic is extremely banned in Valhalla, but you can still apply the general lessons it's taught you. It's handier than you expected, since nobody in Valhalla is even slightly familiar with those mana structures and they have to improvise to keep up with you. Your reward is private tutoring from a full-fledged wizard!`,
              `Achieved spellcaster status: Reaching Spellcaster is considered a sort of graduation around here. Now it's called 'research' if you have your nose in an ancient tome, instead of 'studying'. You're also given a free robe and official immunity to the Valhalla Dressing Standards Act within campus, one of the perks the wizard college maintains despite city hall's best efforts.`,
              `Achieved wizard status: The wizard college is too small for a duel against one of the 53 Magi. Your contest takes place in the vast rolling hills outside the city, with ample space to destroy as much land as is necessary to prove your magical might. Your foe does not disappoint, raising pillars of fire taller than the wizard college and then extinguishing it all in the blink of an eye.  You counter with a special potion brew that turns all it touches into a lattice of glass. Your moment of triumph is a spatiomancy spell where you reach out into the sky and pull down a bird with bare hands.`,
              `Achieved sage status: Every single member of the 199 Sages are old enough to have seen countries rise and fall, and the strength they wield reminds you that these are divinity incarnate. You're no slouch though, and you match them spell for spell. Duels at this level are often decided by whoever falters first, and as you create a ludicrously complicated Dark Magic-inspired mana vortex construct you see your victory written on your foe's sour face.`,
              `Achieved magus status: The wizard college is too small for a duel against one of the 53 Magi. Your contest takes place in the vast rolling hills outside the city, with ample space to destroy as much land as is necessary to prove your magical might. Your foe does not disappoint, raising pillars of fire taller than the wizard college and then extinguishing it all in the blink of an eye.  You counter with a special potion brew that turns all it touches into a lattice of glass. Your moment of triumph is a spatiomancy spell where you reach out into the sky and pull down a bird with bare hands.`,
              `Became a member of the Council of the Seven: Yothik the Serene, grand master of elemental magic, faces you from the hill opposite yours. He's seen you duel your way up to Magus rank during your initiation, and in respect to your skill he's holding nothing back. Two archmages begin casting. The environment around you is incinerated, transmuted, dismantled, weaponized, and restored perfectly to its original state. The grass around Yothik, when he's done replicating your feat, is missing a single blade of grass.`,
              `Became the Chair of the Council of the Seven: The ultimate authority of the Wizard College is Mimir, God of Knowledge. While his control of magic has never surpassed Odin's, since the dawn of Valhalla Mimir has never once stopped thinking up new ways to utilize magic. The power answers his call like an old friend, gentle and subtle, and at the snap of his fingers an entire chunk of the countryside vanishes down to the bedrock. But your loops have taught you many things, every trick in the book and then some, and you certainly don't lack for sheer power. At your victory, he gives you a genuine smile. What greater joy to a lover of knowledge than to find one more learned than he? And so the founder of Valhalla's Wizard College yields his position with pride.`,
            ],
          },
          restoration: {
            name: 'Restoration',
            tooltip:
              "You've gone all this way without learning how to use your magic to heal people, or even yourself. You should probably get around to learning that. Requires Wizard College. Mana cost is reduced by Wizard College Grade. Unlocked at 60% of city toured.",
            stories: [
              "Practiced Restoration: You gather in a room full of cloaked wizards to discuss the nature of life energy. It's quicker, far quicker, than the healing you're used to. Flesh and blood sing in response to it, cleansing impurities and fixing maladies in the blink of an eye. The key is control; to master Restoration you must be able to take life itself in your hands.",
              "Practiced Restoration: You gather in a room full of cloaked wizards to discuss the nature of life energy. It's quicker, far quicker, than the healing you're used to. Flesh and blood sing in response to it, cleansing impurities and fixing maladies in the blink of an eye. The key is control; to master Restoration you must be able to take life itself in your hands.",
              "50 Restoration: The teachers must be confident in their abilities. You've reached the advanced classes, and now you get to test on real, injured people. Volunteers willingly allow themselves to be wounded every which way, just to give your class practice. You feel the gaze of the professor upon you as you heal a nearly-amputated arm. He'd step in before it's too late, of course, but exactly how close to death would that be?",
              "200 Restoration: Now you're the one cleaning up after new students' mistakes, although the professors are still around to step in if you get find yourself in over your head. You mentally curse the college's lax safety policies as you fight to keep your current patient from dying after a first-year <i>horrendously</i> messed up a healing spell they only kinda understood. On the other hand, if the policies weren't so lax, you'd never have gained the iron stomach that's allowing you to stay focused while removing swaths of your patient's mangled flesh.",
              "500 Restoration: You see now why the professors were so bold. You're on the same level as they are now, and at this point, if you saw someone breathing their last dying gasp, you could have them back up on their feet in mere moments. When you fight alongside allies, you can seal up cuts as they're happening, undoing damage that's still being dealt. You've heard wizards say that without Restoration, the gods would never have been able to conquer Valhalla back at the dawn of history, and at this point you believe it.",
            ],
          },
          spatiomancy: {
            name: 'Spatiomancy',
            tooltip:
              'Learn how to control space and matter. Turns out making big changes is <i>hard</i>, but even small changes might allow you to get more done each loop. Requires Wizard College. Mana cost is reduced by Wizard College Grade. Unlocked at 60% of city toured.',
            stories: [
              'Practiced Spatiomancy: The hallway leading up to the Spatiomancy section of the College is long. Really long. <i>Suspiciously long.</i> As you walk past the windows lining the hallway, you notice that the perspective hardly shifts at all between any two of them.',
              "50 Spatiomancy: The first rule of Spatiomancy is that there's no such thing as <i>simple</i> Spatiomancy. Your head feels ready to burst with the sheer amount of learning you've had to do just to get the basics, and things don't look like they'll slow down any time soon. At least you managed to make your backpack bigger on the inside.",
              "200 Spatiomancy: Turns out that there is such a thing as <i>complex</i> Spatiomancy: altering the metaphorical wiggle room people give you in a conversation. The concept is taking a while to get used to, but you think you could convince people to ask you for help next time you're back in Beginnersville.",
              "600 Spatiomancy: You just thought you were getting the hang of Spatiomancy when your teacher quite thoroughly blindsides you with the next level of complexity: Once you get a little better at Spatiomancy, you'll inevitably start figuring out ways to make spaces out of little corners and creases. And naturally, both literal and metaphorical corners and creases are subject to this. You toy with the idea of using Spatiomancy on your brain, and your teacher doesn't try to stop you.",
              "1000 Spatiomancy: Here is a fun fact: Shadows count as a metaphorical corner. While using your shadow as an extra pocket is nice and all, it also makes Spatiomancy a lot more tricky in the Shadow Realms since you have to work around a lot of extra things it can latch on to; especially now that you're approaching a degree of mastery.",
              '1500 Spatiomancy: It is through the power of spatiomancy that the gods reached Valhalla in the first place. The power to warp dimensions guards Valhalla against its foes. The power over reality itself enshrines the gods upon their thrones. And now, it is yours as well.',
            ],
          },
          seekCitizenship: {
            name: 'Seek Citizenship',
            tooltip:
              "Right now, you're just visiting.  If you want to be accepted into their ranks for real, you'll need to study and pass a rigorous exam on Valhallan history and culture.Unlocked at 80% of city toured.",
            stories: [
              `Attempted Citizenship exam: You confidently walk up to the large temple where the exam is held and set to work. You quickly realize you're in over your head as the multiple-choice section runs out and the essay section looms over you. By the end of it, the God acting as proctor gives you a level glare and asks if this is all a joke to you.`,
              `20% Citizenship Exam studied: You figure out pretty early on that the multiple choice section doesn't change, and the examiner is gracious enough to let you have a look at your graded sheet after the test. Sadly, memorizing that section alone will never give you enough points to pass.`,
              `40% Citizenship Exam studied: To better prepare for the exam, you make your way to Valhalla's library. You nearly get lost among the shelves, but manage to find a few reference works that help you do better on the test.`,
              `60% Citizenship Exam studied: You've run into a few interesting facts during your studies: For one, Valhalla is currently in an ongoing conflict with the Frost Giants, but only registered citizens may enlist in order to prevent conflicts of interest. On the other hand, any citizen may construct housing in certain parts of Valhalla and collect taxes from the residents.`,
              `80% Citizenship Exam studied: While you can by now recite the questions by heart, the Gods in charge of taking the test are very strict about plagiarism and failed you when you tried to turn in someone else's answers to the essay question. You guess you'll have to write your own after all.`,
              `100% Citizenship Exam studied: You grin as you hold up the little stone plaque declaring you a recognized citizen of Valhalla, an honour bestowed on very few mortals indeed! Now to make good use of the many hours of studying lawncare regulations that went into this.`,
            ],
          },
          buildHousing: {
            name: 'Build Housing',
            tooltip:
              'Build a house in the city that you can rent out.Can build (crafting guild multiplier) * (1+min(5,spatiomancy/100)) houses.Requires Crafting Guild.Unlocked at 100% Citizenship Exam Studied.',
            stories: [
              `Built a house: Having learned about Valhallan architecture as part of your citizenship studies, you know everything you need to build a house that fits in with the crowd perfectly. It'd take way too long to get a work crew to help you out, so you decide to just build the whole thing yourself. Turns out that makes it easier. Huh.`,
              `Built 10 houses with maximum crafting guild rank: There's an entire block of properties that recently got rezoned as residential areas, and you happily jump at the opportunity. Doing multiple houses at once is even more convenient because you can just do the same step for multiple houses in a row without switching out your tools or materials. It's quiet, so you hum a tune to yourself as you work.`,
              `Built 50 houses in one loop: The houses start to blur into each other. Each house is the same as the next and you settle into a relaxing rhythm until all of them are done. You just hope you built all your houses in the right plots. You're pretty sure you didn't wander off to an unrelated hill and build one of the houses there, but you were kinda zoning out for a lot of the job.`,
            ],
          },
          collectTaxes: {
            name: 'Collect Taxes',
            tooltip:
              'Collect taxes from the properties you have built.Gives (houses * Mercantilism / 10) gold.Requires housing.Unlocked at 100% Citizenship Exam Studied (and 1 Mercantilism).',
            stories: [
              `Taxes collected: Ordinarily you can only collect rent at the end of the month, but when you dived into the legal books to make sure you'd own these houses after you built them you discovered an obscure clause that lets you demand the first payment ahead of schedule. It takes some arguing since none of the residents know of the law, but most of them pony up the money by the time you threaten to bring the hammer of bureaucracy down on them.`,
              `Collected taxes from 50 houses: You wipe the sweat off your brow. While you made sure that "your" neighborhood would be easy to walk up and down to visit all the houses in series, your feet are still hurting a little. Must be the sheer mass of gold you collected.`,
            ],
          },
          oracle: {
            name: 'Oracle',
            tooltip:
              `Peer into the future to better your fortune!Has 4x exp/talent gain, and can only be done <div id='trainingLimitLuck'></div> times per reset.Unlocked at 40% of city toured.`,
            stories: [
              `Visited the Oracle: The oracle explains that every person has a hamingja, a guardian spirit that decides their luck, and that if you play a few games of chance she can read its energies and predict your fortune. A couple rounds of pretend gambling later and she clucks her tongue in disappointment. Your hamingja is apparently slacking off, because she's barely detecting any influence at all.`,
              `100 Luck talent: It's a subtle trend, barely noticeable, but you're rolling higher than you used to.  If you flip 10 coins in a row you'll get 6 heads more often than 6 tails. You must have finally gotten your hamingja to pay attention to you, though if you weren't keeping a mental tally of your results you'd never have noticed.`,
              `1,000 Luck talent: You spot a coin lying on the side of the road as you walk by. That never used to happen back when you were a simple courier. It's hard to imagine how luck could've caused a coin to land here, but you suppose you might've just walked by it if the sunlight didn't happen to glint off of it as you pass by. You send a flash of gratitude to your hamingja and whistle a jaunty tune as you pocket the coin.`,
              `10,000 Luck talent: If you really want to, you can flip ten coins and call it right eight out of ten times every time. This makes you an absolute monster at the casino, enough to easily get you accused of cheating. But it'd be bad if you got kicked out, so your luck is always just believable enough to keep people from complaining. Cheating is for chumps, anyways; you don't need an ace up your sleeve if you know you'll always draw one when you really need it.`,
              `100,000 Luck talent: You live a charmed life. Trivial inconveniences are a thing of the past because everything just happens to line up the way you need it. A door you need to walk through will have been left open, there's never a line at the shops, and even if you don't watch your step you'll never land a foot in the wrong place. If there really is a hamingja looking out for you, you're really lucky to have her.`,
            ],
          },
          pegasus: {
            name: 'Pegasus',
            tooltip:
              `Valhalla has more than its fair share of wonders. Amongst them are the Pegasi; mythical winged steeds, only available to the finest of citizens. If you wish to get your hands on one, you'll need to convince a local to guide you to one of their meeting grounds, and then prove yourself to it. Swift on land and sky, it takes more than just gold to own a creature like this. Costs 200 gold and 20 favors.Unlocked at 90% of city toured.`,
            stories: [
              `Pegasus acquired: While you vaguely recall a story of there being just one Pegasus, there is an entire herd flying overhead as you make your way to the meeting grounds. Neptune, the God looking after the flying steeds, is a good sort and reassures you he'll take care of the paperwork after you've given him the modest fee for the administrative costs. As you walk to the middle of the meeting grounds, several of the flying equines swoop down low to get a better look at you. A tiny one with a mane in all colours of the rainbow hovers in front of you for a moment before shaking its head and zooming off, allowing a rich brown Pegasus touches down a few steps in front of you. The steed patiently waits for you to approach, and soon you're riding off into the sunset atop your new steed, Meliresa!`,
              `Pegasus acquired with 5 team members: Your hired companions were already more than a little intimidated when the Gods welcomed you as almost one of their own, but seeing you ride a Steed of Legends is nearly too much for them. You have to talk Raven down from just walking away from "all this gods-damned nonsense" (especially after several Gods informed her it's been ages since they damned anything,) and Emily has to get Marcus back on his feet after fainting. Honestly, this could have gone worse.`,
            ],
          },
          fightFrostGiants: {
            name: 'Fight giants',
            state: {
              isDone: 'Frost giants vanquished',
            },
            tooltip:
              `Join the Valkyries in their fight against the Frost Giants.Improves your ability to seek favor from the Gods.Can only have 1 Fight Frost Giants action.Requires a Pegasus.Gives (self combat) * (1 + main stat / 100) * sqrt(1 + times completed / 1000) * (original mana cost / actual mana cost) progress points per mana.Unlocked at 100% Citizenship Exam Studied.`,
            stories: [
              `Fought Frost Giants: You ride into battle alongside the Valkyries, charging against the monstrous Frost Giants as the wind whips through your mount's mane and the sound of your battle cry is just barely audible over the fighting! It would have been epic if you didn't nearly get hit by an axe larger than yourself, but still! You're fighting giants, and that's the important part!`,
              `Attained rank "Corporal": Fighting while mounted is no easy task, and fighting an army of endlessly angry giants is one hell of a trial by fire. Still, you're figuring out how not to get knocked out of the saddle in the initial charge, and even gave a few bruises to some of the less careful giants.`,
              `Attained rank "Sergeant": You've fought the giants enough times now that you know their initial charge by heart. The real trouble is that the moment you and your squad make contact, everything becomes chaotic and nothing is the same twice in a row. At least things aren't getting boring so far!`,
              `Attained rank "Sergeant First Class": This loop's charge marks a momentous occasion: you scored your first fully solo Frost Giant kill! So far, you've mostly been joining in the charge alongside the Valkyries and chopping down the injured giants, but by now you're getting confident enough to go off on your own.`,
              `Attained rank "Sergeant Major": The Valkyries are unwilling to take commands from anyone they don't consider a "proper warrior," so it took you by surprise when one of them asked which way to go after your squad took down a group of Frost Giants that had gotten isolated from the main army. You recover quickly and bark out an order, earning you an eye roll as the Valkyries take off and go the direction you indicated.`,
              `Attained rank "Chief Warrant Officer": At the end of each clash with the Frost Giants, there is a brief ceremony where off-field promotions are given to the most effective warriors. You're a little surprised when you hear your name called out and the Valkyrie in charge of the ceremony commends you for your exceptional performance, followed by her pinning a small medal on your chest and announcing your new rank. ...You kinda wish she'd pinned the medal on your clothes, but you just smile and take what you get.`,
              `Attained rank "First Lieutenant": The rank-and-file Frost Giants have stopped being much of a problem to you, and you turn your attention to the remaining proper challenges: the Warchiefs commanding the rest. Baugi is the first of them to fall, the rings around his fingers frosting over as he bleeds out from a great many wounds to his arms and neck.`,
              `Attained rank "Lieutenant Colonel": Eistla is the next Warchief to bite the dust. Even the searing cold storms she conjures against you fail to stop your steed, and with a mighty leap, you stab her in the eye and ride her corpse all the way down to the ground below. Your Pegasus is none too pleased you jumped off, and makes his annoyance known with a flick of his tail straight into your face.`,
              `Attained rank "Lieutenant Commander": The ranks are frankly starting to blend together in your head by now. Besides, you have better things to concern yourself with as you grapple with the shortest Frost Giant of all: Greip the Warchief. Fighting him on your mount would be an invitation for disaster, so (despite your mount's complaints) you're once again on the ground, one arm wrapped around the neck of the diminutive Frost Giant. He still towered twice as tall over you when he was standing, but you managed to trip him up. You just barely feel his heart grow still before your arms give out, and this time your stunt earns you a firm scolding from your higher-ups right after the awarding ceremony.`,
              `Attained rank "Captain": The fight against the second-to-last Warchief, Hraesvelgr, is a grueling and drawn-out struggle made far worse by his tendency to draw energy from the corpses around him. And with how the fight is going, he's got a <i>lot</i> of reserves by the time you charge into him. Finally, by a concerted effort of you and several powerful Valkyries surrounding and charging him, you manage to cut his head off before he can draw in any more energy from the ongoing slaughter. The morale of the Frost Giants is visibly flagging by now, and if it wasn't for the final Warchief rallying them, you're certain they'd have broken rank long ago.`,
              `Attained rank "Vice Admiral": The blood from Hraesvelgr hasn't had time to dry on your hands as you turn your attention to the final Warchief, the largest Frost Giant by a wide margin: Jörmungandr. The very air warps and sparks around his sword as he swings at you, screaming wordless vengeance for the scores of Frost Giants you slew. Your mount is pushed to his limits as you make him dodge and weave around the horrendously deadly blade, looking for an opening. Just as you feel your Pegasus about to faint from the exertion, Jörmungander overcommits to one attack, giving you a split second to jump down and throw your weight against the back of the blade and force it into his neck! The few remaining Frost Giants look in horror as the head of their leader falls before his own feet, before turning and running away while the Valkyries harass the fleeing masses.`,
            ],
            seekBlesing: {
              name: 'Seek blessing',
              tooltip:
                `Pray to the Gods to grant you their favor.Increases the number of soulstones earned from all actions.Can only have 1 Seek Blessing action.Requires a Pegasus.Gives (50 * Frost Giants Multiplier) Divine Favor experience.Unlocked at 100% Citizenship Exam Studied.`,
              stories: [
                `Sought Blessing: You ride your winged mount to the highest place in all of Valhalla and kneel. Asking for the favor of the Gods is a solemn, quiet affair after all.`,
                `Received Blessing: You finish your quiet prayer, here in the middle of the Gods' realm. For a moment, there is silence, but then you feel a warmth grow in your chest as the Gods below answer in the affirmative.`,
                `Received Blessing with maximum Giant Slaying rank: Coming to this quiet place has become something of a ritual for you after so many fights against the Frost Giants. Surprisingly enough, this time you're not alone as a smirking God meets you in your usual spot. He introduces himself as Aries and, with a pat on your shoulder, nearly makes you collapse with the intensity of his Blessing. "Keep up the good fight, will you?" he asks, but he doesn't stick around for you to answer.`,
              ],
            },
            greatFeast: {
              name: 'Great feast',
              states: {
                isDone: 'Completed',
              },
              tooltip: `
                You realize now that you've forgotten the joy of food, after having gone for so "long" without needing to eat anything. It's about time for a feast of grand proportions. Unfortunately, all the catering services here only accept payments in soulstones.
                Permanently increases self and team combat.
                Gives (practical magic skill) * (1 + main stat / 100) * (original mana cost / actual mana cost) progress points per mana.Can only have 1 Great Feast action.Requires 100 reputation.Sacrifices (5,000 * (feasts+1)) soulstones. Currently sacrificing {{sacrifice}} soulstones.
                Unlocked at 100% of city toured.
              `,
              segments: [
                'Explain your order',
                'Give them your information',
                'Verifiy your identity',
              ],
              stories: [
                `Attempted a Feast: Unlike the mortals they rule over, Gods don't need food to survive. Instead, they hold Feasts for the sake of getting drunk and enjoying the best food the realm has to offer. Lucky for you, they are currently planning one you can join!`,
                `Held a Feast: For all the hurdles you had to jump to even get this far, the feast itself makes up for the hassle and then some. The tastiest food, the sweetest deserts and the smoothest drinks fill you up, and you feel like you could handle the Frost Giants' armies all on your own!`,
              ],
            },
          },
          seekBlessing: {
            name: 'Seek Blessing',
            tooltip: `
              Pray to the Gods to grant you their favor.
              Increases the number of soulstones earned from all actions.
              Can only have 1 Seek Blessing action.
              Requires a Pegasus.
            `,
            stories: [
              `Sought Blessing: You ride your winged mount to the highest place in all of Valhalla and kneel. Asking for the favor of the Gods is a solemn, quiet affair after all.`,
              `Received Blessing: You finish your quiet prayer, here in the middle of the Gods' realm. For a moment, there is silence, but then you feel a warmth grow in your chest as the Gods below answer in the affirmative.`,
              `Received Blessing with maximum Giant Slaying rank: Coming to this quiet place has become something of a ritual for you after so many fights against the Frost Giants. Surprisingly enough, this time you're not alone as a smirking God meets you in your usual spot. He introduces himself as Aries and, with a pat on your shoulder, nearly makes you collapse with the intensity of his Blessing. "Keep up the good fight, will you?" he asks, but he doesn't stick around for you to answer.`,
            ],
          },
          greatFeast: {
            name: 'Great Feast',
            tooltip: `
              You realize now that you've forgotten the joy of food, after having gone for so "long" without needing to eat anything. It's about time for a feast of grand proportions. Unfortunately, all the catering services here only accept payments in soulstones.
              Permanently increases self and team combat.
              Gives (practical magic skill) * (1 + main stat / 100) * (original mana cost / actual mana cost) progress points per mana.Can only have 1 Great Feast action.Requires 100 reputation.Sacrifices (5,000 * (feasts+1)) soulstones. Currently sacrificing {{sacrifice}} soulstones.
              Unlocked at 100% of city toured.
            `,
            stories: [
              `Attempted a Feast: Unlike the mortals they rule over, Gods don't need food to survive. Instead, they hold Feasts for the sake of getting drunk and enjoying the best food the realm has to offer. Lucky for you, they are currently planning one you can join!`,
              `Held a Feast: For all the hurdles you had to jump to even get this far, the feast itself makes up for the hassle and then some. The tastiest food, the sweetest deserts and the smoothest drinks fill you up, and you feel like you could handle the Frost Giants' armies all on your own!`,
            ],
            segments: [
              'Explain your order',
              'Give them your information',
              'Verifiy your identity',
            ],
          },
        },
        journeys: {
          fallFromGrace: {
            name: 'Fall from grace',
            tooltip:
              `Looks like the only way to leave this place is to make them dislike you enough to kick you out. Some moderate vandalism will probably do the job. Some people just want to watch something beyond the world burn. You'll be cast into the shadow realm and thrown back to the beginning of your journey.Unlocked at 200 Pyromancy.`,
            stories: [
              `Fell From Grace: As you brush the dust from your clothes, you silently marvel at how little effort it really took to get kicked out. Sure, you had big plans to go on a spree of madness and fire, but the Valkyries grabbed you by the time you finished burning down the first patch of flowers! Your court case afterward was just a formality as well, didn't even get to declare yourself guilty before the judge had you thrown into the Shadow Realm. It's kind of disappointing, you were looking forward to cutting loose.`,
            ],
          },
        },
      },
      townZ5: {
        options: {
          meander: {
            name: `Meander`,
            states: {
              isDone: 'Explored',
            },
            tooltip: `
            This place seems familiar, and yet... not. Everything is twisted and wrong. Just being here hurts your head. You'll need to fortify your mind to make any progress here.
            Gives exp equal to Imbue Mind level. (You make no progress with 0 Imbue Mind.)
            `,
            stories: [
              `1% Explored: This place is disgusting. Filthy rats scurry under rubble and the derelict roads are frequently marred by bloodstains. This place would set you on edge even without the headache-inducing mental effect that even now makes your mind swim. It takes all you have to keep walking forwards, onwards into this horrific landscape.`,
              `2% Explored: Your shambling walk comes to a halt as you reach a plaza with a well in the middle. You recognize places like this from Beginnersville: people loved to come to the well and gossip as they drew water for their houses. The plaza here is empty.`,
              `5% Explored: It's getting a little easier to keep your focus now, and you make your way to the obvious destination in town: the giant ominous spire. Needless to say, there wasn't anything like this in Beginnersville. You circle around the spire once, tracing your hand across the stone, only to pause as you suddenly feel something, a writhing, evil energy. This dungeon's drawing power from somewhere in town. But where?`,
              `15% Explored: The graveyard here is quite full, which surprises you somewhat. You haven't found any other humans around, but you also hadn't seen any corpses. In all honesty, you were starting to doubt there were ever humans here in the first place, despite the buildings and the bloodstains. But if someone is burying the dead, where are they?`,
              `25% Explored: Beginnersville has a shrine to the Valhallans, gods who watch over and protect them, though after seeing the forsaken civilization on Mt. Olympus you get the feeling they might not have much to do with mortals anymore. Here, though, is a shrine to the dark gods, those who lurk below. You can't imagine worshipping them was a wise choice, given the state of the town. You can't imagine anything being worth this destination.`,
              `50% Explored: You stumble across a human by sheer chance, near the outskirts of town, dressed in rags and deathly pale. He spooks upon noticing you and scrambles away under a particularly large piece of rubble. You follow, ignoring how the stale air smells even worse in these isolated pockets of the town. You don't like that you had to threaten the man to get him to tell you where else humans still live, and you don't like the answers he gives you. In a town this size... how many must have died, for there to be so few remaining?`,
              `75% Explored: You reach the last bastion of what might generously be called civilization here in Startington. A dozen-odd people, in a street with slightly less rubble than usual, trying to barter goods with a desperation you've only seen once or twice even in the slums of Merchanton. Food's running low and there don't seem to be any farmers around town. You can see it in their eyes, they all know that the only question left is who starves first.`,
              `100% Explored: You need to leave. You've seen enough of this revolting place to last ten lifetimes. All the rotten wood and crumbled houses, the vermin and vultures, every inch of this town is steeped in death and decay. The dark gods do not rule a kind domain, it seems. Some great misfortune pulled an ordinary town just like Beginnersville down into the shadow realm, and the more you wander these ruined streets the more you viscerally hate what this place has become.`,
              `Meandered with 100 Imbue Mind: If you focus, you can still feel the gloom pull on your thoughts, but by this point it feels like a gentle breeze getting upset you won't dance like the leaves it carries. It's still not a happy place, though, even without any supernatural influences.`,
            ],
          },
          manaWell: {
            name: `Mana Well`,
            states: {
              isDone: 'Wells Checked',
            },
            tooltip: `
              Search the town for wells that still have any mana left. They seem to be rapidly draining.
              Full wells have 5000 mana, but lose 10 mana for every second that has passed in the loop (based on effective time), currently {{mana}} mana.
              Every 100 wells still has mana.
              Unlocked with 2% town meandered.
            `,
            tooltips: {
              wellsLeft: 'Full wells left',
              wellsTotal: 'Spots with full wells total',
              wellsToCheck: 'Spots to check for wells',
            },
            stories: [
              `Mana Well drained: There must have been a ley line beneath the town, because deep within the wells here you sense mana. It's fleeting though, fading rapidly with every moment you stand here. What's causing this? Where is the mana all going? With no time to waste, you begin hauling up water so you can start extracting mana before it's all gone.`,
              `10 Mana Wells with mana found: You can tell what's happening to all the mana now. It's all being siphoned into that great big spire in the middle of town, the same one that's drawing power from all those pylons. The entire town is being drained, crumbling to pieces as the evil structure takes and takes and takes. You don't know what will happen when there's nothing left to take, but there won't be much of a town left at that point.`,
              `15 Mana Wells with mana found: There are ruins beneath the rubble, and wells that have long since been dismantled and forgotten. Under a house's foundation or beneath the stones of an empty plaza, accessible with the right tools and knowledge. But yet, even here the mana is quickly drained away. You had hoped to see how much mana these wells had before the draining began, but it seems your dreams will be nothing more than dreams.`,
              `Drawn from an empty well: Nope, bone dry. There's still water in here, murky and probably very unhealthy water, but not a speck of mana. You toss the bucket back down the well and sigh. At least now you know: if you can't get here any faster than you did just now, just don't bother.`,
            ],
          },
          destroyPylons: {
            name: `Destroy Pylons`,
            states: {
              isDone: 'Pylons Destroyed',
            },
            tooltip: `
              There are strange pylons humming with energy in the abandoned buildings of this town. You're not sure why, but you feel compelled to break them.
              Every 100 abandon buildings have 1 breakable pylon.Each pylon destroyed increases progress on The Spire by 10%.
              Unlocked at 5% town meandered.
              `,
            stories: [
              `Pylon Destroyed: As you pick up one of the Pylon's fragments, you wonder why you broke it. It didn't even feel particularly good, just like it had to be done. Shrugging, you put the fragment in your pocket. As a trophy.`,
              `10 Pylons Destroyed: The strange drive to smash those Pylons still lingers, even now that you've found and destroyed all that you can find in town. ...Maybe there are more after all, and it would be a good idea to go looking again when you have some new way of finding the blasted things.`,
              `25 Pylons Destroyed: You let out a sigh of relief while you pocket your final trophy-fragment. With that last, frustratingly well-hidden Pylon down, the drive to seek and destroy finally quiets down. Now, the Spire beckons you, inviting you to reach its apex.`,
            ],
          },
          raiseZombie: {
            name: `Raise Zombie`,
            tooltip: `
              Upon stumbling by the local cemetery, you realize that those numerous tombstones could perhaps benefit you in ways besides acting as building materials. With your knowledge of dark magic and a hint of troll's blood, you might just be able to raise a zombie of your very own!
              Costs 1 blood.Each zombie adds (dark magic / 2) * max(1,dark ritual / 100) to your team combat.Unlocked at 1000 dark magic.
              `,
            stories: [
              `Zombie raised: You experimentally dig up a recently-buried body, and notice how the ever-present miasma seeps into it. Interestingly, the miasma leaves the body in prime condition for puppeteering magics, which you've extensively studied under the witch. You carve a hole in the chest and add a drop of troll's blood, and your new minion seems to gain a life of its own. How fascinating...`,
              `10 Zombies raised in a loop: The strength of a zombie has little to do with its form, you've found. The rotting remains of a young child claws at foes with the same strength as the lumberjack who died in the prime of his life. You have the town's amply stocked graveyard to thank for the variety of your minions. With each body you dig up you gain another chance to learn more about how to fully exploit your dark powers.`,
              `25 Zombies raised in a loop: Zombies don't bleed when you cut them, and retain perfect functionality as long as the meat keeps the bones connected. Your studies have shown, perhaps unsurprisingly, that fresh corpses are the most receptive to your magics. You've considered... procuring your own supplies, but there happen to be plenty of fresh corpses here just waiting to be used. A legion of soldiers, waiting for you to breathe unlife into them.`,
            ],
          },
          darkSacrifice: {
            name: `Dark Sacrifice`,
            tooltip: `
              You make a sacrifice of troll's blood to dark gods.Costs 1 blood.
              Reduces the soulstone cost of dark ritual.Unlocked at 60 dark ritual.
              `,
            stories: [
              `Made a Dark Sacrifice: The Dark Gods are a lot easier to reach in this world nearly without light, and you can feel their approval wash over you as you offer them the blood of an innocent creature, slain by your cruel hand. Maybe they'll accept a bit of haggling if you try a ritual now.`,
              `100 Commune: While the Dark Gods are still accepting your offerings, you can feel an undercurrent of boredom when you attempt the ritual now. Still, the discount to the number of Soul Stones you need for the other ritual is too good to pass up.`,
              `1000 Commune: Right as you finish the ritual, one of your Dark Masters manifests in front of you. You don't get a word in edgewise before he speaks up. "While we appreciate the free drinks, you really should stop this now. We'd rather have some Trolls left to drink later on, and you're going a long way to drive them extinct. Just give it a damn rest," he says before just disappearing into the puddle of freshly sacrificed blood.`,
            ],
          },
          theSpire: {
            name: `The Spire`,
            states: {
              isDone: 'Looted',
              isComplete: 'Completed',
              isPart: 'The Spire',
            },
            tooltip: `
              Standing tall in the dead center of the town is the towering Spire. Surrounded by an eternal storm, it seems to drain the life from the shadowy world around it. This is surely your greatest task yet.Gives (team combat) * (1 + main stat / 100) * sqrt(1 + times floor completed / 200) * (1 + pylons destroyed / 10) * (original mana cost / actual mana cost) progress points per mana.Unlocked with 5% town meandered.Gives 100 soulstones per completion - hover over Looted for info.
              `,
            completedTooltip: `
              Each soulstone improves a random stat's exp gain by (1+(soulstones)^.8/30).Each floor has 100 soulstones that, when received, multiplies the chance you'll get the next one by 0.98.Chance to receive soulstones recovers per floor at 0.00001% per mana.
              `,
            chanceLabel: 'Chance',
            lastStatLabel: 'Last',
            segments: [
              'Locate Entrance',
              'Navigate Door Maze',
              'Slay Spectres',
              'Escape Evaporating Tunnel',
              'Fend Off Spider Ambush',
              'Avoid Explosive Runes',
              'Disable Miniature Pylons',
              'Fight Dark Amalgamation',
              'Cleanse Floor',
            ],
            stories: [
              `Spire attempted: Even finding the entrance is something of a challenge, and it only gets worse as you make your way through the first floor of the Spire. If it wasn't for the bounty of Soul Stones surely waiting for you at the end, you wouldn't even have bothered.`,
              `1000 floors looted: The wild variations from loop to loop are starting to show their pattern to you, and you're beginning to figure out what kinds of changes can happen on the lower floors to the point where you can anticipate the worst of it. The spiders still get their webs all over your hair, though.`,
              `5000 floors looted: You no longer get lost in the Door Maze anymore, the subtle hints hidden in the wood grain of the doors standing out as much as signposts to your well-trained eye. Doesn't make it any easier when you have to back-track at the end of each floor to ensure none of the beasts come back, though.`,
              `20 floors cleared in a loop: You pant as you slump into the convenient park bench waiting at the very top of the spire. While your bag is heavy with Soul Stones, you silently hope you won't have to do this too many times before you run out of things to spend those stones on. At least the town is now lit with a much less gloomy light.`,
              `Spire challenged with 10 destroyed Pylons: Looks like keeping a trophy from those delightfully fragile Pylons was the right call. Somehow, climbing the stairs is significantly less taxing, nor does the air in the higher floors drain you as much anymore.`,
              `Spire challenged with 25 destroyed Pylons: The lower floors of the Spire are so welcoming to you now that you nearly trip an Explosive Rune, having forgotten for a moment that this is not the Small dungeon in Startington's brighter counterpart.`,
            ],
          },
          purchaseSupplies: {
            name: `Buy Supplies`,
            tooltip: `
                Prepare to move on.This merchant doesn't seem to be willing to haggle with you though.
                Costs 500 gold.You only need one set of supplies.Unlocked with 75% town meandered.
              `,
            stories: [
              `Supplies bought: The man who sells you these supplies, you can tell that he doesn't have much more than what he sold you. You try not to think about it, but you can't forget the bone-deep weariness in his movements or the resolute expression on his face. He knows exactly what he's doing, and you understand why your best efforts couldn't drive the price down even a single gold. But you have places to be, and you very dearly want to get out of here. You buy the supplies, cursing the town's name under your breath.`,
            ],
          },
          deadTrial: {
            name: `Trial of the Dead`,
            states: {
              isDone: 'Corpses Liberated',
              isPart: 'Necropolis',
              isComplete: 'Grave Defiled',
            },
            tooltip: `
              You've found an old necropolis. It's <i>way</i> too haunted for you and your party, but you could probably send some zombies in to look for more bodies.
              Only the combat gained from zombies counts toward this trial.Rewards 1 Zombie per floor completion.Unlocks when this zone is fully surveyed.
              `,
            segments: [
              'Persuade the Dead',
              'Train the Dead',
              'Avoid the Spikes',
              'Transform the Dead',
            ],
            stories: [
              `Floor 1 completed: Dungeon-crawling at a distance is a hassle, but watching one of your zombies get turned into undead shish-kebab very quickly convinces you this place isn't worth going in yourself. Besides, the corpse-filled alcoves just before the way down to the next floor let you refill (and then some) your army anyway.`,
              `Floor 10 completed: You can't help but feel that whoever made this place was looking into the future, what with how you always end up with exactly one more zombie than you started the floor with; whether you lose all but one or none at all, you've not even once got more than 1 additional zombie.`,
              `Floor 25 completed: With a sigh, you give your zombies a nod as they smash into the glowing sphere that's been ensuring this place is crawling with specters of every stripe for so very long. While having a larger workforce is nice and all, this still feels like a waste of time.`,
            ],
          },
        },
        journeys: {
          journeyForth: {
            name: `Journey Forth`,
            tooltip: `
              Follow the trail out of town. Anywhere has to be better than here, you think as you look at the looming Jungle ahead.
              Requires (and costs) supplies.Unlocked with 100% town meandered.
              `,
            stories: [
              `Journeyed out of town: You adjust the straps of your backpack as you head out. While the town felt like it was dying by itself, the air around you starts to feel <i>hungry</i> as you make your way into the dense jungle rising before you.`,
            ],
          },
        },
      },
      townZ6: {
        options: {
          fightJungleMonsters: {
            name: `Fight Jungle`,
            states: {
              isDone: 'Creatures Defeated',
            },
            tooltip: `
            Even the basic creatures here are terrifying.
            Gives (self combat) * (1 + main stat / 100) * sqrt(1 + times completed / 1000) * (original mana cost / actual mana cost) progress points per mana.Gives 1 blood per segment completed.
            `,
            stories: [
              `Jungle creature fought: Finding something to fight is the easy part, as you quickly find yourself face to face with a <i>very</i> hungry giant frog! You ready your weapon while preparing for a tough fight; far too little space between the dense trees to fight alongside anyone else.`,
              `Sloth slain: You wince as you quickly patch up your wounds and take careful note for next time: while the giant sloth you just killed didn't look like much of a problem at first, those claws can do a lot of damage if you ignore them.`,
              `Python slain: That was one hell of a strange fight. Sure, finding a snake large enough to swallow a pig whole is par for the course here, but seeing it nudge a rusted-out birdcage with some bones inside around the entire time you were fighting made things a lot weirder.`,
              `Okapi slain: This creature didn't feel like it belonged here. It was constantly stumbling while you fought it, and while it charged you like its life depended on it, the blunt teeth in its mouth suggest it couldn't eat you even if it wanted to. What was going on in this place?!`,
              `Jaguar slain: Leaning against a tree, you keep a wary eye on the body of the large feline you just barely managed to hit with a heavy branch. While this creature seems like the kind of thing you'd expect around here, the way it stalked you makes you feel like you just got lucky in killing it.`,
              `Anaconda slain: You swear as you push the long, muscular body of the now-dead snake off of you. That last snake wasn't nearly as much of a problem as this one, but at least as weird with how you couldn't shake the knowledge that her name is Anna.`,
              `Tiger slain: The fight is over, but you're still shaking with the adrenaline from being jumped. This time, you're certain that the beast was stalking you for a while and specifically struck while you were distracted by a noise further into the jungle.`,
              `Crocodile slain: You shake your head while looking at the tough-skinned animal that tried to jump you while crossing a river. Note to self: Nowhere is safe, assume the trees themselves are just animals waiting to swallow you whole.`,
              `Gorilla slain: This fight felt different. All the other beasts you've killed so far looked like they wanted you dead to eat, but this muscular ape felt a lot more malicious. As if it had taken grievous offense to you making eye contact...`,
              `Elephant slain: Something is extremely wrong. How did that massive beast even get into this jungle, let alone survive long enough to try and attack you too?! Whatever the case, that last kill must have set off some alarm bells for the other critters, because you hear trees getting uprooted and rocks smashed a little further in. Maybe it's time to leave, before you get stampeded over yourself.`,
            ],
          },

          exploreJungle: {
            name: `Explore Jungle`,
            states: {
              isDone: 'Explored',
            },
            tooltip: `
              It would be easier to explore here if there wasn't something waiting to jump out at you behind every tree.
              Gives progress based on Fight Jungle multiplier.Gives 1 herb.
            `,
            stories: [
              `1% Explored: Even after taking out the worst of the beasts making this Jungle their home, you constantly have to watch out for even the smallest movement in the corner of your eye as you explore.`,
              `10% Explored: If the vibe of the jungle was "hungry" as you approached it, being among the densely growing trees feels like you've been swallowed by some impossibly massive monster that is taking its sweet time digesting you.`,
              `20% Explored: You've heard far-off cries for help off and on again while you're mapping out this place, but now you know their source. Coming around a tree, you find yourself face-to-face with a haggard-looking man, who bolts between the trees the moment his eyes lock with yours. Maybe you can help?`,
              `40% Explored: There is an odd irony to having a meal inside a jungle that's trying its level best to eat you, so you've gotten quite fond of organizing a small buffet for the people you've rescued. They all look like they can use a bite anyway.`,
              `50% Explored: While there are traces of civilisation and settlement spread all over the Jungle, finding the imposing totem in its small clearing was quite the surprise...`,
              `60% Explored: You have had your suspicions before, but now you're certain: the Jungle is actively trying to keep you from leaving! There was a path leading back to Startington, but barely a minute later the path is overgrown thicker than you can get through! ...good thing you just have to wait for your mana to run out in order to leave.`,
              `80% Explored: With every loop, you learn a little more about how the Jungle tries to keep you trapped, how even the most well-worn paths are drowned in foliage within minutes of your arrival. Getting through this place will be a matter of picking up the pace by a <i>lot</i>!`,
              `100% Explored: It took a lot of luck, but you're sure that you've found a way out! Up ahead, almost exactly directly across from your entry point to the Jungle, you can occasionally make out some muted sounds of a city! Making it there before the Jungle traps you is going to be a whole different matter, though.`,
            ],
          },
          rescueSurvivors: {
            name: `Rescue Survivor`,
            states: {
              isDone: 'Saved',
              isPart: 'Survivor',
            },
            tooltip: `
              There are people lost wandering the jungle. If you can find them, you can patch them up and bring them back to camp.Gives (magic skill) * (restoration skill / 100) * (1 + main stat / 100) * sqrt(1 + times completed / 100) * (original mana cost / actual mana cost) * (Jungle Explored %) progress points per mana.Rescued survivors give 4 reputation.Unlocked at 20% Jungle explored.
            `,
            segments: [
              'Find',
              'Help',
              'Assure',
            ],
            stories: [
              `Survivor rescued: You're not sure what the harder part of this operation was; finding the man, or convincing him that you were not going to eat him. Still, helping him recover a little from the many wounds he suffered makes you feel a little better.`,
              `6 Survivors rescued in one loop: The last person you managed to coax into joining you was a little girl. While her clothes were mostly intact and she did confirm she hadn't been in the Jungle for long, the mean gash on her arm would almost definitely have gotten infected if you hadn't helped.`,
              `20 Survivors rescued in one loop: By now, the sheer number of people following you as their rescuer is getting in the way of finding further survivors. You can still occasionally catch a glimpse of someone bolting away from you, but most of the time they don't let you get a word in edgewise out of fear you're going to eat them.`,
            ],
          },
          prepareBuffet: {
            name: `Prepare Buffet`,
            tooltip: `
            It's not quite the same as making potions, but you can use your alchemy skills to prepare food for the gathered group.Costs 10 herbs and 1 blood.Gives Gluttony exp equal to (Rescued Survivors * 5).Unlocked at 20% Jungle explored
            `,
            stories: [
              `Prepared a Buffet: Sure, the meat is a little on the thin side and the herbs quite bitter, but even a simple meal like that feels better than most you've had in your life. Somehow, you feel more hungry after you finish eating.`,
              `Held a Buffet with a Rescued Survivor: The man looks at the meal with poorly disguised suspicion. When you ask, he explains that it feels dangerous to eat, no matter how many times you promise the food is not poisonous or anything. Honestly, you thought he'd be wolfing it down the moment you gave him a plate. Oh well, more for you.`,
              `Held a Buffet with 6 Rescued Survivors: There still is a lot of wariness on everyone's faces, but watching the little girl dig into the meal like it's a feast for royalty motivates some more people to have a bite. Afterward, they all ask for seconds too!`,
              `10 Gluttony: The food you manage to scrounge together is less and less filling, and you find yourself spending more and more time hunting for the sake of having something to eat. Maybe it's time to try and get something to eat from somewhere else?`,
              `100 Gluttony: Even as you stuff your face with every last morsel you can get your hands on, you feel emptier and emptier every time. You are so hungry, you could <i>genuinely</i> eat a horse.`,
            ],
          },
          totem: {
            name: `Totem`,
            tooltip: `
            Deep within the jungle, you find a totem pulsing with energy. Just standing near it, you feel more capable. If you drink a looping potion here, perhaps some of that energy will stay with you on future loops.Doubles the initial stat gain bonus of Imbue Body on first completion.Requires a looping potion.Unlocked at 50% Jungle Explored.Grants 100 Wunderkind exp.
            `,
            stories: [
              `Drank a looping potion: After saying a quick prayer that this won't outright undo all your progress to escape the loops, you lean your back against the totem and down the potion in one swig. Almost immediately, you feel <i>something</i> inside shift, as if the lowest you can be has gotten a lot higher!`,
              `5 Wunderkind: While you don't get the dramatic increase that first swig earned you anymore, you can feel your mind getting a little clearer with every loop you fulfill the ritual and your understanding of the deeper mechanics of your abilities comes that much smoother too!`,
              `60 Wunderkind: You don't recall what loop you started doing so, but you've fallen into the habit of kneeling down and patting the head at the bottom of the totem after each looping potion you've drank. Stranger still, you're certain the face is smiling a lot brighter than the first time you found the totem...`,
              `360 Wunderkind: The totem is a familiar face to you now, and you even make a point of passing by it on the loops where you don't brew a looping potion. Whatever the reason it was placed there, you are happy it's there and you hope that it might bring some small relief to the many other people stuck in the Jungle.`,
            ],
          },
        },
        journeys: {
          escape: {
            name: `Escape`,
            tooltip: `
            The Jungle seems to grow ever larger with every passing moment. You'll have to get out of here fast.Unlocked at 100% Jungle explored.Must be started before 60 seconds have passed this loop (hover Mana Used for effective time.)
            `,
            stories: [
              `Escaped successfully: Your throat burns and sweat runs down the sides of your face as you sprint full-tilt through the Jungle, trying to reach the narrow gap between the trees before the thick vines chasing behind you can choke off the exit. Fearing you might not make it, you desperately <i>hurl</i> yourself forward... And land face-first on a dirt road as the treeline breaks abruptly. Staggering to your feet, you let out a sigh of relief before turning your attention to the city that fills Merchanton's place in this dark realm: Commerceville.`,
            ],
          },
          openPortal: {
            name: `Open Portal`,
            tooltip: `
              The Explorers' guild tells you of a secret grove within the Jungle, where the barrier between realms is weakest. With enough restoration skill, you might be able to open a rift back and leave the shadow realm. However, it seems quite a bit of time passes in the portal, and some merchants have closed up shop.
              Unlocked with 75% of the world surveyed.
              Travels to Forest Path.Buy Mana actions can not be used for the rest of the current loop.Requires 1000 Restoration.
            `,
            stories: [
              `Portal opened: Despite the Veil being thin in this place, you still have to push quite a bit to get through. Whether it is due to the Gods trying to keep the Shadow Realm from invading or the simple physics of inter-realm travel, you can feel the hunger from the Jungle grow quiet as you approach the rippling portal you just created and step through to the forest on the other side. Looking at the sky, you're surprised to find that night is falling now!`,
            ],
          },
        },
      },
      townZ7: {
        options: {
          excursion: {
            name: `Excursion`,
            states: {
              isDone: 'Seen',
            },
            tooltip: `
            Pay a local street urchin to show you around town. As a tourist, it feels like you're getting ripped off.Cost is reduced by 80% with local guild membership.2× progress with glasses.Currently costs {{cost}} gold.
            `,
            stories: [
              `1% Seen: Finding someone to show you around town was looking to be a non-starter, until you flashed one of the (many) street urchins a few coins. Turns out just about everyone here will work for the right price.`,
              `10% Seen: One of the street urchins leads you past a slightly run-down but highly active building, with multiple people entering and leaving in the brief time you watch the front door. The Urchin (after a small fee) explains this is the Explorers' Guild, one of the few places here that values something besides money.`,
              `25% Seen: This loop, you decided to hire the urchin that <i>almost</i> managed to snatch some money from your pockets. By way of showing thanks, she eventually leads you to an out-of-sight door and tells you to let "The Boss" know that she sent you. When you ask her why she's showing you this, she just smiles and says you're the first one to even catch her. The Thieves' guild could use a sharp pair of eyes like that.`,
              `40% Seen: You've walked past the big building overseeing the marketplace almost every time you've been here. The urchins say that it's a place where rich people magically get richer, so maybe it's time you made a few (more) investments of your own.`,
              `60% Seen: As you get more familiar with the place, you start to notice how there always seems to be some kind of speech happening. You can't pinpoint where exactly the sound is coming from or even what it's about, and the street urchins just shrug when you ask.`,
              `80% Seen: You noticed a richly-dressed man pass by while your street urchin guide is tugging you along. The man must have a hole in one of his pockets, because your guide suddenly freezes before quickly darting around you to snatch up a coin before it can bounce a second time against the street's cobblestones. The man doesn't even seem to notice.`,
              `100% Seen: One story that comes up every now and then while you talk to your guides is how money is everything in this town, down to the town itself being (symbolically) for sale to anyone who can afford it. You've been keeping an eye out for any way to leave, maybe it's time to plan how you'll afford the steep cost...`,
              `Went on an excursion as a local guild member: You've been around town enough times to know where to find some street urchins that might be swayed to show you around, but this time the kid holds a hand up as you're about to pay him. "Guildmates don't steal from each other," he says in the most serious tone he can muster, while flashing his own guild-mark. He still accepts a few coins, but not as many as what he asked last loop.`,
            ],
          },
          explorersGuild: {
            name: `Explorers' Guild`,
            tooltip: `
              Ever feel like there's more stuff out there that you're missing? The Explorer's guild knows it! Learn to find more of everything, and with enough standing you'll even be taught new ways to move about the world.
              You can only join 1 guild at a time (including those in Merchanton).
              On first completion, unlocks the Buy Map action in Beginnersville and the Survey action in all zones.
              If you bring completed maps, you'll gain exp as if you surveyed two random incomplete zones (per map).
              Also gives you 30 maps if you have 0 maps.
              Unlocks new shortcuts for every 25% world survey progress
              Current world survey progress: <div id='totalSurveyProgress'></div>%.
              Unlocked at 10% City seen.
            `,
            stories: [
              `Joined the Explorers' Guild: While the building looks like it missed a few rounds of maintenance, the people inside are almost too eager to take you on once you tell them you passed through the Jungle. Apparently, adventurers capable of surviving harsh environments like that are always in short supply! Once your introduction is done and you've had your crash-course intro to cartography, the guildmaster all but kicks you out of the building while telling you to "go explore already!"`,
              `Turned in a complete map: The guildmaster, in his typical brusque manner, nearly tears the map as he snatches it from your hand and starts inspecting it. After a while though, he gives you a nod before rummaging through the mountain of paper on his desk, giving you a partial map of another place you've been. You commit as much of the details to memory before heading out again.`,
              `Fully surveyed a zone: Rather than snatching the map out of your hand, the guildmaster lets you hand it to him before he calmly, carefully studies it. "...Yeah, I think you're done with that spot. Keep up the good work," he mutters before once more tossing a few half-done maps your way as your "reward."`,
              `Fully surveyed 4 zones: While the guildmaster is a man of few words, the other guild members are a fair bit more talkative. You spend a little time just chatting with a few of them, exchanging hidden things you've seen and secrets they've found. You even learn a few secret tricks to make your travels easier and faster!`,
              `Fully surveyed all zones: You're pretty sure that you've seen the entire world in great detail by now, and that none of the places you know have any secrets left to find. As you walk through the Guild's entrance, the guildmaster makes eye contact with you before nodding once. As you give him your maps, he speaks up. "...Been a real pleasure having you. Hope you find what you're looking for, and let me know if you need the kind of thing that's not usually on the map." As you leave, you have a faint feeling that the guildmaster knows more about your situation than he lets on, but perhaps it's best to let sleeping dogs lie.`,
            ],
          },
          thievesGuild: {
            name: `Thieves Guild`,
            states: {
              isDone: 'Pursestrings Cut',
            },
            tooltip: `
              Learn to transfer wealth to those most in need. You, mostly.Take their tests and earn a rank!Requires negative reputation.
              You can only join 1 guild at a time (including those in Merchanton), and only try once.
              Gives 10 gold per segment completed.
              Gives (practical magic skill + thievery skill) * (1 + main stat / 100) * sqrt(1 + times completed / 1000) * (original mana cost / actual mana cost) progress points per mana.
              Unlocked at 25% City seen.Gives Thievery exp upon segment completion, rather than upon action completion.
            `,
            stories: [
              `Thieves' guild test taken: You make your way into the hidden guild your young "guide" brought you to last time and introduce yourself as a new recruit. The old yet intimidatingly muscular man in charge just grunts and demands you show your skills.`,
              `Thief rank E reached: While your experiences with the other guilds prepared you for this, it's clear you once again are starting from the bottom. "Stealing candy from a baby" isn't nearly as easy as you were led to believe previously.`,
              `Thief rank D reached: The man in charge still doesn't seem to care much about you, but at least he's stopped pointing out your errors for longer than it took you to complete the test this time.`,
              `Thief rank C reached: The boss gives you an approving nod after you manage to sneak a key from a hired guard's pocket. The guard in question grumbles something about how that would have cost her her job if she'd been employed anywhere else.`,
              `Thief rank B reached: You've tried your tests often enough that you're getting a good feel of how the guild works now, and while you still slip up occasionally and call a thief by their name before they've introduced themselves, the boss now trusts you enough to send you on bigger hits.`,
              `Thief rank A reached: You got overconfident this time. Knowing the guild as well as you do, you snuck in unnoticed, intending to dramatically introduce yourself. While the Boss was impressed, he still sent you out on a mission with a bunch of bumbling newcomers, and you only barely managed to keep them from blowing up the entire heist.`,
              `Thief rank S reached: All your thieving over the last bunch of loops definitely taught you the value of subtlety and restraint. While you no longer try to impress with big stunts, the Boss was <i>very</i> impressed that you managed to steal the hat off his head, unnoticed.`,
              `Thief rank U reached: You've stolen the spotlight. Right in the middle of a major performance, and nobody noticed until the big solo ten minutes after you escaped the theatre. Along with <i>every</i> last wallet from the audience. Not bad for a solo run.`,
              `Thief rank Godlike reached: Technically speaking, you own the guild. The Boss still runs the day-to-day details, but ever since you managed to steal the entire contents of his office <i>while he was in it,</i> he's admitted you're the better thief between the two of you. Honestly, not having to worry about the minutae of guild leadership suits you well enough.`,
            ],
          },
          pickPockets: {
            name: `Pick Pockets`,
            states: {
              isDone: 'Pockets Picked',
            },
            tooltip: `
              Help travelers by making their burdens a bit lighter.
              Requires thieves guild.
              Can be completed <div id='actionAllowedPockets'>x</div> times based on excursion progress and spatiomancy.
              Pockets picked progress is multiplied by Thieves guild multiplier.
              Rewards {{gold}} gold, multiplied by your Thieves guild multiplier.
            `,
            stories: [
              `1% of pockets picked: Picking your first target is kind of tricky, honestly. Eventually, you settle on a practically passed-out drunk. He takes a swing at you when he notices your hand in his pocket, but dodging it isn't difficult.`,
              `10% of pockets picked: Bit by bit, you're getting the hang of picking your targets. This time, you try to pick a rich-looking guy. He doesn't notice, but his bodyguards do and you barely manage to shake them off in the maze of alleyways.`,
              `20% of pockets picked: It's crystal clear to you that picking pockets is the most common kind of criminal activity in this area. More than once, you have to spend more attention making sure you don't get your own pockets picked while finding a mark.`,
              `40% of pockets picked: You're finally feeling like you got the hang of this. Looting the pockets of drunks rarely gets you noticed anymore, and your fellow guild members are starting to teach you the tricks of the trade now.`,
              `60% of pockets picked: To properly pick a rich guy's pocket, you really have to pay more attention to the bodyguards than the guy himself. With how oblivious some of the walking wealth in this town is, you figure a good bodyguard is worth their weight in gold. You idly wonder if you've stolen a bodyguard's weight in gold so far.`,
              `80% of pockets picked: More out of boredom than anything else, you try your hand at picking the pockets of a rich guy's bodyguards. Unsurprisingly, they notice, and you only barely make it out without having your fingers snapped, but more importantly: you've learned that indeed, the bodyguards are well-paid.`,
              `100% of pockets picked: After cashing in your latest haul of odds and ends people keep in their pockets, you decide to treat yourself and head to a tavern. While you enjoy the fruits of your labours, you overhear someone brag how their caravan has just delivered a load of expensive fabrics to their warehouse. Maybe it's time to diversify your thieving expertise...`,
            ],
          },
          robWarehouse: {
            name: `Rob Warehouse`,
            states: {
              isDone: 'Warehouses Robbed',
            },
            tooltip: `
              Diversify your skills into inventory management.
              Requires thieves guild.
              Unlocked at 100% pockets picked.
              Can be completed <div id='actionAllowedWarehouses'>x</div> times based on excursion progress and spatiomancy.
              Warehouses robbed progress is multiplied by Thieves guild multiplier.
              Rewards {{gold}} gold, multiplied by your Thieves guild multiplier.
            `,
            stories: [
              `1% of warehouses robbed: Your first attempt was an unmitigated disaster. Unlocking the door took ages, you had no way to grab most of the loot, and the warehouse guards nearly managed to grab you. All that, and you only managed to grab a few small knickknacks.`,
              `10% of warehouses robbed: This time, you spend a while practicing your lockpicking before you try again. The guard still spots you though, and you have to leave most of the loot in-place, but at least you got a better haul this time.`,
              `20% of warehouses robbed: Since the guard has been a wrench in your plans every time, you make sure to knock him out on this trip. His patrol route is the same every loop anyway, so sneaking up from behind isn't much of a problem.`,
              `40% of warehouses robbed: You convinced a few of your guildmates to help you out this time. While you're still doing most of the work yourself, having a few extra hands to carry the loot out means that you practically clear the warehouse's various valuables before the guard gets back up!`,
              `60% of warehouses robbed: The Boss has gotten wind of your ability to coordinate an effective warehouse robbery, and insists that you get involved in a larger heist: one of the trading companies is going to hold an art auction soon, and the Boss wants a few pieces "cheaply." The warehouse is a lot better protected, though...`,
              `80% of warehouses robbed: Scoping out the auction's warehouse confirms your suspicions. Dozens of guards, entrances that are under magical protection, even the lots themselves are bolted to the floor in several cases! Still, you plot and plan until finally, you've got your game plan <i>and</i> a crew that can pull it off!`,
              `100% of warehouses robbed: The heist was almost as much of a mess as your very first, but with one key difference: you made off with almost every last lot in the auction's catalog! One of your crew members expresses his concerns that the trading company will be out for blood, but the Boss insists that it's all insured so they'll get their money. ...Insurance, huh? Wonder if you could get in on that racket as well...`,
            ],
          },
          insuranceFraud: {
            name: `Insurance Fraud`,
            states: {
              isDone: 'Fraud Committed',
            },
            tooltip: `
            Insurance is a scam, anyway. You're basically Robin Hood.
            Requires thieves guild.
            Unlocked at 100% warehouses robbed.
            Can be completed <div id='actionAllowedInsurance'>x</div> times based on excursion progress and spatiomancy.
            Fraud committed progress is multiplied by Thieves guild multiplier.
            Rewards {{gold}} gold, multiplied by your Thieves guild multiplier.`,
            stories: [
              `1% of fraud committed: As per usual, your first attempts run into a few snags. More specifically, the insurance company is immediately suspicious that someone who signed up with them three minutes ago immediately has damages to declare, and only your silver tongue keeps them off your back until the end of the loop.`,
              `10% of fraud committed: Slowly but surely, you're getting a little smarter. This time around, your insurance agent gives you a suspicious glare before handing over the agreed-upon sum after you put on a sob story of how you were beaten up right in front of the office and had your watch stolen! If anything, it's a little scary how eager your fellow guild members are to knock your teeth out.`,
              `20% of fraud committed: You had a realization during the planning phase of this loop's fraud: If the insurance company gets suspicious due to insured items suffering damage within a day, then the "obvious" solution is to do a little impersonation and cut with both sides of the knife. Your guildmates snatch the priceless artifacts, then you convince the insurers that yes, <i>you</i> are in fact the owner and should be compensated. Now just to get better at disguising yourself.`,
              `40% of fraud committed: While stealing entire buildings is not quite an option, there is a lot of money to be made by 'informing' rivaling trading companies that the other group is working with the thieves that fleeced them last week, and that they won't get their stuff back because the Guard's been bought. Sure, none of them are exactly <i>happy</i> with it, but they're all to eager to pay you for the information once you sweeten the deal with the patrol schedules, and snatching up some insurance claims once the rival warehouse has burned down is a nice bonus too.`,
              `60% of fraud committed: While drinking tea with the elderly man, you idly wonder just how much your moral compass has drifted over the last couple of loops. As a courier, you had a strict moral code regarding not taking what isn't yours, but here you are. The man in question has been put in a hairy situation by his insurance company, and is now discussing how to get revenge. You don't really care about the particulars, but the last few loops have been very profitable thanks to the old man's involvement.`,
              `75% of fraud committed: You were in the process of concocting a scheme where you take out a life insurance on someone and then have them killed, when one of your guildmates bluntly tells you that she won't be helping you with something so "suicidally stupid." Pressing her for a bit, you learn that there is a certain "secret" guild in town that handles murder and assassination, who are none to eager to let some upstart start killing without paying their guild dues...`,
              `100% of fraud committed: The biggest problems in defrauding an insurance company are always related to making sure you don't get caught in a lie, so you've taken to visiting their offices off-hours and making some adjustments to some of the documentation related to your cases. This time however, you spot a folder you haven't seen before in the insurance company's director's office. It's a thin, black folder simply labeled <i>in case of problems</i>. Inside, you find contact information for the Assassin's guild. You try not to think why an insurance company would need such a thing as you sneak away.`,
            ],
          },
          guildAssassin: {
            name: `Assassins Guild`,
            tooltip: `
              Join the Assassins guild and learn of their targets across the world. Bring back their hearts to learn more secrets from the guild.
              You can only join 1 guild at a time (including those in Merchanton).
              On first completion, unlocks an Assassinate action in each of the first 8 zones.
              Gives Assassin exp equal to 100 * hearts^2.
              Unlocked at 100% Insurance Fraud.
            `,
            stories: [
              `Joined the Assassin's guild: You grit your teeth as you sneak around in the sewage tunnel that connects to the city harbour. Turning a corner, you get to see the entrance to the Guild for less than a second before someone's got a knife pressed to your throat and demands you explain how you found this place. Joining the Assassin's guild definitely is going to be your largest achievement in smooth-talking to date, but by the end of it all you walk out with a list of targets in hand, several lessons in how to keep a heart beating outside its body and a still-hurting brand under your armpit.`,
              `Delivered a heart: The guard, unable to remember you between loops, is quite suspicious that you made your way back here, but once you show the beating heart in your hands is a lot more eager to let you in. You're rewarded well for carrying out a mission they didn't even know they gave you, and while getting branded <i>again</i> still hurts to the high heavens, you're definitely getting into the swing of things.`,
              `Completed assassinations in 4 zones: While you make your way to the guild's hideout, you muse on how you've managed to hunt down half the targets on the original list. Of course, with each kill in a loop, it gets harder to sneak up on the other targets. Looks like they have more of a connection than they seemed at first glance...`,
              `Delivered four hearts in one loop: You remember to give the guard the keyword this time around, and while you still get your guild-brand, at least the head assassin is impressed both by your uncanny ability to stay out of their notice <i>and</i> deal with some of their more far-flung targets.`,
              `Completed assassinations in all zones: Having landed a hit on every target on your list, you briefly reflect on how little guilt you feel for the plentiful murders you have committed over the course of your "career" with the assassin's guild. In any case, you carefully and thoroughly plot how you're going to pull off the final challenge this guild has to offer you: killing all eight targets in a single loop, without getting caught.`,
              `Delivered eight hearts in one loop: The head assassin takes a few moments to triple-check that the hearts are, in fact, the targets' hearts and not from some unfortunate schmucks left dead in an alleyway. Eventually, they get up and gesture to the side. Barely a word is exchanged the entire time, but shortly after you walk out of the hideout with a hefty sum of money and a <i>very</i> fancy wrist-mounted, automatically retracting and extending blade. Real shame you had to leave your ring finger behind though.`,
            ],
          },
          invest: {
            name: `Invest`,
            tooltip: `
            Invest into the perpetual bank. Invested gold remains between loops.
            Total gold invested: <div id='goldInvested'></div> (max 999999999999)
            `,
            stories: [
              `Made an investment: You are welcomed by a bank teller who doesn't look a day over thirty, and he runs you through the rules like he's done it a thousand times before. A quick ritual seals the contract and lets you conduct your business. As you finish and turn to leave, the teller grabs your wrist. He warns you that no matter who you are, debts must be repaid. You make a mental note to never borrow money from this place.`,
              `Made a second investment: When you make your way into the gaudy building, ready to open a new account (again,) the teller gives you a strange look before informing you that you already have an account. Seems like the name <i>perpetual</i> bank isn't just for show.`,
              `Invested 1,000,000 gold: You notice the sigils this time, glowing ever so faintly beneath the teller's skin. They pulse in time with his heartbeat and radiate outwards from his chest, branching all over his body. As you approach to deposit more money, their glow increases slightly as his eyes track towards you and his mouth opens to begin reciting the usual lines every customer hears. As you leave, they fade back into imperceptibility.`,
              `Invested 1,000,000,000 gold: A sleek, dangerous figure walks in, fresh blood dripping from his coat. He tosses a bag of told onto the counter with a smug grin, wordlessly demanding a deposit. The teller hesitates, but his sigils illuminate in a burst of light blue and a moment later he's properly handling the transaction. If there's any semblance of law in this city, the bank's stance seems to be an indifferent neutrality to it all.`,
              `Invested 999,999,999,999 gold: No matter the clientele, no matter how strange the transaction, the teller processes it all with a rote grace born from countless repetitions. At times he almost feels like an automaton in human skin, all thoughts drowned out by the ceaseless motion. Tentatively, you ask how long he's worked here. After a few seconds of silence, he wordlessly looks you in the eyes and you see the weight of eons staring back at you.`,
            ],
          },
          collectInterest: {
            name: `Collect Interest`,
            tooltip: `
              Collect your interest from the perpetual bank.
              Gives 0.1% of your total gold invested.
              Can only be collected once per loop.
              Current interest: <div id='bankInterest'></div>
            `,
            stories: [
              `Interest collected: The bank of Commerceville tracks its money not on ink and paper but on the very souls of its clientele. On the plus side, it's extremely convenient to collect interest on the money you've invested, as you always have official documentation with you, but you admit to yourself that it's still rather unsettling.`,
              `1,000 gold collected in one loop: You may have found a loophole in their business model. As it turns out, it doesn't matter if you bring the same coins to the bank loop after loop: your bank balance still goes up. You're worried that bank security might cotton on and kick you out, but the teller doesn't seem to have any problem with handing you the coins.`,
              `1,000,000 gold collected in one loop: You think you understand what's happening now. The rules of the contract bind the bank as well, no matter how ill-gotten your gains. The teller simply has no choice but to hand you the appropriate amount of gold. Of course, it's not like he has reason to care: it's the bank's money, not his.`,
              `999,999,999 gold collected in one loop: Anyone with half a brain could figure out that you cheated somehow, but it doesn't matter. The bank's soul-contracts are infallible, so nobody's under compulsion to root out and deal with cheaters. It takes some time to retrieve the large fortune you're entitled to, but nobody stops you as you leave. You think you even see a vindictive smile on the teller's face.`,
            ],
          },
          seminar: {
            name: `Seminar`,
            tooltip: `
            You can buy entrance to a motivational seminar - learn to be your best self and make people love you. You're pretty sure turning back time is the only way you can get off these people's mailing list.Costs {{cost}} gold.Unlocked at 100% City surveyed.`,
            stories: [
              `Attended seminar: You reflect on all you've heard at the seminar. A lot of it just came across to you as useless grandstanding by the organiser, sure, but something about <i>how</i> he spoke kept you from losing focus. A useful skill to train, perhaps.`,
              `Attended with 10 leadership: Even now that you've seen him a few times, you have to admit that the man in charge at the seminar is damn good at what he does. Little by little, you're making those skills your own; you're sure you'll find a use for them once you're out of the loops.`,
              `Attended with 100 leadership: By now, the seminar leader looks up as you enter the room, but the moment of enchantment doesn't last. Still, you smirk to yourself as you notice the little tells of frustration as he realizes he's not the absolute center of attention anymore.`,
              `Attended with 1000 leadership: It's automatic now. You walk into the room and take off your coat, blindly tossing it to the side where someone is already waiting to catch it despite not even knowing your name (this loop) five seconds ago. You amuse yourself taking over the seminar, confident that even the leader cannot deny the air of <i>Leadership</i> you wear like a cloak.`,
            ],
          },
          purchaseKey: {
            name: `Purchase Key`,
            tooltip: `
            With enough money, you can buy the town itself. Then they'll <i>have</i> to let you out.Costs {{cost}} gold.`,
            stories: [
              `Key bought: You smile as you shake the former mayor's hand, your free hand holding on to the ornate, clearly ceremonial key you just bought. While all the pomp and circumstance doesn't change your mind on leaving this place as soon as you can, you do enjoy the looks ranging from minor annoyance at having the key to town snatched out from under their nose to admiration that a newcomer could rise the ranks so very quickly. You're sure the novelty will wear off in a loop or five.`,
            ],
          },
          secretTrial: {
            name: `Trial of Vanity`,
            states: {
              isDone: 'Total floors',
              isPart: 'Floor',
              isComplete: 'Did you cheat?',
            },
            tooltip: `
            There is a crowd watching as you and your team step up to the trial, and you're pretty sure some bets are made against you.
            Progress is based on Team Combat.
            Rewards +1 Bragging Rights.
            `,
            stories: [
              `Faced the Trial of Vanity: For a long time, you've heard of a "special trial" for the most "stubborn and determined souls," and now you've finally found it: the Trial of Vanity. You can't see the faces of the crowd as you and your team head out to face the gruelling challenge head on!`,
              `Defeated the Entity: You pant for breath as the unspeakable, incomprehensible <i>thing</i> finally stops moving in a slouched-over heap at your feet, all while the crowd goes absolutely <i>wild</i> over your victory. You're about to start your obligatory "I know I'm awesome" speech when you see the Hydra you fought earlier stand up, the wounds you inflicted closing on their own as it roars at you in defiance. ...Oh well, did it before, can do it again.`,
              `Defeated the Entity 10 times in one loop: Your mounting annoyance at having that big <i>jerk<\i> of an Ice Titan just stand up from the puddle you melted it into is actively fighting the frustration of having those Behemoths repeatedly ruin your clothes with their blood.`,
              `Defeated the Entity 100 times in one loop: You scream a wordless howl of rage at that smug Lich King <i>yet again</i> grabbing his own head and jamming it back on his neck while the Entity slowly but surely reconstitutes behind you. It wouldn't be such an annoyance if the bastards didn't insist on getting stronger with every kill, but you can't stop now!`,
              `Defeated the Entity 500 times in one loop: The arena has become a blur before your eyes, only your teammates standing out clearly against the increasingly indistinct crowd. Still, the cheers and jeers manage to fill your ears over the deafening roar of the Red Dragonborn, urging you to keep going.`,
              `Defeated the Entity 1000 times in one loop: Is it the fact that the crowd has turned into a psychedelic blur of colours and swirls? The realization that you've been cutting down outer gods for hours now? Or is the fatigue finally pushing through whatever enchantment has been messing with your head this entire time? Whatever the case, when the Entity is once again laying at your feet, you ready your weapon for the final blow... And then just turn your back and head for the exit. A trail of Vanity, you reflect as you tell your teammates to head out, can only end when you're ready to let go of it. Not like you got anything for all the trouble, anyway.`,
            ],
            segments: [
              'Fight Hydra',
              'Fight Cthulhu',
              'Fight Ice Titan',
              'Fight Godzilla',
              'Fight Red Dragonborn',
              'Fight Star Leviathans',
              'Fight Bleeding Behemoths',
              'Fight Lich King',
              'Fight The Entity',
            ],
          },
        },
        journeys: {
          leaveCity: {
            name: `Leave City`,
            tooltip: `
            These people are wolves, it's time to get out of here.Requires the Key to the City.
            `,
            stories: [
              `Left the City: While the Key to the City still looks like a gaudy prop, you're surprised to find that it actually works as a key on exactly one door: The tiny back door in the city walls with a lock that looks bigger than the door itself! Whatever the reason to put such imposing security on the single exit (other than the now entirely impermeable jungle) out of the City, you persevere as you head down the track heading towards where you expected to see a mountain. Strangely enough, you can't see any mountain peaks on the horizon...`,
            ],
          },
        },
      },
      townZ8: {
        options: {
          imbueSoul: {
            name: `Imbue Soul`,
            states: {
              isComplete: 'Completed',
            },
            tooltip: `
              Resets all talent levels, soulstones, imbue mind and imbue body. Other skills and buffs are unchanged.
              Requires both 500 Imbue Mind and 500 Imbue Body.
              Increases the exp multiplier of training actions by 100% and raises all action speeds by 50% per level.
            `,
            stories: [
              `Attempted soul infusion: As you explore the valley-that-should-be-a-mountain, you come across an improvised-looking altar. The energy surrounding it reminds you of the altar on Mount Olympus where you awaited the judgement of the gods, but twisted like the dark energies you've felt along the Forest Path...`,
              `Completed soul infusion: You make an offer, and almost immediately regret it as your mind and body feel like they are being torn apart by countless unseen claws, all while every last shard of every soulstone you carried turns to dust around you. When the pain subsides though, you feel like something shifted deep inside your core. Maybe recovering your lost power will be a little smoother this time.`,
              `Completed 7 soul infusions: You pant for breath as you make yet another immense sacrifice, your mind reeling from the sheer intensity of it all. Putting your hand on the altar though, you no longer feel the pull from within trying to claim more. Maybe you've fed... whatever calls the altar its own enough?`,
              `7 soul infusion, 500 mind infusion, 500 body infusion: You pass by the altar and smile as the energy surrounding it parts before you, leaving the altar itself to be but stone and gold until you leave. Maybe one day, someone else will understand what this place has to offer, but you have taken all it will give to you.`,
            ],
            segments: {
              'Breathe': 'Breathe',
              'Focus': 'Focus',
              'Relax': 'Relax',
            },
          },

          buildTower: {
            name: `Build Tower`,
            states: {
              isComplete: 'Tower progress',
            },
            tooltip: `
              You've hit rock bottom and now there's nowhere to go but up. If only you had some way to climb back to Valhalla.
              Requires a Temporal Stone.
              Hauling and Building persist through loops. Each stone used to build removes one from the piles in the various ruins you found along your journey.
            `,
            stories: [
              `Brought one stone to the tower: The closer you get to the chunk of rock with the gods' challenge, the more it feels like the massive cube of stone you've been dragging along for who-knows-how-long is actively pushing against your back. By the time you reach the challenge-rock, the stone block suddenly lifts off of your back and floats over to a spot where it settles down smoothly, the glyph on its side pulsating in a steady rhythm. Try as you might, the stone block does not move at all anymore.`,
              `Brought 10 stones to the tower: The pattern established by the first stone block holds so far: Drag the chunk of stone over to the challenge rock, and it hovers over to "its spot" before becoming impossible for you to move again. So far, the stones have spread out pretty far and none of them are touching, but you can at least tell they are all aligned to some kind of grid.`,
              `Brought 100 stones to the tower: For the first time since you started this seemingly endless task does your latest block float over to a spot right next to another block, settling down snugly against its neighbour. Looking closer, there barely is enough space between the stones for a piece of paper to fit through!`,
              `Brought 250 stones to the tower: While you watch yet another stone block float over and settle down, you reflect on how even "watching massive cubes of solid stone float like clouds" is becoming a familiar sight. Perhaps living through as much 'time' as you have has changed you more than you expected.`,
              `Brought 500 stones to the tower: The grid outlined by the edges of the stone blocks is getting more and more densely packed with every trip. By now you've determined that the blocks are not just filling a square of stone, but in fact a blocky outline of a circle! ...The math on that doesn't seem like it should check out as well as it does, but you chalk that up to the general weirdness involved in dragging stones from one world to another.`,
              `Brought 750 stones to the tower: All the easy pickings for more building materials have long since been exhausted, and just finding more blocks to add to the mostly solid floor is becoming a challenge in its own right. As you wipe the sweat from your brow, you take a break and just watch the presumed tower base for a while, admiring how the steady pulsing of the blocks' glyphs makes the lines between them glow.`,
              `Brought 999 stones to the tower: Watching the second-to-last block hover over to the single, two-block-wide opening and slide in without so much as a scratch fills you with a determination you worried you might have lost. The end is in sight, now it's just a matter of bringing it all together! Gods, beware, for you are coming!`,
            ],
          },

          godsTrial: {
            name: `Trial of the Gods`,
            states: {
              isComplete: 'Done',
              isCompleted: '100 Floors Completed',
              isPart: 'Gods Trial',
            },
            tooltip: `
              The gods have filled the 100 floors of the tower you built with monsters to stop you from returning to Valhalla. Rude.
              Progress is based on Team Combat.
              Requires 100% Tower built.
            `,
            segments: [
              'Fight Fire Dragon',
              'Fight Chimera',
              'Fight Sirens',
              'Fight Zombies',
              'Fight Minotaur',
              'Fight Golems',
              'Fight Gnomes',
              'Fight Cyclops',
              'Fight Centaurs',
            ],
            stories: [
              `Beheld the tower: Carrying that last block of stone felt easier than any of the others, whether the combined attraction of the properly placed stones pulled it along or if the end being in sight gave you the motivation you needed. However, you barely get time to cheer as it slides into place and fills the final remaining gap before the blocks start rising up into the air, threads of light connecting them and interlinking until you are looking at a tower made of a hundred floating, glowing platforms. Already you can see the light of Valhalla shining at the very top while a set of blocks forms a staircase up to the first glowing floor. Also, there suddenly is a bunch of monsters between you and said stairs, better get busy and kill them fast!`,
              `Cleared 10 floors in one loop: As you carve out yet another Fire Dragon's heart, you muse whether the gods are testing your "worth" or if they're just trying to avoid the consequences of their little wager this way.`,
              `Cleared 20 floors in one loop: Fun fact about Chimerae: even with as many heads and pointy bits as they have, sliding under them and jabbing into their undersides deals with them quickly.`,
              `Cleared 30 floors in one loop: You almost feel sorry for the sirens. By now, the only thing they can try and tempt you with is the way up, and killing them to get past is a much more reliable way to get that.`,
              `Cleared 40 floors in one loop: The zombies seem out of place to you, their rotting flesh yielding quickly under your attacks. There aren't even enough of them to really slow you down.`,
              `Cleared 50 floors in one loop: Minotaurs are annoying to fight in a place like this. Get too close to the center, they bull-rush you. Get closer to the edge, they slam you out of the tower with a haymaker. Dealing quickly with them keeps things bearable.`,
              `Cleared 60 floors in one loop: The golems just make you feel sad somehow. Their design is a little too angular, a little too flawed to be the work of the gods. You wonder whose craftsmanship you're breaking on the way up.`,
              `Cleared 70 floors in one loop: Panting for breath, you drag yourself past the latest bunch of gnomes. Sure, they don't hit hard, but there are enough of them to tire you out each time.`,
              `Cleared 80 floors in one loop: After the gnomes' nonsense, fighting a cyclops is almost refreshing. Turns out they rely more on their ears than their eyes, so a little magic to play music distracts them immensely.`,
              `Cleared 90 floors in one loop: With the top finally in sight, you pull out yet another one of the Centaurs' arrows from your knee. Fighting an enemy who can run <i>and</i> shoot at the same time is no fun whatsoever.`,
              `Cleared the entire tower: Soaked in more blood than you ever wanted to see in one place and panting for breath in the thin air this high above the valley, you climb the final staircase to the highest floor of the glowing tower. The gods acknowledge you with a single solemn nod, before the first draws her weapons and closes in on you without a word. Showtime.`,
            ],
          },

          challengeGods: {
            name: `Challenge Gods`,
            states: {
              isComplete: 'Gods Defeated',
              isPart: 'Challenge Gods',
            },
            tooltip: `
              This is it. The final showdown. If you can defeat the seven gods, you can finally end all this looping nonsense for good.
              Progress is based on Self Combat.
              Requires all 100 floors of Trial of the gods completed this loop.
            `,
            segments: [
              'Fight Athena',
              'Fight Ares',
              'Fight Demeter',
              'Dodge Poison Darts',
              'Fight Poseidon',
              'Fight Artemis',
              'Fight Apollo',
              'Avoid Lighting Bolt',
              'Fight Zeus',
            ],
            stories: [
              `Challenge Athena: Athena, protector of cities, approaches you with her shield held resolutely and unflinchingly. Your every blow bounces off of her defences and whenever you overcommit, she is quick to punish your aggression with a swift shield-slam to the back of your head. Fighting her demands that you meet her carefully considered defences with your own intellect.`,
              `Defeat Athena with 500k Dexterity talent: As the fight drags on, the rest of the Pantheon watching you and Athena exchange blows, you start to find ways around her imposing defences. A dance-like move here that just barely lets you get a light hit in to her side, a graceful dive over her shield there that buys you exactly enough time for a quick slap there... The fight is no less gruesome, but over time the light hits add up and eventually, Athena shakes her head and steps back, acknowledging her defeat.`,
              `Challenge Ares Befitting a god of War and Courage, Ares announces himself with a wordless war-cry followed by him drawing a sword and shield, charging at you with all the ferocity of an entire army. You're barely left standing after that first charge and have to scramble to meet the next, kept on the back foot while Ares demands you fight him 'properly.'`,
              `Defeat Ares with 500k Strength talent: By the third charge, you've figured out much of what Ares is doing. You brace yourself while he turns for another charge, meeting him head-on and catching his shield with both hands. Ares barely has time to look surprised before you lift him off his feet and, with a scream rivalling his own, slam him down hard on the glowing floor while yanking the shield off of his arm. You prepare to punch him in the face, but he shakes his head and acknowledges his defeat, nudging you off of him with noticeable effort and returning to his seat as the next goddess takes to the field.`,
              `Challenge Demeter: Watching the Goddess of the Harvest pull out a scythe as she approaches was something you more or less expected. Having her use such an impractical weapon with enough skill to nearly take your head off on the first swing is something you really should have seen coming, but sadly didn't.`,
              `Defeat Demeter with 500k Constitution talent: The best way to handle a fight is to end it quickly, but Demeter is not giving you that chance. Her attacks are as relentless as an entire community trying to pull in a large harvest before bad weather can destroy the crops, and soon you're covered in gashes along your arms and back where her scythe slipped past your defences. In a desperate attempt to end this before you bleed out, you rush into one of her swings, gritting your teeth through the pain as the blade digs into your back while you keep the handle pinned with your arm as you slam Demeter in her face with your free hand. The shock is enough to make her lose her grip and back away, but before you can deliver a finishing blow, you hear something whistle through the air...`,
              `Dodged poison darts: Still riding the adrenaline burst of your previous fight, you jump back as a flock of black feathers dig into the glowing floor, the acrid smoke rising from the very tips informing you that you really, <i>really</i> don't want to take more hits from these than necessary.`,
              `Evaded poison darts with 500k Speed talent: At first, you just dodge and weave through the cloud of feathers zipping past you, but the longer it goes on, the more easily you can read the pattern. Still, you don't like the idea of just letting the gods harass you like this, so you change tactics. Your hands dart out to the sides, catching several of the feathers between your fingers (giving you a split second to realize they're really metal knives with feather fletchings,) and throwing them back hard at the clouds from which they're being launched. There is a bit of commotion as a bunch of glowing figures squeal and run, causing Artemis to roll her eyes before elbowing Poseidon to get up.`,
              `Challenge Poseidon: Fighting a guy with a trident is well within your abilities. Fighting one while getting shoved around by waves of seawater that follow in the wake of each strike is a hell of a lot harder, and keeping your balance long enough to not get kicked in the head by horses that weren't there five seconds ago isn't easy either.`,
              `Defeat Poseidon with 500k Perception talent: It doesn't take long for you to start noticing how Poseidon works. If he sets up for a big swing while his trident is glowing, he's going to pull out a wave. If he sets up for a thrust, then you can bet on it that a horse is going to somehow pop out of his trident. Tracking his movements, you eventually manage to ride his waves into advantageous positions that let you get some good hits in while his back is turned! The fight ends when you dodge a thrust, using his trident as a springboard to land on the newly formed horse and have it deliver a double-hoof kick to Poseidon's face. The god of seas and horses looks quite grumpy as he wanders back to his seat, giving Artemis an 'all yours' nod while slumping down.`,
              `Challenge Artemis: Artemis is, in a word, beautiful. You really don't get any time to appreciate that, though, as she promptly sends out a whole herd of shimmering deer that charge you horns first. The fight itself is another draining one; when she isn't having all sorts of forest critters gore you, she's keeping her distance and peppering you with more arrows than you think should fit in her quiver.`,
              `Defeat Artemis with 500k Charisma talent: Charming the famously chaste goddess is a non-starter, but you quickly figure out that the shimmering herds she summons at you is really just a single herd getting called and dismissed over and over. Taming the wild animals takes quite a bit of effort, but with every cycle of Artemis summoning them to charge you between volleys of arrows, you get a little further. Soon enough, the herd starts deliberately parting ways to avoiding hitting you and a few of the deer even stop by you for a quick pat, much to Artemis' chagrin. Finally, you convince the largest member of the herd to let you mount them while turning to face Artemis, leaving her to scramble out of the way as her own herd turns against her. You barely get a second to enjoy the look of offence she's giving you before a red blur shoots past your face. "...Dang, was sure that one would hit," you hear Apollo complain as he takes to the field.`,
              `Challenge Apollo: Apollo is- "Yeah yeah, I know I like to talk!" ...a chatterbox, which makes fighting him- "an utter delight, I'm sure. Anyway, before you ask: no, I do not know why I can make these balls, and frankly I don't really care," he explains while- "While making you look like the slow kid at PE," ...by repeatedly hitting you in the face with rough-textured red balls. "Dodge!"`,
              `Defeat Apollo with 500k Intelligence talent: While the balls aren't nearly as painful as the last few gods' weapons, you soon learn that Apollo has a <i>very</i> good throwing arm. "Why thank you! It also helps that I know exactly where to hit you to make it hurt," he helpfully adds while giving you a playful wink. The longer the fight drags on, the more you feel like he's not taking it seriously at all as he effortlessly dodges anything you throw at him while repeatedly throwing balls at you. "That is because I don't!" he shouts while casually tossing a ball up and down, "this is all just a bit of good fun for me!" Thinking about it for a little longer, you drop your weapons and turn your back on Apollo as you sit down. "...Really now?" Apollo groans while lobbing his ball at the back of your head, "That's how you're going to try and beat me? By making this boring? ...Well, can't deny it's working. Spoilsport," he grumbles before taking his ball and presumably going home. Who knew! Sometimes, the only winning move is to not play!`,
              `Avoided lightning bolts: One moment, you're trying to catch your breath after dealing with Apollo. The very next, you're screaming while light, sound and pain fill your senses, and you fall to your knees. Struggling to look up, you see Zeus pull back his arm and prepare another lightning bolt. Time to move!`,
              `Walked through the lightning with 500k Luck talent: Try as you might, there is no rhyme or reason to the pattern of the bolts relentlessly striking down around you. Out of other options, you stand up straight and close your eyes, praying to... well, not the gods this time, that you make it through this time. You can still hear the lightning bolts striking down around you, can still feel the heat against your skin as you keep putting one foot in front of the other, the bolts coming faster with every step. Still, the only thing that stops you from going further is your foot bumping into the dais, the shock making you open your eyes and look up. Zeus is looking back at you, one eyebrow raised, before getting up to face you.`,
              `Challenge Zeus: The King of the Gods looks at you for a moment, a lightning bolt crackling in his hand as he rises from his throne. You have no idea how, but the next moment your face is pressed down against the glowing floor from the sheer pressure Zeus exudes. You grit your teeth until you can feel your molars start to crack as you force yourself to your feet for this final fight.`,
              `Defeat Zeus with 500k Soul talent: In the presence of the gods, mortals bow. Whether they want to or not, the sheer <i>weight</i> of the King of Gods' aura alone will make the strongest knees buckle. You, however, have faced this weight so many times through the loops that, while you can still feel it trying to force you down and prostrate yourself before him, you manage to hold your own. Zeus looks surprised for exactly one moment, and then your fist connects with his cheek. The longer the fight drags on, the less you feel the weight of his aura force you down, and the more Zeus himself seems to struggle to keep standing as the brawl drags out. Finally though, you manage to land a firm blow to the back of Zeus' knee, forcing him down into a kneeling pose. "...Enough," he says while rising to his feet. You brace for him to start using his bolts again, but instead he steps to the side and gives you a nod. The throne of the Gods, for you to claim.`,
            ],
          },
          restoreTime: {
            name: `Restore Time`,
            tooltip: `
              You've done it. With the power of the gods, you can undo this looping nonsense and fix time.
              Requires the powers of the gods.
            `,
            stories: [
              `Do it. As you claim the powers of the gods and settle down on the throne, there is one moment of perfect stillness as the weight of your adventure finally settles down on you. You have seen more, done more in one day than most people do in a lifetime by a wide margin, but now it is over. Reaching out, you... no, I see the world through new eyes, and my hand gently reaches for the fraying thread of time, worn down by the many times my return to the start severed its many strands. Carefully, I weave my newfound power around one severed strand, making it grow into a full timeline in its own right, one in which I got into some trouble for running around Beginnersville looking for locks to pick. In another, I make friends with the Witch of the Forest Path. Yet another, I become a famous crafter, settling down in Merchanton after winning a large Architecture competition. Ages pass as I work, weaving the once single thread of fate into a richly coloured tapestry. And while fate has changed, time as a whole is whole, once more.`,
            ],
          },
        },
        journeys: {},
      },
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
    showStories: 'Show stories',
    undoLastAction: 'Undo last action',
  },
  statistics: {
    sections: {
      resources: {
        sections: {
          consumables: {
            title: 'Consumable',
            description: 'Temporary resources that can be used to execute actions.',
          },
          tools: {
            title: 'Tools',
            description: 'Permanent items that can be used to help you on the way.',
          },
        },
        title: 'Resources',
        description: 'Your resources.',
      },
      attributes: {
        title: 'Attributes',

        description: `
          Each stat level reduces the relevant part of an action's mana cost by a percentage. Talent exp gain is equal to 1%
          of stat exp gain, and persists through loops. Talent multiplies xp gain by (1+(talentLevel)^0.4/3). XP gain
          towards a stat per action is (original mana / actual mana) * (talent bonus) per tick. Total Mult is the product of
          your talent and soulstone bonuses. e.g. Meet People costs 800 mana and has a breakdown of
          Int 10% Cha 80% Soul 10%. This effectively means 80 of the mana is controlled by Int, another 80 by Soul, and the remaining 640 by Cha. If your Cha
          is level 20 when the action is started, the bonus would be x1.2 so it'd be 640 / 1.2 = 533.33 Adding back the 160
          from Soul and Int, the total mana the action takes (rounded up) is now 694, so ~87% of the original mana
          cost. The action would give (800/694)*(1+(talent)^0.4/3) level exp per mana for the 694 mana.
        `,
      },
      skills: {
        title: 'Skills',
      },
      buffs: {
        title: 'Buffs',
      },
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
        description:
          "Various old rings, bracelets, amulets, and pendants. They look like they're worth a pretty penny.",
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
    },
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
    skills: {
      soloCombat: {
        name: 'Self combat',
        description:
          'Self Combat = (Combat skill + Pyromancy skill * 5) * (1 + (armor + 3 * enchanted armor) * Crafting Guild Multiplier / 5)',
      },
      teamCombat: {
        name: 'Team combat',
        description:
          'Team Combat = Self Combat + (Combat Skill + Restoration skill * 4) * (Team Members / 2) * Adventure Guild Multiplier * Leadership Bonus + Dark Magic Skill * Zombies / 2 * Dark Ritual / 100.',
      },
      combat: {
        name: 'Combat',
        description: 'Fight for your lives.',
      },
      magic: {
        name: 'Magic',
        description: 'Control the aether to cast and conjure.',
      },
      practical: {
        name: 'Practical Magic',
        description: 'Mage Hand, Prestidigitation, Detect Magic, and other useful tricks to help out.',
        explaination:
          'Smash Pots and Wild Mana costs are reduced to the original / (1 + level / 100) (rounded up). The following actions get 1% more gold per level in their level range (rounded down). 1-200 Pick Locks 101-300 Short Quests 201-400 Long Quests Currently multiplying costs by {{bonus}}x.',
      },
      alchemy: {
        name: 'Alchemy',
        description: "Brewing potions is hard work! It's a good thing you found a teacher.",
        explaination:
          'The Magic teacher in Beginnersville adores alchemists. +1% Magic exp gain from the Mage Lessons action (rounded down) per level.',
      },
      dark: {
        name: 'Dark Magic',
        description: 'Use various dark arts to help you harvest mana.',
        explaination:
          'Multiply the mana gain from Smash Pots and Wild Mana by (1 + level / 60) ^ 0.25 (rounded down). Currently granting {{bonus}}x mana gains.',
      },
      crafting: {
        name: 'Crafting',
        description: 'The skill of using your hands and creativity when doing physical work.',
      },
      chronomancy: {
        name: 'Chronomancy',
        description: 'Harness the magic of time to, well, speed up time.',
        explaination:
          'Actions in all zones are (1 + level / 60) ^ 0.25 times faster. Currently granting {{bonus}}x speed.',
      },
      pyromancy: {
        name: 'Pyromancy',
        description: 'Fireball, Fire Bolt, Fire Shield, Burning Rays, just a veritable assortment of flaming fun!',
        explaination: 'Increases self combat with 5x the efficiency of the combat skill.',
      },
      restoration: {
        name: 'Restoration',
        description: "From healing cantrips to mass resurrection, you'll be sure to make good use of these spells.",
        explaination:
          'Increases team combat with 4x the efficiency of the combat skill and improves the Heal the Sick action.',
      },
      spatiomancy: {
        name: 'Spatiomancy',
        description: 'Who knew bending reality to your will could be so useful!',
        explaination: `
            Mana Geyser and Mana Well are reduced to the original / (1 + level / 100).
            Houses to build increased by 1% per level from 1 - 500.
            The following actions are increased by 0.5% per level in their level range.
            101-300 Locked houses
            201-400 Short quests to finish
            301-500 Long quests to finish
            401-600 Animals in the forest
            501-700 Herbs to gather
            601-800 Possible suckers
            701-900 Soulstones to mine
            801-1000 Artifacts to take
            901-1100 People to ask for donations
            1001-1200 Buildings to check for pylons
            1101-1300 Pockets to pick
            1201-1400 Warehouses to rob
            1301-1500 Insurance companies to defraud
            Currently multiplying costs by {{bonus}}x.
        `,
      },
      mercantilism: {
        name: 'Mercantilism',
        description: 'Smooth talk your way to better rates with the mana merchants.',
        explaination:
          'Multiply the mana gain from Buy Mana by (1 + level / 60) ^ 0.25 (rounded down). Currently granting {{bonus}}x mana gains.',
      },
      divine: {
        name: 'Divine Favor',
        description: 'The gods have answered your prayers and given you their blessing.',
        explaination:
          'Increases soulstones gained from actions by (1 + level / 60) ^ 0.25. Currently granting {{bonus}}x soulstone gains.',
      },
      commune: {
        name: 'Communion',
        description: 'Your blood sacrifices to dark beings makes it easier to communicate with them.',
        explaination:
          'Dark Ritual soulstone costs are reduced to the original / (1 + level / 100). Currently multiplying costs by {{bonus}}x.',
      },
      wunderkind: {
        name: 'Wunderkind',
        description: 'Even with your eyes closed, you still see the glow of the totem.',
        explaination:
          'Doubles the initial stat gain of Imbue Body Talent exp gain is increased by (1 + level / 60) ^ 0.25. Currently granting {{bonus}}x talent exp.',
      },
      gluttony: {
        name: 'Gluttony',
        description: 'The insatiable hunger of the jungle has started to rub off on you.',
        explaination:
          'Great Feast soulstone costs are reduced to the original / (1 + level / 100). Currently multiplying costs by {{bonus}}x.',
      },
      thievery: {
        name: 'Thievery',
        description: "Allows you to redistribute wealth. Other people's wealth.",
        explaination:
          'Increases gold gain from Pick Locks, Gamble, and Thieving Guild actions by (1 + level / 60) ^ 0.25. Currently granting {{bonus}}x increased gold.',
      },
      leadership: {
        name: 'Leadership',
        description: "You're ready to start your own cult!",
        explaination:
          "Increases the number of followers you can recruit by 1 for every 100 levels. Increases your followers' contributions to team combat by (1 + level / 60) ^ 0.25. Currently granting {{bonus}}x increased follower strength.",
      },
      assassination: {
        name: 'Assassination',
        description: 'Nothing is true. Everything is permitted.',
        explaination:
          'Increases progress of assassination actions, reduces the reputation penalty of assassination, and reduces the difficulty scaling of trials by original / (1 + level / 2000). Currently multiplying trial difficulty by {{bonus}}x.',
      },
    },
    buffs: {
      ritual: {
        name: 'Dark Ritual',
        description: 'The witch appreciates your dedication to the dark arts.',
        explaination: `
          +1% to Dark Magic exp gain from the Dark Magic action (rounded down) per ritual.
          Actions are: 
          10% faster in Beginnersville per ritual from 1-20
          5% faster in the Forest Path per ritual from 21-40
          2.5% faster in Merchanton per ritual from 41-60
          1.5% faster in Mt. Olympus per ritual from 61-80
          1.0% faster in Valhalla per ritual from 81-100
          0.5% faster in Startington per ritual from 101-150
          0.5% faster in Jungle Path per ritual from 151-200
          0.5% faster in Commerceville per ritual from 201-250
          0.5% faster in Valley of Olympus per ritual from 251-300
          0.1% faster globally per ritual from 301-666
        `,
      },
      mindImbuement: {
        name: 'Imbue Mind',
        description: 'Using power from soulstones, you can increase your mental prowess.',
        explaination: 'Increases the max amount of times you can do each stat training action by 1 per level.',
      },
      bodyImbuement: {
        name: 'Imbue Body',
        description: 'By sacrificing your accumulated talent, you can permanently improve yourself.',
        explaination: 'At the start of a new loop, all stats begin at Imbue Body level.',
      },
      greatFeast: {
        name: 'Great Feast',
        description:
          "That feast was so filling that it manages to keep you well satiated through your loops! That's some impressive magic.",
        explaination: 'Combat (from all sources) is increased by 5% per level.',
      },
      aspirant: {
        name: 'Aspirant',
        description: 'Reaching new heights in the spire fills your mind and soul with vigor and clarity.',
        explaination: 'Talent exp gain is increased by 1% per level.',
      },
      heroism: {
        name: 'Heroism',
        description: 'Completing the Trial fills you with determination.',
        explaination: 'Combat, Pyromancy, and Restoration Skill Exp gain increased by 2% per level.',
      },
      soulImbuement: {
        name: 'Imbue Soul',
        description: '(Incomplete) Sacrifice everything for the ultimate power.',
        explaination:
          'Increases the exp multiplier of training actions by 100% and raises all action speeds by 50% per level.',
      },
      prestigePhysical: {
        name: 'Prestige - Physical',
        description: 'Increases Experience gain of all Physical stats (Dex, Str, Con, Spd, Per) by 20% per level.',
        explaination: 'Currently granting {{skillBonusPrestigePhysical}}x increased experience gain.',
      },
      prestigeMental: {
        name: 'Prestige - Mental',
        description: 'Increases Experience gain of all Mental stats (Cha, Int, Soul, Luck) by 20% per level.',
        explaination: 'Currently granting {{skillBonusPrestigeMental}}x increased experience gain.',
      },
      prestigeCombat: {
        name: 'Prestige - Combat',
        description: 'Increases Self and Team Combat by 20% per level.',
        explaination: 'Currently granting {{skillBonusPrestigeCombat}}x increased combat.',
      },
      prestigeSpatiomancy: {
        name: 'Prestige - Spatiomancy',
        description: 'Increases the number of "Findables" per zone by 10% per level.',
      },
      prestigeChronomancy: {
        name: 'Prestige - Chronomancy',
        description: 'Increases speed of all zones by a multiplier of 5% per level.',
      },
      prestigeBartering: {
        name: 'Prestige - Bartering',
        description: 'Increases received from merchants by 10% per level.',
      },
      prestigeExpOverflow: {
        name: 'Prestige - Experience Overflow',
        description: 'Gives (1.00222^n-1) times the normal amount of experience as extra, given to each stat.',
      },
    },
    total: {
      singular: 'Total',
      plural: 'Totals',
      description: 'It all adds up.',
    },
    tooltips: {
      notRestarting: 'Does not reset on loop restart',
      combat: 'Combat',
      level: 'Level',
      levelExperience: 'Level Exp',
      experience: 'Exp',
      talent: 'Talent',
      talentExperience: 'Talent Exp',
      talentMultiplier: 'Talent Mult',
      soulstone: 'Soulstones',
      soulstoneMultiplier: 'Soulstone Mult',
      totalMultiplier: 'Total Mult',
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
  actionLog: {
    title: 'Action Log',
    messages: {
      latest: 'End of log',
    },
    templates: {
      buff: '{header}: You gain the {buff} buff! {buff_cost}',
      buffMulti: '{header}: Your {buff} buff increases to level {toLevel}. {buff_cost}',
      buffFromZero: '{header}: You gain the {buff} buff! {buff_cost}',
      buffFromZeroMulti: '{header}: You gain the {buff} buff and it increases to level {toLevel}! {buff_cost}',
      buffCostSoulstoneSingle: 'You sacrificed {count} soulstones of {stat_long}.',
      buffCostSoulstone: 'You sacrificed {count} soulstones: {stats}',
      buffCostTalent: 'You sacrificed {count} levels of talent: {stats}',
      buffCostSoulImbuement: 'You sacrificed... everything.',
    },
    actions: {
      loadPrevious: 'Load previous entries...',
    },
  },
  actionList: {
    tooltips: {
      actionExplaination: `
        Mana cost is based on ratio of stat %s.
        Gained exp is proportional too.
        Stat/Talent exp is gained every tick.
        Skill exp is gained upon action completion unless otherwise specified.
        Actions will target unchecked objects before known lootable objects.
      `,
      actionOptions: 'Action options',
      actionStories: 'Action stories',
      addAtCap: 'Add action at cap',
    },
    actions: {
      clearAll: 'Clear list',
      clearDisabled: 'Clear disabled',
    },
  },
} as const;
