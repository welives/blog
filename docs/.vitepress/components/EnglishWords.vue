<template>
  <div flex="~ gap-1 wrap" class="mt-2" @click="playSound">
    <Tooltip v-for="(item, index) in words" :key="index" placement="top">
      <button class="text-sm word select-none" :data-word="item.name">
        {{ item.name }}
      </button>
      <template #title>
        <div v-if="item.ukphone"><span>英式音标：</span>/<span class="mx-1 text-violet">{{ item.ukphone }}</span>/</div>
        <div v-if="item.usphone"><span>美式音标：</span>/<span class="mx-1 text-violet">{{ item.usphone }}</span>/</div>
        <div border="0 b zinc dashed" class="my-1" v-if="item.ukphone || item.usphone"></div>
        <div v-for="trans in item.trans" :key="trans">{{ trans }}</div>
      </template>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useThrottleFn } from '@vueuse/core'
import { Tooltip } from 'ant-design-vue'
import { usePronunciation } from '../hooks'
interface Word {
  chapter: string
  name: string
  trans: string[]
  usphone?: string
  ukphone?: string
}
interface Props {
  words: Word[]
}

defineOptions({
  name: 'EnglishWords',
})
const THROTTLE_TIME = 200
const { words = [] } = defineProps<Props>()
const clickWord = ref('')
const { play, stop, isPlaying } = usePronunciation(clickWord)

const playSound = useThrottleFn((event: Event) => {
  const target = event.target as HTMLElement
  if (target && target.nodeName === 'BUTTON' && target.dataset.word) {
    clickWord.value = target.dataset.word
    if (isPlaying.value) {
      stop()
      nextTick(play)
    } else {
      nextTick(play)
    }
  }
}, THROTTLE_TIME)
</script>

<style scoped>
.word {
  --uno: 'px-2 py-1 rounded border border-dashed border-violet text-violet-5 cursor-pointer transition-all hover:(bg-violet-4 bg-opacity-20 border-transparent) disabled:(cursor-default bg-gray-600 opacity-50)'
}
</style>
