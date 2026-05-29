export type MusicTrack = 'menu' | 'battle';
export type SfxType = 'chip' | 'kill';

const NOTE: Record<string, number> = {
  G2: 98.0,
  Bb2: 116.54,
  C3: 130.81,
  D3: 146.83,
  Eb3: 155.56,
  F3: 174.61,
  G3: 196.0,
  Ab3: 207.65,
  Bb3: 233.08,
  C4: 261.63,
  D4: 293.66,
  Eb4: 311.13,
  F4: 349.23,
  G4: 392.0,
  Ab4: 415.3,
  Bb4: 466.16,
  C5: 523.25,
};

const MENU_BASS = ['C3', 'C3', 'Eb3', 'G3', 'Bb2', 'Bb2', 'C3', 'G3'] as const;
const MENU_ARP = ['C4', 'Eb4', 'G4', 'Bb4', 'C5', 'Bb4', 'G4', 'Eb4'] as const;

const BATTLE_BASS = ['C3', 'G2', 'Bb2', 'C3', 'Eb3', 'Bb2', 'G2', 'C3'] as const;
const BATTLE_MELODY = ['Eb4', 'G4', 'Bb4', 'C5', 'Bb4', 'G4', 'F4', 'Eb4'] as const;

class ChiptuneEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private currentTrack: MusicTrack | null = null;
  private pendingTrack: MusicTrack | null = null;
  private step = 0;
  private musicEnabled = true;
  private sfxEnabled = true;
  private audioUnlocked = false;
  private readonly musicVolume = 0.35;
  private readonly sfxVolume = 0.32;

  isUnlocked(): boolean {
    return this.audioUnlocked;
  }

  async unlock(): Promise<void> {
    const firstUnlock = !this.ctx;
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.9;
      this.masterGain.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicEnabled ? this.musicVolume : 0;
      this.musicGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxEnabled ? this.sfxVolume : 0;
      this.sfxGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    this.audioUnlocked = true;
    if (firstUnlock) {
      this.flushPendingLoop();
    }
  }

  requestLoop(track: MusicTrack): void {
    this.pendingTrack = track;
    if (this.ctx && this.musicEnabled) {
      this.startLoop(track);
    }
  }

  flushPendingLoop(): void {
    if (this.pendingTrack && this.ctx && this.musicEnabled) {
      this.startLoop(this.pendingTrack);
    }
  }

  setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (this.musicGain) {
      this.musicGain.gain.value = enabled ? this.musicVolume : 0;
    }
    if (!enabled) {
      this.stop();
    } else if (this.pendingTrack && this.ctx) {
      this.startLoop(this.pendingTrack);
    }
  }

  setSfxEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
    if (this.sfxGain) {
      this.sfxGain.gain.value = enabled ? this.sfxVolume : 0;
    }
  }

  startLoop(track: MusicTrack): void {
    if (!this.ctx || !this.musicEnabled) return;
    if (this.currentTrack === track && this.intervalId) return;

    this.stop(false);
    this.currentTrack = track;
    this.pendingTrack = track;
    this.step = 0;

    const bpm = track === 'battle' ? 132 : 96;
    const stepMs = (60 / bpm / 2) * 1000;

    this.intervalId = setInterval(() => {
      this.playMusicStep(track);
      this.step += 1;
    }, stepMs);
  }

  stop(clearTrack = true): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (clearTrack) {
      this.currentTrack = null;
    }
  }

  playSfx(type: SfxType): void {
    if (!this.sfxEnabled || !this.ctx || !this.sfxGain) return;

    if (type === 'chip') {
      this.playTone(NOTE.C5, 0.08, 'square', 0.15, this.sfxGain);
      this.playTone(NOTE.G4, 0.1, 'square', 0.1, this.sfxGain, 0.04);
    } else {
      this.playTone(NOTE.Eb4, 0.12, 'sawtooth', 0.2, this.sfxGain);
      this.playTone(NOTE.C4, 0.15, 'square', 0.18, this.sfxGain, 0.06);
      this.playTone(NOTE.G3, 0.2, 'triangle', 0.12, this.sfxGain, 0.1);
    }
  }

  private playMusicStep(track: MusicTrack): void {
    if (!this.ctx || !this.musicGain) return;

    const i = this.step % 8;
    const bassPattern = track === 'battle' ? BATTLE_BASS : MENU_BASS;
    const melodyPattern = track === 'battle' ? BATTLE_MELODY : MENU_ARP;

    const bassNote = NOTE[bassPattern[i]];
    const melodyNote = NOTE[melodyPattern[i]];

    this.playTone(bassNote, 0.18, 'triangle', 0.35, this.musicGain);

    if (this.step % 2 === 0 || track === 'battle') {
      this.playTone(melodyNote, 0.12, 'square', track === 'battle' ? 0.2 : 0.14, this.musicGain, 0.02);
    }

    if (track === 'battle' && i % 2 === 0) {
      this.playTone(NOTE.C3, 0.06, 'square', 0.25, this.musicGain);
    }
  }

  private playTone(
    freq: number,
    durationSec: number,
    wave: OscillatorType,
    volume: number,
    destination: GainNode,
    delay = 0,
  ): void {
    if (!this.ctx) return;

    const t = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = wave;
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(Math.max(volume, 0.0002), t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + durationSec);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(t);
    osc.stop(t + durationSec + 0.02);
  }
}

export const chiptune = new ChiptuneEngine();

export async function unlockGameAudio(): Promise<void> {
  await chiptune.unlock();
}
