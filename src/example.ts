import Azusa from './azusa';

import testSound from "./static/cha.mp3";
import bgImg from "./static/9s.jpg";

/**
 * 出于对webkit 音频播放的新政的考虑，建议将初始化放在用户的第一次交互内
 * 当然，如果你保证初始化前用户已经与当前页面充分交互过，那随意
 */

const container = document.getElementById('bg')
container && (container.style.backgroundImage = `url('${bgImg}')`)

container && container.addEventListener('touchstart', () => {
  const azusa = new Azusa({
    view: document.getElementById('app') as HTMLCanvasElement,
    subdivisionSize: 1024,
    cutEnd: 256,
    music: {
      src: testSound,
    }
  });

  const audioElement = azusa.getAudioElement()
  audioElement && checkAudioProgress(audioElement)
  audioElement && audioElement.play().then(function () {
    container.addEventListener('click', () => {
      audioElement && (audioElement.paused ? audioElement.play() : audioElement.pause())
    })
  })

  container.addEventListener('click', () => {
    audioElement && (audioElement.paused ? audioElement.play() : audioElement.pause())
  })
}, {once: true})

function checkAudioProgress (element: HTMLMediaElement) {
  if (!!element.buffered) {
    var halfAlert = false
    var allAlert = false
    const checkAudio = () => {
      if (element.buffered.length > 0.5 && !halfAlert) {
        alert('halfed')
        halfAlert = true
      } else if (element.buffered.length === 1 && !allAlert) {
        alert('all')
        allAlert = true
        return
      }
      requestAnimationFrame(function () {
        checkAudio()
      })
    }
    requestAnimationFrame(function () {
      checkAudio()
    })
  }
}
