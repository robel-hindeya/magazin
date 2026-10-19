// Web Audio API Synthesis Engine for Ethiopian Cultural Instruments
// Synthesizes authentic Ethiopian acoustic physics & scales: Tizita, Ambassel, Bati, Eskista

class EthiopianAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentMelodyTimer: NodeJS.Timeout[] = [];
  private onNoteTriggerCallback: ((noteIndex: number) => void) | null = null;

  public getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopCurrentMelody();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setOnNoteTrigger(cb: ((noteIndex: number) => void) | null) {
    this.onNoteTriggerCallback = cb;
  }

  // =========================================================================
  // 1. KRAR (ክራር): Plucked bowl-lyre with parchment body resonance
  // =========================================================================
  public playKrarString(freq: number, duration: number = 1.6) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Plectrum pluck noise transient
      const bufferSize = ctx.sampleRate * 0.025; // 25ms burst
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1800;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);

      // Fundamental plucked string (sine + warm triangle)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'triangle';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(freq, now);
      osc2.frequency.setValueAtTime(freq * 2, now);

      // Body resonator filter (simulates hollow wood bowl covered in taut goatskin)
      const bodyFilter = ctx.createBiquadFilter();
      bodyFilter.type = 'lowpass';
      bodyFilter.frequency.setValueAtTime(1400, now);
      bodyFilter.frequency.exponentialRampToValueAtTime(450, now + duration);

      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();

      gain1.gain.setValueAtTime(0.42, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + duration);

      gain2.gain.setValueAtTime(0.12, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.6);

      osc1.connect(bodyFilter);
      osc2.connect(bodyFilter);
      bodyFilter.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch {
      // Audio permission or browser block
    }
  }

  // =========================================================================
  // 2. MASENQO (ማሲንቆ): Expressive bowed horsehair fiddle with pitch bend
  // =========================================================================
  public playMasenqoNote(freq: number, duration: number = 1.3, glideFromOffset: number = -25) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Rich harmonic horsehair tone
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';

      // Azmari vocal glide (glides into the true note)
      osc.frequency.setValueAtTime(freq + glideFromOffset, now);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.12);

      // Diamond parchment formant filter (gives that distinct rustic acoustic buzz)
      const formant1 = ctx.createBiquadFilter();
      formant1.type = 'bandpass';
      formant1.frequency.value = 880;
      formant1.Q.value = 3.2;

      const formant2 = ctx.createBiquadFilter();
      formant2.type = 'lowpass';
      formant2.frequency.value = 1600;

      // Vibrato LFO (starts gentle, increases)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 5.6; // 5.6 Hz Azmari vibrato
      lfoGain.gain.setValueAtTime(0.0, now);
      lfoGain.gain.linearRampToValueAtTime(freq * 0.02, now + 0.3); // 2% pitch wobble
      lfo.connect(osc.frequency);

      // Bow stroke envelope
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.32, now + 0.08); // bow attack
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(formant1);
      formant1.connect(formant2);
      formant2.connect(gain);
      gain.connect(ctx.destination);

      lfo.start(now);
      osc.start(now);
      lfo.stop(now + duration);
      osc.stop(now + duration);
    } catch {
      // Audio permission or browser block
    }
  }

  // =========================================================================
  // 3. KEBERO (ከበሮ): Double-headed conical drum (Bass Boom + Snappy Rim)
  // =========================================================================
  public playKeberoDrum(type: 'bass' | 'rim' | 'slap') {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      if (type === 'bass') {
        // Deep Wanza wood bass head (Abiye Af): 120Hz -> 52Hz dive
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(125, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.22);

        // Sub harmonic rumble
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(75, now);
        subOsc.frequency.exponentialRampToValueAtTime(42, now + 0.35);

        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

        subGain.gain.setValueAtTime(0.5, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        osc.connect(gain);
        subOsc.connect(subGain);
        gain.connect(ctx.destination);
        subGain.connect(ctx.destination);

        osc.start(now);
        subOsc.start(now);
        osc.stop(now + 0.6);
        subOsc.stop(now + 0.7);
      } else if (type === 'rim') {
        // High snappy rim head (Neus Af): Crisp 360Hz punch
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);

        // Skin slap noise
        const bufferSize = ctx.sampleRate * 0.04;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = 1400;
        const noiseGain = ctx.createGain();

        noiseGain.gain.setValueAtTime(0.35, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        gain.gain.setValueAtTime(0.55, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        osc.connect(gain);
        gain.connect(ctx.destination);

        noise.start(now);
        osc.start(now);
        osc.stop(now + 0.2);
      } else {
        // Mid slap / Muffled tap (Tek)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);
        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch {
      // Audio permission or browser block
    }
  }

  // =========================================================================
  // 4. WASHINT (ዋሽንት): Breathy bamboo flute with warm vibrato
  // =========================================================================
  public playWashintFlute(freq: number, duration: number = 1.4) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Pure bamboo tone (sine)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // Warm octave harmonic
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);

      // Breathy flute wind noise
      const bufferSize = ctx.sampleRate * Math.min(duration, 0.4);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.15;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = freq * 1.5;
      noiseFilter.Q.value = 4.0;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.linearRampToValueAtTime(0.001, now + duration * 0.5);

      // Flute vibrato LFO
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 5.2; // 5.2 Hz pastoral vibrato
      lfoGain.gain.setValueAtTime(0, now);
      lfoGain.gain.linearRampToValueAtTime(freq * 0.018, now + 0.25);
      lfo.connect(osc1.frequency);

      // Breath swell envelope
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.35, now + 0.09); // breath swell
      gain1.gain.exponentialRampToValueAtTime(0.001, now + duration);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.linearRampToValueAtTime(0.08, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.8);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      osc1.connect(gain1);
      osc2.connect(gain2);
      gain1.connect(ctx.destination);
      gain2.connect(ctx.destination);

      lfo.start(now);
      noise.start(now);
      osc1.start(now);
      osc2.start(now);
      lfo.stop(now + duration);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch {
      // Audio permission or browser block
    }
  }

  // =========================================================================
  // 5. BEGENA (በገና): Deep buzzing 10-string box lyre (Harp of David)
  // =========================================================================
  public playBegenaString(freq: number, duration: number = 2.0) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Deep string fundamental
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Acoustic Buzz Generator (Enqw - leather piece on bridge buzzes at 2x & 3x)
      const buzzOsc = ctx.createOscillator();
      buzzOsc.type = 'sawtooth';
      buzzOsc.frequency.setValueAtTime(freq * 2.01, now);

      const buzzFilter = ctx.createBiquadFilter();
      buzzFilter.type = 'bandpass';
      buzzFilter.frequency.value = 620;
      buzzFilter.Q.value = 2.5;

      const mainGain = ctx.createGain();
      const buzzGain = ctx.createGain();

      mainGain.gain.setValueAtTime(0.55, now);
      mainGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // The signature buzz swells slightly after pluck, then fades
      buzzGain.gain.setValueAtTime(0.08, now);
      buzzGain.gain.linearRampToValueAtTime(0.22, now + 0.15);
      buzzGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.8);

      osc.connect(mainGain);
      buzzOsc.connect(buzzFilter);
      buzzFilter.connect(buzzGain);

      mainGain.connect(ctx.destination);
      buzzGain.connect(ctx.destination);

      osc.start(now);
      buzzOsc.start(now);
      osc.stop(now + duration);
      buzzOsc.stop(now + duration);
    } catch {
      // Audio permission or browser block
    }
  }

  // =========================================================================
  // 6. TSENATSIL (ጽናጽል): Metallic sistrum rattle & disc chimes
  // =========================================================================
  public playTsenatsilShake(intensity: number = 1.0) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Cluster of metallic inharmonic bells (simulates sliding brass discs)
      const metallicFrequencies = [2900, 4200, 5600, 7800, 9500];
      metallicFrequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq + (Math.random() * 80 - 40), now);

        const dur = 0.18 + idx * 0.04;
        gain.gain.setValueAtTime(0.08 * intensity, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + dur);
      });

      // Shaker rattle noise burst
      const bufferSize = ctx.sampleRate * 0.12;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 4500;
      const noiseGain = ctx.createGain();

      noiseGain.gain.setValueAtTime(0.25 * intensity, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);
    } catch {
      // Audio permission or browser block
    }
  }

  // =========================================================================
  // 7. EMBILTA (እምቢልታ): Royal ceremonial bamboo horn call
  // =========================================================================
  public playEmbiltaHorn(freq: number, duration: number = 0.9) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      // Horn formant filter
      const hornFilter = ctx.createBiquadFilter();
      hornFilter.type = 'bandpass';
      hornFilter.frequency.value = freq * 1.8;
      hornFilter.Q.value = 2.8;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.06); // horn crescendo
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(hornFilter);
      hornFilter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio permission or browser block
    }
  }

  // =========================================================================
  // STOP CURRENT PLAYING MELODY
  // =========================================================================
  public stopCurrentMelody() {
    this.currentMelodyTimer.forEach((timer) => clearTimeout(timer));
    this.currentMelodyTimer = [];
    if (this.onNoteTriggerCallback) {
      this.onNoteTriggerCallback(-1);
    }
  }

  // =========================================================================
  // SIGNATURE ETHIOPIAN MELODIES & RHYTHMS (Plays authentic musical phrases)
  // =========================================================================
  public playSignatureMelody(instrumentId: string, onFinish?: () => void) {
    this.stopCurrentMelody();
    if (this.isMuted) return;

    const schedule = (fn: () => void, delayMs: number) => {
      const timer = setTimeout(fn, delayMs);
      this.currentMelodyTimer.push(timer);
    };

    if (instrumentId === 'krar') {
      // Traditional Ethiopian Tizita Scale Ballad
      // Notes: C4 (0), D4 (1), E4 (2), G4 (3), A4 (4), C5 (5)
      const sequence = [
        { noteIdx: 0, freq: 261.63, delay: 0 },
        { noteIdx: 2, freq: 329.63, delay: 320 },
        { noteIdx: 3, freq: 392.0, delay: 640 },
        { noteIdx: 4, freq: 440.0, delay: 960 },
        { noteIdx: 5, freq: 523.25, delay: 1320 },
        { noteIdx: 4, freq: 440.0, delay: 1680 },
        { noteIdx: 3, freq: 392.0, delay: 2000 },
        { noteIdx: 2, freq: 329.63, delay: 2320 },
        { noteIdx: 1, freq: 293.66, delay: 2640 },
        { noteIdx: 0, freq: 261.63, delay: 3000 },
      ];

      sequence.forEach((item) => {
        schedule(() => {
          this.playKrarString(item.freq, 1.4);
          if (this.onNoteTriggerCallback) this.onNoteTriggerCallback(item.noteIdx);
        }, item.delay);
      });

      schedule(() => {
        if (this.onNoteTriggerCallback) this.onNoteTriggerCallback(-1);
        if (onFinish) onFinish();
      }, 3800);
    } else if (instrumentId === 'masenqo') {
      // Azmari folk bowed improvisation (Ambassel mode)
      const sequence = [
        { noteIdx: 0, freq: 293.66, glide: -15, delay: 0 },
        { noteIdx: 1, freq: 349.23, glide: -20, delay: 420 },
        { noteIdx: 2, freq: 392.0, glide: -25, delay: 840 },
        { noteIdx: 3, freq: 440.0, glide: -30, delay: 1300 },
        { noteIdx: 4, freq: 523.25, glide: -40, delay: 1800 },
        { noteIdx: 3, freq: 440.0, glide: 25, delay: 2260 },
        { noteIdx: 2, freq: 392.0, glide: 20, delay: 2680 },
        { noteIdx: 0, freq: 293.66, glide: 15, delay: 3100 },
      ];

      sequence.forEach((item) => {
        schedule(() => {
          this.playMasenqoNote(item.freq, 1.2, item.glide);
          if (this.onNoteTriggerCallback) this.onNoteTriggerCallback(item.noteIdx);
        }, item.delay);
      });

      schedule(() => {
        if (this.onNoteTriggerCallback) this.onNoteTriggerCallback(-1);
        if (onFinish) onFinish();
      }, 3900);
    } else if (instrumentId === 'kebero') {
      // Electrifying Eskista Polyrhythm Beat
      // Pattern: DUM (bass) ... tak-tak ... DUM ... tak
      const sequence: { type: 'bass' | 'rim' | 'slap'; noteIdx: number; delay: number }[] = [
        { type: 'bass', noteIdx: 0, delay: 0 },
        { type: 'slap', noteIdx: 2, delay: 260 },
        { type: 'rim', noteIdx: 3, delay: 450 },
        { type: 'rim', noteIdx: 3, delay: 650 },
        { type: 'bass', noteIdx: 1, delay: 900 },
        { type: 'rim', noteIdx: 3, delay: 1160 },
        { type: 'slap', noteIdx: 2, delay: 1380 },
        { type: 'bass', noteIdx: 0, delay: 1620 },
        { type: 'rim', noteIdx: 4, delay: 1880 },
        { type: 'rim', noteIdx: 3, delay: 2100 },
        { type: 'bass', noteIdx: 1, delay: 2360 },
        { type: 'bass', noteIdx: 0, delay: 2700 },
      ];

      sequence.forEach((item) => {
        schedule(() => {
          this.playKeberoDrum(item.type);
          if (this.onNoteTriggerCallback) this.onNoteTriggerCallback(item.noteIdx);
        }, item.delay);
      });

      schedule(() => {
        if (this.onNoteTriggerCallback) this.onNoteTriggerCallback(-1);
        if (onFinish) onFinish();
      }, 3400);
    } else if (instrumentId === 'washint') {
      // Mountain Shepherd pastoral melody
      const sequence = [
        { noteIdx: 0, freq: 329.63, delay: 0 },
        { noteIdx: 1, freq: 392.0, delay: 400 },
        { noteIdx: 2, freq: 440.0, delay: 820 },
        { noteIdx: 3, freq: 493.88, delay: 1250 },
        { noteIdx: 4, freq: 587.33, delay: 1700 },
        { noteIdx: 5, freq: 659.25, delay: 2150 },
        { noteIdx: 3, freq: 493.88, delay: 2600 },
        { noteIdx: 1, freq: 392.0, delay: 3050 },
        { noteIdx: 0, freq: 329.63, delay: 3500 },
      ];

      sequence.forEach((item) => {
        schedule(() => {
          this.playWashintFlute(item.freq, 1.3);
          if (this.onNoteTriggerCallback) this.onNoteTriggerCallback(item.noteIdx);
        }, item.delay);
      });

      schedule(() => {
        if (this.onNoteTriggerCallback) this.onNoteTriggerCallback(-1);
        if (onFinish) onFinish();
      }, 4300);
    } else if (instrumentId === 'begena') {
      // Sacred buzzing 10-string Begena chant
      const sequence = [
        { noteIdx: 0, freq: 87.31, delay: 0 },
        { noteIdx: 3, freq: 130.81, delay: 550 },
        { noteIdx: 4, freq: 146.83, delay: 1100 },
        { noteIdx: 5, freq: 174.61, delay: 1680 },
        { noteIdx: 3, freq: 130.81, delay: 2260 },
        { noteIdx: 2, freq: 110.0, delay: 2840 },
        { noteIdx: 0, freq: 87.31, delay: 3450 },
      ];

      sequence.forEach((item) => {
        schedule(() => {
          this.playBegenaString(item.freq, 2.0);
          if (this.onNoteTriggerCallback) this.onNoteTriggerCallback(item.noteIdx);
        }, item.delay);
      });

      schedule(() => {
        if (this.onNoteTriggerCallback) this.onNoteTriggerCallback(-1);
        if (onFinish) onFinish();
      }, 4400);
    } else if (instrumentId === 'tsenatsil') {
      // Ceremonial 3-shake sistrum cadence
      const shakes = [
        { noteIdx: 0, intensity: 0.6, delay: 0 },
        { noteIdx: 1, intensity: 0.8, delay: 300 },
        { noteIdx: 2, intensity: 1.0, delay: 600 },
        { noteIdx: 3, intensity: 1.2, delay: 950 },
        { noteIdx: 1, intensity: 0.7, delay: 1350 },
        { noteIdx: 2, intensity: 0.9, delay: 1650 },
        { noteIdx: 3, intensity: 1.3, delay: 2000 },
      ];

      shakes.forEach((s) => {
        schedule(() => {
          this.playTsenatsilShake(s.intensity);
          if (this.onNoteTriggerCallback) this.onNoteTriggerCallback(s.noteIdx);
        }, s.delay);
      });

      schedule(() => {
        if (this.onNoteTriggerCallback) this.onNoteTriggerCallback(-1);
        if (onFinish) onFinish();
      }, 2600);
    } else if (instrumentId === 'embilta') {
      // Imperial royal bamboo horn fanfare
      const sequence = [
        { noteIdx: 2, freq: 165.0, delay: 0 },
        { noteIdx: 1, freq: 247.5, delay: 420 },
        { noteIdx: 0, freq: 330.0, delay: 840 },
        { noteIdx: 3, freq: 495.0, delay: 1300 },
        { noteIdx: 0, freq: 330.0, delay: 1750 },
        { noteIdx: 1, freq: 247.5, delay: 2180 },
        { noteIdx: 2, freq: 165.0, delay: 2600 },
      ];

      sequence.forEach((item) => {
        schedule(() => {
          this.playEmbiltaHorn(item.freq, 0.85);
          if (this.onNoteTriggerCallback) this.onNoteTriggerCallback(item.noteIdx);
        }, item.delay);
      });

      schedule(() => {
        if (this.onNoteTriggerCallback) this.onNoteTriggerCallback(-1);
        if (onFinish) onFinish();
      }, 3300);
    }
  }
}

export const ethiopianAudio = new EthiopianAudioEngine();
