import { unref, computed } from 'vue'
import { SOUND_SETTINGS, PRONUNCIATION_PHONETIC_MAP } from '../constants'
import { useSound } from './sound'
import type { MaybeRef } from './sound/types'
import { generateWordSoundSrc } from '../utils'

/**
 * 单词/文本发音管理
 * @returns
 */
export function usePronunciation(word: MaybeRef<string>, pronounceType: MaybeRef<`${PRONUNCIATION_PHONETIC_MAP}`> = SOUND_SETTINGS.pronounceType, autoplay: MaybeRef<boolean> = false) {
  const soundUrl = computed(() => (unref(word) ? generateWordSoundSrc(unref(word), unref(pronounceType)) : ''))
  const onSound = useSound(soundUrl, {
    html5: true,
    format: 'mp3',
    interrupt: true,
    volume: SOUND_SETTINGS.volume,
    autoplay: unref(autoplay),
    // 在不对原useSound源码做破坏性改动的前提下, 自动播放通过onload来实现
    onload() {
      unref(autoplay) && onSound.play()
    },
  })

  return { ...onSound }
}
