import { vals } from '../../../original/saving.ts';
import { createIntervalSignal } from '../../../signals/createInterval.ts';

export const TimeBar = () => {
  const [progress] = createIntervalSignal(0, () => (100 - (vals.timer / vals.timeNeeded) * 100));

  return (
    <div class='relative w-full h-5 bg-blue-100'>
      <div class='h-5 bg-blue-700 m-auto' style={{ width: `${progress()}%` }} />
      <div
        class='absolute text-sm inset-x-0 bottom-0 text-center font-bold mix-blend-difference text-white'
        id='timer'
      >
      </div>
    </div>
  );
};
