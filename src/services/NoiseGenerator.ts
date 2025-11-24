import type { NoiseType } from '../types';

/**
 * NoiseGenerator - Generates various types of colored noise
 */
export class NoiseGenerator {
  private audioContext: AudioContext;
  private sampleRate: number;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.sampleRate = audioContext.sampleRate;
  }

  /**
   * Create a buffer filled with noise of the specified type
   */
  createNoiseBuffer(noiseType: NoiseType, duration: number = 2): AudioBuffer {
    const bufferLength = this.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferLength, this.sampleRate);
    const data = buffer.getChannelData(0);

    switch (noiseType) {
      case 'white':
        this.generateWhiteNoise(data);
        break;
      case 'pink':
        this.generatePinkNoise(data);
        break;
      case 'brown':
        this.generateBrownNoise(data);
        break;
      case 'blue':
        this.generateBlueNoise(data);
        break;
      case 'violet':
        this.generateVioletNoise(data);
        break;
      case 'grey':
        this.generateGreyNoise(data);
        break;
    }

    return buffer;
  }

  /**
   * White Noise - Equal energy at all frequencies
   */
  private generateWhiteNoise(data: Float32Array): void {
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }

  /**
   * Pink Noise - 1/f noise (equal energy per octave)
   */
  private generatePinkNoise(data: Float32Array): void {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;

      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;

      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
  }

  /**
   * Brown Noise (Brownian Noise) - 1/f² noise (random walk)
   */
  private generateBrownNoise(data: Float32Array): void {
    let lastOut = 0;

    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Amplify
    }
  }

  /**
   * Blue Noise - f noise (high frequency emphasis)
   */
  private generateBlueNoise(data: Float32Array): void {
    let lastOut = 0;

    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = white - lastOut;
      lastOut = white;
    }
  }

  /**
   * Violet Noise - f² noise (even more high frequency emphasis)
   */
  private generateVioletNoise(data: Float32Array): void {
    let last1 = 0;
    let last2 = 0;

    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (white - 2 * last1 + last2) / 4;
      last2 = last1;
      last1 = white;
    }
  }

  /**
   * Grey Noise - Psychoacoustic equal loudness curve
   * (simplified version weighted towards mid frequencies)
   */
  private generateGreyNoise(data: Float32Array): void {
    // Generate white noise first
    const whiteNoise = new Float32Array(data.length);
    this.generateWhiteNoise(whiteNoise);

    // Apply simple equal-loudness curve weighting
    // This is a simplified version - a full implementation would use FFT
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0;

    for (let i = 0; i < data.length; i++) {
      const white = whiteNoise[i];

      // Mid-frequency boost (simplified A-weighting inspired)
      b0 = 0.99 * b0 + white * 0.121;
      b1 = 0.96 * b1 + white * 0.234;
      b2 = 0.92 * b2 + white * 0.345;
      b3 = 0.88 * b3 + white * 0.289;

      data[i] = (b0 + b1 + b2 + b3) * 0.25;
    }
  }
}
