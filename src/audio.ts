import * as THREE from 'three';

export interface IAudioOption {
  fftsize?: number
}
export interface loadOption {
  src: string
}

export class Audio {
  public listener: THREE.AudioListener;
  public audioElement: HTMLAudioElement|null = null;
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

    const audioElement: HTMLAudioElement = (document.getElementById('__AzusaAudio') as HTMLAudioElement) || document.createElement('audio')
    audioElement.id = '__AzusaAudio'
    audioElement.src = src
    audioElement.style.display = 'none'
    !document.getElementById('__AzusaAudio') && document.body.appendChild(audioElement)

    // const AudioSourceNode = new MediaElementAudioSourceNode(this.sound.context, {
    //   mediaElement: audioElement
    // })
    this.sound.setMediaElementSource(audioElement);
    this.audioElement = audioElement
  }
  public getFrequencyData () {
    return this.analyser.getFrequencyData()
  }

}
