import * as THREE from 'three';

export interface IAudioOption {
  fftsize?: number
}
export interface loadOption {
  src: HTMLAudioElement
}

export class Audio {
  public listener: THREE.AudioListener;
  public readonly frequencyBinCount: number;

  private sound: THREE.Audio;
  private analyser: THREE.AudioAnalyser;
  constructor(option: IAudioOption = {}) {
    this.listener = new THREE.AudioListener();
    this.sound = new THREE.Audio(this.listener);
    this.analyser = new THREE.AudioAnalyser(this.sound, option.fftsize || 256);
    this.frequencyBinCount = this.analyser.analyser.frequencyBinCount;
  }
  public load (
    option: loadOption
  ) {
    const {
      src,
    } = option

    const audioElement = src

    this.sound.setMediaElementSource(audioElement);
  }
  public getFrequencyData () {
    return this.analyser.getFrequencyData()
  }

}
