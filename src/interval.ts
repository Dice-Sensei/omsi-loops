import { Listeners } from './logic/listeners.ts';

interface IntervalMessage {
  start: boolean;
  stop: boolean;
  ms: number;
}

let intervalId: number | null = null;
Listeners.add('message', ({ data: { start, stop, ms } }: MessageEvent<IntervalMessage>) => {
  if (start) {
    intervalId = setInterval(() => {
      postMessage('interval.start');
    }, ms);
  }

  if (stop && intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
});
