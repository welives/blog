<template>
  <div flex="~ col">
    <div border="0 b-1 zinc dashed" class="flex justify-end items-center pb-2 mb-2">
      <span class="mr-2 text-xs text-zinc">是否显示中文翻译</span>
      <Switch v-model:checked="showTrans" checked-children="显" class="focus:outline-none"></Switch>
    </div>
    <Space :direction="direction" :size="4" @click="playSound" v-if="direction === 'vertical'">
      <div v-for="(item, index) in list" :key="index">
        <TypographyText type="secondary" class="typography inline-flex items-center select-none" :data-index="index"
          :data-text="item.text">
          {{ item.text }}
          <span class="i-f7:speaker-2 ml-2 shrink-0"
            :class="isPlaying && item.text === text && index === textIndex ? 'visible' : 'invisible'"></span>
        </TypographyText>
        <Transition name="fade">
          <div class="pointer-events-none px-2 text-xs text-zinc" v-if="showTrans">
            {{ item.trans }}
          </div>
        </Transition>
      </div>
    </Space>
    <div v-else>
      <div v-for="(item, index) in list" :key="index" flex="inline col">
        <TypographyText type="secondary" class="typography select-none" :data-index="index" :data-text="item.text">
          {{ item.text }}
          <span class="i-f7:speaker-2 ml-1" v-if="isPlaying && item.text === text && index === textIndex"></span>
        </TypographyText>
        <Transition name="fade">
          <div class="pointer-events-none px-2 text-xs text-zinc" v-if="showTrans">
            {{ item.trans }}
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useThrottleFn } from '@vueuse/core'
import { Switch, Space, TypographyText } from 'ant-design-vue'
import { usePronunciation } from '../hooks'
interface Text {
  chapter: string
  text: string
  trans: string
}

defineOptions({
  name: 'NceTexts',
})
const THROTTLE_TIME = 200
const { direction, list } = defineProps({
  direction: {
    default: 'vertical' // vertical | horizontal
  },
  list: {
    default: (): Text[] => []
  }
})
const text = ref('')
const textIndex = ref(0)
const showTrans = ref(false)
const { play, stop, isPlaying } = usePronunciation(text)

const playSound = useThrottleFn((event: Event) => {
  const target = event.target as HTMLElement
  if (target && target.dataset.text) {
    textIndex.value = Number(target.dataset.index ?? 0)
    text.value = target.dataset.text
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
.typography {
  --uno: 'px-2 py-1 rounded text-blue-5 cursor-pointer transition-all hover:(bg-blue-4 bg-opacity-20)'
}
</style>
