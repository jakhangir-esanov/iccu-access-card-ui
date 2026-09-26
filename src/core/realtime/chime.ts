const CHIME_NOTES_HZ = [880, 1318.5] as const;
const NOTE_SECONDS = 0.18;
const PEAK_GAIN = 0.2;
const SILENT_GAIN = 0.0001;

let audioContext: AudioContext | null = null;

function scheduleNote(context: AudioContext, frequency: number, startAt: number): void {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(PEAK_GAIN, startAt);
  gain.gain.exponentialRampToValueAtTime(SILENT_GAIN, startAt + NOTE_SECONDS);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + NOTE_SECONDS);
}

export async function playChime(): Promise<boolean> {
  try {
    audioContext ??= new AudioContext();
    await audioContext.resume();
    const context = audioContext;
    CHIME_NOTES_HZ.forEach((frequency, index) => {
      scheduleNote(context, frequency, context.currentTime + index * NOTE_SECONDS);
    });
    return true;
  } catch {
    return false;
  }
}
