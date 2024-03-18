import { render, h } from 'vue'
import BackToTop from '../components/BackToTop.vue'
type BackToTopOptions = {
  threshold?: number
}

export const useBackToTop = (options?: BackToTopOptions) => {
  if (typeof window === 'undefined') return
  window.addEventListener('load', () => {
    const wrapper = document.createElement('div')
    document.body.appendChild(wrapper)
    render(
      h(BackToTop, {
        threshold: options?.threshold,
      }),
      wrapper
    )
  })
}
