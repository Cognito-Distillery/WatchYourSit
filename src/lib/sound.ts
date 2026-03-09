let audioCtx: AudioContext | null = null;
let intervalId: ReturnType<typeof setInterval> | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function beep() {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.value = 520;
  osc.type = "sine";

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
}

export function startAlarm() {
  if (intervalId) return;
  beep();
  intervalId = setInterval(beep, 1000);
}

export function stopAlarm() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
