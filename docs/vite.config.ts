import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { viteDemoPreviewPlugin } from '@vitepress-code-preview/plugin'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  optimizeDeps: {
    exclude: [
      'vitepress',
    ],
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
  plugins: [vueJsx(), viteDemoPreviewPlugin(), UnoCSS(), Components({
    resolvers: [AntDesignVueResolver({ importStyle: false })],
    dirs: [
      '.vitepress/components',
    ],
    include: [
      /\.vue$/,
      /\.vue\?vue/,
      /\.md$/,
    ],
  }),],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
})
