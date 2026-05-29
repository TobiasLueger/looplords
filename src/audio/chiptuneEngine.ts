import looplordMp3 from '../../assets/audio/looplord.mp3';

export type SfxType = 'chip' | 'kill' | 'coin';

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
  G5: 783.99,
  Bb5: 932.33,
  D6: 1174.66,
};

const MUSIC_CROSSFADE_SEC = 2.5;
const MUSIC_SCHEDULE_LOOKAHEAD_SEC = 20;

class ChiptuneEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicBuffer: AudioBuffer | null = null;
  private musicLoading: Promise<void> | null = null;
  private musicPlaying = false;
  private musicScheduledUntil = 0;
  private musicScheduleTimer: ReturnType<typeof setTimeout> | null = null;
  private musicSources: AudioBufferSourceNode[] = [];
  private musicEnabled = true;
  private musicVolume = 0.7;
  private pendingMusic = false;
  private sfxEnabled = true;
  private audioUnlocked = false;
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
      this.applyMusicGain();
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
      await this.ensureMusicBuffer();
      if (this.musicEnabled && this.pendingMusic) {
        this.startMusic();
      }
    }
  }

  startMusic(): void {
    this.pendingMusic = true;
    if (!this.ctx || !this.musicEnabled) return;

    void this.ensureMusicBuffer().then(() => {
      if (!this.ctx || !this.musicBuffer || !this.musicEnabled) return;
      if (this.musicPlaying) return;

      this.musicPlaying = true;
      this.musicScheduledUntil = 0;
      this.ensureMusicScheduled();
    });
  }

  stopMusic(): void {
    this.pendingMusic = false;
    this.musicPlaying = false;
    this.musicScheduledUntil = 0;

    if (this.musicScheduleTimer) {
      clearTimeout(this.musicScheduleTimer);
      this.musicScheduleTimer = null;
    }

    for (const source of this.musicSources) {
      try {
        source.stop();
      } catch {
        /* already stopped */
      }
    }
    this.musicSources = [];
  }

  setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    this.applyMusicGain();
    if (!enabled) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
  }

  setMusicVolume(volumePercent: number): void {
    this.musicVolume = Math.max(0, Math.min(100, volumePercent)) / 100;
    this.applyMusicGain();
  }

  setSfxEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
    if (this.sfxGain) {
      this.sfxGain.gain.value = enabled ? this.sfxVolume : 0;
    }
  }

  playSfx(type: SfxType): void {
    if (!this.sfxEnabled || !this.ctx || !this.sfxGain) return;

    switch (type) {
      case 'chip':
        this.playTone(NOTE.C5, 0.08, 'square', 0.15, this.sfxGain);
        this.playTone(NOTE.G4, 0.1, 'square', 0.1, this.sfxGain, 0.04);
        break;
      case 'kill':
        this.playTone(NOTE.Eb4, 0.12, 'sawtooth', 0.2, this.sfxGain);
        this.playTone(NOTE.C4, 0.15, 'square', 0.18, this.sfxGain, 0.06);
        this.playTone(NOTE.G3, 0.2, 'triangle', 0.12, this.sfxGain, 0.1);
        break;
      case 'coin':
        this.playTone(NOTE.Bb5, 0.05, 'sine', 0.22, this.sfxGain);
        this.playTone(NOTE.G5, 0.07, 'triangle', 0.16, this.sfxGain, 0.03);
        this.playTone(NOTE.D6, 0.04, 'sine', 0.14, this.sfxGain, 0.055);
        break;
    }
  }

  private applyMusicGain(): void {
    if (this.musicGain) {
      this.musicGain.gain.value = this.musicEnabled ? this.musicVolume : 0;
    }
  }

  private async ensureMusicBuffer(): Promise<void> {
    if (this.musicBuffer || !this.ctx) return;
    if (this.musicLoading) {
      await this.musicLoading;
      return;
    }

    this.musicLoading = (async () => {
      const response = await fetch(looplordMp3);
      const arrayBuffer = await response.arrayBuffer();
      this.musicBuffer = await this.ctx!.decodeAudioData(arrayBuffer);
    })();

    try {
      await this.musicLoading;
    } finally {
      this.musicLoading = null;
    }
  }

  private ensureMusicScheduled(): void {
    if (!this.ctx || !this.musicBuffer || !this.musicGain || !this.musicPlaying) return;

    const duration = this.musicBuffer.duration;
    const crossfade = Math.min(MUSIC_CROSSFADE_SEC, duration * 0.2);
    const targetTime = this.ctx.currentTime + MUSIC_SCHEDULE_LOOKAHEAD_SEC;

    while (this.musicScheduledUntil < targetTime) {
      const startTime =
        this.musicScheduledUntil === 0
          ? this.ctx.currentTime + 0.08
          : this.musicScheduledUntil;
      this.scheduleMusicSegment(startTime, crossfade, duration);
      this.musicScheduledUntil = startTime + duration - crossfade;
    }

    if (this.musicScheduleTimer) {
      clearTimeout(this.musicScheduleTimer);
    }
    this.musicScheduleTimer = setTimeout(() => {
      this.ensureMusicScheduled();
    }, (MUSIC_SCHEDULE_LOOKAHEAD_SEC / 2) * 1000);
  }

  private scheduleMusicSegment(
    startTime: number,
    crossfade: number,
    duration: number,
  ): void {
    if (!this.ctx || !this.musicBuffer || !this.musicGain) return;

    const source = this.ctx.createBufferSource();
    source.buffer = this.musicBuffer;
    const gain = this.ctx.createGain();
    source.connect(gain);
    gain.connect(this.musicGain);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(1, startTime + crossfade);
    gain.gain.setValueAtTime(1, startTime + duration - crossfade);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    source.start(startTime);
    source.stop(startTime + duration + 0.05);

    source.onended = () => {
      this.musicSources = this.musicSources.filter((s) => s !== source);
    };

    this.musicSources.push(source);
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
