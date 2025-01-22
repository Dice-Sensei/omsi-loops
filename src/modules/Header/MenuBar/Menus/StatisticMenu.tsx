import { createStore } from 'solid-js/store';
import { formatNumber } from '../../../../original/helpers.ts';
import { vals } from '../../../../original/saving.ts';
import { formatTime } from '../../../../views/main.view.ts';
import { createInterval } from '../../../../signals/createInterval.ts';
import { Popover } from '../../../../components/containers/Overlay/primitives/Popover.tsx';
import { Button } from '../../../../components/buttons/Button/Button.tsx';

export const StatisticMenu = () => {
  const [store, setStore] = createStore({
    time: vals.totals.time,
    effectiveTime: vals.totals.effectiveTime,
    borrowedTime: vals.totals.borrowedTime,
    loops: vals.totals.loops,
    actions: vals.totals.actions,
  });

  createInterval(() => {
    setStore({
      time: vals.totals.time,
      effectiveTime: vals.totals.effectiveTime,
      borrowedTime: vals.totals.borrowedTime,
      loops: vals.totals.loops,
      actions: vals.totals.actions,
    });
  }, 1000);

  return (
    <Popover>
      <Popover.Target>
        <Button variant='text'>Totals</Button>
      </Popover.Target>
      <Popover.Content>
        <div class='grid grid-cols-[auto_1fr] gap-2'>
          <span class='font-medium'>Time borrowed:</span>
          <span>
            {formatTime(store.borrowedTime)}
          </span>
          <span class='font-medium'>Effective Time:</span>
          <span>
            {formatTime(store.effectiveTime)}
          </span>
          <span class='font-medium'>Running Time:</span>
          <span>
            {formatTime(store.time)}
          </span>
          <span class='font-medium'>Loops:</span>
          <span>
            {formatNumber(store.loops)}
          </span>
          <span class='font-medium'>Actions:</span>
          <span>
            {formatNumber(store.actions)}
          </span>
        </div>
      </Popover.Content>
    </Popover>
  );
};
