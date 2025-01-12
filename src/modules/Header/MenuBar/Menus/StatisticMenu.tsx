import { createStore } from 'solid-js/store';
import { formatNumber } from '../../../../helpers.ts';
import { vals } from '../../../../saving.ts';
import { formatTime } from '../../../../views/main.view.ts';

export const StatisticMenu = () => {
  // document.getElementById('totalPlaytime').textContent = `${formatTime(vals.totals.time)}`;
  // document.getElementById('totalEffectiveTime').textContent = `${formatTime(vals.totals.effectiveTime)}`;
  // document.getElementById('borrowedTimeBalance').textContent = formatTime(vals.totals.borrowedTime);
  // document.getElementById('borrowedTimeDays').textContent = `${formatNumber(Math.floor(vals.totals.borrowedTime / 86400))}${Localization.txt('time_controls>days')}`;
  // document.getElementById('totalLoops').textContent = `${formatNumber(vals.totals.loops)}`;
  // document.getElementById('totalActions').textContent = `${formatNumber(vals.totals.actions)}`;

  const [store, setStore] = createStore({
    time: vals.totals.time,
    effectiveTime: vals.totals.effectiveTime,
    borrowedTime: vals.totals.borrowedTime,
    loops: vals.totals.loops,
    actions: vals.totals.actions,
  });

  setInterval(() => {
    setStore('time', vals.totals.time);
    setStore('effectiveTime', vals.totals.effectiveTime);
    setStore('borrowedTime', vals.totals.borrowedTime);
    setStore('loops', vals.totals.loops);
    setStore('actions', vals.totals.actions);
  }, 1000);

  return (
    <li class='showthatH'>
      Totals
      <div class='visible-on-hover'>
        <div class='grid grid-cols-[1fr_auto] gap-2'>
          <span>Time borrowed:</span>
          <span id='borrowedTimeBalance'>
            {formatTime(store.borrowedTime)}
          </span>
          <span>Effective Time:</span>
          <span id='totalEffectiveTime'>
            {formatTime(store.effectiveTime)}
          </span>
          <span>Running Time:</span>
          <span id='totalPlaytime'>
            {formatTime(store.time)}
          </span>
          <span>Loops:</span>
          <span id='totalLoops'>
            {formatNumber(store.loops)}
          </span>
          <span>Actions:</span>
          <span id='totalActions'>
            {formatNumber(store.actions)}
          </span>
        </div>
      </div>
    </li>
  );
};
