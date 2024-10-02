<template>
  <kbd @click="playSound" class="word inline-flex">{{ word }}</kbd>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useThrottleFn } from '@vueuse/core'
import { usePronunciation } from '../hooks'

defineOptions({
  name: 'EnglishWord',
})
const THROTTLE_TIME = 200
const { word } = defineProps({
  word: {
    default: ''
  }
})
const text = ref('')
const { play, stop, isPlaying } = usePronunciation(text)

const playSound = useThrottleFn(() => {
  text.value = word
  if (isPlaying.value) {
    stop()
    nextTick(play)
  } else {
    nextTick(play)
  }
}, THROTTLE_TIME)
</script>

<style scoped>
.word {
  --uno: 'text-xs rounded bg-transparent border border-dashed border-violet text-violet-5 cursor-pointer transition-all hover:(bg-violet-4 bg-opacity-20 border-transparent)'
}
</style>
