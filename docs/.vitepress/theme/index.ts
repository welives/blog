import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DemoPreview, { useComponents } from '@vitepress-code-preview/container'
import '@vitepress-code-preview/container/dist/style.css'
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'
import { useMediumZoomProvider, useBackToTop } from '../hooks'
import Kbd from '../components/Kbd.vue'
import NceTexts from '../components/NceTexts.vue'
import EnglishWords from '../components/EnglishWords.vue'
import EnglishWord from '../components/EnglishWord.vue'
import ExampleSentence from '../components/ExampleSentence.vue'
import 'ant-design-vue/dist/reset.css'
import 'uno.css'
import './global.css'

export default {
  extends: DefaultTheme,
  enhanceApp(ctx) {
    const { app, router } = ctx
    app.use(FloatingVue)
    useMediumZoomProvider(app, router)
    useComponents(app, DemoPreview)
    useComponents(app, Kbd, 'Kbd')
    useComponents(app, NceTexts, 'NceTexts')
    useComponents(app, EnglishWords, 'EnglishWords')
    useComponents(app, EnglishWord, 'EnglishWord')
    useComponents(app, ExampleSentence, 'ExampleSentence')
    useBackToTop()
  },
} satisfies Theme
