let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (!audioCtx) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function initAudioOnUserGesture() {
  const ctx = getContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume();
  }
  document.removeEventListener("click", initAudioOnUserGesture);
}

export function playNotificationSound() {
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.frequency.value = 880;
  osc1.type = "sine";
  gain1.gain.setValueAtTime(0.4, now);
  gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.15);

  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.frequency.value = 1108.73;
  osc2.type = "sine";
  gain2.gain.setValueAtTime(0.01, now);
  gain2.gain.setValueAtTime(0.4, now + 0.12);
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now + 0.12);
  osc2.stop(now + 0.35);
}

export function playAlertSound() {
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.frequency.value = 660;
  osc1.type = "square";
  gain1.gain.setValueAtTime(0.3, now);
  gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.2);

  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.frequency.value = 440;
  osc2.type = "square";
  gain2.gain.setValueAtTime(0.01, now + 0.15);
  gain2.gain.setValueAtTime(0.3, now + 0.25);
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now + 0.2);
  osc2.stop(now + 0.5);
}
