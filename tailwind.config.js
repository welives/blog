import { addDynamicIconSelectors } from '@iconify/tailwind'
/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./docs/.vitepress/**/*.{js,ts,vue}', './docs/**/*.md', './docs/**/*.html'],
  plugins: [addDynamicIconSelectors()],
}
export default config
