import Azusa from './azusa';

import testSound from "./static/cha.mp3";
import bgImg from "./static/9s.jpg";

/**
 * 出于对webkit 音频播放的新政的考虑，建议将初始化放在用户的第一次交互内
 * 当然，如果你保证初始化前用户已经与当前页面充分交互过，那随意
 */

const container = document.getElementById('bg')
container && (container.style.backgroundImage = `url('${bgImg}')`)

container && container.addEventListener('click', () => {

  const audioElement: HTMLAudioElement = (document.getElementById('__AzusaAudio') as HTMLAudioElement) || document.createElement('audio')
  audioElement.id = '__AzusaAudio'
  audioElement.src = testSound
  audioElement.style.display = 'none'
  !document.getElementById('__AzusaAudio') && document.body.appendChild(audioElement)

  new Azusa({
    view: document.getElementById('app') as HTMLCanvasElement,
    subdivisionSize: 1024,
    cutEnd: 256,
    music: {
      src: audioElement,
    }
  });

  audioElement && audioElement.play().then(function () {
    container.addEventListener('click', () => {
      audioElement && (audioElement.paused ? audioElement.play() : audioElement.pause())
    })
  })

  container.addEventListener('click', () => {
    audioElement && (audioElement.paused ? audioElement.play() : audioElement.pause())
  })
}, {once: true})
