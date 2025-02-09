import { vals } from '../../original/saving.ts';
import { view } from '../../views/main.view.ts';

export const Towns = () => (
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
      <div id='actionOptionsTown1' class='actionOptions'></div>
      <div id='actionOptionsTown2' class='actionOptions'></div>
      <div id='actionOptionsTown3' class='actionOptions'></div>
      <div id='actionOptionsTown4' class='actionOptions'></div>
      <div id='actionOptionsTown5' class='actionOptions'></div>
      <div id='actionOptionsTown6' class='actionOptions'></div>
      <div id='actionOptionsTown7' class='actionOptions'></div>
      <div id='actionOptionsTown8' class='actionOptions'></div>
      <div id='actionStoriesTown0' class='actionStories'></div>
      <div id='actionStoriesTown1' class='actionStories'></div>
      <div id='actionStoriesTown2' class='actionStories'></div>
      <div id='actionStoriesTown3' class='actionStories'></div>
      <div id='actionStoriesTown4' class='actionStories'></div>
      <div id='actionStoriesTown5' class='actionStories'></div>
      <div id='actionStoriesTown6' class='actionStories'></div>
      <div id='actionStoriesTown7' class='actionStories'></div>
      <div id='actionStoriesTown8' class='actionStories'></div>
      <div id='addActionAtCapText' class='localized' data-locale='actions>tooltip>add_at_cap'></div>
    </div>
  </div>
);
