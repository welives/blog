<template>
  <div flex="~ col">
    <Image v-if="src" :src="withBase(src)" :height="200" class="object-cover" />
    <div border="0 b-1 zinc dashed" class="flex justify-end items-center pb-2 my-2">
      <span class="mr-2 text-xs text-zinc">是否显示中文翻译</span>
      <Switch v-model:checked="showTrans" checked-children="显" class="focus:outline-none"></Switch>
    </div>
    <Space direction="vertical" :size="4" @click="playSound" flex="~ col">
      <template v-for="(item, index) in list" :key="index">
        <div>
          <TypographyText v-if="item.speaker" min-w-10 max-w-fit class="py-1"
            :class="{ 'text-blue-5': isPlaying && item.text === text && index === textIndex }">
            {{ item.speaker }}：
          </TypographyText>
          <TypographyText type="secondary" class="typography select-none" :data-index="index" :data-text="item.text">
            {{ item.text }}
          </TypographyText>
        </div>
        <Transition name="fade">
          <div v-if="showTrans" class="pointer-events-none">
            <span v-if="item.speaker" min-w-10 max-w-fit class="truncate select-none invisible">
              {{ item.speaker }}：
            </span>
            <span class="px-1 text-xs text-zinc">
              {{ item.trans }}
            </span>
          </div>
        </Transition>
      </template>
    </Space>
  </div>
</template>

<script setup lang="ts">
import { withBase } from 'vitepress'
import { ref, nextTick } from 'vue'
import { useThrottleFn } from '@vueuse/core'
import { Image, Switch, Space, TypographyText } from 'ant-design-vue'
import { usePronunciation } from '../hooks'
interface Text {
  chapter: string
  speaker?: string
  text: string
  trans: string
}

defineOptions({
  name: 'NceTexts',
})
const THROTTLE_TIME = 200
const { list, src } = defineProps({
  list: {
    default: (): Text[] => []
  },
  src: {
    default: ''
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
  --uno: 'p-1 rounded text-blue-5 cursor-pointer transition-all hover:(bg-blue-4 bg-opacity-20)'
}
</style>
