import { vals } from '../../../original/saving.ts';
import { createIntervalSignal } from '../../../signals/createInterval.ts';

export const TimeBar = () => {
  const [progress] = createIntervalSignal(0, () => (100 - (vals.timer / vals.timeNeeded) * 100));

  return (
    <div class='w-full h-2 bg-blue-100'>
      <div class='h-2 bg-blue-700 m-auto' style={{ width: `${progress()}%` }} />
    </div>
  );
};
