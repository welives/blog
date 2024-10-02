import { Howl } from 'howler'
import { ref, unref, watch, onMounted } from 'vue'
import type { ComposableOptions, HowlStatic, MaybeRef, PlayFunction, PlayOptions, ReturnedValue } from './types'

/**
 * @vueuse/sound 的沙雕作者太久不合PR修bug, 于是乎我把hooks的核心代码复制下来修复自用了
 *
 * @param url
 * @param param1
 * @returns
 */
export function useSound(
  url: MaybeRef<string>,
  {
    volume = 1,
    playbackRate = 1,
    soundEnabled = true,
    interrupt = false,
    autoplay = false,
    onload,
    ...delegated
  }: ComposableOptions = {}
) {
  const HowlConstructor = ref<HowlStatic | null>(null)
  const isPlaying = ref<boolean>(false)
  const duration = ref<number | null>(null)
  const sound = ref<Howl | null>(null)

  onMounted(async () => {
    const howler = (await import('howler')).Howl

    HowlConstructor.value = howler

    // 修复了原先 @vueuse/sound 会加载空字符串资源的bug
    unref(url) && setupSound()
  })

  watch(
    () => unref(url),
    () => {
      unref(url) && setupSound()
    }
  )

  watch(
    () => [unref(volume), unref(playbackRate)],
    () => {
      if (sound.value) {
        sound.value.volume(unref(volume) as number)
        sound.value.rate(unref(playbackRate) as number)
      }
    }
  )

  const play: PlayFunction = (options?: PlayOptions) => {
    if (typeof options === 'undefined') {
      options = {}
    }

    if (!sound.value || (!soundEnabled && !options.forceSoundEnabled)) {
      return
    }

    if (interrupt) {
      sound.value.stop()
    }

    if (options.playbackRate) {
      sound.value.rate(options.playbackRate)
    }

    sound.value.play(options.id)

    sound.value.once('end', () => {
      if (sound.value && sound.value && !sound.value.playing()) {
        isPlaying.value = false
      }
    })

    isPlaying.value = true
  }

  const stop = (id?: number) => {
    if (!sound.value) {
      return
    }

    sound.value.stop(typeof id === 'number' ? id : undefined)

    isPlaying.value = false
  }

  const pause = (id?: number) => {
    if (!sound.value) {
      return
    }

    sound.value.pause(typeof id === 'number' ? id : undefined)

    isPlaying.value = false
  }

  const returnedValue: ReturnedValue = {
    play,
    sound,
    isPlaying,
    duration,
    pause,
    stop,
  }

  function handleLoad() {
    // @ts-expect-error - ?
    if (typeof onload === 'function') onload.call(this as any)
    // 修复了原先 @vueuse/sound 的时长会反复累计相乘的bug
    duration.value = (sound.value?.duration() || 0) * 1000

    if (autoplay === true) {
      isPlaying.value = true
    }
  }

  /**
   * 初始化音频, 优化了原先 @vueuse/sound 里面相同的代码块
   */
  function setupSound() {
    sound.value = HowlConstructor.value
      ? new HowlConstructor.value({
        src: unref(url) as string,
        volume: unref(volume) as number,
        rate: unref(playbackRate) as number,
        onload: handleLoad,
        ...delegated,
      })
      : null
  }

  return returnedValue
}
