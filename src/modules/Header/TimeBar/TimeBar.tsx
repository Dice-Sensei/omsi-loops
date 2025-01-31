import { getActualGameSpeed } from '../../../original/driver.ts';
import { intToString } from '../../../original/helpers.ts';
import { vals } from '../../../original/saving.ts';
import { createIntervalSignal } from '../../../signals/createInterval.ts';
import { formatTime } from '../../../views/main.view.ts';

export const TimeBar = () => {
  const [progress] = createIntervalSignal(0, () => (100 - (vals.timer / vals.timeNeeded) * 100));
  const [timer] = createIntervalSignal('0 | 0s', () =>
    `${
      intToString(
        vals.timeNeeded - vals.timer,
        vals.options.fractionalMana ? 2 : 1,
        true,
      )
    } | ${formatTime((vals.timeNeeded - vals.timer) / 50 / getActualGameSpeed())}`);

  return (
    <div class='relative w-full h-5 bg-blue-100'>
      <div class='h-5 bg-blue-700 m-auto' style={{ width: `${progress()}%` }} />
      <div class='absolute text-sm inset-x-0 bottom-0 text-center font-bold mix-blend-difference text-white'>
        {timer()}
      </div>
    </div>
  );
};
