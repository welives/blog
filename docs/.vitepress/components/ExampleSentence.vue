<template>
  <Tooltip>
    <template #title>
      <slot />
    </template>
    <TypographyText type="danger" class="sentence inline-flex my-0.5" @click="playSound">
      {{ text }}
    </TypographyText>
  </Tooltip>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useThrottleFn } from '@vueuse/core'
import { TypographyText, Tooltip } from 'ant-design-vue'
import { usePronunciation } from '../hooks'

defineOptions({
  name: 'ExampleSentence',
})
const THROTTLE_TIME = 200
const { text } = defineProps({
  text: {
    default: ''
  }
})
const sentence = ref('')
const { play, stop, isPlaying } = usePronunciation(sentence)

const playSound = useThrottleFn(() => {
  sentence.value = text
  if (isPlaying.value) {
    stop()
    nextTick(play)
  } else {
    nextTick(play)
  }
}, THROTTLE_TIME)
</script>

<style scoped>
.sentence {
  --uno: 'px-1 py-0.5 rounded bg-red-6 bg-opacity-10 cursor-pointer transition-all'
}
</style>
