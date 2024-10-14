<template>
  <div flex="~ col">
    <Space direction="vertical" :size="4" border="0 t-1 b-1 zinc dashed" class="my-2">
      <div class="pt-6px">课文理解</div>
      <Collapse v-model:active-key="activeKey" ghost expandIconPosition="end">
        <CollapsePanel v-for="(item, index) in questions" :key="item.id">
          <template #header>
            <div class="typography inline-flex select-none">
              <span>{{ index + 1 }}.</span>
              <span class="mx-2">{{ item.question }}</span>
              <span class="i-f7:speaker-2 shrink-0 self-center" @click.stop="playSound(item.question)"></span>
            </div>
          </template>
          <RadioGroup v-model:value="answerList[index].id" :disabled="isSubmit">
            <Radio v-for="(option, idx) in item.options" :key="option.id" :value="option.id" class="flex mb-1">
              {{ alpha[idx] }}：{{ option.title }}
              <span class="ml-2 text-xs text-green" v-if="isCorrect(index, idx)">✔正确</span>
              <span class="ml-2 text-xs text-violet"
                v-else-if="isSubmit && answerList[index].correctId === option.id">👈正确答案是这个</span>
              <span class="ml-2 text-xs text-red-6" v-if="isWrong(index, idx)">❌错啦</span>
            </Radio>
          </RadioGroup>
        </CollapsePanel>
      </Collapse>
    </Space>
    <div flex="~ justify-center gap-2">
      <Button type="primary" @click="submit" :disabled="isSubmit">提交</Button>
      <Button type="dashed" danger @click="reset">重做</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useThrottleFn } from '@vueuse/core'
import { Button, Space, Collapse, CollapsePanel, Radio, RadioGroup, message } from 'ant-design-vue'
import { nanoid } from 'nanoid'
import { usePronunciation } from '../hooks'
import { shuffle } from '../utils'

interface Questions {
  id?: string
  chapter: string
  question: string
  options: { id: number, title: string, correct?: boolean }[]
}

interface AnswerItem {
  correctId: number // 答案id
  id: number  // 作答id
}

defineOptions({
  name: 'NceComprehension',
})
const { list } = defineProps({
  list: {
    default: (): Questions[] => []
  }
})

const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const THROTTLE_TIME = 200
const questions = ref<Questions[]>([])
const answerList = ref<AnswerItem[]>([])

questions.value = list.map((e => ({ ...e, id: nanoid(5) })))
questions.value.forEach(el => {
  el.options = shuffle(el.options)
})
answerList.value = questions.value.map(q => ({ id: 0, correctId: q.options.filter(e => e.correct === true)[0]?.id }))

const activeKey = ref<string[]>([])
const isSubmit = ref(false)
const text = ref('')
const { play, stop, isPlaying } = usePronunciation(text)


function isCorrect(qIdx: number, aIdx: number) {
  const option = questions.value[qIdx].options[aIdx]
  const answer = answerList.value[qIdx]
  return isSubmit.value && answer.id === answer.correctId && answer.id === option.id
}
function isWrong(qIdx: number, aIdx: number) {
  const option = questions.value[qIdx].options[aIdx]
  const answer = answerList.value[qIdx]
  return isSubmit.value && answer.id !== answer.correctId && answer.id === option.id
}
function submit() {
  if (answerList.value.filter(e => e.id === 0).length) {
    message.error('请先完成本小结课程的所有题目再进行提交')
    return
  }
  activeKey.value = questions.value.map((q) => q.id!)
  isSubmit.value = true
}
function reset() {
  questions.value.forEach(el => {
    el.options = shuffle(el.options)
  })
  activeKey.value = []
  isSubmit.value = false
  answerList.value = questions.value.map(q => ({ id: 0, correctId: q.options.filter(e => e.correct)[0].id }))
}
const playSound = useThrottleFn((question: string) => {
  text.value = question
  if (isPlaying.value) {
    stop()
    nextTick(play)
  } else {
    nextTick(play)
  }
}, THROTTLE_TIME)
</script>

<style scoped>
.typography {
  --uno: 'px-1 rounded text-red-6 cursor-pointer transition-all hover:(bg-red-4 bg-opacity-20)'
}

:deep(.ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box) {
  padding-block: 0;
}

:deep(.ant-collapse-item > .ant-collapse-header) {
  padding-block: 6px;
  padding-inline-start: 0;
}
</style>
